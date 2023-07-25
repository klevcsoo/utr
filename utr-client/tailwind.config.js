const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./node-modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
        "./node-modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {},
    },
    plugins: [],
})
