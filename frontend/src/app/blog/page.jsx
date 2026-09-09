import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, BookOpen, Search, Sparkles, ChevronRight } from "lucide-react";
import { getAllBlogPosts, getBlogCategories } from "@/lib/blogs";
import { getArticles } from "@/lib/api";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

export const metadata = {
  title: "Blog & Design Insights — Handcrafted Furniture Ideas",
  description:
    "Explore expert interior design advice, modular kitchen planning guides, ergonomic workspace setups, and home living trends.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog & Design Insights — Look Studio BD",
    description:
      "Explore expert interior design advice, modular kitchen planning guides, ergonomic workspace setups, and home living trends.",
    url: `${siteConfig.url}/blog`,
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const apiArticles = await getArticles().catch(() => []);
  const fallbackPosts = getAllBlogPosts();
  const posts = apiArticles.length > 0 ? apiArticles : fallbackPosts;
  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
  const featured = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200/80 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-gray-900">Blog & Insights</span>
          </nav>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-white via-white to-transparent pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Living Space Inspiration & Guides</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Latest Insights & Design Stories
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Expert advice, design inspiration, and industry trends to help you create your perfect space. Explore guides on ergonomics, space-saving layouts, and durable craftsmanship.
          </p>

          {/* Category Pill Filters */}
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            <span className="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-xs">
              All Stories ({posts.length})
            </span>
            {categories.map((cat, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-full bg-white border border-gray-200 hover:border-primary/50 text-gray-700 text-xs font-semibold shadow-2xs transition-colors cursor-default"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 max-w-7xl">
        {/* Featured Post Card (Hero Spotlight) */}
        {featured && (
          <section className="mb-14">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Featured Story</span>
            </div>
            <article className="group relative bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Image Column */}
              <Link
                href={`/blog/${featured.slug}`}
                className="relative lg:col-span-7 h-72 sm:h-96 lg:h-auto min-h-[320px] overflow-hidden block"
              >
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                <div className="absolute top-5 left-5 z-10">
                  <span className="px-3.5 py-1.5 text-xs font-bold tracking-wider text-gray-900 bg-white/95 backdrop-blur-md rounded-lg shadow-sm uppercase">
                    {featured.category}
                  </span>
                </div>
              </Link>

              {/* Text Column */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{featured.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{featured.readTime}</span>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">
                    <Link href={`/blog/${featured.slug}`}>
                      {featured.title}
                    </Link>
                  </h2>

                  {featured.banglaTitle && (
                    <p className="mt-2 text-xs font-medium text-primary">
                      {featured.banglaTitle}
                    </p>
                  )}

                  <p className="mt-4 text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={featured.author.avatar}
                      alt={featured.author.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900">{featured.author.name}</p>
                      <p className="text-[11px] text-gray-500">{featured.author.role}</p>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featured.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-black transition-colors shadow-sm"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* All Articles Grid */}
        <section>
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-200">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              <span>All Design Stories & Guides</span>
            </h2>
            <span className="text-xs font-semibold text-gray-500">
              Showing {posts.length} articles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-500"
              >
                {/* Image */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative h-60 sm:h-64 w-full overflow-hidden bg-gray-100 block"
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 text-[11px] font-bold tracking-wider text-gray-900 bg-white/95 backdrop-blur-md rounded-md shadow-xs uppercase">
                      {post.category}
                    </span>
                  </div>
                </Link>

                {/* Body */}
                <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs font-semibold text-gray-400 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="mt-3 text-xs sm:text-sm text-gray-500 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Footer CTA */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full object-cover border border-gray-200"
                      />
                      <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
                        {post.author.name.split(" ")[1] || post.author.name}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-black transition-colors group/btn"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Interior Consultation Banner */}
        <section className="mt-16 rounded-3xl bg-primary text-white p-8 sm:p-12 relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block text-xs font-bold tracking-wider uppercase bg-white/15 px-3 py-1 rounded-full mb-3">
              Need Personalized Interior Advice?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Book a Free Design Consultation with Our Architects
            </h2>
            <p className="mt-3 text-sm text-white/90 leading-relaxed">
              Whether you are furnishing a new apartment or redesigning your kitchen and workspace, our team provides 3D layouts, material recommendations, and customized sizing.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full bg-white text-primary font-bold text-xs sm:text-sm hover:bg-black hover:text-white transition-all duration-300 shadow-md"
              >
                Schedule Free Meeting
              </Link>
              <Link
                href="/products"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-colors border border-white/20"
              >
                Browse All Furniture
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
