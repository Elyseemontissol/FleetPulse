'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fleetpulse_token');

    if (!token) {
      router.replace('/login');
      return;
    }

    api.setToken(token);

    api.get('/auth/me')
      .then(() => {
        setAuthorized(true);
        setChecking(false);
      })
      .catch(() => {
        localStorage.removeItem('fleetpulse_token');
        router.replace('/login');
      });
  }, [router]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-lg animate-pulse">
            FP
          </div>
          <p className="mt-4 text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
