import { useEffect, useState, useCallback, useRef } from 'react';

interface TocItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TocItem[];
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

export function TableOfContents({ items, scrollContainerRef }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleClick = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const container = scrollContainerRef?.current;
      if (container) {
        const rect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        container.scrollTo({
          top: container.scrollTop + rect.top - containerRect.top - 24,
          behavior: 'smooth',
        });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [scrollContainerRef]
  );

  useEffect(() => {
    const root = scrollContainerRef?.current ?? null;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0 && visible[0].target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { root, rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    const elements = items.map((item) => document.getElementById(item.id)).filter(Boolean);
    elements.forEach((el) => observerRef.current?.observe(el!));

    return () => observerRef.current?.disconnect();
  }, [items, scrollContainerRef]);

  if (items.length === 0) return null;

  return (
    <nav
      className="hidden xl:block absolute -right-[180px] top-0 w-[160px]"
      aria-label="Table of contents"
    >
      <div className="sticky top-8">
        <span className="text-body-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider mb-2 block">
          On this page
        </span>
        <ul className="flex flex-col gap-0.5 border-l border-[var(--color-border-subtle)]">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleClick(item.id)}
                className={`block w-full text-left pl-3 py-1 text-body-xs transition-colors border-l-2 -ml-px ${
                  activeId === item.id
                    ? 'border-[var(--color-action-primary)] text-[var(--color-action-primary)] font-medium'
                    : 'border-transparent text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
