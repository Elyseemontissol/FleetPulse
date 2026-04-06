-- ============================================================
-- FleetPulse Database Schema
-- Migration 001: Initial Schema
-- ============================================================

-- ── Organizations ───────────────────────────────────────────
CREATE TABLE public.organizations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ── User Profiles ───────────────────────────────────────────
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  org_id uuid REFERENCES public.organizations(id) NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'driver'
    CHECK (role IN ('admin','fleet_manager','shop_supervisor',
                    'mechanic','driver','viewer')),
  employee_id text,
  driver_license_number text,
  driver_license_expiry date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_profiles_org ON public.profiles(org_id);
CREATE INDEX idx_profiles_role ON public.profiles(org_id, role);

-- ── Assets (Vehicles + Equipment) ───────────────────────────
CREATE TABLE public.assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid REFERENCES public.organizations(id) NOT NULL,
  asset_number text NOT NULL,
  asset_type text NOT NULL CHECK (asset_type IN (
    'sedan','suv','pickup','van','bus','truck',
    'heavy_truck','trailer','forklift','loader',
    'generator','mower','utility_cart','other'
  )),
  category text NOT NULL CHECK (category IN ('vehicle','equipment')),
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','in_shop','out_of_service',
                      'reserved','surplus','disposed')),
  vin text,
  license_plate text,
  registration_expiry date,
  year integer,
  make text,
  model text,
  trim text,
  color text,
  fuel_type text CHECK (fuel_type IN (
    'gasoline','diesel','electric','hybrid','propane','cng','none'
  )),
  acquisition_date date,
  acquisition_cost numeric(12,2),
  disposal_date date,
  disposal_method text,
  disposal_value numeric(12,2),
  assigned_driver_id uuid REFERENCES public.profiles(id),
  assigned_department text,
  home_location text,
  current_odometer integer DEFAULT 0,
  odometer_unit text DEFAULT 'miles' CHECK (odometer_unit IN ('miles','km')),
  current_hours numeric(10,1) DEFAULT 0,
  insurance_policy text,
  insurance_expiry date,
  telematics_device_id text,
  telematics_provider text,
  photo_url text,
  notes text,
  custom_fields jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(org_id, asset_number)
);

CREATE INDEX idx_assets_org_status ON public.assets(org_id, status);
CREATE INDEX idx_assets_type ON public.assets(asset_type);
CREATE INDEX idx_assets_assigned ON public.assets(assigned_driver_id);

-- ── Meter Readings (Odometer / Hour History) ────────────────
CREATE TABLE public.meter_readings (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  asset_id uuid REFERENCES public.assets(id) ON DELETE CASCADE NOT NULL,
  reading_type text NOT NULL CHECK (reading_type IN ('odometer','hours')),
  value numeric(12,1) NOT NULL,
  source text NOT NULL DEFAULT 'manual'
    CHECK (source IN ('manual','telematics','fuel_transaction','inspection')),
  recorded_by uuid REFERENCES public.profiles(id),
  recorded_at timestamptz DEFAULT now()
);

CREATE INDEX idx_meter_readings_asset ON public.meter_readings(asset_id, recorded_at DESC);

-- ── Preventive Maintenance Schedules ────────────────────────
CREATE TABLE public.pm_schedules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid REFERENCES public.organizations(id) NOT NULL,
  name text NOT NULL,
  description text,
  interval_miles integer,
  interval_hours numeric(10,1),
  interval_days integer,
  interval_months integer,
  applies_to_types text[],
  applies_to_assets uuid[],
  estimated_labor_hours numeric(5,1),
  estimated_cost numeric(10,2),
  task_checklist jsonb,
  parts_needed jsonb,
  priority text DEFAULT 'normal'
    CHECK (priority IN ('low','normal','high','critical')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ── Work Orders ─────────────────────────────────────────────
CREATE TABLE public.work_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid REFERENCES public.organizations(id) NOT NULL,
  work_order_number text NOT NULL,
  asset_id uuid REFERENCES public.assets(id) NOT NULL,
  type text NOT NULL CHECK (type IN (
    'preventive','corrective','inspection_defect','emergency','recall'
  )),
  pm_schedule_id uuid REFERENCES public.pm_schedules(id),
  inspection_id uuid,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','assigned','in_progress','on_hold',
                      'parts_pending','completed','closed','cancelled')),
  priority text DEFAULT 'normal'
    CHECK (priority IN ('low','normal','high','critical')),
  requested_by uuid REFERENCES public.profiles(id),
  assigned_to uuid REFERENCES public.profiles(id),
  title text NOT NULL,
  description text,
  complaint text,
  cause text,
  correction text,
  odometer_at_creation integer,
  hours_at_creation numeric(10,1),
  scheduled_date date,
  started_at timestamptz,
  completed_at timestamptz,
  total_parts_cost numeric(10,2) DEFAULT 0,
  total_labor_cost numeric(10,2) DEFAULT 0,
  total_other_cost numeric(10,2) DEFAULT 0,
  vendor_name text,
  vendor_invoice text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_wo_org_status ON public.work_orders(org_id, status);
