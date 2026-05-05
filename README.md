# JunkBranding 開発メモ

JunkBrandingは、茨城・東京・神奈川を中心に活動する小規模ブランディング/Web制作スタジオのサイト。  
ブランドの「らしさ」を、Web・言葉・ビジュアル・動きで伝える。

## 技術スタック

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- GSAP / ScrollTrigger
- Lenis
- Resend
- Vercel Analytics
- pnpm

## 開発コマンド

```bash
pnpm install
pnpm dev
```

```bash
pnpm build
pnpm start
```

```bash
pnpm lint
pnpm exec tsc --noEmit
```

## 環境変数

問い合わせフォームのメール送信にResendを使う。

```env
RESEND_API_KEY=your_resend_api_key
```

`actions/contact.ts` で参照。ローカルで問い合わせ送信まで確認する場合は `.env.local` に設定。

## サイト仕様

### ページ

- `/`: TOP
- `/about`: スタジオ紹介
- `/works`: 制作実績
- `/pricing`: 料金
- `/contact`: 問い合わせ
- `/privacy`: プライバシーポリシー
- `/sitemap.xml`: Next標準サイトマップ
- `/search-console-sitemap.xml`: Search Console提出用XMLサイトマップ
- `/llms.txt`: AI/LLM向けサイト説明

### TOP

PCでは反転スクロールのステージ構成。最下層のHEROから始まり、スクロールに応じて上方向のセクションへ進む。

HEROにはPC限定で2枚のパララックス写真を表示。写真はゴミ素材で作った `J` と `B` の文字で、JunkBrandingの「価値がなさそうなものをブランドとして見える形にする」コンセプトを表す。

SPでは通常の縦積みレイアウトにし、重い背景演出やCanvas処理は抑える。

### ナビゲーション

ナビゲーションは `components/navigation/` に集約。

- `navigation.tsx`: ヘッダー、問い合わせ導線、ハンバーガー制御
- `navigation-menu-overlay.tsx`: 全画面メニュー
- `menu-heat-haze-background.tsx`: WebGLのヒートヘイズ背景
- `use-header-intro-animation.ts`: ロード後のリンク吸い込み演出
- `use-menu-assemble-animation.ts`: メニュー組み上げ進捗
- `nav-config.ts`: メニュー項目と色

内部リンクは基本的に `TransitionLink` を使う。外部リンク、`tel:`、修飾キー付きクリックは通常遷移のまま。

### 音声

背景音楽は `contexts/audio-context.tsx` で管理。

- 音源: `public/audio/128_BPM124.mp3`
- 最大音量: `MAX_VOLUME`
- ユーザー選択: `localStorage`
- 音源再生に失敗した場合: Web Audioで生成音へフォールバック

ロード画面で音あり/無音を選び、選択後にサイトへ入る。

### 問い合わせフォーム

- 送信処理: `actions/contact.ts`
- 入力検証: `lib/schema.ts`
- フォーム状態: `components/pages/contact/use-contact-form.ts`
- 選択肢データ: `content/contact-page.ts`

honeypot、3秒未満送信のbot判定、IPベースの簡易レート制限を入れている。入力エラーは `aria-invalid`、`aria-describedby`、`role="alert"` で伝える。

## デザイン仕様

### トーン

小さなスタジオらしい丁寧さ、余白、軽さを大事にする。淡いグラス表現と虹色グラデーションを基調にする。

黒ベタのボタンは避け、CTAは基本的に `.cta-primary` / `.cta-secondary` を使う。

### フォント

- 日本語/本文: `Noto Sans JP`
- 英字ディスプレイ: `Barlow Condensed`

フォントは `app/layout.tsx` で `next/font/google` から読み込み、CSS変数へ渡す。

### 色と装飾

- アクセント: ピンク、コーラル、イエロー、グリーン、ブルー、パープルの虹色
- グラデーション枠: `.rainbow-border`
- 半透明カード: `.glass-card` / `.glass-light`
- CTA: `.cta-primary` / `.cta-secondary`
- ファビコン: `app/icon.svg` の文字なし虹色アイコン
- OGP: `public/ogp.jpg`

## アニメーション仕様

### テキスト

テキスト演出は `ScatterText` / `ScatterBlock` を中心に統一。

`ScatterText` はHTMLテキストを残し、見た目の散らばりは `aria-hidden` のCanvasで描画。SEOとアクセシビリティ用のテキストを保持しながら、1文字DOM分割による負荷を避けるため。

SPではCanvas散布、スクロール購読、重い散布計算を作らない。

### ページ遷移

ページ遷移は以下で制御。

- `contexts/transition-context.tsx`
- `components/layout/page-transition.tsx`
- `components/layout/transition-link.tsx`

