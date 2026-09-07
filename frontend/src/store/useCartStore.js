import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FALLBACK_IMAGE } from "@/lib/catalog";

/**
 * Every part of the site used to push a differently-shaped object into the
 * cart (some had `name`/`thumbnail`, others `title`/`image`, prices were
 * sometimes strings like "37,000"). Normalising here means the cart, wishlist
 * and checkout pages only ever deal with one shape.
 */
export const toCartItem = (product = {}, quantity = 1) => {
  const name = product.name || product.title || "Product";
  const image =
    product.image ||
    product.thumbnail ||
    (Array.isArray(product.images) ? product.images[0] : null) ||
    FALLBACK_IMAGE;

  const rawPrice = product.price;
  const price =
    typeof rawPrice === "number"
      ? rawPrice
      : parseFloat(String(rawPrice ?? 0).replace(/[^0-9.]/g, "")) || 0;

  const slug = product.slug || product.id;

  // Extract clean productId & variantId
  let productId = null;
  let variantId = product.variantId ? Number(product.variantId) : null;

  if (product.productId) {
    productId = Number(product.productId);
  } else if (typeof product.id === "number") {
    productId = product.id;
  } else if (typeof product.id === "string") {
    const match = product.id.match(/^(\d+)(?:-v(\d+))?$/);
    if (match) {
      productId = Number(match[1]);
      if (!variantId && match[2]) {
        variantId = Number(match[2]);
      }
    } else {
      const parsed = parseInt(product.id, 10);
      if (!isNaN(parsed)) productId = parsed;
    }
  }

  // Unique cart item identifier (combination of product id and variant id if present)
  const cartKey = variantId
    ? `${productId || slug}-v${variantId}`
    : String((productId || product.id) ?? slug ?? name);

  return {
    id: cartKey,
    productId: productId,
    variantId: variantId,
    slug,
    name,
    title: name, // alias kept so older markup keeps rendering
    subtitle: product.subtitle || product.subcategory || product.material || "",
    price,
    originalPrice:
      typeof product.originalPrice === "number" ? product.originalPrice : null,
    image,
    link: slug ? `/products/${slug}` : "/products",
    quantity: Math.max(1, Number(product.quantity || quantity) || 1),
  };
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],

      addToCart: (product, quantity = 1) => {
        const item = toCartItem(product, quantity);
        const cart = get().cart;
        const existing = cart.find((i) => i.id === item.id);

        if (existing) {
          set({
            cart: cart.map((i) =>
              i.id === item.id
                ? { ...i, quantity: (i.quantity || 1) + item.quantity }
                : i
            ),
          });
        } else {
          set({ cart: [...cart, item] });
        }
      },

      removeFromCart: (id) =>
        set({ cart: get().cart.filter((i) => i.id !== String(id)) }),

      updateQuantity: (id, valueOrType) => {
        const key = String(id);
        set({
          cart: get().cart.map((item) => {
            if (item.id !== key) return item;
            let next = item.quantity || 1;
            if (typeof valueOrType === "number") next = valueOrType;
            else if (valueOrType === "inc") next = next + 1;
            else if (valueOrType === "dec") next = next - 1;
            return { ...item, quantity: Math.min(99, Math.max(1, next)) };
          }),
        });
      },

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (product) => {
        const item = toCartItem(product);
        const wishlist = get().wishlist;
        const exists = wishlist.some((i) => i.id === item.id);
        set({
          wishlist: exists
            ? wishlist.filter((i) => i.id !== item.id)
            : [...wishlist, item],
        });
      },

      removeFromWishlist: (id) =>
        set({ wishlist: get().wishlist.filter((i) => i.id !== String(id)) }),

      isWishlisted: (id) => get().wishlist.some((i) => i.id === String(id)),
    }),
    {
      name: "legacy-craft-cart",
      version: 3,
      // v1 stored mixed-shape items; v2/v3 ensures productId & variantId are properly tracked
      migrate: (state) => ({
        ...state,
        cart: (state?.cart || []).map((i) => toCartItem(i, i.quantity)),
        wishlist: (state?.wishlist || []).map((i) => toCartItem(i)),
      }),
    }
  )
);
