/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#1f1c1a',
          light: '#2c2724',
        },
        ivory: {
          DEFAULT: '#faf6ee',
          dark: '#f2ebdc',
        },
        brown: {
          DEFAULT: '#4a2f22',
          deep: '#38241a',
          light: '#6b4530',
        },
        brass: {
          DEFAULT: '#b08d4f',
          light: '#cdab74',
          dark: '#8c6d38',
        },
        wood: {
          DEFAULT: '#8a5a3a',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'sans-serif',
        ],
      },
      maxWidth: {
        content: '1200px',
      },
      boxShadow: {
        card: '0 6px 24px -8px rgba(31, 28, 26, 0.18)',
        'card-hover': '0 14px 36px -10px rgba(31, 28, 26, 0.28)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}
