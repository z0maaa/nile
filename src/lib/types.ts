export type ApplicationStatus = 'NEW' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';

export type UserRole = 'ADMIN' | 'RECRUITMENT_OFFICER' | 'SECURITY_REVIEWER';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  confirmedAt?: string;
  addressLabel?: string;
}

export interface EvaluationRecord {
  vocalQuality: number; // 1 to 10
  stagePresence: number; // 1 to 10
  musicalTalent: number; // 1 to 10
  originality: number; // 1 to 10
  overallPerformance: number; // 1 to 10
  averageScore: number;
  evaluatorId: string;
  evaluatorName: string;
  evaluatorRole: string;
  privateNotes: string;
  evaluatedAt: string;
}

export interface AuditionScheduleRecord {
  scheduledDate: string;
  scheduledTime: string;
  type: 'IN_PERSON_GEM' | 'VIRTUAL_INTERVIEW';
  venueOrLink: string;
  notes: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
}

export interface ApplicantApplication {
  id: string;
  referenceNumber: string; // e.g. UTH-2026-8742

  // STEP 1 – Personal Information
  fullNameArabic: string;
  fullNameEnglish: string;
  nationalIdNumber: string;
  dateOfBirth: string;
  calculatedAge: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  nationality: string;
  maritalStatus: 'SINGLE' | 'MARRIED' | 'OTHER';
  mobilePhoneNumber: string;
  whatsappNumber: string;
  emailAddress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;

  // STEP 2 – Address and Geographic Information
  country: string;
  governorate: string;
  city: string;
  district: string;
  fullResidentialAddress: string;
  streetName: string;
  buildingNumber: string;
  nearestLandmark: string;
  postalCode: string;
  locationSharingAuthorized: boolean;
  coordinates?: LocationCoordinates;

  // STEP 3 – Educational Information
  universityOrInstitution: string;
  faculty: string;
  department: string;
  educationalQualification: string;
  graduationYear: string;
  overallGrade: string;
  additionalCourses?: string;
  musicEducation?: string;
  musicCertificates?: string;
  musicalTrainingHistory?: string;
  isCurrentlyStudying: boolean;
  isSelfTaught: boolean;

  // STEP 4 – Musical Talent Information
  artistStageName: string;
  mainTalentCategory: string;
  secondaryTalentCategories: string[];
  musicalGenre: string;
  yearsOfMusicalExperience: number;
  previousPerformances: string;
  previousCompetitions?: string;
  previousMusicReleases?: string;
  youtubeChannelUrl?: string;
  instagramAccountUrl?: string;
  tiktokAccountUrl?: string;
  facebookAccountUrl?: string;
  soundcloudAccountUrl?: string;
  spotifyArtistProfileUrl?: string;
  previousCollaborations?: string;
  musicalInstrumentsPlayed: string[];
  vocalRange?: string;
  musicalTrainingBackground?: string;
  whyParticipate: string;
  uniqueMusicalTalent: string;
  musicalGoals: string;
  liveAudiencePerformance: boolean;
  comfortableLargeStage: boolean;
  availableFestivalDates: boolean; // Nov 20-21, 2026
  willingToRehearse: boolean;
  hasOriginalSongs: boolean;
  ownsMusicRights: boolean;

  // STEP 5 – Required Documents and Photos
  nationalIdFrontUrl: string;
  nationalIdBackUrl: string;
  personalProfessionalPhotoUrl: string;
  educationalQualificationUrl: string;
  cvPortfolioPdfUrl?: string;
  additionalMusicCertificatesUrl?: string;

  // FINAL STEP – Audition Video
  auditionVideoUrl: string;
  auditionVideoDurationSeconds: number;
  auditionVideoFormat: string;
  confirmOwnPerformance: boolean;
  confirmMusicRightsPermission: boolean;
  authorizeRecruitmentReview: boolean;

  // System & Management Fields
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  evaluation?: EvaluationRecord;
  auditionSchedule?: AuditionScheduleRecord;
  auditLogs: AuditLogEntry[];
}

