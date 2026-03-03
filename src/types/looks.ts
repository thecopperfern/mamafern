export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

export type LookProductBadge = {
  text: string;
  variant: BadgeVariant;
};

export type LookProduct = {
  id: string;
  source: "shopify" | "manual";
  shopifyProductId?: string;
  shopifyHandle?: string;
  title: string;
  price: string;
  productUrl: string | null;
  selectedImageUrl: string;
  selectedImageAlt: string;
  badge: LookProductBadge | null;
  order: number;
  variantId?: string;
};

export type LookSchedule = {
  startDate: string | null;
  endDate: string | null;
};

export type LookDiscount = {
  enabled: boolean;
  minItems: number;
  type: "percentage" | "fixed";
  value: number;
  code?: string;
  message?: string;
};

export type LookHotspot = {
  productId: string;
  x: number;
  y: number;
};

export type Look = {
  id: string;
  label: string;
  title: string;
  description?: string;
  heroImage: string;
  heroImageAlt: string;
  products: LookProduct[];
  order: number;
  status: "draft" | "published";
  schedule?: LookSchedule;
  discount?: LookDiscount;
  hotspots?: LookHotspot[];
};

export type LooksData = {
  version: number;
  looks: Look[];
};

// V1 types for migration
export type V1LookProduct = {
  shopifyProductId: string;
  shopifyHandle: string;
  title: string;
  price: string;
  productUrl: string;
  selectedImageUrl: string;
  selectedImageAlt: string;
  comingSoon: boolean;
};

export type V1Look = {
  id: string;
  label: string;
  title: string;
  heroImage: string;
  heroImageAlt: string;
  products: V1LookProduct[];
};

export type V1LooksData = {
  looks: V1Look[];
};
