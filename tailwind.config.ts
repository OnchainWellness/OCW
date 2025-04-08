import type { Config } from "tailwindcss";
import flowbiteReact from "flowbite-react/plugin/tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ".flowbite-react/class-list.json"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        blueGradient: "var(--blue-gradient)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        secondaryForeground: "var(--secondary-foreground)",
        primaryColor: "var(--primary-color)",
      },
    },
  },
  plugins: [flowbiteReact],
};
export default config;