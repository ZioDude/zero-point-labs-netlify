import HeroSection from "@/components/sections/HeroSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import PricingSection from "@/components/sections/PricingSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PortfolioSection />
      <PricingSection />
      {/* We can add more sections here later */}
    </>
  );
}
