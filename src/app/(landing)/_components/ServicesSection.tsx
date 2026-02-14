import { Car, Wrench, ShieldCheck, Palette, HelpCircle, Truck } from "lucide-react";
import { FeatureSection } from "@/components/ui/feature-section";

export function ServicesSection() {
    const services = [
        {
            title: "Vente de Véhicules",
            description: "Inventaire étendu avec options de financement. Historique vérifié, évaluation sur place et assistance pour échange.",
            icon: <Car className="h-10 w-10" />,
        },
        {
            title: "Entretien et Réparation",
            description: "Service mécanique complet et diagnostics. Entretien de routine, freins, suspension, moteur et transmission.",
            icon: <Wrench className="h-10 w-10" />,
        },
        {
            title: "Détaillage Professionnel",
            description: "Restaurer l'éclat original de votre véhicule. Nettoyage en profondeur, décontamination et options céramiques.",
            icon: <ShieldCheck className="h-10 w-10" />,
        },
        {
            title: "Personnalisation",
            description: "Personnaliser le style et les performances de votre véhicule. Roues, pneus, pelliculages et kits carrosserie.",
            icon: <Palette className="h-10 w-10" />,
        },
        {
            title: "Consultation Automobile",
            description: "Conseils d'experts pour des décisions éclairées. Aide à l'achat, planification d'entretien et coût de possession.",
            icon: <HelpCircle className="h-10 w-10" />,
        },
        {
            title: "Services de Transport",
            description: "Transport et logistique fiables pour voitures. Options fermées/ouvertes, livraison intercités et support.",
            icon: <Truck className="h-10 w-10" />,
        },
    ];

    return (
        <section id="services" className="py-20 bg-muted/50 dark:bg-muted/10">
            <div className="container px-4 md:px-6 flex flex-col items-center">
                <div className="text-center mb-8 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">Services et Entretien</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Solutions automobiles complètes sous un même toit.
                    </p>
                </div>

                <div className="w-full flex justify-center">
                    <FeatureSection features={services} />
                </div>
            </div>
        </section>
    );
}
