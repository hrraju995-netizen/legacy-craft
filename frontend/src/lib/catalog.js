/**
 * Pure, data-free helpers.
 *
 * Product data now comes from the Laravel API (see lib/api.js). This module
 * only holds things that must also run in the browser: the filter/sort logic
 * used by ProductBrowser and the option lists the sidebar renders.
 */

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80";

export const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const PRICE_RANGES = [
  { label: "Under ৳10,000", min: 0, max: 9999 },
  { label: "৳10,000 – ৳25,000", min: 10000, max: 25000 },
  { label: "৳25,001 – ৳45,000", min: 25001, max: 45000 },
  { label: "৳45,001 – ৳70,000", min: 45001, max: 70000 },
  { label: "৳70,000+", min: 70001, max: Infinity },
];

export const SIZE_OPTIONS = ["Small Size", "Standard", "Medium Size", "Large Size"];

export const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "low_to_high" },
  { label: "Price: High to Low", value: "high_to_low" },
  { label: "Name: A–Z", value: "a_z" },
  { label: "Name: Z–A", value: "z_a" },
];

/* ------------------------------------------------------------------ */
/* Derive facets from a product list the server already fetched        */
/* ------------------------------------------------------------------ */

export function getSubcategoriesFrom(products = []) {
  const map = new Map();

  for (const product of products) {
    const id = product.subcategorySlug || slugify(product.subcategory || "");
    if (!id || map.has(id)) continue;
    map.set(id, {
      id,
      name: product.subcategory,
      image: product.thumbnail || FALLBACK_IMAGE,
    });
  }

  return Array.from(map.values());
}

export function getCategoriesFrom(products = []) {
  const map = new Map();

  for (const product of products) {
    if (!product.categorySlug) continue;
    if (!map.has(product.categorySlug)) {
      map.set(product.categorySlug, {
        slug: product.categorySlug,
        title: product.category,
        image: product.thumbnail || FALLBACK_IMAGE,
        count: 0,
      });
    }
    map.get(product.categorySlug).count += 1;
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

/* ------------------------------------------------------------------ */
/* Client-side filtering + sorting                                     */
/* ------------------------------------------------------------------ */

export function filterProducts(
  products,
  { category, room, subcategory, size, priceRanges = [], query } = {}
) {
  let result = [...products];

  if (category) result = result.filter((p) => p.categorySlug === category);
  if (room) result = result.filter((p) => p.roomSlug === room);
  if (subcategory) result = result.filter((p) => p.subcategorySlug === subcategory);
  if (size) result = result.filter((p) => p.sizeLabel === size);

  if (priceRanges.length > 0) {
    result = result.filter((p) =>
      priceRanges.some((i) => {
        const range = PRICE_RANGES[i];
        return range && p.price >= range.min && p.price <= range.max;
      })
    );
  }

  if (query) {
    const q = query.toLowerCase().trim();
    result = result.filter((p) =>
      [p.name, p.category, p.subcategory, p.roomType, p.material, ...(p.tags || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }

  return result;
}

export function sortProducts(products, sort = "featured") {
  const result = [...products];

  switch (sort) {
    case "low_to_high":
      return result.sort((a, b) => a.price - b.price);
    case "high_to_low":
      return result.sort((a, b) => b.price - a.price);
    case "a_z":
      return result.sort((a, b) => a.name.localeCompare(b.name));
    case "z_a":
      return result.sort((a, b) => b.name.localeCompare(a.name));
    case "newest":
      return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    default:
      return result.sort(
        (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.rating - a.rating
      );
  }
}
