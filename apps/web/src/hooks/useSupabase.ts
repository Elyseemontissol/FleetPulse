'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';

export function useSupabaseQuery<T>(
  queryFn: (supabase: ReturnType<typeof createClient>) => PromiseLike<{ data: T | null; error: any; count?: number | null }>,
  deps: any[] = [],
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error, count } = await queryFn(supabase);
    if (error) {
      setError(error.message);
    } else {
      setData(data);
      setCount(count ?? null);
    }
    setLoading(false);
  }, deps);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, error, count, refetch };
}
