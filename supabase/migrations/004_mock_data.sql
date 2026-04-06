-- ============================================================
-- FleetPulse Mock Data
-- Migration 004: 100 assets, work orders, inspections, fuel
-- ============================================================

-- ── Mock Profiles (drivers, mechanics, managers) ────────────
-- Note: These reference the BSA org but use fixed UUIDs since
-- they aren't tied to auth.users (mock data only)

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
VALUES
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jsmith@bsa.gov', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mjohnson@bsa.gov', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'slee@bsa.gov', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('a0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tbrown@bsa.gov', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('a0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'kwilson@bsa.gov', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('a0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dgarcia@bsa.gov', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('a0000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rchen@bsa.gov', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('a0000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'apatel@bsa.gov', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('a0000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jdoe@bsa.gov', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('a0000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'bmartinez@bsa.gov', crypt('Password123!', gen_salt('bf')), now(), now(), now(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, org_id, full_name, email, role, employee_id) VALUES
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'John Smith', 'jsmith@bsa.gov', 'driver', 'BSA-1001'),
  ('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Mike Johnson', 'mjohnson@bsa.gov', 'mechanic', 'BSA-2001'),
  ('a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Sarah Lee', 'slee@bsa.gov', 'mechanic', 'BSA-2002'),
  ('a0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Tom Brown', 'tbrown@bsa.gov', 'shop_supervisor', 'BSA-3001'),
  ('a0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Karen Wilson', 'kwilson@bsa.gov', 'fleet_manager', 'BSA-4001'),
  ('a0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'David Garcia', 'dgarcia@bsa.gov', 'driver', 'BSA-1002'),
  ('a0000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'Rachel Chen', 'rchen@bsa.gov', 'driver', 'BSA-1003'),
  ('a0000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'Amit Patel', 'apatel@bsa.gov', 'driver', 'BSA-1004'),
  ('a0000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', 'Jane Doe', 'jdoe@bsa.gov', 'driver', 'BSA-1005'),
  ('a0000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Brian Martinez', 'bmartinez@bsa.gov', 'driver', 'BSA-1006')
ON CONFLICT (id) DO NOTHING;

-- ── 100 Mock Assets ─────────────────────────────────────────
INSERT INTO public.assets (org_id, asset_number, asset_type, category, status, year, make, model, color, fuel_type, vin, license_plate, current_odometer, assigned_driver_id, assigned_department, home_location, acquisition_date, acquisition_cost) VALUES
-- Sedans (15)
('00000000-0000-0000-0000-000000000001', 'Toyota Camry #001', 'sedan', 'vehicle', 'active', 2023, 'Toyota', 'Camry LE', 'White', 'gasoline', '4T1BF1FK0NU000001', 'NY-AA-0001', 28763, 'a0000000-0000-0000-0000-000000000001', 'Admin', 'Bldg 134 Lot', '2023-01-15', 28500),
('00000000-0000-0000-0000-000000000001', 'Toyota Camry #002', 'sedan', 'vehicle', 'active', 2023, 'Toyota', 'Camry SE', 'Silver', 'gasoline', '4T1BF1FK0NU000002', 'NY-AA-0002', 31245, NULL, 'Admin', 'Bldg 134 Lot', '2023-02-01', 29200),
('00000000-0000-0000-0000-000000000001', 'Honda Accord #003', 'sedan', 'vehicle', 'active', 2022, 'Honda', 'Accord LX', 'Black', 'gasoline', '1HGCV1F10NA000003', 'NY-AA-0003', 42187, 'a0000000-0000-0000-0000-000000000006', 'Physics', 'Bldg 510 Lot', '2022-03-10', 27800),
('00000000-0000-0000-0000-000000000001', 'Honda Civic #004', 'sedan', 'vehicle', 'active', 2024, 'Honda', 'Civic Sport', 'Blue', 'gasoline', '2HGFE2F50RH000004', 'NY-AA-0004', 8934, NULL, 'Chemistry', 'Bldg 555 Lot', '2024-01-20', 26500),
('00000000-0000-0000-0000-000000000001', 'Nissan Altima #005', 'sedan', 'vehicle', 'in_shop', 2021, 'Nissan', 'Altima SV', 'Gray', 'gasoline', '1N4BL4BV5MN000005', 'NY-AA-0005', 56231, NULL, 'Biology', 'Bldg 463 Lot', '2021-06-15', 25400),
('00000000-0000-0000-0000-000000000001', 'Hyundai Sonata #006', 'sedan', 'vehicle', 'active', 2023, 'Hyundai', 'Sonata SEL', 'White', 'gasoline', '5NPE34AF5NH000006', 'NY-AA-0006', 22456, 'a0000000-0000-0000-0000-000000000007', 'IT', 'Bldg 515 Lot', '2023-04-05', 27100),
('00000000-0000-0000-0000-000000000001', 'Chevrolet Malibu #007', 'sedan', 'vehicle', 'active', 2022, 'Chevrolet', 'Malibu LT', 'Red', 'gasoline', '1G1ZD5ST3NF000007', 'NY-AA-0007', 38921, NULL, 'Safety', 'Bldg 599 Lot', '2022-08-20', 26300),
('00000000-0000-0000-0000-000000000001', 'Ford Fusion #008', 'sedan', 'vehicle', 'out_of_service', 2020, 'Ford', 'Fusion SE', 'Black', 'gasoline', '3FA6P0HD0LR000008', 'NY-AA-0008', 71234, NULL, 'Admin', 'Bldg 134 Lot', '2020-02-10', 24900),
('00000000-0000-0000-0000-000000000001', 'Toyota Corolla #009', 'sedan', 'vehicle', 'active', 2024, 'Toyota', 'Corolla LE', 'Silver', 'hybrid', '5YFS4MCE0RP000009', 'NY-AA-0009', 5123, 'a0000000-0000-0000-0000-000000000008', 'Environmental', 'Bldg 830 Lot', '2024-03-01', 24200),
('00000000-0000-0000-0000-000000000001', 'Kia K5 #010', 'sedan', 'vehicle', 'active', 2023, 'Kia', 'K5 LXS', 'White', 'gasoline', 'KNAGM4AD5P5000010', 'NY-AA-0010', 19872, NULL, 'HR', 'Bldg 400 Lot', '2023-05-15', 25800),
('00000000-0000-0000-0000-000000000001', 'Subaru Legacy #011', 'sedan', 'vehicle', 'active', 2023, 'Subaru', 'Legacy Premium', 'Blue', 'gasoline', '4S3BWAC63P3000011', 'NY-AA-0011', 24531, NULL, 'Finance', 'Bldg 400 Lot', '2023-07-01', 28900),
('00000000-0000-0000-0000-000000000001', 'Mazda Mazda3 #012', 'sedan', 'vehicle', 'active', 2022, 'Mazda', 'Mazda3 Select', 'Gray', 'gasoline', '3MZBPAAL7NM000012', 'NY-AA-0012', 35678, 'a0000000-0000-0000-0000-000000000009', 'Physics', 'Bldg 510 Lot', '2022-11-10', 24700),
('00000000-0000-0000-0000-000000000001', 'Chevrolet Impala #013', 'sedan', 'vehicle', 'surplus', 2019, 'Chevrolet', 'Impala LT', 'Black', 'gasoline', '2G1105S37K9000013', 'NY-AA-0013', 89234, NULL, 'Pool', 'Surplus Yard', '2019-01-20', 28100),
('00000000-0000-0000-0000-000000000001', 'Hyundai Elantra #014', 'sedan', 'vehicle', 'active', 2024, 'Hyundai', 'Elantra SEL', 'White', 'gasoline', 'KMHLL4AG0RU000014', 'NY-AA-0014', 3456, NULL, 'Procurement', 'Bldg 400 Lot', '2024-05-01', 23400),
('00000000-0000-0000-0000-000000000001', 'Volkswagen Jetta #015', 'sedan', 'vehicle', 'active', 2023, 'Volkswagen', 'Jetta S', 'Silver', 'gasoline', '3VWC57BU0PM000015', 'NY-AA-0015', 17234, 'a0000000-0000-0000-0000-000000000010', 'Engineering', 'Bldg 725 Lot', '2023-09-15', 24100),

-- SUVs (15)
('00000000-0000-0000-0000-000000000001', 'Chevrolet Tahoe #016', 'suv', 'vehicle', 'active', 2023, 'Chevrolet', 'Tahoe LT', 'Black', 'gasoline', '1GNSKBKD5PR000016', 'NY-AB-0016', 34521, 'a0000000-0000-0000-0000-000000000001', 'Security', 'Bldg 599 Lot', '2023-01-10', 52400),
('00000000-0000-0000-0000-000000000001', 'Ford Explorer #017', 'suv', 'vehicle', 'active', 2022, 'Ford', 'Explorer XLT', 'White', 'gasoline', '1FMSK8DH7NGA00017', 'NY-AB-0017', 48932, NULL, 'Security', 'Bldg 599 Lot', '2022-04-20', 41200),
('00000000-0000-0000-0000-000000000001', 'Toyota Highlander #018', 'suv', 'vehicle', 'active', 2024, 'Toyota', 'Highlander LE', 'Gray', 'hybrid', '5TDKBRFH0RS000018', 'NY-AB-0018', 7823, NULL, 'Environmental', 'Bldg 830 Lot', '2024-02-15', 39800),
('00000000-0000-0000-0000-000000000001', 'Jeep Grand Cherokee #019', 'suv', 'vehicle', 'in_shop', 2023, 'Jeep', 'Grand Cherokee Laredo', 'Green', 'gasoline', '1C4RJFAG5PC000019', 'NY-AB-0019', 29456, NULL, 'Facilities', 'Bldg 134 Lot', '2023-03-01', 38500),
('00000000-0000-0000-0000-000000000001', 'Nissan Pathfinder #020', 'suv', 'vehicle', 'active', 2022, 'Nissan', 'Pathfinder SV', 'White', 'gasoline', '5N1DR3CC7NC000020', 'NY-AB-0020', 41234, 'a0000000-0000-0000-0000-000000000006', 'Facilities', 'Bldg 134 Lot', '2022-06-10', 36700),
('00000000-0000-0000-0000-000000000001', 'Hyundai Tucson #021', 'suv', 'vehicle', 'active', 2023, 'Hyundai', 'Tucson SEL', 'Blue', 'hybrid', 'KM8JBCAL5PU000021', 'NY-AB-0021', 18923, NULL, 'Chemistry', 'Bldg 555 Lot', '2023-08-01', 33200),
('00000000-0000-0000-0000-000000000001', 'Kia Sportage #022', 'suv', 'vehicle', 'active', 2024, 'Kia', 'Sportage LX', 'Silver', 'gasoline', 'KNDPMCAC0R7000022', 'NY-AB-0022', 4567, NULL, 'IT', 'Bldg 515 Lot', '2024-04-01', 30100),
('00000000-0000-0000-0000-000000000001', 'Subaru Outback #023', 'suv', 'vehicle', 'active', 2023, 'Subaru', 'Outback Premium', 'White', 'gasoline', '4S4BTACC5P3000023', 'NY-AB-0023', 22345, 'a0000000-0000-0000-0000-000000000007', 'Environmental', 'Bldg 830 Lot', '2023-05-20', 34500),
('00000000-0000-0000-0000-000000000001', 'Chevrolet Equinox #024', 'suv', 'vehicle', 'out_of_service', 2020, 'Chevrolet', 'Equinox LT', 'Gray', 'gasoline', '2GNAXKEV0L6000024', 'NY-AB-0024', 67890, NULL, 'Pool', 'Bldg 134 Lot', '2020-07-15', 28900),
('00000000-0000-0000-0000-000000000001', 'Toyota RAV4 #025', 'suv', 'vehicle', 'active', 2023, 'Toyota', 'RAV4 XLE', 'Red', 'hybrid', '2T3A1RFV5PW000025', 'NY-AB-0025', 15678, NULL, 'Biology', 'Bldg 463 Lot', '2023-10-01', 35200),
('00000000-0000-0000-0000-000000000001', 'Honda CR-V #026', 'suv', 'vehicle', 'active', 2024, 'Honda', 'CR-V EX', 'White', 'hybrid', '7FARS6H57RE000026', 'NY-AB-0026', 6789, 'a0000000-0000-0000-0000-000000000008', 'Physics', 'Bldg 510 Lot', '2024-01-10', 36100),
('00000000-0000-0000-0000-000000000001', 'Ford Bronco Sport #027', 'suv', 'vehicle', 'active', 2022, 'Ford', 'Bronco Sport Big Bend', 'Orange', 'gasoline', '3FMCR9B60NR000027', 'NY-AB-0027', 38234, NULL, 'Facilities', 'Bldg 134 Lot', '2022-09-01', 31400),
('00000000-0000-0000-0000-000000000001', 'Mazda CX-5 #028', 'suv', 'vehicle', 'active', 2023, 'Mazda', 'CX-5 Select', 'Black', 'gasoline', 'JM3KFBBM5P1000028', 'NY-AB-0028', 21345, 'a0000000-0000-0000-0000-000000000009', 'Engineering', 'Bldg 725 Lot', '2023-06-15', 32800),
('00000000-0000-0000-0000-000000000001', 'Chevrolet Blazer #029', 'suv', 'vehicle', 'reserved', 2024, 'Chevrolet', 'Blazer LT', 'White', 'gasoline', '3GNKBCRS0RS000029', 'NY-AB-0029', 2345, NULL, 'Executive', 'Bldg 400 Lot', '2024-06-01', 38700),
('00000000-0000-0000-0000-000000000001', 'Volkswagen Tiguan #030', 'suv', 'vehicle', 'active', 2023, 'Volkswagen', 'Tiguan SE', 'Gray', 'gasoline', '3VV3B7AX4PM000030', 'NY-AB-0030', 19876, 'a0000000-0000-0000-0000-000000000010', 'Safety', 'Bldg 599 Lot', '2023-11-01', 31200),

-- Pickups (20)
('00000000-0000-0000-0000-000000000001', 'Ford F-150 #031', 'pickup', 'vehicle', 'active', 2023, 'Ford', 'F-150 XLT', 'White', 'gasoline', '1FTFW1E89NFA00031', 'NY-AC-0031', 34521, 'a0000000-0000-0000-0000-000000000001', 'Facilities', 'Bldg 134 Lot', '2023-03-15', 45250),
('00000000-0000-0000-0000-000000000001', 'Ram 1500 #032', 'pickup', 'vehicle', 'active', 2024, 'Ram', '1500 Big Horn', 'Black', 'gasoline', '1C6SRFFT5RN000032', 'NY-AC-0032', 8765, NULL, 'Facilities', 'Bldg 134 Lot', '2024-01-05', 44800),
('00000000-0000-0000-0000-000000000001', 'Chevrolet Silverado #033', 'pickup', 'vehicle', 'active', 2022, 'Chevrolet', 'Silverado 1500 LT', 'Silver', 'gasoline', '1GCUYDED5NZ000033', 'NY-AC-0033', 45678, 'a0000000-0000-0000-0000-000000000006', 'Grounds', 'Bldg 244 Lot', '2022-05-20', 42100),
('00000000-0000-0000-0000-000000000001', 'Toyota Tacoma #034', 'pickup', 'vehicle', 'in_shop', 2023, 'Toyota', 'Tacoma SR5', 'Gray', 'gasoline', '3TMCZ5AN5PM000034', 'NY-AC-0034', 27890, NULL, 'Maintenance', 'Shop', '2023-07-10', 36400),
('00000000-0000-0000-0000-000000000001', 'Ford F-250 #035', 'pickup', 'vehicle', 'active', 2023, 'Ford', 'F-250 XL', 'White', 'diesel', '1FT7W2BT5PED00035', 'NY-AC-0035', 31234, NULL, 'Facilities', 'Bldg 134 Lot', '2023-02-28', 52300),
('00000000-0000-0000-0000-000000000001', 'Ram 2500 #036', 'pickup', 'vehicle', 'active', 2024, 'Ram', '2500 Tradesman', 'White', 'diesel', '3C6UR5CL0RG000036', 'NY-AC-0036', 5432, 'a0000000-0000-0000-0000-000000000002', 'Maintenance', 'Shop', '2024-02-15', 48700),
('00000000-0000-0000-0000-000000000001', 'Chevrolet Colorado #037', 'pickup', 'vehicle', 'active', 2022, 'Chevrolet', 'Colorado Z71', 'Red', 'gasoline', '1GCGTCEN7N1000037', 'NY-AC-0037', 39876, NULL, 'Grounds', 'Bldg 244 Lot', '2022-08-01', 35600),
('00000000-0000-0000-0000-000000000001', 'Ford Ranger #038', 'pickup', 'vehicle', 'active', 2023, 'Ford', 'Ranger Lariat', 'Blue', 'gasoline', '1FTER4FH1PLA00038', 'NY-AC-0038', 19234, 'a0000000-0000-0000-0000-000000000003', 'Environmental', 'Bldg 830 Lot', '2023-09-01', 38200),
('00000000-0000-0000-0000-000000000001', 'Toyota Tundra #039', 'pickup', 'vehicle', 'active', 2021, 'Toyota', 'Tundra SR5', 'Silver', 'gasoline', '5TFDY5F10MX000039', 'NY-AC-0039', 52345, NULL, 'Facilities', 'Bldg 134 Lot', '2021-04-10', 41200),
('00000000-0000-0000-0000-000000000001', 'GMC Sierra #040', 'pickup', 'vehicle', 'active', 2023, 'GMC', 'Sierra 1500 SLE', 'White', 'gasoline', '1GTP8LED5PZ000040', 'NY-AC-0040', 23456, NULL, 'Grounds', 'Bldg 244 Lot', '2023-04-15', 44500),
('00000000-0000-0000-0000-000000000001', 'Ford F-150 #041', 'pickup', 'vehicle', 'active', 2024, 'Ford', 'F-150 Lariat', 'Black', 'gasoline', '1FTFW1E85RFA00041', 'NY-AC-0041', 4321, 'a0000000-0000-0000-0000-000000000004', 'Maintenance', 'Shop', '2024-03-20', 51800),
('00000000-0000-0000-0000-000000000001', 'Ram 1500 #042', 'pickup', 'vehicle', 'out_of_service', 2019, 'Ram', '1500 Tradesman', 'White', 'gasoline', '1C6RR7KT8KS000042', 'NY-AC-0042', 87654, NULL, 'Pool', 'Surplus Yard', '2019-06-01', 32400),
('00000000-0000-0000-0000-000000000001', 'Chevrolet Silverado HD #043', 'pickup', 'vehicle', 'active', 2023, 'Chevrolet', 'Silverado 2500HD WT', 'White', 'diesel', '1GC4YLEY5PF000043', 'NY-AC-0043', 28765, NULL, 'Facilities', 'Bldg 134 Lot', '2023-06-01', 49200),
('00000000-0000-0000-0000-000000000001', 'Nissan Frontier #044', 'pickup', 'vehicle', 'active', 2022, 'Nissan', 'Frontier SV', 'Gray', 'gasoline', '1N6ED1EK3NN000044', 'NY-AC-0044', 36789, 'a0000000-0000-0000-0000-000000000007', 'Engineering', 'Bldg 725 Lot', '2022-10-15', 33100),
('00000000-0000-0000-0000-000000000001', 'Toyota Tacoma #045', 'pickup', 'vehicle', 'active', 2024, 'Toyota', 'Tacoma TRD Sport', 'Green', 'gasoline', '3TMCZ5AN0RM000045', 'NY-AC-0045', 3456, NULL, 'Environmental', 'Bldg 830 Lot', '2024-05-10', 39800),
('00000000-0000-0000-0000-000000000001', 'Ford F-350 #046', 'pickup', 'vehicle', 'active', 2023, 'Ford', 'F-350 XL DRW', 'White', 'diesel', '1FT8W3BT0PED00046', 'NY-AC-0046', 24567, NULL, 'Facilities', 'Bldg 134 Lot', '2023-08-15', 56200),
('00000000-0000-0000-0000-000000000001', 'GMC Canyon #047', 'pickup', 'vehicle', 'active', 2023, 'GMC', 'Canyon AT4', 'Red', 'gasoline', '1GTG6FEN5P1000047', 'NY-AC-0047', 16789, 'a0000000-0000-0000-0000-000000000008', 'Physics', 'Bldg 510 Lot', '2023-12-01', 41200),
('00000000-0000-0000-0000-000000000001', 'Ram 3500 #048', 'pickup', 'vehicle', 'active', 2022, 'Ram', '3500 Tradesman', 'White', 'diesel', '3C63R3CL5NG000048', 'NY-AC-0048', 41234, NULL, 'Maintenance', 'Shop', '2022-03-01', 51400),
('00000000-0000-0000-0000-000000000001', 'Chevrolet Silverado #049', 'pickup', 'vehicle', 'active', 2024, 'Chevrolet', 'Silverado 1500 RST', 'Black', 'gasoline', '1GCUDEED0RZ000049', 'NY-AC-0049', 6789, NULL, 'Security', 'Bldg 599 Lot', '2024-04-20', 47300),
('00000000-0000-0000-0000-000000000001', 'Ford F-150 #050', 'pickup', 'vehicle', 'active', 2023, 'Ford', 'F-150 STX', 'Silver', 'gasoline', '1FTEW1EP5PFA00050', 'NY-AC-0050', 21345, 'a0000000-0000-0000-0000-000000000009', 'Grounds', 'Bldg 244 Lot', '2023-10-15', 42100),

-- Vans (10)
('00000000-0000-0000-0000-000000000001', 'Ford Transit #051', 'van', 'vehicle', 'active', 2023, 'Ford', 'Transit 250', 'White', 'gasoline', '1FTBR1C88PKA00051', 'NY-AD-0051', 23456, NULL, 'Facilities', 'Bldg 134 Lot', '2023-02-10', 38900),
('00000000-0000-0000-0000-000000000001', 'Ram ProMaster #052', 'van', 'vehicle', 'active', 2022, 'Ram', 'ProMaster 2500', 'White', 'gasoline', '3C6MRVJG8NE000052', 'NY-AD-0052', 38765, NULL, 'Mail Services', 'Bldg 400 Lot', '2022-05-01', 36400),
('00000000-0000-0000-0000-000000000001', 'Mercedes Sprinter #053', 'van', 'vehicle', 'active', 2024, 'Mercedes-Benz', 'Sprinter 2500', 'White', 'diesel', 'W1Y4HBHY0RT000053', 'NY-AD-0053', 5678, NULL, 'IT', 'Bldg 515 Lot', '2024-01-20', 48200),
('00000000-0000-0000-0000-000000000001', 'Chevrolet Express #054', 'van', 'vehicle', 'in_shop', 2021, 'Chevrolet', 'Express 2500', 'White', 'gasoline', '1GCWGAFP2M1000054', 'NY-AD-0054', 54321, NULL, 'Facilities', 'Shop', '2021-07-10', 34100),
('00000000-0000-0000-0000-000000000001', 'Ford Transit Connect #055', 'van', 'vehicle', 'active', 2023, 'Ford', 'Transit Connect XL', 'Silver', 'gasoline', 'NM0GE9E23P1000055', 'NY-AD-0055', 18234, 'a0000000-0000-0000-0000-000000000010', 'Supply', 'Bldg 400 Lot', '2023-06-01', 31200),
('00000000-0000-0000-0000-000000000001', 'Ram ProMaster City #056', 'van', 'vehicle', 'active', 2023, 'Ram', 'ProMaster City Tradesman', 'White', 'gasoline', 'ZFBHRFAB5P6000056', 'NY-AD-0056', 14567, NULL, 'Mail Services', 'Bldg 400 Lot', '2023-04-20', 28900),
('00000000-0000-0000-0000-000000000001', 'Ford E-Transit #057', 'van', 'vehicle', 'active', 2024, 'Ford', 'E-Transit 350', 'White', 'electric', '1FTBW9CK4PKA00057', 'NY-AD-0057', 3456, NULL, 'Sustainability', 'Bldg 830 Lot', '2024-03-10', 52100),
('00000000-0000-0000-0000-000000000001', 'Nissan NV200 #058', 'van', 'vehicle', 'active', 2022, 'Nissan', 'NV200 SV', 'White', 'gasoline', '3N6CM0KN2NK000058', 'NY-AD-0058', 32456, NULL, 'Supply', 'Bldg 400 Lot', '2022-09-15', 26800),
('00000000-0000-0000-0000-000000000001', 'Chevrolet Express #059', 'van', 'vehicle', 'active', 2023, 'Chevrolet', 'Express 3500', 'White', 'gasoline', '1GAZGPFG0P1000059', 'NY-AD-0059', 21345, NULL, 'Facilities', 'Bldg 134 Lot', '2023-07-01', 38400),
('00000000-0000-0000-0000-000000000001', 'Ford Transit HD #060', 'van', 'vehicle', 'active', 2023, 'Ford', 'Transit 350 HD', 'White', 'gasoline', '1FTRS4X83PKA00060', 'NY-AD-0060', 16789, NULL, 'Shipping', 'Bldg 197 Lot', '2023-11-15', 42700),

-- Buses (5)
('00000000-0000-0000-0000-000000000001', 'Ford E-450 Shuttle #061', 'bus', 'vehicle', 'active', 2022, 'Ford', 'E-450 Shuttle', 'White', 'diesel', '1FDFE4FS4NDC00061', 'NY-AE-0061', 67890, NULL, 'Transportation', 'Bus Depot', '2022-01-15', 78500),
('00000000-0000-0000-0000-000000000001', 'Chevrolet 4500 Shuttle #062', 'bus', 'vehicle', 'active', 2023, 'Chevrolet', '4500 Shuttle', 'White', 'diesel', '1GB6GUBL5P1000062', 'NY-AE-0062', 34567, NULL, 'Transportation', 'Bus Depot', '2023-03-10', 82300),
('00000000-0000-0000-0000-000000000001', 'Ford E-450 Shuttle #063', 'bus', 'vehicle', 'in_shop', 2021, 'Ford', 'E-450 Shuttle', 'Blue', 'diesel', '1FDFE4FS1MDC00063', 'NY-AE-0063', 89012, NULL, 'Transportation', 'Shop', '2021-06-20', 76200),
('00000000-0000-0000-0000-000000000001', 'International CE Electric #064', 'bus', 'vehicle', 'active', 2024, 'International', 'CE Electric Bus', 'Yellow', 'electric', '4DRBUSKR0RB000064', 'NY-AE-0064', 2345, NULL, 'Transportation', 'Bus Depot', '2024-01-10', 295000),
('00000000-0000-0000-0000-000000000001', 'Ford Transit Passenger #065', 'bus', 'vehicle', 'active', 2023, 'Ford', 'Transit 350 Passenger', 'White', 'gasoline', '1FBAX2C87PKA00065', 'NY-AE-0065', 28901, NULL, 'Transportation', 'Bus Depot', '2023-08-05', 45600),

-- Trucks (5)
('00000000-0000-0000-0000-000000000001', 'Ford F-550 Flatbed #066', 'truck', 'vehicle', 'active', 2022, 'Ford', 'F-550 Flatbed', 'White', 'diesel', '1FDUF5HT8NED00066', 'NY-AF-0066', 43210, NULL, 'Facilities', 'Bldg 134 Lot', '2022-04-01', 62300),
('00000000-0000-0000-0000-000000000001', 'International MV607 #067', 'truck', 'vehicle', 'active', 2023, 'International', 'MV607', 'White', 'diesel', '1HTMKAAN5PH000067', 'NY-AF-0067', 21345, NULL, 'Facilities', 'Bldg 134 Lot', '2023-02-15', 75400),
('00000000-0000-0000-0000-000000000001', 'Freightliner M2 #068', 'truck', 'vehicle', 'active', 2021, 'Freightliner', 'M2 106', 'White', 'diesel', '1FVACXDT5MHKM0068', 'NY-AF-0068', 56789, NULL, 'Shipping', 'Bldg 197 Lot', '2021-09-10', 82100),
('00000000-0000-0000-0000-000000000001', 'Hino 268A #069', 'truck', 'vehicle', 'in_shop', 2022, 'Hino', '268A', 'White', 'diesel', 'JHBNE8JT5NK000069', 'NY-AF-0069', 48901, NULL, 'Waste Mgmt', 'Shop', '2022-07-01', 68700),
('00000000-0000-0000-0000-000000000001', 'Isuzu NPR HD #070', 'truck', 'vehicle', 'active', 2023, 'Isuzu', 'NPR HD', 'White', 'diesel', 'JALC4W163P7000070', 'NY-AF-0070', 18234, NULL, 'Supply', 'Bldg 400 Lot', '2023-05-20', 47500),

-- Heavy Trucks (5)
('00000000-0000-0000-0000-000000000001', 'Mack Granite #071', 'heavy_truck', 'vehicle', 'active', 2021, 'Mack', 'Granite GR64F', 'Yellow', 'diesel', '1M2AX04C5MM000071', 'NY-AG-0071', 67890, NULL, 'Construction', 'Heavy Equip Yard', '2021-03-15', 185000),
('00000000-0000-0000-0000-000000000001', 'Peterbilt 567 #072', 'heavy_truck', 'vehicle', 'active', 2022, 'Peterbilt', '567', 'White', 'diesel', '1NPALU0X1ND000072', 'NY-AG-0072', 45678, NULL, 'Waste Mgmt', 'Heavy Equip Yard', '2022-01-20', 165000),
('00000000-0000-0000-0000-000000000001', 'Kenworth T370 #073', 'heavy_truck', 'vehicle', 'active', 2023, 'Kenworth', 'T370', 'White', 'diesel', '2NKMLD7X9PM000073', 'NY-AG-0073', 23456, NULL, 'Facilities', 'Heavy Equip Yard', '2023-04-10', 142000),
('00000000-0000-0000-0000-000000000001', 'International HV507 #074', 'heavy_truck', 'vehicle', 'out_of_service', 2019, 'International', 'HV507', 'White', 'diesel', '1HTMHAAN1KH000074', 'NY-AG-0074', 112345, NULL, 'Pool', 'Surplus Yard', '2019-05-01', 128000),
('00000000-0000-0000-0000-000000000001', 'Volvo VHD 300 #075', 'heavy_truck', 'vehicle', 'active', 2024, 'Volvo', 'VHD 300', 'Gray', 'diesel', '4V5KC9EH5RN000075', 'NY-AG-0075', 5678, NULL, 'Construction', 'Heavy Equip Yard', '2024-02-01', 175000),

-- Trailers (5)
('00000000-0000-0000-0000-000000000001', 'Utility VS2DX Trailer #076', 'trailer', 'vehicle', 'active', 2020, 'Utility', 'VS2DX', 'White', 'none', '1UYVS2534LU000076', NULL, 0, NULL, 'Shipping', 'Bldg 197 Lot', '2020-03-01', 42000),
('00000000-0000-0000-0000-000000000001', 'Great Dane CL Trailer #077', 'trailer', 'vehicle', 'active', 2022, 'Great Dane', 'Champion CL', 'White', 'none', '1GRAA0624NB000077', NULL, 0, NULL, 'Shipping', 'Bldg 197 Lot', '2022-06-15', 48500),
('00000000-0000-0000-0000-000000000001', 'Load King Flatbed #078', 'trailer', 'vehicle', 'active', 2021, 'Load King', 'Flatbed 48ft', 'Black', 'none', '5KJLA4827MG000078', NULL, 0, NULL, 'Construction', 'Heavy Equip Yard', '2021-09-01', 38200),
('00000000-0000-0000-0000-000000000001', 'Wabash DuraPlate #079', 'trailer', 'vehicle', 'in_shop', 2019, 'Wabash', 'DuraPlate', 'White', 'none', '1JJV532D3KL000079', NULL, 0, NULL, 'Shipping', 'Shop', '2019-04-20', 35600),
('00000000-0000-0000-0000-000000000001', 'Utility 4000AE Trailer #080', 'trailer', 'vehicle', 'active', 2023, 'Utility', '4000AE', 'White', 'none', '1UYVS2539PU000080', NULL, 0, NULL, 'Waste Mgmt', 'Heavy Equip Yard', '2023-01-10', 51200),

-- Equipment: Forklifts (5)
('00000000-0000-0000-0000-000000000001', 'Toyota Forklift 8FG #081', 'forklift', 'equipment', 'active', 2022, 'Toyota', '8FGCU25', 'Orange', 'propane', NULL, NULL, 0, NULL, 'Shipping', 'Bldg 197', '2022-02-01', 28500),
('00000000-0000-0000-0000-000000000001', 'Hyster Forklift H50 #082', 'forklift', 'equipment', 'active', 2023, 'Hyster', 'H50FT', 'Yellow', 'propane', NULL, NULL, 0, NULL, 'Shipping', 'Bldg 197', '2023-01-15', 32100),
('00000000-0000-0000-0000-000000000001', 'Crown Forklift FC5200 #083', 'forklift', 'equipment', 'in_shop', 2020, 'Crown', 'FC5200', 'Red', 'electric', NULL, NULL, 0, NULL, 'Supply', 'Shop', '2020-06-10', 24800),
('00000000-0000-0000-0000-000000000001', 'Yale Forklift GLP050 #084', 'forklift', 'equipment', 'active', 2024, 'Yale', 'GLP050VX', 'Yellow', 'propane', NULL, NULL, 0, NULL, 'Construction', 'Heavy Equip Yard', '2024-03-01', 35400),
('00000000-0000-0000-0000-000000000001', 'Raymond Forklift 4250 #085', 'forklift', 'equipment', 'active', 2021, 'Raymond', '4250', 'Green', 'electric', NULL, NULL, 0, NULL, 'Supply', 'Bldg 400', '2021-11-01', 38700),

-- Equipment: Loaders (3)
('00000000-0000-0000-0000-000000000001', 'CAT Loader 926M #086', 'loader', 'equipment', 'active', 2021, 'Caterpillar', '926M', 'Yellow', 'diesel', NULL, NULL, 0, NULL, 'Construction', 'Heavy Equip Yard', '2021-04-15', 185000),
('00000000-0000-0000-0000-000000000001', 'John Deere Loader 324G #087', 'loader', 'equipment', 'active', 2023, 'John Deere', '324G', 'Yellow', 'diesel', NULL, NULL, 0, NULL, 'Grounds', 'Bldg 244', '2023-02-20', 62400),
('00000000-0000-0000-0000-000000000001', 'Bobcat Loader S76 #088', 'loader', 'equipment', 'active', 2022, 'Bobcat', 'S76', 'White', 'diesel', NULL, NULL, 0, NULL, 'Facilities', 'Bldg 134', '2022-08-10', 54200),

-- Equipment: Generators (3)
('00000000-0000-0000-0000-000000000001', 'CAT Generator XQ200 #089', 'generator', 'equipment', 'active', 2022, 'Caterpillar', 'XQ200', 'Yellow', 'diesel', NULL, NULL, 0, NULL, 'Facilities', 'Bldg 134', '2022-03-01', 95000),
('00000000-0000-0000-0000-000000000001', 'Generac Generator SG080 #090', 'generator', 'equipment', 'active', 2023, 'Generac', 'SG080', 'Gray', 'diesel', NULL, NULL, 0, NULL, 'Data Center', 'Bldg 515', '2023-05-15', 42300),
('00000000-0000-0000-0000-000000000001', 'Kohler Generator KD800 #091', 'generator', 'equipment', 'active', 2021, 'Kohler', 'KD800', 'Green', 'diesel', NULL, NULL, 0, NULL, 'Emergency', 'Bldg 510', '2021-10-01', 125000),

-- Equipment: Mowers (4)
('00000000-0000-0000-0000-000000000001', 'John Deere Mower 1025R #092', 'mower', 'equipment', 'active', 2023, 'John Deere', '1025R', 'Green', 'diesel', NULL, NULL, 0, NULL, 'Grounds', 'Bldg 244', '2023-03-01', 18500),
('00000000-0000-0000-0000-000000000001', 'Toro Mower GM4010 #093', 'mower', 'equipment', 'active', 2022, 'Toro', 'Groundsmaster 4010', 'Red', 'diesel', NULL, NULL, 0, NULL, 'Grounds', 'Bldg 244', '2022-04-15', 62000),
('00000000-0000-0000-0000-000000000001', 'Kubota Mower ZD1211 #094', 'mower', 'equipment', 'active', 2024, 'Kubota', 'ZD1211', 'Orange', 'diesel', NULL, NULL, 0, NULL, 'Grounds', 'Bldg 244', '2024-02-10', 14200),
('00000000-0000-0000-0000-000000000001', 'John Deere Mower Z930M #095', 'mower', 'equipment', 'out_of_service', 2020, 'John Deere', 'Z930M', 'Green', 'gasoline', NULL, NULL, 0, NULL, 'Grounds', 'Bldg 244', '2020-05-01', 11800),

-- Equipment: Utility Carts (5)
('00000000-0000-0000-0000-000000000001', 'Club Car Carryall 500 #096', 'utility_cart', 'equipment', 'active', 2023, 'Club Car', 'Carryall 500', 'Green', 'electric', NULL, NULL, 0, NULL, 'Facilities', 'Bldg 134', '2023-01-10', 12400),
('00000000-0000-0000-0000-000000000001', 'E-Z-GO Express L6 #097', 'utility_cart', 'equipment', 'active', 2022, 'E-Z-GO', 'Express L6', 'White', 'electric', NULL, NULL, 0, NULL, 'Transportation', 'Bus Depot', '2022-06-01', 9800),
('00000000-0000-0000-0000-000000000001', 'Cushman Hauler 1200X #098', 'utility_cart', 'equipment', 'active', 2024, 'Cushman', 'Hauler 1200X', 'Black', 'electric', NULL, NULL, 0, NULL, 'Security', 'Bldg 599', '2024-01-15', 14500),
('00000000-0000-0000-0000-000000000001', 'Club Car Carryall 700 #099', 'utility_cart', 'equipment', 'active', 2023, 'Club Car', 'Carryall 700', 'Green', 'electric', NULL, NULL, 0, NULL, 'Grounds', 'Bldg 244', '2023-09-01', 16200),
('00000000-0000-0000-0000-000000000001', 'Polaris Ranger 500 #100', 'utility_cart', 'equipment', 'active', 2022, 'Polaris', 'Ranger 500', 'Olive', 'gasoline', NULL, NULL, 0, NULL, 'Environmental', 'Bldg 830', '2022-11-10', 11900);


-- ── 30 Work Orders ──────────────────────────────────────────
INSERT INTO public.work_orders (org_id, work_order_number, asset_id, type, status, priority, assigned_to, title, description, complaint, cause, correction, scheduled_date, started_at, completed_at, total_parts_cost, total_labor_cost, created_at)
SELECT
  '00000000-0000-0000-0000-000000000001',
  wo.wo_number,
  a.id,
  wo.type,
  wo.status,
  wo.priority,
  wo.assigned_to,
  wo.title,
  wo.description,
  wo.complaint,
  wo.cause,
  wo.correction,
  wo.scheduled_date,
  wo.started_at,
  wo.completed_at,
  wo.parts_cost,
  wo.labor_cost,
  wo.created_at
FROM (VALUES
  ('WO-2026-00001', 'Ford F-150 #031', 'preventive', 'completed', 'normal', 'a0000000-0000-0000-0000-000000000002', 'Oil & Filter Change', 'Scheduled PM oil change', NULL, NULL, 'Changed oil and filter, topped off fluids', '2026-03-01'::date, '2026-03-01 08:00'::timestamptz, '2026-03-01 09:30'::timestamptz, 42.50, 75.00, '2026-02-25'::timestamptz),
  ('WO-2026-00002', 'Chevrolet Tahoe #016', 'preventive', 'completed', 'normal', 'a0000000-0000-0000-0000-000000000003', 'Tire Rotation', 'Scheduled tire rotation', NULL, NULL, 'Rotated all 4 tires, checked pressure', '2026-03-05'::date, '2026-03-05 10:00'::timestamptz, '2026-03-05 11:00'::timestamptz, 0, 50.00, '2026-03-01'::timestamptz),
  ('WO-2026-00003', 'Nissan Altima #005', 'corrective', 'in_progress', 'high', 'a0000000-0000-0000-0000-000000000002', 'Replace Alternator', 'Alternator failure - vehicle not starting', 'Vehicle wont start, battery keeps dying', 'Faulty alternator', NULL, '2026-04-02'::date, '2026-04-02 08:00'::timestamptz, NULL, 285.00, 150.00, '2026-04-01'::timestamptz),
  ('WO-2026-00004', 'Toyota Tacoma #034', 'corrective', 'parts_pending', 'high', 'a0000000-0000-0000-0000-000000000003', 'Transmission Fluid Leak', 'Transmission leaking fluid', 'Fluid puddle under vehicle', 'Damaged transmission pan gasket', NULL, '2026-04-03'::date, '2026-04-03 09:00'::timestamptz, NULL, 0, 100.00, '2026-04-02'::timestamptz),
  ('WO-2026-00005', 'Chevrolet Silverado #033', 'preventive', 'completed', 'normal', 'a0000000-0000-0000-0000-000000000002', 'Brake Inspection', 'Annual brake system check', NULL, NULL, 'Brakes within spec, no issues found', '2026-03-15'::date, '2026-03-15 08:00'::timestamptz, '2026-03-15 10:00'::timestamptz, 0, 100.00, '2026-03-10'::timestamptz),
  ('WO-2026-00006', 'Ford Fusion #008', 'corrective', 'open', 'critical', NULL, 'Engine Overheating', 'Engine temp gauge in red zone', 'Engine overheating after 10 min of driving', NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-04-04'::timestamptz),
  ('WO-2026-00007', 'Ford Explorer #017', 'preventive', 'assigned', 'normal', 'a0000000-0000-0000-0000-000000000002', 'Air Filter Replacement', 'Scheduled air filter change', NULL, NULL, NULL, '2026-04-07'::date, NULL, NULL, 35.00, 0, '2026-04-03'::timestamptz),
  ('WO-2026-00008', 'Ford Transit #051', 'preventive', 'completed', 'normal', 'a0000000-0000-0000-0000-000000000003', 'Oil & Filter Change', 'Scheduled PM', NULL, NULL, 'Completed without issues', '2026-03-20'::date, '2026-03-20 08:00'::timestamptz, '2026-03-20 09:15'::timestamptz, 38.00, 75.00, '2026-03-15'::timestamptz),
  ('WO-2026-00009', 'Jeep Grand Cherokee #019', 'corrective', 'in_progress', 'normal', 'a0000000-0000-0000-0000-000000000002', 'Replace Serpentine Belt', 'Belt squealing on startup', 'Squealing noise from engine bay', 'Worn serpentine belt', NULL, '2026-04-04'::date, '2026-04-04 13:00'::timestamptz, NULL, 45.00, 75.00, '2026-04-03'::timestamptz),
  ('WO-2026-00010', 'Chevrolet Express #054', 'corrective', 'in_progress', 'high', 'a0000000-0000-0000-0000-000000000003', 'AC Compressor Repair', 'No cold air from AC', 'AC blowing warm air', 'Low refrigerant, compressor clutch worn', NULL, '2026-04-04'::date, '2026-04-04 08:00'::timestamptz, NULL, 380.00, 200.00, '2026-04-02'::timestamptz),
  ('WO-2026-00011', 'Ford E-450 Shuttle #063', 'preventive', 'in_progress', 'critical', 'a0000000-0000-0000-0000-000000000002', 'Annual DOT Inspection', 'Federal annual inspection required', NULL, NULL, NULL, '2026-04-05'::date, '2026-04-05 07:00'::timestamptz, NULL, 0, 200.00, '2026-03-28'::timestamptz),
  ('WO-2026-00012', 'Hino 268A #069', 'corrective', 'in_progress', 'high', 'a0000000-0000-0000-0000-000000000003', 'Hydraulic Line Repair', 'Hydraulic leak on dump body', 'Hydraulic fluid leaking from body cylinder', 'Cracked hydraulic line', NULL, '2026-04-05'::date, '2026-04-05 08:00'::timestamptz, NULL, 125.00, 150.00, '2026-04-04'::timestamptz),
  ('WO-2026-00013', 'Chevrolet Colorado #037', 'preventive', 'completed', 'low', 'a0000000-0000-0000-0000-000000000002', 'Coolant Flush', 'Scheduled coolant service', NULL, NULL, 'Flushed and refilled coolant system', '2026-02-20'::date, '2026-02-20 08:00'::timestamptz, '2026-02-20 10:30'::timestamptz, 55.00, 100.00, '2026-02-15'::timestamptz),
  ('WO-2026-00014', 'GMC Sierra #040', 'preventive', 'completed', 'normal', 'a0000000-0000-0000-0000-000000000003', 'Tire Rotation & Balance', 'Scheduled tire service', NULL, NULL, 'Rotated and balanced all tires', '2026-03-10'::date, '2026-03-10 09:00'::timestamptz, '2026-03-10 10:30'::timestamptz, 0, 80.00, '2026-03-05'::timestamptz),
  ('WO-2026-00015', 'Mack Granite #071', 'preventive', 'assigned', 'critical', 'a0000000-0000-0000-0000-000000000002', 'Annual DOT Inspection', 'DOT annual for heavy truck', NULL, NULL, NULL, '2026-04-10'::date, NULL, NULL, 0, 0, '2026-04-01'::timestamptz),
  ('WO-2026-00016', 'Ford F-250 #035', 'preventive', 'completed', 'normal', 'a0000000-0000-0000-0000-000000000003', 'Fuel Filter Replacement', 'Diesel fuel filter change', NULL, NULL, 'Replaced primary and secondary fuel filters', '2026-03-25'::date, '2026-03-25 08:00'::timestamptz, '2026-03-25 09:00'::timestamptz, 65.00, 50.00, '2026-03-20'::timestamptz),
  ('WO-2026-00017', 'Chevrolet Equinox #024', 'corrective', 'open', 'normal', NULL, 'Battery Replacement', 'Battery not holding charge', 'Slow cranking, battery 5 years old', NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-04-05'::timestamptz),
  ('WO-2026-00018', 'Ram 1500 #042', 'corrective', 'cancelled', 'low', NULL, 'Evaluate for Surplus', 'High mileage, assess condition', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-03-01'::timestamptz),
  ('WO-2026-00019', 'Nissan Pathfinder #020', 'preventive', 'completed', 'normal', 'a0000000-0000-0000-0000-000000000002', 'Transmission Service', 'Scheduled trans fluid change', NULL, NULL, 'Drained and refilled transmission fluid', '2026-03-28'::date, '2026-03-28 08:00'::timestamptz, '2026-03-28 10:00'::timestamptz, 95.00, 100.00, '2026-03-22'::timestamptz),
  ('WO-2026-00020', 'GMC Canyon #047', 'inspection_defect', 'open', 'high', NULL, 'DVIR Defect - Cracked Windshield', 'Cracked windshield found during pre-trip', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-04-05'::timestamptz),
  ('WO-2026-00021', 'Ford Ranger #038', 'preventive', 'assigned', 'normal', 'a0000000-0000-0000-0000-000000000003', 'Oil & Filter Change', 'Scheduled PM', NULL, NULL, NULL, '2026-04-08'::date, NULL, NULL, 0, 0, '2026-04-04'::timestamptz),
  ('WO-2026-00022', 'Ford F-550 Flatbed #066', 'preventive', 'completed', 'normal', 'a0000000-0000-0000-0000-000000000002', 'Grease All Fittings', 'Chassis lube service', NULL, NULL, 'Greased all 28 fittings', '2026-03-12'::date, '2026-03-12 13:00'::timestamptz, '2026-03-12 14:30'::timestamptz, 15.00, 75.00, '2026-03-08'::timestamptz),
  ('WO-2026-00023', 'Honda Accord #003', 'corrective', 'completed', 'normal', 'a0000000-0000-0000-0000-000000000003', 'Replace Brake Pads - Front', 'Front brakes worn', 'Brakes squealing', 'Front pads at 2mm', 'Replaced front pads and resurfaced rotors', '2026-03-18'::date, '2026-03-18 08:00'::timestamptz, '2026-03-18 11:00'::timestamptz, 145.00, 150.00, '2026-03-14'::timestamptz),
  ('WO-2026-00024', 'Nissan Frontier #044', 'preventive', 'completed', 'normal', 'a0000000-0000-0000-0000-000000000002', 'Battery Test & Service', 'Semi-annual battery check', NULL, NULL, 'Battery load tested OK, cleaned terminals', '2026-02-28'::date, '2026-02-28 14:00'::timestamptz, '2026-02-28 14:45'::timestamptz, 0, 37.50, '2026-02-25'::timestamptz),
  ('WO-2026-00025', 'Ford E-450 Shuttle #061', 'preventive', 'completed', 'high', 'a0000000-0000-0000-0000-000000000003', 'Annual DOT Inspection', 'DOT annual inspection - shuttle bus', NULL, NULL, 'Passed - all items within spec', '2026-02-15'::date, '2026-02-15 07:00'::timestamptz, '2026-02-15 12:00'::timestamptz, 0, 250.00, '2026-02-10'::timestamptz),
  ('WO-2026-00026', 'Ram 3500 #048', 'emergency', 'completed', 'critical', 'a0000000-0000-0000-0000-000000000002', 'Flat Tire - Roadside', 'Blowout on William Floyd Pkwy', 'Right rear tire blowout while driving', 'Road debris puncture', 'Replaced tire, checked spare', '2026-03-22'::date, '2026-03-22 14:30'::timestamptz, '2026-03-22 16:00'::timestamptz, 320.00, 100.00, '2026-03-22'::timestamptz),
  ('WO-2026-00027', 'Ford F-150 #050', 'preventive', 'assigned', 'normal', 'a0000000-0000-0000-0000-000000000003', 'Oil & Filter Change', 'Scheduled PM', NULL, NULL, NULL, '2026-04-09'::date, NULL, NULL, 0, 0, '2026-04-05'::timestamptz),
  ('WO-2026-00028', 'Ram 1500 #032', 'recall', 'open', 'high', NULL, 'NHTSA Recall - Tailgate Latch', 'Manufacturer recall for tailgate', NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, '2026-04-03'::timestamptz),
  ('WO-2026-00029', 'Ford E-Transit #057', 'preventive', 'completed', 'normal', 'a0000000-0000-0000-0000-000000000002', 'EV Battery Health Check', 'Annual EV battery diagnostic', NULL, NULL, 'Battery health at 97%, all cells balanced', '2026-03-08'::date, '2026-03-08 09:00'::timestamptz, '2026-03-08 10:30'::timestamptz, 0, 100.00, '2026-03-05'::timestamptz),
  ('WO-2026-00030', 'Ford F-350 #046', 'preventive', 'on_hold', 'normal', 'a0000000-0000-0000-0000-000000000003', 'DEF System Service', 'Clean DEF injector and check system', NULL, NULL, NULL, '2026-04-06'::date, '2026-04-06 08:00'::timestamptz, NULL, 0, 50.00, '2026-04-01'::timestamptz)
) AS wo(wo_number, asset_num, type, status, priority, assigned_to, title, description, complaint, cause, correction, scheduled_date, started_at, completed_at, parts_cost, labor_cost, created_at)
JOIN public.assets a ON a.asset_number = wo.asset_num AND a.org_id = '00000000-0000-0000-0000-000000000001';


-- ── 50 Fuel Transactions ────────────────────────────────────
INSERT INTO public.fuel_transactions (org_id, asset_id, transaction_date, fuel_type, quantity_gallons, unit_price, total_cost, odometer_at_fill, station_name, source)
SELECT
  '00000000-0000-0000-0000-000000000001',
  a.id,
  ft.txn_date,
  ft.fuel_type,
  ft.gallons,
  ft.price,
  ft.total,
  ft.odo,
  ft.station,
  'manual'
FROM (VALUES
  ('Ford F-150 #031', '2026-03-01 07:30'::timestamptz, 'gasoline', 18.5, 3.29, 60.87, 34100, 'Shell - Rt 25A'),
  ('Ford F-150 #031', '2026-03-08 07:15'::timestamptz, 'gasoline', 16.2, 3.25, 52.65, 34350, 'Mobil - William Floyd'),
  ('Ford F-150 #031', '2026-03-15 07:45'::timestamptz, 'gasoline', 17.8, 3.31, 58.92, 34521, 'Shell - Rt 25A'),
  ('Chevrolet Tahoe #016', '2026-03-02 16:00'::timestamptz, 'gasoline', 22.4, 3.29, 73.70, 34100, 'BP - Rt 25'),
  ('Chevrolet Tahoe #016', '2026-03-10 15:30'::timestamptz, 'gasoline', 21.8, 3.35, 73.03, 34350, 'Shell - Rt 25A'),
  ('Chevrolet Silverado #033', '2026-03-03 06:45'::timestamptz, 'gasoline', 19.6, 3.25, 63.70, 45200, 'Mobil - William Floyd'),
  ('Chevrolet Silverado #033', '2026-03-12 07:00'::timestamptz, 'gasoline', 20.1, 3.29, 66.13, 45500, 'Shell - Rt 25A'),
  ('Ford F-250 #035', '2026-03-01 06:30'::timestamptz, 'diesel', 25.3, 3.89, 98.42, 30800, 'Sunoco - Rt 112'),
  ('Ford F-250 #035', '2026-03-10 06:45'::timestamptz, 'diesel', 23.8, 3.85, 91.63, 31100, 'Shell - Rt 25A'),
  ('Ram 2500 #036', '2026-03-05 07:00'::timestamptz, 'diesel', 28.6, 3.92, 112.11, 5100, 'Sunoco - Rt 112'),
  ('Toyota Camry #001', '2026-03-04 08:00'::timestamptz, 'gasoline', 12.3, 3.29, 40.47, 28400, 'BP - Rt 25'),
  ('Toyota Camry #001', '2026-03-18 08:15'::timestamptz, 'gasoline', 11.8, 3.31, 39.06, 28600, 'Shell - Rt 25A'),
  ('Honda Accord #003', '2026-03-02 07:30'::timestamptz, 'gasoline', 13.5, 3.25, 43.88, 41800, 'Mobil - William Floyd'),
  ('Honda Accord #003', '2026-03-16 07:45'::timestamptz, 'gasoline', 14.1, 3.29, 46.39, 42100, 'Shell - Rt 25A'),
  ('Ford Explorer #017', '2026-03-01 15:45'::timestamptz, 'gasoline', 20.7, 3.29, 68.10, 48500, 'BP - Rt 25'),
  ('Ford Explorer #017', '2026-03-15 16:00'::timestamptz, 'gasoline', 21.3, 3.35, 71.36, 48800, 'Shell - Rt 25A'),
  ('Nissan Pathfinder #020', '2026-03-03 07:15'::timestamptz, 'gasoline', 18.9, 3.25, 61.43, 40900, 'Mobil - William Floyd'),
  ('Nissan Pathfinder #020', '2026-03-17 07:30'::timestamptz, 'gasoline', 19.4, 3.31, 64.21, 41200, 'Shell - Rt 25A'),
  ('GMC Sierra #040', '2026-03-05 06:30'::timestamptz, 'gasoline', 17.6, 3.29, 57.90, 23100, 'BP - Rt 25'),
  ('GMC Sierra #040', '2026-03-19 06:45'::timestamptz, 'gasoline', 18.2, 3.31, 60.24, 23400, 'Shell - Rt 25A'),
  ('Ford Transit #051', '2026-03-02 07:00'::timestamptz, 'gasoline', 21.5, 3.25, 69.88, 23000, 'Sunoco - Rt 112'),
  ('Ford Transit #051', '2026-03-16 07:15'::timestamptz, 'gasoline', 22.1, 3.29, 72.71, 23300, 'Shell - Rt 25A'),
  ('Ford E-450 Shuttle #061', '2026-03-01 05:30'::timestamptz, 'diesel', 35.8, 3.89, 139.26, 67500, 'Sunoco - Rt 112'),
  ('Ford E-450 Shuttle #061', '2026-03-08 05:45'::timestamptz, 'diesel', 34.2, 3.85, 131.67, 67700, 'Shell - Rt 25A'),
  ('Ford E-450 Shuttle #061', '2026-03-15 06:00'::timestamptz, 'diesel', 36.5, 3.92, 143.08, 67890, 'Sunoco - Rt 112'),
  ('Ford F-550 Flatbed #066', '2026-03-03 07:00'::timestamptz, 'diesel', 30.2, 3.89, 117.48, 42800, 'Sunoco - Rt 112'),
  ('Ford F-550 Flatbed #066', '2026-03-17 07:15'::timestamptz, 'diesel', 28.9, 3.92, 113.29, 43100, 'Shell - Rt 25A'),
  ('Mack Granite #071', '2026-03-05 06:00'::timestamptz, 'diesel', 45.6, 3.89, 177.38, 67400, 'BNL Fuel Depot'),
  ('Mack Granite #071', '2026-03-12 06:15'::timestamptz, 'diesel', 42.3, 3.85, 162.86, 67650, 'BNL Fuel Depot'),
  ('Mack Granite #071', '2026-03-19 06:30'::timestamptz, 'diesel', 48.1, 3.92, 188.55, 67890, 'BNL Fuel Depot'),
  ('Chevrolet Silverado HD #043', '2026-03-04 06:30'::timestamptz, 'diesel', 26.7, 3.89, 103.86, 28300, 'Sunoco - Rt 112'),
  ('Ford F-350 #046', '2026-03-06 06:45'::timestamptz, 'diesel', 32.4, 3.92, 127.01, 24100, 'BNL Fuel Depot'),
  ('Ram 3500 #048', '2026-03-02 06:00'::timestamptz, 'diesel', 38.9, 3.85, 149.77, 40800, 'BNL Fuel Depot'),
  ('Ram 3500 #048', '2026-03-16 06:15'::timestamptz, 'diesel', 37.2, 3.92, 145.82, 41100, 'BNL Fuel Depot'),
  ('Hyundai Sonata #006', '2026-03-07 08:00'::timestamptz, 'gasoline', 13.8, 3.29, 45.40, 22100, 'Shell - Rt 25A'),
  ('Hyundai Sonata #006', '2026-03-21 08:15'::timestamptz, 'gasoline', 14.2, 3.31, 47.00, 22400, 'BP - Rt 25'),
  ('Toyota Corolla #009', '2026-03-10 08:30'::timestamptz, 'gasoline', 9.8, 3.29, 32.24, 4900, 'Shell - Rt 25A'),
  ('Subaru Outback #023', '2026-03-05 07:30'::timestamptz, 'gasoline', 16.4, 3.25, 53.30, 22000, 'Mobil - William Floyd'),
  ('Subaru Outback #023', '2026-03-19 07:45'::timestamptz, 'gasoline', 15.9, 3.31, 52.63, 22300, 'Shell - Rt 25A'),
  ('Ford Ranger #038', '2026-03-08 07:00'::timestamptz, 'gasoline', 14.7, 3.29, 48.36, 18900, 'BP - Rt 25'),
  ('Nissan Frontier #044', '2026-03-12 07:15'::timestamptz, 'gasoline', 15.3, 3.31, 50.64, 36400, 'Shell - Rt 25A'),
  ('Ford F-150 #050', '2026-03-06 06:30'::timestamptz, 'gasoline', 17.1, 3.25, 55.58, 21000, 'Mobil - William Floyd'),
  ('Ford F-150 #050', '2026-03-20 06:45'::timestamptz, 'gasoline', 16.8, 3.31, 55.61, 21300, 'Shell - Rt 25A'),
  ('International MV607 #067', '2026-03-07 06:00'::timestamptz, 'diesel', 28.5, 3.89, 110.87, 21000, 'BNL Fuel Depot'),
  ('Freightliner M2 #068', '2026-03-09 06:15'::timestamptz, 'diesel', 32.8, 3.85, 126.28, 56300, 'BNL Fuel Depot'),
  ('Peterbilt 567 #072', '2026-03-11 06:00'::timestamptz, 'diesel', 40.2, 3.92, 157.58, 45200, 'BNL Fuel Depot'),
  ('Kenworth T370 #073', '2026-03-14 06:30'::timestamptz, 'diesel', 35.6, 3.89, 138.48, 23100, 'BNL Fuel Depot'),
  ('Ram ProMaster #052', '2026-03-10 07:00'::timestamptz, 'gasoline', 20.8, 3.29, 68.43, 38400, 'Shell - Rt 25A'),
  ('Chevrolet Express #059', '2026-03-13 07:15'::timestamptz, 'gasoline', 22.3, 3.31, 73.81, 21000, 'BP - Rt 25'),
  ('Chevrolet 4500 Shuttle #062', '2026-03-18 05:30'::timestamptz, 'diesel', 33.7, 3.92, 132.10, 34200, 'BNL Fuel Depot')
) AS ft(asset_num, txn_date, fuel_type, gallons, price, total, odo, station)
JOIN public.assets a ON a.asset_number = ft.asset_num AND a.org_id = '00000000-0000-0000-0000-000000000001';
