"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";


export function SiteHeader() {
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          DreamLayer
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/dashboard" className="text-sm hover:text-primary">Dashboard</Link>
          <Link href="/mint" className="text-sm hover:text-primary">Mint</Link>
          <Link href="/learn" className="text-sm hover:text-primary">Learn</Link>
        </nav>
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <Button variant="outline" size="sm">
            Connect
          </Button>
        </div>
      </div>
    </header>
  );
}