CREATE INDEX idx_wo_asset ON public.work_orders(asset_id);
CREATE INDEX idx_wo_assigned ON public.work_orders(assigned_to);
CREATE UNIQUE INDEX idx_wo_number ON public.work_orders(org_id, work_order_number);

-- ── Work Order Line Items ───────────────────────────────────
CREATE TABLE public.work_order_lines (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  work_order_id uuid REFERENCES public.work_orders(id) ON DELETE CASCADE NOT NULL,
  line_type text NOT NULL CHECK (line_type IN ('part','labor','other')),
  part_number text,
  part_description text,
  quantity numeric(10,2) DEFAULT 1,
  unit_cost numeric(10,2) DEFAULT 0,
  total_cost numeric(10,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
  technician_id uuid REFERENCES public.profiles(id),
  labor_hours numeric(5,1),
  labor_rate numeric(8,2),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_wo_lines_wo ON public.work_order_lines(work_order_id);

-- ── Inspections (DVIR) ──────────────────────────────────────
CREATE TABLE public.inspections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid REFERENCES public.organizations(id) NOT NULL,
  asset_id uuid REFERENCES public.assets(id) NOT NULL,
  inspection_type text NOT NULL CHECK (inspection_type IN (
    'pre_trip','post_trip','annual','dot','monthly','ad_hoc'
  )),
  status text NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress','submitted','reviewed',
                      'defects_resolved','closed')),
  result text CHECK (result IN ('pass','fail','pass_with_defects')),
  inspector_id uuid REFERENCES public.profiles(id) NOT NULL,
  inspector_signature text,
  inspector_signed_at timestamptz,
  reviewer_id uuid REFERENCES public.profiles(id),
  reviewer_signature text,
  reviewer_signed_at timestamptz,
  reviewer_notes text,
  odometer_reading integer,
  hours_reading numeric(10,1),
  location text,
  notes text,
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_inspections_asset ON public.inspections(asset_id, created_at DESC);
CREATE INDEX idx_inspections_inspector ON public.inspections(inspector_id);

-- Add FK from work_orders to inspections
ALTER TABLE public.work_orders
  ADD CONSTRAINT fk_wo_inspection
  FOREIGN KEY (inspection_id) REFERENCES public.inspections(id);

-- ── Inspection Items ────────────────────────────────────────
CREATE TABLE public.inspection_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  inspection_id uuid REFERENCES public.inspections(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  item_name text NOT NULL,
  status text NOT NULL DEFAULT 'not_inspected'
    CHECK (status IN ('pass','fail','not_applicable','not_inspected')),
  severity text CHECK (severity IN ('minor','major','critical')),
  defect_description text,
  photo_urls text[],
  sort_order integer DEFAULT 0
);

CREATE INDEX idx_inspection_items ON public.inspection_items(inspection_id);

-- ── Inspection Photos ───────────────────────────────────────
CREATE TABLE public.inspection_photos (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  inspection_id uuid REFERENCES public.inspections(id) ON DELETE CASCADE NOT NULL,
  inspection_item_id bigint REFERENCES public.inspection_items(id),
  photo_url text NOT NULL,
  caption text,
  taken_at timestamptz DEFAULT now()
);

-- ── Fuel Transactions ───────────────────────────────────────
CREATE TABLE public.fuel_transactions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id uuid REFERENCES public.organizations(id) NOT NULL,
  asset_id uuid REFERENCES public.assets(id),
  driver_id uuid REFERENCES public.profiles(id),
  transaction_date timestamptz NOT NULL,
  fuel_type text,
  quantity_gallons numeric(8,2) NOT NULL,
  unit_price numeric(6,3),
  total_cost numeric(10,2) NOT NULL,
  odometer_at_fill integer,
  station_name text,
  station_address text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  source text DEFAULT 'manual'
    CHECK (source IN ('manual','wex','fleetcor','voyager','comdata')),
  external_transaction_id text,
  mpg numeric(6,2),
  receipt_url text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fuel_asset ON public.fuel_transactions(asset_id, transaction_date DESC);

