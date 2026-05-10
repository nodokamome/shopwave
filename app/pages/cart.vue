<script setup lang="ts">
const cartStore = useCartStore()
useHead({ title: 'カート – ShopWave' })
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900">カート</h1>

    <div v-if="cartStore.items.length === 0" class="mt-20 text-center">
      <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9" />
      </svg>
      <p class="mt-4 text-gray-500">カートは空です</p>
      <NuxtLink to="/" class="mt-4 inline-block rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700">
        買い物を続ける
      </NuxtLink>
    </div>

    <div v-else class="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- アイテム一覧 -->
      <div class="space-y-4 lg:col-span-2">
        <div
          v-for="item in cartStore.items"
          :key="item.product.id"
          class="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4"
        >
          <img :src="item.product.thumbnail" :alt="item.product.title" class="h-24 w-24 flex-shrink-0 rounded-xl object-contain bg-gray-50 p-2" />
          <div class="flex flex-1 flex-col justify-between">
            <div>
              <NuxtLink :to="`/products/${item.product.id}`" class="font-semibold text-gray-800 hover:text-indigo-600 line-clamp-1">
                {{ item.product.title }}
              </NuxtLink>
              <p class="text-sm text-gray-500">${{ item.product.price.toFixed(2) }}</p>
            </div>
            <div class="flex items-center justify-between">
              <!-- 数量 -->
              <div class="flex items-center gap-2">
                <button
                  @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                  class="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600"
                >−</button>
                <span class="w-6 text-center text-sm font-medium">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                  class="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600"
                >＋</button>
              </div>
              <div class="flex items-center gap-4">
                <span class="font-bold text-gray-900">${{ (item.product.price * item.quantity).toFixed(2) }}</span>
                <button @click="cartStore.removeFromCart(item.product.id)" class="text-gray-400 hover:text-red-500" aria-label="削除">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 合計 -->
      <div class="rounded-2xl border border-gray-200 bg-white p-6 h-fit sticky top-24">
        <h2 class="text-lg font-bold text-gray-800">注文サマリー</h2>
        <div class="mt-4 space-y-2 text-sm text-gray-600">
          <div class="flex justify-between">
            <span>小計 ({{ cartStore.totalItems }} 点)</span>
            <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>送料</span>
            <span class="text-emerald-600">無料</span>
          </div>
        </div>
        <div class="mt-4 border-t border-gray-200 pt-4 flex justify-between font-bold text-gray-900">
          <span>合計</span>
          <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
        <NuxtLink
          to="/checkout"
          class="mt-6 block w-full rounded-xl bg-indigo-600 py-3 text-center text-white font-semibold hover:bg-indigo-700 transition-colors"
        >
          注文手続きへ →
        </NuxtLink>
        <NuxtLink to="/" class="mt-3 block text-center text-sm text-gray-500 hover:text-indigo-600">
          買い物を続ける
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
