# JunkBranding 開発メモ

自分用のプロジェクトメモ。

環境、デザイン方針、コードの置き場所、実装で気をつけることをまとめる。

## 使っているもの

Next.js 16 App Router

React 19

TypeScript

Tailwind CSS v4

GSAP / ScrollTrigger

Lenis

Three.js / React Three Fiber

Resend

Vercel Analytics

pnpm

## 開発コマンド

このプロジェクトは `pnpm-lock.yaml` があるので pnpm 前提。

インストールと開発起動

```bash
pnpm install
pnpm dev
```

ビルド確認

```bash
pnpm build
pnpm start
```

型チェック

```bash
pnpm exec tsc --noEmit
```

lint

```bash
pnpm lint
```

## 環境変数

問い合わせフォームのメール送信に Resend を使う。

```env
RESEND_API_KEY=your_resend_api_key
```

`actions/contact.ts` で `RESEND_API_KEY` が未設定だとエラーになる。

ローカルで問い合わせフォームまで確認する場合は `.env.local` に入れる。

## デザイン仕様

### 全体の方向

小規模スタジオらしい丁寧さ、余白、軽さを大事にする。

淡いグラス表現、虹色グラデーションを基本トーンにする。

黒ベタのボタンは避ける。

CTA は基本 `cta-primary` か `cta-secondary` を使う。

### 文字

本文

`Inter`

見出し / 英字ディスプレイ

`Bebas Neue`

大きい英字見出し

アウトライン、グラデーション、字間で雰囲気を作る。

長い日本語

読みやすさ優先。SPではアニメーションより可読性を優先する。

### 色と装飾

アクセント

ピンク、コーラル、イエロー、グリーン、ブルー、パープルの虹色グラデーション。

カードやセクションの枠

`rainbow-border`

半透明の面

`glass-card` / `glass-light`

PC

背景パーティクル、カスタムカーソル、下部の虹色陽炎、ページ遷移演出を入れる。

SP

パーティクル、カスタムカーソル、Lenis、下部WebGL陽炎、文字の散りアニメーションは止める。

### 動き

テキスト演出

`ScatterText` / `ScatterBlock` を中心に統一する。

ページ遷移

`TransitionProvider`、`PageTransition`、`TransitionLink` で制御する。

内部リンク

ページ遷移演出を通したい場合は `TransitionLink` か `navigateWithTransition()` を使う。

外部リンク

`tel:`、外部リンク、修飾キー付きクリックでは独自遷移を走らせない。

## コード仕様

### TypeScript

`strict: true`

パスエイリアスは `@/*`。

ページ固有の型は `types/` に分ける。

共通UI props、演出用の粒子型、hook用の補助型も `types/` に切り出す。

component / hook の中には、実装ロジックだけを残す。

主な型ファイル

`types/about-page.ts`

`types/works-page.ts`

`types/home-page.ts`

`types/pricing-page.ts`

`types/contact-page.ts`

`types/layout.ts`

`types/component-props.ts`

`types/effects.ts`

`types/english-text.ts`

`types/hooks.ts`

`types/toast.ts`

### コンポーネント

ページ全体の client component

`components/pages/*-page.tsx`

大きいページ

表示データを `content/`、セクションを `components/pages/<page>/` に分ける。

共通 UI

`components/` 直下に置く。

アニメーションやスクロール制御

可能なら hook / helper に逃がす。

ファイルが大きくなったら

まず「データ」「セクション」「アニメーション補助」を分ける。

IntersectionObserver やスクロール進捗

複数コンポーネントで使う場合は `hooks/` に分ける。

ページ切り出しの基本方針

`components/pages/<page>-page.tsx`

そのページの入口として、セクションを並べるだけに近づける。

`content/<page>.ts`

文言、料金、FAQ、選択肢、一覧データを置く。

`components/pages/<page>/<page>-sections.tsx`

セクション単位の JSX を置く。

