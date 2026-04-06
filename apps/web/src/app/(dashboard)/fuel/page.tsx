'use client';

import { Header } from '@/components/layout/Header';
import { useSupabaseQuery } from '@/hooks/useSupabase';
import { Plus, Fuel, TrendingDown, DollarSign, Loader2 } from 'lucide-react';

export default function FuelPage(): React.JSX.Element {
  const { data: transactions, loading } = useSupabaseQuery<any[]>(
    (sb) => sb.from('fuel_transactions')
      .select('*, asset:assets(asset_number)')
      .order('transaction_date', { ascending: false }),
  );

  const totalCost = transactions?.reduce((s, t) => s + (t.total_cost || 0), 0) || 0;
  const totalGallons = transactions?.reduce((s, t) => s + (t.quantity_gallons || 0), 0) || 0;
  const avgPrice = totalGallons > 0 ? totalCost / totalGallons : 0;

  return (
    <div>
      <Header title="Fuel Management" subtitle={`${transactions?.length || 0} transactions`}
        actions={<button className="btn-primary"><Plus className="h-4 w-4 mr-2" />Add Transaction</button>}
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="card flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Cost</p>
              <p className="text-xl font-bold text-gray-900">${Math.round(totalCost).toLocaleString()}</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Fuel className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Gallons</p>
              <p className="text-xl font-bold text-gray-900">{Math.round(totalGallons).toLocaleString()}</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <TrendingDown className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-xl font-bold text-gray-900">{transactions?.length || 0}</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg $/Gallon</p>
              <p className="text-xl font-bold text-gray-900">${avgPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Fuel Transactions</h3>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Asset</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Fuel</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Gallons</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">$/Gal</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Total</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Odometer</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Station</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(transactions || []).map((t: any) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{new Date(t.transaction_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{t.asset?.asset_number || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{t.fuel_type}</td>
                    <td className="px-4 py-3 text-gray-600 tabular-nums">{t.quantity_gallons}</td>
                    <td className="px-4 py-3 text-gray-600 tabular-nums">${t.unit_price}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 tabular-nums">${t.total_cost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-600 tabular-nums">{t.odometer_at_fill?.toLocaleString() || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{t.station_name}</td>
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
