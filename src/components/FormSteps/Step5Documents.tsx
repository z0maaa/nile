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
    <div className={`p-5 rounded-2xl bg-white border transition-all ${error ? 'border-rose-400' : 'border-slate-200 hover:border-emerald-400 shadow-sm'}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <label className="text-xs font-bold text-navy-900">
          {label} {required && <span className="text-emerald-600">*</span>}
        </label>
        <span className="text-[10px] text-slate-500 font-mono font-medium">{allowedFormats}</span>
      </div>

      {currentUrl ? (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-emerald-300 bg-emerald-50/30 p-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isImage ? (
                <img
                  src={currentUrl}
                  alt={label}
                  className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600">
                  <FileText className="w-7 h-7" />
                </div>
              )}
              <div>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.form.uploaded}</span>
                </span>
                <span className="text-[11px] text-slate-500 truncate max-w-[180px] block font-mono mt-0.5">
                  {currentUrl.split('/').pop()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 text-slate-700 hover:text-emerald-700 text-xs transition-all shadow-sm"
                title="View preview"
              >
                <Eye className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={onRemove}
                className="p-2 rounded-lg bg-white border border-rose-200 hover:border-rose-400 text-rose-600 hover:text-rose-700 text-xs transition-all shadow-sm"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl cursor-pointer bg-slate-50/70 hover:bg-emerald-50/20 transition-all group">
            <input
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              disabled={uploading}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {uploading ? (
              <div className="w-full text-center space-y-2">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <span className="text-xs text-emerald-700 font-bold">Uploading {progress}%...</span>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 transition-colors mb-2" />
                <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-700 transition-colors text-center">
                  {t.form.uploadBtn}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">Max 15MB • Secure storage</span>
              </>
            )}
          </label>
        </div>
      )}

      {localError && (
        <div className="flex items-center gap-1.5 text-rose-600 text-xs mt-2 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{localError}</span>
        </div>
      )}

      {error && !currentUrl && (
        <p className="text-rose-600 text-xs mt-1.5 font-medium">{error}</p>
      )}
    </div>
  );
}

export default function Step5Documents({ formData, updateFormData, errors }: Step5Props) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-black text-navy-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          <span>{t.form.step5Title}</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">{t.form.step5Desc}</p>
      </div>

      {/* Security notice banner */}
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-emerald-950 font-bold mb-0.5">Encrypted Document Vault</strong>
          <p className="text-emerald-800">{t.form.secureStorageNotice}</p>
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
