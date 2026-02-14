"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import {
	FacebookIcon,
	InstagramIcon,
	YoutubeIcon,
	TwitterIcon,
} from 'lucide-react';
import { Button } from './button';
import Image from 'next/image';
import { assets } from '@/config/assets';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}
interface FooterLinkGroup {
	label: string;
	links: FooterLink[];
}

type StickyFooterProps = React.ComponentProps<'footer'>;

export function StickyFooter({ className, ...props }: StickyFooterProps) {
	return (
		<footer
			className={cn('relative w-full md:h-[720px] md:[clip-path:polygon(0%_0,100%_0%,100%_100%,0_100%)]', className)}
			{...props}
		>
			<div className="w-full md:fixed md:bottom-0 md:h-[720px]">
				<div className="md:sticky md:top-[calc(100vh-720px)] md:h-full overflow-y-auto">
					<div className="relative flex size-full flex-col justify-between gap-5 border-t px-4 py-8 md:px-12">
						<div
							aria-hidden
							className="absolute inset-0 isolate z-0 contain-strict"
						>
							<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full" />
							<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full" />
							<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full" />
						</div>
						<div className="mt-6 flex flex-col gap-6 md:mt-10 md:flex-row md:gap-8 xl:mt-0">
							<AnimatedContainer className="w-full md:max-w-sm md:min-w-2xs space-y-4">
							<div className="flex items-center gap-3">
								<Image
									src={assets.logo}
									alt="Tiger Be Cars Logo"
									width={48}
									height={48}
									className="object-contain"
								/>
									<span className="text-2xl font-bold">Tiger Be Cars</span>
								</div>
								<p className="text-muted-foreground mt-8 text-sm md:mt-0">
									Votre destination de confiance pour les véhicules d&apos;occasion de qualité à Montréal. 
									Nous offrons une sélection exceptionnelle de véhicules inspectés et des services complets.
								</p>
								<div className="flex gap-2">
									{socialLinks.map((link) => (
										<Button key={link.title} size="icon" variant="outline" className="size-8" asChild>
											<a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.title}>
												<link.icon className="size-4" />
											</a>
										</Button>
									))}
								</div>
							</AnimatedContainer>
							<div className="grid grid-cols-2 gap-x-4 gap-y-6 md:contents">
								{footerLinkGroups.map((group, index) => (
									<AnimatedContainer
										key={group.label}
										delay={0.1 + index * 0.1}
										className="w-full"
									>
										<div className="mb-0 md:mb-0">
											<h3 className="text-sm uppercase font-semibold">{group.label}</h3>
											<ul className="text-muted-foreground mt-3 space-y-1.5 text-xs md:mt-4 md:space-y-2 md:text-xs lg:text-sm">
												{group.links.map((link) => (
													<li key={link.title}>
														<a
															href={link.href}
															className="hover:text-foreground inline-flex items-center transition-all duration-300"
														>
															{link.icon && <link.icon className="me-1 size-4" />}
															{link.title}
														</a>
													</li>
												))}
											</ul>
										</div>
									</AnimatedContainer>
								))}
							</div>
						</div>
						<div className="text-muted-foreground flex flex-col items-center justify-between gap-2 border-t pt-4 pb-16 md:pb-2 text-xs md:text-sm md:flex-row">
							<p>© 2026 Tiger Be Cars. Tous droits réservés.</p>
							<p>11760 5e Avenue, Montréal, QC H1E 2X4</p>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

const socialLinks = [
	{ title: 'Facebook', href: 'https://facebook.com', icon: FacebookIcon },
	{ title: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
	{ title: 'Youtube', href: 'https://youtube.com', icon: YoutubeIcon },
	{ title: 'Twitter', href: 'https://twitter.com', icon: TwitterIcon },
];

const footerLinkGroups: FooterLinkGroup[] = [
	{
		label: 'Services',
		links: [
			{ title: 'Véhicules d\'occasion', href: '#inventory' },
			{ title: 'Mécanique', href: '#services' },
			{ title: 'Carrosserie', href: '#services' },
			{ title: 'Financement', href: '#financing' },
			{ title: 'Assurance', href: '#' },
			{ title: 'Garantie', href: '#' },
			{ title: 'Inspection pré-achat', href: '#' },
			{ title: 'Échange de véhicule', href: '#' },
		],
	},
	{
		label: 'Inventaire',
		links: [
			{ title: 'Voitures compactes', href: '#inventory' },
			{ title: 'Berlines', href: '#inventory' },
			{ title: 'VUS', href: '#inventory' },
			{ title: 'Camionnettes', href: '#inventory' },
			{ title: 'Véhicules luxe', href: '#inventory' },
			{ title: 'Véhicules sport', href: '#inventory' },
			{ title: 'Véhicules électriques', href: '#inventory' },
			{ title: 'Nouveautés', href: '#inventory' },
		],
	},
	{
		label: 'Ressources',
		links: [
			{ title: 'Guide d\'achat', href: '#' },
			{ title: 'Conseils d\'entretien', href: '#' },
			{ title: 'Blog', href: '#' },
			{ title: 'FAQ', href: '#' },
			{ title: 'Calculateur de paiement', href: '#' },
			{ title: 'Demande de financement', href: '#' },
			{ title: 'Rendez-vous service', href: '#' },
			{ title: 'Témoignages clients', href: '#' },
		],
	},
	{
		label: 'Entreprise',
		links: [
			{ title: 'À propos', href: '#' },
			{ title: 'Notre équipe', href: '#' },
			{ title: 'Carrières', href: '#' },
			{ title: 'Contactez-nous', href: '#contact' },
			{ title: 'Heures d\'ouverture', href: '#contact' },
			{ title: 'Politique de confidentialité', href: '#' },
			{ title: 'Conditions d\'utilisation', href: '#' },
			{ title: 'Politique de retour', href: '#' },
		],
	},
];

type AnimatedContainerProps = React.ComponentProps<typeof motion.div> & {
	children?: React.ReactNode;
	delay?: number;
};

function AnimatedContainer({
	delay = 0.1,
	children,
	className,
	...props
}: AnimatedContainerProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	);
}
