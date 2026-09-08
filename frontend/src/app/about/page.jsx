import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Headphones, Award, ArrowRight } from "lucide-react";

async function getAboutPageData() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.lookstudiobd.com/api/v1";
    const res = await fetch(`${apiUrl}/pages/about`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const page = await getAboutPageData();

  const title = page?.title || "Crafting Elegance & Comfort For Your Living Spaces";
  const excerpt =
    page?.excerpt ||
    "At Legacy Craft Studio, we believe that furniture is more than just wood and fabric—it is the foundation of your home’s story, style, and everyday comfort.";
  const customContent = page?.content || null;

  return (
    <div className="bg-white min-h-screen">
      <section className="relative py-20 lg:py-28 bg-gray-50/50 border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3.5 py-1.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-4">
              About Legacy Craft Studio
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {excerpt}
            </p>
          </div>
        </div>
      </section>

      {/* Story & Vision Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Image Grid */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden bg-gray-100 shadow-xs">
                <Image
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800"
                  alt="Modern Sofa"
                  fill
              sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden bg-gray-100 shadow-xs mt-8">
                <Image
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800"
                  alt="Minimalist Furniture"
                  fill
              sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary" /> Our Heritage & Vision
              </div>
              {customContent ? (
                <div
                  className="prose prose-stone text-gray-600 text-sm sm:text-base leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: customContent }}
                />
              ) : (
                <>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-snug">
                    Redefining Modern Living With Timeless Craftsmanship
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Founded with a passion for superior interior aesthetics, Legacy Craft Studio brings you handpicked, durable, and sophisticated furniture pieces. Whether you are setting up a cozy apartment or revamping your corporate office, our curated collections blend elegance with unmatched functionality.
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    We prioritize premium materials, ergonomic designs, and sustainable sourcing to ensure every item adds long-lasting value to your lifestyle.
                  </p>
                </>
              )}
              <div className="pt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-7 py-3.5 rounded-2xl font-semibold transition-all shadow-sm text-sm"
                >
                  Explore Collection <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us Features */}
      <section className="py-20 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-3">
              Why Choose Legacy Craft Studio?
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              We go above and beyond to guarantee absolute satisfaction for your home decor needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center border border-gray-100">
                <Award className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Premium Quality</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Crafted from certified premium wood and top-grade fabrics built to withstand generations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center border border-gray-100">
                <Truck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Safe Home Delivery</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Reliable shipping and expert installation right inside your doorstep across the country.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center border border-gray-100">
                <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Warranty Protection</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Enjoy peace of mind with our extended structural warranty and customer support.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center border border-gray-100">
                <Headphones className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Dedicated Support</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Our interior design consultants are ready to assist you in choosing the best pieces.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black text-white rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-xl">
            <div className="max-w-2xl mx-auto space-y-5 relative z-10">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Ready to Transform Your Home?
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Explore our exclusive catalog of modern sofas, luxury beds, sleek dining tables, and stylish workstations.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold transition-all shadow-sm text-sm"
                >
                  Shop Furniture Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}