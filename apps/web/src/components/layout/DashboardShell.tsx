'use client';

import { Sidebar } from './Sidebar';

export function DashboardShell({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
