import { CreativeTerritory, Shot, AestheticMemoryItem } from "./types";
import { resolveCinematicAsset } from "./generative-cinema";

export interface TerritoryGenerationResult {
  territories: CreativeTerritory[];
  reasoning: string;
}

export function computeNarrationDuration(script?: string, minSec: number = 8.5): number {
  if (!script || !script.trim()) return minSec;
  const words = script.trim().split(/\s+/).length;
  // Natural cinematic narration pace: ~1.8 words/sec + 2.0s breathing pause and hold
  const estimated = Math.ceil(words / 1.8) + 2.0;
  return Math.max(minSec, Math.min(26, estimated));
}

export class DirectorAgent {
  /**
   * Translates any single-sentence creative brief or URL into 3 bespoke Creative Territories
   * with inferred tone, visual metaphors, color palette, camera language, and score styling.
   */
  public generateTerritories(brief: string): TerritoryGenerationResult {
    const cleanBrief = brief
      .replace(/^(a|an|the|https?:\/\/|www\.)\s*/i, "")
      .replace(/\/.*$/, "")
      .trim();
    const title = cleanBrief.length > 32 ? cleanBrief.slice(0, 30) + "..." : cleanBrief;
    const lower = brief.toLowerCase();

    // Semantic extraction: detect the dominant environment, subject, and mood from any brief
    const env = this.inferEnvironment(lower);
    const subject = this.extractSubject(cleanBrief);

    return {
      reasoning: `Synthesizing 3 bespoke cinematic territories for "${title}": ${env.dramaticTitle}, ${env.atmosphericTitle}, and ${env.kineticTitle}.`,
      territories: [
        {
          id: "t-dramatic-shadow",
          title: `${title} · ${env.dramaticTitle}`,
          tagline: env.dramaticTagline,
          visualMetaphor: `${subject} emerging from ${env.dramaticEnvironment} into striking directional light.`,
          colorPalette: env.dramaticPalette,
          lightingLogic: `Single strong key light with ${env.dramaticLightModifier} and sharp negative fill.`,
          cameraLanguage: `Steadicam slow forward pushes ${env.dramaticCameraModifier}.`,
          pacing: "Measured and magnetic.",
          aspectRatio: "2.39:1",
          musicMood: `Deep ${env.dramaticInstrument} textures with warm analog tape saturation.`,
          stylePromptModifier: `chiaroscuro cinematic lighting, 35mm film grain, masterpiece cinematography, dramatic shadows, ${env.styleKeywords}, ${cleanBrief}`,
        },
        {
          id: "t-atmospheric-natural",
          title: `${title} · ${env.atmosphericTitle}`,
          tagline: env.atmosphericTagline,
          visualMetaphor: `A contemplative perspective revealing the full expanse of ${cleanBrief} in ${env.atmosphericEnvironment}.`,
          colorPalette: env.atmosphericPalette,
          lightingLogic: `${env.atmosphericLightModifier} with cool ambient wrap.`,
          cameraLanguage: `Locked-off wide tableaux and ${env.atmosphericCameraModifier}.`,
          pacing: "Meditative, emotional, breathtaking.",
          aspectRatio: "16:9",
          musicMood: `${env.atmosphericInstrument} with gentle ambient reverb.`,
          stylePromptModifier: `soft natural light, minimalist composition, poetic cinema, ${env.styleKeywords}, photorealistic atmospheric perspective, ${cleanBrief}`,
        },
        {
          id: "t-kinetic-velocity",
          title: `${title} · ${env.kineticTitle}`,
          tagline: env.kineticTagline,
          visualMetaphor: `High-speed kinetic momentum capturing ${cleanBrief} in ${env.kineticEnvironment}.`,
          colorPalette: env.kineticPalette,
          lightingLogic: `Dynamic ${env.kineticLightModifier} with vivid colored accents.`,
          cameraLanguage: `${env.kineticCameraModifier} and dynamic parallax tracking.`,
          pacing: "High-energy, pulse-quickening, urgent.",
          aspectRatio: "16:9",
          musicMood: `Driving ${env.kineticInstrument} with crisp transient beats.`,
          stylePromptModifier: `dynamic camera motion, commercial grade lighting, high-speed shutter, ${env.styleKeywords}, ultra-sharp 8k, ${cleanBrief}`,
        },
      ],
    };
  }

  /** Extract the core subject phrase from a brief */
  private extractSubject(cleanBrief: string): string {
    const words = cleanBrief.split(/\s+/);
    const subject = words.slice(0, Math.min(4, words.length)).join(" ");
    return subject.charAt(0).toUpperCase() + subject.slice(1);
  }

