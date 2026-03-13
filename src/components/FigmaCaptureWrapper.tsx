import type { ReactNode } from 'react';

/**
 * PageShell을 우회하여 HTML to Design 플러그인이 data-figma-name 속성을 인식할 수 있도록
 * 단순한 스크롤 가능 레이아웃을 제공합니다. URL에 ?figma=true 추가 시 사용됩니다.
 */
export function FigmaCaptureWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 bg-white overflow-y-auto">
      <div className="pt-4 px-8 pb-20">{children}</div>
    </div>
  );
}
