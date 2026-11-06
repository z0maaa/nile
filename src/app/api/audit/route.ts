import { NextRequest, NextResponse } from 'next/server';
import { getAllAuditLogs } from '@/lib/db';
import { authenticateApiRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await authenticateApiRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const logs = getAllAuditLogs();
  return NextResponse.json({ success: true, logs });
}

