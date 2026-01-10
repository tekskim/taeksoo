import { useState, useRef, useEffect, useCallback } from 'react';
import SettingsPage from './SettingsPage';
import { ChatbotPanel } from '@/components/ChatbotPanel';
import { 
  IconLayoutDashboard,
  IconCheck,
  IconPower,
  IconX,
  IconWindow,
  IconWindowMinimize,
} from '@tabler/icons-react';
import { Icons, ContextMenu, Modal, Button, NotificationCenter, WindowControls, Tooltip } from '@/design-system';
import { Link } from 'react-router-dom';
import { useDarkMode } from '@/hooks/useDarkMode';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import { Select } from '@/design-system';
import { ComputeHomePage } from './ComputeHomePage';
import { StorageHomePage } from './StorageHomePage';
import { ContainerDashboardPage } from './ContainerDashboardPage';
import { HomePage } from './HomePage';

// Desktop Icon Images (Figma exports)
import imgIam from '@/assets/desktop/iam.png';
import imgCompute from '@/assets/desktop/compute.png';
import imgStorage from '@/assets/desktop/storage.png';
import imgContainer from '@/assets/desktop/container.png';
import imgAi from '@/assets/desktop/ai.png';
import imgAgent from '@/assets/desktop/agent.png';
import imgSettings from '@/assets/desktop/settings.png';
import imgStorageAdmin from '@/assets/desktop/storage_admin.png';
import imgComputeAdmin from '@/assets/desktop/compute_admin.png';
import imgCloud from '@/assets/desktop/cloud.png';
import imgChatbot from '@/assets/desktop/chatbot.png';
import imgSymbol from '@/assets/desktop/symbol.svg';

/* ----------------------------------------
   Desktop Icon Component
   ---------------------------------------- */

interface DesktopIconProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

function DesktopIcon({ icon, label, onClick }: DesktopIconProps) {
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-2 w-16 cursor-pointer transition-transform hover:-translate-y-0.5 bg-transparent border-none p-0"
      onClick={onClick}
      aria-label={label}
    >
      <div className="w-16 h-16 flex items-center justify-center">
        <img 
          src={icon} 
          alt={label} 
          className="w-16 h-16 object-cover object-center"
        />
      </div>
      <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-white text-center whitespace-nowrap font-[Mona_Sans,sans-serif]">
        {label}
      </span>
    </button>
  );
}

/* ----------------------------------------
   Dock Icons Component (macOS Dock style)
   ---------------------------------------- */

interface DockApp {
  id: AppId;
  name: string;
  icon: string;
  isPinned: boolean;
  hasWindows: boolean;
  hasActiveWindow: boolean;
  windows: WindowState[];
}

interface DockIconsProps {
  apps: DockApp[];
  onAppClick: (appId: AppId) => void;
  onAppRightClick: (appId: AppId) => void;
  onTogglePin: (appId: AppId) => void;
  onWindowClick: (windowId: string) => void;
  onNewWindow: (appId: AppId) => void;
  onQuitApp: (appId: AppId) => void;
  onReorderApps: (order: AppId[]) => void;
}

