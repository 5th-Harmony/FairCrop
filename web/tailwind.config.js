/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#10B981", // Emerald Green
          foreground: "#FFFFFF",
          50: "#ECFDF5",
          100: "#D1FAE5",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        secondary: {
          DEFAULT: "#0F172A",
          foreground: "#F8FAFC",
        },
        accent: {
          DEFAULT: "#F59E0B", // Amber Gold
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#1E293B",
          foreground: "#F8FAFC",
        }
      },
    },
  },
  plugins: [],
}
