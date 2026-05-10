<script setup lang="ts">
const cartStore = useCartStore()
const router = useRouter()
const submitted = ref(false)
const form = reactive({ name: '', email: '', address: '' })

if (cartStore.items.length === 0 && !submitted.value) {
  await navigateTo('/cart')
}

const placeOrder = () => {
  submitted.value = true
  cartStore.clearCart()
}

useHead({ title: '注文手続き – ShopWave' })
</script>

<template>
  <div class="mx-auto max-w-xl py-10">
    <div v-if="!submitted">
      <h1 class="text-2xl font-bold text-gray-900">注文手続き</h1>

      <div class="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 class="font-semibold text-gray-800 mb-4">注文内容確認</h2>
        <div v-for="item in cartStore.items" :key="item.product.id" class="flex justify-between py-2 text-sm border-b border-gray-100 last:border-0">
          <span class="text-gray-700 line-clamp-1 flex-1 pr-4">{{ item.product.title }} × {{ item.quantity }}</span>
          <span class="font-medium">${{ (item.product.price * item.quantity).toFixed(2) }}</span>
        </div>
        <div class="mt-4 flex justify-between font-bold text-gray-900">
          <span>合計</span>
          <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="placeOrder">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">お名前</label>
          <input v-model="form.name" type="text" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="山田 太郎" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
          <input v-model="form.email" type="email" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="example@email.com" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">配送先住所</label>
          <input v-model="form.address" type="text" required class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="東京都渋谷区..." />
        </div>
        <button type="submit" class="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 transition-colors">
          注文を確定する
        </button>
      </form>
    </div>

    <!-- 完了画面 -->
    <div v-else class="py-20 text-center">
      <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
        <svg class="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="mt-6 text-2xl font-bold text-gray-900">注文完了！</h2>
      <p class="mt-2 text-gray-500">ご注文ありがとうございます。</p>
      <NuxtLink to="/" class="mt-8 inline-block rounded-xl bg-indigo-600 px-8 py-3 text-white font-semibold hover:bg-indigo-700">
        ショッピングを続ける
      </NuxtLink>
    </div>
  </div>
</template>
