'use client';

import { Header } from '@/components/layout/Header';
import { Plus, Fuel, TrendingDown, DollarSign } from 'lucide-react';

export default function FuelPage() {
  return (
    <div>
      <Header
        title="Fuel Management"
        subtitle="Fuel transactions and consumption analytics"
        actions={
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </button>
        }
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="card flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Cost (6mo)</p>
              <p className="text-xl font-bold text-gray-900">$112,430</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Fuel className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Gallons (6mo)</p>
              <p className="text-xl font-bold text-gray-900">34,822</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <TrendingDown className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg MPG</p>
              <p className="text-xl font-bold text-gray-900">18.4</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cost/Gallon Avg</p>
              <p className="text-xl font-bold text-gray-900">$3.23</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Fuel Transactions</h3>
          <div className="text-center text-gray-400 py-12">
            Fuel transaction data will appear here once connected to your fuel card provider (WEX, Fleetcor, etc.) or entered manually.
          </div>
        </div>
      </div>
    </div>
  );
}
