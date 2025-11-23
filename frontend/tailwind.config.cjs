<<<<<<< HEAD
// tailwind.config.cjs
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // keep tailwind palette available; we'll also use CSS variables for light theme
        banja: {
          50: '#f7fbff',
          100: '#eef7ff',
          200: '#d6efff',
          500: '#22d3ee', // cyan used in buttons
        }
      }
    }
  },
  plugins: [],
};
=======
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: { extend: {} },
  plugins: [],
}
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
