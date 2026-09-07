import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { LiaFacebookF } from "react-icons/lia";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import footerLogo from "../../public/main-logo.png";
import { siteConfig } from "@/config/site";

/**
 * Every entry used to be href="#". The columns below only list destinations
 * that actually exist, so nothing in the footer is a dead end.
 */
const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "All Products", href: "/products" },
  { label: "Shop by Category", href: "/categories" },
];

const helpLinks = [
  { label: "Track Order", href: "/track-order" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Create an Account", href: "/signup" },
  { label: "Sign In", href: "/login" },
];

const Footer = ({ logo, categories = [], settings = {}, pages = [] }) => {
  // Defensive: a bad API payload should degrade, not crash the whole page.
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safePages = Array.isArray(pages) ? pages : [];
  // Contact details and copyright are admin-editable, with the original
  // values as the fallback.
  const address = settings.footer_address || siteConfig.address;
  const phone = settings.footer_phone || siteConfig.phone;
  const phone2 = settings.footer_phone_2 || siteConfig.secondaryPhone;
  const email = settings.footer_email || siteConfig.email;
  const copyright =
    settings.footer_copyright ||
    `© ${new Date().getFullYear()} ${siteConfig.name}. All Rights Reserved.`;

  // Filter out any pages that might already be in companyLinks or helpLinks
  const dynamicPages = safePages.filter(
    (p) =>
      !companyLinks.some((c) => c.href === p.href) &&
      !helpLinks.some((h) => h.href === p.href)
  );

  // Categories are fetched once in the layout and passed down, so the footer
  // can never advertise a collection that has no products behind it.
  const categoryLinks = safeCategories
    .slice(0, 6)
    .map((category) => ({
      label: category.title,
      href: `/categories/${category.slug}`,
    }));

  const socials = [
    { href: siteConfig.social.facebook, label: "Facebook", Icon: LiaFacebookF },
    { href: siteConfig.social.instagram, label: "Instagram", Icon: FaInstagram },
    { href: siteConfig.social.youtube, label: "YouTube", Icon: FaYoutube },
  ];

  const LinkColumn = ({ title, links }) => (
    <div>
      <h3 className="font-serif font-bold text-base text-gray-900 mb-4">{title}</h3>
      <ul className="space-y-2 text-xs sm:text-sm text-gray-800">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="hover:underline hover:text-black transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-[#f6f1ec] text-gray-900 font-sans pt-12 pb-6 border-t border-black/10">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand + contact */}
          <div className="space-y-4">
            <Link href="/" aria-label={siteConfig.name}>
              <Image src={logo || footerLogo} height={90} width={90} alt={siteConfig.name} />
            </Link>

            <div className="text-xs sm:text-sm text-gray-800 space-y-2 leading-relaxed">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-900 shrink-0 mt-0.5" />
                <span>{address}</span>
              </p>
              <p className="flex items-center gap-2 font-medium">
                <Phone className="w-4 h-4 text-gray-900 shrink-0" />
                <span>
                  Call:{" "}
                  <Link href={`tel:${phone}`} className="hover:underline">
                    {phone}
                  </Link>
                </span>
              </p>
              <p className="flex items-center gap-2 font-medium">
                <Phone className="w-4 h-4 text-gray-900 shrink-0" />
                <span>
                  Call:{" "}
                  <Link
                    href={`tel:${phone2}`}
                    className="hover:underline"
                  >
                    {phone2}
                  </Link>
                </span>
              </p>
              <p className="flex items-center gap-2 font-medium">
                <Mail className="w-4 h-4 text-gray-900 shrink-0" />
                <span>
                  Email:{" "}
                  <Link
                    href={`mailto:${email}`}
                    className="hover:underline"
                  >
                    {email}
                  </Link>
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-black/10 hover:bg-black hover:text-white flex items-center justify-center transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <LinkColumn title="The Company" links={companyLinks} />
          <LinkColumn
            title="Help Desk"
            links={[...helpLinks, ...dynamicPages]}
          />
          <LinkColumn title="Shop" links={categoryLinks} />
        </div>

        <div className="border-t border-black/10 pt-6 text-center">
          <p className="text-xs sm:text-sm font-medium text-gray-800">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
