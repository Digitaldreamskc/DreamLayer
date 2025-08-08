"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import {
    LayoutDashboard,
    Calendar,
    PaintBucket,
    GraduationCap,
    Trophy,
    User,
    Settings,
} from "lucide-react"

const navItems = [
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
        title: "Creators Studio", // updated title
        href: "/studio", // ✅ updated href from /nfts to /studio
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
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-56 min-h-screen bg-black/50 backdrop-blur-lg border-r border-white/10 py-8 px-4 space-y-4">
            <nav className="space-y-2">
                {navItems.map(({ title, href, icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow"
                                    : "text-white/70 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {icon}
                            <span>{title}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
