/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#b9466c",
        "accent-light": "#cd5a80",
        "accent-50": "#b9466c7d",
        "accent-25": "#b9466c4B",
        dark: "#242424",
        "dark-50": "#242424cf",
      },
    },
  },
  plugins: [],
};
