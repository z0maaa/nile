'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import confetti from 'canvas-confetti';
import { CheckCircle, Award, Printer, ArrowRight, ArrowLeft, Video, MapPin, Calendar, Share2 } from 'lucide-react';

interface ConfirmationProps {
  referenceNumber: string;
  applicantName: string;
  artistName: string;
  category: string;
  submittedAt: string;
  hasVideo: boolean;
  hasGps: boolean;
}

export default function ConfirmationScreen({
  referenceNumber,
  applicantName,
  artistName,
  category,
  submittedAt,
  hasVideo,
  hasGps,
}: ConfirmationProps) {
  const { t, isRtl } = useLanguage();

  useEffect(() => {
    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFFFFF', '#F59E0B', '#10B981'],
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 animate-fadeIn">
      {/* Success Badge & Headline */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-gold-gradient p-1 mx-auto shadow-glow-lg animate-bounce">
          <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-gold-400" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30">
            {t.success.congratulations}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {t.success.headline}
          </h2>
        </div>
      </div>

      {/* Official Reference Number Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-gold-950/40 via-surface-card to-zinc-950 border-2 border-gold-500/50 text-center shadow-glow space-y-2">
        <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">
          {t.success.refLabel}
        </span>
        <div className="text-3xl sm:text-4xl font-mono font-black text-gold-shimmer tracking-wider select-all">
          {referenceNumber}
        </div>
        <p className="text-xs text-zinc-400 max-w-md mx-auto pt-1">
          {t.success.keepSafe}
        </p>
      </div>

      {/* Summary Dossier Card */}
      <div className="p-6 rounded-2xl bg-surface border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white pb-3 border-b border-white/10 flex items-center justify-between">
          <span>{t.success.detailsSummary}</span>
          <span className="text-xs text-gold-400 font-mono">
            {new Date(submittedAt).toLocaleString(isRtl ? 'ar-EG' : 'en-US')}
          </span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-zinc-500 block uppercase text-[10px]">{t.success.applicantName}</span>
            <strong className="text-zinc-200 block text-sm mt-0.5">{applicantName}</strong>
          </div>
          <div>
            <span className="text-zinc-500 block uppercase text-[10px]">{t.success.artistName}</span>
            <strong className="text-gold-300 block text-sm mt-0.5">{artistName}</strong>
          </div>
          <div>
            <span className="text-zinc-500 block uppercase text-[10px]">{t.success.category}</span>
            <strong className="text-zinc-200 block text-sm mt-0.5">{category}</strong>
          </div>
          <div>
            <span className="text-zinc-500 block uppercase text-[10px]">{isRtl ? 'مكان وموعد المهرجان' : 'Venue & Date'}</span>
            <strong className="text-zinc-200 block text-sm mt-0.5">
              Grand Egyptian Museum (Nov 20–21, 2026)
            </strong>
          </div>
        </div>

        <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
          {hasVideo && (
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{t.success.videoReceived}</span>
            </div>
          )}
          {hasGps && (
            <div className="flex items-center gap-2 text-gold-400">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{t.success.locationReceived}</span>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps Guide */}
      <div className="p-6 rounded-2xl bg-surface-card border border-white/10 space-y-3 text-xs leading-relaxed">
        <h4 className="text-sm font-bold text-gold-300 mb-2">{t.success.nextStepsTitle}</h4>
        <p className="text-zinc-300">{t.success.step1}</p>
        <p className="text-zinc-300">{t.success.step2}</p>
        <p className="text-zinc-300">{t.success.step3}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl border border-white/20 bg-surface hover:bg-zinc-800 text-zinc-200 text-xs font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Printer className="w-4 h-4 text-gold-400" />
          <span>{t.success.printBtn}</span>
        </button>

        <Link
          href="/"
          className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-gold-gradient text-zinc-950 text-xs font-bold flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg transition-all"
        >
          <span>{t.success.homeBtn}</span>
          {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </Link>
      </div>
    </div>
  );
}

