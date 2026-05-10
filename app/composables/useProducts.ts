import type { Product, ProductsResponse } from '~/types'

export const useProducts = () => {
  const config = useRuntimeConfig()
  const base = config.public.apiBase

  const fetchProducts = (params?: { limit?: number; skip?: number; category?: string; q?: string }) => {
    let url = `${base}/products`
    if (params?.q) {
      url = `${base}/products/search?q=${encodeURIComponent(params.q)}&limit=${params.limit ?? 20}&skip=${params.skip ?? 0}`
    } else if (params?.category) {
      url = `${base}/products/category/${encodeURIComponent(params.category)}?limit=${params.limit ?? 20}&skip=${params.skip ?? 0}`
    } else {
      url = `${base}/products?limit=${params?.limit ?? 20}&skip=${params?.skip ?? 0}`
    }
    return useFetch<ProductsResponse>(url, { key: url })
  }

  const fetchProduct = (id: number) =>
    useFetch<Product>(`${base}/products/${id}`, { key: `product-${id}` })

  const fetchCategories = () =>
    useFetch<string[]>(`${base}/products/categories`, { key: 'categories' })

  return { fetchProducts, fetchProduct, fetchCategories }
}
