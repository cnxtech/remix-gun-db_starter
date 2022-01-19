const defaultTheme = require('tailwindcss/defaultTheme');
const withAnimations = require('animated-tailwindcss');
module.exports = withAnimations({
  mode: 'jit',
  important: true,
  darkMode: 'class',
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  content: ['./app/**/*.tsx', './app/**/*.ts'],
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        check: "url('/icons/check.svg')",
        landscape: "url('/images/landscape/2.jpg')",
      }),
      fontFamily: {
        display: ['Cantarell', 'sans-serif'],
        heading: ['"Fira Sans', 'sans-serif'],
        body: ['ABeeZee', 'serif'],
        sans: ['Work Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
 plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
  future: {
    purgeLayersByDefault: true,
  },
});
