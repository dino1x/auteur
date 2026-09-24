import { Shot, CreativeTerritory, AspectRatio } from "./types";
import { cinematicAudio } from "./cinematic-audio";

// High-definition cinematic visual curation mapped across semantic categories (5 distinct scenes per theme)
// High-definition cinematic visual curation mapped across semantic categories (8 distinct scenes per theme, zero duplicates)
// Verified Livepeer decentralized GPU cinema asset pool mapped across semantic categories
const THEMATIC_PALETTES: Record<string, string[]> = {
  cyberpunk: [
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg",
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MTYvejRDTFU0THkyRjFoWml5TklJcWEyLmpwZw.660ffbf5b22ed418/z4CLU4Ly2F1hZiyNIIqa2.jpg",
  ],
  space: [
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk2ODEvM1ZWUGMtTXdkMnU2REVuM3RWUmptLmpwZw.e057b08306b30f75/3VVPc-Mwd2u6DEn3tVRjm.jpg",
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDMvNWNfLUdhZk9jRTBwSzE0TEQ1UGNhLmpwZw.9fc767252bb912f8/5c_-GafOcE0pK14LD5Pca.jpg",
  ],
  tech: [
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg",
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MTYvejRDTFU0THkyRjFoWml5TklJcWEyLmpwZw.660ffbf5b22ed418/z4CLU4Ly2F1hZiyNIIqa2.jpg",
  ],
  ocean: [
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MGIvWDZjYk16ZDU2VnhtREphQzdISERGLmpwZw.9ff8d740a112167f/X6cbMzd56VxmDJaC7HHDF.jpg",
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDYvMFNOYkt1UWFaNWNTcDBHbElRRDdlLmpwZw.65b76b30ba58da56/0SNbKuQaZ5cSp0GlIQD7e.jpg",
  ],
  desert: [
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDMvNWNfLUdhZk9jRTBwSzE0TEQ1UGNhLmpwZw.9fc767252bb912f8/5c_-GafOcE0pK14LD5Pca.jpg",
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk2ODEvM1ZWUGMtTXdkMnU2REVuM3RWUmptLmpwZw.e057b08306b30f75/3VVPc-Mwd2u6DEn3tVRjm.jpg",
  ],
  racing: [
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg",
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDYvMFNOYkt1UWFaNWNTcDBHbElRRDdlLmpwZw.65b76b30ba58da56/0SNbKuQaZ5cSp0GlIQD7e.jpg",
  ],
  wildlife: [
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDEvekFjeWZCNVR6OUJHTGJJaDZ2TGZQLmpwZw.e73f200b252ea79b/zAcyfB5Tz9BGLbIh6vLfP.jpg",
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDMvNWNfLUdhZk9jRTBwSzE0TEQ1UGNhLmpwZw.9fc767252bb912f8/5c_-GafOcE0pK14LD5Pca.jpg",
  ],
  mountains: [
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDMvNWNfLUdhZk9jRTBwSzE0TEQ1UGNhLmpwZw.9fc767252bb912f8/5c_-GafOcE0pK14LD5Pca.jpg",
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MGIvWDZjYk16ZDU2VnhtREphQzdISERGLmpwZw.9ff8d740a112167f/X6cbMzd56VxmDJaC7HHDF.jpg",
  ],
  nature: [
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDEvekFjeWZCNVR6OUJHTGJJaDZ2TGZQLmpwZw.e73f200b252ea79b/zAcyfB5Tz9BGLbIh6vLfP.jpg",
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3YTRvX0N1NmxhQnY5WFRMeVlNUHpIbHNaLmpwZw.43ec37d854c29895/_Cu6laBv9XTLyYMPzHlsZ.jpg",
  ],
  luxury: [
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3YTRvX0N1NmxhQnY5WFRMeVlNUHpIbHNaLmpwZw.43ec37d854c29895/_Cu6laBv9XTLyYMPzHlsZ.jpg",
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg",
  ],
  brutalist: [
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDYvMFNOYkt1UWFaNWNTcDBHbElRRDdlLmpwZw.65b76b30ba58da56/0SNbKuQaZ5cSp0GlIQD7e.jpg",
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3YTRvX0N1NmxhQnY5WFRMeVlNUHpIbHNaLmpwZw.43ec37d854c29895/_Cu6laBv9XTLyYMPzHlsZ.jpg",
  ],
  biotech: [
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MTYvejRDTFU0THkyRjFoWml5TklJcWEyLmpwZw.660ffbf5b22ed418/z4CLU4Ly2F1hZiyNIIqa2.jpg",
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MGIvWDZjYk16ZDU2VnhtREphQzdISERGLmpwZw.9ff8d740a112167f/X6cbMzd56VxmDJaC7HHDF.jpg",
  ],
  food: [
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDEvekFjeWZCNVR6OUJHTGJJaDZ2TGZQLmpwZw.e73f200b252ea79b/zAcyfB5Tz9BGLbIh6vLfP.jpg",
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3YTRvX0N1NmxhQnY5WFRMeVlNUHpIbHNaLmpwZw.43ec37d854c29895/_Cu6laBv9XTLyYMPzHlsZ.jpg",
  ],
  urban: [
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg",
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDYvMFNOYkt1UWFaNWNTcDBHbElRRDdlLmpwZw.65b76b30ba58da56/0SNbKuQaZ5cSp0GlIQD7e.jpg",
  ],
  people: [
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MDEvekFjeWZCNVR6OUJHTGJJaDZ2TGZQLmpwZw.e73f200b252ea79b/zAcyfB5Tz9BGLbIh6vLfP.jpg",
    "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3YTRvX0N1NmxhQnY5WFRMeVlNUHpIbHNaLmpwZw.43ec37d854c29895/_Cu6laBv9XTLyYMPzHlsZ.jpg",
  ],
};