  /** Infer environment, mood, lighting, and camera parameters from any brief */
  private inferEnvironment(lower: string) {
    // Strip cinematography and prompt boilerplate that could trigger false positive matches
    const cleanLower = lower
      .replace(/\b(high-speed|high speed|speed shutter|tracking|tracking dolly|camera tracking|driving beat|driving taiko|driving percussion|driving tempo|35mm celluloid|celluloid|deep focus|speed of light)\b/gi, " ")
      .trim();

    // Helper for whole-word boundary matching
    const hasWord = (w: string) => new RegExp(`\\b${w}\\b`, "i").test(cleanLower);
    const hasAny = (...words: string[]) => words.some(w => {
      if (w.includes(" ")) {
        return cleanLower.includes(w.toLowerCase());
      }
      return new RegExp(`\\b${w}\\b`, "i").test(cleanLower);
    });

    // 1. Wildlife, Himalayan, Big Cats & Mountain Predators
    if (hasAny("leopard", "snow leopard", "tiger", "lion", "cheetah", "jaguar", "panther", "predator", "wildlife", "animal", "feline", "himalaya", "himalayan", "ridge", "ridgeline", "alpine", "summit", "glacier")) {
      return {
        dramaticTitle: "Apex Solitude", dramaticTagline: "High-altitude limestone crags, sub-zero vapor, and solitary predator focus.",
        dramaticEnvironment: "frozen Himalayan ridgelines and misty alpine cliffs", dramaticPalette: ["#0a0d14", "#8ba3c7", "#e2e8f0", "#3a4a60"],
        dramaticLightModifier: "harsh high-altitude alpine sun with raking rim light", dramaticCameraModifier: "telephoto compression tracking across sheer rock faces", dramaticInstrument: "deep Tibetan bronze bells and bowed cello",
        atmosphericTitle: "Misty Ridgeway", atmosphericTagline: "Dense glacial mist, morning ridge light, and undisturbed silence.",
        atmosphericEnvironment: "wind-swept mountain ridgelines shrouded in morning mist", atmosphericPalette: ["#0d131d", "#7c93a8", "#c8d6e5", "#f0f4f8"],
        atmosphericLightModifier: "Diffused morning sunlight filtering through alpine clouds", atmosphericCameraModifier: "panoramic slow reveal across snow-capped peaks", atmosphericInstrument: "Haunting wind flutes and ambient glacial drone",
        kineticTitle: "Alpine Stride", kineticTagline: "Sure-footed velocity across impossible scree and sheer vertical terrain.",
        kineticEnvironment: "jagged granite crags and powdery snow fields", kineticPalette: ["#070a0f", "#4ed4b7", "#98b2ff", "#ffffff"],
        kineticLightModifier: "high-contrast snow glare with crisp silhouette backlighting", kineticCameraModifier: "Stabilized gimbal tracking alongside the mountain stride", kineticInstrument: "driving acoustic percussion with resonant mountain drums",
        styleKeywords: "wildlife cinematography, snow leopard, high altitude Himalayas, alpine mountain landscape, National Geographic tier",
      };
    }

    // 2. Automotive, Motorsport & Racing (Strict matching only: racecars, f1, supercars, etc.)
    if (hasAny("f1", "formula 1", "formula one", "supercar", "hypercar", "racecar", "motorsport", "nascar", "le mans", "grand prix", "drag strip", "circuit race", "pit lane", "porsche", "ferrari", "mclaren", "lamborghini") || (hasAny("car", "vehicle", "automobile") && !hasAny("carbon", "carpet", "scarlet", "card"))) {
      return {
        dramaticTitle: "Pit Lane Noir", dramaticTagline: "Polished carbon fiber, oil-slick reflections, and mechanical tension.",
        dramaticEnvironment: "dimly lit garages and rain-streaked pit lanes", dramaticPalette: ["#06080b", "#e8c76d", "#cc0000", "#fafafc"],
        dramaticLightModifier: "workshop tungsten with metallic reflections", dramaticCameraModifier: "around carbon fiber bodywork", dramaticInstrument: "deep engine rumble textures",
        atmosphericTitle: "Open Road", atmosphericTagline: "Vast horizons, golden hour asphalt, and the freedom of distance.",
        atmosphericEnvironment: "endless open highways at golden hour", atmosphericPalette: ["#12151d", "#e8c76d", "#ff8c42", "#f5f6fa"],
        atmosphericLightModifier: "Long golden hour sidelight with lens flare", atmosphericCameraModifier: "helicopter tracking along highway", atmosphericInstrument: "Ambient synthesizer pads",
        kineticTitle: "Apex Velocity", kineticTagline: "Wheel-to-wheel combat, g-force compression, and split-second decisions.",
        kineticEnvironment: "the apex of high-speed corners under race conditions", kineticPalette: ["#08090c", "#ff3333", "#00ff88", "#ffffff"],
        kineticLightModifier: "strobing track lights and motion blur", kineticCameraModifier: "Onboard camera snap cuts", kineticInstrument: "electronic arpeggios layered with engine harmonics",
        styleKeywords: "automotive cinematography, high-speed shutter, carbon fiber detail, motorsport",
      };
    }

    // 3. Ocean & Marine
    if (lower.includes("ocean") || lower.includes("sea") || lower.includes("water") || lower.includes("marine") || lower.includes("jellyfish") || lower.includes("dive") || lower.includes("abyss")) {
      return {
        dramaticTitle: "Abyssal Noir", dramaticTagline: "Deep sapphire water, ethereal cyan glow, and suspended oceanic particulate.",
        dramaticEnvironment: "the midnight ocean floor", dramaticPalette: ["#040914", "#00f0ff", "#2e78c7", "#0a1b3a"],
        dramaticLightModifier: "bioluminescent emission and volumetric torch beams", dramaticCameraModifier: "through submerged fluid drift", dramaticInstrument: "hydrophone resonance",
        atmosphericTitle: "Pelagic Horizon", atmosphericTagline: "Glittering sunlight through surface crests, turquoise gradients, and infinite depth.",
        atmosphericEnvironment: "open pelagic waters under shifting sunbeams", atmosphericPalette: ["#082032", "#4ed4b7", "#98b2ff", "#f0f8ff"],
        atmosphericLightModifier: "Caustic surface refraction casting dancing light webs", atmosphericCameraModifier: "sweeping vertical ascending boom", atmosphericInstrument: "Neo-classical strings",
        kineticTitle: "Submersible Velocity", kineticTagline: "High-pressure dives, sonar telemetry, and robotic precision.",
        kineticEnvironment: "rapid submersible descent through the water column", kineticPalette: ["#05080c", "#e8c76d", "#526070", "#16202c"],
        kineticLightModifier: "dual tungsten floodlights cutting through silt", kineticCameraModifier: "Mechanical pan-tilt gimbal locks", kineticInstrument: "industrial hydro-percussion",
        styleKeywords: "underwater cinematography, ocean depth, volumetric water rays",
      };
    }

    // 4. Cosmic & Space
    if (lower.includes("space") || lower.includes("star") || lower.includes("galaxy") || lower.includes("mars") || lower.includes("orbit") || lower.includes("planet") || lower.includes("astro")) {
      return {
        dramaticTitle: "Deep Cosmos Noir", dramaticTagline: "Infrared nebulae, zero-gravity isolation, and pure cosmic scale.",
        dramaticEnvironment: "vibrant infrared cosmic dust clouds", dramaticPalette: ["#03050a", "#e8c76d", "#7e94ff", "#2a1f44"],
        dramaticLightModifier: "starlight point-sources with chromatic starburst flares", dramaticCameraModifier: "with zero-gravity rotational roll", dramaticInstrument: "massive orchestral strings",
        atmosphericTitle: "Orbital Vanguard", atmosphericTagline: "High-albedo planet curves, sleek composites, and sunlit vacuum.",
        atmosphericEnvironment: "the atmospheric limb above Earth", atmosphericPalette: ["#0a0f18", "#4ed4b7", "#00f0ff", "#ffffff"],
        atmosphericLightModifier: "Blinding unfiltered direct sunlight against pitch-black vacuum", atmosphericCameraModifier: "smooth orbital trajectory tracking", atmosphericInstrument: "Cinematic synthesizer arpeggios",
        kineticTitle: "Solar Terminus", kineticTagline: "Golden coronal flares, stark silhouettes, and solar wind radiation.",
        kineticEnvironment: "incandescent coronal light at the solar edge", kineticPalette: ["#0d0806", "#ff8c42", "#e8c76d", "#3a1a12"],
        kineticLightModifier: "intense rim backlighting from stellar coronae", kineticCameraModifier: "Extreme telephoto compression pushes", kineticInstrument: "warm analog brass drones",
        styleKeywords: "cosmic deep field imagery, zero gravity cinematography, anamorphic lens flare",
      };
    }

    // 5. Food & Culinary
    if (lower.includes("food") || lower.includes("cook") || lower.includes("chef") || lower.includes("meal") || lower.includes("restaurant") || (hasWord("eat") && !cleanLower.includes("weather") && !cleanLower.includes("breathtaking")) || lower.includes("kitchen") || lower.includes("recipe") || lower.includes("dish") || lower.includes("bak") || lower.includes("ramen") || lower.includes("noodle")) {
      return {
        dramaticTitle: "Culinary Noir", dramaticTagline: "Warm candlelight, rich textures, and intimate tableside atmosphere.",
        dramaticEnvironment: "warm candlelit interiors with rich material textures", dramaticPalette: ["#0a0806", "#e8c76d", "#8b4513", "#faf0e6"],
        dramaticLightModifier: "warm tungsten key light with golden bounce", dramaticCameraModifier: "with intimate shallow-focus rack pulls", dramaticInstrument: "warm jazz piano",
        atmosphericTitle: "Golden Hour Kitchen", atmosphericTagline: "Soft daylight, steam, and the quiet ritual of preparation.",
        atmosphericEnvironment: "sunlit kitchens and morning markets", atmosphericPalette: ["#12151d", "#e8c76d", "#f5a623", "#fef9ef"],
        atmosphericLightModifier: "Soft diffused window daylight with warm steam halos", atmosphericCameraModifier: "microscopic slow pan across ingredients", atmosphericInstrument: "Acoustic guitar fingerpicking",
        kineticTitle: "Flash Service", kineticTagline: "Rapid plating, precise timing, and the adrenaline of service.",
        kineticEnvironment: "the high-pressure energy of a busy kitchen line", kineticPalette: ["#0d0b08", "#ff6b35", "#5fe995", "#ffffff"],
        kineticLightModifier: "moving practical lights and stainless steel reflections", kineticCameraModifier: "Whip pans between stations", kineticInstrument: "rhythmic percussive clicks",
        styleKeywords: "food cinematography, warm tones, macro textures, commercial grade",
      };
    }

    // 6. Cybernetic, Robotics & Sci-Fi Tech (Whole-word matched for short tokens like 'ai')
    if (lower.includes("drone") || lower.includes("cyber") || lower.includes("neon") || lower.includes("robot") || lower.includes("mech") || lower.includes("tokyo") || lower.includes("hack") || lower.includes("software") || lower.includes("algorithm") || hasWord("ai") || hasWord("tech")) {
      return {
        dramaticTitle: "Cyber-Noir", dramaticTagline: "Atmospheric neon, rain-slicked concrete, and contemplative optical flares.",
        dramaticEnvironment: "nocturnal metropolitan canyons", dramaticPalette: ["#090b10", "#00f0ff", "#ff007f", "#1b2838"],
        dramaticLightModifier: "saturated neon rim highlights", dramaticCameraModifier: "with wide anamorphic lens bokeh", dramaticInstrument: "dark ambient synth",
        atmosphericTitle: "Solarpunk Optimism", atmosphericTagline: "Golden hour haze, biophilic engineering, and seamless harmony.",
        atmosphericEnvironment: "terraced vertical arboretums and green infrastructure", atmosphericPalette: ["#14281d", "#5fe995", "#e8c76d", "#f4f8f3"],
        atmosphericLightModifier: "Natural diffused sunlight with volumetric god rays through foliage", atmosphericCameraModifier: "fluid crane ascends", atmosphericInstrument: "Neo-classical strings",
        kineticTitle: "Tactical Surge", kineticTagline: "Raw telemetry overlays, visceral precision, and velocity.",
        kineticEnvironment: "geometric urban corridors and industrial infrastructure", kineticPalette: ["#0b0d0e", "#a0a6b1", "#e8c76d", "#1a1f26"],
        kineticLightModifier: "hard directional top lighting with crisp shadows", kineticCameraModifier: "First-person velocity cuts", kineticInstrument: "industrial percussive pulse",
        styleKeywords: "cyberpunk cinema, neon reflections, anamorphic lens, photorealism",
      };
    }

    // 7. Nature & Forest
    if (lower.includes("nature") || lower.includes("forest") || lower.includes("mountain") || lower.includes("leaf") || lower.includes("eco") || lower.includes("wildlife") || lower.includes("animal") || lower.includes("tree") || lower.includes("plant") || lower.includes("solar") || lower.includes("green") || lower.includes("snow") || lower.includes("leopard") || lower.includes("himalaya")) {
      return {
        dramaticTitle: "Primordial Shadow", dramaticTagline: "Dense canopy, filtered light shafts, and ancient stillness.",
        dramaticEnvironment: "dense ancient forest with filtered light shafts", dramaticPalette: ["#060b06", "#5fe995", "#2d4a2d", "#c4b896"],
        dramaticLightModifier: "dappled forest light with deep green bounce", dramaticCameraModifier: "through undergrowth tracking", dramaticInstrument: "deep cello bowed textures",
        atmosphericTitle: "Verdant Dawn", atmosphericTagline: "Morning mist, dew, and the quiet pulse of living systems.",
        atmosphericEnvironment: "misty meadows at dawn", atmosphericPalette: ["#0a1510", "#4ed4b7", "#98b2ff", "#e8f5e8"],
        atmosphericLightModifier: "Soft golden morning light diffused through mist", atmosphericCameraModifier: "panoramic slow reveal", atmosphericInstrument: "Airy flute and ambient field recordings",
        kineticTitle: "Elemental Force", kineticTagline: "Wind, current, migration, and the relentless pace of nature.",
        kineticEnvironment: "rushing rivers and windswept ridgelines", kineticPalette: ["#08090c", "#5fe995", "#7e94ff", "#ffffff"],
        kineticLightModifier: "harsh direct sunlight with weather drama", kineticCameraModifier: "Aerial sweeps and rapid gimbal pivots", kineticInstrument: "driving taiko percussion",
        styleKeywords: "nature documentary, earth tones, wildlife cinematography, natural light",
      };
    }

    // Luxury & Fashion
    if (lower.includes("luxury") || lower.includes("fashion") || lower.includes("perfume") || lower.includes("jewelry") || lower.includes("watch") || lower.includes("brand") || lower.includes("boutique") || lower.includes("glass") || lower.includes("minimal")) {
      return {
        dramaticTitle: "Couture Noir", dramaticTagline: "Sculpted shadow, lustrous materials, and editorial precision.",
        dramaticEnvironment: "stark editorial studio lighting with deep blacks", dramaticPalette: ["#06080b", "#e8c76d", "#d4af37", "#fafafc"],
        dramaticLightModifier: "hard beauty dish with gold reflector", dramaticCameraModifier: "with smooth dolly across surfaces", dramaticInstrument: "minimal piano with reverb",
        atmosphericTitle: "Ethereal Lookbook", atmosphericTagline: "Soft fabrics, natural light, and intimate quiet luxury.",
        atmosphericEnvironment: "naturally lit marble interiors and soft textiles", atmosphericPalette: ["#12151d", "#d4af37", "#c4b896", "#fef9ef"],
        atmosphericLightModifier: "Soft window light with sheer diffusion", atmosphericCameraModifier: "slow macro glide over textures", atmosphericInstrument: "Airy strings and delicate piano",
        kineticTitle: "Runway Pulse", kineticTagline: "Flash, stride, impact, and the electric energy of presentation.",
        kineticEnvironment: "the kinetic energy of a live runway show", kineticPalette: ["#08090c", "#ff007f", "#d4af37", "#ffffff"],
        kineticLightModifier: "moving spotlights and strobe accents", kineticCameraModifier: "Whip pans between models", kineticInstrument: "electronic bass drops with percussive clicks",
        styleKeywords: "fashion editorial, luxury product, clean composition, commercial photography",
      };
    }

    // Desert & Arid
    if (lower.includes("desert") || lower.includes("sand") || lower.includes("dune") || lower.includes("canyon") || lower.includes("arid")) {
      return {
        dramaticTitle: "Sandstone Noir", dramaticTagline: "Deep canyon shadows, golden sandstone, and ancient geological scale.",
        dramaticEnvironment: "slot canyon shadows with shafts of directional light", dramaticPalette: ["#0a0806", "#e8c76d", "#8b4513", "#fafafc"],
        dramaticLightModifier: "narrow shaft light through canyon walls", dramaticCameraModifier: "through geological formations", dramaticInstrument: "deep oud strings",
        atmosphericTitle: "Golden Expanse", atmosphericTagline: "Infinite horizon, heat shimmer, and vast meditative silence.",
        atmosphericEnvironment: "vast golden dunes at sunrise", atmosphericPalette: ["#12151d", "#e8c76d", "#ff8c42", "#f5f6fa"],
        atmosphericLightModifier: "Warm sunrise sidelight with long shadows", atmosphericCameraModifier: "panoramic slow reveal across dunes", atmosphericInstrument: "Ambient wind and distant chimes",
        kineticTitle: "Dust Storm", kineticTagline: "Sandblast velocity, survival energy, and raw elemental force.",
        kineticEnvironment: "a driving sandstorm across open terrain", kineticPalette: ["#0d0b08", "#ff8c42", "#e8c76d", "#ffffff"],
        kineticLightModifier: "harsh direct sun diffused through particulate", kineticCameraModifier: "Handheld snap tracking", kineticInstrument: "driving percussion with wind textures",
        styleKeywords: "desert cinematography, golden hour, vast landscape, geological textures",
      };
    }

    // Biotech & Medical
    if (lower.includes("bio") || lower.includes("cell") || lower.includes("medical") || lower.includes("gene") || lower.includes("dna") || lower.includes("lab") || lower.includes("science") || lower.includes("research")) {
      return {
        dramaticTitle: "Lab Noir", dramaticTagline: "UV fluorescence, precise instruments, and the tension of discovery.",
        dramaticEnvironment: "clinical lab benches under UV fluorescence", dramaticPalette: ["#06080b", "#00f0ff", "#7e94ff", "#fafafc"],
        dramaticLightModifier: "UV glow with clinical white fill", dramaticCameraModifier: "through microscope optics", dramaticInstrument: "tense ambient pad",
        atmosphericTitle: "Cellular Dawn", atmosphericTagline: "Soft focus, organic forms, and the quiet beauty of living systems.",
        atmosphericEnvironment: "softly lit microscopic organic worlds", atmosphericPalette: ["#12151d", "#4ed4b7", "#98b2ff", "#f5f6fa"],
        atmosphericLightModifier: "Soft transmitted light through biological samples", atmosphericCameraModifier: "microscopic slow zoom into cellular detail", atmosphericInstrument: "Delicate glass marimba",
        kineticTitle: "Rapid Protocol", kineticTagline: "Pipette velocity, centrifuge spin, and the race against time.",
        kineticEnvironment: "rapid laboratory workflows and spinning centrifuges", kineticPalette: ["#08090c", "#5fe995", "#00f0ff", "#ffffff"],
        kineticLightModifier: "clinical overhead lighting with instrument reflections", kineticCameraModifier: "Quick rack focus between instruments", kineticInstrument: "electronic pulse with metallic clicks",
        styleKeywords: "scientific imaging, clinical precision, macro detail, laboratory aesthetic",
      };
    }

    // Urban & City & Delivery & People (wide catch for human-centric and city briefs)
    if (lower.includes("city") || lower.includes("urban") || lower.includes("street") || lower.includes("delivery") || lower.includes("deliver") || lower.includes("courier") || lower.includes("guy") || lower.includes("person") || lower.includes("people") || lower.includes("walk") || lower.includes("commut") || lower.includes("shop") || lower.includes("market")) {
      return {
        dramaticTitle: "Street-Level Noir", dramaticTagline: "Tungsten street lamps, long shadows, and gritty narrative intimacy.",
        dramaticEnvironment: "rain-dampened streets under warm tungsten pools of light", dramaticPalette: ["#06080b", "#e8c76d", "#384152", "#fafafc"],
        dramaticLightModifier: "warm sodium street-lamp with wet reflections", dramaticCameraModifier: "following subjects through narrow corridors", dramaticInstrument: "solo saxophone",
        atmosphericTitle: "Golden Hour District", atmosphericTagline: "Soft sidelight, quiet streets, and the humanity of everyday routines.",
        atmosphericEnvironment: "golden hour neighborhoods and quiet intersections", atmosphericPalette: ["#12151d", "#e8c76d", "#98b2ff", "#f5f6fa"],
        atmosphericLightModifier: "Soft golden hour sidelight filtering between buildings", atmosphericCameraModifier: "slow dolly alongside subjects", atmosphericInstrument: "Warm piano with muted trumpet",
        kineticTitle: "Rush Hour Pulse", kineticTagline: "Speed, crowds, momentum, and the electric rhythm of city life.",
        kineticEnvironment: "busy intersections and high-traffic urban corridors", kineticPalette: ["#08090c", "#5fe995", "#ff6b35", "#ffffff"],
        kineticLightModifier: "mixed practical lights from storefronts and traffic signals", kineticCameraModifier: "Shoulder-mounted rapid tracking through crowds", kineticInstrument: "driving electronic bass with urban percussion",
        styleKeywords: "street photography, urban documentary, practical lighting, human-scale framing",
      };
    }

    // Universal default: adapts to any brief with general cinematic vocabulary
    return {
      dramaticTitle: "Anamorphic Noir", dramaticTagline: "Sculpted chiaroscuro shadows, deep velvet blacks, and focused narrative intensity.",
      dramaticEnvironment: "rich architectural shadow and directional light", dramaticPalette: ["#06080b", "#e8c76d", "#384152", "#fafafc"],
      dramaticLightModifier: "subtle gold bounce", dramaticCameraModifier: "with deep focus falloff", dramaticInstrument: "cello bowed",
      atmosphericTitle: "Ethereal Poetics", atmosphericTagline: "Soft morning mist, pastel gradients, and spacious contemplation.",
      atmosphericEnvironment: "quiet, contemplative natural settings", atmosphericPalette: ["#12151d", "#4ed4b7", "#98b2ff", "#f5f6fa"],
      atmosphericLightModifier: "Soft diffused overcast daylight", atmosphericCameraModifier: "microscopic slow pan", atmosphericInstrument: "Airy piano chords",
      kineticTitle: "Kinetic Surge", kineticTagline: "Electric tempo, graphic camera moves, and bold chromatic punch.",
      kineticEnvironment: "dynamic urban environments and rapid action", kineticPalette: ["#08090c", "#5fe995", "#7e94ff", "#ffffff"],
      kineticLightModifier: "moving practical lights", kineticCameraModifier: "Whip pans and sudden snap zooms", kineticInstrument: "electronic arpeggios",
      styleKeywords: "commercial grade lighting, modern sleek aesthetic, elegant realism",
    };
  }

