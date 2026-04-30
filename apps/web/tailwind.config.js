/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        cream: "#f7f4ef",
        parchment: "#ebe4d8",
        charcoal: "#1c1917",
        onyx: "#0a0908",
        ink: "#44403c",
        mist: "#78716c",
        gold: {
          DEFAULT: "#b8956c",
          soft: "#c9a86a",
          bright: "#d4a545",
          deep: "#8a6535",
          warm: "#c4934a",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        display: ['"Cormorant Garamond"', '"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
        silk: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        slow: "1200ms",
        slower: "1800ms",
        ultra: "2400ms",
      },
      letterSpacing: {
        "widest-2": "0.3em",
        "widest-3": "0.4em",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};
