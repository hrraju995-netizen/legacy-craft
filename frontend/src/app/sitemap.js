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

  const [categories, products] = await Promise.all([getCategories(), getAllProducts()]);

  const categoryRoutes = categories.map((category) => ({
    url: `${base}/categories/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productRoutes = products.map((product) => ({
    url: `${base}/products/${product.slug}`,
    lastModified: new Date(product.createdAt),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
