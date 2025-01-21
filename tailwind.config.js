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
        // '2xl': '1700px', // Adjust this to a larger width
        '3xl': '1400px',
        "4xl": '1520px',
        "5xl": "1620px",
        "7xl": "2300px",
        "9xl": "3000px"
      },
    },
  },
  plugins: [require("tailgrids/plugin")],
};
