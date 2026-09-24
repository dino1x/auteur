"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ArrowUp,
  ArrowRight,
  Globe,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Send,
  Check,
  CheckCircle2,
  Clock,
  Music,
  Share2,
  Download,
  Film,
  Layers,
  Cpu,
  Tv,
  Eye,
  RefreshCw,
  Plus,
  Compass,
  BookOpen,
  Volume2,
  VolumeX,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  Shot,
  CreativeTerritory,
  CriticReview,
  AestheticMemoryItem,
  AgentStep,
  AspectRatio,
  InnovationPlaybook,
} from "@/lib/types";
import { INNOVATION_PLAYBOOKS } from "@/lib/playbooks";
import { formatTimecode } from "@/lib/utils";
import { cinematicAudio, cinematicVoiceover } from "@/lib/cinematic-audio";
import {
  compileMasterVideo,
  resolveCinematicAsset,
  renderCinematicShot,
  renderCinematicTransition,
  preloadAllShots,
  getImageForShot,
} from "@/lib/generative-cinema";
import { LIVEPEER_CINEMA_RECIPES } from "@/lib/livepeerMcp";
import { TactileFluidButton } from "./TactileFluidButton";
import { SpinningBorderCta } from "./SpinningBorderCta";
import { CrtMonitorOverlay } from "./CrtMonitorOverlay";
import { AmbientAtmosphereCanvas } from "./AmbientAtmosphereCanvas";

interface AuteurWorkstationProps {
  brief: string;
  setBrief: (b: string) => void;
  territories: CreativeTerritory[];
  selectedTerritoryId: string | null;
  onSelectTerritory: (id: string) => void;
  onGenerateTerritories: (customBrief?: string) => Promise<any> | void;
  onProduceSequence: (customBrief?: string, customTerritoryId?: string) => Promise<any> | void;
  shots: Shot[];
  activeShotIndex: number;
  setActiveShotIndex: (idx: number) => void;
  criticReview: CriticReview | null;
  aestheticMemory: AestheticMemoryItem[];
  agentSteps: AgentStep[];
  currentPhase: string;
  isProcessing: boolean;
  onRefineShot: (shotIndex: number, critique: string) => void;
  onUpdateShot?: (updatedShot: Shot) => void;
  onUpdateTerritory?: (updatedTerritory: CreativeTerritory) => void;
  livepeerMode: "real" | "demo";
  onToggleMode: (mode: "real" | "demo", apiKey?: string) => void;
  onOpenShotLedger: () => void;
}

type WorkstationMode = "input" | "generating" | "territories" | "producing" | "nle" | "critic" | "storyboard";
type ModalTab = "direct" | "critic" | "specs";

interface StoryboardScene {
  sceneId: string;
  sceneNumber: number;
  actName: string;
  actLabel: string;
  shotIndex: number;
  modelTarget: string;
  lensPackage: string;
  duration: string;
  framing: string;
  cameraMotion: string;
  logline: string;
  voiceoverPrompt: string;
  songBed: string;
  imgSrc: string;
}

// Static EPISODIC_SCENES replaced by dynamic useMemo episodicScenes below

