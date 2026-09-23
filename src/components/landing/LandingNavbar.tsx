"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Film, Cpu, Layers, Sparkles } from "lucide-react";
import { cinematicAudio } from "@/lib/cinematic-audio";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleStudioClick = () => {
    try {
      cinematicAudio.playCue("start");
    } catch {}
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4 sm:pt-6 pointer-events-none">
      <div
        className={`max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 rounded-full border transition-all duration-300 pointer-events-auto ${
          scrolled
            ? "bg-[#0a0c11]/85 border-white/15 backdrop-blur-xl shadow-2xl shadow-black/60"
            : "bg-[#0e1117]/60 border-white/10 backdrop-blur-md"
        }`}
      >
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4ed4b7]/30 to-[#7af2d9]/10 border border-[#4ed4b7]/40 flex items-center justify-center transition-transform group-hover:scale-105">
            <Film className="w-4 h-4 text-[#5fe995]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold tracking-tight text-base sm:text-lg text-white">
              AUTEUR
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#4ed4b7]/10 text-[#5fe995] border border-[#4ed4b7]/30 font-medium">
              Livepeer Agent
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-xs font-mono tracking-wider">
          <a
            href="#features"
            className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Features
          </a>
          <a
            href="#pipeline"
            className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Agent Engine
          </a>
          <a
            href="#showcase"
            className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Filmstrips
          </a>
          <a
            href="#benchmarks"
            className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Specs
          </a>
        </nav>

        {/* Launch Studio CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            onClick={handleStudioClick}
            className="relative inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold text-black bg-gradient-to-r from-[#4ed4b7] via-[#5fe995] to-[#7af2d9] shadow-lg shadow-[#4ed4b7]/25 hover:shadow-[#4ed4b7]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
