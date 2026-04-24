import { Tooltip } from '@/design-system';
import { IconPencilCog, IconTerminal2, IconFile, IconCopy, IconSearch } from '@tabler/icons-react';

interface ContainerTopBarActionsProps {
  onTerminalClick?: () => void;
  isTerminalActive?: boolean;
}

const btnClass = 'p-1.5 hover:bg-[var(--color-surface-muted)] rounded transition-colors';
const iconClass = 'text-[var(--color-text-muted)]';

export function ContainerTopBarActions({
  onTerminalClick,
  isTerminalActive,
}: ContainerTopBarActionsProps) {
  return (
    <>
      <Tooltip content="Cluster appearance" position="bottom">
        <button
          className={btnClass}
          onClick={() => window.dispatchEvent(new CustomEvent('open-cluster-appearance'))}
          aria-label="Cluster appearance"
        >
          <IconPencilCog size={16} className={iconClass} stroke={1.5} />
        </button>
      </Tooltip>
      <Tooltip content="Kubectl shell" position="bottom">
        <button className={btnClass} onClick={onTerminalClick} aria-label="Kubectl shell">
          <IconTerminal2
            size={16}
            className={isTerminalActive ? 'text-[var(--color-action-primary)]' : iconClass}
            stroke={1.5}
          />
        </button>
      </Tooltip>
      <Tooltip content="Download KubeConfig" position="bottom">
        <button className={btnClass} aria-label="Download KubeConfig">
          <IconFile size={16} className={iconClass} stroke={1.5} />
        </button>
      </Tooltip>
      <Tooltip content="Copy KubeConfig to clipboard" position="bottom">
        <button className={btnClass} aria-label="Copy KubeConfig to clipboard">
          <IconCopy size={16} className={iconClass} stroke={1.5} />
        </button>
      </Tooltip>
      <Tooltip content="Resource search" position="bottom">
        <button className={btnClass} aria-label="Resource search">
          <IconSearch size={16} className={iconClass} stroke={1.5} />
        </button>
      </Tooltip>
    </>
  );
}
