// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  runtimeConfig: {
    stripeSecretKey: '',
    public: {
      apiBase: 'https://dummyjson.com',
      stripePublishableKey: '',
    },
  },
  app: {
    head: {
      title: 'ShopWave',
      meta: [
        { name: 'description', content: 'Nuxt 3 製のモダン EC サイトデモ' },
      ],
    },
  },
})
