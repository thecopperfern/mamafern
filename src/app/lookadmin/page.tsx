"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Lock, Loader2, ImageIcon, Check, RefreshCw } from "lucide-react";

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
interface Product {
  shopifyProductId: string;
  shopifyHandle: string;
  title: string;
  price: string;
  productUrl: string;
  selectedImageUrl: string;
  selectedImageAlt: string;
  comingSoon: boolean;
}

interface Look {
  id: string;
  label: string;
  title: string;
  heroImage: string;
  heroImageAlt: string;
  products: Product[];
}

interface LooksData {
  looks: Look[];
}

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  price: string;
  images: Array<{ url: string; altText: string }>;
}

// ----------------------------------------------------------------
// NEXT_PUBLIC_LOOK_ADMIN_PASS — must be set as a public env var
// so the client can validate the passphrase without a server call.
// Add it to .env.local:
//   NEXT_PUBLIC_LOOK_ADMIN_PASS=Fern4Life
// ----------------------------------------------------------------
const ADMIN_PASS = process.env.NEXT_PUBLIC_LOOK_ADMIN_PASS || "";

export default function LookAdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [looksData, setLooksData] = useState<LooksData | null>(null);
  const [activeTab, setActiveTab] = useState("moms");
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);

  // Selected product IDs per tab (for the checkbox flow)
  const [selectedIds, setSelectedIds] = useState<Record<string, string[]>>({
    moms: [],
    dads: [],
    family: [],
  });

  // Check sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("lookadmin_auth");
      if (auth === "true") setAuthenticated(true);
    }
  }, []);

  // Load looks data once authenticated
  useEffect(() => {
    if (!authenticated) return;
    fetch("/lookadmin/data")
      .then((r) => r.json())
      .then((data: LooksData) => {
        setLooksData(data);
        // Pre-populate selectedIds from existing products
        const ids: Record<string, string[]> = { moms: [], dads: [], family: [] };
        data.looks.forEach((look) => {
          ids[look.id] = look.products.map((p) => p.shopifyProductId);
        });
        setSelectedIds(ids);
      })
      .catch(() => toast.error("Failed to load looks data"));
  }, [authenticated]);

  // ----------------------------------------------------------------
  // Auth handler
  // ----------------------------------------------------------------
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase === ADMIN_PASS) {
      sessionStorage.setItem("lookadmin_auth", "true");
      setAuthenticated(true);
    } else {
      toast.error("Incorrect passphrase");
    }
  };

  // ----------------------------------------------------------------
  // Shopify product loader
  // ----------------------------------------------------------------
  const loadShopifyProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/lookadmin/shopify", {
        headers: { Authorization: `Bearer ${ADMIN_PASS}` },
      });
      const data = await res.json();
      if (data.products) {
        setShopifyProducts(data.products);
        toast.success(`Loaded ${data.products.length} products from Shopify`);
      } else {
        toast.error(data.error || "Failed to load products");
      }
    } catch {
      toast.error("Failed to connect to Shopify");
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // ----------------------------------------------------------------
  // Look field updaters
  // ----------------------------------------------------------------
  const updateLookField = (
    lookId: string,
    field: keyof Look,
    value: string
  ) => {
    if (!looksData) return;
    setLooksData({
      looks: looksData.looks.map((l) =>
        l.id === lookId ? { ...l, [field]: value } : l
      ),
    });
  };

  // ----------------------------------------------------------------
  // Product selection toggle
  // ----------------------------------------------------------------
  const toggleProduct = (lookId: string, shopifyProduct: ShopifyProduct) => {
    const currentIds = selectedIds[lookId] || [];
    const isSelected = currentIds.includes(shopifyProduct.id);

    if (!isSelected && currentIds.length >= 3) {
      toast.warning("Each look supports up to 3 products.");
      return;
    }

    const newIds = isSelected
      ? currentIds.filter((id) => id !== shopifyProduct.id)
      : [...currentIds, shopifyProduct.id];
    setSelectedIds({ ...selectedIds, [lookId]: newIds });

    // Also add/remove from the look's products array
    if (!looksData) return;
    setLooksData({
      looks: looksData.looks.map((look) => {
        if (look.id !== lookId) return look;

        if (isSelected) {
          // Remove
          return {
            ...look,
            products: look.products.filter(
              (p) => p.shopifyProductId !== shopifyProduct.id
            ),
          };
        } else {
          // Add
          const newProduct: Product = {
            shopifyProductId: shopifyProduct.id,
            shopifyHandle: shopifyProduct.handle,
            title: shopifyProduct.title,
            price: shopifyProduct.price,
            productUrl: `/product/${shopifyProduct.handle}`,
            selectedImageUrl: shopifyProduct.images[0]?.url || "",
            selectedImageAlt: shopifyProduct.images[0]?.altText || shopifyProduct.title,
            comingSoon: true,
          };
          return { ...look, products: [...look.products, newProduct] };
        }
      }),
    });
  };

  // ----------------------------------------------------------------
  // Product config updaters
  // ----------------------------------------------------------------
  const updateProductImage = (
    lookId: string,
    productId: string,
    imageUrl: string,
    imageAlt: string
  ) => {
    if (!looksData) return;
    setLooksData({
      looks: looksData.looks.map((look) =>
        look.id === lookId
          ? {
              ...look,
              products: look.products.map((p) =>
                p.shopifyProductId === productId
                  ? { ...p, selectedImageUrl: imageUrl, selectedImageAlt: imageAlt }
                  : p
              ),
            }
          : look
      ),
    });
  };

  const updateProductComingSoon = (
    lookId: string,
    productId: string,
    comingSoon: boolean
  ) => {
    if (!looksData) return;
    setLooksData({
      looks: looksData.looks.map((look) =>
        look.id === lookId
          ? {
              ...look,
              products: look.products.map((p) =>
                p.shopifyProductId === productId
                  ? { ...p, comingSoon }
                  : p
              ),
            }
          : look
      ),
    });
  };

  const updateProductUrl = (
    lookId: string,
    productId: string,
    url: string
  ) => {
    if (!looksData) return;
    setLooksData({
      looks: looksData.looks.map((look) =>
        look.id === lookId
          ? {
              ...look,
              products: look.products.map((p) =>
                p.shopifyProductId === productId
                  ? { ...p, productUrl: url }
                  : p
              ),
            }
          : look
      ),
    });
  };

  // ----------------------------------------------------------------
  // Save handler
  // ----------------------------------------------------------------
  const saveLook = async () => {
    if (!looksData) return;
    setSaving(true);
    try {
      const res = await fetch("/lookadmin/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_PASS}`,
        },
        body: JSON.stringify(looksData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          "Look saved! Pull the latest changes to see updates on your dev server."
        );
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Failed to save looks data");
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------------------------------
  // Password Gate
  // ----------------------------------------------------------------
  if (!authenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cream px-4"
        data-testid="lookadmin-auth-gate"
      >
        <form
          onSubmit={handleAuth}
          className="w-full max-w-sm space-y-6 bg-white rounded-2xl border border-stone-200 p-8 shadow-sm"
        >
          <div className="text-center space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mamafern_logo_transparent.png"
              alt="Mama Fern"
              className="h-12 mx-auto"
            />
            <h1
              className="font-display text-xl text-charcoal"
              data-testid="lookadmin-auth-title"
            >
              Look Admin
            </h1>
            <p className="text-sm text-stone-500">
              Enter your passphrase to continue
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passphrase" className="text-charcoal">
              Admin passphrase
            </Label>
            <Input
              id="passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter passphrase"
              className="border-stone-200 focus-visible:ring-fern"
              data-testid="lookadmin-passphrase-input"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-fern hover:bg-fern-dark text-white gap-2"
            data-testid="lookadmin-auth-submit"
          >
            <Lock className="h-4 w-4" />
            Unlock Admin
          </Button>
        </form>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // Admin Panel
  // ----------------------------------------------------------------
  if (!looksData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="animate-spin h-8 w-8 text-fern" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cream"
      data-testid="lookadmin-panel"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl text-charcoal">
              Shop the Look Admin
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Curate lookbook data for the homepage
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem("lookadmin_auth");
              setAuthenticated(false);
            }}
            className="border-stone-300 text-stone-600"
            data-testid="lookadmin-logout"
          >
            Lock
          </Button>
        </div>

        {/* Tabs for each look */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          data-testid="lookadmin-tabs"
        >
          <TabsList className="bg-oat/60 border border-stone-200">
            {looksData.looks.map((look) => (
              <TabsTrigger
                key={look.id}
                value={look.id}
                className="data-[state=active]:bg-cream data-[state=active]:text-fern-dark data-[state=active]:shadow-sm text-charcoal-light px-5"
                data-testid={`lookadmin-tab-${look.id}`}
              >
                {look.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {looksData.looks.map((look) => (
            <TabsContent key={look.id} value={look.id}>
              <div className="space-y-8 mt-6">
                {/* Step 1: Hero Image */}
                <div
                  className="bg-white rounded-xl border border-stone-200 p-6 space-y-4"
                  data-testid={`lookadmin-hero-section-${look.id}`}
                >
                  <h2 className="font-display text-lg text-charcoal">
                    Step 1 — Hero Image
                  </h2>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-charcoal">Look Title</Label>
                      <Input
                        value={look.title}
                        onChange={(e) =>
                          updateLookField(look.id, "title", e.target.value)
                        }
                        placeholder='e.g. "The Everyday Mom Look"'
                        className="border-stone-200 focus-visible:ring-fern"
                        data-testid={`lookadmin-title-input-${look.id}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-charcoal">Hero Image URL</Label>
                      <Input
                        value={look.heroImage}
                        onChange={(e) =>
                          updateLookField(look.id, "heroImage", e.target.value)
                        }
                        placeholder="Paste a Shopify CDN URL or any hosted image URL"
                        className="border-stone-200 focus-visible:ring-fern"
                        data-testid={`lookadmin-hero-url-input-${look.id}`}
                      />
                      {/* File upload could be added here for /public/images/looks/ uploads */}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-charcoal">
                        Hero Image Alt Text
                      </Label>
                      <Input
                        value={look.heroImageAlt}
                        onChange={(e) =>
                          updateLookField(
                            look.id,
                            "heroImageAlt",
                            e.target.value
                          )
                        }
                        placeholder="Describe the image for accessibility"
                        className="border-stone-200 focus-visible:ring-fern"
                        data-testid={`lookadmin-hero-alt-input-${look.id}`}
                      />
                    </div>

                    {/* Preview */}
                    {look.heroImage && (
                      <div
                        className="mt-2 rounded-lg overflow-hidden border border-stone-200 aspect-video relative bg-oat"
                        data-testid={`lookadmin-hero-preview-${look.id}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={look.heroImage}
                          alt={look.heroImageAlt || "Hero preview"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: Select Products */}
                <div
                  className="bg-white rounded-xl border border-stone-200 p-6 space-y-4"
                  data-testid={`lookadmin-products-section-${look.id}`}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg text-charcoal">
                      Step 2 — Select Products (up to 3)
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadShopifyProducts}
                      disabled={loadingProducts}
                      className="border-fern text-fern hover:bg-fern/10 gap-2"
                      data-testid={`lookadmin-load-products-${look.id}`}
                    >
                      {loadingProducts ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      Load Products from Shopify
                    </Button>
                  </div>

                  {/* Shopify Product List */}
                  {shopifyProducts.length > 0 && (
                    <div
                      className="grid gap-2 max-h-72 overflow-y-auto pr-1"
                      data-testid={`lookadmin-product-list-${look.id}`}
                    >
                      {shopifyProducts.map((sp) => {
                        const isChecked = (
                          selectedIds[look.id] || []
                        ).includes(sp.id);
                        return (
                          <label
                            key={sp.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              isChecked
                                ? "border-fern bg-fern/5"
                                : "border-stone-200 hover:border-stone-300"
                            }`}
                            data-testid={`lookadmin-product-option-${sp.handle}`}
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() =>
                                toggleProduct(look.id, sp)
                              }
                              className="data-[state=checked]:bg-fern data-[state=checked]:border-fern"
                            />
                            <div className="w-10 h-10 rounded overflow-hidden bg-oat flex-shrink-0">
                              {sp.images[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={sp.images[0].url}
                                  alt={sp.images[0].altText}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="h-4 w-4 text-stone-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-charcoal truncate">
                                {sp.title}
                              </p>
                              <p className="text-xs text-stone-500">
                                {sp.price}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Configure Selected Products */}
                  {look.products.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-stone-100">
                      <h3 className="text-sm font-medium text-charcoal">
                        Configure Selected Products
                      </h3>
                      {look.products.map((product) => {
                        // Find the matching Shopify product for image gallery
                        const sp = shopifyProducts.find(
                          (s) => s.id === product.shopifyProductId
                        );
                        return (
                          <div
                            key={product.shopifyProductId}
                            className="bg-oat/30 rounded-lg border border-stone-100 p-4 space-y-3"
                            data-testid={`lookadmin-product-config-${product.shopifyHandle}`}
                          >
                            <p className="font-medium text-charcoal text-sm">
                              {product.title}
                            </p>

                            {/* Image Gallery (from Shopify if available) */}
                            {sp && sp.images.length > 0 && (
                              <div className="space-y-1">
                                <Label className="text-xs text-stone-500">
                                  Select Image
                                </Label>
                                <div className="flex gap-2 flex-wrap">
                                  {sp.images.map((img, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() =>
                                        updateProductImage(
                                          look.id,
                                          product.shopifyProductId,
                                          img.url,
                                          img.altText
                                        )
                                      }
                                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                        product.selectedImageUrl === img.url
                                          ? "border-fern shadow-sm"
                                          : "border-stone-200 hover:border-stone-300"
                                      }`}
                                      data-testid={`lookadmin-img-select-${product.shopifyHandle}-${idx}`}
                                    >
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={img.url}
                                        alt={img.altText}
                                        className="w-full h-full object-cover"
                                      />
                                      {product.selectedImageUrl === img.url && (
                                        <div className="absolute inset-0 bg-fern/10 flex items-center justify-center">
                                          <Check className="h-4 w-4 text-fern" />
                                        </div>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Coming Soon Toggle */}
                            <div className="flex items-center gap-3">
                              <Switch
                                checked={product.comingSoon}
                                onCheckedChange={(checked) =>
                                  updateProductComingSoon(
                                    look.id,
                                    product.shopifyProductId,
                                    checked
                                  )
                                }
                                className="data-[state=checked]:bg-fern"
                                data-testid={`lookadmin-coming-soon-toggle-${product.shopifyHandle}`}
                              />
                              <Label className="text-sm text-charcoal">
                                Coming Soon
                              </Label>
                            </div>

                            {/* Product URL */}
                            <div className="space-y-1">
                              <Label className="text-xs text-stone-500">
                                Product URL
                              </Label>
                              <Input
                                value={product.productUrl}
                                onChange={(e) =>
                                  updateProductUrl(
                                    look.id,
                                    product.shopifyProductId,
                                    e.target.value
                                  )
                                }
                                className="border-stone-200 focus-visible:ring-fern text-sm"
                                data-testid={`lookadmin-product-url-${product.shopifyHandle}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <Button
                  onClick={saveLook}
                  disabled={saving}
                  className="w-full bg-fern hover:bg-fern-dark text-white gap-2"
                  size="lg"
                  data-testid={`lookadmin-save-${look.id}`}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Save Look
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
