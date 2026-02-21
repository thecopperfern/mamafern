import type {
  CommerceProduct,
  CommerceCollection,
  CommerceCart,
  CommerceCartLineItem,
} from "@/lib/commerce/types";

export const mockProduct: CommerceProduct = {
  id: "gid://shopify/Product/1",
  handle: "organic-onesie",
  title: "Organic Cotton Onesie",
  description: "Soft organic cotton onesie for your little one.",
  productType: "Apparel",
  vendor: "Mama Fern",
  images: [
    { url: "https://cdn.shopify.com/image1.jpg", altText: "Front view", width: 800, height: 800 },
    { url: "https://cdn.shopify.com/image2.jpg", altText: "Back view", width: 800, height: 800 },
  ],
  options: [
    {
      name: "Size",
      optionValues: [
        { id: "size-s", name: "S" },
        { id: "size-m", name: "M" },
        { id: "size-l", name: "L" },
      ],
    },
    {
      name: "Color",
      optionValues: [
        { id: "color-sage", name: "Sage", swatch: { color: "#B2AC88" } },
        { id: "color-cream", name: "Cream", swatch: { color: "#FFFDD0" } },
      ],
    },
  ],
  variants: [
    {
      id: "gid://shopify/ProductVariant/1",
      title: "S / Sage",
      availableForSale: true,
      price: { amount: "24.99", currencyCode: "USD" },
      compareAtPrice: { amount: "29.99", currencyCode: "USD" },
      selectedOptions: [
        { name: "Size", value: "S" },
        { name: "Color", value: "Sage" },
      ],
    },
    {
      id: "gid://shopify/ProductVariant/2",
      title: "M / Sage",
      availableForSale: true,
      price: { amount: "24.99", currencyCode: "USD" },
      compareAtPrice: null,
      selectedOptions: [
        { name: "Size", value: "M" },
        { name: "Color", value: "Sage" },
      ],
    },
    {
      id: "gid://shopify/ProductVariant/3",
      title: "L / Cream",
      availableForSale: false,
      price: { amount: "24.99", currencyCode: "USD" },
      compareAtPrice: null,
      selectedOptions: [
        { name: "Size", value: "L" },
        { name: "Color", value: "Cream" },
      ],
    },
  ],
  priceRange: {
    minVariantPrice: { amount: "24.99", currencyCode: "USD" },
    maxVariantPrice: { amount: "24.99", currencyCode: "USD" },
  },
  compareAtPriceRange: {
    minVariantPrice: { amount: "29.99", currencyCode: "USD" },
    maxVariantPrice: { amount: "29.99", currencyCode: "USD" },
  },
  featuredImage: { url: "https://cdn.shopify.com/image1.jpg", altText: "Front view", width: 800, height: 800 },
  seo: { title: "Organic Cotton Onesie | Mama Fern", description: "Soft organic cotton onesie" },
};

export const mockProduct2: CommerceProduct = {
  ...mockProduct,
  id: "gid://shopify/Product/2",
  handle: "fern-tee",
  title: "Fern Print Tee",
  description: "A cozy tee with fern print.",
  featuredImage: { url: "https://cdn.shopify.com/image3.jpg", altText: "Fern tee", width: 800, height: 800 },
};

export const mockCollection: CommerceCollection = {
  id: "gid://shopify/Collection/1",
  handle: "kids",
  title: "Kids",
  description: "Apparel for the little ones",
  descriptionHtml: "<p>Apparel for the little ones</p>",
  image: { url: "https://cdn.shopify.com/collection1.jpg", altText: "Kids collection", width: 1200, height: 600 },
};

export const mockCollection2: CommerceCollection = {
  id: "gid://shopify/Collection/2",
  handle: "moms",
  title: "Moms",
  description: "For moms who love comfort",
  descriptionHtml: "<p>For moms who love comfort</p>",
  image: null,
};

export const mockCartLineItem: CommerceCartLineItem = {
  id: "gid://shopify/CartLine/1",
  quantity: 2,
  merchandiseId: "gid://shopify/ProductVariant/1",
  variantTitle: "S / Sage",
  productTitle: "Organic Cotton Onesie",
  productHandle: "organic-onesie",
  productVendor: "Mama Fern",
  productDescription: "Soft organic cotton onesie",
  price: { amount: "24.99", currencyCode: "USD" },
  totalAmount: { amount: "49.98", currencyCode: "USD" },
  image: { url: "https://cdn.shopify.com/image1.jpg", altText: "Front view", width: 800, height: 800 },
  selectedOptions: [
    { name: "Size", value: "S" },
    { name: "Color", value: "Sage" },
  ],
};

export const mockCart: CommerceCart = {
  id: "gid://shopify/Cart/1",
  checkoutUrl: "https://mamafern.myshopify.com/cart/c/1",
  lines: [mockCartLineItem],
  subtotal: { amount: "49.98", currencyCode: "USD" },
  total: { amount: "49.98", currencyCode: "USD" },
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
