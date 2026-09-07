"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { FALLBACK_IMAGE } from "@/lib/catalog";

// Inspiration Data with 10 Items & Hotspots
const inspirationScenes = [
  {
    id: 1,
    title: "Modern Bedroom Setup",
    image: "https://picsum.photos/id/1068/800/1000",
    hotspots: [
      {
        id: "h1",
        x: 20,
        y: 60,
        slug: "renox-luxury-dressing-table",
      },
      {
        id: "h2",
        x: 55,
        y: 62,
        slug: "nordic-solid-teak-king-bed",
      },
      {
        id: "h3",
        x: 85,
        y: 25,
        slug: "classic-wooden-wardrobe-4-door",
      },
      {
        id: "h4",
        x: 35,
        y: 78,
        slug: "comfy-upholstered-armchair",
      },
    ],
  },
  {
    id: 2,
    title: "Cozy Living Corner",
    image: "https://picsum.photos/id/1075/800/1000",
    hotspots: [
      {
        id: "h5",
        x: 35,
        y: 52,
        slug: "luxury-marble-top-coffee-table",
      },
      {
        id: "h6",
        x: 70,
        y: 72,
        slug: "comfy-upholstered-armchair",
      },
      {
        id: "h7",
        x: 65,
        y: 24,
        slug: "modern-industrial-bookshelf",
      },
    ],
  },
  {
    id: 3,
    title: "Kids Classroom Desk",
    image: "https://picsum.photos/id/1071/800/1000",
    hotspots: [
      {
        id: "h8",
        x: 55,
        y: 72,
        slug: "kids-room-study-set",
      },
    ],
  },
  {
    id: 4,
    title: "Executive Office Suite",
    image: "https://picsum.photos/id/1060/800/1000",
    hotspots: [
      {
        id: "h9",
        x: 38,
        y: 52,
        slug: "ergonomic-mesh-executive-chair",
      },
      {
        id: "h10",
        x: 82,
        y: 62,
        slug: "ergowork-manager-desk",
      },
      {
        id: "h11",
        x: 72,
        y: 27,
        slug: "fortress-biometric-digital-safe",
      },
    ],
  },
  {
    id: 5,
    title: "Minimalist Lounge Studio",
    image: "https://picsum.photos/id/1062/800/1000",
    hotspots: [
      {
        id: "h13",
        x: 45,
        y: 65,
        slug: "nexa-fabric-l-shape-sofa",
      },
    ],
  },
  {
    id: 6,
    title: "Nordic Dining Space",
    image: "https://picsum.photos/id/1078/800/1000",
    hotspots: [
      {
        id: "h14",
        x: 50,
        y: 60,
        slug: "minimalist-oak-dining-table",
      },
    ],
  },
  {
    id: 7,
    title: "Luxury Velvet Parlor",
    image: "https://picsum.photos/id/1067/800/1000",
    hotspots: [
      {
        id: "h15",
        x: 60,
        y: 70,
        slug: "velvet-touch-3-seater-sofa",
      },
    ],
  },
  {
    id: 8,
    title: "Urban Loft Interior",
    image: "https://picsum.photos/id/1081/800/1000",
    hotspots: [
      {
        id: "h16",
        x: 40,
        y: 55,
        slug: "pylar-restaurant-table",
      },
    ],
  },
  {
    id: 9,
    title: "Compact Reading Nook",
    image: "https://picsum.photos/id/1073/800/1000",
    hotspots: [
      {
        id: "h17",
        x: 50,
        y: 60,
        slug: "comfy-upholstered-armchair",
      },
    ],
  },
  {
    id: 10,
    title: "Contemporary Balcony Corner",
    image: "https://picsum.photos/id/1076/800/1000",
    hotspots: [
      {
        id: "h18",
        x: 48,
        y: 65,
        slug: "patio-weatherproof-rattan-chair",
      },
    ],
  },
];

// Single Inspiration Card
/**
 * Hotspot copy used to be typed out by hand and pointed at /product/* routes
 * that did not exist. Each hotspot now names a real product and the label,
 * price, image and href are read straight from the catalogue.
 */
const buildInspirationData = (products = []) => {
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  return inspirationScenes.map((scene) => ({
    ...scene,
    hotspots: scene.hotspots.map((spot) => {
      const product = bySlug.get(spot.slug);
      return {
        ...spot,
        title: product ? product.name : "View product",
        price: product ? product.price.toLocaleString() : "",
        image: product ? product.thumbnail : FALLBACK_IMAGE,
        link: product ? `/products/${product.slug}` : "/products",
      };
    }),
  }));
};

