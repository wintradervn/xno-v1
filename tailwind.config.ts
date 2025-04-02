import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";
const colors = require("tailwindcss/colors");

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        neutral: {
          50: "#F9FAFB",
          100: "#F2F4F7",
          200: "#EAECF0",
          300: "#D0D5DD",
          400: "#98A2B3",
          500: "#667085",
          600: "#475467",
          700: "#344054",
          800: "#1D2939",
          900: "#101828",
          950: "#0C111D",
        },
        default: {
          50: "#F9FAFB",
          100: "#F2F4F7",
          200: "#EAECF0",
          300: "#D0D5DD",
          400: "#98A2B3",
          500: "#667085",
          600: "#475467",
          700: "#344054",
          800: "#1D2939",
          900: "#101828",
          DEFAULT: "#344054",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        content1: "hsl(var(--content1))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        red: "hsl(var(--red))",
        yellow: "hsl(var(--yellow))",
        cyan: "hsl(var(--cyan))",
        purple: "hsl(var(--purple))",
        "green-light": "hsl(var(--green-light))",
        "red-light": "hsl(var(--red-light))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        "3xs": ["6px", { lineHeight: "10px" }],
        "2xs": ["8px", { lineHeight: "14px" }],
        xs: ["10px", { lineHeight: "16px" }],
        sm: ["12px", { lineHeight: "18px" }],
        md: ["14px", { lineHeight: "20px" }],
        lg: ["16px", { lineHeight: "24px" }],
        xl: ["18px", { lineHeight: "28px" }],
      },
      keyframes: {
        changeColorCyan: {
          "0%": { color: colors.cyan[400] },
          "100%": {
            color: "white",
          },
        },
        changeBackgroundPurple: {
          "0%": { backgroundColor: "hsl(var(--purple))" },
          "100%": {
            backgroundColor: "transparent",
          },
        },
        changeBackgroundCyan: {
          "0%": { backgroundColor: "hsl(var(--cyan))" },
          "100%": {
            backgroundColor: "transparent",
          },
        },
        changeBackgroundGreen: {
          "0%": { backgroundColor: "hsl(var(--green-bg))" },
          "100%": {
            backgroundColor: "transparent",
          },
        },
        changeBackgroundRed: {
          "0%": { backgroundColor: "hsl(var(--red-bg))" },
          "100%": {
            backgroundColor: "transparent",
          },
        },
        changeBackgroundYellow: {
          "0%": { backgroundColor: "hsl(var(--yellow))" },
          "100%": {
            backgroundColor: "transparent",
          },
        },
        "infinite-scroll": {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-50%)",
          },
        },
      },
      animation: {
        changeColorCyan: "changeColorCyan 1s forwards",
        changeBackgroundPurple: "changeBackgroundPurple 1s forwards",
        changeBackgroundCyan: "changeBackgroundCyan 1s forwards",
        changeBackgroundGreen: "changeBackgroundGreen 1s forwards",
        changeBackgroundRed: "changeBackgroundRed 1s forwards",
        changeBackgroundYellow: "changeBackgroundYellow 1s forwards",
        "infinite-scroll": "infinite-scroll 60s linear infinite",
      },
    },
  },
  plugins: [
    // require("tailwindcss-animate"),
    // heroui({
    //   themes: {
    //     dark: {
    //       colors: {
    //         default: {
    //           50: "#F9FAFB",
    //           100: "#F2F4F7",
    //           200: "#EAECF0",
    //           300: "#D0D5DD",
    //           400: "#98A2B3",
    //           500: "#667085",
    //           600: "#475467",
    //           700: "#344054",
    //           800: "#1D2939",
    //           900: "#101828",
    //           DEFAULT: "#344054",
    //         },
    //       },
    //     },
    //   },
    // }),
  ],
} satisfies Config;
