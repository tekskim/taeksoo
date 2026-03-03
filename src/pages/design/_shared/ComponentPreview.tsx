import { type ReactNode, useState } from 'react';
import { CodeBlock } from './CodeBlock';
import { IconCode, IconEye, IconSun, IconMoon } from '@tabler/icons-react';

interface ComponentPreviewProps {
  children: ReactNode;
  code: string;
  language?: string;
}

export function ComponentPreview({ children, code, language }: ComponentPreviewProps) {
  const [showCode, setShowCode] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className="rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] rounded-t-[var(--primitive-radius-lg)]">
        <span className="text-body-xs text-[var(--color-text-subtle)] font-medium uppercase tracking-wider">
          Preview
        </span>
        <div className="flex items-center gap-1">
          {!showCode && (
            <button
              onClick={() => setPreviewTheme(previewTheme === 'light' ? 'dark' : 'light')}
              className="flex items-center gap-1.5 px-2 py-1 rounded-[var(--primitive-radius-sm)] text-body-xs text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-hover)] transition-colors"
              aria-label={`Switch to ${previewTheme === 'light' ? 'dark' : 'light'} theme`}
            >
              {previewTheme === 'light' ? (
                <IconMoon size={12} stroke={1.5} />
              ) : (
                <IconSun size={12} stroke={1.5} />
              )}
              <span>{previewTheme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
          )}
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
      </div>

      {!showCode && (
        <div
          data-theme={previewTheme}
          className={`p-6 rounded-b-[var(--primitive-radius-lg)] transition-colors bg-[var(--color-surface-default)] ${previewTheme === 'dark' ? 'dark' : ''}`}
        >
          {children}
        </div>
      )}

      {showCode && <CodeBlock code={code} language={language} />}
    </div>
  );
}
