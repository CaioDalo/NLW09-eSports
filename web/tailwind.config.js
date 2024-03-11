/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx", "./index.html"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    extend: {
      backgroundImage: {
        galaxy: "url('/background-galaxy.png')",
        "nlw-gradiant":
          "linear-gradient(89.86deg, #9572FC 0%, #43E7AD 50%, #E1D55D 100%);",
        "game-gradiant":
          "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 67.08%);",
      },
    },
  },
  plugins: [],
};
