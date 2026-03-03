"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { Look, LooksData, LookProduct } from "@/types/looks";

type ShopifyImage = { url: string; alt: string };
type ShopifyProduct = {
  shopifyProductId: string;
  shopifyHandle: string;
  title: string;
  price: string;
  images: ShopifyImage[];
};

const TAB_IDS = ["moms", "dads", "family"] as const;

export default function AdminContent() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [activeTab, setActiveTab] = useState<string>("moms");
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/looks")
      .then((res) => res.json())
      .then((data: LooksData) => {
        if (data.looks?.length) {
          setLooks(data.looks);
        }
      })
      .catch(() => toast.error("Failed to load looks data"));
  }, []);

  const activeLook = looks.find((l) => l.id === activeTab);

  useEffect(() => {
    if (activeLook) {
      setSelectedIds(new Set(activeLook.products.map((p) => p.shopifyProductId)));
    }
  }, [activeTab, activeLook]);

  // Read the passphrase that was verified server-side at login and stored in
  // sessionStorage. This avoids baking NEXT_PUBLIC_LOOK_ADMIN_PASS into the
  // client bundle — changing the password on the server takes effect immediately.
  const adminPass =
    typeof window !== "undefined"
      ? sessionStorage.getItem("lookadmin_pass") ?? ""
      : "";

  const loadShopifyProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/shopify-products", {
        headers: { Authorization: `Bearer ${adminPass}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setShopifyProducts(data.products || []);
      toast.success("Products loaded from Shopify");
    } catch {
      toast.error("Could not load Shopify products. Check your API connection.");
    } finally {
      setLoadingProducts(false);
    }
  }, [adminPass]);

  const updateLook = (updater: (look: Look) => Look) => {
    setLooks((prev) =>
      prev.map((l) => (l.id === activeTab ? updater(l) : l))
    );
  };

  const toggleProductSelection = (sp: ShopifyProduct) => {
    const isSelected = selectedIds.has(sp.shopifyProductId);

    if (!isSelected && selectedIds.size >= 3) {
      toast.warning("Each look supports up to 3 products.");
      return;
    }

    const newSelected = new Set(selectedIds);
    if (isSelected) {
      newSelected.delete(sp.shopifyProductId);
      updateLook((look) => ({
        ...look,
        products: look.products.filter(
          (p) => p.shopifyProductId !== sp.shopifyProductId
        ),
      }));
    } else {
      newSelected.add(sp.shopifyProductId);
      const newProduct: LookProduct = {
        shopifyProductId: sp.shopifyProductId,
        shopifyHandle: sp.shopifyHandle,
        title: sp.title,
        price: sp.price,
        productUrl: `/product/${sp.shopifyHandle}`,
        selectedImageUrl: sp.images[0]?.url || "",
        selectedImageAlt: sp.images[0]?.alt || sp.title,
        comingSoon: true,
      };
      updateLook((look) => ({
        ...look,
        products: [...look.products, newProduct],
      }));
    }
    setSelectedIds(newSelected);
  };

  const updateProduct = (
    productId: string,
    updater: (p: LookProduct) => LookProduct
  ) => {
    updateLook((look) => ({
      ...look,
      products: look.products.map((p) =>
        p.shopifyProductId === productId ? updater(p) : p
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/looks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminPass}`,
        },
        body: JSON.stringify({ looks }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success(
        "Look saved! Pull the latest changes to see updates on your dev server."
      );
    } catch {
      toast.error("Failed to save. Check your connection.");
    } finally {
      setSaving(false);
    }
  };

  const getShopifyImages = (productId: string): ShopifyImage[] => {
    const sp = shopifyProducts.find((p) => p.shopifyProductId === productId);
    return sp?.images || [];
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/mamafern_logo_transparent.png"
            alt="Mama Fern"
            width={100}
            height={34}
            className="h-8 w-auto"
          />
          <span className="text-sm text-warm-brown/60 font-medium">
            Look Admin
          </span>
        </div>
        <a
          href="/"
          className="text-sm text-fern hover:text-fern-dark transition-colors"
        >
          Back to site
        </a>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-1 mb-8" role="tablist">
          {TAB_IDS.map((id) => {
            const look = looks.find((l) => l.id === id);
            return (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all ${
                  activeTab === id
                    ? "bg-fern text-white"
                    : "bg-oat text-warm-brown hover:bg-sage/30"
                }`}
              >
                {look?.label || id}
              </button>
            );
          })}
        </div>

        {activeLook && (
          <div className="space-y-8">
            <Section title="Step 1 -- Hero Image">
              <div className="space-y-4">
                <Field label="Look Title">
                  <input
                    type="text"
                    value={activeLook.title}
                    onChange={(e) =>
                      updateLook((l) => ({ ...l, title: e.target.value }))
                    }
                    className="w-full rounded-lg border border-stone-300 bg-cream px-3 py-2 text-sm text-charcoal placeholder:text-warm-brown/40 focus:border-fern focus:ring-1 focus:ring-fern outline-none"
                    placeholder="e.g., The Everyday Mom Look"
                  />
                </Field>

                <Field label="Hero Image URL">
                  <input
                    type="text"
                    value={activeLook.heroImage}
                    onChange={(e) =>
                      updateLook((l) => ({ ...l, heroImage: e.target.value }))
                    }
                    className="w-full rounded-lg border border-stone-300 bg-cream px-3 py-2 text-sm text-charcoal placeholder:text-warm-brown/40 focus:border-fern focus:ring-1 focus:ring-fern outline-none"
                    placeholder="Paste a Shopify CDN or hosted image URL"
                  />
                </Field>

                <Field label="Hero Image Alt Text">
                  <input
                    type="text"
                    value={activeLook.heroImageAlt}
                    onChange={(e) =>
                      updateLook((l) => ({ ...l, heroImageAlt: e.target.value }))
                    }
                    className="w-full rounded-lg border border-stone-300 bg-cream px-3 py-2 text-sm text-charcoal placeholder:text-warm-brown/40 focus:border-fern focus:ring-1 focus:ring-fern outline-none"
                    placeholder="Describe the image for accessibility"
                  />
                </Field>

                {activeLook.heroImage && (
                  <div className="relative aspect-video w-full max-w-md rounded-xl overflow-hidden border border-stone-200">
                    <Image
                      src={activeLook.heroImage}
                      alt={activeLook.heroImageAlt || "Hero preview"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </Section>

            <Section title="Step 2 -- Select Products (up to 3)">
              <button
                onClick={loadShopifyProducts}
                disabled={loadingProducts}
                className="rounded-full bg-fern text-white text-sm font-medium px-5 py-2.5 hover:bg-fern-dark transition-colors disabled:opacity-50"
              >
                {loadingProducts
                  ? "Loading..."
                  : "Load Products from Shopify"}
              </button>

              {shopifyProducts.length > 0 && (
                <div className="mt-4 space-y-2 max-h-80 overflow-y-auto border border-stone-200 rounded-xl p-3 bg-white">
                  {shopifyProducts.map((sp) => (
                    <label
                      key={sp.shopifyProductId}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-oat/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.has(sp.shopifyProductId)}
                        onChange={() => toggleProductSelection(sp)}
                        className="rounded border-stone-300 text-fern focus:ring-fern"
                      />
                      {sp.images[0] && (
                        <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-oat">
                          <Image
                            src={sp.images[0].url}
                            alt={sp.images[0].alt}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-charcoal font-medium truncate">
                          {sp.title}
                        </p>
                        <p className="text-xs text-warm-brown">{sp.price}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </Section>

            {activeLook.products.length > 0 && (
              <Section title="Configure Selected Products">
                <div className="space-y-6">
                  {activeLook.products.map((product) => (
                    <ProductConfig
                      key={product.shopifyProductId}
                      product={product}
                      shopifyImages={getShopifyImages(product.shopifyProductId)}
                      onUpdate={(updater) =>
                        updateProduct(product.shopifyProductId, updater)
                      }
                    />
                  ))}
                </div>
              </Section>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-full bg-fern text-white font-medium py-3 hover:bg-fern-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Look"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6">
      <h2 className="font-display text-lg text-charcoal mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-warm-brown mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function ProductConfig({
  product,
  shopifyImages,
  onUpdate,
}: {
  product: LookProduct;
  shopifyImages: ShopifyImage[];
  onUpdate: (updater: (p: LookProduct) => LookProduct) => void;
}) {
  const images =
    shopifyImages.length > 0
      ? shopifyImages
      : product.selectedImageUrl
        ? [{ url: product.selectedImageUrl, alt: product.selectedImageAlt }]
        : [];

  return (
    <div className="border border-stone-200 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-charcoal">{product.title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-warm-brown">Coming Soon</span>
          <Switch
            checked={product.comingSoon}
            onCheckedChange={(checked) =>
              onUpdate((p) => ({ ...p, comingSoon: checked }))
            }
          />
        </div>
      </div>

      {images.length > 0 && (
        <div>
          <p className="text-xs text-warm-brown mb-2">
            Select display image:
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() =>
                  onUpdate((p) => ({
                    ...p,
                    selectedImageUrl: img.url,
                    selectedImageAlt: img.alt,
                  }))
                }
                className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                  product.selectedImageUrl === img.url
                    ? "border-fern"
                    : "border-transparent hover:border-stone-300"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <Field label="Product URL">
        <input
          type="text"
          value={product.productUrl}
          onChange={(e) =>
            onUpdate((p) => ({ ...p, productUrl: e.target.value }))
          }
          className="w-full rounded-lg border border-stone-300 bg-cream px-3 py-2 text-sm text-charcoal placeholder:text-warm-brown/40 focus:border-fern focus:ring-1 focus:ring-fern outline-none"
        />
      </Field>
    </div>
  );
}
