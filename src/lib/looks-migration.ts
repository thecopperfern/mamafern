import { v4 as uuidv4 } from "uuid";
import type {
  LooksData,
  Look,
  LookProduct,
  V1LooksData,
  V1Look,
  V1LookProduct,
} from "@/types/looks";

const CURRENT_VERSION = 2;

/**
 * Migrates v1 look product (comingSoon boolean) to v2 (badge object).
 */
function migrateProduct(p: V1LookProduct, index: number): LookProduct {
  return {
    id: uuidv4(),
    source: "shopify",
    shopifyProductId: p.shopifyProductId,
    shopifyHandle: p.shopifyHandle,
    title: p.title,
    price: p.price,
    productUrl: p.productUrl || null,
    selectedImageUrl: p.selectedImageUrl,
    selectedImageAlt: p.selectedImageAlt,
    badge: p.comingSoon
      ? { text: "Coming Soon", variant: "default" }
      : null,
    order: index,
  };
}

/**
 * Migrates a v1 look to v2 format.
 */
function migrateLook(look: V1Look, index: number): Look {
  return {
    id: look.id,
    label: look.label,
    title: look.title,
    heroImage: look.heroImage,
    heroImageAlt: look.heroImageAlt,
    products: look.products.map(migrateProduct),
    order: index,
    status: "published",
  };
}

/**
 * Auto-migrates looks data from any version to current version.
 * Safe to call on already-migrated data (returns as-is if current version).
 */
export function migrateLooksData(raw: V1LooksData | LooksData): LooksData {
  // Already current version
  if ("version" in raw && raw.version >= CURRENT_VERSION) {
    return raw as LooksData;
  }

  // V1 → V2: no version field, has comingSoon on products
  const v1 = raw as V1LooksData;
  return {
    version: CURRENT_VERSION,
    looks: v1.looks.map(migrateLook),
  };
}

/**
 * Checks if a look is currently visible to the public:
 * - Must be "published" status
 * - Must be within schedule window (if set)
 */
export function isLookPublished(look: Look): boolean {
  if (look.status !== "published") return false;

  if (look.schedule) {
    const now = new Date();
    if (look.schedule.startDate && new Date(look.schedule.startDate) > now) {
      return false;
    }
    if (look.schedule.endDate && new Date(look.schedule.endDate) < now) {
      return false;
    }
  }

  return true;
}
