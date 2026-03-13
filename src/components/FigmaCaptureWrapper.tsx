import type { ReactNode } from 'react';

interface FigmaCaptureWrapperProps {
  children: ReactNode;
  sidebar?: ReactNode;
  sidebarWidth?: number;
  tabBar?: ReactNode;
  topBar?: ReactNode;
  contentClassName?: string;
}

/**
 * PageShell을 우회하여 HTML to Design 플러그인이 data-figma-name 속성을 인식할 수 있도록
 * 단순한 스크롤 가능 레이아웃을 제공합니다. URL에 ?figma=true 추가 시 사용됩니다.
 *
 * sidebar/tabBar/topBar를 전달하면 PageShell과 동일한 시각적 구조를 일반 flex 레이아웃으로
 * 렌더링합니다. fixed/absolute 포지셔닝 없이 문서 흐름을 사용하므로 플러그인 호환성이 유지됩니다.
 */
export function FigmaCaptureWrapper({
  children,
  sidebar,
  sidebarWidth = 200,
  tabBar,
  topBar,
  contentClassName = 'pt-4 px-8 pb-20',
}: FigmaCaptureWrapperProps) {
  const hasShell = sidebar || tabBar || topBar;

  if (!hasShell) {
    return (
      <div className="fixed inset-0 bg-white overflow-y-auto">
        <div className={contentClassName}>{children}</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[var(--color-surface-subtle)] flex flex-col overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {/* Sidebar — override fixed positioning to relative flow */}
        {sidebar && (
          <div
            className="flex-shrink-0 [&>aside]:!relative [&>aside]:!left-auto [&>aside]:!top-auto [&>aside]:!h-full"
            style={{ width: sidebarWidth }}
          >
            {sidebar}
          </div>
        )}

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-surface-default)]">
          {tabBar}
          {topBar}

          {/* Content — scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className={`bg-[var(--color-surface-default)] ${contentClassName}`.trim()}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
