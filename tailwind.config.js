import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              950: "#f0fdf5",
              900: "#dbfde9",
              800: "#baf8d4",
              700: "#83f2b2",
              600: "#46e289",
              500: "#1ec968",
              400: "#12a150",
              300: "#128343",
              200: "#146739",
              100: "#125531",
              50: "#042f19",
              DEFAULT: "#12a150",
            },
            secondary: {
              950: "#f2f8f9",
              900: "#dfedee",
              800: "#c2dcdf",
              700: "#98c3c8",
              600: "#66a1aa",
              500: "#4a8590",
              400: "#457682",
              300: "#395b65",
              200: "#354d55",
              100: "#304249",
              50: "#1c2a30",
              DEFAULT: "#457682",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              50: "#f0fdf5",
              100: "#dbfde9",
              200: "#baf8d4",
              300: "#83f2b2",
              400: "#46e289",
              500: "#1ec968",
              600: "#12a150",
              700: "#128343",
              800: "#146739",
              900: "#125531",
              950: "#042f19",
              DEFAULT: "#12a150",
            },
            secondary: {
              50: "#f2f8f9",
              100: "#dfedee",
              200: "#c2dcdf",
              300: "#98c3c8",
              400: "#66a1aa",
              500: "#4a8590",
              600: "#457682",
              700: "#395b65",
              800: "#354d55",
              900: "#304249",
              950: "#1c2a30",
              DEFAULT: "#457682",
            },
          },
        },
      },
    }),
  ],
};
