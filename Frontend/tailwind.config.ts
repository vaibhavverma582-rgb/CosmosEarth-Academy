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
          navy: "#0a0e27",
          "navy-light": "#111642",
          "navy-mid": "#161b4a",
          cyan: "#00d4ff",
          "cyan-dim": "#00a3c7",
          purple: "#7b2ff2",
          "purple-dim": "#5a1db8",
          orange: "#ff6b35",
          "orange-dim": "#cc5429",
          pink: "#ff2e97",
          gold: "#ffd700",
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
          "radial-gradient(ellipse at 20% 50%, rgba(0, 212, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(123, 47, 242, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(255, 107, 53, 0.05) 0%, transparent 50%), linear-gradient(180deg, #0a0e27 0%, #111642 100%)",
        "hero-gradient":
          "radial-gradient(ellipse at 30% 40%, rgba(0, 212, 255, 0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(123, 47, 242, 0.12) 0%, transparent 60%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(17, 22, 66, 0.8) 0%, rgba(22, 27, 74, 0.6) 100%)",
        "glow-cyan":
          "radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%)",
        "glow-purple":
          "radial-gradient(circle, rgba(123, 47, 242, 0.3) 0%, transparent 70%)",
        "glow-orange":
          "radial-gradient(circle, rgba(255, 107, 53, 0.3) 0%, transparent 70%)",
      },
      boxShadow: {
        "cosmos-sm": "0 0 15px rgba(0, 212, 255, 0.15)",
        "cosmos-md": "0 0 30px rgba(0, 212, 255, 0.2)",
        "cosmos-lg": "0 0 60px rgba(0, 212, 255, 0.25)",
        "cosmos-purple": "0 0 30px rgba(123, 47, 242, 0.3)",
        "cosmos-orange": "0 0 30px rgba(255, 107, 53, 0.3)",
        "cosmos-glow":
          "0 0 20px rgba(0, 212, 255, 0.15), 0 0 60px rgba(123, 47, 242, 0.1)",
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
