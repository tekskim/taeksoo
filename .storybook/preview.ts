import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'surface-subtle',
      values: [
        {
          name: 'surface-default',
          value: 'var(--color-surface-default)',
        },
        {
          name: 'surface-subtle',
          value: 'var(--color-surface-subtle)',
        },
      ],
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default preview;
