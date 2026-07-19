/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        terminal: {
          bg: "#0b1220",
          panel: "#0f172a",   // slate-900
          border: "#1e293b",  // slate-800
          accent: "#f59e0b",  // amber — high-impact
        },
      },
    },
  },
  plugins: [],
};
