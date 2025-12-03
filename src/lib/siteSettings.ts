export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteLanguage: string;
  heroNote?: string;
  primaryCta?: string;
  customTheme?: string;
  maxItemsPerPage: number;
  analyticsId?: string;
  customCss?: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'VetcareSyria',
  siteDescription: 'Trusted veterinary medicines, vaccines, and feed additives.',
  heroNote: 'Since 2005 • Damascus, Syria',
  primaryCta: 'Contact us',
  siteLanguage: 'en',
  customTheme: 'default',
  maxItemsPerPage: 10
};
