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
  Music2,
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
  const { lang, toggleLang } = useLanguage();

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
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-900 to-emerald-600 p-[1px] shadow-sm">
                <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center">
                  <Music2 className="w-4 h-4 text-navy-900" />
                </div>
              </div>
              <span className="font-extrabold text-base tracking-wide text-navy-900">
                UTH 2026
              </span>
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
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
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
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
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-700 font-semibold truncate max-w-[120px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                  {currentUser.role}
                </span>
              </div>
            )}

            <button
              onClick={toggleLang}
              className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-navy-900 text-xs font-bold hover:border-emerald-500"
              title="Toggle Language"
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>

            <Link
              href="/"
              target="_blank"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs text-slate-600 hover:text-navy-900 transition-all font-medium"
              title="View Public Site"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-xs font-bold text-rose-600 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 text-xs">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/admin/dashboard' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-md ${
                  isActive ? 'text-emerald-700 font-bold' : 'text-slate-600'
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
