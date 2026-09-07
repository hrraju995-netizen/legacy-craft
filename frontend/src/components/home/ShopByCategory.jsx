"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Storage & Shelves",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600",
    link: "/categories/storage-and-shelves",
  },
  {
    id: 2,
    name: "Beds & Mattresses",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=600",
    link: "/categories/beds-and-mattresses",
  },
  {
    id: 3,
    name: "Sofa & Seating",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600",
    link: "/categories/sofa-and-seating",
  },
  {
    id: 4,
    name: "Tables & Desks",
    image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&q=80&w=600",
    link: "/categories/tables-and-desks",
  },
  {
    id: 5,
    name: "Office Furniture",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=600",
    link: "/categories/office-furniture",
  },
  {
    id: 6,
    name: "Chairs",
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&q=80&w=600",
    link: "/products?q=chair",
  },
  {
    id: 7,
    name: "Outdoor Furniture",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
    link: "/categories/outdoor-furniture",
  },
  {
    id: 8,
    name: "Classroom Furniture",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=600",
    link: "/categories/classroom-furniture",
  },
  {
    id: 9,
    name: "Dining Furniture",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
    link: "/categories/dining-furniture",
  },
];

const ShopByCategory = () => {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current.querySelector("a");
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth + 16; 
        
        scrollRef.current.scrollBy({
          left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8">
        
        {/* Heading Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-start gap-3">
            <span className="w-1.5 h-10 sm:h-12 bg-primary rounded-full shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#111827] tracking-tight">
                Shop By Category
              </h2>
              <p className="text-sm sm:text-base text-gray-500 mt-1">
                Explore our wide range of categories to transform your space.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              className="p-2.5 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-primary hover:border-primary hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleScroll("right")}
              className="p-2.5 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-primary hover:border-primary hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          <div
            ref={scrollRef}
            className="flex items-center gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className="shrink-0 w-40 sm:w-56 bg-[#f5f5f5] rounded-lg p-3 sm:p-4 text-center hover:shadow-md transition-all duration-300 border border-gray-100/80 group/card snap-start"
              >
                {/* Image Box */}
                <div className="relative w-full h-32 sm:h-44 mb-3 overflow-hidden rounded-md bg-gray-200">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 160px, 224px"
                    className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                  />
                </div>

                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover/card:text-primary transition-colors line-clamp-1">
                  {item.name}
                </h3>
              </Link>
            ))}
          </div>

          {/* Mobile Overlay Navigation Buttons */}
          <button
            onClick={() => handleScroll("left")}
            className="sm:hidden absolute left-1 top-1/2 -translate-y-1/2 bg-white/95 p-2 rounded-full shadow-lg text-gray-800 border border-gray-200 z-10 active:scale-90 transition-transform"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="sm:hidden absolute right-1 top-1/2 -translate-y-1/2 bg-white/95 p-2 rounded-full shadow-lg text-gray-800 border border-gray-200 z-10 active:scale-90 transition-transform"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default ShopByCategory;