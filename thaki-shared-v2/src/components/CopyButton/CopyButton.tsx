import { type ReactNode, type MouseEvent, useCallback, useState } from 'react';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { cn } from '../../services/utils/cn';

export interface CopyButtonProps {
  text: string;
  className?: string;
  children?: ReactNode;
}

const copyButtonStyles =
  'inline-flex items-center justify-center h-5 w-5 p-0 bg-transparent border-none rounded-sm text-text-muted cursor-pointer transition-[color,background] duration-control ease-control outline-none hover:text-text hover:bg-surface-hover focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-border-focus focus-visible:outline-offset-[2px] active:text-text-strong';

const successStyles = 'text-state-success';

const CopyButton: React.FC<CopyButtonProps> = ({ text, className, children }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(
    async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
      e.stopPropagation();
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
    },
    [text]
  );

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(copyButtonStyles, isCopied && successStyles, className)}
      aria-label={isCopied ? 'Copied' : 'Copy to clipboard'}
    >
      {isCopied ? (
        <IconCheck size={12} stroke={2} className="shrink-0" />
      ) : (
        <IconCopy size={12} stroke={1.5} className="shrink-0" />
      )}
      {children}
    </button>
  );
};

export default CopyButton;
