import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import type {
  MouseEvent,
  CSSProperties,
  ReactNode,
  RefObject,
  Dispatch,
  SetStateAction,
} from 'react';
import SettingsPage from './SettingsPage';
import { ChatbotPanel } from '@/components/ChatbotPanel';
import {
  IconLayoutGrid,
  IconCheck,
  IconX,
  IconSearch,
  IconLayoutDashboard,
} from '@tabler/icons-react';
import {
  Icons,
  ContextMenu,
  Modal,
  Button,
  NotificationCenter,
  WindowControls,
  Tooltip,
  IconWindowActive,
  IconWindowMinimized,
} from '@/design-system';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import {
  Link,
  MemoryRouter,
  Routes,
  Route,
  UNSAFE_LocationContext,
  UNSAFE_RouteContext,
} from 'react-router-dom';
import { useDarkMode } from '@/hooks/useDarkMode';

// Small inline hook that avoids React context issues in isolated MemoryRouter trees
function useDesktopTheme() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}
import { DesktopWindowProvider } from '@/contexts/DesktopWindowContext';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';

// Background asset (shared; can be differentiated per role/theme when distinct assets are available)
import DesktopBg from '@/assets/bg-01.jpg';

import { computeRoutes } from '@/routes/compute.routes';
import { storageRoutes } from '@/routes/storage.routes';
import { agentRoutes } from '@/routes/agent.routes';
import { iamRoutes } from '@/routes/iam.routes';
import { containerRoutes } from '@/routes/container.routes';
import { ComputeHomePage } from './ComputeHomePage';
import { StorageHomePage } from './StorageHomePage';
import { HomePage } from './HomePage';
import { AIPlatformPage } from './AIPlatformPage';
import { CloudBuilderPage } from './CloudBuilderPage';

// App Icon Images
import imgIam from '@/assets/appIcon/iam.png';
import imgCompute from '@/assets/appIcon/compute.png';
import imgStorage from '@/assets/appIcon/storage.png';
import imgContainer from '@/assets/appIcon/container.png';
import imgAi from '@/assets/appIcon/aiplatform.png';
import imgAgent from '@/assets/appIcon/agentops.png';
import imgSettings from '@/assets/appIcon/settings.png';
import imgStorageAdmin from '@/assets/appIcon/storageadmin.png';
import imgComputeAdmin from '@/assets/appIcon/computeadmin.png';
import imgCloud from '@/assets/appIcon/cloudbuilder.png';
import imgAdminCenter from '@/assets/appIcon/admincenter.png';
import imgAIChat from '@/assets/appIcon/chat.png';

/* ────────────────────────────────────────────
   Role Type
   ──────────────────────────────────────────── */

type UserRole = 'domain' | 'system-admin';

/* ────────────────────────────────────────────
   App catalog per role (v1.0 policy §4)
   ──────────────────────────────────────────── */

type AppId =
  | 'iam'
  | 'compute'
  | 'storage'
  | 'container'
  | 'axion-core'
  | 'axion-hub'
  | 'axion-infra'
  | 'axion-ml-studio'
  | 'axion-serve'
  | 'axion-ops'
  | 'agent'
  | 'ai-platform'
  | 'app-catalog'
  | 'settings'
  | 'log'
  | 'audit'
  | 'kms'
  | 'security'
  | 'admin-storage'
  | 'admin-compute'
  | 'admin-center'
  | 'cloudbuilder';

interface AppConfig {
  id: AppId;
  name: string;
  icon: string;
  initialPath: string;
}

const DOMAIN_APPS: AppConfig[] = [
  { id: 'iam', name: 'IAM', icon: imgIam, initialPath: '/iam' },
  { id: 'compute', name: 'Compute', icon: imgCompute, initialPath: '/compute' },
  { id: 'storage', name: 'Storage', icon: imgStorage, initialPath: '/storage' },
  { id: 'container', name: 'Container', icon: imgContainer, initialPath: '/container' },
  { id: 'axion-core', name: 'Axion Core', icon: imgAi, initialPath: '/ai-platform' },
  { id: 'axion-hub', name: 'Axion Hub', icon: imgAi, initialPath: '/ai-platform' },
  { id: 'axion-infra', name: 'Axion Infra', icon: imgAi, initialPath: '/ai-platform' },
  { id: 'axion-ml-studio', name: 'Axion ML Studio', icon: imgAi, initialPath: '/ai-platform' },
  { id: 'axion-serve', name: 'Axion Serve', icon: imgAi, initialPath: '/ai-platform' },
  { id: 'axion-ops', name: 'Axion Ops', icon: imgAgent, initialPath: '/agent' },
  { id: 'settings', name: 'Settings', icon: imgSettings, initialPath: '/settings' },
  { id: 'log', name: 'Log', icon: imgAdminCenter, initialPath: '/log' },
  { id: 'audit', name: 'Audit', icon: imgAdminCenter, initialPath: '/audit' },
  { id: 'kms', name: 'KMS', icon: imgAdminCenter, initialPath: '/kms' },
  { id: 'security', name: 'Security', icon: imgAdminCenter, initialPath: '/security' },
  { id: 'admin-storage', name: 'Admin · Storage', icon: imgStorageAdmin, initialPath: '/storage' },
  { id: 'admin-compute', name: 'Admin · Compute', icon: imgComputeAdmin, initialPath: '/compute' },
  { id: 'admin-center', name: 'Admin center', icon: imgAdminCenter, initialPath: '/admin-center' },
];