-- ── Telematics Events (partitioned by month) ────────────────
CREATE TABLE public.telematics_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  asset_id uuid NOT NULL,
  device_id text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN (
    'position','ignition_on','ignition_off','speeding',
    'harsh_brake','harsh_accel','idle','geofence_enter',
    'geofence_exit','dtc','low_battery'
  )),
  latitude numeric(10,7),
  longitude numeric(10,7),
  speed_mph numeric(5,1),
  heading integer,
  odometer integer,
  engine_hours numeric(10,1),
  fuel_level_pct numeric(5,1),
  dtc_codes text[],
  raw_data jsonb,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_telem_asset_time ON public.telematics_events(asset_id, recorded_at DESC);
CREATE INDEX idx_telem_device ON public.telematics_events(device_id, recorded_at DESC);

-- ── Latest Asset Positions (materialized for map) ───────────
CREATE TABLE public.asset_positions (
  asset_id uuid REFERENCES public.assets(id) ON DELETE CASCADE PRIMARY KEY,
  latitude numeric(10,7),
  longitude numeric(10,7),
  speed_mph numeric(5,1),
  heading integer,
  ignition_on boolean DEFAULT false,
  address text,
  updated_at timestamptz DEFAULT now()
);

-- ── Audit Log ───────────────────────────────────────────────
CREATE TABLE public.audit_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id uuid NOT NULL,
  user_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  changes jsonb,
  ip_address inet,
  recorded_at timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_entity ON public.audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_org ON public.audit_log(org_id, recorded_at DESC);

-- ── Notifications ───────────────────────────────────────────
CREATE TABLE public.notifications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  org_id uuid NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  entity_type text,
  entity_id text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_notif_user ON public.notifications(user_id, is_read, created_at DESC);

-- ── Helper: Auto-update updated_at ──────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_organizations_updated BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_assets_updated BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_pm_schedules_updated BEFORE UPDATE ON public.pm_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_work_orders_updated BEFORE UPDATE ON public.work_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_inspections_updated BEFORE UPDATE ON public.inspections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Helper: Generate Work Order Number ──────────────────────
CREATE OR REPLACE FUNCTION generate_work_order_number(p_org_id uuid)
RETURNS text AS $$
DECLARE
  v_year text;
  v_seq integer;
BEGIN
  v_year := to_char(now(), 'YYYY');
  SELECT COALESCE(MAX(
    CAST(split_part(work_order_number, '-', 3) AS integer)
  ), 0) + 1
  INTO v_seq
  FROM public.work_orders
  WHERE org_id = p_org_id
    AND work_order_number LIKE 'WO-' || v_year || '-%';
  RETURN 'WO-' || v_year || '-' || lpad(v_seq::text, 5, '0');
END;
$$ LANGUAGE plpgsql;
-- ============================================================
-- FleetPulse Row Level Security Policies
-- Migration 002: RLS Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meter_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pm_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telematics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ── Helper: Get current user's org_id ───────────────────────
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS uuid AS $$
  SELECT org_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── Helper: Get current user's role ─────────────────────────
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── Organizations ───────────────────────────────────────────
CREATE POLICY "Users see own org" ON public.organizations
  FOR SELECT USING (id = public.get_user_org_id());

-- ── Profiles ────────────────────────────────────────────────
CREATE POLICY "Users see own org profiles" ON public.profiles
  FOR SELECT USING (org_id = public.get_user_org_id());

CREATE POLICY "Admins manage profiles" ON public.profiles
  FOR ALL USING (
    org_id = public.get_user_org_id()
    AND public.get_user_role() IN ('admin', 'fleet_manager')
  );

-- ── Assets ──────────────────────────────────────────────────
CREATE POLICY "Users see own org assets" ON public.assets
  FOR SELECT USING (org_id = public.get_user_org_id());

CREATE POLICY "Managers manage assets" ON public.assets
  FOR ALL USING (
    org_id = public.get_user_org_id()
    AND public.get_user_role() IN ('admin', 'fleet_manager')
  );

