"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Film, Play, ArrowRight, Camera, Sparkles, Sliders } from "lucide-react";
import { cinematicAudio } from "@/lib/cinematic-audio";

interface FilmStripItem {
  id: string;
  title: string;
  director: string;
  lens: string;
  shutter: string;
  lut: string;
  gradient: string;
  criticScore: number;
}

const FILMSTRIPS: FilmStripItem[] = [
  {
    id: "strip-1",
    title: "Akira Horizon",
    director: "Auteur Dramaturg v2",
    lens: "Anamorphic 40mm T2.1",
    shutter: "1/48s (180 deg)",
    lut: "Kodak 2383 D65 Print",
    gradient: "from-cyan-950 via-slate-900 to-teal-950",
    criticScore: 98.6
  },
  {
    id: "strip-2",
    title: "Europa Sub-Surface",
    director: "Auteur Dramaturg v2",
    lens: "Ultra Prime 24mm T1.9",
    shutter: "1/48s (180 deg)",
    lut: "Fuji Eterna 500T",
    gradient: "from-blue-950 via-indigo-950 to-slate-950",
    criticScore: 97.4
  },
  {
    id: "strip-3",
    title: "Atacama Salt Flats",
    director: "Auteur Dramaturg v2",
    lens: "Cooke S4/i 75mm T2.0",
    shutter: "1/96s (90 deg)",
    lut: "Bleach Bypass Custom",
    gradient: "from-amber-950 via-stone-900 to-yellow-950",
    criticScore: 99.1
  },
  {
    id: "strip-4",
    title: "Neo-Kyoto Monorail",
    director: "Auteur Dramaturg v2",
    lens: "Canon K35 35mm T1.4",
    shutter: "1/48s (180 deg)",
    lut: "Vision3 500T Tungsten",
    gradient: "from-emerald-950 via-zinc-900 to-teal-950",
    criticScore: 96.8
  }
];

export function ShowcaseReelSection() {
  const [activeItem, setActiveItem] = useState(FILMSTRIPS[0]);

  const handleSelect = (item: FilmStripItem) => {
    setActiveItem(item);
    try {
      cinematicAudio.playCue("click");
    } catch {}
  };

  const handleStudioLink = () => {
    try {
      cinematicAudio.playCue("start");
    } catch {}
  };

  return (
    <section id="showcase" className="py-24 relative overflow-hidden border-t border-white/5 bg-[#07080c]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#5fe995] mb-4">
              <Film className="w-3.5 h-3.5" />
              <span>35mm Celluloid Presets</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Cinematic Filmstrips & <br />
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#4ed4b7] to-[#7af2d9]">
                Continuous Visual Grammar
              </span>
            </h2>
          </div>

          <Link
            href="/studio"
            onClick={handleStudioLink}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#5fe995] hover:text-[#7af2d9] transition-colors self-start md:self-auto"
          >
            <span>Launch Studio Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 35mm Celluloid Sprocket Border Filmstrip Container */}
        <div className="rounded-3xl bg-[#0b0d13] border border-white/10 p-4 sm:p-6 shadow-2xl relative">
          {/* Top Sprocket Holes */}
          <div className="flex items-center justify-between gap-2 overflow-hidden pb-4 border-b border-white/10 mb-6 select-none opacity-40">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-6 rounded-sm bg-black border border-white/20 shrink-0"
              />
            ))}
          </div>

          {/* Cards Reel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FILMSTRIPS.map((item) => {
              const isSelected = activeItem.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`text-left rounded-xl overflow-hidden border transition-all duration-300 group ${
                    isSelected
                      ? "border-[#4ed4b7] shadow-xl shadow-[#4ed4b7]/15 ring-1 ring-[#4ed4b7]/40"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Thumbnail / Frame Canvas */}
                  <div
                    className={`aspect-[16/10] w-full bg-gradient-to-br ${item.gradient} p-4 flex flex-col justify-between relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>{item.lut.split(" ")[0]}</span>
                      <span className="text-[#5fe995] font-semibold">
                        Score: {item.criticScore}
                      </span>
                    </div>

                    <div className="relative z-10">
                      <span className="text-xs font-display font-semibold text-white group-hover:text-[#5fe995] transition-colors block">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {item.lens}
                      </span>
                    </div>

                    {/* Shutter Angle watermark */}
                    <div className="absolute right-2 bottom-2 text-[9px] font-mono text-white/20">
                      {item.shutter}
                    </div>
                  </div>

                  {/* Metadata Bar */}
                  <div className="p-3 bg-[#0a0c10] flex items-center justify-between text-[11px] font-mono border-t border-white/5">
                    <span className="text-zinc-400 truncate">{item.lut}</span>
                    <span className="text-xs text-[#5fe995]">READY</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Sprocket Holes */}
          <div className="flex items-center justify-between gap-2 overflow-hidden pt-6 border-t border-white/10 mt-6 select-none opacity-40">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-6 rounded-sm bg-black border border-white/20 shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Selected Preset Details Bar */}
        <div className="mt-8 rounded-2xl bg-white/[0.02] border border-white/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-400">
            <div>
              <span className="text-zinc-600 mr-2">SELECTED FILM LOOK:</span>
              <span className="text-white font-semibold">{activeItem.title}</span>
            </div>
            <div>
              <span className="text-zinc-600 mr-2">LENS PACKAGE:</span>
              <span className="text-zinc-200">{activeItem.lens}</span>
            </div>
            <div>
              <span className="text-zinc-600 mr-2">PRINT EMULATION:</span>
              <span className="text-[#5fe995]">{activeItem.lut}</span>
            </div>
          </div>

          <Link
            href="/studio"
            onClick={handleStudioLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-semibold text-black bg-gradient-to-r from-[#4ed4b7] to-[#5fe995] hover:shadow-lg hover:shadow-[#4ed4b7]/25 transition-all"
          >
            <span>Load Preset in Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
