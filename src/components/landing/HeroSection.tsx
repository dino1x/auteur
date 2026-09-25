"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Volume2,
  VolumeX,
  Cpu
} from "lucide-react";
import { cinematicAudio } from "@/lib/cinematic-audio";

interface SequenceShot {
  id: string;
  title: string;
  genre: string;
  lens: string;
  accentColor: string;
  imageUrl: string;
}

const CINEMA_SEQUENCE_SHOTS: SequenceShot[] = [
  {
    id: "leopard",
    title: "Himalayan Ridge Ghost",
    genre: "Highland Wildlife",
    lens: "Leica APO-Telyt 280mm f/2.8",
    accentColor: "#5fe995",
    imageUrl: "/images/cinema-sequence/snow_leopard_ridge.jpg",
  },
  {
    id: "tiger",
    title: "Bengal Monsoon Dawn",
    genre: "Apex Wildlife",
    lens: "Cooke S4/i 75mm Prime",
    accentColor: "#e8c76d",
    imageUrl: "/images/cinema-sequence/bengal_tiger_mist.jpg",
  },
  {
    id: "eagle",
    title: "Golden Summit Dive",
    genre: "Aerial Cinematic",
    lens: "ARRI Master Prime 35mm",
    accentColor: "#fb923c",
    imageUrl: "/images/cinema-sequence/golden_eagle_peaks.jpg",
  },
  {
    id: "whale",
    title: "Pacific Abyss Glide",
    genre: "Deep Ocean Epic",
    lens: "Master Macro 100mm",
    accentColor: "#38bdf8",
    imageUrl: "/images/cinema-sequence/ocean_whale_sunbeams.jpg",
  },
  {
    id: "aurora",
    title: "Lofoten Aurora Arc",
    genre: "Glacial Phenomenon",
    lens: "Zeiss Supreme 21mm",
    accentColor: "#4ed4b7",
    imageUrl: "/images/cinema-sequence/aurora_glacial_fjord.jpg",
  },
  {
    id: "dune",
    title: "Arrakis Dune Runner",
    genre: "Desert Brutalism",
    lens: "Panavision 65mm Ultra",
    accentColor: "#f59e0b",
    imageUrl: "/images/cinema-sequence/dune_desert_golden.jpg",
  },
  {
    id: "shinjuku",
    title: "Shinjuku Rain Protocol",
    genre: "Cyberpunk Noir",
    lens: "Cooke Anamorphic 40mm",
    accentColor: "#7af2d9",
    imageUrl: "/images/cinema-sequence/shinjuku_neon_rain.jpg",
  }
];

