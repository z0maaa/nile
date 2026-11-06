'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNav from '@/components/Admin/AdminNav';
import { ApplicantApplication } from '@/lib/types';
import { TALENT_CATEGORIES, EGYPT_GOVERNORATES } from '@/lib/translations';
import {
  Search,
  Filter,
  Download,
  Eye,
  MapPin,
  Video,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  Phone,
  User,
  Music2,
  RotateCcw,
} from 'lucide-react';

export default function ApplicantsListPage() {
  const [applicants, setApplicants] = useState<ApplicantApplication[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [filterGpsOnly, setFilterGpsOnly] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentUser(meData.user);
        }

        const res = await fetch('/api/applications');
        if (res.ok) {
          const data = await res.json();
          setApplicants(data.applications || []);
        }
      } catch (err) {
        console.error('Error fetching applicants:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter application list
  const filtered = applicants.filter((app) => {
    if (search) {
      const q = search.toLowerCase();
      const matchSearch =
        app.fullNameEnglish.toLowerCase().includes(q) ||
        app.fullNameArabic.includes(q) ||
        app.artistStageName.toLowerCase().includes(q) ||
        app.referenceNumber.toLowerCase().includes(q) ||
        app.emailAddress.toLowerCase().includes(q) ||
        app.mobilePhoneNumber.includes(q);
      if (!matchSearch) return false;
    }

    if (selectedGovernorate !== 'ALL' && app.governorate.toLowerCase() !== selectedGovernorate.toLowerCase()) {
      return false;
    }

    if (selectedCategory !== 'ALL' && app.mainTalentCategory !== selectedCategory) {
      return false;
    }

    if (selectedStatus !== 'ALL' && app.status !== selectedStatus) {
      return false;
    }

    if (filterGpsOnly && (!app.locationSharingAuthorized || !app.coordinates)) {
      return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSearch('');
    setSelectedGovernorate('ALL');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setFilterGpsOnly(false);
  };

  const handleExportCsv = () => {
    const headers = [
      'Reference Number',
      'Full Name English',
      'Full Name Arabic',
      'Artist Name',
      'Age',
      'Phone',
      'Email',
      'Governorate',
      'City',
      'Category',
      'Genre',
      'Experience (Years)',
      'Status',
      'GPS Lat',
      'GPS Lng',
      'Submission Date',
    ];

    const rows = filtered.map((a) => [
      a.referenceNumber,
      `"${a.fullNameEnglish.replace(/"/g, '""')}"`,
      `"${a.fullNameArabic.replace(/"/g, '""')}"`,
      `"${a.artistStageName.replace(/"/g, '""')}"`,
      a.calculatedAge,
      a.mobilePhoneNumber,
      a.emailAddress,
      a.governorate,
      a.city,
      `"${a.mainTalentCategory}"`,
      `"${a.musicalGenre}"`,
      a.yearsOfMusicalExperience,
      a.status,
      a.coordinates?.latitude || '',
      a.coordinates?.longitude || '',
      a.submittedAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UTH_Festival_2026_Applicants_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>ACCEPTED</span>
          </span>
        );
      case 'SHORTLISTED':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>SHORTLISTED</span>
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>REVIEW</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold">
            REJECTED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 text-[11px] font-bold">
            NEW
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminNav currentUser={currentUser} />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Talent Audition Database
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Search, filter, view applicant dossiers, rate performances, and schedule auditions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 rounded-xl border border-white/20 hover:border-gold-500/40 bg-surface-card hover:bg-zinc-800 text-xs font-bold text-zinc-200 transition-all flex items-center gap-2 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-gold-400" />
              <span>Export CSV</span>
            </button>
            <Link
              href="/admin/map"
              className="px-4 py-2 rounded-xl bg-gold-gradient text-zinc-950 text-xs font-bold shadow-glow hover:shadow-glow-lg transition-all flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>View Map</span>
            </Link>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-zinc-500 absolute top-3 left-3 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, artist, ref #, phone, email..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-xs text-white placeholder-zinc-500 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-xs text-zinc-200"
              >
                <option value="ALL">All Categories</option>
                {TALENT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.en}>
                    {c.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Governorate Filter */}
            <div>
              <select
                value={selectedGovernorate}
                onChange={(e) => setSelectedGovernorate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-xs text-zinc-200"
              >
                <option value="ALL">All Governorates</option>
                {EGYPT_GOVERNORATES.map((g) => (
                  <option key={g.id} value={g.en}>
                    {g.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-xs text-zinc-200"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">NEW</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="SHORTLISTED">SHORTLISTED</option>
                <option value="ACCEPTED">ACCEPTED (Top 10)</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs text-zinc-400">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filterGpsOnly}
                  onChange={(e) => setFilterGpsOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 text-gold-500 focus:ring-gold-500 accent-gold-500"
                />
                <span className="text-zinc-300">Verified GPS Sharing Only</span>
              </label>

              {(search || selectedGovernorate !== 'ALL' || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || filterGpsOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-gold-400 hover:text-gold-300 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>

            <div>
              Showing <strong className="text-gold-300">{filtered.length}</strong> of{' '}
              <span className="text-zinc-300">{applicants.length} applicants</span>
            </div>
          </div>
        </div>

        {/* Database Table */}
        <div className="rounded-2xl glass-card border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-surface-card border-b border-white/10 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Applicant</th>
                  <th className="py-3.5 px-3">Ref #</th>
                  <th className="py-3.5 px-3">Category & Genre</th>
                  <th className="py-3.5 px-3">Governorate</th>
                  <th className="py-3.5 px-3">Age / Exp</th>
                  <th className="py-3.5 px-3">Audition Video</th>
                  <th className="py-3.5 px-3">GPS</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-zinc-500">
                      <div className="w-6 h-6 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading applicant records...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-zinc-500">
                      No applicants found matching the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* Photo & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              app.personalProfessionalPhotoUrl ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
                            }
                            alt={app.fullNameEnglish}
                            className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                          />
                          <div className="min-w-0">
                            <strong className="text-white block font-bold truncate max-w-[160px]">
                              {app.artistStageName || app.fullNameEnglish}
                            </strong>
                            <span className="text-[11px] text-zinc-400 truncate block max-w-[160px]">
                              {app.fullNameEnglish}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Ref Number */}
                      <td className="py-3 px-3 font-mono font-bold text-gold-300">
                        {app.referenceNumber}
                      </td>

                      {/* Category & Genre */}
                      <td className="py-3 px-3">
                        <strong className="text-zinc-200 block truncate max-w-[150px]">
                          {app.mainTalentCategory}
                        </strong>
                        <span className="text-[11px] text-zinc-500 truncate block max-w-[150px]">
                          {app.musicalGenre || '---'}
                        </span>
                      </td>

                      {/* Governorate */}
                      <td className="py-3 px-3">
                        <span className="text-zinc-200 font-medium block">{app.governorate}</span>
                        <span className="text-[10px] text-zinc-500 block truncate max-w-[120px]">
                          {app.city}
                        </span>
                      </td>

                      {/* Age & Years of Experience */}
                      <td className="py-3 px-3 font-mono">
                        <span className="text-zinc-200 font-semibold">{app.calculatedAge} yrs</span>
                        <span className="text-zinc-500 block text-[10px]">
                          {app.yearsOfMusicalExperience} yrs exp
                        </span>
                      </td>

                      {/* Video Availability */}
                      <td className="py-3 px-3">
                        {app.auditionVideoUrl ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                            <Video className="w-3.5 h-3.5" />
                            <span>{app.auditionVideoDurationSeconds || 75}s</span>
                          </span>
                        ) : (
                          <span className="text-zinc-600">Pending</span>
                        )}
                      </td>

                      {/* GPS Status */}
                      <td className="py-3 px-3">
                        {app.locationSharingAuthorized && app.coordinates ? (
                          <span className="inline-flex items-center gap-1 text-sky-400 font-semibold text-[11px]" title="GPS Verified">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>GPS Pin</span>
                          </span>
                        ) : (
                          <span className="text-zinc-600">---</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/applicants/${app.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-white/10 hover:border-gold-500/40 text-gold-400 hover:text-gold-300 font-bold transition-all text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Dossier</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

