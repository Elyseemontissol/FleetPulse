'use client';

import { Header } from '@/components/layout/Header';
import { useSupabaseQuery } from '@/hooks/useSupabase';
import { AnimatedPage } from '@/components/animations/AnimatedPage';
import { StaggerIn } from '@/components/animations/StaggerIn';
import { CountUp } from '@/components/animations/CountUp';
import { AnimatedTable } from '@/components/animations/AnimatedTable';
import Link from 'next/link';
import {
  Car, Wrench, ClipboardCheck, AlertTriangle,
  TrendingUp, Fuel, CheckCircle, XCircle, Loader2,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  in_progress: 'badge-blue', parts_pending: 'badge-yellow', open: 'badge-gray',
  completed: 'badge-green', assigned: 'badge-blue', on_hold: 'badge-yellow',
};
const priorityColors: Record<string, string> = {
  critical: 'badge-red', high: 'badge-yellow', normal: 'badge-gray', low: 'badge-green',
};

export default function DashboardPage(): React.JSX.Element {
  const { data: assets } = useSupabaseQuery<any[]>(
    (sb) => sb.from('assets').select('status'),
  );
  const { data: recentWOs, loading: woLoading } = useSupabaseQuery<any[]>(
    (sb) => sb.from('work_orders')
      .select('*, asset:assets(asset_number)')
      .order('created_at', { ascending: false })
      .limit(8),
  );
  const { data: fuelData } = useSupabaseQuery<any[]>(
    (sb) => sb.from('fuel_transactions')
      .select('total_cost, quantity_gallons')
      .gte('transaction_date', new Date(Date.now() - 30 * 86400000).toISOString()),
  );

  const totalAssets = assets?.length || 0;
  const activeCount = assets?.filter(a => a.status === 'active').length || 0;
  const inShopCount = assets?.filter(a => a.status === 'in_shop').length || 0;
  const oosCount = assets?.filter(a => a.status === 'out_of_service').length || 0;
  const openWOs = recentWOs?.filter(wo => !['completed', 'closed', 'cancelled'].includes(wo.status)).length || 0;
  const fuelCost = fuelData?.reduce((s, f) => s + (f.total_cost || 0), 0) || 0;
  const utilization = totalAssets ? Math.round((activeCount / totalAssets) * 1000) / 10 : 0;

  const kpis = [
    { name: 'Total Assets', value: totalAssets, icon: Car, color: 'text-blue-600 bg-blue-100' },
    { name: 'Active', value: activeCount, icon: CheckCircle, color: 'text-green-600 bg-green-100' },
    { name: 'In Shop', value: inShopCount, icon: Wrench, color: 'text-yellow-600 bg-yellow-100' },
    { name: 'Out of Service', value: oosCount, icon: XCircle, color: 'text-red-600 bg-red-100' },
  ];

  return (
    <AnimatedPage>
      <Header title="Dashboard" subtitle="Fleet overview and key metrics" />

      <div className="p-6 space-y-6">
        {/* KPI Cards with count-up */}
        <StaggerIn selector=".kpi-card" stagger={0.1} y={25}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((stat) => (
              <div key={stat.name} className="kpi-card card flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    <CountUp end={stat.value} duration={1.5} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </StaggerIn>

        <StaggerIn selector=".summary-card" stagger={0.15} y={20} delay={0.4}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Fleet Summary with count-up values */}
            <div className="summary-card card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-600" />
                Fleet Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Wrench className="h-4 w-4" /> Open Work Orders
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    <CountUp end={openWOs} duration={1} />
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Fuel className="h-4 w-4" /> Fuel Cost (30d)
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    <CountUp end={fuelCost} duration={1.5} prefix="$" />
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Car className="h-4 w-4" /> Utilization
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    <CountUp end={utilization} duration={1.5} suffix="%" decimals={1} />
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ClipboardCheck className="h-4 w-4" /> In Shop
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    <CountUp end={inShopCount} duration={1} />
                  </p>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="summary-card card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Alerts
              </h3>
              <StaggerIn selector=".alert-item" stagger={0.12} x={-20} y={0} delay={0.6}>
                <div className="space-y-3">
                  {oosCount > 0 && (
                    <div className="alert-item flex items-center gap-3 rounded-lg bg-red-50 border border-red-100 p-3">
                      <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-red-800">{oosCount} Vehicle(s) Out of Service</p>
                        <p className="text-red-600">Require evaluation or repair</p>
                      </div>
                    </div>
                  )}
                  {inShopCount > 0 && (
                    <div className="alert-item flex items-center gap-3 rounded-lg bg-yellow-50 border border-yellow-100 p-3">
                      <Wrench className="h-5 w-5 text-yellow-500 shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800">{inShopCount} Vehicle(s) In Shop</p>
                        <p className="text-yellow-600">Active maintenance in progress</p>
                      </div>
                    </div>
                  )}
                  {openWOs > 0 && (
                    <div className="alert-item flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-100 p-3">
                      <ClipboardCheck className="h-5 w-5 text-blue-500 shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-800">{openWOs} Open Work Order(s)</p>
                        <p className="text-blue-600">Awaiting assignment or completion</p>
                      </div>
                    </div>
                  )}
                </div>
              </StaggerIn>
            </div>
          </div>
        </StaggerIn>

        {/* Recent Work Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Work Orders</h3>
            <Link href="/work-orders" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All</Link>
          </div>
          {woLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
          ) : (
            <AnimatedTable loading={woLoading}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-medium text-gray-500">WO #</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Title</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Asset</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(recentWOs || []).map((wo: any) => (
                      <tr key={wo.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-brand-600">{wo.work_order_number}</td>
                        <td className="px-4 py-3 text-gray-900">{wo.title}</td>
                        <td className="px-4 py-3 text-gray-600">{wo.asset?.asset_number || '—'}</td>
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
                </table>
              </div>
            </AnimatedTable>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}
