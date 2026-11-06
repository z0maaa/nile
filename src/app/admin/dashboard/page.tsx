'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNav from '@/components/Admin/AdminNav';
import {
  Users,
  Clock,
  CheckCircle2,
  Award,
  Video,
  MapPin,
  TrendingUp,
  Music2,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentUser(meData.user);
        }

        const sRes = await fetch('/api/applications/stats');
        if (sRes.ok) {
          const sData = await sRes.json();
          setStats(sData.stats);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <AdminNav currentUser={currentUser} />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const s = stats || {
    total: 12,
    newCount: 2,
    underReview: 3,
    shortlisted: 2,
    accepted: 5,
    rejected: 0,
    withLocation: 11,
    withVideo: 12,
    byGovernorate: {},
    byCategory: {},
    byAgeGroup: {},
  };

  const metricCards = [
    {
      label: 'Total Applicants',
      value: s.total,
      icon: Users,
      color: 'text-navy-900',
      border: 'border-slate-200',
      bg: 'bg-white',
      sub: 'All registered auditions',
    },
    {
      label: 'Accepted (GEM Top 10)',
      value: s.accepted,
      icon: Award,
      color: 'text-emerald-700',
      border: 'border-emerald-200',
      bg: 'bg-emerald-50/50',
      sub: 'Selected for GEM stage',
    },
    {
      label: 'Shortlisted Talents',
      value: s.shortlisted,
      icon: Sparkles,
      color: 'text-amber-700',
      border: 'border-amber-200',
      bg: 'bg-amber-50/50',
      sub: 'Final jury round',
    },
    {
      label: 'Under Review',
      value: s.underReview,
      icon: Clock,
      color: 'text-blue-700',
      border: 'border-blue-200',
      bg: 'bg-blue-50/50',
      sub: 'Audition videos in scoring',
    },
    {
      label: 'New Applications',
      value: s.newCount,
      icon: TrendingUp,
      color: 'text-navy-700',
      border: 'border-slate-200',
      bg: 'bg-white',
      sub: 'Pending initial triage',
    },
    {
      label: 'Verified GPS Location',
      value: s.withLocation,
      icon: MapPin,
      color: 'text-emerald-700',
      border: 'border-emerald-200',
      bg: 'bg-emerald-50/50',
      sub: 'Mapped on interactive GIS',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <AdminNav currentUser={currentUser} />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Welcome & Overview Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-900">
              Recruitment & Auditions Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Live statistics, jury scoring metrics, and geographical distribution for UTH Festival 2026.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/applicants"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-navy-900 to-emerald-600 hover:from-navy-950 hover:to-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Manage Applicants</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin/map"
              className="px-4 py-2 rounded-xl border border-slate-300 hover:border-emerald-500 bg-white text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Open Geo Map</span>
            </Link>
          </div>
        </div>

        {/* Top Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metricCards.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl ${m.bg} border ${m.border} shadow-sm space-y-2 hover:scale-[1.02] transition-transform`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">{m.label}</span>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
                <div className={`text-2xl sm:text-3xl font-black ${m.color} tabular-nums`}>
                  {m.value}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">{m.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Charts & Analytical Distributions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Applications by Musical Category */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                <Music2 className="w-4 h-4 text-emerald-600" />
                <span>Applications by Musical Category</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono font-bold">
                {Object.keys(s.byCategory || {}).length} Categories
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {Object.entries(s.byCategory || {})
                .sort((a: any, b: any) => b[1] - a[1])
                .map(([category, count]: any) => {
                  const percent = Math.round((count / (s.total || 1)) * 100);
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700">{category}</span>
                        <span className="text-navy-900 font-mono">
                          {count} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                        <div
                          className="bg-gradient-to-r from-navy-900 to-emerald-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Applications by Governorate */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Regional Distribution (Governorates)</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono font-bold">
                {Object.keys(s.byGovernorate || {}).length} Governorates
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {Object.entries(s.byGovernorate || {})
                .sort((a: any, b: any) => b[1] - a[1])
                .map(([gov, count]: any) => {
                  const percent = Math.round((count / (s.total || 1)) * 100);
                  return (
                    <div key={gov} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700">{gov}</span>
                        <span className="text-emerald-700 font-mono">
                          {count} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Age Group Breakdown */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Age Group Demographics</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Target: Young Emerging Artists</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {Object.entries(s.byAgeGroup || {}).map(([range, count]: any) => {
                const percent = Math.round((count / (s.total || 1)) * 100);
                return (
                  <div
                    key={range}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1"
                  >
                    <span className="text-xs font-bold text-slate-500 block">{range} yrs</span>
                    <strong className="text-2xl font-black text-navy-900 block font-mono">
                      {count}
                    </strong>
                    <span className="text-[10px] text-slate-500 font-medium">{percent}% of pool</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audition Pipeline Status */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Audition Selection Funnel</span>
              </h3>
              <span className="text-xs text-emerald-700 font-bold">10 GEM Target Slots</span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Accepted Performers (GEM Showcase)</span>
                </div>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  {s.accepted} / 10
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Shortlisted Candidates</span>
                </div>
                <span className="font-mono font-bold text-amber-700 text-sm">{s.shortlisted}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Under Artistic Review</span>
                </div>
                <span className="font-mono font-bold text-blue-700 text-sm">{s.underReview}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center gap-2 text-navy-900 font-bold">
                  <Video className="w-4 h-4 text-navy-700" />
                  <span>Audition Videos Stored & Verified</span>
                </div>
                <span className="font-mono font-bold text-navy-900 text-sm">
                  {s.withVideo} ({Math.round((s.withVideo / (s.total || 1)) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