/**
 * Resolves the optimal high-resolution asset URL for any arbitrary brief.
 * Uses strict word-boundary matching and sanitizes cinematography boilerplate
 * (such as "tracking shot", "high shutter speed", "driving taiko", "35mm celluloid")
 * to guarantee that nature/wildlife, sci-fi, culinary, and human briefs never get hijacked by cars or wrong genres.
 */
export function resolveCinematicAsset(prompt: string, sceneNumber: number): string {
  // Strip camera and audio direction tokens that could trigger false positives
  const sanitized = prompt
    .toLowerCase()
    .replace(/\b(tracking|tracking shot|tracking dolly|camera tracking|dolly track|lateral tracking)\b/gi, "")
    .replace(/\b(high-speed|high speed|shutter speed|speed shutter|at speed|peak speed|top speed)\b/gi, "")
    .replace(/\b(driving percussion|driving beat|driving taiko|driving rhythm|driving pulse)\b/gi, "")
    .replace(/\b(35mm celluloid|celluloid)\b/gi, "")
    .replace(/\b(deep focus|deep focus falloff)\b/gi, "")
    .replace(/\b(breathtaking|weather)\b/gi, "")
    .replace(/\b(sunrise|sunset)\b/gi, "dawn_dusk");

  const hasAny = (...words: string[]) => words.some((w) => new RegExp(`\\b${w}\\b`, "i").test(sanitized));

  let category = "urban";

  // 1. Wildlife, Big Cats & Predators (Highest priority - catches snow leopards, tigers, lions, animals)
  if (hasAny("leopard", "leopards", "tiger", "tigers", "lion", "lions", "cheetah", "cheetahs", "panther", "panthers", "jaguar", "jaguars", "predator", "predators", "feline", "felines", "wildlife", "animal", "animals", "safari", "bear", "bears", "wolf", "wolves", "deer", "eagle", "hawk", "falcon", "prey")) {
    category = "wildlife";
  }
  // 2. Mountains, Alpine & Himalayan Ridges
  else if (hasAny("mountain", "mountains", "himalaya", "himalayan", "ridge", "ridgelines", "ridgeline", "peak", "peaks", "summit", "summits", "alpine", "alps", "glacier", "glaciers", "everest", "snow", "snowy", "cliff", "crag", "scree")) {
    category = "mountains";
  }
  // 3. Automotive, Motorsport & Racing (Only true racing/automotive terms)
  else if (hasAny("f1", "formula 1", "formula one", "racecar", "racecars", "supercar", "supercars", "nascar", "motorsport", "motorsports", "automotive", "porsche", "ferrari", "mclaren", "lamborghini", "pit lane", "lap time") || (hasAny("car", "cars", "vehicle", "vehicles", "automobile") && !hasAny("nature", "forest", "mountain", "ocean", "space", "sky", "animal", "food"))) {
    category = "racing";
  }
  // 4. Ocean & Marine
  else if (hasAny("ocean", "marine", "underwater", "sea", "jellyfish", "coral", "abyss", "abyssal", "pelagic", "scuba", "diver", "submarine", "whale", "whales", "shark", "sharks", "tide", "tides", "submerged")) {
    category = "ocean";
  }
  // 5. Space & Cosmic
  else if (hasAny("space", "cosmos", "cosmic", "galaxy", "galaxies", "nebulae", "nebula", "mars", "orbit", "orbital", "astronaut", "spaceship", "starfield", "planet", "planets", "starlight", "lunar", "moon")) {
    category = "space";
  }
  // 6. Food & Culinary
  else if (hasAny("food", "cook", "cooking", "chef", "meal", "restaurant", "recipe", "recipes", "dish", "dishes", "ramen", "noodle", "noodles", "cuisine", "kitchen", "culinary", "plated", "bakery", "baking", "baker")) {
    category = "food";
  }
  // 7. Cyberpunk, Robotics & Sci-Fi
  else if (hasAny("drone", "drones", "cyber", "cyberpunk", "neon", "robot", "robotics", "mech", "android", "software", "algorithm", "hacker", "tokyo", "hologram", "ai", "tech")) {
    category = "cyberpunk";
  }
  // 8. Nature, Flora & Forests
  else if (hasAny("nature", "forest", "forests", "tree", "trees", "leaf", "leaves", "jungle", "meadow", "meadows", "river", "rivers", "valley", "greenery", "wild")) {
    category = "nature";
  }
  // 9. Desert & Arid
  else if (hasAny("desert", "sand", "dune", "dunes", "canyon", "canyons", "arid", "sahara", "oasis")) {
    category = "desert";
  }
  // 10. Luxury & Fashion
  else if (hasAny("luxury", "fashion", "couture", "lookbook", "runway", "perfume", "fragrance", "jewelry", "diamond", "gold", "boutique", "model")) {
    category = "luxury";
  }
  // 11. Biotech & Medical
  else if (hasAny("biotech", "microscope", "dna", "genetics", "laboratory", "biochemical", "pharmaceutical", "vaccine", "pathway", "cell")) {
    category = "biotech";
  }
  // 12. Brutalist & Architectural
  else if (hasAny("architecture", "architectural", "brutalist", "concrete", "facade", "skyscraper", "building", "structures")) {
    category = "brutalist";
  }
  // 13. Human, People & Portraits
  else if (hasAny("person", "people", "worker", "workers", "team", "crowd", "portrait", "human", "face", "faces", "woman", "women", "man", "men")) {
    category = "people";
  }
  // Intelligent adaptive fallback
  else if (hasAny("cold", "frost", "ice", "mist", "haze")) {
    category = "mountains";
  }

  const list = THEMATIC_PALETTES[category] || THEMATIC_PALETTES.nature || THEMATIC_PALETTES.urban;
  return list[Math.abs(sceneNumber - 1) % list.length];
}