遷移中はオーバーレイと霧状の演出を表示。SPでは演出を軽くする。

### スクロール

- PC: LenisとScrollTriggerを使用
- SP: Lenis / GSAP / ScrollTriggerを基本的に読み込まない
- Scatter系スクロール更新: `lib/scroll-manager.ts` で購読を集約

### Canvas / WebGL

PC向けに以下を使う。

- `components/effects/top-canvas-film-overlay.tsx`: 全ページ上の幻想的なCanvas加工
- `components/effects/floating-particles.tsx`: 背景パーティクル
- `components/effects/custom-cursor.tsx`: カスタムカーソル
- `components/effects/bottom-heat-haze.tsx`: 下部ヒートヘイズ
- `components/navigation/menu-heat-haze-background.tsx`: メニュー背景WebGL
- `lib/shaders/heat-haze-shaders.ts`: GLSL定義

SPでは基本的に無効化。PCでも初期表示直後には読み込まず、idleや遅延レンダーで後回し。

## パフォーマンス方針

### 基本方針

- 初期表示はLCP / FCPを優先
- ファーストビュー外の装飾は急いで読まない
- SPでは演出より操作性を優先
- 画像は軽量化し、未使用画像は残さない
- Canvas/WebGL/常駐ウィジェットは遅延読み込みする
- `prefers-reduced-motion` を尊重する

### 遅延読み込み

- `components/deferred/deferred-visual-effects.tsx`: カーソル、粒子、オーブ、下部陽炎
- `components/deferred/deferred-site-widgets.tsx`: SoundToggle、CookieConsent
- `hooks/use-deferred-render.ts`: 下層ページや重いセクションの遅延描画
- `lib/performance-mode.ts`: SP判定、idle task、fast start判定

### 画像

現在使う主要画像。

- `public/ogp.jpg`
- `public/images/home-office-two-person-rainbow.webp`
- `public/images/hero-parallax-junk-letter-j.jpg`
- `public/images/hero-parallax-junk-letter-b.jpg`
- `public/images/team/yuki.webp`
- `public/images/team/tsukasa.webp`

古いplaceholder、旧favicon、旧OG画像、未使用のPNGチーム画像などは削除済み。

## SEO / OGP / アクセシビリティ

### SEO

- 共通metadata: `app/layout.tsx`
- ページ別metadata: `lib/seo.ts`
- 構造化データ: `lib/structured-data.ts`
- robots: `app/robots.ts`
- sitemap: `app/sitemap.ts`
- Search Console用XML: `app/search-console-sitemap.xml/route.ts`
- LLM向け説明: `app/llms.txt/route.ts`

OGP画像は `/ogp.jpg` に統一。`app/opengraph-image.tsx` は静的OGPへ一本化するため削除済み。

### JSON-LD

主に以下を使う。

- `WebSite`
- `Organization`
- `LocalBusiness`
- `Service`
- `FAQPage`
- `BreadcrumbList`
- 各ページ用schema

### アクセシビリティ

- skip linkで `#main-content` へ移動
- ナビメニューは `role="dialog"` / `aria-modal` / `aria-controls` / `aria-expanded`
- 現在ページは `aria-current`
- 音楽ボタンは `aria-pressed`
- Cookie切り替えは `role="switch"` / `aria-checked`
- 装飾Canvas、背景、アイコンは可能な範囲で `aria-hidden`
- クリック可能なものは `button` / `a` を維持

## ディレクトリ構成

```txt
app/
  layout.tsx
  page.tsx
  about/page.tsx
  works/page.tsx
  pricing/page.tsx
  contact/page.tsx
  privacy/page.tsx
  icon.svg
  sitemap.ts
  robots.ts
  llms.txt/route.ts
  search-console-sitemap.xml/route.ts

actions/
  contact.ts

components/
  deferred/
  effects/
  layout/
  loading/
  motion/
  navigation/
  pages/
  sections/
  ui/
  widgets/

content/
  about-page.ts
  contact-page.ts
  home-page.ts
  pricing-page.ts
  privacy-page.ts
  works-page.ts

contexts/
  audio-context.tsx
  transition-context.tsx

hooks/
  use-deferred-render.ts
  use-pointer-tilt.ts
  use-scroll-scatter-progress.ts
  use-toast.ts
  ...

lib/
  performance-mode.ts
  scatter.ts
  schema.ts
  scroll-manager.ts
  seo.ts
  structured-data.ts
  shaders/

types/
  component-props.ts
  effects.ts
  navigation.ts
  seo.ts
  ...

public/
  audio/
  images/
  ogp.jpg
```

## 主要ファイル

### app

