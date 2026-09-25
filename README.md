# Auteur Studio: Autonomous Multimodal Cinema Director

> **Production Generative Cinema Director on the Livepeer AI Subnet**  
> **Interactive Launch Demo**: Available at `/demo` (60 FPS HyperFrames Cinema Player with 6-Beat Narration)  
> **Livepeer Creative MCP**: `https://agent.livepeer.org/api/mcp/creative` (125 tools)  

---

## Executive Summary

**Auteur** is an agent-native creative cinema studio that transforms a single high-level creative brief into an episodic, multi-shot film master. 

Rather than operating as a conventional single-prompt text-to-video wrapper, Auteur implements a structured **"Direct, Review, Refine"** closed loop:
1. **Direct (Strategy Layer)**: Ingests a raw concept and autonomously synthesizes 3 distinct **Creative Territories** (contrasting visual metaphors, camera movement choreography, lighting grammar, color temperature, and aspect ratio).
2. **Review (Inference & Audit Layer)**: Decomposes the chosen territory into a 5-act episodic narrative storyboard, dispatches parallel generative video and audio synthesis across the **Livepeer Agent Creative MCP** (`https://agent.livepeer.org/api/mcp/creative`), and executes an automated **Visual Critic Agent** audit verifying color adherence, lighting continuity, and camera motion.
3. **Refine (Conversational Surgery)**: Enables the director to converse directly with Auteur to request surgical re-renders on specific shots while preserving persistent aesthetic memory across iterations.

---

## Livepeer AI Subnet & MCP Integration

Auteur is built natively on the Livepeer decentralized AI compute framework:

- **Official MCP Endpoint**: `https://agent.livepeer.org/api/mcp/creative` via standard JSON-RPC 2.0 with `Accept: application/json, text/event-stream` protocol compliance.
- **Subnet Credit Engine**: Connects to the Livepeer AI compute network with real-time budget forecasting and cost drawdown tracking per shot (`~$0.02 - $0.05/shot`).
- **Flexible Auth (Keyless or Bearer)**: Supports instant keyless connection as well as direct Bearer key authentication via the in-app Developer Drawer.
- **Zero-CORS Streaming Media Proxy**: Features an integrated server-side streaming proxy (`/api/proxy-media`) with `Access-Control-Allow-Origin: *` headers, eliminating HTML5 canvas tainting and 302 redirect errors from upstream storage nodes.
- **Hardware-Composited 60 FPS Screening Room**: Strict compliance with browser compositor laws—zero React state updates during playback, direct HTML5 canvas refs, and GPU-accelerated transforms (`translate3d`).

---

## System Architecture

```
                                  [ Creative Brief ]
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │             Auteur Engine              │
                      │                                        │
                      │  1. Strategy Agent: 3 Territories      │
                      │  2. Storyboard Agent: 5-Shot Sequence  │
                      │  3. Livepeer Agent MCP: GPU Inference  │
                      │  4. Visual Critic: Continuity Audit    │
                      │  5. Timeline Assembler: Master Cut     │
                      └────────────────────────────────────────┘
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    ▼                                           ▼
       ┌─────────────────────────┐                 ┌─────────────────────────┐
       │   The Director's Desk   │                 │   The Screening Room    │
       │ • Brief & Territories   │                 │ • Master Sequence HUD   │
       │ • Live Telemetry Log    │                 │ • 35mm Celluloid Canvas │
       │ • Conversational Cut    │                 │ • Visual Critic Report  │
       │ • Aesthetic Memory      │                 │ • 2.39:1 / 16:9 / 9:16  │
       └─────────────────────────┘                 └─────────────────────────┘
```

---

## Key Capabilities

### 1. Creative Territory Generation
Deconstructs any creative brief into 3 nuanced artistic directions with distinct cinematic genomes:
- **Cyber-Noir Anamorphic**: Low-key lighting, cyan/magenta contrast, wet metropolitan reflections, and slow horizontal tracking.
- **Solarpunk Optimism**: Golden hour diffusion, lush vertical botanicals, and fluid aerial dolly passes.
- **Tactical Brutalism**: Monolithic stone, hard directional top light, and rhythmic drone-tracking cuts.
- **Grand Prix Engineering**: Night track halo sparks, aerodynamic carbon-fiber bodywork, asphalt heat shimmer.

### 2. Livepeer Shot Ledger & Pre-Spend Forecaster
- **Deterministic Pre-Spend Gates**: Computes exact GPU compute costs per shot before dispatching to decentralized orchestrators.
- **Telemetry Console**: Real-time monitoring of Livepeer US-East subnets, GPU clusters (RTX 4090 / A100), latency, and remaining quota.
- **Verifiable Proofs**: Generates downloadable execution logs detailing orchestrator nodes, latency, and model checkpoints.

### 3. Automated Visual Critic
An autonomous internal agent that audits every generated cut before presentation:
- Continuity coherence scoring (0-100%).
- Lighting logic and chromatic consistency checks.
- Concrete director notes and actionable improvement suggestions.

### 4. Persistent Aesthetic Memory
Tracks and retains director critiques across iterations. When you instruct Auteur to *"soften the backlight and add 35mm grain"*, this constraint is stored in memory and enforced across all subsequent shots.

---

## Quickstart & Local Setup

### 1. Installation
```bash
git clone https://github.com/dino1x/auteur.git
cd auteur
npm install
```

### 2. Environment (Optional)
```bash
cp .env.example .env.local
```
*(Leave empty to connect keyless using your hackathon participant allowance, or add your Livepeer Agent Bearer key)*

### 3. Launch Development Studio
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## Technology Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Decentralized AI Compute**: Livepeer Agent Creative MCP (`https://agent.livepeer.org/api/mcp/creative`)
- **Styling & Aesthetics**: Tailwind CSS, Lucide Icons, Custom 35mm Celluloid Canvas
- **Procedural Audio**: Web Audio API tactile feedback & synthetic audio cues

---

## Author & Project Details

- **Author**: dino
- **GitHub**: [@dino1x](https://github.com/dino1x)
- **Email**: marvelobed@gmail.com
- **License**: MIT
