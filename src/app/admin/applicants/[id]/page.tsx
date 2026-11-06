'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AdminNav from '@/components/Admin/AdminNav';
import { ApplicantApplication } from '@/lib/types';
import {
  ArrowLeft,
  Video,
  FileText,
  MapPin,
  Calendar,
  Mail,
  CheckCircle2,
  Award,
  ExternalLink,
  Download,
  Eye,
  MessageCircle,
  X,
  History,
} from 'lucide-react';

export default function ApplicantDossierPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [applicant, setApplicant] = useState<ApplicantApplication | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingEvaluation, setSavingEvaluation] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Document modal viewer
  const [previewDoc, setPreviewDoc] = useState<{ url: string; title: string; isPdf: boolean } | null>(null);

  // Audition Scheduling State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    scheduledDate: '2026-11-18',
    scheduledTime: '15:00',
    type: 'IN_PERSON_GEM',
    venueOrLink: 'Grand Egyptian Museum - Rehearsal Room 1',
    notes: 'Acoustic vocal audition and jury interview',
  });

  // Evaluation Form State (1 to 10 scores)
  const [evalScores, setEvalScores] = useState({
    vocalQuality: 8,
    stagePresence: 8,
    musicalTalent: 8,
    originality: 8,
    overallPerformance: 8,
    privateNotes: '',
  });

  useEffect(() => {
    async function fetchApplicant() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentUser(meData.user);
        }

        const res = await fetch(`/api/applications/${id}`);
        if (!res.ok) {
          router.push('/admin/applicants');
          return;
        }
        const data = await res.json();
        const app = data.application;
        setApplicant(app);

        if (app.evaluation) {
          setEvalScores({
            vocalQuality: app.evaluation.vocalQuality || 8,
            stagePresence: app.evaluation.stagePresence || 8,
            musicalTalent: app.evaluation.musicalTalent || 8,
            originality: app.evaluation.originality || 8,
            overallPerformance: app.evaluation.overallPerformance || 8,
            privateNotes: app.evaluation.privateNotes || '',
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchApplicant();
  }, [id, router]);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const json = await res.json();
        setApplicant(json.application);
        setStatusMessage(`Status successfully updated to ${newStatus}`);
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEvaluation(true);
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evaluation: evalScores,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setApplicant(json.application);
        setStatusMessage('Jury evaluation & score recorded successfully!');
        setTimeout(() => setStatusMessage(null), 3500);
      }
    } catch (err) {
      alert('Failed to save evaluation');
    } finally {
      setSavingEvaluation(false);
    }
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditionSchedule: scheduleData,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setApplicant(json.application);
        setShowScheduleModal(false);
        setStatusMessage('Live audition scheduled successfully!');
        setTimeout(() => setStatusMessage(null), 3500);
      }
    } catch (err) {
      alert('Failed to schedule audition');
    }
  };

  if (loading || !applicant) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <AdminNav currentUser={currentUser} />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const currentAvgScore = (
    (Number(evalScores.vocalQuality) +
      Number(evalScores.stagePresence) +
      Number(evalScores.musicalTalent) +
      Number(evalScores.originality) +
      Number(evalScores.overallPerformance)) /
    5
  ).toFixed(1);

  const cleanPhone = applicant.whatsappNumber?.replace(/[^0-9]/g, '') || applicant.mobilePhoneNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${applicant.artistStageName || applicant.fullNameEnglish}, this is the UTH Festival 2026 Artistic Recruitment Jury regarding your application (${applicant.referenceNumber}).`
  )}`;

  const mailtoUrl = `mailto:${applicant.emailAddress}?subject=${encodeURIComponent(
    `UTH Festival 2026 Auditions - Ref: ${applicant.referenceNumber}`
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <AdminNav currentUser={currentUser} />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/admin/applicants"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-navy-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Applicants Database</span>
          </Link>

          <span className="text-xs font-mono font-bold text-navy-900">
            Dossier #{applicant.referenceNumber}
          </span>
        </div>

        {statusMessage && (
          <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* TOP PROFILE HERO CARD */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Applicant Identity */}
            <div className="flex items-center gap-5">
              <img
                src={
                  applicant.personalProfessionalPhotoUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                }
                alt={applicant.fullNameEnglish}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm shrink-0"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-navy-900">
                    {applicant.artistStageName || applicant.fullNameEnglish}
                  </h1>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                    {applicant.referenceNumber}
                  </span>
                </div>
                <p className="text-sm text-slate-700 font-medium">
                  {applicant.fullNameEnglish} • <span dir="rtl">{applicant.fullNameArabic}</span>
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1">
                  <span>🎵 {applicant.mainTalentCategory} ({applicant.musicalGenre})</span>
                  <span>📍 {applicant.governorate}, {applicant.city}</span>
                  <span>🎂 {applicant.calculatedAge} Years Old</span>
                </div>
              </div>
            </div>

            {/* Status & Decision Action Bar */}
            <div className="flex flex-col sm:items-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Current Status:</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-navy-900 font-black text-xs">
                  {applicant.status}
                </span>
              </div>

              {/* Quick Decision Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('ACCEPTED')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Accept (GEM Top 10)
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('SHORTLISTED')}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Shortlist
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('UNDER_REVIEW')}
                  className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Under Review
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('REJECTED')}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-300 transition-all"
                >
                  Reject
                </button>
              </div>

              {/* Direct Communication Channels */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Chat</span>
                </a>
                <a
                  href={mailtoUrl}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5 text-navy-800" />
                  <span>Email</span>
                </a>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-navy-900 to-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Audition</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AUDITION VIDEO PLAYER & JURY EVALUATION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Audition Video Player (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-emerald-600" />
                  <span>Audition Video (Performance Review)</span>
                </h3>
                <span className="text-xs text-navy-900 font-mono font-bold">
                  Duration: {applicant.auditionVideoDurationSeconds || 75}s
                </span>
              </div>

              {applicant.auditionVideoUrl ? (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-200 shadow-lg relative">
                  <video
                    src={applicant.auditionVideoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 text-xs font-medium">
                  No audition video uploaded
                </div>
              )}

              {/* Declarations verified badge */}
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1 text-[11px] text-emerald-950">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Genuine Vocal/Live Performance</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Confirmed Rights Authorization & Rehearsal Availability</span>
                </div>
              </div>
            </div>

            {/* Audition Questions & Answers */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-navy-900 pb-3 border-b border-slate-100">
                Applicant Artistic Questionnaire
              </h3>

              <div className="space-y-4 text-xs leading-relaxed">
                <div>
                  <span className="text-navy-900 font-bold block mb-1">
                    Why participate in UTH Festival 2026?
                  </span>
                  <p className="text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium">
                    {applicant.whyParticipate || '---'}
                  </p>
                </div>

                <div>
                  <span className="text-navy-900 font-bold block mb-1">
                    What makes their musical talent unique?
                  </span>
                  <p className="text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium">
                    {applicant.uniqueMusicalTalent || '---'}
                  </p>
                </div>

                <div>
                  <span className="text-navy-900 font-bold block mb-1">
                    Near & Long-Term Musical Goals
                  </span>
                  <p className="text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium">
                    {applicant.musicalGoals || '---'}
                  </p>
                </div>

                {/* Readiness Flags */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                    <span className="text-slate-500 block">Live Audience</span>
                    <strong className="text-slate-800 font-bold">
                      {applicant.liveAudiencePerformance ? '✓ Experienced' : '✗ None'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                    <span className="text-slate-500 block">Large Stage Comfort</span>
                    <strong className="text-slate-800 font-bold">
                      {applicant.comfortableLargeStage ? '✓ Ready' : '✗ Hesitant'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                    <span className="text-slate-500 block">Nov 20-21 Availability</span>
                    <strong className="text-emerald-700 font-bold">
                      {applicant.availableFestivalDates ? '✓ 100% Available' : '✗ Conflicts'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Jury Performance Evaluation Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Jury Performance Evaluation</span>
                </h3>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono font-black text-sm">
                  <span>{currentAvgScore}</span>
                  <span className="text-xs text-slate-500 font-normal">/ 10</span>
                </div>
              </div>

              <form onSubmit={handleSaveEvaluation} className="space-y-4">
                {[
                  {
                    key: 'vocalQuality',
                    label: 'Vocal Quality (Pitch, Tone, Breath Control)',
                    value: evalScores.vocalQuality,
                  },
                  {
                    key: 'stagePresence',
                    label: 'Stage Presence & Charisma',
                    value: evalScores.stagePresence,
                  },
                  {
                    key: 'musicalTalent',
                    label: 'Musicality & Technical Skill',
                    value: evalScores.musicalTalent,
                  },
                  {
                    key: 'originality',
                    label: 'Originality & Artistic Identity',
                    value: evalScores.originality,
                  },
                  {
                    key: 'overallPerformance',
                    label: 'Overall Performance Impression',
                    value: evalScores.overallPerformance,
                  },
                ].map((crit) => (
                  <div key={crit.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">{crit.label}</span>
                      <span className="font-mono font-bold text-navy-900">{crit.value} / 10</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={0.5}
                      value={crit.value}
                      onChange={(e) =>
                        setEvalScores((prev) => ({
                          ...prev,
                          [crit.key]: Number(e.target.value),
                        }))
                      }
                      className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                  </div>
                ))}

                {/* Private Jury Evaluation Notes */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Private Jury / Reviewer Evaluation Notes
                  </label>
                  <textarea
                    rows={4}
                    value={evalScores.privateNotes}
                    onChange={(e) =>
                      setEvalScores((prev) => ({ ...prev, privateNotes: e.target.value }))
                    }
                    placeholder="Enter confidential notes, vocal timbre remarks, and audition recommendations..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 text-xs text-slate-900 placeholder-slate-400 transition-all outline-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingEvaluation}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-navy-900 to-emerald-600 hover:from-navy-950 hover:to-emerald-700 text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {savingEvaluation ? 'Saving Evaluation...' : 'Save Jury Evaluation'}
                </button>
              </form>
            </div>

            {/* Scheduled Audition Card if present */}
            {applicant.auditionSchedule && (
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Audition Scheduled</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold">
                    {applicant.auditionSchedule.status}
                  </span>
                </div>
                <div className="text-xs space-y-1 text-slate-800 font-medium">
                  <p>
                    <strong>Date & Time:</strong> {applicant.auditionSchedule.scheduledDate} at{' '}
                    {applicant.auditionSchedule.scheduledTime}
                  </p>
                  <p>
                    <strong>Venue / Link:</strong> {applicant.auditionSchedule.venueOrLink}
                  </p>
                  {applicant.auditionSchedule.notes && (
                    <p className="text-slate-600 italic">{applicant.auditionSchedule.notes}</p>
                  )}
                </div>
              </div>
            )}

            {/* Geographic Coordinates Card */}
            {applicant.locationSharingAuthorized && applicant.coordinates && (
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Voluntary GPS Location</span>
                  </span>
                  <a
                    href={`https://www.google.com/maps?q=${applicant.coordinates.latitude},${applicant.coordinates.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="font-mono text-slate-700 font-semibold">
                  Latitude: <strong className="text-navy-900">{applicant.coordinates.latitude}</strong> • Longitude:{' '}
                  <strong className="text-navy-900">{applicant.coordinates.longitude}</strong>
                </div>
                {applicant.coordinates.addressLabel && (
                  <p className="text-slate-500 text-[11px] font-medium">{applicant.coordinates.addressLabel}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* DETAILED INFORMATION TABS & DOSSIER SECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section: Personal & Contact */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-navy-900 pb-3 border-b border-slate-100">
              Personal & Identification Records
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">National ID (14-digit)</span>
                <strong className="text-navy-900 font-mono block mt-0.5">
                  {applicant.nationalIdNumber}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Date of Birth</span>
                <strong className="text-slate-800 block mt-0.5">{applicant.dateOfBirth}</strong>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Gender / Marital</span>
                <strong className="text-slate-800 block mt-0.5">
                  {applicant.gender} • {applicant.maritalStatus}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Nationality</span>
                <strong className="text-slate-800 block mt-0.5">{applicant.nationality}</strong>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Mobile Phone</span>
                <strong className="text-slate-800 font-mono block mt-0.5">
                  {applicant.mobilePhoneNumber}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">WhatsApp</span>
                <strong className="text-emerald-700 font-mono block mt-0.5 font-bold">
                  {applicant.whatsappNumber}
                </strong>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Email Address</span>
                <strong className="text-slate-800 block mt-0.5">{applicant.emailAddress}</strong>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Emergency Contact</span>
                <strong className="text-slate-800 block mt-0.5">
                  {applicant.emergencyContactName || '---'}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Emergency Phone</span>
                <strong className="text-slate-800 font-mono block mt-0.5">
                  {applicant.emergencyContactPhone || '---'}
                </strong>
              </div>
            </div>
          </div>

          {/* Section: Residential Address */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-navy-900 pb-3 border-b border-slate-100">
              Address & Geographic Logistics
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Governorate</span>
                <strong className="text-navy-900 block mt-0.5">{applicant.governorate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">City / Center</span>
                <strong className="text-slate-800 block mt-0.5">{applicant.city}</strong>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">District</span>
                <strong className="text-slate-800 block mt-0.5">
                  {applicant.district || '---'}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Nearest Landmark</span>
                <strong className="text-slate-800 block mt-0.5">
                  {applicant.nearestLandmark || '---'}
                </strong>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Full Residential Address</span>
                <strong className="text-slate-800 block mt-0.5">
                  {applicant.fullResidentialAddress}
                </strong>
              </div>
            </div>
          </div>

          {/* Section: Education & Academic */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-navy-900 pb-3 border-b border-slate-100">
              Educational & Music Training Background
            </h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] font-bold">Institution</span>
                  <strong className="text-slate-800 block mt-0.5">
                    {applicant.universityOrInstitution}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] font-bold">Qualification</span>
                  <strong className="text-slate-800 block mt-0.5">
                    {applicant.educationalQualification}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] font-bold">Faculty & Dept</span>
                  <strong className="text-slate-800 block mt-0.5">
                    {applicant.faculty || '---'} ({applicant.department || '---'})
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] font-bold">Graduation / Grade</span>
                  <strong className="text-slate-800 block mt-0.5">
                    {applicant.graduationYear || '---'} • {applicant.overallGrade || '---'}
                  </strong>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Music Education & Diplomas</span>
                <p className="text-slate-700 mt-0.5 font-medium">
                  {applicant.musicEducation || 'Self-taught practitioner'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Training History</span>
                <p className="text-slate-700 mt-0.5 font-medium">{applicant.musicalTrainingHistory || '---'}</p>
              </div>
            </div>
          </div>

          {/* Section: Musical Background & Social Profiles */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-navy-900 pb-3 border-b border-slate-100">
              Digital Presence & Musical Artistry
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Instruments Played</span>
                <strong className="text-navy-900 block mt-0.5 font-bold">
                  {applicant.musicalInstrumentsPlayed?.join(', ') || 'Vocalist only'}
                </strong>
              </div>

              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Vocal Range</span>
                <strong className="text-slate-800 block mt-0.5">
                  {applicant.vocalRange || 'Not specified'}
                </strong>
              </div>

              {/* Social Links Grid */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                {applicant.spotifyArtistProfileUrl && (
                  <a
                    href={applicant.spotifyArtistProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-emerald-700 font-bold flex items-center gap-1.5 truncate border border-slate-200"
                  >
                    <span>Spotify Profile ↗</span>
                  </a>
                )}
                {applicant.youtubeChannelUrl && (
                  <a
                    href={applicant.youtubeChannelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-rose-700 font-bold flex items-center gap-1.5 truncate border border-slate-200"
                  >
                    <span>YouTube Channel ↗</span>
                  </a>
                )}
                {applicant.soundcloudAccountUrl && (
                  <a
                    href={applicant.soundcloudAccountUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-amber-700 font-bold flex items-center gap-1.5 truncate border border-slate-200"
                  >
                    <span>SoundCloud ↗</span>
                  </a>
                )}
                {applicant.instagramAccountUrl && (
                  <a
                    href={applicant.instagramAccountUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-pink-700 font-bold flex items-center gap-1.5 truncate border border-slate-200"
                  >
                    <span>Instagram ↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* UPLOADED DOCUMENTS VIEWER GALLERY */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-navy-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Verified Official Documents & Scans</span>
            <span className="text-xs text-slate-500 font-medium">Click any document to inspect</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* ID Front */}
            <div
              onClick={() =>
                setPreviewDoc({
                  url: applicant.nationalIdFrontUrl || '/demo/id_front_sample.jpg',
                  title: 'National ID Card (Front)',
                  isPdf: false,
                })
              }
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 cursor-pointer space-y-2 group transition-all"
            >
              <div className="aspect-[3/2] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img
                  src={applicant.nationalIdFrontUrl || '/demo/id_front_sample.jpg'}
                  alt="National ID Front"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-xs font-bold text-slate-700 block text-center truncate">
                National ID (Front)
              </span>
            </div>

            {/* ID Back */}
            <div
              onClick={() =>
                setPreviewDoc({
                  url: applicant.nationalIdBackUrl || '/demo/id_back_sample.jpg',
                  title: 'National ID Card (Back)',
                  isPdf: false,
                })
              }
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 cursor-pointer space-y-2 group transition-all"
            >
              <div className="aspect-[3/2] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img
                  src={applicant.nationalIdBackUrl || '/demo/id_back_sample.jpg'}
                  alt="National ID Back"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-xs font-bold text-slate-700 block text-center truncate">
                National ID (Back)
              </span>
            </div>

            {/* Professional Portrait */}
            <div
              onClick={() =>
                setPreviewDoc({
                  url:
                    applicant.personalProfessionalPhotoUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                  title: 'Professional Artist Portrait',
                  isPdf: false,
                })
              }
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 cursor-pointer space-y-2 group transition-all"
            >
              <div className="aspect-[3/2] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img
                  src={
                    applicant.personalProfessionalPhotoUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
                  }
                  alt="Artist Photo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-xs font-bold text-slate-700 block text-center truncate">
                Artist Photo
              </span>
            </div>

            {/* Educational Certificate */}
            <div
              onClick={() =>
                setPreviewDoc({
                  url: applicant.educationalQualificationUrl || '/demo/degree_sample.pdf',
                  title: 'Educational Degree / Diploma Certificate',
                  isPdf: true,
                })
              }
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 cursor-pointer space-y-2 group transition-all"
            >
              <div className="aspect-[3/2] rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                <FileText className="w-8 h-8 mb-1" />
                <span className="text-[10px] text-slate-500 font-mono font-bold">PDF Certificate</span>
              </div>
              <span className="text-xs font-bold text-slate-700 block text-center truncate">
                Degree Certificate
              </span>
            </div>
          </div>
        </div>

        {/* AUDIT TRAIL LOG */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-navy-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-600" />
            <span>Administrative Audit Trail</span>
          </h3>

          <div className="divide-y divide-slate-100 text-xs font-medium">
            {applicant.auditLogs && applicant.auditLogs.length > 0 ? (
              applicant.auditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
                  <div>
                    <strong className="text-slate-800 block font-bold">{log.action}</strong>
                    <span className="text-slate-500 text-[11px] block">{log.details}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-navy-900 font-mono text-[10px] block font-bold">
                      {log.actor} ({log.role})
                    </span>
                    <span className="text-slate-400 text-[10px] block font-medium">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 py-2">No previous audit modifications recorded.</p>
            )}
          </div>
        </div>
      </main>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-2xl space-y-4 p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>{previewDoc.title}</span>
              </h4>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-50 rounded-2xl p-4 border border-slate-200">
              {previewDoc.isPdf ? (
                <div className="text-center space-y-3 py-10">
                  <FileText className="w-16 h-16 text-emerald-600 mx-auto" />
                  <p className="text-sm text-navy-900 font-bold">{previewDoc.title}</p>
                  <a
                    href={previewDoc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-navy-900 to-emerald-600 text-white font-bold text-xs shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download / Open PDF Document</span>
                  </a>
                </div>
              ) : (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.title}
                  className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-sm"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE AUDITION MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Schedule Audition / Interview</span>
              </h4>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Audition Date</label>
                  <input
                    type="date"
                    required
                    value={scheduleData.scheduledDate}
                    onChange={(e) =>
                      setScheduleData({ ...scheduleData, scheduledDate: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={scheduleData.scheduledTime}
                    onChange={(e) =>
                      setScheduleData({ ...scheduleData, scheduledTime: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Audition Type</label>
                <select
                  value={scheduleData.type}
                  onChange={(e) => setScheduleData({ ...scheduleData, type: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none font-medium"
                >
                  <option value="IN_PERSON_GEM">In-Person at Grand Egyptian Museum (GEM)</option>
                  <option value="VIRTUAL_INTERVIEW">Virtual Audition / Video Call</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Venue or Video Meeting Link</label>
                <input
                  type="text"
                  required
                  value={scheduleData.venueOrLink}
                  onChange={(e) =>
                    setScheduleData({ ...scheduleData, venueOrLink: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notes & Instructions for Talent</label>
                <textarea
                  rows={2}
                  value={scheduleData.notes}
                  onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-navy-900 to-emerald-600 text-white font-bold shadow-md"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
