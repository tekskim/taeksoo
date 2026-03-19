import { useState, useEffect, useRef, type ReactNode, type ComponentType } from 'react';
import { VStack, Tooltip } from '@/design-system';
import { useDarkMode } from '@/hooks/useDarkMode';

/* ----------------------------------------
   Section Component
   ---------------------------------------- */
export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <VStack
      id={id}
      gap={6}
      align="stretch"
      className="p-6 bg-[var(--color-surface-default)] rounded-[var(--radius-xl)] scroll-mt-6"
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      <VStack gap={1} align="start">
        <h2 className="text-heading-h3 text-[var(--color-text-default)]">{title}</h2>
        <p className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
          {description}
        </p>
      </VStack>
      {children}
    </VStack>
  );
}

/* ----------------------------------------
   Label Component
   ---------------------------------------- */
export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] uppercase tracking-wider">
      {children}
    </span>
  );
}

/* ----------------------------------------
   ColorSwatch Component
   ---------------------------------------- */
export function ColorSwatch({
  name,
  color,
  textLight = false,
}: {
  name: string;
  color: string;
  textLight?: boolean;
}) {
  const [hexValue, setHexValue] = useState('');
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const computed = getComputedStyle(ref.current).backgroundColor;
      // Convert rgb(r, g, b) to hex
      const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const hex =
          '#' +
          [match[1], match[2], match[3]]
            .map((x) => {
              const h = parseInt(x).toString(16);
              return h.length === 1 ? '0' + h : h;
            })
            .join('')
            .toUpperCase();
        setHexValue(hex);
      }
    }
  }, [color]);

  const handleCopy = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Tooltip content={`${color}\n${hexValue}`} position="top">
      <div
        ref={ref}
        className="w-full min-w-[60px] h-12 rounded-[var(--radius-md)] flex flex-col items-center justify-center border border-[var(--color-border-subtle)] cursor-pointer hover:ring-2 hover:ring-[var(--color-border-focus)] transition-shadow"
        style={{ backgroundColor: color }}
        onClick={handleCopy}
      >
        <span
          className={`text-[10px] font-mono font-medium ${textLight ? 'text-white' : 'text-black'}`}
        >
          {name}
        </span>
        <span className={`text-[8px] font-mono ${textLight ? 'text-white/70' : 'text-black/50'}`}>
          {copied ? 'Copied!' : hexValue}
        </span>
      </div>
    </Tooltip>
  );
}

/* ----------------------------------------
   SemanticColorBox Component
   ---------------------------------------- */
export function SemanticColorBox({
  name,
  color,
  border = false,
}: {
  name: string;
  color: string;
  border?: boolean;
}) {
  const [hexValue, setHexValue] = useState('');
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const computed = getComputedStyle(ref.current).backgroundColor;
      const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const hex =
          '#' +
          [match[1], match[2], match[3]]
            .map((x) => {
              const h = parseInt(x).toString(16);
              return h.length === 1 ? '0' + h : h;
            })
            .join('')
            .toUpperCase();
        setHexValue(hex);
      }
    }
  }, [color]);

  const handleCopy = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Tooltip content={`${color}\n${hexValue}`} position="top">
      <VStack gap={1} align="center">
        <div
          ref={ref}
          className={`w-10 h-10 rounded-[var(--radius-md)] cursor-pointer hover:ring-2 hover:ring-[var(--color-border-focus)] transition-shadow ${border ? 'border border-[var(--color-border-default)]' : ''}`}
          style={{ backgroundColor: color }}
          onClick={handleCopy}
        />
        <span className="text-[8px] font-mono text-[var(--color-text-disabled)] truncate max-w-10">
          {copied ? '✓' : name}
        </span>
      </VStack>
    </Tooltip>
  );
}

/* ----------------------------------------
   SemanticColorRow Component
   ---------------------------------------- */
export function SemanticColorRow({
  token,
  cssVar,
  primitive,
  darkPrimitive,
  darkHex,
  border = false,
}: {
  token: string;
  cssVar: string;
  primitive: string;
  darkPrimitive?: string;
  darkHex?: string;
  border?: boolean;
}) {
  const { isDark } = useDarkMode();
  const [computedHex, setComputedHex] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const activePrimitive = isDark && darkPrimitive ? darkPrimitive : primitive;
  const useDarkOverride = isDark && darkHex;
  const displayHex = useDarkOverride ? darkHex : computedHex;

  useEffect(() => {
    if (useDarkOverride) return;
    if (ref.current) {
      const computed = getComputedStyle(ref.current).backgroundColor;
      const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const hex =
          '#' +
          [match[1], match[2], match[3]]
            .map((x) => {
              const h = parseInt(x).toString(16);
              return h.length === 1 ? '0' + h : h;
            })
            .join('')
            .toUpperCase();
        setComputedHex(hex);
      }
    }
  }, [cssVar, isDark, useDarkOverride]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <tr className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-subtle)] transition-colors">
      <td className="py-2 pr-3">
        <div
          ref={ref}
          className={`w-8 h-8 rounded-[var(--radius-sm)] ${border ? 'border border-[var(--color-border-default)]' : ''}`}
          style={{ backgroundColor: useDarkOverride ? darkHex : `var(${cssVar})` }}
        />
      </td>
      <td className="py-2 pr-3">
        <button
          onClick={() => handleCopy(cssVar, 'token')}
          className="font-mono text-body-sm text-[var(--color-text-default)] hover:text-[var(--color-action-primary)] transition-colors text-left"
        >
          {copied === 'token' ? '✓ Copied' : token}
        </button>
      </td>
      <td className="py-2 pr-3">
        <button
          onClick={() => handleCopy(displayHex, 'hex')}
          className="font-mono text-body-sm text-[var(--color-text-muted)] hover:text-[var(--color-action-primary)] transition-colors"
        >
          {copied === 'hex' ? '✓ Copied' : displayHex}
        </button>
      </td>
      <td className="py-2">
        <span className="font-mono text-body-sm text-[var(--color-text-subtle)]">
          {activePrimitive}
        </span>
      </td>
    </tr>
  );
}

