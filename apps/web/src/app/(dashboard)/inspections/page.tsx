'use client';

import Link from 'next/link';
import { AnimatedPage } from '@/components/animations/AnimatedPage';
import { Header } from '@/components/layout/Header';
import { Plus, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const resultIcons: Record<string, React.ReactNode> = {
  pass: <CheckCircle className="h-4 w-4 text-green-500" />,
  fail: <XCircle className="h-4 w-4 text-red-500" />,
  pass_with_defects: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
};

const sampleInspections = [
  { id: '1', asset: 'V-0342 Ford F-150', type: 'Pre-Trip', inspector: 'John Smith', result: 'pass', status: 'closed', date: '2026-04-05 07:15' },
  { id: '2', asset: 'V-0118 Chevy Tahoe', type: 'Pre-Trip', inspector: 'Jane Doe', result: 'fail', status: 'submitted', date: '2026-04-05 06:45' },
  { id: '3', asset: 'V-0567 Ram 2500', type: 'Post-Trip', inspector: 'Bob Wilson', result: 'pass_with_defects', status: 'reviewed', date: '2026-04-04 17:30' },
  { id: '4', asset: 'V-0089 Toyota Camry', type: 'Pre-Trip', inspector: 'John Smith', result: 'pass', status: 'closed', date: '2026-04-04 07:00' },
  { id: '5', asset: 'E-0001 John Deere 1025R', type: 'Monthly', inspector: 'Tom Brown', result: 'pass', status: 'reviewed', date: '2026-04-01 09:00' },
];

export default function InspectionsPage(): React.JSX.Element {
  return (
    <AnimatedPage>
      <Header
        title="Inspections (DVIR)"
        subtitle="Driver Vehicle Inspection Reports"
        actions={
          <Link href="/inspections/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Inspection
          </Link>
        }
      />

      <div className="p-6 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card flex items-center gap-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">142</p>
              <p className="text-sm text-gray-500">Passed (30 days)</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">9</p>
              <p className="text-sm text-gray-500">Pass with Defects</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <XCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-sm text-gray-500">Failed</p>
            </div>
          </div>
        </div>

        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Asset</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Inspector</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Result</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sampleInspections.map((insp) => (
                <tr key={insp.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 text-gray-600">{insp.date}</td>
                  <td className="px-4 py-3">
                    <Link href={`/inspections/${insp.id}`} className="font-medium text-brand-600 hover:text-brand-700">
                      {insp.asset}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{insp.type}</td>
                  <td className="px-4 py-3 text-gray-600">{insp.inspector}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      {resultIcons[insp.result]}
                      <span className="capitalize">{insp.result.replace(/_/g, ' ')}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge-blue capitalize">{insp.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedPage>
  );
}
