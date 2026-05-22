# Components Directory Guide

`components/` は見た目の責務を置く場所ですが、全部を同じ粒度で並べると追いづらくなるので、用途ごとに入口を分けています。

このディレクトリでは、まず「その UI がどこまでの責務を持つか」で置き場所を決めます。

## 置き場所のルール

### `components/pages/`

ページ固有の組み立てを置きます。

- そのページでしか使わない Hero や section 群
- ページ全体の並び順や構成
- そのページ専用の補助コンポーネント

例:

- `pages/home/`
- `pages/works/`
- `about-page.tsx`
- `works-page.tsx`

判断基準:

- 別ページで再利用しない
- URL 単位の見た目に強く依存している
- `app/` から直接呼ばれるページ実体に近い

### `components/sections/`

複数ページで再利用しやすい、やや大きめの section 単位 UI を置きます。

- CTA
- services 一覧
- 汎用 hero 風セクション
- marquee のような共通演出セクション

例:

- `cta-section-v2.tsx`
- `hero-section-v2.tsx`
- `services-section-v2.tsx`

判断基準:

- セクション単位で完結している
- ページ固有データを強く持たない
- 複数ページへ横展開しやすい

### `components/ui/`

小さく再利用する土台パーツを置きます。

- button
- 汎用 interactive primitive
- 見た目の最小単位

例:

- `circle-button.tsx`
- `magnetic-button.tsx`

判断基準:

- 単体で意味が小さい
- セクションやページの内側で部品として使う
- データやページ文脈をほぼ持たない

### `components/widgets/`

サイト全体で常駐する小機能を置きます。

- cookie consent
- sound toggle
- 常時表示される補助 UI

例:

- `cookie-consent.tsx`
- `sound-toggle.tsx`

判断基準:

- ページの本文ではない
- 単独機能として浮いて存在する
- 複数ページまたは全ページで見える

### `components/layout/`

サイト全体の枠組みを置きます。

- navigation 以外の共通レイアウト
- transition
- footer
- smooth scroll
- 全体挙動の補助

例:

- `page-transition.tsx`
- `transition-link.tsx`
- `footer.tsx`
- `auto-japanese-line-breaks.tsx`

判断基準:

- ページ本文よりもサイト全体の器に近い
- 全ページ共通で効く
- route 跨ぎの挙動を持つ

### `components/navigation/`

ヘッダー、メニュー、ナビゲーション演出を置きます。

例:

- `navigation.tsx`
- `navigation-menu-overlay.tsx`
- `use-header-intro-animation.ts`

判断基準:

- ナビ導線が主責務
- layout 配下に混ぜると探索対象が広がりすぎる

### `components/motion/`

表示演出として横断再利用する motion 系パーツを置きます。

例:

- `scatter-text.tsx`
- `scatter-block.tsx`
- `text-reveal.tsx`

判断基準:

- 複数ページで使える演出 primitive
- 中身は演出ロジック中心で、ページ文脈を持たない

### `components/effects/`

Canvas や WebGL を含む重めの視覚効果を置きます。

例:

- `bottom-heat-haze.tsx`
- `floating-particles.tsx`
- `privacy-background.tsx`

判断基準:

- 装飾効果が主目的
- 再利用より effect の種類で管理した方が分かりやすい

### `components/loading/`

ローディング体験専用の UI と provider を置きます。

例:

- `loading-provider.tsx`
- `loading-screen.tsx`

### `components/deferred/`

初期表示後に遅延マウントする束ね役を置きます。

例:

- `deferred-site-widgets.tsx`
- `deferred-visual-effects.tsx`

ここには「後からまとめて読むもの」を置き、個別 effect 本体は `effects/` や各機能側に置きます。

## 迷ったときの優先順位

1. その UI は 1 ページ専用か。
   専用なら `pages/`。
2. 複数ページで使う section として成立するか。
   成立するなら `sections/`。
3. もっと小さい部品か。
   部品なら `ui/`。
4. 本文ではなく独立機能か。
   それなら `widgets/`。
5. サイト全体の枠組みか。
   それなら `layout/` か `navigation/`。
6. 主役が演出か。
   それなら `motion/` または `effects/`。

## 今後の整理ルール

- `pages/` の中に、他ページでも使う section を増やしすぎない
- 再利用が始まったら `sections/` か `ui/` へ上げる
- stateful なロジックは `hooks/`、純粋な設定値やデータは `lib/` へ出す
- `components` には「表示責務」を残し、ビジネスロジックは寄せすぎない