const SYSADMIN_APPS: AppConfig[] = [
  { id: 'iam', name: 'IAM', icon: imgIam, initialPath: '/iam' },
  { id: 'storage', name: 'Storage', icon: imgStorage, initialPath: '/storage' },
  { id: 'cloudbuilder', name: 'Cloud Builder', icon: imgCloud, initialPath: '/cloudbuilder' },
  { id: 'log', name: 'Log', icon: imgAdminCenter, initialPath: '/log' },
  { id: 'audit', name: 'Audit', icon: imgAdminCenter, initialPath: '/audit' },
  { id: 'kms', name: 'KMS', icon: imgAdminCenter, initialPath: '/kms' },
  { id: 'settings', name: 'Settings', icon: imgSettings, initialPath: '/settings' },
];

function getAppsForRole(role: UserRole): AppConfig[] {
  return role === 'system-admin' ? SYSADMIN_APPS : DOMAIN_APPS;
}

/* ────────────────────────────────────────────
   Desktop Icon Grid System
   ──────────────────────────────────────────── */

const GRID = {
  CELL_W: 128,
  CELL_H: 120,
  PAD_X: 44,
  PAD_TOP: 76,
  ICON_W: 80,
  DRAG_THRESHOLD: 5,
} as const;

interface DesktopIconItem {
  id: AppId;
  icon: string;
  label: string;
  col: number;
  row: number;
}

function gridToPixel(col: number, row: number) {
  return {
    x: GRID.PAD_X + col * GRID.CELL_W,
    y: GRID.PAD_TOP + row * GRID.CELL_H,
  };
}

function pixelToGrid(px: number, py: number, maxCols: number, maxRows: number) {
  const col = Math.round((px - GRID.PAD_X) / GRID.CELL_W);
  const row = Math.round((py - GRID.PAD_TOP) / GRID.CELL_H);
  return {
    col: Math.max(0, Math.min(col, maxCols - 1)),
    row: Math.max(0, Math.min(row, maxRows - 1)),
  };
}

function getInitialIconLayout(role: UserRole): DesktopIconItem[] {
  const apps = getAppsForRole(role);
  const dockHeight = 64;
  const availableH = window.innerHeight - GRID.PAD_TOP - dockHeight;
  const maxRows = Math.max(1, Math.floor(availableH / GRID.CELL_H));
  return apps.map((app, i) => ({
    id: app.id,
    icon: app.icon,
    label: app.name,
    col: Math.floor(i / maxRows),
    row: i % maxRows,
  }));
}

interface DesktopIconProps {
  icon: string;
  label: string;
  onClick?: () => void;
  onMouseDown?: (e: MouseEvent) => void;
  style?: CSSProperties;
  isDragging?: boolean;
}

const DesktopIconComp = React.forwardRef<HTMLButtonElement, DesktopIconProps>(
  function DesktopIconComp({ icon, label, onClick, onMouseDown, style, isDragging }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={`absolute flex flex-col items-center gap-1 w-20 bg-transparent border-none p-0 select-none
          ${isDragging ? 'opacity-50 pointer-events-none' : 'cursor-pointer transition-transform hover:-translate-y-0.5'}`}
        style={style}
        onClick={isDragging ? undefined : onClick}
        onMouseDown={onMouseDown}
        aria-label={label}
      >
        <div className="w-20 h-20 flex items-center justify-center rounded-lg">
          <img
            src={icon}
            alt={label}
            className="w-16 h-16 object-cover object-center"
            draggable={false}
          />
        </div>
        <span className="text-label-md text-white text-center whitespace-nowrap drop-shadow-sm">
          {label}
        </span>
      </button>
    );
  }
);

function DragGhost({ icon, label, x, y }: { icon: string; label: string; x: number; y: number }) {
  return (
    <div
      className="fixed z-[9999] flex flex-col items-center gap-1 w-20 pointer-events-none opacity-80"
      style={{ left: x - GRID.ICON_W / 2, top: y - 40 }}
    >
      <div className="w-20 h-20 flex items-center justify-center rounded-lg">
        <img
          src={icon}
          alt={label}
          className="w-16 h-16 object-cover object-center"
          draggable={false}
        />
      </div>
      <span className="text-label-md text-white text-center whitespace-nowrap">{label}</span>
    </div>
  );
}

function useDesktopIconDrag(
  icons: DesktopIconItem[],
  setIcons: Dispatch<SetStateAction<DesktopIconItem[]>>,
  containerRef: RefObject<HTMLDivElement | null>
) {
  const [dragState, setDragState] = useState<{
    iconId: AppId;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    isDragging: boolean;
  } | null>(null);

  const getGridBounds = useCallback(() => {
    if (!containerRef.current) return { maxCols: 10, maxRows: 8 };
    const rect = containerRef.current.getBoundingClientRect();
    const bottomPad = 64;
    return {
      maxCols: Math.max(1, Math.floor((rect.width - GRID.PAD_X) / GRID.CELL_W)),
      maxRows: Math.max(1, Math.floor((rect.height - GRID.PAD_TOP - bottomPad) / GRID.CELL_H)),
    };
  }, [containerRef]);

  const handleMouseDown = useCallback((iconId: AppId, e: MouseEvent) => {
    e.preventDefault();
    setDragState({
      iconId,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      isDragging: false,
    });
  }, []);

  useEffect(() => {
    if (!dragState) return;
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      const moved = Math.abs(dx) > GRID.DRAG_THRESHOLD || Math.abs(dy) > GRID.DRAG_THRESHOLD;
      setDragState((prev) =>
        prev
          ? {
              ...prev,
              currentX: e.clientX,
              currentY: e.clientY,
              isDragging: moved || prev.isDragging,
            }
          : null
      );
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (dragState.isDragging && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const { maxCols, maxRows } = getGridBounds();
        const target = pixelToGrid(e.clientX - rect.left, e.clientY - rect.top, maxCols, maxRows);
        const occupied = icons.find(
          (ic) => ic.id !== dragState.iconId && ic.col === target.col && ic.row === target.row
        );
        if (!occupied) {
          setIcons((prev) =>
            prev.map((ic) =>
              ic.id === dragState.iconId ? { ...ic, col: target.col, row: target.row } : ic
            )
          );
        }
      }
      setDragState(null);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, icons, setIcons, containerRef, getGridBounds]);

  return { dragState, handleMouseDown };
}

