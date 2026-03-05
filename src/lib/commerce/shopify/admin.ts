/**
 * Shopify Admin API Client
 *
 * Server-only module for Admin API operations that require elevated
 * permissions (discount code creation, theme management, etc.).
 *
 * Uses the existing SHOPIFY_ADMIN_ACCESS_TOKEN and SHOPIFY_ADMIN_API_URL
 * environment variables.
 *
 * Required Shopify Admin API scopes:
 * - write_discounts, read_discounts (for discount code operations)
 */

const ADMIN_API_URL = process.env.SHOPIFY_ADMIN_API_URL!;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;

async function adminGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(ADMIN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify Admin API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(`Shopify Admin API GraphQL error: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
}

/**
 * Creates a basic discount code in Shopify.
 *
 * @param code - The discount code string (e.g. "WELCOME10")
 * @param type - "percentage" or "fixed"
 * @param value - The discount value (e.g. 10 for 10% or $10)
 * @param startsAt - ISO date string for when the discount starts
 * @param endsAt - ISO date string for when the discount ends (optional)
 * @param title - Internal title for the discount (defaults to the code)
 */
export async function createBasicDiscountCode({
  code,
  type,
  value,
  startsAt,
  endsAt,
  title,
}: {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  startsAt: string;
  endsAt?: string;
  title?: string;
}) {
  const mutation = `
    mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
        codeDiscountNode {
          id
          codeDiscount {
            ... on DiscountCodeBasic {
              title
              codes(first: 1) {
                nodes {
                  code
                }
              }
              startsAt
              endsAt
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Build the discount value based on type
  const customerGets =
    type === "percentage"
      ? {
          value: { percentage: value / 100 },
          items: { all: true },
        }
      : {
          value: { discountAmount: { amount: value, appliesOnEachItem: false } },
          items: { all: true },
        };

  const variables = {
    basicCodeDiscount: {
      title: title || code,
      code,
      startsAt,
      endsAt: endsAt || null,
      customerGets,
      customerSelection: { all: true },
      appliesOncePerCustomer: true,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await adminGraphQL<any>(mutation, variables);
  const result = data.discountCodeBasicCreate;

  if (result.userErrors?.length > 0) {
    throw new Error(
      `Failed to create discount: ${result.userErrors.map((e: { message: string }) => e.message).join(", ")}`
    );
  }

  return result.codeDiscountNode;
}
