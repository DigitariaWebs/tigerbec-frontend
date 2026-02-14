"use client";

import Link from "next/link";
import { RoundedButton } from "@/components/ui/rounded-button";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { motion } from "framer-motion";
import { DynamicMap } from "@/components/dynamic-imports";

export function ContactSection() {
    const contactInfo = [
        {
            icon: Phone,
            title: "Téléphone",
            content: "(514) 494-3795",
            link: "tel:+15144943795",
        },
        {
            icon: Mail,
            title: "Email",
            content: "info@tigerbecars.ca",
            link: "mailto:info@tigerbecars.ca",
        },
        {
            icon: MapPin,
            title: "Adresse",
            content: "11760 5e Avenue, Montréal, QC H1E 2X4",
            link: "https://www.google.com/maps/search/?api=1&query=11760+5e+Avenue+Montreal+QC+H1E+2X4",
        },
        {
            icon: Clock,
            title: "Heures d'ouverture",
            content: "Tous les jours, 8:00 - 18:00",
            link: null,
        },
    ];

    return (
        <section id="contact" className="relative py-20 bg-linear-to-b from-background to-muted/30 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
            
            <div className="container px-4 md:px-6 mx-auto relative z-10">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Contactez-nous
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Notre équipe est à votre disposition pour répondre à toutes vos questions 
                        et vous accompagner dans votre projet automobile.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Cards */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {contactInfo.map((info, index) => (
                                <motion.div
                                    key={info.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    {info.link ? (
                                        <Link 
                                            href={info.link}
                                            target={info.link.startsWith("http") ? "_blank" : undefined}
                                            className="block h-full"
                                        >
                                            <div className="h-full bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:border-primary/50 group">
                                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                                    <info.icon className="h-6 w-6" />
                                                </div>
                                                <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                                                <p className="text-sm text-muted-foreground">{info.content}</p>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="h-full bg-card border border-border rounded-2xl p-6 shadow-lg">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                                                <info.icon className="h-6 w-6" />
                                            </div>
                                            <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                                            <p className="text-sm text-muted-foreground">{info.content}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <RoundedButton 
                                size="lg" 
                                href="tel:+15144943795" 
                                variant="solid"
                                className="flex-1"
                            >
                                <Phone className="mr-2 h-5 w-5" />
                                Appeler maintenant
                            </RoundedButton>
                            <RoundedButton 
                                size="lg" 
                                href="mailto:info@tigerbecars.ca" 
                                variant="default"
                                className="flex-1"
                            >
                                <Send className="mr-2 h-5 w-5" />
                                Envoyer un message
                            </RoundedButton>
                        </motion.div>
                    </div>

                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="h-125 w-full"
                    >
                        <DynamicMap 
                            center={[-73.5698, 45.5236]}
                            zoom={15}
                            markerTitle="Tiger Be Cars"
                            markerDescription="11760 5e Avenue, Montréal, QC H1E 2X4"
                            className="shadow-2xl border border-border"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
