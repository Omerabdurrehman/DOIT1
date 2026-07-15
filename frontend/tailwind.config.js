/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2E7D32",   // waste-management green
        secondary: "#1565C0",
        warning: "#F9A825",
        danger: "#C62828",
      },
    },
  },
  plugins: [],
};
