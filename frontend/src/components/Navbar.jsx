"use client";
import React, { useState, useRef, useEffect } from "react";
import {
    Search, User, Heart, ShoppingBag, ChevronLeft, ChevronRight, ChevronDown, Menu, X,
    Home, Layers, Tag, Lightbulb, LifeBuoy, ChevronRight as ArrowRight,
    Sparkles, ShieldCheck, Truck, Headphones, Box, Percent
} from "lucide-react";
import Image from "next/image";
import navLogo from "../../public/main-logo.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useCustomerAuthStore } from "@/store/useCustomerAuthStore";

/** Menu entries had href="#" everywhere; they now resolve to real routes. */
const searchHref = (term) => `/products?q=${encodeURIComponent(term)}`;


const Navbar = ({ logo, headerMenu = [], apiCategories = [], apiRooms = [] }) => {
    const router = useRouter();
    const safeApiCategories = Array.isArray(apiCategories) ? apiCategories : [];
    const safeApiRooms = Array.isArray(apiRooms) ? apiRooms : [];
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeCategory, setActiveCategory] = useState("Storage & Organizer");
    const [searchQuery, setSearchQuery] = useState("");

    const defaultNavItems = [
        { label: "Products", key: "products", href: "/products" },
        { label: "Rooms", key: "rooms", href: "/products" },
        { label: "Series", key: "series", href: "/products" },
        { label: "Offers", key: "offers", href: "/products?sort=featured" },
        { label: "Inspiration", key: "inspiration", href: "/products" },
        { label: "Design/Support", key: "design", href: "/contact" },
    ];

    const safeHeaderMenu = Array.isArray(headerMenu) ? headerMenu.filter((i) => i?.label) : [];
    const desktopNavItems = safeHeaderMenu.length > 0
        ? safeHeaderMenu.map((item) => {
            const lowerLabel = (item.label || "").toLowerCase().trim();
            const keyMap = {
                "products": "products",
                "rooms": "rooms",
                "series": "series",
                "offers": "offers",
                "inspiration": "inspiration",
                "design/support": "design",
                "design": "design",
                "support": "design",
            };
            return {
                ...item,
                key: keyMap[lowerLabel] || item.label,
            };
          })
        : defaultNavItems;

    // Mobile drawer states
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileTab, setMobileTab] = useState("menu");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [expandedMenuKey, setExpandedMenuKey] = useState(null);

    const handleCloseMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setSelectedCategory(null);
        setExpandedMenuKey(null);
    };

    const handleSearchSubmit = (e) => {
        e?.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed) {
            handleCloseMobileMenu();
            router.push(`/products?q=${encodeURIComponent(trimmed)}`);
        }
    };

    const scrollContainerRef = useRef(null);

  const cart = useCartStore((state) => state.cart);
  const wishlist = useCartStore((state) => state.wishlist);
  const customer = useCustomerAuthStore((state) => state.customer);
  const token = useCustomerAuthStore((state) => state.token);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isCustomerLoggedIn = isMounted && !!token && !!customer;

    // Counts render as 0 until hydration so server and client HTML match.
    const cartCount = isMounted
        ? cart.reduce((total, item) => total + (item.quantity || 1), 0)
        : 0;
    const wishlistCount = isMounted ? wishlist.length : 0;

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollAmount = clientWidth * 0.6;
            scrollContainerRef.current.scrollTo({
                left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: "smooth",
            });
        }
    };

    // Real categories from the admin panel when available, otherwise the
    // original static list so the mega-menu is never empty.
    const fallbackCategories = [
        { name: "Storage & Organizer", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=80&h=80&fit=crop" },
        { name: "Beds & Mattresses", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=80&h=80&fit=crop" },
        { name: "Sofas & Armchairs", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop" },
        { name: "Tables & Desks", image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=80&h=80&fit=crop" },
        { name: "Office Furniture", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=80&h=80&fit=crop" },
        { name: "Chairs", image: "https://images.unsplash.com/photo-1580481072645-022f9a6d120a?w=80&h=80&fit=crop" },
        { name: "Outdoor", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=80&h=80&fit=crop" },
        { name: "Classroom Furniture", image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=80&h=80&fit=crop" },
        { name: "Restaurant Furniture", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80&h=80&fit=crop" },
        { name: "Kitchen Essentials", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=80&h=80&fit=crop" },
    ];

    const categories = safeApiCategories.length
        ? safeApiCategories.map((c) => ({
            name: c.title,
            image: c.image || "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=80&h=80&fit=crop",
            slug: c.slug,
            children: (c.children || []).map((ch) => ({
                name: ch.title || ch.name,
                image: ch.image || "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=60&h=60&fit=crop",
                slug: ch.slug
            }))
          }))
        : fallbackCategories;

    const categoryHref = (name) => {
        const match = categories.find((c) => c.name === name);
        return match?.slug ? `/categories/${match.slug}` : searchHref(name);
    };

    const storageItems = [
        [
            { name: "Bookshelves", image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=60&h=60&fit=crop" },
            { name: "Wardrobes & Almirahs", image: "https://images.unsplash.com/photo-1558882224-dda166733046?w=60&h=60&fit=crop" },
            { name: "Steel Almirahs & Cabinets", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=60&h=60&fit=crop" },
            { name: "Chest of Drawers", image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=60&h=60&fit=crop" },
            { name: "Almas", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=60&h=60&fit=crop" }
        ],
        [
            { name: "Dinner Wagons", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=60&h=60&fit=crop" },
            { name: "Oven Racks", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=60&h=60&fit=crop" },
            { name: "Ironing boards", image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=60&h=60&fit=crop" },
            { name: "Kitchen Cabinets & Accessories", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=60&h=60&fit=crop" },
            { name: "TV Cabinets & Stands", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=60&h=60&fit=crop" }
        ],
        [
            { name: "Shoe Racks", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=60&h=60&fit=crop" },
            { name: "Desk Organizers", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=60&h=60&fit=crop" },
            { name: "Multipurpose Shelves", image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=60&h=60&fit=crop" },
            { name: "Wall Mounted Cabinets", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=60&h=60&fit=crop" },
            { name: "Heavy Duty Racks", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=60&h=60&fit=crop" }
        ],
        [
            { name: "Drawer Units", image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=60&h=60&fit=crop" },
            { name: "File Cabinets", image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=60&h=60&fit=crop" },
            { name: "Portable Cabinets", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=60&h=60&fit=crop" },
            { name: "Low Height Cabinets", image: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=60&h=60&fit=crop" },
            { name: "Full Height Cabinets", image: "https://images.unsplash.com/photo-1558882224-dda166733046?w=60&h=60&fit=crop" }
        ],
        [
            { name: "Digital Lockers", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=60&h=60&fit=crop" }
        ],
    ];

    const fallbackRooms = [
        { title: "Bedroom", image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=100&h=70&fit=crop" },
        { title: "Living Room", image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=100&h=70&fit=crop" },
        { title: "Dining Room", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=100&h=70&fit=crop" },
        { title: "Kitchen", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=100&h=70&fit=crop" },
        { title: "Kids Room", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=100&h=70&fit=crop" },
        { title: "Home Office", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=100&h=70&fit=crop" },
        { title: "Executive Office", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&h=70&fit=crop" },
        { title: "Workstation", image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=100&h=70&fit=crop" },
        { title: "Meeting Room", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=70&fit=crop" },
        { title: "Reception", image: "https://images.unsplash.com/photo-1582650625119-3a31f8418b0d?w=100&h=70&fit=crop" },
        { title: "Startup Office", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=100&h=70&fit=crop" },
        { title: "Training Setup", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=100&h=70&fit=crop" },
    ];

    const roomsData = safeApiRooms.length
        ? safeApiRooms.map((r) => {
            const fallback = fallbackRooms.find((fr) => fr.title?.toLowerCase() === (r.title || "").toLowerCase())?.image || "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=300&h=200&fit=crop";
            const isHttp = typeof r.image === "string" && (r.image.startsWith("http") || r.image.startsWith("/"));
            return {
              title: r.title,
              image: isHttp ? r.image : fallback,
              slug: r.slug
            };
          })
        : fallbackRooms;

    const seriesData = [
        { title: "Aynor Collection", items: ["Aynor Bed", "Aynor Wardrobe", "Aynor Dressing Table"] },
        { title: "Nexa Minimalist", items: ["Nexa Sofa", "Nexa Center Table", "Nexa TV Unit"] },
        { title: "Nova Modern", items: ["Nova Dining Set", "Nova Buffet Cabinet", "Nova Sideboard"] },
        { title: "ErgoWork Office", items: ["Ergo Desk", "Ergo Task Chair", "Ergo Filing Cabinet"] },
    ];

    const offersData = [
        {
            title: "Summer Refresh Sale",
            discount: "Up to 40% OFF",
            desc: "Selected living room & outdoor furniture",
            badge: "Hot Deal",
            products: [
                { name: "Modern Leather Sofa", originalPrice: "৳45,000", offerPrice: "৳27,000", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&h=120&fit=crop" },
                { name: "Outdoor Patio Chair Set", originalPrice: "৳18,000", offerPrice: "৳11,500", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120&h=120&fit=crop" },
                { name: "Wooden Coffee Table", originalPrice: "৳12,000", offerPrice: "৳7,800", image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=120&h=120&fit=crop" }
            ]
        },
        {
            title: "Bedroom Bundle Savings",
            discount: "Save 15%",
            desc: "Buy Bedroom Set & Get Free Mattress",
            badge: "Exclusive",
            products: [
                { name: "Aynor King Size Bed", originalPrice: "৳55,000", offerPrice: "৳46,750", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=120&h=120&fit=crop" },
                { name: "Orthopedic Foam Mattress", originalPrice: "৳15,000", offerPrice: "FREE", image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=120&h=120&fit=crop" },
                { name: "3-Door Wooden Wardrobe", originalPrice: "৳38,000", offerPrice: "৳32,300", image: "https://images.unsplash.com/photo-1558882224-dda166733046?w=120&h=120&fit=crop" }
            ]
        },
        {
            title: "Clearance Stock",
            discount: "Flat 50% OFF",
            desc: "Last few items remaining in warehouse",
            badge: "Limited",
            products: [
                { name: "Ergonomic Office Chair", originalPrice: "৳16,000", offerPrice: "৳8,000", image: "https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=120&h=120&fit=crop" },
                { name: "Wall Mounted Bookshelf", originalPrice: "৳8,500", offerPrice: "৳4,250", image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=120&h=120&fit=crop" },
                { name: "Compact Shoe Rack", originalPrice: "৳6,000", offerPrice: "৳3,000", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=120&h=120&fit=crop" }
            ]
        },
    ];

    const inspirationData = [
        { title: "Kids Room Study Set Design Ideas", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=130&fit=crop", href: "/blog/kids-room-study-set-design-guide" },
        { title: "Modern Kitchen Cabinet Planning", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=200&h=130&fit=crop", href: "/blog/modern-kitchen-cabinet-planning-guide" },
        { title: "Small Apartment Space-Saving Furniture", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&h=130&fit=crop", href: "/blog/smart-space-saving-furniture-apartments" },
    ];

    const supportData = [
        { icon: Headphones, title: "24/7 Customer Support", desc: "Talk with our support team anytime" },
        { icon: Sparkles, title: "Free Interior Consultation", desc: "Book a meeting with expert designers" },
        { icon: Truck, title: "Fast Home Delivery", desc: "Safe setup & free installation available" },
        { icon: ShieldCheck, title: "Warranty & Repair", desc: "Up to 10 years structural warranty" },
    ];

    const bottomTabs = [
        { key: "menu", label: "Menu", icon: Menu },
        { key: "products", label: "Categories", icon: Box },
        { key: "rooms", label: "Rooms", icon: Home },
        { key: "series", label: "Series", icon: Layers },
        { key: "offers", label: "Offers", icon: Tag },
        { key: "inspiration", label: "Inspiration", icon: Lightbulb },
        { key: "design", label: "Support", icon: LifeBuoy },
    ];

    return (
        <header className="relative w-full bg-white z-50 sticky top-0 z-50">
            <div className="relative border-b border-gray-300 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">

                        {/* Brand Logo */}
                        <Link href={"/"}>
                            <div className="shrink-0 flex items-center cursor-pointer">
                                <Image
                                    src={logo || navLogo}
                                    alt="main-logo"
                                    height={90}
                                    width={90}
                                    className="w-[60px] sm:w-[75px] md:w-[90px] h-auto object-contain"
                                    priority
                                />
                            </div>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden md:flex items-center space-x-7 lg:space-x-9 h-full">
                            {desktopNavItems.map((item, idx) => {
                                const menuKey = item.key || item.label;
                                const hasCustomChildren = Array.isArray(item.children) && item.children.length > 0;
                                const isBuiltInMega = ["products", "rooms", "series", "offers", "inspiration", "design"].includes(menuKey);
                                const isActive = activeMenu === menuKey || activeMenu === idx;

                                return (
                                    <div
                                        key={idx}
                                        className="h-full flex items-center relative cursor-pointer"
                                        onMouseEnter={() => setActiveMenu(menuKey)}
                                        onMouseLeave={() => setActiveMenu(null)}
                                    >
                                        <Link
                                            href={item.href || "/products"}
                                            target={item.newTab ? "_blank" : undefined}
                                            className={`text-[15px] tracking-wide transition-all cursor-pointer flex items-center gap-1 ${
                                                isActive
                                                    ? "text-primary font-semibold"
                                                    : "text-black font-semibold hover:text-primary"
                                            }`}
                                        >
                                            <span>{item.label}</span>
                                            {item.badge && (
                                                <span
                                                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                                                    style={{ backgroundColor: item.badgeColor || "#9f582c" }}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>

                                        {/* Custom Admin Submenu Dropdown if item has children and is not built-in */}
                                        {hasCustomChildren && !isBuiltInMega && isActive && (
                                            <div className="absolute top-full left-0 bg-white border border-gray-200 shadow-xl rounded-xl p-4 min-w-[220px] z-50">
                                                <ul className="space-y-2">
                                                    {item.children.map((child, cIdx) => (
                                                        <li key={cIdx}>
                                                            <Link
                                                                href={child.href || "/products"}
                                                                className="flex items-center gap-2 text-xs font-medium text-gray-700 hover:text-primary p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                                                            >
                                                                {child.image && (
                                                                    <Image
                                                                        src={child.image}
                                                                        alt={child.label}
                                                                        width={24}
                                                                        height={24}
                                                                        className="w-6 h-6 object-cover rounded-md flex-shrink-0"
                                                                    />
                                                                )}
                                                                <span>{child.label}</span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>

                        {/* Right Action Icons & Search */}
                        <div className="flex items-center gap-3 lg:gap-6">
                            <form onSubmit={handleSearchSubmit} className="relative hidden lg:block w-72 xl:w-80">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="What are you looking for?"
                                    className="w-full bg-white border border-gray-300 rounded-full py-2 pl-10 pr-4 text-xs xl:text-sm focus:outline-none focus:border-primary placeholder:text-gray-400"
                                />
                                <button type="submit" aria-label="Search products" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                                    <Search className="w-4 h-4" />
                                </button>
                            </form>

                            <div className="flex items-center gap-3 sm:gap-4 text-gray-900">
                                {/* User Icon */}
                                <Link
                                    href={isCustomerLoggedIn ? "/profile" : "/login"}
                                    title={isCustomerLoggedIn ? `${customer.name} (Account)` : "Login / Sign up"}
                                    className={`transition-colors p-1 rounded-full border flex items-center gap-1.5 ${
                                        isCustomerLoggedIn
                                            ? "border-primary text-primary bg-primary/5 px-2.5"
                                            : "border-[#0000005e] hover:border-[#9f582c] hover:text-[#9f582c]"
                                    }`}
                                >
                                    <User className="w-5 h-5 stroke-[1.8]" />
                                    {isCustomerLoggedIn && (
                                        <span className="text-xs font-semibold max-w-[80px] truncate hidden sm:inline-block">
                                            {customer.name?.split(" ")[0]}
                                        </span>
                                    )}
                                </Link>

                                {/* Wishlist Icon + Always Visible Badge */}
                                <Link href={"/wishlist"} className="hover:text-[#9f582c] transition-colors p-1 relative">
                                    <Heart className="w-5 h-5 stroke-[1.8]" />
                                    <span className="absolute -top-1 -right-1.5 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {wishlistCount || 0}
                                    </span>
                                </Link>

                                {/* Cart Icon + Always Visible Badge */}
                                <Link href={"/cart"} className="hover:text-[#9f582c] p-1 relative">
                                    <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                                    <span className="absolute -top-1 -right-1.5 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {cartCount || 0}
                                    </span>
                                </Link>

                                {/* Mobile Hamburger Menu Icon */}
                                <button
                                    onClick={() => {
                                        setMobileTab("menu");
                                        setSelectedCategory(null);
                                        setIsMobileMenuOpen(true);
                                    }}
                                    className="md:hidden hover:text-black transition-colors p-1 ml-1"
                                >
                                    <Menu className="w-6 h-6 stroke-[2]" />
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Mobile Search Bar */}
                    <div className="md:hidden pb-2.5">
                        <form onSubmit={handleSearchSubmit} className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="What are you looking for?"
                                className="w-full bg-white border border-gray-300 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-primary placeholder:text-gray-400"
                            />
                            <button type="submit" aria-label="Search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black">
                                <Search className="w-4 h-4 cursor-pointer" />
                            </button>
                        </form>
                    </div>

                    {/* Mobile Quick Main Menu Scroll Bar */}
                    {desktopNavItems.length > 0 && (
                        <div className="md:hidden pb-3 -mt-0.5">
                            <div
                                className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 px-0.5"
                                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                            >
                                {desktopNavItems.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={item.href || "/products"}
                                        target={item.newTab ? "_blank" : undefined}
                                        className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 shadow-2xs transition-colors"
                                    >
                                        <span>{item.label}</span>
                                        {item.badge && (
                                            <span
                                                className="text-[9px] font-bold px-1.5 py-0.2 rounded-full text-white"
                                                style={{ backgroundColor: item.badgeColor || "#9f582c" }}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ---------------- DESKTOP MEGA MENUS ---------------- */}

                {/* Products Mega Menu */}
                {activeMenu === "products" && (
                    <div
                        className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-xl z-50 py-6 hidden md:block"
                        onMouseEnter={() => setActiveMenu("products")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
                                <button
                                    onClick={() => scroll("left")}
                                    className="p-1.5 hover:bg-gray-100 border border-gray-200 rounded-full transition-colors flex-shrink-0"
                                >
                                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                                </button>

                                <div
                                    ref={scrollContainerRef}
                                    className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1 scroll-smooth"
                                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                >
                                    {categories.map((cat, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveCategory(cat.name)}
                                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-lg transition-all ${activeCategory === cat.name
                                                ? "border-2 border-black font-bold text-black bg-gray-50"
                                                : "border border-gray-200 hover:border-gray-400 text-gray-700 bg-white"
                                                }`}
                                        >
                                            <Image
                                                src={cat.image}
                                                alt={cat.name}
                                                width={24}
                                                height={24}
                                                className="w-6 h-6 object-cover rounded-md flex-shrink-0"
                                            />
                                            <span>{cat.name}</span>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => scroll("right")}
                                    className="p-1.5 hover:bg-gray-100 border border-gray-200 rounded-full transition-colors flex-shrink-0"
                                >
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>

                            <div className="grid grid-cols-12 gap-8">
                                <div className="col-span-3 border-r border-gray-100 space-y-3 pr-4">
                                    <h4 className="font-bold text-gray-900 text-sm mb-4">Explore {activeCategory}</h4>
                                    <Link href="/products?sort=featured" className="block text-xs font-semibold text-gray-700 hover:text-black cursor-pointer">Offers</Link>
                                    <Link href="/products" className="block text-xs font-semibold text-gray-700 hover:text-black cursor-pointer">All Products</Link>
                                    <Link href="/products?sort=featured" className="block text-xs font-semibold text-gray-700 hover:text-black cursor-pointer">Top Sellers</Link>
                                </div>

                                {(() => {
                                    const activeMatch = categories.find((c) => c.name === activeCategory);
                                    const activeSubcategories = activeMatch?.children && activeMatch.children.length > 0
                                        ? activeMatch.children
                                        : null;

                                    if (activeSubcategories) {
                                        return (
                                            <div className="col-span-9 grid grid-cols-4 gap-4">
                                                {activeSubcategories.map((sub, itemIdx) => (
                                                    <Link
                                                        key={itemIdx}
                                                        href={sub.slug ? `/categories/${sub.slug}` : searchHref(sub.name)}
                                                        className="flex items-center gap-2 group text-xs text-gray-600 hover:text-black hover:font-semibold transition-all p-1.5 rounded-md hover:bg-gray-50 border border-gray-100"
                                                    >
                                                        <Image
                                                            src={sub.image}
                                                            alt={sub.name}
                                                            width={32}
                                                            height={32}
                                                            className="w-8 h-8 object-cover rounded-md flex-shrink-0 border border-gray-100 group-hover:border-black transition-colors"
                                                        />
                                                        <span className="leading-tight">{sub.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="col-span-9 grid grid-cols-5 gap-4">
                                            {storageItems.map((col, idx) => (
                                                <div key={idx} className="space-y-3">
                                                    {col.map((item, itemIdx) => (
                                                        <Link
                                                            key={itemIdx}
                                                            href={searchHref(item.name)}
                                                            className="flex items-center gap-2 group text-xs text-gray-600 hover:text-black hover:font-semibold transition-all p-1 rounded-md hover:bg-gray-50"
                                                        >
                                                            <Image
                                                                src={item.image}
                                                                alt={item.name}
                                                                width={28}
                                                                height={28}
                                                                className="w-7 h-7 object-cover rounded-md flex-shrink-0 border border-gray-100 group-hover:border-black transition-colors"
                                                            />
                                                            <span className="leading-tight">{item.name}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}

                {/* Rooms Mega Menu */}
                {activeMenu === "rooms" && (
                    <div
                        className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-xl z-50 py-8 hidden md:block"
                        onMouseEnter={() => setActiveMenu("rooms")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-4 gap-6">
                                {roomsData.map((room, idx) => (
                                    <Link key={idx} href={searchHref(room.title)} className="flex items-center gap-4 group hover:bg-gray-50 p-2.5 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                        <Image
                                            src={room.image}
                                            alt={room.title}
                                            width={64}
                                            height={48}
                                            className="w-16 h-12 object-cover rounded-md flex-shrink-0"
                                        />
                                        <span className="font-bold text-sm text-gray-800 group-hover:text-black">
                                            {room.title}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Series Mega Menu */}
                {activeMenu === "series" && (
                    <div
                        className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-xl z-50 py-8 hidden md:block"
                        onMouseEnter={() => setActiveMenu("series")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-4 gap-6">
                                {seriesData.map((series, idx) => (
                                    <div key={idx} className="border border-gray-100 p-4 rounded-xl hover:shadow-md transition-shadow">
                                        <h4 className="font-bold text-sm text-gray-900 mb-3">{series.title}</h4>
                                        <div className="space-y-2">
                                            {series.items.map((item, itemIdx) => (
                                                <Link key={itemIdx} href={searchHref(item)} className="block text-xs text-gray-600 hover:text-black transition-colors">
                                                    {item}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Offers Mega Menu */}
                {activeMenu === "offers" && (
                    <div
                        className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-xl z-50 py-8 hidden md:block"
                        onMouseEnter={() => setActiveMenu("offers")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-3 gap-8">
                                {offersData.map((offer, idx) => (
                                    <div key={idx} className="p-5 border border-red-100 bg-red-50/30 rounded-2xl flex flex-col justify-between hover:border-primary transition-all shadow-sm">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold bg-black text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                                    {offer.badge}
                                                </span>
                                                <span className="text-xs font-bold text-black bg-red-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                    <Percent className="w-3 h-3" /> {offer.discount}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-base text-gray-900">{offer.title}</h4>
                                            <p className="text-xs text-gray-500 mb-4">{offer.desc}</p>

                                            <div className="space-y-2.5 border-t border-red-100/60 pt-3">
                                                {offer.products.map((prod, prodIdx) => (
                                                    <Link
                                                        key={prodIdx}
                                                        href={searchHref(prod.name)}
                                                        className="flex items-center gap-3 p-2 bg-white rounded-xl border border-gray-100 hover:border-primary hover:shadow-sm transition-all group"
                                                    >
                                                        <Image
                                                            src={prod.image}
                                                            alt={prod.name}
                                                            width={48}
                                                            height={48}
                                                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="font-semibold text-xs text-gray-800 truncate group-hover:text-rprimary transition-colors">
                                                                {prod.name}
                                                            </h5>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-xs font-bold text-black">{prod.offerPrice}</span>
                                                                <span className="text-[10px] text-gray-400 line-through">{prod.originalPrice}</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        <Link
                                            href="/products?sort=featured"
                                            className="mt-4 block text-center py-2 bg-primary hover:bg-black text-white font-semibold text-xs rounded-xl transition-colors"
                                        >
                                            View All Products &rarr;
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Inspiration Mega Menu */}
                {activeMenu === "inspiration" && (
                    <div
                        className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-xl z-50 py-8 hidden md:block"
                        onMouseEnter={() => setActiveMenu("inspiration")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-3 gap-6">
                                {inspirationData.map((item, idx) => (
                                    <Link key={idx} href={item.href || "/blog"} className="group flex gap-4 items-center p-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={96}
                                            height={64}
                                            className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900 group-hover:text-black">{item.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1">Read article &rarr;</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Design/Support Mega Menu */}
                {activeMenu === "design" && (
                    <div
                        className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-xl z-50 py-8 hidden md:block"
                        onMouseEnter={() => setActiveMenu("design")}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-4 gap-6">
                                {supportData.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={idx} className="flex gap-3 items-start p-3 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors">
                                            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg flex-shrink-0">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* ---------------- MOBILE SMOOTH FULLSCREEN DRAWER ---------------- */}
            <div
                className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                    }`}
            >
                {/* Backdrop Overlay */}
                <div
                    className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-100" : "opacity-0"
                        }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Main Content Container with Smooth Slide Animation */}
                <div
                    className={`relative bg-white w-full h-full flex flex-col z-10 shadow-2xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-lg text-gray-900 capitalize">
                            {selectedCategory ? selectedCategory : (mobileTab === "menu" ? "Main Menu" : mobileTab)}
                        </h3>
                        <div className="flex items-center gap-2">
                            {selectedCategory && (
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="text-xs font-semibold text-gray-500 hover:text-black mr-2"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-700" />
                            </button>
                        </div>
                    </div>

                    {/* Main Scrollable Body Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {/* Mobile Main Menu Tab */}
                        {mobileTab === "menu" && (
                            <div className="space-y-2.5">
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 pb-1">
                                    Main Navigation (মূল মেনু)
                                </div>
                                {desktopNavItems.map((item, idx) => {
                                    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                                    const itemKey = item.key || item.label || idx;
                                    const isExpanded = expandedMenuKey === itemKey;

                                    return (
                                        <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-2xs">
                                            <div className="flex items-center justify-between p-3.5 hover:bg-gray-50 transition-colors">
                                                <Link
                                                    href={item.href || "/products"}
                                                    target={item.newTab ? "_blank" : undefined}
                                                    onClick={handleCloseMobileMenu}
                                                    className="flex items-center gap-2 flex-1 font-semibold text-sm text-gray-900"
                                                >
                                                    <span>{item.label}</span>
                                                    {item.badge && (
                                                        <span
                                                            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                                                            style={{ backgroundColor: item.badgeColor || "#9f582c" }}
                                                        >
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </Link>
                                                {hasChildren && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setExpandedMenuKey(isExpanded ? null : itemKey)}
                                                        className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg ml-2 transition-colors"
                                                    >
                                                        <ChevronDown
                                                            className={`w-4 h-4 transition-transform duration-200 ${
                                                                isExpanded ? "rotate-180 text-primary" : ""
                                                            }`}
                                                        />
                                                    </button>
                                                )}
                                            </div>

                                            {hasChildren && isExpanded && (
                                                <div className="bg-gray-50/80 border-t border-gray-100 px-3 py-2 space-y-1">
                                                    {item.children.map((child, cIdx) => (
                                                        <Link
                                                            key={cIdx}
                                                            href={child.href || "/products"}
                                                            target={child.newTab ? "_blank" : undefined}
                                                            onClick={handleCloseMobileMenu}
                                                            className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-xs font-medium text-gray-700 hover:text-primary hover:bg-white transition-all"
                                                        >
                                                            {child.image && (
                                                                <Image
                                                                    src={child.image}
                                                                    alt={child.label}
                                                                    width={24}
                                                                    height={24}
                                                                    className="w-6 h-6 object-cover rounded-md flex-shrink-0"
                                                                />
                                                            )}
                                                            <span>{child.label}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Quick button to view all categories */}
                                <button
                                    type="button"
                                    onClick={() => setMobileTab("products")}
                                    className="w-full flex items-center justify-between p-3.5 bg-primary/10 border border-primary/20 rounded-xl text-primary font-bold text-xs hover:bg-primary/20 transition-all mt-2"
                                >
                                    <span>Browse All Categories (ক্যাটাগরি সমূহ)</span>
                                    <span>&rarr;</span>
                                </button>
                            </div>
                        )}
                        {mobileTab === "products" && !selectedCategory && (
                            <div className="space-y-2.5">
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 pb-1">
                                    Product Categories (ক্যাটাগরি সমূহ)
                                </div>
                                {categories.map((cat, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-2.5 sm:p-3 border border-gray-100 rounded-xl hover:shadow-sm transition-all bg-white"
                                    >
                                        <Link
                                            href={categoryHref(cat.name)}
                                            onClick={handleCloseMobileMenu}
                                            className="flex items-center gap-3 flex-1 min-w-0"
                                        >
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={cat.image}
                                                    alt={cat.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=80&h=80&fit=crop";
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold text-sm text-gray-900 truncate">{cat.name}</span>
                                                <span className="text-[11px] text-primary font-medium">Browse category &rarr;</span>
                                            </div>
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedCategory(cat.name);
                                            }}
                                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg flex items-center gap-1 text-xs ml-2 flex-shrink-0 border border-transparent hover:border-gray-200"
                                            title="View Subcategories"
                                        >
                                            <span className="text-[11px] text-gray-500 font-medium">Sub-items</span>
                                            <ArrowRight className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {mobileTab === "products" && selectedCategory && (
                            <div className="space-y-3">
                                {/* Direct Link to View All Category Products */}
                                <Link
                                    href={categoryHref(selectedCategory)}
                                    onClick={handleCloseMobileMenu}
                                    className="flex items-center justify-between p-3.5 bg-primary/10 border border-primary/20 rounded-xl text-primary font-bold text-sm hover:bg-primary/20 transition-all"
                                >
                                    <div className="flex items-center gap-2">
                                        <span>View All {selectedCategory}</span>
                                        <span className="text-xs font-normal opacity-80">(সব পণ্য দেখুন)</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider mt-4 mb-2">
                                    Subcategories / Popular Items
                                </h4>

                                <div className="space-y-1.5">
                                    {(() => {
                                        const currentCat = categories.find((c) => c.name === selectedCategory);
                                        const subItems = currentCat?.children || [];

                                        if (subItems.length === 0) {
                                            return (
                                                <div className="py-6 text-center text-xs text-gray-500 bg-gray-50 rounded-xl px-4">
                                                    Tap <strong>View All {selectedCategory}</strong> above to see all products in this category.
                                                </div>
                                            );
                                        }

                                        return subItems.map((item, idx) => (
                                            <Link
                                                key={idx}
                                                href={`/categories/${currentCat?.slug || item.slug}${item.slug ? `?sub=${encodeURIComponent(item.slug)}` : ""}`}
                                                onClick={handleCloseMobileMenu}
                                                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50 border border-gray-50 hover:border-gray-200 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {item.image && (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            width={36}
                                                            height={36}
                                                            className="w-9 h-9 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                                                            onError={(e) => {
                                                                e.currentTarget.src = "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=60&h=60&fit=crop";
                                                            }}
                                                        />
                                                    )}
                                                    <span className="font-medium text-xs text-gray-800">{item.name}</span>
                                                </div>
                                                <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                                            </Link>
                                        ));
                                    })()}
                                </div>
                            </div>
                        )}

                        {mobileTab === "rooms" && (
                            <div className="grid grid-cols-2 gap-3">
                                {roomsData.map((room, idx) => (
                                    <Link
                                        key={idx}
                                        href={room.slug ? `/products?room=${encodeURIComponent(room.slug)}` : searchHref(room.title)}
                                        onClick={handleCloseMobileMenu}
                                        className="flex flex-col items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 text-center transition-all hover:shadow-sm bg-white"
                                    >
                                        <div className="w-full h-20 bg-gray-100 rounded-lg overflow-hidden mb-2 relative">
                                            <Image
                                                src={room.image}
                                                alt={room.title}
                                                width={300}
                                                height={80}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=300&h=200&fit=crop";
                                                }}
                                            />
                                        </div>
                                        <span className="font-semibold text-xs text-gray-800">{room.title}</span>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {mobileTab === "series" && (
                            <div className="space-y-4">
                                {seriesData.map((series, idx) => (
                                    <div key={idx} className="p-3 border border-gray-100 rounded-xl space-y-2 bg-white">
                                        <h5 className="font-bold text-sm text-gray-900">{series.title}</h5>
                                        <div className="space-y-1">
                                            {series.items.map((item, itemIdx) => (
                                                <Link
                                                    key={itemIdx}
                                                    href={searchHref(item)}
                                                    onClick={handleCloseMobileMenu}
                                                    className="block text-xs text-gray-600 hover:text-black py-1 px-1 rounded hover:bg-gray-50"
                                                >
                                                    {item}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {mobileTab === "offers" && (
                            <div className="space-y-4">
                                {offersData.map((offer, idx) => (
                                    <div key={idx} className="p-4 border border-red-100 bg-red-50/40 rounded-2xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full uppercase">
                                                {offer.badge}
                                            </span>
                                            <span className="text-xs font-bold text-black">{offer.discount}</span>
                                        </div>
                                        <h5 className="font-bold text-sm text-gray-900 mt-2">{offer.title}</h5>
                                        <p className="text-xs text-gray-500 mb-3">{offer.desc}</p>

                                        <div className="space-y-2 border-t border-red-100 pt-2">
                                            {offer.products.map((prod, prodIdx) => (
                                                <Link
                                                    key={prodIdx}
                                                    href={searchHref(prod.name)}
                                                    onClick={handleCloseMobileMenu}
                                                    className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                                                >
                                                    <Image
                                                        src={prod.image}
                                                        alt={prod.name}
                                                        width={40}
                                                        height={40}
                                                        className="w-10 h-10 object-cover rounded-lg"
                                                        onError={(e) => {
                                                            e.currentTarget.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&h=120&fit=crop";
                                                        }}
                                                    />
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-800">{prod.name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-black">{prod.offerPrice}</span>
                                                            <span className="text-[10px] text-gray-400 line-through">{prod.originalPrice}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {mobileTab === "inspiration" && (
                            <div className="space-y-3">
                                {inspirationData.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={item.href || "/blog"}
                                        onClick={handleCloseMobileMenu}
                                        className="flex gap-3 items-center p-2 border border-gray-100 rounded-xl hover:bg-gray-50 bg-white"
                                    >
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={80}
                                            height={56}
                                            className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&h=130&fit=crop";
                                            }}
                                        />
                                        <div>
                                            <h5 className="font-semibold text-xs text-gray-800">{item.title}</h5>
                                            <span className="text-[10px] text-sky-600 font-medium">Read more &rarr;</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {mobileTab === "design" && (
                            <div className="space-y-3">
                                <Link
                                    href="/contact"
                                    onClick={handleCloseMobileMenu}
                                    className="flex items-center justify-between p-3.5 bg-primary text-white font-semibold text-xs rounded-xl shadow-sm hover:opacity-95 transition-opacity"
                                >
                                    <span>Book Design Consultation / Contact Us &rarr;</span>
                                </Link>
                                {supportData.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={idx}
                                            href="/contact"
                                            onClick={handleCloseMobileMenu}
                                            className="flex gap-3 items-start p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors bg-white"
                                        >
                                            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg flex-shrink-0">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-xs text-gray-900">{item.title}</h5>
                                                <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Bottom Tabs */}
                    <div className="border-t border-gray-200 bg-primary w-full">
                        <div
                            className="flex items-center overflow-x-auto px-2 py-2 gap-1 scrollbar-none"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {bottomTabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = mobileTab === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => {
                                            setMobileTab(tab.key);
                                            setSelectedCategory(null);
                                        }}
                                        className="flex flex-col items-center justify-center min-w-[72px] flex-shrink-0 py-1 cursor-pointer"
                                    >
                                        <div className={`p-2 rounded-full transition-all ${isActive ? "bg-sky-100 text-black" : "text-white"}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`text-[11px] mt-1 whitespace-nowrap font-medium ${isActive ? "text-white font-semibold" : "text-white"}`}>
                                            {tab.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>

        </header>
    );
};

export default Navbar;