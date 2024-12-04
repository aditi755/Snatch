/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
       'lime-yellow': 'var(--lime-yellow)',
        'electric-blue': 'var(--electric-blue)',
        graphite: 'var(--graphite)',
        smoke: 'var(--smoke)',
        'light-grey': 'var(--light-grey)',
        'dark-grey': 'var(--dark-grey)',
        blue: 'var(--blue)',
      },
      screens: {     
        '2xl': '1700px', // Adjust this to a larger width
      },
    },
  },
  plugins: [require("tailgrids/plugin")],
};
