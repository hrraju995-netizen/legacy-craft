import { siteConfig } from "@/config/site";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // No SEO value and shouldn't be indexed.
        disallow: ["/cart", "/checkout", "/thank-you", "/wishlist", "/login", "/signup"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
