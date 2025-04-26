"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useProducts, type Product } from "@/components/product-context"
import { Search } from "lucide-react"
import { Button } from "./ui/button"

export default function SearchProducts() {
  const { search } = useProducts()
  const [searchQuery, setSearchQuery] = useState("")

  const [results, setResults] = useState<Product[]>([])

  const runSearch = async() => {
    const filteredProducts = await search(searchQuery)
    const products: Product[] = filteredProducts.map((product: any) => ({
      id: product.id,
      name: product.document.structData.productName
    }));
    setResults(products);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={runSearch}>Search</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.sku || 'N/A'}</TableCell>
                <TableCell>{product.category || 'N/A'}</TableCell>
                <TableCell>${product.price?.toFixed(2) || 'N/A'}</TableCell>
              </TableRow>
            ))}
            {results.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No products found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
