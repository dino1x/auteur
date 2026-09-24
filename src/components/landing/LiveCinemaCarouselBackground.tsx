"use client";

import React, { useEffect, useState, useRef, memo } from "react";
import Link from "next/link";
import { Film, Play, ArrowRight, CheckCircle2, Sliders, Sparkles } from "lucide-react";
import { cinematicAudio } from "@/lib/cinematic-audio";

interface CarouselShot {
  id: string;
  title: string;
  genre: string;
  lens: string;
  lut: string;
  aspectRatio: string;
  criticScore: string;
  imageUrl: string;
  accent: string;
  prompt: string;
  filmstock: string;
}

const SHOTS_LANE_1: CarouselShot[] = [
  {
    id: "shot-1",
    title: "Shinjuku Rain 2088",
    genre: "Sci-Fi Noir",
    lens: "Cooke Anamorphic 40mm",
    lut: "Kodak 2383 D65",
    aspectRatio: "2.39:1",
    criticScore: "98.7%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg",
    accent: "#4ed4b7",
    prompt: "Anamorphic 35mm pan over rain-slicked neon alleys, volumetric steam vents.",
    filmstock: "KODAK VISION3 500T",
  },
  {
    id: "shot-2",
    title: "Solaris Cupola",
    genre: "Cosmic Realism",
    lens: "Ultra Prime 24mm",
    lut: "Fuji Eterna 500T",
    aspectRatio: "2.39:1",
    criticScore: "99.2%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk2ODEvM1ZWUGMtTXdkMnU2REVuM3RWUmptLmpwZw.e057b08306b30f75/3VVPc-Mwd2u6DEn3tVRjm.jpg",
    accent: "#38bdf8",
    prompt: "Slow push-in toward spherical observation cupola, blinding planetary reflection.",
    filmstock: "FUJIFILM ETERNA 250D",
  },
  {
    id: "shot-3",
    title: "Arrakis Crawler",
    genre: "Desert Brutalism",
    lens: "Cooke S4/i 75mm",
    lut: "Bleach Bypass Gold",
    aspectRatio: "2.39:1",
    criticScore: "97.9%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDMvNWNfLUdhZk9jRTBwSzE0TEQ1UGNhLmpwZw.9fc767252bb912f8/5c_-GafOcE0pK14LD5Pca.jpg",
    accent: "#e8c76d",
    prompt: "Low-angle telephoto tracking shot through boiling heat shimmer.",
    filmstock: "KODAK 5285 REVERSAL",
  },
  {
    id: "shot-4",
    title: "Europa Hydrothermal",
    genre: "Deep Ocean Macro",
    lens: "Master Macro 100mm",
    lut: "Eterna 250D",
    aspectRatio: "2.39:1",
    criticScore: "98.4%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MGIvWDZjYk16ZDU2VnhtREphQzdISERGLmpwZw.9ff8d740a112167f/X6cbMzd56VxmDJaC7HHDF.jpg",
    accent: "#5fe995",
    prompt: "Sub-ice exploration drone descending into bioluminescent thermal plumes.",
    filmstock: "ILFORD PAN F PLUS",
  },
  {
    id: "shot-5",
    title: "Midnight Drift",
    genre: "Action Velocity",
    lens: "Canon K35 35mm",
    lut: "Vision3 500T",
    aspectRatio: "2.39:1",
    criticScore: "96.8%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MTYvejRDTFU0THkyRjFoWml5TklJcWEyLmpwZw.660ffbf5b22ed418/z4CLU4Ly2F1hZiyNIIqa2.jpg",
    accent: "#c084fc",
    prompt: "Long exposure light streaks, anamorphic horizontal streak flares.",
    filmstock: "KODAK EASTMAN 5254",
  },
  {
    id: "shot-6",
    title: "Silicon Cathedral",
    genre: "Cyber Architectural",
    lens: "ARRI Signature 28mm",
    lut: "Technicolor 3-Strip",
    aspectRatio: "2.39:1",
    criticScore: "99.5%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDYvMFNOYkt1UWFaNWNTcDBHbElRRDdlLmpwZw.65b76b30ba58da56/0SNbKuQaZ5cSp0GlIQD7e.jpg",
    accent: "#7af2d9",
    prompt: "Gothic vaulted archways housing liquid nitrogen quantum core towers.",
    filmstock: "TECHNICOLOR MONOPACK",
  },
];

