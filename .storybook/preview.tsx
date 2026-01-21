import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/index.css';
import './storybook.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true, // Disable default backgrounds, use theme switcher instead
    },
    // Use 'padded' for better scrolling, individual stories can override
    layout: 'padded',
    docs: {
      toc: true, // Enable table of contents
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    // Wrapper decorator for proper theming of the preview area
    (Story, context) => {
      const isDark = context.globals.theme === 'dark';
      return (
        <div
          style={{
            minHeight: '100%',
            padding: '24px',
            backgroundColor: isDark ? '#141414' : 'var(--color-surface-subtle)',
            borderRadius: '8px',
            transition: 'background-color 0.2s ease',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
  tags: ['autodocs'],
};

export default preview;
