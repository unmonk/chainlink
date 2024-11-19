import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
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
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundSize: {
        auto: "auto",
        cover: "cover",
        contain: "contain",
        "200%": "200% 200%",
      },
      keyframes: {
        fluidSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        marquee: {
          to: {
            transform: "translateX(-50%)",
          },
        },
        wave: {
          "0%": { transform: "scale(1.2) rotate(0deg)" },
          "100%": { transform: "scale(1.2) rotate(360deg)" },
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        rainbow: {
          "0%": { filter: "hue-rotate(0deg)" },
          "100%": { filter: "hue-rotate(360deg)" },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "caret-blink": {
          "0%,70%,100%": {
            opacity: "1",
          },
          "20%,50%": {
            opacity: "0",
          },
        },
        orbit: {
          "0%": {
            transform:
              "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
          },
          "100%": {
            transform:
              "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
          },
        },
        "shiny-text": {
          "0%, 90%, 100%": {
            "background-position": "calc(-100% - var(--shiny-width)) 0",
          },
          "30%, 60%": {
            "background-position": "calc(100% + var(--shiny-width)) 0",
          },
        },
        rainbowbtn: {
          "0%": {
            "background-position": "0%",
          },
          "100%": {
            "background-position": "200%",
          },
        },
        grid: {
          "0%": {
            transform: "translateY(-50%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        wobble: {
          "0%, 100%": { transform: "translateX(0)" },
          "15%": { transform: "translateX(-6px) rotate(-3deg) scale(1.03)" },
          "30%": { transform: "translateX(4px) rotate(2deg) scale(1.04)" },
          "45%": { transform: "translateX(-3px) rotate(-1.5deg) scale(1.05)" },
          "60%": { transform: "translateX(2px) rotate(1deg) scale(1.04)" },
          "75%": { transform: "translateX(-1px) rotate(-0.5deg) scale(1.03)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1.03)" },
          "50%": { transform: "scale(1.08)" },
        },
        spiral: {
          "0%": { transform: "rotate(0deg) scale(1.03)" },
          "50%": { transform: "rotate(180deg) scale(1.08)" },
          "100%": { transform: "rotate(360deg) scale(1.03)" },
        },
        ripple: {
          "0%": { transform: "scale(0.95)", opacity: "1.03" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" },
          "100%": { transform: "scale(0.95)", opacity: "1.03" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-4px) scale(1.02)" },
        },
        "rotate-pulse": {
          "0%": { transform: "rotate(0deg) scale(1.02)" },
          "50%": { transform: "rotate(180deg) scale(1.08)" },
          "100%": { transform: "rotate(360deg) scale(1.02)" },
        },
        "wave-pulse": {
          "0%": { transform: "scale(1)", opacity: "1.03" },
          "25%": { transform: "scale(1.08) rotate(5deg)", opacity: "0.8" },
          "50%": { transform: "scale(1.1) rotate(0deg)", opacity: "0.6" },
          "75%": { transform: "scale(1.08) rotate(-5deg)", opacity: "0.8" },
          "100%": { transform: "scale(1)", opacity: "1.03" },
        },
      },
      animation: {
        fluidSpin: "fluidSpin 3s linear infinite",
        orbit: "orbit calc(var(--duration)*1s) linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        marquee: "marquee var(--duration, 30s) linear infinite",
        "shiny-text": "shiny-text 8s infinite",
        rainbowbtn: "rainbow var(--speed, 2s) infinite linear",
        grid: "grid 15s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wobble: "wobble 2s ease-in-out infinite",
        breathe: "breathe 3s ease-in-out infinite",
        spiral: "spiral 2s ease-in-out infinite",
        ripple: "ripple 3s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "rotate-pulse": "rotate-pulse 4s ease-in-out infinite",
        "wave-pulse": "wave-pulse 3s ease-in-out infinite",
      },
      boxShadow: {
        glow: "0 0 35px -5px var(--tw-shadow-color)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
