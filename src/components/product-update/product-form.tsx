"use client";

import type React from "react";

import { useState } from "react";
import { Loader2, Plus, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MultiSelect } from "../common/multi-select";
import {
  productAdditionalAttributes,
  productAdditionalAttributesChinese,
  productColorChinese,
  productColorEnglish,
  productMaterialEnglish,
  productMaterialChinese,
  productFinishEnglish,
  productFinishChinese,
  type Product,
} from "@/types/product";

interface ProductFormProps {
  product: Product;
  onSave: (product: Product) => void;
  onDelete: (productId: string) => void;
  isLoading: boolean;
}

export function ProductForm({
  product,
  onSave,
  onDelete,
  isLoading,
}: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({ ...product });

  const handleChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddImage = () => {
    const url = prompt("Enter image URL");
    if (url) {
      setFormData((prev) => ({
        ...prev,
        image_urls: [...prev.image_urls, url],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index),
    }));
  };

  const handleAddResource = () => {
    const url = prompt("Enter resource URL");
    if (url) {
      setFormData((prev) => ({
        ...prev,
        resource_urls: [...prev.resource_urls, url],
      }));
    }
  };

  const handleRemoveResource = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      resource_urls: prev.resource_urls.filter((_, i) => i !== index),
    }));
  };

  const handleAddOtherAttribute = () => {
    setFormData((prev) => ({
      ...prev,
      other_attributes: [...prev.other_attributes, { key: "", value: "" }],
    }));
  };

  const handleUpdateOtherAttribute = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    setFormData((prev) => {
      const newAttributes = [...prev.other_attributes];
      newAttributes[index][field] = value;
      return { ...prev, other_attributes: newAttributes };
    });
  };

  const handleRemoveOtherAttribute = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      other_attributes: prev.other_attributes.filter((_, i) => i !== index),
    }));
  };

  const handleAddCustomization = () => {
    setFormData((prev) => ({
      ...prev,
      product_customizations: [
        ...prev.product_customizations,
        { name: "", options: [] },
      ],
    }));
  };

  const handleUpdateCustomization = (
    index: number,
    field: "name",
    value: string
  ) => {
    setFormData((prev) => {
      const newCustomizations = [...prev.product_customizations];
      newCustomizations[index][field] = value;
      return { ...prev, product_customizations: newCustomizations };
    });
  };

  const handleUpdateCustomizationOptions = (
    index: number,
    options: string[]
  ) => {
    setFormData((prev) => {
      const newCustomizations = [...prev.product_customizations];
      newCustomizations[index].options = options;
      return { ...prev, product_customizations: newCustomizations };
    });
  };

  const handleRemoveCustomization = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      product_customizations: prev.product_customizations.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleAddCustomizationOption = (customizationIndex: number) => {
    const option = prompt("Enter option value");
    if (option) {
      setFormData((prev) => {
        const newCustomizations = [...prev.product_customizations];
        newCustomizations[customizationIndex].options.push(option);
        return { ...prev, product_customizations: newCustomizations };
      });
    }
  };

  const handleRemoveCustomizationOption = (
    customizationIndex: number,
    optionIndex: number
  ) => {
    setFormData((prev) => {
      const newCustomizations = [...prev.product_customizations];
      newCustomizations[customizationIndex].options = newCustomizations[
        customizationIndex
      ].options.filter((_, i) => i !== optionIndex);
      return { ...prev, product_customizations: newCustomizations };
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Edit Product Information</CardTitle>
          <CardDescription>
            Update the details for {formData.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pricing Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="original_price">Original Price</Label>
                <Input
                  id="original_price"
                  type="number"
                  value={formData.original_price}
                  onChange={(e) =>
                    handleChange(
                      "original_price",
                      Number.parseFloat(e.target.value)
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="original_price_currency">Currency</Label>
                <Select
                  value={formData.original_price_currency}
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

              <div className="space-y-2">
                <Label htmlFor="price_ntd">Price (NTD)</Label>
                <Input
                  id="price_ntd"
                  type="number"
                  value={formData.price_ntd ?? ""}
                  onChange={(e) =>
                    handleChange(
                      "price_ntd",
                      e.target.value ? Number.parseFloat(e.target.value) : null
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Specifications</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width_cm">Width (CM)</Label>
                <Input
                  id="width_cm"
                  type="number"
                  value={formData.dimensions.width_cm}
                  onChange={(e) =>
                    handleChange("dimensions", {
                      ...formData.dimensions,
                      width_cm: Number.parseFloat(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="length_cm">Length (CM)</Label>
                <Input
                  id="length_cm"
                  type="number"
                  value={formData.dimensions.length_cm}
                  onChange={(e) =>
                    handleChange("dimensions", {
                      ...formData.dimensions,
                      length_cm: Number.parseFloat(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height_cm">Height (CM)</Label>
                <Input
                  id="height_cm"
                  type="number"
                  value={formData.dimensions.height_cm}
                  onChange={(e) =>
                    handleChange("dimensions", {
                      ...formData.dimensions,
                      height_cm: Number.parseFloat(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warranty_years">Warranty (Years)</Label>
                <Input
                  id="warranty_years"
                  type="number"
                  value={formData.warranty_years}
                  onChange={(e) =>
                    handleChange(
                      "warranty_years",
                      Number.parseFloat(e.target.value)
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead_time_days">Lead Time (Days)</Label>
                <Input
                  id="lead_time_days"
                  type="number"
                  value={formData.lead_time_days}
                  onChange={(e) =>
                    handleChange(
                      "lead_time_days",
                      Number.parseFloat(e.target.value)
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Colors</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="colors_english">Colors</Label>
                <MultiSelect
                  options={productColorEnglish.map((color) => ({
                    label: color,
                    value: color,
                  }))}
                  selected={formData.colors_english || []}
                  onChange={(selected) =>
                    handleChange("colors_english", selected)
                  }
                  placeholder="Select colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="colors_chinese">Colors (Chinese)</Label>
                <MultiSelect
                  options={productColorChinese.map((color) => ({
                    label: color,
                    value: color,
                  }))}
                  selected={formData.colors_chinese || []}
                  onChange={(selected) =>
                    handleChange("colors_chinese", selected)
                  }
                  placeholder="Select colors (Chinese)"
                />
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Materials</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product_materials_english">Materials</Label>
                <MultiSelect
                  options={productMaterialEnglish.map((material) => ({
                    label: material,
                    value: material,
                  }))}
                  selected={formData.product_materials_english || []}
                  onChange={(selected) =>
                    handleChange("product_materials_english", selected)
                  }
                  placeholder="Select materials"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_materials_chinese">
                  Materials (Chinese)
                </Label>
                <MultiSelect
                  options={productMaterialChinese.map((material) => ({
                    label: material,
                    value: material,
                  }))}
                  selected={formData.product_materials_chinese || []}
                  onChange={(selected) =>
                    handleChange("product_materials_chinese", selected)
                  }
                  placeholder="Select materials (Chinese)"
                />
              </div>
            </div>
          </div>

          {/* Finishes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Finishes</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product_finishes_english">Finishes</Label>
                <MultiSelect
                  options={productFinishEnglish.map((finish) => ({
                    label: finish,
                    value: finish,
                  }))}
                  selected={formData.product_finishes_english || []}
                  onChange={(selected) =>
                    handleChange("product_finishes_english", selected)
                  }
                  placeholder="Select finishes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_finishes_chinese">
                  Finishes (Chinese)
                </Label>
                <MultiSelect
                  options={productFinishChinese.map((finish) => ({
                    label: finish,
                    value: finish,
                  }))}
                  selected={formData.product_finishes_chinese || []}
                  onChange={(selected) =>
                    handleChange("product_finishes_chinese", selected)
                  }
                  placeholder="Select finishes (Chinese)"
                />
              </div>
            </div>
          </div>

          {/* Additional Attributes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Attributes</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="additional_attributes_english">
                  Additional Attributes
                </Label>
                <MultiSelect
                  options={productAdditionalAttributes.map((attr) => ({
                    label: attr,
                    value: attr,
                  }))}
                  selected={formData.additional_attributes_english || []}
                  onChange={(selected) =>
                    handleChange("additional_attributes_english", selected)
                  }
                  placeholder="Select attributes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional_attributes_chinese">
                  Additional Attributes (Chinese)
                </Label>
                <MultiSelect
                  options={productAdditionalAttributesChinese.map((attr) => ({
                    label: attr,
                    value: attr,
                  }))}
                  selected={formData.additional_attributes_chinese || []}
                  onChange={(selected) =>
                    handleChange("additional_attributes_chinese", selected)
                  }
                  placeholder="Select attributes (Chinese)"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Images</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddImage}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {(formData.image_urls || []).map((url, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 border rounded-md p-2"
                >
                  <Input value={url} readOnly />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                </div>
              ))}
              {formData.image_urls?.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No images added yet.
                </p>
              )}
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Resources</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddResource}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {(formData.resource_urls || []).map((url, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 border rounded-md p-2"
                >
                  <Input value={url} readOnly />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveResource(index)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Remove resource</span>
                  </Button>
                </div>
              ))}
              {formData.resource_urls?.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No resources added yet.
                </p>
              )}
            </div>
          </div>

          {/* Other Attributes */}
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue={"other-attributes"}
          >
            <AccordionItem value="other-attributes">
              <AccordionTrigger>
                <div className="flex justify-between items-center w-full pr-4">
                  <h3 className="text-lg font-medium">Other Attributes</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddOtherAttribute}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Attribute
                  </Button>

                  <div className="grid grid-cols-1 gap-4">
                    {(formData.other_attributes || []).map((attr, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder="Key"
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
                          placeholder="Value"
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
                          onClick={() => handleRemoveOtherAttribute(index)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove attribute</span>
                        </Button>
                      </div>
                    ))}
                    {formData.other_attributes?.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No other attributes added yet.
                      </p>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Product Customizations */}
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue={"customizations"}
          >
            <AccordionItem value="customizations">
              <AccordionTrigger>
                <div className="flex justify-between items-center w-full pr-4">
                  <h3 className="text-lg font-medium">
                    Product Customizations
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddCustomization}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customization
                  </Button>

                  <div className="grid grid-cols-1 gap-6">
                    {(formData.product_customizations || []).map(
                      (customization, index) => (
                        <div
                          key={index}
                          className="border rounded-md p-4 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <Input
                              placeholder="Customization Name"
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
                                Remove customization
                              </span>
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Options</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleAddCustomizationOption(index)
                                }
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Option
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
                                        Remove option
                                      </span>
                                    </Button>
                                  </div>
                                )
                              )}
                              {customization.options.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                  No options added yet.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    {formData.product_customizations?.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No customizations added yet.
                      </p>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" type="button" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Product
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  product from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(formData.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