const SHOTS_LANE_2: CarouselShot[] = [
  {
    id: "shot-7",
    title: "Sub-Orbital Launch",
    genre: "Aerospace Epic",
    lens: "Panavision Primo 50mm",
    lut: "Kodak Vision 250D",
    aspectRatio: "2.39:1",
    criticScore: "98.9%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk2ODEvM1ZWUGMtTXdkMnU2REVuM3RWUmptLmpwZw.e057b08306b30f75/3VVPc-Mwd2u6DEn3tVRjm.jpg",
    accent: "#fb923c",
    prompt: "Rocket plume expanding in thin vacuum, diamond shockwave patterns.",
    filmstock: "NASA 70MM FLIGHT",
  },
  {
    id: "shot-8",
    title: "Arctic Aurora Arc",
    genre: "Atmospheric Phenomenon",
    lens: "Zeiss Supreme 21mm",
    lut: "Custom Teal & Ice",
    aspectRatio: "2.39:1",
    criticScore: "99.1%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MGIvWDZjYk16ZDU2VnhtREphQzdISERGLmpwZw.9ff8d740a112167f/X6cbMzd56VxmDJaC7HHDF.jpg",
    accent: "#5fe995",
    prompt: "Curtains of electric emerald geomagnetic plasma rippling above pack ice.",
    filmstock: "FUJI VELVIA 50",
  },
  {
    id: "shot-9",
    title: "Geisha Protocol",
    genre: "Neo-Tokyo Cyber",
    lens: "Leitz Noctilux 50mm",
    lut: "Gold Leaf Monochrome",
    aspectRatio: "2.39:1",
    criticScore: "98.1%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg",
    accent: "#e8c76d",
    prompt: "Porcelain synthetic humanoid face reflecting gold leaf calligraphy neon.",
    filmstock: "KODAK DOUBLE-X 5222",
  },
  {
    id: "shot-10",
    title: "Quantum Data Trench",
    genre: "Tech Infrastructure",
    lens: "Ultra Prime 32mm",
    lut: "Matrix Cyan LUT",
    aspectRatio: "2.39:1",
    criticScore: "97.5%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MTYvejRDTFU0THkyRjFoWml5TklJcWEyLmpwZw.660ffbf5b22ed418/z4CLU4Ly2F1hZiyNIIqa2.jpg",
    accent: "#38bdf8",
    prompt: "Submerged optical fiber conduits pulsing with petabit quantum packets.",
    filmstock: "AGFA GEVAERT 200",
  },
  {
    id: "shot-11",
    title: "Sahara Parabolic Array",
    genre: "Solarpunk Brutalism",
    lens: "Cooke S4/i 40mm",
    lut: "Bleach Bypass Amber",
    aspectRatio: "2.39:1",
    criticScore: "98.6%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDMvNWNfLUdhZk9jRTBwSzE0TEQ1UGNhLmpwZw.9fc767252bb912f8/5c_-GafOcE0pK14LD5Pca.jpg",
    accent: "#f59e0b",
    prompt: "Kilometer-wide mirror arrays focusing solar flux into molten salt receiver.",
    filmstock: "KODACHROME 64",
  },
  {
    id: "shot-12",
    title: "Abyssal Leviathan",
    genre: "Bioluminescent Wonder",
    lens: "Master Anamorphic 35mm",
    lut: "Deep Oceanic Cyan",
    aspectRatio: "2.39:1",
    criticScore: "99.4%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDEvekFjeWZCNVR6OUJHTGJJaDZ2TGZQLmpwZw.e73f200b252ea79b/zAcyfB5Tz9BGLbIh6vLfP.jpg",
    accent: "#4ed4b7",
    prompt: "Colossal bio-mechanical manta gliding over deep trench vents.",
    filmstock: "UNDERSEA DCI 800",
  },
];

