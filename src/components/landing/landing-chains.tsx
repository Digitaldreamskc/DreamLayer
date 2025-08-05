'use client';

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export function LandingChains() {
  const chains = [
    {
      name: "Base",
      logo: "https://cryptologos.cc/logos/base-logo.png",
      description: "Ethereum L2 scaling solution for secure, affordable transactions.",
    },
    {
      name: "Story Protocol",
      logo: "https://pbs.twimg.com/profile_images/1618988503559921664/2wYx1Lyk_400x400.jpg",
      description: "IP registration and licensing for digital content and NFTs.",
    },
    {
      name: "Irys",
      logo: "https://assets-global.website-files.com/64529178f54cf5c6f8abe958/64bcd19bd0a5b68f6e9f1f24_IRYS_GRADIENT.png",
      description: "Permanent decentralized storage for your NFT assets and metadata.",
    },
  ];

  return (
    <section className="bg-muted/50 py-24">
      <div className="container">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Supported Technologies
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            DreamLayer integrates cutting-edge blockchain infrastructure
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chains.map((chain, index) => (
            <motion.div 
              key={chain.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full holographic-card">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-background flex items-center justify-center">
                    <img 
                      src={chain.logo} 
                      alt={chain.name} 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{chain.name}</h3>
                  <p className="text-muted-foreground">{chain.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
