# JunkBranding 開発メモ

自分用のプロジェクトメモ。  
環境、デザイン方針、コードの置き場所、実装で気をつけることを忘れないためにまとめる。

## 使っているもの

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- GSAP / ScrollTrigger
- Lenis
- Three.js / React Three Fiber
- Resend
- Vercel Analytics
- pnpm

## 開発コマンド

このプロジェクトは `pnpm-lock.yaml` があるので pnpm 前提。

```bash
pnpm install
pnpm dev
```

ビルド確認:

```bash
pnpm build
pnpm start
```

型チェック:

```bash
pnpm exec tsc --noEmit
```

lint:

```bash
pnpm lint
```

※ 現状、環境によっては `eslint` が見つからないことがある。その場合は最低限 `pnpm exec tsc --noEmit` を通す。

## 環境変数

問い合わせフォームのメール送信に Resend を使う。

```env
RESEND_API_KEY=your_resend_api_key
```

`actions/contact.ts` で `RESEND_API_KEY` が未設定だとエラーになる。  
ローカルで問い合わせフォームまで確認する場合は `.env.local` に入れる。

## デザイン仕様

### 全体の方向

- 小規模スタジオらしい丁寧さ、余白、軽さを大事にする。
- 淡いグラス表現、虹色グラデーションを基本トーンにする。
- 黒ベタのボタンは避ける。
- CTA は基本 `cta-primary` か `cta-secondary` を使う。

### 文字

- 本文: `Inter`
- 見出し / 英字ディスプレイ: `Bebas Neue`
- 大きい英字見出しはアウトライン、グラデーション、字間で雰囲気を作る。
- 長い日本語は読みやすさ優先。SPではアニメーションより可読性優先。

### 色と装飾

- アクセントはピンク、コーラル、イエロー、グリーン、ブルー、パープルの虹色グラデーション。
- カードやセクションの枠は `rainbow-border`。
- 半透明の面は `glass-card` / `glass-light`。
- PC は演出多め。
  - 背景パーティクル
  - カスタムカーソル
  - 下部の虹色陽炎
  - ページ遷移演出
- SP は余計な演出を止める。
  - パーティクルなし
  - カスタムカーソルなし
  - Lenisなし
  - 下部WebGL陽炎なし
  - 文字の散りアニメーションなし

### 動き

- テキスト演出は `ScatterText` / `ScatterBlock` を中心に統一。
- ページ遷移は `TransitionProvider`、`PageTransition`、`TransitionLink` で制御。
- 内部リンクでページ遷移演出を通したい場合は `TransitionLink` か `navigateWithTransition()` を使う。
- 外部リンク、`tel:`、修飾キー付きクリックでは独自遷移を走らせない。

## コード仕様

### TypeScript

- `strict: true`
- パスエイリアスは `@/*`
- ページ固有の型は `types/` に分ける。
- 共通UI props、演出用の粒子型、hook用の補助型も `types/` に切り出す。
- component / hook の中には、実装ロジックだけを残す方針。

主な型ファイル:

- `types/about-page.ts`
- `types/works-page.ts`
- `types/home-page.ts`
- `types/pricing-page.ts`
- `types/contact-page.ts`
- `types/layout.ts`
- `types/component-props.ts`
- `types/effects.ts`
- `types/english-text.ts`
- `types/hooks.ts`
- `types/toast.ts`

### コンポーネント

- ページ全体の client component は `components/pages/*-page.tsx`。
- 大きいページは表示データを `content/`、セクションを `components/pages/<page>/` に分ける。
- 共通 UI は `components/` 直下。
- アニメーションやスクロール制御は、可能なら hook / helper に逃がす。
- ファイルが大きくなったら、まず「データ」「セクション」「アニメーション補助」を分ける。
- 複数コンポーネントで使うIntersectionObserverやスクロール進捗は `hooks/` に分ける。

ページ切り出しの基本方針:

- `components/pages/<page>-page.tsx` は、そのページの入口としてセクションを並べるだけに近づける。
- 文言、料金、FAQ、選択肢、一覧データは `content/<page>.ts` に置く。
- セクション単位のJSXは `components/pages/<page>/<page>-sections.tsx` に置く。
- ページ固有の状態管理やIntersectionObserverは `components/pages/<page>/use-*.ts` に置く。
- ページ固有型は `types/<page>.ts` に置く。
- 既存の見た目を守るため、className、`ScatterText` の `scrollStart` / `scrollEnd` / `distance`、`ScatterBlock` の `seed` は不用意に変えない。
- すでに共通コンポーネント化されている大きな演出、たとえば `HeroSectionV2`、`ServicesSectionV2`、`CTASectionV2` はページ配下へ無理に移さない。

