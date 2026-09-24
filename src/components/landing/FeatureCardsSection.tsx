"use client";

import React, { useState } from "react";
import {
  Cpu,
  Layers,
  Film,
  Sparkles,
  ArrowRight,
  Globe,
  Sliders,
  CheckCircle2,
  Volume2
} from "lucide-react";
import Link from "next/link";
import { cinematicAudio } from "@/lib/cinematic-audio";

interface StudioPrimitive {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  highlightMetric: string;
  highlightLabel: string;
  specs: { label: string; value: string }[];
  accentColor: string;
}

const PRIMITIVES: StudioPrimitive[] = [
  {
    id: "swarm",
    tag: "DECENTRALIZED INFERENCE",
    title: "Livepeer GPU Agent Swarm",
    subtitle: "Parallel Multi-Model Orchestration",
    description:
      "Dispatches prompt breakdowns across decentralized Livepeer orchestrator nodes. Simultaneously renders visual keyframes, motion diffusion, and procedural TTS narration with zero centralized bottlenecks.",
    highlightMetric: "4.2x",
    highlightLabel: "Parallel Speedup vs Single Node",
    specs: [
      { label: "Endpoint", value: "agent.livepeer.org/api/mcp/creative" },
      { label: "Models", value: "Wan 2.1 · CogVideoX-5B · Flux-Dev" },
      { label: "Audio", value: "Livepeer Neural TTS Pipeline" },
    ],
    accentColor: "#4ed4b7",
  },
  {
    id: "narrative",
    tag: "NARRATIVE ARCHITECTURE",
    title: "Autonomous 5-Act Cinema Engine",
    subtitle: "Pacing Curves & Beat Synchronization",
    description:
      "Translates unstructured briefs into structured dramatic acts: Ingest, Script Breakdown, Soundstage Voicing, NLE Assembly, and Worldwide Delivery. Every beat enforces visual continuity and cadence.",
    highlightMetric: "5 Acts",
    highlightLabel: "Deterministic Cinema Structure",
    specs: [
      { label: "Progression", value: "Prologue → Climax → Resolution" },
      { label: "Continuity", value: "Dual-Pass Visual Critic Check" },
      { label: "Audio Sync", value: "Word-Locked Timeline Anchors" },
    ],
    accentColor: "#7af2d9",
  },
  {
    id: "nle",
    tag: "POST-PRODUCTION",
    title: "60 FPS Hardware Composited NLE",
    subtitle: "Sub-Frame Precision & Real-Time Scrubber",
    description:
      "Built on direct HTML5 canvas refs and GPU compositor layers. Enables zero-latency timeline scrubbing, authentic 35mm celluloid grain emulation, and calibrated film LUTs without React re-render lag.",
    highlightMetric: "60.0 FPS",
    highlightLabel: "Locked Compositor Rate",
    specs: [
      { label: "Aspect Ratios", value: "2.39:1 Anamorphic · 16:9 DCI" },
      { label: "Color Science", value: "Kodak 2383 · Fuji Eterna 500T" },
      { label: "Transport", value: "Interactive Multi-Act Needle" },
    ],
    accentColor: "#5fe995",
  },
  {
    id: "release",
    tag: "DISTRIBUTION",
    title: "Territorial Release Packaging",
    subtitle: "Instant Localization & Metadata Vault",
    description:
      "Packages final master cuts with territory-specific key art, localized marketing copy, and multi-track audio for global theatrical delivery across Tokyo, Berlin, Paris, and Hollywood markets.",
    highlightMetric: "Global",
    highlightLabel: "Four Major Theatrical Territories",
    specs: [
      { label: "Key Art", value: "Prompt-Derived Anamorphic Stills" },
      { label: "Deliverables", value: "SMPTE Master / H.264 MP4" },
      { label: "Verification", value: "C2PA Provenance Manifests" },
    ],
    accentColor: "#e8c76d",
  },
];

export function FeatureCardsSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleHover = (id: string) => {
    setHoveredCard(id);
    try {
      cinematicAudio.playCue("hover");
    } catch {}
  };

  return (
    <section id="primitives" className="py-24 relative overflow-hidden border-t border-white/5 bg-[#06080d]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#5fe995] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Primitives</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight mb-4">
            Engineered for Modern Filmmakers, <br />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#4ed4b7] to-[#e8c76d]">
              Powered by Livepeer Subnets
            </span>
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base font-sans leading-relaxed">
            Deterministic execution, production rigor, and multi-model Livepeer orchestration.
          </p>
        </div>

        {/* 2x2 Tactile Primitives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRIMITIVES.map((item) => {
            const isHovered = hoveredCard === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => handleHover(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between ${
                  isHovered
                    ? "bg-[#0c0f17] border-white/25 shadow-2xl shadow-black/80 -translate-y-1"
                    : "bg-[#090b10]/80 border-white/10 hover:border-white/15"
                }`}
              >
                {/* Top Tag & Metric Pill */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-semibold">
                      {item.tag}
                    </span>

                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 font-mono text-xs">
                      <span className="text-white font-bold" style={{ color: item.accentColor }}>
                        {item.highlightMetric}
                      </span>
                      <span className="text-zinc-500 text-[10px] hidden sm:inline">
                        · {item.highlightLabel}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono text-[#5fe995]/80 mb-4">
                    {item.subtitle}
                  </p>

                  <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Specs List */}
                <div className="pt-5 border-t border-white/10 space-y-2 font-mono text-xs">
                  {item.specs.map((spec, i) => (
                    <div key={i} className="flex items-center justify-between text-zinc-400">
                      <span className="text-zinc-500 text-[11px]">{spec.label}</span>
                      <span className="text-zinc-200 text-[11px] font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Strip */}
        <div className="mt-12 p-6 rounded-2xl bg-[#090b10]/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            <span>Livepeer Creative MCP Subnet Online</span>
          </div>

          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-semibold text-black bg-gradient-to-r from-[#4ed4b7] to-[#5fe995] hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
