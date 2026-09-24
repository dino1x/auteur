"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Pause,
  Sliders,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  Cpu,
  Eye,
  CheckCircle2
} from "lucide-react";
import { cinematicAudio } from "@/lib/cinematic-audio";

interface HeroPreset {
  id: string;
  name: string;
  genre: string;
  timecode: string;
  directorScore: number;
  prompt: string;
  accentColor: string;
  criticFeedback: string;
  imageUrl: string;
}

const HERO_PRESETS: HeroPreset[] = [
  {
    id: "cyberpunk",
    name: "Neo Shinjuku 2088",
    genre: "Sci-Fi Noir",
    timecode: "00:00:14:08",
    directorScore: 98.4,
    prompt: "Anamorphic 35mm pan over rain-slicked neon alleys, volumetric steam vents, moody blue and amber rim lighting.",
    accentColor: "#4ed4b7",
    criticFeedback: "Cadence optimized. Volumetric diffusion matched across shots 1-4.",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg",
  },
  {
    id: "solaris",
    name: "Solaris Orbital Station",
    genre: "Space Realism",
    timecode: "00:00:28:16",
    directorScore: 96.7,
    prompt: "Slow push-in toward spherical observation cupola, blinding planetary reflection, deep vacuum contrast.",
    accentColor: "#7af2d9",
    criticFeedback: "Color balance locked. Exposure keyframes adjusted for zero solar blowout.",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk2ODEvM1ZWUGMtTXdkMnU2REVuM3RWUmptLmpwZw.e057b08306b30f75/3VVPc-Mwd2u6DEn3tVRjm.jpg",
  },
  {
    id: "dune",
    name: "Arrakis High Noon",
    genre: "Desert Brutalism",
    timecode: "00:00:42:04",
    directorScore: 97.9,
    prompt: "Low-angle telephoto tracking shot through boiling heat shimmer, titanic ornithopter silhouette.",
    accentColor: "#e8c76d",
    criticFeedback: "Heat haze shimmer frequency matched to 24fps camera shutter.",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDMvNWNfLUdhZk9jRTBwSzE0TEQ1UGNhLmpwZw.9fc767252bb912f8/5c_-GafOcE0pK14LD5Pca.jpg",
  }
];

