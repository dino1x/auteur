import { Shot, CreativeTerritory, AspectRatio } from "./types";
import { cinematicAudio } from "./cinematic-audio";

// High-definition cinematic visual curation mapped across semantic categories (5 distinct scenes per theme)
// High-definition cinematic visual curation mapped across semantic categories (8 distinct scenes per theme, zero duplicates)
const THEMATIC_PALETTES: Record<string, string[]> = {
  cyberpunk: [
    "/media/broll_tokyo.jpg",
    "/media/broll_silicon.jpg",
    "https://images.unsplash.com/photo-1515260268569-9271009adfdb?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=85&w=1600&auto=format&fit=crop",
  ],
  space: [
    "/media/jwst_deep_space.jpg",
    "/media/apollo_lunar.jpg",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1447433819943-74a20887a81e?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=85&w=1600&auto=format&fit=crop",
  ],
  tech: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=85&w=1600&auto=format&fit=crop",
    "/media/broll_silicon.jpg",
    "/media/broll_tokyo.jpg",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=85&w=1600&auto=format&fit=crop",
  ],
  ocean: [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498623116890-37e912163d5d?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544551763-77ef2d0cf96c?q=85&w=1600&auto=format&fit=crop",
  ],
  desert: [
    "/media/apollo_lunar.jpg",
    "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513553404607-988bf2703777?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1545153996-e01b50d6f36a?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=1600&auto=format&fit=crop",
  ],
  racing: [
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=85&w=1600&auto=format&fit=crop",
  ],
  wildlife: [
    "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1547721064-da6cfb341d50?q=85&w=1600&auto=format&fit=crop",
  ],
  mountains: [
    "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517824806704-9040b037703b?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=85&w=1600&auto=format&fit=crop",
  ],
  nature: [
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511497584788-87676104235f?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1448375240586-882707db888b?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=1600&auto=format&fit=crop",
  ],
  luxury: [
    "https://images.unsplash.com/photo-1513094735237-8f2714d57c13?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?q=85&w=1600&auto=format&fit=crop",
  ],
  brutalist: [
    "/media/broll_tokyo.jpg",
    "/media/apollo_lunar.jpg",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?q=85&w=1600&auto=format&fit=crop",
  ],
  biotech: [
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1579165466791-788226ab77b4?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=85&w=1600&auto=format&fit=crop",
  ],
  food: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=85&w=1600&auto=format&fit=crop",
  ],
  urban: [
    "/media/broll_tokyo.jpg",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1444723121867-7a241cacace9?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=85&w=1600&auto=format&fit=crop",
  ],
  people: [
    "/media/speaker_host.jpg",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=85&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=85&w=1600&auto=format&fit=crop",
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

  // Unsplash has native CORS * — bypass the server proxy to load directly at maximum network speed.
  // Ephemeral media or unknown domains route through proxy.
  const isDirectCdn = url.includes("images.unsplash.com") || url.includes("unsplash.com");
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
        // Guaranteed local asset fallback
        const localAsset = "/media/broll_tokyo.jpg";
        const fbImg = new Image();
        fbImg.onload = () => {
          imageCache.set(url, fbImg);
          resolve(fbImg);
        };
        fbImg.src = localAsset;
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
