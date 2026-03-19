/**
 * AppLayout component Tailwind styles
 */
import { cva } from 'class-variance-authority';

// AppLayout container
export const layoutContainerStyles = 'flex h-screen overflow-hidden';

// Main content
export const mainContentStyles = 'flex-1 flex flex-col overflow-hidden';

// App header
export const appHeaderStyles = 'bg-surface-muted border-b border-border p-0';

// Header content
export const headerContentStyles = 'w-full gap-2';

// Side content container
export const sideContentStyles = 'flex';

// Side header - width matches sidebar (200px), with sliding animation
// Figma: no left padding (icon has its own), pr-[12px] for toggle spacing
// Bottom stroke added per Figma spec
export const sideHeaderStyles = cva(
  [
    'flex items-center justify-between',
    'bg-surface',
    'transition-all duration-300 ease-in-out',
    'overflow-hidden',
  ],
  {
    variants: {
      collapsed: {
        true: 'w-0 min-w-0 px-0 border-r-0 border-b-0 opacity-0',
        false:
          'w-[200px] min-w-[200px] pr-[12px] opacity-100 border-r border-b border-border',
      },
      // Container app: show only icon when collapsed (40px wide)
      collapsedWithIcon: {
        true: 'w-[40px] min-w-[40px] px-0 opacity-100 border-r-0 border-b-[0.5px] border-primitive-coolGray-200',
        false: '',
      },
      // Wide sidebar (240px) for apps like Container with two-level sidebar
      wide: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Wide sidebar when expanded: 240px instead of 200px, with matching border color
      {
        collapsed: false,
        collapsedWithIcon: false,
        wide: true,
        className:
          'w-[240px] min-w-[240px] border-r-[0.5px] border-b-[0.5px] border-primitive-coolGray-200',
      },
    ],
    defaultVariants: {
      collapsed: false,
      collapsedWithIcon: false,
      wide: false,
    },
  }
);

// Sidebar toggle button
export const sidebarToggleStyles = cva('flex-shrink-0', {
  variants: {
    collapsed: {
      true: 'mr-2',
      false: '',
    },
  },
});

// Collapsed toggle container (when sidebar is closed)
export const collapsedToggleContainerStyles =
  'flex items-center justify-center px-2 border-r border-border bg-surface';

// Header sidebar toggle button (when sidebar is collapsed)
export const headerSidebarToggleStyles = 'flex-shrink-0 ml-1';

// Sidebar logo
export const sidebarLogoStyles =
  'w-auto max-w-[129px] object-contain flex-shrink-0';

// App icon wrapper - Figma: px-8 py-4, shrink-0
export const appIconWrapperStyles = 'flex items-center px-[8px] py-[4px] shrink-0';

// App icon itself - Figma: 24x24
export const appIconStyles = 'size-[24px] object-contain';

// App name text - Figma: 14px, fontWeight/medium, lineHeight/md (20px), text-default
// flex-1 to push toggle to the right via parent's justify-between
export const appNameStyles =
  'text-[14px] font-medium text-text-default truncate leading-[20px] flex-1 min-w-0';

// Content area (contains sidebar + main panel)
export const contentStyles =
  'flex-1 overflow-hidden bg-background';

// Main panel (scroll handled by TabContent inside)
export const mainPanelStyles = 'flex-1 flex flex-col min-w-0 overflow-hidden';

// AppHeaderTab styles
export const appHeaderContainerStyles =
  'flex items-stretch gap-sm flex-1 min-w-0 box-border bg-surface-muted p-0';

// Home button
export const homeButtonStyles =
  'p-2 rounded-sm transition-colors flex-shrink-0 h-8 w-8 flex items-center justify-center hover:bg-surface-hover active:bg-surface-pressed';
