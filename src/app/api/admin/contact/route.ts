import { redis } from '@/lib/redis'; // Import the shared Redis client
import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name
import { setUpdatedAt } from '@/lib/storageMeta';
import { requireAdmin } from '@/lib/adminAuth';

// Contact interface
export interface Contact {
  email: string;
  emailSecondary?: string;
  phone?: string;
  phoneAlt?: string;
  fax?: string;
  location?: string;
  poBox?: string;
  website?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  showContactForm: boolean;
  emailNotifications: boolean;
}

const REDIS_CONTACT_KEY = STORAGE_KEYS.CONTACT;

// Default contact data to use when missing
export const defaultContactData = {
  email: 'vetcaresyria@scs-net.org',
  emailSecondary: 'vetcaresyria@gmail.com',
  phone: '00963-11-5852338',
  phoneAlt: '00963-11-5852339',
  fax: '00963-11-5852340',
  location: 'Syria, Damascus suburb, Adra industrial city, chemical zone, building No 710',
  poBox: '8446, Damascus, Syria',
  website: 'www.vetcaresyria.com',
  linkedinUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  showContactForm: true,
  emailNotifications: true
};

// GET Handler: Fetch contact data from Redis
export async function GET() {
  try {
    const contact = await redis.get<Contact>(REDIS_CONTACT_KEY);

    if (!contact || !contact.email) {
      return NextResponse.json(defaultContactData);
    }

    // Fill in any missing fields with defaults
    const completeContact = {
      email: contact.email || defaultContactData.email,
      emailSecondary: contact.emailSecondary || defaultContactData.emailSecondary,
      phone: contact.phone || defaultContactData.phone,
      phoneAlt: contact.phoneAlt || defaultContactData.phoneAlt,
      fax: contact.fax || defaultContactData.fax,
      poBox: contact.poBox || defaultContactData.poBox,
      website: contact.website || defaultContactData.website,
      location: contact.location || defaultContactData.location,
      linkedinUrl: contact.linkedinUrl || defaultContactData.linkedinUrl,
      facebookUrl: contact.facebookUrl || defaultContactData.facebookUrl,
      instagramUrl: contact.instagramUrl || defaultContactData.instagramUrl,
      showContactForm: typeof contact.showContactForm === 'boolean' ? contact.showContactForm : true,
      emailNotifications: typeof contact.emailNotifications === 'boolean' ? contact.emailNotifications : true
    };

    return NextResponse.json(completeContact);
  } catch (error) {
    console.error('🔥 GET /api/admin/contact failed:', error);
    return NextResponse.json(defaultContactData);
  }
}

// POST Handler: Save contact data to Redis
export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth) return auth;

  try {
    const contact: Contact = await request.json();
    
    // Validate required fields
    if (!contact.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const sanitize = (value?: string, max = 200) =>
      typeof value === 'string' ? value.trim().slice(0, max) : undefined;

    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(contact.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Ensure all boolean fields are properly set
    const sanitizedContact = {
      ...contact,
      email: contact.email.trim().toLowerCase(),
      emailSecondary: sanitize(contact.emailSecondary),
      phone: sanitize(contact.phone),
      phoneAlt: sanitize(contact.phoneAlt),
      fax: sanitize(contact.fax),
      website: sanitize(contact.website),
      location: sanitize(contact.location, 400) || defaultContactData.location,
      poBox: sanitize(contact.poBox) || defaultContactData.poBox,
      linkedinUrl: sanitize(contact.linkedinUrl),
      facebookUrl: sanitize(contact.facebookUrl),
      instagramUrl: sanitize(contact.instagramUrl),
      showContactForm: typeof contact.showContactForm === 'boolean' ? contact.showContactForm : true,
      emailNotifications: typeof contact.emailNotifications === 'boolean' ? contact.emailNotifications : true
    };

    // Save to Redis
    await redis.set(REDIS_CONTACT_KEY, sanitizedContact);
    await setUpdatedAt(REDIS_CONTACT_KEY);

    // Also log for debugging
    console.log('Saving contact data to Redis:', sanitizedContact);

    return NextResponse.json({ message: 'Contact information saved successfully' }, { status: 200 });
  } catch (error) {
    console.error("🔥 POST /api/admin/contact failed:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Bad Request: Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error saving data' }, { status: 500 });
  }
} 
