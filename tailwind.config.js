/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"],
      },
      colors: {
        brand: {
          50: "#f5f9ff",
          100: "#eaf2ff",
          200: "#d6e6ff",
          300: "#b7d2ff",
          400: "#8bb6ff",
          500: "#5a96ff",
          600: "#3a75f4",
          700: "#285bd6",
          800: "#2149a8",
          900: "#1e3c86",
        },
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(0,0,0,0.2)",
        card: "0 8px 24px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl: "1rem",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(90, 150, 255, 0.6)" },
          "50%": { boxShadow: "0 0 0 12px rgba(90, 150, 255, 0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 300ms ease-out",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
      },
      backgroundImage: {
        "radial-soft": "radial-gradient(1200px 600px at 10% 10%, rgba(90,150,255,0.15), transparent), radial-gradient(800px 400px at 90% 20%, rgba(16,185,129,0.12), transparent)",
        "radial-soft-dark": "radial-gradient(1200px 600px at 10% 10%, rgba(90,150,255,0.12), transparent), radial-gradient(800px 400px at 90% 20%, rgba(59,130,246,0.10), transparent)",
      },
    },
  },
  plugins: [],
};
