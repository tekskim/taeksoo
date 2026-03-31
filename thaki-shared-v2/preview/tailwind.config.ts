import type { Config } from 'tailwindcss';
import sharedPreset from '../tailwind.preset.js';
import path from 'path';

const config: Config = {
  presets: [sharedPreset],
  content: [
    path.resolve(__dirname, '../src/**/*.{ts,tsx}'),
    path.resolve(__dirname, './src/**/*.{ts,tsx}'),
  ],
};

export default config;
