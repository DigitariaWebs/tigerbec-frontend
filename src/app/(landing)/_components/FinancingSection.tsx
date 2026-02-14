"use client";

import { RoundedButton } from "@/components/ui/rounded-button";
import { CircleDollarSign, BadgeCheck, Shield } from "lucide-react";
import { BackgroundPaths } from "@/components/ui/background-paths";

export function FinancingSection() {
    return (
        <section id="financing" className="relative py-20 bg-white dark:bg-neutral-950 overflow-hidden">
            {/* Background Paths */}
            <BackgroundPaths />
            
            {/* Content */}
            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="max-w-3xl mx-auto text-center space-y-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Financement Disponible</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center space-y-3 bg-card border border-border rounded-[999px] p-8 shadow-lg">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <CircleDollarSign className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold text-lg">Paiement Flexible</h3>
                            <p className="text-sm text-muted-foreground">Options de paiement flexibles pour tous les services.</p>
                        </div>
                        <div className="flex flex-col items-center space-y-3 bg-card border border-border rounded-[999px] p-8 shadow-lg">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <BadgeCheck className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold text-lg">Techniciens Licenciés</h3>
                            <p className="text-sm text-muted-foreground">Professionnels certifiés en qui vous pouvez avoir confiance.</p>
                        </div>
                        <div className="flex flex-col items-center space-y-3 bg-card border border-border rounded-[999px] p-8 shadow-lg">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold text-lg">Garanties</h3>
                            <p className="text-sm text-muted-foreground">Couverture complète pour votre tranquillité d&#39;esprit.</p>
                        </div>
                    </div>

                    <RoundedButton size="lg" className="px-8" href="#contact" variant="solid">
                        Faire une demande
                    </RoundedButton>
                </div>
            </div>
        </section>
    );
}
