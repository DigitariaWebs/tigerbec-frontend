"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Car, Wallet, User, Wrench, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { RoundedButton } from "@/components/ui/rounded-button"
import { assets } from "@/config/assets"

interface NavItem {
    name: string
    url: string
    icon: React.ElementType
}

const navItems: NavItem[] = [
    { name: 'À Propos', url: '#about', icon: User },
    { name: 'Services', url: '#services', icon: Wrench },
    { name: 'Véhicules', url: '#vehicles', icon: Car },
    { name: 'Financement', url: '#financing', icon: Wallet },
    { name: 'Contact', url: '#contact', icon: Phone }
];

export function LandingNavbar() {
    const [activeTab, setActiveTab] = useState(navItems[0].name)

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-40% 0px -40% 0px",
            threshold: 0,
        }

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id
                    const navItem = navItems.find((item) => item.url === `#${id}`)
                    if (navItem) {
                        setActiveTab(navItem.name)
                    }
                }
            })
        }

        const observer = new IntersectionObserver(observerCallback, observerOptions)

        navItems.forEach((item) => {
            if (item.url.startsWith("#")) {
                const element = document.getElementById(item.url.substring(1))
                if (element) {
                    observer.observe(element)
                }
            }
        })

        return () => {
            observer.disconnect()
        }
    }, [])

    return (
        <>
            {/* Desktop Navbar - Fixed at top */}
            <header className="fixed top-0 left-0 right-0 z-40 hidden md:block pointer-events-none">
                <div className="container mx-auto px-4 py-4 relative flex items-center">
                    {/* Logo - Left */}
                    <div className="flex-1">
                        <Link href="/" className="pointer-events-auto flex items-center w-fit">
                            <img
                                src={assets.logo}
                                alt="TCT Pro Logo"
                                className="h-12 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Navigation Links - Center (Absolutely positioned) */}
                    <nav className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-full border px-2 py-2 shadow-lg backdrop-blur-xl bg-background/80 dark:bg-background/25 border-border/50 dark:border-border/60">
                        {navItems.map((item) => {
                            const isActive = activeTab === item.name

                            return (
                                <Link
                                    key={item.name}
                                    href={item.url}
                                    onClick={() => setActiveTab(item.name)}
                                    className={cn(
                                        "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                                        "text-foreground/90 hover:text-primary",
                                        isActive && "bg-muted text-primary",
                                    )}
                                >
                                    {item.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="lamp-desktop"
                                            className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10 pointer-events-none"
                                            initial={false}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 30,
                                            }}
                                        >
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full pointer-events-none">
                                                <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2 pointer-events-none" />
                                                <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1 pointer-events-none" />
                                                <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2 pointer-events-none" />
                                            </div>
                                        </motion.div>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Login Button & Theme Toggle - Right */}
                    <div className="flex-1 flex items-center justify-end gap-3">
                        <div className="pointer-events-auto flex items-center gap-3">
                        <ModeToggle />
                            <RoundedButton
                                variant="default"
                                className="h-10 px-6 bg-background/80 text-foreground backdrop-blur-md hover:bg-background/90"
                                href="/sign-in"
                            >
                                Se connecter
                            </RoundedButton>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navbar - Fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden pointer-events-none">
                <div className="container mx-auto px-4 pb-4">
                    <nav className="pointer-events-auto flex items-center justify-around gap-0.5 rounded-full border px-1.5 py-1.5 shadow-lg backdrop-blur-xl bg-background/80 dark:bg-background/25 border-border/50 dark:border-border/60">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = activeTab === item.name

                            return (
                                <Link
                                    key={item.name}
                                    href={item.url}
                                    onClick={() => setActiveTab(item.name)}
                                    className={cn(
                                        "relative cursor-pointer flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-full transition-colors",
                                        "text-foreground/90 hover:text-primary",
                                        isActive && "bg-muted text-primary",
                                    )}
                                >
                                    <Icon size={18} strokeWidth={2.5} />
                                    <span className="text-[10px] font-medium leading-tight">{item.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="lamp-mobile"
                                            className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10 pointer-events-none"
                                            initial={false}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 30,
                                            }}
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </div>

            {/* Mobile Header - Logo and Actions */}
            <header className="fixed top-0 left-0 right-0 z-40 md:hidden pointer-events-none bg-background/80 backdrop-blur-xl border-b border-border/30">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="pointer-events-auto flex items-center">
                        <img
                            src={assets.logo}
                            alt="TCT Pro Logo"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>
                    <div className="pointer-events-auto flex items-center gap-2">
                        <ModeToggle />
                        <RoundedButton
                            variant="default"
                            size="sm"
                            className="h-9 px-4 bg-background/80 text-foreground backdrop-blur-md hover:bg-background/90"
                            href="/sign-in"
                        >
                            Connexion
                        </RoundedButton>
                    </div>
                </div>
            </header>
        </>
    )
}