/* ────────────────────────────────────────────
   App Launcher (v1.0 신규 — macOS Launchpad)
   ──────────────────────────────────────────── */

interface AppLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppConfig[];
  onAppSelect: (appId: AppId) => void;
}

function AppLauncher({ isOpen, onClose, apps, onAppSelect }: AppLauncherProps) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const filtered = apps.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/65 backdrop-blur-lg"
            style={{ zIndex: 9500 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />

          {/* Launcher panel */}
          <motion.div
            className="fixed inset-0 flex flex-col items-center justify-start pt-16 pb-10"
            style={{ zIndex: 9501 }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search box */}
            <div className="flex items-center gap-2 w-[400px] h-10 px-3 bg-white/15 border border-white/25 rounded-xl backdrop-blur-sm mb-8">
              <IconSearch size={16} stroke={1.5} className="text-white/60 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search apps..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/40 text-body-md"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-white/50 hover:text-white cursor-pointer bg-transparent border-none p-0"
                >
                  <IconX size={14} stroke={1.5} />
                </button>
              )}
            </div>

            {/* App grid */}
            <div className="w-full max-w-[900px] px-6">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(108px,1fr))] gap-y-6 gap-x-4">
                {filtered.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => {
                      onAppSelect(app.id);
                      onClose();
                    }}
                    className="flex flex-col items-center gap-2 bg-transparent border-none p-2 cursor-pointer rounded-xl hover:bg-white/10 transition-colors select-none group"
                  >
                    <div className="w-16 h-16 flex items-center justify-center rounded-[18px] overflow-hidden group-hover:scale-105 transition-transform">
                      <img
                        src={app.icon}
                        alt={app.name}
                        className="w-16 h-16 object-cover"
                        draggable={false}
                      />
                    </div>
                    <span className="text-label-sm text-white/90 text-center leading-tight line-clamp-2 w-full">
                      {app.name}
                    </span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-full text-center text-white/40 text-body-md py-12">
                    No apps found
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ────────────────────────────────────────────
   Dock Icons
   ──────────────────────────────────────────── */

interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  isActive: boolean;
  zIndex: number;
}

interface DockApp {
  id: AppId;
  name: string;
  icon: string;
  isPinned: boolean;
  hasWindows: boolean;
  hasActiveWindow: boolean;
  windows: WindowState[];
}

