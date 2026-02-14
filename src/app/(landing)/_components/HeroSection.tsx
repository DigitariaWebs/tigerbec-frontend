import { RoundedButton } from "@/components/ui/rounded-button";
import { ArrowRight } from "lucide-react";
import { assets } from "@/config/assets";

export function HeroSection() {
    return (
        <section
            className="relative min-h-[95vh] overflow-hidden"
            style={{ isolation: "isolate", background: "#000" }}
        >
            {/* Video — inline styles guarantee pointer-events bypass */}
            <video
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    pointerEvents: "none",
                    zIndex: 0,
                    userSelect: "none",
                }}
            >
                <source src={assets.heroVideo} type="video/mp4" />
            </video>

            {/* Gradient overlay */}
            <div
                aria-hidden="true"
                className="bg-gradient-to-b from-black/65 via-black/35 to-black/65 dark:from-black/70 dark:via-black/40 dark:to-black/70"
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    zIndex: 1,
                }}
            />

            {/* Content — z-index 2 guarantees it sits above video + overlay */}
            <div
                className="container mx-auto flex min-h-[95vh] flex-col items-center justify-center px-4 py-20 md:px-6 md:py-32"
                style={{ position: "relative", zIndex: 2 }}
            >
                <div className="flex max-w-4xl flex-col items-center space-y-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 drop-shadow-sm md:text-6xl">
                        Centre Automobile Complet
                        <br />
                        Vente &amp; Service Montréal
                    </h1>

                    <p className="max-w-2xl text-lg font-medium text-white/85 dark:text-muted-foreground md:text-xl">
                        Véhicules d&apos;occasion, Financement, Entretien, Detailing.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <RoundedButton
                            variant="solid"
                            size="lg"
                            className="h-12 px-8 text-base shadow-lg transition-all hover:shadow-xl"
                            href="#vehicles"
                        >
                            Voir l&apos;inventaire
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </RoundedButton>

                        <RoundedButton
                            variant="default"
                            size="lg"
                            className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm hover:bg-background/80"
                            href="#contact"
                        >
                            Prendre Rendez-vous
                        </RoundedButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
