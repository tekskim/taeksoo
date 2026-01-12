import { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
} from '@/design-system';
import { NotificationCenter, type NotificationItem } from '@/design-system/components/NotificationCenter';
import { Sidebar } from '@/components/Sidebar';
import { useTabs } from '@/contexts/TabContext';
import { IconBell } from '@tabler/icons-react';

/* ----------------------------------------
   Mock Notifications Data
   ---------------------------------------- */

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'success',
    message: 'Instance "web-server-01" created successfully.',
    time: '10:23',
    project: 'Proj1',
    isRead: false,
  },
  {
    id: '2',
    type: 'success',
    message: 'Instance "web-server-01" created successfully.',
    time: '10:15',
    project: 'Proj1',
    isRead: false,
  },
  {
    id: '3',
    type: 'success',
    message: 'Instance "web-server-01" created successfully.',
    time: '09:45',
    project: 'Proj1',
    isRead: true,
  },
  {
    id: '4',
    type: 'error',
    message: 'Failed to create volume "data-vol-02".',
    time: '09:30',
    project: 'Proj1',
    isRead: false,
  },
];

/* ----------------------------------------
   Route to Label Mapping
   ---------------------------------------- */

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/instances': 'Instances',
  '/instance-templates': 'Instance templates',
  '/instance-snapshots': 'Instance snapshots',
  '/images': 'Images',
  '/flavors': 'Flavors',
  '/key-pairs': 'Key pairs',
  '/server-groups': 'Server groups',
  '/volumes': 'Volumes',
  '/design-system': 'Design system',
};

function getBreadcrumbLabel(path: string): string {
  return routeLabels[path] || path.split('/').pop() || 'Page';
}

/* ----------------------------------------
   AppLayout Component
   ---------------------------------------- */

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  // Notification state
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | undefined>();
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };

    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationOpen]);

  // Handle mark notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Handle notification click
  const handleNotificationClick = (notification: NotificationItem) => {
    setSelectedNotificationId(notification.id);
    handleMarkAsRead(notification.id);
  };

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Convert tabs to TabBar format
  const tabBarTabs = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    closable: tab.closable,
  }));

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    selectTab(tabId);
  };

  // Handle tab close
  const handleTabClose = (tabId: string) => {
    closeTab(tabId);
  };

  // Get current page label for breadcrumb
  const currentLabel = getBreadcrumbLabel(location.pathname);

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      <main
        className={`absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200 ${
          sidebarOpen ? 'left-[200px]' : 'left-0'
        }`}
      >
        {/* Fixed Header Area */}
        <div className="shrink-0 bg-[var(--color-surface-default)]">
          {/* Tab Bar */}
          <TabBar
            tabs={tabBarTabs}
            activeTab={activeTabId}
            onTabChange={handleTabChange}
            onTabClose={handleTabClose}
            onTabAdd={addNewTab}
            onTabReorder={moveTab}
            showAddButton={true}
            showWindowControls={true}
            onWindowClose={() => navigate('/')}
          />

          {/* Top Bar */}
          <TopBar
            showSidebarToggle={!sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(true)}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Proj-1', href: '/project' },
                  { label: currentLabel },
                ]}
              />
            }
            actions={
              <div className="relative" ref={notificationRef}>
                <TopBarAction
                  icon={<IconBell size={16} stroke={1.5} />}
                  aria-label="Notifications"
                  badge={unreadCount > 0}
                  onClick={() => setNotificationOpen(!notificationOpen)}
                />
                {notificationOpen && (
                  <div className="absolute top-full right-0 mt-2 z-50">
                    <NotificationCenter
                      notifications={notifications}
                      selectedId={selectedNotificationId}
                      onMarkAsRead={handleMarkAsRead}
                      onMarkAllAsRead={handleMarkAllAsRead}
                      onNotificationClick={handleNotificationClick}
                      onClose={() => setNotificationOpen(false)}
                    />
                  </div>
                )}
              </div>
            }
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}

export default AppLayout;

