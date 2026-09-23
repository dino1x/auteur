"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Film, Compass, Sparkles, Activity } from "lucide-react";

export type ThreeSceneMode = "wave-plane" | "anamorphic-iris" | "neural-swarm";

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeMode, setActiveMode] = useState<ThreeSceneMode>("wave-plane");
  const modeRef = useRef<ThreeSceneMode>("wave-plane");

  // Keep modeRef in sync with state for the animation loop
  useEffect(() => {
    modeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.022);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 12, 38);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x07090e, 1);
    container.appendChild(renderer.domElement);

    // --- 2. Lighting ---
    const ambientLight = new THREE.AmbientLight(0x1a2634, 1.2);
    scene.add(ambientLight);

    const pointLightTeal = new THREE.PointLight(0x4ed4b7, 3.5, 90);
    pointLightTeal.position.set(-15, 20, 20);
    scene.add(pointLightTeal);

    const pointLightGold = new THREE.PointLight(0xe8c76d, 2.8, 80);
    pointLightGold.position.set(18, 15, -10);
    scene.add(pointLightGold);

    const mouseLight = new THREE.PointLight(0x5fe995, 2.5, 45);
    mouseLight.position.set(0, 5, 20);
    scene.add(mouseLight);

    // --- 3. Mode A: Undulating 3D Wave Grid Plane ---
    const gridGroup = new THREE.Group();
    scene.add(gridGroup);

    const planeWidth = 90;
    const planeDepth = 90;
    const planeSegments = 50;
    const planeGeo = new THREE.PlaneGeometry(
      planeWidth,
      planeDepth,
      planeSegments,
      planeSegments
    );
    planeGeo.rotateX(-Math.PI / 2);

    // Store original vertices for wave displacement
    const posAttr = planeGeo.attributes.position;
    const originalY = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) {
      originalY[i] = posAttr.getY(i);
    }

    const wireframeMat = new THREE.MeshStandardMaterial({
      color: 0x4ed4b7,
      wireframe: true,
      wireframeLinewidth: 1,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x11332a,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.55,
    });

    const waveMesh = new THREE.Mesh(planeGeo, wireframeMat);
    waveMesh.position.set(0, -6, -10);
    gridGroup.add(waveMesh);

    // Subtle solid reflective surface beneath wireframe to add deep specular gloss
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x0a1017,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85,
    });
    const solidMesh = new THREE.Mesh(planeGeo, solidMat);
    solidMesh.position.set(0, -6.1, -10);
    gridGroup.add(solidMesh);

    // --- 4. Mode B: Anamorphic Concentric Aperture Rings (Lens Geometry) ---
    const irisGroup = new THREE.Group();
    scene.add(irisGroup);

    const ringCount = 4;
    const rings: THREE.Mesh[] = [];
    const ringMaterials: THREE.Material[] = [];

    for (let r = 0; r < ringCount; r++) {
      const radius = 6 + r * 4.5;
      const tube = 0.08 + r * 0.02;
      const torusGeo = new THREE.TorusGeometry(radius, tube, 16, 80);
      const torusMat = new THREE.MeshStandardMaterial({
        color: r % 2 === 0 ? 0x4ed4b7 : 0xe8c76d,
        roughness: 0.15,
        metalness: 0.95,
        emissive: r % 2 === 0 ? 0x1a453e : 0x453518,
        emissiveIntensity: 0.8,
      });
      const ringMesh = new THREE.Mesh(torusGeo, torusMat);
      ringMesh.position.set(0, 4, -5 - r * 4);
      ringMesh.rotation.x = Math.PI * 0.15;
      ringMesh.rotation.y = (r * Math.PI) / 4;
      rings.push(ringMesh);
      ringMaterials.push(torusMat);
      irisGroup.add(ringMesh);
    }

    // --- 5. Mode C & Ambient: 3D Atmospheric Bokeh Starfield ---
    const particleCount = 750;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x4ed4b7),
      new THREE.Color(0x5fe995),
      new THREE.Color(0x7af2d9),
      new THREE.Color(0x98b2ff),
      new THREE.Color(0xe8c76d),
    ];

    for (let p = 0; p < particleCount; p++) {
      const p3 = p * 3;
      particlePositions[p3] = (Math.random() - 0.5) * 80;
      particlePositions[p3 + 1] = (Math.random() - 0.5) * 45 + 5;
      particlePositions[p3 + 2] = (Math.random() - 0.5) * 80;

      particleVelocities[p3] = (Math.random() - 0.5) * 0.02;
      particleVelocities[p3 + 1] = 0.015 + Math.random() * 0.03; // Drift up like theater dust
      particleVelocities[p3 + 2] = (Math.random() - 0.5) * 0.02;

      const c = palette[Math.floor(Math.random() * palette.length)];
      particleColors[p3] = c.r;
      particleColors[p3 + 1] = c.g;
      particleColors[p3 + 2] = c.b;
    }

    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particleGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(particleColors, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      size: 0.65,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- 6. Mouse Tracking & Smooth Camera Parallax ---
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    // --- 7. 60fps Animation Loop ---
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Cinematic Camera Parallax
      camera.position.x = mouse.x * 6;
      camera.position.y = 12 + mouse.y * 3.5;
      camera.lookAt(0, 1, -12);

      // Light following mouse
      mouseLight.position.x = mouse.x * 25;
      mouseLight.position.y = 5 + mouse.y * 15;

      const currentMode = modeRef.current;

      // Group visibility & smooth transitions
      gridGroup.visible = currentMode === "wave-plane";
      irisGroup.visible = currentMode === "anamorphic-iris";

      // 1. Animate 3D Wave Plane Vertices
      if (currentMode === "wave-plane") {
        const pos = planeGeo.attributes.position;
        const count = pos.count;
        const mouseGridDist = Math.hypot(mouse.x * 20, mouse.y * 20);

        for (let i = 0; i < count; i++) {
          const x = pos.getX(i);
          const z = pos.getZ(i);

          // Harmonic overlapping sine & cosine ripples
          const wave1 = Math.sin(x * 0.12 + time * 1.4) * 2.2;
          const wave2 = Math.cos(z * 0.12 + time * 1.1) * 1.8;
          const wave3 = Math.sin((x + z) * 0.08 + time * 0.8) * 1.2;

          // Mouse interactive ripple
          const dx = x - mouse.x * 30;
          const dz = z - mouse.y * 30;
          const d = Math.hypot(dx, dz);
          const ripple = Math.sin(d * 0.3 - time * 3) * Math.max(0, 1.8 - d * 0.06);

          pos.setY(i, originalY[i] + wave1 + wave2 + wave3 + ripple);
        }
        pos.needsUpdate = true;
        waveMesh.rotation.y = Math.sin(time * 0.15) * 0.04;
      }

      // 2. Animate Aperture Concentric Rings
      if (currentMode === "anamorphic-iris") {
        rings.forEach((ring, idx) => {
          const dir = idx % 2 === 0 ? 1 : -1;
          ring.rotation.z += 0.008 * dir * (idx + 1) * 0.4;
          ring.rotation.x = Math.PI * 0.15 + Math.sin(time * 0.6 + idx) * 0.1;
          ring.rotation.y = (idx * Math.PI) / 4 + mouse.x * 0.3;
        });
      }

      // 3. Animate 3D Bokeh Dust
      const pPos = particleGeo.attributes.position;
      for (let p = 0; p < particleCount; p++) {
        const p3 = p * 3;
        pPos.setX(p3, pPos.getX(p3) + particleVelocities[p3]);
        pPos.setY(p3, pPos.getY(p3) + particleVelocities[p3 + 1]);
        pPos.setZ(p3, pPos.getZ(p3) + particleVelocities[p3 + 2]);

        // Wrap particles when they float above top or drift too far
        if (pPos.getY(p3) > 35) {
          pPos.setY(p3, -15);
          pPos.setX(p3, (Math.random() - 0.5) * 80);
          pPos.setZ(p3, (Math.random() - 0.5) * 80);
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Swarm mode vortex rotation
      if (currentMode === "neural-swarm") {
        particles.rotation.y += 0.005;
      } else {
        particles.rotation.y += 0.0008;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- 8. Cleanup ---
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);

      // Clean WebGL resources
      planeGeo.dispose();
      wireframeMat.dispose();
      solidMat.dispose();
      rings.forEach((r) => r.geometry.dispose());
      ringMaterials.forEach((m) => m.dispose());
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      {/* Three.js WebGL Container */}
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      />

      {/* Cinematic 35mm Physical Celluloid Grain Texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.038] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Deep Vignette Mask for High Contrast Readability */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, transparent 35%, rgba(7, 9, 14, 0.85) 100%)",
        }}
      />

      {/* Interactive Three.js Scene Mode Switcher (Bottom-Right Floating Console) */}
      <aside
        aria-label="Three.js 3D Viewport Controls"
        className="fixed bottom-5 right-5 z-40 hidden sm:flex items-center gap-1.5 p-1 rounded-full bg-[#090b10]/90 border border-white/15 backdrop-blur-2xl shadow-2xl text-[11px] font-mono select-none"
      >
        <span className="px-2.5 text-zinc-400 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#4ed4b7] animate-pulse" />
          <span>WebGL 3D:</span>
        </span>

        <button
          onClick={() => setActiveMode("wave-plane")}
          className={`px-3 py-1 rounded-full transition-all ${
            activeMode === "wave-plane"
              ? "bg-gradient-to-r from-[#4ed4b7]/30 to-[#5fe995]/20 text-[#5fe995] border border-[#4ed4b7]/50 shadow-md font-semibold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Wave Mesh
        </button>

        <button
          onClick={() => setActiveMode("anamorphic-iris")}
          className={`px-3 py-1 rounded-full transition-all ${
            activeMode === "anamorphic-iris"
              ? "bg-gradient-to-r from-[#4ed4b7]/30 to-[#5fe995]/20 text-[#5fe995] border border-[#4ed4b7]/50 shadow-md font-semibold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Aperture Iris
        </button>

        <button
          onClick={() => setActiveMode("neural-swarm")}
          className={`px-3 py-1 rounded-full transition-all ${
            activeMode === "neural-swarm"
              ? "bg-gradient-to-r from-[#4ed4b7]/30 to-[#5fe995]/20 text-[#5fe995] border border-[#4ed4b7]/50 shadow-md font-semibold"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Neural Swarm
        </button>
      </aside>
    </>
  );
}