`components/pages/<page>/use-*.ts`

ページ固有の状態管理や IntersectionObserver を置く。

`types/<page>.ts`

ページ固有型を置く。

既存の見た目

className、`ScatterText` の `scrollStart` / `scrollEnd` / `distance`、`ScatterBlock` の `seed` は不用意に変えない。

大きな共通演出

`HeroSectionV2`、`ServicesSectionV2`、`CTASectionV2` はページ配下へ無理に移さない。

### スタイル

グローバルスタイル

`app/globals.css`

CTA

`.cta-primary` / `.cta-secondary`

グラデーション枠

`.rainbow-border`

SP 最適化

`@media (max-width: 767px)` にまとめる。

SP

重い装飾、無限アニメーション、blur、backdrop-filter をできるだけ止める。

### 音楽

背景音楽

`contexts/audio-context.tsx`

音声ファイル

`public/audio/128_BPM124.mp3`

最大音量

`MAX_VOLUME`

現在の音量

`0.4`

ユーザーの選択

localStorage に保存する。

ロード画面中

音楽選択をロックし、ロード後に選べるようにする。

### 問い合わせフォーム

送信処理

`actions/contact.ts` で Server Action と Resend を使う。

入力検証

`lib/schema.ts` の Zod schema で検証する。

必須項目

`required` / `aria-required` を使う。

入力エラー

`aria-invalid` / `aria-describedby` / `role="alert"` で読み上げる。

フォーム全体

説明文と送信状態の `aria-live` を持たせる。

保護

honeypot、3秒未満送信のbot判定、IPベースの簡易レート制限を入れる。

### SEO / アクセシビリティ

ページ共通SEO

`app/layout.tsx`

ページ別SEO

`lib/seo.ts` の `createPageMetadata()` で作る。

metadata

canonical、OGP、Twitter Card、robots、JSON-LD、AI/LLM向けmetaを入れる。

JSON-LD

`WebSite`、`Organization`、`LocalBusiness`、`Service`、`BreadcrumbList`、各ページ用schemaを使う。

スキップリンク

先頭に置いて、キーボード操作で `#main-content` へ移動できるようにする。

ナビメニュー

`role="dialog"`、`aria-modal`、`aria-controls`、`aria-expanded`、`aria-current` を使う。

ロード画面

`role="dialog"`、`role="progressbar"`、`aria-live` を使う。

音楽ボタン

`aria-pressed` を使う。

Cookie の切り替え

`role="switch"` / `aria-checked` を使う。

装飾要素

分割文字、アイコン、背景パーティクルは可能な範囲で `aria-hidden` にする。

SP

重い演出を止め、スクリーンリーダーや `prefers-reduced-motion` と相性が悪い演出を増やさない。

## 構成

### まず見る場所

`app/`

ルーティング、metadata、JSON-LD、全体レイアウト。

`components/pages/`

ページごとの client 入口とページ固有セクション。

`content/`

ページに表示する文言、一覧、料金、FAQ、選択肢。

`types/`

ページ固有型、共通props型、演出用の状態型。

`contexts/`

音楽とページ遷移のグローバル状態。

`hooks/`

SP判定、可視判定、スクロール進捗、toastなどの共通hook。

`lib/`

SEO、JSON-LD、Zod schema、散り演出、scroll集約などの補助処理。

### ページまわり

`app/layout.tsx`

全ページ共通。metadata、構造化データ、Provider、Navigation、skip linkを置く。

`app/*/page.tsx`

各ページの Server Component。ページ別 metadata と JSON-LD を出して、`components/pages/*-page.tsx` を呼ぶ。

`app/globals.css`

全体の見た目。CTA、グラス表現、グラデーション、陽炎、SP最適化、focus / skip link など。

`app/not-found.tsx`

404ページ。

`app/sitemap.ts` / `app/robots.ts` / `app/llms.txt/route.ts`

