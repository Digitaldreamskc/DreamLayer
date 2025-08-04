"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Wallet, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isWalletConnected, setIsWalletConnected] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#1f1f25] via-[#2c2c38] to-[#1a1a22] border-b border-neutral-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                <Link
                    href="/"
                    className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500"
                >
                    DreamLayer
                </Link>

                <div className="flex items-center gap-3">
                    {mounted && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>
                    )}

                    <Button
                        onClick={() => setIsWalletConnected(!isWalletConnected)}
                        className={isWalletConnected ? "gradient-button" : ""}
                        variant={isWalletConnected ? "default" : "outline"}
                    >
                        <Wallet className="h-4 w-4 mr-2" />
                        {isWalletConnected ? "Connected" : "Connect Wallet"}
                    </Button>
                </div>
            </div>
        </header>
    );
}
