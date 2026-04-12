import containerQueries from '@tailwindcss/container-queries';
import sharedPreset from '@thaki/shared/tailwind.preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [sharedPreset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
    './node_modules/@thaki/shared/dist/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [containerQueries],
};
