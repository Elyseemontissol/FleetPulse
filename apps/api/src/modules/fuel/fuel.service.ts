import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';

@Injectable()
export class FuelService {
  constructor(private supabase: SupabaseService) {}

  async findAll(orgId: string, filters?: {
    assetId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;

    let query = this.supabase.admin
      .from('fuel_transactions')
      .select(`
        *,
        asset:assets(id, asset_number, make, model),
        driver:profiles!driver_id(id, full_name)
      `, { count: 'exact' })
      .eq('org_id', orgId)
      .order('transaction_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.assetId) query = query.eq('asset_id', filters.assetId);
    if (filters?.startDate) query = query.gte('transaction_date', filters.startDate);
    if (filters?.endDate) query = query.lte('transaction_date', filters.endDate);

    const { data, error, count } = await query;
    if (error) throw error;

    return { data, total: count, page, limit };
  }

  async create(orgId: string, input: Record<string, unknown>) {
    const record = {
      org_id: orgId,
      asset_id: input.assetId,
      driver_id: input.driverId,
      transaction_date: input.transactionDate,
      fuel_type: input.fuelType,
      quantity_gallons: input.quantityGallons,
      unit_price: input.unitPrice,
      total_cost: input.totalCost,
      odometer_at_fill: input.odometerAtFill,
      station_name: input.stationName,
      station_address: input.stationAddress,
      source: 'manual',
    };

    const { data, error } = await this.supabase.admin
      .from('fuel_transactions')
      .insert(record)
      .select()
      .single();

    if (error) throw error;

    // Calculate MPG if we have previous fill data
    if (input.assetId && input.odometerAtFill) {
      await this.calculateMPG(data.id, input.assetId as string, input.odometerAtFill as number, input.quantityGallons as number);
    }

    // Update asset odometer
    if (input.assetId && input.odometerAtFill) {
      await this.supabase.admin
        .from('assets')
        .update({ current_odometer: input.odometerAtFill })
        .eq('id', input.assetId);

      await this.supabase.admin.from('meter_readings').insert({
        asset_id: input.assetId,
        reading_type: 'odometer',
        value: input.odometerAtFill,
        source: 'fuel_transaction',
      });
    }

    return data;
  }

  private async calculateMPG(transactionId: number, assetId: string, odometer: number, gallons: number) {
    const { data: prevFill } = await this.supabase.admin
      .from('fuel_transactions')
      .select('odometer_at_fill')
      .eq('asset_id', assetId)
      .lt('odometer_at_fill', odometer)
      .order('odometer_at_fill', { ascending: false })
      .limit(1)
      .single();

    if (prevFill?.odometer_at_fill && gallons > 0) {
      const miles = odometer - prevFill.odometer_at_fill;
      const mpg = Math.round((miles / gallons) * 100) / 100;

      if (mpg > 0 && mpg < 100) {
        await this.supabase.admin
          .from('fuel_transactions')
          .update({ mpg })
          .eq('id', transactionId);
      }
    }
  }

  async getSummary(orgId: string, months = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const { data } = await this.supabase.admin
      .from('fuel_transactions')
      .select('total_cost, quantity_gallons, mpg, transaction_date')
      .eq('org_id', orgId)
      .gte('transaction_date', startDate.toISOString());

    const totalCost = data?.reduce((sum, t) => sum + (t.total_cost || 0), 0) || 0;
    const totalGallons = data?.reduce((sum, t) => sum + (t.quantity_gallons || 0), 0) || 0;
    const mpgValues = data?.filter(t => t.mpg).map(t => t.mpg!) || [];
    const avgMPG = mpgValues.length
      ? Math.round((mpgValues.reduce((a, b) => a + b, 0) / mpgValues.length) * 100) / 100
      : null;

    return {
      totalCost: Math.round(totalCost * 100) / 100,
      totalGallons: Math.round(totalGallons * 100) / 100,
      averageMPG: avgMPG,
      transactionCount: data?.length || 0,
      periodMonths: months,
    };
  }
}
