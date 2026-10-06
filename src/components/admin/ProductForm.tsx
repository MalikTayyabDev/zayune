"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FormSelect } from "@/components/ui/FormControls";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { generateProductSku, generateVariantSku } from "@/lib/sku";

type Category = { id: string; name: string };
type CatalogOption = { id: string; name: string };

type ImageRow = { url: string; alt: string; kind: string; sortOrder: number };
type VariantRow = {
  id?: string;
  name: string;
  optionGroup: string;
  swatchHex: string;
  imageUrl: string;
  priceDelta: number;
  stock: string;
  sku: string;
};

export type ProductFormValues = {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  oneLiner: string;
  story: string;
  materials: string;
  handmadeProof: string;
  stylingNote: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string;
  fulfillment: "IN_STOCK" | "MADE_TO_ORDER";
  stock: number | null;
  leadTimeDays: number | null;
  featured: boolean;
  published: boolean;
  isBundle: boolean;
  bundleProductIds: string[];
  introOfferPercent: number | null;
  seoTitle: string;
  seoDescription: string;
  tags: string;
  images: ImageRow[];
  variants: VariantRow[];
};

type Props = {
  categories: Category[];
  catalog?: CatalogOption[];
  initial?: ProductFormValues;
};

const empty: ProductFormValues = {
  name: "",
  slug: "",
  sku: "",
  oneLiner: "",
  story: "",
  materials: "[materials — to be supplied]",
  handmadeProof: "[process detail — to be supplied]",
  stylingNote: "",
  price: 0,
  compareAtPrice: null,
  categoryId: "",
  fulfillment: "MADE_TO_ORDER",
  stock: null,
  leadTimeDays: 7,
  featured: false,
  published: true,
  isBundle: false,
  bundleProductIds: [],
  introOfferPercent: null,
  seoTitle: "",
  seoDescription: "",
  tags: "",
  images: [{ url: "", alt: "", kind: "hero", sortOrder: 0 }],
  variants: [
    {
      name: "Default",
      optionGroup: "Color",
      swatchHex: "#B85F45",
      imageUrl: "",
      priceDelta: 0,
      stock: "",
      sku: "",
    },
  ],
};

const imageKinds: { value: string; label: string }[] = [
  { value: "hero", label: "Hero (main)" },
  { value: "gallery", label: "Gallery" },
  { value: "detail", label: "Detail" },
  { value: "worn", label: "Worn / lifestyle" },
  { value: "macro", label: "Macro / close-up" },
  { value: "styled", label: "Styled shot" },
  { value: "process", label: "Process / making" },
  { value: "packaging", label: "Packaging" },
  { value: "alt", label: "Alternate angle" },
];

