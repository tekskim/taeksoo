import React from 'react';
import { IconX, IconMinus, IconSquare } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type WindowControlType = 'minimize' | 'maximize' | 'close';

export interface WindowControlProps {
  /** Control type */
  type: WindowControlType;
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
}

export interface WindowControlsProps {
  /** Show minimize button */
  showMinimize?: boolean;
  /** Show maximize button */
  showMaximize?: boolean;
  /** Show close button */
  showClose?: boolean;
  /** Minimize click handler */
  onMinimize?: () => void;
  /** Maximize click handler */
  onMaximize?: () => void;
  /** Close click handler */
  onClose?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
}

/* ----------------------------------------
   WindowControl Component
   ---------------------------------------- */

export const WindowControl: React.FC<WindowControlProps> = ({
  type,
  onClick,
  disabled = false,
  className = '',
}) => {
  const iconSize = 12;
  const strokeWidth = 1;

  const renderIcon = () => {
    switch (type) {
      case 'minimize':
        return <IconMinus size={iconSize} stroke={strokeWidth} />;
      case 'maximize':
        return <IconSquare size={iconSize} stroke={strokeWidth} />;
      case 'close':
        return <IconX size={iconSize} stroke={strokeWidth} />;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center
        w-[var(--window-control-size)]
        h-[var(--window-control-size)]
        rounded-[var(--window-control-radius)]
        text-[var(--color-text-default)]
        transition-colors duration-[var(--duration-fast)]
        hover:bg-[var(--color-surface-subtle)]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={type}
    >
      {renderIcon()}
    </button>
  );
};

/* ----------------------------------------
   WindowControls Group Component
   ---------------------------------------- */

export const WindowControls: React.FC<WindowControlsProps> = ({
  showMinimize = true,
  showMaximize = true,
  showClose = true,
  onMinimize,
  onMaximize,
  onClose,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-[var(--window-control-gap)] ${className}`}>
      {showMinimize && (
        <WindowControl type="minimize" onClick={onMinimize} disabled={disabled} />
      )}
      {showMaximize && (
        <WindowControl type="maximize" onClick={onMaximize} disabled={disabled} />
      )}
      {showClose && (
        <WindowControl type="close" onClick={onClose} disabled={disabled} />
      )}
    </div>
  );
};

export default WindowControl;





