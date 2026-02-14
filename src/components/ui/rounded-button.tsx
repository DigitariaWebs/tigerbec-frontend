"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { VariantProps, cva } from "class-variance-authority";
import Link from 'next/link';

const buttonVariants = cva(
    "relative group border text-foreground mx-auto text-center rounded-full inline-flex items-center justify-center cursor-pointer transition-all duration-200 font-medium",
    {
        variants: {
            variant: {
                default: "bg-primary/5 hover:bg-primary/10 border-primary/40 text-foreground hover:text-primary dark:text-primary dark:border-primary/20",
                solid: "bg-primary hover:bg-primary/90 text-primary-foreground border-transparent hover:border-foreground/50",
                ghost: "border-transparent bg-transparent hover:border-primary/20 hover:bg-primary/5 text-foreground/80 hover:text-primary dark:text-primary/80",
            },
            size: {
                default: "px-7 py-1.5 text-sm",
                sm: "px-4 py-0.5 text-xs",
                lg: "px-10 py-2.5 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface RoundedButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    glow?: boolean;
    href?: string;
}

const RoundedButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, RoundedButtonProps>(
    ({ className, glow = true, size, variant, children, href, ...props }, ref) => {

        const content = (
            <>
                {/* Top glow effect */}
                {glow && (
                    <span 
                        className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-linear-to-r w-3/4 mx-auto from-transparent dark:via-primary via-primary to-transparent pointer-events-none" 
                        aria-hidden="true"
                    />
                )}
                
                {/* Content */}
                <span className="relative z-10 flex items-center gap-2">
                    {children}
                </span>
                
                {/* Bottom glow effect */}
                {glow && (
                    <span 
                        className="absolute group-hover:opacity-30 opacity-0 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-linear-to-r w-3/4 mx-auto from-transparent dark:via-primary via-primary to-transparent pointer-events-none" 
                        aria-hidden="true"
                    />
                )}
            </>
        );

        if (href) {
            return (
                <Link
                    href={href}
                    className={cn(buttonVariants({ variant, size }), className)}
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
                >
                    {content}
                </Link>
            )
        }

        return (
            <button
                className={cn(buttonVariants({ variant, size }), className)}
                ref={ref as React.Ref<HTMLButtonElement>}
                {...props}
            >
                {content}
            </button>
        );
    }
)

RoundedButton.displayName = 'RoundedButton';

export { RoundedButton, buttonVariants };
