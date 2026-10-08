/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#d2a94b',
        dark: '#121212',
      },
    },
  },
  plugins: [],
};
