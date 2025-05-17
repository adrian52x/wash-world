/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: ['app/**/*.{tsx,jsx,ts,js}', 'components/**/*.{tsx,jsx,ts,js}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        //className="bg-green-light"
        // Primary Colors
        green: {
          light: '#06C167',
          dark: '#0ce578',
        },
        basic: {
          black: '#000',
          white: '#FFF',
        },
        // Secondary Colors
        accent: {
          orange: '#FF6B06',
          red: 'D71515',
          gray: {
            80: '#333333',
            60: '#666666',
            10: '#E5E5E5',
            5: '#F7F7F7',
          },
        },
      },
      fontFamily: {
        header: ['Gilroy-ExtraBold', 'sans-serif'], // Main headlines
        subheader: ['Gilroy-Bold', 'sans-serif'], // Secondary headlines
        button: ['Gilroy-SemiBold', 'sans-serif'], // Button text
        bodyText: ['Gilroy-Regular', 'sans-serif'], // Main content text
        caption: ['Gilroy-Medium', 'sans-serif'], // Smaller informative text
        // 'light': ['Gilroy-RegularItalic', 'sans-serif'],   // Special text cases
      },
      fontSize: {
        header: ['32px', { lineHeight: '40px' }], // Large headlines
        subheader: ['24px', { lineHeight: '32px' }], // Secondary headlines
        button: ['16px', { lineHeight: '24px' }], // Button text
        bodyText: ['16px', { lineHeight: '24px' }], // Main content
        caption: ['14px', { lineHeight: '20px' }], // Small text
        light: ['12px', { lineHeight: '16px' }], // Smallest text
      },
    },
  },
  plugins: [],
};
