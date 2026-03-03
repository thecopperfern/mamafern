import { NextResponse } from "next/server";
import { fetchGraphQL } from "@/shopify/client";
import gql from "graphql-tag";

const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

type ShopifyProductNode = {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
};

export async function GET(request: Request) {
  const adminPass =
    (process.env.LOOK_ADMIN_PASS || process.env.NEXT_PUBLIC_LOOK_ADMIN_PASS)?.trim();
  if (!adminPass) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${adminPass}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await fetchGraphQL<any>(GET_ALL_PRODUCTS, { first: 100 });
    const products = (data.products?.edges ?? []).map(
      (edge: { node: ShopifyProductNode }) => {
        const node = edge.node;
        const price = parseFloat(node.priceRange.minVariantPrice.amount);
        const currency = node.priceRange.minVariantPrice.currencyCode;
        const formatted =
          currency === "USD" ? `$${price.toFixed(2)}` : `${price} ${currency}`;

        return {
          shopifyProductId: node.id,
          shopifyHandle: node.handle,
          title: node.title,
          price: formatted,
          images: node.images.edges.map((img) => ({
            url: img.node.url,
            alt: img.node.altText || node.title,
          })),
        };
      }
    );

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
