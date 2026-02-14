"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { VariantProps, cva } from "class-variance-authority";
import Link from 'next/link';

const buttonVariants = cva(
    "relative group border text-foreground mx-auto text-center rounded-full inline-flex items-center justify-center cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-primary/5 hover:bg-primary/10 border-primary/40 text-foreground hover:text-primary dark:text-primary dark:border-primary/20",
                solid: "bg-primary hover:bg-primary/90 text-primary-foreground border-transparent hover:border-foreground/50 transition-all duration-200",
                ghost: "border-transparent bg-transparent hover:border-primary/20 hover:bg-primary/5 text-foreground/80 hover:text-primary dark:text-primary/80",
            },
            size: {
                default: "px-7 py-1.5 ",
                sm: "px-4 py-0.5 ",
                lg: "px-10 py-2.5 ",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    neon?: boolean;
    href?: string;
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
    ({ className, neon = true, size, variant, children, href, ...props }, ref) => {

        const content = (
            <>
                <span className={cn("absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 inset-y-0 bg-gradient-to-r w-3/4 mx-auto from-transparent dark:via-primary via-primary to-transparent pointer-events-none hidden", neon && "block")} />
                {children}
                <span className={cn("absolute group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent dark:via-primary via-primary to-transparent pointer-events-none hidden", neon && "block")} />
            </>
        );

        if (href) {
            return (
                <Link
                    href={href}
                    className={cn(buttonVariants({ variant, size }), className)}
                    {...(props as React.ComponentProps<typeof Link>)}
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

Button.displayName = 'Button';

export { Button, buttonVariants };
