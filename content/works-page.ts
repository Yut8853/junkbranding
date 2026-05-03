import type { PortfolioWork } from '@/types/works-page'

export const works = [
  {
    id: 1,
    title: 'JunkBranding',
    category: 'ポートフォリオサイト',
    description: '自身のクリエイティブと思想を表現するポートフォリオサイト。WebGLやアニメーションを活用し、ブランド体験としてのサイト設計を行いました。',
    tags: ['Web Design', 'Development', 'Branding'],
    stack: ['Next.js', 'TypeScript', 'Three.js', 'GSAP'],
    url: 'https://junkbranding.com/',
    year: '2026',
  },
  {
    id: 2,
    title: 'TO PLACE',
    category: 'コーポレートサイト',
    description: '不動産会社のコーポレートサイト。信頼感と先進性を両立したデザイン。',
    tags: ['Web Design', 'Development', 'Branding'],
    stack: ['Three.js', 'GSAP'],
    url: 'https://to-place.co.jp/',
    year: '2024',
  },
  {
    id: 3,
    title: 'LUZ REAL',
    category: 'コーポレートサイト',
    description: '洗練されたビジュアルと使いやすさを追求したコーポレートサイト。',
    tags: ['Web Design', 'Development', 'Branding'],
    stack: ['Three.js', 'GSAP'],
    url: 'https://luz-real.com/',
    year: '2025',
  },
] satisfies PortfolioWork[]

export const categories = ['すべて', ...Array.from(new Set(works.map((work) => work.category)))]
