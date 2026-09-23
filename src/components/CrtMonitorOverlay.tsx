"use client";

import React, { useRef, useEffect } from "react";

export interface CrtMonitorOverlayProps {
  className?: string;
  intensity?: number;
  curveAmount?: number;
  scanlineDepth?: number;
  chromaSplit?: number;
  isActive?: boolean;
}

export function CrtMonitorOverlay({
  className = "",
  intensity = 1.0,
  curveAmount = 0.04,
  scanlineDepth = 0.45,
  chromaSplit = 0.8,
  isActive = true,
}: CrtMonitorOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const vs = `attribute vec2 aPos; void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;
    const fs = `
      precision highp float;
      uniform vec2 uRes;
      uniform float uTime;
      uniform vec2 uCurve;
      uniform float uScan;
      uniform float uScanDepth;
      uniform float uTriad;
      uniform float uChroma;
      uniform float uVignette;

      vec2 curve(vec2 uv) {
        uv = uv * 2.0 - 1.0;
        vec2 o = uv.yx * uv.yx;
        uv += uv * o * uCurve;
        uv = uv * 0.5 + 0.5;
        return uv;
      }

      void main() {
        vec2 fuv = gl_FragCoord.xy / uRes;
        vec2 uv = curve(fuv);
        float t = uTime;

        // Screen boundary mask
        vec2 inb = step(vec2(0.0), uv) * step(uv, vec2(1.0));
        float inside = inb.x * inb.y;
        vec2 ed = min(uv, 1.0 - uv);
        inside *= smoothstep(0.0, 0.025, min(ed.x, ed.y));

        // Scanline raster
        float sl = sin(uv.y * 3.14159265 * uScan + t * 4.0);
        float scanline = mix(1.0 - uScanDepth, 1.0, sl * sl);

        // Aperture grille triad mask (RGB stripe emulation)
        float gx = gl_FragCoord.x * (6.2831853 / max(uTriad, 1.0));
        vec3 grille = vec3(0.85) + 0.15 * cos(gx + vec3(0.0, 2.094, 4.188));

        // Chromatic split on glass edges
        vec2 dir = uv - 0.5;
        float dist = dot(dir, dir);
        vec3 chroma = vec3(1.0);
        chroma.r += dist * 0.08 * uChroma;
        chroma.b -= dist * 0.08 * uChroma;

        // Glass vignette & corner shading
        float vig = smoothstep(0.98, 0.25, length((uv - 0.5) * vec2(1.05, 1.0)));
        float finalVig = mix(1.0 - uVignette, 1.0, vig);

        // Ambient glass curvature reflection
        float sheen = smoothstep(0.65, 0.0, distance(uv, vec2(0.5, 0.15))) * 0.04;

        vec3 color = vec3(0.0, 0.04, 0.06);
        color = mix(color, grille * scanline * chroma, inside);
        color += vec3(sheen);
        color *= finalVig;

        // Subtle analog raster line scan
        float roll = fract(uv.y * 0.6 - t * 0.08);
        float rollLine = smoothstep(0.0, 0.04, roll) * smoothstep(0.12, 0.04, roll);
        color += vec3(0.03, 0.06, 0.05) * rollLine;

        // Alpha transparency so underlying cinematic canvas/video shines through
        float alpha = (1.0 - scanline * 0.5) * 0.45 + (1.0 - finalVig) * 0.6 + rollLine * 0.15;
        alpha = clamp(alpha, 0.0, 0.75);

        gl_FragColor = vec4(color, alpha);
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

    const locPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(locPos);
    gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uCurve = gl.getUniformLocation(prog, "uCurve");
    const uScan = gl.getUniformLocation(prog, "uScan");
    const uScanDepth = gl.getUniformLocation(prog, "uScanDepth");
    const uTriad = gl.getUniformLocation(prog, "uTriad");
    const uChroma = gl.getUniformLocation(prog, "uChroma");
    const uVignette = gl.getUniformLocation(prog, "uVignette");

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
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let animId = 0;
    const start = performance.now();

    function render(now: number) {
      if (!gl || !canvas) return;
      const elapsed = (now - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uCurve, curveAmount, curveAmount * 0.75);
      gl.uniform1f(uScan, 420.0);
      gl.uniform1f(uScanDepth, scanlineDepth * intensity);
      gl.uniform1f(uTriad, 3.0);
      gl.uniform1f(uChroma, chromaSplit);
      gl.uniform1f(uVignette, 0.45);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      if (gl) {
        gl.deleteProgram(prog);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);
        gl.deleteBuffer(buf);
      }
    };
  }, [isActive, intensity, curveAmount, scanlineDepth, chromaSplit]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-20 w-full h-full block mix-blend-screen opacity-90 ${className}`}
    />
  );
}
