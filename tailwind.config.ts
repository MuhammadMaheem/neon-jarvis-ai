import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        jarvis: {
          cyan: "#00f0ff",
          blue: "#0070f3",
          teal: "#00d2c4",
          amber: "#ffb800",
          crimson: "#ff1744",
          emerald: "#00ff88",
          purple: "#9d4edd",
          dark: "#030712",
          panel: "rgba(5, 15, 30, 0.75)",
          border: "rgba(0, 240, 255, 0.2)",
          highlight: "rgba(0, 240, 255, 0.12)",
        },
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "monospace", "sans-serif"],
        rajdhani: ["var(--font-rajdhani)", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      boxShadow: {
        "neon-cyan": "0 0 15px rgba(0, 240, 255, 0.5), 0 0 30px rgba(0, 240, 255, 0.2)",
        "neon-cyan-lg": "0 0 25px rgba(0, 240, 255, 0.8), 0 0 50px rgba(0, 240, 255, 0.3)",
        "neon-blue": "0 0 15px rgba(0, 112, 243, 0.5), 0 0 30px rgba(0, 112, 243, 0.2)",
        "neon-amber": "0 0 15px rgba(255, 184, 0, 0.5), 0 0 30px rgba(255, 184, 0, 0.2)",
        "neon-crimson": "0 0 15px rgba(255, 23, 68, 0.5), 0 0 30px rgba(255, 23, 68, 0.2)",
        "neon-emerald": "0 0 15px rgba(0, 255, 136, 0.5), 0 0 30px rgba(0, 255, 136, 0.2)",
        "hud-glass": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.1), 0 10px 30px -10px rgba(0, 0, 0, 0.8)",
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "spin-reverse": "spin-reverse 15s linear infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "scanline": "scanline 8s linear infinite",
        "hologram": "hologram 4s ease-in-out infinite",
        "wave": "wave 1.2s ease-in-out infinite",
      },
      keyframes: {
        "spin-reverse": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        hologram: {
          "0%, 100%": { opacity: "0.9" },
          "50%": { opacity: "0.6" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
