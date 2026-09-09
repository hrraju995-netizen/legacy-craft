"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, BookOpen, Clock } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blogs";

const LatestInsightsSection = () => {
  const insightsData = BLOG_POSTS.slice(0, 3);

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
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

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary hover:text-black transition-colors shrink-0 group ml-4.5 sm:ml-0"
          >
            <span>View All Insights & Articles</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insightsData.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-2xl hover:border-primary/35 hover:-translate-y-2 transition-all duration-500 ease-out"
            >
              {/* Image Container with Zoom Effect */}
              <Link
                href={`/blog/${item.slug}`}
                className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-100 block"
              >
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
              </Link>

              {/* Card Content */}
              <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                <div>
                  {/* Meta: Published Date & Read Time */}
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                      <span>{item.date}</span>
                    </div>
                    {item.readTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.readTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary line-clamp-2 leading-snug transition-colors duration-300">
                    <Link href={`/blog/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-xs sm:text-sm text-gray-500 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="mt-6 pt-2">
                  <Link
                    href={`/blog/${item.slug}`}
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