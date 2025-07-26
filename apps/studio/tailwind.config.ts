import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        afacad: ["Afacad", "sans-serif"],
      },
      colors: {
        studio: {
          background: "#0a0a0f",
          surface: "#1a1a2e",
          border: "#2a2a3e",
          primary: "#8b5cf6",
          text: {
            primary: "#ffffff",
            secondary: "#a0a0b8",
            muted: "#6b6b80",
          },
        },
      },
      borderRadius: {
        base: "0.75rem",
      },
      spacing: {
        xl: "2rem",
      },
    },
  },
  plugins: [],
};

export default config;