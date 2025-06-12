"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Calendar,
    PaintBucket,
    GraduationCap,
    Trophy,
    User,
    Settings,
} from "lucide-react";

interface NavItem {
    title: string;
    href: string;
    icon: React.ReactNode;
}

export function DashboardNav() {
    const pathname = usePathname();

    const navItems: NavItem[] = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
            title: "Events",
            href: "/events",
            icon: <Calendar className="h-4 w-4" />,
        },
        {
            title: "Creative Studio",
            href: "/nfts",
            icon: <PaintBucket className="h-4 w-4" />,
        },
        {
            title: "Learn",
            href: "/learn",
            icon: <GraduationCap className="h-4 w-4" />,
        },
        {
            title: "Rewards",
            href: "/rewards",
            icon: <Trophy className="h-4 w-4" />,
        },
        {
            title: "Profile",
            href: "/profile",
            icon: <User className="h-4 w-4" />,
        },
        {
            title: "Settings",
            href: "/settings",
            icon: <Settings className="h-4 w-4" />,
        },
    ];

        
        

    return (
        <nav className="grid items-start gap-2 px-4 py-6 text-white">
            {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "group flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200",
                            isActive
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow"
                                : "hover:bg-white/10 hover:text-white/90 text-white/70"
                        )}
                    >
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