export function ProductForm({ categories, catalog = [], initial }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({
    ...empty,
    categoryId: categories[0]?.id || "",
    ...initial,
    sku: initial?.sku || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function setField<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function ensureSkus() {
    const productSku =
      values.sku.trim() ||
      generateProductSku(values.slug || values.name || "ITEM");
    const variants = values.variants.map((v) => ({
      ...v,
      sku:
        v.sku.trim() ||
        generateVariantSku(productSku, v.name || "VAR"),
    }));
    return { productSku, variants };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { productSku, variants } = ensureSkus();

    const payload = {
      ...values,
      sku: productSku,
      tags: values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images: values.images.filter((img) => img.url.trim()),
      variants: variants
        .filter((v) => v.name.trim())
        .map((v) => ({
          ...v,
          stock: v.stock === "" ? null : Number(v.stock),
          swatchHex: v.swatchHex || null,
          imageUrl: v.imageUrl || null,
          sku: v.sku || null,
        })),
      bundleProductIds: values.isBundle ? values.bundleProductIds : [],
    };

    const res = await fetch(
      values.id ? `/api/admin/products/${values.id}` : "/api/admin/products",
      {
        method: values.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Unable to save product");
      setLoading(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  const panel = "border border-stone bg-porcelain";
  const panelHead =
    "border-b border-stone px-5 py-3 text-sm font-medium text-aubergine";

  return (
    <form onSubmit={onSubmit} className="pb-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-nav text-aubergine/45">
            {values.id ? "Edit product" : "Add product"}
          </p>
          <h1 className="mt-1 font-display text-3xl text-aubergine">
            {values.name || "Untitled product"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/admin/products")}
          >
            Discard
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save product"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className={panel}>
            <div className={panelHead}>Title & description</div>
            <div className="space-y-4 p-5">
              <Field
                label="Title"
                value={values.name}
                onChange={(v) => {
                  setField("name", v);
                  if (!initial?.slug) {
                    setField(
                      "slug",
                      v
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "")
                    );
                  }
                  if (!values.sku && !initial?.sku) {
                    setField("sku", generateProductSku(v || "ITEM"));
                  }
                }}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-nav text-aubergine/55">
                    Product SKU (auto)
                  </span>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={values.sku}
                      readOnly
                      className="w-full border border-stone bg-stone/20 px-4 py-3 text-sm text-aubergine/80"
                    />
                    <button
                      type="button"
                      className="shrink-0 border border-aubergine px-3 text-[10px] uppercase tracking-nav text-aubergine hover:bg-aubergine hover:text-porcelain"
                      onClick={() =>
                        setField(
                          "sku",
                          generateProductSku(values.slug || values.name || "ITEM")
                        )
                      }
                    >
                      Regenerate
                    </button>
                  </div>
                </label>
                <Field
                  label="One-liner"
                  value={values.oneLiner}
                  onChange={(v) => setField("oneLiner", v)}
                />
              </div>
              <TextArea
                label="Description / story"
                value={values.story}
                onChange={(v) => setField("story", v)}
                rows={5}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextArea
                  label="Materials"
                  value={values.materials}
                  onChange={(v) => setField("materials", v)}
                />
                <TextArea
                  label="Handmade proof"
                  value={values.handmadeProof}
                  onChange={(v) => setField("handmadeProof", v)}
                />
              </div>
              <TextArea
                label="Styling note"
                value={values.stylingNote}
                onChange={(v) => setField("stylingNote", v)}
              />
            </div>
          </section>

          <section className={panel}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone px-5 py-3">
              <div>
                <p className="text-sm font-medium text-aubergine">Media</p>
                <p className="mt-0.5 text-xs text-aubergine/50">
                  Add hero, gallery, detail, lifestyle — not only swatches
                </p>
              </div>
              <button
                type="button"
                className="text-nav text-copper"
                onClick={() =>
                  setField("images", [
                    ...values.images,
                    {
                      url: "",
                      alt: values.name,
                      kind: values.images.length === 0 ? "hero" : "gallery",
                      sortOrder: values.images.length,
                    },
                  ])
                }
              >
                + Add image
              </button>
            </div>
            <div className="space-y-4 p-5">
              {values.images.length === 0 && (
                <p className="text-sm text-aubergine/55">
                  No images yet. Add a hero image, then more gallery shots.
                </p>
              )}
              {values.images.map((image, index) => (
                <div
                  key={index}
                  className="grid gap-3 border border-stone/80 bg-stone/10 p-4 sm:grid-cols-2"
                >
                  <div className="sm:col-span-2">
                    <ImageUpload
                      label={`Image ${index + 1}${
                        image.kind === "hero" ? " · Hero" : ""
                      }`}
                      value={image.url}
                      onChange={(url) => {
                        const next = [...values.images];
                        next[index] = { ...image, url };
                        setField("images", next);
                      }}
                    />
                  </div>
                  <Field
                    label="Or paste image URL"
                    value={image.url.startsWith("data:") ? "" : image.url}
                    onChange={(v) => {
                      const next = [...values.images];
                      next[index] = { ...image, url: v };
                      setField("images", next);
                    }}
                  />
                  <Field
                    label="Alt text"
                    value={image.alt}
                    onChange={(v) => {
                      const next = [...values.images];
                      next[index] = { ...image, alt: v };
                      setField("images", next);
                    }}
                  />
                  <label className="block">
                    <span className="text-nav text-aubergine/55">Kind</span>
                    <FormSelect
                      value={image.kind}
                      onChange={(e) => {
                        const next = [...values.images];
                        next[index] = { ...image, kind: e.target.value };
                        setField("images", next);
                      }}
                    >
                      {imageKinds.map((kind) => (
                        <option key={kind.value} value={kind.value}>
                          {kind.label}
                        </option>
                      ))}
                    </FormSelect>
                  </label>
                  <div className="flex items-end">
                    <button
                      type="button"
                      className="text-nav text-aubergine/40 hover:text-copper"
                      onClick={() =>
                        setField(
                          "images",
                          values.images.filter((_, i) => i !== index)
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={panel}>
            <div className="flex items-center justify-between border-b border-stone px-5 py-3">
              <div>
                <p className="text-sm font-medium text-aubergine">
                  Variants & swatches
                </p>
                <p className="mt-0.5 text-xs text-aubergine/50">
                  Colors / options — SKUs auto-fill from product SKU
                </p>
              </div>
              <button
                type="button"
                className="text-nav text-copper"
                onClick={() => {
                  const base =
                    values.sku ||
                    generateProductSku(values.slug || values.name || "ITEM");
                  setField("variants", [
                    ...values.variants,
                    {
                      name: "New color",
                      optionGroup: "Color",
                      swatchHex: "#7F8B78",
                      imageUrl: "",
                      priceDelta: 0,
                      stock: "",
                      sku: generateVariantSku(base, "New color"),
                    },
                  ]);
                }}
              >
                + Add variant
              </button>
            </div>
            <div className="space-y-4 p-5">
              {values.variants.map((variant, index) => (
                <div
                  key={index}
                  className="space-y-4 border border-stone/80 bg-stone/10 p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Name"
                      value={variant.name}
                      onChange={(v) => {
                        const next = [...values.variants];
                        const base =
                          values.sku ||
                          generateProductSku(values.slug || values.name || "ITEM");
                        next[index] = {
                          ...variant,
                          name: v,
                          sku: generateVariantSku(base, v),
                        };
                        setField("variants", next);
                      }}
                    />
                    <Field
                      label="Option group"
                      value={variant.optionGroup}
                      onChange={(v) => {
                        const next = [...values.variants];
                        next[index] = { ...variant, optionGroup: v };
                        setField("variants", next);
                      }}
                    />
                    <label className="block sm:col-span-2">
                      <span className="text-nav text-aubergine/55">Swatch color</span>
                      <div className="mt-2 flex h-[2.75rem] max-w-xs items-stretch gap-2">
                        <input
                          type="color"
                          value={variant.swatchHex || "#B85F45"}
                          onChange={(e) => {
                            const next = [...values.variants];
                            next[index] = { ...variant, swatchHex: e.target.value };
                            setField("variants", next);
                          }}
                          className="h-full w-12 shrink-0 border border-stone bg-porcelain p-1"
                        />
                        <input
                          value={variant.swatchHex}
                          onChange={(e) => {
                            const next = [...values.variants];
                            next[index] = { ...variant, swatchHex: e.target.value };
                            setField("variants", next);
                          }}
                          className="h-full w-full border border-stone bg-porcelain px-3 text-sm outline-none focus:border-aubergine/40"
                        />
                      </div>
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Price delta"
                      type="number"
                      value={String(variant.priceDelta)}
                      onChange={(v) => {
                        const next = [...values.variants];
                        next[index] = { ...variant, priceDelta: Number(v) };
                        setField("variants", next);
                      }}
                    />
                    <Field
                      label="Stock"
                      value={variant.stock}
                      onChange={(v) => {
                        const next = [...values.variants];
                        next[index] = { ...variant, stock: v };
                        setField("variants", next);
                      }}
                    />
                    <Field
                      label="Variant SKU (auto)"
                      value={variant.sku}
                      onChange={(v) => {
                        const next = [...values.variants];
                        next[index] = { ...variant, sku: v };
                        setField("variants", next);
                      }}
                    />
                  </div>

                  <ImageUpload
                    compact
                    label="Variant / swatch image (optional)"
                    value={variant.imageUrl}
                    onChange={(url) => {
                      const next = [...values.variants];
                      next[index] = { ...variant, imageUrl: url };
                      setField("variants", next);
                    }}
                  />

                  <button
                    type="button"
                    className="text-nav text-aubergine/40 hover:text-copper"
                    onClick={() =>
                      setField(
                        "variants",
                        values.variants.filter((_, i) => i !== index)
                      )
                    }
                  >
                    Remove variant
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className={panel}>
            <div className={panelHead}>Search engine listing</div>
            <div className="space-y-4 p-5">
              <Field
                label="URL handle (slug)"
                value={values.slug}
                onChange={(v) => setField("slug", v)}
              />
              <Field
                label="SEO title"
                value={values.seoTitle}
                onChange={(v) => setField("seoTitle", v)}
              />
              <TextArea
                label="SEO description"
                value={values.seoDescription}
                onChange={(v) => setField("seoDescription", v)}
              />
              <Field
                label="Tags (comma separated)"
                value={values.tags}
                onChange={(v) => setField("tags", v)}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className={panel}>
            <div className={panelHead}>Status</div>
            <div className="space-y-3 p-5 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={values.published}
                  onChange={(e) => setField("published", e.target.checked)}
                />
                Published (active on store)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={values.featured}
                  onChange={(e) => setField("featured", e.target.checked)}
                />
                Featured / best seller
              </label>
            </div>
          </section>

          <section className={panel}>
            <div className={panelHead}>Pricing</div>
            <div className="space-y-4 p-5">
              <Field
                label="Price (PKR)"
                type="number"
                value={String(values.price)}
                onChange={(v) => setField("price", Number(v))}
              />
              <Field
                label="Compare-at price"
                type="number"
                value={String(values.compareAtPrice ?? "")}
                onChange={(v) =>
                  setField("compareAtPrice", v === "" ? null : Number(v))
                }
              />
              <Field
                label="Intro offer % (optional)"
                type="number"
                value={String(values.introOfferPercent ?? "")}
                onChange={(v) =>
                  setField("introOfferPercent", v === "" ? null : Number(v))
                }
              />
              {values.price > 0 && (
                <p className="text-xs text-aubergine/55">
                  Checkout: 30% advance (
                  {Math.round(values.price * 0.3).toLocaleString("en-PK")} PKR) ·
                  70% on delivery (
                  {Math.round(values.price * 0.7).toLocaleString("en-PK")} PKR)
                </p>
              )}
            </div>
          </section>

          <section className={panel}>
            <div className={panelHead}>Organization</div>
            <div className="space-y-4 p-5">
              <label className="block">
                <span className="text-nav text-aubergine/55">Category</span>
                <FormSelect
                  value={values.categoryId}
                  onChange={(e) => setField("categoryId", e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </FormSelect>
              </label>
            </div>
          </section>

          <section className={panel}>
            <div className={panelHead}>Inventory</div>
            <div className="space-y-4 p-5">
              <label className="block">
                <span className="text-nav text-aubergine/55">Fulfillment</span>
                <FormSelect
                  value={values.fulfillment}
                  onChange={(e) =>
                    setField(
                      "fulfillment",
                      e.target.value as ProductFormValues["fulfillment"]
                    )
                  }
                >
                  <option value="MADE_TO_ORDER">Made to order</option>
                  <option value="IN_STOCK">In stock</option>
                </FormSelect>
              </label>
              {values.fulfillment === "IN_STOCK" ? (
                <Field
                  label="Stock"
                  type="number"
                  value={String(values.stock ?? 0)}
                  onChange={(v) => setField("stock", Number(v))}
                />
              ) : (
                <Field
                  label="Lead time (days)"
                  type="number"
                  value={String(values.leadTimeDays ?? 7)}
                  onChange={(v) => setField("leadTimeDays", Number(v))}
                />
              )}
            </div>
          </section>

          <section className={panel}>
            <div className={panelHead}>Bundle</div>
            <div className="space-y-3 p-5 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={values.isBundle}
                  onChange={(e) => setField("isBundle", e.target.checked)}
                />
                This is a bundle product
              </label>
              {values.isBundle && (
                <div className="max-h-48 space-y-2 overflow-y-auto border border-stone p-3">
                  {catalog
                    .filter((p) => p.id !== values.id)
                    .map((product) => {
                      const checked = values.bundleProductIds.includes(
                        product.id
                      );
                      return (
                        <label
                          key={product.id}
                          className="flex items-center gap-2 text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              setField(
                                "bundleProductIds",
                                e.target.checked
                                  ? [...values.bundleProductIds, product.id]
                                  : values.bundleProductIds.filter(
                                      (id) => id !== product.id
                                    )
                              );
                            }}
                          />
                          {product.name}
                        </label>
                      );
                    })}
                  {catalog.length === 0 && (
                    <p className="text-xs text-aubergine/50">
                      No other products available to bundle.
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>

      {error && (
        <p className="mt-6 text-xs text-copper" role="alert">
          {error}
        </p>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone bg-porcelain/95 px-5 py-3 backdrop-blur">
        <div className="container-content flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/admin/products")}
          >
            Discard
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save product"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-nav text-aubergine/55">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-stone bg-porcelain px-4 py-3 text-sm outline-none focus:border-aubergine/40"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-nav text-aubergine/55">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-2 w-full border border-stone bg-porcelain px-4 py-3 text-sm outline-none focus:border-aubergine/40"
      />
    </label>
  );
}
