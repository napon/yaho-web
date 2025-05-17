import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCatalog from "@/components/ai-search/ProductCatalogPage";
import DrivePage from "@/components/file-browser/FileBrowsePage";
import { checkRole } from "../../util/roles";
import { getTranslations } from "./translations";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: "en" | "zh" }>;
}) {
  const { lang } = await params;
  const isAdmin = await checkRole("admin");
  const translations = await getTranslations(lang);
  return (
    <div className="container mx-auto py-6">
      {isAdmin ? (
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file-browser">
              {translations.tabs.fileBrowser}
            </TabsTrigger>
            <TabsTrigger value="search">{translations.tabs.search}</TabsTrigger>
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
