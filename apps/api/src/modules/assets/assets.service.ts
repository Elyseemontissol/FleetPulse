import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';
import type { CreateAssetInput, UpdateAssetInput } from '@fleetpulse/shared';

@Injectable()
export class AssetsService {
  constructor(private supabase: SupabaseService) {}

  async findAll(orgId: string, filters?: {
    status?: string;
    assetType?: string;
    category?: string;
    department?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;

    let query = this.supabase.admin
      .from('assets')
      .select('*, assigned_driver:profiles!assigned_driver_id(id, full_name)', { count: 'exact' })
      .eq('org_id', orgId)
      .order('asset_number', { ascending: true })
      .range(offset, offset + limit - 1);

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.assetType) query = query.eq('asset_type', filters.assetType);
    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.department) query = query.eq('assigned_department', filters.department);
    if (filters?.search) {
      query = query.or(
        `asset_number.ilike.%${filters.search}%,make.ilike.%${filters.search}%,model.ilike.%${filters.search}%,vin.ilike.%${filters.search}%`,
      );
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return { data, total: count, page, limit };
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase.admin
      .from('assets')
      .select(`
        *,
        assigned_driver:profiles!assigned_driver_id(id, full_name, email, phone),
        position:asset_positions(latitude, longitude, speed_mph, heading, ignition_on, updated_at)
      `)
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Asset not found');
    return data;
  }

  async create(orgId: string, input: CreateAssetInput) {
    const { data, error } = await this.supabase.admin
      .from('assets')
      .insert({
        org_id: orgId,
        asset_number: input.assetNumber,
        asset_type: input.assetType,
        category: input.category,
        status: input.status,
        vin: input.vin,
        license_plate: input.licensePlate,
        registration_expiry: input.registrationExpiry,
        year: input.year,
        make: input.make,
        model: input.model,
        trim: input.trim,
        color: input.color,
        fuel_type: input.fuelType,
        acquisition_date: input.acquisitionDate,
        acquisition_cost: input.acquisitionCost,
        assigned_driver_id: input.assignedDriverId,
        assigned_department: input.assignedDepartment,
        home_location: input.homeLocation,
        current_odometer: input.currentOdometer,
        odometer_unit: input.odometerUnit,
        current_hours: input.currentHours,
        insurance_policy: input.insurancePolicy,
        insurance_expiry: input.insuranceExpiry,
        telematics_device_id: input.telematicsDeviceId,
        telematics_provider: input.telematicsProvider,
        photo_url: input.photoUrl,
        notes: input.notes,
        custom_fields: input.customFields,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, input: UpdateAssetInput) {
    const updateData: Record<string, unknown> = {};
    if (input.assetNumber !== undefined) updateData.asset_number = input.assetNumber;
    if (input.assetType !== undefined) updateData.asset_type = input.assetType;
    if (input.category !== undefined) updateData.category = input.category;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.vin !== undefined) updateData.vin = input.vin;
    if (input.licensePlate !== undefined) updateData.license_plate = input.licensePlate;
    if (input.year !== undefined) updateData.year = input.year;
    if (input.make !== undefined) updateData.make = input.make;
    if (input.model !== undefined) updateData.model = input.model;
    if (input.fuelType !== undefined) updateData.fuel_type = input.fuelType;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.assignedDriverId !== undefined) updateData.assigned_driver_id = input.assignedDriverId;
    if (input.assignedDepartment !== undefined) updateData.assigned_department = input.assignedDepartment;
    if (input.currentOdometer !== undefined) updateData.current_odometer = input.currentOdometer;
    if (input.currentHours !== undefined) updateData.current_hours = input.currentHours;
    if (input.notes !== undefined) updateData.notes = input.notes;

    const { data, error } = await this.supabase.admin
      .from('assets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async recordMeter(assetId: string, type: 'odometer' | 'hours', value: number, userId: string, source = 'manual') {
    const { error: meterError } = await this.supabase.admin
      .from('meter_readings')
      .insert({
        asset_id: assetId,
        reading_type: type,
        value,
        source,
        recorded_by: userId,
      });

    if (meterError) throw meterError;

    const updateField = type === 'odometer' ? 'current_odometer' : 'current_hours';
    await this.supabase.admin
      .from('assets')
      .update({ [updateField]: value })
      .eq('id', assetId);

    return { success: true };
  }

  async getHistory(assetId: string) {
    const { data, error } = await this.supabase.admin
      .from('meter_readings')
      .select('*, recorded_by_profile:profiles!recorded_by(full_name)')
      .eq('asset_id', assetId)
      .order('recorded_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data;
  }
}
