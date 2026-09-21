import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#14243D",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#243B5A",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#C94B4B",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F5F6F8",
          foreground: "#667085",
        },
        accent: {
          DEFAULT: "#C49A52",
          foreground: "#14243D",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#172033",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#172033",
        },
        cosmora: {
          navy: "#14243D",
          "navy-soft": "#243B5A",
          gold: "#C49A52",
          "gold-light": "#E8D5B0",
          bg: "#FAFBFC",
          section: "#F5F6F8",
          text: "#172033",
          muted: "#667085",
          border: "#E5E7EB",
          hover: "#EEF2F7",
          success: "#2E8B70",
          error: "#C94B4B",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        allura: ["var(--font-allura)", "cursive"],
        "light-300": ["Inter", "system-ui", "sans-serif"],
      },
      fontWeight: {
        "light-300": "300",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
