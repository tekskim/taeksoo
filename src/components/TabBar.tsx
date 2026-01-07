import { HStack } from '@/design-system';
import { IconPlus, IconX, IconMinus } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

interface Tab {
  id: string;
  label: string;
  active?: boolean;
}

interface TabBarProps {
  tabs: Tab[];
  onTabClose?: (id: string) => void;
  onTabClick?: (id: string) => void;
  onNewTab?: () => void;
}

/* ----------------------------------------
   TabBar Component
   ---------------------------------------- */

export function TabBar({ tabs, onTabClose, onTabClick, onNewTab }: TabBarProps) {
  return (
    <div className="h-8 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)] flex items-center justify-between pr-4">
      {/* Tab Container */}
      <div className="flex items-center">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`
              flex items-center gap-3 px-3 py-2 cursor-pointer
              ${tab.active
                ? 'bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)]'
                : 'hover:bg-[var(--color-surface-muted)]'
              }
            `}
            onClick={() => onTabClick?.(tab.id)}
          >
            <span className="text-xs font-medium text-[var(--color-text-default)]">
              {tab.label}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose?.(tab.id);
              }}
              className="p-0.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors"
            >
              <IconX size={12} className="text-[var(--color-text-default)]" stroke={1} />
            </button>
          </div>
        ))}

        {/* New Tab Button */}
        <button
          onClick={onNewTab}
          className="p-2 hover:bg-[var(--color-surface-muted)] rounded-md transition-colors"
        >
          <IconPlus size={16} className="text-[var(--color-text-default)]" stroke={1} />
        </button>
      </div>

      {/* Window Controls */}
      <HStack gap={1}>
        <WindowControl type="minimize" />
        <WindowControl type="maximize" />
        <WindowControl type="close" />
      </HStack>
    </div>
  );
}

/* ----------------------------------------
   Window Control Component
   ---------------------------------------- */

function WindowControl({ type }: { type: 'minimize' | 'maximize' | 'close' }) {
  return (
    <button className="w-4 h-4 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors">
      {type === 'minimize' && (
        <IconMinus size={10} className="text-[var(--color-text-default)]" stroke={1} />
      )}
      {type === 'maximize' && (
        <div className="w-[6px] h-[6px] border border-[var(--color-text-default)] rounded-[1px]" />
      )}
      {type === 'close' && (
        <IconX size={10} className="text-[var(--color-text-default)]" stroke={1} />
      )}
    </button>
  );
}

export default TabBar;