検索エンジンとAIクローラー向け。

### ページ別コンポーネント

`components/pages/home-page.tsx`

TOPの入口。各TOPセクションを並べる。

`components/pages/home/home-sections.tsx`

TOPの Hero、Marquee、About preview、Works preview、Area、CTA。

`components/pages/home/use-lazy-video.ts`

TOPの preview 動画を遅延読み込みする hook。

`components/pages/about-page.tsx`

ABOUTの入口。

`components/pages/about/about-sections.tsx`

ABOUTの Hero、Intro、Team、Values、Process、CTA。

`components/pages/works-page.tsx`

WORKSの入口。

`components/pages/works/work-card.tsx`

実績カード。PCの hover 表現と SP 軽量表示。

`components/pages/pricing-page.tsx`

PRICINGの入口。

`components/pages/pricing/pricing-sections.tsx`

料金ページの Hero、注意書き、料金カテゴリ、FAQ、CTA。

`components/pages/contact-page.tsx`

CONTACTの入口。送信完了画面とフォーム画面を切り替える。

`components/pages/contact/contact-sections.tsx`

CONTACTの Hero、問い合わせ先、フォーム、送信完了画面。

`components/pages/contact/use-contact-form.ts`

フォーム状態、入力検証、送信処理。

`components/pages/privacy-page.tsx`

PRIVACY本文。

### 共通UIと演出

`components/navigation.tsx`

右上メニューの開閉制御。

`components/navigation/*`

ナビ設定、メニュー開閉hook、フルスクリーンoverlay。

`components/text-reveal/*`

テキスト、セクション、単語、行の reveal 演出。

`components/scatter-text.tsx`

文字をスクロールで散らす演出。

`components/scatter-block.tsx`

ブロックをスクロールで散らす演出。CTAにも使う。

`components/hero-section-v2.tsx`

TOP Hero本体。

`components/marquee-section-v2.tsx`

TOPの横流れテキスト。

`components/services-section-v2.tsx`

TOPサービスセクション。

`components/cta-section-v2.tsx`

TOP最終CTA。

`components/page-transition.tsx`

ページ遷移時のフェード。

`components/smooth-scroll.tsx`

LenisとScrollTriggerの同期。SPでは無効。

`components/deferred-visual-effects.tsx`

カスタムカーソル、背景パーティクル、下部陽炎を初回描画後に遅延読み込みする。

`components/deferred-site-widgets.tsx`

SoundToggleとCookieConsentを初回描画後に遅延読み込みする。

`components/loading-provider.tsx`

初回ロード、session判定、プリロード、音楽選択ロック。

`components/loading-screen.tsx`

初回ローディング画面。

`components/floating-particles.tsx`

PC用背景パーティクル。

`components/custom-cursor.tsx`

PC用カスタムカーソル。

`components/bottom-heat-haze.tsx`

PC下部の虹色陽炎。

`components/sound-toggle.tsx`

右下の音楽ON/OFF。

`components/cookie-consent.tsx`

Cookie同意UI。

`components/footer.tsx`

全ページ共通Footer。

### データ、型、補助処理

`content/home-page.ts`

TOPの文言と preview 動画URL。

`content/about-page.ts`

ABOUTの team、values、process。

`content/works-page.ts`

WORKSの作品一覧とカテゴリ。

`content/pricing-page.ts`

PRICINGの料金カテゴリ、サービス項目、FAQ。

`content/contact-page.ts`

CONTACTフォームの選択肢。

`types/<page>.ts`

ページ固有のデータ型と section props。

`types/component-props.ts`

共通UI / 演出コンポーネントの props。

`types/effects.ts`

パーティクルやカーソルなど演出状態の型。

`types/english-text.ts`

英字タイポグラフィ系 props。

`types/hooks.ts` / `types/toast.ts`

hook用の補助型。

`contexts/audio-context.tsx`

背景音楽の再生、停止、音量、保存設定。

