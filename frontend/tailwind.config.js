/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom colors for status indicators
                'status-reported': '#ef4444', // red
                'status-progress': '#f59e0b', // amber
                'status-fixed': '#10b981', // green
            }
        },
    },
    plugins: [],
}
