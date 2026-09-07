"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Search, Sofa } from "lucide-react";

const NotFound = () => {
  return (
    <div className="h-[70vh] bg-[#faf6f3] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-xl w-full text-center space-y-6">
        
        {/* Highlighted 404 with Furniture Touch */}
        <div className="relative inline-flex items-center justify-center">
          <h1 className="text-8xl sm:text-[140px] font-black text-[#1c1c1c] tracking-tighter leading-none select-none">
            4<span className="text-amber-700/80">0</span>4
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-100/90 border border-amber-300/60 p-3 sm:p-4 rounded-full shadow-md backdrop-blur-sm">
            <Sofa className="w-8 h-8 sm:w-10 sm:h-10 text-amber-900 stroke-[1.75]" />
          </div>
        </div>

        {/* Minimal Text Content */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        {/* Primary Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-200 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#1c1c1c] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-md"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
export default NotFound