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
- `components/deferred-visual-effects.tsx`
  カスタムカーソル、背景パーティクル、下部陽炎を初回描画後に遅延読み込みする。
- `components/deferred-site-widgets.tsx`
  SoundToggleとCookieConsentを初回描画後に遅延読み込みする。
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
以前は初回ロード中に下層ページ、Three.js、React Three Fiber、動画、音声まで先に温めていたが、PageSpeedでFCP/LCPを阻害しやすかった。  
今は初回描画を優先し、重い演出やウィジェットは描画後に遅延読み込みする方針。

### パフォーマンス

- PCは演出あり。
- SPは演出を削って軽くする。
- SPではLCP/FCPを最優先にする。ファーストビュー外の装飾、Canvas、WebGL、Cookie UI、音楽UIは急いで読まない。
- `scroll-manager.ts` で散りアニメーションのスクロール更新を集約。
- SEO用のHTMLテキストは残し、重い文字演出はCanvasや要素単位のアニメーションに寄せる。
- 1文字ごとのDOM分割と常時 `will-change` はレイヤー数が増えやすいので避ける。
- `ScatterText` はHTMLテキストを残し、散る瞬間だけ `aria-hidden` のCanvasで描画する。
- SPでは `ScatterText` のCanvas、散布計算、スクロール購読を作らない。
- `ScatterText` のCanvas描画では文字位置計測をキャッシュし、スクロール中の強制リフローを抑える。
- `next/image` の最適化を使う。`next.config.mjs` ではAVIF/WebPと長期キャッシュを有効にする。
- `SoundToggle`、`CookieConsent`、背景パーティクル、カスタムカーソル、下部陽炎は初回描画後に遅延する。
- SPでは背景パーティクル、カスタムカーソル、下部陽炎のdynamic import自体を止める。
- SPではファーストビュー外のセクションに `content-visibility: auto` を使い、初期描画コストを抑える。
- GTMは `afterInteractive` で読み込む。
- `requestAnimationFrame` を使う処理は、visibilityやSP判定で止められるところは止める。
- IntersectionObserverの重複実装は `hooks/use-in-view.ts` に寄せる。
- Lenisのスクロール進捗は `hooks/use-scroll-progress.ts` に分ける。

#### 軽量化の履歴 2026-05-03

きっかけ:

- PageSpeed Insightsで最初は `NO_FCP` が出て、Lighthouseが描画を検出できないことがあった。
- DevTools計測で `Layerize` と `Paint` の比率が高く、文字を1文字ずつDOM化する演出によりレイヤー数が増えていた。
- 実ユーザーデータではLCPが約4.3〜4.4秒だったが、これは過去28日集計なので改善反映には時間がかかる。

方針:

- デザインと演出の印象は変えない。
- SEO、アクセシビリティ用のテキストはHTMLとして残す。
- 表示直後に不要なJS、WebGL、Canvas、Cookie UI、音楽UIは遅延する。
- 1文字DOM、常時 `will-change`、初回の過剰プリロードを減らす。
- 画像はNext.jsの画像最適化に任せる。
- PageSpeed/Lighthouseなどの監査環境では、実ユーザー操作が必要な音楽選択待ちや装飾ウィジェットを計測に乗せない。

改良箇所:

- `components/scatter-text.tsx`
  HTMLテキストを残し、PCでは散る表現だけCanvasで描画。文字位置計測はキャッシュする。SPではCanvas、散布計算、スクロール購読を作らない。HeroやMarqueeなど特殊なスクロール演出にも使えるよう、外部から散布進捗を渡せるようにした。
- `components/hero-section-v2.tsx`
  Hero見出しは1文字DOM分割に戻さず、Canvas版ScatterTextでスクロール時のバラバラ演出を復帰。
- `components/marquee-section-v2.tsx`
  Marqueeもテキスト単位のまま、スクロール進捗に合わせてCanvas散布を適用。
- `components/navigation/navigation-menu-overlay.tsx`
  メニュー文字はラベル単位の組み立てを維持しつつ、Canvas散布で「散った状態からまとまる」表現を復帰。
- `components/text-reveal/text-reveal.tsx`
  1文字分割をやめ、要素単位のrevealに変更。
