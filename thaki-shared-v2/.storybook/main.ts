import type { StorybookConfig } from 'storybook-react-rsbuild';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: 'storybook-react-rsbuild',
  staticDirs: ['../public'],
  rsbuildFinal: (config) => {
    config.tools = config.tools || {};

    // PostCSS with Tailwind support
    config.tools.postcss = {
      postcssOptions: {
        plugins: [require('postcss-import'), require('tailwindcss'), require('autoprefixer')],
      },
    };

    // SVG ?component 임포트를 @svgr/webpack으로 처리 (rspack.config.mjs와 동일 설정).
    // rsbuild 기본 SVG 규칙에서 ?component 쿼리를 제외하고,
    // 전용 SVGR 규칙을 추가하여 JS 모듈로 출력되도록 함.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config.tools.bundlerChain = (chain: any) => {
      // 기본 SVG asset 규칙에서 ?component 제외
      chain.module.rule('svg').resourceQuery({ not: [/component/] });

      // ?component SVG를 React 컴포넌트로 변환하는 SVGR 규칙 추가
      chain.module
        .rule('svg-component')
        .test(/\.svg$/i)
        .resourceQuery(/component/)
        .type('javascript/auto')
        .use('svgr')
        .loader('@svgr/webpack')
        .options({
          exportType: 'default',
          svgo: true,
          svgoConfig: {
            plugins: [{ name: 'removeDimensions' }],
          },
        });
    };

    // Path alias
    config.source = config.source || {};
    config.source.alias = {
      ...config.source.alias,
      '@': require('path').resolve(__dirname, '../src'),
    };
    return config;
  },
};

export default config;
