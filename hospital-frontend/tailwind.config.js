/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        cream: {
          50: "#fdfbf5",
          100: "#f8f3e8",
          200: "#f2e8d5",
          300: "#e8d6ba",
        },
      },
      boxShadow: {
        card: "0 10px 30px rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.10), transparent 35%), radial-gradient(circle at 80% 0%, rgba(20,184,166,0.12), transparent 30%)",
      },
    },
  },
  plugins: [],
};
