"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function LandingHero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-10" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute left-0 right-0 top-0 bottom-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>
      
      <div className="container relative z-20 flex flex-col items-center justify-center min-h-[90vh] px-4 py-32 text-center md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            Introducing LAYER - A Dynamic Platform
          </div>
        </motion.div>
        
        <motion.h1 
          className="font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
            Your Gateway to
          </span>
          <span className="block">Experiences</span>
        </motion.h1>
        
        <motion.p 
          className="max-w-2xl text-muted-foreground text-lg sm:text-xl md:text-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Connect, create, and collect across Base, and Story Protocol.
          Mint dynamic NFTs, attend exclusive events, and learn Web3.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button asChild size="lg" className="gradient-button">
            <Link href="/dashboard">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/learn">
              Learn More
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}