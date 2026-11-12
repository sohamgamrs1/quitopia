/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1.25rem', screens: { '2xl': '1240px' } },
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0B3B2E',
          950: '#061C16',
          900: '#0B3B2E',
          800: '#0F4A39',
          700: '#14584A',
          600: '#1D6B57',
          500: '#2A8168',
          400: '#3E9A7E'
        },
        mint: {
          DEFAULT: '#A8E6CF',
          50: '#F2FCF8',
          100: '#E2F8EF',
          200: '#C9F1E2',
          300: '#A8E6CF',
          400: '#7FD8BC',
          500: '#55C6A4',
          600: '#37A98A'
        },
        cream: {
          DEFAULT: '#FAF6EC',
          50: '#FDFBF6',
          100: '#FAF6EC',
          200: '#F4EEDF',
          300: '#EBE3D2'
        },
        sand: { DEFAULT: '#D9A47A', deep: '#B9835C' },
        ink: '#10231D',
        muted: '#6C7F77'
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: { xl: '0.9rem', '2xl': '1.35rem', '3xl': '1.9rem', '4xl': '2.5rem' },
      boxShadow: {
        soft: '0 1px 2px rgba(11,59,46,0.04), 0 12px 32px -18px rgba(11,59,46,0.28)',
        lift: '0 20px 60px -28px rgba(11,59,46,0.45)',
        ring: 'inset 0 0 0 1px rgba(11,59,46,0.06)'
      },
      letterSpacing: { tightest: '-0.045em' },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(0.9)', opacity: '0.75' },
          '50%': { transform: 'scale(1.06)', opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        breathe: 'breathe 8s ease-in-out infinite',
        float: 'float 7s ease-in-out infinite',
        riseIn: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
