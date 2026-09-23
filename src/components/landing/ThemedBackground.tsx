"use client";

import React, { useState } from "react";
import { LiveCinemaCarouselBackground } from "./LiveCinemaCarouselBackground";
import { ThreeBackground } from "./ThreeBackground";
import { Film, Activity } from "lucide-react";

export function ThemedBackground() {
  const [backgroundMode, setBackgroundMode] = useState<"carousel" | "webgl">("carousel");

  return (
    <>
      {/* Active Background Engine */}
      {backgroundMode === "carousel" ? (
        <LiveCinemaCarouselBackground />
      ) : (
        <ThreeBackground />
      )}

      {/* Floating Theme Controller in Bottom Right */}
      <aside
        aria-label="Background Engine Switcher"
        className="fixed bottom-5 right-5 z-40 hidden sm:flex items-center gap-1.5 p-1.5 rounded-full bg-[#090b10]/90 border border-white/15 backdrop-blur-2xl shadow-2xl text-[11px] font-mono select-none"
      >
        <span className="px-2 text-zinc-400 flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 text-[#4ed4b7]" />
          <span>Stage:</span>
        </span>

        <button
          onClick={() => setBackgroundMode("carousel")}
          className={`px-3 py-1 rounded-full transition-all ${
            backgroundMode === "carousel"
              ? "bg-gradient-to-r from-[#4ed4b7]/30 to-[#5fe995]/20 text-[#5fe995] border border-[#4ed4b7]/50 shadow-md font-semibold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Live Filmstrip Reels
        </button>

        <button
          onClick={() => setBackgroundMode("webgl")}
          className={`px-3 py-1 rounded-full transition-all ${
            backgroundMode === "webgl"
              ? "bg-gradient-to-r from-[#4ed4b7]/30 to-[#5fe995]/20 text-[#5fe995] border border-[#4ed4b7]/50 shadow-md font-semibold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Three.js 3D Grid
        </button>
      </aside>
    </>
  );
}
