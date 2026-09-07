"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

/**
 * Renders whatever the admin built in Menus → header_main.
 *
 * The old Navbar hard-codes its mega menu, so this sits directly beneath it and
 * only appears once at least one menu item exists. That way the header keeps
 * working if the API is unreachable, and anything added in the admin panel
 * shows up immediately.
 */
export default function AdminMenuBar({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  const menu = Array.isArray(items) ? items.filter((i) => i?.label) : [];

  if (menu.length === 0) return null;

  return (
    <nav
      aria-label="Main menu"
      className="hidden lg:block border-b border-gray-100 bg-white"
      onMouseLeave={() => setOpenIndex(null)}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center gap-1">
          {menu.map((item, index) => {
            const children = Array.isArray(item.children) ? item.children : [];
            const hasChildren = children.length > 0;
            const isOpen = openIndex === index;

            return (
              <li
                key={`${item.label}-${index}`}
                className="relative"
                onMouseEnter={() => setOpenIndex(hasChildren ? index : null)}
              >
                <Link
                  href={item.href || "/"}
                  target={item.newTab ? "_blank" : undefined}
                  rel={item.newTab ? "noopener noreferrer" : undefined}
                  className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold transition-colors ${
                    isOpen ? "text-primary" : "text-gray-700 hover:text-primary"
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: item.badgeColor || "#9f582c" }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {hasChildren && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {hasChildren && isOpen && (
                  <div
                    className={
                      item.isMega
                        ? "absolute left-0 top-full z-50 bg-white border border-gray-100 rounded-b-2xl shadow-xl p-6 min-w-[640px]"
                        : "absolute left-0 top-full z-50 bg-white border border-gray-100 rounded-b-2xl shadow-xl py-2 min-w-[220px]"
                    }
                  >
                    <div
                      className={item.isMega ? "grid gap-x-8 gap-y-4" : ""}
                      style={
                        item.isMega
                          ? {
                              gridTemplateColumns: `repeat(${Math.min(
                                item.columns || 3,
                                6
                              )}, minmax(0, 1fr))`,
                            }
                          : undefined
                      }
                    >
                      {children.map((child, childIndex) => (
                        <ChildLink
                          key={`${child.label}-${childIndex}`}
                          child={child}
                          isMega={item.isMega}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function ChildLink({ child, isMega }) {
  const grandChildren = Array.isArray(child.children) ? child.children : [];

  // Inside a mega menu a child with its own children becomes a column heading.
  if (isMega && grandChildren.length > 0) {
    return (
      <div>
        <Link
          href={child.href || "/"}
          className="block text-xs font-bold uppercase tracking-wider text-gray-900 hover:text-primary mb-2"
        >
          {child.label}
        </Link>
        <ul className="space-y-1.5">
          {grandChildren.map((leaf, i) => (
            <li key={`${leaf.label}-${i}`}>
              <Link
                href={leaf.href || "/"}
                className="text-xs text-gray-600 hover:text-primary transition-colors"
              >
                {leaf.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <Link
      href={child.href || "/"}
      className={
        isMega
          ? "flex items-center gap-3 group rounded-lg hover:bg-gray-50 p-2 transition-colors"
          : "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
      }
    >
      {isMega && child.image && (
        <span className="relative w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          <Image
            src={child.image}
            alt={child.label}
            fill
            sizes="44px"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </span>
      )}
      <span className="min-w-0">
        <span className="block text-xs font-semibold text-gray-800 group-hover:text-primary">
          {child.label}
        </span>
        {isMega && child.description && (
          <span className="block text-[11px] text-gray-400 truncate">
            {child.description}
          </span>
        )}
      </span>
    </Link>
  );
}