export function HeroSection() {
  const [audioMuted, setAudioMuted] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ambientGlowRef = useRef<HTMLDivElement | null>(null);
  const takeTextRef = useRef<HTMLSpanElement | null>(null);
  const titleTextRef = useRef<HTMLSpanElement | null>(null);
  const lensTextRef = useRef<HTMLSpanElement | null>(null);
  const dotsContainerRef = useRef<HTMLDivElement | null>(null);
  const shutterFlashRef = useRef<HTMLDivElement | null>(null);
  const fallbackImgRef = useRef<HTMLImageElement | null>(null);
  const currentIdxRef = useRef<number>(0);
  const shotStartTimeRef = useRef<number>(Date.now());

  // 60 FPS Hardware-Accelerated Fast-Sequence Cinema Viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Preload all shots as in-memory HTMLImageElement objects
    const loadedImages: (HTMLImageElement | null)[] = CINEMA_SEQUENCE_SHOTS.map((shot) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = shot.imageUrl;
      return img;
    });

    let width = (canvas.width = canvas.parentElement?.clientWidth || 960);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 540);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const pw = canvas.parentElement.clientWidth;
      const ph = canvas.parentElement.clientHeight;
      if (pw > 0 && ph > 0 && (canvas.width !== pw || canvas.height !== ph)) {
        width = canvas.width = pw;
        height = canvas.height = ph;
      }
    };
    handleResize();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && canvas.parentElement) {
      ro = new ResizeObserver(handleResize);
      ro.observe(canvas.parentElement);
    }
    window.addEventListener("resize", handleResize);

    const SHOT_DURATION_MS = 1350; // Rapid ~1.35s cinematic sequence cut
    let animId: number;

    const updateHudAndVisual = (idx: number) => {
      const shot = CINEMA_SEQUENCE_SHOTS[idx];
      if (takeTextRef.current) {
        takeTextRef.current.textContent = `TAKE 0${idx + 1} / 0${CINEMA_SEQUENCE_SHOTS.length}`;
      }
      if (titleTextRef.current) {
        titleTextRef.current.textContent = shot.title;
      }
      if (lensTextRef.current) {
        lensTextRef.current.textContent = shot.lens;
      }
      if (ambientGlowRef.current) {
        ambientGlowRef.current.style.background = `radial-gradient(circle at 50% 50%, ${shot.accentColor}, transparent 70%)`;
      }
      if (fallbackImgRef.current) {
        fallbackImgRef.current.src = shot.imageUrl;
        fallbackImgRef.current.alt = shot.title;
      }
      if (dotsContainerRef.current) {
        const dots = dotsContainerRef.current.children;
        for (let d = 0; d < dots.length; d++) {
          const el = dots[d] as HTMLElement;
          if (d === idx) {
            el.className = "w-2.5 h-1 rounded-full bg-[#5fe995] transition-all duration-300";
          } else {
            el.className = "w-1 h-1 rounded-full bg-white/20 transition-all duration-300";
          }
        }
      }
    };

    updateHudAndVisual(0);

    // Guaranteed shot advance timer (unaffected by tab backgrounding or rAF pause)
    const intervalId = setInterval(() => {
      currentIdxRef.current = (currentIdxRef.current + 1) % CINEMA_SEQUENCE_SHOTS.length;
      shotStartTimeRef.current = Date.now();
      updateHudAndVisual(currentIdxRef.current);

      // Shutter flash seam
      if (shutterFlashRef.current) {
        shutterFlashRef.current.style.opacity = "0.75";
        setTimeout(() => {
          if (shutterFlashRef.current) shutterFlashRef.current.style.opacity = "0";
        }, 90);
      }

      try {
        if (!audioMuted) {
          cinematicAudio.playCue("click");
        }
      } catch {}
    }, SHOT_DURATION_MS);

    // 60fps Live Canvas Camera Motion Loop
    const render = () => {
      const now = Date.now();
      const currentShotIdx = currentIdxRef.current;
      const shotProgress = Math.min(1.0, (now - shotStartTimeRef.current) / SHOT_DURATION_MS);
      const activeShot = CINEMA_SEQUENCE_SHOTS[currentShotIdx];
      const activeImg = loadedImages[currentShotIdx];

      // 1. Clear Frame
      ctx.fillStyle = "#05070a";
      ctx.fillRect(0, 0, width, height);

      // 2. Continuous 60fps Camera Kinetic Move (Ken Burns Pan / Zoom)
      const isEven = currentShotIdx % 2 === 0;
      const zoom = 1.03 + shotProgress * 0.08;
      const panX = isEven ? (shotProgress - 0.5) * 16 : (0.5 - shotProgress) * 16;
      const panY = (shotProgress - 0.5) * 8;

      ctx.save();
      if (activeImg && activeImg.complete && activeImg.naturalWidth > 0) {
        const imgAspect = activeImg.naturalWidth / activeImg.naturalHeight;
        const screenAspect = width / height;

        let drawW = width;
        let drawH = height;

        if (screenAspect > imgAspect) {
          drawW = width;
          drawH = width / imgAspect;
        } else {
          drawH = height;
          drawW = height * imgAspect;
        }

        drawW *= zoom;
        drawH *= zoom;

        const drawX = (width - drawW) / 2 + panX;
        const drawY = (height - drawH) / 2 + panY;

        ctx.drawImage(activeImg, drawX, drawY, drawW, drawH);
      } else {
        // High-tech fallback gradient while image loads
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "#080b12");
        grad.addColorStop(0.5, activeShot.accentColor + "22");
        grad.addColorStop(1, "#040608");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Cinematic Film Grain & Shutter Scanline
      ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
      ctx.fillRect(0, 0, width, height);

      // 4. Anamorphic Vignette
      const radGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.2,
        width / 2,
        height / 2,
        width * 0.75
      );
      radGrad.addColorStop(0, "transparent");
      radGrad.addColorStop(0.7, "rgba(0,0,0,0.45)");
      radGrad.addColorStop(1, "rgba(0,0,0,0.88)");
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);

      // 5. Optical Anamorphic Streak
      const streakY = height * 0.48;
      ctx.globalCompositeOperation = "screen";
      const streakGrad = ctx.createLinearGradient(0, streakY, width, streakY);
      streakGrad.addColorStop(0, "transparent");
      streakGrad.addColorStop(0.4, activeShot.accentColor + "33");
      streakGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.7)");
      streakGrad.addColorStop(0.6, activeShot.accentColor + "33");
      streakGrad.addColorStop(1, "transparent");
      ctx.fillStyle = streakGrad;
      ctx.fillRect(0, streakY - 1, width, 2);
      ctx.globalCompositeOperation = "source-over";

      // 6. 2.39:1 Scope Letterbox Matte
      const scopeH = width / 2.39;
      const matteH = Math.max(0, (height - scopeH) / 2);
      if (matteH > 0) {
        ctx.fillStyle = "#05070a";
        ctx.fillRect(0, 0, width, matteH);
        ctx.fillRect(0, height - matteH, width, matteH);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, matteH);
        ctx.lineTo(width, matteH);
        ctx.moveTo(0, height - matteH);
        ctx.lineTo(width, height - matteH);
        ctx.stroke();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (ro) ro.disconnect();
    };
  }, [audioMuted]);

  const handleLaunchClick = () => {
    try {
      cinematicAudio.playCue("start");
    } catch {}
  };

  const toggleAudio = () => {
    const nextMute = !audioMuted;
    setAudioMuted(nextMute);
    try {
      if (!nextMute) {
        cinematicAudio.startSoundtrack("cyber");
      } else {
        cinematicAudio.stopSoundtrack();
      }
      cinematicAudio.playCue("click");
    } catch {}
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Badge */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5fe995] animate-pulse" />
            <span>Livepeer Autonomous Cinema</span>
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

          <p className="text-base sm:text-lg text-zinc-300 max-w-xl mx-auto font-sans leading-relaxed">
            Turn narrative prompts into multi-shot cinematic cuts with continuous visual grammar and Livepeer decentralized inference.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/studio"
            onClick={handleLaunchClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full text-sm font-semibold text-black bg-gradient-to-r from-[#4ed4b7] via-[#5fe995] to-[#7af2d9] shadow-xl shadow-[#4ed4b7]/20 hover:shadow-[#4ed4b7]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Enter Director Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#primitives"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium text-zinc-300 bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] hover:text-white transition-all"
          >
            <Cpu className="w-4 h-4 text-[#4ed4b7]" />
            <span>Studio Primitives</span>
          </a>
        </div>

        {/* 3D Perspective Cinema Viewport Showcase */}
        <div id="screening-room" className="relative mx-auto max-w-5xl scroll-mt-28">
          {/* Ambient Glow that dynamically reflects current take */}
          <div
            ref={ambientGlowRef}
            className="absolute -inset-1 rounded-3xl blur-2xl opacity-35 transition-all duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, #4ed4b7, transparent 70%)`
            }}
          />

          {/* Viewport Frame */}
          <div className="relative rounded-2xl sm:rounded-3xl bg-[#090b10]/95 border border-white/20 p-2 sm:p-4 backdrop-blur-2xl shadow-2xl shadow-black/90">
            {/* Viewport Top Bar (Timer and 24fps completely removed) */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-white/10 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block animate-pulse" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-semibold text-zinc-200">AUTEUR 4K</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.05] border border-white/10 text-[#5fe995] font-semibold tracking-wider">
                  AUTONOMOUS SEQUENCE
                </span>
                <button
                  onClick={toggleAudio}
                  aria-label="Toggle audio"
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 transition-colors"
                >
                  {audioMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#5fe995]" />
                  )}
                </button>
              </div>
            </div>

            {/* Fast-Sequence Cinema Viewport (Play button and bottom buttons completely removed) */}
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black mt-2 border border-white/10 select-none">
              {/* Fallback Base Image (Synchronized via Ref) */}
              <img
                ref={fallbackImgRef}
                src={CINEMA_SEQUENCE_SHOTS[0].imageUrl}
                alt="Cinema Sequence Preview"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              {/* 60 FPS Hardware Render Canvas */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full block object-cover z-10"
              />

              {/* Fast Cut Shutter Flash Seam */}
              <div
                ref={shutterFlashRef}
                className="absolute inset-0 bg-white pointer-events-none z-20 opacity-0 transition-opacity duration-75"
              />

              {/* 35mm Letterbox Matte Lines (2.39:1 Anamorphic Scope) */}
              <div className="absolute inset-x-0 top-0 h-7 sm:h-9 bg-black/90 border-b border-white/10 pointer-events-none z-30" />
              <div className="absolute inset-x-0 bottom-0 h-7 sm:h-9 bg-black/90 border-t border-white/10 pointer-events-none z-30" />

              {/* Live Shot Cadence HUD inside Bottom Matte */}
              <div className="absolute inset-x-0 bottom-0 h-7 sm:h-9 px-4 flex items-center justify-between pointer-events-none z-30 text-[9px] font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <span ref={takeTextRef} className="text-[#5fe995] font-bold">
                    TAKE 01 / 07
                  </span>
                  <span className="text-zinc-600">·</span>
                  <span ref={titleTextRef} className="text-zinc-200 font-semibold uppercase tracking-wider">
                    NEO SHINJUKU 2088
                  </span>
                  <span className="text-zinc-600 hidden sm:inline">·</span>
                  <span ref={lensTextRef} className="text-zinc-400 hidden sm:inline">
                    Cooke Anamorphic 40mm
                  </span>
                  <span className="text-zinc-600 hidden md:inline">·</span>
                  <span className="text-zinc-500 hidden md:inline">2.39:1 SCOPE</span>
                </div>

                {/* Sequence Indicator Dots */}
                <div ref={dotsContainerRef} className="flex items-center gap-1.5">
                  {CINEMA_SEQUENCE_SHOTS.map((s, i) => (
                    <span
                      key={s.id}
                      className={`rounded-full transition-all duration-300 ${
                        i === 0
                          ? "w-2.5 h-1 bg-[#5fe995]"
                          : "w-1 h-1 bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
