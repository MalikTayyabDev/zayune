import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aubergine: "#2A1F2D",
        porcelain: "#F4EEE6",
        copper: "#B85F45",
        sage: "#7F8B78",
        brass: "#B79B63",
        stone: "#D7CEC3",
      },
      fontFamily: {
        display: ["var(--font-bodoni)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        editorial: ["var(--font-cormorant)", "serif"],
      },
      letterSpacing: {
        brand: "0.28em",
        nav: "0.22em",
      },
      maxWidth: {
        content: "72rem",
        narrow: "42rem",
      },
    },
  },
  plugins: [],
};

export default config;
