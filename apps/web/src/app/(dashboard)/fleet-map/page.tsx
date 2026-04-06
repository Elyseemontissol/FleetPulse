'use client';

import { AnimatedPage } from '@/components/animations/AnimatedPage';
import { Header } from '@/components/layout/Header';
import { MapPin, Wifi, WifiOff } from 'lucide-react';

export default function FleetMapPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Fleet Map" subtitle="Live vehicle positions" />

      <div className="flex-1 relative">
        {/* Map placeholder - will integrate Mapbox or Leaflet */}
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto" />
            <p className="mt-4 text-lg font-medium text-gray-400">
              Fleet Map
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Connect telematics devices to see live vehicle positions.
              <br />
              Supports Geotab, Samsara, and CalAmp providers.
            </p>
          </div>
        </div>

        {/* Side Panel */}
        <div className="absolute left-4 top-4 w-72 max-h-[calc(100%-2rem)] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Vehicles</h3>
            <p className="text-xs text-gray-500 mt-1">0 active, 0 idle, 0 offline</p>
          </div>
          <div className="p-4 space-y-2">
            {['V-0342', 'V-0118', 'V-0567', 'V-0089'].map((v) => (
              <div key={v} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gray-300" />
                  <span className="text-sm font-medium">{v}</span>
                </div>
                <WifiOff className="h-3.5 w-3.5 text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
