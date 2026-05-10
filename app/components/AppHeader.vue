<script setup lang="ts">
const cartStore = useCartStore()
const query = ref('')
const router = useRouter()

const search = () => {
  if (query.value.trim()) {
    router.push({ path: '/', query: { q: query.value.trim() } })
  }
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <NuxtLink to="/" class="text-2xl font-bold text-indigo-600">ShopWave</NuxtLink>

      <!-- 検索 -->
      <form class="hidden w-80 md:block" @submit.prevent="search">
        <div class="relative">
          <input
            v-model="query"
            type="search"
            placeholder="商品を検索..."
            class="w-full rounded-full border border-gray-300 py-2 pl-4 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
            aria-label="検索"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
        </div>
      </form>

      <!-- カート -->
      <NuxtLink to="/cart" class="relative flex items-center gap-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9" />
        </svg>
        カート
        <span
          v-if="cartStore.totalItems > 0"
          class="ml-1 rounded-full bg-white px-1.5 py-0.5 text-xs font-bold text-indigo-600"
        >
          {{ cartStore.totalItems }}
        </span>
      </NuxtLink>
    </div>
  </header>
</template>
