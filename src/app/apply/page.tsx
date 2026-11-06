'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import Step1Personal from '@/components/FormSteps/Step1Personal';
import Step2Address from '@/components/FormSteps/Step2Address';
import Step3Education from '@/components/FormSteps/Step3Education';
import Step4Musical from '@/components/FormSteps/Step4Musical';
import Step5Documents from '@/components/FormSteps/Step5Documents';
import Step6Video from '@/components/FormSteps/Step6Video';
import ConfirmationScreen from '@/components/FormSteps/ConfirmationScreen';
import { ArrowLeft, ArrowRight, Check, Sparkles, User, MapPin, GraduationCap, Music, FileText, Video } from 'lucide-react';

export default function ApplyPage() {
  const { t, isRtl } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Full Applicant Form State
  const [formData, setFormData] = useState<Record<string, any>>({
    // Step 1
    fullNameArabic: '',
    fullNameEnglish: '',
    nationalIdNumber: '',
    dateOfBirth: '',
    calculatedAge: '',
    gender: 'MALE',
    nationality: 'Egyptian',
    maritalStatus: 'SINGLE',
    mobilePhoneNumber: '',
    whatsappNumber: '',
    emailAddress: '',
    emergencyContactName: '',
    emergencyContactPhone: '',

    // Step 2
    country: 'Egypt',
    governorate: 'Cairo',
    city: '',
    district: '',
    fullResidentialAddress: '',
    streetName: '',
    buildingNumber: '',
    nearestLandmark: '',
    postalCode: '',
    locationSharingAuthorized: false,
    coordinates: undefined,

    // Step 3
    universityOrInstitution: '',
    faculty: '',
    department: '',
    educationalQualification: '',
    graduationYear: '',
    overallGrade: '',
    additionalCourses: '',
    musicEducation: '',
    musicCertificates: '',
    musicalTrainingHistory: '',
    isCurrentlyStudying: false,
    isSelfTaught: false,

    // Step 4
    artistStageName: '',
    mainTalentCategory: 'Solo Singer',
    secondaryTalentCategories: [],
    musicalGenre: '',
    yearsOfMusicalExperience: 3,
    previousPerformances: '',
    previousCompetitions: '',
    previousMusicReleases: '',
    youtubeChannelUrl: '',
    instagramAccountUrl: '',
    tiktokAccountUrl: '',
    facebookAccountUrl: '',
    soundcloudAccountUrl: '',
    spotifyArtistProfileUrl: '',
    previousCollaborations: '',
    musicalInstrumentsPlayed: [],
    vocalRange: '',
    whyParticipate: '',
    uniqueMusicalTalent: '',
    musicalGoals: '',
    liveAudiencePerformance: true,
    comfortableLargeStage: true,
    availableFestivalDates: true,
    willingToRehearse: true,
    hasOriginalSongs: true,
    ownsMusicRights: true,

    // Step 5
    nationalIdFrontUrl: '',
    nationalIdBackUrl: '',
    personalProfessionalPhotoUrl: '',
    educationalQualificationUrl: '',
    cvPortfolioPdfUrl: '',
    additionalMusicCertificatesUrl: '',

    // Step 6
    auditionVideoUrl: '',
    auditionVideoDurationSeconds: 0,
    auditionVideoFormat: 'video/mp4',
    confirmOwnPerformance: true,
    confirmMusicRightsPermission: true,
    authorizeRecruitmentReview: true,
  });

  const updateFormData = (fields: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    // Clear errors for modified fields
    setErrors((prev) => {
      const copy = { ...prev };
      Object.keys(fields).forEach((key) => delete copy[key]);
      return copy;
    });
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullNameArabic?.trim()) {
        errs.fullNameArabic = isRtl ? 'الاسم بالكامل باللغة العربية مطلوب' : 'Full Arabic Name is required';
      }
      if (!formData.fullNameEnglish?.trim()) {
        errs.fullNameEnglish = isRtl ? 'الاسم بالكامل باللغة الإنجليزية مطلوب' : 'Full English Name is required';
      }
      if (!formData.nationalIdNumber || formData.nationalIdNumber.length !== 14) {
        errs.nationalIdNumber = isRtl ? 'الرقم القومي يجب أن يتكون من 14 رقماً' : 'National ID must be 14 digits';
      }
      if (!formData.dateOfBirth) {
        errs.dateOfBirth = isRtl ? 'تاريخ الميلاد مطلوب' : 'Date of Birth is required';
      }
      if (!formData.mobilePhoneNumber?.trim()) {
        errs.mobilePhoneNumber = isRtl ? 'رقم الهاتف المحمول مطلوب' : 'Mobile phone number is required';
      }
      if (!formData.emailAddress?.trim() || !formData.emailAddress.includes('@')) {
        errs.emailAddress = isRtl ? 'بريد إلكتروني صالح مطلوب' : 'A valid email address is required';
      }
    } else if (step === 2) {
      if (!formData.city?.trim()) {
        errs.city = isRtl ? 'المدينة / المركز مطلوب' : 'City is required';
      }
      if (!formData.fullResidentialAddress?.trim()) {
        errs.fullResidentialAddress = isRtl ? 'العنوان السكني التفصيلي مطلوب' : 'Full address is required';
      }
    } else if (step === 3) {
      if (!formData.universityOrInstitution?.trim()) {
        errs.universityOrInstitution = isRtl ? 'اسم الجامعة أو المؤسسة التعليمية مطلوب' : 'University or institution is required';
      }
      if (!formData.educationalQualification?.trim()) {
        errs.educationalQualification = isRtl ? 'المؤهل الدراسي مطلوب' : 'Educational qualification is required';
      }
    } else if (step === 4) {
      if (!formData.artistStageName?.trim()) {
        errs.artistStageName = isRtl ? 'الاسم الفني مطلوب' : 'Artist/stage name is required';
      }
      if (!formData.musicalGenre?.trim()) {
        errs.musicalGenre = isRtl ? 'النمط أو اللون الموسيقي مطلوب' : 'Musical genre is required';
      }
      if (!formData.whyParticipate?.trim()) {
        errs.whyParticipate = isRtl ? 'يرجى الإجابة عن سبب الرغبة في المشاركة' : 'Please provide your motivation to participate';
      }
      if (!formData.uniqueMusicalTalent?.trim()) {
        errs.uniqueMusicalTalent = isRtl ? 'يرجى توضيح ما يميز موهبتك' : 'Please tell us what makes your talent unique';
      }
      if (!formData.musicalGoals?.trim()) {
        errs.musicalGoals = isRtl ? 'يرجى كتابة أهدافك الموسيقية' : 'Please tell us your musical goals';
      }
    } else if (step === 5) {
      if (!formData.nationalIdFrontUrl) {
        errs.nationalIdFrontUrl = isRtl ? 'صورة وجه البطاقة مطلوبة' : 'National ID front side image is required';
      }
      if (!formData.nationalIdBackUrl) {
        errs.nationalIdBackUrl = isRtl ? 'صورة ظهر البطاقة مطلوبة' : 'National ID back side image is required';
      }
      if (!formData.personalProfessionalPhotoUrl) {
        errs.personalProfessionalPhotoUrl = isRtl ? 'الصورة الشخصية مطلوبة' : 'Personal professional photo is required';
      }
      if (!formData.educationalQualificationUrl) {
        errs.educationalQualificationUrl = isRtl ? 'صورة المؤهل الدراسي مطلوبة' : 'Qualification certificate is required';
      }
    } else if (step === 6) {
      if (!formData.auditionVideoUrl) {
        errs.auditionVideoUrl = isRtl ? 'فيديو تجربة الأداء مطلوب (60 إلى 90 ثانية)' : 'Audition video is required (60–90 seconds)';
      }
      if (!formData.confirmOwnPerformance || !formData.confirmMusicRightsPermission || !formData.authorizeRecruitmentReview) {
        errs.confirmations = isRtl ? 'يجب الموافقة على جميع الإقرارات والتفويضات للمتابعة' : 'All declarations must be accepted before submission';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitApplication = async () => {
    if (!validateStep(6)) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Submission failed');
      }

      setSubmissionResult(json);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setIsSubmitting(false);
      alert(err.message || 'Error submitting application');
    }
  };

  const stepIcons = [
    { num: 1, label: t.form.step1, icon: User },
    { num: 2, label: t.form.step2, icon: MapPin },
    { num: 3, label: t.form.step3, icon: GraduationCap },
    { num: 4, label: t.form.step4, icon: Music },
    { num: 5, label: t.form.step5, icon: FileText },
    { num: 6, label: t.form.step6, icon: Video },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Title Banner */}
          {!submissionResult && (
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30">
                {t.brand} • Open Call
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white">
                {t.form.headerTitle}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
                {t.form.headerSubtitle}
              </p>

              {/* Progress Steps Tabs */}
              <div className="pt-6">
                <div className="grid grid-cols-6 gap-2">
                  {stepIcons.map((s) => {
                    const isCompleted = currentStep > s.num;
                    const isCurrent = currentStep === s.num;
                    const Icon = s.icon;
                    return (
                      <div
                        key={s.num}
                        className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-gold-500/15 border-gold-500 text-gold-300 shadow-glow'
                            : isCompleted
                            ? 'bg-surface border-emerald-500/40 text-emerald-400'
                            : 'bg-surface/50 border-white/5 text-zinc-600'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                            isCurrent
                              ? 'bg-gold-500 text-zinc-950 font-black'
                              : isCompleted
                              ? 'bg-emerald-500 text-zinc-950 font-black'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
                        </div>
                        <span className="text-[10px] font-semibold truncate hidden sm:block">
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Form Card Body */}
          <div className="p-6 sm:p-10 rounded-3xl glass-card border border-white/10 shadow-2xl relative">
            {submissionResult ? (
              <ConfirmationScreen
                referenceNumber={submissionResult.referenceNumber}
                applicantName={submissionResult.applicantName}
                artistName={submissionResult.artistName}
                category={formData.mainTalentCategory}
                submittedAt={submissionResult.submittedAt}
                hasVideo={Boolean(formData.auditionVideoUrl)}
                hasGps={Boolean(formData.locationSharingAuthorized && formData.coordinates)}
              />
            ) : (
              <div>
                {currentStep === 1 && (
                  <Step1Personal
                    formData={formData}
                    updateFormData={updateFormData}
                    errors={errors}
                  />
                )}
                {currentStep === 2 && (
                  <Step2Address
                    formData={formData}
                    updateFormData={updateFormData}
                    errors={errors}
                  />
                )}
                {currentStep === 3 && (
                  <Step3Education
                    formData={formData}
                    updateFormData={updateFormData}
                    errors={errors}
                  />
                )}
                {currentStep === 4 && (
                  <Step4Musical
                    formData={formData}
                    updateFormData={updateFormData}
                    errors={errors}
                  />
                )}
                {currentStep === 5 && (
                  <Step5Documents
                    formData={formData}
                    updateFormData={updateFormData}
                    errors={errors}
                  />
                )}
                {currentStep === 6 && (
                  <Step6Video
                    formData={formData}
                    updateFormData={updateFormData}
                    errors={errors}
                    onSubmitApplication={handleSubmitApplication}
                    isSubmitting={isSubmitting}
                  />
                )}

                {/* Navigation Buttons (Steps 1 through 5) */}
                {currentStep < 6 && (
                  <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-surface hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition-all"
                      >
                        {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                        <span>{t.form.prev}</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gold-gradient text-zinc-950 text-xs font-black tracking-wider uppercase shadow-glow hover:shadow-glow-lg transition-all active:scale-95"
                    >
                      <span>{t.form.next}</span>
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

