/** @type {import('tailwindcss').Config} */
const formKitTailwind = require('@formkit/themes/tailwindcss');

module.exports = {
  content: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [formKitTailwind],
}
