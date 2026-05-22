import type { CurrentProject, PortfolioWork } from '@/types/works-page'

export const currentProjects = [
  {
    id: 1,
    title: 'DirecOS',
    category: '案件起点型ディレクション管理SaaS',
    status: 'In Progress',
    description:
      '案件ごとに散らばる情報を整理し、今の状態・新着・詰まり・次アクションを把握できるようにする、Web制作ディレクター向けの業務支援プロダクト。進行管理を機能単位ではなく案件単位で捉え直し、全体像と次の打ち手がすぐ見える設計を目指しています。',
    targetUser: 'Web制作ディレクター',
    focus: '現在の中心案件: 三鷹第一クリニック リニューアル',
    entryFlow: '案件一覧 → 案件トップ → 各機能詳細',
    principle: '機能起点ではなく、1つの案件を中心に業務が派生する',
    displayPolicy:
      '文字量を減らし、数字・短いラベル・タブ・折りたたみ・右ドックで視認性を上げる',
    updatedAt: '2026-05-17',
  },
] satisfies CurrentProject[]

export const works = [
  {
    id: 1,
    title: 'JunkBranding',
    category: 'ポートフォリオサイト',
    ownerType: 'owned',
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
    ownerType: 'client',
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
    ownerType: 'client',
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
{
  id: 4,
  title: 'NEXT',
  category: 'コーポレートサイト',
  ownerType: 'client',
  description:
    '３日間での制作を前提に、ブランドの印象を損なわず、視覚的な上質さと情報の分かりやすさを両立したコーポレートサイト。限られた時間の中でも、ファーストビューの印象設計、スマートフォンでの見やすさ、問い合わせにつながる導線設計を意識して構築しました。',
  role: 'UIデザイン / フロントエンド実装 / ブランディング補助',
  scope:
    'サイト構成、ビジュアル設計、ページデザイン、アニメーション実装、スマートフォン最適化',
  outcome:
    '3日という短い制作期間の中で、ブランドの品位を保ちながら、サービス理解とアクションを促すコーポレートサイトとして整理。',
  highlights: [
    '短期間でもブランドイメージが伝わるファーストビューを設計',
    'スマートフォンでも読みやすい余白、文字サイズ、導線を調整',
    '過度な装飾を避け、必要な情報が埋もれない演出バランスに調整',
    '1日制作を前提に、優先度を絞ってデザインと実装を効率的に進行',
  ],
  tags: ['Web Design', 'Development', 'Corporate', 'UI/UX'],
  stack: ['HTML', 'CSS', 'JavaScript', 'Three.js', 'GSAP'],
  url: 'https://next-inc.group/',
  year: '2026',
},
{
  id: 5,
  title: 'JUNK BRANDING LAB',
  category: 'メディアサイト',
  ownerType: 'owned',
  description:
    'フロントエンド表現の実装知見を記事として蓄積するクリエイティブ開発ブログ。スクロール演出、UIアニメーション、ページ遷移、3D・WebGL寄りの表現までをカテゴリ設計し、記事一覧から技術を探しやすい構成に整理しました。Next.js をベースに、記事はマークダウン運用を前提として更新しやすい設計にしています。',
  role: '企画 / 情報設計 / UIデザイン / フロントエンド実装 / コンテンツ設計',
  scope:
    '技術ブログの情報設計、一覧・詳細ページ設計、カテゴリ導線設計、記事運用設計、コードプレビュー体験、SEO基盤',
  outcome:
    '表現サンプルを単発の実装で終わらせず、検索性と再利用性のあるナレッジアーカイブとして育てられる技術メディアを構築。',
  highlights: [
    'スクロール連動、テキスト演出、ページ遷移、3D・WebGL寄りなど表現別に探せるカテゴリ設計',
    '記事一覧、人気記事、関連記事をつなぎ、回遊しながら実装知見を読めるメディア体験',
    'Next.js ベースで構築し、記事コンテンツはマークダウン運用を前提に更新効率を最適化',
  ],
  tags: ['Creative Dev', 'Media', 'Next.js', 'Markdown'],
  stack: ['Next.js', 'TypeScript', 'Markdown', 'GSAP'],
  url: 'https://lab.junkbranding.com/',
  year: '2026',
},
{
  id: 6,
  title: 'JUNK PIZZA',
  category: 'コンセプトサイト',
  ownerType: 'owned',
  description:
    '薪窯ピッツァレストランを想定したコンセプトサイト。炎や熱量を想起させるビジュアルと、没入感のあるスクロール体験で店舗の世界観を伝えることを重視しました。料理紹介だけでなく、職人、窯、空間演出まで含めてブランド体験として見せる構成です。',
  role: 'コンセプト設計 / UIデザイン / フロントエンド実装 / 演出設計',
  scope:
    'ブランドトーン設計、ヒーロー演出、メニュー紹介、ストーリー構成、レスポンシブ最適化、インタラクション実装',
  outcome:
    '飲食店サイトの情報訴求に加え、視覚演出そのものが来店動機につながるサンプルケースとして成立するデモサイトを制作。',
  highlights: [
    '薪窯の熱量を想起させるビジュアルとタイポグラフィでファーストビューを設計',
    'スクロールに合わせて空気感が変わる構成で、店舗体験を疑似的に伝達',
    'WebGL と Next.js を組み合わせ、印象的な演出と実装基盤を両立したサンプルとして設計',
  ],
  tags: ['Concept', 'Restaurant', 'WebGL', 'Next.js'],
  stack: ['Next.js', 'TypeScript', 'WebGL', 'GSAP'],
  url: 'https://pizza.junkbranding.com/',
  year: '2026',
}
] satisfies PortfolioWork[]

export const categories = ['すべて', ...Array.from(new Set(works.map((work) => work.category)))]
