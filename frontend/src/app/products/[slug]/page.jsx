import { notFound } from "next/navigation";
import ProductDetails from "@/components/product/ProductDetails";
import { getAllProducts, getProduct } from "@/lib/api";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const products = await getAllProducts();
    return (Array.isArray(products) ? products : [])
      .filter((p) => p && p.slug)
      .map((product) => ({ slug: product.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const { product } = await getProduct(slug);

    if (!product) return { title: "Product not found" };

    const title = product.meta?.title || `${product.name} — ${product.category || ""}`;
    const description =
      product.meta?.description ||
      `${product.shortDescription ?? product.name} Available at ${siteConfig.name} for ৳${(product.price || 0).toLocaleString()}.`;

    return {
      title,
      description,
      alternates: { canonical: `/products/${product.slug}` },
      openGraph: {
        title,
        description,
        type: "website",
        url: `${siteConfig.url}/products/${product.slug}`,
        images: product.thumbnail ? [{ url: product.thumbnail, alt: product.name }] : [],
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const { product, related } = await getProduct(slug);

  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.shortDescription,
    sku: product.sku ?? product.id,
    material: product.material,
    brand: { "@type": "Brand", name: siteConfig.name },
    aggregateRating: product.reviewCount
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "BDT",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteConfig.url}/products/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetails product={product} related={related} />
    </>
  );
}
