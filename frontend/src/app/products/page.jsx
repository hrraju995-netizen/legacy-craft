import ProductBrowser from "@/components/category/ProductBrowser";
import { getAllProducts } from "@/lib/api";
import { getSubcategoriesFrom } from "@/lib/catalog";

export const metadata = {
  title: "All Furniture",
  description:
    "Browse the full Legacy Craft Studio catalogue — beds, sofas, desks, storage and office furniture, filterable by size, price and type.",
  alternates: { canonical: "/products" },
};

// Rebuild this page at most once a minute so new admin products appear
// without a redeploy.
export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <ProductBrowser
      products={products}
      subCategories={getSubcategoriesFrom(products)}
      title="All Furniture"
      breadcrumb={[{ label: "All Furniture" }]}
    />
  );
}