/* ----------------------------------------
   SemanticColorTable Component
   ---------------------------------------- */
export function SemanticColorTable({
  title,
  colors,
}: {
  title: string;
  colors: Array<{
    token: string;
    cssVar: string;
    primitive: string;
    darkPrimitive?: string;
    darkHex?: string;
    border?: boolean;
  }>;
}) {
  return (
    <VStack gap={3} className="flex-1 min-w-[280px]">
      <span className="text-label-md text-[var(--color-text-default)] font-medium">{title}</span>
      <div className="overflow-x-auto">
        <table className="w-full text-body-sm">
          <thead>
            <tr className="border-b border-[var(--color-border-default)]">
              <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)] w-10"></th>
              <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                Token
              </th>
              <th className="text-left py-2 pr-3 font-medium text-[var(--color-text-subtle)]">
                Hex
              </th>
              <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                Primitive
              </th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color) => (
              <SemanticColorRow key={color.token} {...color} />
            ))}
          </tbody>
        </table>
      </div>
    </VStack>
  );
}

/* ----------------------------------------
   SpacingSwatch Component
   ---------------------------------------- */
export function SpacingSwatch({ name, value }: { name: string; value: string }) {
  const numericValue = parseInt(value);
  return (
    <VStack gap={1} align="center">
      <div
        className="bg-[var(--color-action-primary)] rounded-sm min-w-1"
        style={{ width: Math.max(numericValue, 4), height: 20 }}
      />
      <span className="text-[9px] font-mono text-[var(--color-text-disabled)]">{name}</span>
      <span className="text-[8px] font-mono text-[var(--color-text-disabled)]">{value}</span>
    </VStack>
  );
}

/* ----------------------------------------
   TokenCard Component
   ---------------------------------------- */
export function TokenCard({
  title,
  description,
  items,
  color,
  textColor,
}: {
  title: string;
  description: string;
  items: string[];
  color: string;
  textColor: string;
}) {
  return (
    <VStack gap={3} className="p-4 rounded-[var(--radius-lg)]" style={{ backgroundColor: color }}>
      <VStack gap={1}>
        <span
          className="text-[length:var(--font-size-14)] font-semibold"
          style={{ color: textColor }}
        >
          {title}
        </span>
        <span
          className="text-[length:var(--font-size-11)]"
          style={{ color: textColor, opacity: 0.8 }}
        >
          {description}
        </span>
      </VStack>
      <ul
        className="text-[length:var(--font-size-10)] space-y-1"
        style={{ color: textColor, opacity: 0.9 }}
      >
        {items.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </VStack>
  );
}

/* ----------------------------------------
   IconDisplayGrid Component
   ---------------------------------------- */
interface IconDisplayGridProps {
  title: string;
  icons: {
    Icon: ComponentType<{ size?: number; stroke?: number; className?: string }>;
    name: string;
    missing?: boolean;
  }[];
  searchQuery?: string;
}

export function IconDisplayGrid({ title, icons, searchQuery = '' }: IconDisplayGridProps) {
  const filteredIcons = searchQuery
    ? icons.filter(({ name }) => name.toLowerCase().includes(searchQuery.toLowerCase()))
    : icons;

  // Don't render the group if no icons match the search
  if (searchQuery && filteredIcons.length === 0) {
    return null;
  }

  return (
    <VStack gap={3}>
      <Label>{title}</Label>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {filteredIcons.map(({ Icon, name, missing }, i) => (
          <div
            key={i}
            title={missing ? `⚠️ ${name} (needs custom icon)` : name}
            className={`flex flex-col items-center gap-2 p-3 rounded-[var(--radius-md)] border transition-colors cursor-default group ${
              missing
                ? 'bg-[var(--color-state-warning-bg)] border-[var(--color-state-warning)] border-dashed hover:bg-[var(--color-yellow-100)]'
                : 'bg-[var(--color-surface-subtle)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-focus)] hover:bg-[var(--color-surface-default)]'
            }`}
          >
            <Icon
              size={18}
              stroke={1.5}
              className={`shrink-0 transition-colors ${missing ? 'text-[var(--color-state-warning)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-default)]'}`}
            />
            <span
              className={`text-[length:var(--font-size-10)] transition-colors truncate w-full text-center ${missing ? 'text-[var(--color-state-warning-text)]' : 'text-[var(--color-text-disabled)] group-hover:text-[var(--color-text-subtle)]'}`}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </VStack>
  );
}
