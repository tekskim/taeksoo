import { default as React } from 'react';
export interface TabBarItem {
    /** Unique identifier */
    id: string;
    /** Tab label */
    label: string;
    /** Icon (optional) */
    icon?: React.ReactNode;
    /** Whether the tab can be closed */
    closable?: boolean;
}
export interface TabBarProps {
    /** Tab items */
    tabs: TabBarItem[];
    /** Currently active tab id */
    activeTab: string;
    /** Callback when tab is selected */
    onTabChange: (tabId: string) => void;
    /** Callback when tab is closed */
    onTabClose?: (tabId: string) => void;
    /** Callback when add button is clicked */
    onTabAdd?: () => void;
    /** Callback when tabs are reordered via drag and drop */
    onTabReorder?: (fromIndex: number, toIndex: number) => void;
    /** Show add button */
    showAddButton?: boolean;
    /** Show window controls (minimize, maximize, close) */
    showWindowControls?: boolean;
    /** Show bottom border (default: true) */
    showBottomBorder?: boolean;
    /** Callback when minimize button is clicked */
    onMinimize?: () => void;
    /** Callback when maximize button is clicked */
    onMaximize?: () => void;
    /** Callback when window close button is clicked */
    onWindowClose?: () => void;
    /** Custom class name */
    className?: string;
}
export declare const TabBar: React.FC<TabBarProps>;
export interface UseTabBarOptions {
    /** Initial tabs */
    initialTabs?: TabBarItem[];
    /** Initial active tab id */
    initialActiveTab?: string;
    /** Callback to generate new tab */
    onCreateTab?: () => TabBarItem;
}
export declare function useTabBar(options?: UseTabBarOptions): {
    tabs: TabBarItem[];
    activeTab: string;
    addTab: (tab?: TabBarItem) => TabBarItem;
    closeTab: (tabId: string) => void;
    selectTab: (tabId: string) => void;
    setTabs: React.Dispatch<React.SetStateAction<TabBarItem[]>>;
};
export default TabBar;
