import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Takes a real trail instead of the previous hard-coded "Rooms > Storage"
 * placeholder. Last entry renders as plain text.
 */
const CategoryBreadcrumb = ({ trail = [] }) => {
  const items = [{ label: "Home", href: "/" }, ...trail];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 py-2 mb-4 flex-wrap">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {isLast || !item.href ? (
              <span className="font-medium text-gray-900">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-black transition-colors">
                {item.label}
              </Link>
            )}
            {!isLast && <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default CategoryBreadcrumb;
