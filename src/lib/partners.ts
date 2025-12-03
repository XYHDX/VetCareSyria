import { partners as seedPartners } from '@/data/partners';

export type Partner = {
  id: string;
  name: string;
  website?: string;
  logo?: string;
};

export const DEFAULT_PARTNERS: Partner[] = seedPartners.map((p) => ({
  id: p.id,
  name: p.name,
  website: p.website,
  logo: p.logo
}));
