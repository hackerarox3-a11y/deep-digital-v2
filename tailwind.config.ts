import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        deep: { red: "#d50f23", ink: "#0b0b0c", bone: "#f5f4f1" },
      },
    },
  },
  plugins: [],
} satisfies Config;
