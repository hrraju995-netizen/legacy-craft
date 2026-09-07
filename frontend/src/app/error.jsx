"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-[#faf6f3]">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-amber-100 border border-amber-200">
          <AlertTriangle className="w-8 h-8 text-amber-800" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Something went wrong
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          We hit an unexpected error loading this page. Trying again usually fixes it.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 bg-[#1c1c1c] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-black transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-200 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-50 transition-all"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