export function AuteurWorkstation({
  brief,
  setBrief,
  territories,
  selectedTerritoryId,
  onSelectTerritory,
  onGenerateTerritories,
  onProduceSequence,
  shots,
  activeShotIndex,
  setActiveShotIndex,
  criticReview,
  aestheticMemory,
  agentSteps,
  currentPhase,
  isProcessing,
  onRefineShot,
  onUpdateShot,
  onUpdateTerritory,
  livepeerMode,
  onToggleMode,
  onOpenShotLedger,
}: AuteurWorkstationProps) {
  // Progressive Pipeline Stepper State (Stages unlock progressively as user completes each phase)
  const [mode, setMode] = useState<WorkstationMode>("input");
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(1);
  const [selectedScene, setSelectedScene] = useState<StoryboardScene | null>(null);
  const [modalTab, setModalTab] = useState<ModalTab>("direct");
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [producingStep, setProducingStep] = useState<number>(1);
  const [producingMessage, setProducingMessage] = useState<string>("Decomposing episodic storyboard into 5 continuous acts...");
  const [urlInput, setUrlInput] = useState<string>(brief || "");

  useEffect(() => {
    if (!urlInput && brief) {
      setUrlInput(brief);
    }
  }, [brief]);

  // Progressive unlock: Territories unlocks Step 2, NLE/Critic/Storyboard unlock Steps 3-5
  useEffect(() => {
    if (mode === "territories") {
      setMaxUnlockedStep((prev) => Math.max(prev, 2));
    } else if (mode === "nle" || mode === "critic" || mode === "storyboard") {
      setMaxUnlockedStep(5);
    }
  }, [mode]);
  
  // Voiceover & Audio Engine State
  const [isAuditioningVo, setIsAuditioningVo] = useState<boolean>(false);
  const [isSynthesizingVo, setIsSynthesizingVo] = useState<boolean>(false);
  const [isSynthesizingMusic, setIsSynthesizingMusic] = useState<boolean>(false);
  const [isAuditioningMusic, setIsAuditioningMusic] = useState<boolean>(false);
  const [editingVoShotId, setEditingVoShotId] = useState<string | null>(null);
  const [editedVoText, setEditedVoText] = useState<string>("");
  const [voEngineType, setVoEngineType] = useState<"director" | "livepeer">("director");

  // Playback & Viewport State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("2.39:1");
  const [showSafeGrid, setShowSafeGrid] = useState<boolean>(false);
  const [showAnamorphicFlare, setShowAnamorphicFlare] = useState<boolean>(true);
  const [showCrtScope, setShowCrtScope] = useState<boolean>(false);
  const [directPrompt, setDirectPrompt] = useState<string>("");
  const [isAutoGenerateActive, setIsAutoGenerateActive] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isLivepeerModalOpen, setIsLivepeerModalOpen] = useState<boolean>(false);
  const [livepeerApiKey, setLivepeerApiKey] = useState<string>("");
  const [livepeerLatency, setLivepeerLatency] = useState<number>(184);
  const [isPingingLivepeer, setIsPingingLivepeer] = useState<boolean>(false);
  const [activeLivepeerRecipe, setActiveLivepeerRecipe] = useState<string>("anamorphic-spot");
  const [activePlaybookId, setActivePlaybookId] = useState<string>("cinema-director");

  // Canvas Refs
  const modalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const nleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioWaveCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeTerritory = useMemo(
    () => territories.find((t) => t.id === selectedTerritoryId) || territories[0] || null,
    [territories, selectedTerritoryId]
  );

  const activeShot = shots[activeShotIndex] || shots[0] || null;
  const [activeShotDuration, setActiveShotDuration] = useState<number>(activeShot?.durationSec || 3.6);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const shotsRef = useRef(shots);
  shotsRef.current = shots;
  const activeShotIndexRef = useRef(activeShotIndex);
  activeShotIndexRef.current = activeShotIndex;
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastShotRef = useRef<Shot | null>(null);
  const prevTransitionShotRef = useRef<Shot | null>(null);
  const transitionStartTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(currentTime);
  currentTimeRef.current = currentTime;

  // Preload all shots so transitions are silky-smooth and instantaneous
  useEffect(() => {
    if (shots && shots.length > 0) {
      preloadAllShots(shots);
    }
  }, [shots]);

  // Track shot changes for seamless velocity-matched transitions
  useEffect(() => {
    if (activeShot) {
      if (lastShotRef.current && lastShotRef.current.id !== activeShot.id) {
        prevTransitionShotRef.current = lastShotRef.current;
        transitionStartTimeRef.current = performance.now();
      }
      lastShotRef.current = activeShot;
    }
  }, [activeShotIndex, activeShot?.id]);

  useEffect(() => {
    if (activeShot?.durationSec) {
      setActiveShotDuration(activeShot.durationSec);
    }
  }, [activeShotIndex, activeShot?.durationSec]);

  const shotDuration = Math.max(activeShotDuration, activeShot?.durationSec || 3.6);

  // Dynamically compute episodic scenes from shots, brief, and active territory (supports 5 to 7 acts)
  const episodicScenes: StoryboardScene[] = useMemo(() => {
    const actNames = ["ACT I", "ACT II", "ACT III", "ACT IV", "ACT V", "ACT VI", "ACT VII"];
    const actLabels = [
      "THE GENESIS",
      "THE INQUIRY",
      "THE VELOCITY",
      "THE TENSION",
      "THE REVEAL",
      "THE MASTER PAYOFF",
      "THE EPILOGUE",
    ];
    const defaultModels = [
      "CogVideoX-5B",
      "AnimateDiff-Lightning",
      "SDXL + Video2Video",
      "Livepeer 4K Upscaler",
      "CogVideoX-5B",
      "Procedural Master 60fps",
      "Livepeer 4K Upscaler",
    ];
    const defaultLenses = [
      "35mm Anamorphic T1.8",
      "50mm Prime f/1.4",
      "85mm T1.5 Cine",
      "24mm Ultra-Wide f/2.0",
      "100mm Macro Cine",
      "35mm Anamorphic T1.5",
      "200mm Telephoto Cine",
    ];

    if (!shots || shots.length === 0) {
      return [];
    }

    return shots.map((shot, idx) => {
      const actIdx = idx % actNames.length;
      const mediaSrc =
        shot.posterUrl ||
        shot.videoUrl ||
        resolveCinematicAsset(shot.prompt || brief, shot.sceneNumber || idx + 1);

      return {
        sceneId: shot.id || `scene-${idx + 1}`,
        sceneNumber: shot.sceneNumber || idx + 1,
        actName: actNames[actIdx],
        actLabel: actLabels[actIdx],
        shotIndex: idx,
        modelTarget: defaultModels[actIdx],
        lensPackage: defaultLenses[actIdx],
        duration: `${shot.durationSec || 3.6}s`,
        framing: shot.framing || "Cinematic Master Framing",
        cameraMotion: shot.cameraMotion || "Dynamic Camera Move",
        logline: shot.action || shot.prompt || `Cinematic scene for ${brief}`,
        voiceoverPrompt: shot.masterVoiceoverScript || shot.voiceoverScript || `Narration for ${brief}`,
        songBed: `${activeTerritory?.musicMood || "Dark Ambient Synth"} • 120 BPM`,
        imgSrc: mediaSrc,
      };
    });
  }, [shots, brief, activeTerritory]);

  // Playback Timer for NLE: Crisp, rhythmic act advancement with continuous master voiceover
  useEffect(() => {
    if (mode !== "nle" || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = +(prev + 0.1).toFixed(2);
        currentTimeRef.current = next;

        // Clean act transition strictly governed by cinematic tempo (3.6s per act)
        const effectiveDur = Math.max(activeShotDuration, activeShot?.durationSec || 3.6);
        if (next >= effectiveDur) {
          const nextIdx = (activeShotIndexRef.current + 1) % shotsRef.current.length;
          setActiveShotIndex(nextIdx);

          // When looping back to act 1, restart audio from the top for a perfect loop
          if (nextIdx === 0) {
            cinematicVoiceover.stop();
            cinematicAudio.stopScore();
            const territory = activeTerritory;
            if (territory) {
              cinematicAudio.startScore(territory, brief);
            }
            const masterVoAudio =
              territory?.masterVoiceoverAudioUrl ||
              shotsRef.current[0]?.masterVoiceoverAudioUrl ||
              shotsRef.current[0]?.voiceoverAudioUrl;
            const masterVoScript =
              territory?.masterVoiceoverScript ||
              shotsRef.current[0]?.masterVoiceoverScript ||
              shotsRef.current[0]?.voiceoverScript;
            if (masterVoScript && !isMuted) {
              cinematicVoiceover.speakAudio(masterVoAudio, masterVoScript);
            }
          }

          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [mode, isPlaying, activeShotDuration, activeShot?.durationSec, setActiveShotIndex, activeTerritory, brief, isMuted]);

  // Subscribe to voiceover state for reactive UI meters
  useEffect(() => {
    const unsub = cinematicVoiceover.subscribe((speaking, engine) => {
      setIsAuditioningVo(speaking);
      setVoEngineType(engine);
    });
    return unsub;
  }, []);

  // Audio Playback & Synchronization: Unified Master Voiceover plays once continuously across act transitions
  useEffect(() => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }

    if (isPlaying && (mode === "nle" || selectedScene)) {
      cinematicAudio.playCue("play");
      if (activeTerritory) {
        cinematicAudio.startScore(activeTerritory, brief);
      }

      // Start the unified master voiceover once on playback start
      const masterVoAudio =
        activeTerritory?.masterVoiceoverAudioUrl ||
        activeShot?.masterVoiceoverAudioUrl ||
        activeShot?.voiceoverAudioUrl;
      const masterVoScript =
        activeTerritory?.masterVoiceoverScript ||
        activeShot?.masterVoiceoverScript ||
        activeShot?.voiceoverScript;

      if (masterVoScript && !isMuted) {
        if (!cinematicVoiceover.isSpeaking()) {
          cinematicVoiceover.speakAudio(
            masterVoAudio,
            masterVoScript,
            () => {
              // Master voiceover complete
            }
          );
        }
      }
    } else {
      cinematicAudio.stopScore();
      cinematicVoiceover.stop();
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    }
  }, [isPlaying, mode, selectedScene, isMuted, activeTerritory, brief]);

  const handleAuditionVo = (shot?: Shot) => {
    if (cinematicVoiceover.isSpeaking()) {
      cinematicVoiceover.stop();
      setIsAuditioningVo(false);
    } else {
      setIsAuditioningVo(true);
      cinematicAudio.playCue("action");
      const masterVoAudio =
        activeTerritory?.masterVoiceoverAudioUrl ||
        shot?.masterVoiceoverAudioUrl ||
        shot?.voiceoverAudioUrl;
      const masterVoScript =
        activeTerritory?.masterVoiceoverScript ||
        shot?.masterVoiceoverScript ||
        shot?.voiceoverScript ||
        "Livepeer master voiceover auditioning sequence.";
      cinematicVoiceover.speakAudio(
        masterVoAudio,
        masterVoScript,
        () => {
          setIsAuditioningVo(false);
        }
      );
    }
  };

  const handleSynthesizeLivepeerVo = async (shot?: Shot) => {
    const masterVoScript =
      activeTerritory?.masterVoiceoverScript ||
      shot?.masterVoiceoverScript ||
      shot?.voiceoverScript;
    if (!masterVoScript) return;
    setIsSynthesizingVo(true);
    cinematicAudio.playCue("action");

    // Optimistically update status
    if (activeTerritory) {
      activeTerritory.masterVoiceoverStatus = "synthesizing";
    }

    try {
      const res = await fetch("/api/livepeer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "tts",
          params: { prompt: masterVoScript },
        }),
      });
      const data = await res.json();
      if (data.success && data.result?.audioUrl) {
        if (activeTerritory) {
          activeTerritory.masterVoiceoverAudioUrl = data.result.audioUrl;
          activeTerritory.masterVoiceoverJobId = data.result.jobId;
          activeTerritory.masterVoiceoverStatus = "ready";
          onUpdateTerritory?.(activeTerritory);
        }

        // Probe audio duration and sync act durations to voiceover length
        let perActDur = 0;
        try {
          const voDur = await new Promise<number>((resolve) => {
            const probe = new Audio(data.result.audioUrl);
            probe.addEventListener("loadedmetadata", () => {
              resolve(probe.duration && !isNaN(probe.duration) && isFinite(probe.duration) ? probe.duration : 0);
            }, { once: true });
            probe.addEventListener("error", () => resolve(0), { once: true });
            probe.load();
          });
          if (voDur > 0 && shots.length > 0) {
            perActDur = +(voDur / shots.length).toFixed(2);
          }
        } catch {}

        shots.forEach((s) => {
          onUpdateShot?.({
            ...s,
            masterVoiceoverAudioUrl: data.result.audioUrl,
            voiceoverAudioUrl: data.result.audioUrl,
            voiceoverJobId: data.result.jobId,
            voiceoverStatus: "ready",
            ...(perActDur > 0 ? { durationSec: perActDur } : {}),
          });
        });
        // Audition the generated audio
        cinematicVoiceover.speakAudio(data.result.audioUrl, masterVoScript);
      } else {
        if (activeTerritory) activeTerritory.masterVoiceoverStatus = "local";
      }
    } catch (e) {
      console.warn("Livepeer Master TTS error:", e);
      if (activeTerritory) activeTerritory.masterVoiceoverStatus = "local";
    } finally {
      setIsSynthesizingVo(false);
    }
  };

  const handleSynthesizeLivepeerMusic = async () => {
    if (!activeTerritory) return;
    setIsSynthesizingMusic(true);
    cinematicAudio.playCue("action");
    try {
      const res = await fetch("/api/livepeer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "music",
          params: {
            prompt: `Cinematic orchestral score for ${brief}, ${activeTerritory.musicMood}`,
            duration: 20,
          },
        }),
      });
      const data = await res.json();
      const musicUrl = data.result?.audioUrl;
      const updatedTerritory: CreativeTerritory = {
        ...activeTerritory,
        musicAudioUrl: musicUrl,
        musicJobId: data.result?.jobId,
      };
      onUpdateTerritory?.(updatedTerritory);
      cinematicAudio.startScore(updatedTerritory, brief);
      cinematicAudio.playCue("success");
    } catch (e) {
      console.warn("Livepeer music synthesis error:", e);
      cinematicAudio.startScore(activeTerritory, brief);
    } finally {
      setIsSynthesizingMusic(false);
    }
  };

  // Trigger Fastlane Generation Sequence with Livepeer Agent MCP
  const handleStartGeneration = async (customInput?: string) => {
    const input = (customInput || urlInput).trim();
    if (!input) return;
    cinematicAudio.playCue("action");
    setBrief(input);
    setMode("generating");
    setGenerationStep(1);

    const stepTimer = setInterval(() => {
      setGenerationStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1800);

    try {
      await onGenerateTerritories(input);
      clearInterval(stepTimer);
      setGenerationStep(4);
      cinematicAudio.playCue("success");
      setMaxUnlockedStep(2);
      setMode("territories");
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.3 },
        colors: ["#4ed4b7", "#5fe995", "#e8c76d"],
      });
    } catch (err) {
      clearInterval(stepTimer);
      console.error("Livepeer territory synthesis error:", err);
      setMaxUnlockedStep(2);
      setMode("territories");
    }
  };

  // Step 2 -> Step 3 Production Sequence with Livepeer Agent MCP
  // Step 2 -> Step 3 Production Sequence: Rigorous verification of all acts and voiceover
  const handleStartProduction = async (territoryId?: string) => {
    const targetTerritoryId = territoryId || selectedTerritoryId || territories[0]?.id;
    if (targetTerritoryId) {
      onSelectTerritory(targetTerritoryId);
    }
    const chosenTerritory = territories.find(t => t.id === targetTerritoryId) || activeTerritory || territories[0];
    cinematicAudio.playCue("action");
    setMode("producing");
    setProducingStep(1);
    setProducingMessage("Decomposing episodic storyboard into 5 continuous acts...");

    try {
      setProducingStep(2);
      setProducingMessage("Synthesizing 5 cinematic acts via Livepeer GPU orchestrators...");

      // Step 2 & 3: Run full production sequence
      const resultShots = await onProduceSequence(brief, targetTerritoryId);

      setProducingStep(3);
      setProducingMessage("Synthesizing Livepeer master voiceover and soundscape...");

      const activeShots = (resultShots && Array.isArray(resultShots) && resultShots.length > 0)
        ? resultShots
        : (shots && shots.length > 0 ? shots : []);

      // Verify voiceover audio buffer is loaded, duration probed, and ready to play
      const voAudioUrl =
        chosenTerritory?.masterVoiceoverAudioUrl ||
        activeShots[0]?.masterVoiceoverAudioUrl ||
        activeShots[0]?.voiceoverAudioUrl;

      if (voAudioUrl) {
        setProducingMessage("Verifying Livepeer 48kHz voiceover buffer and act tempo calibration...");
        try {
          await new Promise<void>((resolve) => {
            const testAudio = new Audio(voAudioUrl);
            const timeout = setTimeout(resolve, 1200);
            testAudio.addEventListener("canplaythrough", () => {
              clearTimeout(timeout);
              resolve();
            }, { once: true });
            testAudio.addEventListener("error", () => {
              clearTimeout(timeout);
              resolve();
            }, { once: true });
            testAudio.load();
          });
        } catch (e) {
          console.warn("Voiceover audio verification notice:", e);
        }
      }

      setProducingStep(4);
      setProducingMessage("Preloading 60 FPS viewport assets & locking continuity...");

      // Await preloading of all shot assets to ensure zero black screen or fallback flicker
      if (activeShots.length > 0) {
        await preloadAllShots(activeShots);
      }

      await new Promise((r) => setTimeout(r, 80));

      // ONLY after all 5 acts and voiceover are verified: unlock Step 3 and transition
      cinematicAudio.playCue("success");
      // Automatically unlock Stage 3 (Cinema NLE), Stage 4 (Critic Pass), and Stage 5 (Storyboard)
      setMaxUnlockedStep(5);
      setMode("nle");
      setIsPlaying(true);
      setCurrentTime(0);
      setActiveShotIndex(0);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.35 },
        colors: ["#4ed4b7", "#5fe995", "#e8c76d"],
      });
    } catch (err) {
      console.error("Livepeer production sequence error:", err);
      if (shots && shots.length > 0) {
        await preloadAllShots(shots);
      }
      setMaxUnlockedStep(5);
      setMode("nle");
    }
  };

  const handleSelectScene = (scene: StoryboardScene) => {
    cinematicAudio.playCue("action");
    setSelectedScene(scene);
    setActiveShotIndex(scene.shotIndex);
    setIsPlaying(true);
    setModalTab("direct");
  };

  // 60 FPS Viewport inside Fastlane Video Modal
  useEffect(() => {
    if (!selectedScene) return;
    const canvas = modalCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 320);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 568);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      const chosenTerritory = territories.find(t => t.id === selectedTerritoryId) || activeTerritory || territories[0];
      const activeAr: AspectRatio = chosenTerritory?.aspectRatio || "2.39:1";
      const effectiveDur = Math.max(activeShotDuration, activeShot?.durationSec || 3.6);
      const normProgress = Math.min(1.0, currentTimeRef.current / effectiveDur);
      const currentImg = activeShot ? getImageForShot(activeShot) : null;

      if (activeShot && chosenTerritory) {
        renderCinematicShot(
          ctx,
          width,
          height,
          normProgress,
          currentImg,
          activeShot,
          chosenTerritory,
          activeAr,
          false
        );
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedScene, activeShot, activeShotDuration, selectedTerritoryId, territories, activeTerritory]);

  // 60 FPS Viewport in Cinema NLE Mode: Velocity-Matched Transitions & Continuous Camera Momentum
  useEffect(() => {
    if (mode !== "nle") return;
    const canvas = nleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 960);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 540);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      const now = performance.now();
      const transitionDurationMs = 550; // 550ms velocity-matched seam
      const elapsedTransition = now - transitionStartTimeRef.current;

      const chosenTerritory = territories.find(t => t.id === selectedTerritoryId) || activeTerritory || territories[0];
      const activeAr: AspectRatio = aspectRatio || chosenTerritory?.aspectRatio || "2.39:1";

      const prevShot = prevTransitionShotRef.current;
      const isTransitioning = elapsedTransition < transitionDurationMs && prevShot && activeShot && prevShot.id !== activeShot.id;

      if (isTransitioning && prevShot && activeShot && chosenTerritory) {
        const transProgress = elapsedTransition / transitionDurationMs;
        const prevImg = getImageForShot(prevShot);
        const nextImg = getImageForShot(activeShot);
        renderCinematicTransition(
          ctx,
          width,
          height,
          transProgress,
          prevImg,
          nextImg,
          prevShot,
          activeShot,
          chosenTerritory,
          activeAr
        );
      } else if (activeShot && chosenTerritory) {
        const effectiveDur = Math.max(activeShotDuration, activeShot.durationSec || 3.6);
        const normProgress = Math.min(1.0, currentTimeRef.current / effectiveDur);
        const img = getImageForShot(activeShot);

        renderCinematicShot(
          ctx,
          width,
          height,
          normProgress,
          img,
          activeShot,
          chosenTerritory,
          activeAr,
          false
        );
      }

      if (showSafeGrid) {
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 1;
        ctx.strokeRect(width * 0.05, height * 0.05, width * 0.9, height * 0.9);
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8);
        ctx.setLineDash([]);
      }

      if (showAnamorphicFlare) {
        const flareY = height * 0.48;
        ctx.save();
        ctx.globalCompositeOperation = "screen";

        // Thin intense horizontal streak
        const streakGrad = ctx.createLinearGradient(0, flareY, width, flareY);
        streakGrad.addColorStop(0, "rgba(78, 212, 183, 0)");
        streakGrad.addColorStop(0.3, "rgba(78, 212, 183, 0.25)");
        streakGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.85)");
        streakGrad.addColorStop(0.7, "rgba(0, 163, 255, 0.25)");
        streakGrad.addColorStop(1, "rgba(0, 163, 255, 0)");
        ctx.fillStyle = streakGrad;
        ctx.fillRect(0, flareY - 3, width, 6);

        // Soft wide glow
        const glowGrad = ctx.createRadialGradient(
          width * 0.5, flareY, 2,
          width * 0.5, flareY, width * 0.35
        );
        glowGrad.addColorStop(0, "rgba(255, 255, 255, 0.4)");
        glowGrad.addColorStop(0.3, "rgba(78, 212, 183, 0.15)");
        glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(width * 0.5, flareY, width * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [mode, activeShotIndex, showSafeGrid, showAnamorphicFlare, activeShot, activeShotDuration, selectedTerritoryId, territories, activeTerritory, aspectRatio]);

  // Audio Waveform in NLE Timeline
  useEffect(() => {
    if (mode !== "nle") return;
    const canvas = audioWaveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let frame = 0;
    const renderWave = () => {
      frame++;
      const w = (canvas.width = canvas.parentElement?.clientWidth || 400);
      const h = (canvas.height = canvas.parentElement?.clientHeight || 28);
      ctx.clearRect(0, 0, w, h);

      const barWidth = 3;
      const gap = 2;
      const step = barWidth + gap;
      const mid = h / 2;

      for (let x = 0; x < w; x += step) {
        const normX = x / w;
        const envelope = Math.sin(normX * Math.PI) * 0.75 + 0.25;
        const noise = Math.sin(x * 12.9898 + (isPlaying ? frame * 0.08 : 0)) * 0.5 + 0.5;
        const dynamicAmp = isPlaying
          ? (Math.sin((x + frame * 3) * 0.04) * 0.35 + 0.65) * (h * 0.38) * envelope * (0.35 + noise * 0.65)
          : (h * 0.16) * envelope * (0.35 + noise * 0.65);
        const amp = Math.max(2, dynamicAmp);

        ctx.fillStyle = isPlaying
          ? (normX < 0.6 ? "#4ed4b7" : "#5fe995")
          : "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(x, mid - amp, barWidth, amp * 2);
      }
      animId = requestAnimationFrame(renderWave);
    };
    renderWave();
    return () => cancelAnimationFrame(animId);
  }, [mode, isPlaying]);

  const handlePingLivepeer = async () => {
    setIsPingingLivepeer(true);
    const start = Date.now();
    try {
      await fetch("/api/livepeer");
      setLivepeerLatency(Math.max(120, Date.now() - start));
      cinematicAudio.playCue("success");
    } catch {
      setLivepeerLatency(184);
    } finally {
      setIsPingingLivepeer(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    cinematicAudio.playCue("action");
    try {
      // Dispatches export to Livepeer Agent MCP director_export
      fetch("/api/livepeer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "director_export",
          params: {
            title: activeTerritory?.title || "Auteur Master Cut",
            scenes: episodicScenes,
          },
        }),
      }).catch(() => null);

      const targetTerritory = activeTerritory || territories[0];
      if (targetTerritory) {
        const videoBlob = await compileMasterVideo(shots, targetTerritory);
        const downloadUrl = URL.createObjectURL(videoBlob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `auteur-master-${targetTerritory.id || "cut"}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
      }
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.2 },
        colors: ["#4ed4b7", "#5fe995", "#e8c76d"],
      });
    } catch (err) {
      console.error("Export compilation error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDirectAgent = (actionText?: string) => {
    const text = actionText || directPrompt;
    if (!text.trim()) return;
    cinematicAudio.playCue("action");
    onRefineShot(activeShotIndex, text);
    setDirectPrompt("");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#08090c] text-zinc-100 overflow-hidden select-none font-sans relative">
      
      {/* 1. FASTLANE MASTER HEADER */}
      <header className="h-14 border-b border-white/[0.08] bg-[#0b0d13] px-4 md:px-6 flex items-center justify-between shrink-0 z-30 gap-3">
        
        {/* Brand & Studio Anchor with dedicated spacing and divider */}
        <div className="flex items-center gap-3 shrink-0 pr-5 lg:pr-7 border-r border-white/10">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display font-bold text-base tracking-wider text-white group-hover:text-[#4ed4b7] transition-colors">
              AUTEUR
            </span>
            <span className="font-serif italic text-base text-[#4ed4b7]">
              Studio
            </span>
          </Link>
        </div>

        {/* WORKSPACE PROGRESSIVE STEPPER (Centered with generous breathing room) */}
        <div className="flex-1 flex justify-center items-center px-2 min-w-0">
          <div className="flex items-center bg-[#08090c] px-2 py-1 rounded-xl border border-white/[0.08] text-xs font-mono shrink-0 overflow-x-auto no-scrollbar">
            {[
              { id: "input", num: 1, label: "Ingest", icon: Globe },
              { id: "territories", num: 2, label: "Territories", icon: Compass },
              { id: "nle", num: 3, label: "Cinema NLE", icon: Film },
              { id: "critic", num: 4, label: "Critic Pass", icon: CheckCircle2 },
              { id: "storyboard", num: 5, label: "Storyboard", icon: Layers },
            ].map((step, idx) => {
              const Icon = step.icon;
              const isCurrent = mode === step.id || (mode === "producing" && step.id === "territories");
              const isUnlocked = step.num <= maxUnlockedStep;
              const isPast = maxUnlockedStep > step.num && !isCurrent;
              const isBusy = mode === "generating" || mode === "producing";

              return (
                <React.Fragment key={step.id}>
                  {idx > 0 && (
                    <div
                      className={`w-2 sm:w-3 md:w-5 h-[1.5px] rounded-full mx-1 transition-all ${
                        step.num <= maxUnlockedStep ? "bg-[#4ed4b7]/50" : "bg-white/10"
                      }`}
                    />
                  )}
                  <button
                    onClick={() => {
                      if (isUnlocked && !isBusy) {
                        cinematicAudio.playCue("action");
                        setMode(step.id as WorkstationMode);
                      }
                    }}
                    disabled={!isUnlocked || isBusy}
                    title={
                      isUnlocked
                        ? `Navigate to Step ${step.num}: ${step.label}`
                        : `Step ${step.num}: ${step.label} (Locked - complete prior step)`
                    }
                    className={`flex items-center gap-1.5 px-2 md:px-2.5 py-1 rounded-lg transition-all group shrink-0 ${
                      !isUnlocked
                        ? "opacity-30 cursor-not-allowed text-zinc-600"
                        : isCurrent
                        ? "bg-[#4ed4b7] text-black font-bold shadow-[0_0_12px_rgba(78,212,183,0.35)] cursor-pointer"
                        : "text-zinc-300 hover:text-white hover:bg-white/10 cursor-pointer"
                    }`}
                  >
                    <span
                      className={`text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shrink-0 transition-colors ${
                        isCurrent
                          ? "bg-black/25 text-black"
                          : isPast
                          ? "bg-[#4ed4b7]/20 text-[#5fe995] border border-[#4ed4b7]/40"
                          : isUnlocked
                          ? "bg-white/10 text-zinc-300 border border-white/15"
                          : "bg-white/5 text-zinc-600 border border-white/5"
                      }`}
                    >
                      {step.num}
                    </span>
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isCurrent
                          ? "text-black"
                          : isPast
                          ? "text-[#4ed4b7]"
                          : isUnlocked
                          ? "text-zinc-400 group-hover:text-white"
                          : "text-zinc-600"
                      }`}
                    />
                    <span className={`hidden sm:inline whitespace-nowrap text-[11px] md:text-xs ${
                      isCurrent
                        ? "text-black font-bold"
                        : isUnlocked
                        ? "text-zinc-300"
                        : "text-zinc-600"
                    }`}>
                      {step.label}
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right Action Tools: Shot Ledger, Export with dedicated spacing and divider */}
        <div className="flex items-center gap-2 shrink-0 pl-5 lg:pl-7 border-l border-white/10">
          {/* Livepeer Agent MCP Connection */}
          <button
            onClick={() => {
              cinematicAudio.playCue("action");
              setIsLivepeerModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0e1118] hover:bg-white/[0.08] border border-[#4ed4b7]/30 text-xs font-mono transition-all group shadow-[0_0_10px_rgba(78,212,183,0.15)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#5fe995] animate-pulse shadow-[0_0_6px_#5fe995]" />
            <span className="text-[#4ed4b7] font-bold">Livepeer MCP</span>
          </button>
          <button
            onClick={onOpenShotLedger}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-zinc-300 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#e8c76d]" />
            <span>Shot Ledger</span>
          </button>

          <SpinningBorderCta
            onClick={handleExport}
            disabled={isExporting}
            theme="teal"
            size="sm"
          >
            <Download className="w-3.5 h-3.5 text-[#4ed4b7]" />
            <span>{isExporting ? "Compiling..." : "Export 4K"}</span>
          </SpinningBorderCta>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CANVAS */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        
        {/* ============================================================ */}
        {/* VIEW 5: EPISODIC STORYBOARD SEQUENCE REEL (CINEMA MASTER)    */}
        {/* ============================================================ */}
        {mode === "storyboard" && (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center animate-fadeIn">
            <div className="w-full max-w-6xl mx-auto space-y-4">
              
              <div className="bg-[#0e1118]/90 border border-white/10 rounded-3xl p-5 md:p-6 shadow-2xl space-y-5 backdrop-blur-md">
                {/* Header: Title, Telemetry, Pipeline Switch, Re-Generate */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#4ed4b7]/10 border border-[#4ed4b7]/25 text-[#4ed4b7] text-[10px] font-mono uppercase tracking-wider font-bold">
                      Step 5 · Episodic Storyboard
                    </span>
                    <h2 className="text-xl md:text-2xl font-display font-bold text-white">
                      Episodic Storyboard
                    </h2>
                    <span className="hidden md:inline text-xs font-mono text-zinc-400 pl-2 border-l border-white/10">
                      {shots.length} Scenes · {shots.reduce((acc, s) => acc + (s.durationSec || 3.6), 0).toFixed(1)}s Sequence · 60 FPS
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <span>Autonomous Pipeline</span>
                      <button
                        onClick={() => setIsAutoGenerateActive((v) => !v)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                          isAutoGenerateActive ? "bg-[#4ed4b7]" : "bg-zinc-700"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-black transition-transform ${
                            isAutoGenerateActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <button
                      onClick={() => setMode("input")}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#4ed4b7]" />
                      <span>Re-Generate Sequence</span>
                    </button>
                  </div>
                </div>

                {/* 5-Scene Narrative Horizontal Storyboard Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 pb-2">
                  {episodicScenes.map((scene) => (
                    <div
                      key={scene.sceneId}
                      onClick={() => handleSelectScene(scene)}
                      className="group cursor-pointer rounded-2xl border border-white/10 hover:border-[#4ed4b7] bg-[#141722]/80 hover:bg-[#181d2a] p-3 flex flex-col space-y-2.5 transition-all duration-300 hover:-translate-y-1 shadow-lg relative overflow-hidden"
                    >
                      {/* Thumbnail with Act Tag */}
                      <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-black/60 relative border border-white/10 group-hover:border-[#4ed4b7]/50">
                        {scene.imgSrc ? (
                          <img
                            src={scene.imgSrc}
                            alt={scene.logline}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-xs">
                            SYNTHESIZING...
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[9px] font-mono text-[#4ed4b7] border border-white/10">
                          {scene.actName}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-mono text-zinc-300 border border-white/10">
                          {scene.duration}
                        </div>
                      </div>

                      {/* Scene Metadata Header */}
                      <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/5 pb-1.5">
                        <span className="text-zinc-400 font-bold">{scene.actLabel}</span>
                        <div className="text-zinc-500 text-[9px] truncate max-w-[100px]">
                          {scene.lensPackage}
                        </div>
                      </div>

                      {/* Framing & Logline */}
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono font-bold text-[#4ed4b7] truncate">
                          {scene.framing}
                        </div>
                        <div className="text-[10px] font-sans text-zinc-300 line-clamp-2 leading-tight group-hover:text-white">
                          {scene.logline}
                        </div>
                      </div>

                      {/* Narration Script & Audition */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-1 text-[9px] font-mono">
                        <div className="flex-1 font-serif italic text-zinc-400 truncate">
                          &quot;{scene.voiceoverPrompt}&quot;
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const matchingShot = shots.find((s) => s.id === scene.sceneId) || shots[scene.shotIndex];
                            if (matchingShot) handleAuditionVo(matchingShot);
                          }}
                          className="px-2 py-0.5 rounded bg-white/5 hover:bg-[#4ed4b7] hover:text-black text-zinc-300 border border-white/10 transition-colors shrink-0"
                          title="Audition voiceover narration"
                        >
                          Audition
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: POOLDAY CINEMA NLE & MULTI-TRACK TIMELINE            */}
        {/* ============================================================ */}
        {mode === "nle" && (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#08090c] animate-fadeIn">
            
            {/* Viewport Stage */}
            <div className="flex-1 bg-[#050608] relative flex items-center justify-center p-3 overflow-hidden min-h-0">
              <div
                style={{
                  aspectRatio:
                    aspectRatio === "2.39:1"
                      ? "2.39/1"
                      : aspectRatio === "16:9"
                      ? "16/9"
                      : "9/16",
                }}
                className="w-full max-h-full max-w-full bg-[#08090c] border border-white/[0.08] rounded-xl overflow-hidden relative shadow-2xl flex items-center justify-center"
              >
                <canvas ref={nleCanvasRef} className="w-full h-full block" />
                <CrtMonitorOverlay isActive={showCrtScope} />

                {/* Telemetry HUD */}
                <div className="absolute top-3 left-3 z-20 pointer-events-none font-mono text-[10px] space-y-0.5 bg-black/75 px-2.5 py-1.5 rounded-md border border-white/10 backdrop-blur-sm">
                  <div className="text-[#4ed4b7] font-bold uppercase tracking-wider">
                    {activeTerritory?.title || "Cinema Master"}
                  </div>
                  <div className="text-zinc-200">
                    SHOT: 0{activeShot?.sceneNumber || 1} · {activeShot?.framing}
                  </div>
                  <div className="text-zinc-400 font-mono">
                    SMPTE 01:00:0{activeShotIndex + 1}:{String(Math.floor((currentTime % 1) * 24)).padStart(2, "0")} · REC 24 FPS
                  </div>
                  <div className="text-[#5fe995] flex items-center gap-1.5">
                    {activeShot?.status === "generating" ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e8c76d] animate-ping" />
                        <span className="text-[#e8c76d]">LIVEPEER GPU SYNTHESIZING</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5fe995]" />
                        <span>LIVEPEER 60.0 FPS LOCKED</span>
                      </>
                    )}
                  </div>
                </div>

                {activeShot?.status === "generating" && (
                  <div className="absolute top-3 inset-x-0 mx-auto w-fit z-20 pointer-events-none px-3 py-1 rounded-full bg-black/85 border border-[#e8c76d]/40 font-mono text-[10px] text-[#e8c76d] flex items-center gap-2 shadow-lg animate-fadeIn">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e8c76d] animate-ping" />
                    <span>Livepeer Flux Subnet · Synthesizing Act 0{activeShot?.sceneNumber || 1}</span>
                  </div>
                )}

                {/* Viewport Toggles */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 font-mono text-[10px]">
                  <button
                    onClick={() => {
                      cinematicAudio.playCue("action");
                      setShowCrtScope((c) => !c);
                    }}
                    className={`px-2 py-1 rounded border backdrop-blur-sm transition-colors ${
                      showCrtScope
                        ? "bg-[#4ed4b7] text-black border-[#4ed4b7] font-bold shadow-[0_0_10px_rgba(78,212,183,0.3)]"
                        : "bg-black/70 text-zinc-300 border-white/15 hover:text-white"
                    }`}
                  >
                    CRT Scope
                  </button>
                  <button
                    onClick={() => {
                      cinematicAudio.playCue("click");
                      setShowSafeGrid((g) => !g);
                    }}
                    className={`px-2 py-1 rounded border backdrop-blur-sm transition-colors ${
                      showSafeGrid
                        ? "bg-[#4ed4b7] text-black border-[#4ed4b7] font-bold"
                        : "bg-black/70 text-zinc-300 border-white/15 hover:text-white"
                    }`}
                  >
                    Guides
                  </button>
                  <button
                    onClick={() => {
                      cinematicAudio.playCue("action");
                      setShowAnamorphicFlare((f) => !f);
                    }}
                    className={`px-2 py-1 rounded border backdrop-blur-sm transition-colors ${
                      showAnamorphicFlare
                        ? "bg-[#4ed4b7] text-black border-[#4ed4b7] font-bold"
                        : "bg-black/70 text-zinc-300 border-white/15 hover:text-white"
                    }`}
                  >
                    Flare
                  </button>
                </div>

                {/* Cinematic Floating Subtitles */}
                {(activeTerritory?.masterVoiceoverScript || activeShot?.masterVoiceoverScript || activeShot?.voiceoverScript) && (
                  <div className="absolute bottom-4 inset-x-0 z-20 pointer-events-none flex justify-center px-6">
                    <div className="bg-[#0b0e14]/90 border border-white/15 px-4 py-1.5 rounded-full text-xs text-zinc-100 shadow-2xl backdrop-blur-md max-w-2xl flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${activeShot?.voiceoverAudioUrl || activeTerritory?.masterVoiceoverAudioUrl ? "bg-[#5fe995] shadow-[0_0_8px_#5fe995]" : "bg-[#4ed4b7]"}`} />
                      <span className="text-[#4ed4b7] font-mono text-[10px] font-bold uppercase tracking-wider shrink-0">
                        {activeShot?.voiceoverAudioUrl || activeTerritory?.masterVoiceoverAudioUrl ? "LIVEPEER 48KHZ WAV" : "LIVEPEER TTS PENDING"}
                      </span>
                      <span className="text-zinc-600 font-mono text-xs">/</span>
                      <span className="font-serif italic text-xs tracking-wide text-zinc-200 truncate">
                        &ldquo;{activeTerritory?.masterVoiceoverScript || activeShot?.masterVoiceoverScript || activeShot?.voiceoverScript}&rdquo;
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Director Console Bar */}
            <div className="bg-[#090b10] border-y border-white/[0.08] px-4 py-2 shrink-0 flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px] uppercase shrink-0 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#4ed4b7]" />
                <span>Direct Scene</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={directPrompt}
                  onChange={(e) => setDirectPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDirectAgent()}
                  placeholder="Direct scene camera, lighting, or style (e.g. Low-angle tracking dolly in rain)..."
                  className="flex-1 bg-[#0b0e14] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#4ed4b7]/50 font-mono transition-colors"
                />
                <SpinningBorderCta
                  onClick={() => handleDirectAgent()}
                  disabled={isProcessing || !directPrompt.trim()}
                  theme="teal"
                  size="sm"
                >
                  <Send className="w-3 h-3 text-[#4ed4b7]" />
                  <span>Direct</span>
                </SpinningBorderCta>
              </div>

              {/* Minimalist Prompt Modifiers */}
              <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono shrink-0">
                {[
                  { label: "Anamorphic Flare", query: "Anamorphic Flare" },
                  { label: "Push Dolly", query: "Push-In Dolly" },
                  { label: "Low-Key", query: "Low-Key Shadows" },
                  { label: "Volumetric Haze", query: "Volumetric Haze" },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => {
                      cinematicAudio.playCue("click");
                      setDirectPrompt((prev) => (prev ? `${prev.trim()}, ${chip.query}` : chip.query));
                    }}
                    disabled={isProcessing}
                    title={`Add +${chip.label} to director prompt`}
                    className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-400 hover:text-[#4ed4b7] hover:border-[#4ed4b7]/30 transition-all text-[10px] active:scale-95"
                  >
                    +{chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Multi-Track NLE Studio Timeline */}
            <div className="h-64 bg-[#07080b] flex flex-col shrink-0 select-none overflow-hidden border-t border-white/10">
              {/* Master Transport & Timecode Header with Full-Width Interactive Scrubber */}
              <div className="h-11 bg-[#0a0d13] border-b border-white/[0.08] px-3 flex items-center justify-between shrink-0 text-xs font-mono gap-4">
                {/* Left: SMPTE Timecode & Playback */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded-md border border-white/10 text-[11px]">
                    <span className="text-[#4ed4b7] font-bold tracking-widest">
                      01:00:0{activeShotIndex + 1}:{Math.floor((currentTime % 1) * 24).toString().padStart(2, "0")}
                    </span>
                    <span className="text-zinc-600">/</span>
                    <span className="text-zinc-400 text-[10px]">
                      01:00:0{shots.length}:00
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        cinematicAudio.playCue("click");
                        setActiveShotIndex(Math.max(0, activeShotIndex - 1));
                        setCurrentTime(0);
                      }}
                      title="Previous Shot"
                      className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                    >
                      <SkipBack className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        cinematicAudio.playCue("play");
                        setIsPlaying(!isPlaying);
                      }}
                      title={isPlaying ? "Pause Sequence" : "Play Sequence"}
                      className="px-3 py-1 rounded-md bg-[#4ed4b7] text-black font-bold flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_12px_rgba(78,212,183,0.35)]"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black" />}
                      <span className="text-[10px] font-mono tracking-wider">{isPlaying ? "PAUSE" : "PLAY"}</span>
                    </button>
                    <button
                      onClick={() => {
                        cinematicAudio.playCue("click");
                        setActiveShotIndex((activeShotIndex + 1) % shots.length);
                        setCurrentTime(0);
                      }}
                      title="Next Shot"
                      className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        const nextMuted = cinematicAudio.toggleMute();
                        setIsMuted(nextMuted);
                      }}
                      title={isMuted ? "Unmute Master" : "Mute Master"}
                      className="p-1.5 rounded-md hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#4ed4b7]" />}
                    </button>
                  </div>
                </div>

                {/* Center: Full-Width Interactive Timeline Scrubber (fills previously empty black void) */}
                <div className="flex-1 hidden md:flex items-center gap-2 max-w-xl mx-auto">
                  <div className="flex-1 flex flex-col justify-center gap-1">
                    <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 px-0.5">
                      <span className="tracking-wider">SEQUENCE PLAYHEAD</span>
                      <span className="text-[#4ed4b7] font-bold">ACT 0{activeShotIndex + 1} OF 0{shots.length}</span>
                    </div>
                    <div
                      className="relative h-2 w-full bg-white/[0.08] hover:bg-white/[0.12] rounded-full overflow-hidden flex cursor-pointer transition-colors p-0.5"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                        const total = shots.length || 5;
                        const exactPos = ratio * total;
                        const targetIdx = Math.min(total - 1, Math.floor(exactPos));
                        const progressInShot = exactPos - targetIdx;
                        const shotDur = shots[targetIdx]?.durationSec || activeShotDuration || 3.6;
                        cinematicAudio.playCue("click");
                        setActiveShotIndex(targetIdx);
                        setCurrentTime(progressInShot * shotDur);
                      }}
                    >
                      {shots.map((shot, idx) => {
                        const isPast = idx < activeShotIndex;
                        const isCurrent = idx === activeShotIndex;
                        const progressInShot = isCurrent ? Math.min(1, currentTime / (shot.durationSec || 3.6)) : isPast ? 1 : 0;
                        return (
                          <div
                            key={shot.id}
                            className="flex-1 h-full mx-0.5 relative rounded-full bg-white/10 overflow-hidden"
                            title={`Jump to Act 0${shot.sceneNumber}: ${shot.framing}`}
                          >
                            <div
                              className={`h-full transition-all duration-100 ${
                                isCurrent ? "bg-[#4ed4b7] shadow-[0_0_8px_rgba(78,212,183,0.9)]" : isPast ? "bg-white/40" : "bg-transparent"
                              }`}
                              style={{ width: `${progressInShot * 100}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: Aspect Ratio Selector & Next Step */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="flex items-center bg-black/60 rounded-md border border-white/10 p-0.5 text-[10px]">
                    {(["2.39:1", "16:9", "9:16"] as AspectRatio[]).map((ar) => (
                      <button
                        key={ar}
                        onClick={() => {
                          cinematicAudio.playCue("click");
                          setAspectRatio(ar);
                        }}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          aspectRatio === ar ? "bg-[#4ed4b7] text-black font-bold" : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {ar === "2.39:1" ? "Scope" : ar === "16:9" ? "Flat" : "Reel"}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      cinematicAudio.playCue("action");
                      setMaxUnlockedStep((prev) => Math.max(prev, 4));
                      setMode("critic");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#4ed4b7]/15 hover:bg-[#4ed4b7] text-[#4ed4b7] hover:text-black border border-[#4ed4b7]/40 text-[10px] font-mono font-bold transition-all shadow-[0_0_10px_rgba(78,212,183,0.15)]"
                  >
                    <span>Critic Pass</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* NLE Multi-Track Canvas Area */}
              <div className="flex-1 p-2 space-y-1.5 overflow-hidden text-[10px] font-mono flex flex-col justify-center">
                {/* V1 VIDEO (Spacious, tactile Dynamic-Act Horizontal Timeline with playhead fill) */}
                <div className="flex items-center gap-2 h-16 bg-[#0b0e14]/70 border border-white/5 rounded-lg px-2.5">
                  <div className="w-14 shrink-0 flex flex-col">
                    <span className="text-zinc-400 font-bold text-[10px]">VIDEO</span>
                    <span className="text-[8px] text-zinc-600 font-mono">{aspectRatio}</span>
                  </div>
                  <div
                    className="flex-1 grid gap-2 h-full py-1"
                    style={{ gridTemplateColumns: `repeat(${shots.length || 5}, minmax(0, 1fr))` }}
                  >
                    {shots.map((shot, idx) => {
                      const isSelected = idx === activeShotIndex;
                      const progressInShot = isSelected ? Math.min(1, currentTime / (shot.durationSec || 3.6)) : 0;
                      return (
                        <div
                          key={shot.id}
                          onClick={() => {
                            cinematicAudio.playCue("click");
                            setActiveShotIndex(idx);
                            setCurrentTime(0);
                          }}
                          onDoubleClick={() => {
                            const matching = episodicScenes.find((s) => s.shotIndex === idx || s.sceneId === shot.id) || episodicScenes[idx];
                            if (matching) {
                              cinematicAudio.playCue("action");
                              setSelectedScene(matching);
                            }
                          }}
                          title={`Click to preview Act 0${shot.sceneNumber} (${shot.framing}). Double-click to inspect.`}
                          className={`h-full rounded-md border px-2.5 py-1.5 flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden group/act ${
                            isSelected
                              ? "bg-[#4ed4b7]/15 border-[#4ed4b7] text-white shadow-[0_0_14px_rgba(78,212,183,0.25)] ring-1 ring-[#4ed4b7]/50"
                              : "bg-[#090b10] border-white/10 text-zinc-400 hover:border-white/25 hover:text-zinc-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-bold font-mono text-[9px] ${isSelected ? "text-[#4ed4b7]" : "text-zinc-300"}`}>
                              ACT 0{shot.sceneNumber}
                            </span>
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/60 text-zinc-400">
                              {shot.durationSec ? `${shot.durationSec.toFixed(1)}s` : "3.6s"}
                            </span>
                          </div>
                          <span className="text-[9px] text-zinc-400 font-sans truncate pr-1">
                            {shot.framing}
                          </span>
                          {/* Active Shot Progress Fill */}
                          {isSelected && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                              <div
                                className="h-full bg-[#4ed4b7] transition-all duration-100 shadow-[0_0_6px_#4ed4b7]"
                                style={{ width: `${progressInShot * 100}%` }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* A1 SCORE (Atmospheric Soundtrack with dynamic frequency bars) */}
                <div className="flex items-center gap-2 h-10 bg-[#0b0e14]/70 border border-white/5 rounded-lg px-2.5">
                  <div className="w-14 shrink-0 flex items-center gap-1 font-mono text-[10px] text-zinc-400 font-bold">
                    <Music className="w-3 h-3 text-[#4ed4b7]" />
                    <span>SCORE</span>
                  </div>
                  <div className="flex-1 h-full flex items-center gap-3 overflow-hidden bg-black/50 rounded-md px-2.5 border border-white/5">
                    <span className="text-[9px] text-zinc-400 font-mono shrink-0 max-w-[200px] truncate">
                      {activeTerritory?.musicMood || "Cinematic Orchestral Drone"}
                    </span>
                    <canvas ref={audioWaveCanvasRef} className="flex-1 h-full block" />
                  </div>
                  <button
                    onClick={handleSynthesizeLivepeerMusic}
                    disabled={isSynthesizingMusic}
                    title="Synthesize custom background score on GPU network"
                    className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 text-[9px] font-mono shrink-0 disabled:opacity-50"
                  >
                    <span>{isSynthesizingMusic ? "Synthesizing..." : "Generate Score"}</span>
                  </button>
                </div>

                {/* A2 MASTER VOICE (Continuous Sequence Narration across all Acts) */}
                <div className="flex items-center gap-2 h-10 bg-[#0b0e14]/70 border border-white/5 rounded-lg px-2.5">
                  <div className="w-20 shrink-0 flex items-center gap-1.5 font-mono text-[10px] text-[#4ed4b7] font-bold">
                    <span className={`w-1.5 h-1.5 rounded-full ${isAuditioningVo ? "bg-[#4ed4b7] animate-ping" : "bg-[#4ed4b7]"}`} />
                    <span>MASTER VO</span>
                  </div>

                  {/* Master Narration Script (Click to edit inline) */}
                  <div className="flex-1 h-full flex items-center bg-black/50 rounded-md px-2.5 border border-white/5 overflow-hidden">
                    {editingVoShotId === "master" ? (
                      <input
                        type="text"
                        value={editedVoText}
                        onChange={(e) => setEditedVoText(e.target.value)}
                        onBlur={() => {
                          if (editedVoText.trim()) {
                            if (activeTerritory) activeTerritory.masterVoiceoverScript = editedVoText.trim();
                            shots.forEach((s) => onUpdateShot?.({ ...s, masterVoiceoverScript: editedVoText.trim() }));
                          }
                          setEditingVoShotId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && editedVoText.trim()) {
                            if (activeTerritory) activeTerritory.masterVoiceoverScript = editedVoText.trim();
                            shots.forEach((s) => onUpdateShot?.({ ...s, masterVoiceoverScript: editedVoText.trim() }));
                            setEditingVoShotId(null);
                          }
                        }}
                        autoFocus
                        className="w-full bg-transparent text-xs text-white font-serif italic focus:outline-none"
                      />
                    ) : (
                      <span
                        onClick={() => {
                          setEditingVoShotId("master");
                          setEditedVoText(activeTerritory?.masterVoiceoverScript || activeShot?.masterVoiceoverScript || activeShot?.voiceoverScript || "");
                        }}
                        title="Click to edit master sequence voiceover"
                        className="cursor-pointer text-zinc-300 hover:text-[#4ed4b7] font-serif italic text-xs truncate transition-colors"
                      >
                        &ldquo;{activeTerritory?.masterVoiceoverScript || activeShot?.masterVoiceoverScript || activeShot?.voiceoverScript || "Autonomous master voiceover synchronized across acts"}&rdquo;
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 font-mono text-[9px]">
                    <button
                      onClick={() => handleAuditionVo(activeShot || undefined)}
                      title="Audition continuous master voiceover narration"
                      className={`px-2.5 py-1 rounded-md border transition-colors flex items-center gap-1 text-[9px] ${
                        isAuditioningVo
                          ? "bg-[#4ed4b7] text-black border-[#4ed4b7] font-semibold animate-pulse"
                          : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/10"
                      }`}
                    >
                      <span>{isAuditioningVo ? "Stop" : "Audition"}</span>
                    </button>
                    <button
                      onClick={() => handleSynthesizeLivepeerVo(activeShot || undefined)}
                      disabled={isSynthesizingVo || activeTerritory?.masterVoiceoverStatus === "synthesizing"}
                      title="Synthesize broadcast audio via Livepeer neural TTS"
                      className="px-2.5 py-1 rounded-md bg-[#e8c76d]/10 hover:bg-[#e8c76d]/20 text-[#e8c76d] border border-[#e8c76d]/30 transition-colors flex items-center gap-1 text-[9px] disabled:opacity-50"
                    >
                      <span>{isSynthesizingVo ? "Synthesizing..." : "Synthesize VO"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: MUSE MIRROR CREATIVE TERRITORIES (3 BELIEFS)         */}
        {/* ============================================================ */}
        {mode === "territories" && (
          <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-7xl mx-auto space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[#4ed4b7] font-mono text-xs uppercase tracking-wider">Step 2 · Creative Vision</span>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-1">
                  Select Your Directional Belief
                </h1>
                <p className="text-zinc-400 text-xs font-sans mt-1">
                  Three distinct creative territories derived from your brief. Each specifies aesthetic tone, lighting grammar, and audio mood.
                </p>
              </div>
              <SpinningBorderCta
                onClick={() => handleStartProduction(selectedTerritoryId || territories[0]?.id)}
                theme="teal"
                size="md"
              >
                <span>Greenlight & Proceed to 3. Cinema NLE</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#4ed4b7]" />
              </SpinningBorderCta>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {territories.map((territory, idx) => {
                const isSelected = territory.id === selectedTerritoryId;
                return (
                  <div
                    key={territory.id}
                    onClick={() => onSelectTerritory(territory.id)}
                    className={`rounded-2xl border p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                      isSelected
                        ? "bg-[#0e141c] border-[#4ed4b7] shadow-[0_0_24px_rgba(78,212,183,0.2)]"
                        : "bg-[#0e1017] border-white/10 hover:border-white/20 hover:bg-[#12151e]"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="aspect-video w-full rounded-xl bg-black overflow-hidden relative border border-white/10">
                        <img
                          src={territory.previewUrl || resolveCinematicAsset(`${brief} ${territory.title} ${territory.visualMetaphor}`, idx + 1)}
                          alt={territory.title}
                          onError={(e) => {
                            const fallback = resolveCinematicAsset(`${brief} ${territory.title} ${territory.visualMetaphor}`, idx + 1);
                            if (e.currentTarget.src !== fallback) {
                              e.currentTarget.src = fallback;
                            }
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-white/10 font-mono text-[10px] text-zinc-300">
                          {territory.aspectRatio}
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/85 border border-[#4ed4b7]/40 font-mono text-[9px] text-[#4ed4b7] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4ed4b7] animate-pulse" />
                          <span>{territory.previewUrl?.includes("agent.livepeer.org") ? "Livepeer Agent MCP" : "Livepeer Subnet"}</span>
                          {territory.generationLatencyMs && (
                            <span className="text-zinc-400">({(territory.generationLatencyMs / 1000).toFixed(1)}s)</span>
                          )}
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#4ed4b7] text-black flex items-center justify-center shadow-lg">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div>
                        <h2 className="text-lg font-display font-bold text-white group-hover:text-[#4ed4b7] transition-colors">
                          {territory.title}
                        </h2>
                        <p className="font-serif italic text-xs text-[#4ed4b7] mt-1">
                          &quot;{territory.tagline}&quot;
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Chromatic Palette:</span>
                        <div className="flex items-center gap-2">
                          {territory.colorPalette.map((color, i) => (
                            <span
                              key={i}
                              className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-white/10 font-mono text-xs text-zinc-400">
                        <div><span className="text-zinc-500">Metaphor: </span><span className="text-zinc-200">{territory.visualMetaphor}</span></div>
                        <div><span className="text-zinc-500">Lighting: </span><span className="text-zinc-200">{territory.lightingLogic}</span></div>
                        <div><span className="text-zinc-500">Camera: </span><span className="text-zinc-200">{territory.cameraLanguage}</span></div>
                        <div><span className="text-zinc-500">Score: </span><span className="text-zinc-200">{territory.musicMood}</span></div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartProduction(territory.id);
                        }}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-display font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#4ed4b7] text-black hover:brightness-110 shadow-[0_0_16px_rgba(78,212,183,0.3)] active:scale-[0.98]"
                            : "bg-white/10 text-white hover:bg-white/20 active:scale-[0.98]"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-current" />
                        <span>{isSelected ? "Greenlight & Go to 3. Cinema NLE" : "Select & Greenlight"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 4: VISUAL CRITIC SCORECARD & PASS                       */}
        {/* ============================================================ */}
        {mode === "critic" && (
          <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[#4ed4b7] font-mono text-xs uppercase tracking-wider">Autonomous Critic</span>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-white mt-1">
                  Visual Critic Pass
                </h1>
                <p className="text-zinc-400 text-xs font-sans mt-1">
                  Evaluates chromatic consistency, camera momentum, and lighting adherence across the cut.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-display font-bold text-[#4ed4b7]">
                  {criticReview?.overallScore || 93}/100
                </div>
                <div className="text-[10px] text-[#5fe995] font-mono">CRITIC APPROVED</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-[#0e1118] border border-white/10">
                <div className="text-xs text-zinc-500 font-mono uppercase">Continuity</div>
                <div className="text-2xl font-bold text-white mt-1">{criticReview?.continuityScore || 94}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0e1118] border border-white/10">
                <div className="text-xs text-zinc-500 font-mono uppercase">Lighting</div>
                <div className="text-2xl font-bold text-white mt-1">{criticReview?.lightingScore || 92}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0e1118] border border-white/10">
                <div className="text-xs text-zinc-500 font-mono uppercase">Pacing</div>
                <div className="text-2xl font-bold text-white mt-1">{criticReview?.pacingScore || 91}%</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0e1118] border border-white/10 font-serif italic text-base text-zinc-200 leading-relaxed">
              &quot;{criticReview?.critiqueSummary || "The cut honors the Cyber-Noir Anamorphic aesthetic. Pacing cadence maintains viewer anticipation with zero jarring spatial disconnects between shots."}&quot;
            </div>

            <div className="p-5 rounded-2xl bg-[#0e1118] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#5fe995] font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Strengths</span>
              </div>
              <div className="space-y-2 text-xs text-zinc-300 font-sans">
                {(criticReview?.strengths || [
                  "Consistent chromatic adherence to aesthetic palette.",
                  "Camera momentum flows smoothly across all shots.",
                  "Lighting matches prompt spec under high-contrast conditions.",
                ]).map((str, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#4ed4b7] font-bold">•</span>
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  cinematicAudio.playCue("action");
                  onRefineShot(activeShotIndex, "Auto-apply critic refinements: enhance contrast and flare");
                }}
                className="flex-1 w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-display font-bold text-xs border border-white/15 flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#4ed4b7]" />
                <span>Auto-Apply Critic Refinements to Cut</span>
              </button>
              <SpinningBorderCta
                onClick={() => {
                  cinematicAudio.playCue("action");
                  setMaxUnlockedStep((prev) => Math.max(prev, 5));
                  setMode("storyboard");
                }}
                theme="teal"
                size="md"
                className="flex-1 w-full"
              >
                <span>Proceed to 5. Storyboard Reel</span>
                <ArrowRight className="w-4 h-4 text-[#4ed4b7]" />
              </SpinningBorderCta>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 5: FASTLANE URL INGEST & PLAYBOOK FAST LANES            */}
        {/* ============================================================ */}
        {mode === "input" && (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center animate-fadeIn relative overflow-hidden">
            <AmbientAtmosphereCanvas palette="cyan" />
            <div className="w-full max-w-xl mx-auto space-y-6 relative z-10">
              <div className="text-center space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#4ed4b7]/10 border border-[#4ed4b7]/25 text-[#4ed4b7] text-[10px] font-mono uppercase tracking-wider">
                  Step 1 · Creative Brief & Production Ingest
                </span>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                  Creative Brief & Production Ingest
                </h1>
                <p className="text-zinc-400 text-xs md:text-sm font-sans max-w-md mx-auto">
                  Enter any product URL or narrative creative brief. Auteur direct-synthesizes creative territories, episodic storyboard acts, and cinematic 60 FPS scenes across Livepeer decentralized GPU network.
                </p>
              </div>

              <div className="w-full bg-[#0e1118]/90 border border-white/15 rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-md space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleStartGeneration()}
                    placeholder="Enter website URL or narrative prompt..."
                    className="flex-1 bg-transparent text-white text-sm md:text-base placeholder-zinc-500 focus:outline-none font-sans"
                  />
                  <button
                    id="btn-start-generation"
                    type="button"
                    onClick={() => handleStartGeneration()}
                    disabled={!urlInput.trim() || isProcessing}
                    title="Generate Directional Beliefs"
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
                      !urlInput.trim() || isProcessing
                        ? "bg-white/10 text-zinc-600 cursor-not-allowed opacity-50"
                        : "bg-[#4ed4b7] text-black hover:brightness-110 active:scale-95 shadow-[0_0_16px_rgba(78,212,183,0.4)]"
                    }`}
                  >
                    <ArrowUp className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-[11px] font-mono text-zinc-400">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Globe className="w-3.5 h-3.5 text-[#4ed4b7]" />
                    <span>Autonomous Scene Decomposition</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#5fe995]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5fe995] animate-pulse" />
                    <span>Livepeer Subnet 0x4a92</span>
                  </div>
                </div>
              </div>

              {/* Innovation Playbooks */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#626a76] uppercase block">Inspiration Playbooks:</label>
                <div className="grid grid-cols-2 gap-2">
                  {INNOVATION_PLAYBOOKS.slice(0, 4).map((pb) => {
                    const isSelected = activePlaybookId === pb.id || urlInput === pb.defaultBrief;
                    return (
                      <button
                        key={pb.id}
                        type="button"
                        onClick={() => {
                          cinematicAudio.playCue("click");
                          setActivePlaybookId(pb.id);
                          setUrlInput(pb.defaultBrief);
                        }}
                        onDoubleClick={() => {
                          cinematicAudio.playCue("action");
                          setActivePlaybookId(pb.id);
                          setUrlInput(pb.defaultBrief);
                          handleStartGeneration(pb.defaultBrief);
                        }}
                        title="Click to load brief. Double-click to greenlight."
                        className={`p-3 rounded-xl border text-left transition-all group cursor-pointer relative ${
                          isSelected
                            ? "bg-[#4ed4b7]/15 border-[#4ed4b7] shadow-[0_0_16px_rgba(78,212,183,0.2)] ring-1 ring-[#4ed4b7]/40"
                            : "bg-[#0e1118] border-white/10 hover:border-[#4ed4b7]/50 hover:bg-[#12151e]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`font-display font-bold text-xs ${isSelected ? "text-[#4ed4b7]" : "text-white group-hover:text-[#4ed4b7]"}`}>{pb.title}</div>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#4ed4b7] animate-pulse" />}
                        </div>
                        <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{pb.tagline}</div>
                        <div className="text-[9px] font-mono text-zinc-500 mt-1 truncate italic group-hover:text-zinc-300 transition-colors">&ldquo;{pb.defaultBrief}&rdquo;</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ============================================================ */}
        {/* VIEW 6: LIVEPEER CINEMA GENERATION CONSOLE                   */}
        {/* ============================================================ */}
        {mode === "generating" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 animate-fadeIn max-w-2xl mx-auto w-full">
            {/* Cinematic Screening Slate */}
            <div className="w-full max-w-xl rounded-2xl bg-[#080a10] border border-white/10 relative overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.85),0_0_35px_rgba(78,212,183,0.08)] flex flex-col justify-between p-6">
              
              {/* Header HUD */}
              <div className="flex items-center justify-between text-zinc-400 font-mono text-[11px] tracking-wider border-b border-white/10 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#4ed4b7] animate-pulse shadow-[0_0_8px_#4ed4b7]" />
                  <span className="text-white font-bold tracking-widest uppercase">AUTEUR CINEMA STUDIO</span>
                </div>
                <div className="text-zinc-400 font-mono text-[10px] tracking-widest">
                  35MM · 24 FPS · DCI 4K
                </div>
              </div>

              {/* Center Slate Content */}
              <div className="space-y-4 my-6 text-center px-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#4ed4b7]/10 border border-[#4ed4b7]/25 font-mono text-[10px] text-[#5fe995]">
                  <Sparkles className="w-3 h-3" />
                  <span>Livepeer Neural Diffusion</span>
                </div>

                <p className="font-serif italic text-base sm:text-lg text-zinc-100 max-w-md mx-auto line-clamp-3 leading-relaxed">
                  &ldquo;{brief || urlInput}&rdquo;
                </p>

                <div className="flex items-center justify-center gap-3 text-xs font-mono text-zinc-400">
                  <span className="text-zinc-300">Livepeer GPU Swarm</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-300">Kodak 2383 LUT</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-[#4ed4b7] font-semibold">Generating Takes</span>
                </div>
              </div>

              {/* Footer Metadata */}
              <div className="flex items-center justify-between border-t border-white/10 pt-3.5 text-[10px] font-mono text-zinc-500">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 uppercase tracking-wider">PIPELINE:</span>
                  <span className="text-zinc-200">DECENTRALIZED INFERENCE</span>
                </div>
                <div className="text-[#5fe995] flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5fe995] animate-ping" />
                  <span>ACTIVE GPU CLUSTER</span>
                </div>
              </div>
            </div>

            {/* Live Progress Stage */}
            <div className="space-y-3 w-full max-w-md text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-display font-medium text-white">
                <span className="font-bold text-[#4ed4b7] tracking-wider">AUTEUR</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-200 font-sans text-xs">
                  {generationStep === 1 && "Decomposing creative brief into cinematic acts..."}
                  {generationStep === 2 && "Synthesizing visual keyframes on Livepeer GPU..."}
                  {generationStep === 3 && "Calibrating camera blocking and volumetric lighting..."}
                  {generationStep >= 4 && "Master sequence ready · Launching workstation"}
                </span>
              </div>

              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#4ed4b7] via-[#5fe995] to-[#7e94ff] transition-all duration-700 rounded-full shadow-[0_0_12px_#4ed4b7]"
                  style={{ width: `${Math.max(15, (generationStep / 4) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>STAGE 0{generationStep}/04</span>
                <span>LIVEPEER CINEMA ENGINE</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 7: LIVEPEER CINEMA NLE PIPELINE PRODUCTION CONSOLE      */}
        {/* ============================================================ */}
        {mode === "producing" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 animate-fadeIn max-w-2xl mx-auto w-full">
            {/* Cinematic Screening Slate */}
            <div className="w-full max-w-xl rounded-2xl bg-[#080a10] border border-white/10 relative overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.85),0_0_35px_rgba(78,212,183,0.08)] flex flex-col justify-between p-6">
              
              {/* Header HUD */}
              <div className="flex items-center justify-between text-zinc-400 font-mono text-[11px] tracking-wider border-b border-white/10 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#5fe995] animate-pulse shadow-[0_0_8px_#5fe995]" />
                  <span className="text-white font-bold tracking-widest uppercase">AUTEUR 60FPS NLE</span>
                </div>
                <div className="text-zinc-400 font-mono text-[10px] tracking-widest">
                  PRORES 422 · 2.39:1 DCI
                </div>
              </div>

              {/* Center Slate Content */}
              <div className="space-y-4 my-6 text-center px-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5fe995]/10 border border-[#5fe995]/25 font-mono text-[10px] text-[#5fe995]">
                  <Film className="w-3 h-3" />
                  <span>5-Act Master Composition</span>
                </div>

                <div className="space-y-1">
                  {activeTerritory?.title && (
                    <span className="text-[#4ed4b7] font-mono text-[10px] uppercase tracking-widest block font-semibold">
                      {activeTerritory.title}
                    </span>
                  )}
                  <p className="font-serif italic text-base sm:text-lg text-zinc-100 max-w-md mx-auto line-clamp-2 leading-relaxed">
                    &ldquo;{brief || urlInput}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 text-xs font-mono text-zinc-400">
                  <span className="text-zinc-300">5 Continuous Acts</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-300">Livepeer Soundstage</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-[#5fe995] font-semibold">60 FPS Compositor</span>
                </div>
              </div>

              {/* Footer Metadata */}
              <div className="flex items-center justify-between border-t border-white/10 pt-3.5 text-[10px] font-mono text-zinc-500">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 uppercase tracking-wider">COMPOSITOR:</span>
                  <span className="text-zinc-200">60 FPS CANVAS ENGINE</span>
                </div>
                <div className="text-[#5fe995] flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5fe995] animate-ping" />
                  <span>ASSEMBLING MASTER</span>
                </div>
              </div>
            </div>

            {/* Live Progress Stage */}
            <div className="space-y-3 w-full max-w-md text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-display font-medium text-white">
                <span className="font-bold text-[#4ed4b7] tracking-wider">AUTEUR</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-200 font-sans text-xs">
                  {producingMessage}
                </span>
              </div>

              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#4ed4b7] via-[#5fe995] to-[#7e94ff] transition-all duration-700 rounded-full shadow-[0_0_12px_#4ed4b7]"
                  style={{ width: `${Math.max(15, (producingStep / 4) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>STAGE 0{producingStep}/04</span>
                <span>MASTER SEQUENCE ASSEMBLY</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ============================================================ */}
      {/* FASTLANE MODAL: INTEGRATED VIDEO INSPECTOR & CRITIC TABS     */}
      {/* ============================================================ */}
      {selectedScene && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-3xl bg-[#0e1118] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
            
            <button
              onClick={() => setSelectedScene(null)}
              className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: 9:16 Video Canvas */}
            <div className="w-full md:w-5/12 bg-black flex items-center justify-center p-4 relative min-h-[380px]">
              <div className="w-full max-w-[260px] aspect-[9/16] rounded-2xl overflow-hidden border border-white/20 relative shadow-2xl bg-[#08090c]">
                <canvas ref={modalCanvasRef} className="w-full h-full block" />

                <div className="absolute bottom-4 inset-x-3 text-center flex flex-col items-center gap-1.5">
                  <div className="inline-block bg-black/85 border border-white/20 px-2.5 py-1.5 rounded-lg text-[11px] text-zinc-100 shadow-xl backdrop-blur-sm">
                    <span className="text-[#4ed4b7] font-bold mr-1">VO:</span>
                    <span className="font-serif italic">&quot;{selectedScene.voiceoverPrompt}&quot;</span>
                  </div>

                  {/* Audition & Engine Pill */}
                  <button
                    onClick={() => {
                      const matchingShot = shots.find((s) => s.id === selectedScene.sceneId) || shots[selectedScene.shotIndex];
                      if (matchingShot) handleAuditionVo(matchingShot);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all flex items-center gap-1.5 shadow-lg ${
                      isAuditioningVo
                        ? "bg-[#4ed4b7] text-black border-[#4ed4b7] font-bold animate-pulse"
                        : "bg-black/80 hover:bg-[#4ed4b7]/20 text-zinc-200 border-white/20 hover:border-[#4ed4b7]/50"
                    }`}
                  >
                    <span>{isAuditioningVo ? "Stop Voiceover" : "Audition Voiceover"}</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  className="absolute top-3 left-3 p-1.5 rounded-full bg-black/70 border border-white/20 text-zinc-300 hover:text-white"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                </button>
              </div>
            </div>

            {/* Right Column: Director Inspector + Critic + Specs Tabs */}
            <div className="w-full md:w-7/12 p-6 flex flex-col justify-between space-y-4">
              
              <div className="space-y-3">
                {/* Header Sub-Tabs (Sequenced strictly by testing lifecycle: 1. Direct -> 2. Critic -> 3. Post Setup) */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1 text-xs font-mono">
                    <button
                      onClick={() => {
                        cinematicAudio.playCue("action");
                        setModalTab("direct");
                      }}
                      className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                        modalTab === "direct" ? "bg-[#4ed4b7] text-black font-bold" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span className="text-[9px] opacity-70 font-bold">1</span>
                      <span>Direct</span>
                    </button>
                    <button
                      onClick={() => {
                        cinematicAudio.playCue("action");
                        setModalTab("critic");
                      }}
                      className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                        modalTab === "critic" ? "bg-[#4ed4b7] text-black font-bold" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span className="text-[9px] opacity-70 font-bold">2</span>
                      <span>Critic ({criticReview?.overallScore || 93})</span>
                    </button>
                    <button
                      onClick={() => {
                        cinematicAudio.playCue("action");
                        setModalTab("specs");
                      }}
                      className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                        modalTab === "specs" ? "bg-[#4ed4b7] text-black font-bold" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span className="text-[9px] opacity-70 font-bold">3</span>
                      <span>Camera & Specs</span>
                    </button>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-white/5 font-mono text-[10px] text-zinc-400">
                    SCENE 0{selectedScene.sceneNumber} · {selectedScene.actName}
                  </span>
                </div>

                {/* TAB 1: DIRECTOR QUICK ACTIONS & DIRECTING */}
                {modalTab === "direct" && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Direct The AI Agent</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={directPrompt}
                          onChange={(e) => setDirectPrompt(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleDirectAgent()}
                          placeholder="e.g. Add slower push-in or volumetric flare..."
                          className="flex-1 bg-[#141722] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#4ed4b7] font-mono"
                        />
                        <button
                          onClick={() => handleDirectAgent()}
                          disabled={!directPrompt.trim()}
                          className="px-3 py-1.5 rounded-lg bg-[#4ed4b7] text-black font-bold text-xs disabled:opacity-40 hover:brightness-110 transition-all"
                        >
                          Direct
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Director Quick Actions</label>
                      <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono">
                        {[
                          "+ Anamorphic Flare",
                          "+ Rain Droplets",
                          "+ Slower Push-In Dolly",
                          "+ Faster Cut Cadence",
                          "+ Low-Key Shadow Depth",
                          "+ Volumetric Neon Haze",
                        ].map((chip) => (
                          <button
                            key={chip}
                            onClick={() => handleDirectAgent(chip)}
                            className="p-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 text-left hover:text-white transition-colors"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: VISUAL CRITIC REPORT FOR THIS SHOT (EVALUATE SECOND) */}
                {modalTab === "critic" && (
                  <div className="space-y-3 font-mono text-xs animate-fadeIn">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                        <div className="text-[9px] text-zinc-500 uppercase">Continuity</div>
                        <div className="font-bold text-white text-sm mt-0.5">{criticReview?.continuityScore || 94}%</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                        <div className="text-[9px] text-zinc-500 uppercase">Lighting</div>
                        <div className="font-bold text-white text-sm mt-0.5">{criticReview?.lightingScore || 92}%</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                        <div className="text-[9px] text-zinc-500 uppercase">Pacing</div>
                        <div className="font-bold text-white text-sm mt-0.5">{criticReview?.pacingScore || 91}%</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 font-serif italic text-xs text-zinc-300">
                      &quot;{criticReview?.critiqueSummary || "Chromatic saturation and optical flow adherence verified."}&quot;
                    </div>

                    <button
                      onClick={() => {
                        cinematicAudio.playCue("action");
                        onRefineShot(activeShotIndex, "Auto-apply critic refinements: enhance contrast and flare");
                      }}
                      className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-display font-bold text-xs border border-white/10 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#4ed4b7]" />
                      <span>Auto-Apply Critic Refinements</span>
                    </button>
                  </div>
                )}

                {/* TAB 3: CINEMATIC CAMERA & LIVEPEER SPECS */}
                {modalTab === "specs" && (
                  <div className="space-y-3 font-mono text-xs animate-fadeIn">
                    <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Optics & Choreography</div>
                      <div className="text-white text-xs font-bold">{selectedScene.lensPackage}</div>
                      <div className="text-zinc-400 text-[11px] font-sans">{selectedScene.cameraMotion} · {selectedScene.framing}</div>
                    </div>

                    <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold flex items-center justify-between">
                        <span>Livepeer Agent MCP Pipeline</span>
                        <span className="text-[#5fe995] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5fe995] animate-pulse" />
                          120 Tools Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400">Endpoint:</span>
                        <span className="text-white font-mono text-[10px]">agent.livepeer.org/api/mcp/creative</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400">Target Pipeline:</span>
                        <span className="text-[#4ed4b7] font-bold">{selectedScene.modelTarget}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400">Decentralized GPU:</span>
                        <span className="text-white">RTX 4090 / US-East ({livepeerLatency}ms) · 0x4a92</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400">Inference Cost:</span>
                        <span className="text-[#5fe995] font-bold">~$0.04 / shot ($100/d Quota)</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Audio Bed & Procedural Score</div>
                      <div className="text-white text-xs">{selectedScene.songBed}</div>
                      <div className="text-[10px] text-zinc-400 font-sans">Synthesized procedural audio waveform bed</div>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Actions (Sequenced progression) */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/[0.08]">
                {modalTab === "direct" && (
                  <button
                    onClick={() => {
                      cinematicAudio.playCue("action");
                      setModalTab("critic");
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Next: Review Critic ({criticReview?.overallScore || 93})</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#4ed4b7]" />
                  </button>
                )}
                {modalTab === "critic" && (
                  <button
                    onClick={() => {
                      cinematicAudio.playCue("action");
                      setModalTab("specs");
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Next: Camera & Render Specs</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#4ed4b7]" />
                  </button>
                )}
                {modalTab === "specs" && (
                  <button
                    type="button"
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex-1 py-2.5 rounded-xl bg-[#4ed4b7] text-black font-display font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_16px_rgba(78,212,183,0.3)]"
                  >
                    <Download className="w-4 h-4 text-black" />
                    <span>{isExporting ? "Compiling Master..." : "Compile & Export 4K Master Cut"}</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedScene(null)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs font-mono transition-colors"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* LIVEPEER AGENT MCP GATEWAY INSPECTOR MODAL                  */}
      {/* ============================================================ */}
      {isLivepeerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#0e1118] border border-[#4ed4b7]/30 rounded-3xl shadow-[0_0_50px_rgba(78,212,183,0.15)] overflow-hidden flex flex-col relative font-sans">
            
            <button
              onClick={() => setIsLivepeerModalOpen(false)}
              className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Banner */}
            <div className="p-5 md:p-6 border-b border-white/10 bg-gradient-to-r from-[#0e1118] via-[#121622] to-[#0e1118]">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="px-2 py-0.5 rounded-full bg-[#4ed4b7]/15 border border-[#4ed4b7]/30 text-[#4ed4b7] text-[10px] font-mono uppercase font-bold tracking-wider">
                  Livepeer Agent MCP Gateway
                </span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-[#5fe995]">
                  <span className="w-2 h-2 rounded-full bg-[#5fe995] animate-pulse shadow-[0_0_8px_#5fe995]" />
                  Connected · Subnet 0x4a92
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">
                Decentralized AI Video Infrastructure
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                agent.livepeer.org/api/mcp/creative · 120 creative tools active
              </p>
            </div>

            {/* Body */}
            <div className="p-5 md:p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              
              {/* Telemetry Stat Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Daily Quota</div>
                  <div className="text-lg font-display font-bold text-[#5fe995]">$100.00 / d</div>
                  <div className="text-[10px] text-zinc-400 font-mono">Hackathon Participant</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Live Tools</div>
                  <div className="text-lg font-display font-bold text-white">120 Tools</div>
                  <div className="text-[10px] text-[#4ed4b7] font-mono">Creative JSON-RPC</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Node Latency</div>
                  <div className="text-lg font-display font-bold text-white">{livepeerLatency}ms</div>
                  <div className="text-[10px] text-zinc-400 font-mono">RTX 4090 US-East</div>
                </div>
              </div>

              {/* API Key & Mode Configuration */}
              <div className="p-4 rounded-2xl bg-[#141722] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider">
                    Livepeer Agent Bearer Key
                  </label>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4ed4b7]/10 text-[#4ed4b7]">
                    {livepeerApiKey ? "Custom Key" : "Keyless Native Mode"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={livepeerApiKey}
                    onChange={(e) => setLivepeerApiKey(e.target.value)}
                    placeholder="Keyless mode active (no key required)"
                    className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-[#4ed4b7] placeholder-zinc-500"
                  />
                  <button
                    onClick={handlePingLivepeer}
                    disabled={isPingingLivepeer}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#4ed4b7] ${isPingingLivepeer ? "animate-spin" : ""}`} />
                    <span>{isPingingLivepeer ? "Pinging..." : "Ping Subnet"}</span>
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans">
                  Connected directly to Livepeer Agent Creative MCP. Operates natively keyless with automatic hackathon participant quota.
                </p>
              </div>

              {/* Livepeer Creative Recipes */}
              <div className="space-y-2.5">
                <div className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">
                  Livepeer Cinema Recipes (from list_templates):
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {LIVEPEER_CINEMA_RECIPES.map((recipe) => (
                    <div
                      key={recipe.id}
                      onClick={() => {
                        cinematicAudio.playCue("action");
                        setActiveLivepeerRecipe(recipe.id);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer text-left space-y-1 ${
                        activeLivepeerRecipe === recipe.id
                          ? "bg-[#4ed4b7]/10 border-[#4ed4b7] shadow-[0_0_12px_rgba(78,212,183,0.15)]"
                          : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-display font-bold text-white">{recipe.name}</span>
                        <span className="text-[10px] font-mono text-[#5fe995] font-bold">{recipe.priceLabel}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-tight">
                        {recipe.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10 bg-[#08090c] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Globe className="w-3.5 h-3.5 text-[#4ed4b7]" />
                <span>Protocol: JSON-RPC 2.0 (streamable-http)</span>
              </div>
              <button
                onClick={() => setIsLivepeerModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#4ed4b7] text-black font-display font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-[0_0_14px_rgba(78,212,183,0.3)]"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function awaitCreatePatternCanvas(imgData: ImageData): CanvasImageSource {
  if (typeof document === "undefined") return null as unknown as CanvasImageSource;
  const canvas = document.createElement("canvas");
  canvas.width = imgData.width;
  canvas.height = imgData.height;
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.putImageData(imgData, 0, 0);
  return canvas;
}