function DockIconItem({
  app,
  isDragging,
  onAppClick,
  getContextMenuItems,
}: {
  app: DockApp;
  isDragging: boolean;
  onAppClick: (appId: AppId) => void;
  getContextMenuItems: (app: DockApp) => any[];
}) {
  const isRunning = app.hasWindows;
  const isActive = app.hasActiveWindow;
  return (
    <ContextMenu trigger="contextmenu" items={getContextMenuItems(app)}>
      <Tooltip content={app.name} position="bottom">
        <motion.div
          layoutId={app.id}
          onClick={() => onAppClick(app.id)}
          className={`relative cursor-pointer flex items-center justify-center ${isDragging ? 'z-50' : 'z-0'}`}
          whileDrag={{ scale: 1.1, zIndex: 50, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div
            className={`w-7 h-7 rounded-lg overflow-hidden ${isRunning ? 'p-0.5 border border-white/20 bg-white/10' : ''} ${isActive ? 'border-white/40 bg-white/15' : ''}`}
          >
            <img
              src={app.icon}
              alt={app.name}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          </div>
          {isRunning && (
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-70" />
          )}
        </motion.div>
      </Tooltip>
    </ContextMenu>
  );
}

function DockIcons({
  apps,
  onAppClick,
  onTogglePin,
  onWindowClick,
  onNewWindow,
  onQuitApp,
  onReorderApps,
}: {
  apps: DockApp[];
  onAppClick: (appId: AppId) => void;
  onAppRightClick?: (appId: AppId) => void;
  onTogglePin: (appId: AppId) => void;
  onWindowClick: (windowId: string) => void;
  onNewWindow: (appId: AppId) => void;
  onQuitApp: (appId: AppId) => void;
  onReorderApps: (order: AppId[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [localApps, setLocalApps] = useState(apps);

  useEffect(() => {
    setLocalApps(apps);
  }, [apps]);

  const handleReorder = (newOrder: DockApp[]) => {
    setLocalApps(newOrder);
    onReorderApps(newOrder.map((a) => a.id));
  };

  const getContextMenuItems = (app: DockApp) => {
    const items: any[] = [];
    if (app.windows.length > 0) {
      app.windows.forEach((w) => {
        let windowIcon: ReactNode;
        if (w.isMinimized) windowIcon = <IconWindowMinimized size={16} stroke={1} />;
        else if (w.isActive)
          windowIcon = (
            <span className="flex items-center gap-1">
              <IconCheck size={16} stroke={1} />
              <IconWindowActive size={16} stroke={1} />
            </span>
          );
        else windowIcon = <IconWindowActive size={16} stroke={1} />;
        items.push({
          id: `window-${w.id}`,
          label: w.title,
          icon: windowIcon,
          onClick: () => onWindowClick(w.id),
        });
      });
      items.push({ id: 'divider-windows', label: '', divider: true });
    }
    items.push({ id: 'new-window', label: 'New window', onClick: () => onNewWindow(app.id) });
    items.push({ id: 'divider-3', divider: true });
    items.push({
      id: 'pin',
      label: app.isPinned ? 'Unpin' : 'Pin',
      onClick: () => onTogglePin(app.id),
    });
    items.push({ id: 'divider-4', divider: true });
    items.push({ id: 'quit', label: 'Quit', onClick: () => onQuitApp(app.id) });
    return items;
  };

  return (
    <div className="rounded-xl px-1.5 py-1">
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
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            layout
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            whileDrag={{ scale: 1.15, zIndex: 50, cursor: 'grabbing' }}
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
    </div>
  );
}

/* ────────────────────────────────────────────
   Top GNB (v1.0)
   ──────────────────────────────────────────── */

interface TopGNBProps {
  role: UserRole;
  onChatbotToggle: () => void;
  onOpenSettings?: (tab?: 'general' | 'account' | 'notifications' | 'information') => void;
  onNotificationToggle?: () => void;
  notificationButtonRef?: RefObject<HTMLButtonElement>;
  dockIcons?: ReactNode;
  onLauncherToggle: () => void;
  isGnbVisible: boolean;
  isAnyWindowMaximized: boolean;
  isDark: boolean;
  theme: string;
  setTheme: (t: 'light' | 'dark' | 'system') => void;
}

function TopGNB({
  role,
  onChatbotToggle,
  onOpenSettings,
  onNotificationToggle,
  notificationButtonRef,
  dockIcons,
  onLauncherToggle,
  isGnbVisible,
  isAnyWindowMaximized,
  isDark,
  theme,
  setTheme,
}: TopGNBProps) {
  const [language, setLanguage] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('tds-language') || 'en' : 'en'
  );
  const [showLanguageConfirmModal, setShowLanguageConfirmModal] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('tds-language');
      if (stored && stored !== language) setLanguage(stored);
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('language-changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('language-changed', handleStorageChange);
    };
  }, [language]);

  const handleLanguageChange = (lang: string) => {
    if (lang === language) return;
    setPendingLanguage(lang);
    setShowLanguageConfirmModal(true);
  };

  const confirmLanguageChange = () => {
    if (!pendingLanguage) return;
    setLanguage(pendingLanguage);
    localStorage.setItem('tds-language', pendingLanguage);
    window.dispatchEvent(new CustomEvent('language-changed'));
    setShowLanguageConfirmModal(false);
    setPendingLanguage(null);
  };

  const settingsContextMenuItems = [
    {
      id: 'language',
      label: 'Language',
      submenuDirection: 'left' as const,
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
      submenuDirection: 'left' as const,
      submenu: [
        {
          id: 'system',
          label: theme === 'system' ? '✓ System' : 'System',
          onClick: () => setTheme('system'),
        },
        {
          id: 'light',
          label: theme === 'light' ? '✓ Light' : 'Light',
          onClick: () => setTheme('light'),
        },
        {
          id: 'dark',
          label: theme === 'dark' ? '✓ Dark' : 'Dark',
          onClick: () => setTheme('dark'),
        },
      ],
    },
  ];

  // v1.0: Auto-hide when any window is maximized; slides down on pointer near top
  const gnbStyle: CSSProperties = isAnyWindowMaximized
    ? {
        transform: isGnbVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 200ms ease',
        // Overlay on top of maximized window — no layout push
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1050,
      }
    : {};

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 h-[52px] bg-black/40 backdrop-blur-xl flex items-center justify-between pl-4 shadow-[0px_1px_0px_0px_rgba(0,0,0,0.2)] border-b border-white/10"
        style={{ zIndex: isAnyWindowMaximized ? 1050 : 1000, ...gnbStyle }}
      >
        {/* Left — Logo + Launcher + Dock */}
        <div className="flex items-center gap-3 h-full">
          <img src={ThakiLogoDark} alt="THAKI Cloud" className="h-5" />

          {/* v1.0: App Launcher trigger (grid icon) */}
          <Tooltip content="All apps" position="bottom">
            <button
              type="button"
              onClick={onLauncherToggle}
              className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors bg-transparent border-none"
              aria-label="Open app launcher"
            >
              <IconLayoutGrid size={20} stroke={1.5} />
            </button>
          </Tooltip>

          {/* Dock icons (running + pinned apps) */}
          <div className="ml-2">{dockIcons}</div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* v1.0: Domain label — read-only text for domain users, hidden for system admin */}
          {role === 'domain' && (
            <div className="flex items-center h-7 px-2.5 rounded-[var(--primitive-radius-md)] bg-white/10 border border-white/15 text-white/90 text-body-md select-none">
              acme.corp.cloud
            </div>
          )}

          {/* System controls */}
          <div className="flex items-center gap-3">
            <ContextMenu items={settingsContextMenuItems} trigger="click" minTop={52}>
              <button className="w-5 h-5 flex items-center justify-center text-white/70 hover:text-white cursor-pointer transition-colors bg-transparent border-none">
                <Icons.Finetuning size={20} stroke={1.5} />
              </button>
            </ContextMenu>

            <ContextMenu
              items={[
                {
                  id: 'user-email',
                  label:
                    role === 'system-admin' ? 'sysadmin@thakicloud.com' : 'thaki.kim@example.com',
                  onClick: () => onOpenSettings?.('account'),
                  tooltip: 'Open settings page',
                  tooltipPosition: 'left',
                  divider: true,
                },
                { id: 'sign-out', label: 'Logout', onClick: () => {} },
              ]}
              trigger="click"
              minTop={52}
            >
              <button className="w-5 h-5 flex items-center justify-center text-white/70 hover:text-white cursor-pointer transition-colors bg-transparent border-none">
                <Icons.UserCircle size={20} stroke={1.5} />
              </button>
            </ContextMenu>

            <button
              ref={notificationButtonRef}
              onClick={onNotificationToggle}
              className="w-5 h-5 flex items-center justify-center text-white/70 hover:text-white cursor-pointer transition-colors bg-transparent border-none"
            >
              <Icons.Notification size={20} stroke={1.5} />
            </button>
          </div>

          {/* TCA (AI chatbot) */}
          <div className="flex items-center border-l border-white/20 px-2.5">
            <button
              className="w-8 h-8 flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 bg-transparent border-none"
              onClick={onChatbotToggle}
              title="TCA — AI Assistant"
            >
              <img src={imgAIChat} alt="TCA" className="w-8 h-8 object-contain" />
            </button>
          </div>
        </div>
      </div>

      {/* Language confirmation modal */}
      <Modal
        isOpen={showLanguageConfirmModal}
        onClose={() => setShowLanguageConfirmModal(false)}
        title="Confirm language change"
      >
        <p className="text-body-md text-[var(--color-text-default)] mb-6">
          {pendingLanguage && (
            <>
              Change language to <strong>{pendingLanguage === 'en' ? 'English' : 'Korean'}</strong>?
            </>
          )}
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowLanguageConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmLanguageChange}>
            Apply
          </Button>
        </div>
      </Modal>
    </>
  );
}

