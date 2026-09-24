"use client";

import React from "react";
import Link from "next/link";
import { Film, ArrowUpRight } from "lucide-react";
import { cinematicAudio } from "@/lib/cinematic-audio";

export function LandingFooter() {
  const handleStudioLink = () => {
    try {
      cinematicAudio.playCue("start");
    } catch {}
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#06070a] pt-20 pb-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Massive Wordmark Hero In Footer */}
        <div className="mb-16 border-b border-white/10 pb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h2 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tighter text-white">
                AUTEUR
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base font-sans mt-3 max-w-lg leading-relaxed">
                Autonomous generative cinema engine orchestrating multi-shot continuity and decentralized rendering on Livepeer.
              </p>
            </div>

            <div>
              <Link
                href="/studio"
                onClick={handleStudioLink}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold text-black bg-gradient-to-r from-[#4ed4b7] via-[#5fe995] to-[#7af2d9] shadow-xl shadow-[#4ed4b7]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Launch Director Studio</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Specs / Highlights */}
          <div id="specs" className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/5 text-xs font-mono scroll-mt-28">
            <div>
              <span className="text-zinc-500 block mb-1">NETWORK</span>
              <span className="text-white font-semibold">Livepeer Decentralized GPU</span>
            </div>
            <div>
              <span className="text-zinc-500 block mb-1">MAX RESOLUTION</span>
              <span className="text-[#5fe995] font-semibold">4K DCI (4096x2160) 24fps</span>
            </div>
            <div>
              <span className="text-zinc-500 block mb-1">INFERENCE STACK</span>
              <span className="text-white font-semibold">Wan 2.1 / CogVideoX / Flux</span>
            </div>
            <div>
              <span className="text-zinc-500 block mb-1">AUDIT PIPELINE</span>
              <span className="text-[#5fe995] font-semibold">Dual-Pass Visual Critic</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#5fe995]" />
            <span>AUTEUR // LIVEPEER CREATIVE AGENT</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/studio"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Direct Studio
            </Link>
            <a
              href="https://livepeer.org"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Livepeer Network</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="#primitives"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Studio Primitives
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
