import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import logoImage from '../../../public/images/logo.png';
import { cn } from '../../services/utils/cn';
import type { RouteRegistry, SnapMode } from '../../types';
import type { BreadcrumbItem } from '../Breadcrumb';
import { Button } from '../Button';
import { FrameControls, type FrameState } from '../FrameControls';
import { SidebarIcon } from '../Icon';
import Layout from '../Layout';
import { TabContainer } from '../TabContainer';
import { ToolBar } from '../ToolBar';
import {
  appHeaderStyles,
  appIconStyles,
  appIconWrapperStyles,
  appNameStyles,
  contentStyles,
  headerContentStyles,
  layoutContainerStyles,
  mainContentStyles,
  mainPanelStyles,
  sideContentStyles,
  sideHeaderStyles,
  sidebarLogoStyles,
} from './AppLayout.styles';

/**
 * Types
 */

// Window Control Bridge Interface (to avoid direct dependency)
interface WindowControlBridge {
  minimize: () => void;
  maximize: () => void;
  restore: () => void;
  close: () => void;
  destroy: () => void;
  snap: (mode: 'leftHalf' | 'rightHalf' | 'topHalf' | 'bottomHalf' | 'full') => void;
  onStateChange: (
    callback: (payload: {
      frameId: string;
      state: 'normal' | 'minimized' | 'maximized' | 'fullscreen';
    }) => void
  ) => void;
  offStateChange: (
    callback: (payload: {
      frameId: string;
      state: 'normal' | 'minimized' | 'maximized' | 'fullscreen';
    }) => void
  ) => void;
}

// Generic Props Interface
interface AppLayoutConfig<TComponentName extends string = string> {
  // App identification
  appName: string;
  frameId: string;

  // Routing
  routes: RouteRegistry<TComponentName>;
  componentLoaders: Record<
    TComponentName,
    () => Promise<{ default: ComponentType<Record<string, unknown>> }>
  >;

  // Custom Components (domain-specific)
  AppHeaderTab?: ComponentType;
  SidebarComponent?: ComponentType<{
    onToggleSidebar: () => void;
    collapsed?: boolean;
  }>;
  LangButton?: ComponentType;

  // Logo customization - full replacement (takes precedence over AppIcon)
  LogoComponent?: ComponentType;

  // App icon for sidebar header (used when LogoComponent is not provided)
  // Renders: [AppIcon] [appName] [SidebarToggle]
  AppIcon?: ComponentType<{ size?: number; className?: string }>;

  // When true, shows only the app icon when sidebar is collapsed (Container app behavior)
  // Default: false (entire header hidden when collapsed)
  showIconWhenCollapsed?: boolean;

  // When true, uses wide sidebar header (240px) for two-level sidebars like Container
  // Default: false (200px header width)
  wideSidebar?: boolean;

  // Sidebar toggle button visibility (default: true)
  showSidebarToggle?: boolean;

  // Breadcrumb Configuration - hook that returns breadcrumb items
  useBreadcrumbItems: () => BreadcrumbItem[];

  // Tab Manager Hook (domain-specific)
  useTabManager: () => {
    tabs: Array<{
      id: string;
      virtualPath: string;
      params?: Record<string, unknown>;
      query?: Record<string, unknown>;
    }>;
    activeTabId: string;
    // 히스토리 네비게이션 (optional for backward compatibility)
    canGoBack: boolean;
    canGoForward: boolean;
    goBack: () => void;
    goForward: () => void;
    switchTabToPath: (path: string) => void;
  };

  // Navigation Controls (뒤로가기/앞으로가기)
  showNavigationControls?: boolean;

  // ToolBar visibility
  showToolbar?: boolean;

  // ToolBar right actions (optional custom actions)
  toolBarRightActions?: ReactNode;

  // Window Control Bridge Factory (injected from consumer)
  createWindowControlBridge: (config: { frameId: string; appName: string }) => WindowControlBridge;

  // Styles (optional custom styles)
  customStyles?: {
    layoutContainer?: string;
    mainContent?: string;
    appHeader?: string;
    headerContent?: string;
    sidebarToggle?: string;
    sidebarToggleCollapsed?: string;
    content?: string;
    toolBar?: string;
    sideHeader?: string;
  };

  // i18n strings (optional)
  i18n?: {
    logoAlt?: string;
    hideSidebarTitle?: string;
  };

  // Drag handle
  dragHandleClassName?: string;

  // Optional configurations
  initialSidebarCollapsed?: boolean;
}

interface HeaderSectionProps {
  onMinimize: () => void;
  onMaximize: () => void;
  onRestore: () => void;
  onClose: () => void;
  onHeaderDoubleClick: () => void;
  frameState: FrameState;
  AppHeaderTab?: ComponentType;
  customStyles?: AppLayoutConfig['customStyles'];
  dragHandleClassName?: string;
  onSnap?: (mode: SnapMode) => void;
}

interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
}

interface AppLayoutContentProps<TComponentName extends string> {
  config: AppLayoutConfig<TComponentName>;
}

interface AppLayoutProps<TComponentName extends string = string> {
  config: AppLayoutConfig<TComponentName>;
  TabProvider: ComponentType<{ children: React.ReactNode }>;
}

/**
 * Components
 */

const HeaderSection = memo(
  ({
    onMinimize,
    onMaximize,
    onRestore,
    onClose,
    onHeaderDoubleClick,
    frameState,
    AppHeaderTab,
    customStyles,
    dragHandleClassName,
    onSnap,
  }: HeaderSectionProps): React.ReactElement => (
    <header
      className={cn(customStyles?.appHeader ?? appHeaderStyles, dragHandleClassName)}
      onDoubleClick={onHeaderDoubleClick}
    >
      <Layout.HStack align="stretch" className={customStyles?.headerContent ?? headerContentStyles}>
        {/* empty div for backward compatibility space-between */}
        {AppHeaderTab ? <AppHeaderTab /> : <div />}

        <FrameControls
          frameState={frameState}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onRestore={onRestore}
          onClose={onClose}
          size="sm"
          onSnap={onSnap}
        />
      </Layout.HStack>
    </header>
  )
);

HeaderSection.displayName = 'HeaderSection';

const ContentArea = memo(
  ({ children, className }: ContentAreaProps): React.ReactElement => (
    <main className={cn('flex min-w-0 min-h-0', className)} data-app-content="true">
      {children}
    </main>
  )
);

ContentArea.displayName = 'ContentArea';

