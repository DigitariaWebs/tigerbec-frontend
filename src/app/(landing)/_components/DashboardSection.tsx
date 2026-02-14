"use client";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import FeaturedSectionStats from "@/components/ui/featured-section-stats";
import { RoundedButton } from "@/components/ui/rounded-button";
import { ArrowRight } from "lucide-react";
import { assets } from "@/config/assets";

export function DashboardSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Container Scroll with Dashboard Video */}
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Plateforme de Gestion{" "}
                <span className="text-primary">Intuitive</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Accédez à votre tableau de bord personnalisé pour suivre vos véhicules, 
                gérer vos finances et consulter l&#39;historique complet de vos transactions.
              </p>
              <div className="flex justify-center pt-4">
                <RoundedButton size="lg" href="/login" variant="solid" className="py-6 px-8">
                  Commencer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </RoundedButton>
              </div>
            </div>
          }
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="mx-auto rounded-2xl object-cover h-full w-full"
          >
            <source src={assets.dashboard} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        </ContainerScroll>
      </div>

      {/* Featured Stats Section */}
      <FeaturedSectionStats />
    </section>
  );
}
