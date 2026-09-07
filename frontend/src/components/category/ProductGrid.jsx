"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ShoppingBag, Heart, Eye, Star, Truck } from "lucide-react";
import { IoBag } from "react-icons/io5";
import { useCartStore } from "@/store/useCartStore"; 

import { FALLBACK_IMAGE } from "@/lib/catalog";

const ProductCard = ({ product }) => {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const wishlist = useCartStore((state) => state.wishlist);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const wishlisted = wishlist ? wishlist.some((item) => item.id === product.id) : false;
  
  const initialImage =
    product.thumbnail ||
    (Array.isArray(product.images) && product.images[0]) ||
    product.image ||
    FALLBACK_IMAGE;

  const [imgSrc, setImgSrc] = useState(initialImage);
  const price = product.price ?? 0;
  const originalPrice = product.originalPrice || product.oldPrice || null;

  let discountPercent = product.discountPercent || 0;
  if (!discountPercent && originalPrice && originalPrice > price) {
    discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  const isSale = discountPercent > 0 || product.sale;
  const productName = product.name || product.title || "Product Name";
  const subText = product.subcategory || product.subtitle || product.material || "Furniture";
  const isOutOfStock = product.inStock === false || product.stock === 0;

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    router.push("/checkout");
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    toast.success(`${productName} added to cart`, { position: "bottom-right" });
  };

  return (
    <div className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col justify-between h-full">
      <div className="flex flex-col h-full justify-between">
        {/* Image Container */}
        <div className="relative w-full aspect-[4/5] bg-gray-50 overflow-hidden cursor-pointer shrink-0">
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start max-w-[80%]">
            {isSale && (
              <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wider shadow-sm select-none">
                {discountPercent > 0 ? `${discountPercent}% OFF` : "Sale"}
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-amber-500 text-black text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full uppercase tracking-wider shadow-sm select-none">
                Best Seller
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-gray-900/90 text-white text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full uppercase tracking-wider shadow-sm select-none">
                Stock Out
              </span>
            )}
          </div>

          {/* Quick Action Floating Buttons (Wishlist & View) */}
          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md transition shadow-md cursor-pointer ${
                wishlisted
                  ? "bg-red-500 text-white"
                  : "bg-white/90 text-gray-700 hover:bg-white hover:text-red-500"
              }`}
              aria-label="Wishlist"
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            </button>
            <Link
              href={`/products/${product.slug || product.id}`}
              className="p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-md text-gray-700 hover:bg-white hover:text-black transition shadow-md cursor-pointer"
              aria-label="Quick View"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          {/* Product Image */}
          <Link href={`/products/${product.slug || product.id}`} className="block w-full h-full">
            <Image
              src={imgSrc}
              alt={productName}
              fill
              onError={() => setImgSrc(FALLBACK_IMAGE)}
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Desktop Hover Action Overlay Buttons (Dynamic Add to Cart & Buy Now) */}
          <div className="hidden md:flex absolute bottom-3 left-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex-col gap-1.5">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="w-full bg-black text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className="w-full bg-amber-500 text-black text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-amber-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-md cursor-pointer"
            >
              <IoBag className="w-3.5 h-3.5 fill-current" />
              Buy Now
            </button>
          </div>
        </div>

        {/* Product Details Content */}
        <div className="p-3 sm:p-4 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex items-center gap-1 mb-1 text-amber-500">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 stroke-amber-400" />
              <span className="text-[11px] sm:text-xs font-bold text-gray-800">
                {product.rating ?? "4.5"}
              </span>
              {product.reviewCount && (
                <span className="text-[10px] text-gray-400 font-medium">
                  ({product.reviewCount})
                </span>
              )}
            </div>

            <Link href={`/products/${product.slug || product.id}`}>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight line-clamp-1 group-hover:text-sky-700 transition-colors">
                {productName}
              </h3>
            </Link>

            <p className="text-[10px] sm:text-[11px] text-gray-500 mt-0.5 line-clamp-1">
              {subText}
            </p>
          </div>

          {/* Price & Mobile Quick Action */}
          <div className="mt-2.5 pt-2 border-t border-gray-50 flex items-center justify-between">
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                ৳{price.toLocaleString()}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through font-normal">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Mobile Touch-Friendly Cart Button */}
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="md:hidden p-1.5 bg-black text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition cursor-pointer"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Color Swatches */}
      {product.colors && product.colors.length > 0 && (
        <div className="px-3 sm:px-4 pb-3 pt-0 flex items-center gap-1.5 overflow-hidden">
          {product.colors.slice(0, 4).map((c, idx) => {
            const colorCode = typeof c === "string" ? c : c.code;
            const colorName = typeof c === "string" ? `Color ${idx + 1}` : c.name;
            return (
              <span
                key={idx}
                title={colorName}
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-gray-300 shadow-inner hover:scale-110 transition-transform shrink-0"
                style={{ backgroundColor: colorCode }}
              />
            );
          })}
          {product.colors.length > 4 && (
            <span className="text-[9px] text-gray-400 font-medium">
              +{product.colors.length - 4}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const ProductGrid = ({ products = [], showCount = true, showBanner = true }) => {
  return (
    <div className="flex-1 w-full">
      {showCount && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-gray-500">
            Showing <span className="font-bold text-gray-900">{products.length}</span> products
          </p>
        </div>
      )}

      {products.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-sm font-medium text-gray-500">
            No products found matching your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {products.map((product, index) => {
            const isThirdItem = showBanner && index === 2 && products.length > 3;

            return (
              <React.Fragment key={product.id || product.slug || index}>
                <ProductCard product={product} />

                {/* Promotional Banner */}
                {isThirdItem && (
                  <div className="col-span-2 sm:col-span-2 md:col-span-1 flex flex-col items-center justify-center p-5 sm:p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl text-center shadow-md min-h-[260px]">
                    <div className="p-2.5 sm:p-3 bg-white/10 rounded-full mb-3 backdrop-blur-md">
                      <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" />
                    </div>
                    <h4 className="text-sm sm:text-base font-bold mb-1">Free Delivery</h4>
                    <p className="text-[11px] sm:text-xs text-gray-300 mb-4 max-w-[200px]">
                      On all orders over ৳50,000 across Bangladesh
                    </p>
                    <Link
                      href="/about"
                      className="text-xs font-semibold bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    >
                      Learn More
                    </Link>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;