const SHOTS_LANE_3: CarouselShot[] = [
  {
    id: "shot-13",
    title: "Neo-Seoul Sky Garden",
    genre: "Biophilic Futurism",
    lens: "ARRI Signature 35mm",
    lut: "Kodak 5219 Tungsten",
    aspectRatio: "2.39:1",
    criticScore: "98.3%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3YTRvX0N1NmxhQnY5WFRMeVlNUHpIbHNaLmpwZw.43ec37d854c29895/_Cu6laBv9XTLyYMPzHlsZ.jpg",
    accent: "#e879f9",
    prompt: "Bioluminescent sakura trees growing atop 800-meter skybridge towers.",
    filmstock: "KODAK EKTACHROME E100",
  },
  {
    id: "shot-14",
    title: "Mars Terraforming Dome",
    genre: "Colony Chronicle",
    lens: "Cooke Anamorphic 65mm",
    lut: "Red Planet Agfa",
    aspectRatio: "2.39:1",
    criticScore: "97.8%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDMvNWNfLUdhZk9jRTBwSzE0TEQ1UGNhLmpwZw.9fc767252bb912f8/5c_-GafOcE0pK14LD5Pca.jpg",
    accent: "#f87171",
    prompt: "Hydroponic mist condensing on hexagonal pressurized graphene shields.",
    filmstock: "WARM TUNGSTEN 500",
  },
  {
    id: "shot-15",
    title: "Cherenkov Core",
    genre: "Nuclear Physics",
    lens: "Zeiss Master 18mm",
    lut: "Electric Blue Pulse",
    aspectRatio: "2.39:1",
    criticScore: "99.6%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MTYvejRDTFU0THkyRjFoWml5TklJcWEyLmpwZw.660ffbf5b22ed418/z4CLU4Ly2F1hZiyNIIqa2.jpg",
    accent: "#60a5fa",
    prompt: "Water-cooled fission reactor emitting blinding blue Cherenkov radiation.",
    filmstock: "HIGH SPEED ATOMIC 1600",
  },
  {
    id: "shot-16",
    title: "Venice Tidal Canal 2100",
    genre: "Climate Speculative",
    lens: "Canon K35 24mm",
    lut: "Aqua Tint Vintage",
    aspectRatio: "2.39:1",
    criticScore: "98.7%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MGIvWDZjYk16ZDU2VnhtREphQzdISERGLmpwZw.9ff8d740a112167f/X6cbMzd56VxmDJaC7HHDF.jpg",
    accent: "#5fe995",
    prompt: "Gondolas navigating ancient arches illuminated by submerged bioluminescence.",
    filmstock: "FUJICHROME PROVIA 100F",
  },
  {
    id: "shot-17",
    title: "Orbital Space Elevator",
    genre: "Mega Engineering",
    lens: "Cooke S4/i 100mm",
    lut: "Vacuum Contrast DCI",
    aspectRatio: "2.39:1",
    criticScore: "99.0%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk2ODEvM1ZWUGMtTXdkMnU2REVuM3RWUmptLmpwZw.e057b08306b30f75/3VVPc-Mwd2u6DEn3tVRjm.jpg",
    accent: "#7af2d9",
    prompt: "Carbon nanotube ribbon ascending vertically through storm clouds into orbit.",
    filmstock: "KODAK 2383 PRINT",
  },
  {
    id: "shot-18",
    title: "Misty Forest Canopy",
    genre: "Organic Majesty",
    lens: "Leitz Noctilux 35mm",
    lut: "Golden Hour Glow",
    aspectRatio: "2.39:1",
    criticScore: "97.4%",
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDEvekFjeWZCNVR6OUJHTGJJaDZ2TGZQLmpwZw.e73f200b252ea79b/zAcyfB5Tz9BGLbIh6vLfP.jpg",
    accent: "#facc15",
    prompt: "Volumetric sunrise sunbeams cutting through primeval redwood canopy mist.",
    filmstock: "AGFA COLOR VINTAGE",
  },
];

