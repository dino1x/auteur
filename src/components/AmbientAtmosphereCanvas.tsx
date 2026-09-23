"use client";

import React, { useRef, useEffect } from "react";

export interface AmbientAtmosphereCanvasProps {
  className?: string;
  intensity?: number;
  palette?: "cyan" | "emerald" | "amber";
}

export function AmbientAtmosphereCanvas({
  className = "",
  intensity = 1.0,
  palette = "cyan",
}: AmbientAtmosphereCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
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

    const colorConfig = {
      cyan: {
        dark: "vec3(0.015, 0.025, 0.04)",
        mid: "vec3(0.01, 0.05, 0.08)",
        bright: "vec3(0.02, 0.09, 0.14)",
      },
      emerald: {
        dark: "vec3(0.015, 0.03, 0.03)",
        mid: "vec3(0.02, 0.07, 0.06)",
        bright: "vec3(0.03, 0.12, 0.11)",
      },
      amber: {
        dark: "vec3(0.03, 0.025, 0.015)",
        mid: "vec3(0.07, 0.05, 0.02)",
        bright: "vec3(0.13, 0.09, 0.03)",
      },
    }[palette];

    const vs = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;
    const fs = `
      precision mediump float;
      uniform vec2 u_res;
      uniform float u_time;
      uniform vec2 u_mouse;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }
      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p = p * 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        uv.x *= u_res.x / u_res.y;
        
        // Offset by mouse coordinates with smooth falloff
        uv += (u_mouse - 0.5) * 0.04;

        float t = u_time * 0.07;
        vec2 q = vec2(fbm(uv + t), fbm(uv + vec2(1.0) + t));
        vec2 r = vec2(fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t),
                      fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t));
        
        float f = fbm(uv + r);
        vec3 col = mix(${colorConfig.dark}, ${colorConfig.mid}, f);
        col = mix(col, ${colorConfig.bright}, clamp(length(q) * 0.55, 0.0, 1.0));

        // Atmospheric vignette
        vec2 e = gl_FragCoord.xy / u_res * (1.0 - gl_FragCoord.xy / u_res);
        col *= 0.45 + 0.55 * pow(e.x * e.y * 15.0, 0.3);

        gl_FragColor = vec4(col, 0.85);
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
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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

    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1.0 - e.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let animId = 0;
    const start = performance.now();

    function render(now: number) {
      if (!gl || !canvas) return;
      const elapsed = (now - start) / 1000;

      // Smooth interpolation for mouse parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed * intensity);
      gl.uniform2f(uMouse, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      if (gl) {
        gl.deleteProgram(prog);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);
        gl.deleteBuffer(buf);
      }
    };
  }, [palette, intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 w-full h-full block opacity-75 ${className}`}
    />
  );
}
