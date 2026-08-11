import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

// const animate = require("tailwindcss-animate");

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./nuxt.config.{js,ts}",
    "./node_modules/vue-tailwind-datepicker/**/*.js",
  ],
  darkMode: ["class"],
  safelist: ["dark"],
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
      backgroundImage: {
        'charlie-brown': `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='12' viewBox='0 0 20 12'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='charlie-brown' fill='%23abc1d3' fill-opacity='0.4'%3E%3Cpath d='M9.8 12L0 2.2V.8l10 10 10-10v1.4L10.2 12h-.4zm-4 0L0 6.2V4.8L7.2 12H5.8zm8.4 0L20 6.2V4.8L12.8 12h1.4zM9.8 0l.2.2.2-.2h-.4zm-4 0L10 4.2 14.2 0h-1.4L10 2.8 7.2 0H5.8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
        'death-star': `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='105' viewBox='0 0 80 105'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='death-star' fill='%23d3e1ec' fill-opacity='0.4'%3E%3Cpath d='M20 10a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm15 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zM20 75a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zm30-65a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm0 65a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zM35 10a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zM5 45a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zm60 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
        'bamboo': `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='%23d3e1ec' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E") 
        `,
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          light: "hsl(var(--primary-light))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          light: "hsl(var(--secondary-light))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          light: "hsl(var(--destructive-light))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          light: "hsl(var(--accent-light))",
          foreground: "hsl(var(--accent-foreground))",
          alt: "hsl(var(--accent-alt))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        text: {
          DEFAULT: "hsl(var(--text))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--reka-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--reka-accordion-content-height)" },
          to: { height: "0" },
        },
        "collapsible-down": {
          from: { height: "0" },
          to: { height: 'var(--reka-collapsible-content-height)' },
        },
        "collapsible-up": {
          from: { height: 'var(--reka-collapsible-content-height)' },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-in-out",
        "collapsible-up": "collapsible-up 0.2s ease-in-out",
      },
    },
  },
  plugins: [animate],
} satisfies Config;