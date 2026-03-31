import { useState } from 'react';
import { Tooltip } from '@/design-system';
import { IconAffiliate, IconPencil } from '@tabler/icons-react';

interface ClusterIconButtonProps {
  iconText?: string;
  active?: boolean;
  onClick?: () => void;
  onEditClick?: () => void;
  tooltip?: string;
}

export function ClusterIconButton({
  iconText = '',
  active = false,
  onClick,
  onEditClick,
  tooltip,
}: ClusterIconButtonProps) {
  const [hovered, setHovered] = useState(false);

  const chars = Array.from(iconText.trim());
  const text = chars.slice(0, 3).join('').toUpperCase();
  const hasCustomText = text.length > 0;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick?.();
  };

  const button = (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)]
        transition-colors duration-[var(--duration-fast)]
        ${
          active
            ? 'bg-[var(--color-state-info-bg)] text-[var(--color-action-primary)]'
            : 'text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)]'
        }
      `}
    >
      {hasCustomText ? (
        <div
          className="flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] font-semibold select-none border border-[var(--color-border-strong)]"
          style={{
            width: 22,
            height: 22,
            fontSize: text.length === 1 ? 10 : text.length === 2 ? 8 : 7,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {text}
        </div>
      ) : (
        <IconAffiliate size={16} stroke={1.5} />
      )}
    </button>
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {tooltip ? (
        <Tooltip content={tooltip} position="right">
          {button}
        </Tooltip>
      ) : (
        button
      )}

      {/* Edit overlay — shown on hover */}
      {hovered && onEditClick && (
        <button
          type="button"
          onClick={handleEditClick}
          aria-label="Customize cluster appearance"
          className="
            absolute -top-1 -right-1
            w-[17px] h-[17px] flex items-center justify-center
            rounded-full
            bg-[var(--color-surface-default)] text-[var(--color-text-default)]
            border border-[var(--color-border-strong)]
            shadow-sm
            hover:bg-[var(--color-surface-muted)]
            transition-colors duration-[var(--duration-fast)]
            z-10
          "
        >
          <IconPencil size={9} stroke={2.5} />
        </button>
      )}
    </div>
  );
}

export default ClusterIconButton;
