import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCatalog from "@/components/ai-search/ProductCatalogPage";
import DrivePage from "@/components/file-browser/FileBrowsePage";
import { checkRole } from "../util/roles";

export default async function Home() {
  const isAdmin = await checkRole("admin");

  return (
    <div className="container mx-auto py-6">
      {isAdmin ? (
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file-browser">Data Source</TabsTrigger>
            <TabsTrigger value="search">AI Search</TabsTrigger>
          </TabsList>

          <TabsContent value="file-browser" className="mt-6">
            <DrivePage />
          </TabsContent>

          <TabsContent value="search" className="mt-6">
            <ProductCatalog />
          </TabsContent>
        </Tabs>
      ) : (
        <ProductCatalog />
      )}
    </div>
  );
}
