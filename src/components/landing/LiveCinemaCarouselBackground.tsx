"use client";

import React, { memo } from "react";

/**
 * Atmospheric Cinema Background
 * Features volumetric anamorphic horizon illumination, authentic 35mm celluloid
 * film grain, and subtle ambient depth without high-frequency DOM re-renders
 * or click-intercepting elements.
 */
export const LiveCinemaCarouselBackground = memo(function LiveCinemaCarouselBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#07090e]"
      aria-hidden="true"
    >
      {/* 1. Deep Volumetric Cinema Horizon Rays */}
      <div
        className="absolute top-0 inset-x-0 h-[650px] pointer-events-none opacity-25"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(78, 212, 183, 0.35) 0%, rgba(122, 242, 217, 0.1) 45%, transparent 75%)",
        }}
      />

      {/* 2. Secondary Amber Warmth from Bottom-Right */}
      <div
        className="absolute -bottom-32 right-0 w-[500px] h-[500px] pointer-events-none opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(232, 199, 109, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* 3. Deep Center Radial Vignette for Maximum Foreground Contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(7, 9, 14, 0.4) 10%, rgba(7, 9, 14, 0.95) 85%)",
        }}
      />

      {/* 4. Subtle 35mm Physical Celluloid Film Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 5. Minimal Horizontal Anamorphic Horizon Flare Line */}
      <div
        className="absolute top-[220px] inset-x-0 h-px pointer-events-none opacity-20"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(78,212,183,0.1) 20%, rgba(122,242,217,0.6) 50%, rgba(78,212,183,0.1) 80%, transparent 100%)",
        }}
      />
    </div>
  );
});
