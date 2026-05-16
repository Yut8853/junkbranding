# JunkBranding

自分用の実装メモ。

JunkBranding サイトで、後から見返したときに構成や意図を忘れないようにまとめる。

この README では主に以下を残す。

- サイト全体の目的と設計方針
- 技術スタックと、その技術を使っている理由
- ディレクトリ構成と責務分担
- 反転スクロールやローディングなど、忘れやすい込み入った実装
- ローカル確認方法、ビルド、サーバーへ上げるときのメモ

## このサイトで重視していること

- 小さなスタジオらしい丁寧さが伝わること
- 第一印象から下層まで体験が途切れないこと
- PCでは強い演出を見せつつ、SPでは軽さと操作性を優先すること
- 装飾よりも、成果に結びつく導線設計を崩さないこと
- SEO、アクセシビリティ、表示速度を演出と両立すること

## 主な特徴

### 1. PCとSPで体験を切り替えるトップページ

トップページは、端末幅に応じて構成自体を切り替えています。

- PC: 反転スクロールを使った演出型トップ
- SP: 通常の縦積みレイアウトで軽量化したトップ

PCではブランド体験を強く出し、SPでは回遊しやすさと読みやすさを優先しています。重いCanvasや常駐エフェクトを全端末で同じように出さないのは、この方針によるものです。

### 2. 演出を後回しにして初期表示を守る設計

視覚効果は多いですが、初期表示でまとめて読まないようにしています。

- dynamic import で分割
- idle 時間まで待ってから常駐エフェクトを描画
- 小画面ではエフェクトを減らす
- Worker 対応可能なCanvas処理はメインスレッドから分離

つまり「派手に見えるが、最初は重くしすぎない」構造です。

### 3. 問い合わせまわりまで実装している

問い合わせは見た目だけでなく、送信処理まで実装している。

- Server Actions による送信処理
- Resend 経由の管理者通知と自動返信
- Zod バリデーション
- honeypot
- 送信速度チェック
- IPベースの簡易レート制限

### 4. SEO と AI 向け情報も持たせている

各ページに metadata と JSON-LD を持たせ、`llms.txt` も返している。

- ページ別 metadata
- OGP / Twitter Card
- WebSite / Organization / LocalBusiness / Service / FAQ / Breadcrumb の構造化データ
- `robots.ts`, `sitemap.ts`, Search Console 用 XML サイトマップ
- `llms.txt` による AI / LLM 向け要約情報

## 技術スタック

### フレームワーク

- Next.js 16
- React 19
- TypeScript

使っている理由:

- App Router でページ単位の metadata と構造化データ管理をしやすい
- Server Component と Client Component を分けやすい
- metadata や route handler をまとめやすい
- TypeScript により演出系の props や状態管理の破綻を抑えやすい

### スタイリング

- Tailwind CSS v4
- `tw-animate-css`
- `clsx`
- `tailwind-merge`

使っている理由:

- コンポーネント単位で見た目の責務を閉じやすい
- 実験的な演出スタイルでも差分管理しやすい
- ユーティリティベースで調整速度が速い

### アニメーション / スクロール

- GSAP
- ScrollTrigger
- Lenis

使っている理由:

- スクロールに連動した進行管理を安定させやすい
- PC の演出トップを細かく制御できる
- ただし SP では読み込みや処理を抑え、必要な場所に限定して使う

### フォーム / 通信

- Resend
- Zod

使っている理由:

- 問い合わせ送信をシンプルに実装しやすい
- Zod で入力条件を一元管理できる

### 分析 / 配信

- Vercel Analytics
- Google Tag Manager

使っている理由:

- 計測やタグ管理を後から見直しやすい
- GTM は初期描画を阻害しないよう遅延実行している

### パッケージ管理

- pnpm

使っている理由:

- 依存管理が速く、ローカル開発と CI の両方で扱いやすい

### フォント

- Noto Sans JP
- Barlow Condensed

採用理由:

- 本文の可読性と、英字の存在感を両立するため

## ファイル構成

このプロジェクトは「ページ入口」「表示コンポーネント」「データ」「共通ロジック」「型」を分けています。

```txt
app/
  layout.tsx
  page.tsx
  about/page.tsx
  works/page.tsx
  pricing/page.tsx
  contact/page.tsx
  privacy/page.tsx
  manifest.ts
  robots.ts
  sitemap.ts
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
  use-mobile.ts
  use-scroll-progress.ts
  use-scroll-scatter-progress.ts
  ...

lib/
  performance-mode.ts
  schema.ts
  scroll-manager.ts
  seo.ts
  structured-data.ts
  utils.ts
  shaders/

public/
  audio/
  images/

styles/
  globals.css

types/
  audio.ts
  component-props.ts
  home-page.ts
  navigation.ts
  seo.ts
  ...
```

## なぜこの構成にしているか

### `app/`

Next.js App Router の入口です。

- ルーティングを集約するため
- ページごとの metadata を近くに置けるため
- Server Component を素直に使えるため

### `components/pages/`

ページ固有の UI を置きます。

- `app/` を薄く保つため
- ページの見た目と演出の責務を分離するため
- ページごとに大きく育っても整理しやすいため

### `content/`

文言やカードデータなど、表示データをまとめます。

- UI コンポーネントから文言を引き剥がすため
- 実績や料金などの更新箇所を分かりやすくするため
- 将来的な CMS 化や差し替えに備えるため

### `lib/`

純粋関数や共通ロジックを置きます。

- SEO、構造化データ、バリデーション、パフォーマンス制御などを再利用するため
- UI からロジックを切り離すため

### `hooks/` と `contexts/`

状態共有やブラウザ依存処理をまとめます。

- スクロール、音声、トランジションなどの横断的な関心を分離するため

### `types/`

ページ固有の型と共通型を切り出します。

- アニメーション系 props の崩れを減らすため
- データ構造の変更時に影響範囲を追いやすくするため

## 主要ファイルと役割

### 全体の土台

- `app/layout.tsx`
  サイト全体の metadata、フォント、Provider、Navigation、PageTransition、GTM、Analytics を束ねます。

- `app/manifest.ts`
  PWA 用 manifest を返します。

- `lib/seo.ts`
  ページ別 metadata を組み立てる共通関数です。

- `lib/structured-data.ts`
  JSON-LD をまとめて生成します。

### トップページ

- `app/page.tsx`
  トップページの metadata と構造化データを定義する Server Component です。

- `components/pages/home-page.tsx`
  画面幅によって PC / SP のトップを切り替えます。

- `components/pages/home/home-desktop-page.tsx`
  PC 用の反転スクロールトップです。

- `components/pages/home/mobile-home-page.tsx`
  SP 用の軽量トップです。

### ナビゲーション / 遷移

- `components/navigation/navigation.tsx`
  ヘッダー、メニュー開閉、問い合わせ導線を制御します。

- `components/navigation/navigation-menu-overlay.tsx`
  全画面メニュー本体です。

- `components/layout/page-transition.tsx`
  ページ遷移の演出を制御します。

- `components/layout/transition-link.tsx`
  内部リンクの演出付き遷移を担当します。

### ローディング / 音声

- `components/loading/loading-screen.tsx`
  初回ローディングと音声選択 UI です。

- `contexts/audio-context.tsx`
  BGM 再生、停止、保存、生成音フォールバックを管理します。

### 問い合わせ

- `actions/contact.ts`
  問い合わせ送信のサーバー処理です。

- `lib/schema.ts`
  Zod による入力バリデーションです。

- `components/pages/contact/use-contact-form.ts`
  フォーム状態と送信 UI の制御です。

### パフォーマンス制御

- `components/deferred/deferred-visual-effects.tsx`
  重い視覚効果を遅延描画します。

- `components/deferred/deferred-site-widgets.tsx`
  SoundToggle や CookieConsent を idle 後に描画します。

