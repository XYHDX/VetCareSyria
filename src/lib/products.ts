import { partners as partnerSeeds } from '@/data/partners';

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
