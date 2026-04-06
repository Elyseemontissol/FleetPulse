// Seed mock GPS positions around Brookhaven National Lab (40.8688, -72.8788)
const SUPABASE_URL = 'https://yldnuhayicivsildjpiu.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsZG51aGF5aWNpdnNpbGRqcGl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQyOTk0NSwiZXhwIjoyMDkxMDA1OTQ1fQ.Y0-gKgBxn-siUy73dWHNY1dbMY2x1VaaDY4kI8Y5JPY';
const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

// BNL center: 40.8688, -72.8788
const CENTER = { lat: 40.8688, lng: -72.8788 };

function randomAround(center, radiusKm) {
  const r = radiusKm / 111.32;
  const angle = Math.random() * 2 * Math.PI;
  const dist = Math.random() * r;
  return {
    lat: +(center.lat + dist * Math.cos(angle)).toFixed(6),
    lng: +(center.lng + dist * Math.sin(angle) / Math.cos(center.lat * Math.PI / 180)).toFixed(6),
  };
}

async function main() {
  // Get all active vehicle assets
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/assets?category=eq.vehicle&status=eq.active&select=id,asset_number&limit=60`,
    { headers },
  );
  const assets = await res.json();
  console.log(`Found ${assets.length} active vehicles`);

  const positions = assets.map((asset, i) => {
    // Spread vehicles: some on campus, some on nearby roads
    const radius = i < 30 ? 1.5 : 4; // km
    const pos = randomAround(CENTER, radius);
    const ignition = Math.random() > 0.3; // 70% running
    const speed = ignition ? Math.round(Math.random() * 45) : 0;
    const heading = Math.round(Math.random() * 360);

    return {
      asset_id: asset.id,
      latitude: pos.lat,
      longitude: pos.lng,
      speed_mph: speed,
      heading,
      ignition_on: ignition,
      address: i < 15 ? 'Brookhaven National Lab - Main Campus'
        : i < 30 ? 'BNL - Research Area'
        : i < 45 ? 'William Floyd Pkwy, Shirley, NY'
        : 'Middle Country Rd, Ridge, NY',
      updated_at: new Date().toISOString(),
    };
  });

  // Upsert positions
  const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/asset_positions`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(positions),
  });

  if (!upsertRes.ok) {
    console.error('Error:', await upsertRes.text());
  } else {
    const result = await upsertRes.json();
    console.log(`Seeded ${result.length} vehicle positions around BNL`);
  }
}

main().catch(console.error);
