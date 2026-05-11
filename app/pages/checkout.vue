<script setup lang="ts">
import { loadStripe, type Stripe, type StripeCardElement } from '@stripe/stripe-js'

const config = useRuntimeConfig()
const cartStore = useCartStore()

if (cartStore.items.length === 0) {
  await navigateTo('/cart')
}

// ステップ管理: shipping → payment → complete
const step = ref<'shipping' | 'payment' | 'complete'>('shipping')
const form = reactive({ name: '', email: '', address: '' })

// Stripe
let stripe: Stripe | null = null
let cardElement: StripeCardElement | null = null
const processing = ref(false)
const paymentError = ref('')

const initStripe = async () => {
  stripe = await loadStripe(config.public.stripePublishableKey)
  if (!stripe) return
  const elements = stripe.elements()
  cardElement = elements.create('card', {
    style: {
      base: { fontSize: '15px', color: '#374151', '::placeholder': { color: '#9ca3af' } },
      invalid: { color: '#ef4444' },
    },
  })
  await nextTick()
  cardElement.mount('#card-element')
}

const proceedToPayment = async () => {
  step.value = 'payment'
  await initStripe()
}

const placeOrder = async () => {
  if (!stripe || !cardElement) return
  processing.value = true
  paymentError.value = ''

  try {
    const { clientSecret } = await $fetch<{ clientSecret: string }>('/api/create-payment-intent', {
      method: 'POST',
      body: { amount: cartStore.totalPrice },
    })

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { name: form.name, email: form.email },
      },
    })

    if (error) {
      paymentError.value = error.message ?? '決済エラーが発生しました'
    } else if (paymentIntent?.status === 'succeeded') {
      cartStore.clearCart()
      step.value = 'complete'
    }
  } catch {
    paymentError.value = '決済処理中にエラーが発生しました'
  } finally {
    processing.value = false
  }
}

useHead({ title: '注文手続き – ShopWave' })
</script>

<template>
  <div class="mx-auto max-w-xl py-10">

    <!-- ステップ1: 配送情報 -->
    <div v-if="step === 'shipping'">
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

      <form class="mt-6 space-y-4" @submit.prevent="proceedToPayment">
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
          お支払いへ →
        </button>
      </form>
    </div>

    <!-- ステップ2: Stripe 決済 -->
    <div v-else-if="step === 'payment'">
      <button @click="step = 'shipping'" class="mb-6 flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600">
        ← 配送情報に戻る
      </button>
      <h1 class="text-2xl font-bold text-gray-900">お支払い情報</h1>

      <!-- テストカードのヒント -->
      <div class="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <strong>デモ用テストカード:</strong> 4242 4242 4242 4242 ／ 有効期限: 任意の将来日付 ／ CVC: 任意の3桁
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="placeOrder">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">カード情報</label>
          <div id="card-element" class="rounded-lg border border-gray-300 px-3 py-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500" />
        </div>

        <p v-if="paymentError" class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {{ paymentError }}
        </p>

        <button
          type="submit"
          :disabled="processing"
          class="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ processing ? '処理中...' : `$${cartStore.totalPrice.toFixed(2)} を支払う` }}
        </button>
      </form>

      <p class="mt-4 text-center text-xs text-gray-400">
        🔒 Stripe による安全な決済
      </p>
    </div>

    <!-- ステップ3: 完了画面 -->
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
