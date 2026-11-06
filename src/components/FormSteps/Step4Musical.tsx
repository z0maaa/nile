'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { TALENT_CATEGORIES } from '@/lib/translations';
import { Music, Radio, Youtube, Instagram, Share2, HelpCircle, CheckCircle } from 'lucide-react';

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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <Music className="w-5 h-5 text-gold-400" />
          <span>{t.form.step4Title}</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-1">{t.form.step4Desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Artist / Stage Name */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.artistName} <span className="text-gold-400">*</span>
          </label>
          <input
            type="text"
            value={formData.artistStageName || ''}
            onChange={(e) => updateFormData({ artistStageName: e.target.value })}
            placeholder={isRtl ? 'الاسم الفني أو اسم الفرقة' : 'e.g. BADRY / Echo Path Band'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all font-semibold"
          />
          {errors.artistStageName && (
            <p className="text-rose-400 text-xs mt-1.5">{errors.artistStageName}</p>
          )}
        </div>

        {/* Main Talent Category */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.mainCategory} <span className="text-gold-400">*</span>
          </label>
          <select
            value={formData.mainTalentCategory || 'Solo Singer'}
            onChange={(e) => updateFormData({ mainTalentCategory: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white transition-all font-medium"
          >
            {TALENT_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.en}>
                {isRtl ? cat.ar : cat.en}
              </option>
            ))}
          </select>
          {errors.mainTalentCategory && (
            <p className="text-rose-400 text-xs mt-1.5">{errors.mainTalentCategory}</p>
          )}
        </div>

        {/* Musical Genre */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.musicalGenre} <span className="text-gold-400">*</span>
          </label>
          <input
            type="text"
            value={formData.musicalGenre || ''}
            onChange={(e) => updateFormData({ musicalGenre: e.target.value })}
            placeholder={isRtl ? 'مثال: طرب أصيل، هيب هوب مصري، إندي روك' : 'e.g. Neo-Tarab, Egyptian Trap, Indie Rock'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
          {errors.musicalGenre && (
            <p className="text-rose-400 text-xs mt-1.5">{errors.musicalGenre}</p>
          )}
        </div>

        {/* Years of Musical Experience */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.yearsExperience} <span className="text-gold-400">*</span>
          </label>
          <input
            type="number"
            min={0}
            max={50}
            value={formData.yearsOfMusicalExperience !== undefined ? formData.yearsOfMusicalExperience : ''}
            onChange={(e) => updateFormData({ yearsOfMusicalExperience: Number(e.target.value) })}
            placeholder="5"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all font-mono"
          />
        </div>

        {/* Secondary Talent Categories (Multi-select pills) */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selected
                      ? 'bg-gold-500 text-zinc-950 font-bold shadow-glow'
                      : 'bg-surface border border-white/10 text-zinc-300 hover:border-gold-500/40'
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
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.previousPerformances}
          </label>
          <textarea
            rows={2}
            value={formData.previousPerformances || ''}
            onChange={(e) => updateFormData({ previousPerformances: e.target.value })}
            placeholder={isRtl ? 'حفلات ساقية الصاوي، الأوبرا، مسارح الجامعات، حفلات حية...' : 'List live concerts, venues, cultural festivals...'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Previous Competitions */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.previousCompetitions}
          </label>
          <input
            type="text"
            value={formData.previousCompetitions || ''}
            onChange={(e) => updateFormData({ previousCompetitions: e.target.value })}
            placeholder={isRtl ? 'مسابقات غنائية سابقة والجوائز الحاصل عليها' : 'Previous music contests, awards or rankings'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Previous Music Releases */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.previousReleases}
          </label>
          <input
            type="text"
            value={formData.previousMusicReleases || ''}
            onChange={(e) => updateFormData({ previousMusicReleases: e.target.value })}
            placeholder={isRtl ? 'أغانٍ منفردة، ألبومات، أو فيديوهات كليب منشورة' : 'Singles, EPs, or music video releases'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Musical Instruments Played */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.instruments}
          </label>
          <input
            type="text"
            value={Array.isArray(formData.musicalInstrumentsPlayed) ? formData.musicalInstrumentsPlayed.join(', ') : (formData.musicalInstrumentsPlayed || '')}
            onChange={(e) => updateFormData({ musicalInstrumentsPlayed: e.target.value.split(',').map((s: string) => s.trim()) })}
            placeholder={isRtl ? 'عود، بيانو، جيتار، قانون، درامز...' : 'e.g. Oud, Piano, Electric Guitar, Ney'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Vocal Range (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-2">
            {t.form.vocalRange}
          </label>
          <input
            type="text"
            value={formData.vocalRange || ''}
            onChange={(e) => updateFormData({ vocalRange: e.target.value })}
            placeholder={isRtl ? 'مثال: تينور، سوبرانو، باريتون، ألتو' : 'e.g. Tenor, Soprano, Baritone, Alto'}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Social Media Links Header */}
        <div className="md:col-span-2 pt-4 border-t border-white/10">
          <h4 className="text-sm font-bold text-gold-300 flex items-center gap-2 mb-3">
            <Share2 className="w-4 h-4 text-gold-400" />
            <span>{t.form.socialLinksTitle}</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">{t.form.youtubeUrl}</label>
              <input
                type="url"
                dir="ltr"
                value={formData.youtubeChannelUrl || ''}
                onChange={(e) => updateFormData({ youtubeChannelUrl: e.target.value })}
                placeholder="https://youtube.com/@yourchannel"
                className="w-full px-3 py-2.5 rounded-lg bg-surface border border-white/10 focus:border-gold-500 text-xs text-white placeholder-zinc-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">{t.form.instagramUrl}</label>
              <input
                type="url"
                dir="ltr"
                value={formData.instagramAccountUrl || ''}
                onChange={(e) => updateFormData({ instagramAccountUrl: e.target.value })}
                placeholder="https://instagram.com/yourhandle"
                className="w-full px-3 py-2.5 rounded-lg bg-surface border border-white/10 focus:border-gold-500 text-xs text-white placeholder-zinc-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">{t.form.spotifyUrl}</label>
              <input
                type="url"
                dir="ltr"
                value={formData.spotifyArtistProfileUrl || ''}
                onChange={(e) => updateFormData({ spotifyArtistProfileUrl: e.target.value })}
                placeholder="https://open.spotify.com/artist/..."
                className="w-full px-3 py-2.5 rounded-lg bg-surface border border-white/10 focus:border-gold-500 text-xs text-white placeholder-zinc-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">{t.form.soundcloudUrl}</label>
              <input
                type="url"
                dir="ltr"
                value={formData.soundcloudAccountUrl || ''}
                onChange={(e) => updateFormData({ soundcloudAccountUrl: e.target.value })}
                placeholder="https://soundcloud.com/yourname"
                className="w-full px-3 py-2.5 rounded-lg bg-surface border border-white/10 focus:border-gold-500 text-xs text-white placeholder-zinc-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">{t.form.tiktokUrl}</label>
              <input
                type="url"
                dir="ltr"
                value={formData.tiktokAccountUrl || ''}
                onChange={(e) => updateFormData({ tiktokAccountUrl: e.target.value })}
                placeholder="https://tiktok.com/@youraccount"
                className="w-full px-3 py-2.5 rounded-lg bg-surface border border-white/10 focus:border-gold-500 text-xs text-white placeholder-zinc-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">{t.form.facebookUrl}</label>
              <input
                type="url"
                dir="ltr"
                value={formData.facebookAccountUrl || ''}
                onChange={(e) => updateFormData({ facebookAccountUrl: e.target.value })}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-3 py-2.5 rounded-lg bg-surface border border-white/10 focus:border-gold-500 text-xs text-white placeholder-zinc-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Additional Questions Section */}
        <div className="md:col-span-2 pt-6 border-t border-white/10 space-y-6">
          <h4 className="text-sm font-bold text-gold-300 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-gold-400" />
            <span>{t.form.additionalQuestionsTitle}</span>
          </h4>

          {/* Why Participate */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              {t.form.whyParticipate} <span className="text-gold-400">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.whyParticipate || ''}
              onChange={(e) => updateFormData({ whyParticipate: e.target.value })}
              placeholder={isRtl ? 'حدثنا عن دافعك وشغفك للمشاركة في مهرجان UTH 2026 على مسرح المتحف المصري الكبير...' : 'Tell us your motivation to perform at UTH Festival 2026 at the GEM...'}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
            />
            {errors.whyParticipate && (
              <p className="text-rose-400 text-xs mt-1.5">{errors.whyParticipate}</p>
            )}
          </div>

          {/* Unique Talent */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              {t.form.uniqueTalent} <span className="text-gold-400">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.uniqueMusicalTalent || ''}
              onChange={(e) => updateFormData({ uniqueMusicalTalent: e.target.value })}
              placeholder={isRtl ? 'ما هي اللمسة الفنية أو النبرة الصوتية أو الأسلوب الذي يميزك؟' : 'What makes your voice, performance, or sound stand out?'}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
            />
            {errors.uniqueMusicalTalent && (
              <p className="text-rose-400 text-xs mt-1.5">{errors.uniqueMusicalTalent}</p>
            )}
          </div>

          {/* Musical Goals */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              {t.form.musicalGoals} <span className="text-gold-400">*</span>
            </label>
            <textarea
              rows={2}
              value={formData.musicalGoals || ''}
              onChange={(e) => updateFormData({ musicalGoals: e.target.value })}
              placeholder={isRtl ? 'أين ترى مسيرتك الموسيقية خلال الـ 3 إلى 5 سنوات القادمة؟' : 'Where do you see your musical career in the next 3 to 5 years?'}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 focus:border-gold-500 text-sm text-white placeholder-zinc-500 transition-all"
            />
            {errors.musicalGoals && (
              <p className="text-rose-400 text-xs mt-1.5">{errors.musicalGoals}</p>
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
                className="flex items-start gap-3 p-3.5 rounded-xl bg-surface border border-white/10 hover:border-gold-500/30 cursor-pointer transition-all select-none"
              >
                <input
                  type="checkbox"
                  checked={Boolean(formData[q.id])}
                  onChange={(e) => updateFormData({ [q.id]: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded border-white/20 text-gold-500 focus:ring-gold-500 accent-gold-500 shrink-0"
                />
                <span className="text-xs font-medium text-zinc-200">{q.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

