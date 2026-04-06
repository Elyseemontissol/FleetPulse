'use client';

import Link from 'next/link';
import { AnimatedPage } from '@/components/animations/AnimatedPage';
import { Header } from '@/components/layout/Header';
import { BarChart3, DollarSign, Fuel, Car, ClipboardCheck, Clock } from 'lucide-react';

const reports = [
  {
    name: 'Maintenance Costs',
    description: 'Total maintenance spending by asset, type, and time period',
    href: '/reports/costs',
    icon: DollarSign,
    color: 'bg-green-100 text-green-600',
  },
  {
    name: 'Fuel Usage',
    description: 'MPG trends, cost per mile, and consumption analytics',
    href: '/reports/fuel',
    icon: Fuel,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    name: 'Asset Utilization',
    description: 'Fleet utilization rates, uptime vs. downtime analysis',
    href: '/reports/utilization',
    icon: Car,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    name: 'Inspection Compliance',
    description: 'DVIR completion rates, defect trends, and compliance metrics',
    href: '/reports/compliance',
    icon: ClipboardCheck,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    name: 'Downtime Analysis',
    description: 'Out-of-service duration, root causes, and impact on operations',
    href: '/reports/downtime',
    icon: Clock,
    color: 'bg-red-100 text-red-600',
  },
  {
    name: 'Lifecycle Cost (TCO)',
    description: 'Total cost of ownership per asset including acquisition, maintenance, and fuel',
    href: '/reports/tco',
    icon: BarChart3,
    color: 'bg-indigo-100 text-indigo-600',
  },
];

export default function ReportsPage() {
  return (
    <AnimatedPage>
      <Header title="Reports & Analytics" subtitle="Fleet performance insights" />

      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Link key={report.name} href={report.href} className="card hover:border-brand-300 hover:shadow-md transition-all group">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${report.color}`}>
                  <report.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-700">
                    {report.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{report.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
}
