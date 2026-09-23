"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sliders, Sparkles, Eye, Film } from "lucide-react";

export type BackgroundTheme = "projector" | "matrix" | "caustics";

export function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<BackgroundTheme>("projector");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const mouse = {
      x: width * 0.5,
      y: height * 0.35,
      targetX: width * 0.5,
      targetY: height * 0.35,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Floating cinematic dust motes & anamorphic bokeh
    interface BokehParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      baseAlpha: number;
      scaleX: number; // Anamorphic oval stretch
      color: string;
    }

    const motesCount = 45;
    const motes: BokehParticle[] = [];
    const colors = ["#4ed4b7", "#5fe995", "#7af2d9", "#98b2ff", "#e8c76d"];

    for (let i = 0; i < motesCount; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.15 - Math.random() * 0.3, // Slowly drift upward like theater dust
        radius: Math.random() * 3.5 + 1.2,
        alpha: 0.15 + Math.random() * 0.35,
        baseAlpha: 0.15 + Math.random() * 0.35,
        scaleX: 1.4 + Math.random() * 0.8, // Anamorphic horizontal elongation
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let time = 0;

    const render = () => {
      time += 0.012;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Deep base fill
      ctx.fillStyle = "#07090e";
      ctx.fillRect(0, 0, width, height);

      if (theme === "projector") {
        // --- 1. THEMED VOLUMETRIC PROJECTOR BEAM & ANAMORPHIC FLARE ---
        const beamOriginX = width * 0.5 + (mouse.x - width * 0.5) * 0.2;
        const beamOriginY = -40;

        // Volumetric Light Cone
        const coneGrad = ctx.createRadialGradient(
          beamOriginX,
          beamOriginY,
          20,
          mouse.x,
          mouse.y + 120,
          Math.max(width, height) * 0.85
        );
        coneGrad.addColorStop(0, "rgba(78, 212, 183, 0.28)");
        coneGrad.addColorStop(0.2, "rgba(56, 189, 248, 0.12)");
        coneGrad.addColorStop(0.45, "rgba(122, 242, 217, 0.04)");
        coneGrad.addColorStop(0.7, "rgba(15, 23, 42, 0.02)");
        coneGrad.addColorStop(1, "rgba(7, 9, 14, 0)");

        ctx.beginPath();
        ctx.moveTo(beamOriginX - 120, beamOriginY);
        ctx.lineTo(beamOriginX + 120, beamOriginY);
        ctx.lineTo(width * 1.2, height * 1.1);
        ctx.lineTo(-width * 0.2, height * 1.1);
        ctx.closePath();
        ctx.fillStyle = coneGrad;
        ctx.fill();

        // Horizontal Anamorphic Lens Flare Streak (Cooke / Panavision blue-teal flare)
        const flareY = height * 0.32 + Math.sin(time * 0.8) * 15;
        const flareGrad = ctx.createLinearGradient(0, flareY, width, flareY);
        flareGrad.addColorStop(0, "rgba(78, 212, 183, 0)");
        flareGrad.addColorStop(0.25, "rgba(56, 189, 248, 0.06)");
        flareGrad.addColorStop(0.5, "rgba(122, 242, 217, 0.22)");
        flareGrad.addColorStop(0.53, "rgba(255, 255, 255, 0.3)");
        flareGrad.addColorStop(0.56, "rgba(122, 242, 217, 0.22)");
        flareGrad.addColorStop(0.75, "rgba(56, 189, 248, 0.06)");
        flareGrad.addColorStop(1, "rgba(78, 212, 183, 0)");

        ctx.fillStyle = flareGrad;
        ctx.fillRect(0, flareY - 1.5, width, 3);

        // Soft secondary warm amber halation glow
        const halationGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y * 0.9,
          10,
          mouse.x,
          mouse.y * 0.9,
          280
        );
        halationGrad.addColorStop(0, "rgba(232, 199, 109, 0.07)");
        halationGrad.addColorStop(0.5, "rgba(78, 212, 183, 0.04)");
        halationGrad.addColorStop(1, "rgba(7, 9, 14, 0)");
        ctx.fillStyle = halationGrad;
        ctx.fillRect(0, 0, width, height);

      } else if (theme === "matrix") {
        // --- 2. 3D PERSPECTIVE SPATIAL HORIZON GRID ---
        const horizonY = height * 0.45;
        const vanishX = width * 0.5 + (mouse.x - width * 0.5) * 0.15;

        // Horizon Glow
        const horizGrad = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 80);
        horizGrad.addColorStop(0, "rgba(78, 212, 183, 0)");
        horizGrad.addColorStop(0.3, "rgba(78, 212, 183, 0.22)");
        horizGrad.addColorStop(0.35, "rgba(122, 242, 217, 0.45)");
        horizGrad.addColorStop(1, "rgba(7, 9, 14, 0)");
        ctx.fillStyle = horizGrad;
        ctx.fillRect(0, horizonY - 40, width, 120);

        // Perspective longitudinal rays converging to vanishing point
        ctx.lineWidth = 1;
        const rayCount = 28;
        for (let i = 0; i <= rayCount; i++) {
          const spread = (i / rayCount - 0.5) * 2;
          const bottomX = vanishX + spread * width * 1.1;

          const rayGrad = ctx.createLinearGradient(vanishX, horizonY, bottomX, height);
          rayGrad.addColorStop(0, "rgba(78, 212, 183, 0.4)");
          rayGrad.addColorStop(0.4, "rgba(78, 212, 183, 0.15)");
          rayGrad.addColorStop(1, "rgba(78, 212, 183, 0.02)");

          ctx.beginPath();
          ctx.moveTo(vanishX, horizonY);
          ctx.lineTo(bottomX, height);
          ctx.strokeStyle = rayGrad;
          ctx.stroke();
        }

        // Horizontal perspective depth lines (exponential perspective distribution)
        const depthLines = 18;
        for (let i = 1; i <= depthLines; i++) {
          const progress = Math.pow(i / depthLines, 2.4);
          const y = horizonY + progress * (height - horizonY);
          const alpha = progress * 0.22;

          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.strokeStyle = `rgba(78, 212, 183, ${alpha})`;
          ctx.stroke();
        }

        // Moving pulse scanline along floor
        const scanProgress = (time * 0.4) % 1;
        const scanY = horizonY + Math.pow(scanProgress, 2.4) * (height - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.strokeStyle = `rgba(122, 242, 217, ${0.4 * (1 - scanProgress)})`;
        ctx.lineWidth = 2;
        ctx.stroke();

      } else if (theme === "caustics") {
        // --- 3. HARMONIC BIOLUMINESCENT FILMSTRIP CAUSTICS ---
        const waveCount = 4;
        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          const baseY = height * (0.35 + w * 0.12);
          const freq = 0.0018 + w * 0.0006;
          const speed = time * (0.6 + w * 0.3);

          ctx.moveTo(0, baseY);
          for (let x = 0; x <= width; x += 15) {
            const y =
              baseY +
              Math.sin(x * freq + speed) * 55 +
              Math.cos(x * freq * 0.6 - speed * 0.7) * 35;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();

          const waveGrad = ctx.createLinearGradient(0, baseY - 60, 0, height);
          if (w === 0) {
            waveGrad.addColorStop(0, "rgba(78, 212, 183, 0.12)");
            waveGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.04)");
            waveGrad.addColorStop(1, "rgba(7, 9, 14, 0)");
          } else if (w === 1) {
            waveGrad.addColorStop(0, "rgba(95, 233, 149, 0.09)");
            waveGrad.addColorStop(0.6, "rgba(78, 212, 183, 0.03)");
            waveGrad.addColorStop(1, "rgba(7, 9, 14, 0)");
          } else {
            waveGrad.addColorStop(0, "rgba(122, 242, 217, 0.06)");
            waveGrad.addColorStop(1, "rgba(7, 9, 14, 0)");
          }

          ctx.fillStyle = waveGrad;
          ctx.fill();
        }
      }

      // Draw floating anamorphic dust bokeh motes across all modes
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.x += m.vx;
        m.y += m.vy;

        // Wrap edges
        if (m.y < -20) m.y = height + 10;
        if (m.x < -20) m.x = width + 10;
        if (m.x > width + 20) m.x = -10;

        // Interactive mouse repulsion/illumination
        const dx = m.x - mouse.x;
        const dy = m.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        let extraAlpha = 0;
        if (dist < 200) {
          extraAlpha = (1 - dist / 200) * 0.35;
        }

        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.scale(m.scaleX, 1); // Oval anamorphic ratio

        ctx.beginPath();
        ctx.arc(0, 0, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = m.color;
        ctx.globalAlpha = Math.min(1, m.alpha + extraAlpha);
        ctx.shadowBlur = 10;
        ctx.shadowColor = m.color;
        ctx.fill();
        ctx.restore();
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [theme]);

  return (
    <>
      {/* 60fps Hardware Accelerated Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* 35mm Celluloid Film Grain Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Optical Vignette focusing center content */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 45%, rgba(6, 8, 12, 0.75) 100%)",
        }}
      />

      {/* Floating Theme Switcher Control in Bottom Right */}
      <aside aria-label="Cinematic Backdrop Controller" className="fixed bottom-5 right-5 z-40 hidden sm:flex items-center gap-1.5 p-1 rounded-full bg-[#0b0e14]/85 border border-white/15 backdrop-blur-xl shadow-2xl text-[11px] font-mono">
        <span className="px-2.5 text-zinc-400 flex items-center gap-1">
          <Film className="w-3 h-3 text-[#4ed4b7]" />
          <span>Backdrop:</span>
        </span>

        <button
          onClick={() => setTheme("projector")}
          className={`px-2.5 py-1 rounded-full transition-all ${
            theme === "projector"
              ? "bg-[#4ed4b7]/20 text-[#5fe995] border border-[#4ed4b7]/40 shadow-sm font-semibold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Projector Ray
        </button>

        <button
          onClick={() => setTheme("matrix")}
          className={`px-2.5 py-1 rounded-full transition-all ${
            theme === "matrix"
              ? "bg-[#4ed4b7]/20 text-[#5fe995] border border-[#4ed4b7]/40 shadow-sm font-semibold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Spatial Grid
        </button>

        <button
          onClick={() => setTheme("caustics")}
          className={`px-2.5 py-1 rounded-full transition-all ${
            theme === "caustics"
              ? "bg-[#4ed4b7]/20 text-[#5fe995] border border-[#4ed4b7]/40 shadow-sm font-semibold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Wave Ribbon
        </button>
      </aside>
    </>
  );
}
