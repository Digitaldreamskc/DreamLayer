"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingCTA() {
  return (
    <section className="py-24">
      <div className="container">
        <motion.div 
          className="relative overflow-hidden rounded-3xl px-6 py-16 sm:px-12 sm:py-24 md:py-32 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border border-primary/20 holographic-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2 
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Ready For A New Experience?
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground mb-10 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join LAYER today and explore a new world of blockchain possibilities, from dynamic NFTs to exclusive events.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Button asChild size="lg" className="gradient-button">
                <Link href="/dashboard">
                  Launch App <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}