const AppLayoutContentInner = <TComponentName extends string>({
  config,
}: AppLayoutContentProps<TComponentName>): React.ReactElement => {
  const {
    appName,
    frameId,
    routes,
    componentLoaders,
    AppHeaderTab,
    SidebarComponent,
    LangButton,
    LogoComponent,
    AppIcon,
    showIconWhenCollapsed = false,
    wideSidebar = false,
    useBreadcrumbItems,
    useTabManager,
    createWindowControlBridge,
    customStyles,
    initialSidebarCollapsed = false,
    dragHandleClassName,
    showToolbar = true,
    showSidebarToggle = true,
    toolBarRightActions,
  } = config;

  // Get breadcrumb items from the hook
  const breadcrumbItems = useBreadcrumbItems();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(initialSidebarCollapsed);

  const {
    tabs,
    activeTabId,
    canGoBack = false,
    canGoForward = false,
    goBack,
    goForward,
    switchTabToPath,
  } = useTabManager();

  const [frameState, setFrameState] = useState<FrameState>('normal');

  // Window Control Bridge 초기화
  const windowControlBridge = useMemo(() => {
    return createWindowControlBridge({
      frameId,
      appName,
    });
  }, [frameId, appName, createWindowControlBridge]);

  // 컴포넌트 언마운트 시 bridge 정리
  useEffect(() => {
    return () => {
      windowControlBridge.destroy();
    };
  }, [windowControlBridge]);

  // Window Control Handlers
  const handleMinimize = useCallback(() => {
    setFrameState('normal');
    windowControlBridge.minimize();
  }, [windowControlBridge]);

  const handleMaximize = useCallback(() => {
    setFrameState('maximized');
    windowControlBridge.maximize();
  }, [windowControlBridge]);

  const handleRestore = useCallback(() => {
    setFrameState('normal');
    windowControlBridge.restore();
  }, [windowControlBridge]);

  const handleClose = useCallback(() => {
    windowControlBridge.close();
  }, [windowControlBridge]);

  const handleToggleMaximize = useCallback(() => {
    if (frameState === 'maximized') {
      setFrameState('normal');
      windowControlBridge.restore();
    } else {
      setFrameState('maximized');
      windowControlBridge.maximize();
    }
  }, [frameState, windowControlBridge]);

  // 사이드바 토글 핸들러
  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  // TabContainer 설정
  const tabContainerConfig = useMemo(
    () => ({
      routes,
      componentLoaders,
    }),
    [routes, componentLoaders]
  );

  // Frame state change listener
  useEffect(() => {
    const handleStateChange = (payload: {
      frameId: string;
      state: 'normal' | 'minimized' | 'maximized' | 'fullscreen';
    }): void => {
      if (payload.frameId !== frameId) return;
      setFrameState(payload.state === 'maximized' ? 'maximized' : 'normal');
    };

    windowControlBridge.onStateChange(handleStateChange);
    return () => {
      windowControlBridge.offStateChange(handleStateChange);
    };
  }, [windowControlBridge, frameId]);

  const handleSnap = useCallback(
    (mode: SnapMode) => {
      // Delegate to host via bridge
      try {
        if (mode === 'full') {
          setFrameState('maximized');
          windowControlBridge.maximize();
        } else {
          // Ensure state shows as normal locally; host will size/position
          setFrameState('normal');
          windowControlBridge.snap(mode);
        }
      } catch {
        // No-op if bridge not available
      }
    },
    [windowControlBridge]
  );

  return (
    <Layout.Container className={customStyles?.layoutContainer ?? layoutContainerStyles}>
      {/* 메인 콘텐츠 영역 */}
      <Layout.VStack className={customStyles?.mainContent ?? mainContentStyles}>
        <div className={cn(sideContentStyles, dragHandleClassName)}>
          <div
            className={
              customStyles?.sideHeader ??
              sideHeaderStyles({
                collapsed: isSidebarCollapsed && !showIconWhenCollapsed,
                collapsedWithIcon: isSidebarCollapsed && showIconWhenCollapsed,
                wide: wideSidebar,
              })
            }
          >
            {/* Container app: show only icon when collapsed */}
            {isSidebarCollapsed && showIconWhenCollapsed && AppIcon ? (
              <div className={appIconWrapperStyles}>
                <AppIcon size={24} className={appIconStyles} />
              </div>
            ) : !isSidebarCollapsed ? (
              <>
                {/* App Icon + Name + Toggle - shown when expanded */}
                {LogoComponent ? (
                  <LogoComponent />
                ) : AppIcon ? (
                  <>
                    <div className={appIconWrapperStyles}>
                      <AppIcon size={24} className={appIconStyles} />
                    </div>
                    <span className={appNameStyles}>{appName}</span>
                  </>
                ) : (
                  <img
                    src={logoImage}
                    alt="THAKI Cloud"
                    draggable={false}
                    className={sidebarLogoStyles}
                  />
                )}
                {/* Sidebar toggle */}
                {showSidebarToggle && SidebarComponent && (
                  <Button
                    appearance="ghost"
                    size="sm"
                    onClick={handleToggleSidebar}
                    title="Hide Sidebar"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <SidebarIcon variant="secondary" size={16} />
                  </Button>
                )}
              </>
            ) : null}
          </div>

          {/* 앱 헤더 - 홈 버튼, 타이틀, 사이드바 토글, 창 제어 */}
          <HeaderSection
            onMinimize={handleMinimize}
            onMaximize={handleMaximize}
            onRestore={handleRestore}
            onClose={handleClose}
            onHeaderDoubleClick={handleToggleMaximize}
            frameState={frameState}
            AppHeaderTab={AppHeaderTab}
            customStyles={customStyles}
            dragHandleClassName={dragHandleClassName}
            onSnap={handleSnap}
          />
        </div>

        {/* 탭 기반 콘텐츠 */}
        <ContentArea className={customStyles?.content ?? contentStyles}>
          {/* 사이드바 - 애니메이션 적용 */}
          {SidebarComponent && (
            <SidebarComponent
              collapsed={isSidebarCollapsed}
              onToggleSidebar={handleToggleSidebar}
            />
          )}

          <div className={mainPanelStyles}>
            {/* ToolBar - 네비게이션 컨트롤, 브레드크럼, 알림 센터 */}
            {showToolbar && (
              <ToolBar
                breadcrumbItems={breadcrumbItems}
                navigation={{
                  canGoBack,
                  canGoForward,
                  onGoBack: goBack,
                  onGoForward: goForward,
                }}
                isSidebarOpen={!isSidebarCollapsed}
                onToggleSidebar={handleToggleSidebar}
                langButton={LangButton ? <LangButton /> : undefined}
                rightActions={toolBarRightActions}
                className={customStyles?.toolBar}
              />
            )}

            <TabContainer
              tabs={tabs}
              activeTabId={activeTabId}
              config={tabContainerConfig}
              goBack={goBack}
              switchTabToPath={switchTabToPath}
            />
          </div>
        </ContentArea>
      </Layout.VStack>
    </Layout.Container>
  );
};

const AppLayoutContent = memo(AppLayoutContentInner) as typeof AppLayoutContentInner & {
  displayName?: string;
};

AppLayoutContent.displayName = 'AppLayoutContent';

const AppLayoutInner = <TComponentName extends string>({
  config,
  TabProvider,
}: AppLayoutProps<TComponentName>): React.ReactElement => {
  return (
    <TabProvider>
      <AppLayoutContent config={config} />
    </TabProvider>
  );
};

const AppLayout = memo(AppLayoutInner) as typeof AppLayoutInner & {
  displayName?: string;
};

AppLayout.displayName = 'AppLayout';

/**
 * Exports
 */

export { AppLayout, AppLayoutContent };
export type { AppLayoutConfig, AppLayoutProps, WindowControlBridge };
export default AppLayout;
