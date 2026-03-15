/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dz-green': '#1E6B52',
        'dz-orange': '#FF7A3D',
        'dz-bg': '#FFFFFF',
        'dz-text': '#374151',
        'dz-border': '#E5E7EB'
      },
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
