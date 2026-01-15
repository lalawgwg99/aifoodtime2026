/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', '"Noto Serif TC"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        chef: {
          black: '#1A1818',
          paper: '#FFFBF5',
          gold: '#C5A059',
          'gold-light': '#D4B574',
          'gold-dark': '#A68849',
          accent: '#8B4513',
          terracotta: '#A0522D',
          cream: '#FDF9F3',
          'cream-dark': '#F5EFE7',
          subtle: '#9E9E9E',
          ivory: '#FFFFF0',
          champagne: '#F7E7CE',
        }
      },
      backgroundImage: {
        'marble': 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence baseFrequency=\'0.02\' numOctaves=\'5\' seed=\'2\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
        'silk': 'linear-gradient(135deg, rgba(255,255,255,0.02) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.02) 75%, transparent 75%, transparent)',
        'gold-shimmer': 'linear-gradient(135deg, #C5A059 0%, #D4B574 25%, #C5A059 50%, #A68849 75%, #C5A059 100%)',
        'gold-radial': 'radial-gradient(circle at 30% 50%, rgba(212, 181, 116, 0.15), transparent 70%)',
      },
      boxShadow: {
        'premium': '0 20px 50px -12px rgba(26, 24, 24, 0.08)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.03), 0 2px 10px -2px rgba(0, 0, 0, 0.02)',
        'floating': '0 30px 60px -12px rgba(50, 50, 93, 0.15), 0 18px 36px -18px rgba(0, 0, 0, 0.2)',
        'gold-glow': '0 0 30px rgba(197, 160, 89, 0.3), 0 0 60px rgba(197, 160, 89, 0.2)',
        'inner-gold': 'inset 0 1px 2px rgba(197, 160, 89, 0.2)',
      },
      animation: {
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}