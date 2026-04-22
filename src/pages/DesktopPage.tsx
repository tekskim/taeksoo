import React, { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { ChatbotPanel } from '@/components/ChatbotPanel';
import {
  IconLayoutDashboard,
  IconCheck,
  IconSelector,
  IconCircleCheck,
  IconAlertTriangle,
  IconInfoCircle,
  IconCheckbox,
  IconChevronUp,
  IconChevronDown,
} from '@tabler/icons-react';
import {
  Icons,
  ContextMenu,
  Modal,
  Button,
  Tooltip,
  IconWindowActive,
  IconWindowMinimized,
  Tabs,
  TabList,
  Tab,
  Select,
} from '@/design-system';
import AppIconCompute from '@/assets/appIcon/compute.png';
import AppIconIAM from '@/assets/appIcon/iam.png';
import AppIconContainer from '@/assets/appIcon/container.png';
import AppIconStorage from '@/assets/appIcon/storage.png';
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
import { DesktopWindowProvider } from '@/contexts/DesktopWindowContext';
import { TabProvider } from '@/contexts/TabContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import ThakiLogoDark from '@/assets/thakiLogo-dark.svg';
import ThakiLogoLight from '@/assets/thakiLogo_light.svg';
import DesktopBg from '@/assets/bg-01.jpg';
import { computeRoutes } from '@/routes/compute.routes';
import { storageRoutes } from '@/routes/storage.routes';
import { agentRoutes } from '@/routes/agent.routes';
import { iamRoutes } from '@/routes/iam.routes';
import { containerRoutes } from '@/routes/container.routes';
import { computeAdminRoutes } from '@/routes/compute-admin.routes';
import { CloudBuilderConsolePage } from '@/pages/cloudbuilder/CloudBuilderConsolePage';
import { CloudBuilderCreatePage } from '@/pages/cloudbuilder/CloudBuilderCreatePage';
import { CloudBuilderDetailPage } from '@/pages/cloudbuilder/CloudBuilderDetailPage';
import { ComputeHomePage } from './ComputeHomePage';
import { StorageHomePage } from './StorageHomePage';
import { HomePage } from './HomePage';
import { AIPlatformPage } from './AIPlatformPage';
import SettingsGeneralPage from './SettingsGeneralPage';
import SettingsAccountPage from './SettingsAccountPage';
import SettingsNotificationsPage from './SettingsNotificationsPage';
import SettingsInformationPage from './SettingsInformationPage';

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
import imgAIPlatformAdmin from '@/assets/appIcon/aiplatformadmin.png';

// App Icons
import appIconAIChat from '@/assets/appIcon/chat.png';

/* ----------------------------------------
   Desktop Icon Grid System
   ---------------------------------------- */

const GRID = {
  CELL_W: 128,
  CELL_H: 120,
  PAD_X: 44,
  PAD_TOP: 76,
  ICON_W: 80,
  DRAG_THRESHOLD: 5,
} as const;

interface DesktopIconItem {
  id: string;
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

function getInitialIconLayout(): DesktopIconItem[] {
  const icons = [
    { id: 'iam', icon: imgIam, label: 'IAM' },
    { id: 'compute', icon: imgCompute, label: 'Compute' },
    { id: 'storage', icon: imgStorage, label: 'Storage' },
    { id: 'container', icon: imgContainer, label: 'Container' },
    { id: 'ai-platform', icon: imgAi, label: 'AI Platform' },
    { id: 'agent', icon: imgAgent, label: 'Agent Ops' },
    { id: 'settings', icon: imgSettings, label: 'Settings' },
    { id: 'admin-center', icon: imgAdminCenter, label: 'Admin center' },
  ];
  const dockHeight = 64;
  const availableH = window.innerHeight - GRID.PAD_TOP - dockHeight;
  const maxRows = Math.max(1, Math.floor(availableH / GRID.CELL_H));
  return icons.map((item, i) => ({
    ...item,
    col: Math.floor(i / maxRows),
    row: i % maxRows,
  }));
}

interface DesktopIconProps {
  icon: string;
  label: string;
  iconSlot?: React.ReactNode;
  onClick?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  isDragging?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

const DesktopIcon = React.forwardRef<HTMLButtonElement, DesktopIconProps>(function DesktopIcon(
  { icon, label, iconSlot, onClick, onMouseDown, style, isDragging },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      className={`
          absolute flex flex-col items-center gap-1 w-20 bg-transparent border-none p-0 select-none group
          ${isDragging ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
      style={style}
      onClick={isDragging ? undefined : onClick}
      onMouseDown={onMouseDown}
      aria-label={label}
    >
      <div className="w-[72px] h-[72px] flex items-center justify-center rounded-lg transition-colors duration-150 group-hover:bg-[var(--desktop-icon-hover)] group-active:bg-[var(--desktop-icon-active)]">
        {iconSlot || (
          <img
            src={icon}
            alt={label}
            className="w-16 h-16 object-cover object-center"
            draggable={false}
          />
        )}
      </div>
      <span className="text-label-md text-[var(--desktop-text)] text-center whitespace-nowrap px-2 py-0.5 rounded transition-colors duration-150 group-hover:bg-[var(--desktop-icon-hover)] group-active:bg-[var(--desktop-icon-active)]">
        {label}
      </span>
    </button>
  );
});

function AdminCenterCompositeIcon() {
  return (
    <div className="w-14 h-14 rounded-2xl bg-[var(--desktop-glass-bg-strong)] border border-[var(--desktop-glass-border)] shadow-sm grid grid-cols-2 grid-rows-2 gap-1 p-1.5">
      <img
        src={imgStorageAdmin}
        alt=""
        className="w-full h-full object-contain rounded-md"
        draggable={false}
      />
      <img
        src={imgComputeAdmin}
        alt=""
        className="w-full h-full object-contain rounded-md"
        draggable={false}
      />
      <img
        src={imgAIPlatformAdmin}
        alt=""
        className="w-full h-full object-contain rounded-md"
        draggable={false}
      />
      <img
        src={imgCloud}
        alt=""
        className="w-full h-full object-contain rounded-md"
        draggable={false}
      />
    </div>
  );
}

interface DragGhostProps {
  icon: string;
  label: string;
  x: number;
  y: number;
}

function DragGhost({ icon, label, x, y }: DragGhostProps) {
  return (
    <div
      className="fixed z-[9999] flex flex-col items-center gap-1 w-20 pointer-events-none opacity-80"
      style={{ left: x - GRID.ICON_W / 2, top: y - 40 }}
    >
      <div className="w-[72px] h-[72px] flex items-center justify-center rounded-lg bg-[var(--desktop-icon-active)]">
        <img
          src={icon}
          alt={label}
          className="w-16 h-16 object-cover object-center"
          draggable={false}
        />
      </div>
      <span className="text-label-md text-[var(--desktop-text)] text-center whitespace-nowrap px-2 py-0.5 rounded bg-[var(--desktop-icon-active)]">
        {label}
      </span>
    </div>
  );
}

function useDesktopIconDrag(
  icons: DesktopIconItem[],
  setIcons: React.Dispatch<React.SetStateAction<DesktopIconItem[]>>,
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const [dragState, setDragState] = useState<{
    iconId: string;
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

  const handleMouseDown = useCallback((iconId: string, e: React.MouseEvent) => {
    if (e.button !== 0) return;
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

function DockIconItem({ app, isDragging, onAppClick, getContextMenuItems }: DockIconItemProps) {
  const isRunning = app.hasWindows;
  const isActive = app.hasActiveWindow;

  return (
    <ContextMenu trigger="contextmenu" items={getContextMenuItems(app)}>
      <Tooltip content={app.name} position="bottom">
        <motion.div
          {...(isDragging ? { layoutId: app.id } : {})}
          role="button"
          tabIndex={0}
          aria-label={app.name}
          onClick={() => onAppClick(app.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onAppClick(app.id);
            }
          }}
          className={`
            relative cursor-pointer flex flex-col items-center
            ${isDragging ? 'z-50' : 'z-0'}
          `}
          whileDrag={{
            scale: 1.1,
            zIndex: 50,
            boxShadow: '0 10px 30px color-mix(in srgb, var(--color-text-default) 30%, transparent)',
          }}
        >
          <div className="w-7 h-7 rounded-[var(--radius-lg)] overflow-hidden">
            <img
              src={app.icon}
              alt={app.name}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          </div>
          {isRunning && (
            <div
              className="mt-0.5 rounded-full bg-[var(--desktop-text-muted)]"
              style={{ width: 3, height: 3 }}
            />
          )}
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
    onReorderApps(newOrder.map((app) => app.id));
  };

  const getContextMenuItems = (app: DockApp) => {
    const items: any[] = [];

    // Window list
    if (app.windows.length > 0) {
      app.windows.forEach((window) => {
        // 윈도우 상태에 따른 아이콘 결정
        let windowIcon: React.ReactNode;
        if (window.isMinimized) {
          windowIcon = <IconWindowMinimized size={12} />;
        } else if (window.isActive) {
          windowIcon = (
            <span className="flex items-center gap-1">
              <IconCheck size={12} />
              <IconWindowActive size={12} />
            </span>
          );
        } else {
          windowIcon = <IconWindowActive size={12} />;
        }

        items.push({
          id: `window-${window.id}`,
          label: window.title,
          icon: windowIcon,
          onClick: () => onWindowClick(window.id),
        });
      });
      // 마지막 윈도우 아이템에 divider 추가
      if (items.length > 0) {
        items[items.length - 1].divider = true;
      }
    }

    // New window
    items.push({
      id: 'new-window',
      label: 'New window',
      divider: true,
      onClick: () => onNewWindow(app.id),
    });

    // Pin / Unpin
    items.push({
      id: 'pin',
      label: app.isPinned ? 'Unpin' : 'Pin',
      divider: true,
      onClick: () => onTogglePin(app.id),
    });

    // Quit
    items.push({
      id: 'quit',
      label: 'Quit',
      status: 'danger',
      onClick: () => onQuitApp(app.id),
    });

    return items;
  };

  const hasRunningApps = localApps.some((a) => a.hasWindows);

  return (
    <div className="rounded-xl px-1.5 py-1">
      <Reorder.Group
        as="div"
        axis="x"
        values={localApps}
        onReorder={handleReorder}
        className="flex items-center gap-2"
      >
        <AnimatePresence initial={false}>
          {localApps.map((app) => (
            <Reorder.Item
              key={app.id}
              value={app}
              as="div"
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              dragListener={true}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.15}
              layout
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
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
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}

/* ----------------------------------------
   Top Bar Component (Figma Style)
   ---------------------------------------- */

interface TopBarProps {
  onChatbotToggle: () => void;
  onOpenSettings?: () => void;
  onNotificationToggle?: () => void;
  notificationButtonRef?: React.RefObject<HTMLButtonElement>;
  dockIcons?: React.ReactNode;
  autoHide?: boolean;
}

/* ----------------------------------------
   Glass Domain Select (Desktop Top Bar)
   ---------------------------------------- */

interface GlassDomainSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function GlassDomainSelect({ value, onChange, options }: GlassDomainSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 h-7 px-2.5 rounded-[var(--primitive-radius-md)] bg-[var(--desktop-glass-bg)] border border-[var(--desktop-glass-border)] text-[var(--desktop-text)] text-body-md hover:bg-[var(--desktop-glass-bg-strong)] transition-colors cursor-pointer select-none"
      >
        <span className="truncate max-w-[120px]">{selectedLabel}</span>
        <IconSelector
          size={14}
          stroke={1.5}
          className="text-[var(--desktop-text-muted)] shrink-0"
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1.5 min-w-[160px] py-1 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] shadow-2xl z-[1100] overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-body-md transition-colors cursor-pointer ${
                opt.value === value
                  ? 'text-[var(--desktop-text)] bg-[var(--desktop-active-bg)]'
                  : 'text-[var(--desktop-text-muted)] hover:text-[var(--desktop-text)] hover:bg-[var(--desktop-hover-bg)]'
              }`}
            >
              <span className="w-4 shrink-0 flex items-center justify-center">
                {opt.value === value && (
                  <IconCheck size={12} stroke={2} className="text-[var(--desktop-text)]" />
                )}
              </span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DesktopTopBar({
  onChatbotToggle,
  onOpenSettings,
  onNotificationToggle,
  notificationButtonRef,
  dockIcons,
  autoHide = false,
}: TopBarProps) {
  const [selectedDomain, setSelectedDomain] = useState('domain-a');
  const { theme, isDark, setTheme } = useDarkMode();
  const [topBarVisible, setTopBarVisible] = useState(false);
  const [animateTransition, setAnimateTransition] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
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
          label: theme === 'system' ? '✓ System' : 'System',
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

  const handleWrapperMouseEnter = useCallback(() => {
    if (!autoHide) return;
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setAnimateTransition(true);
    setTopBarVisible(true);
  }, [autoHide]);

  const handleWrapperMouseLeave = useCallback(() => {
    if (!autoHide) return;
    hideTimeoutRef.current = setTimeout(() => {
      setAnimateTransition(true);
      setTopBarVisible(false);
    }, 200);
  }, [autoHide]);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const prevAutoHideRef = useRef(autoHide);
  const [slideIn, setSlideIn] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const wasAutoHide = prevAutoHideRef.current;
    prevAutoHideRef.current = autoHide;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }

    if (autoHide) {
      setAnimateTransition(false);
      setTopBarVisible(true);
      setSlideIn(false);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = 0;
          setAnimateTransition(true);
          setTopBarVisible(false);
        });
      });
    } else if (wasAutoHide && !autoHide) {
      setSlideIn(true);
      setAnimateTransition(false);
      setTopBarVisible(false);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = 0;
          setAnimateTransition(true);
          setTopBarVisible(true);
        });
      });
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [autoHide]);

  const isHidden = slideIn ? !topBarVisible : autoHide && !topBarVisible;

  const topBarContent = (
    <div
      className={`fixed top-0 left-0 right-0 h-[52px] bg-[var(--desktop-topbar-bg)] backdrop-blur-xl flex items-center justify-between pl-4 border-b border-[var(--desktop-glass-border)] ${autoHide || slideIn ? 'z-[9999]' : 'z-[1000]'}`}
      style={{
        boxShadow:
          (autoHide && topBarVisible) || slideIn
            ? '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03)'
            : 'none',
        transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: animateTransition
          ? 'transform 300ms ease-out, box-shadow 300ms ease-out'
          : 'none',
      }}
      onTransitionEnd={(e) => {
        if (slideIn && topBarVisible && e.propertyName === 'transform') {
          setSlideIn(false);
        }
      }}
    >
      {/* Left Section - Logo + Dock Icons */}
      <div className="flex items-center gap-8 h-full">
        {/* THAKI Cloud Logo */}
        <img src={isDark ? ThakiLogoDark : ThakiLogoLight} alt="THAKI Cloud" className="h-5" />

        {/* Dock Icons */}
        {dockIcons}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Domain Selector */}
        <GlassDomainSelect
          value={selectedDomain}
          onChange={setSelectedDomain}
          options={domainOptions}
        />

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <ContextMenu items={contextMenuItems} trigger="click" minTop={52}>
            <button
              type="button"
              className="w-5 h-5 flex items-center justify-center text-[var(--desktop-text-muted)] hover:text-[var(--desktop-text)] cursor-pointer transition-colors"
              aria-label="Language and theme"
            >
              <Icons.Finetuning size={20} stroke={1.5} />
            </button>
          </ContextMenu>
          <ContextMenu
            items={[
              {
                id: 'user-email',
                label: 'thaki.kim@example.com',
                onClick: () => {
                  onOpenSettings?.();
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
            minTop={52}
          >
            <button
              type="button"
              className="w-5 h-5 flex items-center justify-center text-[var(--desktop-text-muted)] hover:text-[var(--desktop-text)] cursor-pointer transition-colors"
              aria-label="User menu"
            >
              <Icons.UserCircle size={20} stroke={1.5} />
            </button>
          </ContextMenu>
          <button
            type="button"
            ref={notificationButtonRef}
            onClick={onNotificationToggle}
            className="w-5 h-5 flex items-center justify-center text-[var(--desktop-text-muted)] hover:text-[var(--desktop-text)] cursor-pointer transition-colors"
            aria-label="Notifications"
          >
            <Icons.Notification size={20} stroke={1.5} />
          </button>
        </div>

        {/* Separator + Chatbot */}
        <div className="flex items-center border-l border-[var(--desktop-separator)] px-2.5">
          <button
            className="w-8 h-8 flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
            onClick={onChatbotToggle}
            title="AI Chatbot"
            aria-label="AI Chatbot"
          >
            <img src={appIconAIChat} alt="AI Chatbot" className="w-8 h-8 object-contain" />
          </button>
        </div>
      </div>

      {/* Language Change Confirmation Modal */}
      <Modal
        isOpen={showLanguageConfirmModal}
        onClose={cancelLanguageChange}
        title="Confirm language change"
      >
        <p className="text-body-md text-[var(--color-text-default)] mb-6">
          {pendingLanguage && (
            <>
              This action changes the language to{' '}
              <strong>{pendingLanguage === 'en' ? 'English' : 'Korean'}</strong>?
            </>
          )}
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={cancelLanguageChange}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmLanguageChange}>
            Apply
          </Button>
        </div>
      </Modal>
    </div>
  );

  if (autoHide) {
    return (
      <div onMouseEnter={handleWrapperMouseEnter} onMouseLeave={handleWrapperMouseLeave}>
        {/* Hot zone: thin invisible strip at top to trigger TopBar reveal */}
        <div className="fixed top-0 left-0 right-0 h-[6px] z-[10000]" />
        {topBarContent}
      </div>
    );
  }

  return topBarContent;
}

/* ----------------------------------------
   Admin center Popup Panel (Figma Style)
   ---------------------------------------- */

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
  onOpenApp?: (appId: AppId) => void;
}

