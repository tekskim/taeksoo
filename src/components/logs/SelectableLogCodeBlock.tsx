import { useMemo, type ReactElement, type ReactNode } from 'react';

export type SelectableLogCodeBlockLine = {
  id: string;
  text: string;
};

type SelectableLogCodeBlockRenderHelpers = {
  highlightText: (text: string) => ReactNode;
  isSelected: boolean;
};

type SelectableLogCodeBlockProps = {
  lines: readonly SelectableLogCodeBlockLine[];
  selectedId?: string | null;
  onSelect?: (line: SelectableLogCodeBlockLine) => void;
  emptyText?: string;
  highlightQuery?: string;
  lineClassName?: string;
  emptyTextClassName?: string;
  renderLineContent?: (
    line: SelectableLogCodeBlockLine,
    helpers: SelectableLogCodeBlockRenderHelpers
  ) => ReactNode;
  virtualization?: {
    enabled?: boolean;
    rowHeight?: number;
    overscan?: number;
    viewportHeight?: number;
    scrollTop?: number;
  };
};

const highlightText = (text: string, query: string): ReactNode => {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length === 0) {
    return text;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = trimmedQuery.toLowerCase();
  if (!lowerText.includes(lowerQuery)) {
    return text;
  }

  const parts: ReactNode[] = [];
  let cursor = 0;
  let matchIndex = lowerText.indexOf(lowerQuery, cursor);
  while (matchIndex >= 0) {
    if (matchIndex > cursor) {
      parts.push(text.slice(cursor, matchIndex));
    }
    parts.push(
      <mark
        key={`${matchIndex}-${trimmedQuery}`}
        className="rounded-sm bg-[#f59e0b]/35 px-[1px] text-[#fef3c7]"
      >
        {text.slice(matchIndex, matchIndex + trimmedQuery.length)}
      </mark>
    );
    cursor = matchIndex + trimmedQuery.length;
    matchIndex = lowerText.indexOf(lowerQuery, cursor);
  }
  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
};

const SelectableLogCodeBlock = ({
  lines,
  selectedId,
  onSelect,
  emptyText = '-',
  highlightQuery = '',
  lineClassName,
  emptyTextClassName,
  renderLineContent,
  virtualization,
}: SelectableLogCodeBlockProps): ReactElement => {
  const hasRows = lines.length > 0;
  const normalizedSelectedId = selectedId ?? null;
  const clickable = typeof onSelect === 'function';
  const rowHeight = virtualization?.rowHeight ?? 26;
  const overscan = virtualization?.overscan ?? 6;
  const viewportHeight = virtualization?.viewportHeight ?? 0;
  const scrollTop = virtualization?.scrollTop ?? 0;
  const virtualEnabled = Boolean(virtualization?.enabled && viewportHeight > 0);

  const virtualSlice = useMemo(() => {
    if (!virtualEnabled) {
      return {
        startIndex: 0,
        endIndex: lines.length,
        topPadding: 0,
        bottomPadding: 0,
      };
    }
    const rawStart = Math.floor(scrollTop / rowHeight);
    const visibleCount = Math.ceil(viewportHeight / rowHeight);
    const startIndex = Math.max(0, rawStart - overscan);
    const endIndex = Math.min(lines.length, rawStart + visibleCount + overscan);
    const topPadding = startIndex * rowHeight;
    const bottomPadding = Math.max(0, (lines.length - endIndex) * rowHeight);
    return { startIndex, endIndex, topPadding, bottomPadding };
  }, [lines.length, overscan, rowHeight, scrollTop, viewportHeight, virtualEnabled]);

  const visibleLines = useMemo(
    () => lines.slice(virtualSlice.startIndex, virtualSlice.endIndex),
    [lines, virtualSlice.endIndex, virtualSlice.startIndex]
  );

  const rowClassName = useMemo(
    () =>
      [
        'w-full px-3 py-[1px] text-left',
        'font-mono text-[12px] leading-[1.5] text-[#e2e8f0]',
        lineClassName ?? '',
        clickable ? 'cursor-pointer hover:bg-white/5' : '',
      ]
        .filter(Boolean)
        .join(' '),
    [clickable, lineClassName]
  );

  if (!hasRows) {
    return (
      <div
        className={[
          'px-3 py-3 font-mono text-[12px] leading-[1.5] text-[var(--color-text-subtle)]',
          emptyTextClassName ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {emptyText}
      </div>
    );
  }

  return (
    <div>
      {virtualSlice.topPadding > 0 ? (
        <div style={{ height: `${virtualSlice.topPadding}px` }} aria-hidden />
      ) : null}
      {visibleLines.map((line) => (
        <button
          key={line.id}
          type="button"
          className={rowClassName}
          data-selected={normalizedSelectedId === line.id}
          onClick={() => onSelect?.(line)}
          disabled={!clickable}
        >
          <span
            className={
              normalizedSelectedId === line.id ? 'rounded-sm bg-[#1e3a8a]/40 px-[2px]' : undefined
            }
          >
            {renderLineContent
              ? renderLineContent(line, {
                  highlightText: (text: string) => highlightText(text, highlightQuery),
                  isSelected: normalizedSelectedId === line.id,
                })
              : highlightText(line.text, highlightQuery)}
          </span>
        </button>
      ))}
      {virtualSlice.bottomPadding > 0 ? (
        <div style={{ height: `${virtualSlice.bottomPadding}px` }} aria-hidden />
      ) : null}
    </div>
  );
};

export default SelectableLogCodeBlock;
