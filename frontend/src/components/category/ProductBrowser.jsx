"use client";

import React, { useEffect, useMemo, useState } from "react";
import CategoryBreadcrumb from "@/components/category/CategoryBreadcrumb";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryFilterSidebar from "@/components/category/CategoryFilterSidebar";
import ProductGrid from "@/components/category/ProductGrid";
import { filterProducts, sortProducts } from "@/lib/catalog";

/**
 * One browsing experience shared by /products and /categories/[category].
 * The pages that render it are server components, so the catalogue is in the
 * initial HTML; only the filter interactions run on the client.
 */
export default function ProductBrowser({
  products = [],
  subCategories = [],
  title = "All Furniture",
  breadcrumb = [],
  lockedCategory = null,
  initialSubcategory = "",
  initialSort = "featured",
  initialQuery = "",
}) {
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [selectedCategory, setSelectedCategory] = useState(lockedCategory || "");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState(initialSubcategory);
  const [query, setQuery] = useState(initialQuery);

  // Deep links (?category=, ?room=, ?sub=, ?sort=, ?q=) are applied after mount.
  // Reading them on the server would force dynamic rendering, and
  // useSearchParams() would need a Suspense boundary — either one puts the
  // route back into streaming mode, which is what turned notFound() into a
  // soft 404 (HTTP 200) for unknown slugs.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    const room = params.get("room");
    const sub = params.get("sub");
    const sort = params.get("sort");
    const q = params.get("q");

    if (cat && !lockedCategory) setSelectedCategory(cat);
    if (room) setSelectedRoom(room);
    if (sub) setSelectedSubcategory(sub);
    if (sort) setSelectedSort(sort);
    if (q) setQuery(q);
  }, [lockedCategory]);

  const handlePriceRangeChange = (index) =>
    setSelectedPriceRanges((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );

  const resetFilters = () => {
    if (!lockedCategory) setSelectedCategory("");
    setSelectedRoom("");
    setSelectedSize("");
    setSelectedPriceRanges([]);
    setSelectedSubcategory("");
    setQuery("");
    setSelectedSort("featured");
  };

  const visibleProducts = useMemo(
    () =>
      sortProducts(
        filterProducts(products, {
          category: lockedCategory || selectedCategory,
          room: selectedRoom,
          subcategory: selectedSubcategory,
          size: selectedSize,
          priceRanges: selectedPriceRanges,
          query,
        }),
        selectedSort
      ),
    [
      products,
      lockedCategory,
      selectedCategory,
      selectedRoom,
      selectedSubcategory,
      selectedSize,
      selectedPriceRanges,
      query,
      selectedSort,
    ]
  );

  const hasActiveFilters =
    Boolean(selectedSubcategory) ||
    Boolean(selectedSize) ||
    Boolean(query) ||
    selectedPriceRanges.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <CategoryBreadcrumb trail={breadcrumb} />

        <CategoryHeader
          title={title}
          subCategories={subCategories}
          selectedSubcategory={selectedSubcategory}
          onSelectSubcategory={setSelectedSubcategory}
        />

        <div className="flex flex-col lg:flex-row items-start gap-8 pt-6 border-t border-gray-100">
          <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-6 self-start max-h-[calc(100vh-3rem)] overflow-y-auto">
            <CategoryFilterSidebar
              totalItems={visibleProducts.length}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              selectedPriceRanges={selectedPriceRanges}
              onPriceRangeChange={handlePriceRangeChange}
              query={query}
              onQueryChange={setQuery}
              onReset={resetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          <div className="flex-1 w-full">
            {visibleProducts.length === 0 && hasActiveFilters ? (
              <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-sm font-semibold text-gray-700">
                  No products match these filters.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 text-xs font-bold text-white bg-black px-5 py-2.5 rounded-full hover:bg-gray-800 transition cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <ProductGrid products={visibleProducts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
