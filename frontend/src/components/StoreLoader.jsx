"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";

export default function StoreLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 rounded-full border-4 border-amber-500/20 border-t-amber-600 animate-spin"></div>
        <div className="relative w-14 h-14 bg-black text-amber-400 rounded-2xl flex items-center justify-center shadow-xl shadow-black/10">
          <ShoppingBag className="w-7 h-7" />
        </div>
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-sm font-bold text-gray-900 tracking-widest uppercase">
          Legacy Craft<span className="text-amber-600">Studio</span>
        </h2>
        <p className="text-xs text-gray-500 mt-2 font-medium tracking-wider uppercase animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}