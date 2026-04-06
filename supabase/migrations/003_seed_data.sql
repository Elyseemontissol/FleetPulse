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
