// Seed mock data via Supabase REST API
const SUPABASE_URL = 'https://yldnuhayicivsildjpiu.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsZG51aGF5aWNpdnNpbGRqcGl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQyOTk0NSwiZXhwIjoyMDkxMDA1OTQ1fQ.Y0-gKgBxn-siUy73dWHNY1dbMY2x1VaaDY4kI8Y5JPY';

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

async function api(path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'POST', headers, body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${path}: ${res.status} ${err}`);
  }
  return res.json();
}

async function createUser(id, email) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST', headers,
    body: JSON.stringify({ id, email, password: 'Password123!', email_confirm: true }),
  });
  if (!res.ok) {
    const t = await res.text();
    if (t.includes('already been registered')) return;
    // ignore duplicates
  }
}

const ORG = '00000000-0000-0000-0000-000000000001';

const staff = [
  { id: 'a0000000-0000-0000-0000-000000000001', name: 'John Smith', email: 'jsmith@bsa.gov', role: 'driver', emp: 'BSA-1001' },
  { id: 'a0000000-0000-0000-0000-000000000002', name: 'Mike Johnson', email: 'mjohnson@bsa.gov', role: 'mechanic', emp: 'BSA-2001' },
  { id: 'a0000000-0000-0000-0000-000000000003', name: 'Sarah Lee', email: 'slee@bsa.gov', role: 'mechanic', emp: 'BSA-2002' },
  { id: 'a0000000-0000-0000-0000-000000000004', name: 'Tom Brown', email: 'tbrown@bsa.gov', role: 'shop_supervisor', emp: 'BSA-3001' },
  { id: 'a0000000-0000-0000-0000-000000000005', name: 'Karen Wilson', email: 'kwilson@bsa.gov', role: 'fleet_manager', emp: 'BSA-4001' },
  { id: 'a0000000-0000-0000-0000-000000000006', name: 'David Garcia', email: 'dgarcia@bsa.gov', role: 'driver', emp: 'BSA-1002' },
  { id: 'a0000000-0000-0000-0000-000000000007', name: 'Rachel Chen', email: 'rchen@bsa.gov', role: 'driver', emp: 'BSA-1003' },
  { id: 'a0000000-0000-0000-0000-000000000008', name: 'Amit Patel', email: 'apatel@bsa.gov', role: 'driver', emp: 'BSA-1004' },
  { id: 'a0000000-0000-0000-0000-000000000009', name: 'Jane Doe', email: 'jdoe@bsa.gov', role: 'driver', emp: 'BSA-1005' },
  { id: 'a0000000-0000-0000-0000-000000000010', name: 'Brian Martinez', email: 'bmartinez@bsa.gov', role: 'driver', emp: 'BSA-1006' },
];

const assets = [
  // Sedans (15)
  { n:'Toyota Camry #001', t:'sedan', cat:'vehicle', s:'active', y:2023, mk:'Toyota', md:'Camry LE', c:'White', f:'gasoline', vin:'4T1BF1FK0NU000001', lp:'NY-AA-0001', odo:28763, drv:'a0000000-0000-0000-0000-000000000001', dept:'Admin', loc:'Bldg 134 Lot', ad:'2023-01-15', cost:28500 },
  { n:'Toyota Camry #002', t:'sedan', cat:'vehicle', s:'active', y:2023, mk:'Toyota', md:'Camry SE', c:'Silver', f:'gasoline', vin:'4T1BF1FK0NU000002', lp:'NY-AA-0002', odo:31245, drv:null, dept:'Admin', loc:'Bldg 134 Lot', ad:'2023-02-01', cost:29200 },
  { n:'Honda Accord #003', t:'sedan', cat:'vehicle', s:'active', y:2022, mk:'Honda', md:'Accord LX', c:'Black', f:'gasoline', vin:'1HGCV1F10NA000003', lp:'NY-AA-0003', odo:42187, drv:'a0000000-0000-0000-0000-000000000006', dept:'Physics', loc:'Bldg 510 Lot', ad:'2022-03-10', cost:27800 },
  { n:'Honda Civic #004', t:'sedan', cat:'vehicle', s:'active', y:2024, mk:'Honda', md:'Civic Sport', c:'Blue', f:'gasoline', vin:'2HGFE2F50RH000004', lp:'NY-AA-0004', odo:8934, drv:null, dept:'Chemistry', loc:'Bldg 555 Lot', ad:'2024-01-20', cost:26500 },
  { n:'Nissan Altima #005', t:'sedan', cat:'vehicle', s:'in_shop', y:2021, mk:'Nissan', md:'Altima SV', c:'Gray', f:'gasoline', vin:'1N4BL4BV5MN000005', lp:'NY-AA-0005', odo:56231, drv:null, dept:'Biology', loc:'Bldg 463 Lot', ad:'2021-06-15', cost:25400 },
  { n:'Hyundai Sonata #006', t:'sedan', cat:'vehicle', s:'active', y:2023, mk:'Hyundai', md:'Sonata SEL', c:'White', f:'gasoline', vin:'5NPE34AF5NH000006', lp:'NY-AA-0006', odo:22456, drv:'a0000000-0000-0000-0000-000000000007', dept:'IT', loc:'Bldg 515 Lot', ad:'2023-04-05', cost:27100 },
  { n:'Chevrolet Malibu #007', t:'sedan', cat:'vehicle', s:'active', y:2022, mk:'Chevrolet', md:'Malibu LT', c:'Red', f:'gasoline', vin:'1G1ZD5ST3NF000007', lp:'NY-AA-0007', odo:38921, drv:null, dept:'Safety', loc:'Bldg 599 Lot', ad:'2022-08-20', cost:26300 },
  { n:'Ford Fusion #008', t:'sedan', cat:'vehicle', s:'out_of_service', y:2020, mk:'Ford', md:'Fusion SE', c:'Black', f:'gasoline', vin:'3FA6P0HD0LR000008', lp:'NY-AA-0008', odo:71234, drv:null, dept:'Admin', loc:'Bldg 134 Lot', ad:'2020-02-10', cost:24900 },
  { n:'Toyota Corolla #009', t:'sedan', cat:'vehicle', s:'active', y:2024, mk:'Toyota', md:'Corolla LE', c:'Silver', f:'hybrid', vin:'5YFS4MCE0RP000009', lp:'NY-AA-0009', odo:5123, drv:'a0000000-0000-0000-0000-000000000008', dept:'Environmental', loc:'Bldg 830 Lot', ad:'2024-03-01', cost:24200 },
  { n:'Kia K5 #010', t:'sedan', cat:'vehicle', s:'active', y:2023, mk:'Kia', md:'K5 LXS', c:'White', f:'gasoline', vin:'KNAGM4AD5P5000010', lp:'NY-AA-0010', odo:19872, drv:null, dept:'HR', loc:'Bldg 400 Lot', ad:'2023-05-15', cost:25800 },
  { n:'Subaru Legacy #011', t:'sedan', cat:'vehicle', s:'active', y:2023, mk:'Subaru', md:'Legacy Premium', c:'Blue', f:'gasoline', vin:'4S3BWAC63P3000011', lp:'NY-AA-0011', odo:24531, drv:null, dept:'Finance', loc:'Bldg 400 Lot', ad:'2023-07-01', cost:28900 },
  { n:'Mazda Mazda3 #012', t:'sedan', cat:'vehicle', s:'active', y:2022, mk:'Mazda', md:'Mazda3 Select', c:'Gray', f:'gasoline', vin:'3MZBPAAL7NM000012', lp:'NY-AA-0012', odo:35678, drv:'a0000000-0000-0000-0000-000000000009', dept:'Physics', loc:'Bldg 510 Lot', ad:'2022-11-10', cost:24700 },
  { n:'Chevrolet Impala #013', t:'sedan', cat:'vehicle', s:'surplus', y:2019, mk:'Chevrolet', md:'Impala LT', c:'Black', f:'gasoline', vin:'2G1105S37K9000013', lp:'NY-AA-0013', odo:89234, drv:null, dept:'Pool', loc:'Surplus Yard', ad:'2019-01-20', cost:28100 },
  { n:'Hyundai Elantra #014', t:'sedan', cat:'vehicle', s:'active', y:2024, mk:'Hyundai', md:'Elantra SEL', c:'White', f:'gasoline', vin:'KMHLL4AG0RU000014', lp:'NY-AA-0014', odo:3456, drv:null, dept:'Procurement', loc:'Bldg 400 Lot', ad:'2024-05-01', cost:23400 },
  { n:'Volkswagen Jetta #015', t:'sedan', cat:'vehicle', s:'active', y:2023, mk:'Volkswagen', md:'Jetta S', c:'Silver', f:'gasoline', vin:'3VWC57BU0PM000015', lp:'NY-AA-0015', odo:17234, drv:'a0000000-0000-0000-0000-000000000010', dept:'Engineering', loc:'Bldg 725 Lot', ad:'2023-09-15', cost:24100 },
  // SUVs (15)
  { n:'Chevrolet Tahoe #016', t:'suv', cat:'vehicle', s:'active', y:2023, mk:'Chevrolet', md:'Tahoe LT', c:'Black', f:'gasoline', vin:'1GNSKBKD5PR000016', lp:'NY-AB-0016', odo:34521, drv:'a0000000-0000-0000-0000-000000000001', dept:'Security', loc:'Bldg 599 Lot', ad:'2023-01-10', cost:52400 },
  { n:'Ford Explorer #017', t:'suv', cat:'vehicle', s:'active', y:2022, mk:'Ford', md:'Explorer XLT', c:'White', f:'gasoline', vin:'1FMSK8DH7NGA00017', lp:'NY-AB-0017', odo:48932, drv:null, dept:'Security', loc:'Bldg 599 Lot', ad:'2022-04-20', cost:41200 },
  { n:'Toyota Highlander #018', t:'suv', cat:'vehicle', s:'active', y:2024, mk:'Toyota', md:'Highlander LE', c:'Gray', f:'hybrid', vin:'5TDKBRFH0RS000018', lp:'NY-AB-0018', odo:7823, drv:null, dept:'Environmental', loc:'Bldg 830 Lot', ad:'2024-02-15', cost:39800 },
  { n:'Jeep Grand Cherokee #019', t:'suv', cat:'vehicle', s:'in_shop', y:2023, mk:'Jeep', md:'Grand Cherokee Laredo', c:'Green', f:'gasoline', vin:'1C4RJFAG5PC000019', lp:'NY-AB-0019', odo:29456, drv:null, dept:'Facilities', loc:'Bldg 134 Lot', ad:'2023-03-01', cost:38500 },
  { n:'Nissan Pathfinder #020', t:'suv', cat:'vehicle', s:'active', y:2022, mk:'Nissan', md:'Pathfinder SV', c:'White', f:'gasoline', vin:'5N1DR3CC7NC000020', lp:'NY-AB-0020', odo:41234, drv:'a0000000-0000-0000-0000-000000000006', dept:'Facilities', loc:'Bldg 134 Lot', ad:'2022-06-10', cost:36700 },
  { n:'Hyundai Tucson #021', t:'suv', cat:'vehicle', s:'active', y:2023, mk:'Hyundai', md:'Tucson SEL', c:'Blue', f:'hybrid', vin:'KM8JBCAL5PU000021', lp:'NY-AB-0021', odo:18923, drv:null, dept:'Chemistry', loc:'Bldg 555 Lot', ad:'2023-08-01', cost:33200 },
  { n:'Kia Sportage #022', t:'suv', cat:'vehicle', s:'active', y:2024, mk:'Kia', md:'Sportage LX', c:'Silver', f:'gasoline', vin:'KNDPMCAC0R7000022', lp:'NY-AB-0022', odo:4567, drv:null, dept:'IT', loc:'Bldg 515 Lot', ad:'2024-04-01', cost:30100 },
  { n:'Subaru Outback #023', t:'suv', cat:'vehicle', s:'active', y:2023, mk:'Subaru', md:'Outback Premium', c:'White', f:'gasoline', vin:'4S4BTACC5P3000023', lp:'NY-AB-0023', odo:22345, drv:'a0000000-0000-0000-0000-000000000007', dept:'Environmental', loc:'Bldg 830 Lot', ad:'2023-05-20', cost:34500 },
  { n:'Chevrolet Equinox #024', t:'suv', cat:'vehicle', s:'out_of_service', y:2020, mk:'Chevrolet', md:'Equinox LT', c:'Gray', f:'gasoline', vin:'2GNAXKEV0L6000024', lp:'NY-AB-0024', odo:67890, drv:null, dept:'Pool', loc:'Bldg 134 Lot', ad:'2020-07-15', cost:28900 },
  { n:'Toyota RAV4 #025', t:'suv', cat:'vehicle', s:'active', y:2023, mk:'Toyota', md:'RAV4 XLE', c:'Red', f:'hybrid', vin:'2T3A1RFV5PW000025', lp:'NY-AB-0025', odo:15678, drv:null, dept:'Biology', loc:'Bldg 463 Lot', ad:'2023-10-01', cost:35200 },
  { n:'Honda CR-V #026', t:'suv', cat:'vehicle', s:'active', y:2024, mk:'Honda', md:'CR-V EX', c:'White', f:'hybrid', vin:'7FARS6H57RE000026', lp:'NY-AB-0026', odo:6789, drv:'a0000000-0000-0000-0000-000000000008', dept:'Physics', loc:'Bldg 510 Lot', ad:'2024-01-10', cost:36100 },
  { n:'Ford Bronco Sport #027', t:'suv', cat:'vehicle', s:'active', y:2022, mk:'Ford', md:'Bronco Sport Big Bend', c:'Orange', f:'gasoline', vin:'3FMCR9B60NR000027', lp:'NY-AB-0027', odo:38234, drv:null, dept:'Facilities', loc:'Bldg 134 Lot', ad:'2022-09-01', cost:31400 },
  { n:'Mazda CX-5 #028', t:'suv', cat:'vehicle', s:'active', y:2023, mk:'Mazda', md:'CX-5 Select', c:'Black', f:'gasoline', vin:'JM3KFBBM5P1000028', lp:'NY-AB-0028', odo:21345, drv:'a0000000-0000-0000-0000-000000000009', dept:'Engineering', loc:'Bldg 725 Lot', ad:'2023-06-15', cost:32800 },
  { n:'Chevrolet Blazer #029', t:'suv', cat:'vehicle', s:'reserved', y:2024, mk:'Chevrolet', md:'Blazer LT', c:'White', f:'gasoline', vin:'3GNKBCRS0RS000029', lp:'NY-AB-0029', odo:2345, drv:null, dept:'Executive', loc:'Bldg 400 Lot', ad:'2024-06-01', cost:38700 },
  { n:'Volkswagen Tiguan #030', t:'suv', cat:'vehicle', s:'active', y:2023, mk:'Volkswagen', md:'Tiguan SE', c:'Gray', f:'gasoline', vin:'3VV3B7AX4PM000030', lp:'NY-AB-0030', odo:19876, drv:'a0000000-0000-0000-0000-000000000010', dept:'Safety', loc:'Bldg 599 Lot', ad:'2023-11-01', cost:31200 },
  // Pickups (20)
  { n:'Ford F-150 #031', t:'pickup', cat:'vehicle', s:'active', y:2023, mk:'Ford', md:'F-150 XLT', c:'White', f:'gasoline', vin:'1FTFW1E89NFA00031', lp:'NY-AC-0031', odo:34521, drv:'a0000000-0000-0000-0000-000000000001', dept:'Facilities', loc:'Bldg 134 Lot', ad:'2023-03-15', cost:45250 },
  { n:'Ram 1500 #032', t:'pickup', cat:'vehicle', s:'active', y:2024, mk:'Ram', md:'1500 Big Horn', c:'Black', f:'gasoline', vin:'1C6SRFFT5RN000032', lp:'NY-AC-0032', odo:8765, drv:null, dept:'Facilities', loc:'Bldg 134 Lot', ad:'2024-01-05', cost:44800 },
  { n:'Chevrolet Silverado #033', t:'pickup', cat:'vehicle', s:'active', y:2022, mk:'Chevrolet', md:'Silverado 1500 LT', c:'Silver', f:'gasoline', vin:'1GCUYDED5NZ000033', lp:'NY-AC-0033', odo:45678, drv:'a0000000-0000-0000-0000-000000000006', dept:'Grounds', loc:'Bldg 244 Lot', ad:'2022-05-20', cost:42100 },
  { n:'Toyota Tacoma #034', t:'pickup', cat:'vehicle', s:'in_shop', y:2023, mk:'Toyota', md:'Tacoma SR5', c:'Gray', f:'gasoline', vin:'3TMCZ5AN5PM000034', lp:'NY-AC-0034', odo:27890, drv:null, dept:'Maintenance', loc:'Shop', ad:'2023-07-10', cost:36400 },
  { n:'Ford F-250 #035', t:'pickup', cat:'vehicle', s:'active', y:2023, mk:'Ford', md:'F-250 XL', c:'White', f:'diesel', vin:'1FT7W2BT5PED00035', lp:'NY-AC-0035', odo:31234, drv:null, dept:'Facilities', loc:'Bldg 134 Lot', ad:'2023-02-28', cost:52300 },
  { n:'Ram 2500 #036', t:'pickup', cat:'vehicle', s:'active', y:2024, mk:'Ram', md:'2500 Tradesman', c:'White', f:'diesel', vin:'3C6UR5CL0RG000036', lp:'NY-AC-0036', odo:5432, drv:'a0000000-0000-0000-0000-000000000002', dept:'Maintenance', loc:'Shop', ad:'2024-02-15', cost:48700 },
  { n:'Chevrolet Colorado #037', t:'pickup', cat:'vehicle', s:'active', y:2022, mk:'Chevrolet', md:'Colorado Z71', c:'Red', f:'gasoline', vin:'1GCGTCEN7N1000037', lp:'NY-AC-0037', odo:39876, drv:null, dept:'Grounds', loc:'Bldg 244 Lot', ad:'2022-08-01', cost:35600 },
  { n:'Ford Ranger #038', t:'pickup', cat:'vehicle', s:'active', y:2023, mk:'Ford', md:'Ranger Lariat', c:'Blue', f:'gasoline', vin:'1FTER4FH1PLA00038', lp:'NY-AC-0038', odo:19234, drv:'a0000000-0000-0000-0000-000000000003', dept:'Environmental', loc:'Bldg 830 Lot', ad:'2023-09-01', cost:38200 },
  { n:'Toyota Tundra #039', t:'pickup', cat:'vehicle', s:'active', y:2021, mk:'Toyota', md:'Tundra SR5', c:'Silver', f:'gasoline', vin:'5TFDY5F10MX000039', lp:'NY-AC-0039', odo:52345, drv:null, dept:'Facilities', loc:'Bldg 134 Lot', ad:'2021-04-10', cost:41200 },
  { n:'GMC Sierra #040', t:'pickup', cat:'vehicle', s:'active', y:2023, mk:'GMC', md:'Sierra 1500 SLE', c:'White', f:'gasoline', vin:'1GTP8LED5PZ000040', lp:'NY-AC-0040', odo:23456, drv:null, dept:'Grounds', loc:'Bldg 244 Lot', ad:'2023-04-15', cost:44500 },
  { n:'Ford F-150 #041', t:'pickup', cat:'vehicle', s:'active', y:2024, mk:'Ford', md:'F-150 Lariat', c:'Black', f:'gasoline', vin:'1FTFW1E85RFA00041', lp:'NY-AC-0041', odo:4321, drv:'a0000000-0000-0000-0000-000000000004', dept:'Maintenance', loc:'Shop', ad:'2024-03-20', cost:51800 },
  { n:'Ram 1500 #042', t:'pickup', cat:'vehicle', s:'out_of_service', y:2019, mk:'Ram', md:'1500 Tradesman', c:'White', f:'gasoline', vin:'1C6RR7KT8KS000042', lp:'NY-AC-0042', odo:87654, drv:null, dept:'Pool', loc:'Surplus Yard', ad:'2019-06-01', cost:32400 },
  { n:'Chevrolet Silverado HD #043', t:'pickup', cat:'vehicle', s:'active', y:2023, mk:'Chevrolet', md:'Silverado 2500HD WT', c:'White', f:'diesel', vin:'1GC4YLEY5PF000043', lp:'NY-AC-0043', odo:28765, drv:null, dept:'Facilities', loc:'Bldg 134 Lot', ad:'2023-06-01', cost:49200 },
  { n:'Nissan Frontier #044', t:'pickup', cat:'vehicle', s:'active', y:2022, mk:'Nissan', md:'Frontier SV', c:'Gray', f:'gasoline', vin:'1N6ED1EK3NN000044', lp:'NY-AC-0044', odo:36789, drv:'a0000000-0000-0000-0000-000000000007', dept:'Engineering', loc:'Bldg 725 Lot', ad:'2022-10-15', cost:33100 },
  { n:'Toyota Tacoma #045', t:'pickup', cat:'vehicle', s:'active', y:2024, mk:'Toyota', md:'Tacoma TRD Sport', c:'Green', f:'gasoline', vin:'3TMCZ5AN0RM000045', lp:'NY-AC-0045', odo:3456, drv:null, dept:'Environmental', loc:'Bldg 830 Lot', ad:'2024-05-10', cost:39800 },
  { n:'Ford F-350 #046', t:'pickup', cat:'vehicle', s:'active', y:2023, mk:'Ford', md:'F-350 XL DRW', c:'White', f:'diesel', vin:'1FT8W3BT0PED00046', lp:'NY-AC-0046', odo:24567, drv:null, dept:'Facilities', loc:'Bldg 134 Lot', ad:'2023-08-15', cost:56200 },
  { n:'GMC Canyon #047', t:'pickup', cat:'vehicle', s:'active', y:2023, mk:'GMC', md:'Canyon AT4', c:'Red', f:'gasoline', vin:'1GTG6FEN5P1000047', lp:'NY-AC-0047', odo:16789, drv:'a0000000-0000-0000-0000-000000000008', dept:'Physics', loc:'Bldg 510 Lot', ad:'2023-12-01', cost:41200 },
  { n:'Ram 3500 #048', t:'pickup', cat:'vehicle', s:'active', y:2022, mk:'Ram', md:'3500 Tradesman', c:'White', f:'diesel', vin:'3C63R3CL5NG000048', lp:'NY-AC-0048', odo:41234, drv:null, dept:'Maintenance', loc:'Shop', ad:'2022-03-01', cost:51400 },
  { n:'Chevrolet Silverado #049', t:'pickup', cat:'vehicle', s:'active', y:2024, mk:'Chevrolet', md:'Silverado 1500 RST', c:'Black', f:'gasoline', vin:'1GCUDEED0RZ000049', lp:'NY-AC-0049', odo:6789, drv:null, dept:'Security', loc:'Bldg 599 Lot', ad:'2024-04-20', cost:47300 },
  { n:'Ford F-150 #050', t:'pickup', cat:'vehicle', s:'active', y:2023, mk:'Ford', md:'F-150 STX', c:'Silver', f:'gasoline', vin:'1FTEW1EP5PFA00050', lp:'NY-AC-0050', odo:21345, drv:'a0000000-0000-0000-0000-000000000009', dept:'Grounds', loc:'Bldg 244 Lot', ad:'2023-10-15', cost:42100 },
  // Vans (10)
  { n:'Ford Transit #051', t:'van', cat:'vehicle', s:'active', y:2023, mk:'Ford', md:'Transit 250', c:'White', f:'gasoline', vin:'1FTBR1C88PKA00051', lp:'NY-AD-0051', odo:23456, drv:null, dept:'Facilities', loc:'Bldg 134 Lot', ad:'2023-02-10', cost:38900 },
  { n:'Ram ProMaster #052', t:'van', cat:'vehicle', s:'active', y:2022, mk:'Ram', md:'ProMaster 2500', c:'White', f:'gasoline', vin:'3C6MRVJG8NE000052', lp:'NY-AD-0052', odo:38765, drv:null, dept:'Mail Services', loc:'Bldg 400 Lot', ad:'2022-05-01', cost:36400 },
  { n:'Mercedes Sprinter #053', t:'van', cat:'vehicle', s:'active', y:2024, mk:'Mercedes-Benz', md:'Sprinter 2500', c:'White', f:'diesel', vin:'W1Y4HBHY0RT000053', lp:'NY-AD-0053', odo:5678, drv:null, dept:'IT', loc:'Bldg 515 Lot', ad:'2024-01-20', cost:48200 },
  { n:'Chevrolet Express #054', t:'van', cat:'vehicle', s:'in_shop', y:2021, mk:'Chevrolet', md:'Express 2500', c:'White', f:'gasoline', vin:'1GCWGAFP2M1000054', lp:'NY-AD-0054', odo:54321, drv:null, dept:'Facilities', loc:'Shop', ad:'2021-07-10', cost:34100 },
  { n:'Ford Transit Connect #055', t:'van', cat:'vehicle', s:'active', y:2023, mk:'Ford', md:'Transit Connect XL', c:'Silver', f:'gasoline', vin:'NM0GE9E23P1000055', lp:'NY-AD-0055', odo:18234, drv:'a0000000-0000-0000-0000-000000000010', dept:'Supply', loc:'Bldg 400 Lot', ad:'2023-06-01', cost:31200 },
  { n:'Ram ProMaster City #056', t:'van', cat:'vehicle', s:'active', y:2023, mk:'Ram', md:'ProMaster City', c:'White', f:'gasoline', vin:'ZFBHRFAB5P6000056', lp:'NY-AD-0056', odo:14567, drv:null, dept:'Mail Services', loc:'Bldg 400 Lot', ad:'2023-04-20', cost:28900 },
  { n:'Ford E-Transit #057', t:'van', cat:'vehicle', s:'active', y:2024, mk:'Ford', md:'E-Transit 350', c:'White', f:'electric', vin:'1FTBW9CK4PKA00057', lp:'NY-AD-0057', odo:3456, drv:null, dept:'Sustainability', loc:'Bldg 830 Lot', ad:'2024-03-10', cost:52100 },
  { n:'Nissan NV200 #058', t:'van', cat:'vehicle', s:'active', y:2022, mk:'Nissan', md:'NV200 SV', c:'White', f:'gasoline', vin:'3N6CM0KN2NK000058', lp:'NY-AD-0058', odo:32456, drv:null, dept:'Supply', loc:'Bldg 400 Lot', ad:'2022-09-15', cost:26800 },
  { n:'Chevrolet Express #059', t:'van', cat:'vehicle', s:'active', y:2023, mk:'Chevrolet', md:'Express 3500', c:'White', f:'gasoline', vin:'1GAZGPFG0P1000059', lp:'NY-AD-0059', odo:21345, drv:null, dept:'Facilities', loc:'Bldg 134 Lot', ad:'2023-07-01', cost:38400 },
  { n:'Ford Transit HD #060', t:'van', cat:'vehicle', s:'active', y:2023, mk:'Ford', md:'Transit 350 HD', c:'White', f:'gasoline', vin:'1FTRS4X83PKA00060', lp:'NY-AD-0060', odo:16789, drv:null, dept:'Shipping', loc:'Bldg 197 Lot', ad:'2023-11-15', cost:42700 },
  // Buses (5)
  { n:'Ford E-450 Shuttle #061', t:'bus', cat:'vehicle', s:'active', y:2022, mk:'Ford', md:'E-450 Shuttle', c:'White', f:'diesel', vin:'1FDFE4FS4NDC00061', lp:'NY-AE-0061', odo:67890, drv:null, dept:'Transportation', loc:'Bus Depot', ad:'2022-01-15', cost:78500 },
  { n:'Chevrolet 4500 Shuttle #062', t:'bus', cat:'vehicle', s:'active', y:2023, mk:'Chevrolet', md:'4500 Shuttle', c:'White', f:'diesel', vin:'1GB6GUBL5P1000062', lp:'NY-AE-0062', odo:34567, drv:null, dept:'Transportation', loc:'Bus Depot', ad:'2023-03-10', cost:82300 },
  { n:'Ford E-450 Shuttle #063', t:'bus', cat:'vehicle', s:'in_shop', y:2021, mk:'Ford', md:'E-450 Shuttle', c:'Blue', f:'diesel', vin:'1FDFE4FS1MDC00063', lp:'NY-AE-0063', odo:89012, drv:null, dept:'Transportation', loc:'Shop', ad:'2021-06-20', cost:76200 },
  { n:'International CE Electric #064', t:'bus', cat:'vehicle', s:'active', y:2024, mk:'International', md:'CE Electric Bus', c:'Yellow', f:'electric', vin:'4DRBUSKR0RB000064', lp:'NY-AE-0064', odo:2345, drv:null, dept:'Transportation', loc:'Bus Depot', ad:'2024-01-10', cost:295000 },
  { n:'Ford Transit Passenger #065', t:'bus', cat:'vehicle', s:'active', y:2023, mk:'Ford', md:'Transit 350 Passenger', c:'White', f:'gasoline', vin:'1FBAX2C87PKA00065', lp:'NY-AE-0065', odo:28901, drv:null, dept:'Transportation', loc:'Bus Depot', ad:'2023-08-05', cost:45600 },
  // Trucks (5)
  { n:'Ford F-550 Flatbed #066', t:'truck', cat:'vehicle', s:'active', y:2022, mk:'Ford', md:'F-550 Flatbed', c:'White', f:'diesel', vin:'1FDUF5HT8NED00066', lp:'NY-AF-0066', odo:43210, drv:null, dept:'Facilities', loc:'Bldg 134 Lot', ad:'2022-04-01', cost:62300 },
  { n:'International MV607 #067', t:'truck', cat:'vehicle', s:'active', y:2023, mk:'International', md:'MV607', c:'White', f:'diesel', vin:'1HTMKAAN5PH000067', lp:'NY-AF-0067', odo:21345, drv:null, dept:'Facilities', loc:'Bldg 134 Lot', ad:'2023-02-15', cost:75400 },
  { n:'Freightliner M2 #068', t:'truck', cat:'vehicle', s:'active', y:2021, mk:'Freightliner', md:'M2 106', c:'White', f:'diesel', vin:'1FVACXDT5MHKM0068', lp:'NY-AF-0068', odo:56789, drv:null, dept:'Shipping', loc:'Bldg 197 Lot', ad:'2021-09-10', cost:82100 },
  { n:'Hino 268A #069', t:'truck', cat:'vehicle', s:'in_shop', y:2022, mk:'Hino', md:'268A', c:'White', f:'diesel', vin:'JHBNE8JT5NK000069', lp:'NY-AF-0069', odo:48901, drv:null, dept:'Waste Mgmt', loc:'Shop', ad:'2022-07-01', cost:68700 },
  { n:'Isuzu NPR HD #070', t:'truck', cat:'vehicle', s:'active', y:2023, mk:'Isuzu', md:'NPR HD', c:'White', f:'diesel', vin:'JALC4W163P7000070', lp:'NY-AF-0070', odo:18234, drv:null, dept:'Supply', loc:'Bldg 400 Lot', ad:'2023-05-20', cost:47500 },
  // Heavy Trucks (5)
  { n:'Mack Granite #071', t:'heavy_truck', cat:'vehicle', s:'active', y:2021, mk:'Mack', md:'Granite GR64F', c:'Yellow', f:'diesel', vin:'1M2AX04C5MM000071', lp:'NY-AG-0071', odo:67890, drv:null, dept:'Construction', loc:'Heavy Equip Yard', ad:'2021-03-15', cost:185000 },
  { n:'Peterbilt 567 #072', t:'heavy_truck', cat:'vehicle', s:'active', y:2022, mk:'Peterbilt', md:'567', c:'White', f:'diesel', vin:'1NPALU0X1ND000072', lp:'NY-AG-0072', odo:45678, drv:null, dept:'Waste Mgmt', loc:'Heavy Equip Yard', ad:'2022-01-20', cost:165000 },
  { n:'Kenworth T370 #073', t:'heavy_truck', cat:'vehicle', s:'active', y:2023, mk:'Kenworth', md:'T370', c:'White', f:'diesel', vin:'2NKMLD7X9PM000073', lp:'NY-AG-0073', odo:23456, drv:null, dept:'Facilities', loc:'Heavy Equip Yard', ad:'2023-04-10', cost:142000 },
  { n:'International HV507 #074', t:'heavy_truck', cat:'vehicle', s:'out_of_service', y:2019, mk:'International', md:'HV507', c:'White', f:'diesel', vin:'1HTMHAAN1KH000074', lp:'NY-AG-0074', odo:112345, drv:null, dept:'Pool', loc:'Surplus Yard', ad:'2019-05-01', cost:128000 },
  { n:'Volvo VHD 300 #075', t:'heavy_truck', cat:'vehicle', s:'active', y:2024, mk:'Volvo', md:'VHD 300', c:'Gray', f:'diesel', vin:'4V5KC9EH5RN000075', lp:'NY-AG-0075', odo:5678, drv:null, dept:'Construction', loc:'Heavy Equip Yard', ad:'2024-02-01', cost:175000 },
  // Trailers (5)
  { n:'Utility VS2DX Trailer #076', t:'trailer', cat:'vehicle', s:'active', y:2020, mk:'Utility', md:'VS2DX', c:'White', f:'none', vin:'1UYVS2534LU000076', lp:null, odo:0, drv:null, dept:'Shipping', loc:'Bldg 197 Lot', ad:'2020-03-01', cost:42000 },
  { n:'Great Dane CL Trailer #077', t:'trailer', cat:'vehicle', s:'active', y:2022, mk:'Great Dane', md:'Champion CL', c:'White', f:'none', vin:'1GRAA0624NB000077', lp:null, odo:0, drv:null, dept:'Shipping', loc:'Bldg 197 Lot', ad:'2022-06-15', cost:48500 },
  { n:'Load King Flatbed #078', t:'trailer', cat:'vehicle', s:'active', y:2021, mk:'Load King', md:'Flatbed 48ft', c:'Black', f:'none', vin:'5KJLA4827MG000078', lp:null, odo:0, drv:null, dept:'Construction', loc:'Heavy Equip Yard', ad:'2021-09-01', cost:38200 },
  { n:'Wabash DuraPlate #079', t:'trailer', cat:'vehicle', s:'in_shop', y:2019, mk:'Wabash', md:'DuraPlate', c:'White', f:'none', vin:'1JJV532D3KL000079', lp:null, odo:0, drv:null, dept:'Shipping', loc:'Shop', ad:'2019-04-20', cost:35600 },
  { n:'Utility 4000AE Trailer #080', t:'trailer', cat:'vehicle', s:'active', y:2023, mk:'Utility', md:'4000AE', c:'White', f:'none', vin:'1UYVS2539PU000080', lp:null, odo:0, drv:null, dept:'Waste Mgmt', loc:'Heavy Equip Yard', ad:'2023-01-10', cost:51200 },
  // Equipment (20)
  { n:'Toyota Forklift 8FG #081', t:'forklift', cat:'equipment', s:'active', y:2022, mk:'Toyota', md:'8FGCU25', c:'Orange', f:'propane', vin:null, lp:null, odo:0, drv:null, dept:'Shipping', loc:'Bldg 197', ad:'2022-02-01', cost:28500 },
  { n:'Hyster Forklift H50 #082', t:'forklift', cat:'equipment', s:'active', y:2023, mk:'Hyster', md:'H50FT', c:'Yellow', f:'propane', vin:null, lp:null, odo:0, drv:null, dept:'Shipping', loc:'Bldg 197', ad:'2023-01-15', cost:32100 },
  { n:'Crown Forklift FC5200 #083', t:'forklift', cat:'equipment', s:'in_shop', y:2020, mk:'Crown', md:'FC5200', c:'Red', f:'electric', vin:null, lp:null, odo:0, drv:null, dept:'Supply', loc:'Shop', ad:'2020-06-10', cost:24800 },
  { n:'Yale Forklift GLP050 #084', t:'forklift', cat:'equipment', s:'active', y:2024, mk:'Yale', md:'GLP050VX', c:'Yellow', f:'propane', vin:null, lp:null, odo:0, drv:null, dept:'Construction', loc:'Heavy Equip Yard', ad:'2024-03-01', cost:35400 },
  { n:'Raymond Forklift 4250 #085', t:'forklift', cat:'equipment', s:'active', y:2021, mk:'Raymond', md:'4250', c:'Green', f:'electric', vin:null, lp:null, odo:0, drv:null, dept:'Supply', loc:'Bldg 400', ad:'2021-11-01', cost:38700 },
  { n:'CAT Loader 926M #086', t:'loader', cat:'equipment', s:'active', y:2021, mk:'Caterpillar', md:'926M', c:'Yellow', f:'diesel', vin:null, lp:null, odo:0, drv:null, dept:'Construction', loc:'Heavy Equip Yard', ad:'2021-04-15', cost:185000 },
  { n:'John Deere Loader 324G #087', t:'loader', cat:'equipment', s:'active', y:2023, mk:'John Deere', md:'324G', c:'Yellow', f:'diesel', vin:null, lp:null, odo:0, drv:null, dept:'Grounds', loc:'Bldg 244', ad:'2023-02-20', cost:62400 },
  { n:'Bobcat Loader S76 #088', t:'loader', cat:'equipment', s:'active', y:2022, mk:'Bobcat', md:'S76', c:'White', f:'diesel', vin:null, lp:null, odo:0, drv:null, dept:'Facilities', loc:'Bldg 134', ad:'2022-08-10', cost:54200 },
  { n:'CAT Generator XQ200 #089', t:'generator', cat:'equipment', s:'active', y:2022, mk:'Caterpillar', md:'XQ200', c:'Yellow', f:'diesel', vin:null, lp:null, odo:0, drv:null, dept:'Facilities', loc:'Bldg 134', ad:'2022-03-01', cost:95000 },
  { n:'Generac Generator SG080 #090', t:'generator', cat:'equipment', s:'active', y:2023, mk:'Generac', md:'SG080', c:'Gray', f:'diesel', vin:null, lp:null, odo:0, drv:null, dept:'Data Center', loc:'Bldg 515', ad:'2023-05-15', cost:42300 },
  { n:'Kohler Generator KD800 #091', t:'generator', cat:'equipment', s:'active', y:2021, mk:'Kohler', md:'KD800', c:'Green', f:'diesel', vin:null, lp:null, odo:0, drv:null, dept:'Emergency', loc:'Bldg 510', ad:'2021-10-01', cost:125000 },
  { n:'John Deere Mower 1025R #092', t:'mower', cat:'equipment', s:'active', y:2023, mk:'John Deere', md:'1025R', c:'Green', f:'diesel', vin:null, lp:null, odo:0, drv:null, dept:'Grounds', loc:'Bldg 244', ad:'2023-03-01', cost:18500 },
  { n:'Toro Mower GM4010 #093', t:'mower', cat:'equipment', s:'active', y:2022, mk:'Toro', md:'Groundsmaster 4010', c:'Red', f:'diesel', vin:null, lp:null, odo:0, drv:null, dept:'Grounds', loc:'Bldg 244', ad:'2022-04-15', cost:62000 },
  { n:'Kubota Mower ZD1211 #094', t:'mower', cat:'equipment', s:'active', y:2024, mk:'Kubota', md:'ZD1211', c:'Orange', f:'diesel', vin:null, lp:null, odo:0, drv:null, dept:'Grounds', loc:'Bldg 244', ad:'2024-02-10', cost:14200 },
  { n:'John Deere Mower Z930M #095', t:'mower', cat:'equipment', s:'out_of_service', y:2020, mk:'John Deere', md:'Z930M', c:'Green', f:'gasoline', vin:null, lp:null, odo:0, drv:null, dept:'Grounds', loc:'Bldg 244', ad:'2020-05-01', cost:11800 },
  { n:'Club Car Carryall 500 #096', t:'utility_cart', cat:'equipment', s:'active', y:2023, mk:'Club Car', md:'Carryall 500', c:'Green', f:'electric', vin:null, lp:null, odo:0, drv:null, dept:'Facilities', loc:'Bldg 134', ad:'2023-01-10', cost:12400 },
  { n:'E-Z-GO Express L6 #097', t:'utility_cart', cat:'equipment', s:'active', y:2022, mk:'E-Z-GO', md:'Express L6', c:'White', f:'electric', vin:null, lp:null, odo:0, drv:null, dept:'Transportation', loc:'Bus Depot', ad:'2022-06-01', cost:9800 },
  { n:'Cushman Hauler 1200X #098', t:'utility_cart', cat:'equipment', s:'active', y:2024, mk:'Cushman', md:'Hauler 1200X', c:'Black', f:'electric', vin:null, lp:null, odo:0, drv:null, dept:'Security', loc:'Bldg 599', ad:'2024-01-15', cost:14500 },
  { n:'Club Car Carryall 700 #099', t:'utility_cart', cat:'equipment', s:'active', y:2023, mk:'Club Car', md:'Carryall 700', c:'Green', f:'electric', vin:null, lp:null, odo:0, drv:null, dept:'Grounds', loc:'Bldg 244', ad:'2023-09-01', cost:16200 },
  { n:'Polaris Ranger 500 #100', t:'utility_cart', cat:'equipment', s:'active', y:2022, mk:'Polaris', md:'Ranger 500', c:'Olive', f:'gasoline', vin:null, lp:null, odo:0, drv:null, dept:'Environmental', loc:'Bldg 830', ad:'2022-11-10', cost:11900 },
];

async function main() {
  console.log('Creating 10 staff users...');
  for (const s of staff) {
    await createUser(s.id, s.email);
  }

  console.log('Creating 10 staff profiles...');
  try {
    await api('profiles', staff.map(s => ({
      id: s.id, org_id: ORG, full_name: s.name, email: s.email, role: s.role, employee_id: s.emp,
    })));
  } catch (e) { console.log('  profiles:', e.message.slice(0, 100)); }

  console.log('Creating 100 assets...');
  const assetRows = assets.map(a => ({
    org_id: ORG, asset_number: a.n, asset_type: a.t, category: a.cat, status: a.s,
    year: a.y, make: a.mk, model: a.md, color: a.c, fuel_type: a.f, vin: a.vin,
    license_plate: a.lp, current_odometer: a.odo, assigned_driver_id: a.drv,
    assigned_department: a.dept, home_location: a.loc, acquisition_date: a.ad,
    acquisition_cost: a.cost,
  }));
  // Insert in batches of 25
  for (let i = 0; i < assetRows.length; i += 25) {
    const batch = assetRows.slice(i, i + 25);
    try {
      await api('assets', batch);
      console.log(`  Inserted assets ${i+1}-${i+batch.length}`);
    } catch (e) { console.log(`  Batch ${i}: ${e.message.slice(0, 120)}`); }
  }

  // Fetch asset IDs for work orders and fuel
  console.log('Fetching asset IDs...');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/assets?org_id=eq.${ORG}&select=id,asset_number`, { headers });
  const allAssets = await res.json();
  const assetMap = {};
  for (const a of allAssets) assetMap[a.asset_number] = a.id;

  console.log(`  Found ${Object.keys(assetMap).length} assets`);

  // Work orders
  console.log('Creating 30 work orders...');
  const wos = [
    { asset:'Ford F-150 #031', num:'WO-2026-00001', type:'preventive', status:'completed', priority:'normal', assigned:'a0000000-0000-0000-0000-000000000002', title:'Oil & Filter Change', desc:'Scheduled PM oil change', correction:'Changed oil and filter', sched:'2026-03-01', started:'2026-03-01T08:00:00Z', completed:'2026-03-01T09:30:00Z', parts:42.50, labor:75 },
    { asset:'Chevrolet Tahoe #016', num:'WO-2026-00002', type:'preventive', status:'completed', priority:'normal', assigned:'a0000000-0000-0000-0000-000000000003', title:'Tire Rotation', desc:'Scheduled tire rotation', correction:'Rotated all 4 tires', sched:'2026-03-05', started:'2026-03-05T10:00:00Z', completed:'2026-03-05T11:00:00Z', parts:0, labor:50 },
    { asset:'Nissan Altima #005', num:'WO-2026-00003', type:'corrective', status:'in_progress', priority:'high', assigned:'a0000000-0000-0000-0000-000000000002', title:'Replace Alternator', desc:'Alternator failure', correction:null, sched:'2026-04-02', started:'2026-04-02T08:00:00Z', completed:null, parts:285, labor:150 },
    { asset:'Toyota Tacoma #034', num:'WO-2026-00004', type:'corrective', status:'parts_pending', priority:'high', assigned:'a0000000-0000-0000-0000-000000000003', title:'Transmission Fluid Leak', desc:'Transmission leaking fluid', correction:null, sched:'2026-04-03', started:'2026-04-03T09:00:00Z', completed:null, parts:0, labor:100 },
    { asset:'Chevrolet Silverado #033', num:'WO-2026-00005', type:'preventive', status:'completed', priority:'normal', assigned:'a0000000-0000-0000-0000-000000000002', title:'Brake Inspection', desc:'Annual brake check', correction:'Brakes within spec', sched:'2026-03-15', started:'2026-03-15T08:00:00Z', completed:'2026-03-15T10:00:00Z', parts:0, labor:100 },
    { asset:'Ford Fusion #008', num:'WO-2026-00006', type:'corrective', status:'open', priority:'critical', assigned:null, title:'Engine Overheating', desc:'Engine temp in red zone', correction:null, sched:null, started:null, completed:null, parts:0, labor:0 },
    { asset:'Ford Explorer #017', num:'WO-2026-00007', type:'preventive', status:'assigned', priority:'normal', assigned:'a0000000-0000-0000-0000-000000000002', title:'Air Filter Replacement', desc:'Scheduled air filter change', correction:null, sched:'2026-04-07', started:null, completed:null, parts:35, labor:0 },
    { asset:'Ford Transit #051', num:'WO-2026-00008', type:'preventive', status:'completed', priority:'normal', assigned:'a0000000-0000-0000-0000-000000000003', title:'Oil & Filter Change', desc:'Scheduled PM', correction:'Completed without issues', sched:'2026-03-20', started:'2026-03-20T08:00:00Z', completed:'2026-03-20T09:15:00Z', parts:38, labor:75 },
    { asset:'Jeep Grand Cherokee #019', num:'WO-2026-00009', type:'corrective', status:'in_progress', priority:'normal', assigned:'a0000000-0000-0000-0000-000000000002', title:'Replace Serpentine Belt', desc:'Belt squealing', correction:null, sched:'2026-04-04', started:'2026-04-04T13:00:00Z', completed:null, parts:45, labor:75 },
    { asset:'Chevrolet Express #054', num:'WO-2026-00010', type:'corrective', status:'in_progress', priority:'high', assigned:'a0000000-0000-0000-0000-000000000003', title:'AC Compressor Repair', desc:'No cold air', correction:null, sched:'2026-04-04', started:'2026-04-04T08:00:00Z', completed:null, parts:380, labor:200 },
    { asset:'Ford E-450 Shuttle #063', num:'WO-2026-00011', type:'preventive', status:'in_progress', priority:'critical', assigned:'a0000000-0000-0000-0000-000000000002', title:'Annual DOT Inspection', desc:'Federal annual inspection', correction:null, sched:'2026-04-05', started:'2026-04-05T07:00:00Z', completed:null, parts:0, labor:200 },
    { asset:'Hino 268A #069', num:'WO-2026-00012', type:'corrective', status:'in_progress', priority:'high', assigned:'a0000000-0000-0000-0000-000000000003', title:'Hydraulic Line Repair', desc:'Hydraulic leak', correction:null, sched:'2026-04-05', started:'2026-04-05T08:00:00Z', completed:null, parts:125, labor:150 },
    { asset:'Chevrolet Colorado #037', num:'WO-2026-00013', type:'preventive', status:'completed', priority:'low', assigned:'a0000000-0000-0000-0000-000000000002', title:'Coolant Flush', desc:'Scheduled coolant service', correction:'Flushed and refilled', sched:'2026-02-20', started:'2026-02-20T08:00:00Z', completed:'2026-02-20T10:30:00Z', parts:55, labor:100 },
    { asset:'GMC Sierra #040', num:'WO-2026-00014', type:'preventive', status:'completed', priority:'normal', assigned:'a0000000-0000-0000-0000-000000000003', title:'Tire Rotation & Balance', desc:'Scheduled tire service', correction:'Rotated and balanced all tires', sched:'2026-03-10', started:'2026-03-10T09:00:00Z', completed:'2026-03-10T10:30:00Z', parts:0, labor:80 },
    { asset:'Mack Granite #071', num:'WO-2026-00015', type:'preventive', status:'assigned', priority:'critical', assigned:'a0000000-0000-0000-0000-000000000002', title:'Annual DOT Inspection', desc:'DOT annual for heavy truck', correction:null, sched:'2026-04-10', started:null, completed:null, parts:0, labor:0 },
    { asset:'Ford F-250 #035', num:'WO-2026-00016', type:'preventive', status:'completed', priority:'normal', assigned:'a0000000-0000-0000-0000-000000000003', title:'Fuel Filter Replacement', desc:'Diesel fuel filter change', correction:'Replaced fuel filters', sched:'2026-03-25', started:'2026-03-25T08:00:00Z', completed:'2026-03-25T09:00:00Z', parts:65, labor:50 },
    { asset:'Chevrolet Equinox #024', num:'WO-2026-00017', type:'corrective', status:'open', priority:'normal', assigned:null, title:'Battery Replacement', desc:'Battery not holding charge', correction:null, sched:null, started:null, completed:null, parts:0, labor:0 },
    { asset:'Ram 1500 #042', num:'WO-2026-00018', type:'corrective', status:'cancelled', priority:'low', assigned:null, title:'Evaluate for Surplus', desc:'High mileage assessment', correction:null, sched:null, started:null, completed:null, parts:0, labor:0 },
    { asset:'Nissan Pathfinder #020', num:'WO-2026-00019', type:'preventive', status:'completed', priority:'normal', assigned:'a0000000-0000-0000-0000-000000000002', title:'Transmission Service', desc:'Scheduled trans fluid change', correction:'Drained and refilled', sched:'2026-03-28', started:'2026-03-28T08:00:00Z', completed:'2026-03-28T10:00:00Z', parts:95, labor:100 },
    { asset:'GMC Canyon #047', num:'WO-2026-00020', type:'inspection_defect', status:'open', priority:'high', assigned:null, title:'DVIR Defect - Cracked Windshield', desc:'Found during pre-trip', correction:null, sched:null, started:null, completed:null, parts:0, labor:0 },
    { asset:'Ford Ranger #038', num:'WO-2026-00021', type:'preventive', status:'assigned', priority:'normal', assigned:'a0000000-0000-0000-0000-000000000003', title:'Oil & Filter Change', desc:'Scheduled PM', correction:null, sched:'2026-04-08', started:null, completed:null, parts:0, labor:0 },
    { asset:'Ford F-550 Flatbed #066', num:'WO-2026-00022', type:'preventive', status:'completed', priority:'normal', assigned:'a0000000-0000-0000-0000-000000000002', title:'Grease All Fittings', desc:'Chassis lube service', correction:'Greased all 28 fittings', sched:'2026-03-12', started:'2026-03-12T13:00:00Z', completed:'2026-03-12T14:30:00Z', parts:15, labor:75 },
    { asset:'Honda Accord #003', num:'WO-2026-00023', type:'corrective', status:'completed', priority:'normal', assigned:'a0000000-0000-0000-0000-000000000003', title:'Replace Brake Pads - Front', desc:'Front brakes worn', correction:'Replaced pads and resurfaced rotors', sched:'2026-03-18', started:'2026-03-18T08:00:00Z', completed:'2026-03-18T11:00:00Z', parts:145, labor:150 },
    { asset:'Nissan Frontier #044', num:'WO-2026-00024', type:'preventive', status:'completed', priority:'normal', assigned:'a0000000-0000-0000-0000-000000000002', title:'Battery Test & Service', desc:'Semi-annual battery check', correction:'Battery OK, cleaned terminals', sched:'2026-02-28', started:'2026-02-28T14:00:00Z', completed:'2026-02-28T14:45:00Z', parts:0, labor:37.5 },
    { asset:'Ford E-450 Shuttle #061', num:'WO-2026-00025', type:'preventive', status:'completed', priority:'high', assigned:'a0000000-0000-0000-0000-000000000003', title:'Annual DOT Inspection', desc:'DOT annual - shuttle bus', correction:'Passed all items', sched:'2026-02-15', started:'2026-02-15T07:00:00Z', completed:'2026-02-15T12:00:00Z', parts:0, labor:250 },
    { asset:'Ram 3500 #048', num:'WO-2026-00026', type:'emergency', status:'completed', priority:'critical', assigned:'a0000000-0000-0000-0000-000000000002', title:'Flat Tire - Roadside', desc:'Blowout on William Floyd Pkwy', correction:'Replaced tire', sched:'2026-03-22', started:'2026-03-22T14:30:00Z', completed:'2026-03-22T16:00:00Z', parts:320, labor:100 },
    { asset:'Ford F-150 #050', num:'WO-2026-00027', type:'preventive', status:'assigned', priority:'normal', assigned:'a0000000-0000-0000-0000-000000000003', title:'Oil & Filter Change', desc:'Scheduled PM', correction:null, sched:'2026-04-09', started:null, completed:null, parts:0, labor:0 },
    { asset:'Ram 1500 #032', num:'WO-2026-00028', type:'recall', status:'open', priority:'high', assigned:null, title:'NHTSA Recall - Tailgate Latch', desc:'Manufacturer recall', correction:null, sched:null, started:null, completed:null, parts:0, labor:0 },
    { asset:'Ford E-Transit #057', num:'WO-2026-00029', type:'preventive', status:'completed', priority:'normal', assigned:'a0000000-0000-0000-0000-000000000002', title:'EV Battery Health Check', desc:'Annual EV diagnostic', correction:'Battery at 97%', sched:'2026-03-08', started:'2026-03-08T09:00:00Z', completed:'2026-03-08T10:30:00Z', parts:0, labor:100 },
    { asset:'Ford F-350 #046', num:'WO-2026-00030', type:'preventive', status:'on_hold', priority:'normal', assigned:'a0000000-0000-0000-0000-000000000003', title:'DEF System Service', desc:'Clean DEF injector', correction:null, sched:'2026-04-06', started:'2026-04-06T08:00:00Z', completed:null, parts:0, labor:50 },
  ];

  for (const wo of wos) {
    const aid = assetMap[wo.asset];
    if (!aid) { console.log(`  Skip WO ${wo.num}: asset ${wo.asset} not found`); continue; }
    try {
      await api('work_orders', {
        org_id: ORG, work_order_number: wo.num, asset_id: aid, type: wo.type,
        status: wo.status, priority: wo.priority, assigned_to: wo.assigned,
        title: wo.title, description: wo.desc, correction: wo.correction,
        scheduled_date: wo.sched, started_at: wo.started, completed_at: wo.completed,
        total_parts_cost: wo.parts, total_labor_cost: wo.labor,
      });
    } catch (e) { console.log(`  WO ${wo.num}: ${e.message.slice(0, 80)}`); }
  }
  console.log('  Done work orders');

  // Fuel transactions
  console.log('Creating 50 fuel transactions...');
  const fuels = [
    { a:'Ford F-150 #031', d:'2026-03-01T07:30:00Z', ft:'gasoline', g:18.5, p:3.29, t:60.87, o:34100, st:'Shell - Rt 25A' },
    { a:'Ford F-150 #031', d:'2026-03-08T07:15:00Z', ft:'gasoline', g:16.2, p:3.25, t:52.65, o:34350, st:'Mobil - William Floyd' },
    { a:'Ford F-150 #031', d:'2026-03-15T07:45:00Z', ft:'gasoline', g:17.8, p:3.31, t:58.92, o:34521, st:'Shell - Rt 25A' },
    { a:'Chevrolet Tahoe #016', d:'2026-03-02T16:00:00Z', ft:'gasoline', g:22.4, p:3.29, t:73.70, o:34100, st:'BP - Rt 25' },
    { a:'Chevrolet Tahoe #016', d:'2026-03-10T15:30:00Z', ft:'gasoline', g:21.8, p:3.35, t:73.03, o:34350, st:'Shell - Rt 25A' },
    { a:'Chevrolet Silverado #033', d:'2026-03-03T06:45:00Z', ft:'gasoline', g:19.6, p:3.25, t:63.70, o:45200, st:'Mobil - William Floyd' },
    { a:'Chevrolet Silverado #033', d:'2026-03-12T07:00:00Z', ft:'gasoline', g:20.1, p:3.29, t:66.13, o:45500, st:'Shell - Rt 25A' },
    { a:'Ford F-250 #035', d:'2026-03-01T06:30:00Z', ft:'diesel', g:25.3, p:3.89, t:98.42, o:30800, st:'Sunoco - Rt 112' },
    { a:'Ford F-250 #035', d:'2026-03-10T06:45:00Z', ft:'diesel', g:23.8, p:3.85, t:91.63, o:31100, st:'Shell - Rt 25A' },
    { a:'Ram 2500 #036', d:'2026-03-05T07:00:00Z', ft:'diesel', g:28.6, p:3.92, t:112.11, o:5100, st:'Sunoco - Rt 112' },
    { a:'Toyota Camry #001', d:'2026-03-04T08:00:00Z', ft:'gasoline', g:12.3, p:3.29, t:40.47, o:28400, st:'BP - Rt 25' },
    { a:'Toyota Camry #001', d:'2026-03-18T08:15:00Z', ft:'gasoline', g:11.8, p:3.31, t:39.06, o:28600, st:'Shell - Rt 25A' },
    { a:'Honda Accord #003', d:'2026-03-02T07:30:00Z', ft:'gasoline', g:13.5, p:3.25, t:43.88, o:41800, st:'Mobil - William Floyd' },
    { a:'Honda Accord #003', d:'2026-03-16T07:45:00Z', ft:'gasoline', g:14.1, p:3.29, t:46.39, o:42100, st:'Shell - Rt 25A' },
    { a:'Ford Explorer #017', d:'2026-03-01T15:45:00Z', ft:'gasoline', g:20.7, p:3.29, t:68.10, o:48500, st:'BP - Rt 25' },
    { a:'Ford Explorer #017', d:'2026-03-15T16:00:00Z', ft:'gasoline', g:21.3, p:3.35, t:71.36, o:48800, st:'Shell - Rt 25A' },
    { a:'Nissan Pathfinder #020', d:'2026-03-03T07:15:00Z', ft:'gasoline', g:18.9, p:3.25, t:61.43, o:40900, st:'Mobil - William Floyd' },
    { a:'Nissan Pathfinder #020', d:'2026-03-17T07:30:00Z', ft:'gasoline', g:19.4, p:3.31, t:64.21, o:41200, st:'Shell - Rt 25A' },
    { a:'GMC Sierra #040', d:'2026-03-05T06:30:00Z', ft:'gasoline', g:17.6, p:3.29, t:57.90, o:23100, st:'BP - Rt 25' },
    { a:'GMC Sierra #040', d:'2026-03-19T06:45:00Z', ft:'gasoline', g:18.2, p:3.31, t:60.24, o:23400, st:'Shell - Rt 25A' },
    { a:'Ford Transit #051', d:'2026-03-02T07:00:00Z', ft:'gasoline', g:21.5, p:3.25, t:69.88, o:23000, st:'Sunoco - Rt 112' },
    { a:'Ford Transit #051', d:'2026-03-16T07:15:00Z', ft:'gasoline', g:22.1, p:3.29, t:72.71, o:23300, st:'Shell - Rt 25A' },
    { a:'Ford E-450 Shuttle #061', d:'2026-03-01T05:30:00Z', ft:'diesel', g:35.8, p:3.89, t:139.26, o:67500, st:'Sunoco - Rt 112' },
    { a:'Ford E-450 Shuttle #061', d:'2026-03-08T05:45:00Z', ft:'diesel', g:34.2, p:3.85, t:131.67, o:67700, st:'Shell - Rt 25A' },
    { a:'Ford E-450 Shuttle #061', d:'2026-03-15T06:00:00Z', ft:'diesel', g:36.5, p:3.92, t:143.08, o:67890, st:'Sunoco - Rt 112' },
    { a:'Ford F-550 Flatbed #066', d:'2026-03-03T07:00:00Z', ft:'diesel', g:30.2, p:3.89, t:117.48, o:42800, st:'Sunoco - Rt 112' },
    { a:'Ford F-550 Flatbed #066', d:'2026-03-17T07:15:00Z', ft:'diesel', g:28.9, p:3.92, t:113.29, o:43100, st:'Shell - Rt 25A' },
    { a:'Mack Granite #071', d:'2026-03-05T06:00:00Z', ft:'diesel', g:45.6, p:3.89, t:177.38, o:67400, st:'BNL Fuel Depot' },
    { a:'Mack Granite #071', d:'2026-03-12T06:15:00Z', ft:'diesel', g:42.3, p:3.85, t:162.86, o:67650, st:'BNL Fuel Depot' },
    { a:'Mack Granite #071', d:'2026-03-19T06:30:00Z', ft:'diesel', g:48.1, p:3.92, t:188.55, o:67890, st:'BNL Fuel Depot' },
    { a:'Chevrolet Silverado HD #043', d:'2026-03-04T06:30:00Z', ft:'diesel', g:26.7, p:3.89, t:103.86, o:28300, st:'Sunoco - Rt 112' },
    { a:'Ford F-350 #046', d:'2026-03-06T06:45:00Z', ft:'diesel', g:32.4, p:3.92, t:127.01, o:24100, st:'BNL Fuel Depot' },
    { a:'Ram 3500 #048', d:'2026-03-02T06:00:00Z', ft:'diesel', g:38.9, p:3.85, t:149.77, o:40800, st:'BNL Fuel Depot' },
    { a:'Ram 3500 #048', d:'2026-03-16T06:15:00Z', ft:'diesel', g:37.2, p:3.92, t:145.82, o:41100, st:'BNL Fuel Depot' },
    { a:'Hyundai Sonata #006', d:'2026-03-07T08:00:00Z', ft:'gasoline', g:13.8, p:3.29, t:45.40, o:22100, st:'Shell - Rt 25A' },
    { a:'Hyundai Sonata #006', d:'2026-03-21T08:15:00Z', ft:'gasoline', g:14.2, p:3.31, t:47.00, o:22400, st:'BP - Rt 25' },
    { a:'Toyota Corolla #009', d:'2026-03-10T08:30:00Z', ft:'gasoline', g:9.8, p:3.29, t:32.24, o:4900, st:'Shell - Rt 25A' },
    { a:'Subaru Outback #023', d:'2026-03-05T07:30:00Z', ft:'gasoline', g:16.4, p:3.25, t:53.30, o:22000, st:'Mobil - William Floyd' },
    { a:'Subaru Outback #023', d:'2026-03-19T07:45:00Z', ft:'gasoline', g:15.9, p:3.31, t:52.63, o:22300, st:'Shell - Rt 25A' },
    { a:'Ford Ranger #038', d:'2026-03-08T07:00:00Z', ft:'gasoline', g:14.7, p:3.29, t:48.36, o:18900, st:'BP - Rt 25' },
    { a:'Nissan Frontier #044', d:'2026-03-12T07:15:00Z', ft:'gasoline', g:15.3, p:3.31, t:50.64, o:36400, st:'Shell - Rt 25A' },
    { a:'Ford F-150 #050', d:'2026-03-06T06:30:00Z', ft:'gasoline', g:17.1, p:3.25, t:55.58, o:21000, st:'Mobil - William Floyd' },
    { a:'Ford F-150 #050', d:'2026-03-20T06:45:00Z', ft:'gasoline', g:16.8, p:3.31, t:55.61, o:21300, st:'Shell - Rt 25A' },
    { a:'International MV607 #067', d:'2026-03-07T06:00:00Z', ft:'diesel', g:28.5, p:3.89, t:110.87, o:21000, st:'BNL Fuel Depot' },
    { a:'Freightliner M2 #068', d:'2026-03-09T06:15:00Z', ft:'diesel', g:32.8, p:3.85, t:126.28, o:56300, st:'BNL Fuel Depot' },
    { a:'Peterbilt 567 #072', d:'2026-03-11T06:00:00Z', ft:'diesel', g:40.2, p:3.92, t:157.58, o:45200, st:'BNL Fuel Depot' },
    { a:'Kenworth T370 #073', d:'2026-03-14T06:30:00Z', ft:'diesel', g:35.6, p:3.89, t:138.48, o:23100, st:'BNL Fuel Depot' },
    { a:'Ram ProMaster #052', d:'2026-03-10T07:00:00Z', ft:'gasoline', g:20.8, p:3.29, t:68.43, o:38400, st:'Shell - Rt 25A' },
    { a:'Chevrolet Express #059', d:'2026-03-13T07:15:00Z', ft:'gasoline', g:22.3, p:3.31, t:73.81, o:21000, st:'BP - Rt 25' },
    { a:'Chevrolet 4500 Shuttle #062', d:'2026-03-18T05:30:00Z', ft:'diesel', g:33.7, p:3.92, t:132.10, o:34200, st:'BNL Fuel Depot' },
  ];

  for (let i = 0; i < fuels.length; i += 10) {
    const batch = fuels.slice(i, i + 10).map(f => ({
      org_id: ORG, asset_id: assetMap[f.a], transaction_date: f.d,
      fuel_type: f.ft, quantity_gallons: f.g, unit_price: f.p,
      total_cost: f.t, odometer_at_fill: f.o, station_name: f.st, source: 'manual',
    })).filter(f => f.asset_id);
    try {
      await api('fuel_transactions', batch);
      console.log(`  Inserted fuel ${i+1}-${i+batch.length}`);
    } catch (e) { console.log(`  Fuel batch ${i}: ${e.message.slice(0, 80)}`); }
  }

  console.log('\nDone! Total: 10 staff + 100 assets + 30 work orders + 50 fuel transactions');
}

main().catch(console.error);
