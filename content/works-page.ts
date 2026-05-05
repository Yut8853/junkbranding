import type { PortfolioWork } from '@/types/works-page'

export const works = [
  {
    id: 1,
    title: 'JunkBranding',
    category: 'ポートフォリオサイト',
    description: '自身のクリエイティブと思想を表現するポートフォリオサイト。WebGLやアニメーションを活用し、ブランド体験としてのサイト設計を行いました。第一印象で世界観を伝えながら、サービス理解と問い合わせ導線まで自然につながる構成を目指しています。',
    role: '企画 / 情報設計 / UIデザイン / フロントエンド実装',
    scope: 'ブランドコンセプト整理、トップページ設計、下層ページ設計、アニメーション演出、SEO基盤、問い合わせ導線',
    outcome: '制作思想・対応領域・実績を一つの体験として見せ、相談前の期待値を高めるポートフォリオへ刷新。',
    highlights: [
      'スクロールに連動したテキスト演出で、ブランドの記憶に残る入口を設計',
      'サービス、料金、実績、問い合わせまで迷わず進めるページ構成',
      'Next.js App Router ベースで、表示速度と運用しやすさを両立',
    ],
    tags: ['Web Design', 'Development', 'Branding', 'Motion'],
    stack: ['Next.js', 'TypeScript', 'Three.js', 'GSAP'],
    url: 'https://junkbranding.com/',
    year: '2026',
  },
  {
    id: 2,
    title: 'TO PLACE',
    category: 'コーポレートサイト',
    description: '不動産会社のコーポレートサイト。信頼感と先進性を両立したデザインで、企業姿勢やサービスの強みが伝わるように情報の優先順位を整理しました。堅実さの中に動きのある表現を加え、閲覧体験に奥行きを持たせています。',
    role: 'Webデザイン / フロントエンド実装 / 演出設計',
    scope: 'トップページ、会社情報、サービス紹介、問い合わせ導線、ビジュアル演出、レスポンシブ対応',
    outcome: '不動産領域に必要な安心感を担保しながら、競合との差別化につながる印象的なサイト体験を構築。',
    highlights: [
      '信頼性を損なわない余白設計と落ち着いたトーンのビジュアル',
      '事業内容と問い合わせ導線が自然につながる情報設計',
      'GSAP を使った控えめなモーションで先進性を演出',
    ],
    tags: ['Web Design', 'Development', 'Corporate', 'Branding'],
    stack: ['HTML', 'CSS', 'JavaScript', 'Three.js', 'GSAP'],
    url: 'https://to-place.co.jp/',
    year: '2024',
  },
  {
    id: 3,
    title: 'LUZ REAL',
    category: 'コーポレートサイト',
    description: '洗練されたビジュアルと使いやすさを追求したコーポレートサイト。ブランドの上質さを保ちながら、ユーザーが必要な情報へスムーズに到達できる導線を設計しました。見た目の美しさだけでなく、問い合わせにつながる分かりやすさも重視しています。',
    role: 'UIデザイン / フロントエンド実装 / ブランディング補助',
    scope: 'サイト構成、ビジュアル設計、ページデザイン、アニメーション実装、スマートフォン最適化',
    outcome: 'ブランドの品位を保ったまま、サービス理解とアクションを促すコーポレートサイトとして整理。',
    highlights: [
      'ファーストビューからブランドイメージが伝わるビジュアル構成',
      'スマートフォンでも読みやすい余白、文字サイズ、導線を調整',
      '過度な装飾を避け、必要な情報が埋もれない演出バランスに調整',
    ],
    tags: ['Web Design', 'Development', 'Corporate', 'UI/UX'],
    stack: ['HTML', 'CSS', 'JavaScript', 'Three.js', 'GSAP'],
    url: 'https://luz-real.com/',
    year: '2025',
  },
] satisfies PortfolioWork[]

export const categories = ['すべて', ...Array.from(new Set(works.map((work) => work.category)))]
