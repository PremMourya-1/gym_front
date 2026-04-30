module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
      },
    },
    screens: {
      "2xl": { max: "1200px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1100px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "992px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "768px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "576px" },
      // => @media (max-width: 639px) { ... }
      xs: { max: "460px" },
      // => @media (max-width: 639px) { ... }
    },
  },
  plugins: [],
};
