/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7fa',
          100: '#e4ebf2',
          200: '#c5d5e5',
          300: '#9cb9d4',
          400: '#6d97c1',
          500: '#4c7aa7',
          600: '#3a618c',
          700: '#304e72',
          800: '#2a4360',
          900: '#263a52',
        }
      }
    },
  },
  plugins: [],
}