  /**
   * Dynamically synthesizes bespoke cinematic narration tailored to the genre, brief, and act.
   * Completely eradicates repetitive templates (like 'Across the horizon').
   */
  public generateCinematicVoiceover(
    brief: string,
    territory: CreativeTerritory,
    sceneNumber: number,
    actTitle: string,
    subjectCapitalized: string,
    titleCaseBrief: string
  ): string {
    const p = brief.toLowerCase();
    const lighting = territory.lightingLogic.replace(/\.+$/, "").toLowerCase();
    const visualMeta = territory.visualMetaphor.replace(/\.+$/, "").toLowerCase();

    // 1. Wildlife / Snow Leopard / Himalayan / Mountain Predators
    if (p.includes("leopard") || p.includes("wildlife") || p.includes("predator") || p.includes("animal") || p.includes("feline") || p.includes("himalaya") || p.includes("ridge") || p.includes("mountain") || p.includes("tiger") || p.includes("lion")) {
      switch (sceneNumber) {
        case 1:
          return `Across the frozen Himalayan ridgelines at dawn, ${titleCaseBrief} steps out from the veil of mountain mist.`;
        case 2:
          return `Thick rosetted fur and muscular contours honed by thousands of years at the roof of the world.`;
        case 3:
          return `Silent, sure-footed strides navigating razor-thin alpine ledges with complete sovereign grace.`;
        case 4:
          return `Sub-zero vapor rises in the morning air as ${lighting} illuminates the endless snow peaks.`;
        case 5:
          return `Perched high above the glacial valley, the apex predator commands the wild expanse.`;
        case 6:
          return `${subjectCapitalized} dissolves back into the mountain stone—untamed, patient, and eternal.`;
        case 7:
          return `The high mountains hold their quiet guardian forever.`;
        default:
          return `The solitary sovereign of the high Himalayas.`;
      }
    }

    // 2. Cyberpunk / Urban / Tokyo / Drones / Robotics
    if (p.includes("drone") || p.includes("cyber") || p.includes("tokyo") || p.includes("robot") || p.includes("swarm") || p.includes("ai") || p.includes("tech") || p.includes("neon")) {
      switch (sceneNumber) {
        case 1:
          return `Deep in the rain-slicked vertical corridors of the metropolis, ${subjectCapitalized} breaks into synchronized flight.`;
        case 2:
          return `Rotors calibrate, latent sensors pulse, and every carbon-fiber seam reveals high-tolerance autonomous craft.`;
        case 3:
          return `Velocity accelerates — weaving through the glass towers with razor-sharp computational reflexes.`;
        case 4:
          return `Beneath the flight path, neon billboards bleed into mist, casting an electric pulse across the urban canyon.`;
        case 5:
          return `At the apex of the route, the entire network locks formation into flawless, single-entity choreography.`;
        case 6:
          return `${subjectCapitalized} holds the metropolitan airspace — silent, sovereign, and permanently reshaping the skyline.`;
        case 7:
          return `Into the night, the signal continues across the digital metropolis.`;
        default:
          return `${subjectCapitalized} coordinates with absolute precision through the atmosphere.`;
      }
    }

    // 3. Automotive / Racing / F1 / Supercars / Motorsport (Strict matching)
    if (/\b(f1|formula|supercar|racecar|motorsport|nascar|hypercar|porsche|ferrari|mclaren|lamborghini)\b/i.test(p) || (/\b(car|vehicle|automobile)\b/i.test(p) && !p.includes("carbon") && !p.includes("scarlet"))) {
      switch (sceneNumber) {
        case 1:
          return `Cold tires, hot tarmac, and the focused breath before the green flag: ${titleCaseBrief}.`;
        case 2:
          return `Aerodynamic aero channels sculpted by the wind tunnel, where millimeters dictate victory.`;
        case 3:
          return `Full throttle down the straightaway — suspension loading as lateral forces push the limits of grip.`;
        case 4:
          return `Heat shimmer wavers off the curbing under ${lighting}, capturing raw kinetic momentum.`;
        case 5:
          return `Clipping the late apex at peak velocity, mechanical precision meets human nerve.`;
        case 6:
          return `${subjectCapitalized} crosses the line, leaving only heat, tire rubber, and pure adrenaline.`;
        case 7:
          return `The roar subsides, but the record stands unchallenged.`;
        default:
          return `The pursuit of speed distilled into a single machine.`;
      }
    }

    // 4. Oceanic / Deep Sea / Marine / Water
    if (p.includes("ocean") || p.includes("sea") || p.includes("water") || p.includes("marine") || p.includes("jellyfish") || p.includes("deep") || p.includes("abyss") || p.includes("submersible")) {
      switch (sceneNumber) {
        case 1:
          return `Beneath the ocean crests where daylight dissolves into deep sapphire, ${titleCaseBrief} descends into the blue.`;
        case 2:
          return `Bioluminescent pulses flicker against the abyss, highlighting delicate organic textures formed over millennia.`;
        case 3:
          return `Drifting through underwater thermoclines with weightless, hypnotic equilibrium.`;
        case 4:
          return `A quiet sanctuary of crushing pressure and ancient currents, illuminated by ${lighting}.`;
        case 5:
          return `From the midnight depths emerges a sight of breathtaking scale and silent majesty.`;
        case 6:
          return `${subjectCapitalized} glides onward through the pelagic expanse, master of the unexplored wild.`;
        case 7:
          return `The deep retains its quiet power, boundless and eternal.`;
        default:
          return `A silent communion between light and infinite water.`;
      }
    }

    // 4. Space / Cosmic / Galaxies / Astronaut / Orbit / Telescope
    if (p.includes("space") || p.includes("mars") || p.includes("galaxy") || p.includes("star") || p.includes("orbit") || p.includes("planet") || p.includes("astronomy") || p.includes("apollo") || p.includes("jwst")) {
      switch (sceneNumber) {
        case 1:
          return `In the silent vacuum beyond Earth's thin atmosphere, ${titleCaseBrief} catches the unfiltered glare of the cosmos.`;
        case 2:
          return `Thermal insulation, optical mirrors, and crystalline surfaces engineered to endure the harsh freeze of deep space.`;
        case 3:
          return `Orbital mechanics in motion — gliding along calculated trajectories without a breath of resistance.`;
        case 4:
          return `Stars pierce the velvet darkness like diamond points under ${lighting}.`;
        case 5:
          return `The full breadth of the cosmic field unfolds, revealing galaxies billions of light years distant.`;
        case 6:
          return `${subjectCapitalized} journeys onward, a beacon of human exploration sailing into the infinite.`;
        case 7:
          return `Out among the stars, the journey has only just begun.`;
        default:
          return `Exploring the outer boundaries of human reach.`;
      }
    }

    // 5. Biotech / Medical / Genetics / Science
    if (p.includes("bio") || p.includes("cell") || p.includes("medical") || p.includes("gene") || p.includes("dna") || p.includes("microscope") || p.includes("lab")) {
      switch (sceneNumber) {
        case 1:
          return `At the microscopic frontier where synthetic design meets living code, ${titleCaseBrief} reveals its origin.`;
        case 2:
          return `At nanometer resolution, molecular scaffolding and receptor bonds assemble with mathematical order.`;
        case 3:
          return `Catalytic reactions propagate across cellular boundaries in real time.`;
        case 4:
          return `Bathed in ${lighting}, the clean architecture of discovery comes into sharp scientific focus.`;
        case 5:
          return `The biochemical pathway crystallizes, proving a breakthrough that redefines our understanding.`;
        case 6:
          return `${subjectCapitalized} — synthesized, verified, and opening a new frontier in human capability.`;
        case 7:
          return `The code of life continues to evolve.`;
        default:
          return `Precision science at the threshold of life.`;
      }
    }

    // 6. Nature / Wildlife / Forest / Mountains
    if (p.includes("nature") || p.includes("forest") || p.includes("mountain") || p.includes("wild") || p.includes("tree") || p.includes("river") || p.includes("animal")) {
      switch (sceneNumber) {
        case 1:
          return `Where ancient terrain meets the morning light, ${titleCaseBrief} stirs into presence.`;
        case 2:
          return `Weathered stone, moss-covered timber, and textures refined by centuries of natural elements.`;
        case 3:
          return `Pure instinct in motion — traversing rugged ridges with effortless grace.`;
        case 4:
          return `The air settles with quiet gravity as ${lighting} paints the mountain slopes.`;
        case 5:
          return `Standing atop the high peak, the full scale of the wild wilderness commands the frame.`;
        case 6:
          return `${subjectCapitalized} remains sovereign — untamed, patient, and eternal.`;
        case 7:
          return `The wild endures long after the dust settles.`;
        default:
          return `The raw power and beauty of the natural world.`;
      }
    }

    // 7. Luxury / Architecture / Minimal / Fashion
    if (p.includes("luxury") || p.includes("fashion") || p.includes("glass") || p.includes("minimal") || p.includes("design") || p.includes("perfume") || p.includes("jewel") || p.includes("interior")) {
      switch (sceneNumber) {
        case 1:
          return `Stripped of noise and distilled to essential form: the entrance of ${titleCaseBrief}.`;
        case 2:
          return `Hand-burnished finishes and seamless joinery that invite tactile reverence.`;
        case 3:
          return `Fluid geometry and graceful angles responding to every subtle shift in perspective.`;
        case 4:
          return `Shadows fall with deliberate softness, guided by ${lighting}.`;
        case 5:
          return `An uncompromising vision realized in physical space, striking in its restrained elegance.`;
        case 6:
          return `${subjectCapitalized} — timeless, deliberate, and undeniably iconic.`;
        case 7:
          return `True distinction whispers, and it never fades.`;
        default:
          return `Form, balance, and quiet refinement.`;
      }
    }

    // 8. General Narrative (Dynamic bespoke fallback)
    switch (sceneNumber) {
      case 1:
        return `${subjectCapitalized} steps into focus, set against ${visualMeta} under ${lighting}.`;
      case 2:
        return `Every contour and texture of ${titleCaseBrief} reveals deliberate, high-fidelity craft.`;
      case 3:
        return `Kinetic momentum builds as ${subjectCapitalized} drives forward through the composition.`;
      case 4:
        return `Atmosphere and environmental depth converge, framing ${titleCaseBrief} with cinematic weight.`;
      case 5:
        return `In a decisive hero tableau, the full magnitude of ${titleCaseBrief} commands the screen.`;
      case 6:
        return `${subjectCapitalized} — locked, composed, and finalized with auteur clarity.`;
      case 7:
        return `Beyond the final frame, the resonance of ${titleCaseBrief} endures.`;
      default:
        return `${subjectCapitalized} unfolds with cinematic purpose and measured pace.`;
    }
  }

