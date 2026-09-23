"use client";

import React, { useState } from "react";
import {
  Layers,
  Sparkles,
  Sliders,
  Cpu,
  Eye,
  Film,
  Zap,
  ShieldCheck,
  SplitSquareVertical,
  Camera,
  Activity,
  DownloadCloud
} from "lucide-react";
import { cinematicAudio } from "@/lib/cinematic-audio";

interface FeatureCard {
  title: string;
  category: string;
  description: string;
  stat: string;
  statLabel: string;
  icon: React.ElementType;
}

const FEATURES: FeatureCard[] = [
  {
    title: "Livepeer Innovation Playbooks",
    category: "PLAYBOOK ENGINE",
    description:
      "One-click agent playbooks inspired by Livepeer Hero Templates: Muse reference-to-creation, 3-act narrative cinema, breaking-news broadcast, and fashion lookbooks.",
    stat: "5 Hero",
    statLabel: "Agent Playbooks",
    icon: Sparkles
  },
  {
    title: "Livepeer Shot Ledger",
    category: "COMPUTE TELEMETRY",
    description:
      "Pre-flight compute estimation and orchestrator node verification. Inspect model capabilities, node addresses, and cost breakdown before committing spend.",
    stat: "$0.04",
    statLabel: "Cost Per Shot",
    icon: Cpu
  },
  {
    title: "Iterative Visual Critic",
    category: "AGENT INTELLIGENCE",
    description:
      "Autonomous evaluator audits every frame against past shots for lighting vector drift, character anatomy coherence, and chromatic balance.",
    stat: "99.4%",
    statLabel: "Continuity Lock",
    icon: Eye
  },
  {
    title: "Decentralized Livepeer Swarm",
    category: "INFRASTRUCTURE",
    description:
      "Spins up distributed GPU nodes across the Livepeer AI network to render shots in parallel, slashing 4K turnaround from hours to seconds.",
    stat: "4.2x",
    statLabel: "Parallel Speedup",
    icon: Layers
  },
  {
    title: "Celluloid & Film Emulation",
    category: "COLOR SCIENCE",
    description:
      "Physical grain simulation, halation, anamorphic lens flare flares, and custom color timing presets calibrated to Kodak and Fujifilm filmstocks.",
    stat: "35mm",
    statLabel: "Authentic Grain",
    icon: Film
  },
  {
    title: "Studio Master Cut Compilation",
    category: "DELIVERY",
    description:
      "Browser-native video encoder compiles multi-shot storyboards, procedural audio synth beds, and voiceovers into a broadcast-ready .webm master file.",
    stat: "4K DCI",
    statLabel: "Master Cut",
    icon: DownloadCloud
  }
];

export function FeatureCardsSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleCardHover = (idx: number) => {
    setHoveredCard(idx);
    try {
      cinematicAudio.playCue("hover");
    } catch {}
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#5fe995] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Capabilities</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight mb-4">
            Designed for Modern Filmmakers, <br />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#4ed4b7] to-[#e8c76d]">
              Powered by Livepeer Subnets
            </span>
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base font-sans leading-relaxed">
            Every tool required to direct, critique, fine-tune, and ship festival-grade cinematic sequences from autonomous generative pipelines.
          </p>
        </div>

        {/* Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            const isHovered = hoveredCard === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => handleCardHover(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative rounded-2xl p-6 sm:p-7 border transition-all duration-300 group flex flex-col justify-between ${
                  isHovered
                    ? "bg-[#11141f]/90 border-[#4ed4b7]/50 shadow-2xl shadow-[#4ed4b7]/10 -translate-y-1.5"
                    : "bg-[#0b0d13]/70 border-white/10 hover:border-white/20 hover:bg-[#0e1017]/80"
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                        isHovered
                          ? "bg-[#4ed4b7]/20 border-[#4ed4b7]/50 text-[#5fe995]"
                          : "bg-white/5 border-white/10 text-zinc-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-semibold">
                      {feature.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-semibold text-white mb-2 group-hover:text-[#5fe995] transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Stat Badge Footer */}
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">
                    {feature.statLabel}
                  </span>
                  <span className="text-base font-mono font-bold text-[#5fe995]">
                    {feature.stat}
                  </span>
                </div>

                {/* Subtle Hover Gradient Glow */}
                <div
                  className={`absolute -inset-px rounded-2xl pointer-events-none transition-opacity duration-300 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(78,212,183,0.15) 0%, transparent 60%)"
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
