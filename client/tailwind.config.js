/** @type {import('tailwindcss').Config} */
export default {
  content:[
    './src/**/*.tsx',
  ], 
  theme: {
    extend: {
      colors: {
        "noubeau-blue": "#1ea0e1",
        "noubeau-blue-800": "#177fb3",
        "noubeau-white": "#fcfcfc",
      }
    },
  },
  plugins: [],
}

