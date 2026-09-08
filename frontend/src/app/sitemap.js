import { getAllProducts, getCategories } from "@/lib/api";
import { siteConfig } from "@/config/site";

export default async function sitemap() {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes = ["", "/products", "/categories", "/about", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1 : 0.8,
    })
  );

  let categories = [];
  let products = [];
  try {
    const results = await Promise.allSettled([getCategories(), getAllProducts()]);
    if (results[0].status === "fulfilled" && Array.isArray(results[0].value)) {
      categories = results[0].value;
    }
    if (results[1].status === "fulfilled" && Array.isArray(results[1].value)) {
      products = results[1].value;
    }
  } catch (err) {
    console.warn("Sitemap fetch failed:", err);
  }

  const categoryRoutes = categories
    .filter((category) => category && category.slug)
    .map((category) => ({
      url: `${base}/categories/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  const productRoutes = products
    .filter((product) => product && product.slug)
    .map((product) => {
      let lastModified = now;
      if (product.createdAt) {
        const d = new Date(product.createdAt);
        if (!isNaN(d.getTime())) {
          lastModified = d;
        }
      }
      return {
        url: `${base}/products/${product.slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.6,
      };
    });

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
