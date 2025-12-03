import { redis } from '@/lib/redis'; // Import the shared Redis client
import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name
import { setUpdatedAt } from '@/lib/storageMeta';
import { requireAdmin } from '@/lib/adminAuth';
import { DEFAULT_SETTINGS, type SiteSettings } from '@/lib/siteSettings';

const REDIS_SETTINGS_KEY = STORAGE_KEYS.SETTINGS;

// GET Handler: Fetch settings from Redis
export async function GET() {
  try {
    const settings = (await redis.get<SiteSettings>(REDIS_SETTINGS_KEY)) || DEFAULT_SETTINGS;
    const normalized: SiteSettings = {
      ...DEFAULT_SETTINGS,
      ...settings,
      maxItemsPerPage: settings.maxItemsPerPage ?? DEFAULT_SETTINGS.maxItemsPerPage
    };
    return NextResponse.json(normalized);
  } catch (error) {
    console.error('🔥 GET /api/admin/settings failed:', error);
    return NextResponse.json({ error: 'Internal Server Error fetching data' }, { status: 500 });
  }
}

// POST Handler: Save settings to Redis
export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  try {
    const incoming = ((await request.json()) ?? {}) as Partial<SiteSettings>;

    const settings: SiteSettings = {
      ...DEFAULT_SETTINGS,
      ...incoming,
      maxItemsPerPage:
        typeof incoming.maxItemsPerPage === 'number'
          ? incoming.maxItemsPerPage
          : DEFAULT_SETTINGS.maxItemsPerPage
    };
    
    // Validate required fields
    if (!settings.siteName) {
      return NextResponse.json({ error: 'Site name is required' }, { status: 400 });
    }

    if (typeof settings.siteName !== 'string' || typeof settings.siteDescription !== 'string') {
      return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400 });
    }

    settings.siteName = settings.siteName.trim().slice(0, 150);
    settings.siteDescription = settings.siteDescription.trim().slice(0, 300);
    settings.heroNote = settings.heroNote ? String(settings.heroNote).slice(0, 200) : undefined;
    settings.primaryCta = settings.primaryCta ? String(settings.primaryCta).slice(0, 100) : undefined;
    
    await redis.set(REDIS_SETTINGS_KEY, settings);
    await setUpdatedAt(REDIS_SETTINGS_KEY);
    return NextResponse.json({ message: 'Settings saved successfully' }, { status: 200 });
  } catch (error) {
    console.error("🔥 POST /api/admin/settings failed:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Bad Request: Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error saving data' }, { status: 500 });
  }
} 
