import { HeroSection } from "./_components/HeroSection";
import { AboutSection } from "./_components/AboutSection";
import { ServicesSection } from "./_components/ServicesSection";
import { InventorySection } from "./_components/InventorySection";
import { DashboardSection } from "./_components/DashboardSection";
import { FinancingSection } from "./_components/FinancingSection";
import { GallerySection } from "./_components/GallerySection";
import { ContactSection } from "./_components/ContactSection";
import { StickyFooter } from "@/components/ui/sticky-footer";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection />
            <AboutSection />
            <ServicesSection />
            <InventorySection />
            <DashboardSection />
            <FinancingSection />
            <GallerySection />
            <ContactSection />
            <StickyFooter />
        </div>
    );
}
