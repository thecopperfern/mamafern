/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchGraphQL } from "@/shopify/client";
import {
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_BY_HANDLE_WITH_PAGINATION_QUERY,
} from "@/graphql/collections";
import {
  GET_PRODUCT_BY_HANDLE_QUERY,
  SEARCH_PRODUCTS_QUERY,
  GET_PRODUCT_RECOMMENDATIONS_QUERY,
} from "@/graphql/products";
import {
  GET_CART,
  CREATE_CART,
  ADD_TO_CART,
  UPDATE_CART_ITEMS,
  REMOVE_FROM_CART,
  CART_DISCOUNT_CODES_UPDATE,
} from "@/graphql/cart";
import type { CommerceClient } from "../types";
import { mapCart, mapCollection, mapProduct } from "./mappers";

export const shopifyClient: CommerceClient = {
  async getCollections() {
    const data = await fetchGraphQL<any>(GET_COLLECTIONS_QUERY);
    return (data.collections?.edges ?? []).map((e: any) =>
      mapCollection(e.node)
    );
  },

  async getCollectionByHandle(handle, opts = {}) {
    const { first = 12, after = null, sortKey, reverse } = opts;
    const data = await fetchGraphQL<any>(
      GET_COLLECTION_BY_HANDLE_WITH_PAGINATION_QUERY,
      { handle, first, after, sortKey, reverse }
    );
    const collection = data.collection;
    if (!collection) return null;
    return {
      collection: mapCollection(collection),
      products: (collection.products?.edges ?? []).map((e: any) =>
        mapProduct(e.node)
      ),
      pageInfo: {
        hasNextPage: collection.products?.pageInfo?.hasNextPage ?? false,
        hasPreviousPage:
          collection.products?.pageInfo?.hasPreviousPage ?? false,
        endCursor: collection.products?.pageInfo?.endCursor ?? null,
        startCursor: collection.products?.pageInfo?.startCursor ?? null,
      },
    };
  },

  async getProductByHandle(handle) {
    const data = await fetchGraphQL<any>(GET_PRODUCT_BY_HANDLE_QUERY, {
      handle,
    });
    if (!data.product) return null;
    return mapProduct(data.product);
  },

  async getProductsByCollection(collectionHandle, opts = {}) {
    const result = await this.getCollectionByHandle(collectionHandle, {
      first: opts.first ?? 12,
    });
    return result?.products ?? [];
  },

  async createCart() {
    const data = await fetchGraphQL<any>(CREATE_CART, { lineItems: [] });
    return mapCart(data.cartCreate.cart);
  },

  async getCart(cartId) {
    const data = await fetchGraphQL<any>(GET_CART, { cartId });
    return mapCart(data.cart);
  },

  async addToCart(cartId, lines) {
    await fetchGraphQL<any>(ADD_TO_CART, { cartId, lines });
    // Re-fetch full cart to get complete data
    return this.getCart(cartId);
  },

  async updateCartItems(cartId, lines) {
    await fetchGraphQL<any>(UPDATE_CART_ITEMS, { cartId, lines });
    return this.getCart(cartId);
  },

  async removeFromCart(cartId, lineIds) {
    await fetchGraphQL<any>(REMOVE_FROM_CART, { cartId, lineIds });
    return this.getCart(cartId);
  },

  async applyDiscountCode(cartId, code) {
    const cart = await this.getCart(cartId);
    const existingCodes = cart.discountCodes.map((dc) => dc.code);
    const discountCodes = [...existingCodes, code];
    await fetchGraphQL<any>(CART_DISCOUNT_CODES_UPDATE, {
      cartId,
      discountCodes,
    });
    return this.getCart(cartId);
  },

  async removeDiscountCode(cartId, code) {
    const cart = await this.getCart(cartId);
    const discountCodes = cart.discountCodes
      .map((dc) => dc.code)
      .filter((c) => c !== code);
    await fetchGraphQL<any>(CART_DISCOUNT_CODES_UPDATE, {
      cartId,
      discountCodes,
    });
    return this.getCart(cartId);
  },

  async searchProducts(query, first = 20) {
    const data = await fetchGraphQL<any>(SEARCH_PRODUCTS_QUERY, {
      query,
      first,
    });
    return (data.products?.edges ?? []).map((e: any) => mapProduct(e.node));
  },

  async getProductRecommendations(productId) {
    const data = await fetchGraphQL<any>(GET_PRODUCT_RECOMMENDATIONS_QUERY, {
      productId,
    });
    return (data.productRecommendations ?? []).map((node: any) =>
      mapProduct(node)
    );
  },
};