  /**
   * Generates a single concise, broadcast-tier master voiceover for the entire production sequence (~20-30 words).
   * Plays continuously across act transitions for a clean, unified cinematic experience.
   */
  public generateMasterVoiceover(brief: string, territory: CreativeTerritory): string {
    const p = brief.toLowerCase();
    const cleanBrief = brief
      .replace(/^(a|an|the|https?:\/\/|www\.)\s*/i, "")
      .replace(/\/.*$/, "")
      .trim();
    const titleCaseBrief = cleanBrief.length > 40 ? cleanBrief.slice(0, 37) + "..." : cleanBrief;
    const briefWords = cleanBrief.split(/\s+/);
    const subjectCore = briefWords.slice(0, Math.min(3, briefWords.length)).join(" ");
    const subjectCapitalized = subjectCore.charAt(0).toUpperCase() + subjectCore.slice(1);

    // 1. Wildlife / Snow Leopard / Himalayan / Big Cats / Mountain Predators
    if (p.includes("leopard") || p.includes("wildlife") || p.includes("predator") || p.includes("animal") || p.includes("feline") || p.includes("himalaya") || p.includes("ridge") || p.includes("mountain") || p.includes("tiger") || p.includes("lion")) {
      return `Across the frozen Himalayan ridgelines at dawn, ${subjectCapitalized} navigates the heights with sovereign grace. Pure instinct traversing the mountain solitude—untamed, patient, and eternal.`;
    }

    // 2. Cyber / Drones / Tech / Robotics / AI
    if (p.includes("drone") || p.includes("cyber") || p.includes("tokyo") || p.includes("robot") || p.includes("swarm") || p.includes("ai") || p.includes("tech") || p.includes("neon")) {
      return `Beneath the electric pulse of the metropolis, ${subjectCapitalized} awakens. Computational reflexes accelerate through the shadows, carving an autonomous future into the night sky.`;
    }

    // 3. Automotive / Racing / Motorsport / Supercars (Strict matching)
    if (/\b(f1|formula|supercar|racecar|motorsport|nascar|hypercar|porsche|ferrari|mclaren|lamborghini)\b/i.test(p) || (/\b(car|vehicle|automobile)\b/i.test(p) && !p.includes("carbon") && !p.includes("scarlet"))) {
      return `At the razor's edge of velocity, machine and instinct become one. Every apex carved with precision, accelerating past the threshold of pure speed.`;
    }

    // 3. Ocean / Marine / Water / Abyss
    if (p.includes("ocean") || p.includes("sea") || p.includes("water") || p.includes("marine") || p.includes("jellyfish") || p.includes("dive") || p.includes("abyss")) {
      return `Descending into the deep where sunlight dissolves, an ancient realm awakens. Suspended in living blue, ${titleCaseBrief} commands the silent depths.`;
    }

    // 4. Space / Cosmic / Orbit / Galaxy / Mars
    if (p.includes("space") || p.includes("star") || p.includes("galaxy") || p.includes("mars") || p.includes("orbit") || p.includes("planet") || p.includes("astro")) {
      return `Suspended in the quiet expanse of the cosmos, light curves across the orbital horizon. Silence, scale, and the endless reach of human ambition.`;
    }

    // 5. Nature / Wildlife / Mountains
    if (p.includes("nature") || p.includes("forest") || p.includes("mountain") || p.includes("wild") || p.includes("tree") || p.includes("river") || p.includes("animal") || p.includes("leopard")) {
      return `Where ancient peaks meet morning light, ${subjectCapitalized} stirs into presence. Pure instinct traversing the wilderness—untamed, patient, and eternal.`;
    }

    // 6. Food / Culinary
    if (p.includes("food") || p.includes("cook") || p.includes("chef") || p.includes("meal") || p.includes("restaurant") || p.includes("kitchen") || p.includes("dish") || p.includes("ramen")) {
      return `Where heat meets deliberate craft, culinary art finds its voice. Textures, aromas, and precision coming together in a singular moment of creation.`;
    }

    // 7. Luxury / Architecture / Minimal / Fashion
    if (p.includes("luxury") || p.includes("fashion") || p.includes("glass") || p.includes("minimal") || p.includes("design") || p.includes("interior")) {
      return `Stripped of noise and distilled to essential form: ${titleCaseBrief}. Fluid geometry and tactile surfaces, striking in their restrained, timeless elegance.`;
    }

    // Bespoke adaptive fallback
    return `Where deliberate craft converges with cinematic vision, ${subjectCapitalized} steps into focus. Unfolding with auteur precision—bold, iconic, and eternal.`;
  }

