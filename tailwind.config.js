/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: "#F8FAFC", // slate-50
        "surface-card": "#FFFFFF",
        "surface-border": "#E2E8F0", // slate-200
        navy: {
          50: "#F0F4F8",
          100: "#D9E2EC",
          200: "#BCCCDC",
          300: "#9FB3C8",
          400: "#627D98",
          500: "#334E68",
          600: "#243B53",
          700: "#1B365D",
          800: "#0F2744",
          900: "#0A192F", // Deep Royal Navy
          950: "#050E1A",
        },
        emerald: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981", // Musical Emerald Green
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        arabic: ["Cairo", "Tajawal", "system-ui", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(10, 25, 47, 0.04), 0 1px 3px rgba(10, 25, 47, 0.02)",
        glow: "0 0 20px -3px rgba(16, 185, 129, 0.25)",
        "glow-navy": "0 0 20px -3px rgba(10, 25, 47, 0.2)",
        card: "0 10px 30px -5px rgba(10, 25, 47, 0.06), 0 4px 6px -2px rgba(10, 25, 47, 0.02)",
      },
    },
  },
  plugins: [],
};
