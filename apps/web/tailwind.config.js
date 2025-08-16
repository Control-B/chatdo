/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors inspired by Slack/Discord
        background: {
          primary: "#0f0f23", // Dark blue-black
          secondary: "#1a1a2e", // Slightly lighter dark blue
          tertiary: "#16213e", // Dark blue-gray
          sidebar: "#1e1e2e", // Dark sidebar
          card: "#2d2d44", // Card background
          hover: "#3a3a5a", // Hover state
        },
        text: {
          primary: "#ffffff",
          secondary: "#b9bbbe", // Light gray
          tertiary: "#72767d", // Muted gray
          accent: "#00b0f4", // Blue accent
        },
        accent: {
          blue: "#00b0f4",
          green: "#43b581",
          red: "#f04747",
          yellow: "#faa61a",
          purple: "#7289da",
        },
        border: {
          primary: "#40444b",
          secondary: "#2f3136",
          accent: "#00b0f4",
        },
        channel: {
          default: "#8e9297",
          active: "#ffffff",
          hover: "#dcddde",
        },
        message: {
          background: "#2d2d44",
          hover: "#3a3a5a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.2s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-dark": "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)",
      },
    },
  },
  plugins: [],
};