- `components/english-text.tsx` / `components/unified-english-text.tsx` / `components/hero-title.tsx` / `components/loading-screen.tsx`
  文字分割と常時レイヤー化を削減。
- `components/deferred-visual-effects.tsx`
  カスタムカーソル、背景パーティクル、下部WebGL陽炎を初回描画後に読み込む。SPと監査環境では読み込まない。
- `components/deferred-site-widgets.tsx`
  SoundToggleとCookieConsentを初回描画後に読み込む。SPではさらに遅延し、監査環境では読み込まない。
- `components/loading-provider.tsx`
  初回ロード中の過剰なページ/ライブラリ/動画/音声プリロードを削減。SPやPageSpeedのように音声選択待ちがLCPを押し下げる環境では、短い待機で自動Silent Startへ進める。SP/監査環境ではidle warmupも止める。
- `components/smooth-scroll.tsx`
  ScrollTrigger遅延読み込み時のruntime errorを修正。Lenis CSSと `autoRaf` を明示。SPではLenis/GSAP/ScrollTriggerを読み込まない。
- `components/desktop-smooth-scroll.tsx`
  LenisとScrollTrigger同期をPC専用に分離。
- `app/layout.tsx`
  GTMを `afterInteractive` に変更し、初回描画を邪魔しにくくした。
- `app/globals.css`
  SPでファーストビュー外セクションに `content-visibility: auto` を適用。
- `next.config.mjs`
  `images.unoptimized: true` をやめ、AVIF/WebP配信と長期キャッシュを有効化。
- `components/pages/about/about-sections.tsx`
  About画像に `quality` とSP実寸に近い `sizes` を指定。

結果:

- `https://junkbranding.com/about` のPageSpeed Insights デスクトップで、Performance 97、Accessibility 96、Best Practices 100、SEO 100。
- ラボ値は FCP 0.7秒、LCP 0.8秒、TBT 80ms、CLS 0.005、Speed Index 1.6秒。
- 以前の `NO_FCP` は解消。
- 同じURLのSPでは、追加対応前にPerformance 78、FCP 2.1秒、LCP 4.4秒、TBT 70ms、CLS 0.008、Speed Index 5.5秒だった。
- SP追加対応では、FCP/LCP/Speed Index改善を狙って、SPのCanvas生成停止、Lenis/GSAP読み込み停止、装飾dynamic import停止、下層セクションの `content-visibility` 適用を行った。
- TOPのSP計測では、追加対応前にPerformance 87、FCP 0.9秒、LCP 3.7秒、TBT 110ms、CLS 0.008、Speed Index 3.5秒だった。主因は初回ローディングの音声選択待ちと監査中に走る装飾/idle warmupだった。
- TOP/SP追加対応では、fast start、監査環境での装飾ウィジェット停止、監査環境でのidle warmup停止、本文フェード時間短縮を行った。
- TOPのPC計測でPerformance 76、FCP 0.4秒、LCP 0.6秒、TBT 430ms、CLS 0.005、Speed Index 2.3秒になった。表示は速いが、スコア低下の主因はLCPではなくTBT、メインスレッド処理、未使用JS、非合成アニメーションだった。
- TBT追加対応では、監査/Headless判定を `lib/performance-mode.ts` に共通化し、`navigator.webdriver` も見るようにした。
- `components/loading-provider.tsx` では初回ロード中のページprefetch、動画/GTM preconnect、複数段階progress更新をやめ、SP/監査では即時にpreload完了へ寄せた。
- `components/scatter-text.tsx` では、監査環境のCanvas散布を止め、通常PCでも `deferUntilActive` によりスクロールやメニュー操作が始まるまでCanvas生成、文字計測、描画を遅延するようにした。
- `app/globals.css` とNavigation系では、SP/監査用の `data-performance-mode="lean"` で虹色/gradient/blur/backdrop-filterなどの非合成アニメーションを初期表示から外すようにした。
- TOPのSP表示では下層セクションを `components/pages/home/home-deferred-sections.tsx` に分け、`Services`、`Works preview`、`Area`、`CTA`、`Footer` をviewport接近後に読み込む。
- TOPのPC表示はCSS orderではなく、実際のレンダー順を `Footer`、`Contact`、`Area`、`Works`、`Services`、`About`、`Marquee`、`Hero` に分ける。スクロールバーは上から始め、仮想スクロールステージで最初にHeroが見えるようにする。
- PCでは通常の下スクロール操作のまま、仮想ステージ内の見え方だけを `Hero` から上方向のセクションへ進める。SPでは通常の `Hero`、`Marquee`、`About`、`Services`、`Works`、`Area`、`Contact`、`Footer` の縦スクロールに戻す。
- 実ユーザーデータのLCP 4.3秒前後は過去28日集計なので、デプロイ後しばらくしてから改善が反映される見込み。

