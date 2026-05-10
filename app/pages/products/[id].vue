<script setup lang="ts">
const route = useRoute()
const { fetchProduct } = useProducts()
const cartStore = useCartStore()

const id = Number(route.params.id)
const { data: product, pending } = await fetchProduct(id)

const activeImage = ref(product.value?.thumbnail ?? '')
watch(product, (p) => { if (p) activeImage.value = p.thumbnail })

const inCart = computed(() => cartStore.isInCart(id))
const handleCart = () => {
  if (product.value && !inCart.value) cartStore.addToCart(product.value)
}

useHead({ title: computed(() => product.value ? `${product.value.title} – ShopWave` : 'ShopWave') })
</script>

<template>
  <div v-if="pending" class="animate-pulse space-y-6">
    <div class="h-96 rounded-2xl bg-gray-200" />
    <div class="h-8 w-1/2 rounded bg-gray-200" />
  </div>

  <div v-else-if="product">
    <!-- パンくず -->
    <nav class="mb-6 flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-indigo-600">ホーム</NuxtLink>
      <span>/</span>
      <NuxtLink :to="`/?category=${product.category}`" class="capitalize hover:text-indigo-600">{{ product.category }}</NuxtLink>
      <span>/</span>
      <span class="text-gray-800">{{ product.title }}</span>
    </nav>

    <div class="grid grid-cols-1 gap-12 md:grid-cols-2">
      <!-- 画像 -->
      <div class="rounded-2xl border border-gray-200 bg-white p-8 flex items-center justify-center aspect-square">
        <img :src="activeImage" :alt="product.title" class="max-h-80 w-full object-contain" />
      </div>

      <!-- サムネイル -->
      <div class="flex flex-col justify-between">
        <div>
          <span class="text-xs font-medium uppercase tracking-wide text-indigo-500">{{ product.category }}</span>
          <h1 class="mt-2 text-3xl font-bold text-gray-900">{{ product.title }}</h1>
          <p class="mt-1 text-sm text-gray-500">by {{ product.brand }}</p>

          <!-- 評価 -->
          <div class="mt-3 flex items-center gap-2">
            <div class="flex">
              <svg v-for="i in 5" :key="i" class="h-5 w-5" :class="i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span class="text-sm text-gray-600">{{ product.rating.toFixed(1) }} / 5.0</span>
          </div>

          <p class="mt-4 text-gray-600 leading-relaxed">{{ product.description }}</p>

          <!-- サムネイル一覧 -->
          <div class="mt-6 flex gap-2">
            <button
              v-for="img in product.images.slice(0, 4)"
              :key="img"
              @click="activeImage = img"
              :class="activeImage === img ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-200'"
              class="h-16 w-16 overflow-hidden rounded-lg bg-white p-1"
            >
              <img :src="img" :alt="product.title" class="h-full w-full object-contain" />
            </button>
          </div>
        </div>

        <!-- 価格・カート -->
        <div class="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div class="flex items-end justify-between">
            <div>
              <p class="text-4xl font-bold text-gray-900">${{ product.price.toFixed(2) }}</p>
              <p v-if="product.discountPercentage >= 5" class="mt-1 text-sm text-red-500">
                {{ Math.round(product.discountPercentage) }}% OFF
              </p>
            </div>
            <p class="text-sm text-gray-500">在庫: {{ product.stock }} 個</p>
          </div>

          <button
            @click="handleCart"
            :disabled="product.stock === 0"
            :class="inCart
              ? 'bg-emerald-500 hover:bg-emerald-600'
              : 'bg-indigo-600 hover:bg-indigo-700'"
            class="mt-4 w-full rounded-xl py-3 text-white font-semibold transition-colors disabled:opacity-50"
          >
            {{ product.stock === 0 ? '在庫切れ' : inCart ? '✓ カートに追加済み' : 'カートへ追加' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="py-20 text-center text-gray-500">
    商品が見つかりませんでした。
    <NuxtLink to="/" class="block mt-4 text-indigo-600 hover:underline">ホームへ戻る</NuxtLink>
  </div>
</template>
