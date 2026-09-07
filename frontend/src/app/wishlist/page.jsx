"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingCart, Heart, ArrowLeft, ShoppingBag, Zap } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "react-toastify";
import { IoBag } from "react-icons/io5";
import { formatTk } from "@/config/site";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // The store normalises the shape, so the item can be passed through as-is.
  const handleAddToCart = (product) => {
    addToCart(product);

    toast.success("Successfully added to cart!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleMoveAllToBag = () => {
    wishlist.forEach((product) => {
      handleAddToCart(product);
      toggleWishlist(product);
    });
    toast.success("All items moved to bag!", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    router.push("/cart");
  };

  if (!isMounted) return null;

  return (
    <div className="bg-white min-h-screen py-12 sm:py-16">
      <div className="container px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-8 bg-primary rounded-full shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                My Wishlist
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 ml-4.5 font-normal">
              You have {wishlist.length} {wishlist.length === 1 ? "item" : "items"} in your wishlist
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={handleMoveAllToBag}
              className="inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-2xl transition-all duration-300 shadow-sm active:scale-95 cursor-pointer shrink-0"
            >
              <ShoppingBag className="w-4 h-4" /> Move All to Bag
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 bg-white">
            <div className="w-24 h-24 bg-gray-50 text-gray-900 rounded-3xl flex items-center justify-center mb-6 border border-gray-100 shadow-sm">
              <Heart className="w-12 h-12 stroke-[1.5]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Your Wishlist is Empty!
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mb-8 max-w-sm leading-relaxed">
              Save your favorite products here by clicking the wishlist button.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-black text-white hover:bg-gray-800 px-7 py-3.5 rounded-2xl font-semibold transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Explore Products
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 sm:p-5 flex flex-col justify-between border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 group"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative w-full h-44 sm:h-52 bg-gray-50 rounded-2xl overflow-hidden mb-4 border border-gray-100">
                    <Image
                      src={item.image}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="absolute top-2.5 right-2.5 p-2 bg-white/90 backdrop-blur-sm rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-xs"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Info */}
                  <Link href={item.link || "/products"} className="cursor-pointer">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 hover:text-primary line-clamp-1 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  {item.subtitle && (
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                      {item.subtitle}
                    </p>
                  )}
                  <p className="text-sm sm:text-base font-black text-gray-900 mt-2">
                    {formatTk(item.price)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex flex-col gap-2.5">
                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold py-3 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>

                  {/* Buy Now Button */}
                  <button
                    onClick={() => handleBuyNow(item)}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white hover:opacity-90 text-xs sm:text-sm font-semibold py-3 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xs"
                  >
                    <IoBag  className="w-4 h-4 fill-current text-white" /> Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}