/** @type {import('tailwindcss').Config} */
module.exports = { // <--- Change to module.exports = {
  content: [
    "./ui/**/*.html",    // Scans all HTML files in the 'ui' folder and its subfolders
    "./ui/**/*.css",     // Scans all CSS files in the 'ui' folder for any @apply or other directives
    "./backend/**/*.js", // Scans all JavaScript files in the 'backend' folder and its subfolders
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    { pattern: /./ }, // Match every class name
  ],
}; // <--- Ensure it's a single object exported