import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        oat: "#F0EBE3",
        fern: {
          DEFAULT: "#4A6741",
          light: "#6B8F63",
          dark: "#35522E",
        },
        sage: "#A3B18A",
        terracotta: {
          DEFAULT: "#C4704B",
          light: "#D4926E",
        },
        blush: "#E8C4B8",
        "warm-brown": "#6B4D3E",
        "warm-brown-readable": "#5A3F32", // Darker warm-brown for better contrast
        charcoal: "#2C2C2C",
        "charcoal-light": "#444444", // For less prominent text
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
