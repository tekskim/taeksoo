import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// Library build configuration for @thaki/tds package
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/design-system'],
      outDir: 'dist/types',
      rollupTypes: false, // Disable rollup to avoid api-extractor issues
      tsconfigPath: './tsconfig.app.json',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/design-system/index.ts'),
      name: 'TDS',
      formats: ['es', 'cjs'],
      fileName: (format) => `tds.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@tabler/icons-react',
        'lucide-react',
        'tailwind-merge',
        'clsx',
        'framer-motion',
      ],
      output: {
        // Global variables for UMD build
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          '@tabler/icons-react': 'TablerIcons',
          'lucide-react': 'LucideReact',
          'tailwind-merge': 'tailwindMerge',
          clsx: 'clsx',
          'framer-motion': 'FramerMotion',
        },
        // Preserve module structure
        preserveModules: false,
      },
    },
    outDir: 'dist',
    sourcemap: true,
    // Don't minify for better debugging
    minify: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
