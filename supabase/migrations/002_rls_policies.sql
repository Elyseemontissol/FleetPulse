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
