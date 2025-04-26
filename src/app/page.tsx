import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DirectoryUpload from "@/components/directory-upload"
import ProductListing from "@/components/product-listing"
import SearchProducts from "@/components/search-products"
import { ProductProvider } from "@/components/product-context"

export default function Home() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Product Management System</h1>

      <ProductProvider>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Directory Upload</TabsTrigger>
            <TabsTrigger value="products">Product Listing</TabsTrigger>
            <TabsTrigger value="search">Search Products</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <DirectoryUpload />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <ProductListing />
          </TabsContent>

          <TabsContent value="search" className="mt-6">
            <SearchProducts />
          </TabsContent>
        </Tabs>
      </ProductProvider>
    </div>
  )
}
