export type NavLink = { href: string; label: string };

export const navLinks: NavLink[] = [
  { href: '/#home', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#products', label: 'Our partners' },
  { href: '/#contact', label: 'Contact' },
];

export const getNavLinks = (isArabic: boolean): NavLink[] => {
  if (!isArabic) return navLinks;
  return [
    { href: '/#home', label: 'الرئيسية' },
    { href: '/#about', label: 'من نحن' },
    { href: '/#products', label: 'شركاؤنا' },
    { href: '/#contact', label: 'تواصل معنا' },
  ];
};
