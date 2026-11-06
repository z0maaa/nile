import { NextRequest, NextResponse } from 'next/server';
import { getAllApplications, createApplication } from '@/lib/db';
import { authenticateApiRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Essential Server-Side Validations
    if (!data.fullNameArabic || !data.fullNameEnglish) {
      return NextResponse.json(
        { error: 'Both Arabic and English full names are required.' },
        { status: 400 }
      );
    }

    if (!data.nationalIdNumber || data.nationalIdNumber.trim().length !== 14) {
      return NextResponse.json(
        { error: 'Valid 14-digit Egyptian National ID is required.' },
        { status: 400 }
      );
    }

    if (!data.mobilePhoneNumber || !data.emailAddress) {
      return NextResponse.json(
        { error: 'Mobile phone number and valid email address are required.' },
        { status: 400 }
      );
    }

    if (!data.mainTalentCategory) {
      return NextResponse.json(
        { error: 'Main musical talent category is required.' },
        { status: 400 }
      );
    }

    // Audition Video validation (Mandatory 60-90 seconds requirement)
    if (!data.auditionVideoUrl) {
      return NextResponse.json(
        { error: 'An audition video must be uploaded.' },
        { status: 400 }
      );
    }

    if (
      typeof data.auditionVideoDurationSeconds === 'number' &&
      (data.auditionVideoDurationSeconds < 58 || data.auditionVideoDurationSeconds > 92)
    ) {
      return NextResponse.json(
        {
          error: `Audition video duration is ${Math.round(data.auditionVideoDurationSeconds)}s. It must be between 60 and 90 seconds.`,
        },
        { status: 400 }
      );
    }

    if (!data.confirmOwnPerformance || !data.confirmMusicRightsPermission || !data.authorizeRecruitmentReview) {
      return NextResponse.json(
        { error: 'You must check all required confirmations before submitting.' },
        { status: 400 }
      );
    }

    // Location verification: only store coordinates if locationSharingAuthorized is true
    const sanitizedCoordinates = data.locationSharingAuthorized && data.coordinates
      ? {
          latitude: Number(data.coordinates.latitude),
          longitude: Number(data.coordinates.longitude),
          addressLabel: data.coordinates.addressLabel || '',
          confirmedAt: new Date().toISOString(),
        }
      : undefined;

    // Create record
    const createdApp = createApplication({
      fullNameArabic: data.fullNameArabic.trim(),
      fullNameEnglish: data.fullNameEnglish.trim(),
      nationalIdNumber: data.nationalIdNumber.trim(),
      dateOfBirth: data.dateOfBirth,
      calculatedAge: Number(data.calculatedAge) || 20,
      gender: data.gender || 'OTHER',
      nationality: data.nationality || 'Egyptian',
      maritalStatus: data.maritalStatus || 'SINGLE',
      mobilePhoneNumber: data.mobilePhoneNumber.trim(),
      whatsappNumber: data.whatsappNumber?.trim() || data.mobilePhoneNumber.trim(),
      emailAddress: data.emailAddress.trim().toLowerCase(),
      emergencyContactName: data.emergencyContactName?.trim() || '',
      emergencyContactPhone: data.emergencyContactPhone?.trim() || '',

      country: data.country || 'Egypt',
      governorate: data.governorate || 'Cairo',
      city: data.city || '',
      district: data.district || '',
      fullResidentialAddress: data.fullResidentialAddress || '',
      streetName: data.streetName || '',
      buildingNumber: data.buildingNumber || '',
      nearestLandmark: data.nearestLandmark || '',
      postalCode: data.postalCode || '',
      locationSharingAuthorized: Boolean(data.locationSharingAuthorized),
      coordinates: sanitizedCoordinates,

      universityOrInstitution: data.universityOrInstitution || '',
      faculty: data.faculty || '',
      department: data.department || '',
      educationalQualification: data.educationalQualification || '',
      graduationYear: data.graduationYear || '',
      overallGrade: data.overallGrade || '',
      additionalCourses: data.additionalCourses || '',
      musicEducation: data.musicEducation || '',
      musicCertificates: data.musicCertificates || '',
      musicalTrainingHistory: data.musicalTrainingHistory || '',
      isCurrentlyStudying: Boolean(data.isCurrentlyStudying),
      isSelfTaught: Boolean(data.isSelfTaught),

      artistStageName: data.artistStageName?.trim() || data.fullNameEnglish.trim(),
      mainTalentCategory: data.mainTalentCategory,
      secondaryTalentCategories: data.secondaryTalentCategories || [],
      musicalGenre: data.musicalGenre || '',
      yearsOfMusicalExperience: Number(data.yearsOfMusicalExperience) || 0,
      previousPerformances: data.previousPerformances || '',
      previousCompetitions: data.previousCompetitions || '',
      previousMusicReleases: data.previousMusicReleases || '',
      youtubeChannelUrl: data.youtubeChannelUrl || '',
      instagramAccountUrl: data.instagramAccountUrl || '',
      tiktokAccountUrl: data.tiktokAccountUrl || '',
      facebookAccountUrl: data.facebookAccountUrl || '',
      soundcloudAccountUrl: data.soundcloudAccountUrl || '',
      spotifyArtistProfileUrl: data.spotifyArtistProfileUrl || '',
      previousCollaborations: data.previousCollaborations || '',
      musicalInstrumentsPlayed: data.musicalInstrumentsPlayed || [],
      vocalRange: data.vocalRange || '',
      musicalTrainingBackground: data.musicalTrainingBackground || '',
      whyParticipate: data.whyParticipate || '',
      uniqueMusicalTalent: data.uniqueMusicalTalent || '',
      musicalGoals: data.musicalGoals || '',
      liveAudiencePerformance: Boolean(data.liveAudiencePerformance),
      comfortableLargeStage: Boolean(data.comfortableLargeStage),
      availableFestivalDates: Boolean(data.availableFestivalDates),
      willingToRehearse: Boolean(data.willingToRehearse),
      hasOriginalSongs: Boolean(data.hasOriginalSongs),
      ownsMusicRights: Boolean(data.ownsMusicRights),

      nationalIdFrontUrl: data.nationalIdFrontUrl || '',
      nationalIdBackUrl: data.nationalIdBackUrl || '',
      personalProfessionalPhotoUrl: data.personalProfessionalPhotoUrl || '',
      educationalQualificationUrl: data.educationalQualificationUrl || '',
      cvPortfolioPdfUrl: data.cvPortfolioPdfUrl || '',
      additionalMusicCertificatesUrl: data.additionalMusicCertificatesUrl || '',

      auditionVideoUrl: data.auditionVideoUrl,
      auditionVideoDurationSeconds: Number(data.auditionVideoDurationSeconds) || 75,
      auditionVideoFormat: data.auditionVideoFormat || 'video/mp4',
      confirmOwnPerformance: Boolean(data.confirmOwnPerformance),
      confirmMusicRightsPermission: Boolean(data.confirmMusicRightsPermission),
      authorizeRecruitmentReview: Boolean(data.authorizeRecruitmentReview),
    });

    return NextResponse.json({
      success: true,
      referenceNumber: createdApp.referenceNumber,
      id: createdApp.id,
      submittedAt: createdApp.submittedAt,
      applicantName: createdApp.fullNameEnglish,
      artistName: createdApp.artistStageName,
    });
  } catch (error: any) {
    console.error('Submit application error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Protect admin endpoint
  const session = await authenticateApiRequest(req);
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized: Staff credentials required' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase();
  const governorate = searchParams.get('governorate');
  const category = searchParams.get('category');
  const genre = searchParams.get('genre');
  const status = searchParams.get('status');
  const hasGps = searchParams.get('hasGps');

  let list = getAllApplications();

  if (search) {
    list = list.filter((a) =>
      a.fullNameEnglish.toLowerCase().includes(search) ||
      a.fullNameArabic.includes(search) ||
      a.artistStageName.toLowerCase().includes(search) ||
      a.referenceNumber.toLowerCase().includes(search) ||
      a.emailAddress.toLowerCase().includes(search) ||
      a.mobilePhoneNumber.includes(search)
    );
  }

  if (governorate && governorate !== 'ALL') {
    list = list.filter((a) => a.governorate.toLowerCase() === governorate.toLowerCase());
  }

  if (category && category !== 'ALL') {
    list = list.filter((a) => a.mainTalentCategory === category);
  }

  if (genre && genre !== 'ALL') {
    list = list.filter((a) => a.musicalGenre.toLowerCase().includes(genre.toLowerCase()));
  }

  if (status && status !== 'ALL') {
    list = list.filter((a) => a.status === status);
  }

  if (hasGps === 'true') {
    list = list.filter((a) => a.locationSharingAuthorized && !!a.coordinates);
  }

  return NextResponse.json({
    success: true,
    count: list.length,
    applications: list,
  });
}