-- ── Meter Readings ──────────────────────────────────────────
CREATE POLICY "Users see own org meter readings" ON public.meter_readings
  FOR SELECT USING (
    asset_id IN (SELECT id FROM public.assets WHERE org_id = public.get_user_org_id())
  );

CREATE POLICY "Staff can record readings" ON public.meter_readings
  FOR INSERT WITH CHECK (
    asset_id IN (SELECT id FROM public.assets WHERE org_id = public.get_user_org_id())
    AND public.get_user_role() IN ('admin','fleet_manager','shop_supervisor','mechanic','driver')
  );

-- ── PM Schedules ────────────────────────────────────────────
CREATE POLICY "Users see own org PM schedules" ON public.pm_schedules
  FOR SELECT USING (org_id = public.get_user_org_id());

CREATE POLICY "Managers manage PM schedules" ON public.pm_schedules
  FOR ALL USING (
    org_id = public.get_user_org_id()
    AND public.get_user_role() IN ('admin', 'fleet_manager', 'shop_supervisor')
  );

-- ── Work Orders ─────────────────────────────────────────────
CREATE POLICY "Users see own org work orders" ON public.work_orders
  FOR SELECT USING (org_id = public.get_user_org_id());

CREATE POLICY "Staff manage work orders" ON public.work_orders
  FOR ALL USING (
    org_id = public.get_user_org_id()
    AND public.get_user_role() IN ('admin','fleet_manager','shop_supervisor','mechanic')
  );

-- ── Work Order Lines ────────────────────────────────────────
CREATE POLICY "Users see own org WO lines" ON public.work_order_lines
  FOR SELECT USING (
    work_order_id IN (SELECT id FROM public.work_orders WHERE org_id = public.get_user_org_id())
  );

CREATE POLICY "Staff manage WO lines" ON public.work_order_lines
  FOR ALL USING (
    work_order_id IN (SELECT id FROM public.work_orders WHERE org_id = public.get_user_org_id())
    AND public.get_user_role() IN ('admin','fleet_manager','shop_supervisor','mechanic')
  );

-- ── Inspections ─────────────────────────────────────────────
CREATE POLICY "Users see own org inspections" ON public.inspections
  FOR SELECT USING (org_id = public.get_user_org_id());

CREATE POLICY "Staff create inspections" ON public.inspections
  FOR INSERT WITH CHECK (
    org_id = public.get_user_org_id()
    AND public.get_user_role() IN ('admin','fleet_manager','shop_supervisor','mechanic','driver')
  );

CREATE POLICY "Staff update inspections" ON public.inspections
  FOR UPDATE USING (
    org_id = public.get_user_org_id()
    AND public.get_user_role() IN ('admin','fleet_manager','shop_supervisor','mechanic','driver')
  );

-- ── Inspection Items ────────────────────────────────────────
CREATE POLICY "Users see own org inspection items" ON public.inspection_items
  FOR SELECT USING (
    inspection_id IN (SELECT id FROM public.inspections WHERE org_id = public.get_user_org_id())
  );

CREATE POLICY "Staff manage inspection items" ON public.inspection_items
  FOR ALL USING (
    inspection_id IN (SELECT id FROM public.inspections WHERE org_id = public.get_user_org_id())
    AND public.get_user_role() IN ('admin','fleet_manager','shop_supervisor','mechanic','driver')
  );

-- ── Inspection Photos ───────────────────────────────────────
CREATE POLICY "Users see own org inspection photos" ON public.inspection_photos
  FOR SELECT USING (
    inspection_id IN (SELECT id FROM public.inspections WHERE org_id = public.get_user_org_id())
  );

CREATE POLICY "Staff upload photos" ON public.inspection_photos
  FOR INSERT WITH CHECK (
    inspection_id IN (SELECT id FROM public.inspections WHERE org_id = public.get_user_org_id())
  );

-- ── Fuel Transactions ───────────────────────────────────────
CREATE POLICY "Users see own org fuel" ON public.fuel_transactions
  FOR SELECT USING (org_id = public.get_user_org_id());

CREATE POLICY "Staff manage fuel" ON public.fuel_transactions
  FOR ALL USING (
    org_id = public.get_user_org_id()
    AND public.get_user_role() IN ('admin','fleet_manager','shop_supervisor','mechanic','driver')
  );

