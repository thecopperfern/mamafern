"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useStorefrontQuery, useStorefrontMutation } from "@/hooks/useStorefront";
import { GET_CUSTOMER } from "@/graphql/profile";
import { CUSTOMER_UPDATE } from "@/graphql/profile";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, User, LogOut, Heart } from "lucide-react";
import Link from "next/link";
import type { CustomerResponse, CustomerUpdateResponse } from "@/types";

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    /(?:^|;\s*)customerAccessToken=([^;]*)/
  );
  return match ? decodeURIComponent(match[1]) : null;
}

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AccountPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { mutate } = useStorefrontMutation<CustomerUpdateResponse>();

  useEffect(() => {
    const t = getTokenFromCookie();
    if (!t) {
      router.replace("/auth");
      return;
    }
    setToken(t);
  }, [router]);

  const { data, isLoading, refetch } = useStorefrontQuery<CustomerResponse>(
    ["customer", token],
    {
      query: GET_CUSTOMER,
      variables: { customerAccessToken: token ?? "" },
      enabled: !!token,
    }
  );

  const customer = data?.customer;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  // Populate form when customer data loads
  useEffect(() => {
    if (customer) {
      form.reset({
        firstName: customer.firstName ?? "",
        lastName: customer.lastName ?? "",
        email: customer.email ?? "",
        phone: customer.phone ?? "",
      });
    }
  }, [customer, form]);

  async function onSubmit(values: ProfileFormValues) {
    if (!token) return;
    setSaving(true);
    try {
      const response = await mutate({
        query: CUSTOMER_UPDATE,
        variables: {
          customerAccessToken: token,
          customer: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone || null,
          },
        },
      });

      if (response.customerUpdate.customerUserErrors.length > 0) {
        throw new Error(response.customerUpdate.customerUserErrors[0].message);
      }

      toast.success("Profile updated successfully");
      setEditing(false);
      refetch();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    document.cookie =
      "customerAccessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("cartId");
    router.push("/");
  }

  if (!token) {
    return null; // Will redirect via useEffect
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl mb-2">My Account</h1>
      <p className="text-warm-brown/60 mb-8">
        Manage your profile and view past orders.
      </p>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link
          href="/account/orders"
          className="flex items-center gap-3 rounded-lg border border-oat p-4 hover:border-fern/40 transition-colors"
        >
          <Package className="h-5 w-5 text-fern" />
          <div>
            <div className="text-sm font-medium">Order History</div>
            <div className="text-xs text-warm-brown/50">View past orders</div>
          </div>
        </Link>
        <Link
          href="/wishlist"
          className="flex items-center gap-3 rounded-lg border border-oat p-4 hover:border-fern/40 transition-colors"
        >
          <Heart className="h-5 w-5 text-fern" />
          <div>
            <div className="text-sm font-medium">Wishlist</div>
            <div className="text-xs text-warm-brown/50">Saved items</div>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg border border-oat p-4 hover:border-terracotta/40 transition-colors text-left"
        >
          <LogOut className="h-5 w-5 text-terracotta" />
          <div>
            <div className="text-sm font-medium">Log Out</div>
            <div className="text-xs text-warm-brown/50">Sign out of your account</div>
          </div>
        </button>
      </div>

      {/* Profile Section */}
      <div className="rounded-lg border border-oat p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fern/10">
              <User className="h-5 w-5 text-fern" />
            </div>
            <h2 className="text-lg font-medium">Profile Details</h2>
          </div>
          {!editing && !isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-40" />
          </div>
        ) : editing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="bg-fern hover:bg-fern-dark text-white" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    if (customer) {
                      form.reset({
                        firstName: customer.firstName ?? "",
                        lastName: customer.lastName ?? "",
                        email: customer.email ?? "",
                        phone: customer.phone ?? "",
                      });
                    }
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <dl className="space-y-3 text-sm">
            <div className="flex gap-2">
              <dt className="text-warm-brown/50 w-24">Name</dt>
              <dd className="font-medium">
                {customer?.firstName} {customer?.lastName}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-warm-brown/50 w-24">Email</dt>
              <dd className="font-medium">{customer?.email}</dd>
            </div>
            {customer?.phone && (
              <div className="flex gap-2">
                <dt className="text-warm-brown/50 w-24">Phone</dt>
                <dd className="font-medium">{customer.phone}</dd>
              </div>
            )}
          </dl>
        )}
      </div>
    </main>
  );
}
