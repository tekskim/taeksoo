import { type ReactElement, ChangeEvent, useMemo, useState } from 'react';
import tokenDocs from './generated/token-docs.json';

interface TokenDocEntry {
  name: string;
  path: string;
  value: unknown;
  type: string | null;
  category: string | null;
  group: string | null;
  description: string | null;
  originalValue: unknown;
}

interface TokenDocTheme {
  name: string;
  selector: string;
  tokens: Record<string, unknown>;
  entries: TokenDocEntry[];
}

interface TokenDocPayload {
  generatedAt: string;
  themeCount: number;
  themes: TokenDocTheme[];
}

const docsPayload = tokenDocs as TokenDocPayload;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--semantic-space.section, 1.5rem)',
    padding: 'var(--semantic-space.section, 24px)',
    backgroundColor: 'var(--semantic-color-surface)',
    color: 'var(--semantic-color-text)',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--semantic-space.inline, 12px)',
  },
  title: {
    margin: 0,
    fontSize: 'calc(var(--semantic-font-sizeXl, 1.25rem) * 1.1)',
    fontWeight: 'var(--semantic-font-weightSemibold, 600)',
  },
  controlsRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 'var(--semantic-space.inline, 12px)',
    alignItems: 'center',
  },
  control: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: '200px',
  },
  label: {
    fontSize: 'var(--semantic-font-sizeSm, 0.875rem)',
    color: 'var(--semantic-color-textMuted)',
  },
  select: {
    backgroundColor: 'var(--semantic-color-surfaceMuted)',
    color: 'var(--semantic-color-text)',
    borderRadius: 'var(--semantic-radius-control, 6px)',
    border: '1px solid var(--semantic-color-border)',
    padding: '8px 12px',
    fontSize: 'var(--semantic-font-sizeSm, 0.875rem)',
  },
  searchInput: {
    backgroundColor: 'var(--semantic-color-surfaceMuted)',
    color: 'var(--semantic-color-text)',
    borderRadius: 'var(--semantic-radius-control, 6px)',
    border: '1px solid var(--semantic-color-border)',
    padding: '8px 12px',
    fontSize: 'var(--semantic-font-sizeSm, 0.875rem)',
    minWidth: '260px',
  },
  summaryCard: {
    display: 'grid',
    gap: 'var(--semantic-space.inline, 12px)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  },
  summaryItem: {
    backgroundColor: 'var(--semantic-color-surfaceMuted)',
    border: '1px solid var(--semantic-color-borderMuted)',
    borderRadius: 'var(--semantic-radius-card, 12px)',
    padding: 'var(--semantic-space.inline, 12px)',
  },
  summaryTitle: {
    fontSize: 'var(--semantic-font-sizeSm, 0.875rem)',
    color: 'var(--semantic-color-textMuted)',
    margin: 0,
  },
  summaryValue: {
    fontSize: 'var(--semantic-font-sizeLg, 1.125rem)',
    fontWeight: 'var(--semantic-font-weightSemibold, 600)',
    margin: 0,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: 'var(--semantic-font-sizeSm, 0.875rem)',
  },
  tableHeader: {
    backgroundColor: 'var(--semantic-color-surfaceMuted)',
    textAlign: 'left' as const,
    borderBottom: '1px solid var(--semantic-color-border)',
    padding: '8px 12px',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1,
  },
  tableCell: {
    borderBottom: '1px solid var(--semantic-color-borderMuted)',
    padding: '8px 12px',
    verticalAlign: 'top' as const,
    maxWidth: '360px',
  },
  colorSwatch: {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--semantic-radius-control, 6px)',
    border: '1px solid var(--semantic-color-border)',
    boxShadow: 'var(--semantic-shadow-card)',
  },
  treeContainer: {
    backgroundColor: 'var(--semantic-color-surfaceMuted)',
    borderRadius: 'var(--semantic-radius-card, 12px)',
    border: '1px solid var(--semantic-color-borderMuted)',
    padding: 'var(--semantic-space.inline, 12px)',
    maxHeight: '420px',
    overflow: 'auto' as const,
  },
  warning: {
    backgroundColor: 'var(--semantic-color-warningLight)',
    border: '1px solid var(--semantic-color-warning)',
    color: 'var(--semantic-color-warning)',
    borderRadius: 'var(--semantic-radius-card, 12px)',
    padding: 'var(--semantic-space.inline, 12px)',
  },
} as const;

