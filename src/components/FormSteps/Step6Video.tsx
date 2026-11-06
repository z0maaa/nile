'use client';

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Video, UploadCloud, Play, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, FileCheck, Sparkles } from 'lucide-react';

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

    if (file.size > 100 * 1024 * 1024) {
      setLocalError(isRtl ? 'حجم ملف الفيديو يتجاوز الحد الأقصى المسموح به (100 ميجابايت)' : 'Video file size exceeds maximum 100MB limit');
      return;
    }

    const tempUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = tempUrl;

    tempVideo.onloadedmetadata = async () => {
      URL.revokeObjectURL(tempUrl);
      const duration = Math.round(tempVideo.duration);

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
      <div className="p-6 rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-emerald-800 text-white shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
            <Video className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            {t.form.step6Title}
          </h2>
        </div>
        <p className="text-sm text-emerald-100 leading-relaxed font-medium mt-2">
          "{t.form.step6Desc}"
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/20 text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.form.videoDurationRule}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.form.videoFormatRule}</span>
          </div>
        </div>
      </div>

      {/* Acoustic Vocal Tip */}
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-medium">{t.form.videoTip}</p>
      </div>

      {/* Upload or Preview Section */}
      {formData.auditionVideoUrl ? (
        <div className="p-6 rounded-2xl bg-white border border-emerald-300 shadow-md space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h4 className="text-sm font-bold text-navy-900 flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-600" />
              <span>{t.form.videoPreviewTitle}</span>
            </h4>
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.form.remove}</span>
            </button>
          </div>

          {/* HTML5 Video Player */}
          <div className="w-full max-w-2xl mx-auto aspect-video rounded-xl overflow-hidden bg-black border border-slate-200 shadow-xl relative">
            <video
              ref={videoRef}
              src={formData.auditionVideoUrl}
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          </div>

          {/* Duration validation badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {t.form.videoValidDuration.replace(
                  '{duration}',
                  String(formData.auditionVideoDurationSeconds || 75)
                )}
              </span>
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              Format: {formData.auditionVideoFormat || 'MP4'}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 hover:border-emerald-500 transition-all text-center">
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
                <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <span className="text-sm text-emerald-700 font-bold block">
                  Uploading audition video... {progress}%
                </span>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto text-emerald-700 transition-transform hover:scale-105">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-base font-bold text-navy-900 block">
                    {t.form.videoUploadCta}
                  </span>
                  <span className="text-xs text-slate-500 block">
                    Supports camera recording directly from iPhone & Android • Max 100MB
                  </span>
                </div>
              </>
            )}
          </label>
        </div>
      )}

      {localError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{localError}</span>
        </div>
      )}

      {errors.auditionVideoUrl && (
        <p className="text-rose-600 text-xs font-bold">{errors.auditionVideoUrl}</p>
      )}

      {/* Mandatory Applicant Confirmations */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Mandatory Declarations & Rights Ownership</span>
        </h4>

        <div className="space-y-3 text-xs text-slate-700">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(formData.confirmOwnPerformance)}
              onChange={(e) => updateFormData({ confirmOwnPerformance: e.target.checked })}
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 shrink-0"
            />
            <span className="leading-relaxed font-medium">{t.form.confirmPerformance}</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(formData.confirmMusicRightsPermission)}
              onChange={(e) => updateFormData({ confirmMusicRightsPermission: e.target.checked })}
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 shrink-0"
            />
            <span className="leading-relaxed font-medium">{t.form.confirmRights}</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={Boolean(formData.authorizeRecruitmentReview)}
              onChange={(e) => updateFormData({ authorizeRecruitmentReview: e.target.checked })}
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 shrink-0"
            />
            <span className="leading-relaxed font-medium">{t.form.confirmReview}</span>
          </label>
        </div>

        {errors.confirmations && (
          <p className="text-rose-600 text-xs font-bold pt-1">{errors.confirmations}</p>
        )}
      </div>

      {/* Application Summary Card */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <h4 className="text-sm font-black text-navy-900 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>{t.form.finalReviewTitle}</span>
        </h4>
        <p className="text-xs text-slate-500">{t.form.reviewCheckNotice}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Applicant</span>
            <strong className="text-slate-800 block truncate mt-0.5">
              {formData.fullNameEnglish || formData.fullNameArabic || '---'}
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Artist Name</span>
            <strong className="text-emerald-700 block truncate mt-0.5">
              {formData.artistStageName || '---'}
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
            <strong className="text-slate-800 block truncate mt-0.5">
              {formData.mainTalentCategory || '---'}
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">GPS Sharing</span>
            <strong className={`block truncate mt-0.5 ${formData.locationSharingAuthorized ? 'text-emerald-600' : 'text-slate-500'}`}>
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
          className="w-full py-4 rounded-xl bg-gradient-to-r from-navy-900 via-navy-800 to-emerald-600 hover:from-navy-950 hover:to-emerald-700 text-white font-black text-base sm:text-lg tracking-wider uppercase shadow-xl hover:shadow-2xl transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
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
