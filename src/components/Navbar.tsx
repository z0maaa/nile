'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Music2, Globe, Shield, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { lang, toggleLang, t, isRtl } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/85 backdrop-blur-md transition-all">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-zinc-950 via-gold-950/40 to-zinc-950 border-b border-gold-500/20 py-1.5 px-4 text-center text-xs text-gold-300/90 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          <span>{t.independentDisclaimer}</span>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 p-[1px] shadow-glow transition group-hover:scale-105">
            <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <Music2 className="w-6 h-6 text-gold-400 transition group-hover:text-gold-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-wider text-white">UTH</span>
              <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-bold">
                2026
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">Grand Egyptian Museum</p>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <Link href="/" className="hover:text-gold-400 transition-colors">
            {t.nav.home}
          </Link>
          <a href="#about" className="hover:text-gold-400 transition-colors">
            {t.nav.about}
          </a>
          <a href="#benefits" className="hover:text-gold-400 transition-colors">
            {t.nav.benefits}
          </a>
          <a href="#requirements" className="hover:text-gold-400 transition-colors">
            {t.nav.requirements}
          </a>
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 hover:border-gold-500/40 bg-surface text-xs font-semibold text-zinc-300 hover:text-gold-300 transition-all"
            title="Toggle Language"
          >
            <Globe className="w-4 h-4 text-gold-400" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Admin Portal Shortcut */}
          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 hover:border-zinc-600 bg-surface/60 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-zinc-400" />
            <span>{t.nav.adminPortal}</span>
          </Link>

          {/* Apply Now Primary CTA */}
          <Link
            href="/apply"
            className="px-5 py-2.5 rounded-lg bg-gold-gradient text-zinc-950 font-bold text-sm tracking-wide shadow-glow hover:shadow-glow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {t.nav.applyNow}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLang}
            className="p-2 rounded-lg border border-white/10 bg-surface text-gold-400 text-xs font-bold"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-white/10 text-zinc-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-surface-card px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col space-y-3 font-medium text-zinc-300 text-base">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-white/5 hover:text-gold-400"
            >
              {t.nav.home}
            </Link>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-white/5 hover:text-gold-400"
            >
              {t.nav.about}
            </a>
            <a
              href="#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-white/5 hover:text-gold-400"
            >
              {t.nav.benefits}
            </a>
            <a
              href="#requirements"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-white/5 hover:text-gold-400"
            >
              {t.nav.requirements}
            </a>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 flex items-center gap-2 text-zinc-400"
            >
              <Shield className="w-4 h-4 text-gold-400" />
              <span>{t.nav.adminPortal}</span>
            </Link>
          </div>

          <div className="pt-2">
            <Link
              href="/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full block text-center py-3 rounded-lg bg-gold-gradient text-zinc-950 font-bold text-base shadow-glow"
            >
              {t.nav.applyNow}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

