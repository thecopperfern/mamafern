import { NextResponse } from "next/server";

/**
 * Proxies Shopify Storefront API product list to the admin panel.
 * Protected by LOOK_ADMIN_PASS bearer token.
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    const expectedToken = process.env.LOOK_ADMIN_PASS;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shopifyUrl = process.env.SHOPIFY_STORE_API_URL || "";
    const shopifyToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

    if (!shopifyUrl || !shopifyToken) {
      return NextResponse.json(
        { error: "Shopify API is not configured" },
        { status: 500 }
      );
    }

    const query = `
      query GetAllProducts {
        products(first: 50) {
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

    const res = await fetch(shopifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": shopifyToken,
      },
      body: JSON.stringify({ query }),
    });

    const json = await res.json();

    if (json.errors) {
      console.error("[Shopify Products API] GraphQL errors:", json.errors);
      return NextResponse.json(
        { error: "Shopify API error", details: json.errors },
        { status: 502 }
      );
    }

    const products = json.data?.products?.edges?.map(
      (edge: {
        node: {
          id: string;
          title: string;
          handle: string;
          priceRange: {
            minVariantPrice: { amount: string; currencyCode: string };
          };
          images: {
            edges: Array<{
              node: { url: string; altText: string | null };
            }>;
          };
        };
      }) => {
        const node = edge.node;
        const price = node.priceRange?.minVariantPrice;
        return {
          id: node.id,
          title: node.title,
          handle: node.handle,
          price: price
            ? `$${parseFloat(price.amount).toFixed(2)}`
            : "Price TBD",
          images: node.images.edges.map(
            (img: { node: { url: string; altText: string | null } }) => ({
              url: img.node.url,
              altText: img.node.altText || node.title,
            })
          ),
        };
      }
    ) || [];

    return NextResponse.json({ products });
  } catch (error) {
    console.error("[Shopify Products API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
