"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Fallback brands if no custom partners are added yet
const defaultBrands = [
  {
    name: "Prothom Alo",
    svg: (
      <svg viewBox="0 0 240 60" className="w-full h-12">
        <text x="0" y="42" fontFamily="serif" fontSize="34" fontWeight="bold" fill="#000">
          প্রথম আলো
        </text>
        <circle cx="128" cy="18" r="8" fill="#ED1C24" />
      </svg>
    ),
  },
  {
    name: "City Bank",
    svg: (
      <svg viewBox="0 0 200 60" className="w-full h-12">
        <path d="M10 35 L30 15 L50 35 L30 30 Z" fill="#ED1C24" />
        <path d="M25 45 L45 25 L65 45 L45 40 Z" fill="#ED1C24" />
        <text x="75" y="40" fontStyle="italic" fontSize="24" fontWeight="bold" fill="#ED1C24">
          city bank
        </text>
      </svg>
    ),
  },
  {
    name: "Pizza Hut",
    svg: (
      <svg viewBox="0 0 180 60" className="w-full h-12">
        <path d="M15 25 Q45 15 75 25 L80 32 Q45 22 10 32 Z" fill="#ED1C24" />
        <path d="M25 24 L45 5 L65 24 Z" fill="#ED1C24" />
        <text x="12" y="48" fontStyle="italic" fontSize="20" fontWeight="bold" fill="#ED1C24">
          Pizza Hut
        </text>
      </svg>
    ),
  },
  {
    name: "SSG",
    svg: (
      <svg viewBox="0 0 160 60" className="w-full h-12">
        <text x="0" y="42" fontStyle="italic" fontSize="36" fontWeight="900" fill="#8B208C">
          SSG
        </text>
        <path d="M90 15 L105 25 L95 28 L110 40 L98 32 Z" fill="#F58220" />
      </svg>
    ),
  },
  {
    name: "Pubali Bank",
    svg: (
      <svg viewBox="0 0 180 60" className="w-full h-12">
        <circle cx="30" cy="30" r="22" stroke="#008853" strokeWidth="3" fill="none" />
        <polygon points="30,12 36,25 50,25 38,33 43,46 30,38 17,46 22,33 10,25 24,25" fill="#008853" />
        <text x="60" y="38" fontSize="18" fontWeight="bold" fill="#008853">
          পুবালী ব্যাংক
        </text>
      </svg>
    ),
  },
  {
    name: "Herfy",
    svg: (
      <svg viewBox="0 0 160 60" className="w-full h-12">
        <path d="M10 25 Q40 5 70 25 Q40 35 10 25 Z" fill="#E31E24" />
        <text x="5" y="52" fontStyle="italic" fontSize="24" fontWeight="900" fill="#0055A5">
          HERFY
        </text>
      </svg>
    ),
  },
  {
    name: "KFC",
    svg: (
      <svg viewBox="0 0 160 60" className="w-full h-12">
        <rect x="10" y="5" width="50" height="50" rx="6" fill="#E31E24" />
        <text x="20" y="38" fontSize="18" fontWeight="bold" fill="#FFF">
          KFC
        </text>
        <text x="70" y="40" fontStyle="italic" fontSize="28" fontWeight="900" fill="#E31E24">
          KFC
        </text>
      </svg>
    ),
  },
  {
    name: "bKash",
    svg: (
      <svg viewBox="0 0 160 60" className="w-full h-12">
        <text x="0" y="40" fontSize="28" fontWeight="bold" fill="#E2136E">
          bKash
        </text>
        <polygon points="85,15 115,25 95,45" fill="#E2136E" />
      </svg>
    ),
  },
];

export default function WhoTrustsUsSection({ title, subtitle, partners = [] }) {
  const scrollRef = useRef(null);

  const displayTitle = title || "Who Trusts Us";
  const displaySubtitle =
    subtitle || "Partnering with 24000+ forward-thinking companies to build better workspaces.";

  const items = partners && partners.length > 0 ? partners : defaultBrands;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.6;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-14 bg-white">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Border line top & bottom as in screenshot */}
        <div className="border-t border-b border-gray-200/90 py-12 text-center">

          {/* Section Heading */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {displayTitle}
          </h2>

          {/* Section Subtitle */}
          {displaySubtitle && (
            <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
              {displaySubtitle}
            </p>
          )}

          {/* Brands Carousel */}
          <div className="relative mt-12 mb-8">
            <div
              ref={scrollRef}
              className="flex items-center gap-10 sm:gap-16 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-4 justify-start sm:justify-center"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {items.map((item, index) => {
                const content = (
                  <div className="shrink-0 flex items-center justify-center h-16 w-36 sm:w-44 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    {item.logo ? (
                      <div className="relative h-12 w-36 flex items-center justify-center">
                        <Image
                          src={item.logo}
                          alt={item.name}
                          fill
                          sizes="150px"
                          className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                    ) : item.svgLogo ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: item.svgLogo }}
                        className="w-full flex items-center justify-center"
                      />
                    ) : item.svg ? (
                      item.svg
                    ) : (
                      <span className="font-extrabold text-lg text-slate-700 tracking-tight hover:text-primary transition-colors">
                        {item.name}
                      </span>
                    )}
                  </div>
                );

                if (item.websiteUrl) {
                  return (
                    <a
                      key={item.id ?? index}
                      href={item.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                      title={item.name}
                    >
                      {content}
                    </a>
                  );
                }

                return <div key={item.id ?? index}>{content}</div>;
              })}
            </div>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white text-slate-700 hover:bg-primary hover:text-white hover:border-primary hover:scale-105 transition-all duration-200 shadow-2xs active:scale-95 cursor-pointer"
              aria-label="Previous Slide"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white text-slate-700 hover:bg-primary hover:text-white hover:border-primary hover:scale-105 transition-all duration-200 shadow-2xs active:scale-95 cursor-pointer"
              aria-label="Next Slide"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}