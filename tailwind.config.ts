import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#08090c",
        surface: "#0f1116",
        elev: "#14171e",
        border: "rgba(255, 255, 255, 0.07)",
        "border-2": "rgba(255, 255, 255, 0.13)",
        text: "#fafafc",
        "text-muted": "#a0a6b1",
        "text-dim": "#626a76",
        teal: {
          DEFAULT: "#4ed4b7",
          glow: "rgba(78, 212, 183, 0.25)",
        },
        gold: {
          DEFAULT: "#e8c76d",
          glow: "rgba(232, 199, 109, 0.25)",
        },
        mint: "#5fe995",
        indigo: "#7e94ff",
        rose: "#ff6b8b",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "var(--font-display)", "-apple-system", "sans-serif"],
        heading: ["'Plus Jakarta Sans'", "var(--font-heading)", "Inter", "sans-serif"],
        sans: ["Inter", "var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["'Instrument Serif'", "var(--font-serif)", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "var(--font-mono)", "SFMono-Regular", "Menlo", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scanline": "scanline 8s linear infinite",
        "carousel-left": "carousel-left 45s linear infinite",
        "carousel-right": "carousel-right 45s linear infinite",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "carousel-left": {
          "0%": { transform: "translate3d(0%, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
        "carousel-right": {
          "0%": { transform: "translate3d(-50%, 0, 0)" },
          "100%": { transform: "translate3d(0%, 0, 0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
