"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  Truck,
  Heart,
  FileText,
  Ruler,
  Maximize2,
  Star,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import ProductGrid from "@/components/category/ProductGrid";
import { formatTk, SHIPPING_OPTIONS } from "@/config/site";

export default function ProductDetails({ product, related = [] }) {
  // NOTE: hooks must run unconditionally — the old version returned early
  // above them, which broke the Rules of Hooks. The server page now 404s
  // for unknown slugs, so `product` is always present here.
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const wishlist = useCartStore((state) => state.wishlist);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0]?.name || ""
  );

  // Modals & Drawers State
  const [isAllMediaOpen, setIsAllMediaOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeDrawer, setActiveDrawer] = useState(null);

  const FALLBACK_PRODUCT_IMAGE =
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800";

  // Combine product gallery images + any variant images without duplicates
  const rawBaseImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail || FALLBACK_PRODUCT_IMAGE];
  const variantImages = (product.colors || [])
    .map((c) => c.image)
    .filter((img) => typeof img === "string" && img.trim() !== "");

  const filteredImages = Array.from(
    new Set([...rawBaseImages, ...variantImages])
  ).filter((img) => typeof img === "string" && img.trim() !== "");

  const productImages =
    filteredImages.length > 0 ? filteredImages : [FALLBACK_PRODUCT_IMAGE];

  // Find the active variant based on selectedColor
  const activeColorObj =
    (product.colors || []).find((c) => c.name === selectedColor) ||
    product.colors?.[0] ||
    null;

  const activePrice = activeColorObj?.price ?? product.price;
  const activeOriginalPrice =
    activeColorObj?.originalPrice !== undefined && activeColorObj?.originalPrice !== null
      ? activeColorObj.originalPrice
      : product.originalPrice;
  const activeDiscountPercent =
    activeColorObj?.discountPercent !== undefined && activeColorObj?.discountPercent > 0
      ? activeColorObj.discountPercent
      : product.discountPercent;
  const isAvailable =
    activeColorObj?.inStock !== undefined ? activeColorObj.inStock : product.inStock;

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  // Reset gallery + colour whenever a different product is rendered.
  useEffect(() => {
    const firstColor = product.colors?.[0];
    setSelectedColor(firstColor?.name || "");
    setQuantity(1);

    if (firstColor?.image) {
      const idx = productImages.indexOf(firstColor.image);
      setSelectedImageIndex(idx !== -1 ? idx : 0);
    } else {
      setSelectedImageIndex(0);
    }
  }, [product]);

  const handleColorSelect = (color) => {
    setSelectedColor(color.name);
    if (color.image) {
      const idx = productImages.indexOf(color.image);
      if (idx !== -1) {
        setSelectedImageIndex(idx);
      }
    }
  };

  const cartPayload = () => ({
    ...product,
    productId: Number(product.id),
    id: activeColorObj?.variantId
      ? `${product.id}-v${activeColorObj.variantId}`
      : product.id,
    variantId: activeColorObj?.variantId,
    price: activePrice,
    originalPrice: activeOriginalPrice,
    image:
      activeColorObj?.image ||
      productImages[selectedImageIndex] ||
      product.thumbnail,
    subtitle: selectedColor
      ? `Color: ${selectedColor}`
      : (product.subcategory || product.material),
  });

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(cartPayload(), quantity);
    toast.success(`${product.name} added to cart`, { position: "bottom-right" });
  };

  const handleBuyNow = () => {
    if (!isAvailable) return;
    addToCart(cartPayload(), quantity);
    router.push("/checkout");
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    toast.info(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
      position: "bottom-right",
    });
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setSelectedImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    );
  };

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12 text-gray-900 font-sans">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Dynamic Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:underline">Home</Link> /
          <Link href={`/categories/${product.categorySlug}`} className="hover:underline">
            {product.category}
          </Link> /
          <Link
            href={`/categories/${product.categorySlug}?sub=${product.subcategorySlug}`}
            className="hover:underline"
          >
            {product.subcategory}
          </Link> /
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Dynamic Gallery Section */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto shrink-0 max-h-[520px]">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? "border-black shadow-sm scale-105"
                      : "border-gray-200 hover:border-gray-400 opacity-70"
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill
              sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image Banner */}
            <div
              onClick={() => setIsAllMediaOpen(true)}
              className="relative flex-1 h-[420px] sm:h-[520px] bg-gray-100 rounded-3xl overflow-hidden group cursor-zoom-in border border-gray-100"
            >
              <Image
                src={productImages[selectedImageIndex]}
                alt={product.name}
                fill
              sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {productImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAllMediaOpen(true);
                }}
                className="absolute bottom-4 right-4 bg-black/75 hover:bg-black text-white text-xs px-3.5 py-2 rounded-full flex items-center gap-2 font-medium backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-105"
              >
                <Maximize2 className="w-3.5 h-3.5" /> All media ({productImages.length})
              </button>
            </div>
          </div>

          {/* Right: Dynamic Product Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
                  {product.roomType}
                </span>
                {product.isBestSeller && (
                  <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-semibold">
                    Best Seller
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold text-gray-900 ml-1">
                    {product.rating}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Dynamic Price */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Tk {activePrice?.toLocaleString()}
                </span>
                {activeOriginalPrice && activeOriginalPrice > activePrice && (
                  <span className="text-sm text-gray-400 line-through">
                    Tk {activeOriginalPrice?.toLocaleString()}
                  </span>
                )}
                {activeDiscountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {activeDiscountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                VAT, TAX, Delivery calculated at checkout
              </p>

              {/* Short Description */}
              {product.shortDescription && (
                <div className="mt-3.5 p-3.5 bg-stone-50/80 rounded-xl border border-stone-200/60 text-sm text-gray-700 leading-relaxed">
                  {product.shortDescription}
                </div>
              )}
            </div>

            {/* Dynamic Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-600">
                  Color: <span className="text-gray-900 font-bold">{selectedColor}</span>
                  {activeColorObj?.price && activeColorObj.price !== product.price && (
                    <span className="ml-2 text-xs font-bold text-primary">
                      (Tk {activeColorObj.price.toLocaleString()})
                    </span>
                  )}
                </span>
                <div className="flex gap-3">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleColorSelect(color)}
                      title={`${color.name}${color.price ? ` - Tk ${color.price.toLocaleString()}` : ""}`}
                      className={`w-9 h-9 rounded-lg border-2 transition-all p-0.5 cursor-pointer ${
                        selectedColor === color.name
                          ? "border-black scale-110 shadow-sm"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div
                        className="w-full h-full rounded"
                        style={{ backgroundColor: color.code }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="pt-2 border-t border-gray-100">
              <p className={`text-xs font-bold flex items-center gap-1.5 ${
                isAvailable ? "text-emerald-600" : "text-rose-600"
              }`}>
                {isAvailable ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> Available to Order
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" /> Out of Stock
                  </>
                )}
              </p>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-600">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to cart
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!isAvailable}
                  className="w-full bg-primary hover:opacity-90 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-full flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" /> Buy it now
                </button>
                <button
                  type="button"
                  onClick={handleWishlist}
                  className={`w-full border font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isWishlisted
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                  {isWishlisted ? "Saved to wishlist" : "Add to wishlist"}
                </button>
              </div>
            </div>

            {/* Drawer Triggers */}
            <div className="space-y-2.5 pt-4 border-t border-gray-100">
              <button
                onClick={() => setActiveDrawer("details")}
                className="w-full p-4 border border-gray-200 rounded-2xl flex items-center justify-between hover:border-gray-400 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-bold text-gray-900">Product Details & Specs</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveDrawer("measurements")}
                className="w-full p-4 border border-gray-200 rounded-2xl flex items-center justify-between hover:border-gray-400 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Ruler className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-bold text-gray-900">Dimensions</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveDrawer("shipping")}
                className="w-full p-4 border border-gray-200 rounded-2xl flex items-center justify-between hover:border-gray-400 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-bold text-gray-900">Shipping & Delivery</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- DYNAMIC 2-COLUMN ALL MEDIA GRID POPUP ----------------- */}
      {isAllMediaOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div
            className="absolute inset-0"
            onClick={() => setIsAllMediaOpen(false)}
          />

          <div className="relative z-10 bg-white w-full max-w-4xl max-h-[85vh] sm:max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="relative pt-6 pb-3 px-6 text-center border-b border-gray-100 shrink-0">
              <div className="inline-block relative">
                <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
                  All media
                </h2>
                <span className="absolute -bottom-3 left-0 w-full h-[2px] bg-gray-900 rounded-full" />
              </div>

              <button
                onClick={() => setIsAllMediaOpen(false)}
                className="absolute right-5 top-5 p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dynamic 2-Column Scrollable Image Grid */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {productImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewImage(img)}
                    className="relative aspect-4/3 sm:aspect-square bg-gray-50 rounded-xl overflow-hidden cursor-pointer group hover:opacity-95 transition-all"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
              sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Preview */}
      {previewImage && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-5 right-5 text-white bg-white/20 p-2 rounded-full hover:bg-white/40 cursor-pointer z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={previewImage}
              alt="Expanded Preview"
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Dynamic Slide-in Drawer */}
      <div
        onClick={() => setActiveDrawer(null)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 z-40 ${
          activeDrawer ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          activeDrawer ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 capitalize">
            {activeDrawer === "details" && "Product Specifications"}
            {activeDrawer === "measurements" && "Dimensions"}
            {activeDrawer === "shipping" && "Shipping & Delivery"}
          </h2>
          <button
            onClick={() => setActiveDrawer(null)}
            className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-700 leading-relaxed">
          {activeDrawer === "details" && (
            <div className="space-y-4">
              {product.shortDescription && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Short Description</h3>
                  <p className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-gray-700 leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>
              )}
              {product.description && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Detailed Description</h3>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 whitespace-pre-line leading-relaxed">
                    {product.description}
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Material</h3>
                <p className="bg-gray-50 p-3 rounded-lg border border-gray-100">{product.material || "Standard"}</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Tags / Features</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags?.map((tag, i) => (
                    <span key={i} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeDrawer === "measurements" && (
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Dimensions Breakdown</h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 font-mono text-xs">
                <p><span className="font-bold">Width:</span> {product.dimensions?.width}</p>
                <p><span className="font-bold">Length:</span> {product.dimensions?.length}</p>
                <p><span className="font-bold">Height:</span> {product.dimensions?.height}</p>
              </div>
            </div>
          )}

          {activeDrawer === "shipping" && (
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900">Delivery Information</h3>
              {SHIPPING_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-3"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{option.label}</p>
                    <p className="text-xs text-gray-500">{option.note}</p>
                  </div>
                  <span className="font-bold text-gray-900">
                    {formatTk(option.cost)}
                  </span>
                </div>
              ))}
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <Truck className="w-4 h-4 shrink-0" />
                Free delivery on orders over {formatTk(50000)}.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Product Description Section */}
      {(product.description || product.shortDescription) && (
        <section className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-14 pt-10 border-t border-gray-100">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1.5 h-7 bg-primary rounded-full shrink-0" />
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Product Overview & Description
              </h2>
            </div>
            <div className="bg-stone-50/70 p-6 sm:p-8 rounded-2xl border border-stone-200/70 shadow-xs space-y-4">
              {product.shortDescription && (
                <p className="text-base sm:text-lg font-medium text-gray-800 leading-relaxed border-b border-stone-200/70 pb-4">
                  {product.shortDescription}
                </p>
              )}
              {product.description && (
                <div className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Related products — keeps people inside the catalogue */}
      {related.length > 0 && (
        <section className="container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-16 pt-10 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-8 bg-primary rounded-full shrink-0" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                You may also like
              </h2>
            </div>
            <Link
              href={`/categories/${product.categorySlug}`}
              className="text-xs font-semibold text-gray-600 hover:text-primary transition-colors shrink-0"
            >
              View all
            </Link>
          </div>
          <ProductGrid products={related} showCount={false} showBanner={false} />
        </section>
      )}
    </div>
  );
}