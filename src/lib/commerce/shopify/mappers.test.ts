import { describe, it, expect } from "vitest";
import {
  mapImage,
  mapPrice,
  mapPriceRange,
  mapVariant,
  mapProductOption,
  mapProduct,
  mapCollection,
  mapCartLineItem,
  mapCart,
} from "./mappers";

describe("mapImage", () => {
  it("returns null for falsy input", () => {
    expect(mapImage(null)).toBeNull();
    expect(mapImage(undefined)).toBeNull();
  });

  it("maps image fields correctly", () => {
    const result = mapImage({ url: "https://img.com/a.jpg", altText: "Alt", width: 100, height: 200 });
    expect(result).toEqual({ url: "https://img.com/a.jpg", altText: "Alt", width: 100, height: 200 });
  });

  it("defaults altText to null when missing", () => {
    const result = mapImage({ url: "https://img.com/a.jpg" });
    expect(result?.altText).toBeNull();
  });
});

describe("mapPrice", () => {
  it("maps amount and currencyCode", () => {
    expect(mapPrice({ amount: "10.00", currencyCode: "USD" })).toEqual({
      amount: "10.00",
      currencyCode: "USD",
    });
  });
});

describe("mapPriceRange", () => {
  it("maps min and max variant prices", () => {
    const result = mapPriceRange({
      minVariantPrice: { amount: "5.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "15.00", currencyCode: "USD" },
    });
    expect(result.minVariantPrice.amount).toBe("5.00");
    expect(result.maxVariantPrice.amount).toBe("15.00");
  });
});

describe("mapVariant", () => {
  it("maps variant fields", () => {
    const result = mapVariant({
      id: "v1",
      title: "Small",
      availableForSale: true,
      price: { amount: "20.00", currencyCode: "USD" },
      compareAtPrice: null,
      selectedOptions: [{ name: "Size", value: "S" }],
    });
    expect(result.id).toBe("v1");
    expect(result.availableForSale).toBe(true);
    expect(result.compareAtPrice).toBeNull();
  });

  it("defaults title to empty string", () => {
    const result = mapVariant({
      id: "v2",
      price: { amount: "10.00", currencyCode: "USD" },
    });
    expect(result.title).toBe("");
  });

  it("defaults availableForSale to true", () => {
    const result = mapVariant({
      id: "v3",
      price: { amount: "10.00", currencyCode: "USD" },
    });
    expect(result.availableForSale).toBe(true);
  });
});

describe("mapProductOption", () => {
  it("maps option with swatch", () => {
    const result = mapProductOption({
      name: "Color",
      optionValues: [{ id: "1", name: "Red", swatch: { color: "#FF0000" } }],
    });
    expect(result.name).toBe("Color");
    expect(result.optionValues[0].swatch).toEqual({ color: "#FF0000" });
  });

  it("handles missing optionValues", () => {
    const result = mapProductOption({ name: "Style" });
    expect(result.optionValues).toEqual([]);
  });
});

describe("mapProduct", () => {
  it("maps a full Shopify product node", () => {
    const node = {
      id: "p1",
      handle: "test-product",
      title: "Test Product",
      description: "A test",
      productType: "Shirt",
      vendor: "Mama Fern",
      images: { edges: [{ node: { url: "https://img.com/1.jpg", altText: "Img" } }] },
      options: [{ name: "Size", optionValues: [{ id: "s1", name: "S" }] }],
      variants: {
        edges: [
          {
            node: {
              id: "v1",
              price: { amount: "25.00", currencyCode: "USD" },
              selectedOptions: [{ name: "Size", value: "S" }],
            },
          },
        ],
      },
      priceRange: {
        minVariantPrice: { amount: "25.00", currencyCode: "USD" },
        maxVariantPrice: { amount: "25.00", currencyCode: "USD" },
      },
      compareAtPriceRange: null,
      featuredImage: null,
      seo: { title: "Test", description: "A test" },
    };

    const result = mapProduct(node);
    expect(result.id).toBe("p1");
    expect(result.handle).toBe("test-product");
    expect(result.images).toHaveLength(1);
    expect(result.variants).toHaveLength(1);
    expect(result.compareAtPriceRange).toBeNull();
  });

  it("provides default priceRange when missing", () => {
    const result = mapProduct({ id: "p2", handle: "x", title: "X" });
    expect(result.priceRange.minVariantPrice.amount).toBe("0");
  });

  it("defaults arrays to empty when missing", () => {
    const result = mapProduct({ id: "p3", handle: "y", title: "Y" });
    expect(result.images).toEqual([]);
    expect(result.options).toEqual([]);
    expect(result.variants).toEqual([]);
  });
});

describe("mapCollection", () => {
  it("maps collection fields", () => {
    const result = mapCollection({
      id: "c1",
      handle: "kids",
      title: "Kids",
      description: "For kids",
      descriptionHtml: "<p>For kids</p>",
      image: { url: "https://img.com/c.jpg", altText: "Kids" },
    });
    expect(result.handle).toBe("kids");
    expect(result.image?.url).toBe("https://img.com/c.jpg");
  });

  it("defaults missing strings to empty", () => {
    const result = mapCollection({ id: "c2", handle: "test", title: "Test" });
    expect(result.description).toBe("");
    expect(result.descriptionHtml).toBe("");
  });
});

describe("mapCartLineItem", () => {
  it("maps a cart line item with merchandise and product", () => {
    const node = {
      id: "line1",
      quantity: 3,
      merchandise: {
        id: "var1",
        title: "M / Blue",
        price: { amount: "15.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "M" }],
        product: {
          title: "Cool Shirt",
          handle: "cool-shirt",
          vendor: "Mama Fern",
          description: "A cool shirt",
          images: { edges: [{ node: { url: "https://img.com/s.jpg", altText: "Shirt" } }] },
        },
      },
      cost: { totalAmount: { amount: "45.00", currencyCode: "USD" } },
    };

    const result = mapCartLineItem(node);
    expect(result.quantity).toBe(3);
    expect(result.productTitle).toBe("Cool Shirt");
    expect(result.totalAmount.amount).toBe("45.00");
  });

  it("calculates totalAmount when cost is missing", () => {
    const node = {
      id: "line2",
      quantity: 2,
      merchandise: {
        id: "var2",
        price: { amount: "10.00", currencyCode: "USD" },
        product: {},
      },
    };
    const result = mapCartLineItem(node);
    expect(result.totalAmount.amount).toBe("20.00");
  });
});

describe("mapCart", () => {
  it("maps a full cart", () => {
    const cart = {
      id: "cart1",
      checkoutUrl: "https://shop.com/checkout",
      lines: { edges: [] },
      cost: {
        subtotalAmount: { amount: "0.00", currencyCode: "USD" },
        totalAmount: { amount: "0.00", currencyCode: "USD" },
      },
      totalQuantity: 0,
      discountCodes: [],
    };
    const result = mapCart(cart);
    expect(result.id).toBe("cart1");
    expect(result.lines).toEqual([]);
    expect(result.totalQuantity).toBe(0);
  });

  it("defaults missing cost to zero", () => {
    const result = mapCart({ id: "cart2", lines: { edges: [] } });
    expect(result.subtotal.amount).toBe("0.00");
    expect(result.total.amount).toBe("0.00");
  });

  it("maps discount codes", () => {
    const result = mapCart({
      id: "cart3",
      lines: { edges: [] },
      discountCodes: [{ code: "SAVE10", applicable: true }],
    });
    expect(result.discountCodes).toEqual([{ code: "SAVE10", applicable: true }]);
  });
});
