import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import StatsSection from "../components/landing/StatsSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import AiHighlightSection from "../components/landing/AiHighlightSection";
import ProductPreviewSection from "../components/landing/ProductPreviewSection";
import CtaSection from "../components/landing/CtaSection";
import FooterSection from "../components/landing/FooterSection";

export default function HomePage({ session, hospitals }) {
  return (
    <div className="min-h-screen bg-cream-100">
      <LandingNavbar session={session} />
      <HeroSection session={session} />
      <StatsSection hospitals={hospitals} />
      <HowItWorksSection />
      <FeaturesSection />
      <AiHighlightSection session={session} />
      <ProductPreviewSection />
      <CtaSection />
      <FooterSection />
    </div>
  );
}
