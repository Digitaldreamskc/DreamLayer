// src/app/nfts/page.tsx
"use client";

import DynamicNFTDashboard from "@/components/DynamicNFTDashboard";

export default function NFTPage() {
    return (
        <main className="min-h-screen px-4 md:px-8 py-12 bg-gradient-to-br from-slate-900 to-black text-white">
            <DynamicNFTDashboard />
        </main>
    );
}
