/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2A1F7D",
          dark: "#1B1440",
          light: "#332B96",
        },
        accent: {
          DEFAULT: "#F5A623",
          light: "#F7A93C",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#EFEFF8",
        },
        page: "#F5F5FB",
        ink: {
          DEFAULT: "#1A1A2E",
          soft: "#6B7280",
        },
        line: "#E5E5F0",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "20px",
      },
      boxShadow: {
        card: "0 4px 20px rgba(30, 20, 90, 0.06)",
      },
    },
  },
  plugins: [],
};
