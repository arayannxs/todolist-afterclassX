// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Look for classes in index.html and your TypeScript file
    "./index.html",
    "./src/**/*.ts", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}