function DockIcons({
  apps,
  onAppClick,
  onAppRightClick,
  onTogglePin,
  onWindowClick,
  onNewWindow,
  onQuitApp,
  onReorderApps,
}: DockIconsProps) {
  const [draggedAppId, setDraggedAppId] = useState<AppId | null>(null);
  const [hoveredAppId, setHoveredAppId] = useState<AppId | null>(null);

  const handleDragStart = (e: React.DragEvent, appId: AppId) => {
    setDraggedAppId(appId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetAppId: AppId) => {
    e.preventDefault();
    if (!draggedAppId || draggedAppId === targetAppId) {
      setDraggedAppId(null);
      return;
    }

    const currentOrder = apps.map(a => a.id);
    const draggedIndex = currentOrder.indexOf(draggedAppId);
    const targetIndex = currentOrder.indexOf(targetAppId);

    const newOrder = [...currentOrder];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedAppId);

    onReorderApps(newOrder);
    setDraggedAppId(null);
  };

  const getContextMenuItems = (app: DockApp) => {
    const items: any[] = [];

    // Window list
    if (app.windows.length > 0) {
      app.windows.forEach(window => {
        items.push({
          id: `window-${window.id}`,
          label: window.title,
          icon: window.isMinimized ? <IconWindowMinimize size={14} /> : <IconWindow size={14} />,
          onClick: () => onWindowClick(window.id),
        });
      });
      items.push({ id: 'divider-1', divider: true });
    }

    // Navigation items (for Compute app example)
    if (app.id === 'compute') {
      items.push(
        { id: 'instances', label: 'Instances', icon: <IconLayoutDashboard size={14} />, onClick: () => {} },
        { id: 'images', label: 'Images', onClick: () => {} },
        { id: 'dashboard', label: 'Dashboard', icon: <IconLayoutDashboard size={14} />, onClick: () => {} },
        { id: 'divider-2', divider: true }
      );
    }

    // New window
    items.push({
      id: 'new-window',
      label: 'New window',
      onClick: () => onNewWindow(app.id),
    });

    items.push({ id: 'divider-3', divider: true });

    // Pin to top bar
    items.push({
      id: 'pin',
      label: 'Pin to top bar',
      icon: app.isPinned ? <IconCheck size={14} /> : undefined,
      onClick: () => onTogglePin(app.id),
    });

    items.push({ id: 'divider-4', divider: true });

    // Quit
    items.push({
      id: 'quit',
      label: 'Quit',
      status: 'danger' as const,
      onClick: () => onQuitApp(app.id),
    });

    return items;
  };

  return (
    <div className="flex items-center gap-2">
      {apps.map((app) => {
        const isRunning = app.hasWindows;
        const isActive = app.hasActiveWindow;

        return (
          <ContextMenu
            key={app.id}
            trigger="contextmenu"
            items={getContextMenuItems(app)}
          >
            <Tooltip content={app.name} position="bottom">
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, app.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, app.id)}
                onMouseEnter={() => setHoveredAppId(app.id)}
                onMouseLeave={() => setHoveredAppId(null)}
                onClick={() => onAppClick(app.id)}
                className={`
                  w-6 h-6 cursor-pointer transition-all duration-200
                  ${isActive ? 'opacity-100 scale-110' : isRunning ? 'opacity-100' : 'opacity-70'}
                  ${hoveredAppId === app.id ? 'opacity-100 scale-110' : ''}
                  ${isRunning ? 'ring-2 ring-[var(--color-action-primary)] rounded' : ''}
                `}
              >
                <img 
                  src={app.icon} 
                  alt={app.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </Tooltip>
          </ContextMenu>
        );
      })}
    </div>
  );
}

/* ----------------------------------------
   Admin Center Icon Component (Multi-icon)
   ---------------------------------------- */

interface AdminCenterIconProps {
  onClick?: () => void;
  iconRef?: React.RefObject<HTMLButtonElement>;
}

function AdminCenterIcon({ onClick, iconRef }: AdminCenterIconProps) {
  return (
    <button
      ref={iconRef}
      type="button"
      className="flex flex-col items-center gap-2 w-16 cursor-pointer transition-transform hover:-translate-y-0.5 bg-transparent border-none p-0"
      onClick={onClick}
      aria-label="Admin Center"
    >
      <div className="bg-white/10 rounded-2xl p-2 flex flex-col gap-1">
        <div className="flex gap-1 items-center">
          <img src={imgStorageAdmin} alt="" className="w-[22px] h-[22px] object-cover" />
          <img src={imgComputeAdmin} alt="" className="w-[22px] h-[22px] object-cover" />
        </div>
        <div className="flex items-center">
          <img src={imgCloud} alt="" className="w-[22px] h-[22px] object-cover" />
        </div>
      </div>
      <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-white text-center whitespace-nowrap font-[Mona_Sans,sans-serif]">
        Admin Center
      </span>
    </button>
  );
}

