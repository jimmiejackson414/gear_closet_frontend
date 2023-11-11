import defaultTheme from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'gc-primary': '#2368a2',
        'gc-secondary': '#137547',
        'gc-positive': '#21ba45',
        'gc-negative': '#c10015',
        'gc-info': '#31ccec',
        'gc-warning': '#f2c037',
        'gc-black': '#4a4a4a',
        'gc-light-grey': '#f4f7fa',
      },
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
