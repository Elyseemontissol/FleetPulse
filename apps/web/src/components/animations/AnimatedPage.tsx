'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export function AnimatedPage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    }, ref);
    return () => ctx.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