-- ── Telematics ──────────────────────────────────────────────
CREATE POLICY "Users see own org telematics" ON public.telematics_events
  FOR SELECT USING (
    asset_id IN (SELECT id FROM public.assets WHERE org_id = public.get_user_org_id())
  );

-- ── Asset Positions ─────────────────────────────────────────
CREATE POLICY "Users see own org positions" ON public.asset_positions
  FOR SELECT USING (
    asset_id IN (SELECT id FROM public.assets WHERE org_id = public.get_user_org_id())
  );

-- ── Audit Log ───────────────────────────────────────────────
CREATE POLICY "Admins see audit log" ON public.audit_log
  FOR SELECT USING (
    org_id = public.get_user_org_id()
    AND public.get_user_role() IN ('admin', 'fleet_manager')
  );

-- ── Notifications ───────────────────────────────────────────
CREATE POLICY "Users see own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());
-- ============================================================
-- FleetPulse Seed Data
-- Migration 003: Default organization and PM templates
-- ============================================================

-- ── Default Organization (BSA) ──────────────────────────────
INSERT INTO public.organizations (id, name, code) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Brookhaven Science Associates, LLC', 'BSA');

-- ── Default PM Schedule Templates ───────────────────────────
INSERT INTO public.pm_schedules (org_id, name, description, interval_miles, interval_months, applies_to_types, priority, task_checklist) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Oil & Filter Change',
   'Engine oil and filter replacement',
   5000, 6,
   ARRAY['sedan','suv','pickup','van','bus','truck','heavy_truck'],
   'normal',
   '["Drain engine oil","Replace oil filter","Refill with specified oil","Check for leaks","Reset maintenance light"]'::jsonb),

  ('00000000-0000-0000-0000-000000000001', 'Tire Rotation',
   'Rotate tires per manufacturer pattern',
   7500, NULL,
   ARRAY['sedan','suv','pickup','van'],
   'normal',
   '["Inspect tire tread depth","Check tire pressure","Rotate tires per pattern","Torque lug nuts to spec","Update tire position records"]'::jsonb),

  ('00000000-0000-0000-0000-000000000001', 'Brake Inspection',
   'Full brake system inspection',
   15000, 12,
   ARRAY['sedan','suv','pickup','van','bus','truck','heavy_truck'],
   'high',
   '["Measure brake pad thickness","Inspect rotors/drums","Check brake lines and hoses","Test parking brake","Inspect brake fluid level and condition"]'::jsonb),

  ('00000000-0000-0000-0000-000000000001', 'Transmission Service',
   'Transmission fluid and filter service',
   30000, 24,
   ARRAY['sedan','suv','pickup','van','truck','heavy_truck'],
   'normal',
   '["Drain transmission fluid","Replace transmission filter","Refill with specified fluid","Check for leaks","Road test"]'::jsonb),

  ('00000000-0000-0000-0000-000000000001', 'Annual DOT Inspection',
   'Federal Motor Carrier Safety annual inspection',
   NULL, 12,
   ARRAY['truck','heavy_truck','trailer','bus'],
   'critical',
   '["Brake system inspection","Steering mechanism","Lighting devices","Tires","Wheels and rims","Windshield glazing","Coupling devices","Exhaust system","Frame","Suspension"]'::jsonb),

  ('00000000-0000-0000-0000-000000000001', 'Air Filter Replacement',
   'Engine air filter replacement',
   15000, 12,
   ARRAY['sedan','suv','pickup','van','bus','truck','heavy_truck'],
   'low',
   '["Remove old air filter","Inspect air box for debris","Install new air filter","Verify proper seating"]'::jsonb),

  ('00000000-0000-0000-0000-000000000001', 'Coolant System Service',
   'Coolant flush and refill',
   30000, 24,
   ARRAY['sedan','suv','pickup','van','bus','truck','heavy_truck'],
   'normal',
   '["Drain coolant system","Flush with clean water","Inspect hoses and clamps","Refill with specified coolant","Pressure test system","Check thermostat operation"]'::jsonb),

  ('00000000-0000-0000-0000-000000000001', 'Battery Service',
   'Battery inspection and testing',
   NULL, 6,
   ARRAY['sedan','suv','pickup','van','bus','truck','heavy_truck','forklift'],
   'normal',
   '["Load test battery","Clean terminals","Check cable connections","Inspect for corrosion","Test charging system output"]'::jsonb);
