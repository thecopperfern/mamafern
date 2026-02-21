/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  CommerceCart,
  CommerceCartLineItem,
  CommerceCollection,
  CommerceImage,
  CommercePrice,
  CommercePriceRange,
  CommerceProduct,
  CommerceProductOption,
  CommerceVariant,
} from "../types";

export function mapImage(image: any): CommerceImage | null {
  if (!image) return null;
  return {
    url: image.url,
    altText: image.altText ?? null,
    width: image.width,
    height: image.height,
  };
}

export function mapPrice(price: any): CommercePrice {
  return {
    amount: price.amount,
    currencyCode: price.currencyCode,
  };
}

export function mapPriceRange(range: any): CommercePriceRange {
  return {
    minVariantPrice: mapPrice(range.minVariantPrice),
    maxVariantPrice: mapPrice(range.maxVariantPrice),
  };
}

export function mapVariant(node: any): CommerceVariant {
  return {
    id: node.id,
    title: node.title ?? "",
    availableForSale: node.availableForSale ?? true,
    price: mapPrice(node.price),
    compareAtPrice: node.compareAtPrice ? mapPrice(node.compareAtPrice) : null,
    selectedOptions: node.selectedOptions ?? [],
  };
}

export function mapProductOption(option: any): CommerceProductOption {
  return {
    name: option.name,
    optionValues: (option.optionValues ?? []).map((v: any) => ({
      id: v.id,
      name: v.name,
      swatch: v.swatch ?? null,
    })),
  };
}

export function mapProduct(node: any): CommerceProduct {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description ?? "",
    productType: node.productType ?? "",
    vendor: node.vendor ?? "",
    images: (node.images?.edges ?? []).map((e: any) => mapImage(e.node)!),
    options: (node.options ?? []).map(mapProductOption),
    variants: (node.variants?.edges ?? []).map((e: any) => mapVariant(e.node)),
    priceRange: node.priceRange
      ? mapPriceRange(node.priceRange)
      : { minVariantPrice: { amount: "0", currencyCode: "USD" }, maxVariantPrice: { amount: "0", currencyCode: "USD" } },
    compareAtPriceRange: node.compareAtPriceRange
      ? mapPriceRange(node.compareAtPriceRange)
      : null,
    featuredImage: mapImage(node.featuredImage),
    seo: node.seo ?? null,
  };
}

export function mapCollection(node: any): CommerceCollection {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description ?? "",
    descriptionHtml: node.descriptionHtml ?? "",
    image: mapImage(node.image),
  };
}

export function mapCartLineItem(node: any): CommerceCartLineItem {
  const merchandise = node.merchandise;
  const product = merchandise?.product;
  return {
    id: node.id,
    quantity: node.quantity,
    merchandiseId: merchandise?.id ?? "",
    variantTitle: merchandise?.title ?? "",
    productTitle: product?.title ?? "",
    productHandle: product?.handle ?? "",
    productVendor: product?.vendor ?? "",
    productDescription: product?.description ?? "",
    price: merchandise?.price ? mapPrice(merchandise.price) : { amount: "0", currencyCode: "USD" },
    totalAmount: node.cost?.totalAmount
      ? mapPrice(node.cost.totalAmount)
      : {
          amount: (parseFloat(merchandise?.price?.amount ?? "0") * node.quantity).toFixed(2),
          currencyCode: merchandise?.price?.currencyCode ?? "USD",
        },
    image: product?.images?.edges?.[0]?.node
      ? mapImage(product.images.edges[0].node)
      : null,
    selectedOptions: merchandise?.selectedOptions ?? [],
  };
}

export function mapCart(cart: any): CommerceCart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl ?? "",
    lines: (cart.lines?.edges ?? []).map((e: any) => mapCartLineItem(e.node)),
    subtotal: cart.cost?.subtotalAmount
      ? mapPrice(cart.cost.subtotalAmount)
      : { amount: "0.00", currencyCode: "USD" },
    total: cart.cost?.totalAmount
      ? mapPrice(cart.cost.totalAmount)
      : { amount: "0.00", currencyCode: "USD" },
    totalQuantity: cart.totalQuantity ?? 0,
    discountCodes: (cart.discountCodes ?? []).map((dc: any) => ({
      code: dc.code,
      applicable: dc.applicable ?? false,
    })),
  };
}
