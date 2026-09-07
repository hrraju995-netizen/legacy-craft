"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { PRICE_RANGES, SIZE_OPTIONS, SORT_OPTIONS } from "@/lib/catalog";

/**
 * Options now come from the catalog module, so the filters can only ever
 * offer values that actually exist in the data. The old file had invented
 * item counts ("120 items") and price bands that matched nothing.
 */
const CategoryFilterSidebar = ({
  totalItems,
  selectedSort,
  onSortChange,
  selectedPriceRanges = [],
  onPriceRangeChange,
  selectedSize,
  onSizeChange,
  query = "",
  onQueryChange,
  onReset,
  hasActiveFilters = false,
}) => {
  const [openSections, setOpenSections] = useState({
    sort: true,
    size: true,
    price: true,
  });

  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const Section = ({ id, title, children }) => (
    <div className="py-4">
      <button
        type="button"
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between text-left cursor-pointer"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
          {title}
        </span>
        {openSections[id] ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {openSections[id] && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );

  return (
    <aside className="w-full lg:w-60 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 pr-0 lg:pr-6 pb-6 lg:pb-0 select-none">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-400">{totalItems} items</p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] font-semibold text-primary hover:underline cursor-pointer flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {onQueryChange && (
        <div className="relative mb-4">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      )}

      <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
        <Section id="sort" title="Sort by">
          {SORT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer hover:text-gray-900"
            >
              <input
                type="radio"
                name="sort"
                checked={selectedSort === option.value}
                onChange={() => onSortChange(option.value)}
                className="w-3.5 h-3.5 accent-black cursor-pointer"
              />
              {option.label}
            </label>
          ))}
        </Section>

        <Section id="size" title="Size">
          <label className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer hover:text-gray-900">
            <input
              type="radio"
              name="size"
              checked={!selectedSize}
              onChange={() => onSizeChange("")}
              className="w-3.5 h-3.5 accent-black cursor-pointer"
            />
            All sizes
          </label>
          {SIZE_OPTIONS.map((size) => (
            <label
              key={size}
              className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer hover:text-gray-900"
            >
              <input
                type="radio"
                name="size"
                checked={selectedSize === size}
                onChange={() => onSizeChange(size)}
                className="w-3.5 h-3.5 accent-black cursor-pointer"
              />
              {size}
            </label>
          ))}
        </Section>

        <Section id="price" title="Price">
          {PRICE_RANGES.map((range, index) => (
            <label
              key={range.label}
              className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={selectedPriceRanges.includes(index)}
                onChange={() => onPriceRangeChange(index)}
                className="w-3.5 h-3.5 accent-black cursor-pointer rounded"
              />
              {range.label}
            </label>
          ))}
        </Section>
      </div>
    </aside>
  );
};

export default CategoryFilterSidebar;
