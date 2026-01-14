/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        chef: {
          black: '#1A1818',
          paper: '#FFFBF5',
          gold: '#C5A059', // Refined gold
          accent: '#8B4513', // Saddle Brown for better warmth
          terracotta: '#A0522D',
          cream: '#FDF9F3',
          subtle: '#9E9E9E'
        }
      },
      boxShadow: {
        'premium': '0 20px 50px -12px rgba(26, 24, 24, 0.08)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.03), 0 2px 10px -2px rgba(0, 0, 0, 0.02)',
        'floating': '0 30px 60px -12px rgba(50, 50, 93, 0.15), 0 18px 36px -18px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}