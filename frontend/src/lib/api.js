/**
 * Single place where the storefront talks to the Laravel API.
 *
 * Everything here runs on the server (React Server Components) unless a
 * function is explicitly called from a client component — that keeps the API
 * base URL and any future tokens off the browser.
 */

function getBaseUrl() {
  if (typeof window !== "undefined") {
    // In browser: use relative path via Next.js rewrites to eliminate all CORS issues
    return window.location.origin + "/api/v1";
  }
  return (
    process.env.NEXT_PUBLIC_API_URL || "https://api.lookstudiobd.com/api/v1"
  ).replace(/\/$/, "");
}

/** Seconds before a cached response is refetched. Overridable per call. */
const DEFAULT_REVALIDATE = 60;

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function buildUrl(path, params) {
  const base = getBaseUrl();
  const url = new URL(`${base}${path.startsWith("/") ? path : `/${path}`}`);

  for (const [key, value] of Object.entries(params || {})) {
    // Skip empties so `?category=` never reaches the API as a real filter.
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      value.forEach((v) => url.searchParams.append(`${key}[]`, v));
    } else {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

export async function apiFetch(path, { params, revalidate, ...init } = {}) {
  const url = buildUrl(path, params);

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    // POSTs must never be cached; GETs use ISR.
    ...(init.method && init.method !== "GET"
      ? { cache: "no-store" }
      : { next: { revalidate: revalidate ?? DEFAULT_REVALIDATE } }),
  });

  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok) {
    throw new ApiError(
      body?.message || `API request failed: ${response.status}`,
      response.status,
      body
    );
  }

  return body;
}

/**
 * For places where a failed API call should degrade rather than crash the
 * whole page — a homepage slider is not worth a 500.
 */
export async function apiFetchSafe(path, options, fallback = null) {
  try {
    return await apiFetch(path, options);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[api] ${path} failed:`, error.message);
    }
    return fallback;
  }
}

/* ------------------------------------------------------------------ */
/* Catalogue                                                           */
/* ------------------------------------------------------------------ */

export async function getProducts(params = {}) {
  const response = await apiFetchSafe("/products", { params }, { data: [] });
  return {
    products: Array.isArray(response?.data) ? response.data : [],
    meta: response?.meta ?? null,
  };
}

export async function getAllProducts() {
  // The catalogue is small; one page is enough for listing screens.
  try {
    const { products } = await getProducts({ per_page: 60 });
    return Array.isArray(products) ? products : [];
  } catch {
    return [];
  }
}

export async function getProduct(slug) {
  try {
    const response = await apiFetch(`/products/${slug}`);
    return {
      product: response?.data ?? null,
      related: response?.related?.data ?? response?.related ?? [],
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[api] getProduct(${slug}) failed:`, error.message);
    }
    return { product: null, related: [] };
  }
}

export async function getCategories() {
  return (await apiFetchSafe("/categories", {}, [])) ?? [];
}

/* ------------------------------------------------------------------ */
/* Site chrome + CMS                                                   */
/* ------------------------------------------------------------------ */

export async function getSiteConfig() {
  return apiFetchSafe("/site/config", { revalidate: 0 }, {
    settings: {},
    menus: {},
    shippingZones: [],
    tooltips: [],
    footerPages: [],
  });
}

export async function getHomeData() {
  return apiFetchSafe("/site/home", { revalidate: 300 }, {
    sections: [],
    banners: {},
    categories: [],
    rooms: [],
    lookbooks: [],
  });
}

export async function getPage(slug) {
  try {
    return await apiFetch(`/pages/${slug}`, { revalidate: 300 });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/* ------------------------------------------------------------------ */
/* Orders — called from the browser, so these hit the API directly     */
/* ------------------------------------------------------------------ */

export async function validateCoupon(code, subtotal) {
  return apiFetch("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  });
}

export async function placeOrder(payload) {
  return apiFetch("/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function trackOrder(orderNumber, phone) {
  return apiFetch(`/orders/${orderNumber}/track`, { params: { phone } });
}

export async function sendContactMessage(payload) {
  return apiFetch("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* ------------------------------------------------------------------ */
/* Customer Authentication                                            */
/* ------------------------------------------------------------------ */

export async function registerCustomer(payload) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginCustomer(payload) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCustomerProfile(token) {
  return apiFetch("/auth/me", {
    cache: "no-store",
    revalidate: 0,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function logoutCustomer(token) {
  return apiFetch("/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function changeCustomerPassword(token, payload) {
  return apiFetch("/auth/change-password", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateCustomerProfile(token, payload) {
  return apiFetch("/auth/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function subscribe(email) {
  return apiFetch("/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