- `hooks/use-deferred-render.ts`
  下層セクションや重いブロックを後から描画するための hook です。

- `lib/performance-mode.ts`
  小画面判定、fast start、idle task 制御の基盤です。

## 込み入った実装の解説

このサイトは、見た目の派手さに対して、内部の処理はできるだけ段階的に組んでいます。ここでは特に複雑な部分だけを抜き出して、「どう処理しているか」「どう構築しているか」「なぜそうしているか」をまとめます。

### 1. 反転スクロール

対象:

- `components/pages/home/home-inverted-scroll.tsx`
- `components/pages/home/use-inverted-scroll-animation.ts`
- `components/pages/home/home-desktop-page.tsx`

何をしているか:

- PC のトップページで、見た目上は下から上へセクションを遡るような体験を作っています
- 実際にはブラウザのスクロール方向を反転させているのではなく、固定されたビューポートの中でコンテンツ全体を `translate3d` で動かしています

どう構築しているか:

1. `HomeInvertedScroll` が全体のシーンを包むコンテナになる
2. `useInvertedScrollAnimation` で、最後のセクション位置を `heroOffset` として計測する
3. `sceneRef.getBoundingClientRect().top` を使って、現在どれだけスクロールしたかを進捗に変換する
4. その進捗から `translateY` を計算し、コンテンツ全体へ適用する
5. `ResizeObserver` と `requestAnimationFrame` で、遅れて読み込まれる下層セクションやレイアウト変化があっても再計測する

なぜこの形にしているか:

- ネイティブスクロールそのものを壊さずに、演出だけ反転っぽく見せたいから
- SEO やアクセシビリティのために、DOM 順序は自然なままにしたいから
- 動的 import されたセクションが後から入っても、計測をやり直せる構造が必要だから
- GSAP だけに依存せず、トップ専用の制御を比較的シンプルな算術で持ちたかったから

設計上のポイント:

- スクロールイベントでは直接重い計算をせず、`requestAnimationFrame` にまとめている
- 初回計測は `useLayoutEffect` と複数フレームの再計測で、画像や遅延描画のズレを吸収している
- シーン全体の高さは `calc(heroOffset + 100vh)` として持ち、スクロール可能量を見た目と一致させている

### 2. ローディングと音声選択

対象:

- `components/loading/loading-provider.tsx`
- `components/loading/loading-screen.tsx`
- `contexts/audio-context.tsx`

何をしているか:

- 初回訪問時にローディング画面を出し、進捗を見せた後に「音あり / 無音」を選ばせています
- 2回目以降や小画面では、体験を短くしてすぐ中へ入れるようにしています

どう構築しているか:

1. `LoadingProvider` が初回訪問かどうかを `sessionStorage` で判定する
2. SP では `shouldUseFastStart()` を見て、最初からローディングをほぼスキップする
3. 通常モードでは擬似的な進捗ステップを順番に進める
4. 途中で `document.fonts.ready` や `requestAnimationFrame` を待ち、描画の準備とテンポを合わせる
5. 読み込み完了後に音声選択を受け付ける
6. 音ありを押した場合は、画面の遷移を止めずに `startSound()` を非同期で走らせる
7. もし音源の読み込みや再生が失敗した場合は、`audio-context.tsx` 側で生成音へフォールバックする
8. 一定時間選択がなければ、自動で無音スタートに倒す

なぜこの形にしているか:

- ローディング演出を入れたい一方で、毎回長く待たせたくないから
- 音声再生の I/O を待って UI 全体を固めると、クリック後の気持ちよさが消えるから
- ブラウザの自動再生制限で MP3 が失敗しても、「音ありで始めたかった」という体験自体は壊したくないから
- セッション中に何度も同じ導入を見せる必要がないから

設計上のポイント:

- `localStorage` に音声設定、`sessionStorage` にローディング既読を分けて保持している
- ローディング中は `body` と `html` の `overflow` を止め、背景スクロールを防いでいる
- fast start 時は進捗 100%・無音開始を前提にし、SP の初期操作性を優先している

