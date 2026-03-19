import React, { useEffect, useMemo } from 'react';
import { Overlay } from '../src/components';
import {
  OverlayProvider,
  RTLProvider,
  ThemeProvider,
  createOverlayStore,
  useTheme,
} from '../src/services';
import '../src/styles/index.css';
import '../src/styles/tailwind.css';

const StorybookThemeSync: React.FC<{
  children: React.ReactNode;
  storybookTheme: string;
}> = ({ children, storybookTheme }) => {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    if (storybookTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const systemTheme = mediaQuery.matches ? 'dark' : 'default';

      if (theme !== systemTheme) {
        setTheme(systemTheme);
      }

      const handleSystemChange = (e: MediaQueryListEvent) => {
        const newSystemTheme = e.matches ? 'dark' : 'default';
        setTheme(newSystemTheme);
      };

      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    } else {
      if (storybookTheme && storybookTheme !== theme) {
        setTheme(storybookTheme);
      }
    }
  }, [storybookTheme, setTheme, theme]);

  return <>{children}</>;
};

export const decorators = [
  (Story, context) => {
    const theme = context.globals.theme || 'system';

    // Create overlay store instance for this story
    const overlayStore = useMemo(() => createOverlayStore(), []);

    const getInitialTheme = () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'default';
      }
      return theme;
    };

    return (
      <ThemeProvider
        defaultTheme={getInitialTheme()}
        availableThemes={['default', 'dark']}
      >
        <StorybookThemeSync storybookTheme={theme}>
          <RTLProvider>
            <OverlayProvider overlayStore={overlayStore}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '100vh',
                  padding: '20px',
                }}
              >
                <Story />
              </div>
              <Overlay.Container overlayStore={overlayStore} />
            </OverlayProvider>
          </RTLProvider>
        </StorybookThemeSync>
      </ThemeProvider>
    );
  },
];

export const parameters = {
  options: {
    storySort: {
      order: [
        'Foundation',
        ['Token Studio', 'Tokens', 'Typography', 'Title', 'Icon'],
        'Data Display',
        ['Table', 'Badge', 'Chip', 'Status Indicator', 'Pagination', 'CardList'],
        'Overlay',
        [
          'Tooltip',
          'Popover',
          'Context Menu',
          'Modal',
          'ActionModal',
          'ResourceActionModal',
          'Dim',
          'Drawer',
          'Notification Center',
          'Floating Card',
        ],
        'Layout',
        [
          'Layout',
          'Disclosure',
          'Accordion',
          'Window Control',
          'Scrollbar',
          'Detail Header',
          'Section Card',
          'InfoContainer',
          'Wizard (Create Flow)',
          'Monitoring Toolbar',
        ],
        'Navigation',
        ['TopBar', 'TabBar', 'Tabs', 'TabSelector', 'Sidebar', 'AppHeaderTab', '*'],
        'Form',
        [
          'Button',
          'Input',
          'Textarea',
          'FormField',
          'Fieldset',
          'FilterSearch',
          'Select',
          'DatePicker',
          'Slider',
          'Toggle',
          'Checkbox',
          'Radio',
          'RadioGroup',
          '*',
        ],
        'Feedback',
        ['Inline Message', 'Loading', 'ProgressBar'],
        '*',
      ],
    },
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'system',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'system', title: '🖥️ System Theme' },
        { value: 'default', title: '☀️ Light Theme' },
        { value: 'dark', title: '🌙 Dark Theme' },
      ],
      showName: true,
      dynamicTitle: true,
    },
  },
  manualPlay: {
    name: 'Manual Play',
    description: 'Enable manual-only play function execution',
    defaultValue: false,
    toolbar: {
      icon: 'play',
      items: [
        { value: true, title: 'Auto Play' },
        { value: false, title: 'Manual Only' },
      ],
      showName: true,
      dynamicTitle: true,
    },
  },
};
