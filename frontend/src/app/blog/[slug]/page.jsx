import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Share2,
  Bookmark,
  CheckCircle2,
  Lightbulb,
  Quote,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { getBlogPostBySlug, getRelatedBlogPosts, getAllBlogPosts } from "@/lib/blogs";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Article Not Found | Look Studio BD" };
  }

  const title = `${post.title} — Look Studio BD`;
  const description = post.excerpt;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author?.name],
      images: post.image ? [{ url: post.image, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedBlogPosts(post.slug, 3);

  return (
    <article className="bg-[#faf8f5] min-h-screen pb-16">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200/80 py-4 sticky top-16 md:top-20 z-20 backdrop-blur-md bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto scrollbar-none py-0.5">
              <Link href="/" className="hover:text-primary transition-colors shrink-0">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <Link href="/blog" className="hover:text-primary transition-colors shrink-0">
                Blog
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-[320px]">
                {post.title}
              </span>
            </nav>

            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-black transition-colors shrink-0 ml-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Articles</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Article Header & Title */}
      <header className="pt-10 pb-8 sm:pt-14 sm:pb-10 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="px-3.5 py-1 text-xs font-bold tracking-wider text-primary bg-primary/10 rounded-full uppercase">
              {post.category}
            </span>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.banglaTitle && (
            <p className="mt-3 text-sm sm:text-base font-semibold text-primary/90">
              {post.banglaTitle}
            </p>
          )}

          {/* Author & Meta Row */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
              <div>
                <p className="text-sm font-bold text-gray-900">{post.author.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{post.author.role}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `${siteConfig.url}/blog/${post.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors text-gray-600 bg-white shadow-2xs"
                title="Share on Facebook"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl mt-8">
        <div className="relative h-72 sm:h-[420px] lg:h-[480px] w-full rounded-3xl overflow-hidden shadow-md bg-gray-100">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Main Reading Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mt-10 sm:mt-12">
        {/* Article Excerpt Callout */}
        <div className="p-5 sm:p-6 bg-amber-50/60 border-l-4 border-primary rounded-2xl mb-10 text-gray-700 text-sm sm:text-base leading-relaxed font-medium">
          {post.excerpt}
        </div>

        {/* Structured Body Content */}
        <div className="space-y-8 text-gray-800 text-base leading-relaxed">
          {post.content?.map((block, idx) => {
            if (block.type === "heading") {
              return (
                <h2
                  key={idx}
                  className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight pt-4 border-b border-gray-100 pb-2"
                >
                  {block.text}
                </h2>
              );
            }

            if (block.type === "paragraph") {
              return (
                <p key={idx} className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {block.text}
                </p>
              );
            }

            if (block.type === "tip") {
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 bg-white border border-primary/30 rounded-2xl shadow-xs my-6 relative overflow-hidden"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{block.title}</h4>
                      <p className="mt-1.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {block.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            if (block.type === "quote") {
              return (
                <blockquote
                  key={idx}
                  className="my-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-xs relative"
                >
                  <Quote className="w-8 h-8 text-primary/30 mb-2" />
                  <p className="text-base sm:text-lg italic font-serif text-gray-800 leading-relaxed">
                    {block.text}
                  </p>
                </blockquote>
              );
            }

            if (block.type === "list") {
              return (
                <ul key={idx} className="space-y-3 my-4">
                  {block.items?.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            }

            return null;
          })}
        </div>

        {/* Tags Row */}
        {post.tags?.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-200 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">
              Tags:
            </span>
            {post.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600 shadow-2xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Shop Matching Furniture Callout */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border-2 border-primary/20 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-primary text-white shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-gray-900">
                Inspired by this Article?
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Explore our handcrafted furniture collections tailored to this aesthetic.
              </p>
            </div>
          </div>
          <Link
            href={post.relatedCategorySlug ? `/categories/${post.relatedCategorySlug}` : "/products"}
            className="px-6 py-3 rounded-full bg-primary text-white text-xs sm:text-sm font-bold hover:bg-black transition-colors shrink-0 shadow-sm"
          >
            Explore Matching Products &rarr;
          </Link>
        </div>

        {/* Author Bio Box */}
        <div className="mt-12 p-6 bg-white rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shrink-0"
          />
          <div>
            <h4 className="font-bold text-sm text-gray-900">{post.author.name}</h4>
            <p className="text-xs text-primary font-semibold mt-0.5">{post.author.role}</p>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Specialist at {siteConfig.name}, creating functional, long-lasting interior living solutions for modern homes in Bangladesh.
            </p>
          </div>
        </div>
      </main>

      {/* Related Articles Section */}
      {related.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl mt-20 pt-12 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                More Design Stories
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Continue exploring interior guides and home inspiration.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-black transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs hover:shadow-lg transition-all"
              >
                <Link
                  href={`/blog/${item.slug}`}
                  className="relative h-48 w-full overflow-hidden bg-gray-100 block"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-gray-900 bg-white/95 backdrop-blur-md rounded-md uppercase">
                      {item.category}
                    </span>
                  </div>
                </Link>

                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[11px] text-gray-400 font-medium">{item.date}</span>
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mt-1.5">
                      <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                    </h4>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">{item.readTime}</span>
                    <Link
                      href={`/blog/${item.slug}`}
                      className="text-primary font-bold hover:underline"
                    >
                      Read &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
