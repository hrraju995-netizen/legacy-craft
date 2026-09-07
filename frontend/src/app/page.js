import ClassroomFurnitureSection from "@/components/home/ClassroomFurnitureSection";
import ExploreSeries from "@/components/home/ExploreSeries";
import GetTheLook from "@/components/home/GetTheLook";
import HeroBannerGrid from "@/components/home/HeroBannerGrid";
import LatestInsightsSection from "@/components/home/LatestInsightsSection";
import MeetingBannerSection from "@/components/home/MeetingBannerSection";
import NewArrivals from "@/components/home/NewArrivals";
import RoomInspirationSlider from "@/components/home/RoomInspirationSlider";
import ShopByCategory from "@/components/home/ShopByCategory";
import WhoTrustsUsSection from "@/components/home/WhoTrustsUsSection";
import { getAllProducts, getHomeData } from "@/lib/api";
import { sortProducts } from "@/lib/catalog";

export const revalidate = 60;

/**
 * Section order and visibility come from the `home_sections` table, so the
 * admin can reorder or switch off any block without a code change.
 */
const REGISTRY = {
  HeroBannerGrid,
  ShopByCategory,
  ExploreSeries,
  NewArrivals,
  GetTheLook,
  RoomInspirationSlider,
  MeetingBannerSection,
  ClassroomFurnitureSection,
  WhoTrustsUsSection,
  LatestInsightsSection,
};

// Fallback order used when the API is unreachable.
const DEFAULT_ORDER = Object.keys(REGISTRY).map((component) => ({ component }));

export default async function HomePage() {
  const [products, home] = await Promise.all([getAllProducts(), getHomeData()]);

  const sections = home?.sections?.length ? home.sections : DEFAULT_ORDER;
  const newArrivals = sortProducts(products, "newest").slice(0, 8);

  return (
    <>
      {sections.map((section, index) => {
        const Component = REGISTRY[section.component];
        if (!Component) return null;

        const props =
          section.component === "HeroBannerGrid"
            ? { products, banners: home?.banners ?? {} }
            : section.component === "MeetingBannerSection"
            ? { banner: (home?.banners?.meeting_banner || [])[0] }
            : section.component === "GetTheLook"
            ? { products, lookbooks: home?.lookbooks ?? [] }
            : section.component === "NewArrivals"
            ? { products: newArrivals }
            : section.component === "WhoTrustsUsSection"
            ? {
                title: section.title,
                subtitle: section.subtitle,
                partners: home?.partners ?? [],
              }
            : ["ExploreSeries", "LatestInsightsSection"].includes(section.component)
            ? { products }
            : {};

        return <Component key={section.key ?? `${section.component}-${index}`} {...props} />;
      })}
    </>
  );
}