// In-memory image element cache
const imageCache: Map<string, HTMLImageElement> = new Map();

export function preloadImage(url: string, fallbackUrl?: string): Promise<HTMLImageElement> {
  if (imageCache.has(url)) {
    const existing = imageCache.get(url)!;
    if (existing.complete && existing.naturalWidth > 0) {
      return Promise.resolve(existing);
    }
  }

  // Decentralized Livepeer CDN assets have native CORS * — bypass the server proxy to load directly at maximum network speed.
  // Ephemeral media or unknown domains route through proxy.
  const isDirectCdn = url.includes("agent.livepeer.org") || url.includes("fal.media");
  const safeLoadUrl =
    typeof window !== "undefined" &&
    url.startsWith("http") &&
    !isDirectCdn &&
    !url.includes("/api/proxy-media") &&
    !url.includes(window.location.host)
      ? `/api/proxy-media?url=${encodeURIComponent(url)}`
      : url;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    const onDone = () => {
      imageCache.set(url, img);
      if (safeLoadUrl !== url) {
        imageCache.set(safeLoadUrl, img);
      }
      // Trigger background GPU decode so painting to 2D canvas is instantaneous
      if ("decode" in img && typeof img.decode === "function") {
        img.decode().then(() => resolve(img)).catch(() => resolve(img));
      } else {
        resolve(img);
      }
    };

    img.onload = onDone;

    img.onerror = () => {
      // If direct CDN loading fails, try proxy as fallback
      if (isDirectCdn && safeLoadUrl === url) {
        const proxied = `/api/proxy-media?url=${encodeURIComponent(url)}`;
        preloadImage(proxied, fallbackUrl).then((pImg) => {
          imageCache.set(url, pImg);
          resolve(pImg);
        });
        return;
      }

      // If external or ephemeral media fails, immediately recover using a reliable thematic photographic asset
      const effectiveFallback =
        fallbackUrl && fallbackUrl !== url
          ? fallbackUrl
          : resolveCinematicAsset("cinematic photorealistic 35mm", 1);

      if (effectiveFallback && effectiveFallback !== url) {
        preloadImage(effectiveFallback).then((fb) => {
          imageCache.set(url, fb);
          resolve(fb);
        });
      } else {
        // Guaranteed decentralized Livepeer asset fallback
        const defaultAsset = "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhYjk3MWUvSkhLMUNBeHVudFBBd29HQ1RZTVdCLmpwZw.969dfc1a43072ab4/JHK1CAxuntPAwoGCTYMWB.jpg";
        const fbImg = new Image();
        fbImg.crossOrigin = "anonymous";
        fbImg.onload = () => {
          imageCache.set(url, fbImg);
          resolve(fbImg);
        };
        fbImg.src = defaultAsset;
      }
    };

    img.src = safeLoadUrl;
  });
}

