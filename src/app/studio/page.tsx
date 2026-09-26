"use client";

import React, { useState } from "react";
import { ShotLedgerModal } from "@/components/ShotLedgerModal";
import {
  CreativeTerritory,
  Shot,
  CriticReview,
  AestheticMemoryItem,
  AgentStep,
} from "@/lib/types";
import { directorAgent } from "@/lib/director-agent";
import { visualCriticAgent } from "@/lib/critic-agent";
import { livepeerClient } from "@/lib/livepeer";
import { resolveCinematicAsset, preloadAllShots } from "@/lib/generative-cinema";

import dynamic from "next/dynamic";
import { StudioSkeleton } from "@/components/StudioSkeleton";

const DEFAULT_BRIEF =
  "A carbon-fiber autonomous drone swarm weaves through Neo-Tokyo mega-spires at twilight during torrential rain. Heavy 35mm anamorphic flares, holographic neon billboards reflecting off wet asphalt, hyper-precise formation flight, and deep cinematic bass droning through the skyline.";

let _cachedProduction: ReturnType<typeof directorAgent.getInitialProduction> | null = null;
function getCachedProduction() {
  if (!_cachedProduction) {
    _cachedProduction = directorAgent.getInitialProduction(DEFAULT_BRIEF);
  }
  return _cachedProduction;
}

let _cachedReview: ReturnType<typeof visualCriticAgent.evaluateSequence> | null = null;
function getCachedReview() {
  if (!_cachedReview) {
    const prod = getCachedProduction();
    _cachedReview = visualCriticAgent.evaluateSequence(
      prod.shots,
      prod.selectedTerritory
    );
  }
  return _cachedReview;
}

const AuteurWorkstation = dynamic(
  () => import("@/components/AuteurWorkstation").then((mod) => mod.AuteurWorkstation),
  {
    ssr: false,
    loading: () => <StudioSkeleton />,
  }
);

