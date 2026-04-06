'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function CountUp({ end, duration = 1.2, prefix = '', suffix = '', decimals = 0, className }: CountUpProps): React.JSX.Element {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: end,
      duration,
      ease: 'power2.out',
      delay: 0.3,
      onUpdate: () => setDisplayed(obj.val),
    });
  }, [end, duration]);

  const formatted = decimals > 0
    ? displayed.toFixed(decimals)
    : Math.round(displayed).toLocaleString();

  return <span ref={ref} className={className}>{prefix}{formatted}{suffix}</span>;
}
