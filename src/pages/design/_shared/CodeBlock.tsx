import { useState, useCallback } from 'react';
import { IconCopy, IconCheck } from '@tabler/icons-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'tsx' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="relative group rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] overflow-hidden">
      {language && (
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]">
          <span className="text-body-xs text-[var(--color-text-disabled)] font-mono uppercase">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-[var(--primitive-radius-sm)] text-body-xs text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)] transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <IconCheck size={12} stroke={1.5} className="text-[var(--color-state-success)]" />
                <span className="text-[var(--color-state-success)]">Copied</span>
              </>
            ) : (
              <>
                <IconCopy size={12} stroke={1.5} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
      <pre className="p-3 overflow-x-auto">
        <code className="text-body-sm font-mono text-[var(--color-text-default)] leading-relaxed whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}
