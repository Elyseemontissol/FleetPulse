'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Wifi, WifiOff, Navigation, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues with Leaflet
const FleetMapView = dynamic(() => import('@/components/maps/FleetMapView'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  ),
});

interface VehiclePosition {
  asset_id: string;
  latitude: number;
  longitude: number;
  speed_mph: number;
  heading: number;
  ignition_on: boolean;
  address: string;
  updated_at: string;
  asset: {
    asset_number: string;
    make: string;
    model: string;
    year: number;
    status: string;
    assigned_department: string;
  };
}

export default function FleetMapPage(): React.JSX.Element {
  const [positions, setPositions] = useState<VehiclePosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const simulationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPositions = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('asset_positions')
      .select('*, asset:assets!inner(asset_number, make, model, year, status, assigned_department)')
      .order('updated_at', { ascending: false });

    if (data) {
      setPositions(data as VehiclePosition[]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  // Simulate live movement — nudge vehicle positions every 3 seconds
  useEffect(() => {
    if (positions.length === 0) return;

    simulationRef.current = setInterval(async () => {
      const supabase = createClient();

      // Pick 5-10 random moving vehicles and shift their position slightly
      const moving = positions.filter(p => p.ignition_on);
      const toUpdate = moving.sort(() => Math.random() - 0.5).slice(0, Math.min(8, moving.length));

      const updates = toUpdate.map(p => {
        const speed = p.speed_mph || 10;
        const distKm = (speed * 1.6 * 3) / 3600; // distance in 3 seconds
        const dLat = distKm / 111.32;
        const headingRad = (p.heading * Math.PI) / 180;

        return {
          asset_id: p.asset_id,
          latitude: +(p.latitude + dLat * Math.cos(headingRad)).toFixed(6),
          longitude: +(p.longitude + dLat * Math.sin(headingRad) / Math.cos(p.latitude * Math.PI / 180)).toFixed(6),
          speed_mph: Math.max(0, p.speed_mph + Math.round((Math.random() - 0.5) * 6)),
          heading: (p.heading + Math.round((Math.random() - 0.5) * 20) + 360) % 360,
          ignition_on: p.ignition_on,
          address: p.address,
          updated_at: new Date().toISOString(),
        };
      });

      if (updates.length > 0) {
        await supabase.from('asset_positions').upsert(updates);

        setPositions(prev => {
          const map = new Map(prev.map(p => [p.asset_id, p]));
          for (const u of updates) {
            const existing = map.get(u.asset_id);
            if (existing) {
              map.set(u.asset_id, { ...existing, ...u });
            }
          }
          return Array.from(map.values());
        });
      }
    }, 3000);

    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, [positions.length]);

  const movingCount = positions.filter(p => p.ignition_on && p.speed_mph > 0).length;
  const idleCount = positions.filter(p => p.ignition_on && p.speed_mph === 0).length;
  const offlineCount = positions.filter(p => !p.ignition_on).length;

  return (
    <div className="flex flex-col h-full">
      <Header title="Fleet Map" subtitle="Live vehicle positions" />

      <div className="flex-1 relative">
        <FleetMapView
          positions={positions}
          selected={selected}
          onSelect={setSelected}
        />

        {/* Side Panel */}
        <div className="absolute left-4 top-4 bottom-4 w-80 flex flex-col rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm shadow-lg overflow-hidden z-[1000]">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Vehicles</h3>
            <div className="flex gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {movingCount} moving
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                {idleCount} idle
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-gray-400" />
                {offlineCount} off
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (
              positions.map((p) => {
                const isMoving = p.ignition_on && p.speed_mph > 0;
                const isIdle = p.ignition_on && p.speed_mph === 0;
                const isSelected = selected === p.asset_id;

                return (
                  <button
                    key={p.asset_id}
                    onClick={() => setSelected(isSelected ? null : p.asset_id)}
                    className={`flex items-center justify-between w-full rounded-lg border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                        isMoving ? 'bg-green-500 animate-pulse' : isIdle ? 'bg-yellow-500' : 'bg-gray-300'
                      }`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {p.asset?.asset_number}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {p.asset?.assigned_department || 'Unassigned'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {isMoving && (
                        <span className="text-xs font-medium text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                          {p.speed_mph} mph
                        </span>
                      )}
                      {p.ignition_on ? (
                        <Wifi className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <WifiOff className="h-3.5 w-3.5 text-gray-300" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="border-t border-gray-200 p-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Navigation className="h-3 w-3" />
              <span>Simulated live data &middot; Updates every 3s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
