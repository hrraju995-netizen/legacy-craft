"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const classroomCategories = [
  {
    id: 1,
    title: "Chairs",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop",
    link: "/products?q=chair",
  },
  {
    id: 2,
    title: "Bench & Desks",
    image: "https://images.unsplash.com/photo-1519643381401-22c77e60520e?q=80&w=800&auto=format&fit=crop",
    link: "/products?sub=bench-desks",
  },
  {
    id: 3,
    title: "Tables",
    image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?q=80&w=800&auto=format&fit=crop",
    link: "/products?q=table",
  },
  {
    id: 4,
    title: "Boards",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    link: "/products?sub=boards",
  },
];

const ClassroomFurnitureSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-1.5 h-7 bg-primary rounded-full shrink-0" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Classroom Furniture
          </h2>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          
          {/* Image Category Cards */}
          {classroomCategories.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="group relative h-[380px] sm:h-[420px] rounded-2xl overflow-hidden bg-gray-100 shadow-xs hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-1.5 cursor-pointer"
            >
              {/* Image with Smooth Zoom */}
              <Image
                src={item.image}
                alt={item.title}
                fill
              sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Soft Dark Overlay on Hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

              {/* Category Pill Badge */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-auto">
                <span className="px-6 py-2 rounded-full bg-white/95 backdrop-blur-md text-xs sm:text-sm font-semibold text-gray-800 shadow-sm border border-gray-100/80 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300 whitespace-nowrap inline-block">
                  {item.title}
                </span>
              </div>
            </Link>
          ))}

          {/* Shop All Classroom CTA Card */}
          <div className="h-[380px] sm:h-[420px] rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-xl hover:border-gray-300 transition-all duration-500 group">
            
            {/* Top Interactive Circle Arrow */}
            <Link
              href="/categories/classroom-furniture"
              className="w-16 h-16 rounded-full border flex items-center justify-center mb-6 hover:bg-gray-900  bg-primary text-white border-primary hover:scale-110 transition-all duration-300 cursor-pointer shadow-sm"
              aria-label="Shop All Classroom"
            >
              <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Shop All Classroom
            </h3>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-gray-500 mb-8 max-w-[200px] leading-relaxed">
              Equip your school with modern, durable furniture.
            </p>

            {/* Catalog Button */}
            <Link
              href="/products"
              className="w-full max-w-[180px] py-3 px-6 rounded-bl-2xl rounded-tr-2xl border border-gray-300 text-xs sm:text-sm font-medium text-white bg-primary hover:border-black hover:bg-black transition-all duration-300 text-center cursor-pointer shadow-sm"
            >
              View Catalog
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ClassroomFurnitureSection;