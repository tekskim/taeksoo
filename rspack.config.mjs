import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import RefreshPlugin from '@rspack/plugin-react-refresh';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  context: __dirname,
  entry: {
    main: './src/main.tsx',
  },
  experiments: {
    css: true,
  },
  // @rspack/cli serve가 설정에 lazyCompilation이 없으면 dev에서 자동으로 켠다
  // ({ imports: true }). 그러면 React.lazy 라우트 청크가 요청-시-컴파일 프록시가 되고,
  // dev 서버 재시작 후 오래된 탭 등에서 그 프록시 청크 로딩이 실패하면
  // "Loading chunk ...lazy-compilation-proxy failed" (ChunkLoadError)가 난다.
  // 이 앱은 dev 빌드가 ~130ms라 미리 다 컴파일해도 부담이 없으므로 꺼서 문제를 없앤다.
  lazyCompilation: false,
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: isDev ? '[name].js' : '[name].[contenthash].js',
    publicPath: isDev ? '/' : '/tds_ssot/',
    clean: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    conditionNames: ['import', 'module', 'require', 'default'],
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        exclude: /node_modules/,
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
                development: isDev,
                refresh: isDev,
              },
            },
          },
          env: {
            targets: 'Chrome >= 87',
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['tailwindcss', 'autoprefixer'],
              },
            },
          },
        ],
        type: 'css',
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new rspack.CopyRspackPlugin({
      patterns: [{ from: 'public', to: '.', globOptions: { ignore: ['**/.*'] } }],
    }),
    new rspack.HtmlRspackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
    new rspack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'import.meta.env': JSON.stringify({
        BASE_URL: isDev ? '/' : '/tds_ssot/',
        DEV: isDev,
        PROD: !isDev,
        MODE: process.env.NODE_ENV || 'development',
      }),
    }),
    isDev && new RefreshPlugin(),
  ].filter(Boolean),
  devServer: {
    port: Number(process.env.PORT) || 5180,
    hot: true,
    historyApiFallback: true,
    allowedHosts: ['local.thakicloud.net'],
    static: {
      directory: path.join(__dirname, 'public'),
    },
    client: {
      overlay: {
        runtimeErrors: (error) => {
          if (error?.message?.includes('ResizeObserver loop')) return false;
          return true;
        },
      },
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  devtool: isDev ? 'eval-source-map' : 'source-map',
});
