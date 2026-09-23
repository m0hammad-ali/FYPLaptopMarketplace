/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: 'hsl(243 75% 59%)', foreground: 'hsl(0 0% 100%)' },
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222 47% 11%)',
        muted: { DEFAULT: 'hsl(220 14% 96%)', foreground: 'hsl(220 9% 46%)' },
        border: 'hsl(220 13% 91%)',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
