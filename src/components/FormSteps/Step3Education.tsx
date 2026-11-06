'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { GraduationCap } from 'lucide-react';

interface Step3Props {
  formData: any;
  updateFormData: (fields: Record<string, any>) => void;
  errors: Record<string, string>;
}

export default function Step3Education({ formData, updateFormData, errors }: Step3Props) {
  const { t, isRtl } = useLanguage();

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 text-sm text-slate-900 placeholder-slate-400 transition-all outline-none';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-black text-navy-900 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-600" />
          <span>{t.form.step3Title}</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">{t.form.step3Desc}</p>
      </div>

      {/* Checkboxes: Currently studying & Self-taught */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-emerald-200">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(formData.isCurrentlyStudying)}
            onChange={(e) => updateFormData({ isCurrentlyStudying: e.target.checked })}
            className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
          />
          <span className="text-xs font-bold text-navy-900">{t.form.isCurrentlyStudying}</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(formData.isSelfTaught)}
            onChange={(e) => updateFormData({ isSelfTaught: e.target.checked })}
            className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
          />
          <span className="text-xs font-bold text-navy-900">{t.form.isSelfTaught}</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* University / Educational Institution */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.university} <span className="text-emerald-600">*</span>
          </label>
          <input
            type="text"
            value={formData.universityOrInstitution || ''}
            onChange={(e) => updateFormData({ universityOrInstitution: e.target.value })}
            placeholder={isRtl ? 'جامعة القاهرة / كونسرفتوار القاهرة / معهد الموسيقى العربية' : 'e.g. Cairo University / Cairo Conservatoire'}
            className={inputClass}
          />
          {errors.universityOrInstitution && (
            <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.universityOrInstitution}</p>
          )}
        </div>

        {/* Faculty */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.faculty}
          </label>
          <input
            type="text"
            value={formData.faculty || ''}
            onChange={(e) => updateFormData({ faculty: e.target.value })}
            placeholder={isRtl ? 'مثال: كلية التربية الموسيقية / كلية الفنون' : 'e.g. Faculty of Music Education'}
            className={inputClass}
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.department}
          </label>
          <input
            type="text"
            value={formData.department || ''}
            onChange={(e) => updateFormData({ department: e.target.value })}
            placeholder={isRtl ? 'مثال: قسم الغناء / قسم الآلات الغربية' : 'e.g. Vocal Performance / Strings'}
            className={inputClass}
          />
        </div>

        {/* Educational Qualification */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.qualification} <span className="text-emerald-600">*</span>
          </label>
          <input
            type="text"
            value={formData.educationalQualification || ''}
            onChange={(e) => updateFormData({ educationalQualification: e.target.value })}
            placeholder={isRtl ? 'بكالوريوس / ليسانس / طالب جامعي' : 'e.g. Bachelor of Arts / High School'}
            className={inputClass}
          />
          {errors.educationalQualification && (
            <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.educationalQualification}</p>
          )}
        </div>

        {/* Graduation Year */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.graduationYear}
          </label>
          <input
            type="text"
            maxLength={4}
            value={formData.graduationYear || ''}
            onChange={(e) => updateFormData({ graduationYear: e.target.value.replace(/\D/g, '') })}
            placeholder="2024"
            className={`${inputClass} font-mono`}
          />
        </div>

        {/* Overall Grade */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.overallGrade}
          </label>
          <input
            type="text"
            value={formData.overallGrade || ''}
            onChange={(e) => updateFormData({ overallGrade: e.target.value })}
            placeholder={isRtl ? 'امتياز / جيد جداً / 3.8 GPA' : 'e.g. Distinction / Very Good / 3.8 GPA'}
            className={inputClass}
          />
        </div>

        {/* Additional Courses */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.additionalCourses}
          </label>
          <input
            type="text"
            value={formData.additionalCourses || ''}
            onChange={(e) => updateFormData({ additionalCourses: e.target.value })}
            placeholder={isRtl ? 'دورات لغات، قيادة، إدارة إنتاج فني، إلخ' : 'Additional academic, audio, or cultural courses'}
            className={inputClass}
          />
        </div>

        {/* Music Education */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.musicEducation}
          </label>
          <textarea
            rows={2}
            value={formData.musicEducation || ''}
            onChange={(e) => updateFormData({ musicEducation: e.target.value })}
            placeholder={isRtl ? 'دراسات موسيقية في معاهد معتمدة، كونسرفتوار، دار الأوبرا، أو مراكز إبداع' : 'Details of any formal music conservatory or institute education'}
            className={inputClass}
          />
        </div>

        {/* Music Certificates */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.musicCertificates}
          </label>
          <input
            type="text"
            value={formData.musicCertificates || ''}
            onChange={(e) => updateFormData({ musicCertificates: e.target.value })}
            placeholder={isRtl ? 'شهادات الغناء أو التوزيع الموسيقي' : 'e.g. ABRSM, Berklee Online, Trinity'}
            className={inputClass}
          />
        </div>

        {/* Musical Training History */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.musicalTrainingHistory}
          </label>
          <input
            type="text"
            value={formData.musicalTrainingHistory || ''}
            onChange={(e) => updateFormData({ musicalTrainingHistory: e.target.value })}
            placeholder={isRtl ? 'تدريب كورال، أساتذة وموجهون موسيقيون' : 'Vocal coaches, mentors, or masterclasses'}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