### 3. 遅延描画とパフォーマンス制御

対象:

- `components/deferred/deferred-visual-effects.tsx`
- `components/deferred/deferred-site-widgets.tsx`
- `hooks/use-deferred-render.ts`
- `lib/performance-mode.ts`

何をしているか:

- カスタムカーソル、粒子、オーブ、ヒートヘイズ、Cookie バナー、SoundToggle などを初期表示と分離しています
- 重要な本文や導線を先に表示し、装飾は後から足します

どう構築しているか:

- `scheduleIdleTask()` で `requestIdleCallback` が使える環境では idle 時間に処理する
- 非対応ブラウザでは `setTimeout` を使ってフォールバックする
- PC と SP の分岐は `isSmallScreen()` と `shouldUseFastStart()` に集約する
- 視覚効果は dynamic import で分け、描画タイミングそのものもさらに遅らせる

なぜこの形にしているか:

- 初期表示の JS と常駐エフェクトを同時に起動すると、TBT や体感速度が悪化しやすいから
- `requestIdleCallback` がある環境では、ユーザー操作を優先したあとに装飾を足せるから
- SP は画面も回線も CPU も厳しいことが多く、PC と同じ演出量を前提にしないほうが壊れにくいから

設計上のポイント:

- 「読める状態になること」を先に達成し、その後に「気持ちよくするもの」を積む順序にしている
- すべてを lazy import にするのではなく、さらに idle 待ちを挟んでいる
- これにより、見た目の豪華さと初期応答性のバランスを取っている

### 4. ページ遷移演出

対象:

- `contexts/transition-context.tsx`
- `components/layout/page-transition.tsx`
- `components/layout/transition-link.tsx`

何をしているか:

- 内部リンク遷移時に、オーバーレイと霧状のエフェクトを出しつつ、現ページを退場させて次ページへつないでいます

どう構築しているか:

1. `TransitionProvider` が遷移状態をグローバルに持つ
2. `navigateWithTransition()` が呼ばれると、まず `isTransitioning` を `true` にする
3. 退場アニメーション時間だけ待ってから `router.push()` する
4. `pathname` が変わったら、スクロール位置を先頭へ戻す
5. 入場アニメーション時間の経過後に `isTransitioning` を解除する
6. もしルート確定イベントを取りこぼしても固まらないよう、フォールバックタイマーも置いている

なぜこの形にしているか:

- Next.js の標準遷移だけでは、演出の開始点と終了点を細かく制御しにくいから
- 遷移中の二重クリックや二重 push を防ぎたいから
- ブラウザ戻るや通常遷移でも、前ページのスクロール位置を持ち越したくないから
- SP ではこの演出を軽く扱い、必要以上の変形や blur を抑えたいから

設計上のポイント:

- 遷移開始、`router.push()`、遷移完了を別フェーズとして扱っている
- 全ルートの prefetch も初期表示直後ではなく idle 後に少しずつ走らせている
- `PageTransition` 側は overlay の見た目に集中し、遷移の状態管理は `TransitionProvider` に寄せている

### 5. ローディング後の追加プリロード

対象:

- `components/loading/loading-provider.tsx`

何をしているか:

- 初回表示が終わったあと、さらに `text-reveal`、`scatter-text`、`scatter-block` などを idle 時間で先読みしています

なぜそうしているか:

- 最初から全部読むと初期表示が重くなる
- かといって必要になった瞬間に毎回初回ロードすると、演出の出始めが鈍る
- そこで、初回表示完了後の空いたタイミングを使って、次に使いそうな演出だけを静かに温めています

このサイト全体の考え方としては、「重いものを削る」よりも「必要な順に並べ替える」に近いです。反転スクロール、ローディング、遷移、常駐エフェクトのどれも、体験を残したまま初期負荷をずらす方向で組んでいます。

## 実装の考え方