### スタイル

- グローバルスタイルは `app/globals.css`。
- CTA は `.cta-primary` / `.cta-secondary`。
- グラデーション枠は `.rainbow-border`。
- SP 最適化は `@media (max-width: 767px)` にまとめる。
- SPでは重い装飾、無限アニメーション、blur、backdrop-filterをできるだけ止める。

### 音楽

- 背景音楽は `contexts/audio-context.tsx`。
- 音声ファイルは `public/audio/128_BPM124.mp3`。
- 最大音量は `MAX_VOLUME`。
- 今は `0.4` にしている。
- ユーザーの選択は localStorage に保存する。
- ロード画面中は音楽選択をロックし、ロード後に選べるようにする。

### 問い合わせフォーム

- `actions/contact.ts` で Server Action と Resend を使う。
- `lib/schema.ts` の Zod schema で入力値を検証。
- 必須項目は `required` / `aria-required`、エラーは `aria-invalid` / `aria-describedby` / `role="alert"` で読み上げる。
- フォーム全体には説明文と送信状態の `aria-live` を持たせる。
- 入れている保護:
  - honeypot
  - 3秒未満送信のbot判定
  - IPベースの簡易レート制限

### SEO / アクセシビリティ

- ページ共通のSEOは `app/layout.tsx`、ページ別SEOは `lib/seo.ts` の `createPageMetadata()` で作る。
- canonical、OGP、Twitter Card、robots、JSON-LD、AI/LLM向けmetaを入れる。
- `metadataBase`、`referrer`、`appleWebApp`、`accessibility-summary` も設定済み。
- JSON-LDは `WebSite`、`Organization`、`LocalBusiness`、`Service`、`BreadcrumbList`、各ページ用schemaを使う。
- 先頭にスキップリンクを置いて、キーボード操作で `#main-content` へ移動できる。
- ナビメニューは `role="dialog"`、`aria-modal`、`aria-controls`、`aria-expanded`、`aria-current` を使う。
- ロード画面は `role="dialog"`、進捗バーは `role="progressbar"`、状態文は `aria-live` で読む。
- 音楽ボタンは `aria-pressed`、Cookieの切り替えは `role="switch"` / `aria-checked`。
- 装飾用の分割文字、アイコン、背景パーティクルは可能な範囲で `aria-hidden`。
- SPでは重い演出を止める。スクリーンリーダーや `prefers-reduced-motion` と相性が悪い演出を増やさない。

## 構成

まず見る場所:

- `app/`
  ルーティング、metadata、JSON-LD、全体レイアウト。
- `components/pages/`
  ページごとのclient入口とページ固有セクション。
- `content/`
  ページに表示する文言、一覧、料金、FAQ、選択肢。
- `types/`
  ページ固有型、共通props型、演出用の状態型。
- `contexts/`
  音楽とページ遷移のグローバル状態。
- `hooks/`
  SP判定、可視判定、スクロール進捗、toastなどの共通hook。
- `lib/`
  SEO、JSON-LD、Zod schema、散り演出、scroll集約などの補助処理。

### ページまわり

- `app/layout.tsx`
  全ページ共通。metadata、構造化データ、Provider、Navigation、SoundToggle、CookieConsent、skip linkを置く。
- `app/*/page.tsx`
  各ページのServer Component。ページ別metadataとJSON-LDを出して、`components/pages/*-page.tsx` を呼ぶ。
- `app/globals.css`
  全体の見た目。CTA、グラス表現、グラデーション、陽炎、SP最適化、focus/skip linkなど。
- `app/not-found.tsx`
  404ページ。
- `app/sitemap.ts` / `app/robots.ts` / `app/llms.txt/route.ts`
  検索エンジンとAIクローラー向け。

### ページ別コンポーネント

- `components/pages/home-page.tsx`
  TOPの入口。各TOPセクションを並べる。
- `components/pages/home/home-sections.tsx`
  TOPのHero、Marquee、About preview、Works preview、Area、CTA。
- `components/pages/home/use-lazy-video.ts`
  TOPのpreview動画を遅延読み込みするhook。
- `components/pages/about-page.tsx`
  ABOUTの入口。
- `components/pages/about/about-sections.tsx`
  ABOUTのHero、Intro、Team、Values、Process、CTA。
