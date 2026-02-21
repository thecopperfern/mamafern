"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStorefrontQuery, useStorefrontMutation } from "@/hooks/useStorefront";
import { GET_CUSTOMER, GET_CUSTOMER_ORDERS, CUSTOMER_UPDATE } from "@/graphql/profile";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatPrice } from "@/lib/currency";

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)customerAccessToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

interface OrderLineItem {
  currentQuantity: number;
  title: string;
  originalTotalPrice: { amount: string; currencyCode: string };
  variant: { image: { url: string } | null; product: { handle: string } } | null;
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

export default function AccountPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = getTokenFromCookie();
    if (!t) {
      router.replace("/auth");
    } else {
      setToken(t);
    }
  }, [router]);

  const { data: customerData, isLoading: customerLoading } =
    useStorefrontQuery<{ customer: Customer }>(["customer", token], {
      query: GET_CUSTOMER,
      variables: { customerAccessToken: token ?? "" },
      enabled: !!token,
    });

  const { data: ordersData, isLoading: ordersLoading } =
    useStorefrontQuery<{
      customer: { orders: { edges: { node: Order }[] } };
    }>(["orders", token], {
      query: GET_CUSTOMER_ORDERS,
      variables: {
        customerAccessToken: token ?? "",
        first: 10,
        sortKey: "PROCESSED_AT",
        reverse: true,
      },
      enabled: !!token,
    });

  const { mutate } = useStorefrontMutation();
  const [updatingMarketing, setUpdatingMarketing] = useState(false);

  const customer = customerData?.customer;
  const orders = ordersData?.customer?.orders?.edges?.map((e) => e.node) ?? [];

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  async function toggleMarketing(acceptsMarketing: boolean) {
    if (!token) return;
    setUpdatingMarketing(true);
    try {
      await mutate({
        query: CUSTOMER_UPDATE,
        variables: {
          customerAccessToken: token,
          customer: { acceptsMarketing },
        },
      });
      toast.success(
        acceptsMarketing ? "Subscribed to emails" : "Unsubscribed from emails"
      );
    } catch {
      toast.error("Failed to update preference");
    } finally {
      setUpdatingMarketing(false);
    }
  }

  if (!token) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-display font-bold text-charcoal mb-8">
        My Account
      </h1>

      {/* Profile */}
      <section className="bg-white rounded-xl border border-oat p-6 mb-6">
        <h2 className="text-lg font-display font-semibold text-charcoal mb-4">
          Profile
        </h2>
        {customerLoading ? (
          <p className="text-warm-brown/60 text-sm">Loading...</p>
        ) : customer ? (
          <div className="space-y-2 text-sm text-charcoal">
            <p>
              <span className="text-warm-brown/60">Name:</span>{" "}
              {customer.firstName} {customer.lastName}
            </p>
            <p>
              <span className="text-warm-brown/60">Email:</span>{" "}
              {customer.email}
            </p>
            {customer.phone && (
              <p>
                <span className="text-warm-brown/60">Phone:</span>{" "}
                {customer.phone}
              </p>
            )}
          </div>
        ) : (
          <p className="text-warm-brown/60 text-sm">Could not load profile.</p>
        )}
      </section>

      {/* Email preferences */}
      <section className="bg-white rounded-xl border border-oat p-6 mb-6">
        <h2 className="text-lg font-display font-semibold text-charcoal mb-4">
          Email Preferences
        </h2>
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            variant="outline"
            disabled={updatingMarketing}
            onClick={() => toggleMarketing(true)}
          >
            Subscribe
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={updatingMarketing}
            onClick={() => toggleMarketing(false)}
          >
            Unsubscribe
          </Button>
        </div>
      </section>

      {/* Orders */}
      <section className="bg-white rounded-xl border border-oat p-6">
        <h2 className="text-lg font-display font-semibold text-charcoal mb-4">
          Order History
        </h2>
        {ordersLoading ? (
          <p className="text-warm-brown/60 text-sm">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-warm-brown/60 text-sm">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-oat rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-charcoal">
                    {order.name}
                  </span>
                  <span className="text-xs text-warm-brown/60">
                    {formatDate(order.processedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-warm-brown/60 mb-2">
                  <span className="capitalize">
                    {order.financialStatus.toLowerCase().replace("_", " ")}
                  </span>
                  <span className="capitalize">
                    {order.fulfillmentStatus.toLowerCase().replace("_", " ")}
                  </span>
                </div>
                <ul className="space-y-1 text-sm text-charcoal">
                  {order.lineItems.nodes.map((item, i) => (
                    <li key={i} className="flex justify-between">
                      <span>
                        {item.title} &times; {item.currentQuantity}
                      </span>
                      <span className="text-warm-brown/60">
                        {formatPrice(
                          item.originalTotalPrice.amount,
                          item.originalTotalPrice.currencyCode
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 pt-2 border-t border-oat flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>
                    {formatPrice(
                      order.totalPrice.amount,
                      order.totalPrice.currencyCode
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
