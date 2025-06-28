import HeroSection from "@/components/sections/HeroSection";
import PricingSection from "@/components/sections/PricingSection";
import ChatSection from "@/components/sections/ChatSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PricingSection />
      <ChatSection />
      {/* We can add more sections here later */}
    </>
  );
}
