"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HeroBannerGrid = ({ products = [], banners = {} }) => {
  const productsData = products;
  const [currentSlide, setCurrentSlide] = useState(0);

  const { slides, sideBanners } = useMemo(() => {
    const customSlidesRaw = banners?.hero_slide || banners?.hero || [];
    const customSlides = customSlidesRaw.map((b) => ({
      badge: b.badge || "SPECIAL OFFER",
      title: b.title || "Handcrafted Furniture Collection",
      description: b.subtitle || "Discover premium handcrafted furniture built for elegance and comfort.",
      image: b.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&fit=crop",
      link: b.link || "/products",
      buttonText: b.buttonText || "Shop Now",
      bgColor: b.bgColor || null,
      textColor: b.textColor || null,
      buttonColor: b.buttonColor || null,
      buttonTextColor: b.buttonTextColor || null,
    }));

    const featuredProducts = productsData.filter((p) => p.discountPercent > 0 || p.isBestSeller);
    const dynamicSlides = (featuredProducts.length >= 2 ? featuredProducts.slice(0, 3) : productsData.slice(0, 3)).map((item) => ({
      badge: item.discountPercent ? `${item.discountPercent}% OFF` : item.isBestSeller ? "BEST SELLER" : "SPECIAL OFFER",
      title: item.name || item.title,
      description: item.subtitle || `${item.material || "উচ্চমানের"} ${item.subcategory || item.category} নিয়ে সাজানো আধুনিক কালেকশন।`,
      image: item.thumbnail || item.images?.[0] || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&fit=crop",
      link: `/products/${item.slug || item.id}`,
      buttonText: "Shop Now",
      bgColor: null,
      textColor: null,
      buttonColor: null,
      buttonTextColor: null,
    }));

    const finalSlides = customSlides.length > 0 ? customSlides : dynamicSlides;

    const customSideTop = (banners?.hero_side_top || [])[0];
    const customSideBottom = (banners?.hero_side_bottom || [])[0];

    const saleItems = productsData.filter((p) => p.discountPercent && p.discountPercent > 0);
    const topSaleItem = saleItems[0] || productsData[1];
    const secondSaleItem = saleItems[1] || productsData[2];

    const dynamicSideBanners = [
      {
        category: customSideTop?.subtitle || customSideTop?.title || topSaleItem?.subcategory || topSaleItem?.category || "Kids Desk",
        discount: customSideTop?.title || customSideTop?.badge || (topSaleItem?.discountPercent ? `UPTO ${topSaleItem.discountPercent}% OFF` : "UPTO 17% OFF"),
        badge: customSideTop?.badge || "SALE",
        image: customSideTop?.image || topSaleItem?.thumbnail || topSaleItem?.images?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&fit=crop",
        link: customSideTop?.link || `/products/${topSaleItem?.slug || topSaleItem?.id}`,
        buttonText: customSideTop?.buttonText || "Shop Now",
        bgColor: customSideTop?.bgColor || null,
        bgImage: customSideTop?.bgImage || null,
        textColor: customSideTop?.textColor || null,
        buttonColor: customSideTop?.buttonColor || null,
        buttonTextColor: customSideTop?.buttonTextColor || null,
      },
      {
        category: customSideBottom?.subtitle || customSideBottom?.title || secondSaleItem?.subcategory || secondSaleItem?.category || "Kitchen Cabinets",
        discount: customSideBottom?.title || customSideBottom?.badge || (secondSaleItem?.discountPercent ? `UPTO ${secondSaleItem.discountPercent}% OFF` : "UPTO 15% OFF"),
        badge: customSideBottom?.badge || "SALE",
        image: customSideBottom?.image || secondSaleItem?.thumbnail || secondSaleItem?.images?.[0] || "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&fit=crop",
        link: customSideBottom?.link || `/products/${secondSaleItem?.slug || secondSaleItem?.id}`,
        buttonText: customSideBottom?.buttonText || "Shop Now",
        bgColor: customSideBottom?.bgColor || null,
        bgImage: customSideBottom?.bgImage || null,
        textColor: customSideBottom?.textColor || null,
        buttonColor: customSideBottom?.buttonColor || null,
        buttonTextColor: customSideBottom?.buttonTextColor || null,
      },
    ];

    return { slides: finalSlides, sideBanners: dynamicSideBanners };
  }, [banners, productsData]);

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="container px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Main Hero Slider */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden min-h-[420px] lg:min-h-[460px] flex items-center bg-[#faf6f3]">
          {slides.map((slide, index) => {
            const isDarkBg = slide.bgColor && (
              slide.bgColor.startsWith('#0') || 
              slide.bgColor.startsWith('#1') || 
              slide.bgColor.startsWith('#2') || 
              slide.bgColor.startsWith('#3')
            );

            return (
              <div
                key={index}
                style={{
                  backgroundColor: slide.bgColor || '#faf6f3',
                }}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex flex-col md:flex-row ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                {/* Left Content Area */}
                <div 
                  style={{
                    background: slide.bgColor 
                      ? `linear-gradient(to right, ${slide.bgColor} 0%, ${slide.bgColor}ee 65%, transparent 100%)`
                      : 'linear-gradient(to right, #faf6f3 0%, #faf6f3f0 65%, transparent 100%)'
                  }}
                  className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center z-10"
                >
                  <span className="text-xs font-bold text-orange-500 tracking-wider uppercase mb-2">
                    {slide.badge}
                  </span>
                  <h1 
                    style={{ color: slide.textColor || (isDarkBg ? '#ffffff' : '#0f172a') }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 leading-tight mb-4 line-clamp-2"
                  >
                    {slide.title}
                  </h1>
                  <p 
                    style={{ color: slide.textColor ? `${slide.textColor}cc` : (isDarkBg ? '#cbd5e1' : '#475569') }}
                    className="text-xs sm:text-sm text-gray-600 mb-8 max-w-sm leading-relaxed line-clamp-2"
                  >
                    {slide.description}
                  </p>
                  <div>
                    <Link
                      href={slide.link}
                      style={{
                        backgroundColor: slide.buttonColor || undefined,
                        color: slide.buttonTextColor || undefined,
                      }}
                      className="inline-flex items-center gap-2 bg-primary text-white text-xs sm:text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      {slide.buttonText || "Shop Now"} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Background Image */}
                <div className="absolute right-0 top-0 w-full md:w-2/3 h-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority={index === 0}
                    className="object-cover object-center"
                  />
                </div>
              </div>
            );
          })}

          {/* Slider Pagination Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx ? "w-7 bg-slate-900" : "w-2 bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Stacked Banners */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          {sideBanners.map((banner, idx) => {
            const hasCustomBg = !!banner.bgColor;
            const hasCustomBgImage = !!banner.bgImage;

            return (
              <Link
                key={idx}
                href={banner.link}
                style={{
                  backgroundColor: banner.bgColor || "#f4f4f4",
                }}
                className="relative flex-1 rounded-3xl p-6 sm:p-8 overflow-hidden flex items-center justify-between min-h-[200px] group cursor-pointer border border-transparent hover:border-gray-200 transition-all shadow-sm hover:shadow-md"
              >
                {/* Optional Full Background Image */}
                {hasCustomBgImage && (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={banner.bgImage}
                      alt={banner.category || "Banner Background"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/20 transition-colors" />
                  </div>
                )}

                {/* Text Info */}
                <div className="z-10 max-w-[60%] relative">
                  <span 
                    style={{ 
                      color: banner.textColor 
                        ? `${banner.textColor}cc` 
                        : (hasCustomBgImage ? "#f1f5f9" : "#4b5563") 
                    }}
                    className="text-xs font-semibold block mb-1"
                  >
                    {banner.category}
                  </span>
                  <h3 
                    style={{ 
                      color: banner.textColor || (hasCustomBgImage ? "#ffffff" : "#0f172a") 
                    }}
                    className="text-xl sm:text-2xl font-extrabold mb-4 leading-tight"
                  >
                    {banner.discount}
                  </h3>
                  <span 
                    style={{ 
                      color: banner.buttonColor || undefined,
                    }}
                    className="text-xs font-bold text-primary underline underline-offset-4 group-hover:opacity-80 transition-opacity inline-block"
                  >
                    {banner.buttonText || "Shop Now"}
                  </span>
                </div>

                {/* Foreground Product Image */}
                {banner.image && (
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex-shrink-0 z-10">
                    <Image
                      src={banner.image}
                      alt={banner.category}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-xs"
                    />
                    {banner.badge && (
                      <span className="absolute bottom-2 right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        {banner.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HeroBannerGrid;