import { defineStore } from 'pinia'
import type { CartItem, Product } from '~/types'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),

    totalPrice: (state) =>
      state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),

    isInCart: (state) => (productId: number) =>
      state.items.some((item) => item.product.id === productId),
  },

  actions: {
    addToCart(product: Product) {
      const existing = this.items.find((i) => i.product.id === product.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ product, quantity: 1 })
      }
    },

    removeFromCart(productId: number) {
      this.items = this.items.filter((i) => i.product.id !== productId)
    },

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find((i) => i.product.id === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId)
        } else {
          item.quantity = quantity
        }
      }
    },

    clearCart() {
      this.items = []
    },
  },
})