export function HeroSection() {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioMuted, setAudioMuted] = useState(true);
  const timecodeSpanRef = useRef<HTMLSpanElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  const currentPreset = HERO_PRESETS[activePresetIndex];

  // 60fps Canvas Animation Loop for Live Simulated Cinema Viewport
  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 960);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 540);

    let progress = 0;
    let frame = 0;

    // Load image for active preset
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = currentPreset.imageUrl;

    const render = () => {
      progress += 0.003;
      frame++;

      // Update simulated running timecode directly via DOM ref (0 React re-renders at 60fps)
      const sec = Math.floor(frame / 24) % 60;
      const fr = frame % 24;
      if (timecodeSpanRef.current) {
        timecodeSpanRef.current.textContent = `00:01:${sec < 10 ? `0${sec}` : sec}:${fr < 10 ? `0${fr}` : fr}`;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw active image with cinematic camera push-in
      if (img.complete && img.naturalWidth > 0) {
        ctx.save();
        const scale = 1.0 + (progress % 0.18);
        const panX = Math.sin(progress * 4) * 15;
        const panY = Math.cos(progress * 3) * 10;

        ctx.translate(width / 2 + panX, height / 2 + panY);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();
      } else {
        // Fallback procedural visual gradient
        ctx.fillStyle = "#0a0e17";
        ctx.fillRect(0, 0, width, height);
      }

      // Volumetric Anamorphic Flare Streak
      const flareY = height * 0.45;
      const flareGrad = ctx.createLinearGradient(0, flareY, width, flareY);
      flareGrad.addColorStop(0, "rgba(78, 212, 183, 0)");
      flareGrad.addColorStop(0.3, "rgba(56, 189, 248, 0.1)");
      flareGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.4)");
      flareGrad.addColorStop(0.7, "rgba(122, 242, 217, 0.1)");
      flareGrad.addColorStop(1, "rgba(78, 212, 183, 0)");
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, flareY - 1, width, 2);

      // Scanning Laser Reticle Line
      const scanY = (frame * 1.5) % height;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.strokeStyle = "rgba(78, 212, 183, 0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Top and Bottom 2.39:1 Letterbox Matte
      const matteH = height * 0.12;
      ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
      ctx.fillRect(0, 0, width, matteH);
      ctx.fillRect(0, height - matteH, width, matteH);

      // Letterbox Guides
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.moveTo(0, matteH);
      ctx.lineTo(width, matteH);
      ctx.moveTo(0, height - matteH);
      ctx.lineTo(width, height - matteH);
      ctx.stroke();

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, activePresetIndex, currentPreset]);

  const handleLaunchClick = () => {
    try {
      cinematicAudio.playCue("start");
    } catch {}
  };

  const togglePlayback = () => {
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);
    try {
      cinematicAudio.playCue("play");
      if (nextPlay && !audioMuted) {
        cinematicAudio.startSoundtrack(currentPreset.id);
      } else {
        cinematicAudio.stopSoundtrack();
      }
    } catch {}
  };

  const toggleAudio = () => {
    const nextMute = !audioMuted;
    setAudioMuted(nextMute);
    try {
      if (!nextMute && isPlaying) {
        cinematicAudio.startSoundtrack(currentPreset.id);
      } else {
        cinematicAudio.stopSoundtrack();
      }
      cinematicAudio.playCue("click");
    } catch {}
  };

  const handleSelectPreset = (idx: number) => {
    setActivePresetIndex(idx);
    try {
      cinematicAudio.playCue("click");
      if (isPlaying && !audioMuted) {
        cinematicAudio.startSoundtrack(HERO_PRESETS[idx].id);
      }
    } catch {}
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md text-xs font-mono text-zinc-300 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#5fe995] animate-pulse" />
            <span>Autonomous Multi-Agent Video Engine</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4ed4b7]/10 border border-[#4ed4b7]/30 text-xs font-mono text-[#5fe995] shadow-lg shadow-[#4ed4b7]/5">
            <span>Livepeer Agent Innovation Track</span>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight text-white leading-[1.08] mb-6">
            The Autonomous Director <br />
            <span className="font-serif italic font-normal bg-gradient-to-r from-[#4ed4b7] via-[#7af2d9] to-[#e8c76d] bg-clip-text text-transparent">
              for Generative Cinema
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Translate single prompts into multi-shot cinematic cuts. Autonomous agents decompose scripts, direct continuity, critique visual grammar, and orchestrate parallel rendering on Livepeer decentralized subnets.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/studio"
            onClick={handleLaunchClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full text-sm font-semibold text-black bg-gradient-to-r from-[#4ed4b7] via-[#5fe995] to-[#7af2d9] shadow-xl shadow-[#4ed4b7]/20 hover:shadow-[#4ed4b7]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Enter Director Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#pipeline"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium text-zinc-300 bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] hover:text-white transition-all backdrop-blur-md"
          >
            <Cpu className="w-4 h-4 text-[#4ed4b7]" />
            <span>Inspect Agent Architecture</span>
          </a>
        </div>

        {/* 3D Perspective Cinema Viewport Showcase */}
        <div className="relative mx-auto max-w-5xl">
          {/* Ambient Glow */}
          <div
            className="absolute -inset-1 rounded-3xl blur-2xl opacity-30 transition-all duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${currentPreset.accentColor}, transparent 70%)`
            }}
          />

          {/* Viewport Frame */}
          <div className="relative rounded-2xl sm:rounded-3xl bg-[#090b10]/95 border border-white/20 p-2 sm:p-4 backdrop-blur-2xl shadow-2xl shadow-black/90">
            {/* Viewport Top Bar */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-white/10 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block animate-pulse" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-semibold text-zinc-200">AUTEUR // SCREENING_ROOM_4K</span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={toggleAudio}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10"
                >
                  {audioMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-[10px]">Unmute Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#5fe995] animate-pulse" />
                      <span className="text-[10px] text-[#5fe995]">Audio Active</span>
                    </>
                  )}
                </button>
                <span className="hidden sm:inline-block text-zinc-400">4K DCI · 24FPS</span>
                <span ref={timecodeSpanRef} className="text-[#5fe995] font-semibold">00:01:14:08</span>
              </div>
            </div>

            {/* Live Screening Stage Viewport */}
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black mt-2 border border-white/10 group">
              {/* Active Canvas when Playing */}
              <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              />

              {/* Static Still Poster when Paused */}
              {!isPlaying && (
                <div className="absolute inset-0">
                  <img
                    src={currentPreset.imageUrl}
                    alt={currentPreset.name}
                    className="w-full h-full object-cover opacity-60 scale-100 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />
                </div>
              )}

              {/* 35mm Safety Letterboxing */}
              <div className="absolute inset-x-0 top-0 h-8 sm:h-12 bg-black/60 border-b border-white/5 flex items-center justify-between px-4 text-[10px] font-mono text-zinc-400 pointer-events-none z-10">
                <span>SAFETY FRAME 2.39:1</span>
                <span>SHUTTER: 1/48s</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-8 sm:h-12 bg-black/60 border-t border-white/5 flex items-center justify-between px-4 text-[10px] font-mono text-zinc-400 pointer-events-none z-10">
                <span>ISO 800 · T1.5 ARRI MASTER</span>
                <span>LIVEPEER INFERENCE NODE: ONLINE</span>
              </div>

              {/* Center Play / Pause Controller */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <button
                  onClick={togglePlayback}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/70 border border-white/30 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 hover:border-[#4ed4b7] transition-all shadow-2xl group/btn"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 text-[#5fe995]" />
                  ) : (
                    <Play className="w-7 h-7 text-[#5fe995] translate-x-0.5" />
                  )}
                </button>
                <span className="mt-3 text-xs font-mono text-zinc-300 bg-black/60 px-3.5 py-1 rounded-full border border-white/15 backdrop-blur-md">
                  {isPlaying ? "Rendering 60fps Sequence" : "Click to Play Master Cut"}
                </span>
              </div>

              {/* Telemetry Critic Overlay */}
              <div className="absolute top-14 left-4 max-w-xs p-3.5 rounded-xl bg-black/80 border border-white/15 backdrop-blur-md hidden sm:block z-10 shadow-xl">
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#5fe995] mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Agent Critic Score: {currentPreset.directorScore}%</span>
                </div>
                <p className="text-[10px] text-zinc-300 font-mono leading-relaxed">
                  {currentPreset.criticFeedback}
                </p>
              </div>
            </div>

            {/* Presets Switcher Bar */}
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs font-mono text-zinc-400 mr-2 flex items-center gap-1.5 shrink-0">
                  <Sliders className="w-3.5 h-3.5 text-[#4ed4b7]" />
                  <span>Scene Presets:</span>
                </span>
                {HERO_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                      activePresetIndex === idx
                        ? "bg-white/15 text-white border border-white/30 shadow-md font-semibold"
                        : "bg-white/[0.03] text-zinc-400 hover:text-zinc-200 border border-white/5"
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              <Link
                href="/studio"
                onClick={handleLaunchClick}
                className="text-xs font-mono text-[#5fe995] hover:text-[#7af2d9] flex items-center gap-1.5 transition-colors self-end sm:self-auto"
              >
                <span>Edit in Studio Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
