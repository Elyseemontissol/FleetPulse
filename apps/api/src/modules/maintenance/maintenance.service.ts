import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';

interface PMDueResult {
  scheduleId: string;
  scheduleName: string;
  assetId: string;
  assetNumber: string;
  dueReason: 'mileage' | 'time' | 'hours';
  dueValue: string;
  priority: string;
}

@Injectable()
export class MaintenanceService {
  constructor(private supabase: SupabaseService) {}

  async getSchedules(orgId: string) {
    const { data, error } = await this.supabase.admin
      .from('pm_schedules')
      .select('*')
      .eq('org_id', orgId)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data;
  }

  async createSchedule(orgId: string, input: Record<string, unknown>) {
    const { data, error } = await this.supabase.admin
      .from('pm_schedules')
      .insert({ org_id: orgId, ...input })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateSchedule(id: string, input: Record<string, unknown>) {
    const { data, error } = await this.supabase.admin
      .from('pm_schedules')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUpcoming(orgId: string): Promise<PMDueResult[]> {
    const schedules = await this.getSchedules(orgId);

    const { data: assets } = await this.supabase.admin
      .from('assets')
      .select('id, asset_number, asset_type, current_odometer, current_hours, status')
      .eq('org_id', orgId)
      .in('status', ['active', 'in_shop']);

    if (!assets) return [];

    const due: PMDueResult[] = [];

    for (const schedule of schedules || []) {
      const applicableAssets = assets.filter(a => {
        if (schedule.applies_to_assets?.length) {
          return schedule.applies_to_assets.includes(a.id);
        }
        if (schedule.applies_to_types?.length) {
          return schedule.applies_to_types.includes(a.asset_type);
        }
        return true;
      });

      for (const asset of applicableAssets) {
        // Get last completed PM of this type for this asset
        const { data: lastWO } = await this.supabase.admin
          .from('work_orders')
          .select('completed_at, odometer_at_creation')
          .eq('asset_id', asset.id)
          .eq('pm_schedule_id', schedule.id)
          .eq('status', 'closed')
          .order('completed_at', { ascending: false })
          .limit(1)
          .single();

        // Check mileage trigger
        if (schedule.interval_miles) {
          const lastOdo = lastWO?.odometer_at_creation || 0;
          const milesSinceLast = asset.current_odometer - lastOdo;
          if (milesSinceLast >= schedule.interval_miles * 0.9) {
            due.push({
              scheduleId: schedule.id,
              scheduleName: schedule.name,
              assetId: asset.id,
              assetNumber: asset.asset_number,
              dueReason: 'mileage',
              dueValue: `${milesSinceLast}/${schedule.interval_miles} miles`,
              priority: milesSinceLast >= schedule.interval_miles ? 'high' : schedule.priority,
            });
            continue;
          }
        }

        // Check time trigger
        if (schedule.interval_months) {
          const lastDate = lastWO?.completed_at
            ? new Date(lastWO.completed_at)
            : new Date(0);
          const monthsSince = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
          if (monthsSince >= schedule.interval_months * 0.9) {
            due.push({
              scheduleId: schedule.id,
              scheduleName: schedule.name,
              assetId: asset.id,
              assetNumber: asset.asset_number,
              dueReason: 'time',
              dueValue: `${Math.round(monthsSince)}/${schedule.interval_months} months`,
              priority: monthsSince >= schedule.interval_months ? 'high' : schedule.priority,
            });
          }
        }
      }
    }

    return due.sort((a, b) => {
      const pOrder = { critical: 0, high: 1, normal: 2, low: 3 };
      return (pOrder[a.priority as keyof typeof pOrder] || 2) - (pOrder[b.priority as keyof typeof pOrder] || 2);
    });
  }

  async generateWorkOrders(orgId: string) {
    const duePMs = await this.getUpcoming(orgId);
    const overdue = duePMs.filter(pm => pm.priority === 'high' || pm.priority === 'critical');
    const created: string[] = [];

    for (const pm of overdue) {
      // Check if open WO already exists for this PM + asset
      const { data: existing } = await this.supabase.admin
        .from('work_orders')
        .select('id')
        .eq('asset_id', pm.assetId)
        .eq('pm_schedule_id', pm.scheduleId)
        .in('status', ['open', 'assigned', 'in_progress'])
        .limit(1);

      if (existing?.length) continue;

      const { data: woNumber } = await this.supabase.admin
        .rpc('generate_work_order_number', { p_org_id: orgId });

      const { data: wo } = await this.supabase.admin
        .from('work_orders')
        .insert({
          org_id: orgId,
          work_order_number: woNumber,
          asset_id: pm.assetId,
          type: 'preventive',
          pm_schedule_id: pm.scheduleId,
          priority: pm.priority,
          title: `PM: ${pm.scheduleName} - ${pm.assetNumber}`,
          description: `Preventive maintenance due: ${pm.dueValue}`,
          status: 'open',
        })
        .select('id')
        .single();

      if (wo) created.push(wo.id);
    }

    return { generated: created.length, workOrderIds: created };
  }
}
