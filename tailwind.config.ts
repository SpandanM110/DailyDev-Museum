import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: "#FFFDF7",
        parchment: "#F5F0E8",
        ink: "#1A1A1A",
        muted: "#6B6B6B",
        accent: "#8B4513",
        "dark-bg": "#1A1A1A",
        "dark-surface": "#252525",
        "dark-border": "#333333",
        "dark-muted": "#999999",
        "dark-accent": "#C4813D",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        body: ['"Inter"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
        curator: ['"Cormorant Garamond"', "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
