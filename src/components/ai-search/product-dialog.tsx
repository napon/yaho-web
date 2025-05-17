"use client";

import { useState } from "react";
import { Save, X, Loader2, Plus, Trash, Wand } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/common/multi-select";
import { Carousel } from "@/components/ui/carousel";
import type { Product } from "@/types/product";
import { useAuth } from "@clerk/nextjs";
import { useTranslation } from "@/lib/i18n";
import {
  productColorEnglish,
  productColorChinese,
  productFinishChinese,
  productFinishEnglish,
  productMaterialChinese,
  productMaterialEnglish,
  productAdditionalAttributes,
  productAdditionalAttributesChinese,
} from "@/types/product";

interface ProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (product: Product) => void;
}

export function ProductDialog({
  product,
  open,
  onOpenChange,
  onSave,
}: ProductDialogProps) {
  const { sessionClaims } = useAuth();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newResourceUrl, setNewResourceUrl] = useState("");

  const isAdmin = sessionClaims?.metadata.role === "admin";
  const isChinese = t("lang") === "zh";

  const colorOptionsToUse = isChinese
    ? productColorChinese
    : productColorEnglish;
  const materialOptionsToUse = isChinese
    ? productMaterialChinese
    : productMaterialEnglish;
  const finishOptionsToUse = isChinese
    ? productFinishChinese
    : productFinishEnglish;
  const attributeOptionsToUse = isChinese
    ? productAdditionalAttributesChinese
    : productAdditionalAttributes;

  if (!product) return null;

  const handleEdit = () => {
    setEditedProduct({ ...product });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProduct(null);
    setNewImageUrl("");
    setNewResourceUrl("");
  };

  const handleSave = async () => {
    if (!editedProduct || !onSave) return;

    setIsSaving(true);
    try {
      await onSave(editedProduct);
      setIsEditing(false);
      setEditedProduct(null);
      setNewImageUrl("");
      setNewResourceUrl("");
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof Product, value: any) => {
    if (!editedProduct) return;
    setEditedProduct((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleDimensionChange = (
    dimension: keyof NonNullable<Product["dimensions"]>,
    value: number
  ) => {
    if (!editedProduct) return;
    setEditedProduct((prev) =>
      prev
        ? {
            ...prev,
            dimensions: {
              ...(prev.dimensions || {}),
              [dimension]: value,
            },
          }
        : null
    );
  };

  const handleAddImage = () => {
    if (!editedProduct || !newImageUrl.trim()) return;
    setEditedProduct((prev) =>
      prev
        ? {
            ...prev,
            image_urls: [...(prev.image_urls || []), newImageUrl],
          }
        : null
    );
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    if (!editedProduct) return;
    setEditedProduct((prev) =>
      prev
        ? {
            ...prev,
            image_urls: (prev.image_urls || []).filter((_, i) => i !== index),
          }
        : null
    );
  };

  const handleAddResource = () => {
    if (!editedProduct || !newResourceUrl.trim()) return;
    setEditedProduct((prev) =>
      prev
        ? {
            ...prev,
            resource_urls: [...(prev.resource_urls || []), newResourceUrl],
          }
        : null
    );
    setNewResourceUrl("");
  };

  const handleRemoveResource = (index: number) => {
    if (!editedProduct) return;
    setEditedProduct((prev) =>
      prev
        ? {
            ...prev,
            resource_urls: (prev.resource_urls || []).filter(
              (_, i) => i !== index
            ),
          }
        : null
    );
  };

  const handleAddOtherAttribute = () => {
    if (!editedProduct) return;
    setEditedProduct((prev) =>
      prev
        ? {
            ...prev,
            other_attributes: [
              ...(prev.other_attributes || []),
              { key: "", value: "" },
            ],
          }
        : null
    );
  };

  const handleUpdateOtherAttribute = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    if (!editedProduct) return;
    setEditedProduct((prev) => {
      if (!prev) return null;
      const newAttributes = [...(prev.other_attributes || [])];
      newAttributes[index][field] = value;
      return { ...prev, other_attributes: newAttributes };
    });
  };

  const handleRemoveOtherAttribute = (index: number) => {
    if (!editedProduct) return;
    setEditedProduct((prev) =>
      prev
        ? {
            ...prev,
            other_attributes: (prev.other_attributes || []).filter(
              (_, i) => i !== index
            ),
          }
        : null
    );
  };

  const handleAddCustomization = () => {
    if (!editedProduct) return;
    setEditedProduct((prev) =>
      prev
        ? {
            ...prev,
            product_customizations: [
              ...(prev.product_customizations || []),
              { name: "", options: [] },
            ],
          }
        : null
    );
  };

  const handleUpdateCustomization = (
    index: number,
    field: "name",
    value: string
  ) => {
    if (!editedProduct) return;
    setEditedProduct((prev) => {
      if (!prev) return null;
      const newCustomizations = [...(prev.product_customizations || [])];
      newCustomizations[index][field] = value;
      return { ...prev, product_customizations: newCustomizations };
    });
  };

  const handleRemoveCustomization = (index: number) => {
    if (!editedProduct) return;
    setEditedProduct((prev) =>
      prev
        ? {
            ...prev,
            product_customizations: (prev.product_customizations || []).filter(
              (_, i) => i !== index
            ),
          }
        : null
    );
  };

  const handleAddCustomizationOption = (customizationIndex: number) => {
    if (!editedProduct) return;
    const option = prompt("Enter option value");
    if (option) {
      setEditedProduct((prev) => {
        if (!prev) return null;
        const newCustomizations = [...(prev.product_customizations || [])];
        newCustomizations[customizationIndex].options.push(option);
        return { ...prev, product_customizations: newCustomizations };
      });
    }
  };

  const handleRemoveCustomizationOption = (
    customizationIndex: number,
    optionIndex: number
  ) => {
    if (!editedProduct) return;
    setEditedProduct((prev) => {
      if (!prev) return null;
      const newCustomizations = [...(prev.product_customizations || [])];
      newCustomizations[customizationIndex].options = newCustomizations[
        customizationIndex
      ].options.filter((_: string, i: number) => i !== optionIndex);
      return { ...prev, product_customizations: newCustomizations };
    });
  };

  const currentProduct = isEditing ? editedProduct : product;

  if (!currentProduct) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen && isEditing) {
          if (confirm("Discard changes?")) {
            setIsEditing(false);
            setEditedProduct(null);
            setNewImageUrl("");
            setNewResourceUrl("");
            onOpenChange(false);
          }
        } else {
          onOpenChange(newOpen);
        }
      }}
    >
      <DialogContent className="min-w-[60vw] max-h-[90vh] overflow-hidden flex flex-col [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>{currentProduct.name}</DialogTitle>
            <DialogDescription>
              {currentProduct.brand} · {currentProduct.original_price_currency}{" "}
              {currentProduct.original_price} · NT${" "}
              {currentProduct.price_ntd || "N/A"}
            </DialogDescription>
          </div>
          {onSave && isAdmin && (
            <div>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-1" />{" "}
                    {t("productDialog.actions.cancel")}
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />{" "}
                        {t("productDialog.actions.saving")}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1" />{" "}
                        {t("productDialog.actions.save")}
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Wand className="h-4 w-4 mr-1" />{" "}
                  {t("productDialog.actions.fineTune")}
                </Button>
              )}
            </div>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="px-1">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="details">
                  {t("productDialog.tabs.details")}
                </TabsTrigger>
                <TabsTrigger value="specifications">
                  {t("productDialog.tabs.specifications")}
                </TabsTrigger>
                <TabsTrigger value="customizations">
                  {t("productDialog.tabs.customizations")}
                </TabsTrigger>
              </TabsList>

              {isEditing ? (
                // Edit Mode
                <>
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            {t("productDialog.details.productName")}
                          </Label>
                          <Input
                            id="name"
                            value={currentProduct.name || ""}
                            onChange={(e) =>
                              handleChange("name", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="product_id">
                            {t("productDialog.details.productId")}
                          </Label>
                          <Input
                            id="product_id"
                            value={currentProduct.product_id}
                            onChange={(e) =>
                              handleChange("product_id", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="brand">
                            {t("productDialog.details.brand")}
                          </Label>
                          <Input
                            id="brand"
                            value={currentProduct.brand || "Unknown Brand"}
                            onChange={(e) =>
                              handleChange("brand", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">
                            {t("productDialog.details.description")}
                          </Label>
                          <Textarea
                            id="description"
                            value={currentProduct.description || ""}
                            onChange={(e) =>
                              handleChange("description", e.target.value)
                            }
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label htmlFor="original_price">
                              {t("productDialog.details.originalPrice")}
                            </Label>
                            <Input
                              id="original_price"
                              type="number"
                              value={currentProduct.original_price || ""}
                              onChange={(e) =>
                                handleChange(
                                  "original_price",
                                  Number.parseFloat(e.target.value)
                                )
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="original_price_currency">
                              {t("productDialog.details.currency")}
                            </Label>
                            <Select
                              value={
                                currentProduct.original_price_currency || "USD"
                              }
                              onValueChange={(value) =>
                                handleChange("original_price_currency", value)
                              }
                            >
                              <SelectTrigger id="original_price_currency">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="GBP">GBP</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="price_ntd">
                            {t("productDialog.details.priceNtd")}
                          </Label>
                          <Input
                            id="price_ntd"
                            type="number"
                            value={currentProduct.price_ntd || ""}
                            onChange={(e) =>
                              handleChange(
                                "price_ntd",
                                e.target.value
                                  ? Number.parseFloat(e.target.value)
                                  : null
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>{t("productDialog.details.images")}</Label>
                          {(currentProduct.image_urls || []).length > 0 && (
                            <Carousel
                              images={currentProduct.image_urls || []}
                              aspectRatio="square"
                              className="mb-4"
                            />
                          )}
                          <div className="flex gap-2 mb-2">
                            <Input
                              placeholder={t(
                                "productDialog.details.enterImageUrl"
                              )}
                              value={newImageUrl}
                              onChange={(e) => setNewImageUrl(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleAddImage}
                              disabled={!newImageUrl.trim()}
                            >
                              <Plus className="h-4 w-4 mr-1" />{" "}
                              {t("productDialog.details.addImage")}
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto">
                            {(currentProduct.image_urls || []).map(
                              (url, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <Input
                                    value={url}
                                    readOnly
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveImage(index)}
                                  >
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">
                                      {t("productDialog.details.removeImage")}
                                    </span>
                                  </Button>
                                </div>
                              )
                            )}
                            {(currentProduct.image_urls || []).length === 0 && (
                              <p className="text-sm text-muted-foreground">
                                {t("productDialog.details.noImages")}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>
                              {t("productDialog.details.resources")}
                            </Label>
                          </div>
                          <div className="flex gap-2 mb-2">
                            <Input
                              placeholder={t(
                                "productDialog.details.enterResourceUrl"
                              )}
                              value={newResourceUrl}
                              onChange={(e) =>
                                setNewResourceUrl(e.target.value)
                              }
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleAddResource}
                              disabled={!newResourceUrl.trim()}
                            >
                              <Plus className="h-4 w-4 mr-1" />{" "}
                              {t("productDialog.details.addResource")}
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 gap-2 max-h-[150px] overflow-y-auto">
                            {(currentProduct.resource_urls || []).map(
                              (url, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <Input
                                    value={url}
                                    readOnly
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveResource(index)}
                                  >
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">
                                      {t(
                                        "productDialog.details.removeResource"
                                      )}
                                    </span>
                                  </Button>
                                </div>
                              )
                            )}
                            {(currentProduct.resource_urls || []).length ===
                              0 && (
                              <p className="text-sm text-muted-foreground">
                                {t("productDialog.details.noResources")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="colors_english">
                          {t("productDialog.details.colors.english")}
                        </Label>
                        <MultiSelect
                          options={colorOptionsToUse.map((color) => ({
                            label: color,
                            value: color,
                          }))}
                          selected={
                            isChinese
                              ? currentProduct.colors_chinese || []
                              : currentProduct.colors_english || []
                          }
                          onChange={(selected: string[]) =>
                            handleChange(
                              isChinese ? "colors_chinese" : "colors_english",
                              selected
                            )
                          }
                          placeholder={
                            isChinese
                              ? t(
                                  "productDialog.details.colors.placeholderChinese"
                                )
                              : t("productDialog.details.colors.placeholder")
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="colors_chinese">
                          {t("productDialog.details.colors.chinese")}
                        </Label>
                        <MultiSelect
                          options={colorOptionsToUse.map((color) => ({
                            label: color,
                            value: color,
                          }))}
                          selected={
                            isChinese
                              ? currentProduct.colors_english || []
                              : currentProduct.colors_chinese || []
                          }
                          onChange={(selected: string[]) =>
                            handleChange(
                              isChinese ? "colors_english" : "colors_chinese",
                              selected
                            )
                          }
                          placeholder={
                            isChinese
                              ? t(
                                  "productDialog.details.colors.placeholderEnglish"
                                )
                              : t("productDialog.details.colors.placeholder")
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="product_materials_english">
                          {t("productDialog.details.materials.english")}
                        </Label>
                        <MultiSelect
                          options={materialOptionsToUse.map((material) => ({
                            label: material,
                            value: material,
                          }))}
                          selected={
                            currentProduct.product_materials_english || []
                          }
                          onChange={(selected: string[]) =>
                            handleChange("product_materials_english", selected)
                          }
                          placeholder={t(
                            "productDialog.details.materials.placeholder"
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="product_materials_chinese">
                          {t("productDialog.details.materials.chinese")}
                        </Label>
                        <MultiSelect
                          options={materialOptionsToUse.map((material) => ({
                            label: material,
                            value: material,
                          }))}
                          selected={
                            currentProduct.product_materials_chinese || []
                          }
                          onChange={(selected: string[]) =>
                            handleChange("product_materials_chinese", selected)
                          }
                          placeholder={t(
                            "productDialog.details.materials.placeholderChinese"
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="product_finishes_english">
                          {t("productDialog.details.finishes.english")}
                        </Label>
                        <MultiSelect
                          options={finishOptionsToUse.map((finish) => ({
                            label: finish,
                            value: finish,
                          }))}
                          selected={
                            currentProduct.product_finishes_english || []
                          }
                          onChange={(selected: string[]) =>
                            handleChange("product_finishes_english", selected)
                          }
                          placeholder={t(
                            "productDialog.details.finishes.placeholder"
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="product_finishes_chinese">
                          {t("productDialog.details.finishes.chinese")}
                        </Label>
                        <MultiSelect
                          options={finishOptionsToUse.map((finish) => ({
                            label: finish,
                            value: finish,
                          }))}
                          selected={
                            currentProduct.product_finishes_chinese || []
                          }
                          onChange={(selected: string[]) =>
                            handleChange("product_finishes_chinese", selected)
                          }
                          placeholder={t(
                            "productDialog.details.finishes.placeholderChinese"
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="additional_attributes_english">
                          {t("productDialog.details.attributes.english")}
                        </Label>
                        <MultiSelect
                          options={attributeOptionsToUse.map((attr) => ({
                            label: attr,
                            value: attr,
                          }))}
                          selected={
                            currentProduct.additional_attributes_english || []
                          }
                          onChange={(selected: string[]) =>
                            handleChange(
                              "additional_attributes_english",
                              selected
                            )
                          }
                          placeholder={t(
                            "productDialog.details.attributes.placeholder"
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="additional_attributes_chinese">
                          {t("productDialog.details.attributes.chinese")}
                        </Label>
                        <MultiSelect
                          options={attributeOptionsToUse.map((attr) => ({
                            label: attr,
                            value: attr,
                          }))}
                          selected={
                            currentProduct.additional_attributes_chinese || []
                          }
                          onChange={(selected: string[]) =>
                            handleChange(
                              "additional_attributes_chinese",
                              selected
                            )
                          }
                          placeholder={t(
                            "productDialog.details.attributes.placeholderChinese"
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>
                          {t("productDialog.details.otherAttributes")}
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddOtherAttribute}
                        >
                          <Plus className="h-4 w-4 mr-1" />{" "}
                          {t("productDialog.details.otherAttributes.add")}
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {(currentProduct.other_attributes || []).map(
                          (attr, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <Input
                                placeholder={t(
                                  "productDialog.details.otherAttributes.key"
                                )}
                                value={attr.key}
                                onChange={(e) =>
                                  handleUpdateOtherAttribute(
                                    index,
                                    "key",
                                    e.target.value
                                  )
                                }
                                className="flex-1"
                              />
                              <Input
                                placeholder={t(
                                  "productDialog.details.otherAttributes.value"
                                )}
                                value={attr.value}
                                onChange={(e) =>
                                  handleUpdateOtherAttribute(
                                    index,
                                    "value",
                                    e.target.value
                                  )
                                }
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveOtherAttribute(index)
                                }
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">
                                  {t(
                                    "productDialog.details.otherAttributes.remove"
                                  )}
                                </span>
                              </Button>
                            </div>
                          )
                        )}
                        {(currentProduct.other_attributes || []).length ===
                          0 && (
                          <p className="text-sm text-muted-foreground">
                            {t("productDialog.details.otherAttributes.none")}
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="specifications" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="width_cm">
                          {t("productDialog.specifications.width")}
                        </Label>
                        <Input
                          id="width_cm"
                          type="number"
                          value={currentProduct.dimensions?.width_cm || ""}
                          onChange={(e) =>
                            handleDimensionChange(
                              "width_cm",
                              Number.parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="length_cm">
                          {t("productDialog.specifications.length")}
                        </Label>
                        <Input
                          id="length_cm"
                          type="number"
                          value={currentProduct.dimensions?.length_cm || ""}
                          onChange={(e) =>
                            handleDimensionChange(
                              "length_cm",
                              Number.parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="height_cm">
                          {t("productDialog.specifications.height")}
                        </Label>
                        <Input
                          id="height_cm"
                          type="number"
                          value={currentProduct.dimensions?.height_cm || ""}
                          onChange={(e) =>
                            handleDimensionChange(
                              "height_cm",
                              Number.parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="warranty_years">
                          {t("productDialog.specifications.warranty")}
                        </Label>
                        <Input
                          id="warranty_years"
                          type="number"
                          value={currentProduct.warranty_years || ""}
                          onChange={(e) =>
                            handleChange(
                              "warranty_years",
                              Number.parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lead_time_days">
                          {t("productDialog.specifications.leadTime")}
                        </Label>
                        <Input
                          id="lead_time_days"
                          type="number"
                          value={currentProduct.lead_time_days || ""}
                          onChange={(e) =>
                            handleChange(
                              "lead_time_days",
                              Number.parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="customizations" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">
                        {t("productDialog.customizations.title")}
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddCustomization}
                      >
                        <Plus className="h-4 w-4 mr-1" />{" "}
                        {t("productDialog.customizations.add")}
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {(currentProduct.product_customizations || []).map(
                        (customization, index) => (
                          <div
                            key={index}
                            className="border rounded-md p-4 space-y-4"
                          >
                            <div className="flex items-center justify-between">
                              <Input
                                placeholder={t(
                                  "productDialog.customizations.name"
                                )}
                                value={customization.name}
                                onChange={(e) =>
                                  handleUpdateCustomization(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveCustomization(index)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">
                                  {t("productDialog.customizations.remove")}
                                </span>
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label>
                                  {t("productDialog.customizations.options")}
                                </Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleAddCustomizationOption(index)
                                  }
                                >
                                  <Plus className="h-4 w-4 mr-1" />{" "}
                                  {t("productDialog.customizations.addOption")}
                                </Button>
                              </div>

                              <div className="grid grid-cols-1 gap-2">
                                {customization.options.map(
                                  (option, optionIndex) => (
                                    <div
                                      key={optionIndex}
                                      className="flex items-center gap-2"
                                    >
                                      <Input
                                        value={option}
                                        readOnly
                                        className="flex-1"
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleRemoveCustomizationOption(
                                            index,
                                            optionIndex
                                          )
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">
                                          {t(
                                            "productDialog.customizations.removeOption"
                                          )}
                                        </span>
                                      </Button>
                                    </div>
                                  )
                                )}
                                {customization.options.length === 0 && (
                                  <p className="text-sm text-muted-foreground">
                                    {t("productDialog.customizations.none")}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                      {(currentProduct.product_customizations || []).length ===
                        0 && (
                        <p className="text-sm text-muted-foreground">
                          {t("productDialog.customizations.none")}
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </>
              ) : (
                // View Mode
                <>
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Carousel
                        images={currentProduct.image_urls || []}
                        aspectRatio="square"
                        className="bg-muted rounded-md overflow-hidden"
                        placeholderText={currentProduct.name || ""}
                      />

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium">
                            {t("productDialog.details.description")}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {currentProduct.description}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium">
                            {t("productDialog.details.colors")}
                          </h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(isChinese
                              ? currentProduct.colors_chinese || []
                              : currentProduct.colors_english || []
                            ).map((color, index) => (
                              <Badge key={index} variant="outline">
                                {color}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium">
                            {t("productDialog.details.materials")}
                          </h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(isChinese
                              ? currentProduct.product_materials_chinese || []
                              : currentProduct.product_materials_english || []
                            ).map((material, index) => (
                              <Badge key={index} variant="secondary">
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium">
                            {t("productDialog.details.finishes")}
                          </h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(isChinese
                              ? currentProduct.product_finishes_chinese || []
                              : currentProduct.product_finishes_english || []
                            ).map((finish, index) => (
                              <Badge key={index} variant="outline">
                                {finish}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium">
                            {t("productDialog.details.additionalAttributes")}
                          </h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(isChinese
                              ? currentProduct.additional_attributes_chinese ||
                                []
                              : currentProduct.additional_attributes_english ||
                                []
                            ).map((attr, index) => (
                              <Badge key={index} variant="secondary">
                                {attr}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium">
                            {t("productDialog.details.otherAttributes")}
                          </h3>
                          <div className="space-y-1 mt-1">
                            {(currentProduct.other_attributes || []).map(
                              (attr, index) => (
                                <div key={index} className="flex">
                                  <span className="text-sm font-medium w-24">
                                    {attr.key}:
                                  </span>
                                  <span className="text-sm">{attr.value}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {(currentProduct.resource_urls || []).length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          {t("productDialog.details.resources")}
                        </h3>
                        <div className="space-y-1">
                          {(currentProduct.resource_urls || []).map(
                            (resource, index) => (
                              <div key={index} className="text-sm">
                                <a
                                  href={resource}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {t("productDialog.details.resource")}{" "}
                                  {index + 1}
                                </a>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="specifications" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">
                          {t("productDialog.specifications.dimensions")}
                        </h3>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              {t("productDialog.specifications.width")}
                            </span>
                            <span className="text-sm">
                              {currentProduct.dimensions?.width_cm} cm
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              {t("productDialog.specifications.length")}
                            </span>
                            <span className="text-sm">
                              {currentProduct.dimensions?.length_cm} cm
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              {t("productDialog.specifications.height")}
                            </span>
                            <span className="text-sm">
                              {currentProduct.dimensions?.height_cm} cm
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">
                          {t("productDialog.specifications.otherSpecs")}
                        </h3>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              {t("productDialog.specifications.warranty")}
                            </span>
                            <span className="text-sm">
                              {currentProduct.warranty_years} years
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              {t("productDialog.specifications.leadTime")}
                            </span>
                            <span className="text-sm">
                              {currentProduct.lead_time_days} days
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        {t("productDialog.specifications.allAttributes")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                        {(currentProduct.other_attributes || []).map(
                          (attr, index) => (
                            <div key={index} className="flex">
                              <span className="text-sm font-medium w-24">
                                {attr.key}:
                              </span>
                              <span className="text-sm">{attr.value}</span>
                            </div>
                          )
                        )}
                        {(isChinese
                          ? currentProduct.additional_attributes_english || []
                          : currentProduct.additional_attributes_chinese || []
                        ).map((attr, index) => (
                          <div key={index} className="flex">
                            <span className="text-sm font-medium w-24">
                              {t("productDialog.specifications.feature")}:
                            </span>
                            <span className="text-sm">{attr}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="customizations" className="space-y-4">
                    {(currentProduct.product_customizations || []).length >
                    0 ? (
                      (currentProduct.product_customizations || []).map(
                        (customization, index) => (
                          <div key={index} className="space-y-2">
                            <h3 className="text-sm font-medium">
                              {customization.name}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {customization.options.map((option, optIndex) => (
                                <Badge key={optIndex} variant="outline">
                                  {option}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {t("productDialog.customizations.none")}
                      </p>
                    )}
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("productDialog.actions.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
