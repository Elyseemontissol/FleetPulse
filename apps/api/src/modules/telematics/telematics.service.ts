import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';

@Injectable()
export class TelematicsService {
  constructor(private supabase: SupabaseService) {}

  async getAllPositions(orgId: string) {
    const { data, error } = await this.supabase.admin
      .from('asset_positions')
      .select(`
        *,
        asset:assets!inner(id, asset_number, make, model, year, status, assigned_driver_id)
      `)
      .eq('asset.org_id', orgId);

    if (error) throw error;
    return data;
  }

  async ingestEvent(event: {
    deviceId: string;
    eventType: string;
    latitude?: number;
    longitude?: number;
    speedMph?: number;
    heading?: number;
    odometer?: number;
    engineHours?: number;
    fuelLevelPct?: number;
    dtcCodes?: string[];
    rawData?: Record<string, unknown>;
  }) {
    // Find asset by telematics device ID
    const { data: asset } = await this.supabase.admin
      .from('assets')
      .select('id')
      .eq('telematics_device_id', event.deviceId)
      .single();

    if (!asset) return { success: false, reason: 'Unknown device' };

    // Store event
    await this.supabase.admin.from('telematics_events').insert({
      asset_id: asset.id,
      device_id: event.deviceId,
      event_type: event.eventType,
      latitude: event.latitude,
      longitude: event.longitude,
      speed_mph: event.speedMph,
      heading: event.heading,
      odometer: event.odometer,
      engine_hours: event.engineHours,
      fuel_level_pct: event.fuelLevelPct,
      dtc_codes: event.dtcCodes,
      raw_data: event.rawData,
    });

    // Update latest position
    if (event.latitude && event.longitude) {
      await this.supabase.admin.from('asset_positions').upsert({
        asset_id: asset.id,
        latitude: event.latitude,
        longitude: event.longitude,
        speed_mph: event.speedMph || 0,
        heading: event.heading || 0,
        ignition_on: event.eventType === 'ignition_on' ? true :
                     event.eventType === 'ignition_off' ? false : undefined,
        updated_at: new Date().toISOString(),
      });
    }

    // Update asset odometer if provided
    if (event.odometer) {
      const { data: current } = await this.supabase.admin
        .from('assets')
        .select('current_odometer')
        .eq('id', asset.id)
        .single();

      if (current && event.odometer > current.current_odometer) {
        await this.supabase.admin
          .from('assets')
          .update({ current_odometer: event.odometer })
          .eq('id', asset.id);
      }
    }

    return { success: true, assetId: asset.id };
  }

  async getTripHistory(assetId: string, startDate?: string, endDate?: string) {
    let query = this.supabase.admin
      .from('telematics_events')
      .select('*')
      .eq('asset_id', assetId)
      .in('event_type', ['ignition_on', 'ignition_off', 'position'])
      .order('recorded_at', { ascending: true })
      .limit(1000);

    if (startDate) query = query.gte('recorded_at', startDate);
    if (endDate) query = query.lte('recorded_at', endDate);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getAlerts(orgId: string) {
    const { data, error } = await this.supabase.admin
      .from('telematics_events')
      .select(`
        *,
        asset:assets!inner(id, asset_number, make, model, org_id)
      `)
      .eq('asset.org_id', orgId)
      .in('event_type', ['speeding', 'harsh_brake', 'harsh_accel', 'dtc', 'geofence_exit'])
      .order('recorded_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data;
  }
}
