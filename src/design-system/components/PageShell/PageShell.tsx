import type { ReactNode } from 'react';

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
  return (
    <div className={`fixed inset-0 bg-[var(--color-surface-subtle)] ${className}`.trim()}>
      {/* Sidebar */}
      {sidebar}

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
        <div
          className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll"
          style={{
            paddingBottom: bottomPanelPadding || '0',
          }}
        >
          <div className={`bg-[var(--color-surface-default)] ${contentClassName}`.trim()}>
            {children}
          </div>
        </div>
      </main>

      {/* Bottom Panel */}
      {bottomPanel}
    </div>
  );
}
