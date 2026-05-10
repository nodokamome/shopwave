import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '~/stores/cart'
import type { Product } from '~/types'

const mockProduct = (id: number, price: number): Product => ({
  id,
  title: `Product ${id}`,
  description: 'desc',
  price,
  discountPercentage: 0,
  rating: 4.0,
  stock: 10,
  brand: 'Brand',
  category: 'test',
  thumbnail: 'https://example.com/img.jpg',
  images: [],
})

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('初期状態はカートが空', () => {
    const cart = useCartStore()
    expect(cart.items).toHaveLength(0)
    expect(cart.totalItems).toBe(0)
    expect(cart.totalPrice).toBe(0)
  })

  it('商品をカートに追加できる', () => {
    const cart = useCartStore()
    cart.addToCart(mockProduct(1, 100))
    expect(cart.items).toHaveLength(1)
    expect(cart.totalItems).toBe(1)
    expect(cart.totalPrice).toBe(100)
  })

  it('同じ商品を追加すると数量が増える', () => {
    const cart = useCartStore()
    cart.addToCart(mockProduct(1, 100))
    cart.addToCart(mockProduct(1, 100))
    expect(cart.items).toHaveLength(1)
    expect(cart.totalItems).toBe(2)
    expect(cart.totalPrice).toBe(200)
  })

  it('数量を更新できる', () => {
    const cart = useCartStore()
    cart.addToCart(mockProduct(1, 50))
    cart.updateQuantity(1, 3)
    expect(cart.totalItems).toBe(3)
    expect(cart.totalPrice).toBe(150)
  })

  it('数量を0にすると削除される', () => {
    const cart = useCartStore()
    cart.addToCart(mockProduct(1, 50))
    cart.updateQuantity(1, 0)
    expect(cart.items).toHaveLength(0)
  })

  it('商品をカートから削除できる', () => {
    const cart = useCartStore()
    cart.addToCart(mockProduct(1, 100))
    cart.addToCart(mockProduct(2, 200))
    cart.removeFromCart(1)
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].product.id).toBe(2)
  })

  it('isInCart が正しく動作する', () => {
    const cart = useCartStore()
    cart.addToCart(mockProduct(1, 100))
    expect(cart.isInCart(1)).toBe(true)
    expect(cart.isInCart(2)).toBe(false)
  })

  it('カートをクリアできる', () => {
    const cart = useCartStore()
    cart.addToCart(mockProduct(1, 100))
    cart.addToCart(mockProduct(2, 200))
    cart.clearCart()
    expect(cart.items).toHaveLength(0)
    expect(cart.totalPrice).toBe(0)
  })

  it('複数商品の合計金額が正しい', () => {
    const cart = useCartStore()
    cart.addToCart(mockProduct(1, 100))
    cart.addToCart(mockProduct(2, 250))
    cart.updateQuantity(1, 2)
    // 100 * 2 + 250 * 1 = 450
    expect(cart.totalPrice).toBe(450)
    expect(cart.totalItems).toBe(3)
  })
})
