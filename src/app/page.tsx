'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CountdownTimer from '@/components/CountdownTimer';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sparkles,
  Music2,
  Calendar,
  MapPin,
  Award,
  Video,
  Mic2,
  Headphones,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Disc3,
  Flame,
} from 'lucide-react';

export default function HomePage() {
  const { t, isRtl } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-gold-500/30 selection:text-gold-200">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 overflow-hidden border-b border-white/5">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gold-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Top Location & Date Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-gold-500/30 text-xs font-semibold text-gold-300 shadow-glow">
            <MapPin className="w-4 h-4 text-gold-400" />
            <span>{t.hero.tag}</span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-none">
              <span className="block text-gold-shimmer">{t.hero.title}</span>
              <span className="block text-2xl sm:text-4xl md:text-5xl font-extrabold text-zinc-100 mt-2">
                {t.hero.subtitle}
              </span>
            </h1>

            <p className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal">
              {t.hero.description}
            </p>
          </div>

          {/* Application Deadline Countdown Timer */}
          <div className="py-2">
            <CountdownTimer />
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/apply"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold-gradient text-zinc-950 font-black text-base tracking-wider uppercase shadow-glow-lg hover:shadow-glow transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              <span>{t.hero.applyCta}</span>
              {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </Link>

            <a
              href="#requirements"
              className="w-full sm:w-auto px-7 py-4 rounded-xl glass-card border border-white/20 hover:border-gold-500/50 text-zinc-200 text-sm font-bold transition-all hover:bg-surface-card flex items-center justify-center gap-2"
            >
              <span>{t.hero.exploreCta}</span>
            </a>
          </div>

          {/* 10 Selected Talents Highlights Bar */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl glass-card border border-white/10">
              <div className="p-3 text-center">
                <span className="block text-2xl sm:text-3xl font-black text-gold-shimmer">10</span>
                <span className="text-xs text-zinc-400 font-medium">Selected Talents</span>
              </div>
              <div className="p-3 text-center border-l border-white/10">
                <span className="block text-2xl sm:text-3xl font-black text-gold-shimmer">4K</span>
                <span className="text-xs text-zinc-400 font-medium">Music Video Shoot</span>
              </div>
              <div className="p-3 text-center border-l border-white/10">
                <span className="block text-2xl sm:text-3xl font-black text-gold-shimmer">GEM</span>
                <span className="text-xs text-zinc-400 font-medium">Live Showcase Stage</span>
              </div>
              <div className="p-3 text-center border-l border-white/10">
                <span className="block text-2xl sm:text-3xl font-black text-gold-shimmer">100%</span>
                <span className="text-xs text-zinc-400 font-medium">Free Application</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "ARE YOU THE NEXT NEW VOICE?" SECTION */}
      <section id="about" className="py-20 relative bg-surface border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 inline-block">
              Talent Discovery
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              {t.nextVoice.title}
            </h2>
            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
              "{t.nextVoice.description}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl glass-card glass-card-hover space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shadow-glow">
                <Mic2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {t.nextVoice.feature1Title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {t.nextVoice.feature1Desc}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl glass-card glass-card-hover space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shadow-glow">
                <Headphones className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {t.nextVoice.feature2Title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {t.nextVoice.feature2Desc}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl glass-card glass-card-hover space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shadow-glow">
                <Video className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {t.nextVoice.feature3Title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {t.nextVoice.feature3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS AND PRIZES SECTION */}
      <section id="benefits" className="py-20 relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 inline-block">
              {t.benefits.subtitle}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              {t.benefits.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Benefit 1 */}
            <div className="p-8 rounded-3xl glass-card glass-card-hover flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-gold-gradient p-[1px] shrink-0">
                <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                  <Video className="w-6 h-6 text-gold-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white">
                  {t.benefits.item1Title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {t.benefits.item1Desc}
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="p-8 rounded-3xl glass-card glass-card-hover flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-gold-gradient p-[1px] shrink-0">
                <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                  <Mic2 className="w-6 h-6 text-gold-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white">
                  {t.benefits.item2Title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {t.benefits.item2Desc}
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="p-8 rounded-3xl glass-card glass-card-hover flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-gold-gradient p-[1px] shrink-0">
                <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                  <Disc3 className="w-6 h-6 text-gold-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white">
                  {t.benefits.item3Title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {t.benefits.item3Desc}
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="p-8 rounded-3xl glass-card glass-card-hover flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-gold-gradient p-[1px] shrink-0">
                <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
                  <Flame className="w-6 h-6 text-gold-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white">
                  {t.benefits.item4Title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {t.benefits.item4Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VENUE: GRAND EGYPTIAN MUSEUM */}
      <section className="py-20 relative bg-surface overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{t.locationSection.city}</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                {t.locationSection.title}
              </h2>
              <p className="text-gold-300 font-semibold text-lg">
                {t.locationSection.subtitle}
              </p>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                {t.locationSection.desc}
              </p>

              <div className="p-4 rounded-2xl bg-surface-card border border-gold-500/30 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3 text-zinc-200">
                  <Calendar className="w-5 h-5 text-gold-400" />
                  <span className="font-bold">{t.locationSection.dates}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-gold-500 text-zinc-950 font-black text-xs">
                  GEM 2026
                </span>
              </div>
            </div>

            {/* Visual Image Card */}
            <div className="relative rounded-3xl overflow-hidden border border-gold-500/40 shadow-glow-lg group">
              <img
                src="https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80"
                alt="Grand Egyptian Museum Historic Stage"
                className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent flex flex-col justify-end p-8">
                <span className="text-gold-400 font-bold text-xs uppercase tracking-widest mb-1">
                  Monumental Venue
                </span>
                <h4 className="text-2xl font-black text-white">Grand Egyptian Museum</h4>
                <p className="text-zinc-300 text-xs mt-1">
                  The ultimate destination for Egypt's next musical icons.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REQUIREMENTS SECTION */}
      <section id="requirements" className="py-20 relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 inline-block">
              Checklist
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              {t.requirements.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold">
                1
              </div>
              <h4 className="text-base font-bold text-white">{t.requirements.item1Title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{t.requirements.item1Desc}</p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold">
                2
              </div>
              <h4 className="text-base font-bold text-white">{t.requirements.item2Title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{t.requirements.item2Desc}</p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold">
                3
              </div>
              <h4 className="text-base font-bold text-white">{t.requirements.item3Title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{t.requirements.item3Desc}</p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold">
                4
              </div>
              <h4 className="text-base font-bold text-white">{t.requirements.item4Title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{t.requirements.item4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 relative bg-gradient-to-b from-surface to-background text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gold-gradient p-[1px] mx-auto shadow-glow">
            <div className="w-full h-full bg-zinc-950 rounded-[23px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gold-400" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white">
            {isRtl ? 'فرصتك تبدأ الآن – قدّم لتجارب الأداء' : 'Your Breakthrough Moment Starts Here'}
          </h2>

          <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto">
            {isRtl
              ? 'باب التقديم مفتوح حتى 12 نوفمبر 2026. جهز فيديو أدائك (60-90 ثانية) وشارك موهبتك مع لجنة التحكيم.'
              : 'Auditions close November 12, 2026. Have your 60–90 second audition video ready and submit your application.'}
          </p>

          <div className="pt-4">
            <Link
              href="/apply"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gold-gradient text-zinc-950 font-black text-lg tracking-wider uppercase shadow-glow-lg hover:shadow-glow transition-all hover:scale-105 active:scale-95"
            >
              <span>{t.nav.applyNow}</span>
              {isRtl ? <ArrowLeft className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

