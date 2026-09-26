"use client";

import React from "react";
import { Film, Globe, Compass, Cpu, Layers } from "lucide-react";

export function StudioSkeleton() {
  return (
    <div className="relative min-h-screen bg-[#07080b] text-[#f2f4f8] flex flex-col font-sans select-none overflow-hidden">
      {/* Top Header */}
      <header className="h-14 border-b border-white/[0.08] bg-[#0b0d13] px-4 md:px-6 flex items-center justify-between shrink-0 z-30 gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0 pr-5 lg:pr-7 border-r border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base tracking-wider text-white">
              AUTEUR
            </span>
            <span className="font-serif italic text-base text-[#4ed4b7]">
              Studio
            </span>
          </div>
        </div>

        {/* Stepper Skeleton */}
        <div className="flex-1 flex justify-center items-center px-2 min-w-0">
          <div className="flex items-center bg-[#08090c] px-3 py-1.5 rounded-xl border border-white/[0.08] text-xs font-mono gap-4">
            <div className="flex items-center gap-2 text-[#4ed4b7]">
              <span className="w-4 h-4 rounded-full bg-[#4ed4b7]/20 border border-[#4ed4b7]/40 flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Ingest</span>
            </div>
            <span className="text-zinc-600 text-xs">/</span>
            <div className="flex items-center gap-2 text-zinc-500">
              <span className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">2</span>
              <span>Territories</span>
            </div>
            <span className="text-zinc-600 text-xs">/</span>
            <div className="flex items-center gap-2 text-zinc-500">
              <span className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">3</span>
              <span>Cinema NLE</span>
            </div>
          </div>
        </div>

        {/* Status / Right Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#4ed4b7]/10 border border-[#4ed4b7]/30 text-xs font-mono text-[#5fe995]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5fe995] animate-pulse" />
            <span>Livepeer Agent Initializing</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 animate-pulse" />
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left Panel: Brief / Direction */}
        <div className="w-full lg:w-[420px] xl:w-[460px] border-r border-white/[0.08] bg-[#090b10] p-4 flex flex-col gap-4 shrink-0">
          {/* Section Heading */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-[#4ed4b7]" />
              <span>Narrative Prompt & URL Ingest</span>
            </div>
            <div className="w-16 h-4 bg-white/5 rounded animate-pulse" />
          </div>

          {/* Brief Text Area Skeleton */}
          <div className="rounded-xl border border-white/10 bg-[#06080d] p-4 flex flex-col gap-2">
            <div className="w-3/4 h-3 bg-white/10 rounded animate-pulse" />
            <div className="w-full h-3 bg-white/10 rounded animate-pulse" />
            <div className="w-5/6 h-3 bg-white/10 rounded animate-pulse" />
            <div className="w-1/2 h-3 bg-white/10 rounded animate-pulse mt-1" />
          </div>

          {/* Action Button Skeleton */}
          <div className="w-full h-11 rounded-xl bg-gradient-to-r from-[#4ed4b7]/20 to-[#5fe995]/20 border border-[#4ed4b7]/30 flex items-center justify-center gap-2 text-xs font-mono text-[#5fe995]">
            <span className="w-2 h-2 rounded-full bg-[#5fe995] animate-ping" />
            <span>Calibrating Multi-Shot Engine...</span>
          </div>

          {/* Territory Cards Skeleton */}
          <div className="flex-1 flex flex-col gap-3 pt-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-[#4ed4b7]" />
              <span>Directional Beliefs (3 Archetypes)</span>
            </div>

            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-white/[0.08] bg-[#0c0f16]/60 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-32 h-3.5 bg-white/10 rounded animate-pulse" />
                  <div className="w-12 h-3 bg-white/5 rounded" />
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded animate-pulse" />
                <div className="w-4/5 h-2.5 bg-white/5 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Right / Center Panel: 16:9 Viewport & Telemetry */}
        <div className="flex-1 flex flex-col bg-[#050608] min-w-0">
          {/* Monitor Viewport Section */}
          <div className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center min-h-[360px] relative">
            <div className="w-full max-w-4xl aspect-video rounded-2xl bg-[#090c12] border border-white/15 relative overflow-hidden flex flex-col justify-between p-4 shadow-2xl shadow-black">
              {/* Viewport Top Bar */}
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5fe995] animate-pulse" />
                  <span className="text-zinc-300 font-semibold">VIEWPORT 4K MASTER</span>
                  <span className="text-zinc-600">|</span>
                  <span className="text-zinc-500">2.39:1 DCI ANAMORPHIC</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <span>SMPTE</span>
                  <span className="text-[#5fe995] font-mono bg-black/40 px-2 py-0.5 rounded border border-white/5">00:00:00:00</span>
                </div>
              </div>

              {/* Center Loading Indicator */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#4ed4b7]/10 border border-[#4ed4b7]/30 flex items-center justify-center">
                  <Film className="w-6 h-6 text-[#5fe995] animate-pulse" />
                </div>
                <div className="text-xs font-mono text-zinc-300 tracking-wider">
                  MOUNTING AUTONOMOUS WORKSTATION
                </div>
                <div className="text-[10px] font-mono text-zinc-500">
                  Pre-warming 60fps Livepeer generative canvas and audio beds
                </div>
              </div>

              {/* Viewport Bottom Overlay */}
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 z-10">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-[#4ed4b7]" />
                  <span>LIVEPEER GPU MESH READY</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#4ed4b7]" />
                  <span>5-ACT MULTI-SHOT CONTINUITY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Timeline Skeleton */}
          <div className="h-28 border-t border-white/[0.08] bg-[#080a0f] px-4 py-3 flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">TIMELINE MASTER CUT</span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-500">5 SHOTS // 24 FPS CONTINUOUS</span>
              </div>
              <div className="w-24 h-3 bg-white/10 rounded animate-pulse" />
            </div>

            {/* Timeline Tracks */}
            <div className="grid grid-cols-5 gap-2 flex-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className="rounded-lg border border-white/10 bg-[#0d1017] p-2 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#5fe995]">ACT 0{s}</span>
                    <span className="text-[9px] font-mono text-zinc-500">3.5s</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
