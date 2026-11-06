'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import confetti from 'canvas-confetti';
import { CheckCircle, Printer, ArrowRight, ArrowLeft, MapPin } from 'lucide-react';

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
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0A192F', '#10B981', '#059669', '#34D399'],
      });
    } catch (e) {}
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 animate-fadeIn text-slate-900">
      {/* Success Badge & Headline */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 p-1 mx-auto shadow-md animate-bounce">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            {t.success.congratulations}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900">
            {t.success.headline}
          </h2>
        </div>
      </div>

      {/* Official Reference Number Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 text-white text-center shadow-lg space-y-2">
        <span className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
          {t.success.refLabel}
        </span>
        <div className="text-3xl sm:text-4xl font-mono font-black text-emerald-400 tracking-wider select-all">
          {referenceNumber}
        </div>
        <p className="text-xs text-slate-300 max-w-md mx-auto pt-1 font-medium">
          {t.success.keepSafe}
        </p>
      </div>

      {/* Summary Dossier Card */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-sm">
        <h4 className="text-sm font-bold text-navy-900 pb-3 border-b border-slate-200 flex items-center justify-between">
          <span>{t.success.detailsSummary}</span>
          <span className="text-xs text-emerald-700 font-mono font-bold">
            {new Date(submittedAt).toLocaleString(isRtl ? 'ar-EG' : 'en-US')}
          </span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block uppercase text-[10px] font-bold">{t.success.applicantName}</span>
            <strong className="text-navy-900 block text-sm mt-0.5">{applicantName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block uppercase text-[10px] font-bold">{t.success.artistName}</span>
            <strong className="text-emerald-700 block text-sm mt-0.5">{artistName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block uppercase text-[10px] font-bold">{t.success.category}</span>
            <strong className="text-navy-900 block text-sm mt-0.5">{category}</strong>
          </div>
          <div>
            <span className="text-slate-500 block uppercase text-[10px] font-bold">{isRtl ? 'مكان وموعد المهرجان' : 'Venue & Date'}</span>
            <strong className="text-navy-900 block text-sm mt-0.5">
              Grand Egyptian Museum (Nov 20–21, 2026)
            </strong>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
          {hasVideo && (
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{t.success.videoReceived}</span>
            </div>
          )}
          {hasGps && (
            <div className="flex items-center gap-2 text-navy-900 font-semibold">
              <MapPin className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{t.success.locationReceived}</span>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps Guide */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs leading-relaxed shadow-sm">
        <h4 className="text-sm font-bold text-navy-900 mb-2">{t.success.nextStepsTitle}</h4>
        <p className="text-slate-700">{t.success.step1}</p>
        <p className="text-slate-700">{t.success.step2}</p>
        <p className="text-slate-700">{t.success.step3}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Printer className="w-4 h-4 text-emerald-600" />
          <span>{t.success.printBtn}</span>
        </button>

        <Link
          href="/"
          className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-navy-900 to-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <span>{t.success.homeBtn}</span>
          {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </Link>
      </div>
    </div>
  );
}
