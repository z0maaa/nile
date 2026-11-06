'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import {
  LayoutDashboard,
  Users,
  MapPin,
  ClipboardList,
  LogOut,
  Shield,
  Music2,
  Globe,
  ExternalLink,
} from 'lucide-react';

interface AdminNavProps {
  currentUser?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function AdminNav({ currentUser }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, toggleLang, isRtl } = useLanguage();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      router.push('/admin/login');
    }
  };

  const navLinks = [
    { href: '/admin/dashboard', label: 'Overview & Stats', icon: LayoutDashboard },
    { href: '/admin/applicants', label: 'Applicants Database', icon: Users },
    { href: '/admin/map', label: 'Geographic Map', icon: MapPin },
    { href: '/admin/audit', label: 'Audit Trail', icon: ClipboardList },
  ];

  return (
    <header className="border-b border-white/10 bg-surface sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gold-gradient p-[1px]">
                <div className="w-full h-full bg-zinc-950 rounded-[7px] flex items-center justify-center">
                  <Music2 className="w-4 h-4 text-gold-400" />
                </div>
              </div>
              <span className="font-extrabold text-base tracking-wide text-white">
                UTH 2026
              </span>
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gold-500/20 text-gold-300 border border-gold-500/30">
              Admin Portal
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/admin/dashboard' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gold-500 text-zinc-950 font-bold shadow-glow'
                      : 'text-zinc-400 hover:text-white hover:bg-surface-card'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: User Role Badge, Public Site Link, Logout */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-card border border-white/10 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-300 font-medium truncate max-w-[120px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-gold-300 border border-white/5 uppercase">
                  {currentUser.role}
                </span>
              </div>
            )}

            <button
              onClick={toggleLang}
              className="p-2 rounded-lg border border-white/10 bg-surface-card text-gold-400 text-xs font-bold hover:border-gold-500/40"
              title="Toggle Language"
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>

            <Link
              href="/"
              target="_blank"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-zinc-500 bg-surface-card text-xs text-zinc-400 hover:text-zinc-200 transition-all"
              title="View Public Site"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-950/20 text-xs font-semibold text-rose-400 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-white/5 text-xs">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/admin/dashboard' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-md ${
                  isActive ? 'text-gold-400 font-bold' : 'text-zinc-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px]">{link.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

