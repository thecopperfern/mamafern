"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useStorefrontQuery } from "@/hooks/useStorefront";
import { GET_CUSTOMER_ORDERS } from "@/graphql/profile";
import { formatPrice } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Package, ArrowLeft } from "lucide-react";
import Breadcrumbs from "@/components/view/Breadcrumbs";

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    /(?:^|;\s*)customerAccessToken=([^;]*)/
  );
  return match ? decodeURIComponent(match[1]) : null;
}

interface OrderLineItem {
  currentQuantity: number;
  title: string;
  originalTotalPrice: { amount: string; currencyCode: string };
  variant: {
    image: { url: string } | null;
    product: { handle: string } | null;
  } | null;
}

interface Order {
  id: string;
  orderNumber: number;
  name: string;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  lineItems: { nodes: OrderLineItem[] };
  totalPrice: { amount: string; currencyCode: string };
}

interface OrdersResponse {
  customer: {
    orders: {
      edges: { node: Order }[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
        hasPreviousPage: boolean;
        startCursor: string | null;
      };
    };
  };
}

function statusColor(status: string): string {
  const s = status.toUpperCase();
  if (s === "PAID" || s === "FULFILLED") return "bg-fern/10 text-fern";
  if (s === "PENDING" || s === "IN_PROGRESS" || s === "PARTIALLY_FULFILLED")
    return "bg-terracotta/10 text-terracotta";
  if (s === "REFUNDED" || s === "VOIDED" || s === "UNFULFILLED")
    return "bg-warm-brown/10 text-warm-brown";
  return "bg-oat text-charcoal";
}

function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const ORDERS_PER_PAGE = 10;

export default function OrderHistoryPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);

  useEffect(() => {
    const t = getTokenFromCookie();
    if (!t) {
      router.replace("/auth");
      return;
    }
    setToken(t);
  }, [router]);

  const { data, isLoading } = useStorefrontQuery<OrdersResponse>(
    ["customer-orders", token, afterCursor],
    {
      query: GET_CUSTOMER_ORDERS,
      variables: {
        customerAccessToken: token ?? "",
        first: ORDERS_PER_PAGE,
        after: afterCursor,
        sortKey: "PROCESSED_AT",
        reverse: true,
      },
      enabled: !!token,
    }
  );

  const orders = data?.customer?.orders?.edges?.map((e) => e.node) ?? [];
  const pageInfo = data?.customer?.orders?.pageInfo;

  if (!token) return null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <Breadcrumbs
        items={[
          { label: "Account", href: "/account" },
          { label: "Order History" },
        ]}
      />

      <div className="flex items-center gap-3 mt-6 mb-8">
        <Link href="/account">
          <Button variant="ghost" size="icon" className="text-charcoal hover:text-fern">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="font-display text-3xl">Order History</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-oat p-6 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-48" />
              <div className="flex gap-3">
                <Skeleton className="h-16 w-16 rounded" />
                <Skeleton className="h-16 w-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 text-warm-brown mx-auto mb-4" />
          <h2 className="text-lg font-medium mb-2">No orders yet</h2>
          <p className="text-warm-brown mb-6">
            When you place an order, it will appear here.
          </p>
          <Link href="/shop">
            <Button className="bg-fern hover:bg-fern-dark text-white">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-oat p-6 hover:border-fern/30 transition-colors"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-medium text-sm">
                      Order {order.name}
                    </h3>
                    <p className="text-xs text-warm-brown mt-0.5">
                      {new Date(order.processedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${statusColor(order.financialStatus)}`}
                    >
                      {formatStatus(order.financialStatus)}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${statusColor(order.fulfillmentStatus)}`}
                    >
                      {formatStatus(order.fulfillmentStatus)}
                    </Badge>
                  </div>
                </div>

                {/* Line Items */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {order.lineItems.nodes.slice(0, 5).map((item, i) => (
                    <div key={i} className="relative group">
                      {item.variant?.product?.handle ? (
                        <Link href={`/product/${item.variant.product.handle}`}>
                          <div className="relative h-16 w-16 rounded border border-oat overflow-hidden">
                            {item.variant?.image?.url ? (
                              <Image
                                src={item.variant.image.url}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="h-full w-full bg-oat/50 flex items-center justify-center">
                                <Package className="h-4 w-4 text-warm-brown" />
                              </div>
                            )}
                          </div>
                        </Link>
                      ) : (
                        <div className="relative h-16 w-16 rounded border border-oat overflow-hidden">
                          {item.variant?.image?.url ? (
                            <Image
                              src={item.variant.image.url}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="h-full w-full bg-oat/50 flex items-center justify-center">
                              <Package className="h-4 w-4 text-warm-brown" />
                            </div>
                          )}
                        </div>
                      )}
                      {item.currentQuantity > 1 && (
                        <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-fern text-white text-[10px] flex items-center justify-center">
                          {item.currentQuantity}
                        </span>
                      )}
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                        <div className="bg-charcoal text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          {item.title}
                        </div>
                      </div>
                    </div>
                  ))}
                  {order.lineItems.nodes.length > 5 && (
                    <div className="h-16 w-16 rounded border border-oat flex items-center justify-center text-xs text-warm-brown">
                      +{order.lineItems.nodes.length - 5} more
                    </div>
                  )}
                </div>

                {/* Order Total */}
                <div className="flex justify-between items-center pt-3 border-t border-oat/60">
                  <span className="text-sm text-warm-brown">
                    {order.lineItems.nodes.reduce(
                      (sum, li) => sum + li.currentQuantity,
                      0
                    )}{" "}
                    item(s)
                  </span>
                  <span className="font-medium">
                    {formatPrice(
                      order.totalPrice.amount,
                      order.totalPrice.currencyCode
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {(pageInfo?.hasNextPage || afterCursor) && (
            <div className="flex justify-center gap-3 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={!afterCursor}
                onClick={() => setAfterCursor(null)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                First Page
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!pageInfo?.hasNextPage}
                onClick={() => setAfterCursor(pageInfo?.endCursor ?? null)}
              >
                Next Page
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
