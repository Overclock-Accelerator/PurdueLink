/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purdue: {
          black: '#000000',
          gold: '#CFB991',
          white: '#FFFFFF',
          'gold-light': '#E5D5B7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        display: ['Montserrat', 'Oswald', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


