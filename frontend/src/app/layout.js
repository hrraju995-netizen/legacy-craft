import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";
import { ToastContainer } from "react-toastify";
import FloatingChat from "@/components/FloatingChat";
import AdminMenuBar from "@/components/AdminMenuBar";
import ThemeInitializer from "@/components/ThemeInitializer";
import { siteConfig } from "@/config/site";
import { getCategories, getHomeData, getSiteConfig } from "@/lib/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fixFaviconUrl = (url) => {
  if (!url) return "/favicon.ico";
  let resolved = url;
  if (resolved.startsWith("http://api.lookstudiobd.com")) {
    resolved = "https://api.lookstudiobd.com" + resolved.substring(25);
  }
  if (resolved.includes("localhost") || resolved.includes("127.0.0.1")) {
    resolved = resolved.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, "https://api.lookstudiobd.com");
  }
  return resolved;
};

const getFaviconType = (url) => {
  const clean = (url || "").split("?")[0].toLowerCase();
  if (clean.endsWith(".png")) return "image/png";
  if (clean.endsWith(".svg")) return "image/svg+xml";
  if (clean.endsWith(".webp")) return "image/webp";
  if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return "image/jpeg";
  return "image/x-icon";
};

export async function generateMetadata() {
  const site = await getSiteConfig().catch(() => null);
  const general = site?.settings?.general ?? {};

  const faviconUrl = fixFaviconUrl(general.favicon || general.logo);
  const faviconType = getFaviconType(faviconUrl);
  const siteName = general.site_name || siteConfig.name;
  const siteDesc = general.site_tagline || siteConfig.description;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteName} — Handcrafted Furniture in Bangladesh`,
      template: `%s | ${siteName}`,
    },
    description: siteDesc,
    keywords: [
      "furniture Bangladesh",
      "wooden bed price",
      "office furniture Dhaka",
      "sofa price in Bangladesh",
    ],
    icons: {
      icon: [
        { url: faviconUrl, type: faviconType },
      ],
      shortcut: [{ url: faviconUrl, type: faviconType }],
      apple: [{ url: faviconUrl }],
    },
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: siteName,
      title: `${siteName} — Handcrafted Furniture in Bangladesh`,
      description: siteDesc,
      url: siteConfig.url,
      locale: "en_BD",
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDesc,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport = {
  themeColor: "#9f582c",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const [categories, home, site] = await Promise.all([
    getCategories(),
    getHomeData(),
    getSiteConfig(),
  ]);

  const general = site?.settings?.general ?? {};
  const theme = site?.settings?.theme ?? {};

  const primaryColor = theme.primary_color || "#9f582c";
  const secondaryColor = theme.secondary_color || "#1e293b";
  const accentColor = theme.accent_color || "#d97706";
  const cartBtnBg = theme.cart_button_color || "#1e293b";
  const cartBtnText = theme.cart_button_text_color || "#ffffff";
  const cartBtnHover = theme.cart_button_hover_color || "#000000";
  const buyBtnBg = theme.buy_now_button_color || primaryColor;
  const buyBtnText = theme.buy_now_button_text_color || "#ffffff";
  const topbarBg = theme.topbar_bg_color || primaryColor;
  const topbarText = theme.topbar_text_color || "#ffffff";
  const bodyFont = theme.body_font || "Plus Jakarta Sans";
  const headingFont = theme.heading_font || "Plus Jakarta Sans";

  const radiusMap = {
    full: "9999px",
    xl: "16px",
    lg: "12px",
    md: "8px",
    none: "0px",
  };
  const buttonRadius = radiusMap[theme.button_radius] || "9999px";

  const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    bodyFont
  )}:ital,wght@0,300..800;1,300..800${
    headingFont !== bodyFont
      ? `&family=${encodeURIComponent(headingFont)}:ital,wght@0,300..800;1,300..800`
      : ""
  }&display=swap`;

  // Fix logo URL if server returns localhost-based URL
  const fixUrl = (url) => {
    if (!url) return url;
    if (url.startsWith("http://api.lookstudiobd.com")) {
      url = "https://api.lookstudiobd.com" + url.substring(25);
    }
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      return url.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, "https://api.lookstudiobd.com");
    }
    return url;
  };
  if (general.logo) general.logo = fixUrl(general.logo);
  const activeFavicon = fixFaviconUrl(general.favicon || general.logo);
  const activeFaviconType = getFaviconType(activeFavicon);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: general.site_name || siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: { "@type": "PostalAddress", addressCountry: "BD", addressLocality: "Dhaka" },
    openingHours: "Mo-Su 09:00-21:00",
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href={activeFavicon} type={activeFaviconType} />
        <link rel="shortcut icon" href={activeFavicon} type={activeFaviconType} />
        <link rel="apple-touch-icon" href={activeFavicon} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={googleFontsUrl} rel="stylesheet" />
        <style
          id="theme-dynamic-styles"
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --theme-primary: ${primaryColor};
                --color-primary: ${primaryColor};
                --theme-secondary: ${secondaryColor};
                --color-secondary: ${secondaryColor};
                --theme-accent: ${accentColor};
                --color-accent: ${accentColor};
                --theme-cart-btn: ${cartBtnBg};
                --theme-cart-btn-text: ${cartBtnText};
                --theme-cart-btn-hover: ${cartBtnHover};
                --theme-buy-btn: ${buyBtnBg};
                --theme-buy-btn-text: ${buyBtnText};
                --theme-topbar-bg: ${topbarBg};
                --theme-topbar-text: ${topbarText};
                --theme-btn-radius: ${buttonRadius};
                --theme-font-body: '${bodyFont}', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                --theme-font-heading: '${headingFont}', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              }
              body {
                font-family: var(--theme-font-body) !important;
              }
              h1, h2, h3, h4, h5, h6, .font-heading {
                font-family: var(--theme-font-heading) !important;
              }
              .bg-primary {
                background-color: var(--theme-primary) !important;
              }
              .text-primary {
                color: var(--theme-primary) !important;
              }
              .border-primary {
                border-color: var(--theme-primary) !important;
              }
              .ring-primary {
                --tw-ring-color: var(--theme-primary) !important;
              }
              .btn-theme-cart {
                background-color: var(--theme-cart-btn) !important;
                color: var(--theme-cart-btn-text) !important;
                border-radius: var(--theme-btn-radius) !important;
              }
              .btn-theme-cart:hover {
                background-color: var(--theme-cart-btn-hover) !important;
              }
              .btn-theme-buy {
                background-color: var(--theme-buy-btn) !important;
                color: var(--theme-buy-btn-text) !important;
                border-radius: var(--theme-btn-radius) !important;
              }
              .btn-theme-buy:hover {
                filter: brightness(0.92) !important;
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeInitializer theme={theme} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Topbar settings={site?.settings?.topbar} />
        <Navbar
          logo={general.logo}
          headerMenu={Object.entries(site?.menus ?? {})
            .filter(([loc]) => !loc.startsWith("footer"))
            .flatMap(([_, items]) => items)}
          apiCategories={categories}
          apiRooms={home?.rooms ?? []}
        />
        <main className="flex-1">{children}</main>
        <Footer logo={general.logo} categories={categories} settings={site?.settings?.footer} pages={site?.footerPages ?? []} />
        <ToastContainer position="bottom-right" autoClose={2500} newestOnTop />
        <FloatingChat settings={site?.settings?.chat} />
      </body>
    </html>
  );
}
