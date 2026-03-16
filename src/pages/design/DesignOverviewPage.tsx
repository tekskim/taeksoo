import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSearch, IconX } from '@tabler/icons-react';
import { allNavItems } from './_shared/navigationData';
import thakiSymbol from '@/assets/desktop/symbol.svg';

export function DesignOverviewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = searchQuery.trim()
    ? allNavItems.filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      navigate(results[focusedIndex].path);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-[520px] flex flex-col items-start gap-2">
        <div className="flex items-center gap-3">
          <img src={thakiSymbol} alt="" className="w-8 h-8" />
          <h1 className="text-heading-h2 text-[var(--color-text-default)]">TDS</h1>
        </div>
        <p className="text-body-lg text-[var(--color-text-muted)]">THAKI Design System</p>

        <div className="relative w-full mt-2">
          <IconSearch
            size={18}
            stroke={1.5}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setFocusedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search components, patterns, tokens..."
            className="w-full pl-12 pr-10 py-3.5 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] text-[length:var(--font-size-14)] text-[var(--color-text-default)] placeholder:text-[var(--color-text-disabled)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-opacity-20 transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFocusedIndex(-1);
                inputRef.current?.focus();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
            >
              <IconX size={16} stroke={1.5} />
            </button>
          )}

          {searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-lg overflow-hidden max-h-[360px] overflow-y-auto z-10">
              {results.length > 0 ? (
                results.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      onMouseEnter={() => setFocusedIndex(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        idx === focusedIndex
                          ? 'bg-[var(--color-surface-hover)]'
                          : 'hover:bg-[var(--color-surface-hover)]'
                      }`}
                    >
                      <Icon
                        size={16}
                        stroke={1.5}
                        className="text-[var(--color-text-muted)] shrink-0"
                      />
                      <span className="text-label-md text-[var(--color-text-default)] truncate">
                        {item.label}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-6 text-center text-body-md text-[var(--color-text-subtle)]">
                  No results for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