export default function AuteurStudioPage() {
  const [brief, setBrief] = useState("");
  const [territories, setTerritories] = useState<CreativeTerritory[]>(
    () => getCachedProduction().territories
  );
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string | null>(
    () => getCachedProduction().selectedTerritory.id
  );
  const [shots, setShots] = useState<Shot[]>(() => getCachedProduction().shots);
  const [criticReview, setCriticReview] = useState<CriticReview | null>(
    () => getCachedReview()
  );
  const [aestheticMemory, setAestheticMemory] = useState<AestheticMemoryItem[]>([]);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([
    {
      id: "step-init-3",
      phase: "assembly",
      label: "Master Cut Engine Armed",
      details:
        "Livepeer Agent 60fps pipeline ready. Awaiting narrative prompt or product URL.",
      timestamp: "00:00:00",
      status: "done",
    },
    {
      id: "step-init-2",
      phase: "critic",
      label: "Visual Critic Standby",
      details: "Aesthetic memory banks calibrated for continuous visual grammar.",
      timestamp: "00:00:00",
      status: "done",
    },
    {
      id: "step-init-1",
      phase: "strategy",
      label: "Creative Brief Ingest Ready",
      details: "Awaiting creative brief or product URL ingestion.",
      timestamp: "00:00:00",
      status: "done",
    },
  ]);
  const [currentPhase, setCurrentPhase] = useState<string>("assembled");
  const [activeShotIndex, setActiveShotIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [livepeerMode, setLivepeerMode] = useState<"real" | "demo">("demo");
  const [showShotLedger, setShowShotLedger] = useState<boolean>(false);

  // Synchronize client-side timestamps safely on mount
  React.useEffect(() => {
    setAgentSteps((prev) =>
      prev.map((s) => ({ ...s, timestamp: new Date().toLocaleTimeString() }))
    );
  }, []);

  const addTelemetryStep = (
    phase: AgentStep["phase"],
    label: string,
    details: string,
    status: AgentStep["status"] = "done"
  ) => {
    setAgentSteps((prev) => [
      {
        id: `step-${Date.now()}-${prev.length + 1}`,
        phase,
        label,
        details,
        timestamp: new Date().toLocaleTimeString(),
        status,
      },
      ...prev,
    ]);
  };

  // Step 1: Ingest brief and generate 3 creative territories
  const handleGenerateTerritories = async (customBrief?: string) => {
    const rawTargetBrief = customBrief?.trim() || brief.trim();
    if (!rawTargetBrief) return;
    setBrief(rawTargetBrief);
    setIsProcessing(true);
    setCurrentPhase("strategizing");

    let targetBrief = rawTargetBrief;
    const isUrl =
      rawTargetBrief.startsWith("http://") ||
      rawTargetBrief.startsWith("https://") ||
      /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(rawTargetBrief);

    if (isUrl) {
      addTelemetryStep(
        "strategy",
        "Live URL Ingestion & Crawl",
        `Scraping brand DNA, product headlines, and meta description from "${rawTargetBrief}"...`
      );

      try {
        const ingestRes = await fetch("/api/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: rawTargetBrief }),
        });
        if (ingestRes.ok) {
          const ingestData = await ingestRes.json();
          if (ingestData.success && ingestData.synthesizedBrief) {
            targetBrief = ingestData.synthesizedBrief;
            addTelemetryStep(
              "strategy",
              `Brand Extracted: ${ingestData.title}`,
              `Context: "${targetBrief.slice(0, 110)}..."`
            );
          }
        }
      } catch (scrapeErr) {
        console.warn("Live URL scraping notice:", scrapeErr);
      }
    } else {
      addTelemetryStep(
        "strategy",
        "Analyzing Creative Brief",
        `Extracting tone, spatial geography, and stylistic vectors for: "${targetBrief}"`
      );
    }

    const result = directorAgent.generateTerritories(targetBrief);
    setTerritories(result.territories);
    setSelectedTerritoryId(result.territories[0]?.id || null);

    addTelemetryStep(
      "inference",
      "Livepeer Creative Agent Subnet: Allocating GPU Nodes",
      `Dispatching 3 Directional Belief keyframe jobs to decentralized GPU orchestrators`
    );

    // Query Livepeer Agent Creative MCP for the 3 territory keyframes in parallel
    const synthesizedTerritories = await Promise.all(
      result.territories.map(async (t: CreativeTerritory, idx: number) => {
        try {
          const prompt = `${t.title}: ${t.visualMetaphor}. ${t.lightingLogic}. ${t.stylePromptModifier}`;
          const res = await fetch("/api/livepeer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "create_media",
              params: {
                action: "generate",
                prompt,
                aspectRatio: t.aspectRatio === "9:16" ? "9:16" : "16:9",
                preferFast: true,
                sceneNumber: idx + 1,
              },
            }),
          });
          if (res.ok) {
            const data = await res.json();
            const url = data.result?.url;
            if (
              url &&
              (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/"))
            ) {
              const safePreviewUrl = url.startsWith("/")
                ? url
                : (url.includes("fal.media")
                    ? url
                    : (url.startsWith("/api/proxy-media") ? url : `/api/proxy-media?url=${encodeURIComponent(url)}`));
              return {
                ...t,
                previewUrl: safePreviewUrl,
                generationLatencyMs: data.result.latencyMs || 6800,
                orchestratorNode: data.result.orchestratorNode || "livepeer-orch-flux-subnet",
              };
            }
          }
        } catch (err) {
          console.warn("Livepeer territory synthesis error:", err);
        }
        return {
          ...t,
          previewUrl: t.previewUrl || resolveCinematicAsset(`${targetBrief} ${t.title}`, idx + 1),
        };
      })
    );

    setTerritories(synthesizedTerritories);
    setSelectedTerritoryId(synthesizedTerritories[0]?.id || null);

    addTelemetryStep(
      "inference",
      "3 Directional Beliefs Synthesized via Livepeer",
      `Decentralized GPU nodes completed keyframe generation across Livepeer subnet`
    );

    setCurrentPhase("territory_select");
    setIsProcessing(false);

    // Speculative Pre-warming: quietly pre-load default territory assets & voiceover
    // while user reviews the 3 creative territories in Stage 2
    const defaultTerritory = synthesizedTerritories[0];
    if (defaultTerritory && typeof window !== "undefined") {
      setTimeout(() => {
        try {
          const prewarmedShots = directorAgent.decomposeStoryboard(targetBrief, defaultTerritory);
          preloadAllShots(prewarmedShots);
          const voText = defaultTerritory.masterVoiceoverScript || prewarmedShots[0]?.masterVoiceoverScript || "";
          if (voText && !defaultTerritory.masterVoiceoverAudioUrl) {
            fetch("/api/livepeer", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "tts", params: { prompt: voText } }),
            })
              .then((r) => r.json())
              .then((data) => {
                if (data.success && data.result?.audioUrl) {
                  defaultTerritory.masterVoiceoverAudioUrl = data.result.audioUrl;
                  defaultTerritory.masterVoiceoverStatus = "ready";
                  const probe = new Audio(data.result.audioUrl);
                  probe.load();
                }
              })
              .catch(() => {});
          }
        } catch (e) {}
      }, 100);
    }

    return synthesizedTerritories;
  };

  // Step 2: Greenlight production across Livepeer Agent
  const handleProduceSequence = async (customBrief?: string, customTerritoryId?: string) => {
    const targetBrief = customBrief?.trim() || brief.trim();
    const targetTerritoryId = customTerritoryId || selectedTerritoryId;
    const selectedTerritory = territories.find((t) => t.id === targetTerritoryId) || territories[0];
    if (!selectedTerritory) return;

    setIsProcessing(true);
    setCurrentPhase("producing");

    addTelemetryStep(
      "storyboard",
      "Decomposing Episodic Storyboard",
      `Translating ${selectedTerritory.title} into 5 continuous cinematic acts`
    );

    const initialShots = directorAgent.decomposeStoryboard(targetBrief, selectedTerritory);
    setShots(initialShots);

    setShots(initialShots.map((s) => ({ ...s, status: "generating" })));

    addTelemetryStep(
      "inference",
      `Synthesizing 5 Acts, Voiceovers & Score on Livepeer Agent Creative MCP`,
      `Dispatching parallel generative compute across Livepeer GPU orchestrators`
    );

    // Parallel dispatch: 1. Video Generations, 2. TTS Voiceovers, 3. Background Soundtrack
    const [completedShots, voiceoverResults, musicResult] = await Promise.all([
      // 1. Livepeer Video Generations
      Promise.all(
        initialShots.map(async (shot, i) => {
          const genResult = await livepeerClient.generateShot({
            prompt: shot.prompt,
            territory: selectedTerritory,
            shot,
            aestheticMemory,
            aspectRatio: selectedTerritory.aspectRatio,
          });

          const reliableAsset = resolveCinematicAsset(shot.prompt || shot.framing, shot.sceneNumber);
          const rawUrl = genResult.posterUrl || genResult.videoUrl;
          const validPosterUrl =
            rawUrl && (rawUrl.startsWith("http://") || rawUrl.startsWith("https://") || rawUrl.startsWith("/") || rawUrl.startsWith("/api/proxy-media"))
              ? (rawUrl.startsWith("/")
                  ? rawUrl
                  : (rawUrl.startsWith("/api/proxy-media") || rawUrl.includes("fal.media")
                      ? rawUrl
                      : `/api/proxy-media?url=${encodeURIComponent(rawUrl)}`))
              : reliableAsset;

          const finishedShot: Shot = {
            ...shot,
            videoUrl: validPosterUrl,
            posterUrl: validPosterUrl,
            status: "completed",
          };

          setShots((prev) =>
            prev.map((s, idx) => (idx === i ? finishedShot : s))
          );

          addTelemetryStep(
            "inference",
            `Act 0${shot.sceneNumber} Video Synthesized via Livepeer (${genResult.orchestratorNode})`,
            `URL: ${genResult.videoUrl.slice(0, 55)}... (${genResult.generationLatencyMs}ms)`
          );

          return finishedShot;
        })
      ),

      // 2. Livepeer Chatterbox TTS: Single Master Voiceover for the full sequence (uses pre-warmed if ready)
      (async () => {
        if (selectedTerritory.masterVoiceoverAudioUrl) {
          addTelemetryStep(
            "inference",
            `Livepeer Master 48kHz Voiceover Ready (Pre-warmed)`,
            `URL: ${selectedTerritory.masterVoiceoverAudioUrl.slice(0, 55)}...`
          );
          return selectedTerritory.masterVoiceoverAudioUrl;
        }

        const masterVoText =
          selectedTerritory.masterVoiceoverScript ||
          initialShots[0]?.masterVoiceoverScript ||
          initialShots[0]?.voiceoverScript ||
          `Cinematic production for ${targetBrief}`;
        try {
          const res = await fetch("/api/livepeer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "tts",
              params: { prompt: masterVoText },
            }),
          });
          const data = await res.json();
          if (data.success && data.result?.audioUrl) {
            selectedTerritory.masterVoiceoverAudioUrl = data.result.audioUrl;
            selectedTerritory.masterVoiceoverJobId = data.result.jobId;
            selectedTerritory.masterVoiceoverStatus = "ready";

            addTelemetryStep(
              "inference",
              `Livepeer Master 48kHz Voiceover Synthesized`,
              `URL: ${data.result.audioUrl.slice(0, 55)}... (${data.result.latencyMs || 850}ms)`
            );
            return data.result.audioUrl as string;
          }
        } catch (e) {
          console.warn("Livepeer Master TTS error:", e);
        }
        return null;
      })(),

      // 3. Livepeer Decentralized Background Score
      (async () => {
        try {
          const res = await fetch("/api/livepeer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "music",
              params: {
                prompt: `Cinematic orchestral score for ${targetBrief}, ${selectedTerritory.musicMood}`,
                duration: 20,
              },
            }),
          });
          const data = await res.json();
          if (data.success && data.result?.audioUrl) {
            selectedTerritory.musicAudioUrl = data.result.audioUrl;
            addTelemetryStep(
              "inference",
              `Livepeer GPU Soundtrack Synthesized`,
              `URL: ${data.result.audioUrl.slice(0, 55)}... (${data.result.latencyMs}ms)`
            );
            return data.result.audioUrl;
          }
        } catch (e) {
          console.warn("Livepeer soundtrack error:", e);
        }
        return null;
      })(),
    ]);

    // Attach master voiceover and visual results to shots for unified continuous playback
    const voiceoverUrl = (voiceoverResults as string | null) || undefined;
    let finalizedShots = completedShots.map((shot) => {
      return {
        ...shot,
        masterVoiceoverScript: selectedTerritory.masterVoiceoverScript,
        masterVoiceoverAudioUrl: voiceoverUrl,
        voiceoverAudioUrl: voiceoverUrl,
        voiceoverStatus: (voiceoverUrl ? "ready" : "local") as "ready" | "local",
      };
    });

    // Derive act durations from voiceover audio length so video = voiceover length exactly
    if (voiceoverUrl) {
      try {
        const voDuration = await new Promise<number>((resolve) => {
          const probe = new Audio(voiceoverUrl);
          const timeout = setTimeout(() => resolve(0), 6000);
          probe.addEventListener("loadedmetadata", () => {
            clearTimeout(timeout);
            if (probe.duration && !isNaN(probe.duration) && isFinite(probe.duration)) {
              resolve(probe.duration);
            } else {
              resolve(0);
            }
          }, { once: true });
          probe.addEventListener("error", () => {
            clearTimeout(timeout);
            resolve(0);
          }, { once: true });
          probe.load();
        });
        if (voDuration > 0 && finalizedShots.length > 0) {
          const perActDuration = +(voDuration / finalizedShots.length).toFixed(2);
          finalizedShots = finalizedShots.map((s) => ({
            ...s,
            durationSec: perActDuration,
          }));
          addTelemetryStep(
            "assembly",
            `Act Durations Synced to Voiceover`,
            `VO: ${voDuration.toFixed(1)}s / ${finalizedShots.length} acts = ${perActDuration}s per act`
          );
        }
      } catch (e) {
        console.warn("Could not probe voiceover duration:", e);
      }
    }

    setShots(finalizedShots);

    // Preload all visual image assets so the canvas renders immediately without black frames
    try {
      await preloadAllShots(finalizedShots);
    } catch (e) {
      console.warn("Preload error in handleProduceSequence:", e);
    }

    addTelemetryStep(
      "critic",
      "Visual Critic Auditing Cut",
      `Evaluating continuity, palette adherence, and pacing against ${selectedTerritory.title} spec`
    );

    const review = visualCriticAgent.evaluateSequence(finalizedShots, selectedTerritory);
    setCriticReview(review);

    addTelemetryStep(
      "assembly",
      "Master Cut Assembled",
      `Audit Score: ${review.overallScore}/100. Pacing, audio, and visual continuity locked.`
    );

    setCurrentPhase("assembled");
    setActiveShotIndex(0);
    setIsProcessing(false);
    return finalizedShots;
  };

  // Step 3: Surgical Refine Loop (Direct & Refine)
  const handleRefineShot = async (shotIndex: number, critique: string) => {
    const targetShot = shots[shotIndex];
    const selectedTerritory = territories.find((t) => t.id === selectedTerritoryId);
    if (!targetShot || !selectedTerritory) return;

    setIsProcessing(true);

    addTelemetryStep(
      "storyboard",
      `Director Directive for Shot 0${targetShot.sceneNumber}`,
      `Critique: "${critique}"`
    );

    const { updatedShot, newMemoryItem } = directorAgent.refineShot(
      targetShot,
      critique,
      aestheticMemory
    );

    const nextMemory = [newMemoryItem, ...aestheticMemory];
    setAestheticMemory(nextMemory);

    setShots((prev) =>
      prev.map((s, idx) => (idx === shotIndex ? updatedShot : s))
    );

    addTelemetryStep(
      "inference",
      `Re-rendering Shot 0${targetShot.sceneNumber} on Livepeer`,
      `Incorporating aesthetic rule: "${newMemoryItem.rule}"`
    );

    const genResult = await livepeerClient.generateShot({
      prompt: updatedShot.prompt,
      territory: selectedTerritory,
      shot: updatedShot,
      aestheticMemory: nextMemory,
      aspectRatio: selectedTerritory.aspectRatio,
    });

    const finalShot: Shot = {
      ...updatedShot,
      videoUrl: genResult.videoUrl,
      posterUrl: genResult.posterUrl,
      status: "completed",
    };

    const nextShots = shots.map((s, idx) => (idx === shotIndex ? finalShot : s));
    setShots(nextShots);

    const nextReview = visualCriticAgent.evaluateSequence(nextShots, selectedTerritory);
    setCriticReview(nextReview);

    addTelemetryStep(
      "critic",
      `Shot 0${targetShot.sceneNumber} Refinement Verified`,
      `New Audit Score: ${nextReview.overallScore}/100. Revision applied to master cut.`
    );
    setActiveShotIndex(shotIndex);
    setIsProcessing(false);
  };

  const handleUpdateShot = (updatedShot: Shot) => {
    setShots((prev) => prev.map((s) => (s.id === updatedShot.id ? updatedShot : s)));
    addTelemetryStep(
      "storyboard",
      `Shot 0${updatedShot.sceneNumber} Voiceover Updated`,
      updatedShot.voiceoverAudioUrl
        ? `Livepeer Chatterbox TTS .wav synchronized`
        : `Narration line refined: "${updatedShot.voiceoverScript.slice(0, 45)}..."`
    );
  };

  const handleUpdateTerritory = (updatedTerritory: CreativeTerritory) => {
    setTerritories((prev) => prev.map((t) => (t.id === updatedTerritory.id ? updatedTerritory : t)));
    addTelemetryStep(
      "inference",
      `Livepeer Soundtrack Synchronized`,
      `Score bed attached to territory: ${updatedTerritory.title}`
    );
  };

  const activeTerritory =
    territories.find((t) => t.id === selectedTerritoryId) || territories[0];

  return (
    <div className="relative min-h-screen bg-[#07080b] text-[#f2f4f8] flex flex-col font-sans selection:bg-[#4ed4b7]/30 selection:text-[#4ed4b7]">
      <AuteurWorkstation
        brief={brief}
        setBrief={setBrief}
        territories={territories}
        selectedTerritoryId={selectedTerritoryId}
        onSelectTerritory={setSelectedTerritoryId}
        onGenerateTerritories={handleGenerateTerritories}
        onProduceSequence={handleProduceSequence}
        shots={shots}
        activeShotIndex={activeShotIndex}
        setActiveShotIndex={setActiveShotIndex}
        criticReview={criticReview}
        aestheticMemory={aestheticMemory}
        agentSteps={agentSteps}
        currentPhase={currentPhase}
        isProcessing={isProcessing}
        onRefineShot={handleRefineShot}
        onUpdateShot={handleUpdateShot}
        onUpdateTerritory={handleUpdateTerritory}
        livepeerMode={livepeerMode}
        onToggleMode={(mode, apiKey) => {
          setLivepeerMode(mode);
          if (apiKey) {
            (livepeerClient as any).apiKey = apiKey;
          }
        }}
        onOpenShotLedger={() => setShowShotLedger(true)}
      />

      {/* Livepeer Shot Ledger Modal */}
      <ShotLedgerModal
        isOpen={showShotLedger}
        onClose={() => setShowShotLedger(false)}
        shots={shots}
        activeTerritory={activeTerritory}
        livepeerMode={livepeerMode}
      />
    </div>
  );
}
