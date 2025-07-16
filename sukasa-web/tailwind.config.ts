import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  // content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      transitionProperty: {
        // Customize or disable transition properties
        none: "none",
      },
      colors: {
        "primary-color": "#5AC12F",
        "secondary-color": "#d8e3a3",
        "secondary-border-color": "#111827",
        sky: {
          500: "#0EA5E9", // Ensure sky-500 is set correctly
        },
      },
      width: {
        "custom-button": "110px",
        "app-bar-search-width": "408px",
      },
      height: {
        "custom-button": "45px",
      },
      fontSize: {
        "heading-1": "20px",
        "heading-2": "36px",
        "card-h1": "16px",
        "card-h2": "",
        "btn-h": "",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      scale: {
        102: '1.02',
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
} satisfies Config;

export default config;
