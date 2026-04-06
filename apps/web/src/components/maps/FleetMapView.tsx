'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// Custom vehicle marker icons
function createVehicleIcon(moving: boolean, idle: boolean): DivIcon {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require('leaflet');
  const color = moving ? '#16a34a' : idle ? '#d97706' : '#9ca3af';

  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="position:relative;width:32px;height:32px;">
        <div style="
          position:absolute;inset:0;
          background:${color};
          border-radius:50%;
          opacity:0.2;
          ${moving ? 'animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;' : ''}
        "></div>
        <div style="
          position:absolute;inset:4px;
          background:${color};
          border:2px solid white;
          border-radius:50%;
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
        "></div>
        ${moving ? `<div style="
          position:absolute;top:-2px;right:-2px;
          width:10px;height:10px;
          background:#22c55e;
          border:1.5px solid white;
          border-radius:50%;
        "></div>` : ''}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

function FlyToSelected({ selected, positions }: { selected: string | null; positions: VehiclePosition[] }): null {
  const map = useMap();

  useEffect(() => {
    if (selected) {
      const pos = positions.find(p => p.asset_id === selected);
      if (pos) {
        map.flyTo([pos.latitude, pos.longitude], 16, { duration: 0.8 });
      }
    }
  }, [selected, positions, map]);

  return null;
}

// Fix Leaflet default icon paths for Next.js
if (typeof window !== 'undefined') {
  const L = require('leaflet');
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

interface FleetMapViewProps {
  positions: VehiclePosition[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function FleetMapView({ positions, selected, onSelect }: FleetMapViewProps): React.JSX.Element {
  return (
    <>
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .custom-vehicle-marker { background: none !important; border: none !important; }
        .leaflet-popup-content-wrapper { border-radius: 12px !important; }
        .leaflet-popup-content { margin: 12px 16px !important; }
      `}</style>
      <MapContainer
        center={[40.8688, -72.8788]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToSelected selected={selected} positions={positions} />

        {positions.map((pos) => {
          const isMoving = pos.ignition_on && pos.speed_mph > 0;
          const isIdle = pos.ignition_on && pos.speed_mph === 0;
          const icon = createVehicleIcon(isMoving, isIdle);

          return (
            <Marker
              key={pos.asset_id}
              position={[pos.latitude, pos.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => onSelect(pos.asset_id),
              }}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                    {pos.asset?.asset_number}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
                    {pos.asset?.year} {pos.asset?.make} {pos.asset?.model}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9ca3af' }}>Status</span>
                      <span style={{
                        fontWeight: 500,
                        color: isMoving ? '#16a34a' : isIdle ? '#d97706' : '#6b7280',
                      }}>
                        {isMoving ? `Moving ${pos.speed_mph} mph` : isIdle ? 'Idle' : 'Off'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9ca3af' }}>Heading</span>
                      <span>{pos.heading}&deg;</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9ca3af' }}>Dept</span>
                      <span>{pos.asset?.assigned_department || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#9ca3af' }}>Location</span>
                      <span style={{ textAlign: 'right', maxWidth: 120 }}>{pos.address || '—'}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
}
