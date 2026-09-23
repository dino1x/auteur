"use client";

/**
 * Cinematic Audio Engine
 * Provides real-time procedural ambient soundtrack generation via Web Audio API,
 * dynamic voiceover narration via SpeechSynthesis API, and an audio stream destination
 * for master video export.
 */

export class CinematicAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscNodes: OscillatorNode[] = [];
  private filterNode: BiquadFilterNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isMuted: boolean = false;
  private currentVolume: number = 0.7;
  private currentTerritoryId: string = "";
  private streamDestination: MediaStreamAudioDestinationNode | null = null;
  private scoreAudio: HTMLAudioElement | null = null;
  private scoreSourceNode: MediaElementAudioSourceNode | null = null;
  private pulseTimer: any = null;
  private chordTimer: any = null;
  private motifTimer: any = null;

  public init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume * 0.75, this.ctx.currentTime);

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;

        this.streamDestination = this.ctx.createMediaStreamDestination();

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
        this.masterGain.connect(this.streamDestination);
      }
    }
  }

  public getAudioStream(): MediaStream | null {
    this.init();
    return this.streamDestination ? this.streamDestination.stream : null;
  }

  /**
   * Plays a subtle micro-interaction audio cue
   */
  public playCue(type: "start" | "stop" | "transition" | "click" | "hover" | "play" | "action" | "success" = "start") {
    this.init();
    if (!this.ctx || this.isMuted) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);

      if (type === "click" || type === "hover") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(type === "click" ? 880 : 1200, now);
        osc.frequency.exponentialRampToValueAtTime(type === "click" ? 440 : 1600, now + 0.05);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "action") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "success") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "start" || type === "play") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === "transition") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.15);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (e) {}
  }

  /**
   * Deterministic string hashing for prompt parameter derivation
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  /**
   * Starts a procedural cinematic score tailored specifically to the given prompt and territory.
   * Synthesizes root key, musical mode, progressive 4-chord sequence, rhythmic pulse, and melodic motifs.
   */
  public async startSoundtrack(territoryId: string = "cyber", briefText: string = "") {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === "suspended") {
      try {
        await this.ctx.resume();
      } catch (e) {}
    }

    this.stopSoundtrack();
    this.currentTerritoryId = territoryId;

    const seedText = `${briefText} ${territoryId}`.toLowerCase().trim();
    const seed = this.hashString(seedText || "auteur cinematic");

    // 1. Root Key Selection across 12 chromatic pitches (in octave 2 / bass range)
    const ROOT_KEYS = [
      65.41, // C2
      69.30, // C#2
      73.42, // D2
      77.78, // Eb2
      82.41, // E2
      87.31, // F2
      92.50, // F#2
      98.00, // G2
      103.83, // Ab2
      110.00, // A2
      116.54, // Bb2
      123.47, // B2
    ];
    const rootFreq = ROOT_KEYS[seed % ROOT_KEYS.length];

    // 2. Mode & Musical Personality derived from semantic tags or prompt hash
    let modeIntervals: number[] = [0, 3, 7, 10]; // Default: Natural Minor / Noir
    let filterFreq = 540;
    let bpm = 74;
    let progressionSemitones = [0, -4, -2, -5];

    if (seedText.includes("ocean") || seedText.includes("sea") || seedText.includes("water") || seedText.includes("abyss") || seedText.includes("deep")) {
      // Hydro-acoustic Phrygian
      modeIntervals = [0, 1, 7, 8, 12, 15];
      filterFreq = 380;
      bpm = 64;
      progressionSemitones = [0, 1, -2, -4];
    } else if (seedText.includes("space") || seedText.includes("star") || seedText.includes("galaxy") || seedText.includes("orbit") || seedText.includes("cosmos")) {
      // Cosmic Lydian with open fifths
      modeIntervals = [0, 4, 7, 11, 14, 18];
      filterFreq = 720;
      bpm = 70;
      progressionSemitones = [0, 5, 7, 5];
    } else if (seedText.includes("cyber") || seedText.includes("tech") || seedText.includes("ai") || seedText.includes("drone") || seedText.includes("noir")) {
      // Driving Dorian
      modeIntervals = [0, 3, 7, 9, 14, 15];
      filterFreq = 520;
      bpm = 88;
      progressionSemitones = [0, 3, 5, 7];
    } else if (seedText.includes("solar") || seedText.includes("nature") || seedText.includes("green") || seedText.includes("dawn")) {
      // Warm Mixolydian
      modeIntervals = [0, 4, 7, 9, 12, 16];
      filterFreq = 640;
      bpm = 78;
      progressionSemitones = [0, -5, -2, -4];
    } else if (seedText.includes("race") || seedText.includes("speed") || seedText.includes("fast") || seedText.includes("f1")) {
      // High-Velocity Minor Pentatonic
      modeIntervals = [0, 3, 5, 7, 10, 12];
      filterFreq = 760;
      bpm = 104;
      progressionSemitones = [0, 3, 7, 5];
    } else if (seedText.includes("luxury") || seedText.includes("fashion") || seedText.includes("glass")) {
      // Elegant Major 9th
      modeIntervals = [0, 4, 7, 11, 14];
      filterFreq = 480;
      bpm = 72;
      progressionSemitones = [0, -3, -5, -2];
    } else {
      // Procedural generative selection
      const modes = [
        [0, 3, 7, 10], // Minor 7
        [0, 3, 7, 9, 14], // Dorian
        [0, 4, 7, 11, 18], // Lydian
        [0, 1, 7, 8, 12], // Phrygian
        [0, 4, 7, 10, 14], // Mixolydian
      ];
      modeIntervals = modes[seed % modes.length];
      bpm = 68 + (seed % 34);
      filterFreq = 450 + (seed % 320);
      progressionSemitones = [0, (seed % 5) - 4, (seed % 7) - 3, (seed % 6) - 5];
    }

    const now = this.ctx.currentTime;

    // Master low-pass filter with gentle Q resonance
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = "lowpass";
    this.filterNode.frequency.setValueAtTime(filterFreq, now);
    this.filterNode.Q.setValueAtTime(1.2, now);
    this.filterNode.connect(this.masterGain);

    // 3. Layer A: Sub-bass Anchor (Fundamental sub-octave)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(rootFreq * 0.5, now);
    subGain.gain.setValueAtTime(0.06, now);
    subOsc.connect(subGain);
    subGain.connect(this.filterNode);
    subOsc.start(now);
    this.oscNodes.push(subOsc);

    // 4. Layer B: Harmonic Pad Cluster (Root + Fifth + Octave + Tenth with subtle detune)
    const chordPitches = [
      rootFreq,
      rootFreq * Math.pow(2, (modeIntervals[1] || 3) / 12),
      rootFreq * Math.pow(2, (modeIntervals[2] || 7) / 12),
      rootFreq * Math.pow(2, (modeIntervals[3] || 10) / 12),
    ];

    const padOscs: { osc: OscillatorNode; baseFreq: number }[] = [];

    chordPitches.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((idx - 1.5) * 6, now);

      const voiceGain = 0.035 / (idx * 0.35 + 1);
      gain.gain.setValueAtTime(voiceGain, now);

      osc.connect(gain);
      gain.connect(this.filterNode!);
      osc.start(now);
      this.oscNodes.push(osc);
      padOscs.push({ osc, baseFreq: freq });
    });

    // 5. Dynamic 4-Chord Progression Loop: Chords cycle smoothly every 6 seconds
    let chordStep = 0;
    this.chordTimer = setInterval(() => {
      if (!this.ctx || this.oscNodes.length === 0) return;
      chordStep = (chordStep + 1) % progressionSemitones.length;
      const semitoneShift = progressionSemitones[chordStep];
      const shiftRatio = Math.pow(2, semitoneShift / 12);
      const t = this.ctx.currentTime;

      // Smooth portamento crossfade to new chord root
      subOsc.frequency.setTargetAtTime(rootFreq * 0.5 * shiftRatio, t, 0.8);
      padOscs.forEach(({ osc, baseFreq }) => {
        osc.frequency.setTargetAtTime(baseFreq * shiftRatio, t, 0.7);
      });
    }, 6000);

    // 6. Layer C: Rhythmic Cinematic Sub-Pulse / Heartbeat
    const pulseIntervalMs = Math.round((60 / bpm) * 1000);
    this.pulseTimer = setInterval(() => {
      if (!this.ctx || !this.filterNode || this.isMuted) return;
      try {
        const t = this.ctx.currentTime;
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();

        kickOsc.type = "sine";
        kickOsc.frequency.setValueAtTime(rootFreq * 1.5, t);
        kickOsc.frequency.exponentialRampToValueAtTime(rootFreq * 0.45, t + 0.14);

        kickGain.gain.setValueAtTime(0.045, t);
        kickGain.gain.exponentialRampToValueAtTime(0.0005, t + 0.14);

        kickOsc.connect(kickGain);
        kickGain.connect(this.filterNode);

        kickOsc.start(t);
        kickOsc.stop(t + 0.15);
      } catch (e) {}
    }, pulseIntervalMs);

    // 7. Layer D: Evolving Melodic Motif (ambient crystalline bell accents)
    this.motifTimer = setInterval(() => {
      if (!this.ctx || !this.filterNode || this.isMuted) return;
      try {
        const t = this.ctx.currentTime;
        const noteIdx = Math.floor(Math.random() * modeIntervals.length);
        const semitone = modeIntervals[noteIdx] + 12; // 1 octave up
        const bellFreq = rootFreq * Math.pow(2, semitone / 12);

        const bellOsc = this.ctx.createOscillator();
        const bellGain = this.ctx.createGain();

        bellOsc.type = "sine";
        bellOsc.frequency.setValueAtTime(bellFreq, t);

        bellGain.gain.setValueAtTime(0.025, t);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

        bellOsc.connect(bellGain);
        bellGain.connect(this.filterNode);

        bellOsc.start(t);
        bellOsc.stop(t + 1.25);
      } catch (e) {}
    }, 2800);

    this.masterGain.gain.setValueAtTime(
      this.isMuted ? 0 : this.currentVolume * 0.75,
      now
    );
  }

  public stopSoundtrack() {
    if (this.chordTimer) {
      clearInterval(this.chordTimer);
      this.chordTimer = null;
    }
    if (this.pulseTimer) {
      clearInterval(this.pulseTimer);
      this.pulseTimer = null;
    }
    if (this.motifTimer) {
      clearInterval(this.motifTimer);
      this.motifTimer = null;
    }

    this.oscNodes.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.oscNodes = [];

    if (this.scoreAudio) {
      try {
        this.scoreAudio.pause();
        this.scoreAudio.currentTime = 0;
      } catch (e) {}
      this.scoreAudio = null;
    }
  }

  /**
   * Starts score playback. Prioritizes real Livepeer GPU soundtrack URL,
   * or plays the bespoke procedural ambient score parameterized by the brief.
   */
  public startScore(territory: any, brief?: string) {
    this.init();
    const musicUrl = territory?.musicAudioUrl;

    if (musicUrl && typeof window !== "undefined") {
      this.stopSoundtrack();
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      try {
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.src = musicUrl;
        audio.loop = true;
        this.scoreAudio = audio;

        if (this.ctx && this.masterGain) {
          try {
            const source = this.ctx.createMediaElementSource(audio);
            source.connect(this.masterGain);
            this.scoreSourceNode = source;
          } catch (err) {
            audio.volume = this.isMuted ? 0 : this.currentVolume * 0.75;
          }
        } else {
          audio.volume = this.isMuted ? 0 : this.currentVolume * 0.75;
        }

        audio.play().catch((err) => {
          console.warn("Livepeer music autoplay blocked:", err);
        });
        return;
      } catch (err) {
        console.warn("Livepeer music playback failed:", err);
      }
    }

    // Procedural ambient soundtrack parameterized by brief and territory
    const tid = typeof territory === "string" ? territory : territory?.id || "cyber";
    const contextBrief = brief || (typeof territory === "object" ? `${territory.title || ""} ${territory.musicMood || ""}` : "");
    return this.startSoundtrack(tid, contextBrief);
  }

  public stopScore() {
    return this.stopSoundtrack();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.currentVolume * 0.75,
        this.ctx.currentTime
      );
    }
    if (this.scoreAudio) {
      this.scoreAudio.volume = this.isMuted ? 0 : this.currentVolume * 0.75;
      this.scoreAudio.muted = this.isMuted;
    }
    cinematicVoiceover.setMuted(this.isMuted);
    return this.isMuted;
  }

  public setVolume(val: number) {
    this.currentVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.currentVolume * 0.75,
        this.ctx.currentTime
      );
    }
    if (this.scoreAudio) {
      this.scoreAudio.volume = this.isMuted ? 0 : this.currentVolume * 0.75;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(16).fill(0);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data.slice(0, 16);
  }
}

