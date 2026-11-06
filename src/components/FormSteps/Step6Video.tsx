'use client';

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Video, UploadCloud, Play, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, FileCheck, CheckSquare, Sparkles } from 'lucide-react';

interface Step6Props {
  formData: any;
  updateFormData: (fields: Record<string, any>) => void;
  errors: Record<string, string>;
  onSubmitApplication: () => void;
  isSubmitting: boolean;
}

export default function Step6Video({
  formData,
  updateFormData,
  errors,
  onSubmitApplication,
  isSubmitting,
}: Step6Props) {
  const { t, isRtl } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 100MB
    if (file.size > 100 * 1024 * 1024) {
      setLocalError(isRtl ? 'حجم ملف الفيديو يتجاوز الحد الأقصى المسموح به (100 ميجابايت)' : 'Video file size exceeds maximum 100MB limit');
      return;
    }

    // Inspect video duration via temporary object URL
    const tempUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = tempUrl;

    tempVideo.onloadedmetadata = async () => {
      URL.revokeObjectURL(tempUrl);
      const duration = Math.round(tempVideo.duration);

      // Validate duration: Minimum 60s, Maximum 90s (with a slight 2s grace for codec padding: 58s - 92s)
      if (duration < 58 || duration > 92) {
        setLocalError(
          isRtl
            ? `مدة الفيديو المسجلة هي ${duration} ثانية. يجب أن تتراوح مدة تجربة الأداء بدقة بين 60 إلى 90 ثانية.`
            : `Detected video duration is ${duration}s. Audition videos must be strictly between 60 and 90 seconds.`
        );
        return;
      }

      setLocalError(null);
      setUploading(true);
      setProgress(10);

      try {
        const formPayload = new FormData();
        formPayload.append('file', file);
        formPayload.append('category', 'video');

        const interval = setInterval(() => {
          setProgress((prev) => (prev < 90 ? prev + 10 : prev));
        }, 300);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formPayload,
        });

        clearInterval(interval);
        setProgress(100);

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || 'Video upload failed');
        }

        updateFormData({
          auditionVideoUrl: json.url,
          auditionVideoDurationSeconds: duration,
          auditionVideoFormat: file.type || 'video/mp4',
        });
        setUploading(false);
      } catch (err: any) {
        setUploading(false);
        setLocalError(err.message || 'Failed to upload audition video');
      }
    };

    tempVideo.onerror = () => {
      setLocalError(isRtl ? 'تعذر قراءة ملف الفيديو أو التحقق من مدته. يرجى التأكد من اختيار صيغة MP4 أو MOV صالحة.' : 'Unable to parse video metadata. Please ensure an MP4 or MOV file is provided.');
    };
  };

  const handleRemoveVideo = () => {
    updateFormData({
      auditionVideoUrl: '',
      auditionVideoDurationSeconds: 0,
      auditionVideoFormat: '',
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Dedicate Main Title Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-gold-950/40 via-surface-card to-zinc-950 border border-gold-500/40 shadow-glow relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gold-gradient p-[1px] shrink-0">
            <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <Video className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            {t.form.step6Title}
          </h2>
        </div>
        <p className="text-sm text-gold-200/90 leading-relaxed font-medium mt-2">
          "{t.form.step6Desc}"
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2 text-gold-300 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
            <span>{t.form.videoDurationRule}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
            <span>{t.form.videoFormatRule}</span>
          </div>
        </div>
      </div>

      {/* Acoustic Vocal Tip */}
      <div className="p-4 rounded-xl bg-surface border border-white/10 text-xs text-zinc-400 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
        <p>{t.form.videoTip}</p>
      </div>

      {/* Upload or Preview Section */}
      {formData.auditionVideoUrl ? (
        <div className="p-6 rounded-2xl bg-surface-card border border-gold-500/40 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-gold-400" />
              <span>{t.form.videoPreviewTitle}</span>
            </h4>
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-950/20 text-xs font-semibold transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.form.remove}</span>
            </button>
          </div>

          {/* HTML5 Video Player */}
          <div className="w-full max-w-2xl mx-auto aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl relative">
            <video
              ref={videoRef}
              src={formData.auditionVideoUrl}
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          </div>

          {/* Duration validation badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-emerald-500/30 text-xs text-emerald-300">
            <span className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {t.form.videoValidDuration.replace(
                  '{duration}',
                  String(formData.auditionVideoDurationSeconds || 75)
                )}
              </span>
            </span>
            <span className="text-zinc-400 font-mono text-[11px]">
              Format: {formData.auditionVideoFormat || 'MP4'}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-surface border-2 border-dashed border-white/20 hover:border-gold-500 transition-all text-center">
          <label className="cursor-pointer block space-y-3">
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/mov,video/*"
              onChange={handleVideoSelect}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <div className="max-w-md mx-auto space-y-3 py-4">
                <div className="w-8 h-8 border-3 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <span className="text-sm text-gold-300 font-bold block">
                  Uploading audition video... {progress}%
                </span>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gold-gradient h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-base font-bold text-white block">
                    {t.form.videoUploadCta}
                  </span>
                  <span className="text-xs text-zinc-400 block">
                    Supports camera recording directly from iPhone & Android • Max 100MB
                  </span>
                </div>
              </>
            )}
          </label>
        </div>
      )}

      {localError && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{localError}</span>
        </div>
      )}

      {errors.auditionVideoUrl && (
        <p className="text-rose-400 text-xs font-semibold">{errors.auditionVideoUrl}</p>
      )}

      {/* Mandatory Applicant Confirmations */}
      <div className="p-6 rounded-2xl bg-surface-card border border-white/10 space-y-4">
        <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gold-400" />
          <span>Mandatory Declarations & Rights Ownership</span>
        </h4>

        <div className="space-y-3 text-xs text-zinc-200">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(formData.confirmOwnPerformance)}
              onChange={(e) => updateFormData({ confirmOwnPerformance: e.target.checked })}
              className="w-4 h-4 mt-0.5 rounded border-white/20 text-gold-500 focus:ring-gold-500 accent-gold-500 shrink-0"
            />
            <span className="leading-relaxed">{t.form.confirmPerformance}</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(formData.confirmMusicRightsPermission)}
              onChange={(e) => updateFormData({ confirmMusicRightsPermission: e.target.checked })}
              className="w-4 h-4 mt-0.5 rounded border-white/20 text-gold-500 focus:ring-gold-500 accent-gold-500 shrink-0"
            />
            <span className="leading-relaxed">{t.form.confirmRights}</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(formData.authorizeRecruitmentReview)}
              onChange={(e) => updateFormData({ authorizeRecruitmentReview: e.target.checked })}
              className="w-4 h-4 mt-0.5 rounded border-white/20 text-gold-500 focus:ring-gold-500 accent-gold-500 shrink-0"
            />
            <span className="leading-relaxed">{t.form.confirmReview}</span>
          </label>
        </div>

        {errors.confirmations && (
          <p className="text-rose-400 text-xs font-semibold pt-1">{errors.confirmations}</p>
        )}
      </div>

      {/* Application Summary Card */}
      <div className="p-6 rounded-2xl bg-surface border border-white/10 space-y-4">
        <h4 className="text-sm font-black text-white flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-gold-400" />
          <span>{t.form.finalReviewTitle}</span>
        </h4>
        <p className="text-xs text-zinc-400">{t.form.reviewCheckNotice}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-surface-card border border-white/5">
            <span className="text-zinc-500 block text-[10px] uppercase">Applicant</span>
            <strong className="text-zinc-200 block truncate mt-0.5">
              {formData.fullNameEnglish || formData.fullNameArabic || '---'}
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-surface-card border border-white/5">
            <span className="text-zinc-500 block text-[10px] uppercase">Artist Name</span>
            <strong className="text-gold-300 block truncate mt-0.5">
              {formData.artistStageName || '---'}
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-surface-card border border-white/5">
            <span className="text-zinc-500 block text-[10px] uppercase">Category</span>
            <strong className="text-zinc-200 block truncate mt-0.5">
              {formData.mainTalentCategory || '---'}
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-surface-card border border-white/5">
            <span className="text-zinc-500 block text-[10px] uppercase">GPS Sharing</span>
            <strong className={`block truncate mt-0.5 ${formData.locationSharingAuthorized ? 'text-emerald-400' : 'text-zinc-400'}`}>
              {formData.locationSharingAuthorized ? 'Authorized (GPS)' : 'Declined (Optional)'}
            </strong>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={onSubmitApplication}
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-gold-gradient text-zinc-950 font-black text-base sm:text-lg tracking-wider uppercase shadow-glow-lg hover:shadow-glow transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-3 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              <span>{t.form.submitting}</span>
            </>
          ) : (
            <span>{t.form.submit}</span>
          )}
        </button>
      </div>
    </div>
  );
}