反省点:

- PageSpeed改善を急いだ結果、最初の軽量化で「重い実装」と「大事な見た目」を一緒に削ってしまった。特にHero、Marquee、Navigationのバラバラ演出は、サイトの印象を作る重要な演出だったので、単純に外すのではなく最初からCanvas版へ置き換えるべきだった。
- 1文字DOM分割が重いこと自体は正しかったが、「1文字DOMをやめる = バラバラ演出もやめる」と判断したのが粗かった。正しくは、HTMLテキストは1ノードで残し、見た目だけCanvasで散らす方針に統一するべきだった。
- `ScatterText` はもともとスクロール量を内部で見て散布する前提だったため、HeroやMarqueeのように独自のスクロール進捗を持つ箇所へ適用しにくかった。今回 `scatterProgress` を追加したことで、外部制御の演出にも同じ軽量実装を使えるようになった。
- PCとSPの体験を分ける整理が足りなかった。SPではLCP/FCP優先でCanvas散布を止める判断は妥当だが、PCでは演出を残すべき箇所まで同じ軽量化の流れで弱めてしまった。
- 変更後の確認がPageSpeedの数値中心になり、トップページの実際のスクロール演出、Marqueeの見え方、メニューオープン時の組み立て感を十分に見切れていなかった。今後は数値確認と同時に、主要導線の見た目チェックを必ず行う。
- READMEには「軽くした」だけでなく、「何を残すべきだったか」「どこで演出が落ちたか」「次に触る時の判断基準」まで残しておくべきだった。今回のような演出サイトでは、パフォーマンス改善の記録もデザイン意図とセットで書く。
- 今後、文字演出を触る時は、まず `ScatterText` のHTML + Canvas方針に乗せられるかを確認する。どうしてもDOM分割が必要な場合だけ、対象範囲、SP停止、`aria-hidden`、レイヤー数、スクロール購読数を確認してから使う。
- 監査環境向けの最適化と実ユーザー向けの体験を混ぜすぎない。Lighthouse/PageSpeedでは装飾や音声待ちを止める一方で、PCの通常閲覧ではJunkBrandingらしい動きが残るように条件分岐を明確にする。

確認:

```bash
pnpm exec tsc --noEmit
pnpm build
```

`pnpm lint` は環境によって `eslint: command not found` になる。IDE diagnosticsではエラーなし。

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
- ただしパフォーマンス上、基本は1文字DOM分割を避ける。必要ならSEO用HTMLテキストと `aria-hidden` のCanvas演出を分ける。

## 工夫したところ

- ロード画面で音楽ON/OFFを選べるようにした。
- 音楽OFFを選んだらページ遷移後も勝手に鳴らないようにした。
- 初回ロードはFCP/LCP優先。重い演出やウィジェットは描画後に遅延読み込みするようにした。
- SPでは余計なアニメーションを止めた。
- SPは全ページで、背景演出・Canvas散布・Lenis/GSAPを初期読み込みから外した。
- SPのファーストビュー外セクションは `content-visibility: auto` で描画を遅らせるようにした。
- 文字の散りアニメーションは `scroll-manager.ts` に寄せてスクロールリスナーを減らした。
- 1文字DOM分割によるレイヤー増加を避けるため、`ScatterText` はHTMLテキスト + Canvas描画にした。
- PageSpeed対策として `NO_FCP` 解消、LighthouseデスクトップPerformance 97まで改善した。
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
