import { default as React, ReactNode } from 'react';
export interface TopBarProps {
    /** Callback when sidebar toggle is clicked */
    onSidebarToggle?: () => void;
    /** Callback when back button is clicked */
    onBack?: () => void;
    /** Callback when forward button is clicked */
    onForward?: () => void;
    /** Whether back button is disabled */
    canGoBack?: boolean;
    /** Whether forward button is disabled */
    canGoForward?: boolean;
    /** Breadcrumb content (use Breadcrumb component) */
    breadcrumb?: ReactNode;
    /** Right side actions (icons, buttons) */
    actions?: ReactNode;
    /** Show sidebar toggle button on the left */
    showSidebarToggle?: boolean;
    /** Show sidebar toggle button after breadcrumbs */
    showSidebarToggleAfterBreadcrumb?: boolean;
    /** Show navigation buttons */
    showNavigation?: boolean;
    /** Custom class name */
    className?: string;
}
export declare const TopBar: React.FC<TopBarProps>;
export interface TopBarActionProps {
    /** Icon to display */
    icon: ReactNode;
    /** Click handler */
    onClick?: () => void;
    /** Aria label for accessibility */
    'aria-label': string;
    /** Disabled state */
    disabled?: boolean;
    /** Show notification indicator (red dot) */
    badge?: boolean;
    /** Custom class name */
    className?: string;
}
export declare const TopBarAction: React.FC<TopBarActionProps>;
export default TopBar;
