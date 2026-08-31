import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090B",
        surface: {
          DEFAULT: "#0F1115",
          secondary: "#15181E",
          elevated: "#1B1F27",
          highlight: "#222731",
        },
        border: {
          DEFAULT: "#232730",
          subtle: "#1A1E26",
          strong: "#323846",
        },
        cold: {
          50: "#F0F6FC",
          100: "#E2E8F0",
          200: "#CBD5E1",
          300: "#94A3B8",
          400: "#64748B",
          500: "#475569",
          600: "#334155",
          700: "#1E293B",
          800: "#0F172A",
          900: "#020617",
          ice: "#38BDF8",
          steel: "#7DD3FC",
          arctic: "#0284C7",
        },
        accent: {
          DEFAULT: "#38BDF8",
          foreground: "#08090B",
          glow: "rgba(56, 189, 248, 0.15)",
        },
        success: {
          DEFAULT: "#10B981",
          glow: "rgba(16, 185, 129, 0.15)",
          subtle: "rgba(16, 185, 129, 0.08)",
          text: "#34D399",
        },
        danger: {
          DEFAULT: "#EF4444",
          glow: "rgba(239, 68, 68, 0.15)",
          subtle: "rgba(239, 68, 68, 0.08)",
          text: "#F87171",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
