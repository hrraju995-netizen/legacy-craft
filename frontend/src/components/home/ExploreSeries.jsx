"use client";

import React, { useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";


const ExploreSeries = ({ products = [] }) => {
  const productsData = products;
  const scrollRef = useRef(null);
  const seriesData = useMemo(() => {
    const seriesMap = new Map();

    productsData.forEach((product) => {
      const key = product.subcategory || product.category;
      if (!seriesMap.has(key)) {
        seriesMap.set(key, {
          id: key,
          title: `${key} Series`,
          description: `${product.roomType || "Home"} spaces-এর জন্য আধুনিক ${product.material || "উচ্চমানের"} ফার্নিচার কালেকশন।`,
          count: 1,
          image: product.thumbnail || product.images?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
          link: `/categories/${product.categorySlug}`,
        });
      } else {
        const existing = seriesMap.get(key);
        existing.count += 1;
      }
    });

    return Array.from(seriesMap.values()).map((item) => ({
      ...item,
      setsCount: `${item.count} ${item.count > 1 ? "SETS" : "SET"}`,
    }));
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstCard = container.children[0];

      if (firstCard) {
        const cardWidth = firstCard.offsetWidth + 24;

        container.scrollBy({
          left: direction === "left" ? -cardWidth : cardWidth,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="w-1.5 h-10 sm:h-12 bg-primary rounded-full shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#111827] tracking-tight">
                Explore Our Series
              </h2>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                Curated collections designed to create cohesive and inspiring environments.
              </p>
            </div>
          </div>

          <div>
            <Link
              href="/products"
              className="px-5 py-2.5 rounded-bl-2xl rounded-tr-2xl border border-gray-300 text-xs sm:text-sm font-medium text-white bg-black hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer shrink-0 inline-block"
            >
              View All Series
            </Link>
          </div>
        </div>

        {/* Dynamic Series Cards Slider Container with Floating Navigation */}
        <div className="relative group">

          {/* Floating Left Button */}
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm text-gray-800 hover:border-primary hover:bg-primary transition-all hover:text-white shadow-md active:scale-95 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 cursor-pointer" />
          </button>

          {/* Floating Right Button */}
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm text-gray-800 hover:text-white hover:border-primary hover:bg-primary transition-all shadow-md active:scale-95 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 cursor-pointer" />
          </button>

          {/* Scrollable Cards Grid with CSS Snap Centering */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-2 sm:px-1 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {seriesData.map((item) => (
              <div
                key={item.id}
                className="shrink-0 w-[85vw] max-w-[320px] sm:w-80 snap-center bg-white rounded-2xl border border-gray-200/80 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group/card cursor-pointer"
              >
                {/* Image Container with Badge */}
                <div className="relative w-full h-64 bg-[#f4f5f7] overflow-hidden">
                  <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full text-gray-800 shadow-sm z-10">
                    {item.setsCount}
                  </span>

                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
              sizes="(max-width: 640px) 82vw, 320px"
                    className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Card Content & Action Button */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 group-hover/card:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-5 min-h-[32px]">
                      {item.description}
                    </p>
                  </div>

                  {/* View Collection Link */}
                  <Link
                    href={item.link}
                    className="w-full py-2.5 px-4 rounded-lg border border-primary text-xs font-semibold  bg-primary text-white hover:border-primary hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
                  >
                    <span>View Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform cursor-pointer" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ExploreSeries;