`contexts/transition-context.tsx`

ページ遷移状態、`router.push`、prefetch。

`hooks/use-mobile.ts`

SP判定。

`hooks/use-in-view.ts`

IntersectionObserver共通hook。

`hooks/use-element-in-view.ts`

ref付きの可視判定hook。

`hooks/use-scroll-progress.ts`

Lenisの scroll progress。

`hooks/use-toast.ts`

toast状態管理。

`lib/seo.ts`

ページ別 metadata helper。

`lib/structured-data.ts`

JSON-LD生成。

`lib/schema.ts`

問い合わせフォームの Zod schema。

`lib/scatter.ts`

散り演出の値生成。

`lib/scroll-manager.ts`

scroll listener を集約して rAF で通知。

`actions/contact.ts`

問い合わせ送信の Server Action。

### その他

`public/audio/128_BPM124.mp3`

背景音楽。

`public/images/`

画像置き場。

`package.json`

scripts と dependencies。

`pnpm-lock.yaml`

pnpm lockfile。

`tsconfig.json`

TypeScript設定。

`components.json`

shadcn/ui系の設定。

## 実装メモ

### 初回ロード

`LoadingProvider` で初回ロード、進捗、音楽選択ロック、プリロードを管理している。

以前は初回ロード中に下層ページ、Three.js、React Three Fiber、動画、音声まで先に温めていた。

PageSpeedでは、そのプリロードが FCP / LCP を阻害しやすかった。

今は初回描画を優先し、重い演出やウィジェットは描画後に遅延読み込みする。

### パフォーマンス方針

PC

演出あり。

SP

演出を削って軽くする。

SPの優先順位

LCP / FCP を最優先にする。

ファーストビュー外

装飾、Canvas、WebGL、Cookie UI、音楽UIは急いで読まない。

スクロール更新

`scroll-manager.ts` で散りアニメーションのスクロール更新を集約する。

SEO用テキスト

HTMLテキストは残し、重い文字演出は Canvas や要素単位のアニメーションに寄せる。

1文字DOM分割

レイヤー数が増えやすいので避ける。

`ScatterText`

HTMLテキストを残し、散る瞬間だけ `aria-hidden` の Canvas で描画する。

SPの `ScatterText`

Canvas、散布計算、スクロール購読を作らない。

画像

`next/image` の最適化を使う。`next.config.mjs` では AVIF / WebP と長期キャッシュを有効にする。

装飾UI

`SoundToggle`、`CookieConsent`、背景パーティクル、カスタムカーソル、下部陽炎は初回描画後に遅延する。

GTM

`afterInteractive` で読み込む。

### 軽量化の履歴 2026-05-03

きっかけ

PageSpeed Insightsで最初は `NO_FCP` が出て、Lighthouseが描画を検出できないことがあった。

DevTools計測

`Layerize` と `Paint` の比率が高く、1文字DOM化する演出でレイヤー数が増えていた。

実ユーザーデータ

LCPは約4.3〜4.4秒だった。過去28日集計なので改善反映には時間がかかる。

方針

デザインと演出の印象は変えない。

SEOとアクセシビリティ用のテキストはHTMLとして残す。

表示直後に不要な JS、WebGL、Canvas、Cookie UI、音楽UIは遅延する。

1文字DOM、常時 `will-change`、初回の過剰プリロードを減らす。

画像は Next.js の画像最適化に任せる。

PageSpeed / Lighthouse などの監査環境では、音楽選択待ちや装飾ウィジェットを計測に乗せない。

改良箇所

`components/scatter-text.tsx`

HTMLテキストを残し、PCでは散る表現だけ Canvas で描画する。SPでは Canvas、散布計算、スクロール購読を作らない。

`components/hero-section-v2.tsx`

Hero見出しは1文字DOM分割に戻さず、Canvas版 `ScatterText` でスクロール時のバラバラ演出を復帰。