/* ────────────────────────────────────────────
   App Window
   ──────────────────────────────────────────── */

const TOP_BAR_HEIGHT = 52;
const MIN_WINDOW_WIDTH = 400;
const MIN_WINDOW_HEIGHT = 300;

interface PageWindowProps {
  windowId: string;
  isOpen: boolean;
  isMinimized: boolean;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  title: string;
  children: ReactNode;
  zIndex: number;
  onMaximizeChange?: (isMaximized: boolean) => void;
}

function PageWindow({
  windowId: _windowId,
  isOpen,
  isMinimized: _isMinimized,
  isActive,
  onClose,
  onMinimize,
  onFocus,
  title,
  children,
  zIndex,
  onMaximizeChange,
}: PageWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 1200, height: 800 });
  const [preMaxState, setPreMaxState] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isResizing = useRef<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0, w: 0, h: 0 });

  useEffect(() => {
    if (isActive && windowRef.current) windowRef.current.focus();
  }, [isActive]);

  const handleDragStart = useCallback(
    (e: MouseEvent) => {
      if (isMaximized) return;
      e.preventDefault();
      isDragging.current = true;
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        posX: position.x,
        posY: position.y,
        w: 0,
        h: 0,
      };
      const handleMouseMove = (ev: MouseEvent) => {
        if (!isDragging.current) return;
        const opacity = 0.85;
        if (windowRef.current) windowRef.current.style.opacity = String(opacity);
        setPosition({
          x: dragStart.current.posX + (ev.clientX - dragStart.current.x),
          y: Math.max(TOP_BAR_HEIGHT, dragStart.current.posY + (ev.clientY - dragStart.current.y)),
        });
      };
      const handleMouseUp = () => {
        isDragging.current = false;
        if (windowRef.current) windowRef.current.style.opacity = '1';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [isMaximized, position]
  );

  const handleResizeStart = useCallback(
    (e: MouseEvent, direction: string) => {
      if (isMaximized) return;
      e.preventDefault();
      e.stopPropagation();
      isResizing.current = direction;
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        posX: position.x,
        posY: position.y,
        w: size.width,
        h: size.height,
      };
      const handleMouseMove = (ev: MouseEvent) => {
        if (!isResizing.current) return;
        const dx = ev.clientX - dragStart.current.x;
        const dy = ev.clientY - dragStart.current.y;
        const dir = isResizing.current;
        let newW = dragStart.current.w,
          newH = dragStart.current.h,
          newX = dragStart.current.posX,
          newY = dragStart.current.posY;
        if (dir.includes('e')) newW = Math.max(MIN_WINDOW_WIDTH, dragStart.current.w + dx);
        if (dir.includes('s')) newH = Math.max(MIN_WINDOW_HEIGHT, dragStart.current.h + dy);
        if (dir.includes('w')) {
          const pw = dragStart.current.w - dx;
          if (pw >= MIN_WINDOW_WIDTH) {
            newW = pw;
            newX = dragStart.current.posX + dx;
          }
        }
        if (dir.includes('n')) {
          const ph = dragStart.current.h - dy;
          if (ph >= MIN_WINDOW_HEIGHT) {
            newH = ph;
            newY = Math.max(TOP_BAR_HEIGHT, dragStart.current.posY + dy);
          }
        }
        setSize({ width: newW, height: newH });
        setPosition({ x: newX, y: newY });
      };
      const handleMouseUp = () => {
        isResizing.current = null;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [isMaximized, position, size]
  );

  const handleMaximize = () => {
    const next = !isMaximized;
    if (next) {
      setPreMaxState({ x: position.x, y: position.y, w: size.width, h: size.height });
      setIsMaximized(true);
    } else {
      if (preMaxState) {
        setPosition({ x: preMaxState.x, y: preMaxState.y });
        setSize({ width: preMaxState.w, height: preMaxState.h });
      }
      setIsMaximized(false);
    }
    onMaximizeChange?.(next);
  };

  if (!isOpen) return null;

  const windowStyle: CSSProperties = isMaximized
    ? {
        width: '100vw',
        height: `calc(100vh - ${TOP_BAR_HEIGHT}px)`,
        top: `${TOP_BAR_HEIGHT}px`,
        left: 0,
        zIndex,
        borderRadius: 0,
      }
    : {
        width: `${size.width}px`,
        height: `${size.height}px`,
        top: `${position.y}px`,
        left: `${position.x}px`,
        zIndex,
      };

  const resizeHandleBase = 'absolute pointer-events-auto z-10';
  const edgeT = '4px';
  const cornerS = '12px';

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2000 + zIndex }}>
      <motion.div
        ref={windowRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={`absolute bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg shadow-2xl flex flex-col overflow-hidden pointer-events-auto ${isActive ? 'ring-2 ring-[var(--color-action-primary)]' : ''}`}
        style={windowStyle}
        onClick={onFocus}
        onMouseDown={onFocus}
      >
        <div
          className="flex items-center justify-between px-4 py-2 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)] shrink-0 select-none"
          onMouseDown={handleDragStart}
          onDoubleClick={handleMaximize}
        >
          <span className="text-label-md text-[var(--color-text-default)] truncate">{title}</span>
          <div onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
            <WindowControls
              onMinimize={onMinimize}
              onMaximize={handleMaximize}
              onClose={onClose}
              isMaximized={isMaximized}
            />
          </div>
        </div>
        <div className="flex-1 overflow-hidden relative">{children}</div>

        {!isMaximized && (
          <>
            <div
              className={`${resizeHandleBase} top-0 left-3 right-3 cursor-n-resize`}
              style={{ height: edgeT }}
              onMouseDown={(e) => handleResizeStart(e, 'n')}
            />
            <div
              className={`${resizeHandleBase} bottom-0 left-3 right-3 cursor-s-resize`}
              style={{ height: edgeT }}
              onMouseDown={(e) => handleResizeStart(e, 's')}
            />
            <div
              className={`${resizeHandleBase} left-0 top-3 bottom-3 cursor-w-resize`}
              style={{ width: edgeT }}
              onMouseDown={(e) => handleResizeStart(e, 'w')}
            />
            <div
              className={`${resizeHandleBase} right-0 top-3 bottom-3 cursor-e-resize`}
              style={{ width: edgeT }}
              onMouseDown={(e) => handleResizeStart(e, 'e')}
            />
            <div
              className={`${resizeHandleBase} top-0 left-0 cursor-nw-resize`}
              style={{ width: cornerS, height: cornerS }}
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
            />
            <div
              className={`${resizeHandleBase} top-0 right-0 cursor-ne-resize`}
              style={{ width: cornerS, height: cornerS }}
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
            />
            <div
              className={`${resizeHandleBase} bottom-0 left-0 cursor-sw-resize`}
              style={{ width: cornerS, height: cornerS }}
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
            />
            <div
              className={`${resizeHandleBase} bottom-0 right-0 cursor-se-resize`}
              style={{ width: cornerS, height: cornerS }}
              onMouseDown={(e) => handleResizeStart(e, 'se')}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Isolated router for app windows
   ──────────────────────────────────────────── */

function IsolatedRouter({ initialPath, appId }: { initialPath: string; appId: AppId }) {
  return (
    <DesktopWindowProvider value={true}>
      <UNSAFE_LocationContext.Provider value={null as any}>
        <UNSAFE_RouteContext.Provider value={{ outlet: null, matches: [], isDataRoute: false }}>
          <MemoryRouter initialEntries={[initialPath]}>
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full text-[var(--color-text-muted)]">
                  Loading…
                </div>
              }
            >
              <AppRoutes appId={appId} />
            </Suspense>
          </MemoryRouter>
        </UNSAFE_RouteContext.Provider>
      </UNSAFE_LocationContext.Provider>
    </DesktopWindowProvider>
  );
}

function AppRoutes({ appId }: { appId: AppId }) {
  switch (appId) {
    case 'compute':
    case 'admin-compute':
      return (
        <Routes>
          <Route path="/compute" element={<ComputeHomePage />} />
          {computeRoutes}
          <Route path="/compute/*" element={<ComputeHomePage />} />
        </Routes>
      );
    case 'storage':
    case 'admin-storage':
      return (
        <Routes>
          {storageRoutes}
          <Route path="/storage/*" element={<StorageHomePage />} />
        </Routes>
      );
    case 'container':
    case 'app-catalog':
      return (
        <Routes>
          {containerRoutes}
          <Route path="/container/catalog/*" element={<ComputeHomePage />} />
        </Routes>
      );
    case 'agent':
    case 'axion-ops':
      return (
        <Routes>
          {agentRoutes}
          <Route path="/agent/*" element={<HomePage />} />
        </Routes>
      );
    case 'ai-platform':
    case 'axion-core':
    case 'axion-hub':
    case 'axion-infra':
    case 'axion-ml-studio':
    case 'axion-serve':
      return (
        <Routes>
          <Route path="/ai-platform" element={<AIPlatformPage />} />
          <Route path="/ai-platform/*" element={<AIPlatformPage />} />
        </Routes>
      );
    case 'iam':
      return <Routes>{iamRoutes}</Routes>;
    case 'cloudbuilder':
      return (
        <Routes>
          <Route path="/cloudbuilder" element={<CloudBuilderPage />} />
          <Route path="/cloudbuilder/*" element={<CloudBuilderPage />} />
        </Routes>
      );
    default:
      return null;
  }
}

/* ────────────────────────────────────────────
   DesktopPageV1 — Main Component
   ──────────────────────────────────────────── */

export function DesktopPageV1() {
  const { isDark, theme, setTheme } = useDarkMode();

  // Role toggle (prototype-only UI bottom-right)
  const [role, setRole] = useState<UserRole>('domain');

  // App Launcher
  const [showLauncher, setShowLauncher] = useState(false);

  // GNB auto-hide (v1.0 §3.1)
  const [isAnyWindowMaximized, setIsAnyWindowMaximized] = useState(false);
  const [isGnbVisible, setIsGnbVisible] = useState(true);
  const gnbHitAreaRef = useRef<HTMLDivElement>(null);
  const gnbHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gnbDwellTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show GNB when pointer hovers near top (dwell 200ms)
  const handleHitAreaEnter = useCallback(() => {
    if (!isAnyWindowMaximized) return;
    if (gnbHideTimer.current) {
      clearTimeout(gnbHideTimer.current);
      gnbHideTimer.current = null;
    }
    gnbDwellTimer.current = setTimeout(() => setIsGnbVisible(true), 200);
  }, [isAnyWindowMaximized]);

  const handleHitAreaLeave = useCallback(() => {
    if (!isAnyWindowMaximized) return;
    if (gnbDwellTimer.current) {
      clearTimeout(gnbDwellTimer.current);
      gnbDwellTimer.current = null;
    }
    gnbHideTimer.current = setTimeout(() => setIsGnbVisible(false), 300);
  }, [isAnyWindowMaximized]);

  // Hide GNB when maximized; show when restored
  useEffect(() => {
    if (isAnyWindowMaximized) setIsGnbVisible(false);
    else setIsGnbVisible(true);
  }, [isAnyWindowMaximized]);

  // Panel states
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<
    'general' | 'account' | 'notifications' | 'information'
  >('general');
  const [showChatbot, setShowChatbot] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const desktopGridRef = useRef<HTMLDivElement>(null);

  // Desktop icon grid — re-init when role changes
  const [desktopIcons, setDesktopIcons] = useState<DesktopIconItem[]>(() =>
    getInitialIconLayout(role)
  );
  useEffect(() => {
    setDesktopIcons(getInitialIconLayout(role));
  }, [role]);

  const { dragState, handleMouseDown } = useDesktopIconDrag(
    desktopIcons,
    setDesktopIcons,
    desktopGridRef
  );

  // Window management
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1);

  const allApps = getAppsForRole(role);
  const appConfigMap = Object.fromEntries(allApps.map((a) => [a.id, a])) as Record<
    AppId,
    AppConfig
  >;

  const [pinnedApps, setPinnedApps] = useState<Set<AppId>>(new Set(['settings']));
  const [dockAppOrder, setDockAppOrder] = useState<AppId[]>([
    'compute',
    'storage',
    'container',
    'settings',
  ]);

  // Reset dock when role switches
  useEffect(() => {
    if (role === 'system-admin') {
      setPinnedApps(new Set(['settings']));
      setDockAppOrder(['iam', 'storage', 'cloudbuilder', 'settings']);
    } else {
      setPinnedApps(new Set(['settings']));
      setDockAppOrder(['compute', 'storage', 'container', 'settings']);
    }
    setWindows([]);
  }, [role]);

  const createWindow = useCallback(
    (appId: AppId) => {
      const config = appConfigMap[appId];
      if (!config) return;
      const newWindow: WindowState = {
        id: `${appId}-${Date.now()}`,
        appId,
        title: config.name,
        isMinimized: false,
        isActive: true,
        zIndex: nextZIndex,
      };
      setWindows((prev) => prev.map((w) => ({ ...w, isActive: false })).concat(newWindow));
      setNextZIndex((prev) => prev + 1);
      setDockAppOrder((prev) => (prev.includes(appId) ? prev : [...prev, appId]));
    },
    [appConfigMap, nextZIndex]
  );

  const closeWindow = useCallback((windowId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId));
  }, []);

  const minimizeWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, isMinimized: true, isActive: false } : w))
    );
  }, []);

  const focusWindow = useCallback(
    (windowId: string) => {
      setWindows((prev) =>
        prev.map((w) => ({
          ...w,
          isActive: w.id === windowId,
          isMinimized: w.id === windowId ? false : w.isMinimized,
          zIndex: w.id === windowId ? nextZIndex : w.zIndex,
        }))
      );
      setNextZIndex((prev) => prev + 1);
    },
    [nextZIndex]
  );

  const blurAllWindows = useCallback(() => {
    setWindows((prev) => prev.map((w) => ({ ...w, isActive: false })));
  }, []);

  const focusApp = useCallback(
    (appId: AppId) => {
      const appWindows = windows.filter((w) => w.appId === appId);
      if (appWindows.length === 0) {
        createWindow(appId);
        return;
      }
      const active = appWindows.filter((w) => !w.isMinimized);
      if (active.length > 0) {
        focusWindow(active.sort((a, b) => b.zIndex - a.zIndex)[0].id);
        return;
      }
      const minimized = appWindows.filter((w) => w.isMinimized);
      if (minimized.length > 0) focusWindow(minimized.sort((a, b) => b.zIndex - a.zIndex)[0].id);
    },
    [windows, createWindow, focusWindow]
  );

  const togglePinApp = useCallback((appId: AppId) => {
    setPinnedApps((prev) => {
      const s = new Set(prev);
      if (s.has(appId)) {
        s.delete(appId);
      } else {
        s.add(appId);
      }
      return s;
    });
  }, []);

  const handleMaximizeChange = useCallback((_windowId: string, isMax: boolean) => {
    setWindows((prev) => {
      const anyMax = isMax || prev.some((w) => w.isMinimized === false && w.zIndex > 0);
      // Recalc after state update
      return prev;
    });
    // Check if any window is now maximized
    setTimeout(() => {
      setIsAnyWindowMaximized(isMax);
    }, 0);
  }, []);

  // Notifications
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

  const handleMarkAsRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  const handleMarkAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

  // Background: currently shared; can be differentiated per role/theme when distinct assets are available
  const bgSrc = DesktopBg;

  // Dock apps visible: running ∪ pinned, filtered to role's app catalog
  const dockApps: DockApp[] = dockAppOrder
    .filter((id) => {
      const inCatalog = allApps.some((a) => a.id === id);
      const isRunning = windows.some((w) => w.appId === id);
      return inCatalog || isRunning;
    })
    .map((appId) => {
      const cfg = appConfigMap[appId] ?? {
        id: appId,
        name: appId,
        icon: imgSettings,
        initialPath: '/',
      };
      return {
        id: appId,
        name: cfg.name,
        icon: cfg.icon,
        isPinned: pinnedApps.has(appId),
        hasWindows: windows.some((w) => w.appId === appId),
        hasActiveWindow: windows.some((w) => w.appId === appId && w.isActive),
        windows: windows.filter((w) => w.appId === appId),
      };
    });

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-black"
      onClick={(e) => {
        if (e.target === e.currentTarget) blurAllWindows();
      }}
    >
      {/* Background */}
      <img
        src={bgSrc}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
      />

      {/* GNB auto-hide hit area (always present at top when maximized) */}
      {isAnyWindowMaximized && (
        <div
          ref={gnbHitAreaRef}
          className="fixed top-0 left-0 right-0 z-[1049] pointer-events-auto"
          style={{ height: Math.max(4, isGnbVisible ? 52 : 4) }}
          onMouseEnter={handleHitAreaEnter}
          onMouseLeave={handleHitAreaLeave}
        />
      )}

      {/* Top GNB */}
      <TopGNB
        role={role}
        onChatbotToggle={() => setShowChatbot(!showChatbot)}
        onOpenSettings={(tab) => {
          if (tab) setSettingsTab(tab);
          setShowSettings(true);
        }}
        onNotificationToggle={() => setShowNotifications(!showNotifications)}
        notificationButtonRef={notificationButtonRef}
        onLauncherToggle={() => setShowLauncher(!showLauncher)}
        isGnbVisible={isGnbVisible}
        isAnyWindowMaximized={isAnyWindowMaximized}
        isDark={isDark}
        theme={theme}
        setTheme={setTheme}
        dockIcons={
          <DockIcons
            apps={dockApps}
            onAppClick={focusApp}
            onTogglePin={togglePinApp}
            onWindowClick={focusWindow}
            onNewWindow={createWindow}
            onQuitApp={(appId) => setWindows((prev) => prev.filter((w) => w.appId !== appId))}
            onReorderApps={setDockAppOrder}
          />
        }
      />

      {/* Desktop icon grid */}
      <div
        ref={desktopGridRef}
        className="absolute inset-0"
        style={{ paddingTop: 52 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) blurAllWindows();
        }}
      >
        {desktopIcons.map((item) => {
          const pos = gridToPixel(item.col, item.row);
          const beingDragged = dragState?.isDragging && dragState.iconId === item.id;
          return (
            <DesktopIconComp
              key={item.id}
              icon={item.icon}
              label={item.label}
              isDragging={beingDragged}
              style={{ left: pos.x, top: pos.y + 52 }}
              onClick={() => {
                if (item.id === 'settings') {
                  setShowSettings(true);
                } else {
                  focusApp(item.id);
                }
              }}
              onMouseDown={(e) => handleMouseDown(item.id, e)}
            />
          );
        })}
        {dragState?.isDragging &&
          (() => {
            const dragged = desktopIcons.find((ic) => ic.id === dragState.iconId);
            if (!dragged) return null;
            return (
              <DragGhost
                icon={dragged.icon}
                label={dragged.label}
                x={dragState.currentX}
                y={dragState.currentY}
              />
            );
          })()}
      </div>

      {/* App Launcher (v1.0 신규) */}
      <AppLauncher
        isOpen={showLauncher}
        onClose={() => setShowLauncher(false)}
        apps={allApps}
        onAppSelect={focusApp}
      />

      {/* Settings window */}
      <SettingsPage
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        initialTab={settingsTab}
      />

      {/* TCA panel */}
      <ChatbotPanel isOpen={showChatbot} onClose={() => setShowChatbot(false)} />

      {/* Notification center */}
      {showNotifications && notificationButtonRef.current && (
        <>
          <div className="fixed inset-0 z-[6000]" onClick={() => setShowNotifications(false)} />
          <div className="fixed z-[6001] top-[52px] right-0" onClick={(e) => e.stopPropagation()}>
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClose={() => setShowNotifications(false)}
            />
          </div>
        </>
      )}

      {/* App windows */}
      <AnimatePresence>
        {windows
          .filter((w) => !w.isMinimized)
          .map((w) => {
            const cfg = appConfigMap[w.appId];
            if (!cfg || w.appId === 'settings') return null;
            return (
              <PageWindow
                key={w.id}
                windowId={w.id}
                isOpen={true}
                isMinimized={false}
                isActive={w.isActive}
                onClose={() => closeWindow(w.id)}
                onMinimize={() => minimizeWindow(w.id)}
                onFocus={() => focusWindow(w.id)}
                title={w.title}
                zIndex={w.zIndex}
                onMaximizeChange={(isMax) => handleMaximizeChange(w.id, isMax)}
              >
                <IsolatedRouter initialPath={cfg.initialPath} appId={w.appId} />
              </PageWindow>
            );
          })}
      </AnimatePresence>

      {/* Role toggle (prototype helper — bottom right) */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 z-[9000]">
        <span className="text-white/50 text-body-sm select-none">Role:</span>
        <div className="flex items-center bg-black/40 backdrop-blur-sm rounded-lg border border-white/15 overflow-hidden">
          <button
            type="button"
            onClick={() => setRole('domain')}
            className={`px-3 py-1.5 text-body-sm cursor-pointer transition-colors border-none ${role === 'domain' ? 'bg-white/20 text-white' : 'bg-transparent text-white/50 hover:text-white/80'}`}
          >
            Domain
          </button>
          <button
            type="button"
            onClick={() => setRole('system-admin')}
            className={`px-3 py-1.5 text-body-sm cursor-pointer transition-colors border-none ${role === 'system-admin' ? 'bg-white/20 text-white' : 'bg-transparent text-white/50 hover:text-white/80'}`}
          >
            System admin
          </button>
        </div>
      </div>

      {/* Navigation link */}
      <Link
        to="/"
        className="absolute bottom-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all hover:-translate-y-0.5 z-[9000]"
      >
        <IconLayoutDashboard size={18} stroke={1.5} />
        <span>Go to main page</span>
      </Link>
    </div>
  );
}

export default DesktopPageV1;