/* ----------------------------------------
   Top Bar Component (Figma Style)
   ---------------------------------------- */

interface TopBarProps {
  onChatbotToggle: () => void;
  onOpenSettings?: (tab?: 'general' | 'account' | 'notifications' | 'information') => void;
  onNotificationToggle?: () => void;
  notificationButtonRef?: React.RefObject<HTMLButtonElement>;
  dockIcons?: React.ReactNode;
}

function DesktopTopBar({ onChatbotToggle, onOpenSettings, onNotificationToggle, notificationButtonRef, dockIcons }: TopBarProps) {
  const [selectedDomain, setSelectedDomain] = useState('domain-a');
  const { theme, setTheme } = useDarkMode();
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tds-language') || 'en';
    }
    return 'en';
  });
  const [showLanguageConfirmModal, setShowLanguageConfirmModal] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);

  // Settings 페이지와 동기화: localStorage 변경 감지
  useEffect(() => {
    const handleStorageChange = () => {
      const storedLanguage = localStorage.getItem('tds-language');
      if (storedLanguage && storedLanguage !== language) {
        setLanguage(storedLanguage);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // 같은 탭에서의 변경도 감지하기 위해 커스텀 이벤트 사용
    window.addEventListener('language-changed', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('language-changed', handleStorageChange);
    };
  }, [language]);

  const domainOptions = [
    { value: 'domain-a', label: 'Domain A' },
    { value: 'domain-b', label: 'Domain B' },
    { value: 'domain-c', label: 'Domain C' },
    { value: 'domain-d', label: 'Domain D' },
    { value: 'domain-e', label: 'Domain E' },
    { value: 'domain-f', label: 'Domain F' },
    { value: 'domain-g', label: 'Domain G' },
  ];

  const handleLanguageChange = (lang: string) => {
    // Skip confirmation if selecting the same value
    if (lang === language) return;
    
    const labels: Record<string, string> = { en: 'English', ko: 'Korean' };
    setPendingLanguage(lang);
    setShowLanguageConfirmModal(true);
  };

  const confirmLanguageChange = () => {
    if (!pendingLanguage) return;
    
    setLanguage(pendingLanguage);
    localStorage.setItem('tds-language', pendingLanguage);
    // Settings 페이지와 동기화를 위한 커스텀 이벤트 발생
    window.dispatchEvent(new CustomEvent('language-changed'));
    
    setShowLanguageConfirmModal(false);
    setPendingLanguage(null);
  };

  const cancelLanguageChange = () => {
    setShowLanguageConfirmModal(false);
    setPendingLanguage(null);
  };

  const handleThemeChange = (newTheme: string) => {
    // Theme는 즉시 반영
    setTheme(newTheme as 'light' | 'dark' | 'system');
  };

  const contextMenuItems = [
    {
      id: 'language',
      label: 'Language',
      submenuDirection: 'left',
      submenu: [
        {
          id: 'en',
          label: language === 'en' ? '✓ English' : 'English',
          onClick: () => handleLanguageChange('en'),
        },
        {
          id: 'ko',
          label: language === 'ko' ? '✓ Korean' : 'Korean',
          onClick: () => handleLanguageChange('ko'),
        },
      ],
      divider: true,
    },
    {
      id: 'theme',
      label: 'Theme',
      submenuDirection: 'left',
      submenu: [
        {
          id: 'system',
          label: theme === 'system' ? '✓ System theme' : 'System theme',
          onClick: () => handleThemeChange('system'),
        },
        {
          id: 'light',
          label: theme === 'light' ? '✓ Light' : 'Light',
          onClick: () => handleThemeChange('light'),
        },
        {
          id: 'dark',
          label: theme === 'dark' ? '✓ Dark' : 'Dark',
          onClick: () => handleThemeChange('dark'),
        },
      ],
    },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white flex items-center justify-between px-4 z-[1000] shadow-[2px_4px_4px_0px_rgba(0,0,0,0.11)]">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* THAKI Cloud Logo */}
        <div className="flex items-center gap-2">
          <img 
            src={ThakiLogoLight} 
            alt="THAKI Cloud" 
            className="h-5"
          />
        </div>
        
        {/* Divider */}
        <div className="h-6 flex items-center">
          <div className="w-px h-4 bg-[rgba(60,60,67,0.29)]" />
        </div>
        
        {/* Dock Icons - macOS Dock style */}
        {dockIcons}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 h-8">
        {/* Domain Selector - Using Select component */}
        <Select
          value={selectedDomain}
          onChange={(value) => setSelectedDomain(value)}
          options={domainOptions}
          size="sm"
          className="min-w-[100px]"
        />
        
        {/* Separator */}
        <div className="px-1.5 h-full flex items-center">
          <div className="w-px h-4 bg-[rgba(60,60,67,0.29)]" />
        </div>
        
        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <ContextMenu
            items={contextMenuItems}
            trigger="click"
          >
            <button className="w-6 h-6 flex items-center justify-center text-black/60 hover:text-black cursor-pointer transition-colors">
              <Icons.Finetuning size={24} stroke={1.5} />
            </button>
          </ContextMenu>
          <ContextMenu
            items={[
              {
                id: 'user-email',
                label: 'thaki.kim@example.com',
                onClick: () => {
                  onOpenSettings?.('account');
                },
                tooltip: 'Open settings page',
                tooltipPosition: 'left',
                divider: true,
              },
              {
                id: 'sign-out',
                label: 'Logout',
                onClick: () => {
                  // TODO: Implement logout and redirect to login page
                  // For now, do nothing as login page doesn't exist yet
                },
              },
            ]}
            trigger="click"
          >
            <button className="w-6 h-6 flex items-center justify-center text-black/60 hover:text-black cursor-pointer transition-colors">
              <Icons.UserCircle size={24} stroke={1.5} />
            </button>
          </ContextMenu>
          <button 
            ref={notificationButtonRef}
            onClick={onNotificationToggle}
            className="w-6 h-6 flex items-center justify-center text-black/60 hover:text-black cursor-pointer transition-colors"
          >
            <Icons.Notification size={24} stroke={1.5} />
          </button>
        </div>

        {/* Separator */}
        <div className="px-1.5 h-full flex items-center">
          <div className="w-px h-4 bg-[rgba(60,60,67,0.29)]" />
        </div>
        
        {/* AI Chatbot Toggle - Figma design: 3D purple chat bubble with AI face */}
        <button 
          className="w-8 h-8 flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
          onClick={onChatbotToggle}
          title="AI Chatbot"
        >
          <img 
            src={imgChatbot} 
            alt="AI Chatbot" 
            className="w-8 h-8 object-contain" 
            style={{ 
              mixBlendMode: 'multiply',
              filter: 'contrast(1.1)',
            }}
          />
        </button>
      </div>

      {/* Language Change Confirmation Modal */}
      <Modal
        isOpen={showLanguageConfirmModal}
        onClose={cancelLanguageChange}
        title="Confirm Language Change"
      >
        <p className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)] mb-6">
          {pendingLanguage && (
            <>Are you sure you want to change the language to <strong>{pendingLanguage === 'en' ? 'English' : 'Korean'}</strong>?</>
          )}
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={cancelLanguageChange}>Cancel</Button>
          <Button variant="primary" onClick={confirmLanguageChange}>Apply</Button>
        </div>
      </Modal>
    </div>
  );
}

