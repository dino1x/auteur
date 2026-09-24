"use client";

import React from "react";
import { LiveCinemaCarouselBackground } from "@/components/landing/LiveCinemaCarouselBackground";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AgentPipelineSection } from "@/components/landing/AgentPipelineSection";
import { FeatureCardsSection } from "@/components/landing/FeatureCardsSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#07090e] text-zinc-100 overflow-x-hidden selection:bg-[#4ed4b7]/30 selection:text-[#5fe995]">
      {/* Dynamic Themed Background: Atmospheric Volumetric Cinema Illumination & 35mm Celluloid Grain */}
      <LiveCinemaCarouselBackground />

      {/* Content Container */}
      <div className="relative z-10">
        <LandingNavbar />
        <HeroSection />
        <AgentPipelineSection />
        <FeatureCardsSection />
        <LandingFooter />
      </div>
    </main>
  );
}
