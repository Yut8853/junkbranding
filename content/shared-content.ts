// Shared content data for both Refined and Experimental modes
// Content remains identical, only visual design changes between modes

export const modeSelectContent = {
  title: 'あなたに合う見せ方で、Web制作の可能性を。',
  subtitle: '同じ内容を、2つのデザインモードでご覧いただけます。信頼感を重視した洗練モードと、表現力を体験できるトリッキーモードを選択してください。',
  refinedCard: {
    label: 'Refined Mode',
    heading: '信頼感と、静かな表現力を両立。',
    description: '余白、可読性、導線設計を大切にしながら、淡い光の屈折やガラスの質感をアクセントとして加えたデザインです。落ち着いた印象の中に、Web制作の技術感と個性をさりげなく感じられます。',
    cta: '洗練モードで見る',
  },
  experimentalCard: {
    label: 'Experimental Mode',
    heading: '表現力と技術感を体験。',
    description: 'グリッチ、光の屈折、プリズム、WebGL風の抽象表現を使った、印象に残るデザインです。クリエイティブな表現力や技術的な演出を体験できます。',
    cta: 'トリッキーモードで見る',
  },
}

export const heroContent = {
  mainCopy: '伝わるデザインと、成果につながるWeb制作。',
  subCopy: '個人事業主・中小企業向けに、ホームページ制作、LP制作、リニューアル、運用改善まで一貫して対応します。',
  primaryCta: '制作の相談をする',
  secondaryCta: '実績を見る',
}

export const aboutContent = {
  eyebrow: 'About',
  title: '一人ひとりと向き合うものづくり',
  description: '私たちは大きな組織ではありません。だからこそ、一つひとつのプロジェクトに全力で向き合い、クライアントと同じ目線で、一緒に考え、一緒に創ります。',
  points: [
    '丁寧なヒアリング',
    '目的に合わせた設計',
    '公開後の運用まで考えた制作',
  ],
  cta: 'もっと詳しく',
}

export const servicesContent = {
  eyebrow: 'Services',
  title: '私たちにできること',
  items: [
    {
      id: 'homepage',
      title: 'ホームページ制作',
      titleEn: 'Corporate Website',
      description: '企業・事業の顔となるホームページを、目的とターゲットに合わせて設計・制作します。',
    },
    {
      id: 'lp',
      title: 'ランディングページ制作',
      titleEn: 'Landing Page',
      description: 'コンバージョンを意識した、成果につながるLPを制作します。',
    },
    {
      id: 'renewal',
      title: 'Webサイトリニューアル',
      titleEn: 'Website Renewal',
      description: '既存サイトの課題を分析し、デザイン・構成・導線を改善します。',
    },
    {
      id: 'cms',
      title: 'WordPress / CMS構築',
      titleEn: 'CMS Development',
      description: '更新しやすいサイト運用のためのCMS構築を行います。',
    },
    {
      id: 'seo',
      title: 'SEOを意識した基本設計',
      titleEn: 'SEO Foundation',
      description: '検索エンジンに評価されやすい設計と、適切な内部対策を行います。',
    },
    {
      id: 'support',
      title: '保守・運用サポート',
      titleEn: 'Maintenance',
      description: '公開後の更新作業、セキュリティ対策、改善提案まで対応します。',
    },
  ],
}

export const worksContent = {
  eyebrow: 'Works',
  title: '制作実績',
  description: 'クライアントと共に創り上げたプロジェクトの一部をご紹介します。',
  items: [
    {
      id: 'corporate',
      label: 'Corporate Site',
      type: 'コーポレートサイト',
    },
    {
      id: 'landing',
      label: 'Landing Page',
      type: 'ランディングページ',
    },
    {
      id: 'brand',
      label: 'Brand Website',
      type: 'ブランドサイト',
    },
    {
      id: 'service',
      label: 'Service Site',
      type: 'サービスサイト',
    },
  ],
  cta: '実績を見る',
}

export const processContent = {
  eyebrow: 'Process',
  title: '制作の流れ',
  steps: [
    {
      num: '01',
      title: 'お問い合わせ',
      titleEn: 'Contact',
      description: 'まずはお気軽にご相談ください。',
    },
    {
      num: '02',
      title: 'ヒアリング',
      titleEn: 'Hearing',
      description: '目的、ターゲット、ご予算などを詳しくお聞きします。',
    },
    {
      num: '03',
      title: '構成・デザイン提案',
      titleEn: 'Proposal',
      description: 'サイト構成とデザイン案をご提案します。',
    },
    {
      num: '04',
      title: '実装',
      titleEn: 'Development',
      description: '承認いただいたデザインをもとに実装します。',
    },
    {
      num: '05',
      title: '確認・修正',
      titleEn: 'Review',
      description: 'テスト環境でご確認いただき、修正を行います。',
    },
    {
      num: '06',
      title: '公開・運用サポート',
      titleEn: 'Launch',
      description: '公開後も継続的にサポートします。',
    },
  ],
}

export const strengthContent = {
  eyebrow: 'Strength',
  title: '私たちの強み',
  items: [
    {
      id: 'strategy',
      title: '目的から逆算した設計',
      description: '「何のためのサイトか」を明確にし、ゴールから逆算して設計します。',
    },
    {
      id: 'ux',
      title: '見た目だけでなく導線を重視',
      description: 'デザイン性と同時に、ユーザーが迷わない導線設計を大切にします。',
    },
    {
      id: 'communication',
      title: '小規模事業者にもわかりやすい進行',
      description: '専門用語を使わず、丁寧にご説明しながら進めます。',
    },
    {
      id: 'performance',
      title: 'スマホ表示と表示速度への配慮',
      description: 'モバイルファーストで、快適な閲覧体験を提供します。',
    },
    {
      id: 'followup',
      title: '公開後の改善も相談可能',
      description: '運用中の改善提案やアクセス解析のご相談にも対応します。',
    },
  ],
}

export const contactContent = {
  eyebrow: 'Contact',
  title: 'まずは、今のWebサイトのお悩みからご相談ください。',
  description: '新規制作、リニューアル、LP制作、運用改善まで、目的やご予算に合わせて最適な形をご提案します。まだ内容が固まっていない段階でも、お気軽にご相談ください。',
  cta: 'まずは無料で相談する',
}
