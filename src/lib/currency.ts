/**
 * Centralized currency formatting utility.
 * Uses the browser's locale for number formatting and
 * the currency code from Shopify's response.
 */
export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(parseFloat(amount));
}

/**
 * Format a price with explicit locale override.
 * Useful for server-rendered content or testing.
 */
export function formatPriceWithLocale(
  amount: string,
  currencyCode: string,
  locale: string
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(parseFloat(amount));
}
