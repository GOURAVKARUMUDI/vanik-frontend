/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                vanikPrimary: "#7C3E2F",
                vanikGold: "#D4AF37",
                vanikDark: "#1E1E1E",
                vanikBg: "#F5F3EF"
            },
            fontFamily: {
                sans: ["Poppins", "sans-serif"]
            }
        },
    },
    plugins: [],
}
