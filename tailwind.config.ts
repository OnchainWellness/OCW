import type { Config } from "tailwindcss";
import flowbite from "flowbite-react/tailwind"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
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
  plugins: [
    flowbite.plugin(),
  ],
};
export default config;
