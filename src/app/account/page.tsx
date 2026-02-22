"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStorefrontQuery, useStorefrontMutation } from "@/hooks/useStorefront";
import { GET_CUSTOMER, GET_CUSTOMER_ORDERS, CUSTOMER_UPDATE } from "@/graphql/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  acceptsMarketing: boolean;
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
    if (!t) router.replace("/auth");
    else setToken(t);
  }, [router]);

  const { data: customerData, isLoading: customerLoading } =
    useStorefrontQuery<{ customer: Customer }>(["customer", token], {
      query: GET_CUSTOMER,
      variables: { customerAccessToken: token ?? "" },
      enabled: !!token,
    });

  const { data: ordersData, isLoading: ordersLoading } =
    useStorefrontQuery<{ customer: { orders: { edges: { node: Order }[] } } }>(
      ["orders", token],
      {
        query: GET_CUSTOMER_ORDERS,
        variables: {
          customerAccessToken: token ?? "",
          first: 10,
          sortKey: "PROCESSED_AT",
          reverse: true,
        },
        enabled: !!token,
      }
    );

  const { mutate } = useStorefrontMutation();

  // Local state mirrors the server data so we can update optimistically
  const [customer, setCustomer] = useState<Customer | null>(null);
  useEffect(() => {
    if (customerData?.customer) setCustomer(customerData.customer);
  }, [customerData]);

  const orders = ordersData?.customer?.orders?.edges?.map((e) => e.node) ?? [];

  // ── Profile edit ──────────────────────────────────────────────────────────
  const [editingProfile, setEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const startEdit = () => {
    if (!customer) return;
    setEditFirstName(customer.firstName);
    setEditLastName(customer.lastName);
    setEditPhone(customer.phone ?? "");
    setEditingProfile(true);
  };

  const saveProfile = async () => {
    if (!token) return;
    setSavingProfile(true);
    try {
      const res = (await mutate({
        query: CUSTOMER_UPDATE,
        variables: {
          customerAccessToken: token,
          customer: {
            firstName: editFirstName,
            lastName: editLastName,
            ...(editPhone ? { phone: editPhone } : {}),
          },
        },
      })) as {
        customerUpdate: {
          customer: Customer;
          customerUserErrors: { message: string }[];
        };
      };

      if (res.customerUpdate.customerUserErrors.length > 0) {
        throw new Error(res.customerUpdate.customerUserErrors[0].message);
      }
      setCustomer(res.customerUpdate.customer);
      setEditingProfile(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Marketing preference ──────────────────────────────────────────────────
  const [updatingMarketing, setUpdatingMarketing] = useState(false);

  const handleMarketingToggle = async (checked: boolean) => {
    if (!token) return;
    setUpdatingMarketing(true);
    setCustomer((prev) =>
      prev ? { ...prev, acceptsMarketing: checked } : prev
    );
    try {
      await mutate({
        query: CUSTOMER_UPDATE,
        variables: {
          customerAccessToken: token,
          customer: { acceptsMarketing: checked },
        },
      });
      toast.success(
        checked ? "Subscribed to emails" : "Unsubscribed from emails"
      );
    } catch {
      setCustomer((prev) =>
        prev ? { ...prev, acceptsMarketing: !checked } : prev
      );
      toast.error("Failed to update preference");
    } finally {
      setUpdatingMarketing(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (!token) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-display font-bold text-charcoal mb-8">
        My Account
      </h1>

      {/* Profile */}
      <section className="bg-white rounded-xl border border-oat p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-charcoal">
            Profile
          </h2>
          {!editingProfile && customer && (
            <Button size="sm" variant="outline" onClick={startEdit}>
              Edit
            </Button>
          )}
        </div>

        {customerLoading && !customer ? (
          <p className="text-warm-brown/60 text-sm">Loading...</p>
        ) : customer ? (
          editingProfile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-warm-brown/60 mb-1">
                    First Name
                  </label>
                  <Input
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-warm-brown/60 mb-1">
                    Last Name
                  </label>
                  <Input
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-warm-brown/60 mb-1">
                  Phone (optional)
                </label>
                <Input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="h-9 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={savingProfile}
                  onClick={saveProfile}
                  className="bg-fern hover:bg-fern-dark text-white"
                >
                  {savingProfile ? "Saving..." : "Save"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={savingProfile}
                  onClick={() => setEditingProfile(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
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
          )
        ) : (
          <p className="text-warm-brown/60 text-sm">Could not load profile.</p>
        )}
      </section>

      {/* Email preferences */}
      <section className="bg-white rounded-xl border border-oat p-6 mb-6">
        <h2 className="text-lg font-display font-semibold text-charcoal mb-4">
          Email Preferences
        </h2>
        {customer ? (
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <Checkbox
              checked={customer.acceptsMarketing}
              disabled={updatingMarketing}
              onCheckedChange={(checked) =>
                handleMarketingToggle(checked === true)
              }
              className="mt-0.5"
            />
            <div>
              <p className="text-sm font-medium text-charcoal">
                Subscribe to email updates
              </p>
              <p className="text-xs text-warm-brown/60 mt-0.5">
                New arrivals, exclusive deals, and family inspo straight to
                your inbox.
              </p>
            </div>
          </label>
        ) : (
          <p className="text-warm-brown/60 text-sm">Loading preferences...</p>
        )}
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
              <div key={order.id} className="border border-oat rounded-lg p-4">
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
                    {order.financialStatus.toLowerCase().replace(/_/g, " ")}
                  </span>
                  <span>·</span>
                  <span className="capitalize">
                    {order.fulfillmentStatus.toLowerCase().replace(/_/g, " ")}
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
