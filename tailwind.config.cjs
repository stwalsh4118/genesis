/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      sage: {
        DEFAULT: "#7E8E64",
        50: "#D7DCCD",
        100: "#CDD4C2",
        200: "#B9C3AA",
        300: "#A6B292",
        400: "#92A17A",
        500: "#7E8E64",
        600: "#616D4D",
        700: "#444C36",
        800: "#262B1E",
        900: "#090A07",
      },
    },
  },
  plugins: [],
};

module.exports = config;
