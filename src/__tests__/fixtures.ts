import type {
  CommerceProduct,
  CommerceCollection,
  CommerceCart,
  CommerceCartLineItem,
} from "@/lib/commerce/types";

export const mockProduct: CommerceProduct = {
  id: "gid://shopify/Product/1",
  handle: "little-fern-seedling-onesie",
  title: "Little Fern Seedling Onesie",
  description: "The softest organic cotton onesie for your littlest fern. GOTS-certified interlock knit with a delicate 'seedling' hand-lettered design. Envelope neckline and 3-snap bottom for easy dressing.",
  productType: "Apparel",
  vendor: "Mama Fern",
  images: [
    { url: "https://cdn.shopify.com/image1.jpg", altText: "Little Fern Seedling Onesie front view in natural cream", width: 800, height: 800 },
    { url: "https://cdn.shopify.com/image2.jpg", altText: "Little Fern Seedling Onesie back view", width: 800, height: 800 },
  ],
  options: [
    {
      name: "Size",
      optionValues: [
        { id: "size-0-3m", name: "0-3M" },
        { id: "size-3-6m", name: "3-6M" },
        { id: "size-6-12m", name: "6-12M" },
        { id: "size-12-18m", name: "12-18M" },
      ],
    },
    {
      name: "Color",
      optionValues: [
        { id: "color-sage", name: "Sage Green", swatch: { color: "#A3B18A" } },
        { id: "color-cream", name: "Natural Cream", swatch: { color: "#FAF7F2" } },
      ],
    },
  ],
  variants: [
    {
      id: "gid://shopify/ProductVariant/1",
      title: "0-3M / Sage Green",
      availableForSale: true,
      price: { amount: "24.00", currencyCode: "USD" },
      compareAtPrice: null,
      selectedOptions: [
        { name: "Size", value: "0-3M" },
        { name: "Color", value: "Sage Green" },
      ],
    },
    {
      id: "gid://shopify/ProductVariant/2",
      title: "3-6M / Sage Green",
      availableForSale: true,
      price: { amount: "24.00", currencyCode: "USD" },
      compareAtPrice: null,
      selectedOptions: [
        { name: "Size", value: "3-6M" },
        { name: "Color", value: "Sage Green" },
      ],
    },
    {
      id: "gid://shopify/ProductVariant/3",
      title: "6-12M / Natural Cream",
      availableForSale: false,
      price: { amount: "24.00", currencyCode: "USD" },
      compareAtPrice: null,
      selectedOptions: [
        { name: "Size", value: "6-12M" },
        { name: "Color", value: "Natural Cream" },
      ],
    },
  ],
  priceRange: {
    minVariantPrice: { amount: "24.00", currencyCode: "USD" },
    maxVariantPrice: { amount: "24.00", currencyCode: "USD" },
  },
  compareAtPriceRange: {
    minVariantPrice: { amount: "24.00", currencyCode: "USD" },
    maxVariantPrice: { amount: "24.00", currencyCode: "USD" },
  },
  featuredImage: { url: "https://cdn.shopify.com/image1.jpg", altText: "Little Fern Seedling Onesie front view in natural cream", width: 800, height: 800 },
  seo: { title: "Little Fern Seedling Onesie | Mama Fern", description: "The softest organic cotton onesie for your littlest fern. GOTS-certified, OEKO-TEX Class I safe." },
};

export const mockProduct2: CommerceProduct = {
  ...mockProduct,
  id: "gid://shopify/Product/2",
  handle: "mama-fern-classic-tee",
  title: "Mama Fern Classic Tee",
  description: "Butter-soft organic cotton tee with our signature fern leaf illustration and 'mama fern' hand-lettered script. Pre-washed for immediate softness in a relaxed women's fit.",
  featuredImage: { url: "https://cdn.shopify.com/image3.jpg", altText: "Mama Fern Classic Tee in natural cream", width: 800, height: 800 },
  priceRange: {
    minVariantPrice: { amount: "32.00", currencyCode: "USD" },
    maxVariantPrice: { amount: "32.00", currencyCode: "USD" },
  },
  compareAtPriceRange: {
    minVariantPrice: { amount: "32.00", currencyCode: "USD" },
    maxVariantPrice: { amount: "32.00", currencyCode: "USD" },
  },
  seo: { title: "Mama Fern Classic Tee | Mama Fern", description: "Butter-soft organic cotton tee with hand-lettered fern design. GOTS-certified. Relaxed women's fit." },
};

export const mockCollection: CommerceCollection = {
  id: "gid://shopify/Collection/1",
  handle: "kids",
  title: "For Kids",
  description: "Soft, playful pieces for your littlest adventurers — baby to big kid. Organic cotton, tagless comfort, OEKO-TEX Class I certified.",
  descriptionHtml: "<p>Soft, playful pieces for your littlest adventurers — baby to big kid. Organic cotton, tagless comfort, OEKO-TEX Class I certified.</p>",
  image: { url: "https://cdn.shopify.com/collection1.jpg", altText: "Kids collection — organic cotton tees and onesies", width: 1200, height: 600 },
};

export const mockCollection2: CommerceCollection = {
  id: "gid://shopify/Collection/2",
  handle: "moms",
  title: "For Moms",
  description: "Organic cotton tees and cozy crewnecks made for the mama who keeps it grounded.",
  descriptionHtml: "<p>Organic cotton tees and cozy crewnecks made for the mama who keeps it grounded.</p>",
  image: null,
};

export const mockCartLineItem: CommerceCartLineItem = {
  id: "gid://shopify/CartLine/1",
  quantity: 2,
  merchandiseId: "gid://shopify/ProductVariant/1",
  variantTitle: "0-3M / Sage Green",
  productTitle: "Little Fern Seedling Onesie",
  productHandle: "little-fern-seedling-onesie",
  productVendor: "Mama Fern",
  productDescription: "The softest organic cotton onesie for your littlest fern.",
  price: { amount: "24.00", currencyCode: "USD" },
  totalAmount: { amount: "48.00", currencyCode: "USD" },
  image: { url: "https://cdn.shopify.com/image1.jpg", altText: "Little Fern Seedling Onesie front view in natural cream", width: 800, height: 800 },
  selectedOptions: [
    { name: "Size", value: "0-3M" },
    { name: "Color", value: "Sage Green" },
  ],
};

export const mockCart: CommerceCart = {
  id: "gid://shopify/Cart/1",
  checkoutUrl: "https://mamafern.myshopify.com/cart/c/1",
  lines: [mockCartLineItem],
  subtotal: { amount: "48.00", currencyCode: "USD" },
  total: { amount: "48.00", currencyCode: "USD" },
  totalQuantity: 2,
  discountCodes: [],
};

export const mockEmptyCart: CommerceCart = {
  id: "gid://shopify/Cart/2",
  checkoutUrl: "https://mamafern.myshopify.com/cart/c/2",
  lines: [],
  subtotal: { amount: "0.00", currencyCode: "USD" },
  total: { amount: "0.00", currencyCode: "USD" },
  totalQuantity: 0,
  discountCodes: [],
};
