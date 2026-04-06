'use client';

import { Header } from '@/components/layout/Header';
import { Calendar, AlertTriangle, Clock, Wrench } from 'lucide-react';

const upcomingPMs = [
  { schedule: 'Oil & Filter Change', asset: 'V-0342', dueReason: 'Mileage', dueValue: '34,521 / 35,000 mi', priority: 'high' },
  { schedule: 'Tire Rotation', asset: 'V-0118', dueReason: 'Mileage', dueValue: '48,932 / 50,000 mi', priority: 'normal' },
  { schedule: 'Brake Inspection', asset: 'V-0567', dueReason: 'Time', dueValue: '11 / 12 months', priority: 'high' },
  { schedule: 'Air Filter', asset: 'V-0089', dueReason: 'Mileage', dueValue: '28,763 / 30,000 mi', priority: 'normal' },
  { schedule: 'Annual DOT Inspection', asset: 'V-0234', dueReason: 'Time', dueValue: '11.5 / 12 months', priority: 'critical' },
  { schedule: 'Transmission Service', asset: 'V-0456', dueReason: 'Mileage', dueValue: '58,200 / 60,000 mi', priority: 'normal' },
];

const priorityColors: Record<string, string> = {
  low: 'badge-green', normal: 'badge-gray', high: 'badge-yellow', critical: 'badge-red',
};

export default function MaintenancePage() {
  return (
    <div>
      <Header
        title="Preventive Maintenance"
        subtitle="PM schedules and upcoming services"
        actions={
          <button className="btn-primary">
            <Wrench className="h-4 w-4 mr-2" />
            Generate Work Orders
          </button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500">Overdue</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-500">Due This Week</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">28</p>
              <p className="text-sm text-gray-500">Due This Month</p>
            </div>
          </div>
        </div>

        {/* Upcoming PMs */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Preventive Maintenance</h3>
          <div className="space-y-3">
            {upcomingPMs.map((pm, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <Wrench className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{pm.schedule}</p>
                    <p className="text-sm text-gray-500">Asset {pm.asset}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <p className="text-gray-600">{pm.dueReason}</p>
                    <p className="text-gray-400">{pm.dueValue}</p>
                  </div>
                  <span className={priorityColors[pm.priority]}>
                    {pm.priority.charAt(0).toUpperCase() + pm.priority.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
