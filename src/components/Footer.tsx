'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Music2, MapPin, Calendar, Award, ShieldCheck, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const { t, isRtl } = useLanguage();

  return (
    <footer className="border-t border-white/10 bg-surface text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient p-[1px]">
                <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
                  <Music2 className="w-5 h-5 text-gold-400" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-xl text-white">UTH FESTIVAL 2026</span>
                <p className="text-xs text-gold-400 font-semibold">{t.brandSub}</p>
              </div>
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
              {isRtl
                ? 'المنصة الرسمية المخصصة لاكتشاف وتجنيد المواهب الغنائية والموسيقية الشابة، للمشاركة في أضخم حدث فني على مسرح المتحف المصري الكبير يومي 20–21 نوفمبر 2026.'
                : 'The dedicated talent recruitment platform scouting young, independent, and undiscovered singers, rappers, musicians, and bands to perform live at the Grand Egyptian Museum on November 20–21, 2026.'}
            </p>

            {/* Disclaimer Alert Box */}
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/20 text-xs text-amber-300/90 leading-relaxed flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-300 mb-1">
                  {isRtl ? 'إشعار المنصة المستقلة والتجريبية' : 'Independent Talent Discovery Notice'}
                </strong>
                <span>
                  {isRtl
                    ? 'هذه المنصة هي نموذج تجريبي مستقل لطلبات وتجارب أداء المواهب الموسيقية، ما لم يتم الحصول على تفويض تمثيل رسمي من إدارة مهرجان UTH. تلتزم المنصة بأعلى معايير حماية وخصوصية بيانات المتقدمين.'
                    : 'This platform operates as an independent music talent application demo unless official authorization to represent UTH Festival is presented. All submitted talent information is stored securely.'}
                </span>
              </div>
            </div>
          </div>

          {/* Key Dates & Venue */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-400" />
              <span>{isRtl ? 'المواعيد والموقع' : 'Dates & Venue'}</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-zinc-200 block">{isRtl ? 'الموقع:' : 'Location:'}</strong>
                  {isRtl ? 'المتحف المصري الكبير (GEM)، الجيزة، مصر' : 'Grand Egyptian Museum (GEM), Giza, Egypt'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-zinc-200 block">{isRtl ? 'مواعيد المهرجان:' : 'Festival Dates:'}</strong>
                  {isRtl ? '20 – 21 نوفمبر 2026' : 'November 20–21, 2026'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Award className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-rose-300 block">{isRtl ? 'آخر موعد للتقديم:' : 'Application Deadline:'}</strong>
                  {isRtl ? '12 نوفمبر 2026 (23:59)' : 'November 12, 2026 (23:59 CLT)'}
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Links & Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide">
              {isRtl ? 'روابط سريعة' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/apply" className="hover:text-gold-400 transition-colors">
                  {t.nav.applyNow}
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-gold-400 transition-colors">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-gold-400 transition-colors">
                  {t.nav.benefits}
                </a>
              </li>
              <li>
                <a href="#requirements" className="hover:text-gold-400 transition-colors">
                  {t.nav.requirements}
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="text-gold-400/80 hover:text-gold-300 transition-colors">
                  {t.nav.adminPortal}
                </Link>
              </li>
            </ul>

            <div className="pt-2 text-xs space-y-1 text-zinc-500">
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gold-400/70" />
                <span>auditions@uthfestival-demo.com</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gold-400/70" />
                <span>+20 (2) 3377-0000</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 UTH Festival Music Open Call. All rights reserved.</p>
          <p className="text-zinc-600">
            {isRtl
              ? 'تم التطوير كمنصة تجنيد واختبارات موسيقية حديثة وكاملة للمواهب المصرية الصاعدة.'
              : 'Built as a comprehensive music talent recruitment & audition platform.'}
          </p>
        </div>
      </div>
    </footer>
  );
}

