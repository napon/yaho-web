"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProducts, type Product } from "@/components/product-context"

type ProductModalProps = {
  open: boolean
  onClose: () => void
  product: Product | null
}

export default function ProductModal({ open, onClose, product }: ProductModalProps) {
  const { addProduct, updateProduct } = useProducts()
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    description: "",
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price.toString(),
        description: product.description || "",
      })
    } else {
      setFormData({
        name: "",
        sku: "",
        category: "",
        price: "",
        description: "",
      })
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: Number.parseFloat(formData.price) || 0,
      description: formData.description,
    }

    if (product) {
      updateProduct({ ...productData, id: product.id })
    } else {
      addProduct(productData)
    }

    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} placeholder="Enter SKU" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={handleCategoryChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
                <SelectItem value="Appliances">Appliances</SelectItem>
                <SelectItem value="Fitness">Fitness</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">{product ? "Update" : "Submit"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
