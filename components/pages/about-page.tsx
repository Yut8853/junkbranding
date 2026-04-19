'use client'

import Image from 'next/image'
import { ArrowRight, Phone, Heart, Lightbulb, Users, Clock } from 'lucide-react'
import { TextReveal, SectionReveal, LineReveal } from '@/components/text-reveal'
import { MagneticButton } from '@/components/magnetic-button'
import { Footer } from '@/components/footer'

// Team data
const team = [
  {
    name: '木崎 有貴',
    nameEn: 'Yuki Kizaki',
    role: 'Creative Director',
    image: '/images/team/kizaki-yuki.jpg',
    description: 'ブランド戦略の立案からクリエイティブの統括まで一貫して担い、コンセプト設計からアウトプットまでを横断的にディレクション。\n\n「誰に・何を・どう感じてほしいか」という本質的な設計思想を軸に、ブランドの価値を最大化するクリエイティブを追求しています。\n\nこれまでWebサイト、LP、広告、SNSなど幅広い領域に携わり、CTR・CVR・CPAといった成果指標をもとに改善を繰り返すことで、美しさだけでなく"結果につながるデザイン"を実現してきました。\n\nクライアントの「想い」を丁寧に汲み取り、ユーザーに伝わる形へと翻訳することを大切にしています。戦略とロジックに裏打ちされた設計によって、ブランドとユーザーの最適な接点を創出します。\n\nまた、設計意図と成果を構造化し、再現性のあるナレッジとして蓄積することにも注力。チーム全体のクリエイティブ品質向上にも貢献しています。',
  },
  {
    name: 'つかさ',
    nameEn: 'Tsukasa',
    role: 'Art Director & Designer',
    image: '/images/team/tsukasa.jpg',
    description: 'アートディレクター／デザイナーとして、ビジュアルデザインを軸にWebサイトの設計から制作までを一貫して担当。ブランドの世界観や空気感を丁寧に表現し、ユーザーの感情に自然と響くデザインを追求しています。\n\nレイアウト、タイポグラフィ、配色、余白設計といった細部にまで徹底してこだわり、視認性と美しさを高い次元で両立。情報を正しく伝えるだけでなく、「見ていて心地よい」「思わず触れたくなる」体験設計を大切にしています。\n\nコンセプトに基づいたビジュアル設計を行うことで、プロジェクト全体のクオリティを底上げし、ディレクターやエンジニアと密に連携しながら完成度の高いアウトプットへと昇華させます。\n\nトレンドに流されることなく、本質的な美しさと機能性を兼ね備えたデザインを追求し続けています。',
  },
]

// Values
const values = [
  {
    icon: Heart,
    title: 'ちゃんと考える',
    titleEn: 'Think First',
    description: '「とりあえず作る」はやりません。誰に何を伝えるのかを整理してから、デザインに入ります。',
  },
  {
    icon: Lightbulb,
    title: '売れる形にする',
    titleEn: 'Make It Work',
    description: 'かっこいいだけでは終わらせません。どうすればクリックされるか、選ばれるかを考えて作ります。',
  },
  {
    icon: Users,
    title: '一緒に悩む',
    titleEn: 'Be a Partner',
    description: '受け身で作るのではなく、課題から一緒に考えます。必要なら「それ違います」とも言います。',
  },
]