export class CinematicVoiceoverEngine {
  private currentAudio: HTMLAudioElement | null = null;
  private speaking = false;
  private currentEngine: "livepeer" | "director" = "livepeer";
  private listeners: Set<(speaking: boolean, engine: "livepeer" | "director") => void> = new Set();

  public subscribe(listener: (speaking: boolean, engine: "livepeer" | "director") => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(speaking: boolean, engine: "livepeer" | "director") {
    this.speaking = speaking;
    this.currentEngine = engine;
    this.listeners.forEach((fn) => fn(speaking, engine));
  }

  public isSpeaking(): boolean {
    if (this.currentAudio && !this.currentAudio.paused && !this.currentAudio.ended) {
      return true;
    }
    return this.speaking;
  }

  public getActiveEngine(): "livepeer" | "director" {
    return this.currentEngine;
  }

  /**
   * Plays Livepeer decentralized .wav TTS audio. Livepeer-only -- no browser speech fallback.
   * Guarantees onEnd() is invoked only after the entire narration finishes playing.
   */
  public speakAudio(
    audioUrl?: string,
    fallbackText?: string,
    onEnd?: () => void,
    onDuration?: (durationSec: number) => void
  ) {
    this.stop();

    // Use explicit Livepeer audio URL, or route through Livepeer 48kHz audio stream provider
    const effectiveUrl =
      audioUrl ||
      (fallbackText && fallbackText.trim()
        ? `/api/livepeer?tts=1&text=${encodeURIComponent(fallbackText.trim())}`
        : undefined);

    if (effectiveUrl) {
      try {
        const audio = new Audio(effectiveUrl);
        const isMuted = cinematicAudio.getMuted();
        audio.volume = isMuted ? 0 : 1.0;
        audio.muted = isMuted;
        this.currentAudio = audio;
        this.notify(true, "livepeer");

        audio.onloadedmetadata = () => {
          if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
            onDuration?.(audio.duration);
          }
        };

        audio.onended = () => {
          this.currentAudio = null;
          this.notify(false, "livepeer");
          onEnd?.();
        };

        audio.onerror = () => {
          console.warn("Livepeer audio URL playback failed");
          this.currentAudio = null;
          this.notify(false, "livepeer");
          onEnd?.();
        };

        audio.play().catch((err) => {
          console.warn("Audio play() blocked or failed:", err);
          this.notify(false, "livepeer");
          onEnd?.();
        });
        return;
      } catch (err) {
        console.warn("Failed to instantiate Audio for URL:", err);
      }
    }

    onEnd?.();
  }

  /**
   * Legacy speak method -- no-op in Livepeer-only mode.
   * Voiceover is exclusively via Livepeer TTS audio URLs played through speakAudio().
   */
  public speak(_text: string, onEnd?: () => void, _onDuration?: (durationSec: number) => void) {
    onEnd?.();
  }

  public setMuted(muted: boolean) {
    if (this.currentAudio) {
      this.currentAudio.muted = muted;
      this.currentAudio.volume = muted ? 0 : 1.0;
    }
  }

  public stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }

    this.notify(false, this.currentEngine);
  }
}

export const cinematicAudio = new CinematicAudioEngine();
export const cinematicVoiceover = new CinematicVoiceoverEngine();

