/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FDF6E9',
        coral: {
          DEFAULT: '#F04E3E',
          dark: '#D93E30',
        },
        brand: {
          DEFAULT: '#5B2EBE',
          dark: '#4A239E',
          pale: '#E8DEF8',
        },
        mint: '#3ED598',
        sky: '#BFE3F5',
        tang: '#F58A1F',
        ink: '#1A1B2E',
        muted: '#8A8AA3',
      },
      borderRadius: {
        card: '1.5rem',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
