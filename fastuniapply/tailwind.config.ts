import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/**
 * Brand tokens per docs/01-product-requirements.md.
 * RTL (Arabic) is handled via Tailwind's logical-property utilities
 * (ps-/pe-/ms-/me-/text-start/text-end/etc.) driven by the root `dir` attribute —
 * avoid physical left/right utilities in shared components.
 */
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
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
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Raw brand scale, for cases that need it outside the semantic tokens above.
        navy: {
          50: "#EEF0FA",
          100: "#D6DBF2",
          200: "#AFB9E5",
          300: "#7E8ED0",
          400: "#4F5FB0",
          500: "#2E3D8F",
          600: "#1C2A72",
          700: "#141F5C",
          800: "#171F4A",
          900: "#0E1430",
        },
        // brandBlue.500 and orange.500 are the exact colors extracted from
        // the official logo file (FAST_UNI_APPLY_2026_2_1.ai) — #1E51F5 and
        // #F95B1A respectively. Surrounding shades are derived from them.
        brandBlue: {
          50: "#EAEFFF",
          100: "#D2DCFF",
          200: "#A6B9FF",
          300: "#7A93FF",
          400: "#4A6FF8",
          500: "#1E51F5",
          600: "#173FCB",
          700: "#122F9C",
          800: "#0E2372",
          900: "#0A1850",
        },
        orange: {
          50: "#FFF1EA",
          100: "#FFDDCB",
          200: "#FFB897",
          300: "#FF9263",
          400: "#FC7841",
          500: "#F95B1A",
          600: "#D14711",
          700: "#A3370D",
          800: "#78290A",
          900: "#521B06",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // `--font-display` is set per-locale on <html> in the root layout:
        // Fredoka (the brand's actual wordmark font) for en/tr, Cairo
        // (native Arabic, same rounded voice) for ar.
        display: ["var(--font-display)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 6px)",
      },
      boxShadow: {
        soft: "0 2px 8px 0 rgb(11 42 91 / 0.06), 0 1px 2px 0 rgb(11 42 91 / 0.04)",
        card: "0 4px 16px 0 rgb(11 42 91 / 0.08)",
        elevated: "0 12px 32px 0 rgb(11 42 91 / 0.14)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
