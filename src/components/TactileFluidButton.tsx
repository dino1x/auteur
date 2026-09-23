"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { cinematicAudio } from "@/lib/cinematic-audio";

export interface TactileFluidButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  children: React.ReactNode;
  theme?: "cyan" | "emerald" | "amber" | "monochrome";
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
}

const PALETTES = {
  cyan: {
    primary: "vec3(0.0, 0.85, 0.95)",
    deep: "vec3(0.02, 0.15, 0.35)",
    glow: "vec3(0.4, 0.92, 1.0)",
    specular: "vec3(0.85, 0.98, 1.0)",
    border: "from-cyan-500/40 via-cyan-900/20 to-cyan-500/10",
  },
  emerald: {
    primary: "vec3(0.31, 0.83, 0.72)",
    deep: "vec3(0.04, 0.22, 0.18)",
    glow: "vec3(0.45, 0.94, 0.82)",
    specular: "vec3(0.9, 1.0, 0.96)",
    border: "from-emerald-500/40 via-emerald-950/20 to-teal-500/10",
  },
  amber: {
    primary: "vec3(0.93, 0.78, 0.38)",
    deep: "vec3(0.28, 0.16, 0.03)",
    glow: "vec3(1.0, 0.85, 0.45)",
    specular: "vec3(1.0, 0.98, 0.9)",
    border: "from-amber-500/40 via-amber-950/20 to-amber-500/10",
  },
  monochrome: {
    primary: "vec3(0.75, 0.8, 0.85)",
    deep: "vec3(0.08, 0.1, 0.14)",
    glow: "vec3(0.8, 0.85, 0.9)",
    specular: "vec3(1.0, 1.0, 1.0)",
    border: "from-white/30 via-zinc-800/20 to-white/10",
  },
};

export function TactileFluidButton({
  onClick,
  disabled = false,
  id,
  className = "",
  children,
  theme = "cyan",
  type = "button",
  ariaLabel,
}: TactileFluidButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      cinematicAudio.playCue("action");
      onClick?.();
    },
    [disabled, onClick]
  );

  useEffect(() => {
    const btn = buttonRef.current;
    const canvas = canvasRef.current;
    if (!btn || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const palette = PALETTES[theme] || PALETTES.cyan;

    const vs = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;
    const fs = `
      precision highp float;
      uniform vec2 u_res;
      uniform float u_time;
      uniform float u_level;
      uniform float u_tilt;
      uniform float u_slosh;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }
      float fbm(vec2 p) {
        float v = 0.0; float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p = p * 2.04 + vec2(11.3, 7.1);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        float ar = u_res.x / u_res.y;
        float x = uv.x * ar;
        float t = u_time;
        float amp = 0.012 + u_slosh * 0.045;
        float surf = u_level
          + u_tilt * (uv.x - 0.5) * 0.34
          + amp * sin(x * 5.1 + t * 4.6)
          + amp * 0.62 * sin(x * 9.7 + t * (-6.8) + 1.7)
          + amp * 0.38 * sin(x * 14.3 + t * 8.9 + 4.2);
        
        float d = surf - uv.y;
        vec3 col = mix(vec3(0.02, 0.04, 0.07), vec3(0.04, 0.07, 0.12), uv.y);
        col += vec3(0.02, 0.04, 0.08) * pow(max(0.0, 1.0 - abs(uv.y - 0.88) * 6.0), 2.0);

        float inside = smoothstep(0.0, 0.012, d);
        float depth = clamp(d / max(u_level, 0.001), 0.0, 1.0);
        vec3 liq = mix(${palette.primary}, ${palette.deep}, depth);
        float caust = fbm(vec2(x * 4.2, (uv.y + t * 0.14) * 4.2));
        liq *= 0.82 + 0.38 * caust;
        liq += vec3(0.02, 0.2, 0.3) * pow(max(0.0, d * 3.0), 1.5) * u_slosh;

        col = mix(col, liq, inside);
        col += ${palette.glow} * exp(-abs(d) * 80.0) * 0.85;
        col += ${palette.specular} * exp(-abs(d) * 220.0) * 0.55;

        vec2 e = uv * (1.0 - uv);
        col *= 0.6 + 0.4 * pow(e.x * e.y * 16.0, 0.22);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type: number, src: string) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const vShader = compile(gl.VERTEX_SHADER, vs);
    const fShader = compile(gl.FRAGMENT_SHADER, fs);
    if (!vShader || !fShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const locP = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(locP);
    gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uLevel = gl.getUniformLocation(prog, "u_level");
    const uTilt = gl.getUniformLocation(prog, "u_tilt");
    const uSlosh = gl.getUniformLocation(prog, "u_slosh");

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const BASE = 0.54;
    let level = BASE;
    let gulp = 0;
    let slosh = 0.35;
    let tilt = 0;
    let tiltTarget = 0;
    let lastX: number | null = null;
    let last = performance.now();
    let animId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / Math.max(1, rect.width);
      if (lastX !== null) {
        slosh = Math.min(1.4, slosh + Math.abs(x - lastX) * 2.6);
      }
      lastX = x;
      tiltTarget = Math.max(-1, Math.min(1, (x - 0.5) * 2.0));
    };

    const handleMouseLeave = () => {
      lastX = null;
      tiltTarget = 0;
    };

    const handleMouseDown = () => {
      gulp = 1.0;
      slosh = Math.min(1.4, slosh + 0.75);
    };

    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);
    btn.addEventListener("mousedown", handleMouseDown);

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      slosh *= Math.exp(-1.5 * dt);
      gulp *= Math.exp(-1.1 * dt);
      tilt += (tiltTarget - tilt) * Math.min(1, dt * 5.0);
      const levelTarget = BASE - 0.34 * gulp;
      level += (levelTarget - level) * Math.min(1, dt * 5.5);

      if (gl && canvas) {
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, now / 1000);
        gl.uniform1f(uLevel, level);
        gl.uniform1f(uTilt, tilt);
        gl.uniform1f(uSlosh, slosh);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
      btn.removeEventListener("mousedown", handleMouseDown);
      if (gl) {
        gl.deleteProgram(prog);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);
        gl.deleteBuffer(buf);
      }
    };
  }, [theme]);

  const palette = PALETTES[theme] || PALETTES.cyan;

  return (
    <div
      className={`p-[1px] rounded-2xl bg-gradient-to-b ${palette.border} shadow-2xl transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0.5 ${
        disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""
      }`}
    >
      <button
        ref={buttonRef}
        id={id}
        type={type}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={handleClick}
        className={`relative flex items-center justify-center border-0 p-0 rounded-[15px] overflow-hidden cursor-pointer bg-[#050b11] transition-all duration-300 ease-out shadow-[0_16px_36px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.06)] hover:shadow-[0_20px_44px_rgba(6,182,212,0.22)] active:scale-[0.985] ${className}`}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full block pointer-events-none"
        />
        <span className="relative z-10 pointer-events-none flex items-center gap-2 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
          {children}
        </span>
      </button>
    </div>
  );
}
