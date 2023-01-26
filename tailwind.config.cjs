/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var($background-color)",
        primaryText: "var($primary-text)",
      },
    },
  },
  plugins: [],
};