- `app/layout.tsx`: 共通metadata、Provider、Navigation、PageTransition、skip link
- `app/page.tsx`: TOPページのServer Component
- `app/*/page.tsx`: 各ページのmetadataとJSON-LD
- `app/icon.svg`: ファビコン。文字なしの虹色アイコン
- `app/not-found.tsx`: Canvas粒子を使った404

### components/pages

- `components/pages/home-page.tsx`: TOPのPC/SPレイアウト切り替え
- `components/pages/home/home-desktop-page.tsx`: PC用TOP構成
- `components/pages/home/mobile-home-page.tsx`: SP用TOP構成
- `components/pages/home/home-inverted-scroll.tsx`: PC反転スクロール
- `components/pages/about-page.tsx`: ABOUT入口
- `components/pages/about/about-sections.tsx`: ABOUT主要セクション
- `components/pages/about/about-process-section.tsx`: ABOUT Process
- `components/pages/works-page.tsx`: WORKS入口
- `components/pages/works/works-sections.tsx`: WORKS主要セクション
- `components/pages/works/immersive-work-card.tsx`: WORKSカード
- `components/pages/pricing-page.tsx`: PRICING入口
- `components/pages/pricing/pricing-sections.tsx`: PRICING主要セクション
- `components/pages/pricing/pricing-service-card.tsx`: 料金サービスカード
- `components/pages/contact-page.tsx`: CONTACT入口
- `components/pages/contact/contact-form.tsx`: 問い合わせフォーム
- `components/pages/contact/contact-info-section.tsx`: 問い合わせ先
- `components/pages/contact/use-contact-form.ts`: フォーム状態管理
- `components/pages/privacy-page.tsx`: PRIVACY本文

### components/sections

- `components/sections/hero-section-v2.tsx`: TOP HERO。PC限定のJ/B写真パララックスあり
- `components/sections/services-section-v2.tsx`: TOPサービス
- `components/sections/marquee-section-v2.tsx`: TOPマーキー
- `components/sections/cta-section-v2.tsx`: TOP最終CTA

### motion / effects

- `components/motion/scatter-text.tsx`: Canvas散布テキスト
- `components/motion/scatter-block.tsx`: CTAなどブロックの組み上げ
- `components/motion/text-reveal/*`: text / word / line / section reveal
- `components/effects/top-canvas-film-overlay.tsx`: 全ページCanvas加工
- `components/effects/rising-rainbow-orb.tsx`: TOP2個/下層1個の虹色オーブ
- `components/effects/bottom-heat-haze.tsx`: 下部WebGL陽炎
- `components/effects/floating-particles.tsx`: PC背景粒子
- `components/effects/custom-cursor.tsx`: PCカスタムカーソル

## 実装ルール

### ファイル分割

大きいページは以下に分ける。

- データ: `content/<page>.ts`
- 表示セクション: `components/pages/<page>/`
- ページ入口: `components/pages/<page>-page.tsx`
- 型: `types/<page>.ts`
- ページ固有hook: `components/pages/<page>/use-*.ts`
- 再利用hook: `hooks/`

### 型

型は `types/` に切り出す。

- 共通props: `types/component-props.ts`
- 演出状態: `types/effects.ts`
- ナビゲーション: `types/navigation.ts`
- SEO: `types/seo.ts`
- 音声: `types/audio.ts`
- スクロール管理: `types/scroll-manager.ts`

### コメント

コメントは日本語で統一。  
「何をしているか」の直訳ではなく、「なぜそうしているか」「何を避けているか」「ライフサイクル上の注意」を書く。

良い例:

- Lighthouse対策として初回表示後のidleまで重いエフェクトを遅らせる
- TOPページでは親がtransformで動くため、window scrollではなく画面内位置を直接見る

避ける例:

- 配列をmapする
- stateを更新する
- refに値を入れる

### 触るときに注意するもの

- `ScatterText` の `distance` / `scrollStart` / `scrollEnd`
- `ScatterBlock` の `seed`
- GSAP / RAF / WebGLの更新頻度
- SPで無効にしている演出
- `TransitionLink` と通常リンクの使い分け
- OGP / icon / sitemap / JSON-LDの参照パス

見た目だけの変更でも、PageSpeed、アクセシビリティ、SP表示に影響する可能性あり。

## 確認コマンド

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

画像やOGPを触った場合は、参照パスも確認。

```bash
pnpm dev
```

確認するページ:

- `/`
- `/about`
- `/works`
- `/pricing`
- `/contact`
- `/privacy`

## 運用メモ

- OGPは `public/ogp.jpg`
- faviconは `app/icon.svg`
- sitemapは通常用とSearch Console用の2系統
- 画像を追加したら、使われていない古い画像を残さない
- SPではPC演出をそのまま持ち込まない
- 主要演出を外す前に、Canvas化や遅延読み込みで残せるか確認する