### 1. `app/` は薄く、実体は `components/pages/` へ寄せる

理由:

- ルーティングと UI を混ぜないため
- metadata 管理と見た目実装を分離するため
- ページの肥大化を抑えるため

### 2. 文言やカード定義は `content/` に逃がす

理由:

- デザイナー視点でも編集しやすくするため
- UI ロジックとテキスト修正を切り分けるため

### 3. 演出は「最初から全部出さない」

理由:

- 初期表示を守るため
- モバイル端末での負荷を抑えるため
- 体験を壊さず、優先度の低い装飾を後ろへ送るため

### 4. 見た目が特殊でも HTML とアクセシビリティは崩さない

理由:

- テキストを SEO と支援技術で読めるように残すため
- ボタンやリンクを見た目だけの div にしないため

### 5. 本番運用に必要な情報は metadata と route に寄せる

理由:

- OGP、構造化データ、robots、sitemap、llms.txt をコードとして管理しやすいため

## 開発環境

メモ:

- Node.js: Next.js 16 が動作するバージョン
- pnpm

ローカル起動:

```bash
pnpm install
pnpm dev
```

起動後:

- `http://localhost:3000` を開く

よく使うコマンド:

```bash
pnpm dev
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm start
```

## 環境変数

今のところ必須なのは問い合わせメール送信に使う Resend のキーだけ。

`.env.local`

```env
RESEND_API_KEY=your_resend_api_key
```

参照箇所:

- `actions/contact.ts`

メモ:

- 環境変数未設定だと問い合わせ処理で落ちる
- ローカルで送信確認する場合も必要

## ローカル確認用メモ

- `/`
- `/about`
- `/works`
- `/pricing`
- `/contact`
- `/privacy`
- `/llms.txt`
- `/search-console-sitemap.xml`

見るポイント:

- PC / SP でトップ構成が切り替わるか
- Loading から音声選択まで自然につながるか
- ナビゲーションの開閉が壊れていないか
- 問い合わせフォームのエラー表示
- metadata、OGP、構造化データの破綻がないか

## ビルド確認

確認:

```bash
pnpm build
pnpm start
```

最低限見るコマンド:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## サーバーへ上げるときのメモ

このプロジェクトは Next.js の Node 実行が前提。静的 HTML をそのまま置く前提ではない。

### 1. Vercel に上げる場合

いちばん手間が少ない。App Router、route handler、Analytics との相性も良い。

流れ:

1. リポジトリを push する
2. Vercel に import する
3. 環境変数 `RESEND_API_KEY` を設定する
4. Framework Preset は Next.js のままでよい
5. デプロイする

デプロイ後に見ること:

- `/contact` から送信できるか
- `/llms.txt` が返るか
- `sitemap.xml` と `search-console-sitemap.xml` が見えるか
- OGP が正しく出るか

### 2. VPS / さくら / ConoHa / AWS EC2 などに上げる場合

Node.js が動くサーバーなら動かせる。静的 HTML ではなく Next.js アプリとして起動する。

基本:

```bash
pnpm install
pnpm build
pnpm start
```

`pnpm start` を直接叩きっぱなしにはしない。PM2 などで常駐化する前提。

よくある構成:

- Node.js
- pnpm
- PM2 などのプロセスマネージャ
- Nginx のリバースプロキシ
- HTTPS 証明書

例:

```bash
pnpm install --frozen-lockfile
pnpm build
PORT=3000 pnpm start
```

Nginx 側では 3000 番ポートへ流す想定。

#### VPS で必要なもの

- Node.js 実行環境
- pnpm
- `.env.local` もしくは本番環境変数
- 80 / 443 から Next.js プロセスへのリバースプロキシ
- 再起動時に自動復旧するプロセス管理

#### VPS でのメモ

- 画像や静的ファイルは `public/` 配下から配信される
- `RESEND_API_KEY` を本番環境へ必ず設定する
- メモリが小さいサーバーでは build 時間や build メモリを確認する
- GTM や外部配信の都合で CSP を追加する場合は影響範囲を確認する