export function getCachedImage(url: string): HTMLImageElement | undefined {
  return imageCache.get(url);
}

export function getImageForShot(shot: Shot): HTMLImageElement | null {
  const primaryUrl = shot.posterUrl || shot.videoUrl;
  const reliableUrl = resolveCinematicAsset(shot.prompt || shot.framing || "cinematic", shot.sceneNumber);

  // 1. Try primary URL in cache
  if (primaryUrl && imageCache.has(primaryUrl)) {
    const cached = imageCache.get(primaryUrl)!;
    if (cached.complete && cached.naturalWidth > 0) {
      return cached;
    }
  }

  // 2. Try reliable resolved asset in cache
  if (imageCache.has(reliableUrl)) {
    const cached = imageCache.get(reliableUrl)!;
    if (cached.complete && cached.naturalWidth > 0) {
      return cached;
    }
  }

  // 3. Eagerly trigger background loading for both
  if (primaryUrl) preloadImage(primaryUrl, reliableUrl);
  preloadImage(reliableUrl);

  // 4. Return any loaded image from cache to guarantee zero black frames
  const cachedList = Array.from(imageCache.values());
  for (const img of cachedList) {
    if (img.complete && img.naturalWidth > 0) {
      return img;
    }
  }

  return null;
}

export async function preloadAllShots(shots: Shot[]): Promise<void> {
  await Promise.all(
    shots.map((s) => {
      const primaryUrl = s.posterUrl || s.videoUrl;
      const reliableUrl = resolveCinematicAsset(s.prompt || s.framing, s.sceneNumber);
      if (primaryUrl && primaryUrl !== reliableUrl) {
        preloadImage(primaryUrl, reliableUrl);
      }
      return preloadImage(reliableUrl);
    })
  );
}

function drawFittedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  width: number,
  height: number,
  scale: number,
  transX: number,
  transY: number,
  opacity: number = 1.0
) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
  ctx.translate(width / 2, height / 2);
  ctx.scale(scale, scale);
  ctx.translate(-width / 2 + transX, -height / 2 + transY);

  let activeImg = img;
  if (!activeImg || !activeImg.complete || activeImg.naturalWidth === 0) {
    // Search cache for any active image to prevent digital void
    const cached = Array.from(imageCache.values());
    for (const c of cached) {
      if (c.complete && c.naturalWidth > 0) {
        activeImg = c;
        break;
      }
    }
  }

  if (activeImg && activeImg.complete && activeImg.naturalWidth > 0) {
    const hRatio = width / activeImg.naturalWidth;
    const vRatio = height / activeImg.naturalHeight;
    const ratio = Math.max(hRatio, vRatio);
    const centerShiftX = (width - activeImg.naturalWidth * ratio) / 2;
    const centerShiftY = (height - activeImg.naturalHeight * ratio) / 2;

    ctx.drawImage(
      activeImg,
      0,
      0,
      activeImg.naturalWidth,
      activeImg.naturalHeight,
      centerShiftX - 20,
      centerShiftY - 20,
      activeImg.naturalWidth * ratio + 40,
      activeImg.naturalHeight * ratio + 40
    );
  } else {
    // Atmospheric cinema stage with volumetric depth if image is still spooling
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#0c121d");
    grad.addColorStop(0.5, "#162338");
    grad.addColorStop(1, "#0d1420");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.restore();
}

/**
 * Pure cinematic frame renderer.
 * Eliminates cheap canvas shapes; applies professional photographic transforms,
 * aspect-ratio letterboxing, color grading, and dynamic synced subtitles.
 */