  /**
   * Decomposes a chosen Creative Territory and Brief into an episodic storyboard
   * complete with framing, camera motion, resolved visuals, and unified master voiceover.
   * Uses clean, rhythmic act durations (3.6s each) for seamless scene-to-scene transitions.
   */
  public decomposeStoryboard(brief: string, territory: CreativeTerritory, targetActCount: number = 5): Shot[] {
    const cleanBrief = brief
      .replace(/^(a|an|the|https?:\/\/|www\.)\s*/i, "")
      .replace(/\/.*$/, "")
      .trim();
    const titleCaseBrief = cleanBrief.length > 40 ? cleanBrief.slice(0, 37) + "..." : cleanBrief;

    // Extract semantic subject and context from the brief for narrative framing
    const briefWords = cleanBrief.split(/\s+/);
    const subjectCore = briefWords.slice(0, Math.min(3, briefWords.length)).join(" ");
    const subjectCapitalized = subjectCore.charAt(0).toUpperCase() + subjectCore.slice(1);

    // Derive master voiceover for the entire production sequence
    const masterVoiceover = this.generateMasterVoiceover(brief, territory);
    territory.masterVoiceoverScript = masterVoiceover;

    // Derive camera language variants from territory
    const cameraVariants = territory.cameraLanguage.split(/\s+and\s+/i);
    const primaryCamera = cameraVariants[0] || "Slow forward tracking";
    const secondaryCamera = cameraVariants[1] || "Smooth lateral dolly";

    // Build brief-specific acts with dynamically synthesized narrative voiceover
    const baseActs = [
      {
        sceneNumber: 1,
        title: `${subjectCapitalized} · Opening`,
        framing: `Wide Establishing · ${subjectCapitalized}`,
        action: `Establishing the world and atmosphere around ${titleCaseBrief}.`,
        cameraMotion: primaryCamera,
        prompt: `Cinematic wide establishing shot of ${brief}, ${territory.visualMetaphor}, ${territory.stylePromptModifier}`,
        voiceoverScript: this.generateCinematicVoiceover(brief, territory, 1, `${subjectCapitalized} · Opening`, subjectCapitalized, titleCaseBrief),
      },
      {
        sceneNumber: 2,
        title: `${subjectCapitalized} · Close Detail`,
        framing: `Intimate Detail · ${subjectCapitalized}`,
        action: `Close-up exploration of the textures and details that define ${titleCaseBrief}.`,
        cameraMotion: "Microscopic forward drift with shallow depth of field",
        prompt: `Macro cinematic detail shot of ${brief}, exquisite surface texture, photorealistic lighting, 8k resolution`,
        voiceoverScript: this.generateCinematicVoiceover(brief, territory, 2, `${subjectCapitalized} · Close Detail`, subjectCapitalized, titleCaseBrief),
      },
      {
        sceneNumber: 3,
        title: `${subjectCapitalized} · In Motion`,
        framing: `Tracking Movement · ${subjectCapitalized}`,
        action: `Dynamic tracking of ${titleCaseBrief} in action, capturing kinetic energy.`,
        cameraMotion: "Fast forward tracking dolly with parallax depth",
        prompt: `Dynamic medium tracking shot of ${brief}, rich detail, cinematic texture, high shutter speed`,
        voiceoverScript: this.generateCinematicVoiceover(brief, territory, 3, `${subjectCapitalized} · In Motion`, subjectCapitalized, titleCaseBrief),
      },
      {
        sceneNumber: 4,
        title: `${subjectCapitalized} · Atmosphere`,
        framing: `Environmental Context · ${subjectCapitalized}`,
        action: `The surrounding environment and atmosphere framing ${titleCaseBrief}.`,
        cameraMotion: secondaryCamera || "Smooth orbiting arc with atmospheric flare",
        prompt: `Atmospheric environmental perspective of ${brief}, volumetric light, high-contrast rim highlights`,
        voiceoverScript: this.generateCinematicVoiceover(brief, territory, 4, `${subjectCapitalized} · Atmosphere`, subjectCapitalized, titleCaseBrief),
      },
      {
        sceneNumber: 5,
        title: `${subjectCapitalized} · Climax`,
        framing: `Hero Reveal · ${subjectCapitalized}`,
        action: `The climactic hero reveal and iconic final composition for ${titleCaseBrief}.`,
        cameraMotion: "Ascending crane arc rising into dramatic perspective",
        prompt: `Monumental climactic hero reveal of ${brief}, majestic resolution, volumetric lighting, epic scale, iconic finish`,
        voiceoverScript: this.generateCinematicVoiceover(brief, territory, 5, `${subjectCapitalized} · Climax`, subjectCapitalized, titleCaseBrief),
      },
    ];

    const acts = baseActs.slice(0, targetActCount);

    return acts.map((act) => {
      const visualUrl = resolveCinematicAsset(brief + " " + act.framing, act.sceneNumber);
      return {
        id: `shot-${Date.now()}-${act.sceneNumber}`,
        sceneNumber: act.sceneNumber,
        title: act.title,
        framing: act.framing,
        action: act.action,
        cameraMotion: act.cameraMotion,
        prompt: act.prompt,
        voiceoverScript: act.voiceoverScript,
        masterVoiceoverScript: masterVoiceover,
        durationSec: 3.6,
        videoUrl: visualUrl,
        posterUrl: visualUrl,
        status: "completed" as const,
        revisionCount: 0,
      };
    });
  }

