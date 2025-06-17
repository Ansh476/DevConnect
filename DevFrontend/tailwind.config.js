/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#040404",
        secondary: "#000000",
        tertiary: "#656565",
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

