import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, FileText, ArrowLeft } from "lucide-react";

async function getPageData(slug) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.lookstudiobd.com/api/v1";
    const res = await fetch(`${apiUrl}/pages/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching dynamic page:", err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const page = await getPageData(slug);

    if (!page) {
      return {
        title: "Page Not Found",
      };
    }

    return {
      title: `${page.meta?.title || page.title} | Legacy Craft Studio`,
      description: page.meta?.description || page.excerpt,
    };
  } catch {
    return {
      title: "Page Not Found",
    };
  }
}

export default async function DynamicCmsPage({ params }) {
  const { slug } = await params;
  const page = await getPageData(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="bg-[#faf8f5] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8">
          <Link href="/" className="hover:text-stone-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-medium">{page.title}</span>
        </nav>

        {/* Content Card */}
        <article className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-stone-200/80">
          <header className="border-b border-stone-100 pb-8 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold mb-3">
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span>Official Policy & Information</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              {page.title}
            </h1>
            {page.excerpt && (
              <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
                {page.excerpt}
              </p>
            )}
          </header>

          {/* Body Content */}
          <div
            className="prose prose-stone max-w-none text-stone-700 text-sm sm:text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: page.content || "<p>Content coming soon.</p>" }}
          />

          {/* Footer of the article */}
          <div className="mt-12 pt-8 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
            >
              <span>Have questions? Contact Support</span>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
