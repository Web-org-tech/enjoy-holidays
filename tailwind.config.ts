import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary sunset palette
        terracotta: {
          50: "#fdf4f0",
          100: "#fbe8df",
          200: "#f5cbb8",
          300: "#eda98b",
          400: "#e07a54",
          500: "#d45c33",
          600: "#c04426",
          700: "#9f3620",
          800: "#832f1f",
          900: "#6c2a1e",
          950: "#3a1209",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        sand: {
          50: "#fdfaf4",
          100: "#f9f2e4",
          200: "#f1e2c3",
          300: "#e5cc97",
          400: "#d4ae65",
          500: "#c89643",
          600: "#b07c35",
          700: "#92622c",
          800: "#784f29",
          900: "#624125",
          950: "#352110",
        },
        cream: "#FAF7F2",
        "deep-teal": "#0B4F4A",
      },
      fontFamily: {
        serif: ["DM Serif Display", "Georgia", "serif"],
        sans: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grain-light": "url('/textures/grain-light.svg')",
        "grain-dark": "url('/textures/grain-dark.svg')",
        "hero-gradient":
          "linear-gradient(180deg, rgba(11,79,74,0.7) 0%, rgba(11,79,74,0.3) 50%, rgba(212,92,51,0.6) 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
        "sunset-gradient":
          "linear-gradient(135deg, #d45c33 0%, #f59e0b 50%, #0f766e 100%)",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "float-medium": "float 4s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "marquee-reverse": "marquee 30s linear infinite reverse",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-right": "slideRight 0.5s ease-out forwards",
        "count-up": "countUp 2s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        countUp: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
        "card-hover": "0 20px 60px rgba(0, 0, 0, 0.15)",
        "terracotta-glow": "0 0 40px rgba(212, 92, 51, 0.3)",
        "teal-glow": "0 0 40px rgba(20, 184, 166, 0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
