'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { GraduationCap, BookOpen, Music, CheckSquare } from 'lucide-react';

interface Step3Props {
  formData: any;
  updateFormData: (fields: Record<string, any>) => void;
  errors: Record<string, string>;
}

export default function Step3Education({ formData, updateFormData, errors }: Step3Props) {
  const { t, isRtl } = useLanguage();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-gold-400" />
          <span>{t.form.step3Title}</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-1">{t.form.step3Desc}</p>
      </div>

      {/* Checkboxes: Currently studying & Self-taught */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-card border border-gold-500/20">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(formData.isCurrentlyStudying)}
            onChange={(e) => updateFormData({ isCurrentlyStudying: e.target.checked })}
            className="w-5 h-5 rounded border-white/20 bg-surface text-gold-500 focus:ring-gold-500 accent-gold-500"
          />
          <span className="text-xs font-semibold text-zinc-200">{t.form.isCurrentlyStudying}</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(formData.isSelfTaught)}
            onChange={(e) => updateFormData({ isSelfTaught: e.target.checked })}
            className="w-5 h-5 rounded border-white/20 bg-surface text-gold-500 focus:ring-gold-500 accent-gold-500"
          />
          <span className="text-xs font-semibold text-zinc-200">{t.form.isSelfTaught}</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* University / Educational Institution */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.university} <span className="text-gold-400">*</span>
          </label>
          <input
            type="text"
            value={formData.universityOrInstitution || ''}
            onChange={(e) => updateFormData({ universityOrInstitution: e.target.value })}
            placeholder={isRtl ? 'جامعة القاهرة / كونسرفتوار القاهرة / معهد الموسيقى العربية' : 'e.g. Cairo University / Cairo Conservatoire'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
          {errors.universityOrInstitution && (
            <p className="text-rose-400 text-xs mt-1.5">{errors.universityOrInstitution}</p>
          )}
        </div>

        {/* Faculty */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.faculty}
          </label>
          <input
            type="text"
            value={formData.faculty || ''}
            onChange={(e) => updateFormData({ faculty: e.target.value })}
            placeholder={isRtl ? 'مثال: كلية التربية الموسيقية / كلية الفنون' : 'e.g. Faculty of Music Education'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.department}
          </label>
          <input
            type="text"
            value={formData.department || ''}
            onChange={(e) => updateFormData({ department: e.target.value })}
            placeholder={isRtl ? 'مثال: قسم الغناء / قسم الآلات الغربية' : 'e.g. Vocal Performance / Strings'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Educational Qualification */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.qualification} <span className="text-gold-400">*</span>
          </label>
          <input
            type="text"
            value={formData.educationalQualification || ''}
            onChange={(e) => updateFormData({ educationalQualification: e.target.value })}
            placeholder={isRtl ? 'بكالوريوس / ليسانس / طالب جامعي' : 'e.g. Bachelor of Arts / High School'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
          {errors.educationalQualification && (
            <p className="text-rose-400 text-xs mt-1.5">{errors.educationalQualification}</p>
          )}
        </div>

        {/* Graduation Year */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.graduationYear}
          </label>
          <input
            type="text"
            maxLength={4}
            value={formData.graduationYear || ''}
            onChange={(e) => updateFormData({ graduationYear: e.target.value.replace(/\D/g, '') })}
            placeholder="2024"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all font-mono"
          />
        </div>

        {/* Overall Grade */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.overallGrade}
          </label>
          <input
            type="text"
            value={formData.overallGrade || ''}
            onChange={(e) => updateFormData({ overallGrade: e.target.value })}
            placeholder={isRtl ? 'امتياز / جيد جداً / 3.8 GPA' : 'e.g. Distinction / Very Good / 3.8 GPA'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Additional Courses */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.additionalCourses}
          </label>
          <input
            type="text"
            value={formData.additionalCourses || ''}
            onChange={(e) => updateFormData({ additionalCourses: e.target.value })}
            placeholder={isRtl ? 'دورات لغات، قيادة، إدارة إنتاج فني، إلخ' : 'Additional academic, audio, or cultural courses'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Music Education */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.musicEducation}
          </label>
          <textarea
            rows={2}
            value={formData.musicEducation || ''}
            onChange={(e) => updateFormData({ musicEducation: e.target.value })}
            placeholder={isRtl ? 'دراسات موسيقية في معاهد معتمدة، كونسرفتوار، دار الأوبرا، أو مراكز إبداع' : 'Details of any formal music conservatory or institute education'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Music Certificates */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.musicCertificates}
          </label>
          <input
            type="text"
            value={formData.musicCertificates || ''}
            onChange={(e) => updateFormData({ musicCertificates: e.target.value })}
            placeholder={isRtl ? 'شهادات الغناء أو التوزيع الموسيقي' : 'e.g. ABRSM, Berklee Online, Trinity'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Musical Training History */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.musicalTrainingHistory}
          </label>
          <input
            type="text"
            value={formData.musicalTrainingHistory || ''}
            onChange={(e) => updateFormData({ musicalTrainingHistory: e.target.value })}
            placeholder={isRtl ? 'تدريب كورال، أساتذة وموجهون موسيقيون' : 'Vocal coaches, mentors, or masterclasses'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
}

