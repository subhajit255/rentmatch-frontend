/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        "xs": "320px",     // >= 320px
        "3xl": "1537px", // >= 1537px
        "4xl": "1921px", // >= 1921px
      },
      colors: {
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require('tailwind-scrollbar-hide'), require('tailwind-scrollbar')({ nocompatible: true })],
};
