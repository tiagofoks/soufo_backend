/** @type {import('tailwindcss').Config} */
module.exports = {
  // Configura quais arquivos o Tailwind deve escanear para encontrar classes
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Incluímos explicitamente seu arquivo principal:
    "./index.js", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};