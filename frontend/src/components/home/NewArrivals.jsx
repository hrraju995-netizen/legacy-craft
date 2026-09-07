"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Zap } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { IoBag } from "react-icons/io5";
import { toast } from "react-toastify";

const ProductCard = ({ item }) => {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(item.thumbnail || item.image);

  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const wishlist = useCartStore((state) => state.wishlist);

  const isWishlisted = wishlist.some((wItem) => wItem.id === item.id);

  const handleCardClick = () => {
    router.push(`/products/${item.slug}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ ...item, image: currentImage });
    toast.success("Successfully added to cart!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(item);
    if (isWishlisted) {
      toast.info("Removed from wishlist!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } else {
      toast.success("Added to wishlist!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart({ ...item, image: currentImage });
    router.push("/checkout");
  };

  return (
    <div
      onClick={handleCardClick}
      className="shrink-0 w-[82vw] max-w-[290px] sm:w-72 snap-center sm:snap-start bg-white border border-gray-200/90 rounded-2xl p-4 flex flex-col justify-between group/card relative transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    >
      {/* Top Badges & Actions */}
      <div className="relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3.5 border border-gray-100 cursor-pointer">
        <span className="absolute top-2.5 left-2.5 z-10 bg-black text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
          New
        </span>

        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition shadow-sm cursor-pointer ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white/90 text-gray-700 hover:bg-white hover:text-red-500 border border-gray-100"
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-3.5 h-3.5 cursor-pointer ${isWishlisted ? "fill-white" : ""}`} />
        </button>

        <Image
          src={currentImage}
          alt={item.name}
          fill
              sizes="(max-width: 640px) 82vw, 288px"
          className="object-cover group-hover/card:scale-105 transition-transform duration-500 ease-out"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight uppercase line-clamp-1 group-hover/card:text-primary transition-colors cursor-pointer">
            {item.name}
          </h3>
          {item.subcategory && (
            <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
              {item.subcategory}
            </p>
          )}
        </div>

        {/* Color/Image Variants */}
        {item.images && item.images.length > 1 && (
          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              Variants
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {item.images.slice(0, 4).map((optImg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImage(optImg);
                  }}
                  className={`relative w-5 h-5 rounded-md border overflow-hidden transition-all cursor-pointer ${
                    currentImage === optImg
                      ? "border-primary ring-1 ring-primary"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={optImg}
                    alt="variant"
                    fill
              sizes="20px"
                    className="object-cover"
                  />
                </button>
              ))}
              {item.images.length > 4 && (
                <span className="text-[10px] text-gray-400 font-medium ml-0.5">
                  +{item.images.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Pricing & Actions */}
        <div className="mt-3.5 pt-3 border-t border-gray-100 flex flex-col gap-2.5">
          <div>
            {item.discountPercent > 0 && (
              <p className="text-[10px] text-gray-400 font-medium leading-none mb-1">
                Save {item.discountPercent}%
              </p>
            )}
            <div className="text-base font-extrabold text-gray-900 leading-none">
              <span className="text-xs font-semibold mr-0.5">৳</span>
              {item.price.toLocaleString()}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-2.5 px-4 rounded-md bg-black text-white text-xs font-semibold hover:bg-primary active:scale-[0.98] transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-white cursor-pointer" />
            <span>Add to Cart</span>
          </button>

          {/* Buy Now Button */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full py-2.5 px-4 rounded-md bg-primary text-white text-xs font-semibold hover:bg-black active:scale-[0.98] transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            aria-label="Buy now"
          >
            <IoBag className="w-3.5 h-3.5 text-white fill-white cursor-pointer" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const NewArrivals = ({ products = [] }) => {
  const scrollRef = useRef(null);
  const productsData = products;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstCard = container.children[0];
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth + 20;
        container.scrollBy({
          left: direction === "left" ? -cardWidth : cardWidth,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-8 bg-primary rounded-full shrink-0" />
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                New Arrivals
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:block">
                Discover our latest designs for modern living space.
              </p>
            </div>
          </div>

          <Link
            href="/products?sort=newest"
            className="px-5 py-2.5 border border-gray-300 text-xs font-semibold text-white bg-black hover:bg-primary hover:border-primary rounded-bl-2xl rounded-tr-2xl transition-all shrink-0 shadow-sm cursor-pointer"
          >
            View All
          </Link>
        </div>

        {/* Slider Area */}
        <div className="relative">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="absolute left-1 sm:-left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full border border-gray-200 bg-white text-gray-800 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-lg active:scale-95 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] cursor-pointer" />
          </button>

          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="absolute right-1 sm:-right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full border border-gray-200 bg-white text-gray-800 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-lg active:scale-95 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] cursor-pointer" />
          </button>

          <div
            ref={scrollRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scrollbar-hide scroll-smooth py-3 px-2 sm:px-1 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {productsData.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;