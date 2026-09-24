"use client";

import React, { useState } from "react";
import {
  GitBranch,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Terminal,
  Activity,
  CheckCircle
} from "lucide-react";
import { cinematicAudio } from "@/lib/cinematic-audio";

interface PipelineNode {
  id: string;
  step: string;
  title: string;
  role: string;
  badge: string;
  description: string;
  telemetry: {
    latency: string;
    model: string;
    successRate: string;
  };
  sampleOutput: {
    key: string;
    value: string;
  }[];
}

const PIPELINE_NODES: PipelineNode[] = [
  {
    id: "brief",
    step: "01",
    title: "Script Decomposer",
    role: "Dramaturg Agent",
    badge: "Narrative Parser",
    description:
      "Analyzes raw narrative briefs into discrete cinematic scenes, timing beats, camera blocking, and pacing curves.",
    telemetry: {
      latency: "180ms",
      model: "Claude 3.5 Sonnet / Llama 3.3",
      successRate: "99.8%"
    },
    sampleOutput: [
      { key: "scene_count", value: "4 discrete cuts" },
      { key: "target_duration", value: "16.0s (24fps DCI)" },
      { key: "pacing_curve", value: "accelerando (4s -> 3s -> 2.5s -> 6.5s)" },
      { key: "emotional_valence", value: "tension -> reveal -> resolution" }
    ]
  },
  {
    id: "cinematographer",
    step: "02",
    title: "Prompt Synthesizer",
    role: "Cinematographer Agent",
    badge: "Visual Director",
    description:
      "Generates hyper-specific lens parameters, lighting temperatures, camera movement vectors, and negative prompts for each shot.",
    telemetry: {
      latency: "320ms",
      model: "Auteur Vision Prompt Compiler",
      successRate: "99.4%"
    },
    sampleOutput: [
      { key: "lens_package", value: "Cooke Anamorphic /i 40mm T2.3" },
      { key: "camera_move", value: "Dolly-in with 4-degree Dutch tilt" },
      { key: "lighting_setup", value: "Key 4300K, fill 3200K, rim 6500K" },
      { key: "shutter_angle", value: "180 degrees (cinematic motion blur)" }
    ]
  },
  {
    id: "critic",
    step: "03",
    title: "Visual Critic Guardrail",
    role: "Continuity Agent",
    badge: "Iterative Refiner",
    description:
      "Inspects generated keyframes against prior shots for subject persistence, lighting vectors, and color grading consistency.",
    telemetry: {
      latency: "440ms",
      model: "Vision Critic Dual-Pass Evaluator",
      successRate: "98.7%"
    },
    sampleOutput: [
      { key: "subject_drift_score", value: "0.04 (excellent continuity)" },
      { key: "color_gamut_delta", value: "Delta-E < 1.8 across transitions" },
      { key: "iteration_status", value: "Approved on pass 1" },
      { key: "critic_verdict", value: "Greenlit for Livepeer subnet render" }
    ]
  },
  {
    id: "orchestrator",
    step: "04",
    title: "Livepeer Subnet Swarm",
    role: "Decentralized Renderer",
    badge: "Inference Cluster",
    description:
      "Dispatches parallel shot jobs across Livepeer AI orchestrators. Stitches multi-track cuts into master ProRes/H.264 deliverables.",
    telemetry: {
      latency: "4.2s / shot",
      model: "Livepeer Subnet (Wan2.1 / CogVideoX)",
      successRate: "99.9%"
    },
    sampleOutput: [
      { key: "orchestrator_nodes", value: "4 parallel Livepeer nodes" },
      { key: "transcode_target", value: "4K DCI H.265 10-bit 4:2:2" },
      { key: "gas_overhead", value: "Zero (Arbitrum settled)" },
      { key: "stream_delivery", value: "Instant playback via Livepeer CDN" }
    ]
  }
];

export function AgentPipelineSection() {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0);

  const selectedNode = PIPELINE_NODES[selectedNodeIndex];

  const handleSelectNode = (idx: number) => {
    setSelectedNodeIndex(idx);
    try {
      cinematicAudio.playCue("click");
    } catch {}
  };

  return (
    <section id="pipeline" className="py-24 relative overflow-hidden border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#5fe995] mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Agent Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight mb-4">
            Autonomous Orchestration <br />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#4ed4b7] to-[#7af2d9]">
              from Script to Master Cut
            </span>
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base font-sans leading-relaxed max-w-xl mx-auto">
            Storyboarding, continuous visual critic evaluation, and parallel rendering across Livepeer subnets.
          </p>
        </div>

        {/* Interactive Nodal Flow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {PIPELINE_NODES.map((node, idx) => {
            const isSelected = selectedNodeIndex === idx;
            return (
              <button
                key={node.id}
                onClick={() => handleSelectNode(idx)}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 relative group ${
                  isSelected
                    ? "bg-[#11141e]/90 border-[#4ed4b7]/60 shadow-xl shadow-[#4ed4b7]/10 -translate-y-1"
                    : "bg-[#0b0d13]/60 border-white/10 hover:border-white/20 hover:bg-[#0f1118]/80"
                }`}
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-zinc-500 font-bold">
                    STEP {node.step}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isSelected
                        ? "bg-[#4ed4b7]/20 border-[#4ed4b7]/40 text-[#5fe995]"
                        : "bg-white/5 border-white/10 text-zinc-400"
                    }`}
                  >
                    {node.badge}
                  </span>
                </div>

                <h3 className="text-base font-display font-semibold text-white mb-1 group-hover:text-[#5fe995] transition-colors">
                  {node.title}
                </h3>
                <p className="text-xs font-mono text-[#4ed4b7] mb-3">
                  {node.role}
                </p>

                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                  {node.description}
                </p>

                {/* Bottom Active Glow Bar */}
                <div
                  className={`absolute bottom-0 inset-x-4 h-0.5 rounded-full transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-[#4ed4b7] to-[#7af2d9]"
                      : "bg-transparent group-hover:bg-white/10"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Selected Node Telemetry & Inspector Console */}
        <div className="rounded-2xl bg-[#090b10]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-[#5fe995] bg-[#4ed4b7]/10 px-2 py-0.5 rounded border border-[#4ed4b7]/30">
                  {selectedNode.role}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                {selectedNode.title}
              </h3>
            </div>

            {/* Metrics */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-zinc-500 mr-2">LATENCY</span>
                <span className="text-white font-semibold">{selectedNode.telemetry.latency}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-zinc-500 mr-2">RUNTIME</span>
                <span className="text-[#5fe995] font-semibold">{selectedNode.telemetry.model}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-zinc-500 mr-2">ACCURACY</span>
                <span className="text-white font-semibold">{selectedNode.telemetry.successRate}</span>
              </div>
            </div>
          </div>

          {/* Console Output Payload Display */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-3">
              <Terminal className="w-3.5 h-3.5 text-[#4ed4b7]" />
              <span>Context Payload</span>
            </div>

            <div className="rounded-xl bg-[#050608] border border-white/5 p-4 font-mono text-xs overflow-x-auto">
              <div className="space-y-1.5">
                {selectedNode.sampleOutput.map((item, i) => (
                  <div key={i} className="flex items-baseline gap-3">
                    <span className="text-[#4ed4b7] select-none">{item.key}:</span>
                    <span className="text-zinc-300">"{item.value}"</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
