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
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        afacad: ["Afacad", "sans-serif"],
      },
      colors: {
        studio: {
          background: "#0f172a", // slate-900 to match hub
          surface: "#1e293b", // slate-800
          border: "#334155", // slate-700
          primary: "#8b5cf6", // violet-500
          text: {
            primary: "#f8fafc", // slate-50
            secondary: "#94a3b8", // slate-400
            muted: "#64748b", // slate-500
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