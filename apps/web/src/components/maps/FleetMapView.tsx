'use client';

import { useEffect, useRef, useCallback } from 'react';

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

interface FleetMapViewProps {
  positions: VehiclePosition[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function FleetMapView({ positions, selected, onSelect }: FleetMapViewProps): React.JSX.Element {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    let cancelled = false;

    (async () => {
      const L = (await import('leaflet')).default;
      // @ts-ignore - CSS import handled by bundler
      await import('leaflet/dist/leaflet.css');

      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [40.8688, -72.8788],
        zoom: 14,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      leafletMap.current = map;

      // Force a resize after mount
      setTimeout(() => map.invalidateSize(), 100);
    })();

    return () => {
      cancelled = true;
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Update markers when positions change
  useEffect(() => {
    if (!leafletMap.current) return;

    (async () => {
      const L = (await import('leaflet')).default;
      const map = leafletMap.current;
      if (!map) return;

      const currentIds = new Set(positions.map(p => p.asset_id));

      // Remove markers for vehicles no longer in the list
      markersRef.current.forEach((marker, id) => {
        if (!currentIds.has(id)) {
          map.removeLayer(marker);
          markersRef.current.delete(id);
        }
      });

      // Add or update markers
      positions.forEach((pos) => {
        const isMoving = pos.ignition_on && pos.speed_mph > 0;
        const isIdle = pos.ignition_on && pos.speed_mph === 0;
        const color = isMoving ? '#16a34a' : isIdle ? '#d97706' : '#9ca3af';

        const statusColor = isMoving ? '#16a34a' : isIdle ? '#d97706' : '#9ca3af';
        const statusBorder = isMoving ? '#16a34a' : isIdle ? '#d97706' : '#d1d5db';
        const rotation = pos.heading || 0;

        // SVG car icon rotated to heading
        const carSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"
            style="transform:rotate(${rotation}deg);filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3));"
            fill="${statusColor}" stroke="white" stroke-width="0.8">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>`;

        const icon = L.divIcon({
          className: '',
          html: `
            <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
              <div style="
                position:absolute;inset:0;
                background:${statusColor};
                border-radius:50%;
                opacity:0.15;
                ${isMoving ? 'animation:fleetpulse-ping 1.5s cubic-bezier(0,0,0.2,1) infinite;' : ''}
              "></div>
              <div style="
                position:relative;
                background:white;
                border:2px solid ${statusBorder};
                border-radius:50%;
                width:36px;height:36px;
                display:flex;align-items:center;justify-content:center;
                box-shadow:0 2px 8px rgba(0,0,0,0.2);
              ">
                ${carSvg}
              </div>
              ${isMoving ? `
                <div style="
                  position:absolute;top:0;right:0;
                  width:10px;height:10px;
                  background:#22c55e;
                  border:1.5px solid white;
                  border-radius:50;
                "></div>
                <div style="
                  position:absolute;bottom:-4px;left:50%;transform:translateX(-50%);
                  background:${statusColor};color:white;
                  font-size:9px;font-weight:700;
                  padding:1px 4px;border-radius:4px;
                  white-space:nowrap;
                  box-shadow:0 1px 3px rgba(0,0,0,0.2);
                ">${pos.speed_mph}mph</div>
              ` : ''}
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -20],
        });

        const popupContent = `
          <div style="min-width:180px;font-family:system-ui,sans-serif;">
            <div style="font-weight:600;font-size:14px;margin-bottom:2px;">
              ${pos.asset?.asset_number || 'Unknown'}
            </div>
            <div style="font-size:12px;color:#6b7280;margin-bottom:8px;">
              ${pos.asset?.year || ''} ${pos.asset?.make || ''} ${pos.asset?.model || ''}
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;font-size:12px;">
              <div style="display:flex;justify-content:space-between;">
                <span style="color:#9ca3af">Status</span>
                <span style="font-weight:500;color:${isMoving ? '#16a34a' : isIdle ? '#d97706' : '#6b7280'}">
                  ${isMoving ? `Moving ${pos.speed_mph} mph` : isIdle ? 'Idle' : 'Off'}
                </span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span style="color:#9ca3af">Heading</span>
                <span>${pos.heading}&deg;</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span style="color:#9ca3af">Dept</span>
                <span>${pos.asset?.assigned_department || '—'}</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span style="color:#9ca3af">Location</span>
                <span style="text-align:right;max-width:120px">${pos.address || '—'}</span>
              </div>
            </div>
          </div>
        `;

        const existing = markersRef.current.get(pos.asset_id);
        if (existing) {
          existing.setLatLng([pos.latitude, pos.longitude]);
          existing.setIcon(icon);
          existing.setPopupContent(popupContent);
        } else {
          const marker = L.marker([pos.latitude, pos.longitude], { icon })
            .addTo(map)
            .bindPopup(popupContent, { className: 'fleet-popup' })
            .on('click', () => onSelect(pos.asset_id));
          markersRef.current.set(pos.asset_id, marker);
        }
      });
    })();
  }, [positions, onSelect]);

  // Fly to selected vehicle
  useEffect(() => {
    if (!leafletMap.current || !selected) return;
    const pos = positions.find(p => p.asset_id === selected);
    if (pos) {
      leafletMap.current.flyTo([pos.latitude, pos.longitude], 16, { duration: 0.8 });
      const marker = markersRef.current.get(selected);
      if (marker) marker.openPopup();
    }
  }, [selected, positions]);

  return (
    <>
      <style>{`
        @keyframes fleetpulse-ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        .fleet-popup .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
        }
        .fleet-popup .leaflet-popup-content {
          margin: 12px 16px !important;
        }
        .fleet-popup .leaflet-popup-tip {
          box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </>
  );
}