function AdminCenterPanel({ isOpen, onClose, onOpenApp }: AdminPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            className="fixed inset-0 z-[6000] bg-black/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
          {/* Panel - centered on screen */}
          <div className="fixed inset-0 z-[6001] flex items-center justify-center pointer-events-none">
            <motion.div
              className="bg-[var(--desktop-glass-bg-strong)] backdrop-blur-md rounded-2xl px-10 py-6 flex gap-12 items-center border border-[var(--desktop-glass-border-strong)] pointer-events-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <button
                className="flex flex-col items-center gap-2 w-20 cursor-pointer bg-transparent border-none p-0"
                onClick={() => {
                  onOpenApp?.('storage' as AppId);
                  onClose();
                }}
              >
                <img src={imgStorageAdmin} alt="Storage Admin" className="w-16 h-16 object-cover" />
                <span className="text-label-md text-[var(--desktop-text)] text-center">
                  Storage Admin
                </span>
              </button>
              <button
                className="flex flex-col items-center gap-2 w-20 cursor-pointer bg-transparent border-none p-0"
                onClick={() => {
                  onOpenApp?.('compute-admin');
                  onClose();
                }}
              >
                <img src={imgComputeAdmin} alt="Compute Admin" className="w-16 h-16 object-cover" />
                <span className="text-label-md text-[var(--desktop-text)] text-center">
                  Compute Admin
                </span>
              </button>
              <button
                className="flex flex-col items-center gap-2 w-20 cursor-pointer bg-transparent border-none p-0"
                onClick={() => {
                  onOpenApp?.('ai-platform' as AppId);
                  onClose();
                }}
              >
                <img
                  src={imgAIPlatformAdmin}
                  alt="AI Platform Admin"
                  className="w-16 h-16 object-cover"
                />
                <span className="text-label-md text-[var(--desktop-text)] text-center">
                  AI Platform Admin
                </span>
              </button>
              <button
                className="flex flex-col items-center gap-2 w-20 cursor-pointer bg-transparent border-none p-0"
                onClick={() => {
                  onOpenApp?.('cloud-builder');
                  onClose();
                }}
              >
                <img src={imgCloud} alt="Cloud Builder" className="w-16 h-16 object-cover" />
                <span className="text-label-md text-[var(--desktop-text)] text-center">
                  Cloud Builder
                </span>
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ----------------------------------------
   Desktop Page Component
   ---------------------------------------- */

/* ----------------------------------------
   Window Management Types
   ---------------------------------------- */

type AppId =
  | 'compute'
  | 'storage'
  | 'container'
  | 'agent'
  | 'ai-platform'
  | 'iam'
  | 'settings'
  | 'compute-admin'
  | 'cloud-builder';

interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  isActive: boolean;
  zIndex: number;
  createdAt: number;
  initialX: number;
  initialY: number;
}

