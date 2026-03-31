import { rspack } from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import { existsSync } from 'fs';
import { config } from 'dotenv';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { globSync } from 'glob';
import path, { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootEnvPath = path.resolve(__dirname, '.env');
const rootEnvLocalPath = path.resolve(__dirname, '.env.local');
const rootEnvProdPath = path.resolve(__dirname, '.env.production');
const envOverridePath = process.env.ENV_FILE
  ? path.resolve(__dirname, process.env.ENV_FILE)
  : process.env.NODE_ENV === 'production'
    ? rootEnvProdPath
    : rootEnvLocalPath;

if (existsSync(rootEnvPath)) {
  config({ path: rootEnvPath });
}
if (envOverridePath && existsSync(envOverridePath)) {
  config({ path: envOverridePath, override: true });
}

const isProd = process.env.NODE_ENV === 'production';

// NOTE: Babel compilation disabled - using rspack's built-in SWC loader instead
// React Compiler integration postponed, manual memoization required
// const babelLoaderOptions = {
//   babelrc: false,
//   configFile: false,
//   presets: [
//     ['@babel/preset-react', { runtime: 'automatic', development: !isProd }],
//     ['@babel/preset-typescript', { allowDeclareFields: true }],
//   ],
//   plugins: [],
// };

function buildEntries() {
  const entries = {};

  // Components entries
  const implFiles = globSync('src/components/*/!(*.d).{ts,tsx}');
  implFiles.forEach(file => {
    const dir = path.basename(path.dirname(file));
    const chunk = `components/${dir}/${dir}`;
    if (!file.endsWith(`${dir}.ts`) && !file.endsWith(`${dir}.tsx`)) return;
    entries[chunk] = `./${file}`;
  });

  const barrelFiles = globSync('src/components/*/index.ts?(x)');
  barrelFiles.forEach(file => {
    const dir = path.basename(path.dirname(file));
    const implChunk = `components/${dir}/${dir}`;
    const barrelChunk = `components/${dir}/index`;
    entries[barrelChunk] = {
      import: `./${file}`,
      dependOn: [implChunk],
    };
  });

  // Providers entries (simple approach)
  const providerBarrelFiles = globSync('src/providers/*/index.ts?(x)');
  providerBarrelFiles.forEach(file => {
    const dir = path.basename(path.dirname(file));
    const chunk = `providers/${dir}`;
    entries[chunk] = `./${file}`;
  });

  entries.index = './src/index.ts';
  entries.charts = './src/charts.ts';
  entries.core = './src/styles/core.css';
  entries['tokens-only'] = './src/styles/tokens-only.css';

  return entries;
}

export default {
  context: __dirname,
  entry: buildEntries(),

  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].js', // 라이브러리는 고정 파일명 사용
    chunkFilename: '[name].chunk.js',
    assetModuleFilename: 'assets/[name].[contenthash][ext]', // 에셋만 해시 사용
    library: { type: 'module' },
    clean: true,
  },
  experiments: { outputModule: true },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    'react/jsx-runtime': 'react/jsx-runtime',
    // react-query는 Host/Remote 전체에서 singleton으로 공유되어야 하므로 번들에 포함하지 않음
    '@tanstack/react-query': '@tanstack/react-query',
    // echarts는 Module Federation shared로 처리되므로 번들에 포함하지 않음
    // charts entry를 사용하는 앱에서만 로드됨
    echarts: 'echarts',
    'echarts-for-react': 'echarts-for-react',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: { transpileOnly: true },
        exclude: /node_modules/,
      },
      // Compile custom SVG icons to React components at build time.
      {
        test: /\.svg$/i,
        resourceQuery: /component/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              exportType: 'default',
              svgo: true,
              svgoConfig: {
                plugins: [{ name: 'removeDimensions' }],
              },
            },
          },
        ],
      },
      {
        test: /\.module.css$/,
        type: 'javascript/auto',
        use: [
          rspack.CssExtractRspackPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: false,
                exportLocalsConvention: 'camelCase',
                localIdentName: isProd
                  ? '[hash:base64]'
                  : '[path][name]__[local]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
        sideEffects: true,
      },
      {
        test: /\.css$/,
        exclude: /\.module.css$/,
        type: 'javascript/auto',
        use: [
          rspack.CssExtractRspackPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
        sideEffects: true,
      },
      // App icons are force-inlined as base64 so the library bundle is
      // self-contained. asset/resource would emit separate files that
      // consumer bundlers cannot discover from the pre-built JS.
      {
        test: /[\\/]app-icons[\\/].*\.(png|jpe?g|gif)$/i,
        type: 'asset/inline',
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        // Avoid conflicting with `?component` handler above and app-icons
        resourceQuery: { not: [/component/] },
        exclude: /[\\/]app-icons[\\/]/,
        type: 'asset',
        generator: { filename: 'assets/[hash][ext]' },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  plugins: [
    new rspack.CssExtractRspackPlugin({
      filename: '[name].css', // 라이브러리 CSS도 고정 파일명
      chunkFilename: '[name].chunk.css',
    }),
    ...(!isProd ? [new ReactRefreshPlugin()] : []),
    new ForkTsCheckerWebpackPlugin({
      async: true,
      formatter: {
        type: 'codeframe',
        pathType: 'absolute', // 터미널에서 파일 경로를 절대경로로 출력하여 단축키 이동 지원
      },
      typescript: {
        diagnosticOptions: {
          syntactic: true,
          semantic: true,
        },
      },
    }),
    // Copy public assets to dist for centralized asset sharing
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: 'public',
          to: 'public',
        },
      ],
    }),
  ],

  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'eval-source-map',
  optimization: {
    splitChunks: false,
    moduleIds: isProd ? 'deterministic' : 'named',
    chunkIds: isProd ? 'deterministic' : 'named',
  },
};