/* ----------------------------------------
   Admin Center Popup Panel (Figma Style)
   ---------------------------------------- */

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
}

function AdminCenterPanel({ isOpen, onClose, anchorRef }: AdminPanelProps) {
  if (!isOpen) return null;
  
  // Calculate position based on anchor element
  const anchorRect = anchorRef.current?.getBoundingClientRect();
  const panelWidth = 412; // Approximate panel width (3 icons * 64px + 2 gaps * 50px + padding * 2)
  
  // Position panel below the icon, centered horizontally
  const top = anchorRect ? anchorRect.bottom + 12 : 222;
  const left = anchorRect ? anchorRect.left + (anchorRect.width / 2) - (panelWidth / 2) : 0;
  
  return (
    <>
      {/* Click outside to close */}
      <div 
        className="fixed inset-0 z-[500]" 
        onClick={onClose}
      />
      {/* Panel - positioned below Admin Center icon */}
      <div 
        className="fixed bg-white/10 rounded-2xl px-10 py-[22px] flex gap-[50px] items-center z-[501]"
        style={{ top: `${top}px`, left: `${left}px` }}
      >
        <div className="flex flex-col items-center gap-2 w-16">
          <img src={imgStorageAdmin} alt="Storage Admin" className="w-16 h-16 object-cover" />
          <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-white text-center font-[Mona_Sans,sans-serif]">Storage Admin</span>
        </div>
        <div className="flex flex-col items-center gap-2 w-16">
          <img src={imgComputeAdmin} alt="Compute Admin" className="w-16 h-16 object-cover" />
          <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-white text-center font-[Mona_Sans,sans-serif]">Compute Admin</span>
        </div>
        <div className="flex flex-col items-center gap-2 w-16">
          <img src={imgCloud} alt="Cloud Builder" className="w-16 h-16 object-cover" />
          <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium text-white text-center font-[Mona_Sans,sans-serif]">Cloud Builder</span>
        </div>
      </div>
    </>
  );
}

