import { CategorySection } from "@/components/home/CategorySection";
import { HeroSection } from "@/components/home/HeroSection";
import { NearbyMapSection } from "@/components/home/NearbyMapSection";
import { PopularCities } from "@/components/home/PopularCities";
import { RecommendedSection } from "@/components/home/RecommendedSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <RecommendedSection />
      <PopularCities />
      <NearbyMapSection />
    </>
  );
}
