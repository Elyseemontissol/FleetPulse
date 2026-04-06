'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Plus, Filter, Loader2 } from 'lucide-react';
import { useSupabaseQuery } from '@/hooks/useSupabase';
import { AnimatedPage } from '@/components/animations/AnimatedPage';
import { AnimatedTable } from '@/components/animations/AnimatedTable';

const statusColors: Record<string, string> = {
  open: 'badge-gray', assigned: 'badge-blue', in_progress: 'badge-blue',
  on_hold: 'badge-yellow', parts_pending: 'badge-yellow',
  completed: 'badge-green', closed: 'badge-green', cancelled: 'badge-gray',
};
const priorityColors: Record<string, string> = {
  low: 'badge-green', normal: 'badge-gray', high: 'badge-yellow', critical: 'badge-red',
};

export default function WorkOrdersPage(): React.JSX.Element {
  const [statusFilter, setStatusFilter] = useState('');

  const { data: workOrders, loading, count } = useSupabaseQuery<any[]>(
    (sb) => {
      let q = sb.from('work_orders')
        .select('*, asset:assets(asset_number, make, model, year), assignee:profiles!assigned_to(full_name)', { count: 'exact' })
        .order('created_at', { ascending: false });
      if (statusFilter) q = q.eq('status', statusFilter);
      return q;
    },
    [statusFilter],
  );

  return (
    <AnimatedPage>
      <Header
        title="Work Orders"
        subtitle={`${count ?? '...'} total work orders`}
        actions={<Link href="/work-orders/new" className="btn-primary"><Plus className="h-4 w-4 mr-2" />New Work Order</Link>}
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
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="card p-0 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <AnimatedTable loading={loading}><table className="w-full text-sm">
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
                {(workOrders || []).map((wo: any) => (
                  <tr key={wo.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3">
                      <Link href={`/work-orders/${wo.id}`} className="font-medium text-brand-600 hover:text-brand-700">
                        {wo.work_order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{wo.title}</td>
                    <td className="px-4 py-3 text-gray-600">{wo.asset?.asset_number || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{wo.type.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 text-gray-600">{wo.assignee?.full_name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={statusColors[wo.status] || 'badge-gray'}>
                        {wo.status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={priorityColors[wo.priority] || 'badge-gray'}>
                        {wo.priority.charAt(0).toUpperCase() + wo.priority.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></AnimatedTable>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}
