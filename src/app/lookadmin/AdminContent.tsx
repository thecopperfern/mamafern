"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import {
  Plus,
  Copy,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Upload,
  X,
  CalendarIcon,
  Tag,
} from "lucide-react";
import type {
  Look,
  LooksData,
  LookProduct,
  LookProductBadge,
  BadgeVariant,
  LookHotspot,
} from "@/types/looks";

// ─── Types ──────────────────────────────────────────────────────────────────

type ShopifyImage = { url: string; alt: string };
type ShopifyProduct = {
  shopifyProductId: string;
  shopifyHandle: string;
  title: string;
  price: string;
  images: ShopifyImage[];
};

// ─── Badge Presets ──────────────────────────────────────────────────────────

const BADGE_PRESETS: { label: string; badge: LookProductBadge | null }[] = [
  { label: "None", badge: null },
  { label: "Coming Soon", badge: { text: "Coming Soon", variant: "default" } },
  { label: "New", badge: { text: "New", variant: "success" } },
  { label: "Sale", badge: { text: "Sale", variant: "danger" } },
  { label: "Sold Out", badge: { text: "Sold Out", variant: "warning" } },
  { label: "Limited", badge: { text: "Limited", variant: "info" } },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function createEmptyLook(id?: string): Look {
  return {
    id: id || uuidv4(),
    label: "New Look",
    title: "",
    description: "",
    heroImage: "",
    heroImageAlt: "",
    products: [],
    order: 0,
    status: "draft",
  };
}

function createManualProduct(): LookProduct {
  return {
    id: uuidv4(),
    source: "manual",
    title: "",
    price: "",
    productUrl: null,
    selectedImageUrl: "",
    selectedImageAlt: "",
    badge: null,
    order: 0,
  };
}

function shopifyToLookProduct(
  sp: ShopifyProduct,
  order: number
): LookProduct {
  return {
    id: uuidv4(),
    source: "shopify",
    shopifyProductId: sp.shopifyProductId,
    shopifyHandle: sp.shopifyHandle,
    title: sp.title,
    price: sp.price,
    productUrl: `/product/${sp.shopifyHandle}`,
    selectedImageUrl: sp.images[0]?.url || "",
    selectedImageAlt: sp.images[0]?.alt || sp.title,
    badge: null,
    order,
  };
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString();
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AdminContent() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const adminPass =
    typeof window !== "undefined"
      ? sessionStorage.getItem("lookadmin_pass") ?? ""
      : "";

  // ─── Load Data ────────────────────────────────────────────────────────

  useEffect(() => {
    fetch("/api/looks")
      .then((res) => res.json())
      .then((data: LooksData) => {
        if (data.looks?.length) {
          setLooks(data.looks);
          setActiveTabId(data.looks[0].id);
        }
      })
      .catch(() => toast.error("Failed to load looks data"));
  }, []);

  // ─── Unsaved Changes Warning ──────────────────────────────────────────

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges]);

  // ─── Active Look ──────────────────────────────────────────────────────

  const activeLook = looks.find((l) => l.id === activeTabId);

  const updateLooks = useCallback(
    (updater: (prev: Look[]) => Look[]) => {
      setLooks(updater);
      setHasUnsavedChanges(true);
    },
    []
  );

  const updateLook = useCallback(
    (updater: (look: Look) => Look) => {
      updateLooks((prev) =>
        prev.map((l) => (l.id === activeTabId ? updater(l) : l))
      );
    },
    [activeTabId, updateLooks]
  );

  const updateProduct = useCallback(
    (productId: string, updater: (p: LookProduct) => LookProduct) => {
      updateLook((look) => ({
        ...look,
        products: look.products.map((p) =>
          p.id === productId ? updater(p) : p
        ),
      }));
    },
    [updateLook]
  );

  // ─── Look Tab Actions ────────────────────────────────────────────────

  const addLook = () => {
    const newLook = createEmptyLook();
    newLook.order = looks.length;
    updateLooks((prev) => [...prev, newLook]);
    setActiveTabId(newLook.id);
  };

  const duplicateLook = () => {
    if (!activeLook) return;
    const newLook: Look = {
      ...JSON.parse(JSON.stringify(activeLook)),
      id: uuidv4(),
      label: `${activeLook.label} (Copy)`,
      order: looks.length,
      products: activeLook.products.map((p) => ({
        ...p,
        id: uuidv4(),
      })),
    };
    updateLooks((prev) => [...prev, newLook]);
    setActiveTabId(newLook.id);
  };

  const deleteLook = () => {
    if (looks.length <= 1) {
      toast.error("You must have at least one look.");
      return;
    }
    const remaining = looks.filter((l) => l.id !== activeTabId);
    updateLooks(() => remaining);
    setActiveTabId(remaining[0]?.id || "");
  };

  const handleTabDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    updateLooks((prev) => {
      const oldIndex = prev.findIndex((l) => l.id === active.id);
      const newIndex = prev.findIndex((l) => l.id === over.id);
      return arrayMove(prev, oldIndex, newIndex).map((l, i) => ({
        ...l,
        order: i,
      }));
    });
  };

  // ─── Product Actions ──────────────────────────────────────────────────

  const addManualProduct = () => {
    const product = createManualProduct();
    product.order = activeLook?.products.length || 0;
    updateLook((look) => ({
      ...look,
      products: [...look.products, product],
    }));
  };

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
      toast.error("Could not load Shopify products.");
    } finally {
      setLoadingProducts(false);
    }
  }, [adminPass]);

  const addShopifyProduct = (sp: ShopifyProduct) => {
    if (!activeLook) return;
    // Check if already added
    if (
      activeLook.products.some((p) => p.shopifyProductId === sp.shopifyProductId)
    ) {
      toast.warning("This product is already in this look.");
      return;
    }
    const product = shopifyToLookProduct(sp, activeLook.products.length);
    updateLook((look) => ({
      ...look,
      products: [...look.products, product],
    }));
  };

  const removeProduct = (productId: string) => {
    updateLook((look) => ({
      ...look,
      products: look.products.filter((p) => p.id !== productId),
      hotspots: look.hotspots?.filter((h) => h.productId !== productId),
    }));
  };

  const handleProductDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !activeLook) return;
    updateLook((look) => {
      const oldIndex = look.products.findIndex((p) => p.id === active.id);
      const newIndex = look.products.findIndex((p) => p.id === over.id);
      return {
        ...look,
        products: arrayMove(look.products, oldIndex, newIndex).map(
          (p, i) => ({ ...p, order: i })
        ),
      };
    });
  };

  // ─── Image Upload ─────────────────────────────────────────────────────

  const uploadImage = async (
    file: File,
    onSuccess: (url: string) => void
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${adminPass}` },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      const data = await res.json();
      onSuccess(data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
  };

  // ─── Hotspot Placement ────────────────────────────────────────────────

  const [placingHotspot, setPlacingHotspot] = useState(false);
  const [hotspotProductId, setHotspotProductId] = useState<string>("");

  const handleHeroClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placingHotspot || !hotspotProductId || !activeLook) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const hotspot: LookHotspot = {
      productId: hotspotProductId,
      x: Math.round(x * 100) / 100,
      y: Math.round(y * 100) / 100,
    };

    updateLook((look) => ({
      ...look,
      hotspots: [
        ...(look.hotspots || []).filter(
          (h) => h.productId !== hotspotProductId
        ),
        hotspot,
      ],
    }));

    setPlacingHotspot(false);
    setHotspotProductId("");
    toast.success("Hotspot placed");
  };

  const removeHotspot = (productId: string) => {
    updateLook((look) => ({
      ...look,
      hotspots: (look.hotspots || []).filter(
        (h) => h.productId !== productId
      ),
    }));
  };

  // ─── Save ─────────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/looks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminPass}`,
        },
        body: JSON.stringify({ version: 2, looks }),
      });
      if (!res.ok) throw new Error("Save failed");
      setHasUnsavedChanges(false);
      toast.success("All looks saved!");
    } catch {
      toast.error("Failed to save. Check your connection.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
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
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="text-xs text-terracotta font-medium">
              Unsaved changes
            </span>
          )}
          <a
            href="/"
            className="text-sm text-fern hover:text-fern-dark transition-colors"
          >
            Back to site
          </a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* ─── Tab Bar ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleTabDragEnd}
          >
            <SortableContext
              items={looks.map((l) => l.id)}
              strategy={horizontalListSortingStrategy}
            >
              {looks.map((look) => (
                <SortableTab
                  key={look.id}
                  look={look}
                  isActive={activeTabId === look.id}
                  onClick={() => setActiveTabId(look.id)}
                  onToggleStatus={() => {
                    updateLooks((prev) =>
                      prev.map((l) =>
                        l.id === look.id
                          ? {
                              ...l,
                              status:
                                l.status === "published"
                                  ? "draft"
                                  : "published",
                            }
                          : l
                      )
                    );
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>

          <button
            onClick={addLook}
            className="flex items-center gap-1 px-3 py-2 text-sm text-fern hover:bg-fern/10 rounded-full transition-colors"
            aria-label="Add new look"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>

          {activeLook && (
            <>
              <button
                onClick={duplicateLook}
                className="flex items-center gap-1 px-3 py-2 text-sm text-warm-brown hover:bg-oat rounded-full transition-colors"
                aria-label="Duplicate current look"
              >
                <Copy className="w-4 h-4" />
              </button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Delete current look"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this look?</AlertDialogTitle>
                    <AlertDialogDescription>
                      &ldquo;{activeLook.label}&rdquo; and all its products will
                      be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteLook}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>

        {/* ─── Look Editor ──────────────────────────────────────────── */}
        {activeLook && (
          <div className="space-y-8">
            {/* Look Meta */}
            <Section title="Look Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Tab Label">
                  <input
                    type="text"
                    value={activeLook.label}
                    onChange={(e) =>
                      updateLook((l) => ({ ...l, label: e.target.value }))
                    }
                    className="input-field"
                    placeholder="e.g., Moms"
                  />
                </Field>
                <Field label="Look Title">
                  <input
                    type="text"
                    value={activeLook.title}
                    onChange={(e) =>
                      updateLook((l) => ({ ...l, title: e.target.value }))
                    }
                    className="input-field"
                    placeholder="e.g., The Everyday Mom Look"
                  />
                </Field>
              </div>
              <Field label="Description (optional)">
                <textarea
                  value={activeLook.description || ""}
                  onChange={(e) =>
                    updateLook((l) => ({
                      ...l,
                      description: e.target.value,
                    }))
                  }
                  className="input-field min-h-[80px] resize-y"
                  placeholder="A short subtitle for this look"
                />
              </Field>
            </Section>

            {/* Hero Image */}
            <Section title="Hero Image">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Field label="Image URL">
                      <input
                        type="text"
                        value={activeLook.heroImage}
                        onChange={(e) =>
                          updateLook((l) => ({
                            ...l,
                            heroImage: e.target.value,
                          }))
                        }
                        className="input-field"
                        placeholder="Paste URL or upload below"
                      />
                    </Field>
                  </div>
                  <div className="flex items-end">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          uploadImage(file, (url) =>
                            updateLook((l) => ({ ...l, heroImage: url }))
                          );
                        }
                        e.target.value = "";
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </Button>
                  </div>
                </div>

                <Field label="Alt Text">
                  <input
                    type="text"
                    value={activeLook.heroImageAlt}
                    onChange={(e) =>
                      updateLook((l) => ({
                        ...l,
                        heroImageAlt: e.target.value,
                      }))
                    }
                    className="input-field"
                    placeholder="Describe the image for accessibility"
                  />
                </Field>

                {activeLook.heroImage && (
                  <div
                    className={`relative aspect-video w-full max-w-lg rounded-xl overflow-hidden border border-stone-200 ${
                      placingHotspot ? "cursor-crosshair" : ""
                    }`}
                    onClick={handleHeroClick}
                  >
                    <Image
                      src={activeLook.heroImage}
                      alt={activeLook.heroImageAlt || "Hero preview"}
                      fill
                      className="object-cover"
                    />
                    {/* Render hotspots */}
                    {activeLook.hotspots?.map((hs) => {
                      const prod = activeLook.products.find(
                        (p) => p.id === hs.productId
                      );
                      return (
                        <div
                          key={hs.productId}
                          className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 bg-fern rounded-full border-2 border-white shadow-md animate-pulse"
                          style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                          title={prod?.title || "Product"}
                        />
                      );
                    })}
                    {placingHotspot && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <span className="bg-white px-3 py-1.5 rounded-full text-sm font-medium shadow">
                          Click to place hotspot
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Hotspot Controls */}
                {activeLook.heroImage && activeLook.products.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-warm-brown">
                      Hotspots
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeLook.products.map((product) => {
                        const hasHotspot = activeLook.hotspots?.some(
                          (h) => h.productId === product.id
                        );
                        return (
                          <div key={product.id} className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                if (hasHotspot) {
                                  removeHotspot(product.id);
                                } else {
                                  setHotspotProductId(product.id);
                                  setPlacingHotspot(true);
                                }
                              }}
                              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                                hasHotspot
                                  ? "bg-fern text-white"
                                  : placingHotspot &&
                                      hotspotProductId === product.id
                                    ? "bg-terracotta text-white"
                                    : "bg-oat text-warm-brown hover:bg-sage/30"
                              }`}
                            >
                              {hasHotspot ? "✓ " : "+ "}
                              {product.title || "Untitled"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Section>

            {/* Schedule */}
            <Section title="Schedule (optional)">
              <div className="flex flex-wrap gap-4">
                <DatePickerField
                  label="Start Date"
                  value={activeLook.schedule?.startDate || null}
                  onChange={(date) =>
                    updateLook((l) => ({
                      ...l,
                      schedule: {
                        startDate: date,
                        endDate: l.schedule?.endDate || null,
                      },
                    }))
                  }
                />
                <DatePickerField
                  label="End Date"
                  value={activeLook.schedule?.endDate || null}
                  onChange={(date) =>
                    updateLook((l) => ({
                      ...l,
                      schedule: {
                        startDate: l.schedule?.startDate || null,
                        endDate: date,
                      },
                    }))
                  }
                />
                {activeLook.schedule &&
                  (activeLook.schedule.startDate ||
                    activeLook.schedule.endDate) && (
                    <button
                      onClick={() =>
                        updateLook((l) => ({
                          ...l,
                          schedule: undefined,
                        }))
                      }
                      className="text-xs text-red-500 hover:text-red-600 self-end pb-2"
                    >
                      Clear schedule
                    </button>
                  )}
              </div>
            </Section>

            {/* Discount */}
            <Section title="Discount (optional)">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={activeLook.discount?.enabled || false}
                    onCheckedChange={(checked) =>
                      updateLook((l) => ({
                        ...l,
                        discount: {
                          enabled: checked,
                          minItems: l.discount?.minItems || 2,
                          type: l.discount?.type || "percentage",
                          value: l.discount?.value || 10,
                          code: l.discount?.code || "",
                          message: l.discount?.message || "",
                        },
                      }))
                    }
                  />
                  <span className="text-sm text-charcoal">
                    Enable look discount
                  </span>
                </div>

                {activeLook.discount?.enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Min Items">
                      <input
                        type="number"
                        min={1}
                        value={activeLook.discount.minItems}
                        onChange={(e) =>
                          updateLook((l) => ({
                            ...l,
                            discount: {
                              ...l.discount!,
                              minItems: parseInt(e.target.value) || 1,
                            },
                          }))
                        }
                        className="input-field"
                      />
                    </Field>
                    <Field label="Discount Type">
                      <Select
                        value={activeLook.discount.type}
                        onValueChange={(v: "percentage" | "fixed") =>
                          updateLook((l) => ({
                            ...l,
                            discount: { ...l.discount!, type: v },
                          }))
                        }
                      >
                        <SelectTrigger className="bg-cream">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">
                            Percentage (%)
                          </SelectItem>
                          <SelectItem value="fixed">
                            Fixed Amount ($)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Value">
                      <input
                        type="number"
                        min={0}
                        value={activeLook.discount.value}
                        onChange={(e) =>
                          updateLook((l) => ({
                            ...l,
                            discount: {
                              ...l.discount!,
                              value: parseFloat(e.target.value) || 0,
                            },
                          }))
                        }
                        className="input-field"
                      />
                    </Field>
                    <Field label="Discount Code (optional)">
                      <input
                        type="text"
                        value={activeLook.discount.code || ""}
                        onChange={(e) =>
                          updateLook((l) => ({
                            ...l,
                            discount: {
                              ...l.discount!,
                              code: e.target.value,
                            },
                          }))
                        }
                        className="input-field"
                        placeholder="e.g., FAMILYLOOK"
                      />
                    </Field>
                    <Field label="Custom Message (optional)">
                      <input
                        type="text"
                        value={activeLook.discount.message || ""}
                        onChange={(e) =>
                          updateLook((l) => ({
                            ...l,
                            discount: {
                              ...l.discount!,
                              message: e.target.value,
                            },
                          }))
                        }
                        className="input-field sm:col-span-2"
                        placeholder="e.g., Complete this look and save!"
                      />
                    </Field>
                  </div>
                )}
              </div>
            </Section>

            {/* Products */}
            <Section title="Products">
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  onClick={loadShopifyProducts}
                  disabled={loadingProducts}
                  className="gap-2"
                >
                  {loadingProducts ? "Loading..." : "Add from Shopify"}
                </Button>
                <Button variant="outline" onClick={addManualProduct} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Manual Product
                </Button>
              </div>

              {/* Shopify Product Picker */}
              {shopifyProducts.length > 0 && (
                <div className="mb-4 max-h-60 overflow-y-auto border border-stone-200 rounded-xl p-3 bg-white space-y-1">
                  {shopifyProducts.map((sp) => {
                    const alreadyAdded = activeLook.products.some(
                      (p) => p.shopifyProductId === sp.shopifyProductId
                    );
                    return (
                      <button
                        key={sp.shopifyProductId}
                        onClick={() => addShopifyProduct(sp)}
                        disabled={alreadyAdded}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-oat/50 transition-colors w-full text-left disabled:opacity-40"
                      >
                        {sp.images[0] && (
                          <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-oat">
                            <Image
                              src={sp.images[0].url}
                              alt={sp.images[0].alt}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-charcoal font-medium truncate">
                            {sp.title}
                          </p>
                          <p className="text-xs text-warm-brown">{sp.price}</p>
                        </div>
                        {alreadyAdded ? (
                          <span className="text-xs text-fern">Added</span>
                        ) : (
                          <Plus className="w-4 h-4 text-fern" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Draggable Product Cards */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleProductDragEnd}
              >
                <SortableContext
                  items={activeLook.products.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {activeLook.products.map((product) => (
                      <SortableProductCard
                        key={product.id}
                        product={product}
                        shopifyImages={
                          product.shopifyProductId
                            ? shopifyProducts.find(
                                (sp) =>
                                  sp.shopifyProductId ===
                                  product.shopifyProductId
                              )?.images || []
                            : []
                        }
                        onUpdate={(updater) =>
                          updateProduct(product.id, updater)
                        }
                        onRemove={() => removeProduct(product.id)}
                        onUploadImage={uploadImage}
                        adminPass={adminPass}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {activeLook.products.length === 0 && (
                <p className="text-sm text-warm-brown/50 text-center py-8">
                  No products yet. Add from Shopify or create manually.
                </p>
              )}
            </Section>

            {/* Preview */}
            <div className="flex gap-3">
              <Button
                onClick={() => setPreviewOpen(true)}
                variant="outline"
                className="gap-2 flex-1"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-fern hover:bg-fern-dark text-white flex-1"
              >
                {saving ? "Saving..." : "Save All Looks"}
              </Button>
            </div>
          </div>
        )}

        {looks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-warm-brown/60 mb-4">
              No looks yet. Create your first one!
            </p>
            <Button onClick={addLook} className="bg-fern hover:bg-fern-dark text-white gap-2">
              <Plus className="w-4 h-4" />
              Create Look
            </Button>
          </div>
        )}
      </div>

      {/* ─── Preview Modal ──────────────────────────────────────── */}
      {previewOpen && activeLook && (
        <PreviewModal look={activeLook} onClose={() => setPreviewOpen(false)} />
      )}

      {/* Global input style */}
      <style jsx global>{`
        .input-field {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #d6d3d1;
          background-color: #faf7f2;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #2c2c2c;
          outline: none;
          transition: border-color 0.15s;
        }
        .input-field::placeholder {
          color: rgba(122, 92, 68, 0.4);
        }
        .input-field:focus {
          border-color: #4a7c59;
          box-shadow: 0 0 0 1px #4a7c59;
        }
      `}</style>
    </div>
  );
}

// ─── Sub-Components ─────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
      <h2 className="font-display text-lg text-charcoal">{title}</h2>
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

// ─── Sortable Tab ───────────────────────────────────────────────────────────

function SortableTab({
  look,
  isActive,
  onClick,
  onToggleStatus,
}: {
  look: Look;
  isActive: boolean;
  onClick: () => void;
  onToggleStatus: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: look.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all ${
        isActive
          ? "bg-fern text-white"
          : "bg-oat text-warm-brown hover:bg-sage/30"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none"
        aria-label={`Reorder ${look.label}`}
      >
        <GripVertical className="w-3.5 h-3.5 opacity-50" />
      </button>
      <button onClick={onClick} className="truncate max-w-[120px]">
        {look.label}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleStatus();
        }}
        aria-label={
          look.status === "published"
            ? `Unpublish ${look.label}`
            : `Publish ${look.label}`
        }
        className="opacity-60 hover:opacity-100"
      >
        {look.status === "published" ? (
          <Eye className="w-3.5 h-3.5" />
        ) : (
          <EyeOff className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

// ─── Sortable Product Card ──────────────────────────────────────────────────

function SortableProductCard({
  product,
  shopifyImages,
  onUpdate,
  onRemove,
  onUploadImage,
  adminPass,
}: {
  product: LookProduct;
  shopifyImages: ShopifyImage[];
  onUpdate: (updater: (p: LookProduct) => LookProduct) => void;
  onRemove: () => void;
  onUploadImage: (file: File, onSuccess: (url: string) => void) => void;
  adminPass: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // For image selection, merge shopify images with current
  const images =
    shopifyImages.length > 0
      ? shopifyImages
      : product.selectedImageUrl
        ? [{ url: product.selectedImageUrl, alt: product.selectedImageAlt }]
        : [];

  // Link config
  const linkType = product.productUrl === null
    ? "none"
    : product.productUrl?.startsWith("/product/")
      ? "shopify"
      : "custom";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-stone-200 rounded-xl p-4 bg-white space-y-4"
    >
      {/* Header row */}
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-warm-brown/40 hover:text-warm-brown"
          aria-label={`Reorder ${product.title || "product"}`}
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {product.selectedImageUrl && (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-oat">
            <Image
              src={product.selectedImageUrl}
              alt={product.selectedImageAlt || product.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {product.source === "manual" ? (
            <input
              type="text"
              value={product.title}
              onChange={(e) =>
                onUpdate((p) => ({ ...p, title: e.target.value }))
              }
              className="input-field text-sm font-medium"
              placeholder="Product title"
            />
          ) : (
            <p className="text-sm font-medium text-charcoal truncate">
              {product.title}
            </p>
          )}
          <span className="text-xs text-warm-brown/50">
            {product.source === "shopify" ? "Shopify" : "Manual"}
          </span>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="text-red-400 hover:text-red-500"
              aria-label={`Remove ${product.title}`}
            >
              <X className="w-4 h-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove product?</AlertDialogTitle>
              <AlertDialogDescription>
                &ldquo;{product.title || "This product"}&rdquo; will be removed
                from the look.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onRemove}
                className="bg-red-500 hover:bg-red-600"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Manual product fields */}
      {product.source === "manual" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Price">
            <input
              type="text"
              value={product.price}
              onChange={(e) =>
                onUpdate((p) => ({ ...p, price: e.target.value }))
              }
              className="input-field"
              placeholder="$29.00"
            />
          </Field>
          <Field label="Image">
            <div className="flex gap-2">
              <input
                type="text"
                value={product.selectedImageUrl}
                onChange={(e) =>
                  onUpdate((p) => ({
                    ...p,
                    selectedImageUrl: e.target.value,
                    selectedImageAlt: p.selectedImageAlt || p.title,
                  }))
                }
                className="input-field flex-1"
                placeholder="Image URL or upload"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUploadImage(file, (url) =>
                      onUpdate((p) => ({
                        ...p,
                        selectedImageUrl: url,
                        selectedImageAlt: p.selectedImageAlt || p.title,
                      }))
                    );
                  }
                  e.target.value = "";
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Field>
          <Field label="Variant ID (for add-to-cart)">
            <input
              type="text"
              value={product.variantId || ""}
              onChange={(e) =>
                onUpdate((p) => ({ ...p, variantId: e.target.value || undefined }))
              }
              className="input-field"
              placeholder="Shopify variant GID (optional)"
            />
          </Field>
        </div>
      )}

      {/* Image selector for Shopify products */}
      {product.source === "shopify" && images.length > 1 && (
        <div>
          <p className="text-xs text-warm-brown mb-2">Display image:</p>
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
                className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
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
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Badge & Link */}
      <div className="flex flex-wrap gap-4">
        <Field label="Badge">
          <BadgePicker
            value={product.badge}
            onChange={(badge) => onUpdate((p) => ({ ...p, badge }))}
          />
        </Field>

        <Field label="Link">
          <div className="flex items-center gap-2">
            <Select
              value={linkType}
              onValueChange={(v) => {
                if (v === "none") {
                  onUpdate((p) => ({ ...p, productUrl: null }));
                } else if (v === "shopify" && product.shopifyHandle) {
                  onUpdate((p) => ({
                    ...p,
                    productUrl: `/product/${product.shopifyHandle}`,
                  }));
                } else {
                  onUpdate((p) => ({
                    ...p,
                    productUrl: p.productUrl || "",
                  }));
                }
              }}
            >
              <SelectTrigger className="bg-cream w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shopify">Product page</SelectItem>
                <SelectItem value="custom">Custom URL</SelectItem>
                <SelectItem value="none">No link</SelectItem>
              </SelectContent>
            </Select>
            {linkType === "custom" && (
              <input
                type="text"
                value={product.productUrl || ""}
                onChange={(e) =>
                  onUpdate((p) => ({ ...p, productUrl: e.target.value }))
                }
                className="input-field flex-1"
                placeholder="https://..."
              />
            )}
          </div>
        </Field>
      </div>
    </div>
  );
}

// ─── Badge Picker ───────────────────────────────────────────────────────────

function BadgePicker({
  value,
  onChange,
}: {
  value: LookProductBadge | null;
  onChange: (badge: LookProductBadge | null) => void;
}) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState("");

  const currentLabel = value
    ? BADGE_PRESETS.find((b) => b.badge?.text === value.text)?.label ||
      value.text
    : "None";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-300 bg-cream text-sm hover:border-fern transition-colors">
          <Tag className="w-3.5 h-3.5 text-warm-brown/60" />
          {currentLabel}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="start">
        {BADGE_PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onChange(preset.badge)}
            className={`w-full text-left px-3 py-1.5 rounded text-sm hover:bg-oat transition-colors ${
              (preset.badge === null && value === null) ||
              preset.badge?.text === value?.text
                ? "bg-fern/10 text-fern font-medium"
                : "text-charcoal"
            }`}
          >
            {preset.label}
          </button>
        ))}
        <hr className="my-1 border-stone-200" />
        {customOpen ? (
          <div className="flex gap-1 p-1">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="input-field text-xs flex-1"
              placeholder="Custom text"
              autoFocus
            />
            <button
              onClick={() => {
                if (customText.trim()) {
                  onChange({ text: customText.trim(), variant: "default" });
                }
                setCustomOpen(false);
                setCustomText("");
              }}
              className="text-xs text-fern font-medium px-2"
            >
              Set
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCustomOpen(true)}
            className="w-full text-left px-3 py-1.5 rounded text-sm text-warm-brown hover:bg-oat transition-colors"
          >
            Custom...
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}

// ─── Date Picker Field ──────────────────────────────────────────────────────

function DatePickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const date = value ? new Date(value) : undefined;

  return (
    <Field label={label}>
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-stone-300 bg-cream text-sm hover:border-fern transition-colors min-w-[160px]">
            <CalendarIcon className="w-4 h-4 text-warm-brown/60" />
            {value ? formatDate(value) : "Not set"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => onChange(d ? d.toISOString() : null)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

// ─── Preview Modal ──────────────────────────────────────────────────────────

function PreviewModal({
  look,
  onClose,
}: {
  look: Look;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto">
      <div className="bg-cream w-full max-w-4xl min-h-screen my-0 sm:my-8 sm:min-h-0 sm:rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
          <h2 className="font-display text-lg text-charcoal">
            Preview: {look.label}
          </h2>
          <button
            onClick={onClose}
            className="text-warm-brown hover:text-charcoal"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Hero */}
          {look.heroImage && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-stone-200">
              <Image
                src={look.heroImage}
                alt={look.heroImageAlt || look.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent h-24 flex items-end p-5">
                <div>
                  <h3 className="text-white font-display text-xl drop-shadow-sm">
                    {look.title}
                  </h3>
                  {look.description && (
                    <p className="text-white/80 text-sm mt-1">
                      {look.description}
                    </p>
                  )}
                </div>
              </div>
              {/* Hotspots */}
              {look.hotspots?.map((hs) => {
                const prod = look.products.find((p) => p.id === hs.productId);
                return (
                  <div
                    key={hs.productId}
                    className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 bg-fern rounded-full border-2 border-white shadow-md animate-pulse"
                    style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                    title={prod?.title}
                  />
                );
              })}
            </div>
          )}

          {/* Discount Banner */}
          {look.discount?.enabled && (
            <div className="bg-fern/10 border border-fern/20 rounded-xl p-4 text-center">
              <p className="text-sm text-fern font-medium">
                {look.discount.message ||
                  `Buy ${look.discount.minItems}+ items and get ${
                    look.discount.type === "percentage"
                      ? `${look.discount.value}% off`
                      : `$${look.discount.value} off`
                  }`}
                {look.discount.code && (
                  <> &mdash; Use code <strong>{look.discount.code}</strong></>
                )}
              </p>
            </div>
          )}

          {/* Products Grid */}
          <div
            className={`grid gap-4 ${
              look.products.length <= 2
                ? "grid-cols-1 sm:grid-cols-2"
                : look.products.length === 3
                  ? "grid-cols-1 sm:grid-cols-3"
                  : "grid-cols-2 sm:grid-cols-4"
            }`}
          >
            {look.products.map((product) => (
              <div key={product.id} className="text-left">
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-stone-100 bg-oat">
                  {product.selectedImageUrl && (
                    <Image
                      src={product.selectedImageUrl}
                      alt={product.selectedImageAlt || product.title}
                      fill
                      className="object-cover"
                    />
                  )}
                  {product.badge && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white/80 backdrop-blur-sm text-stone-700 text-xs font-medium px-3 py-1 rounded-full">
                        {product.badge.text}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-charcoal font-medium mt-2 truncate">
                  {product.title || "Untitled"}
                </p>
                <p className="text-sm text-warm-brown">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
