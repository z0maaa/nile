'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Music2, Globe, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { lang, toggleLang, t, isRtl } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md transition-all shadow-sm">
      {/* Top Banner Notice */}
      <div className="bg-navy-900 border-b border-navy-800 py-2 px-4 text-center text-xs text-emerald-300 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{t.independentDisclaimer}</span>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy-900 via-navy-700 to-emerald-600 p-[1px] shadow-sm transition group-hover:scale-105">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
              <Music2 className="w-6 h-6 text-navy-900 transition group-hover:text-emerald-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-wider text-navy-900">UTH</span>
              <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                2026
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Grand Egyptian Museum</p>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            {t.nav.home}
          </Link>
          <a href="#about" className="hover:text-emerald-600 transition-colors">
            {t.nav.about}
          </a>
          <a href="#benefits" className="hover:text-emerald-600 transition-colors">
            {t.nav.benefits}
          </a>
          <a href="#requirements" className="hover:text-emerald-600 transition-colors">
            {t.nav.requirements}
          </a>
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-emerald-500/50 bg-slate-50 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-all"
            title="Toggle Language"
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Apply Now Primary CTA */}
          <Link
            href="/apply"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-navy-900 via-navy-800 to-emerald-600 hover:from-navy-950 hover:to-emerald-700 text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {t.nav.applyNow}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLang}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-navy-900 text-xs font-bold"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:text-navy-900"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3 font-semibold text-slate-700 text-base">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-100 hover:text-emerald-600"
            >
              {t.nav.home}
            </Link>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-100 hover:text-emerald-600"
            >
              {t.nav.about}
            </a>
            <a
              href="#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-100 hover:text-emerald-600"
            >
              {t.nav.benefits}
            </a>
            <a
              href="#requirements"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-slate-100 hover:text-emerald-600"
            >
              {t.nav.requirements}
            </a>
          </div>

          <div className="pt-2">
            <Link
              href="/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full block text-center py-3 rounded-xl bg-gradient-to-r from-navy-900 to-emerald-600 text-white font-bold text-base shadow-md"
            >
              {t.nav.applyNow}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
