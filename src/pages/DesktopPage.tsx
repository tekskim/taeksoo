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
import { Icons, ContextMenu, Modal, Button, NotificationCenter, WindowControls, Tooltip, IconWindowActive, IconWindowMinimized } from '@/design-system';
import { motion, Reorder } from 'framer-motion';
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

/* ----------------------------------------
   DockIcon - Individual Icon with Magnification
   ---------------------------------------- */

interface DockIconItemProps {
  app: DockApp;
  isDragging: boolean;
  onAppClick: (appId: AppId) => void;
  getContextMenuItems: (app: DockApp) => any[];
}

function DockIconItem({
  app,
  isDragging,
  onAppClick,
  getContextMenuItems,
}: DockIconItemProps) {
  const isRunning = app.hasWindows;
  const isActive = app.hasActiveWindow;

  return (
    <ContextMenu
      trigger="contextmenu"
      items={getContextMenuItems(app)}
    >
      <Tooltip content={app.name} position="bottom">
        <motion.div
          layoutId={app.id}
          onClick={() => onAppClick(app.id)}
          className={`
            relative cursor-pointer flex items-center justify-center
            ${isDragging ? 'z-50' : 'z-0'}
          `}
          whileDrag={{
            scale: 1.1,
            zIndex: 50,
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
          }}
        >
          <div
            className={`
              w-7 h-7 rounded-lg overflow-hidden
              ${isRunning ? 'p-0.5 border-2 border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]' : ''}
              ${isActive ? 'border-[var(--color-action-primary)]' : ''}
            `}
          >
            <img 
              src={app.icon} 
              alt={app.name} 
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          </div>
        </motion.div>
      </Tooltip>
    </ContextMenu>
  );
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
  const [isDragging, setIsDragging] = useState(false);
  
  // 앱 순서를 로컬 상태로 관리 (Reorder용)
  const [localApps, setLocalApps] = useState(apps);
  
  // apps prop이 변경되면 localApps 동기화
  useEffect(() => {
    setLocalApps(apps);
  }, [apps]);

  const handleReorder = (newOrder: DockApp[]) => {
    setLocalApps(newOrder);
    onReorderApps(newOrder.map(app => app.id));
  };

  const getContextMenuItems = (app: DockApp) => {
    const items: any[] = [];

    // Window list
    if (app.windows.length > 0) {
      app.windows.forEach(window => {
        // 윈도우 상태에 따른 아이콘 결정
        let windowIcon: React.ReactNode;
        if (window.isMinimized) {
          // Minimized 상태: Window_minimized 아이콘
          windowIcon = <IconWindowMinimized size={16} stroke={1} />;
        } else if (window.isActive) {
          // Normal + Focus in 상태: Check + Window_active 아이콘
          windowIcon = (
            <span className="flex items-center gap-1">
              <IconCheck size={16} stroke={1} />
              <IconWindowActive size={16} stroke={1} />
            </span>
          );
        } else {
          // Normal + Focus out 상태: Window_active 아이콘
          windowIcon = <IconWindowActive size={16} stroke={1} />;
        }

        items.push({
          id: `window-${window.id}`,
          label: window.title,
          icon: windowIcon,
          onClick: () => onWindowClick(window.id),
        });
      });
      // Divider after window list
      items.push({ id: 'divider-windows', label: '', divider: true });
    }

    // New window
    items.push({
      id: 'new-window',
      label: 'New window',
      onClick: () => onNewWindow(app.id),
    });

    items.push({ id: 'divider-3', divider: true });

    // Pin / Unpin
    items.push({
      id: 'pin',
      label: app.isPinned ? 'Unpin' : 'Pin',
      onClick: () => onTogglePin(app.id),
    });

    items.push({ id: 'divider-4', divider: true });

    // Quit
    items.push({
      id: 'quit',
      label: 'Quit',
      onClick: () => onQuitApp(app.id),
    });

    return items;
  };

  return (
    <Reorder.Group
      as="div"
      axis="x"
      values={localApps}
      onReorder={handleReorder}
      className="flex items-center gap-2"
    >
      {localApps.map((app) => (
        <Reorder.Item
          key={app.id}
          value={app}
          as="div"
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          dragListener={true}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          layout
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 25,
          }}
          whileDrag={{
            scale: 1.15,
            zIndex: 50,
            cursor: 'grabbing',
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          <DockIconItem
            app={app}
            isDragging={isDragging}
            onAppClick={onAppClick}
            getContextMenuItems={getContextMenuItems}
          />
        </Reorder.Item>
      ))}
    </Reorder.Group>
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

type AppId = 'compute' | 'storage' | 'container' | 'agent' | 'ai-platform' | 'iam' | 'settings';

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
  // Dock menu 시뮬레이션 모드 - 실제 앱 실행 없이 인터랙션만 테스트
  const isSimulationMode = true;
  
  // Mock up 초기 상태: Compute, Storage, Container는 실행중
  // Compute 앱의 윈도우들: Instances (Focus in), Images (Focus out), Dashboard (Minimized)
  const [windows, setWindows] = useState<WindowState[]>(() => {
    const computeWindows: WindowState[] = [
      { id: 'compute-instances', appId: 'compute', title: 'Instances', isMinimized: false, isActive: true, zIndex: 3, createdAt: Date.now() - 3000 },
      { id: 'compute-images', appId: 'compute', title: 'Images', isMinimized: false, isActive: false, zIndex: 2, createdAt: Date.now() - 2000 },
      { id: 'compute-dashboard', appId: 'compute', title: 'Dashboard', isMinimized: true, isActive: false, zIndex: 1, createdAt: Date.now() - 1000 },
    ];
    const storageWindow: WindowState = { id: 'storage-1', appId: 'storage', title: 'Storage', isMinimized: false, isActive: false, zIndex: 1, createdAt: Date.now() - 5000 };
    const containerWindow: WindowState = { id: 'container-1', appId: 'container', title: 'Container', isMinimized: false, isActive: false, zIndex: 1, createdAt: Date.now() - 4000 };
    return [...computeWindows, storageWindow, containerWindow];
  });
  const [nextZIndex, setNextZIndex] = useState(10);
  const [appConfigs] = useState<Record<AppId, { name: string; icon: string; component: React.ReactNode }>>({
    'compute': { name: 'Compute', icon: imgCompute, component: <ComputeHomePage /> },
    'storage': { name: 'Storage', icon: imgStorage, component: <StorageHomePage /> },
    'container': { name: 'Container', icon: imgContainer, component: <ContainerDashboardPage /> },
    'agent': { name: 'Agent Ops', icon: imgAgent, component: <HomePage /> },
    'ai-platform': { name: 'AI Platform', icon: imgAi, component: null },
    'iam': { name: 'IAM', icon: imgIam, component: null },
    'settings': { name: 'Settings', icon: imgSettings, component: null },
  });
  // Mock up: Compute, Storage, Container는 실행중, AI Platform, Agent Ops, Settings는 Pin만 되어있음
  const [pinnedApps, setPinnedApps] = useState<Set<AppId>>(new Set(['ai-platform', 'agent', 'settings']));
  const [dockAppOrder, setDockAppOrder] = useState<AppId[]>(['compute', 'storage', 'container', 'ai-platform', 'agent', 'settings']);

  // Window management functions
  const createWindow = useCallback((appId: AppId) => {
    const config = appConfigs[appId];
    if (!config) return;
    
    // 시뮬레이션 모드: 실제 UI 윈도우 없이 상태만 업데이트
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
    
    if (isSimulationMode) {
      console.log(`[Simulation] New window created for ${appId}: ${newWindow.title}`);
    }
  }, [appConfigs, nextZIndex, isSimulationMode]);

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

  // 모든 윈도우의 포커스를 해제 (Focus out)
  const blurAllWindows = useCallback(() => {
    setWindows(prev => prev.map(w => ({ ...w, isActive: false })));
  }, []);

  const focusApp = useCallback((appId: AppId) => {
    // 시뮬레이션 모드: 왼쪽 클릭 시 실제 앱 실행하지 않음
    // 우클릭 ContextMenu만 테스트하는 용도
    if (isSimulationMode) {
      console.log(`[Simulation] Left-click on ${appId} - no action (use right-click for context menu)`);
      return;
    }
    
    const appWindows = windows.filter(w => w.appId === appId);
    
    // 1) 앱이 실행되고 있지 않은 경우 → 실행 (새 창)
    if (appWindows.length === 0) {
      createWindow(appId);
      return;
    }

    // 2) 앱이 실행중이나 Focus Out된 경우 → 가장 마지막에 Focus In 되었던 윈도우로 다시 Focus In
    const activeWindows = appWindows.filter(w => !w.isMinimized);
    if (activeWindows.length > 0) {
      // zIndex가 가장 높은 윈도우 (가장 최근에 포커스된 윈도우)
      const mostRecent = activeWindows.sort((a, b) => b.zIndex - a.zIndex)[0];
      focusWindow(mostRecent.id);
      return;
    }

    // 3) 앱이 실행중이나 모두 최소화된 경우 → 가장 나중에 최소화된 윈도우를 이전 크기로 복원(Restore)
    const minimizedWindows = appWindows.filter(w => w.isMinimized);
    if (minimizedWindows.length > 0) {
      // 가장 나중에 최소화된 윈도우 (zIndex가 가장 높은 것)
      const lastMinimized = minimizedWindows.sort((a, b) => b.zIndex - a.zIndex)[0];
      focusWindow(lastMinimized.id);
    }
  }, [windows, createWindow, focusWindow, isSimulationMode]);

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

  // 데스크탑 배경 클릭 시 모든 윈도우 포커스 해제
  const handleDesktopClick = useCallback((e: React.MouseEvent) => {
    // 클릭한 대상이 현재 요소 자체인 경우에만 blur (자식 요소 클릭은 무시)
    if (e.target === e.currentTarget) {
      blurAllWindows();
    }
  }, [blurAllWindows]);

  return (
    <div 
      className="fixed inset-0 bg-[#353535] overflow-hidden"
      onClick={handleDesktopClick}
    >
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
            onWindowClick={(windowId) => {
              if (isSimulationMode) {
                console.log(`[Simulation] Window clicked: ${windowId}`);
                // 시뮬레이션 모드에서는 상태만 업데이트
                focusWindow(windowId);
              } else {
                focusWindow(windowId);
              }
            }}
            onNewWindow={(appId) => {
              if (isSimulationMode) {
                console.log(`[Simulation] New window requested for: ${appId}`);
              }
              createWindow(appId);
            }}
            onQuitApp={(appId) => {
              if (isSimulationMode) {
                console.log(`[Simulation] Quit app: ${appId}`);
              }
              setWindows(prev => prev.filter(w => w.appId !== appId));
            }}
            onReorderApps={setDockAppOrder}
          />
        }
      />

      {/* Desktop Icons Row - Positioned like Figma */}
      <div 
        className="absolute top-[110px] left-[44px] flex flex-row items-start gap-[72px]"
        onClick={handleDesktopClick}
      >
        <DesktopIcon 
          icon={imgIam}
          label="IAM"
          onClick={() => {
            console.log('IAM clicked - not implemented yet');
          }}
        />
        <DesktopIcon 
          icon={imgCompute}
          label="Compute"
          onClick={() => {
            console.log('Compute clicked');
          }}
        />
        <DesktopIcon 
          icon={imgStorage}
          label="Storage"
          onClick={() => {
            console.log('Storage clicked');
          }}
        />
        <DesktopIcon 
          icon={imgContainer}
          label="Container"
          onClick={() => {
            console.log('Container clicked');
          }}
        />
        <DesktopIcon 
          icon={imgAi}
          label="AI Platform"
          onClick={() => {
            console.log('AI Platform clicked - not implemented yet');
          }}
        />
        <DesktopIcon 
          icon={imgAgent}
          label="Agent Ops"
          onClick={() => {
            console.log('Agent Ops clicked');
          }}
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

      {/* App Windows - 시뮬레이션 모드에서는 실제 윈도우 UI를 표시하지 않음 */}
      {!isSimulationMode && windows.map((window) => {
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