type CategoryKey = 'primitive' | 'semantic' | 'component' | 'other';

const normalizeCategory = (category: string | null): CategoryKey => {
  if (!category) {
    return 'other';
  }
  if (category.includes('primitive')) {
    return 'primitive';
  }
  if (category.includes('semantic')) {
    return 'semantic';
  }
  if (category.includes('component')) {
    return 'component';
  }
  return 'other';
};

const renderTree = (node: unknown, path: string[] = []): ReactElement => {
  if (node === null || typeof node !== 'object' || Array.isArray(node)) {
    return (
      <li key={path.join('.')}>
        <code>{path.join('.')}</code>
        {': '}
        <span>{String(node)}</span>
      </li>
    );
  }

  return (
    <li key={path.join('.') || 'root'}>
      {path.length > 0 && <code>{path[path.length - 1]}</code>}
      <ul>{Object.entries(node).map(([key, value]) => renderTree(value, [...path, key]))}</ul>
    </li>
  );
};

const formatValue = (value: unknown): string => {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return JSON.stringify(value);
};

export const TokenStudioShowcase: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryKey | 'all'>('all');

  const fallbackThemeName = docsPayload.themes[0]?.name ?? 'dark';
  const [selectedTheme, setSelectedTheme] = useState<string>(fallbackThemeName);

  const currentThemeDoc = useMemo<TokenDocTheme | undefined>(
    () => docsPayload.themes.find((item) => item.name === selectedTheme),
    [selectedTheme]
  );

  const searchTerm = searchValue.trim().toLowerCase();

  const filteredEntries = useMemo<TokenDocEntry[]>(() => {
    if (!currentThemeDoc) {
      return [];
    }

    return currentThemeDoc.entries.filter((entry) => {
      const matchesCategory =
        categoryFilter === 'all' || normalizeCategory(entry.category) === categoryFilter;
      const matchesSearch =
        searchTerm.length === 0 ||
        entry.path.toLowerCase().includes(searchTerm) ||
        formatValue(entry.value).toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [currentThemeDoc, categoryFilter, searchTerm]);

  const categorySummary = useMemo<Record<CategoryKey, number>>(() => {
    if (!currentThemeDoc) {
      return {
        primitive: 0,
        semantic: 0,
        component: 0,
        other: 0,
      };
    }

    return currentThemeDoc.entries.reduce<Record<CategoryKey, number>>(
      (accumulator, entry) => {
        const normalized = normalizeCategory(entry.category);
        accumulator[normalized] += 1;
        return accumulator;
      },
      { primitive: 0, semantic: 0, component: 0, other: 0 }
    );
  }, [currentThemeDoc]);

  const colorEntries = useMemo(
    () => filteredEntries.filter((entry) => (entry.type ?? '').includes('color')),
    [filteredEntries]
  );

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheme(event.target.value);
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as CategoryKey | 'all';
    setCategoryFilter(value);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  if (docsPayload.themes.length === 0) {
    return (
      <section style={styles.container}>
        <div style={styles.warning}>
          <strong>Token documentation unavailable.</strong> Run{' '}
          <code>pnpm --filter @thaki/shared run generate:token-docs</code> after exporting tokens
          from Figma.
        </div>
      </section>
    );
  }

  return (
    <section style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Token Studio Overview</h1>
        <div>
          <span style={styles.label}>
            Generated at: {new Date(docsPayload.generatedAt).toLocaleString()}
          </span>
        </div>

        <div style={styles.controlsRow}>
          <label style={styles.control}>
            <span style={styles.label}>Theme</span>
            <select value={selectedTheme} onChange={handleThemeChange} style={styles.select}>
              {docsPayload.themes.map((theme) => (
                <option key={theme.name} value={theme.name}>
                  {theme.name}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.control}>
            <span style={styles.label}>Category</span>
            <select value={categoryFilter} onChange={handleCategoryChange} style={styles.select}>
              <option value="all">All tokens</option>
              <option value="component">Component • {categorySummary.component}</option>
              <option value="semantic">Semantic • {categorySummary.semantic}</option>
              <option value="primitive">Primitive • {categorySummary.primitive}</option>
              <option value="other">Other • {categorySummary.other}</option>
            </select>
          </label>

          <label style={styles.control}>
            <span style={styles.label}>Search</span>
            <input
              type="search"
              placeholder="Search by path or value"
              value={searchValue}
              onChange={handleSearchChange}
              style={styles.searchInput}
            />
          </label>
        </div>
      </header>

      <section style={styles.summaryCard}>
        <div style={styles.summaryItem}>
          <p style={styles.summaryTitle}>Total tokens</p>
          <p style={styles.summaryValue}>{currentThemeDoc?.entries.length ?? 0}</p>
        </div>
        <div style={styles.summaryItem}>
          <p style={styles.summaryTitle}>Component</p>
          <p style={styles.summaryValue}>{categorySummary.component}</p>
        </div>
        <div style={styles.summaryItem}>
          <p style={styles.summaryTitle}>Semantic</p>
          <p style={styles.summaryValue}>{categorySummary.semantic}</p>
        </div>
        <div style={styles.summaryItem}>
          <p style={styles.summaryTitle}>Primitive</p>
          <p style={styles.summaryValue}>{categorySummary.primitive}</p>
        </div>
      </section>

      {colorEntries.length > 0 && (
        <section>
          <h2 style={styles.title}>Color Palette</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {colorEntries.slice(0, 36).map((entry) => (
              <div
                key={entry.path}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  minWidth: '120px',
                }}
              >
                <div
                  style={{
                    ...styles.colorSwatch,
                    backgroundColor: String(entry.value),
                  }}
                />
                <code>{entry.path}</code>
                <span style={styles.label}>{String(entry.value)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 style={styles.title}>Token Reference</h2>
        <div
          style={{
            overflowX: 'auto',
            borderRadius: '12px',
            border: '1px solid var(--semantic-color-borderMuted)',
          }}
        >
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Path</th>
                <th style={styles.tableHeader}>Category</th>
                <th style={styles.tableHeader}>Type</th>
                <th style={styles.tableHeader}>Value</th>
                <th style={styles.tableHeader}>Original</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.path}>
                  <td style={styles.tableCell}>
                    <code>{entry.path}</code>
                  </td>
                  <td style={styles.tableCell}>{entry.category ?? '—'}</td>
                  <td style={styles.tableCell}>{entry.type ?? '—'}</td>
                  <td style={styles.tableCell}>
                    <code>{formatValue(entry.value)}</code>
                  </td>
                  <td style={styles.tableCell}>
                    <code>{entry.originalValue ? formatValue(entry.originalValue) : '—'}</code>
                  </td>
                </tr>
              ))}
              {filteredEntries.length === 0 && (
                <tr>
                  <td style={styles.tableCell} colSpan={5}>
                    No tokens match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 style={styles.title}>Token Tree</h2>
        <div style={styles.treeContainer}>
          <ul style={{ listStyle: 'none', paddingLeft: '0', margin: 0 }}>
            {renderTree(currentThemeDoc?.tokens ?? {})}
          </ul>
        </div>
      </section>
    </section>
  );
};
