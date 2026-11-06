'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, UploadCloud, CheckCircle2, Trash2, Eye, ShieldCheck, AlertCircle } from 'lucide-react';

interface Step5Props {
  formData: any;
  updateFormData: (fields: Record<string, any>) => void;
  errors: Record<string, string>;
}

interface DocSlotProps {
  id: string;
  label: string;
  required?: boolean;
  allowedFormats: string;
  accept: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
  error?: string;
}

function DocumentUploadCard({
  id,
  label,
  required,
  allowedFormats,
  accept,
  currentUrl,
  onUpload,
  onRemove,
  error,
}: DocSlotProps) {
  const { t, isRtl } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (15MB)
    if (file.size > 15 * 1024 * 1024) {
      setLocalError(isRtl ? 'حجم الملف يتجاوز الحد الأقصى المسموح به (15 ميجابايت)' : 'File size exceeds maximum 15MB limit');
      return;
    }

    setLocalError(null);
    setUploading(true);
    setProgress(15);

    try {
      const formPayload = new FormData();
      formPayload.append('file', file);
      formPayload.append('category', 'document');

      const interval = setInterval(() => {
        setProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 150);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formPayload,
      });

      clearInterval(interval);
      setProgress(100);

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Upload failed');
      }

      onUpload(json.url);
      setUploading(false);
    } catch (err: any) {
      setUploading(false);
      setLocalError(err.message || 'Upload error');
    }
  };

  const isImage = currentUrl && (currentUrl.endsWith('.jpg') || currentUrl.endsWith('.jpeg') || currentUrl.endsWith('.png') || currentUrl.includes('unsplash') || currentUrl.includes('.webp'));

  return (
    <div className={`p-5 rounded-2xl bg-surface border transition-all ${error ? 'border-rose-500/50' : 'border-white/10 hover:border-gold-500/30'}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <label className="text-xs font-bold text-zinc-200">
          {label} {required && <span className="text-gold-400">*</span>}
        </label>
        <span className="text-[10px] text-zinc-500 font-mono">{allowedFormats}</span>
      </div>

      {currentUrl ? (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-gold-500/30 bg-surface-card p-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isImage ? (
                <img
                  src={currentUrl}
                  alt={label}
                  className="w-14 h-14 object-cover rounded-lg border border-white/10"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-gold-400">
                  <FileText className="w-7 h-7" />
                </div>
              )}
              <div>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.form.uploaded}</span>
                </span>
                <span className="text-[11px] text-zinc-400 truncate max-w-[180px] block font-mono mt-0.5">
                  {currentUrl.split('/').pop()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-surface border border-white/10 hover:border-gold-500/40 text-zinc-300 hover:text-gold-300 text-xs transition-all"
                title="View preview"
              >
                <Eye className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={onRemove}
                className="p-2 rounded-lg bg-surface border border-rose-500/20 hover:border-rose-500/60 text-rose-400 hover:text-rose-300 text-xs transition-all"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 hover:border-gold-500/50 rounded-xl cursor-pointer bg-surface-card/60 hover:bg-surface-card transition-all group">
            <input
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              disabled={uploading}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {uploading ? (
              <div className="w-full text-center space-y-2">
                <div className="w-6 h-6 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <span className="text-xs text-gold-300 font-medium">Uploading {progress}%...</span>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gold-500 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-zinc-500 group-hover:text-gold-400 transition-colors mb-2" />
                <span className="text-xs font-semibold text-zinc-300 group-hover:text-gold-300 transition-colors text-center">
                  {t.form.uploadBtn}
                </span>
                <span className="text-[10px] text-zinc-500 mt-1">Max 15MB • Secure storage</span>
              </>
            )}
          </label>
        </div>
      )}

      {localError && (
        <div className="flex items-center gap-1.5 text-rose-400 text-xs mt-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{localError}</span>
        </div>
      )}

      {error && !currentUrl && (
        <p className="text-rose-400 text-xs mt-1.5">{error}</p>
      )}
    </div>
  );
}

export default function Step5Documents({ formData, updateFormData, errors }: Step5Props) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-gold-400" />
          <span>{t.form.step5Title}</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-1">{t.form.step5Desc}</p>
      </div>

      {/* Security notice banner */}
      <div className="p-4 rounded-xl bg-gold-950/20 border border-gold-500/20 text-xs text-zinc-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-gold-300 font-bold mb-0.5">Encrypted Document Vault</strong>
          <p>{t.form.secureStorageNotice}</p>
        </div>
      </div>

      {/* Document slots grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* National ID Front */}
        <DocumentUploadCard
          id="nationalIdFront"
          label={t.form.docIdFront}
          required
          allowedFormats="JPG, PNG, PDF"
          accept=".jpg,.jpeg,.png,.pdf"
          currentUrl={formData.nationalIdFrontUrl}
          onUpload={(url) => updateFormData({ nationalIdFrontUrl: url })}
          onRemove={() => updateFormData({ nationalIdFrontUrl: '' })}
          error={errors.nationalIdFrontUrl}
        />

        {/* National ID Back */}
        <DocumentUploadCard
          id="nationalIdBack"
          label={t.form.docIdBack}
          required
          allowedFormats="JPG, PNG, PDF"
          accept=".jpg,.jpeg,.png,.pdf"
          currentUrl={formData.nationalIdBackUrl}
          onUpload={(url) => updateFormData({ nationalIdBackUrl: url })}
          onRemove={() => updateFormData({ nationalIdBackUrl: '' })}
          error={errors.nationalIdBackUrl}
        />

        {/* Personal Professional Photo */}
        <DocumentUploadCard
          id="personalPhoto"
          label={t.form.docPhoto}
          required
          allowedFormats="JPG, PNG"
          accept=".jpg,.jpeg,.png"
          currentUrl={formData.personalProfessionalPhotoUrl}
          onUpload={(url) => updateFormData({ personalProfessionalPhotoUrl: url })}
          onRemove={() => updateFormData({ personalProfessionalPhotoUrl: '' })}
          error={errors.personalProfessionalPhotoUrl}
        />

        {/* Educational Qualification */}
        <DocumentUploadCard
          id="qualificationCert"
          label={t.form.docQualification}
          required
          allowedFormats="JPG, PNG, PDF"
          accept=".jpg,.jpeg,.png,.pdf"
          currentUrl={formData.educationalQualificationUrl}
          onUpload={(url) => updateFormData({ educationalQualificationUrl: url })}
          onRemove={() => updateFormData({ educationalQualificationUrl: '' })}
          error={errors.educationalQualificationUrl}
        />

        {/* CV / Musical Portfolio PDF */}
        <DocumentUploadCard
          id="cvPortfolio"
          label={t.form.docCv}
          allowedFormats="PDF"
          accept=".pdf"
          currentUrl={formData.cvPortfolioPdfUrl}
          onUpload={(url) => updateFormData({ cvPortfolioPdfUrl: url })}
          onRemove={() => updateFormData({ cvPortfolioPdfUrl: '' })}
        />

        {/* Additional Music Certificates */}
        <DocumentUploadCard
          id="additionalCert"
          label={t.form.docAdditional}
          allowedFormats="JPG, PNG, PDF"
          accept=".jpg,.jpeg,.png,.pdf"
          currentUrl={formData.additionalMusicCertificatesUrl}
          onUpload={(url) => updateFormData({ additionalMusicCertificatesUrl: url })}
          onRemove={() => updateFormData({ additionalMusicCertificatesUrl: '' })}
        />
      </div>
    </div>
  );
}