interface AppState {
  id: AppId;
  name: string;
  icon: string;
  isPinned: boolean;
  windows: WindowState[];
}

/* ----------------------------------------
   Isolated Router — resets parent router context so MemoryRouter can nest
   ---------------------------------------- */

function IsolatedRouter({
  initialPath,
  appId,
  onClose,
}: {
  initialPath: string;
  appId: AppId;
  onClose: () => void;
}) {
  return (
    <UNSAFE_LocationContext.Provider value={null as any}>
      <UNSAFE_RouteContext.Provider value={{ outlet: null, matches: [], isDataRoute: false }}>
        <MemoryRouter initialEntries={[initialPath]}>
          <SidebarProvider>
            <TabProvider onLastTabClose={onClose} persistTabs={false}>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full text-[var(--color-text-muted)]">
                    Loading...
                  </div>
                }
              >
                <AppRoutes appId={appId} />
              </Suspense>
            </TabProvider>
          </SidebarProvider>
        </MemoryRouter>
      </UNSAFE_RouteContext.Provider>
    </UNSAFE_LocationContext.Provider>
  );
}

function AppRoutes({ appId }: { appId: AppId }) {
  switch (appId) {
    case 'compute':
      return (
        <Routes>
          <Route path="/compute" element={<ComputeHomePage />} />
          {computeRoutes}
          <Route path="/compute/*" element={<ComputeHomePage />} />
        </Routes>
      );
    case 'storage':
      return (
        <Routes>
          {storageRoutes}
          <Route path="/storage/*" element={<StorageHomePage />} />
        </Routes>
      );
    case 'container':
      return <Routes>{containerRoutes}</Routes>;
    case 'agent':
      return (
        <Routes>
          {agentRoutes}
          <Route path="/agent/*" element={<HomePage />} />
        </Routes>
      );
    case 'ai-platform':
      return (
        <Routes>
          <Route path="/ai-platform" element={<AIPlatformPage />} />
          <Route path="/ai-platform/*" element={<AIPlatformPage />} />
        </Routes>
      );
    case 'iam':
      return <Routes>{iamRoutes}</Routes>;
    case 'settings':
      return (
        <Routes>
          <Route path="/settings" element={<SettingsGeneralPage />} />
          <Route path="/settings/general" element={<SettingsGeneralPage />} />
          <Route path="/settings/account" element={<SettingsAccountPage />} />
          <Route path="/settings/notifications" element={<SettingsNotificationsPage />} />
          <Route path="/settings/information" element={<SettingsInformationPage />} />
          <Route path="/settings/*" element={<SettingsGeneralPage />} />
        </Routes>
      );
    case 'compute-admin':
      return <Routes>{computeAdminRoutes}</Routes>;
    case 'cloud-builder':
      return (
        <Routes>
          <Route path="/cloudbuilder" element={<CloudBuilderConsolePage />} />
          <Route path="/cloudbuilder/:slug" element={<CloudBuilderConsolePage />} />
          <Route path="/cloudbuilder/:slug/create" element={<CloudBuilderCreatePage />} />
          <Route path="/cloudbuilder/:slug/detail/:id" element={<CloudBuilderDetailPage />} />
          <Route path="/cloudbuilder/*" element={<CloudBuilderConsolePage />} />
        </Routes>
      );
    default:
      return null;
  }
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
  onMaximizeChange?: (windowId: string, isMaximized: boolean) => void;
  title: string;
  children: React.ReactNode;
  zIndex: number;
  initialX: number;
  initialY: number;
}

