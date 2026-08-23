import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmos: {
          navy: "#0c1222",
          "navy-light": "#111a2e",
          "navy-mid": "#162035",
          "navy-surface": "#1a2540",
          cyan: "#22b8d4",
          "cyan-dim": "#1a9ab5",
          "cyan-soft": "#3dd4ef",
          purple: "#6c5ce7",
          "purple-dim": "#5a4bd6",
          orange: "#e67e22",
          "orange-dim": "#d4701a",
          pink: "#e84393",
          gold: "#f0c040",
          teal: "#00b894",
          slate: "#8395a7",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "space-gradient":
          "radial-gradient(ellipse at 20% 50%, rgba(0, 184, 148, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(108, 92, 231, 0.06) 0%, transparent 50%), linear-gradient(180deg, #0c1222 0%, #111a2e 100%)",
        "hero-gradient":
          "radial-gradient(ellipse at 30% 40%, rgba(0, 184, 148, 0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(108, 92, 231, 0.08) 0%, transparent 60%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(26, 37, 64, 0.7) 0%, rgba(17, 26, 46, 0.5) 100%)",
        "glow-cyan":
          "radial-gradient(circle, rgba(34, 184, 212, 0.2) 0%, transparent 70%)",
        "glow-purple":
          "radial-gradient(circle, rgba(108, 92, 231, 0.2) 0%, transparent 70%)",
        "glow-orange":
          "radial-gradient(circle, rgba(230, 126, 34, 0.2) 0%, transparent 70%)",
      },
      boxShadow: {
        "cosmos-sm": "0 2px 8px rgba(0, 0, 0, 0.15)",
        "cosmos-md": "0 4px 16px rgba(0, 0, 0, 0.2)",
        "cosmos-lg": "0 8px 32px rgba(0, 0, 0, 0.25)",
        "cosmos-purple": "0 4px 16px rgba(108, 92, 231, 0.15)",
        "cosmos-orange": "0 4px 16px rgba(230, 126, 34, 0.15)",
        "cosmos-glow":
          "0 4px 16px rgba(0, 184, 148, 0.1), 0 0 40px rgba(108, 92, 231, 0.06)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "star-twinkle": "star-twinkle 3s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "star-twinkle": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.5)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
