/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        "primary-light": "#3B82F6",
        "primary-dark": "#1E40AF",
        accent: "#06B6D4",
        brand: "#2563EB",
        ink: "#0F172A",
        mist: "#F8FAFC",
        soft: "#EFF6FF",
        line: "#E2E8F0",
        "text-muted": "#64748B",
      },
      boxShadow: {
        card: "0 20px 45px -24px rgba(15, 23, 42, 0.26)",
        glow: "0 22px 50px -20px rgba(37, 99, 235, 0.32)",
      },
      fontFamily: {
        sans: ["Noto Sans Lao", "Noto Sans", "sans-serif"],
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(37,99,235,0.18), transparent 32%), radial-gradient(circle at bottom right, rgba(6,182,212,0.16), transparent 28%)",
        "button-primary":
          "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)",
        "button-primary-hover":
          "linear-gradient(135deg, #1E40AF 0%, #0891B2 100%)",
      },
    },
  },
  plugins: [],
};
