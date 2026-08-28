/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        navy: {
          900: "#0B132B",
          800: "#1C2541",
          700: "#3A506B",
        }
      },
    },
  },
  plugins: [],
}
