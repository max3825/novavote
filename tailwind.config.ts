import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      colors: {
        slateglass: "rgba(15, 23, 42, 0.7)",
      },
      boxShadow: {
        glow: "0 10px 50px -15px rgba(59, 130, 246, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
