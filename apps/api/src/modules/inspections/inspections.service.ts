import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../common/supabase/supabase.service';
import { DVIR_CATEGORIES, type CreateInspectionInput } from '@fleetpulse/shared';

@Injectable()
export class InspectionsService {
  constructor(private supabase: SupabaseService) {}

  async findAll(orgId: string, filters?: {
    assetId?: string;
    inspectorId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;

    let query = this.supabase.admin
      .from('inspections')
      .select(`
        *,
        asset:assets(id, asset_number, make, model, year),
        inspector:profiles!inspector_id(id, full_name)
      `, { count: 'exact' })
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.assetId) query = query.eq('asset_id', filters.assetId);
    if (filters?.inspectorId) query = query.eq('inspector_id', filters.inspectorId);
    if (filters?.status) query = query.eq('status', filters.status);

    const { data, error, count } = await query;
    if (error) throw error;

    return { data, total: count, page, limit };
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase.admin
      .from('inspections')
      .select(`
        *,
        asset:assets(id, asset_number, make, model, year, vin),
        inspector:profiles!inspector_id(id, full_name, email),
        reviewer:profiles!reviewer_id(id, full_name, email),
        items:inspection_items(*),
        photos:inspection_photos(*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Inspection not found');
    return data;
  }

  async create(orgId: string, inspectorId: string, input: CreateInspectionInput) {
    const { data: inspection, error } = await this.supabase.admin
      .from('inspections')
      .insert({
        org_id: orgId,
        asset_id: input.assetId,
        inspection_type: input.inspectionType,
        inspector_id: inspectorId,
        odometer_reading: input.odometerReading,
        hours_reading: input.hoursReading,
        location: input.location,
        notes: input.notes,
        status: 'in_progress',
      })
      .select()
      .single();

    if (error) throw error;

    // Create checklist items from DVIR template
    const items = DVIR_CATEGORIES.map((category, index) => ({
      inspection_id: inspection.id,
      category,
      item_name: `${category} - General Condition`,
      status: 'not_inspected' as const,
      sort_order: index,
    }));

    await this.supabase.admin.from('inspection_items').insert(items);

    // Record odometer reading
    if (input.odometerReading) {
      await this.supabase.admin.from('meter_readings').insert({
        asset_id: input.assetId,
        reading_type: 'odometer',
        value: input.odometerReading,
        source: 'inspection',
        recorded_by: inspectorId,
      });
    }

    return this.findOne(inspection.id);
  }

  async updateItem(inspectionId: string, itemId: number, updates: {
    status: string;
    severity?: string;
    defectDescription?: string;
  }) {
    const { data, error } = await this.supabase.admin
      .from('inspection_items')
      .update({
        status: updates.status,
        severity: updates.severity,
        defect_description: updates.defectDescription,
      })
      .eq('id', itemId)
      .eq('inspection_id', inspectionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async submit(id: string, signature: string) {
    // Determine result based on items
    const { data: items } = await this.supabase.admin
      .from('inspection_items')
      .select('status')
      .eq('inspection_id', id);

    const hasFails = items?.some(i => i.status === 'fail');
    const allPass = items?.every(i => i.status === 'pass' || i.status === 'not_applicable');
    const result = hasFails ? (allPass ? 'fail' : 'pass_with_defects') : 'pass';

    const { data, error } = await this.supabase.admin
      .from('inspections')
      .update({
        status: 'submitted',
        result: hasFails ? 'fail' : 'pass',
        inspector_signature: signature,
        inspector_signed_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Auto-create work orders for critical/major defects
    if (hasFails) {
      const failedItems = items?.filter(i => i.status === 'fail') || [];
      const { data: inspection } = await this.supabase.admin
        .from('inspections')
        .select('org_id, asset_id')
        .eq('id', id)
        .single();

      if (inspection) {
        const { data: woNumber } = await this.supabase.admin
          .rpc('generate_work_order_number', { p_org_id: inspection.org_id });

        await this.supabase.admin.from('work_orders').insert({
          org_id: inspection.org_id,
          work_order_number: woNumber,
          asset_id: inspection.asset_id,
          type: 'inspection_defect',
          inspection_id: id,
          priority: 'high',
          title: `DVIR Defects - ${failedItems.length} item(s) failed`,
          description: `Defects found during inspection. Review inspection ${id} for details.`,
          status: 'open',
        });
      }
    }

    return data;
  }

  async review(id: string, reviewerId: string, signature: string, notes?: string) {
    const { data, error } = await this.supabase.admin
      .from('inspections')
      .update({
        status: 'reviewed',
        reviewer_id: reviewerId,
        reviewer_signature: signature,
        reviewer_signed_at: new Date().toISOString(),
        reviewer_notes: notes,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async addPhoto(inspectionId: string, itemId: number | null, photoUrl: string, caption?: string) {
    const { data, error } = await this.supabase.admin
      .from('inspection_photos')
      .insert({
        inspection_id: inspectionId,
        inspection_item_id: itemId,
        photo_url: photoUrl,
        caption,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
