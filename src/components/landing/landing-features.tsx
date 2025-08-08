"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Wallet, 
  Calendar, 
  PaintBucket, 
  FileCode, 
  GraduationCap, 
  Shield 
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card className="holographic-card">
        <CardContent className="pt-6">
          <div className="mb-4 rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function LandingFeatures() {
  const features = [
    {
      icon: <Wallet className="h-6 w-6 text-primary" />,
      title: "Multi-Chain Wallet",
      description: "Seamlessly connect and manage assets with our integrated wallet.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: "Event Check-ins",
      description: "Attend exclusive events and collect POAPs that earn you points and special rewards.",
    },
    {
      icon: <PaintBucket className="h-6 w-6 text-primary" />,
      title: "Dynamic NFT Minting",
      description: "Create and mint unique, evolving NFTs with Irys permanent storage integration.",
    },
    {
      icon: <FileCode className="h-6 w-6 text-primary" />,
      title: "IP Registration",
      description: "Register and protect your digital creations with Story Protocol integration.",
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-primary" />,
      title: "Learning Quests",
      description: "Complete interactive tutorials to earn rewards while mastering Web3 concepts.",
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Secure Transactions",
      description: "Enterprise-grade security for all your transactions and digital assets.",
    },
  ];

  return (
    <section className="container py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
          Unlock Your Full Potential 
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
          LAYER combines cutting-edge blockchain technologies to create a seamless dynamic experience
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={index * 0.1}
          />
        ))}
      </div>
    </section>
  );
}