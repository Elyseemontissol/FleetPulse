'use client';

import { AnimatedPage } from '@/components/animations/AnimatedPage';
import { Header } from '@/components/layout/Header';
import { Users, Link2, Building, Shield } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <AnimatedPage>
      <Header title="Settings" subtitle="System configuration" />

      <div className="p-6 space-y-6 max-w-4xl">
        <div className="card">
          <div className="flex items-center gap-4 mb-4">
            <Building className="h-6 w-6 text-gray-400" />
            <div>
              <h3 className="font-semibold text-gray-900">Organization</h3>
              <p className="text-sm text-gray-500">Brookhaven Science Associates, LLC</p>
            </div>
          </div>
        </div>

        <Link href="/settings/users" className="card flex items-center gap-4 hover:border-brand-300 transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">User Management</h3>
            <p className="text-sm text-gray-500">Manage users, roles, and permissions</p>
          </div>
        </Link>

        <Link href="/settings/integrations" className="card flex items-center gap-4 hover:border-brand-300 transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <Link2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Integrations</h3>
            <p className="text-sm text-gray-500">Telematics, fuel cards, and third-party connections</p>
          </div>
        </Link>

        <div className="card flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <Shield className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Security & Audit</h3>
            <p className="text-sm text-gray-500">Audit logs, session management, and security settings</p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
