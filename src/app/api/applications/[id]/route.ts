import { NextRequest, NextResponse } from 'next/server';
import { getApplicationById, updateApplication } from '@/lib/db';
import { authenticateApiRequest } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await authenticateApiRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const app = getApplicationById(params.id);
  if (!app) {
    return NextResponse.json({ error: 'Applicant not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, application: app });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await authenticateApiRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const existingApp = getApplicationById(params.id);
  if (!existingApp) {
    return NextResponse.json({ error: 'Applicant not found' }, { status: 404 });
  }

  const updates: Record<string, any> = {};
  let actionName = 'APPLICATION_UPDATED';
  let actionDetails = 'Updated details';

  if (body.status && body.status !== existingApp.status) {
    updates.status = body.status;
    actionName = `STATUS_CHANGE_TO_${body.status}`;
    actionDetails = `Status changed from ${existingApp.status} to ${body.status}`;
  }

  if (body.evaluation) {
    const ev = body.evaluation;
    const scores = [
      Number(ev.vocalQuality) || 5,
      Number(ev.stagePresence) || 5,
      Number(ev.musicalTalent) || 5,
      Number(ev.originality) || 5,
      Number(ev.overallPerformance) || 5,
    ];
    const avg = Number((scores.reduce((a, b) => a + b, 0) / 5).toFixed(2));

    updates.evaluation = {
      vocalQuality: scores[0],
      stagePresence: scores[1],
      musicalTalent: scores[2],
      originality: scores[3],
      overallPerformance: scores[4],
      averageScore: avg,
      evaluatorId: session.userId,
      evaluatorName: session.name,
      evaluatorRole: session.role,
      privateNotes: ev.privateNotes || '',
      evaluatedAt: new Date().toISOString(),
    };
    actionName = 'EVALUATION_SCORED';
    actionDetails = `Evaluated with average score ${avg}/10: Vocal ${scores[0]}, Stage ${scores[1]}, Musicality ${scores[2]}, Originality ${scores[3]}, Overall ${scores[4]}.`;
  }

  if (body.auditionSchedule) {
    updates.auditionSchedule = {
      scheduledDate: body.auditionSchedule.scheduledDate,
      scheduledTime: body.auditionSchedule.scheduledTime,
      type: body.auditionSchedule.type || 'IN_PERSON_GEM',
      venueOrLink: body.auditionSchedule.venueOrLink || 'Grand Egyptian Museum - Rehearsal Room',
      notes: body.auditionSchedule.notes || '',
      status: body.auditionSchedule.status || 'SCHEDULED',
    };
    actionName = 'AUDITION_SCHEDULED';
    actionDetails = `Scheduled audition for ${body.auditionSchedule.scheduledDate} at ${body.auditionSchedule.scheduledTime} (${body.auditionSchedule.type}).`;
  }

  const updated = updateApplication(existingApp.id, updates, {
    name: session.name,
    role: session.role,
    action: actionName,
    details: actionDetails,
  });

  return NextResponse.json({
    success: true,
    application: updated,
  });
}

