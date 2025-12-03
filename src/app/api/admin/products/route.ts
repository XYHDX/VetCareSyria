import { redis } from '@/lib/redis';
import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_KEYS } from '@/lib/localStorage';
import { v4 as uuid } from 'uuid';
import { partners as partnerSeeds } from '@/data/partners';
import { setUpdatedAt } from '@/lib/storageMeta';
import { requireAdmin } from '@/lib/adminAuth';

export interface Product {
  id: string;
  name: string;
  partner: string;
  category?: string;
  description?: string;
  origin?: string;
  status?: 'available' | 'out-of-stock' | 'coming-soon';
}

export const DEFAULT_PRODUCTS: Product[] = partnerSeeds.flatMap((partner) =>
  partner.products.map((product, idx) => ({
    id: `${partner.id}-${idx}`,
    name: product,
    partner: partner.name,
    category: undefined,
    description: '',
    origin: partner.website,
    status: 'available' as const
  }))
);

const PRODUCTS_KEY = STORAGE_KEYS.PRODUCTS;

export async function GET() {
  try {
    const products = (await redis.get<Product[]>(PRODUCTS_KEY)) || DEFAULT_PRODUCTS;
    return NextResponse.json(products);
  } catch (error) {
    console.error('🔥 GET /api/admin/products failed:', error);
    return NextResponse.json(DEFAULT_PRODUCTS, { status: 200 });
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

    const sanitized = payload.map((p) => ({
      ...p,
      id: typeof p.id === 'string' && p.id.trim() ? p.id : uuid(),
      name: typeof p.name === 'string' ? p.name.trim() : 'Product',
      partner: typeof p.partner === 'string' && p.partner.trim() ? p.partner : 'Partner',
      status: p.status === 'out-of-stock' || p.status === 'coming-soon' ? p.status : 'available',
      origin: typeof p.origin === 'string' ? p.origin.slice(0, 200) : undefined,
      description: typeof p.description === 'string' ? p.description.slice(0, 500) : undefined,
      category: typeof p.category === 'string' ? p.category.slice(0, 100) : undefined
    }));

    await redis.set(PRODUCTS_KEY, sanitized);
    await setUpdatedAt(PRODUCTS_KEY);
    return NextResponse.json({ message: 'Products saved' });
  } catch (error) {
    console.error('🔥 POST /api/admin/products failed:', error);
    return NextResponse.json({ error: 'Unable to save products' }, { status: 500 });
  }
}
