"use client"

import Image from "next/image";
import { assets } from "@/config/assets";
import { motion } from "framer-motion";
import { CheckCircle2, Users, Award, Car, Wrench, Shield, Star } from "lucide-react";

const stats = [
    { icon: Award, value: "35+", label: "Années d'expérience" },
    { icon: Users, value: "250,000+", label: "Clients satisfaits" },
    { icon: Star, value: "100%", label: "Satisfaction garantie" },
];

const features = [
    { icon: CheckCircle2, text: "Service multi-services complet en un seul endroit" },
    { icon: Wrench, text: "Entretien, détaillage, customisation et vente" },
    { icon: Shield, text: "Équipe de professionnels certifiés et expérimentés" },
    { icon: Car, text: "Large inventaire de véhicules d'occasion de qualité" },
];

export function AboutSection() {
    return (
        <section id="about" className="relative py-16 bg-background overflow-hidden">
            {/* Decorative Background Blur */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[200px] pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-[180px] pointer-events-none" aria-hidden="true" />
            
            <div className="container px-4 md:px-8 lg:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-10">
                    {/* Left Content */}
                    <motion.div 
                        className="flex-1 space-y-6"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="space-y-3">
                            <motion.h2 
                                className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                Un centre complet à votre service
                            </motion.h2>
                            <motion.p 
                                className="text-base text-muted-foreground leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                Notre station multi-services a été conçue pour répondre à tous vos besoins automobiles. 
                                Avec plus de 35 ans d&#39;expertise, nous offrons une expérience complète et personnalisée.
                            </motion.p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-3">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-start gap-3 group"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                                >
                                    <div className="mt-0.5 p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                        <feature.icon className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm text-foreground/90 leading-relaxed flex-1">
                                        {feature.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Stats */}
                        <motion.div 
                            className="grid grid-cols-3 gap-4 pt-4 border-t"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center group cursor-default"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="inline-flex items-center justify-center mb-1.5 p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <div className="font-bold text-xl text-foreground">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div 
                        className="flex-1 relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-muted border shadow-2xl"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <Image
                            src={assets.aboutSection}
                            alt="TCT Pro Centre Automobile"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
