import { useMemo, useState, type ReactElement } from 'react';
import { Drawer, Button, InfoBox, HStack, VStack } from '@/design-system';

type DetailField = {
  label: string;
  value: string;
};

type ContextLine = {
  id: string;
  text: string;
  relation: 'before' | 'target' | 'after';
};

type ContextRow = {
  id: string;
  text: string;
};

type LogDataDetailDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: readonly DetailField[];
  rawText?: string;
  rawLabel?: string;
  contextLines?: readonly ContextLine[];
  contextLabel?: string;
  contextError?: string | null;
  contextRows?: readonly ContextRow[];
  contextTargetId?: string | null;
  initialContextLineCount?: number;
  contextLoadMoreStep?: number;
  maxContextLineCount?: number;
};

const LogDataDetailDrawer = ({
  isOpen,
  onClose,
  title,
  fields,
  rawText,
  rawLabel = 'Raw',
  contextLines = [],
  contextLabel = 'Context',
  contextError = null,
  contextRows = [],
  contextTargetId = null,
  initialContextLineCount = 10,
  contextLoadMoreStep = 5,
  maxContextLineCount = 50,
}: LogDataDetailDrawerProps): ReactElement => {
  const [contextLineCount, setContextLineCount] = useState<number>(
    Math.max(1, Math.min(initialContextLineCount, maxContextLineCount))
  );

  const hasContextRows = contextRows.length > 0 && Boolean(contextTargetId);
  const computedContextResult = useMemo(() => {
    if (!hasContextRows || !contextTargetId) {
      return {
        lines: contextLines,
        error: contextError,
        label: contextLabel,
        canLoadMore: false,
        isMaxReached: false,
      };
    }
    const targetIndex = contextRows.findIndex((item) => item.id === contextTargetId);
    if (targetIndex < 0) {
      return {
        lines: [] as ContextLine[],
        error: contextError ?? 'Failed to load context logs. Please try again.',
        label: `Context (±${contextLineCount} lines)`,
        canLoadMore: false,
        isMaxReached: false,
      };
    }

    const fromIndex = Math.max(0, targetIndex - contextLineCount);
    const toIndex = Math.min(contextRows.length - 1, targetIndex + contextLineCount);
    const lines: ContextLine[] = contextRows.slice(fromIndex, toIndex + 1).map((item, index) => {
      const absoluteIndex = fromIndex + index;
      const relation =
        absoluteIndex < targetIndex ? 'before' : absoluteIndex === targetIndex ? 'target' : 'after';
      return { id: `${item.id}-${relation}`, text: item.text, relation };
    });
    return {
      lines,
      error: contextError,
      label: `Context (±${contextLineCount} lines)`,
      canLoadMore:
        (fromIndex > 0 || toIndex < contextRows.length - 1) &&
        contextLineCount < maxContextLineCount,
      isMaxReached:
        contextLineCount >= maxContextLineCount &&
        (fromIndex > 0 || toIndex < contextRows.length - 1),
    };
  }, [
    contextError,
    contextLabel,
    contextLineCount,
    contextLines,
    contextRows,
    contextTargetId,
    hasContextRows,
    maxContextLineCount,
  ]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={title} width={480}>
      <VStack gap={6}>
        {fields.map((field) => (
          <InfoBox key={field.label} label={field.label} value={field.value || '-'} />
        ))}

        {rawText ? (
          <div>
            <p className="mb-2 text-body-sm text-[var(--color-text-subtle)]">{rawLabel}</p>
            <div className="w-full overflow-auto rounded-md border border-[#334155] bg-[#0b1220] shadow-[inset_0_1px_0_rgba(148,163,184,0.08)]">
              <pre className="m-0 whitespace-pre-wrap break-words p-3 font-mono text-[11px] leading-[16px] text-[#e2e8f0]">
                {rawText}
              </pre>
            </div>
          </div>
        ) : null}

        <div>
          <HStack justify="between" align="center" className="mb-2">
            <p className="text-body-sm text-[var(--color-text-subtle)]">
              {computedContextResult.label}
            </p>
            {hasContextRows ? (
              <Button
                variant="secondary"
                size="sm"
                disabled={!computedContextResult.canLoadMore}
                onClick={() =>
                  setContextLineCount((previous) =>
                    Math.min(previous + contextLoadMoreStep, maxContextLineCount)
                  )
                }
              >
                Load {contextLoadMoreStep} more
              </Button>
            ) : null}
          </HStack>
          {computedContextResult.error ? (
            <div className="rounded-md border border-[var(--color-state-danger)] bg-[var(--color-state-danger-bg)] px-3 py-3 text-body-md text-[var(--color-state-danger)]">
              {computedContextResult.error}
            </div>
          ) : (
            <div className="w-full overflow-auto rounded-md border border-[#334155] bg-[#0b1220] shadow-[inset_0_1px_0_rgba(148,163,184,0.08)]">
              {computedContextResult.lines.length > 0 ? (
                <div className="bg-[#020617]">
                  {computedContextResult.lines.map((line) => (
                    <p
                      key={line.id}
                      className="px-3 py-[1px] font-mono text-[11px] leading-[16px] text-[#e2e8f0]"
                    >
                      <span
                        className={
                          line.relation === 'target'
                            ? 'rounded-sm bg-[#1e3a8a]/40 px-[2px]'
                            : undefined
                        }
                      >
                        {line.text}
                      </span>
                    </p>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-3 font-mono text-[11px] leading-[16px] text-[#94a3b8]">
                  -
                </div>
              )}
            </div>
          )}
          {hasContextRows && computedContextResult.isMaxReached && (
            <p className="mt-2 text-body-sm text-[var(--color-text-subtle)]">
              No more context logs can be loaded (max ±{maxContextLineCount}).
            </p>
          )}
        </div>
      </VStack>
    </Drawer>
  );
};

export default LogDataDetailDrawer;