const RoomCard = ({ card }) => {
  const [activeHotspot, setActiveHotspot] = useState(null);

  return (
    <div className="shrink-0 w-[85vw] max-w-[320px] sm:w-80 lg:w-[310px] snap-center sm:snap-start relative group rounded-xl overflow-hidden bg-gray-50 hover:bg-white shadow-sm hover:shadow-2xl border border-gray-200/80 hover:border-gray-900/20 transition-all duration-500 ease-out transform hover:-translate-y-1.5 cursor-pointer">
      {/* Background Room Image Container */}
      <div className="relative w-full h-[380px] sm:h-[420px] overflow-hidden">
        {/* Dark Soft Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 z-1 pointer-events-none" />

        <Image
          src={card.image}
          alt={card.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out cursor-pointer"
        />

        {/* Dynamic Hotspots */}
        {card.hotspots.map((spot, spotIdx) => {
          const spotUniqueId = spot.id ?? `${card.id}-spot-${spotIdx}`;
          const isCurrentActive = activeHotspot === spotUniqueId;
          const isNearTop = spot.y < 25;
          const isNearRight = spot.x > 70;
          const isNearLeft = spot.x < 30;

          // Compute tooltip alignment so it never cuts off outside card boundary
          const xAlignmentClass = isNearRight
            ? "right-0 translate-x-4"
            : isNearLeft
            ? "left-0 -translate-x-4"
            : "left-1/2 -translate-x-1/2";
          const yAlignmentClass = isNearTop ? "top-8" : "bottom-8";

          return (
            <div
              key={spotUniqueId}
              style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              onMouseEnter={() => setActiveHotspot(spotUniqueId)}
              onMouseLeave={() => setActiveHotspot(null)}
            >
              {/* Hotspot Pulse Pin */}
              <button
                type="button"
                className={`relative flex items-center justify-center w-6 h-6 rounded-full p-1 border-2 border-white shadow-md cursor-pointer transition-all duration-300 ${
                  isCurrentActive ? "scale-125 bg-amber-500" : "hover:scale-125 bg-yellow-400"
                }`}
                aria-label={spot.title}
              >
                <span className="w-2 h-2 rounded-full bg-white cursor-pointer" />
                <span className="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-75" />
              </button>

              {/* Product Quick-View Tooltip Card ONLY for this specific hovered hotspot */}
              {isCurrentActive && (
                <div
                  className={`absolute ${xAlignmentClass} ${yAlignmentClass} z-30 w-52 p-3 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200/90 flex gap-3 items-center animate-fadeIn pointer-events-auto`}
                >
                  {spot.image && (
                    <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60">
                      <Image
                        src={spot.image}
                        alt={spot.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-grow min-w-0 text-left">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {spot.title}
                    </h4>
                    <p className="text-xs font-extrabold text-primary mt-0.5">
                      ৳{spot.price}
                    </p>
                    <Link
                      href={spot.link || "/products"}
                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-semibold hover:underline mt-1 cursor-pointer"
                    >
                      View Details
                      <ShoppingBag className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Card Bottom Subtitle Bar */}
      <div className="p-3.5 bg-white group-hover:bg-gray-900 transition-colors duration-500 flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-white truncate transition-colors duration-500">
          {card.title}
        </h3>
        <span className="text-[11px] font-medium text-gray-400 group-hover:text-yellow-400 transition-colors duration-500 shrink-0 ml-2">
          {card.hotspots.length} Products
        </span>
      </div>
    </div>
  );
};

const GetTheLook = ({ products = [], lookbooks = [] }) => {
  // Scenes built in the admin panel win. The hard-coded demo scenes remain as
  // a fallback so the section is never empty on a fresh install.
  const adminScenes = Array.isArray(lookbooks) ? lookbooks : [];

  const inspirationData = adminScenes.length
    ? adminScenes.map((scene, sIdx) => ({
        id: scene.id ?? scene.title ?? `scene-${sIdx}`,
        title: scene.title,
        image: scene.image,
        productCount: (scene.hotspots || []).length,
        hotspots: (scene.hotspots || []).map((h, hIdx) => ({
          id: h.id ?? `scene-${sIdx}-spot-${hIdx}`,
          x: Number(h.x),
          y: Number(h.y),
          title: h.title,
          price: typeof h.price === "number" ? h.price.toLocaleString() : h.price,
          image: h.image,
          link: h.link,
        })),
      }))
    : buildInspirationData(products);
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstCard = container.children[0];
      if (firstCard) {
        // Calculate dynamic card width + gap for precise item-by-item scrolling
        const cardWidth = firstCard.offsetWidth + 24; // 24px is gap-6
        container.scrollBy({
          left: direction === "left" ? -cardWidth : cardWidth,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="w-1.5 h-10 bg-primary rounded-full shrink-0 mt-0.5" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Get the look
              </h2>
              <p className="text-sm text-gray-500 mt-0.5 font-normal">
                Ideas based on your recently viewed products
              </p>
            </div>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-bl-2xl rounded-tr-2xl border border-gray-900 text-xs sm:text-sm font-semibold text-white bg-black hover:bg-primary hover:border-primary transition-all cursor-pointer shrink-0 self-start sm:self-auto"
          >
            View all room inspiration
            <ArrowRight className="w-4 h-4 cursor-pointer" />
          </Link>
        </div>

        {/* Dynamic Slider Container */}
        <div className="relative">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="absolute left-1 sm:-left-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border border-gray-200 bg-white text-gray-800 hover:bg-primary hover:text-white hover:border-primary hover:scale-110 transition-all duration-300 shadow-lg active:scale-95 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 cursor-pointer" />
          </button>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="absolute right-1 sm:-right-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border border-gray-200 bg-white text-gray-800 hover:bg-primary hover:text-white hover:border-primary hover:scale-110 transition-all duration-300 shadow-lg active:scale-95 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 cursor-pointer" />
          </button>

          {/* Horizontal Scrollable Slider Row */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto scroll-smooth py-4 px-1 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {inspirationData.map((card) => (
              <RoomCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetTheLook;