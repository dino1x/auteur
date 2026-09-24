"use client";

import React, { memo } from "react";

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
  timecode: string;
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
    imageUrl: "https://v3b.fal.media/files/b/0aab971e/JHK1CAxuntPAwoGCTYMWB.jpg",
    accent: "#4ed4b7",
    prompt: "Anamorphic 35mm pan over rain-slicked neon alleys, volumetric steam vents.",
    filmstock: "KODAK VISION3 500T",
    timecode: "00:01:14:08",
  },
  {
    id: "shot-2",
    title: "Solaris Cupola",
    genre: "Cosmic Realism",
    lens: "Ultra Prime 24mm",
    lut: "Fuji Eterna 500T",
    aspectRatio: "2.39:1",
    criticScore: "99.2%",
    imageUrl: "https://v3b.fal.media/files/b/0aab9681/3VVPc-Mwd2u6DEn3tVRjm.jpg",
    accent: "#38bdf8",
    prompt: "Slow push-in toward spherical observation cupola, blinding planetary reflection.",
    filmstock: "FUJIFILM ETERNA 250D",
    timecode: "00:01:28:16",
  },
  {
    id: "shot-3",
    title: "Arrakis Crawler",
    genre: "Desert Brutalism",
    lens: "Cooke S4/i 75mm",
    lut: "Bleach Bypass Gold",
    aspectRatio: "2.39:1",
    criticScore: "97.9%",
    imageUrl: "https://v3b.fal.media/files/b/0aab9703/5c_-GafOcE0pK14LD5Pca.jpg",
    accent: "#e8c76d",
    prompt: "Low-angle telephoto tracking shot through boiling heat shimmer.",
    filmstock: "KODAK 5285 REVERSAL",
    timecode: "00:01:42:04",
  },
  {
    id: "shot-4",
    title: "Europa Hydrothermal",
    genre: "Deep Ocean Macro",
    lens: "Master Macro 100mm",
    lut: "Eterna 250D",
    aspectRatio: "2.39:1",
    criticScore: "98.4%",
    imageUrl: "https://v3b.fal.media/files/b/0aab970b/X6cbMzd56VxmDJaC7HHDF.jpg",
    accent: "#5fe995",
    prompt: "Sub-ice exploration drone descending into bioluminescent thermal plumes.",
    filmstock: "ILFORD PAN F PLUS",
    timecode: "00:02:04:19",
  },
  {
    id: "shot-5",
    title: "Midnight Drift",
    genre: "Action Velocity",
    lens: "Canon K35 35mm",
    lut: "Vision3 500T",
    aspectRatio: "2.39:1",
    criticScore: "96.8%",
    imageUrl: "https://v3b.fal.media/files/b/0aab9716/z4CLU4Ly2F1hZiyNIIqa2.jpg",
    accent: "#c084fc",
    prompt: "Long exposure light streaks, anamorphic horizontal streak flares.",
    filmstock: "KODAK EASTMAN 5254",
    timecode: "00:02:18:22",
  },
];

const SHOTS_LANE_2: CarouselShot[] = [
  {
    id: "shot-6",
    title: "Silicon Cathedral",
    genre: "Cyber Architecture",
    lens: "ARRI Signature 28mm",
    lut: "Technicolor 3-Strip",
    aspectRatio: "2.39:1",
    criticScore: "99.5%",
    imageUrl: "https://v3b.fal.media/files/b/0aab9706/0SNbKuQaZ5cSp0GlIQD7e.jpg",
    accent: "#7af2d9",
    prompt: "Gothic vaulted archways housing liquid nitrogen quantum core towers.",
    filmstock: "TECHNICOLOR MONOPACK",
    timecode: "00:02:35:11",
  },
  {
    id: "shot-7",
    title: "Sub-Orbital Launch",
    genre: "Aerospace Epic",
    lens: "Panavision Primo 50mm",
    lut: "Kodak Vision 250D",
    aspectRatio: "2.39:1",
    criticScore: "98.9%",
    imageUrl: "https://v3b.fal.media/files/b/0aab9681/3VVPc-Mwd2u6DEn3tVRjm.jpg",
    accent: "#fb923c",
    prompt: "Rocket plume expanding in thin vacuum, diamond shockwave patterns.",
    filmstock: "NASA 70MM FLIGHT",
    timecode: "00:02:51:03",
  },
  {
    id: "shot-8",
    title: "Arctic Aurora Arc",
    genre: "Atmospheric Phenomenon",
    lens: "Zeiss Supreme 21mm",
    lut: "Custom Teal & Ice",
    aspectRatio: "2.39:1",
    criticScore: "99.1%",
    imageUrl: "https://v3b.fal.media/files/b/0aab970b/X6cbMzd56VxmDJaC7HHDF.jpg",
    accent: "#5fe995",
    prompt: "Curtains of electric emerald geomagnetic plasma rippling above pack ice.",
    filmstock: "FUJI VELVIA 50",
    timecode: "00:03:09:14",
  },
  {
    id: "shot-9",
    title: "Geisha Protocol",
    genre: "Neo-Tokyo Cyber",
    lens: "Leitz Noctilux 50mm",
    lut: "Gold Leaf Monochrome",
    aspectRatio: "2.39:1",
    criticScore: "98.1%",
    imageUrl: "https://v3b.fal.media/files/b/0aab971e/JHK1CAxuntPAwoGCTYMWB.jpg",
    accent: "#e8c76d",
    prompt: "Porcelain synthetic humanoid face reflecting gold leaf calligraphy neon.",
    filmstock: "KODAK DOUBLE-X 5222",
    timecode: "00:03:26:07",
  },
  {
    id: "shot-10",
    title: "Quantum Data Trench",
    genre: "Tech Infrastructure",
    lens: "Ultra Prime 32mm",
    lut: "Matrix Cyan LUT",
    aspectRatio: "2.39:1",
    criticScore: "97.5%",
    imageUrl: "https://v3b.fal.media/files/b/0aab9716/z4CLU4Ly2F1hZiyNIIqa2.jpg",
    accent: "#38bdf8",
    prompt: "Submerged optical fiber conduits pulsing with petabit quantum packets.",
    filmstock: "AGFA GEVAERT 200",
    timecode: "00:03:44:21",
  },
];

const SHOTS_LANE_3: CarouselShot[] = [
  {
    id: "shot-11",
    title: "Neo-Seoul Sky Garden",
    genre: "Biophilic Futurism",
    lens: "ARRI Signature 35mm",
    lut: "Kodak 5219 Tungsten",
    aspectRatio: "2.39:1",
    criticScore: "98.3%",
    imageUrl: "https://v3b.fal.media/files/b/0aab9701/zAcyfB5Tz9BGLbIh6vLfP.jpg",
    accent: "#e879f9",
    prompt: "Bioluminescent sakura trees growing atop 800-meter skybridge towers.",
    filmstock: "KODAK EKTACHROME E100",
    timecode: "00:04:02:18",
  },
  {
    id: "shot-12",
    title: "Mars Terraforming Dome",
    genre: "Colony Chronicle",
    lens: "Cooke Anamorphic 65mm",
    lut: "Red Planet Agfa",
    aspectRatio: "2.39:1",
    criticScore: "97.8%",
    imageUrl: "https://v3b.fal.media/files/b/0aab9703/5c_-GafOcE0pK14LD5Pca.jpg",
    accent: "#f87171",
    prompt: "Hydroponic mist condensing on hexagonal pressurized graphene shields.",
    filmstock: "WARM TUNGSTEN 500",
    timecode: "00:04:21:05",
  },
  {
    id: "shot-13",
    title: "Venice Tidal Canal 2100",
    genre: "Climate Speculative",
    lens: "Canon K35 24mm",
    lut: "Aqua Tint Vintage",
    aspectRatio: "2.39:1",
    criticScore: "98.7%",
    imageUrl: "https://v3b.fal.media/files/b/0aab970b/X6cbMzd56VxmDJaC7HHDF.jpg",
    accent: "#5fe995",
    prompt: "Gondolas navigating ancient arches illuminated by submerged bioluminescence.",
    filmstock: "FUJICHROME PROVIA 100F",
    timecode: "00:04:39:12",
  },
  {
    id: "shot-14",
    title: "Orbital Space Elevator",
    genre: "Mega Engineering",
    lens: "Cooke S4/i 100mm",
    lut: "Vacuum Contrast DCI",
    aspectRatio: "2.39:1",
    criticScore: "99.0%",
    imageUrl: "https://v3b.fal.media/files/b/0aab9681/3VVPc-Mwd2u6DEn3tVRjm.jpg",
    accent: "#7af2d9",
    prompt: "Carbon nanotube ribbon ascending vertically through storm clouds into orbit.",
    filmstock: "KODAK 2383 PRINT",
    timecode: "00:04:58:02",
  },
];

