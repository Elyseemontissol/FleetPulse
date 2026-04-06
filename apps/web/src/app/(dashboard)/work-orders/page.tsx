'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Plus, Filter } from 'lucide-react';

const statusColors: Record<string, string> = {
  open: 'badge-gray', assigned: 'badge-blue', in_progress: 'badge-blue',
  on_hold: 'badge-yellow', parts_pending: 'badge-yellow',
  completed: 'badge-green', closed: 'badge-green', cancelled: 'badge-gray',
};

const priorityColors: Record<string, string> = {
  low: 'badge-green', normal: 'badge-gray', high: 'badge-yellow', critical: 'badge-red',
};

const sampleWOs = [
  { id: '1', work_order_number: 'WO-2026-00142', title: 'Oil & Filter Change', asset: 'V-0342 Ford F-150', type: 'preventive', status: 'in_progress', priority: 'normal', assigned_to: 'Mike Johnson', scheduled_date: '2026-04-05' },
  { id: '2', work_order_number: 'WO-2026-00141', title: 'Replace Alternator', asset: 'V-0118 Chevy Tahoe', type: 'corrective', status: 'parts_pending', priority: 'high', assigned_to: 'Sarah Lee', scheduled_date: '2026-04-04' },
  { id: '3', work_order_number: 'WO-2026-00140', title: 'DVIR Defects - Brakes', asset: 'V-0567 Ram 2500', type: 'inspection_defect', status: 'open', priority: 'critical', assigned_to: null, scheduled_date: null },
  { id: '4', work_order_number: 'WO-2026-00139', title: 'Tire Rotation', asset: 'V-0089 Toyota Camry', type: 'preventive', status: 'completed', priority: 'low', assigned_to: 'Mike Johnson', scheduled_date: '2026-04-02' },
  { id: '5', work_order_number: 'WO-2026-00138', title: 'Blade Replacement', asset: 'E-0023 John Deere Mower', type: 'emergency', status: 'assigned', priority: 'high', assigned_to: 'Tom Brown', scheduled_date: '2026-04-05' },
];

export default function WorkOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = sampleWOs.filter((wo) => !statusFilter || wo.status === statusFilter);

  return (
    <div>
      <Header
        title="Work Orders"
        subtitle={`${sampleWOs.length} total work orders`}
        actions={
          <Link href="/work-orders/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Work Order
          </Link>
        }
      />

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-gray-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-44">
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="parts_pending">Parts Pending</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">WO #</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Title</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Asset</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Assigned To</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((wo) => (
                <tr key={wo.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3">
                    <Link href={`/work-orders/${wo.id}`} className="font-medium text-brand-600 hover:text-brand-700">
                      {wo.work_order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{wo.title}</td>
                  <td className="px-4 py-3 text-gray-600">{wo.asset}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{wo.type.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 text-gray-600">{wo.assigned_to || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={statusColors[wo.status]}>
                      {wo.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={priorityColors[wo.priority]}>
                      {wo.priority.charAt(0).toUpperCase() + wo.priority.slice(1)}
                    </span>
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