  /**
   * Refines a specific shot based on conversational critique, recording the feedback into Aesthetic Memory.
   */
  public refineShot(
    targetShot: Shot,
    critique: string,
    existingMemory: AestheticMemoryItem[]
  ): { updatedShot: Shot; newMemoryItem: AestheticMemoryItem } {
    const newMemoryItem: AestheticMemoryItem = {
      id: `mem-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      rule: critique,
      sourceFeedback: critique,
      appliedToShots: [targetShot.sceneNumber],
    };

    const updatedShot: Shot = {
      ...targetShot,
      status: "refining",
      prompt: `${targetShot.prompt}. User Directive: ${critique}`,
      critiqueNotes: critique,
      revisionCount: (targetShot.revisionCount || 0) + 1,
    };

    return { updatedShot, newMemoryItem };
  }

  /**
   * Generates a pre-baked master production so the studio has a fully working,
   * playable cinematic experience with voiceover, audio, and visuals from second zero.
   * Estimates act durations from voiceover word count (~2.5 words/sec narration pace).
   */
  public getInitialProduction(brief: string) {
    const { territories } = this.generateTerritories(brief);
    const territory = territories[0];
    const initialShots = this.decomposeStoryboard(brief, territory);

    // Estimate total voiceover duration from word count (~2.5 words/sec broadcast pace)
    const voText = territory.masterVoiceoverScript || "";
    const wordCount = voText.split(/\s+/).filter(Boolean).length;
    const estimatedVoDuration = Math.max(wordCount / 2.5, 8);
    const perActDuration = +(estimatedVoDuration / Math.max(initialShots.length, 1)).toFixed(2);

    const completedShots: Shot[] = initialShots.map((s, idx) => {
      const assetUrl = resolveCinematicAsset(s.prompt, s.sceneNumber);
      return {
        ...s,
        durationSec: perActDuration,
        videoUrl: assetUrl,
        posterUrl: assetUrl,
        status: "completed",
      };
    });

    return {
      territories,
      selectedTerritory: territory,
      shots: completedShots,
    };
  }
}

export const directorAgent = new DirectorAgent();
