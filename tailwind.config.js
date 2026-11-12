/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1.25rem', screens: { '2xl': '1200px' } },
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0F3D2E',
          900: '#07110D',
          800: '#0B2E22',
          700: '#0F3D2E',
          600: '#17563F',
          500: '#1F6B4F',
          400: '#2F8767'
        },
        mint: { DEFAULT: '#A8E6CF', soft: '#D3F5E7', deep: '#6FD3B0' },
        cream: { DEFAULT: '#FFF8E7', deep: '#F6EBCF' },
        teal: { DEFAULT: '#7FD1C1', deep: '#4FB3A2' },
        ink: '#0B1A14'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'var(--font-inter)', 'ui-sans-serif', 'sans-serif']
      },
      borderRadius: { xl: '1rem', '2xl': '1.5rem', '3xl': '2rem' },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(11, 46, 34, 0.18)',
        lift: '0 18px 60px -20px rgba(11, 46, 34, 0.35)'
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(0.85)', opacity: '0.7' },
          '50%': { transform: 'scale(1.05)', opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      },
      animation: {
        breathe: 'breathe 4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
