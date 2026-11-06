'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { TALENT_CATEGORIES } from '@/lib/translations';
import { Music, Share2, HelpCircle } from 'lucide-react';

interface Step4Props {
  formData: any;
  updateFormData: (fields: Record<string, any>) => void;
  errors: Record<string, string>;
}

export default function Step4Musical({ formData, updateFormData, errors }: Step4Props) {
  const { t, isRtl } = useLanguage();

  const handleSecondaryCategoryToggle = (catName: string) => {
    const current = formData.secondaryTalentCategories || [];
    if (current.includes(catName)) {
      updateFormData({
        secondaryTalentCategories: current.filter((c: string) => c !== catName),
      });
    } else {
      updateFormData({
        secondaryTalentCategories: [...current, catName],
      });
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 text-sm text-slate-900 placeholder-slate-400 transition-all outline-none';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-black text-navy-900 flex items-center gap-2">
          <Music className="w-5 h-5 text-emerald-600" />
          <span>{t.form.step4Title}</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">{t.form.step4Desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Artist / Stage Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.artistName} <span className="text-emerald-600">*</span>
          </label>
          <input
            type="text"
            value={formData.artistStageName || ''}
            onChange={(e) => updateFormData({ artistStageName: e.target.value })}
            placeholder={isRtl ? 'الاسم الفني أو اسم الفرقة' : 'e.g. BADRY / Echo Path Band'}
            className={`${inputClass} font-semibold`}
          />
          {errors.artistStageName && (
            <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.artistStageName}</p>
          )}
        </div>

        {/* Main Talent Category */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.mainCategory} <span className="text-emerald-600">*</span>
          </label>
          <select
            value={formData.mainTalentCategory || 'Solo Singer'}
            onChange={(e) => updateFormData({ mainTalentCategory: e.target.value })}
            className={`${inputClass} font-medium`}
          >
            {TALENT_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.en}>
                {isRtl ? cat.ar : cat.en}
              </option>
            ))}
          </select>
          {errors.mainTalentCategory && (
            <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.mainTalentCategory}</p>
          )}
        </div>

        {/* Musical Genre */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.musicalGenre} <span className="text-emerald-600">*</span>
          </label>
          <input
            type="text"
            value={formData.musicalGenre || ''}
            onChange={(e) => updateFormData({ musicalGenre: e.target.value })}
            placeholder={isRtl ? 'مثال: طرب أصيل، هيب هوب مصري، إندي روك' : 'e.g. Neo-Tarab, Egyptian Trap, Indie Rock'}
            className={inputClass}
          />
          {errors.musicalGenre && (
            <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.musicalGenre}</p>
          )}
        </div>

        {/* Years of Musical Experience */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.yearsExperience} <span className="text-emerald-600">*</span>
          </label>
          <input
            type="number"
            min={0}
            max={50}
            value={formData.yearsOfMusicalExperience !== undefined ? formData.yearsOfMusicalExperience : ''}
            onChange={(e) => updateFormData({ yearsOfMusicalExperience: Number(e.target.value) })}
            placeholder="5"
            className={`${inputClass} font-mono`}
          />
        </div>

        {/* Secondary Talent Categories (Multi-select pills) */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.secondaryCategories}
          </label>
          <div className="flex flex-wrap gap-2">
            {TALENT_CATEGORIES.map((cat) => {
              const selected = (formData.secondaryTalentCategories || []).includes(cat.en);
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleSecondaryCategoryToggle(cat.en)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700'
                  }`}
                >
                  {isRtl ? cat.ar : cat.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Previous Performances */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.previousPerformances}
          </label>
          <textarea
            rows={2}
            value={formData.previousPerformances || ''}
            onChange={(e) => updateFormData({ previousPerformances: e.target.value })}
            placeholder={isRtl ? 'حفلات ساقية الصاوي، الأوبرا، مسارح الجامعات، حفلات حية...' : 'List live concerts, venues, cultural festivals...'}
            className={inputClass}
          />
        </div>

        {/* Previous Competitions */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.previousCompetitions}
          </label>
          <input
            type="text"
            value={formData.previousCompetitions || ''}
            onChange={(e) => updateFormData({ previousCompetitions: e.target.value })}
            placeholder={isRtl ? 'مسابقات غنائية سابقة والجوائز الحاصل عليها' : 'Previous music contests, awards or rankings'}
            className={inputClass}
          />
        </div>

        {/* Previous Music Releases */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.previousReleases}
          </label>
          <input
            type="text"
            value={formData.previousMusicReleases || ''}
            onChange={(e) => updateFormData({ previousMusicReleases: e.target.value })}
            placeholder={isRtl ? 'أغانٍ منفردة، ألبومات، أو فيديوهات كليب منشورة' : 'Singles, EPs, or music video releases'}
            className={inputClass}
          />
        </div>

        {/* Musical Instruments Played */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.instruments}
          </label>
          <input
            type="text"
            value={Array.isArray(formData.musicalInstrumentsPlayed) ? formData.musicalInstrumentsPlayed.join(', ') : (formData.musicalInstrumentsPlayed || '')}
            onChange={(e) => updateFormData({ musicalInstrumentsPlayed: e.target.value.split(',').map((s: string) => s.trim()) })}
            placeholder={isRtl ? 'عود، بيانو، جيتار، قانون، درامز...' : 'e.g. Oud, Piano, Electric Guitar, Ney'}
            className={inputClass}
          />
        </div>

        {/* Vocal Range (Optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t.form.vocalRange}
          </label>
          <input
            type="text"
            value={formData.vocalRange || ''}
            onChange={(e) => updateFormData({ vocalRange: e.target.value })}
            placeholder={isRtl ? 'مثال: تينور، سوبرانو، باريتون، ألتو' : 'e.g. Tenor, Soprano, Baritone, Alto'}
            className={inputClass}
          />
        </div>

        {/* Social Media Links Header */}
        <div className="md:col-span-2 pt-4 border-t border-slate-200">
          <h4 className="text-sm font-bold text-navy-900 flex items-center gap-2 mb-3">
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>{t.form.socialLinksTitle}</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">{t.form.youtubeUrl}</label>
              <input
                type="url"
                dir="ltr"
                value={formData.youtubeChannelUrl || ''}
                onChange={(e) => updateFormData({ youtubeChannelUrl: e.target.value })}
                placeholder="https://youtube.com/@yourchannel"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 text-xs text-slate-900 placeholder-slate-400 font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">{t.form.instagramUrl}</label>
              <input
                type="url"
                dir="ltr"
                value={formData.instagramAccountUrl || ''}
                onChange={(e) => updateFormData({ instagramAccountUrl: e.target.value })}
                placeholder="https://instagram.com/yourhandle"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 text-xs text-slate-900 placeholder-slate-400 font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">{t.form.spotifyUrl}</label>
              <input
                type="url"
                dir="ltr"
                value={formData.spotifyArtistProfileUrl || ''}
                onChange={(e) => updateFormData({ spotifyArtistProfileUrl: e.target.value })}
                placeholder="https://open.spotify.com/artist/..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 text-xs text-slate-900 placeholder-slate-400 font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">{t.form.soundcloudUrl}</label>
              <input
                type="url"
                dir="ltr"
                value={formData.soundcloudAccountUrl || ''}
                onChange={(e) => updateFormData({ soundcloudAccountUrl: e.target.value })}
                placeholder="https://soundcloud.com/yourname"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 text-xs text-slate-900 placeholder-slate-400 font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">{t.form.tiktokUrl}</label>
              <input
                type="url"
                dir="ltr"
                value={formData.tiktokAccountUrl || ''}
                onChange={(e) => updateFormData({ tiktokAccountUrl: e.target.value })}
                placeholder="https://tiktok.com/@youraccount"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 text-xs text-slate-900 placeholder-slate-400 font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">{t.form.facebookUrl}</label>
              <input
                type="url"
                dir="ltr"
                value={formData.facebookAccountUrl || ''}
                onChange={(e) => updateFormData({ facebookAccountUrl: e.target.value })}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 text-xs text-slate-900 placeholder-slate-400 font-mono outline-none"
              />
            </div>
          </div>
        </div>

        {/* Additional Questions Section */}
        <div className="md:col-span-2 pt-6 border-t border-slate-200 space-y-6">
          <h4 className="text-sm font-bold text-navy-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>{t.form.additionalQuestionsTitle}</span>
          </h4>

          {/* Why Participate */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t.form.whyParticipate} <span className="text-emerald-600">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.whyParticipate || ''}
              onChange={(e) => updateFormData({ whyParticipate: e.target.value })}
              placeholder={isRtl ? 'حدثنا عن دافعك وشغفك للمشاركة في مهرجان UTH 2026 على مسرح المتحف المصري الكبير...' : 'Tell us your motivation to perform at UTH Festival 2026 at the GEM...'}
              className={inputClass}
            />
            {errors.whyParticipate && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.whyParticipate}</p>
            )}
          </div>

          {/* Unique Talent */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t.form.uniqueTalent} <span className="text-emerald-600">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.uniqueMusicalTalent || ''}
              onChange={(e) => updateFormData({ uniqueMusicalTalent: e.target.value })}
              placeholder={isRtl ? 'ما هي اللمسة الفنية أو النبرة الصوتية أو الأسلوب الذي يميزك؟' : 'What makes your voice, performance, or sound stand out?'}
              className={inputClass}
            />
            {errors.uniqueMusicalTalent && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.uniqueMusicalTalent}</p>
            )}
          </div>

          {/* Musical Goals */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t.form.musicalGoals} <span className="text-emerald-600">*</span>
            </label>
            <textarea
              rows={2}
              value={formData.musicalGoals || ''}
              onChange={(e) => updateFormData({ musicalGoals: e.target.value })}
              placeholder={isRtl ? 'أين ترى مسيرتك الموسيقية خلال الـ 3 إلى 5 سنوات القادمة؟' : 'Where do you see your musical career in the next 3 to 5 years?'}
              className={inputClass}
            />
            {errors.musicalGoals && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.musicalGoals}</p>
            )}
          </div>

          {/* Yes/No Checkbox Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { id: 'liveAudiencePerformance', label: t.form.qLiveAudience },
              { id: 'comfortableLargeStage', label: t.form.qLargeStage },
              { id: 'availableFestivalDates', label: t.form.qFestivalDates },
              { id: 'willingToRehearse', label: t.form.qRehearsals },
              { id: 'hasOriginalSongs', label: t.form.qOriginalSongs },
              { id: 'ownsMusicRights', label: t.form.qRights },
            ].map((q) => (
              <label
                key={q.id}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 cursor-pointer transition-all select-none"
              >
                <input
                  type="checkbox"
                  checked={Boolean(formData[q.id])}
                  onChange={(e) => updateFormData({ [q.id]: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 shrink-0"
                />
                <span className="text-xs font-semibold text-slate-800">{q.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
