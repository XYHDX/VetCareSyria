import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { STORAGE_KEYS } from '@/lib/localStorage';
import { v4 as uuid } from 'uuid';
import { setUpdatedAt } from '@/lib/storageMeta';
import { requireAdmin } from '@/lib/adminAuth';
import { DEFAULT_PARTNERS, type Partner } from '@/lib/partners';

const PARTNERS_KEY = STORAGE_KEYS.PARTNERS;
export async function GET() {
  try {
    const partners = (await redis.get<Partner[]>(PARTNERS_KEY)) || DEFAULT_PARTNERS;
    return NextResponse.json(partners);
  } catch (error) {
    console.error('🔥 GET /api/admin/partners failed:', error);
    return NextResponse.json(DEFAULT_PARTNERS, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  try {
    const payload = (await request.json()) as unknown;
    if (!Array.isArray(payload)) {
      return NextResponse.json({ error: 'Payload must be an array' }, { status: 400 });
    }

    const sanitized = payload
      .filter((p) => typeof p.name === 'string' && p.name.trim())
      .map((p) => ({
        ...p,
        id: typeof p.id === 'string' && p.id.trim() ? p.id : uuid(),
        name: p.name.trim().slice(0, 120),
        website: typeof p.website === 'string' ? p.website.slice(0, 200) : undefined,
        logo: typeof p.logo === 'string' ? p.logo.slice(0, 300) : undefined
      }));

    await redis.set(PARTNERS_KEY, sanitized);
    await setUpdatedAt(PARTNERS_KEY);
    return NextResponse.json({ message: 'Partners saved' });
  } catch (error) {
    console.error('🔥 POST /api/admin/partners failed:', error);
    return NextResponse.json({ error: 'Unable to save partners' }, { status: 500 });
  }
}
