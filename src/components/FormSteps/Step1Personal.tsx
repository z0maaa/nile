'use client';

import React, { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { User, Calendar, Phone, Mail, ShieldAlert, Award } from 'lucide-react';

interface Step1Props {
  formData: any;
  updateFormData: (fields: Record<string, any>) => void;
  errors: Record<string, string>;
}

export default function Step1Personal({ formData, updateFormData, errors }: Step1Props) {
  const { t, isRtl } = useLanguage();

  // Automatically calculate age whenever date of birth changes
  const handleDobChange = (dobString: string) => {
    if (!dobString) {
      updateFormData({ dateOfBirth: dobString, calculatedAge: '' });
      return;
    }
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    updateFormData({
      dateOfBirth: dobString,
      calculatedAge: age > 0 ? age : 0,
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <User className="w-5 h-5 text-gold-400" />
          <span>{t.form.step1Title}</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-1">{t.form.step1Desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Arabic Name */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.fullNameArabic} <span className="text-gold-400">*</span>
          </label>
          <input
            type="text"
            dir="rtl"
            value={formData.fullNameArabic || ''}
            onChange={(e) => updateFormData({ fullNameArabic: e.target.value })}
            placeholder="مثال: أحمد محمد علي حسن"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
          {errors.fullNameArabic && (
            <p className="text-rose-400 text-xs mt-1.5">{errors.fullNameArabic}</p>
          )}
        </div>

        {/* Full English Name */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.fullNameEnglish} <span className="text-gold-400">*</span>
          </label>
          <input
            type="text"
            dir="ltr"
            value={formData.fullNameEnglish || ''}
            onChange={(e) => updateFormData({ fullNameEnglish: e.target.value })}
            placeholder="e.g. Ahmed Mohamed Aly Hassan"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
          {errors.fullNameEnglish && (
            <p className="text-rose-400 text-xs mt-1.5">{errors.fullNameEnglish}</p>
          )}
        </div>

        {/* National ID Number (14 Digits) */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.nationalId} <span className="text-gold-400">*</span>
          </label>
          <input
            type="text"
            maxLength={14}
            value={formData.nationalIdNumber || ''}
            onChange={(e) => updateFormData({ nationalIdNumber: e.target.value.replace(/\D/g, '') })}
            placeholder="29901010101234"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-sm font-mono text-white placeholder-zinc-500 transition-all"
          />
          {errors.nationalIdNumber && (
            <p className="text-rose-400 text-xs mt-1.5">{errors.nationalIdNumber}</p>
          )}
        </div>

        {/* Date of Birth & Automatically Calculated Age */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              {t.form.dob} <span className="text-gold-400">*</span>
            </label>
            <input
              type="date"
              value={formData.dateOfBirth || ''}
              onChange={(e) => handleDobChange(e.target.value)}
              className="w-full px-3 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white transition-all"
            />
            {errors.dateOfBirth && (
              <p className="text-rose-400 text-xs mt-1.5">{errors.dateOfBirth}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              {t.form.age}
            </label>
            <div className="w-full px-4 py-3 rounded-xl bg-surface-card border border-white/5 text-sm font-bold text-gold-300 flex items-center justify-between">
              <span>{formData.calculatedAge !== '' && formData.calculatedAge !== undefined ? formData.calculatedAge : '--'}</span>
              <span className="text-xs text-zinc-400 font-normal">{t.form.ageYears}</span>
            </div>
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.gender} <span className="text-gold-400">*</span>
          </label>
          <select
            value={formData.gender || 'MALE'}
            onChange={(e) => updateFormData({ gender: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white transition-all"
          >
            <option value="MALE">{t.form.genderMale}</option>
            <option value="FEMALE">{t.form.genderFemale}</option>
            <option value="OTHER">{t.form.genderOther}</option>
          </select>
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.nationality} <span className="text-gold-400">*</span>
          </label>
          <input
            type="text"
            value={formData.nationality || 'Egyptian'}
            onChange={(e) => updateFormData({ nationality: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white transition-all"
          />
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.maritalStatus}
          </label>
          <select
            value={formData.maritalStatus || 'SINGLE'}
            onChange={(e) => updateFormData({ maritalStatus: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white transition-all"
          >
            <option value="SINGLE">{t.form.maritalSingle}</option>
            <option value="MARRIED">{t.form.maritalMarried}</option>
            <option value="OTHER">{t.form.maritalOther}</option>
          </select>
        </div>

        {/* Mobile Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.mobilePhone} <span className="text-gold-400">*</span>
          </label>
          <input
            type="tel"
            dir="ltr"
            value={formData.mobilePhoneNumber || ''}
            onChange={(e) => updateFormData({ mobilePhoneNumber: e.target.value })}
            placeholder="+20 10 1234 5678"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all font-mono"
          />
          {errors.mobilePhoneNumber && (
            <p className="text-rose-400 text-xs mt-1.5">{errors.mobilePhoneNumber}</p>
          )}
        </div>

        {/* WhatsApp Number */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.whatsappPhone} <span className="text-gold-400">*</span>
          </label>
          <input
            type="tel"
            dir="ltr"
            value={formData.whatsappNumber || ''}
            onChange={(e) => updateFormData({ whatsappNumber: e.target.value })}
            placeholder="+20 10 1234 5678"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all font-mono"
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.email} <span className="text-gold-400">*</span>
          </label>
          <input
            type="email"
            dir="ltr"
            value={formData.emailAddress || ''}
            onChange={(e) => updateFormData({ emailAddress: e.target.value })}
            placeholder="talent@example.com"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
          {errors.emailAddress && (
            <p className="text-rose-400 text-xs mt-1.5">{errors.emailAddress}</p>
          )}
        </div>

        {/* Emergency Contact Name */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.emergencyName}
          </label>
          <input
            type="text"
            value={formData.emergencyContactName || ''}
            onChange={(e) => updateFormData({ emergencyContactName: e.target.value })}
            placeholder={isRtl ? 'الاسم وصلة القرابة' : 'Name & Relationship'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Emergency Contact Phone */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.emergencyPhone}
          </label>
          <input
            type="tel"
            dir="ltr"
            value={formData.emergencyContactPhone || ''}
            onChange={(e) => updateFormData({ emergencyContactPhone: e.target.value })}
            placeholder="+20 12 8765 4321"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all font-mono"
          />
        </div>
      </div>
    </div>
  );
}