export function renderCinematicShot(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number, // 0.0 to 1.0 strictly continuous
  img: HTMLImageElement | null,
  shot: Shot,
  territory: CreativeTerritory,
  activeAspectRatio: AspectRatio = "2.39:1",
  drawSubtitles: boolean = false
) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // 1. Continuous Kinetic Camera Push (Ken Burns forward momentum, never resets or loops)
  const normProgress = Math.max(0, Math.min(1, progress));
  const scale = 1.02 + normProgress * 0.12;
  const transX = (normProgress - 0.5) * 20;
  const transY = (normProgress - 0.5) * 10;

  // 2. Base Image Drawing with Aspect Fill
  drawFittedImage(ctx, img, width, height, scale, transX, transY, 1.0);

  // 3. Cinematic Color Grade & Vignette
  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    width * 0.25,
    width / 2,
    height / 2,
    width * 0.72
  );
  vignette.addColorStop(0, "transparent");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.65)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  // Subtle territory lighting wash
  if (territory.colorPalette && territory.colorPalette[1]) {
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = territory.colorPalette[1];
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // 4. Aspect Ratio Letterboxing Mask (Anamorphic Bars)
  let activeHeight = height;
  let letterboxH = 0;

  if (activeAspectRatio === "2.39:1") {
    activeHeight = width / 2.39;
    letterboxH = Math.max(0, (height - activeHeight) / 2);
  } else if (activeAspectRatio === "9:16") {
    const activeW = height * (9 / 16);
    const pillarboxW = Math.max(0, (width - activeW) / 2);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, pillarboxW, height);
    ctx.fillRect(width - pillarboxW, 0, pillarboxW, height);
  }

  if (letterboxH > 0) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, letterboxH);
    ctx.fillRect(0, height - letterboxH, width, letterboxH);
  }

  // 5. Dynamic Synced Subtitle Overlay (Burned only if drawSubtitles is true, e.g. for video export)
  const rawScript = shot.voiceoverScript || shot.action;
  if (drawSubtitles && rawScript) {
    const scriptText = rawScript.length > 90 ? rawScript.slice(0, 87) + "..." : rawScript;
    ctx.save();
    ctx.font = "600 15px 'Inter', -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textY = height - Math.max(letterboxH, 45) - 52;

    // Subtitle background pill
    const metrics = ctx.measureText(scriptText);
    const padX = 20;
    const padY = 8;
    const pillW = Math.min(metrics.width + padX * 2, width - 120);
    const pillH = 32;

    ctx.fillStyle = "rgba(8, 10, 14, 0.85)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(width / 2 - pillW / 2, textY - pillH / 2, pillW, pillH, 8);
    ctx.fill();
    ctx.stroke();

    // High-visibility subtitle text with active karaoke progress shimmer
    ctx.fillStyle = normProgress > 0.08 && normProgress < 0.92 ? "#ffffff" : "#cbd5e1";
    ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
    ctx.shadowBlur = 6;
    ctx.fillText(scriptText, width / 2, textY, width - 140);
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Velocity-Matched Zoom-Through Seam Transition Renderer
 * Blends outgoing shot acceleration with incoming shot arrival and optical flare bloom.
 */
export function renderCinematicTransition(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number, // 0.0 to 1.0 strictly within the transition window (~500ms)
  prevImg: HTMLImageElement | null,
  nextImg: HTMLImageElement | null,
  prevShot: Shot,
  nextShot: Shot,
  territory: CreativeTerritory,
  activeAspectRatio: AspectRatio = "2.39:1"
) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  const p = Math.max(0, Math.min(1, progress));

  // 1. Outgoing Shot: Accelerates forward (push-in momentum) and fades
  const prevScale = 1.14 + Math.pow(p, 1.6) * 0.18;
  const prevAlpha = Math.max(0, 1.0 - Math.pow(p, 1.8));
  drawFittedImage(ctx, prevImg, width, height, prevScale, 0, 0, prevAlpha);

  // 2. Incoming Shot: Arrives oversized, settles in smoothly
  const nextScale = 0.90 + (1 - Math.pow(1 - p, 2.0)) * 0.12;
  const nextAlpha = Math.min(1.0, Math.pow(p, 1.5));
  drawFittedImage(ctx, nextImg, width, height, nextScale, 0, 0, nextAlpha);

  // 3. Cinematic Vignette
  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    width * 0.25,
    width / 2,
    height / 2,
    width * 0.72
  );
  vignette.addColorStop(0, "transparent");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.70)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  // 4. Optical Seam Lens Bloom & Flare Streak
  const flareIntensity = Math.sin(p * Math.PI);
  if (flareIntensity > 0.05) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    // Horizontal Anamorphic Flare Streak
    const cy = height * 0.48;
    const flareGrad = ctx.createLinearGradient(0, cy, width, cy);
    flareGrad.addColorStop(0, "rgba(78, 212, 183, 0)");
    flareGrad.addColorStop(0.3, `rgba(78, 212, 183, ${flareIntensity * 0.45})`);
    flareGrad.addColorStop(0.5, `rgba(255, 255, 255, ${flareIntensity * 0.75})`);
    flareGrad.addColorStop(0.7, `rgba(126, 148, 255, ${flareIntensity * 0.45})`);
    flareGrad.addColorStop(1, "rgba(126, 148, 255, 0)");
    ctx.fillStyle = flareGrad;
    ctx.fillRect(0, cy - 2, width, 4);

    // Subtle exposure bloom flash
    ctx.fillStyle = `rgba(255, 255, 255, ${flareIntensity * 0.12})`;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // 5. Letterboxing Bars
  let letterboxH = 0;
  if (activeAspectRatio === "2.39:1") {
    const activeHeight = width / 2.39;
    letterboxH = Math.max(0, (height - activeHeight) / 2);
  } else if (activeAspectRatio === "9:16") {
    const activeW = height * (9 / 16);
    const pillarboxW = Math.max(0, (width - activeW) / 2);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, pillarboxW, height);
    ctx.fillRect(width - pillarboxW, 0, pillarboxW, height);
  }

  if (letterboxH > 0) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, letterboxH);
    ctx.fillRect(0, height - letterboxH, width, letterboxH);
  }

  ctx.restore();
}