`components/marquee-section-v2.tsx`

Marqueeもテキスト単位のまま、スクロール進捗に合わせて Canvas 散布を適用。

`components/navigation/navigation-menu-overlay.tsx`

メニュー文字はラベル単位の組み立てを維持しつつ、Canvas散布で「散った状態からまとまる」表現を復帰。

`components/text-reveal/text-reveal.tsx`

1文字分割をやめ、要素単位の reveal に変更。

`components/loading-screen.tsx`

文字分割と常時レイヤー化を削減。

`components/deferred-visual-effects.tsx`

カスタムカーソル、背景パーティクル、下部WebGL陽炎を初回描画後に読み込む。SPと監査環境では読み込まない。

`components/deferred-site-widgets.tsx`

SoundToggle と CookieConsent を初回描画後に読み込む。SPではさらに遅延し、監査環境では読み込まない。

`components/loading-provider.tsx`

初回ロード中の過剰なプリロードを削減。SPや監査環境では短い待機で自動 Silent Start へ進める。

`components/smooth-scroll.tsx`

ScrollTrigger遅延読み込み時の runtime error を修正。SPでは Lenis / GSAP / ScrollTrigger を読み込まない。

`app/layout.tsx`

GTMを `afterInteractive` に変更した。

`app/globals.css`

SPでファーストビュー外セクションに `content-visibility: auto` を適用。

`next.config.mjs`

`images.unoptimized: true` をやめ、AVIF / WebP 配信と長期キャッシュを有効化。

`components/pages/about/about-sections.tsx`

About画像に `quality` と SP 実寸に近い `sizes` を指定。

結果

`https://junkbranding.com/about` の PageSpeed Insights デスクトップで Performance 97、Accessibility 96、Best Practices 100、SEO 100。

ラボ値

FCP 0.7秒、LCP 0.8秒、TBT 80ms、CLS 0.005、Speed Index 1.6秒。

`NO_FCP`

解消済み。

SP追加対応

Canvas生成停止、Lenis / GSAP 読み込み停止、装飾 dynamic import 停止、下層セクションの `content-visibility` 適用を行った。

TOPのSP対応

fast start、監査環境での装飾ウィジェット停止、idle warmup停止、本文フェード時間短縮を行った。

PCのTBT対応

監査 / Headless 判定を `lib/performance-mode.ts` に共通化し、`navigator.webdriver` も見るようにした。

TOPのSP表示

下層セクションを `components/pages/home/home-deferred-sections.tsx` に分け、viewport接近後に読み込む。

TOPのPC表示

通常の下スクロール操作のまま、仮想ステージ内の見え方だけを `Hero` から上方向のセクションへ進める。

実ユーザーデータ

LCP 4.3秒前後は過去28日集計なので、デプロイ後しばらくしてから改善が反映される見込み。

### 反省点

PageSpeed改善

急いだ結果、最初の軽量化で「重い実装」と「大事な見た目」を一緒に削ってしまった。

Hero、Marquee、Navigation

サイトの印象を作る重要な演出なので、単純に外すのではなく最初から Canvas 版へ置き換えるべきだった。

1文字DOM分割

重いこと自体は正しかったが、「1文字DOMをやめる = バラバラ演出もやめる」と判断したのが粗かった。

正しい方針

HTMLテキストは1ノードで残し、見た目だけ Canvas で散らす。

`ScatterText`

`scatterProgress` を追加したことで、外部制御の演出にも同じ軽量実装を使えるようになった。

PCとSP

SPでは LCP / FCP 優先で Canvas 散布を止める。PCでは演出を残す。

確認不足

PageSpeedの数値だけでなく、主要導線の見た目チェックを必ず行う。

README

「軽くした」だけでなく、「何を残すべきだったか」「次に触る時の判断基準」まで残す。

今後の文字演出

まず `ScatterText` の HTML + Canvas 方針に乗せられるかを確認する。

