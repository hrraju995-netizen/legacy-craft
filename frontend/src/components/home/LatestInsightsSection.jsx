"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?q=80&w=800&auto=format&fit=crop";

const LatestInsightsSection = ({ products = [] }) => {
  const productsData = products;
  const insightsData = useMemo(() => {
    const featuredList = productsData.slice(0, 3);

    return featuredList.map((product, index) => {
      const formattedDate = new Date(
        Date.now() - index * 7 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

      return {
        id: product.id || index + 1,
        category: (product.category || "FURNITURE").toUpperCase(),
        date: formattedDate,
        title: product.name || product.title,
        description:
          product.subtitle ||
          `${product.material || "উচ্চমানের"} উপাদান দিয়ে তৈরি ${
            product.subcategory || product.category
          }। আপনার ঘরের ইন্টেরিয়রকে আরও আকর্ষণীয় ও আরামদায়ক করতে বেছে নিন।`,
        image: product.thumbnail || product.images?.[0] || FALLBACK_IMAGE,
        link: `/products/${product.slug || product.id}`,
      };
    });
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-8 bg-primary rounded-full shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Latest Insights
            </h2>
          </div>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-2xl font-normal ml-4.5">
            Expert advice, design inspiration, and industry trends to help you create your perfect space.
          </p>
        </div>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insightsData.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-2xl hover:border-primary/35 hover:-translate-y-2 transition-all duration-500 ease-out"
            >
              {/* Image Container with Zoom Effect */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
              sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Soft Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                {/* Floating Glassmorphism Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3.5 py-1.5 text-[11px] font-bold tracking-wider text-gray-900 bg-white/90 backdrop-blur-md rounded-lg shadow-sm uppercase group-hover:text-primary transition-colors duration-300">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                <div>
                  {/* Published Date */}
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                    <span>{item.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary line-clamp-2 leading-snug transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-xs sm:text-sm text-gray-500 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="mt-6 pt-2">
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white hover:bg-black text-xs sm:text-sm font-semibold hover:opacity-90 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 cursor-pointer group/btn"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestInsightsSection;