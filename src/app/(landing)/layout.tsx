import { LandingNavbar } from "@/components/landing-navbar";

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
            {/* Navbar - handles all navigation, logo, and actions */}
            <LandingNavbar />

            {/* Main Content */}
            <main className="flex-1 pt-0">{children}</main>
        </div>
    );
}