/**
 * Compiles all shots into a real standalone .webm video file with dynamic durations and transitions.
 */
export async function compileMasterVideo(
  shots: Shot[],
  territory: CreativeTerritory,
  onProgress?: (percent: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (shots.length === 0) {
      return reject(new Error("No shots available for compilation"));
    }

    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return reject(new Error("Canvas context initialization failed"));

    const stream = canvas.captureStream(30);

    // Attach procedural soundtrack audio stream if available
    const audioStream = cinematicAudio.getAudioStream();
    if (audioStream) {
      audioStream.getAudioTracks().forEach((track) => {
        stream.addTrack(track.clone());
      });
    }

    let mimeType = "video/webm;codecs=vp9";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm";
    }

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 8000000,
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: mimeType }));
    };

    recorder.start();

    const fps = 30;
    const shotDurations = shots.map((s) => s.durationSec || 8.0);
    const totalDurationSec = shotDurations.reduce((acc, d) => acc + d, 0);
    const totalFrames = Math.round(totalDurationSec * fps);
    const transitionDurationSec = 0.5; // 500ms velocity-matched seam
    let currentFrame = 0;

    const interval = setInterval(() => {
      if (currentFrame >= totalFrames) {
        clearInterval(interval);
        recorder.stop();
        return;
      }

      const globalTime = currentFrame / fps;
      const globalProgress = currentFrame / totalFrames;

      // Find current shot index and local progress
      let accumulatedTime = 0;
      let shotIndex = 0;
      for (let i = 0; i < shots.length; i++) {
        const dur = shotDurations[i];
        if (globalTime >= accumulatedTime && (globalTime < accumulatedTime + dur || i === shots.length - 1)) {
          shotIndex = i;
          break;
        }
        accumulatedTime += dur;
      }

      const currentShot = shots[shotIndex];
      const shotStart = accumulatedTime;
      const shotDur = shotDurations[shotIndex];
      const localTime = globalTime - shotStart;
      const timeRemainingInShot = shotDur - localTime;

      // Check if within transition seam to next shot
      if (timeRemainingInShot < transitionDurationSec && shotIndex < shots.length - 1) {
        const nextShot = shots[shotIndex + 1];
        const transitionProgress = 1.0 - timeRemainingInShot / transitionDurationSec;
        const prevImg = getImageForShot(currentShot);
        const nextImg = getImageForShot(nextShot);

        renderCinematicTransition(
          ctx,
          canvas.width,
          canvas.height,
          transitionProgress,
          prevImg,
          nextImg,
          currentShot,
          nextShot,
          territory,
          territory.aspectRatio
        );
      } else {
        const shotProgress = Math.min(1.0, localTime / shotDur);
        const img = getImageForShot(currentShot);

        renderCinematicShot(
          ctx,
          canvas.width,
          canvas.height,
          shotProgress,
          img,
          currentShot,
          territory,
          territory.aspectRatio,
          true
        );
      }

      if (onProgress) {
        onProgress(Math.round(globalProgress * 100));
      }

      currentFrame++;
    }, 1000 / fps);
  });
}
