import defaultTheme from 'tailwindcss/defaultTheme';
import tailwindForms from '@tailwindcss/forms';
import preline from 'preline/plugin';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'primary-light': '#c5ddf2',
        'primary': '#2368a2',
        'primary-dark': '#1d3f5d',

        'positive-light': '#dcfce3',
        'positive': '#21ba45',
        'positive-dark': '#16652a',

        'danger-light': '#f9e5db',
        'danger': '#DE6B48',
        'danger-dark': '#a92f25',

        'info-light': '#e3f0fb',
        'info': '#88ccf1',
        'info-dark': '#165974',

        'warning-light': '#fcf3c9',
        'warning': '#f2c037',
        'warning-dark': '#733714',

        'light-grey': '#e7e7e7',
        'grey': '#6d6d6d',
        'dark-grey': '#4a4a4a',
      },
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    tailwindForms,
    preline,
  ],
} satisfies Config;
