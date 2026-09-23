export type AspectRatio = "16:9" | "9:16" | "2.39:1" | "1:1";

export interface CreativeTerritory {
  id: string;
  title: string;
  tagline: string;
  visualMetaphor: string;
  colorPalette: string[];
  lightingLogic: string;
  cameraLanguage: string;
  pacing: string;
  aspectRatio: AspectRatio;
  musicMood: string;
  stylePromptModifier: string;
  previewUrl?: string;
  musicAudioUrl?: string;
  musicJobId?: string;
  masterVoiceoverScript?: string;
  masterVoiceoverAudioUrl?: string;
  masterVoiceoverJobId?: string;
  masterVoiceoverStatus?: "ready" | "synthesizing" | "local";
  orchestratorNode?: string;
  generationLatencyMs?: number;
}

export interface Shot {
  id: string;
  sceneNumber: number;
  title: string;
  framing: string;
  action: string;
  cameraMotion: string;
  prompt: string;
  voiceoverScript: string;
  voiceoverAudioUrl?: string;
  voiceoverJobId?: string;
  voiceoverStatus?: "ready" | "synthesizing" | "local";
  masterVoiceoverScript?: string;
  masterVoiceoverAudioUrl?: string;
  durationSec: number;
  videoUrl: string;
  posterUrl: string;
  status: "queued" | "generating" | "completed" | "refining";
  critiqueNotes?: string;
  revisionCount?: number;
}

export interface CriticReview {
  overallScore: number;
  continuityScore: number;
  lightingScore: number;
  pacingScore: number;
  critiqueSummary: string;
  strengths: string[];
  suggestedFixes: string[];
  approved: boolean;
}

export interface AestheticMemoryItem {
  id: string;
  timestamp: string;
  rule: string;
  sourceFeedback: string;
  appliedToShots: number[];
}

export interface AgentStep {
  id: string;
  phase: "strategy" | "storyboard" | "inference" | "critic" | "assembly";
  label: string;
  details: string;
  timestamp: string;
  status: "pending" | "running" | "done";
}

export interface InnovationPlaybook {
  id: string;
  badge: "HERO" | "LIVEPEER AGENT" | "INNOVATION";
  title: string;
  tagline: string;
  description: string;
  category: "cinema" | "muse" | "broadcast" | "lookbook" | "social" | "product";
  defaultBrief: string;
  costEstimate: string;
  toolsUsed: string[];
  recommendedAspectRatio: AspectRatio;
}

export interface ShotLedgerEntry {
  shotId: string;
  sceneNumber: number;
  title: string;
  capability: string;
  nodeSubnet: string;
  aspectRatio: AspectRatio;
  durationSec: number;
  estimatedCostUsd: number;
  status: "planned" | "rendering" | "settled";
  verificationHash: string;
}

export interface ProjectState {
  id: string;
  brief: string;
  territories: CreativeTerritory[];
  selectedTerritoryId: string | null;
  shots: Shot[];
  criticReview: CriticReview | null;
  aestheticMemory: AestheticMemoryItem[];
  agentSteps: AgentStep[];
  currentPhase: "idle" | "strategizing" | "territory_select" | "producing" | "assembled" | "refining";
  activeShotIndex: number;
  isPlaying: boolean;
  livepeerMode: "real" | "demo";
}
