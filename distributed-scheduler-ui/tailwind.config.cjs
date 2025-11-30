/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "#020817",
                foreground: "#e5e7eb",
                card: "#020817",
                "card-foreground": "#e5e7eb",
                border: "#111827",
                muted: "#111827",
                "muted-foreground": "#6b7280",
                primary: {
                    DEFAULT: "#6366f1",
                    foreground: "#f9fafb",
                },
                secondary: {
                    DEFAULT: "#111827",
                    foreground: "#e5e7eb",
                },
                destructive: {
                    DEFAULT: "#ef4444",
                    foreground: "#fef2f2",
                },
                accent: {
                    DEFAULT: "#0f172a",
                    foreground: "#e5e7eb",
                },
            },
            borderRadius: {
                lg: "0.5rem",
                xl: "0.75rem",
                "2xl": "1rem",
            },
            boxShadow: {
                card: "0 18px 40px rgba(15,23,42,0.45)",
            },
        },
    },
    plugins: [],
};
