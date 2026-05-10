<script setup lang="ts">
import type { Product } from '~/types'

const props = defineProps<{ product: Product }>()
const cartStore = useCartStore()
const inCart = computed(() => cartStore.isInCart(props.product.id))

const handleCart = () => {
  if (!inCart.value) cartStore.addToCart(props.product)
}
</script>

<template>
  <NuxtLink :to="`/products/${product.id}`" class="group block rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
    <!-- 画像 -->
    <div class="relative overflow-hidden bg-gray-50 aspect-square">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <span
        v-if="product.discountPercentage >= 10"
        class="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white"
      >
        -{{ Math.round(product.discountPercentage) }}%
      </span>
    </div>

    <!-- 情報 -->
    <div class="p-4">
      <p class="text-xs text-indigo-500 font-medium uppercase tracking-wide">{{ product.category }}</p>
      <h3 class="mt-1 text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">{{ product.title }}</h3>

      <!-- 評価 -->
      <div class="mt-2 flex items-center gap-1">
        <svg v-for="i in 5" :key="i" class="h-3.5 w-3.5" :class="i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span class="text-xs text-gray-500">{{ product.rating.toFixed(1) }}</span>
      </div>

      <!-- 価格 + カートボタン -->
      <div class="mt-3 flex items-center justify-between">
        <span class="text-lg font-bold text-gray-900">${{ product.price.toFixed(2) }}</span>
        <button
          @click.prevent="handleCart"
          :class="inCart
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'"
          class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
        >
          {{ inCart ? '✓ 追加済み' : 'カートへ' }}
        </button>
      </div>
    </div>
  </NuxtLink>
</template>