### 3. 静的アップロードだけで済むか

問い合わせ送信や route handler を持っているので、単純な静的 HTML 書き出し前提ではない。

要点:

- FTP で HTML を置くだけの運用はそのままでは無理
- Node.js 実行環境を持つホスティングか、Vercel のような実行基盤が必要です

## サーバーへ上げるときの流れメモ

Vercel 以外に上げるときの流れメモ。

1. ローカルで `pnpm lint`、`pnpm exec tsc --noEmit`、`pnpm build` を通す
2. リポジトリをサーバーへ pull するか、CI から配備する
3. サーバー側で `pnpm install --frozen-lockfile` を実行する
4. `RESEND_API_KEY` を設定する
5. `pnpm build` を実行する
6. `pnpm start` を PM2 などで常駐化する
7. Nginx などでドメインを割り当てる
8. `/contact`、`/llms.txt`、`/sitemap.xml` を本番で確認する

## SEO / AI まわりのメモ

### metadata

- 共通 metadata は `app/layout.tsx`
- 各ページ metadata の組み立ては `lib/seo.ts`
- 各ページごとに title、description、keywords、canonical を設定

### 構造化データ

主に以下を使います。

- `WebSite`
- `Organization`
- `LocalBusiness`
- `Service`
- `FAQPage`
- `BreadcrumbList`
- 各ページ固有 schema

### AI 向け情報

- `app/llms.txt/route.ts` でプレーンテキストを返す
- 事業概要や主要ページの説明を持たせている

## パフォーマンス方針メモ

- 初期表示では LCP / FCP を優先する
- 重い装飾は後回しにする
- SP では PC と同じ演出を無理に再現しない
- Canvas / WebGL / 常駐ウィジェットは遅延描画する
- `prefers-reduced-motion` を意識する

### この方針を支える実装

- `components/deferred/deferred-visual-effects.tsx`
- `components/deferred/deferred-site-widgets.tsx`
- `hooks/use-deferred-render.ts`
- `lib/performance-mode.ts`
- Worker 付きの Canvas エフェクト

## アクセシビリティ方針メモ

- skip link を用意する
- キーボード操作でメニューを閉じられる
- フォームエラーを ARIA で伝える
- 装飾要素は可能な範囲で `aria-hidden` にする
- 見た目のために semantic HTML を崩しすぎない

## 開発時に忘れやすいこと

### 1. 演出の追加は必ず SP と初期表示を見る

PC で良く見えても、SP や低速端末ではコストが高いことがあります。

### 2. `content/` と UI を混ぜすぎない

文言更新だけでコンポーネントを触らなくて済む状態をできるだけ保ちます。

### 3. 内部リンクは基本的に `TransitionLink` を使う

ページ遷移演出との整合を保つためです。

### 4. SEO 関連はページ追加時にまとめて足す

新規ページを作る場合は、以下を同時に考えます。

- metadata
- JSON-LD
- sitemap 反映
- 必要なら llms.txt 上の説明見直し

### 5. 問い合わせ周りは静的ページ扱いしない

Server Actions と環境変数が絡むので、ホスティング条件を確認する。

## 現在の実装で気をつけること

- `next.config.mjs` では `typescript.ignoreBuildErrors` を有効にしています
- build は通しやすくなるが、型エラーで止まらない
- 型は `pnpm exec tsc --noEmit` を別で必ず見る

## 更新時チェック

- 実績や料金を更新したら `content/` 側だけで済むか確認する
- 画像追加時は未使用画像を残しすぎない
- OGP 変更時は `public/ogp.jpg` と metadata を確認する
- ページ追加時は metadata と構造化データも確認する
- 問い合わせ文面変更時は管理者通知と自動返信の両方を見る
- 演出追加時は SP 表示とパフォーマンスを確認する

## 最後に

人に読ませるための README ではなく、自分があとで構成と意図を思い出すためのメモとして更新していく。
