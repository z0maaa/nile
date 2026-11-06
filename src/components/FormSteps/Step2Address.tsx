'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { EGYPT_GOVERNORATES } from '@/lib/translations';
import { MapPin, Building, Home, Compass } from 'lucide-react';
import LocationPickerMap from '@/components/Map/LocationPickerMap';

interface Step2Props {
  formData: any;
  updateFormData: (fields: Record<string, any>) => void;
  errors: Record<string, string>;
}

export default function Step2Address({ formData, updateFormData, errors }: Step2Props) {
  const { t, isRtl } = useLanguage();

  const handleLocationChange = (loc: {
    authorized: boolean;
    latitude?: number;
    longitude?: number;
    addressLabel?: string;
  }) => {
    updateFormData({
      locationSharingAuthorized: loc.authorized,
      coordinates: loc.authorized && loc.latitude && loc.longitude
        ? {
            latitude: loc.latitude,
            longitude: loc.longitude,
            addressLabel: loc.addressLabel || '',
            confirmedAt: new Date().toISOString(),
          }
        : undefined,
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gold-400" />
          <span>{t.form.step2Title}</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-1">{t.form.step2Desc}</p>
      </div>

      {/* Address Form Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Country */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.country} <span className="text-gold-400">*</span>
          </label>
          <input
            type="text"
            value={formData.country || (isRtl ? 'مصر' : 'Egypt')}
            onChange={(e) => updateFormData({ country: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white transition-all"
          />
        </div>

        {/* Governorate */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.governorate} <span className="text-gold-400">*</span>
          </label>
          <select
            value={formData.governorate || 'Cairo'}
            onChange={(e) => updateFormData({ governorate: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white transition-all"
          >
            {EGYPT_GOVERNORATES.map((gov) => (
              <option key={gov.id} value={gov.en}>
                {isRtl ? gov.ar : gov.en}
              </option>
            ))}
          </select>
          {errors.governorate && (
            <p className="text-rose-400 text-xs mt-1.5">{errors.governorate}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.city} <span className="text-gold-400">*</span>
          </label>
          <input
            type="text"
            value={formData.city || ''}
            onChange={(e) => updateFormData({ city: e.target.value })}
            placeholder={isRtl ? 'مثال: مدينة نصر / الشيخ زايد' : 'e.g. Nasr City / Sheikh Zayed'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
          {errors.city && <p className="text-rose-400 text-xs mt-1.5">{errors.city}</p>}
        </div>

        {/* District */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.district}
          </label>
          <input
            type="text"
            value={formData.district || ''}
            onChange={(e) => updateFormData({ district: e.target.value })}
            placeholder={isRtl ? 'مثال: الحي السابع' : 'e.g. District 7'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Street Name */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.streetName}
          </label>
          <input
            type="text"
            value={formData.streetName || ''}
            onChange={(e) => updateFormData({ streetName: e.target.value })}
            placeholder={isRtl ? 'اسم الشارع' : 'Street name'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Building Number */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.buildingNumber}
          </label>
          <input
            type="text"
            value={formData.buildingNumber || ''}
            onChange={(e) => updateFormData({ buildingNumber: e.target.value })}
            placeholder={isRtl ? 'رقم العمارة / الفيلا' : 'Building / Villa no.'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Nearest Landmark */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.nearestLandmark}
          </label>
          <input
            type="text"
            value={formData.nearestLandmark || ''}
            onChange={(e) => updateFormData({ nearestLandmark: e.target.value })}
            placeholder={isRtl ? 'أقرب علامة أو ميدان رئيسي' : 'Nearby landmark or square'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.postalCode}
          </label>
          <input
            type="text"
            value={formData.postalCode || ''}
            onChange={(e) => updateFormData({ postalCode: e.target.value })}
            placeholder="11511"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all font-mono"
          />
        </div>

        {/* Full Residential Address (Full Width) */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.fullAddress} <span className="text-gold-400">*</span>
          </label>
          <textarea
            rows={2}
            value={formData.fullResidentialAddress || ''}
            onChange={(e) => updateFormData({ fullResidentialAddress: e.target.value })}
            placeholder={isRtl ? 'العنوان التفصيلي ومحل الإقامة المكتوب في البطاقة' : 'Full residential address'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
          {errors.fullResidentialAddress && (
            <p className="text-rose-400 text-xs mt-1.5">{errors.fullResidentialAddress}</p>
          )}
        </div>
      </div>

      {/* GPS Location Section */}
      <div className="pt-4 border-t border-white/10">
        <LocationPickerMap
          initialLat={formData.coordinates?.latitude || 30.0444}
          initialLng={formData.coordinates?.longitude || 31.2357}
          isAuthorized={Boolean(formData.locationSharingAuthorized)}
          onLocationChange={handleLocationChange}
        />
      </div>
    </div>
  );
}

