import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import FlowSection from "../components/landing/FlowSection";
import StatsSection from "../components/landing/StatsSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import AiHighlightSection from "../components/landing/AiHighlightSection";
import ProductPreviewSection from "../components/landing/ProductPreviewSection";
import CtaSection from "../components/landing/CtaSection";
import FooterSection from "../components/landing/FooterSection";

export default function HomePage({ session, hospitals }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <LandingNavbar session={session} />
      <HeroSection session={session} />
      <FlowSection />
      <StatsSection hospitals={hospitals} />
      <FeaturesSection />
      <AiHighlightSection session={session} />
      <ProductPreviewSection />
      <CtaSection />
      <FooterSection />
    </div>
  );
}
