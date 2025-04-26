"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

export type Product = {
  id: number
  name: string
  sku: string
  category: string
  price: number
  description?: string
}

type ProductContextType = {
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (product: Product) => void
  deleteProduct: (id: number) => void
  searchProducts: (query: string, category?: string) => Product[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search: (query: string) => Promise<any>
}


const initialProducts: Product[] = [
  { id: 1, name: "Wireless Earbuds", sku: "WE001", category: "Electronics", price: 99.99 },
  { id: 2, name: "Smart Watch", sku: "SW002", category: "Electronics", price: 199.99 },
  { id: 3, name: "Laptop Bag", sku: "LB003", category: "Accessories", price: 49.99 },
  { id: 4, name: "Coffee Maker", sku: "CM004", category: "Appliances", price: 79.99 },
  { id: 5, name: "Yoga Mat", sku: "YM005", category: "Fitness", price: 29.99 },
]

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)

  const addProduct = (product: Omit<Product, "id">) => {
    const newId = Math.max(0, ...products.map((p) => p.id)) + 1
    setProducts([...products, { ...product, id: newId }])
  }

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
  }

  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const searchProducts = (query: string, category?: string) => {
    return products.filter((product) => {
      const matchesQuery =
        query === "" ||
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.sku.toLowerCase().includes(query.toLowerCase())

      const matchesCategory =
        !category || category === "all" || product.category.toLowerCase() === category.toLowerCase()

      return matchesQuery && matchesCategory
    })
  }

  const search = async(query: string) => {
    const response = await fetch("/api/search?query=" + query)
    const data = await response.json()
    return data
  }
  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, searchProducts, search }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
