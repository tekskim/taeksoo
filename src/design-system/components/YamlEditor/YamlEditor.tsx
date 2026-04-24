import { useRef, useState, useCallback, useEffect, type ReactNode } from 'react';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { twMerge } from '../../utils/cn';

export interface YamlEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  /** Extra controls after the built-in copy button (e.g. download). */
  trailingActions?: ReactNode;
}

export function YamlEditor({
  value,
  onChange,
  readOnly = false,
  className,
  trailingActions,
}: YamlEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lineCount = value.split('\n').length;

  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
      copyResetRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
    };
  }, []);

  const hasTrailing = Boolean(trailingActions);

  return (
    <div
      className={twMerge(
        'flex-1 flex min-h-0 border border-[var(--color-border-default)] rounded-[var(--radius-sm)] bg-[var(--color-surface-default)] overflow-hidden relative',
        className
      )}
    >
      <div
        ref={lineNumbersRef}
        className="w-[44px] flex-shrink-0 overflow-y-scroll py-2 pr-2 select-none text-right bg-[var(--color-surface-default)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="font-mono text-body-md leading-[18px] text-[var(--color-text-subtle)]">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-w-0 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          readOnly={readOnly}
          className={twMerge(
            'w-full h-full py-2 px-2.5 font-mono text-body-md leading-[18px] text-[var(--color-text-default)] bg-transparent border-none outline-none resize-none overflow-auto',
            hasTrailing ? 'pr-20' : 'pr-12'
          )}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      <div className="absolute top-2 right-4 flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-center w-7 h-7 border border-[var(--color-border-strong)] rounded-[var(--radius-md)] bg-[var(--color-surface-default)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          title="Copy to clipboard"
          aria-label={copied ? 'Copied' : 'Copy to clipboard'}
        >
          {copied ? <IconCheck size={12} stroke={1.5} /> : <IconCopy size={12} stroke={1.5} />}
        </button>
        {trailingActions}
      </div>
    </div>
  );
}
