const withMT = require("@material-tailwind/react/utils/withMT");
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./node-modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
        "./node-modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            screens: {
                "3xl": "1920px"
            }
        },
        fontFamily: {
            "sans": ["Inter", ...defaultTheme.fontFamily.sans],
            "serif": ["IBM Plex Serif", ...defaultTheme.fontFamily.serif],
            "display": ["Rubik", ...defaultTheme.fontFamily.sans],
            "body": [...defaultTheme.fontFamily.serif]
        }
    },
    plugins: [],
})
