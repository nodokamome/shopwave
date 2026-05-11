# ShopWave

![CI](https://github.com/nodokamome/shopwave/actions/workflows/ci.yml/badge.svg)
![Nuxt](https://img.shields.io/badge/Nuxt-3-00DC82?logo=nuxtdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

Nuxt 3 製のモダン EC サイトデモです。外部 API から商品データを取得し、カート機能・チェックアウトフローを実装しています。

**🔗 [デモを見る → shopwave-rho.vercel.app](https://shopwave-rho.vercel.app/)**

## Features

- **商品一覧** — カテゴリフィルター・ページネーション・キーワード検索
- **商品詳細** — 画像ギャラリー・評価・在庫表示
- **カート** — 数量変更・削除・合計金額計算
- **チェックアウト** — 配送情報入力 → Stripe 決済 → 完了画面
- **Stripe 決済** — Stripe Elements によるクレジットカード決済（テストモード対応）
- **永続化** — Pinia + localStorage でカートを保持
- **SEO対応** — `useHead` でページごとにメタデータ設定

## Tech Stack

| Category | Library |
|----------|---------|
| Framework | [Nuxt 3](https://nuxt.com/) (Nuxt 4 compat) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | [Pinia](https://pinia.vuejs.org/) + persist |
| Data | [dummyjson.com](https://dummyjson.com/) |
| Payment | [Stripe](https://stripe.com/) (Elements + PaymentIntents API) |
| Testing | [Vitest](https://vitest.dev/) |
| CI | GitHub Actions |

## Architecture

```
app/
├── pages/
│   ├── index.vue           # 商品一覧（検索・フィルター・ページネーション）
│   ├── products/[id].vue   # 商品詳細
│   ├── cart.vue            # カート
│   └── checkout.vue        # チェックアウト
├── components/
│   ├── AppHeader.vue       # ヘッダー（検索バー・カートリンク）
│   └── ProductCard.vue     # 商品カード
├── composables/
│   └── useProducts.ts      # API取得ロジック
├── stores/
│   └── cart.ts             # Pinia カートStore
└── types/
    └── index.ts            # 共通型定義
tests/
└── cart.test.ts            # カートStore ユニットテスト
```

## Getting Started

```bash
git clone https://github.com/nodokamome/shopwave.git
cd shopwave
npm install
```

`.env` を作成して Stripe テストキーを設定します（[Stripe ダッシュボード](https://dashboard.stripe.com/test/apikeys) で取得）:

```env
NUXT_STRIPE_SECRET_KEY=sk_test_...
NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。

> **デモ用テストカード:** `4242 4242 4242 4242` ／ 有効期限: 任意の将来日付 ／ CVC: 任意の3桁

## Testing

```bash
npm run test
```

## License

MIT


## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
