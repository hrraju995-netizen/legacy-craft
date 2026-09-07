"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const roomInspirations = [
  {
    id: 1,
    title: "Bedroom",
    image: "https://picsum.photos/id/1068/800/1000",
    link: "/products?q=Bedroom",
  },
  {
    id: 2,
    title: "Living room",
    image: "https://picsum.photos/id/1075/800/1000",
    link: "/products?q=Living+Room",
  },
  {
    id: 3,
    title: "Executive Room",
    image: "https://picsum.photos/id/1060/800/1000",
    link: "/products?q=Home+Office",
  },
  {
    id: 4,
    title: "Kitchen",
    image: "https://picsum.photos/id/1080/800/1000",
    link: "/products?q=Kitchen",
  },
  {
    id: 5,
    title: "Dining Room",
    image: "https://picsum.photos/id/1078/800/1000",
    link: "/products?q=Dining+Room",
  },
  {
    id: 6,
    title: "Study Room",
    image: "https://picsum.photos/id/1071/800/1000",
    link: "/products?q=Home+Office",
  },
  {
    id: 7,
    title: "Outdoor & Balcony",
    image: "https://picsum.photos/id/1076/800/1000",
    link: "/products?q=Outdoor",
  },
  {
    id: 8,
    title: "Kids Room",
    image: "https://picsum.photos/id/1069/800/1000",
    link: "/products?q=Kids+Room",
  },
  {
    id: 9,
    title: "Lounge Studio",
    image: "https://picsum.photos/id/1062/800/1000",
    link: "/products?q=Living+Room",
  },
  {
    id: 10,
    title: "Home Office",
    image: "https://picsum.photos/id/1059/800/1000",
    link: "/products?q=Home+Office",
  },
];

const RoomInspirationSlider = () => {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstCard = container.children[0];
      if (firstCard) {
        // dynamic card width + gap (20px on mobile, 24px on desktop)
        const gap = window.innerWidth < 640 ? 20 : 24;
        const cardWidth = firstCard.offsetWidth + gap;
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
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-7 bg-primary rounded-full shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Inspiration for every room
            </h2>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center justify-center px-7 py-3 rounded-bl-2xl rounded-tr-2xl border border-gray-300 text-xs sm:text-sm font-medium text-white bg-black hover:border-primary hover:bg-primary transition-all cursor-pointer shrink-0"
          >
            See all rooms
          </Link>
        </div>

        {/* Slider Container */}
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

          {/* Horizontal Scroll Row */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto scroll-smooth py-2 px-1 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {roomInspirations.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className="shrink-0 w-[85vw] max-w-[280px] sm:w-72 lg:w-[280px] snap-center sm:snap-start group cursor-pointer"
              >
                {/* Image Container with Rounded Corners */}
                <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
              sizes="(max-width: 640px) 70vw, 300px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Title & Arrow Footer */}
                <div className="flex items-center justify-between mt-3 px-1">
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-black transition-colors">
                    {item.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-gray-900 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default RoomInspirationSlider;