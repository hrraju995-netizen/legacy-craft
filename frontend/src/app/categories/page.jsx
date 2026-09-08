import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import CategoryBreadcrumb from "@/components/category/CategoryBreadcrumb";
import { getCategories, getHomeData } from "@/lib/api";

export const metadata = {
  title: "Shop by Category",
  description:
    "Every Legacy Craft Studio furniture category and room collection in one place.",
  alternates: { canonical: "/categories" },
};

export const revalidate = 300;

export default async function CategoriesPage() {
  const [categories, home] = await Promise.all([getCategories(), getHomeData()]);
  const rooms = home?.rooms ?? [];

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <CategoryBreadcrumb trail={[{ label: "Categories" }]} />

        <div className="flex items-center gap-3 mb-8">
          <span className="w-1.5 h-8 bg-primary rounded-full shrink-0" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Shop by Category
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {categories.length} collections across {rooms.length} room types.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {(Array.isArray(categories) ? categories : []).map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group relative rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="relative aspect-4/3 bg-gray-50">
                <Image
                  src={category.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600"}
                  alt={category.title || "Category"}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {category.title}
                </h2>
                <p className="text-[11px] text-white/80 mt-0.5 flex items-center gap-1">
                  {category.count || 0} products
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 pt-10 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-8 bg-primary rounded-full shrink-0" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Shop by Room
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {rooms.map((room) => (
              <Link
                key={room.slug}
                href={`/products?q=${encodeURIComponent(room.title)}`}
                className="px-5 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                {room.title}
                <span className="text-gray-400 ml-1.5">{room.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
