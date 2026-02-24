import { type ReactNode, useState } from 'react';
import { CodeBlock } from './CodeBlock';
import { IconCode, IconEye } from '@tabler/icons-react';

interface ComponentPreviewProps {
  children: ReactNode;
  code: string;
  language?: string;
}

export function ComponentPreview({ children, code, language }: ComponentPreviewProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] rounded-t-[var(--primitive-radius-lg)]">
        <span className="text-body-xs text-[var(--color-text-subtle)] font-medium uppercase tracking-wider">
          Preview
        </span>
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-[var(--primitive-radius-sm)] text-body-xs text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)] transition-colors"
          aria-label={showCode ? 'Show preview' : 'Show code'}
        >
          {showCode ? (
            <>
              <IconEye size={12} stroke={1.5} />
              <span>Preview</span>
            </>
          ) : (
            <>
              <IconCode size={12} stroke={1.5} />
              <span>Code</span>
            </>
          )}
        </button>
      </div>

      {!showCode && (
        <div className="p-6 bg-[var(--color-surface-default)] rounded-b-[var(--primitive-radius-lg)]">
          {children}
        </div>
      )}

      {showCode && <CodeBlock code={code} language={language} />}
    </div>
  );
}
