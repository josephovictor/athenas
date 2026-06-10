import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#3b82f6",
          light: "#dbeafe",
          dark: "#1d4ed8",
        },
        page: "#f3f4f6",
      },
    },
  },
  plugins: [],
};
export default config;