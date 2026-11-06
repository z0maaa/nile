'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft, KeyRound, CheckCircle2, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { t, isRtl } = useLanguage();

  const [email, setEmail] = useState('admin@uthfestival.com');
  const [password, setPassword] = useState('UTHAdmin2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 px-4 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gold-gradient p-[1px] shadow-glow mx-auto">
            <div className="w-full h-full bg-zinc-950 rounded-[15px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-gold-400" />
            </div>
          </div>
        </Link>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t.admin.loginTitle}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            {t.admin.loginSubtitle}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="p-8 rounded-3xl glass-card border border-white/10 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                {t.admin.email}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute top-3.5 left-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-600 transition-all"
                  placeholder="admin@uthfestival.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                {t.admin.password}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute top-3.5 left-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-600 transition-all font-mono"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gold-gradient text-zinc-950 font-bold text-sm tracking-wide shadow-glow hover:shadow-glow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t.admin.loginBtn}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Roles Box */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider block flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Demo Staff Accounts (Click to Autofill)</span>
            </span>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@uthfestival.com', 'UTHAdmin2026!')}
                className="w-full text-left p-2.5 rounded-xl bg-surface border border-white/5 hover:border-gold-500/40 text-xs transition-all flex items-center justify-between"
              >
                <div>
                  <strong className="text-white block font-medium">Karim El-Sayed</strong>
                  <span className="text-zinc-500 text-[10px]">admin@uthfestival.com</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 font-bold text-[10px]">
                  SUPER ADMIN
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('jury@uthfestival.com', 'JuryReview2026!')}
                className="w-full text-left p-2.5 rounded-xl bg-surface border border-white/5 hover:border-gold-500/40 text-xs transition-all flex items-center justify-between"
              >
                <div>
                  <strong className="text-white block font-medium">Layla Mansour</strong>
                  <span className="text-zinc-500 text-[10px]">jury@uthfestival.com</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">
                  LEAD JURY
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('security@uthfestival.com', 'Security2026!')}
                className="w-full text-left p-2.5 rounded-xl bg-surface border border-white/5 hover:border-gold-500/40 text-xs transition-all flex items-center justify-between"
              >
                <div>
                  <strong className="text-white block font-medium">Tarek Zaki</strong>
                  <span className="text-zinc-500 text-[10px]">security@uthfestival.com</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                  SECURITY & COMPLIANCE
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-zinc-500 hover:text-gold-400 transition-colors">
            ← Return to UTH Festival Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

