import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { STORAGE_KEYS } from '@/lib/localStorage';
import { DEFAULT_PARTNERS, type Partner } from '@/app/api/admin/partners/route';
import { DEFAULT_PRODUCTS, type Product } from '@/app/api/admin/products/route';
import { DEFAULT_SETTINGS, type SiteSettings } from '@/app/api/admin/settings/route';
import { defaultContactData, type Contact } from '@/app/api/admin/contact/route';
import { getUpdatedAt } from '@/lib/storageMeta';

type DashboardStats = {
  stats: {
    id: string;
    title: string;
    value: string;
    accent: string;
  }[];
  recentUpdates: { section: string; updatedAt: string }[];
  lastUpdated?: string;
};

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toISOString() : '';

export async function GET() {
  try {
    const [partners, products, settings, contact] = await Promise.all([
      redis.get<Partner[]>(STORAGE_KEYS.PARTNERS),
      redis.get<Product[]>(STORAGE_KEYS.PRODUCTS),
      redis.get<SiteSettings>(STORAGE_KEYS.SETTINGS),
      redis.get<Contact>(STORAGE_KEYS.CONTACT)
    ]);

    const partnersList = partners || DEFAULT_PARTNERS;
    const productsList = products || DEFAULT_PRODUCTS;
    const siteSettings = settings || DEFAULT_SETTINGS;
    const contactData = contact || defaultContactData;

    const [partnersUpdatedAt, productsUpdatedAt, contactUpdatedAt, settingsUpdatedAt] =
      await Promise.all([
        getUpdatedAt(STORAGE_KEYS.PARTNERS),
        getUpdatedAt(STORAGE_KEYS.PRODUCTS),
        getUpdatedAt(STORAGE_KEYS.CONTACT),
        getUpdatedAt(STORAGE_KEYS.SETTINGS)
      ]);

    const recent = [
      { section: 'Partners', updatedAt: formatDate(partnersUpdatedAt) },
      { section: 'Products', updatedAt: formatDate(productsUpdatedAt) },
      { section: 'Contact', updatedAt: formatDate(contactUpdatedAt) },
      { section: 'Settings', updatedAt: formatDate(settingsUpdatedAt) }
    ].filter((item) => item.updatedAt);

    const lastUpdatedIso = recent.length
      ? new Date(
          Math.max(
            ...recent.map((r) => new Date(r.updatedAt).getTime())
          )
        ).toISOString()
      : undefined;

    const payload: DashboardStats = {
      stats: [
        {
          id: 'partners',
          title: 'Partners',
          value: partnersList.length.toString(),
          accent: 'bg-emerald-100 text-emerald-800'
        },
        {
          id: 'products',
          title: 'Products',
          value: productsList.length.toString(),
          accent: 'bg-teal-100 text-teal-800'
        },
        {
          id: 'site',
          title: 'Site name',
          value: siteSettings.siteName,
          accent: 'bg-sky-100 text-sky-800'
        },
        {
          id: 'contact',
          title: 'Primary contact',
          value: contactData.email || 'Not set',
          accent: 'bg-amber-100 text-amber-800'
        }
      ],
      recentUpdates: recent,
      lastUpdated: lastUpdatedIso
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error('🔥 GET /api/admin/stats failed:', error);
    return NextResponse.json(
      {
        stats: [],
        recentUpdates: []
      },
      { status: 200 }
    );
  }
}
