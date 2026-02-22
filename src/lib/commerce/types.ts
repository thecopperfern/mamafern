export interface CommerceImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface CommercePrice {
  amount: string;
  currencyCode: string;
}

export interface CommercePriceRange {
  minVariantPrice: CommercePrice;
  maxVariantPrice: CommercePrice;
}

export interface CommerceVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: CommercePrice;
  compareAtPrice: CommercePrice | null;
  selectedOptions: { name: string; value: string }[];
}

export interface CommerceProductOption {
  name: string;
  optionValues: {
    id: string;
    name: string;
    swatch?: { color: string } | null;
  }[];
}

export interface CommerceProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  vendor: string;
  images: CommerceImage[];
  options: CommerceProductOption[];
  variants: CommerceVariant[];
  priceRange: CommercePriceRange;
  compareAtPriceRange: CommercePriceRange | null;
  featuredImage: CommerceImage | null;
  seo: { title: string; description: string } | null;
}

export interface CommerceCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: CommerceImage | null;
}

export interface CommerceCartLineItem {
  id: string;
  quantity: number;
  merchandiseId: string;
  variantTitle: string;
  productTitle: string;
  productHandle: string;
  productVendor: string;
  productDescription: string;
  price: CommercePrice;
  totalAmount: CommercePrice;
  image: CommerceImage | null;
  selectedOptions: { name: string; value: string }[];
}

export interface CommerceDiscountCode {
  code: string;
  applicable: boolean;
}

export interface CommerceCart {
  id: string;
  checkoutUrl: string;
  lines: CommerceCartLineItem[];
  subtotal: CommercePrice;
  total: CommercePrice;
  totalQuantity: number;
  discountCodes: CommerceDiscountCode[];
}

export interface CollectionWithProducts {
  collection: CommerceCollection;
  products: CommerceProduct[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor: string | null;
    startCursor: string | null;
  };
}

export interface CommerceClient {
  getCollections(): Promise<CommerceCollection[]>;
  getCollectionByHandle(
    handle: string,
    opts?: {
      first?: number;
      after?: string | null;
      sortKey?: string;
      reverse?: boolean;
    }
  ): Promise<CollectionWithProducts | null>;
  getProductByHandle(handle: string): Promise<CommerceProduct | null>;
  getProductsByCollection(
    collectionHandle: string,
    opts?: { first?: number }
  ): Promise<CommerceProduct[]>;
  createCart(): Promise<CommerceCart>;
  getCart(cartId: string): Promise<CommerceCart>;
  addToCart(
    cartId: string,
    lines: { merchandiseId: string; quantity: number }[]
  ): Promise<CommerceCart>;
  updateCartItems(
    cartId: string,
    lines: { id: string; quantity: number }[]
  ): Promise<CommerceCart>;
  removeFromCart(cartId: string, lineIds: string[]): Promise<CommerceCart>;
  applyDiscountCode(cartId: string, code: string): Promise<CommerceCart>;
  removeDiscountCode(cartId: string, code: string): Promise<CommerceCart>;
  searchProducts(query: string, first?: number): Promise<CommerceProduct[]>;
  getProductRecommendations(productId: string): Promise<CommerceProduct[]>;
  associateBuyer(
    cartId: string,
    customerAccessToken: string
  ): Promise<{ checkoutUrl: string }>;
}
