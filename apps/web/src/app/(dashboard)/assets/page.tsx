'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Plus, Filter, Download, ChevronRight, Loader2 } from 'lucide-react';
import { useSupabaseQuery } from '@/hooks/useSupabase';

const statusColors: Record<string, string> = {
  active: 'badge-green', in_shop: 'badge-yellow', out_of_service: 'badge-red',
  reserved: 'badge-blue', surplus: 'badge-gray', disposed: 'badge-gray',
};
const statusLabels: Record<string, string> = {
  active: 'Active', in_shop: 'In Shop', out_of_service: 'Out of Service',
  reserved: 'Reserved', surplus: 'Surplus', disposed: 'Disposed',
};

export default function AssetsPage(): React.JSX.Element {
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: assets, loading, count } = useSupabaseQuery<any[]>(
    (sb) => {
      let q = sb.from('assets').select('*', { count: 'exact' }).order('asset_number');
      if (statusFilter) q = q.eq('status', statusFilter);
      if (categoryFilter) q = q.eq('category', categoryFilter);
      return q;
    },
    [statusFilter, categoryFilter],
  );

  return (
    <div>
      <Header
        title="Assets"
        subtitle={`${count ?? '...'} total assets`}
        actions={
          <Link href="/assets/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Link>
        }
      />

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-gray-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-40">
            <option value="">All Statuses</option>
            {Object.entries(statusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input w-40">
            <option value="">All Categories</option>
            <option value="vehicle">Vehicles</option>
            <option value="equipment">Equipment</option>
          </select>
          <div className="flex-1" />
          <button className="btn-secondary"><Download className="h-4 w-4 mr-2" />Export CSV</button>
        </div>

        <div className="card p-0 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
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
                {(assets || []).map((asset: any) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/assets/${asset.id}`} className="font-medium text-brand-600 hover:text-brand-700">
                        {asset.asset_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{asset.year} {asset.make} {asset.model}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{asset.asset_type.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 text-gray-600">{asset.assigned_department || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 tabular-nums">
                      {asset.current_odometer > 0 ? asset.current_odometer.toLocaleString() + ' mi' : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={statusColors[asset.status] || 'badge-gray'}>
                        {statusLabels[asset.status] || asset.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/assets/${asset.id}`}><ChevronRight className="h-4 w-4 text-gray-400" /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
