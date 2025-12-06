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
    <div className="h-8 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between pr-4">
      {/* Tab Container */}
      <div className="flex items-center">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`
              flex items-center gap-3 px-3 py-2 cursor-pointer
              ${tab.active
                ? 'bg-white border-r border-neutral-200'
                : 'hover:bg-neutral-100'
              }
            `}
            onClick={() => onTabClick?.(tab.id)}
          >
            <span className="text-xs font-medium text-neutral-900">
              {tab.label}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose?.(tab.id);
              }}
              className="p-0.5 hover:bg-neutral-200 rounded transition-colors"
            >
              <IconX size={12} className="text-neutral-900" stroke={2} />
            </button>
          </div>
        ))}

        {/* New Tab Button */}
        <button
          onClick={onNewTab}
          className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
        >
          <IconPlus size={16} className="text-neutral-900" stroke={1.5} />
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
    <button className="w-4 h-4 flex items-center justify-center hover:bg-neutral-200 rounded transition-colors">
      {type === 'minimize' && (
        <IconMinus size={10} className="text-neutral-900" stroke={2} />
      )}
      {type === 'maximize' && (
        <div className="w-[6px] h-[6px] border border-neutral-900 rounded-[1px]" />
      )}
      {type === 'close' && (
        <IconX size={10} className="text-neutral-900" stroke={2} />
      )}
    </button>
  );
}

export default TabBar;

