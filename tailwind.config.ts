import type { Config } from "tailwindcss";

/**
 * THEME FILE: change the green palette here and the whole site updates.
 * Use these names in components (bg-brand-700, text-pitch, etc.)
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF8F1",
          100: "#D5EEDD",
          200: "#A9DCBB",
          300: "#74C396",
          400: "#3FA672",
          500: "#228B5B",
          600: "#17714A",
          700: "#125A3D",
          800: "#0E4430",
          900: "#0A3123",
        },
        pitch: "#0A3123", // deepest green, used for text & footer
        lime: "#B6E04A", // accent, use sparingly (buttons, highlights)
        chalk: "#F6FAF5", // page background
      },
      fontFamily: {
        sans: ["var(--font-latin)", "var(--font-bangla)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-bangla)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
