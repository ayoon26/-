import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        canvas: "#F6F5F1",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#1F2A24",
          soft: "rgba(31,42,36,0.64)",
          faint: "rgba(31,42,36,0.42)",
        },
        line: "rgba(31,42,36,0.10)",
        sprout: {
          50: "#EEF6EE",
          100: "#D9EBDA",
          200: "#B7D9BA",
          300: "#8FC194",
          400: "#67A76F",
          500: "#478A50",
          600: "#356E3E",
          700: "#2A5732",
        },
        sun: "#D9A441",
        clay: "#C97452",
        sky: "#5B8FA8",
        plum: "#8A6FA0",
        alert: "#B5533F",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(31,42,36,0.06), 0 8px 24px -12px rgba(31,42,36,0.12)",
      },
      maxWidth: {
        app: "480px",
      },
    },
  },
  plugins: [],
} satisfies Config;
