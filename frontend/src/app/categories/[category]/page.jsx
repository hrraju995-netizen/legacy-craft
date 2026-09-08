import { notFound } from "next/navigation";
import ProductBrowser from "@/components/category/ProductBrowser";
import { getAllProducts, getCategories } from "@/lib/api";
import { getSubcategoriesFrom } from "@/lib/catalog";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return (Array.isArray(categories) ? categories : [])
      .filter((c) => c && c.slug)
      .map((category) => ({ category: category.slug }));
  } catch {
    return [];
  }
}

async function findCategory(slug) {
  try {
    const categories = await getCategories();
    return (Array.isArray(categories) ? categories : []).find((c) => c.slug === slug) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  try {
    const { category: slug } = await params;
    const category = await findCategory(slug);

    if (!category) return { title: "Category not found" };

    const title = `${category.title} — Price in Bangladesh`;
    const description =
      category.description ||
      `Browse ${category.count || 0} ${category.title ? category.title.toLowerCase() : ""} products at ${siteConfig.name}. Filter by size, price and type.`;

    return {
      title,
      description,
      alternates: { canonical: `/categories/${category.slug}` },
      openGraph: { title, description, images: category.image ? [{ url: category.image }] : [] },
    };
  } catch {
    return { title: "Category" };
  }
}

export default async function CategoryPage({ params }) {
  const { category: slug } = await params;
  const category = await findCategory(slug);

  if (!category) notFound();

  // Ask the API for this category only — no client-side over-fetching.
  const products = await getAllProducts();
  const scoped = products.filter((p) => p.categorySlug === slug);

  return (
    <ProductBrowser
      products={products}
      lockedCategory={slug}
      subCategories={getSubcategoriesFrom(scoped)}
      title={category.title}
      breadcrumb={[
        { label: "Categories", href: "/categories" },
        { label: category.title },
      ]}
    />
  );
}
