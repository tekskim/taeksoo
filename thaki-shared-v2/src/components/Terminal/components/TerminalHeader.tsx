/**
 * TerminalHeader Component
 *
 * 터미널 헤더 UI를 담당하는 컴포넌트
 * 제목, 닫기 버튼, 새 창 열기 버튼 등을 렌더링
 */

import type React from 'react';
import clsx from 'clsx';
import { Typography } from '../../Typography';

/**
 * 기본 터미널 아이콘
 */
const DefaultTerminalIcon = (): React.ReactElement => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M2 3.5C2 2.67157 2.67157 2 3.5 2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H3.5C2.67157 14 2 13.3284 2 12.5V3.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M5 6L7 8L5 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 10H11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 닫기 아이콘
 */
const CloseIcon = (): React.ReactElement => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * 새 창 열기 아이콘
 */
const OpenInNewWindowIcon = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 12V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H12M12 8H16M16 8V12M16 8L11 13M3 17C3 16.7348 3.10536 16.4804 3.29289 16.2929C3.48043 16.1054 3.73478 16 4 16H7C7.26522 16 7.51957 16.1054 7.70711 16.2929C7.89464 16.4804 8 16.7348 8 17V20C8 20.2652 7.89464 20.5196 7.70711 20.7071C7.51957 20.8946 7.26522 21 7 21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V17Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface TerminalHeaderProps {
  /** 터미널 제목 */
  title: string;
  /** 닫기 버튼 클릭 핸들러 */
  onClose?: () => void;
  /** 새 창 열기 버튼 클릭 핸들러 */
  onOpenInNewWindow?: () => void;
  /** 커스텀 아이콘 렌더러 */
  renderIcon?: () => React.ReactNode;
  /** 드래그 핸들 클래스명 */
  dragHandleClassName?: string;
}

/**
 * 터미널 헤더 컴포넌트
 */
export const TerminalHeader = ({
  title,
  onClose,
  onOpenInNewWindow,
  renderIcon,
  dragHandleClassName,
}: TerminalHeaderProps): React.ReactElement => {
  return (
    <div
      className={clsx(
        'flex min-h-[40px] items-center border-y border-border bg-surface-muted px-0 py-[1px] pr-5',
        dragHandleClassName && 'cursor-grab active:cursor-grabbing'
      )}
    >
      {/* 드래그 핸들 영역 */}
      <div className={clsx('flex flex-1 items-center gap-2', dragHandleClassName)}>
        {/* 탭 */}
        <div className="flex items-center gap-2 rounded-md border-r border-border bg-surface px-3 py-2">
          <div className="flex h-4 w-4 items-center justify-center text-[var(--semantic-color-text)]">
            {renderIcon ? renderIcon() : <DefaultTerminalIcon />}
          </div>
          <Typography.Text className="whitespace-nowrap text-xs font-medium leading-4 text-[var(--semantic-color-text)]">
            {title}
          </Typography.Text>
          {onClose && (
            <button
              type="button"
              className="flex h-4 w-4 items-center justify-center text-[var(--semantic-color-text)] transition-transform duration-150 ease-in-out hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-color-focus)] focus-visible:ring-offset-0 active:scale-95"
              onClick={onClose}
              aria-label="Close terminal"
            >
              <CloseIcon />
            </button>
          )}
        </div>

        {/* 새 창으로 열기 버튼 */}
        {onOpenInNewWindow && (
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center text-[var(--semantic-color-text)] transition-transform duration-150 ease-in-out hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-color-focus)] focus-visible:ring-offset-0 active:scale-95"
            onClick={onOpenInNewWindow}
            aria-label="Open in new window"
            title="Open in new window"
          >
            <OpenInNewWindowIcon />
          </button>
        )}
      </div>
    </div>
  );
};

TerminalHeader.displayName = 'TerminalHeader';