- `components/pages/works-page.tsx`
  WORKSの入口。
- `components/pages/works/work-card.tsx`
  実績カード。PCのhover表現とSP軽量表示。
- `components/pages/pricing-page.tsx`
  PRICINGの入口。
- `components/pages/pricing/pricing-sections.tsx`
  料金ページのHero、注意書き、料金カテゴリ、FAQ、CTA。
- `components/pages/contact-page.tsx`
  CONTACTの入口。送信完了画面とフォーム画面を切り替える。
- `components/pages/contact/contact-sections.tsx`
  CONTACTのHero、問い合わせ先、フォーム、送信完了画面。
- `components/pages/contact/use-contact-form.ts`
  フォーム状態、入力検証、送信処理。
- `components/pages/privacy-page.tsx`
  PRIVACY本文。

### 共通UIと演出

- `components/navigation.tsx`
  右上メニューの開閉制御。
- `components/navigation/*`
  ナビ設定、メニュー開閉hook、フルスクリーンoverlay。
- `components/text-reveal/*`
  テキスト/セクション/単語/行のreveal演出。
- `components/scatter-text.tsx`
  文字をスクロールで散らす演出。
- `components/scatter-block.tsx`
  ブロックをスクロールで散らす演出。CTAにも使う。
- `components/hero-section-v2.tsx`
  TOP Hero本体。
- `components/marquee-section-v2.tsx`
  TOPの横流れテキスト。
- `components/services-section-v2.tsx`
  TOPサービスセクション。
- `components/cta-section-v2.tsx`
  TOP最終CTA。
- `components/page-transition.tsx`
  ページ遷移時のフェード。
- `components/smooth-scroll.tsx`
  LenisとScrollTriggerの同期。SPでは無効。
- `components/loading-provider.tsx`
  初回ロード、session判定、プリロード、音楽選択ロック。
- `components/loading-screen.tsx`
  初回ローディング画面。
- `components/floating-particles.tsx`
  PC用背景パーティクル。
- `components/custom-cursor.tsx`
  PC用カスタムカーソル。
- `components/bottom-heat-haze.tsx`
  PC下部の虹色陽炎。
- `components/sound-toggle.tsx`
  右下の音楽ON/OFF。
- `components/cookie-consent.tsx`
  Cookie同意UI。
- `components/footer.tsx`
  全ページ共通Footer。

### データ、型、補助処理

- `content/home-page.ts`
  TOPの文言とpreview動画URL。
- `content/about-page.ts`
  ABOUTのteam、values、process。
- `content/works-page.ts`
  WORKSの作品一覧とカテゴリ。
- `content/pricing-page.ts`
  PRICINGの料金カテゴリ、サービス項目、FAQ。
- `content/contact-page.ts`
  CONTACTフォームの選択肢。
- `types/<page>.ts`
  ページ固有のデータ型とsection props。
- `types/component-props.ts`
  共通UI/演出コンポーネントのprops。
- `types/effects.ts`
  パーティクルやカーソルなど演出状態の型。
- `types/english-text.ts`
  英字タイポグラフィ系props。
- `types/hooks.ts` / `types/toast.ts`
  hook用の補助型。
- `contexts/audio-context.tsx`
  背景音楽の再生/停止、音量、保存設定。
- `contexts/transition-context.tsx`
  ページ遷移状態、`router.push`、prefetch。
- `hooks/use-mobile.ts`
  SP判定。
- `hooks/use-in-view.ts`
  IntersectionObserver共通hook。
- `hooks/use-element-in-view.ts`
  ref付きの可視判定hook。
- `hooks/use-scroll-progress.ts`
  Lenisのscroll progress。
- `hooks/use-toast.ts`
  toast状態管理。
- `lib/seo.ts`
  ページ別metadata helper。
- `lib/structured-data.ts`
  JSON-LD生成。
- `lib/schema.ts`
  問い合わせフォームのZod schema。
- `lib/scatter.ts`
  散り演出の値生成。
- `lib/scroll-manager.ts`
  scroll listenerを集約してrAFで通知。
- `actions/contact.ts`
  問い合わせ送信のServer Action。

### その他

- `public/audio/128_BPM124.mp3`
  背景音楽。
- `public/images/`
  画像置き場。
- `package.json`
  scriptsとdependencies。
- `pnpm-lock.yaml`
  pnpm lockfile。
- `tsconfig.json`
  TypeScript設定。
- `components.json`
  shadcn/ui系の設定。

