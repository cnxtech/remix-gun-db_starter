const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  important: true,
  // Active dark mode on class basis
  darkMode: "class",
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
  content: [
    "./app/**/*.tsx",
    "./app/**/*.jsx",
    "./app/**/*.js",
    "./app/**/*.ts"
  ],
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
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
  future: {
    purgeLayersByDefault: true,
  },
};