監査環境向け最適化

実ユーザー向けの体験と混ぜすぎない。

### 確認コマンド

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

### ページ遷移

内部遷移

`TransitionLink` か `navigateWithTransition()` を使う。

`tel:` や外部リンク

通常リンクのままにする。

### SEO

`app/layout.tsx`

全体の metadata、OGP、robots、icons、構造化データ、スキップリンク。

`lib/seo.ts`

ページ別 metadata を共通化。

`lib/structured-data.ts`

JSON-LD。

`app/sitemap.ts` / `app/robots.ts` / `app/llms.txt/route.ts` / `app/search-console-sitemap.xml/route.ts`

検索 / AIクローラー用。

### アクセシビリティ

`main`

`id="main-content"` を付け、スキップリンクの移動先にする。

クリックできるもの

必ず `button` / `a` のままにする。

アイコンだけのボタン

`aria-label` を付ける。

状態を持つボタン

`aria-pressed` または `aria-checked` を使う。

入力エラー

見た目だけでなく `role="alert"` で伝える。

装飾文字

1文字ずつ分解する場合は、親にラベルを持たせて子を `aria-hidden` にする。

文字演出

基本は1文字DOM分割を避け、SEO用HTMLテキストと `aria-hidden` の Canvas 演出を分ける。

## 工夫したところ

ロード画面

音楽ON/OFFを選べるようにした。

音楽OFF

ページ遷移後も勝手に鳴らないようにした。

初回ロード

FCP / LCP 優先。重い演出やウィジェットは描画後に遅延読み込みする。

SP

余計なアニメーションを止めた。

SPの初期読み込み

背景演出、Canvas散布、Lenis / GSAP を外した。

SPのファーストビュー外セクション

`content-visibility: auto` で描画を遅らせる。

文字の散りアニメーション

`scroll-manager.ts` に寄せてスクロールリスナーを減らした。

`ScatterText`

1文字DOM分割を避けるため、HTMLテキスト + Canvas描画にした。

PageSpeed

`NO_FCP` 解消、Lighthouseデスクトップ Performance 97 まで改善した。

ページデータ

`about` / `works` / `pricing` / `contact` の表示データを `content/` に分けた。

TOP

`content/home-page.ts`、`components/pages/home/home-sections.tsx`、`use-lazy-video.ts` に分けた。

pricing

料金データ、FAQ、表示セクションを分けて、ページ本体を薄くした。

contact

フォーム選択肢、フォーム状態hook、表示セクションを分けた。

navigation と text-reveal

大きくなったので小分けした。

型

共通props、英字テキスト演出、パーティクル、カーソル、toast を `types/` に寄せた。

hook

重複していた `useInView` を `hooks/use-in-view.ts` に集約した。

CTA

色味を `cta-primary` / `cta-secondary` に寄せて、全体のトーンを揃えた。

問い合わせフォーム

バリデーション、レート制限、honeypot、自動返信を入れた。

虹色陽炎

PC用に追加した。ただしSPでは止める。

SEO / WAI-ARIA

スクリーンリーダー対応を強化した。

## 自分用ルール

見た目を変えないリファクタ

className、`ScatterText` の props、seed、duration、easing を不用意に変えない。

内部リンク

基本 `TransitionLink`。

CTA

基本 `.cta-primary` / `.cta-secondary`。

ページ固有データ

`content/<page>.ts`

ページ固有型

`types/<page>.ts`

ページ固有セクション

`components/pages/<page>/<page>-sections.tsx`

ページ固有hook

`components/pages/<page>/use-*.ts`

共通props型

`types/component-props.ts`

演出系の状態型

`types/effects.ts`

再利用できる処理

component に閉じ込めず `hooks/` に出す。

大きいファイル

「データ」「セクション」「hook/helper」に分ける。

SP

軽さ優先。PCの演出をそのまま持ち込まない。