## 実装メモ

### 初回ロード

`LoadingProvider` で初回ロード、進捗、音楽選択ロック、プリロードを管理している。  
初回ロードを少し長めに使って、下層ページや重いコンポーネントも先に温める方針。

### パフォーマンス

- PCは演出あり。
- SPは演出を削って軽くする。
- `scroll-manager.ts` で散りアニメーションのスクロール更新を集約。
- `requestAnimationFrame` を使う処理は、visibilityやSP判定で止められるところは止める。
- IntersectionObserverの重複実装は `hooks/use-in-view.ts` に寄せる。
- Lenisのスクロール進捗は `hooks/use-scroll-progress.ts` に分ける。

### ページ遷移

内部遷移は `TransitionLink` か `navigateWithTransition()` を使う。  
`tel:` や外部リンクは通常リンクのままにする。

### SEO

- `app/layout.tsx` に全体の metadata、OGP、robots、icons、構造化データ、スキップリンク。
- `lib/seo.ts` でページ別metadataを共通化。
- `lib/structured-data.ts` で JSON-LD。
- `app/sitemap.ts`、`app/robots.ts`、`app/llms.txt/route.ts`、`app/search-console-sitemap.xml/route.ts` が検索/AIクローラー用。

### アクセシビリティ

見た目の演出が強いサイトなので、最低限ここは崩さない:

- `main` には `id="main-content"` を付け、スキップリンクの移動先にする。
- クリックできるものは必ず `button` / `a` のままにする。
- アイコンだけのボタンには `aria-label`。
- 状態を持つボタンには `aria-pressed` または `aria-checked`。
- 入力エラーは見た目だけでなく `role="alert"` で伝える。
- 装飾文字を1文字ずつ分解する場合は、親にラベルを持たせて子を `aria-hidden` にする。

## 工夫したところ

- ロード画面で音楽ON/OFFを選べるようにした。
- 音楽OFFを選んだらページ遷移後も勝手に鳴らないようにした。
- 初回ロードでページやアセットをできるだけ先読みするようにした。
- SPでは余計なアニメーションを止めた。
- 文字の散りアニメーションは `scroll-manager.ts` に寄せてスクロールリスナーを減らした。
- `about` / `works` / `pricing` / `contact` の表示データを `content/` に分けた。
- TOPも `content/home-page.ts`、`components/pages/home/home-sections.tsx`、`use-lazy-video.ts` に分けた。
- TOPは既存の大きな演出コンポーネントを活かしつつ、プレビュー系セクションと遅延動画読み込みだけページ配下に逃がした。
- `pricing` は料金データ、FAQ、表示セクションを分けて、ページ本体を薄くした。
- `contact` はフォーム選択肢、フォーム状態hook、表示セクションを分けた。
- 大きくなった `navigation` と `text-reveal` を小分けした。
- コンポーネント内に残っていたprops型を `types/component-props.ts` に寄せた。
- 英字テキスト演出の型を `types/english-text.ts` にまとめた。
- パーティクルやカーソル演出の型を `types/effects.ts` に切り出した。
- hooks内のtoast型を `types/toast.ts` に分けた。
- 重複していた `useInView` を `hooks/use-in-view.ts` に集約した。
- ref付き可視判定とスクロール進捗を専用hookに分けた。
- CTAの色味を `cta-primary` / `cta-secondary` に寄せて、全体のトーンを揃えた。
- 問い合わせフォームにバリデーション、レート制限、honeypot、自動返信を入れた。
- 下部にPC用の虹色陽炎を追加した。ただしSPでは止める。
- SEO、WAI-ARIA、スクリーンリーダー対応を強化した。

## 自分用ルール

- 見た目を変えないリファクタでは、className、`ScatterText` の props、seed、duration、easing を不用意に変えない。
- 内部リンクは基本 `TransitionLink`。
- CTAは基本 `.cta-primary` / `.cta-secondary`。
- ページ固有データは `content/<page>.ts`。
- ページ固有型は `types/<page>.ts`。
- ページ固有セクションは `components/pages/<page>/<page>-sections.tsx`。
- ページ固有hookは `components/pages/<page>/use-*.ts`。
- 共通props型は `types/component-props.ts`。
- 演出系の状態型は `types/effects.ts`。
- 再利用できる処理は component に閉じ込めず `hooks/` に出す。
- 大きいファイルは「データ」「セクション」「hook/helper」に分ける。
- SPは軽さ優先。PCの演出をそのまま持ち込まない。
