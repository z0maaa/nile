'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Clock, AlertCircle } from 'lucide-react';

export default function CountdownTimer() {
  const { t } = useLanguage();

  // Target deadline: November 12, 2026, 23:59:59 Cairo Time (UTC+2)
  const targetDate = new Date('2026-11-12T23:59:59+02:00').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isEnded: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isEnded: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isEnded: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: t.hero.days, value: timeLeft.days },
    { label: t.hero.hours, value: timeLeft.hours },
    { label: t.hero.minutes, value: timeLeft.minutes },
    { label: t.hero.seconds, value: timeLeft.seconds },
  ];

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 rounded-2xl glass-card border border-gold-500/30 shadow-glow relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2 text-gold-400 font-bold tracking-wider uppercase">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>{t.hero.deadlineBadge}</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold text-[11px]">
          12 NOV 2026
        </span>
      </div>

      {timeLeft.isEnded ? (
        <div className="py-4 text-center text-rose-400 font-bold flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{t.hero.countdownEnded}</span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {units.map((unit, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-surface border border-white/5 shadow-inner group hover:border-gold-500/40 transition-all"
            >
              <span className="text-2xl sm:text-4xl font-black text-gold-shimmer tabular-nums">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

