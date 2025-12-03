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

export const defaultContactData: Contact = {
  email: 'vetcaresyria@scs-net.org',
  emailSecondary: 'vetcaresyria@gmail.com',
  phone: '00963-11-5852338',
  phoneAlt: '00963-11-5852339',
  fax: '00963-11-5852340',
  location:
    'Syria, Damascus suburb, Adra industrial city, chemical zone, building No 710',
  poBox: '8446, Damascus, Syria',
  website: 'www.vetcaresyria.com',
  linkedinUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  twitterUrl: '',
  showContactForm: true,
  emailNotifications: true
};
