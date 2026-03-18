import { ReactNode, useCallback, useState } from 'react';
import { cn } from '../../services/utils/cn';

export interface CopyButtonProps {
  text: string;
  className?: string;
  children?: ReactNode;
}

const copyButtonStyles =
  'flex items-center justify-center size-3 p-0 bg-transparent border-none rounded-sm text-text-muted cursor-pointer transition-[color,background] duration-control ease-control outline-none hover:text-text hover:bg-surface-hover focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-border-focus focus-visible:outline-offset-[2px] active:text-text-strong';

const iconStyles = 'shrink-0';

/**
 * 클립보드 복사 기능을 제공하는 버튼 컴포넌트
 *
 * @param text - 복사할 텍스트
 * @param className - 추가 CSS 클래스
 * @param children - 버튼 내부에 렌더링할 커스텀 콘텐츠 (예: "Copy JSON")
 */
const CopyButton: React.FC<CopyButtonProps> = ({ text, className, children }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(async (): Promise<void> => {
    if (!navigator.clipboard || !window.isSecureContext) {
      console.warn('Clipboard API is not available. Requires HTTPS (secure context).');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, [text]);

  const copyIcon = (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={iconStyles}
    >
      <path
        d="M8 1.5H2.5C1.94772 1.5 1.5 1.94772 1.5 2.5V8M4 10.5H9.5C10.0523 10.5 10.5 10.0523 10.5 9.5V4C10.5 3.44772 10.0523 3 9.5 3H4C3.44772 3 3 3.44772 3 4V9.5C3 10.0523 3.44772 10.5 4 10.5Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const checkIcon = (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={iconStyles}
    >
      <path
        d="M10 3L4.5 8.5L2 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(copyButtonStyles, className)}
      aria-label={isCopied ? 'Copied' : 'Copy to clipboard'}
    >
      {isCopied ? checkIcon : copyIcon}
      {children}
    </button>
  );
};

export default CopyButton;
