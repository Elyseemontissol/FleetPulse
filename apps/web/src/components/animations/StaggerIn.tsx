'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface StaggerInProps {
  children: React.ReactNode;
  selector?: string;
  stagger?: number;
  y?: number;
  x?: number;
  duration?: number;
  delay?: number;
}

export function StaggerIn({
  children,
  selector = '.stagger-item',
  stagger = 0.06,
  y = 20,
  x = 0,
  duration = 0.5,
  delay = 0.1,
}: StaggerInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        selector,
        { opacity: 0, y, x },
        { opacity: 1, y: 0, x: 0, duration, stagger, delay, ease: 'power2.out' },
      );
    }, ref);
    return () => ctx.revert();
  }, [selector, stagger, y, x, duration, delay]);

  return <div ref={ref}>{children}</div>;
}
