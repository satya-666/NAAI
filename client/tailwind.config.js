/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium Gold Palette
        gold: {
          50: '#fffef7',
          100: '#fffaeb',
          200: '#fef3c7',
          300: '#fde68a',
          400: '#fcd34d',
          500: '#D4AF37', // Premium gold
          600: '#B8941F',
          700: '#9C7A19',
          800: '#7A5F14',
          900: '#5C4710',
        },
        // Rich Brown Palette
        brown: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#d9c4b8',
          400: '#C19A6B', // Camel/tan
          500: '#8B6F47', // Rich brown
          600: '#6F5639',
          700: '#5A442D',
          800: '#3D2E1F',
          900: '#2A1F15',
        },
        // Deep Black/Charcoal Palette
        dark: {
          50: '#f7f7f8',
          100: '#e3e4e6',
          200: '#c8c9cc',
          300: '#a3a5a9',
          400: '#6b6d72',
          500: '#4a4c51',
          600: '#2d2e32',
          700: '#1f2023',
          800: '#141517', // Rich black
          900: '#0a0a0b', // Deep black
        },
        // Keep original primary for compatibility
        primary: {
          50: '#fffef7',
          100: '#fffaeb',
          200: '#fef3c7',
          300: '#fde68a',
          400: '#fcd34d',
          500: '#D4AF37',
          600: '#B8941F',
          700: '#9C7A19',
          800: '#7A5F14',
          900: '#5C4710',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.3)',
        'gold-glow-lg': '0 0 30px rgba(212, 175, 55, 0.4)',
        'dark-lg': '0 10px 40px rgba(0, 0, 0, 0.5)',
        'dark-xl': '0 20px 60px rgba(0, 0, 0, 0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
