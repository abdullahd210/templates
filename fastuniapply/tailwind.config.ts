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
        brandBlue: {
          50: "#EAEFFF",
          100: "#D2DCFF",
          200: "#A6B9FF",
          300: "#7A93FF",
          400: "#5470F5",
          500: "#2E4EEB",
          600: "#2038C4",
          700: "#182B94",
          800: "#121F6E",
          900: "#0C1550",
        },
        orange: {
          50: "#FFF3EC",
          100: "#FFE2CE",
          200: "#FFC29B",
          300: "#FFA167",
          400: "#FF8A47",
          500: "#FF7A30",
          600: "#E85F17",
          700: "#BE4710",
          800: "#93370D",
          900: "#6B280A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Cairo is the brand's display font — rounded, and (unlike Sora) has
        // native Arabic glyphs plus full Turkish Latin-Extended coverage, so
        // headings keep the same voice across all three locales.
        display: ["var(--font-cairo)", "var(--font-inter)", "system-ui", "sans-serif"],
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