export function LiveCinemaCarouselBackground() {
  const [selectedShot, setSelectedShot] = useState<CarouselShot | null>(null);

  const handleCardClick = (shot: CarouselShot) => {
    setSelectedShot(shot);
    try {
      cinematicAudio.playCue("click");
    } catch {}
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#06080d]"
      aria-hidden="true"
    >
      {/* 3D Perspective Skewed Container for the Moving Carousels */}
      <div className="absolute inset-x-[-20%] inset-y-[-25%] flex flex-col justify-center gap-7 transform -rotate-6 -skew-x-6 scale-105 opacity-70 pointer-events-auto">
        {/* Track 1: Gliding Left */}
        <div className="relative w-full overflow-hidden flex items-center group">
          <div className="flex items-center gap-6 animate-carousel-left group-hover:[animation-play-state:paused] shrink-0 will-change-transform">
            {[...SHOTS_LANE_1, ...SHOTS_LANE_1].map((shot, idx) => (
              <CarouselCard
                key={`${shot.id}-${idx}`}
                shot={shot}
                frameOffset={idx * 3}
                onClick={() => handleCardClick(shot)}
              />
            ))}
          </div>
        </div>

        {/* Track 2: Gliding Right */}
        <div className="relative w-full overflow-hidden flex items-center group">
          <div className="flex items-center gap-6 animate-carousel-right group-hover:[animation-play-state:paused] shrink-0 will-change-transform">
            {[...SHOTS_LANE_2, ...SHOTS_LANE_2].map((shot, idx) => (
              <CarouselCard
                key={`${shot.id}-${idx}`}
                shot={shot}
                frameOffset={idx * 4 + 7}
                onClick={() => handleCardClick(shot)}
              />
            ))}
          </div>
        </div>

        {/* Track 3: Gliding Left */}
        <div className="relative w-full overflow-hidden flex items-center group">
          <div className="flex items-center gap-6 animate-carousel-left group-hover:[animation-play-state:paused] shrink-0 will-change-transform">
            {[...SHOTS_LANE_3, ...SHOTS_LANE_3].map((shot, idx) => (
              <CarouselCard
                key={`${shot.id}-${idx}`}
                shot={shot}
                frameOffset={idx * 2 + 12}
                onClick={() => handleCardClick(shot)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Atmospheric Cinema Gradient Mask (Ensures foreground text is 100% crisp & readable) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07090e]/94 via-[#07090e]/82 to-[#07090e]/95 backdrop-blur-[2px] pointer-events-none" />

      {/* Deep Center Radial Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(7,9,14,0.3) 15%, rgba(7,9,14,0.92) 85%)",
        }}
      />

      {/* Volumetric Anamorphic Blue-Teal Horizon Glow */}
      <div
        className="absolute top-[28%] inset-x-0 h-48 pointer-events-none opacity-40 blur-3xl"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(78,212,183,0.2) 35%, rgba(56,189,248,0.25) 50%, rgba(122,242,217,0.2) 65%, transparent 100%)",
        }}
      />

      {/* 35mm Physical Celluloid Film Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.038] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Interactive Modal Flyout when a background shot is selected */}
      {selectedShot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto">
          <div className="max-w-lg w-full rounded-2xl bg-[#0d1017] border border-white/20 p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#4ed4b7]" />
                <span className="text-xs font-mono text-[#5fe995] font-semibold uppercase">
                  Film Cell Telemetry // {selectedShot.genre}
                </span>
              </div>
              <button
                onClick={() => setSelectedShot(null)}
                className="text-xs font-mono text-zinc-400 hover:text-white px-2 py-1 rounded bg-white/5"
              >
                CLOSE
              </button>
            </div>

            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 border border-white/10">
              <img
                src={selectedShot.imageUrl}
                alt={selectedShot.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white">
                <span className="font-display font-bold text-sm">{selectedShot.title}</span>
                <span className="text-[#5fe995] bg-black/60 px-2 py-0.5 rounded border border-[#4ed4b7]/30">
                  Critic {selectedShot.criticScore}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 font-sans mb-4 leading-relaxed">
              {selectedShot.prompt}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-6 bg-black/40 p-3 rounded-lg border border-white/5">
              <div>
                <span className="text-zinc-500 block">LENS:</span>
                <span className="text-white">{selectedShot.lens}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">STOCK:</span>
                <span className="text-[#e8c76d]">{selectedShot.filmstock}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedShot(null)}
                className="px-4 py-2 rounded-full text-xs font-mono text-zinc-400 hover:text-white"
              >
                Dismiss
              </button>
              <Link
                href="/studio"
                onClick={() => {
                  try {
                    cinematicAudio.playCue("start");
                  } catch {}
                }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono font-semibold text-black bg-gradient-to-r from-[#4ed4b7] to-[#5fe995] hover:shadow-lg transition-all"
              >
                <span>Direct This Scene in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const LiveFrameTicker = memo(function LiveFrameTicker({ offset = 0 }: { offset: number }) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = offset % 24;
    const interval = setInterval(() => {
      frame = (frame + 1) % 24;
      if (spanRef.current) {
        spanRef.current.textContent = `00:01:${frame < 10 ? `0${frame}` : frame}`;
      }
    }, 1000 / 24);
    return () => clearInterval(interval);
  }, [offset]);

  const initFrame = offset % 24;
  return (
    <span ref={spanRef}>
      00:01:{initFrame < 10 ? `0${initFrame}` : initFrame}
    </span>
  );
});

const CarouselCard = memo(function CarouselCard({
  shot,
  frameOffset = 0,
  onClick,
}: {
  shot: CarouselShot;
  frameOffset: number;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="w-[360px] sm:w-[420px] shrink-0 rounded-2xl bg-[#090b10]/95 border border-white/15 overflow-hidden shadow-2xl backdrop-blur-md cursor-pointer group hover:border-[#4ed4b7] hover:scale-[1.03] transition-all duration-300 will-change-transform"
      style={{ contain: "layout paint", isolation: "isolate" }}
    >
      {/* 35mm Celluloid Sprocket Top Rail with authentic stock stamp */}
      <div className="h-6 bg-black/90 px-3 flex items-center justify-between border-b border-white/10 select-none">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
          {shot.filmstock.split(" ")[0]} 35MM
        </span>
        <div className="flex items-center gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-2.5 rounded-[2px] bg-white/20 border border-black/80"
            />
          ))}
        </div>
        <span className="text-[9px] font-mono text-[#5fe995]/60">
          FR {((frameOffset + 14) % 24).toString().padStart(3, "0")}
        </span>
      </div>

      {/* Visual Canvas Area with Photographic Artwork & Ken Burns Pan */}
      <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
        <img
          src={shot.imageUrl}
          alt={shot.title}
          className="w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700"
          loading="lazy"
        />

        {/* Ambient Focal Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Scanline Pattern Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.05) 3px, rgba(255,255,255,0.05) 4px)",
          }}
        />

        {/* Top Header Chips */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[10px] font-mono z-10">
          <span className="px-2 py-0.5 rounded bg-black/70 border border-white/15 text-zinc-300 backdrop-blur-md">
            {shot.genre}
          </span>
          <span
            className="px-2 py-0.5 rounded font-semibold border backdrop-blur-md"
            style={{
              color: shot.accent,
              borderColor: `${shot.accent}50`,
              backgroundColor: "rgba(0,0,0,0.75)",
            }}
          >
            Critic: {shot.criticScore}
          </span>
        </div>

        {/* Center Hover Reticle */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="w-12 h-12 rounded-full bg-black/70 border border-[#4ed4b7] flex items-center justify-center backdrop-blur-md shadow-xl scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-4 h-4 text-[#5fe995] translate-x-0.5" />
          </div>
        </div>

        {/* Bottom Title & Running Timecode */}
        <div className="absolute bottom-3 inset-x-3 z-10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-display font-bold text-white tracking-tight group-hover:text-[#5fe995] transition-colors truncate">
              {shot.title}
            </span>
            <span className="text-[11px] font-mono text-[#5fe995] font-semibold bg-black/70 px-2 py-0.5 rounded border border-white/15 backdrop-blur-md">
              <LiveFrameTicker offset={frameOffset} />
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 block truncate mt-0.5">
            {shot.lens} · {shot.lut}
          </span>
        </div>
      </div>

      {/* 35mm Celluloid Sprocket Bottom Rail */}
      <div className="h-6 bg-black/90 px-3 flex items-center justify-between border-t border-white/10 select-none">
        <span className="text-[9px] font-mono text-zinc-500">2.39:1 DCI</span>
        <div className="flex items-center gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-2.5 rounded-[2px] bg-white/20 border border-black/80"
            />
          ))}
        </div>
        <span className="text-[9px] font-mono text-zinc-400">1/48s 24FPS</span>
      </div>
    </div>
  );
});