const TOP_BAR_HEIGHT = 52;
const MIN_WINDOW_WIDTH = 400;
const MIN_WINDOW_HEIGHT = 300;

function PageWindow({
  windowId,
  isOpen,
  isMinimized,
  isActive,
  onClose,
  onMinimize,
  onFocus,
  onMaximizeChange,
  title,
  children,
  zIndex,
  initialX,
  initialY,
}: PageWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(() => ({
    x: initialX,
    y: initialY,
  }));
  const [size, setSize] = useState({ width: 1440, height: 800 });
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
  const hasMounted = useRef(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      hasMounted.current = true;
    });
  }, []);

  useEffect(() => {
    if (isActive && windowRef.current) {
      windowRef.current.focus();
    }
  }, [isActive]);

  const prevMinimizedRef = useRef(isMinimized);
  useEffect(() => {
    const wasMinimized = prevMinimizedRef.current;
    prevMinimizedRef.current = isMinimized;
    if (wasMinimized && !isMinimized && isMaximized) {
      onMaximizeChange?.(windowId, true);
    }
  }, [isMinimized, isMaximized, onMaximizeChange, windowId]);

  // Drag handler
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
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
        const dx = ev.clientX - dragStart.current.x;
        const dy = ev.clientY - dragStart.current.y;
        setPosition({
          x: dragStart.current.posX + dx,
          y: Math.max(TOP_BAR_HEIGHT, dragStart.current.posY + dy),
        });
      };
      const handleMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [isMaximized, position]
  );

  // Resize handler
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: string) => {
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

        let newW = dragStart.current.w;
        let newH = dragStart.current.h;
        let newX = dragStart.current.posX;
        let newY = dragStart.current.posY;

        if (dir.includes('e')) newW = Math.max(MIN_WINDOW_WIDTH, dragStart.current.w + dx);
        if (dir.includes('s')) newH = Math.max(MIN_WINDOW_HEIGHT, dragStart.current.h + dy);
        if (dir.includes('w')) {
          const proposedW = dragStart.current.w - dx;
          if (proposedW >= MIN_WINDOW_WIDTH) {
            newW = proposedW;
            newX = dragStart.current.posX + dx;
          }
        }
        if (dir.includes('n')) {
          const proposedH = dragStart.current.h - dy;
          if (proposedH >= MIN_WINDOW_HEIGHT) {
            newH = proposedH;
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

  const handleMinimize = useCallback(() => {
    onMinimize();
  }, [onMinimize]);

  const handleMaximize = useCallback(() => {
    if (!isMaximized) {
      setPreMaxState({ x: position.x, y: position.y, w: size.width, h: size.height });
      setIsMaximized(true);
      onMaximizeChange?.(windowId, true);
    } else {
      if (preMaxState) {
        setPosition({ x: preMaxState.x, y: preMaxState.y });
        setSize({ width: preMaxState.w, height: preMaxState.h });
      }
      setIsMaximized(false);
      onMaximizeChange?.(windowId, false);
    }
  }, [isMaximized, position, size, preMaxState, onMaximizeChange, windowId]);

  const windowControls = useMemo(
    () => ({
      onMinimize: handleMinimize,
      onMaximize: handleMaximize,
      onClose,
      onDragStart: handleDragStart,
      onDoubleClick: handleMaximize,
      isMaximized,
    }),
    [handleMinimize, handleMaximize, onClose, handleDragStart, isMaximized]
  );

  if (!isOpen) return null;

  const windowTransition =
    hasMounted.current && !isDragging.current && !isResizing.current && !isMinimized
      ? 'width 250ms ease-out, height 250ms ease-out, top 250ms ease-out, left 250ms ease-out, border-radius 250ms ease-out'
      : 'none';

  const windowStyle: React.CSSProperties = isMaximized
    ? {
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        zIndex: zIndex,
        borderRadius: 0,
        transition: windowTransition,
      }
    : {
        width: `${size.width}px`,
        height: `${size.height}px`,
        top: `${position.y}px`,
        left: `${position.x}px`,
        zIndex: zIndex,
        transition: windowTransition,
      };

  const resizeHandleBase = 'absolute pointer-events-auto z-10';
  const edgeThickness = '4px';
  const cornerSize = '12px';

  const minimizeAnimation = isMinimized ? { scale: 0.3, opacity: 0 } : { scale: 1, opacity: 1 };

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 2000 + zIndex,
        ...(isMinimized ? { pointerEvents: 'none' as const } : {}),
      }}
    >
      <motion.div
        ref={windowRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={minimizeAnimation}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={
          isMinimized ? { duration: 0.25, ease: 'easeIn' } : { duration: 0.2, ease: 'easeOut' }
        }
        className="absolute bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
        style={{
          ...windowStyle,
          transformOrigin: isMinimized ? 'top center' : 'center',
          ...(isMinimized ? { pointerEvents: 'none' as const } : {}),
        }}
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest('button')) onFocus();
        }}
        onMouseDown={(e) => {
          if (!(e.target as HTMLElement).closest('button')) onFocus();
        }}
      >
        {/* Window Content — window controls are integrated into TabBar via context */}
        <DesktopWindowProvider value={{ isDesktopWindow: true, controls: windowControls }}>
          <div className="flex-1 overflow-hidden relative" style={{ transform: 'scale(1)' }}>
            {children}
          </div>
        </DesktopWindowProvider>

        {/* Resize handles (hidden when maximized) */}
        {!isMaximized && (
          <>
            {/* Edges */}
            <div
              className={`${resizeHandleBase} top-0 left-3 right-3 cursor-n-resize`}
              style={{ height: edgeThickness }}
              onMouseDown={(e) => handleResizeStart(e, 'n')}
            />
            <div
              className={`${resizeHandleBase} bottom-0 left-3 right-3 cursor-s-resize`}
              style={{ height: edgeThickness }}
              onMouseDown={(e) => handleResizeStart(e, 's')}
            />
            <div
              className={`${resizeHandleBase} left-0 top-3 bottom-3 cursor-w-resize`}
              style={{ width: edgeThickness }}
              onMouseDown={(e) => handleResizeStart(e, 'w')}
            />
            <div
              className={`${resizeHandleBase} right-0 top-3 bottom-3 cursor-e-resize`}
              style={{ width: edgeThickness }}
              onMouseDown={(e) => handleResizeStart(e, 'e')}
            />
            {/* Corners */}
            <div
              className={`${resizeHandleBase} top-0 left-0 cursor-nw-resize`}
              style={{ width: cornerSize, height: cornerSize }}
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
            />
            <div
              className={`${resizeHandleBase} top-0 right-0 cursor-ne-resize`}
              style={{ width: cornerSize, height: cornerSize }}
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
            />
            <div
              className={`${resizeHandleBase} bottom-0 left-0 cursor-sw-resize`}
              style={{ width: cornerSize, height: cornerSize }}
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
            />
            <div
              className={`${resizeHandleBase} bottom-0 right-0 cursor-se-resize`}
              style={{ width: cornerSize, height: cornerSize }}
              onMouseDown={(e) => handleResizeStart(e, 'se')}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}

interface GlobalNotif {
  id: string;
  message: string;
  statusIcon?: React.ReactNode;
  time: string;
  project?: string;
  app: string;
  appIcon: string;
  isRead?: boolean;
  detail?: { code?: string | number; message?: string };
}

function GlobalNotificationCard({
  notification,
  onMarkAsRead,
}: {
  notification: GlobalNotif;
  onMarkAsRead: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasDetail =
    notification.detail && (notification.detail.code || notification.detail.message);
  const isUnread = !notification.isRead;

  return (
    <div
      className="relative rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] flex flex-col py-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={() => {
          if (isUnread) onMarkAsRead();
        }}
        className="flex items-start justify-between px-3 cursor-pointer"
      >
        <div className="flex gap-2 items-start w-[256px]">
          <img src={notification.appIcon} alt="" className="size-5 shrink-0 object-contain" />
          <div className="flex flex-col gap-2 flex-1 min-w-[1px]">
            <div className="text-body-md text-[var(--color-text-default)]">
              {notification.message}
              {notification.statusIcon && (
                <>
                  {' '}
                  <span className="inline-flex items-center align-[-2px]">
                    {notification.statusIcon}
                  </span>
                </>
              )}
            </div>

            {notification.project && (
              <span className="text-body-xs text-[var(--color-text-subtle)]">
                {notification.project}
              </span>
            )}

            {hasDetail && (
              <div
                className="flex flex-col gap-2 rounded-[var(--radius-sm)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="group flex items-center gap-1"
                >
                  <span className="text-body-sm text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-muted)] whitespace-nowrap">
                    View detail
                  </span>
                  {isExpanded ? (
                    <IconChevronUp
                      size={12}
                      stroke={1.5}
                      className="text-[var(--color-text-subtle)]"
                    />
                  ) : (
                    <IconChevronDown
                      size={12}
                      stroke={1.5}
                      className="text-[var(--color-text-subtle)]"
                    />
                  )}
                </button>

                {isExpanded && (
                  <>
                    <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                    <div className="flex flex-col gap-1 text-body-sm text-[var(--color-text-muted)]">
                      {notification.detail?.code !== undefined && (
                        <p>code: {notification.detail.code}</p>
                      )}
                      {notification.detail?.message && <p>{notification.detail.message}</p>}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end justify-end self-stretch shrink-0">
          <span className="text-body-xs text-[var(--color-text-subtle)] whitespace-nowrap">
            {notification.time}
          </span>
        </div>
      </div>

      {isUnread && !isHovered && (
        <div className="absolute top-3 right-3 size-1.5 rounded-full bg-[var(--color-action-primary)]" />
      )}

      {isUnread && isHovered && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMarkAsRead();
          }}
          className="absolute top-[6px] right-[8px] size-4 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] transition-colors"
          aria-label="Mark as read"
        >
          <IconCheckbox size={12} stroke={1.5} />
        </button>
      )}
    </div>
  );
}

export function DesktopPage() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [showAdminCenter, setShowAdminCenter] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!showNotifications) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowNotifications(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showNotifications]);

  const adminCenterIconRef = useRef<HTMLButtonElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const desktopGridRef = useRef<HTMLDivElement>(null);
  const [desktopIcons, setDesktopIcons] = useState<DesktopIconItem[]>(getInitialIconLayout);
  const { dragState, handleMouseDown } = useDesktopIconDrag(
    desktopIcons,
    setDesktopIcons,
    desktopGridRef
  );

  // Window Management System
  // Dock menu 시뮬레이션 모드 - 실제 앱 실행 없이 인터랙션만 테스트
  const isSimulationMode = false;

  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [maximizedWindows, setMaximizedWindows] = useState<Set<string>>(new Set());
  const hasMaximizedWindow = maximizedWindows.size > 0;

  const handleMaximizeChange = useCallback((windowId: string, isMax: boolean) => {
    setMaximizedWindows((prev) => {
      const next = new Set(prev);
      if (isMax) next.add(windowId);
      else next.delete(windowId);
      return next;
    });
  }, []);
  const appConfigs: Record<AppId, { name: string; icon: string; initialPath: string }> = {
    compute: { name: 'Compute', icon: imgCompute, initialPath: '/compute' },
    storage: { name: 'Storage', icon: imgStorage, initialPath: '/storage' },
    container: { name: 'Container', icon: imgContainer, initialPath: '/container' },
    agent: { name: 'Agent Ops', icon: imgAgent, initialPath: '/agent' },
    'ai-platform': { name: 'AI Platform', icon: imgAi, initialPath: '/ai-platform' },
    iam: { name: 'IAM', icon: imgIam, initialPath: '/iam' },
    settings: { name: 'Settings', icon: imgSettings, initialPath: '/settings' },
    'compute-admin': {
      name: 'Compute Admin',
      icon: imgComputeAdmin,
      initialPath: '/compute-admin',
    },
    'cloud-builder': { name: 'Cloud Builder', icon: imgCloud, initialPath: '/cloudbuilder' },
  };
  const [pinnedApps, setPinnedApps] = useState<Set<AppId>>(new Set());
  const [dockAppOrder, setDockAppOrder] = useState<AppId[]>([]);

  const visibleDockApps = useMemo(() => {
    const visible = dockAppOrder.filter(
      (appId) => pinnedApps.has(appId) || windows.some((w) => w.appId === appId)
    );
    const pinned = visible.filter((appId) => pinnedApps.has(appId));
    const unpinned = visible.filter((appId) => !pinnedApps.has(appId));
    return [...pinned, ...unpinned];
  }, [dockAppOrder, pinnedApps, windows]);

  // Window management functions
  const CASCADE_OFFSET = 30;
  const CASCADE_MAX = 180;
  const WINDOW_WIDTH = 1440;
  const WINDOW_HEIGHT = 800;

  const createWindow = useCallback(
    (appId: AppId) => {
      const config = appConfigs[appId];
      if (!config) return;

      const baseX = Math.max(0, Math.round((window.innerWidth - WINDOW_WIDTH) / 2));
      const baseY = Math.max(
        TOP_BAR_HEIGHT,
        Math.round((window.innerHeight - WINDOW_HEIGHT) / 2 + TOP_BAR_HEIGHT / 2)
      );

      const openCount = windows.filter((w) => !w.isMinimized).length;
      const offsetX = (openCount * CASCADE_OFFSET) % CASCADE_MAX;
      const offsetY = (openCount * CASCADE_OFFSET) % CASCADE_MAX;

      const maxX = window.innerWidth - 400;
      const maxY = window.innerHeight - 200;

      const newWindow: WindowState = {
        id: `${appId}-${Date.now()}`,
        appId,
        title: config.name,
        isMinimized: false,
        isActive: true,
        zIndex: nextZIndex,
        createdAt: Date.now(),
        initialX: Math.min(baseX + offsetX, maxX),
        initialY: Math.min(baseY + offsetY, maxY),
      };

      setWindows((prev) => prev.map((w) => ({ ...w, isActive: false })).concat(newWindow));
      setNextZIndex((prev) => prev + 1);

      // Dock에 앱이 없으면 추가
      setDockAppOrder((prev) => (prev.includes(appId) ? prev : [...prev, appId]));
    },
    [appConfigs, nextZIndex, windows]
  );

  const closeWindow = useCallback((windowId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId));
    setMaximizedWindows((prev) => {
      const next = new Set(prev);
      next.delete(windowId);
      return next;
    });
  }, []);

  const minimizeWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, isMinimized: true, isActive: false } : w))
    );
    setMaximizedWindows((prev) => {
      if (!prev.has(windowId)) return prev;
      const next = new Set(prev);
      next.delete(windowId);
      return next;
    });
  }, []);

  const focusWindow = useCallback(
    (windowId: string) => {
      setWindows((prev) => {
        const targetWindow = prev.find((w) => w.id === windowId);
        if (!targetWindow) return prev;

        return prev.map((w) => ({
          ...w,
          isActive: w.id === windowId,
          isMinimized: w.id === windowId ? false : w.isMinimized,
          zIndex: w.id === windowId ? nextZIndex : w.zIndex,
        }));
      });
      setNextZIndex((prev) => prev + 1);
    },
    [nextZIndex]
  );

  // 모든 윈도우의 포커스를 해제 (Focus out)
  const blurAllWindows = useCallback(() => {
    setWindows((prev) => prev.map((w) => ({ ...w, isActive: false })));
  }, []);

  const focusApp = useCallback(
    (appId: AppId) => {
      // 시뮬레이션 모드: 왼쪽 클릭 시 실제 앱 실행하지 않음
      // 우클릭 ContextMenu만 테스트하는 용도
      if (isSimulationMode) {
        console.log(
          `[Simulation] Left-click on ${appId} - no action (use right-click for context menu)`
        );
        return;
      }

      const appWindows = windows.filter((w) => w.appId === appId);

      // 1) 앱이 실행되고 있지 않은 경우 → 실행 (새 창)
      if (appWindows.length === 0) {
        createWindow(appId);
        return;
      }

      // 2) 앱이 실행중이나 Focus Out된 경우 → 가장 마지막에 Focus In 되었던 윈도우로 다시 Focus In
      const activeWindows = appWindows.filter((w) => !w.isMinimized);
      if (activeWindows.length > 0) {
        // zIndex가 가장 높은 윈도우 (가장 최근에 포커스된 윈도우)
        const mostRecent = activeWindows.sort((a, b) => b.zIndex - a.zIndex)[0];
        focusWindow(mostRecent.id);
        return;
      }

      // 3) 앱이 실행중이나 모두 최소화된 경우 → 가장 나중에 최소화된 윈도우를 이전 크기로 복원(Restore)
      const minimizedWindows = appWindows.filter((w) => w.isMinimized);
      if (minimizedWindows.length > 0) {
        // 가장 나중에 최소화된 윈도우 (zIndex가 가장 높은 것)
        const lastMinimized = minimizedWindows.sort((a, b) => b.zIndex - a.zIndex)[0];
        focusWindow(lastMinimized.id);
      }
    },
    [windows, createWindow, focusWindow, isSimulationMode]
  );

  const togglePinApp = useCallback((appId: AppId) => {
    setPinnedApps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(appId)) {
        newSet.delete(appId);
      } else {
        newSet.add(appId);
      }
      return newSet;
    });
  }, []);

  // Global notification panel data
  const [globalNotifications, setGlobalNotifications] = useState([
    {
      id: '1',
      message: 'Instance "web-01" created.',
      statusIcon: (
        <IconCircleCheck size={14} stroke={1.5} className="text-[var(--color-state-success)]" />
      ),
      time: '10:23',
      project: 'proj-1',
      app: 'Compute',
      appIcon: AppIconCompute,
      isRead: false,
      detail: { code: 200, message: 'Instance created with 4 vCPUs, 8GB RAM, and 100GB storage.' },
    },
    {
      id: '2',
      message: 'Volume "data-vol-02" create failed.',
      statusIcon: (
        <IconAlertTriangle size={14} stroke={1.5} className="text-[var(--color-state-danger)]" />
      ),
      time: '09:30',
      project: 'proj-2',
      app: 'Compute',
      appIcon: AppIconCompute,
      isRead: false,
      detail: {
        code: 400,
        message: "Flavor's disk is smaller than the minimum size specified in image metadata.",
      },
    },
    {
      id: '3',
      message: 'API key "prod-key-01" has been rotated.',
      statusIcon: (
        <IconInfoCircle size={14} stroke={1.5} className="text-[var(--color-state-info)]" />
      ),
      time: '08:45',
      app: 'IAM',
      appIcon: AppIconIAM,
      isRead: false,
    },
    {
      id: '4',
      message: 'Pod "api-gateway" crash loop.',
      statusIcon: (
        <IconAlertTriangle size={14} stroke={1.5} className="text-[var(--color-state-danger)]" />
      ),
      time: '09:55',
      project: 'default',
      app: 'Container',
      appIcon: AppIconContainer,
      isRead: false,
      detail: { code: 'ERR_CRASH_LOOP', message: 'Container exited with code 137 (OOMKilled).' },
    },
    {
      id: '5',
      message: 'Volume "backup-01" snapshot done.',
      statusIcon: (
        <IconCircleCheck size={14} stroke={1.5} className="text-[var(--color-state-success)]" />
      ),
      time: '10:10',
      project: 'proj-1',
      app: 'Storage',
      appIcon: AppIconStorage,
      isRead: false,
    },
  ]);
  const [gnpActiveTab, setGnpActiveTab] = useState('all');
  const [gnpActiveApp, setGnpActiveApp] = useState('all');

  const gnpAppIcon = (src: string) => <img src={src} alt="" className="size-4 object-cover" />;
  const gnpAppOptions = [
    { value: 'all', label: 'All apps' },
    { value: 'Compute', label: 'Compute', icon: gnpAppIcon(AppIconCompute) },
    { value: 'IAM', label: 'IAM', icon: gnpAppIcon(AppIconIAM) },
    { value: 'Container', label: 'Container', icon: gnpAppIcon(AppIconContainer) },
    { value: 'Storage', label: 'Storage', icon: gnpAppIcon(AppIconStorage) },
  ].filter((opt) => opt.value === 'all' || globalNotifications.some((n) => n.app === opt.value));

  const gnpFiltered = globalNotifications.filter((n) => {
    if (gnpActiveTab === 'unread' && n.isRead) return false;
    if (gnpActiveApp !== 'all' && n.app !== gnpActiveApp) return false;
    return true;
  });
  const gnpUnreadCount = globalNotifications.filter((n) => !n.isRead).length;

  const handleGnpMarkAsRead = (id: string) => {
    setGlobalNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleGnpMarkAllAsRead = () => {
    setGlobalNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // 데스크탑 배경 클릭 시 모든 윈도우 포커스 해제
  const handleDesktopClick = useCallback(
    (e: React.MouseEvent) => {
      // 클릭한 대상이 현재 요소 자체인 경우에만 blur (자식 요소 클릭은 무시)
      if (e.target === e.currentTarget) {
        blurAllWindows();
      }
    },
    [blurAllWindows]
  );

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-[var(--desktop-bg)]"
      onClick={handleDesktopClick}
    >
      <img
        src={DesktopBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          opacity: 'var(--desktop-wallpaper-opacity)',
          filter: 'var(--desktop-wallpaper-filter)',
        }}
      />
      {/* Top Bar */}
      <DesktopTopBar
        onChatbotToggle={() => setShowChatbot(!showChatbot)}
        onOpenSettings={() => {
          focusApp('settings');
        }}
        onNotificationToggle={() => setShowNotifications(!showNotifications)}
        notificationButtonRef={notificationButtonRef}
        dockIcons={
          <DockIcons
            apps={visibleDockApps.map((appId) => ({
              id: appId,
              name: appConfigs[appId].name,
              icon: appConfigs[appId].icon,
              isPinned: pinnedApps.has(appId),
              hasWindows: windows.some((w) => w.appId === appId),
              hasActiveWindow: windows.some((w) => w.appId === appId && w.isActive),
              windows: windows.filter((w) => w.appId === appId),
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
              const closingIds = windows.filter((w) => w.appId === appId).map((w) => w.id);
              setWindows((prev) => prev.filter((w) => w.appId !== appId));
              if (closingIds.length > 0) {
                setMaximizedWindows((prev) => {
                  const next = new Set(prev);
                  closingIds.forEach((id) => next.delete(id));
                  return next;
                });
              }
            }}
            onReorderApps={setDockAppOrder}
          />
        }
        autoHide={hasMaximizedWindow}
      />

      {/* Desktop Icons — absolute positioned on grid */}
      <div ref={desktopGridRef} className="absolute inset-0" onClick={handleDesktopClick}>
        {desktopIcons.map((item) => {
          const pos = gridToPixel(item.col, item.row);
          const beingDragged = dragState?.isDragging && dragState.iconId === item.id;

          const handleClick = () => {
            if (item.id === 'admin-center') {
              setShowAdminCenter(!showAdminCenter);
            } else {
              focusApp(item.id as AppId);
            }
          };

          return (
            <DesktopIcon
              key={item.id}
              icon={item.icon}
              label={item.label}
              iconSlot={item.id === 'admin-center' ? <AdminCenterCompositeIcon /> : undefined}
              isDragging={beingDragged}
              style={{ left: pos.x, top: pos.y }}
              onClick={handleClick}
              onMouseDown={(e) => handleMouseDown(item.id, e)}
              ref={item.id === 'admin-center' ? adminCenterIconRef : undefined}
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

      {/* Admin center Panel */}
      <AdminCenterPanel
        isOpen={showAdminCenter}
        onClose={() => setShowAdminCenter(false)}
        anchorRef={adminCenterIconRef}
        onOpenApp={focusApp}
      />

      {/* Chatbot Panel */}
      <ChatbotPanel isOpen={showChatbot} onClose={() => setShowChatbot(false)} />

      {/* Global Notification Panel */}
      {showNotifications && notificationButtonRef.current && (
        <>
          <div className="fixed inset-0 z-[6000]" onClick={() => setShowNotifications(false)} />
          <div className="fixed z-[6001] top-[52px] right-0" onClick={(e) => e.stopPropagation()}>
            <div className="w-[360px] bg-[var(--color-surface-default)] rounded-lg border border-[var(--color-border-default)] shadow-lg overflow-hidden">
              <div className="relative pt-3 pb-0">
                <button
                  type="button"
                  onClick={handleGnpMarkAllAsRead}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center size-7 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-default)] transition-colors group"
                  aria-label="Mark all as read"
                >
                  <IconCheckbox size={16} stroke={1.5} />
                  <span className="absolute top-full right-0 mt-1 px-2 py-1 bg-[var(--color-text-default)] text-[var(--color-surface-default)] text-body-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    Mark all as read
                  </span>
                </button>
                <Tabs
                  value={gnpActiveTab}
                  onChange={setGnpActiveTab}
                  variant="underline"
                  size="sm"
                  className="w-full"
                >
                  <TabList className="w-full px-4">
                    <Tab value="all">All</Tab>
                    <Tab value="unread">Unread{gnpUnreadCount > 0 && ` (${gnpUnreadCount})`}</Tab>
                  </TabList>
                </Tabs>
              </div>

              <div className="px-3 py-2 border-b border-[var(--color-border-subtle)]">
                <Select
                  options={gnpAppOptions}
                  value={gnpActiveApp}
                  onChange={(v) => setGnpActiveApp(v)}
                  size="md"
                  fullWidth
                />
              </div>

              {gnpFiltered.length === 0 ? (
                <div className="flex items-center justify-center h-[100px] text-[var(--color-text-muted)] text-body-md">
                  No notifications
                </div>
              ) : (
                <OverlayScrollbarsComponent
                  options={{
                    overflow: { x: 'hidden', y: 'scroll' },
                    scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
                  }}
                  defer={false}
                  style={{ maxHeight: 420 }}
                  className="px-3 py-2"
                >
                  <div className="flex flex-col gap-2">
                    {gnpFiltered.map((n) => (
                      <GlobalNotificationCard
                        key={n.id}
                        notification={n}
                        onMarkAsRead={() => handleGnpMarkAsRead(n.id)}
                      />
                    ))}
                  </div>
                </OverlayScrollbarsComponent>
              )}
            </div>
          </div>
        </>
      )}

      {/* App Windows */}
      <AnimatePresence>
        {!isSimulationMode &&
          windows.map((window) => {
            const config = appConfigs[window.appId];
            if (!config) return null;

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
                onMaximizeChange={handleMaximizeChange}
                title={window.title}
                zIndex={window.zIndex}
                initialX={window.initialX}
                initialY={window.initialY}
              >
                <IsolatedRouter
                  initialPath={config.initialPath}
                  appId={window.appId}
                  onClose={() => closeWindow(window.id)}
                />
              </PageWindow>
            );
          })}
      </AnimatePresence>

      {/* Main Page Navigation Button - Bottom Left */}
      <Link
        to="/"
        className="absolute bottom-6 left-6 flex items-center gap-2 px-4 py-2 bg-[var(--desktop-glass-bg)] hover:bg-[var(--desktop-glass-bg-strong)] backdrop-blur-sm rounded-[var(--radius-lg)] text-[var(--desktop-text)] text-sm font-medium transition-all hover:-translate-y-0.5"
      >
        <IconLayoutDashboard size={18} stroke={1.5} />
        <span>Go to main page</span>
      </Link>
    </div>
  );
}

export default DesktopPage;
