import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';

@Injectable()
export class ReportsService {
  constructor(private supabase: SupabaseService) {}

  async getMaintenanceCosts(orgId: string, startDate?: string, endDate?: string) {
    let query = this.supabase.admin
      .from('work_orders')
      .select(`
        id, work_order_number, type, status, completed_at,
        total_parts_cost, total_labor_cost, total_other_cost,
        asset:assets(id, asset_number, make, model, year)
      `)
      .eq('org_id', orgId)
      .in('status', ['completed', 'closed']);

    if (startDate) query = query.gte('completed_at', startDate);
    if (endDate) query = query.lte('completed_at', endDate);

    const { data, error } = await query;
    if (error) throw error;

    const totalParts = data?.reduce((s, wo) => s + (wo.total_parts_cost || 0), 0) || 0;
    const totalLabor = data?.reduce((s, wo) => s + (wo.total_labor_cost || 0), 0) || 0;
    const totalOther = data?.reduce((s, wo) => s + (wo.total_other_cost || 0), 0) || 0;

    // Group by asset
    const byAsset: Record<string, { asset: any; totalCost: number; woCount: number }> = {};
    for (const wo of data || []) {
      const key = (wo.asset as any)?.id || 'unknown';
      if (!byAsset[key]) {
        byAsset[key] = { asset: wo.asset, totalCost: 0, woCount: 0 };
      }
      byAsset[key].totalCost += (wo.total_parts_cost || 0) + (wo.total_labor_cost || 0) + (wo.total_other_cost || 0);
      byAsset[key].woCount++;
    }

    return {
      summary: {
        totalParts: Math.round(totalParts * 100) / 100,
        totalLabor: Math.round(totalLabor * 100) / 100,
        totalOther: Math.round(totalOther * 100) / 100,
        grandTotal: Math.round((totalParts + totalLabor + totalOther) * 100) / 100,
        workOrderCount: data?.length || 0,
      },
      byAsset: Object.values(byAsset).sort((a, b) => b.totalCost - a.totalCost),
      workOrders: data,
    };
  }

  async getFuelUsage(orgId: string, startDate?: string, endDate?: string) {
    let query = this.supabase.admin
      .from('fuel_transactions')
      .select(`
        *,
        asset:assets(id, asset_number, make, model, year)
      `)
      .eq('org_id', orgId)
      .order('transaction_date', { ascending: true });

    if (startDate) query = query.gte('transaction_date', startDate);
    if (endDate) query = query.lte('transaction_date', endDate);

    const { data, error } = await query;
    if (error) throw error;

    const totalCost = data?.reduce((s, t) => s + (t.total_cost || 0), 0) || 0;
    const totalGallons = data?.reduce((s, t) => s + (t.quantity_gallons || 0), 0) || 0;
    const mpgValues = data?.filter(t => t.mpg).map(t => t.mpg!) || [];
    const avgMPG = mpgValues.length
      ? Math.round((mpgValues.reduce((a, b) => a + b, 0) / mpgValues.length) * 100) / 100
      : null;

    return {
      summary: {
        totalCost: Math.round(totalCost * 100) / 100,
        totalGallons: Math.round(totalGallons * 100) / 100,
        averageMPG: avgMPG,
        costPerGallon: totalGallons ? Math.round((totalCost / totalGallons) * 1000) / 1000 : null,
        transactionCount: data?.length || 0,
      },
      transactions: data,
    };
  }

  async getAssetUtilization(orgId: string) {
    const { data: assets, error } = await this.supabase.admin
      .from('assets')
      .select('id, asset_number, make, model, year, status, current_odometer')
      .eq('org_id', orgId)
      .neq('status', 'disposed');

    if (error) throw error;

    const statusCounts: Record<string, number> = {};
    for (const asset of assets || []) {
      statusCounts[asset.status] = (statusCounts[asset.status] || 0) + 1;
    }

    const totalAssets = assets?.length || 0;
    const activeAssets = statusCounts['active'] || 0;
    const utilizationRate = totalAssets ? Math.round((activeAssets / totalAssets) * 10000) / 100 : 0;

    return {
      summary: {
        totalAssets,
        activeAssets,
        inShop: statusCounts['in_shop'] || 0,
        outOfService: statusCounts['out_of_service'] || 0,
        reserved: statusCounts['reserved'] || 0,
        surplus: statusCounts['surplus'] || 0,
        utilizationRate,
      },
      assets: assets?.sort((a, b) => (b.current_odometer || 0) - (a.current_odometer || 0)),
    };
  }

  async getInspectionCompliance(orgId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await this.supabase.admin
      .from('inspections')
      .select(`
        id, inspection_type, status, result, created_at,
        asset:assets(id, asset_number),
        inspector:profiles!inspector_id(id, full_name)
      `)
      .eq('org_id', orgId)
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const total = data?.length || 0;
    const passed = data?.filter(i => i.result === 'pass').length || 0;
    const failed = data?.filter(i => i.result === 'fail').length || 0;
    const passWithDefects = data?.filter(i => i.result === 'pass_with_defects').length || 0;

    return {
      summary: {
        totalInspections: total,
        passed,
        failed,
        passWithDefects,
        passRate: total ? Math.round((passed / total) * 10000) / 100 : 0,
        periodDays: days,
      },
      inspections: data,
    };
  }
}
