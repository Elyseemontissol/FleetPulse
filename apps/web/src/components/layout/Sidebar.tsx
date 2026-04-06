'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import gsap from 'gsap';
import {
  LayoutDashboard, Car, Wrench, ClipboardCheck, Calendar,
  Fuel, MapPin, BarChart3, Settings, LogOut,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Assets', href: '/assets', icon: Car },
  { name: 'Work Orders', href: '/work-orders', icon: Wrench },
  { name: 'Inspections', href: '/inspections', icon: ClipboardCheck },
  { name: 'Maintenance', href: '/maintenance', icon: Calendar },
  { name: 'Fuel', href: '/fuel', icon: Fuel },
  { name: 'Fleet Map', href: '/fleet-map', icon: MapPin },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.nav-item',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out', delay: 0.2 },
      );
      gsap.fromTo('.sidebar-logo',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
      );
    }, sidebarRef);
    return () => ctx.revert();
  }, []);

  return (
    <aside ref={sidebarRef} className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <div className="sidebar-logo flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">
          FP
        </div>
        <span className="text-lg font-semibold text-gray-900">FleetPulse</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'nav-item flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <button
          onClick={async () => {
            const { createClient } = await import('@/lib/supabase');
            await createClient().auth.signOut();
            localStorage.removeItem('fleetpulse_token');
            window.location.href = '/login';
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
