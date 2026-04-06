'use client';

import { Header } from '@/components/layout/Header';
import {
  Car, Wrench, ClipboardCheck, AlertTriangle,
  TrendingUp, Fuel, CheckCircle, XCircle,
} from 'lucide-react';

const stats = [
  { name: 'Total Assets', value: '647', icon: Car, color: 'text-blue-600 bg-blue-100' },
  { name: 'Active Vehicles', value: '612', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  { name: 'In Shop', value: '23', icon: Wrench, color: 'text-yellow-600 bg-yellow-100' },
  { name: 'Out of Service', value: '12', icon: XCircle, color: 'text-red-600 bg-red-100' },
];

const recentWorkOrders = [
  { id: 'WO-2026-00142', asset: 'V-0342 Ford F-150', type: 'Preventive', status: 'In Progress', priority: 'Normal' },
  { id: 'WO-2026-00141', asset: 'V-0118 Chevy Tahoe', type: 'Corrective', status: 'Parts Pending', priority: 'High' },
  { id: 'WO-2026-00140', asset: 'V-0567 Ram 2500', type: 'Inspection Defect', status: 'Open', priority: 'Critical' },
  { id: 'WO-2026-00139', asset: 'V-0089 Toyota Camry', type: 'Preventive', status: 'Completed', priority: 'Low' },
  { id: 'WO-2026-00138', asset: 'E-0023 John Deere Mower', type: 'Emergency', status: 'Assigned', priority: 'High' },
];

const statusColors: Record<string, string> = {
  'In Progress': 'badge-blue',
  'Parts Pending': 'badge-yellow',
  Open: 'badge-gray',
  Completed: 'badge-green',
  Assigned: 'badge-blue',
  Critical: 'badge-red',
  High: 'badge-yellow',
  Normal: 'badge-gray',
  Low: 'badge-green',
};

export default function DashboardPage() {
  return (
    <div>
      <Header title="Dashboard" subtitle="Fleet overview and key metrics" />

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="card flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Alerts */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Alerts & Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-100 p-3">
                <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-red-800">3 Overdue PM Services</p>
                  <p className="text-red-600">V-0342, V-0567, E-0012 require immediate attention</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-yellow-50 border border-yellow-100 p-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">5 DVIRs with Defects</p>
                  <p className="text-yellow-600">Inspections submitted today with failed items</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-100 p-3">
                <ClipboardCheck className="h-5 w-5 text-blue-500 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800">12 PM Services Due This Week</p>
                  <p className="text-blue-600">Oil changes, tire rotations, and brake inspections</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-600" />
              This Month
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Wrench className="h-4 w-4" />
                  Work Orders
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">48</p>
                <p className="text-xs text-green-600 mt-1">12 completed this week</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ClipboardCheck className="h-4 w-4" />
                  Inspections
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">156</p>
                <p className="text-xs text-green-600 mt-1">94% pass rate</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Fuel className="h-4 w-4" />
                  Fuel Cost
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">$18.4K</p>
                <p className="text-xs text-red-600 mt-1">+3.2% vs last month</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Car className="h-4 w-4" />
                  Utilization
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">94.6%</p>
                <p className="text-xs text-green-600 mt-1">+0.8% vs last month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Work Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Work Orders</h3>
            <a href="/work-orders" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">WO #</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Asset</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentWorkOrders.map((wo) => (
                  <tr key={wo.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3 font-medium text-brand-600">{wo.id}</td>
                    <td className="px-4 py-3 text-gray-900">{wo.asset}</td>
                    <td className="px-4 py-3 text-gray-600">{wo.type}</td>
                    <td className="px-4 py-3">
                      <span className={statusColors[wo.status]}>{wo.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={statusColors[wo.priority]}>{wo.priority}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
