// filepath: client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0066cc',
                secondary: '#f0f7ff',
            },
        },
    },
    plugins: [],
}