import {
  type ReactNode,
  type ReactElement,
  useState,
  useRef,
  useCallback,
  useEffect,
  isValidElement,
  cloneElement,
} from 'react';
import { useLocation } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { ToastContainer } from '../Toast';

/* ----------------------------------------
   PageShell Types
   ---------------------------------------- */

export interface PageShellProps {
  /** 사이드바 영역 (ReactNode) */
  sidebar: ReactNode;
  /** 사이드바의 현재 너비 (px) — 페이지에서 계산하여 전달 */
  sidebarWidth: number;
  /** 탭바 영역 */
  tabBar?: ReactNode;
  /** 상단바 영역 */
  topBar?: ReactNode;
  /** 하단 패널 영역 (ShellPanel 등) */
  bottomPanel?: ReactNode;
  /** 페이지 본문 */
  children: ReactNode;
  /** 콘텐츠 영역 패딩 클래스 — 기본 'pt-4 px-8 pb-20' */
  contentClassName?: string;
  /** 하단 패널 확장 시 콘텐츠 하단 패딩 */
  bottomPanelPadding?: string;
  /** 추가 CSS 클래스 (outer container) */
  className?: string;
}

/* ----------------------------------------
   PageShell Component
   ---------------------------------------- */

export function PageShell({
  sidebar,
  sidebarWidth,
  tabBar,
  topBar,
  bottomPanel,
  children,
  contentClassName = 'pt-4 px-8 pb-20',
  bottomPanelPadding,
  className = '',
}: PageShellProps) {
  const location = useLocation();
  const isSidebarHidden = sidebarWidth === 0;
  const [hoverOpen, setHoverOpen] = useState(false);
  const enterDelayRef = useRef<number>();

  const handleTriggerEnter = useCallback(() => {
    enterDelayRef.current = window.setTimeout(() => setHoverOpen(true), 80);
  }, []);

  const handleTriggerLeave = useCallback(() => {
    clearTimeout(enterDelayRef.current);
  }, []);

  const handleOverlayLeave = useCallback(() => {
    setHoverOpen(false);
  }, []);

  useEffect(() => {
    if (!isSidebarHidden) setHoverOpen(false);
  }, [isSidebarHidden]);

  useEffect(() => {
    setHoverOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    return () => clearTimeout(enterDelayRef.current);
  }, []);

  return (
    <div
      data-figma-name="[TDS] AppLayout"
      className={`fixed inset-0 bg-[var(--color-surface-subtle)] ${className}`.trim()}
    >
      {/* Sidebar */}
      {sidebar}

      {/* Hover trigger zone + overlay sidebar */}
      {isSidebarHidden && isValidElement(sidebar) && (
        <>
          {/* Invisible trigger strip along left edge */}
          {!hoverOpen && (
            <div
              className="fixed left-0 top-0 w-2 h-screen z-50"
              onMouseEnter={handleTriggerEnter}
              onMouseLeave={handleTriggerLeave}
            />
          )}

          {/* Overlay sidebar — always mounted, controlled by translateX */}
          <div
            className={`fixed left-0 top-0 w-[200px] h-screen z-50 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              hoverOpen
                ? 'translate-x-0 shadow-2xl pointer-events-auto'
                : '-translate-x-full shadow-none pointer-events-none'
            }`}
            onMouseLeave={handleOverlayLeave}
          >
            {cloneElement(sidebar as ReactElement<{ forceVisible?: boolean }>, {
              forceVisible: true,
            })}
          </div>
        </>
      )}

      {/* Main Content */}
      <main
        className="absolute top-0 bottom-0 right-0 flex flex-col bg-[var(--color-surface-default)] transition-[left] duration-200"
        style={{ left: `${sidebarWidth}px` }}
      >
        {/* Tab Bar */}
        {tabBar}

        {/* Top Bar */}
        {topBar}

        {/* Content Area */}
        <OverlayScrollbarsComponent
          options={{
            overflow: { x: 'hidden', y: 'scroll' },
            scrollbars: { autoHide: 'scroll', autoHideDelay: 800 },
          }}
          defer={false}
          className="flex-1 min-w-0 overscroll-contain"
          style={{
            paddingBottom: bottomPanelPadding || '0',
          }}
        >
          <div
            className={`w-full min-w-0 bg-[var(--color-surface-default)] min-h-full ${contentClassName}`.trim()}
          >
            {children}
          </div>
        </OverlayScrollbarsComponent>
        {/* Toast */}
        <ToastContainer position="bottom-right" scope="app" />
      </main>

      {/* Bottom Panel */}
      {bottomPanel}
    </div>
  );
}
