'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import gsap from 'gsap';
import {
  Car, Shield, Wrench, ClipboardCheck, MapPin,
  BarChart3, Fuel, Activity,
} from 'lucide-react';

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([logoRef.current, titleRef.current, subtitleRef.current, formRef.current], {
        opacity: 0,
        y: 30,
      });
      gsap.set('.feature-card', { opacity: 0, x: -30 });
      gsap.set('.floating-icon', { opacity: 0, scale: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(logoRef.current, { opacity: 1, y: 0, duration: 0.8 })
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .to(formRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
        .to('.feature-card', {
          opacity: 1, x: 0, duration: 0.5, stagger: 0.1,
        }, '-=0.3')
        .to('.floating-icon', {
          opacity: 0.15, scale: 1, duration: 0.8, stagger: 0.05,
        }, '-=0.8');

      // Floating icons drift
      gsap.utils.toArray<HTMLElement>('.floating-icon').forEach((icon, i) => {
        gsap.to(icon, {
          y: 'random(-20, 20)',
          x: 'random(-15, 15)',
          rotation: 'random(-15, 15)',
          duration: 'random(3, 5)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2,
        });
      });

      // Logo pulse
      gsap.to(logoRef.current, {
        boxShadow: '0 0 40px rgba(37, 99, 235, 0.4)',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    gsap.to(formRef.current?.querySelector('button'), {
      scale: 0.97, duration: 0.1, yoyo: true, repeat: 1,
    });

    try {
      const result = await api.post<{
        session: { access_token: string };
        profile: { role: string };
      }>('/auth/login', { email, password });

      api.setToken(result.session.access_token);
      localStorage.setItem('fleetpulse_token', result.session.access_token);

      const tl = gsap.timeline({
        onComplete: () => router.push('/dashboard'),
      });
      tl.to(formRef.current, { scale: 0.98, duration: 0.1 })
        .to(formRef.current, {
          scale: 1.02,
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)',
          borderColor: '#22c55e',
          duration: 0.3,
        })
        .to(containerRef.current, { opacity: 0, duration: 0.4 });
    } catch (err: any) {
      setError(err.message || 'Login failed');
      gsap.to(formRef.current, {
        x: [-10, 10, -8, 8, -4, 4, 0],
        duration: 0.5,
        ease: 'power2.out',
      });
    } finally {
      setLoading(false);
    }
  }

  const features = [
    { icon: Car, label: 'Asset Management', desc: '600+ vehicles tracked' },
    { icon: ClipboardCheck, label: 'DVIR Inspections', desc: 'Digital signatures' },
    { icon: Wrench, label: 'Work Orders', desc: 'Preventive & corrective' },
    { icon: MapPin, label: 'Live GPS Tracking', desc: 'Real-time fleet map' },
    { icon: Fuel, label: 'Fuel Analytics', desc: 'MPG & cost tracking' },
    { icon: BarChart3, label: 'Reports', desc: 'Compliance & insights' },
  ];

  const floatingIcons = [
    { Icon: Car, top: '10%', left: '5%', size: 48 },
    { Icon: Wrench, top: '20%', right: '8%', size: 36 },
    { Icon: Shield, bottom: '15%', left: '10%', size: 40 },
    { Icon: Activity, top: '60%', right: '5%', size: 32 },
    { Icon: MapPin, top: '35%', left: '3%', size: 28 },
    { Icon: Fuel, bottom: '30%', right: '12%', size: 34 },
    { Icon: ClipboardCheck, top: '75%', left: '15%', size: 30 },
    { Icon: BarChart3, top: '8%', right: '15%', size: 26 },
  ];

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
    >
      {/* Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((item, i) => (
          <div
            key={i}
            className="floating-icon absolute text-blue-400"
            style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
          >
            <item.Icon size={item.size} />
          </div>
        ))}
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Left Side - Features */}
      <div className="hidden lg:flex flex-col justify-center flex-1 px-16 relative z-10">
        <div>
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3 feature-card">
            Fleet Management Platform
          </p>
          <h2 className="text-4xl font-bold text-white mb-2 feature-card">
            Manage your entire fleet
          </h2>
          <h2 className="text-4xl font-bold text-blue-400 mb-6 feature-card">
            from one dashboard.
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-md feature-card">
            Streamline operations for 600+ vehicles with real-time tracking,
            automated maintenance, and compliance reporting.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{f.label}</p>
                  <p className="text-xs text-slate-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div
              ref={logoRef}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-2xl shadow-lg shadow-blue-500/25"
            >
              FP
            </div>
            <h1 ref={titleRef} className="mt-5 text-3xl font-bold text-white">
              FleetPulse
            </h1>
            <p ref={subtitleRef} className="mt-2 text-sm text-slate-400">
              Cloud-Based Fleet Management System
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl space-y-5"
          >
            <div>
              <h2 className="text-xl font-semibold text-white">Welcome back</h2>
              <p className="text-sm text-slate-400 mt-1">Sign in to your account</p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="you@organization.gov"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="flex items-center justify-between pt-2">
              <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </a>
              <a href="#" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
                Request access
              </a>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-slate-600">
            Brookhaven Science Associates, LLC
          </p>
        </div>
      </div>
    </div>
  );
}