// Process data
const process = [
  {
    step: 1,
    title: 'ヒアリング',
    titleEn: 'Hearing',
    description: 'まずは「なぜ作るのか」を一緒に整理します。',
    fullDescription: 'いきなりデザインには入りません。ここで方向を間違えると、どれだけ綺麗に作っても意味がなくなるからです。事業の状況や課題、「本当は何に困っているのか」を一緒に言葉にしていきます。',
    duration: '約2〜3週間',
    details: [
      { title: '現状の課題整理', desc: '「なんとなくうまくいっていない」を、そのままにしません。曖昧な状態を一つずつ言語化していきます。' },
      { title: 'ターゲットの具体化', desc: '年齢や性別だけでなく、「どんな場面で迷い、何に反応するのか」まで掘り下げます。' },
      { title: '競合の見え方確認', desc: '競合がどう見えているかを、作り手ではなくユーザーの視点で整理します。' },
      { title: 'ゴール設計', desc: '問い合わせなのか、購入なのか。「どこまでいけば成功か」を明確にします。' },
    ],
    note: 'ここを曖昧にしたまま進めることはありません。',
  },
  {
    step: 2,
    title: 'ご提案・お見積り',
    titleEn: 'Proposal',
    description: '「どう作るか」をロジックで組み立てます。',
    fullDescription: 'ヒアリング内容をもとに、構成や導線を設計します。ただ見た目の話ではなく、「なぜこの順番なのか」「なぜこの見せ方なのか」まで含めてご提案します。',
    duration: '約2〜3週間',
    details: [
      { title: 'コンセプト設計', desc: '誰に何をどう伝えるのかを、一枚で説明できる状態まで整理します。' },
      { title: 'サイト構成設計', desc: 'どの順番で情報を見せるかで、印象は大きく変わります。流れを設計します。' },
      { title: '導線設計', desc: 'どこで興味を持ち、どこで離脱し、どこで行動するかを想定します。' },
      { title: '見積もりと範囲明確化', desc: 'あとから「そこまでやるの？」とならないように、範囲を明確にします。' },
    ],
    note: '「なんとなく良さそう」は提案しません。',
  },
  {
    step: 3,
    title: 'デザイン制作',
    titleEn: 'Design',
    description: '意図を持って、見た目に落とし込みます。',
    fullDescription: 'ここで初めてビジュアルを作ります。ただし、感覚だけで作ることはありません。「なぜこのレイアウトなのか」「なぜこの余白なのか」説明できる状態で進めます。',
    duration: '約3〜8週間',
    details: [
      { title: 'ファーストビュー設計', desc: '最初の3秒で「自分に関係ある」と思わせるための設計を徹底します。' },
      { title: '情報の優先順位設計', desc: 'すべてを同じ強さで見せると、何も伝わりません。順番を作ります。' },
      { title: 'トーン＆マナー統一', desc: 'ブランドらしさを崩さないためのルールを細かく整えます。' },
      { title: 'レスポンシブ最適化', desc: '実際の閲覧環境を考え、スマホでの見え方を優先して調整します。' },
    ],
    note: '理由のない装飾は入れません。',
  },
  {
    step: 4,
    title: '開発・実装',
    titleEn: 'Development',
    description: '成果につながる形で実装します。',
    fullDescription: 'デザインをただ再現するだけではなく、表示速度やSEO、運用のしやすさまで考えて構築します。裏側の作りで結果は変わります。',
    duration: '約3〜12週間',
    details: [
      { title: 'フロント実装', desc: '見た目と動きを、意図を崩さず丁寧に再現します。' },
      { title: 'CMS設計', desc: '更新する人が迷わないように、管理画面の構造も設計します。' },
      { title: '表示速度最適化', desc: '遅いだけで離脱されるため、できる限り軽くします。' },
      { title: 'SEO内部設計', desc: '検索エンジンに正しく伝わる構造を整えます。' },
    ],
    note: '作って終わりではなく、その後も使える状態にします。',
  },
  {
    step: 5,
    title: 'テスト・公開',
    titleEn: 'Launch',
    description: '安心して公開できる状態に仕上げます。',
    fullDescription: '公開直前が一番トラブルが起きやすい工程です。細かい部分までチェックし、問題のない状態でリリースします。',
    duration: '約1週間',
    details: [
      { title: '全ページ検証', desc: 'リンク切れや動作不良がないか、すべて確認します。' },
      { title: 'デバイス確認', desc: 'PC・スマホ・主要ブラウザでの見え方をチェックします。' },
      { title: '公開作業', desc: 'ドメインやサーバーの設定まで含めて対応します。' },
      { title: '操作説明', desc: '実際の操作画面を使って、更新方法をご説明します。' },
    ],
    note: 'ここで手を抜くことはありません。',
  },
  {
    step: 6,
    title: '運用サポート',
    titleEn: 'Support',
    description: '公開後からが本番です。',
    fullDescription: 'サイトは公開して終わりではありません。実際の数字を見ながら、「どこを直せばもっと良くなるか」を一緒に考えていきます。',
    duration: '継続的に',
    details: [
      { title: '改善提案', desc: 'データを見ながら、具体的な改善案をご提案します。' },
      { title: '更新サポート', desc: '必要に応じて更新作業も対応します。' },
      { title: 'データ分析', desc: 'どこで離脱しているか、どこが見られているかを可視化します。' },
      { title: '保守対応', desc: '万が一のトラブルにも対応します。' },
    ],
    note: '「公開したのに成果が出ない」を放置しません。',
  },
]

