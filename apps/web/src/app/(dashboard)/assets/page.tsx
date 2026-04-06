'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Plus, Filter, Download, ChevronRight } from 'lucide-react';

const statusColors: Record<string, string> = {
  active: 'badge-green',
  in_shop: 'badge-yellow',
  out_of_service: 'badge-red',
  reserved: 'badge-blue',
  surplus: 'badge-gray',
  disposed: 'badge-gray',
};

const statusLabels: Record<string, string> = {
  active: 'Active',
  in_shop: 'In Shop',
  out_of_service: 'Out of Service',
  reserved: 'Reserved',
  surplus: 'Surplus',
  disposed: 'Disposed',
};

// Placeholder data - will be replaced with API calls
const sampleAssets = [
  { id: '1', asset_number: 'V-0001', make: 'Ford', model: 'F-150', year: 2023, category: 'vehicle', asset_type: 'pickup', status: 'active', current_odometer: 34521, assigned_department: 'Facilities' },
  { id: '2', asset_number: 'V-0002', make: 'Chevrolet', model: 'Tahoe', year: 2022, category: 'vehicle', asset_type: 'suv', status: 'active', current_odometer: 48932, assigned_department: 'Security' },
  { id: '3', asset_number: 'V-0003', make: 'Ram', model: '2500', year: 2024, category: 'vehicle', asset_type: 'pickup', status: 'in_shop', current_odometer: 12045, assigned_department: 'Maintenance' },
  { id: '4', asset_number: 'V-0004', make: 'Toyota', model: 'Camry', year: 2023, category: 'vehicle', asset_type: 'sedan', status: 'active', current_odometer: 28763, assigned_department: 'Admin' },
  { id: '5', asset_number: 'E-0001', make: 'John Deere', model: '1025R', year: 2021, category: 'equipment', asset_type: 'mower', status: 'active', current_odometer: 0, assigned_department: 'Grounds' },
  { id: '6', asset_number: 'V-0005', make: 'Ford', model: 'Transit', year: 2023, category: 'vehicle', asset_type: 'van', status: 'out_of_service', current_odometer: 67231, assigned_department: 'Facilities' },
];

export default function AssetsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const filteredAssets = sampleAssets.filter((a) => {
    if (statusFilter && a.status !== statusFilter) return false;
    if (categoryFilter && a.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div>
      <Header
        title="Assets"
        subtitle={`${sampleAssets.length} total assets`}
        actions={
          <Link href="/assets/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Link>
        }
      />

      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-40"
          >
            <option value="">All Statuses</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input w-40"
          >
            <option value="">All Categories</option>
            <option value="vehicle">Vehicles</option>
            <option value="equipment">Equipment</option>
          </select>
          <div className="flex-1" />
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">Asset #</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Vehicle</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Department</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Odometer</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/assets/${asset.id}`} className="font-medium text-brand-600 hover:text-brand-700">
                      {asset.asset_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {asset.year} {asset.make} {asset.model}
                  </td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{asset.asset_type}</td>
                  <td className="px-4 py-3 text-gray-600">{asset.assigned_department}</td>
                  <td className="px-4 py-3 text-gray-600 tabular-nums">
                    {asset.current_odometer > 0 ? asset.current_odometer.toLocaleString() + ' mi' : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={statusColors[asset.status]}>
                      {statusLabels[asset.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/assets/${asset.id}`}>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
