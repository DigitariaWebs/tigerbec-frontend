"use client"

import { RoundedButton } from "@/components/ui/rounded-button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { CarCard } from "@/components/ui/car-card";
import { useRef } from "react";

export function InventorySection() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Sample car data - in production this would come from an API
    const sampleCars = [
        {
            id: 1,
            brand: "Honda",
            model: "Civic",
            year: 2022,
            price: 24999,
            kilometers: 35000,
            transmission: "Automatique" as const,
            fuelType: "Essence" as const,
            imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop"
        },
        {
            id: 2,
            brand: "Toyota",
            model: "Camry",
            year: 2023,
            price: 29999,
            kilometers: 18000,
            transmission: "Automatique" as const,
            fuelType: "Hybride" as const,
            imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop"
        },
        {
            id: 3,
            brand: "BMW",
            model: "X5",
            year: 2021,
            price: 54999,
            kilometers: 42000,
            transmission: "Automatique" as const,
            fuelType: "Diesel" as const,
            imageUrl: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&auto=format&fit=crop"
        },
        {
            id: 4,
            brand: "Tesla",
            model: "Model 3",
            year: 2023,
            price: 47999,
            kilometers: 12000,
            transmission: "Automatique" as const,
            fuelType: "Électrique" as const,
            imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop"
        },
        {
            id: 5,
            brand: "Audi",
            model: "A4",
            year: 2022,
            price: 38999,
            kilometers: 28000,
            transmission: "Automatique" as const,
            fuelType: "Essence" as const,
            imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop"
        },
        {
            id: 6,
            brand: "Mercedes",
            model: "C-Class",
            year: 2023,
            price: 45999,
            kilometers: 15000,
            transmission: "Automatique" as const,
            fuelType: "Hybride" as const,
            imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop"
        },
        {
            id: 7,
            brand: "Ford",
            model: "F-150",
            year: 2021,
            price: 42999,
            kilometers: 45000,
            transmission: "Automatique" as const,
            fuelType: "Essence" as const,
            imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop"
        },
    ];

    const handleViewDetails = (id: string | number) => {
        console.log(`View details for car ${id}`);
        // Navigate to car details page
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const newScrollLeft = scrollContainerRef.current.scrollLeft + 
                (direction === 'left' ? -scrollAmount : scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section id="vehicles" className="py-16 bg-background border-t">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center text-center gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Véhicules d&#39;occasion</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Inventaire étendu avec options de financement. Historique du véhicule vérifié, évaluation sur place et assistance pour échange.
                        </p>
                    </div>
                </div>

                {/* Carousel Controls */}
                <div className="relative px-4 md:px-8">
                    {/* Left Arrow with Gradient */}
                    <div className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 z-20">
                        <button
                            onClick={() => scroll('left')}
                            className="relative bg-background/90 backdrop-blur-sm border border-border rounded-full p-3 shadow-lg hover:bg-background transition-colors"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        {/* Horizontal gradient under button */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent rounded-full" />
                    </div>

                    {/* Right Arrow with Gradient */}
                    <div className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 z-20">
                        <button
                            onClick={() => scroll('right')}
                            className="relative bg-background/90 backdrop-blur-sm border border-border rounded-full p-3 shadow-lg hover:bg-background transition-colors"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                        {/* Horizontal gradient under button */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent rounded-full" />
                    </div>

                    {/* Horizontal Scroll Container */}
                    <div 
                        ref={scrollContainerRef}
                        className="flex gap-4 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {/* Car Cards */}
                        {sampleCars.map((car) => (
                            <div key={car.id} className="shrink-0 w-80">
                                <CarCard
                                    {...car}
                                    onViewDetails={handleViewDetails}
                                />
                            </div>
                        ))}

                        {/* Final CTA Card */}
                        <div className="shrink-0 w-80 h-96 bg-linear-to-br from-primary/20 to-primary/5 border-2 border-primary/30 rounded-xl flex flex-col items-center justify-center gap-6 p-8 hover:border-primary/50 transition-colors">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold mb-2 text-foreground">Plus de véhicules</h3>
                                <p className="text-foreground/70 font-medium">
                                    Découvrez notre inventaire complet avec plus de 50+ véhicules
                                </p>
                            </div>
                            <RoundedButton size="lg" href="/inventory" variant="solid" className="py-6 px-8">
                                Voir le catalogue complet
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </RoundedButton>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
