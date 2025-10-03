// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: [
    "./App.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./store/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F62FE",
        accent: "#5E6AD2",
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};
