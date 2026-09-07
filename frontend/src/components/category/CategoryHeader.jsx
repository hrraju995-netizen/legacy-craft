"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Subcategories used to link to /products/{categorySlug}/{sub}, a route that
 * never existed. They are filter controls now, so nothing 404s.
 */
const CategoryHeader = ({
  title = "All Furniture",
  subCategories = [],
  selectedSubcategory = "",
  onSelectSubcategory = () => {},
}) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-10 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Explore {title}
        </h1>
        {subCategories.length > 0 && (
          <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200/60">
            {subCategories.length} Categories
          </span>
        )}
      </div>

      <div className="relative">
        {/* Left Arrow Button - Aligned over the first image */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 top-12 sm:top-14 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md border border-gray-200 shadow-lg flex items-center justify-center text-gray-800 hover:bg-black hover:text-white hover:border-black active:scale-95 z-20 transition-all duration-200 cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Subcategories Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 sm:gap-5 overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {subCategories.map((sub) => {
            const isActive = selectedSubcategory === sub.id;
            return (
            <button
              key={sub.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelectSubcategory(isActive ? "" : sub.id)}
              className="shrink-0 flex flex-col items-center w-24 sm:w-28 group/sub cursor-pointer"
            >
              <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 border shadow-xs group-hover/sub:shadow-md transition-all duration-300 ${
                isActive ? "border-primary ring-2 ring-primary/30" : "border-gray-200/70"
              }`}>
                <Image
                  src={sub.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop"}
                  alt={sub.name}
                  fill
                  sizes="112px"
                  className="object-cover group-hover/sub:scale-110 transition-transform duration-500 ease-out cursor-pointer"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/sub:opacity-100 transition-opacity duration-300" />
              </div>
              <span className={`text-[11px] sm:text-xs text-center font-semibold line-clamp-2 transition-colors mt-2 cursor-pointer ${
                isActive ? "text-primary" : "text-gray-700 group-hover/sub:text-black"
              }`}>
                {sub.name}
              </span>
            </button>
            );
          })}
        </div>

        {/* Right Arrow Button - Aligned over the last image */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 top-12 sm:top-14 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md border border-gray-200 shadow-lg flex items-center justify-center text-gray-800 hover:bg-black hover:text-white hover:border-black active:scale-95 z-20 transition-all duration-200 cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};

export default CategoryHeader;