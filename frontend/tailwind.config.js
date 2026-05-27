/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fdf8f0',
          100: '#faecd8',
          200: '#f3d5aa',
          300: '#e9b876',
          400: '#de9641',
          500: '#d4801e',
          600: '#b86415',
          700: '#974d14',
          800: '#7b3e16',
          900: '#653515',
        },
        earth: {
          50:  '#f8f5f0',
          100: '#ede5d8',
          200: '#d9c9b0',
          300: '#c0a682',
          400: '#a8855c',
          500: '#936f44',
          600: '#7a5b37',
          700: '#62482d',
          800: '#4f3a26',
          900: '#422f20',
        },
        forest: {
          500: '#3d6b4f',
          600: '#2d5240',
          700: '#1f3d2f',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
