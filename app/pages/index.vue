<script setup lang="ts">
const route = useRoute()
const { fetchProducts, fetchCategories } = useProducts()

const limit = 12
const skip = ref(0)
const activeCategory = ref('すべて')
const searchQuery = computed(() => route.query.q as string | undefined)

// カテゴリ変更時はページリセット
const selectCategory = (cat: string) => {
  activeCategory.value = cat
  skip.value = 0
}

// カテゴリ一覧
const { data: categoriesRaw } = await fetchCategories()
const categories = computed(() =>
  (categoriesRaw.value ?? []).map((c: string | { slug: string; name: string }) =>
    typeof c === 'string' ? c : c.slug
  )
)

// 商品一覧
const params = computed(() => ({
  limit,
  skip: skip.value,
  ...(searchQuery.value ? { q: searchQuery.value } : activeCategory.value !== 'すべて' ? { category: activeCategory.value } : {}),
}))

const { data, pending, refresh } = await fetchProducts(params.value)

watch([params], () => refresh(), { deep: true })

const products = computed(() => data.value?.products ?? [])
const total = computed(() => data.value?.total ?? 0)

useHead({ title: 'ShopWave – 商品一覧' })
</script>

<template>
  <div>
    <!-- ヒーロー -->
    <section class="mb-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-14 text-white">
      <h1 class="text-4xl font-bold leading-tight">新しい買い物体験を、<br />あなたに。</h1>
      <p class="mt-3 text-indigo-100">人気の商品を今すぐチェック</p>
    </section>

    <!-- フィルター -->
    <div class="mb-6 flex flex-wrap items-center gap-3">
      <button
        v-for="cat in ['すべて', ...categories]"
        :key="cat"
        @click="selectCategory(cat)"
        :class="activeCategory === cat
          ? 'bg-indigo-600 text-white'
          : 'bg-white text-gray-600 hover:bg-indigo-50 border border-gray-300'"
        class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors capitalize"
      >
        {{ cat }}
      </button>
    </div>

    <!-- 検索中バナー -->
    <div v-if="searchQuery" class="mb-4 flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-3">
      <p class="text-sm text-indigo-700">「{{ searchQuery }}」の検索結果 — {{ total }} 件</p>
      <NuxtLink to="/" class="text-xs text-indigo-500 hover:underline">クリア</NuxtLink>
    </div>

    <!-- グリッド -->
    <div v-if="pending" class="grid grid-cols-2 gap-5 md:grid-cols-4">
      <div v-for="i in 8" :key="i" class="aspect-[3/4] animate-pulse rounded-2xl bg-gray-200" />
    </div>
    <div v-else-if="products.length === 0" class="py-20 text-center text-gray-500">
      商品が見つかりませんでした
    </div>
    <div v-else class="grid grid-cols-2 gap-5 md:grid-cols-4">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>

    <!-- ページネーション -->
    <div v-if="total > limit" class="mt-10 flex justify-center gap-3">
      <button
        :disabled="skip === 0"
        @click="skip = Math.max(0, skip - limit)"
        class="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40 hover:bg-gray-50"
      >
        ← 前へ
      </button>
      <span class="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600">
        {{ skip / limit + 1 }} / {{ Math.ceil(total / limit) }}
      </span>
      <button
        :disabled="skip + limit >= total"
        @click="skip += limit"
        class="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-40 hover:bg-gray-50"
      >
        次へ →
      </button>
    </div>
  </div>
</template>
