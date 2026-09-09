import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";
import { ToastContainer } from "react-toastify";
import FloatingChat from "@/components/FloatingChat";
import AdminMenuBar from "@/components/AdminMenuBar";
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
  // Fetched once per revalidation window and shared by the header and footer,
  // so the chrome is admin-controlled instead of hard-coded.
  const [categories, home, site] = await Promise.all([
    getCategories(),
    getHomeData(),
    getSiteConfig(),
  ]);

  const general = site?.settings?.general ?? {};

  // Fix logo URL if server returns localhost-based URL (APP_URL not set on server)
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
      </head>
      <body className="min-h-full flex flex-col">
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