/* ----------------------------------------
   Desktop Page Component
   ---------------------------------------- */

/* ----------------------------------------
   Window Management Types
   ---------------------------------------- */

type AppId = 'compute' | 'storage' | 'container' | 'agent' | 'ai-platform' | 'iam';

interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  isActive: boolean;
  zIndex: number;
  createdAt: number;
}

interface AppState {
  id: AppId;
  name: string;
  icon: string;
  isPinned: boolean;
  windows: WindowState[];
}

/* ----------------------------------------
   Window Component for Page Overlay
   ---------------------------------------- */

interface PageWindowProps {
  windowId: string;
  isOpen: boolean;
  isMinimized: boolean;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  title: string;
  children: React.ReactNode;
  zIndex: number;
}

function PageWindow({ windowId, isOpen, isMinimized, isActive, onClose, onMinimize, onFocus, title, children, zIndex }: PageWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 1200, height: 800 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && windowRef.current) {
      windowRef.current.focus();
    }
  }, [isActive]);

  if (!isOpen || isMinimized) return null;

  const handleMinimize = () => {
    onMinimize();
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    } else {
      setSize({ width: 1200, height: 800 });
      setPosition({ x: 100, y: 100 });
    }
  };

  const windowStyle = isMaximized
    ? {
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        zIndex: zIndex,
      }
    : {
        width: `${size.width}px`,
        height: `${size.height}px`,
        top: `${position.y}px`,
        left: `${position.x}px`,
        zIndex: zIndex,
      };

  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2000 + zIndex }}
    >
      <div
        ref={windowRef}
        className={`absolute bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg shadow-2xl flex flex-col overflow-hidden pointer-events-auto ${
          isActive ? 'ring-2 ring-[var(--color-action-primary)]' : ''
        }`}
        style={windowStyle}
        onClick={onFocus}
        onMouseDown={onFocus}
      >
        {/* Window Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)] shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] truncate">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <WindowControls
              onMinimize={handleMinimize}
              onMaximize={handleMaximize}
              onClose={onClose}
              isMaximized={isMaximized}
            />
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DesktopPage() {
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'general' | 'account' | 'notifications' | 'information'>('general');
  const [showChatbot, setShowChatbot] = useState(false);
  const [showAdminCenter, setShowAdminCenter] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const adminCenterIconRef = useRef<HTMLButtonElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  // Window Management System
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [appConfigs] = useState<Record<AppId, { name: string; icon: string; component: React.ReactNode }>>({
    'compute': { name: 'Compute', icon: imgCompute, component: <ComputeHomePage /> },
    'storage': { name: 'Storage', icon: imgStorage, component: <StorageHomePage /> },
    'container': { name: 'Container', icon: imgContainer, component: <ContainerDashboardPage /> },
    'agent': { name: 'Agent Ops', icon: imgAgent, component: <HomePage /> },
    'ai-platform': { name: 'AI Platform', icon: imgAi, component: null },
    'iam': { name: 'IAM', icon: imgIam, component: null },
  });
  const [pinnedApps, setPinnedApps] = useState<Set<AppId>>(new Set(['compute', 'storage', 'container', 'agent']));
  const [dockAppOrder, setDockAppOrder] = useState<AppId[]>(['storage', 'container', 'ai-platform', 'agent']);

  // Window management functions
  const createWindow = useCallback((appId: AppId) => {
    const config = appConfigs[appId];
    if (!config || !config.component) return;

    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      title: config.name,
      isMinimized: false,
      isActive: true,
      zIndex: nextZIndex,
      createdAt: Date.now(),
    };

    setWindows(prev => prev.map(w => ({ ...w, isActive: false })).concat(newWindow));
    setNextZIndex(prev => prev + 1);
  }, [appConfigs, nextZIndex]);

  const closeWindow = useCallback((windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
  }, []);

  const minimizeWindow = useCallback((windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: true, isActive: false } : w
    ));
  }, []);

  const focusWindow = useCallback((windowId: string) => {
    setWindows(prev => {
      const targetWindow = prev.find(w => w.id === windowId);
      if (!targetWindow) return prev;

      return prev.map(w => ({
        ...w,
        isActive: w.id === windowId,
        isMinimized: w.id === windowId ? false : w.isMinimized,
        zIndex: w.id === windowId ? nextZIndex : w.zIndex,
      }));
    });
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const focusApp = useCallback((appId: AppId) => {
    const appWindows = windows.filter(w => w.appId === appId);
    if (appWindows.length === 0) {
      createWindow(appId);
      return;
    }

    // If app has windows, focus the most recent one
    const mostRecent = appWindows.sort((a, b) => b.createdAt - a.createdAt)[0];
    if (mostRecent.isMinimized) {
      focusWindow(mostRecent.id);
    } else {
      focusWindow(mostRecent.id);
    }
  }, [windows, createWindow, focusWindow]);

  const togglePinApp = useCallback((appId: AppId) => {
    setPinnedApps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(appId)) {
        newSet.delete(appId);
      } else {
        newSet.add(appId);
      }
      return newSet;
    });
  }, []);

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'info' as const,
      message: 'System maintenance scheduled for tonight',
      time: '2h ago',
      project: 'Infrastructure',
      isRead: false,
    },
    {
      id: '2',
      type: 'success' as const,
      message: 'Instance created successfully',
      time: '5h ago',
      project: 'Compute',
      isRead: false,
    },
    {
      id: '3',
      type: 'error' as const,
      message: 'Failed to create volume snapshot',
      time: '1d ago',
      project: 'Storage',
      isRead: true,
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="fixed inset-0 bg-[#353535] overflow-hidden">
      {/* Top Bar */}
      <DesktopTopBar 
        onChatbotToggle={() => setShowChatbot(!showChatbot)}
        onOpenSettings={(tab) => {
          if (tab) {
            setSettingsTab(tab);
          }
          setShowSettings(true);
        }}
        onNotificationToggle={() => setShowNotifications(!showNotifications)}
        notificationButtonRef={notificationButtonRef}
        dockIcons={
          <DockIcons
            apps={dockAppOrder.map(appId => ({
              id: appId,
              name: appConfigs[appId].name,
              icon: appConfigs[appId].icon,
              isPinned: pinnedApps.has(appId),
              hasWindows: windows.some(w => w.appId === appId && !w.isMinimized),
              hasActiveWindow: windows.some(w => w.appId === appId && w.isActive),
              windows: windows.filter(w => w.appId === appId),
            }))}
            onAppClick={focusApp}
            onAppRightClick={(appId) => {
              // Context menu will be handled by ContextMenu component
            }}
            onTogglePin={togglePinApp}
            onWindowClick={focusWindow}
            onNewWindow={createWindow}
            onQuitApp={(appId) => {
              setWindows(prev => prev.filter(w => w.appId !== appId));
            }}
            onReorderApps={setDockAppOrder}
          />
        }
      />

      {/* Desktop Icons Row - Positioned like Figma */}
      <div className="absolute top-[110px] left-[44px] flex flex-row items-start gap-[72px]">
        <DesktopIcon 
          icon={imgIam}
          label="IAM"
          onClick={() => {
            // TODO: Implement IAM window
            console.log('IAM clicked - not implemented yet');
          }}
        />
        <DesktopIcon 
          icon={imgCompute}
          label="Compute"
          onClick={() => setShowCompute(true)}
        />
        <DesktopIcon 
          icon={imgStorage}
          label="Storage"
          onClick={() => setShowStorage(true)}
        />
        <DesktopIcon 
          icon={imgContainer}
          label="Container"
          onClick={() => setShowContainer(true)}
        />
        <DesktopIcon 
          icon={imgAi}
          label="AI Platform"
          onClick={() => {
            // TODO: Implement AI Platform window
            console.log('AI Platform clicked - not implemented yet');
          }}
        />
        <DesktopIcon 
          icon={imgAgent}
          label="Agent Ops"
          onClick={() => setShowAgent(true)}
        />
        <DesktopIcon 
          icon={imgSettings}
          label="Settings"
          onClick={() => setShowSettings(true)}
        />
        <AdminCenterIcon 
          iconRef={adminCenterIconRef}
          onClick={() => setShowAdminCenter(!showAdminCenter)}
        />
      </div>

      {/* Admin Center Panel */}
      <AdminCenterPanel 
        isOpen={showAdminCenter}
        onClose={() => setShowAdminCenter(false)}
        anchorRef={adminCenterIconRef}
      />

      {/* Settings Window */}
      <SettingsPage 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        initialTab={settingsTab}
      />

      {/* Chatbot Panel */}
      <ChatbotPanel 
        isOpen={showChatbot} 
        onClose={() => setShowChatbot(false)} 
      />

      {/* Notification Center */}
      {showNotifications && notificationButtonRef.current && (() => {
        const rect = notificationButtonRef.current.getBoundingClientRect();
        const notificationWidth = 360; // NotificationCenter width
        const left = rect.right - notificationWidth;
        const top = rect.bottom + 4;
        
        return (
          <>
            {/* Click outside to close */}
            <div 
              className="fixed inset-0 z-[6000]" 
              onClick={() => setShowNotifications(false)}
            />
            <div
              className="fixed z-[6001]"
              onClick={(e) => e.stopPropagation()}
              style={{
                top: `${top}px`,
                left: `${Math.max(8, left)}px`, // Ensure it doesn't go off-screen
              }}
            >
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClose={() => setShowNotifications(false)}
              />
            </div>
          </>
        );
      })()}

      {/* App Windows */}
      {windows.map((window) => {
        const config = appConfigs[window.appId];
        if (!config || !config.component) return null;

        return (
          <PageWindow
            key={window.id}
            windowId={window.id}
            isOpen={true}
            isMinimized={window.isMinimized}
            isActive={window.isActive}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onFocus={() => focusWindow(window.id)}
            title={window.title}
            zIndex={window.zIndex}
          >
            {config.component}
          </PageWindow>
        );
      })}

      {/* Main Page Navigation Button - Bottom Left */}
      <Link 
        to="/"
        className="absolute bottom-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all hover:-translate-y-0.5"
      >
        <IconLayoutDashboard size={18} stroke={1.5} />
        <span>Go to main page</span>
      </Link>
    </div>
  );
}

export default DesktopPage;
