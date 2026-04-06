import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';
import type { CreateWorkOrderInput, UpdateWorkOrderInput, CreateLineItemInput } from '@fleetpulse/shared';

const VALID_TRANSITIONS: Record<string, string[]> = {
  open: ['assigned', 'cancelled'],
  assigned: ['in_progress', 'open', 'cancelled'],
  in_progress: ['on_hold', 'parts_pending', 'completed', 'cancelled'],
  on_hold: ['in_progress', 'cancelled'],
  parts_pending: ['in_progress', 'cancelled'],
  completed: ['closed', 'in_progress'],
  closed: [],
  cancelled: [],
};

@Injectable()
export class WorkOrdersService {
  constructor(private supabase: SupabaseService) {}

  async findAll(orgId: string, filters?: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    assetId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;

    let query = this.supabase.admin
      .from('work_orders')
      .select(`
        *,
        asset:assets(id, asset_number, make, model, year),
        assignee:profiles!assigned_to(id, full_name)
      `, { count: 'exact' })
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.priority) query = query.eq('priority', filters.priority);
    if (filters?.assignedTo) query = query.eq('assigned_to', filters.assignedTo);
    if (filters?.assetId) query = query.eq('asset_id', filters.assetId);

    const { data, error, count } = await query;
    if (error) throw error;

    return { data, total: count, page, limit };
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase.admin
      .from('work_orders')
      .select(`
        *,
        asset:assets(id, asset_number, make, model, year, vin),
        assignee:profiles!assigned_to(id, full_name, email),
        requester:profiles!requested_by(id, full_name),
        lines:work_order_lines(*, technician:profiles!technician_id(id, full_name))
      `)
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Work order not found');
    return data;
  }

  async create(orgId: string, userId: string, input: CreateWorkOrderInput) {
    // Generate work order number
    const { data: woNumber } = await this.supabase.admin
      .rpc('generate_work_order_number', { p_org_id: orgId });

    // Get current asset meters
    const { data: asset } = await this.supabase.admin
      .from('assets')
      .select('current_odometer, current_hours')
      .eq('id', input.assetId)
      .single();

    const { data, error } = await this.supabase.admin
      .from('work_orders')
      .insert({
        org_id: orgId,
        work_order_number: woNumber,
        asset_id: input.assetId,
        type: input.type,
        pm_schedule_id: input.pmScheduleId,
        inspection_id: input.inspectionId,
        priority: input.priority,
        requested_by: userId,
        assigned_to: input.assignedTo,
        title: input.title,
        description: input.description,
        complaint: input.complaint,
        scheduled_date: input.scheduledDate,
        vendor_name: input.vendorName,
        notes: input.notes,
        odometer_at_creation: asset?.current_odometer,
        hours_at_creation: asset?.current_hours,
        status: input.assignedTo ? 'assigned' : 'open',
      })
      .select()
      .single();

    if (error) throw error;

    // Update asset status to in_shop if corrective/emergency
    if (['corrective', 'emergency'].includes(input.type)) {
      await this.supabase.admin
        .from('assets')
        .update({ status: 'in_shop' })
        .eq('id', input.assetId);
    }

    return data;
  }

  async updateStatus(id: string, newStatus: string) {
    const { data: current } = await this.supabase.admin
      .from('work_orders')
      .select('status, asset_id')
      .eq('id', id)
      .single();

    if (!current) throw new NotFoundException('Work order not found');

    const allowed = VALID_TRANSITIONS[current.status];
    if (!allowed?.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from "${current.status}" to "${newStatus}"`,
      );
    }

    const updates: Record<string, unknown> = { status: newStatus };
    if (newStatus === 'in_progress') updates.started_at = new Date().toISOString();
    if (newStatus === 'completed') updates.completed_at = new Date().toISOString();

    const { data, error } = await this.supabase.admin
      .from('work_orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Restore asset status when completed/closed
    if (['completed', 'closed'].includes(newStatus)) {
      await this.supabase.admin
        .from('assets')
        .update({ status: 'active' })
        .eq('id', current.asset_id);
    }

    return data;
  }

  async addLine(workOrderId: string, input: CreateLineItemInput) {
    const { data, error } = await this.supabase.admin
      .from('work_order_lines')
      .insert({
        work_order_id: workOrderId,
        line_type: input.lineType,
        part_number: input.partNumber,
        part_description: input.partDescription,
        quantity: input.quantity,
        unit_cost: input.unitCost,
        technician_id: input.technicianId,
        labor_hours: input.laborHours,
        labor_rate: input.laborRate,
      })
      .select()
      .single();

    if (error) throw error;

    // Recalculate totals
    await this.recalculateTotals(workOrderId);

    return data;
  }

  async removeLine(workOrderId: string, lineId: number) {
    const { error } = await this.supabase.admin
      .from('work_order_lines')
      .delete()
      .eq('id', lineId)
      .eq('work_order_id', workOrderId);

    if (error) throw error;
    await this.recalculateTotals(workOrderId);
    return { success: true };
  }

  private async recalculateTotals(workOrderId: string) {
    const { data: lines } = await this.supabase.admin
      .from('work_order_lines')
      .select('line_type, total_cost')
      .eq('work_order_id', workOrderId);

    const totals = { total_parts_cost: 0, total_labor_cost: 0, total_other_cost: 0 };
    for (const line of lines || []) {
      if (line.line_type === 'part') totals.total_parts_cost += line.total_cost || 0;
      else if (line.line_type === 'labor') totals.total_labor_cost += line.total_cost || 0;
      else totals.total_other_cost += line.total_cost || 0;
    }

    await this.supabase.admin
      .from('work_orders')
      .update(totals)
      .eq('id', workOrderId);
  }

  async getDashboard(orgId: string) {
    const { data: statusCounts } = await this.supabase.admin
      .from('work_orders')
      .select('status')
      .eq('org_id', orgId)
      .in('status', ['open', 'assigned', 'in_progress', 'on_hold', 'parts_pending']);

    const counts: Record<string, number> = {};
    for (const wo of statusCounts || []) {
      counts[wo.status] = (counts[wo.status] || 0) + 1;
    }

    const { data: overdue } = await this.supabase.admin
      .from('work_orders')
      .select('id')
      .eq('org_id', orgId)
      .in('status', ['open', 'assigned', 'in_progress'])
      .lt('scheduled_date', new Date().toISOString().split('T')[0]);

    return {
      statusCounts: counts,
      overdueCount: overdue?.length || 0,
      totalOpen: Object.values(counts).reduce((a, b) => a + b, 0),
    };
  }
}
