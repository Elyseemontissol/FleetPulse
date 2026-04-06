'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface AnimatedTableProps {
  children: React.ReactNode;
  loading?: boolean;
}

export function AnimatedTable({ children, loading }: AnimatedTableProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        'tbody tr',
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out', delay: 0.15 },
      );
    }, ref);
    return () => ctx.revert();
  }, [loading, children]);

  return <div ref={ref}>{children}</div>;
}
