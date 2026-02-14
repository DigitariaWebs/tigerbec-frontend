"use client"

import { Car, Wallet, User, Wrench, Phone } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"

export function LandingNavbar({ className }: { className?: string }) {
    const navItems = [
        { name: 'À Propos', url: '#about', icon: User },
        { name: 'Services', url: '#services', icon: Wrench },
        { name: 'Véhicules', url: '#vehicles', icon: Car },
        { name: 'Financement', url: '#financing', icon: Wallet },
        { name: 'Contact', url: '#contact', icon: Phone }
    ];

    return <NavBar items={navItems} className={className} />
}
