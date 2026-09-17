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
        // Primary brand palette - Deep Emerald Pine & Warm Linen Sand
        primary: {
          50: "#e6f4f2",
          100: "#cce8e5",
          200: "#99d1cb",
          300: "#66bab1",
          400: "#33a397",
          500: "#004741", // Main Brand Primary
          600: "#003f3a",
          700: "#00332f",
          800: "#002724",
          900: "#001c1a",
          950: "#000f0e",
        },
        terracotta: {
          50: "#fdf4f0",
          100: "#fbe8df",
          200: "#f5cbb8",
          300: "#eda98b",
          400: "#e07a54",
          500: "#004741", // Updated to Deep Pine
          600: "#003a35",
          700: "#002e2a",
          800: "#00221f",
          900: "#001715",
          950: "#000c0b",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#d49b35",
          600: "#b45309",
          700: "#92400e",
          800: "#78350f",
          900: "#451a03",
          950: "#260e02",
        },
        teal: {
          50: "#e6f4f2",
          100: "#cce8e5",
          200: "#99d1cb",
          300: "#66bab1",
          400: "#33a397",
          500: "#004741",
          600: "#003b36",
          700: "#002f2b",
          800: "#002421",
          900: "#001816",
          950: "#000d0c",
        },
        sand: {
          50: "#fdfcf9",
          100: "#F0EDE4", // Main Warm Sand
          200: "#e5dfd2",
          300: "#d7cfbf",
          400: "#c4b9a3",
          500: "#a99b82",
          600: "#8b7e67",
          700: "#6f6350",
          800: "#544a3b",
          900: "#3b3429",
          950: "#221d16",
        },
        cream: "#F0EDE4",
        "deep-teal": "#004741",
        "pine-green": "#004741",
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
