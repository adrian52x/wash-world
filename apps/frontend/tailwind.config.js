import gluestackPlugin from '@gluestack-ui/nativewind-utils/tailwind-plugin'; //this can be removed if you are not using gluestack-ui

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: ['app/**/*.{tsx,jsx,ts,js}', 'components/**/*.{tsx,jsx,ts,js}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        lightGreen: "#A8E6CF",
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        '2xs': '10px',
      },
    },
  },
  plugins: [gluestackPlugin]