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
