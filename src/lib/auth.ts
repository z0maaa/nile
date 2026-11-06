import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { UserRole } from './types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'uth-festival-2026-super-secure-jwt-signing-secret-key-gem-cairo'
);

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  [key: string]: unknown;
}

export async function signAdminSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyAdminSession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (err) {
    return null;
  }
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('uth_admin_session')?.value;
    if (!token) return null;
    return await verifyAdminSession(token);
  } catch (err) {
    return null;
  }
}

export async function authenticateApiRequest(req: NextRequest): Promise<SessionPayload | null> {
  // Check cookie first
  const cookieToken = req.cookies.get('uth_admin_session')?.value;
  if (cookieToken) {
    const session = await verifyAdminSession(cookieToken);
    if (session) return session;
  }

  // Check Bearer authorization header
  const authHeader = req.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return await verifyAdminSession(token);
  }

  return null;
}

