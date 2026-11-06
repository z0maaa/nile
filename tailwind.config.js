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
        background: "#08080A",
        surface: "#111116",
        "surface-card": "#171720",
        "surface-border": "#272736",
        gold: {
          50: "#FCF9EE",
          100: "#F7F0D4",
          200: "#EFE0A6",
          300: "#E4CE74",
          400: "#D9BC49",
          500: "#D4AF37", // Primary Royal Gold
          600: "#B89225",
          700: "#92711D",
          800: "#75581D",
          900: "#634A1E",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        arabic: ["Cairo", "Tajawal", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(212, 175, 55, 0.3)",
        "glow-lg": "0 0 40px -10px rgba(212, 175, 55, 0.45)",
      },
    },
  },
  plugins: [],
};