const StaticFilmCellCard = memo(function StaticFilmCellCard({
  shot,
  frameIndex,
}: {
  shot: CarouselShot;
  frameIndex: number;
}) {
  return (
    <div
      className="w-[360px] sm:w-[400px] shrink-0 rounded-2xl bg-[#090b10]/95 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-md"
      style={{ contain: "layout paint", isolation: "isolate" }}
    >
      {/* 35mm Celluloid Sprocket Top Rail */}
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
          FR {(frameIndex % 24).toString().padStart(3, "0")}
        </span>
      </div>

      {/* Visual Canvas Area with Photographic Stills & Subtle Depth */}
      <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
        <img
          src={shot.imageUrl}
          alt={shot.title}
          onError={(e) => {
            e.currentTarget.src = "https://v3b.fal.media/files/b/0aab971e/JHK1CAxuntPAwoGCTYMWB.jpg";
          }}
          className="w-full h-full object-cover opacity-75"
          loading="lazy"
        />

        {/* Ambient Focal Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Scanline Pattern Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.05) 3px, rgba(255,255,255,0.05) 4px)",
          }}
        />

        {/* Bottom Title & Timecode */}
        <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between">
          <span className="text-xs font-display font-semibold text-white/90 tracking-tight truncate">
            {shot.title}
          </span>
          <span className="text-[10px] font-mono text-[#5fe995]/80 bg-black/60 px-1.5 py-0.5 rounded border border-white/10">
            {shot.timecode}
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

export const LiveCinemaCarouselBackground = memo(function LiveCinemaCarouselBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#06080d]"
      aria-hidden="true"
    >
      {/* 3D Perspective Skewed Physical Filmstrip Reel Grid (Zero CPU/GPU animation lag) */}
      <div className="absolute inset-x-[-15%] inset-y-[-20%] flex flex-col justify-center gap-7 transform -rotate-6 -skew-x-6 scale-105 opacity-55 pointer-events-none">
        {/* Track 1: Staggered Horizon Reel */}
        <div className="relative w-full overflow-hidden flex items-center">
          <div className="flex items-center gap-6 -translate-x-12 shrink-0">
            {SHOTS_LANE_1.map((shot, idx) => (
              <StaticFilmCellCard
                key={`lane1-${shot.id}`}
                shot={shot}
                frameIndex={idx * 5 + 4}
              />
            ))}
          </div>
        </div>

        {/* Track 2: Center Cinematic Horizon Reel */}
        <div className="relative w-full overflow-hidden flex items-center">
          <div className="flex items-center gap-6 translate-x-8 shrink-0">
            {SHOTS_LANE_2.map((shot, idx) => (
              <StaticFilmCellCard
                key={`lane2-${shot.id}`}
                shot={shot}
                frameIndex={idx * 6 + 11}
              />
            ))}
          </div>
        </div>

        {/* Track 3: Lower Depth Horizon Reel */}
        <div className="relative w-full overflow-hidden flex items-center">
          <div className="flex items-center gap-6 -translate-x-24 shrink-0">
            {SHOTS_LANE_3.map((shot, idx) => (
              <StaticFilmCellCard
                key={`lane3-${shot.id}`}
                shot={shot}
                frameIndex={idx * 4 + 7}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Atmospheric Cinema Gradient Mask (Guarantees foreground text is 100% crisp & readable) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07090e]/92 via-[#07090e]/82 to-[#07090e]/95 pointer-events-none" />

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
        className="absolute top-[28%] inset-x-0 h-48 pointer-events-none opacity-30 blur-3xl"
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
    </div>
  );
});
