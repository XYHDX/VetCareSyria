import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple shared-secret guard for admin mutations.
 * Expects an `Authorization: Bearer <token>` or `x-admin-token` header
 * matching `process.env.ADMIN_API_TOKEN`.
 */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) {
    // If not configured, allow through (but effectively unprotected).
    return null;
  }

  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host && !origin.includes(host)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 400 });
  }

  const header =
    request.headers.get('authorization') ||
    request.headers.get('Authorization') ||
    '';

  const bearer = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const headerToken = request.headers.get('x-admin-token') || bearer;

  if (headerToken !== token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