export default function AboutPageClient() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70svh] sm:min-h-[80svh] flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 py-24 sm:py-32 text-center">
          <LineReveal delay={0}>
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-4 sm:mb-6">
              About Us
            </p>
          </LineReveal>
          <TextReveal
            text="私たちについて"
            as="h1"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight mb-6 sm:mb-8"
            delay={0.2}
            gradient
          />
          <LineReveal delay={0.6}>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
              2人だけの小さなスタジオだからこそ、できることがあります。
            </p>
          </LineReveal>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-24 sm:py-32 md:py-48 glass-light">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
            <div>
              <TextReveal
                text="大手にはできない、"
                as="h2"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
                delay={0}
              />
              <TextReveal
                text="丁寧なものづくり"
                as="h2"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight"
                delay={0.3}
                gradient
              />
              <div className="space-y-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
                <SectionReveal delay={0.6}>
                  <p className="text-pretty">
                    JunkBrandingは、茨城・東京・千葉を中心に活動する、2人だけのブランディング&Web制作スタジオです。
                  </p>
                </SectionReveal>
                <SectionReveal delay={0.7}>
                  <p className="text-pretty">
                    大きな組織では難しい「一人ひとりと向き合う」ことを大切に、クライアントと同じ目線で、一緒に考え、一緒に創ります。
                  </p>
                </SectionReveal>
                <SectionReveal delay={0.8}>
                  <p className="text-pretty">
                    「ちょっとした相談」から「本格的なリブランディング」まで、まずはお気軽にお声がけください。
                  </p>
                </SectionReveal>
              </div>
            </div>

            <SectionReveal delay={0.4}>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border group">
                <Image
                  src="/images/studio.jpg"
                  alt="JunkBranding Studio - クリエイティブスタジオのワークスペース"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-sm sm:text-base font-medium text-foreground/90 animate-gradient-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent">
                    JunkBranding Studio
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 sm:py-32 md:py-48 glass-card">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-16 sm:mb-20 md:mb-32">
            <LineReveal delay={0}>
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-4 sm:mb-6">
                Team
              </p>
            </LineReveal>
            <TextReveal
              text="チームメンバー"
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              delay={0.2}
              gradient
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <SectionReveal key={member.name} delay={0.3 + index * 0.15}>
                <div className="group">
                  <div className="relative aspect-[3/4] mb-6 sm:mb-8 rounded-2xl overflow-hidden bg-card border border-border">
                    <Image
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-105 filter grayscale-[30%] group-hover:grayscale-0"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                    {/* Animated gradient overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
                    {/* Name overlay with gradient animation */}
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                      <p className="text-xs sm:text-sm text-foreground/70 mb-1">{member.role}</p>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold animate-gradient-text bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] bg-clip-text text-transparent">
                        {member.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-foreground/60 mt-1">{member.nameEn}</p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {member.description}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 sm:py-32 md:py-48 glass-light">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-16 sm:mb-20 md:mb-32">
            <LineReveal delay={0}>
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-4 sm:mb-6">
                Values
              </p>
            </LineReveal>
            <TextReveal
              text="大切にしていること"
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              delay={0.2}
              gradient
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            {values.map((value, index) => (
              <SectionReveal key={value.title} delay={0.3 + index * 0.1}>
                <div className="group text-center p-6 sm:p-8 md:p-10 rounded-2xl bg-background border border-border hover:border-accent/30 transition-all duration-500">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                    <value.icon className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
                    {value.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-accent mb-3 md:mb-4">
                    {value.titleEn}
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 sm:py-32 md:py-48 glass-card">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-12 md:mb-32">
            <LineReveal delay={0}>
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-4 md:mb-6">
                Process
              </p>
            </LineReveal>
            <TextReveal
              text="制作の流れ"
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 md:mb-8"
              delay={0.2}
              gradient
            />
            <SectionReveal delay={0.5}>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                お問い合わせから公開、そしてその後まで。
                私たちがどのようにプロジェクトを進めていくのか、6つのステップでご紹介します。
              </p>
            </SectionReveal>
          </div>

          <div className="max-w-5xl mx-auto space-y-10 md:space-y-24">
            {process.map((item, index) => (
              <SectionReveal key={item.step} delay={0.1 + index * 0.08}>
                <div className="group relative">
                  {/* Step Header */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-6 md:mb-8">
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-background border-2 border-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shrink-0">
                        <span className="text-xl md:text-3xl font-bold">{item.step}</span>
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">
                          {item.titleEn}
                        </p>
                      </div>
                    </div>
                    <div className="md:ml-auto flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 rounded-full w-fit">
                      <Clock size={14} className="text-primary md:w-4 md:h-4" />
                      <span className="text-xs sm:text-sm font-medium text-primary">{item.duration}</span>
                    </div>
                  </div>
                  
                  {/* Content Card */}
                  <div className="ml-0 md:ml-28 p-6 sm:p-8 md:p-10 rounded-2xl bg-background border border-border group-hover:border-primary/30 transition-all duration-500">
                    {/* Short Description */}
                    <p className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed mb-4 md:mb-6">
                      {item.description}
                    </p>
                    
                    {/* Full Description */}
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 md:mb-10">
                      {item.fullDescription}
                    </p>
                    
                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                      {item.details.map((detail, i) => (
                        <div 
                          key={detail.title} 
                          className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-card/50 border border-border/50"
                        >
                          <div className="shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                            <span className="text-xs md:text-sm font-bold text-primary">{i + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-base font-bold mb-1 whitespace-nowrap">{detail.title}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground text-pretty">{detail.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Note */}
                    <p className="text-xs sm:text-sm text-primary bg-primary/5 px-3 py-2 md:px-4 md:py-3 rounded-lg border border-primary/20">
                      {item.note}
                    </p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
          
          {/* Process CTA */}
          <SectionReveal delay={0.3}>
            <div className="text-center mt-16 md:mt-24">
              <p className="text-base sm:text-lg text-muted-foreground mb-6 md:mb-8">
                ご不明点があれば、お気軽にお問い合わせください
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <MagneticButton
                  href="/contact"
                  className="group w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background rounded-full font-medium btn-gradient-hover transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-3">
                    お問い合わせ
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </MagneticButton>
                <a 
                  href="tel:08091550426"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background rounded-full font-medium btn-gradient-hover transition-all duration-300"
                >
                  <Phone size={18} />
                  <span>080-9155-0426</span>
                </a>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 md:py-48 glass-light">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 text-center">
          <TextReveal
            text="一緒に、"
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            delay={0}
          />
          <TextReveal
            text="つくりませんか？"
            as="span"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 sm:mb-8 block"
            delay={0.3}
            gradient
          />
          <SectionReveal delay={0.6}>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed text-balance">
              私たちは、あなたのビジネスの成長を本気で応援します。まずは気軽にお話しさせてください。
            </p>
          </SectionReveal>

          <SectionReveal delay={0.8}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <MagneticButton
                href="/contact"
                className="group w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background rounded-full font-medium btn-gradient-hover transition-all duration-300"
                data-cursor="Contact"
              >
                <span className="flex items-center justify-center gap-3">
                  お問い合わせフォーム
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </MagneticButton>
              
              <a 
                href="tel:08091550426"
                className="group flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background rounded-full font-medium btn-gradient-hover transition-all duration-300"
              >
                <Phone size={18} />
                <span>080-9155-0426</span>
              </a>
            </div>
          </SectionReveal>
        </div>
      </section>

      <Footer />
    </>
  )
}
