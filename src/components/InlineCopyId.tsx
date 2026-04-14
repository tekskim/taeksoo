import { useState } from 'react';
import { IconCopy, IconCheck } from '@tabler/icons-react';

export function InlineCopyId({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className={`shrink-0 transition-colors ${copied ? 'text-[var(--color-state-success)]' : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]'}`}
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      aria-label="Copy ID"
    >
      {copied ? <IconCheck size={12} stroke={2} /> : <IconCopy size={12} stroke={1.5} />}
    </button>
  );
}
