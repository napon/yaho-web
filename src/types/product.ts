export interface ProductMetadata {
  id: string;
  name: string;
}

export interface ProductSearchResult {
  id: string;
  document: {
    name: string;
    id: string;
    structData: Product;
  };
}
export interface Product {
  product_id: string;
  name?: string;
  description?: string;
  brand?: string;
  lead_time_days?: number;
  original_price?: number;
  original_price_currency?: "USD" | "GBP";
  price_ntd?: number | null;
  image_urls?: string[];
  resource_urls?: string[];
  dimensions?: {
    width_cm?: number;
    length_cm?: number;
    height_cm?: number;
  };
  warranty_years?: number;
  product_customizations?: { name: string; options: string[] }[];
  colors_english?: string[];
  product_finishes_english?: string[];
  product_materials_english?: string[];
  additional_attributes_english?: string[];
  colors_chinese?: string[];
  product_finishes_chinese?: string[];
  product_materials_chinese?: string[];
  additional_attributes_chinese?: string[];
  other_attributes?: { key: string; value: string }[];
}

export const productColorEnglish = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "black",
  "white",
  "brown",
  "pink",
  "gray",
  "grey",
  "red_burgundy",
  "red_crimson",
  "red_fuchsia",
  "red_maroon",
  "orange_amber",
  "orange_coral",
  "yellow_golden",
  "yellow_mustard",
  "yellow_ochre",
  "green_lime",
  "green_olive",
  "green_teal",
  "blue_aqua",
  "blue_cyan",
  "blue_indigo",
  "blue_navy",
  "blue_sky",
  "blue_turquoise",
  "purple_lilac",
  "purple_magenta",
  "purple_violet",
];

export const productColorChinese = [
  "紅色",
  "橘色",
  "黃色",
  "綠色",
  "藍色",
  "紫色",
  "黑色",
  "白色",
  "棕色",
  "咖啡色",
  "粉紅色",
  "灰色",
  "酒紅色",
  "赤紅色",
  "紫紅色",
  "栗色",
  "琥珀色",
  "珊瑚色",
  "金色",
  "芥末色",
  "赭色",
  "土黄色",
  "萊姆色",
  "橄欖色",
  "藍綠色",
  "水綠色",
  "青色",
  "靛蓝色",
  "海軍藍",
  "藏青色",
  "天空藍",
  "綠松色",
  "淡紫色",
  "芋頭色",
  "洋红色",
  "紫色",
];

export const productMaterialEnglish = [
  "wood",
  "engineered wood",
  "leather",
  "faux leather",
  "steel",
  "aluminum",
  "iron",
  "brass",
  "metal",
  "glass",
  "stone",
  "marble",
  "granite",
  "quartz",
  "plastic",
  "fabric",
  "velvet",
  "linen",
  "bamboo",
  "ceramic",
  "carbon fiber",
  "fiber glass",
];

export const productMaterialChinese = [
  "木頭",
  "工程木材",
  "皮革",
  "仿造皮",
  "鋼",
  "鋁",
  "鐵",
  "黃銅",
  "金屬",
  "玻璃",
  "石頭",
  "大理石",
  "花崗岩",
  "石英",
  "塑膠",
  "布料",
  "天鵝絨",
  "亞麻布",
  "竹子",
  "陶瓷",
  "碳纖維",
  "玻璃纖維",
];

export const productFinishEnglish = [
  "matte",
  "glossy",
  "brushed",
  "polished",
  "clear",
  "tinted",
  "frosted",
  "textured",
];

export const productFinishChinese = [
  "霧面",
  "光滑",
  "刷面",
  "拋光",
  "透明",
  "有色",
  "磨砂",
  "紋理",
];

export const productAdditionalAttributes = [
  "sustainable materials",
  "recycled materials",
  "handmade",
  "water-resistant",
  "uv-resistant",
  "scratch-resistant",
];

export const productAdditionalAttributesChinese = [
  "永續材料",
  "回收材料",
  "手工製作",
  "防水",
  "抗紫外線",
  "耐刮",
];
