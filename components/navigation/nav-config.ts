import type { NavItem } from '@/types/navigation'

export const navItems: NavItem[] = [
  { href: '/', label: 'Home', labelJa: 'トップ', num: '01' },
  { href: '/about', label: 'About', labelJa: '私たちについて', num: '02' },
  { href: '/works', label: 'Works', labelJa: '実績', num: '03' },
  { href: '/pricing', label: 'Pricing', labelJa: '料金', num: '04' },
  { href: '/contact', label: 'Contact', labelJa: 'お問い合わせ', num: '05' },
]

// Rainbow colors for menu items
export const rainbowColors = [
  'hsl(350, 65%, 72%)',
  'hsl(30, 70%, 72%)',
  'hsl(60, 65%, 70%)',
  'hsl(150, 50%, 65%)',
  'hsl(200, 60%, 72%)',
]
