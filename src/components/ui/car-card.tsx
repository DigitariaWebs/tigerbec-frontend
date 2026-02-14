"use client"

import Image from "next/image";
import { RoundedButton } from "@/components/ui/rounded-button";
import { ArrowRight, Gauge, Fuel, Settings } from "lucide-react";
import {
  CardCurtainReveal,
  CardCurtainRevealBody,
  CardCurtainRevealDescription,
  CardCurtainRevealTitle,
  CardCurtain,
} from "@/components/ui/card-curtain-reveal";

interface CarCardProps {
  id: string | number;
  brand: string;
  model: string;
  year: number;
  price: number;
  kilometers: number;
  transmission: "Automatique" | "Manuelle";
  fuelType: "Essence" | "Diesel" | "Hybride" | "Électrique";
  imageUrl: string;
  onViewDetails?: (id: string | number) => void;
}

export function CarCard({
  id,
  brand,
  model,
  year,
  price,
  kilometers,
  transmission,
  fuelType,
  imageUrl,
  onViewDetails,
}: CarCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatKilometers = (km: number) => {
    return new Intl.NumberFormat('fr-CA').format(km) + ' km';
  };

  return (
    <CardCurtainReveal className="group h-96 border-2 border-primary/20 bg-background text-foreground shadow-lg rounded-xl hover:border-primary/40 transition-colors">
      {/* Background Image */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={imageUrl}
          alt={`${brand} ${model}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <CardCurtainRevealBody className="relative z-10 flex flex-col justify-end">
        {/* Initial View - Car Name, Year, Price */}
        <CardCurtainRevealTitle className="relative z-10 text-2xl font-bold tracking-tight text-white group-hover:text-gray-900 group-data-[active]:text-gray-900 dark:group-hover:text-white dark:group-data-[active]:text-white drop-shadow-lg group-hover:drop-shadow-none group-data-[active]:drop-shadow-none transition-colors duration-300">
          {brand} {model}
          <br />
          <span className="text-lg font-medium">{year}</span>
        </CardCurtainRevealTitle>

        <div className="relative z-10 mt-2 mb-4">
          <span className="text-3xl font-bold text-white group-hover:text-gray-900 group-data-[active]:text-gray-900 dark:group-hover:text-white dark:group-data-[active]:text-white drop-shadow-lg group-hover:drop-shadow-none group-data-[active]:drop-shadow-none transition-colors duration-300">
            {formatPrice(price)}
          </span>
        </div>

        {/* Hover View - Additional Details */}
        <CardCurtainRevealDescription className="relative z-10 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary shadow-sm">
                <Gauge className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Kilométrage</p>
                <p className="font-bold text-gray-900 dark:text-white">{formatKilometers(kilometers)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary shadow-sm">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Transmission</p>
                <p className="font-bold text-gray-900 dark:text-white">{transmission}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary shadow-sm">
                <Fuel className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Carburant</p>
                <p className="font-bold text-gray-900 dark:text-white">{fuelType}</p>
              </div>
            </div>
          </div>

          <RoundedButton
            variant="solid"
            size="sm"
            className="w-full"
            onClick={() => onViewDetails?.(id)}
          >
            Voir tous les détails
            <ArrowRight className="ml-2 h-4 w-4" />
          </RoundedButton>
        </CardCurtainRevealDescription>

        {/* Curtain background */}
        <CardCurtain className="z-0 bg-white dark:bg-gray-950" />
      </CardCurtainRevealBody>
    </CardCurtainReveal>
  );
}
