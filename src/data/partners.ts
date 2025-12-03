export type Partner = {
  id: string;
  name: string;
  website?: string;
  logo?: string;
  products: string[];
};

export const partners: Partner[] = [
  {
    id: 'zenex',
    name: 'Zenex',
    website: 'https://zenexah.com',
    logo: '/images/partners/zenex.png',
    products: ['Stresroak premix', 'Stresroak liquid', 'Superliv liquid', 'AyucalD premix', 'Ayucal liquid']
  },
  {
    id: 'anpario',
    name: 'Anpario',
    website: 'https://www.anpario.com',
    logo: '/images/partners/anpario.png',
    products: ['Anpro UB', 'Anpro', 'Salgard liquid', 'Genex poultry', 'Zetox', 'Orego stim powder', 'Orego stim liquid']
  },
  {
    id: 'boehringer-ingelheim',
    name: 'Boehringer Ingelheim',
    website: 'https://www.boehringer-ingelheim.com/animal-health',
    logo: '/images/partners/bi.png',
    products: [
      'BEST AI+ ND',
      'Bioluze',
      'VOLVAC ND LASOTA MLV',
      'Vaxx HVT+ IBD',
      'Volvac ND+IB+EDS KV',
      'Bar Vac 10',
      'Volvac ND coc',
      'Volvac IBD MLV GUMBORO',
      'Diftosec',
      'Gallivac IB88 NEO (DS 1000)',
      'Gallivac IB88 NEO (DS 2000)',
      'Bioral H120 NEO',
      'Avinew NEO',
      'Gallivac IBD S706 NEO',
      'IMopest',
      'Gallimune H9+ND',
      'Gallimune 201'
    ]
  },
  {
    id: 'sanzyme',
    name: 'Sanzyme',
    logo: '/images/partners/sanzyme.png',
    products: ['Sporich Total 8B', 'Prome Max 8B']
  },
  {
    id: 'alestesharia',
    name: 'Alestesharia for Poultry & Feed',
    website: 'https://www.alestesharia.com.jo',
    logo: '/images/partners/alestesharia.png',
    products: ['Layer Production Premix 1.5%', 'Breeder Production Premix', 'Broiler Starter Premix', 'Broiler Grower Premix 2.5%']
  },
  {
    id: 'vemo',
    name: 'Vemo',
    website: 'https://vemo-feedadditives.com/en',
    logo: '/images/partners/vemo.png',
    products: ['Vemozyme P', 'Vemozyme R', 'Vemozyme 50F', 'Vemozyme 50', 'Vemozyme F5000 NTP']
  }
];
