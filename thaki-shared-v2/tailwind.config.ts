import type { Config } from 'tailwindcss';
import sharedPreset from './tailwind.preset.js';

const config: Config = {
  presets: [sharedPreset],
  content: ['./src/**/*.{ts,tsx}', './preview/src/**/*.{ts,tsx}'],
};

export default config;
