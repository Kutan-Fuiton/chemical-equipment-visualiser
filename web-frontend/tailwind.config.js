// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{ts,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body:    ["Rajdhani", "sans-serif"],
        mono:    ["Share Tech Mono", "monospace"],
      },
      colors: {
        cyan:    { DEFAULT: "#63caff", dim: "#63caff1f", glow: "#63caff59" },
        emerald: { DEFAULT: "#34d399", dim: "#34d3991f" },
        amber:   { DEFAULT: "#fbbf24", dim: "#fbbf241f" },
        rose:    { DEFAULT: "#fb7185", dim: "#fb71851f" },
        violet:  { DEFAULT: "#a78bfa", dim: "#a78bfa1f" },
        surface: "#111827",
        card:    "#151d2f",
        input:   "#0f1623",
      },
      // so we can do bg-base
      backgroundColor: { base: "#0a0e1a" },
    },
  },
  plugins: [],
};