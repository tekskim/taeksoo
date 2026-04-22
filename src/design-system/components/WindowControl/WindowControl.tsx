import React from 'react';
import { IconX, IconMinus, IconSquare, IconSquares } from '@tabler/icons-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type WindowControlType = 'minimize' | 'maximize' | 'close';

export interface WindowControlProps {
  /** Control type */
  type: WindowControlType;
  /** Whether the window is currently maximized (only affects maximize button icon) */
  isMaximized?: boolean;
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
  /** Whether the window is currently maximized */
  isMaximized?: boolean;
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
  isMaximized = false,
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
        return isMaximized ? (
          <IconSquares size={iconSize} stroke={strokeWidth} />
        ) : (
          <IconSquare size={iconSize} stroke={strokeWidth} />
        );
      case 'close':
        return <IconX size={iconSize} stroke={strokeWidth} />;
    }
  };

  const ariaLabel = type === 'maximize' ? (isMaximized ? 'Restore' : 'Maximize') : type;

  return (
    <button
      data-figma-name="[TDS] FrameControls"
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
      aria-label={ariaLabel}
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
  isMaximized = false,
  onMinimize,
  onMaximize,
  onClose,
  disabled = false,
  className = '',
}) => {
  return (
    <div
      data-figma-name="[TDS] FrameControls"
      className={`flex items-center gap-[var(--window-control-gap)] ${className}`}
    >
      {showMinimize && <WindowControl type="minimize" onClick={onMinimize} disabled={disabled} />}
      {showMaximize && (
        <WindowControl
          type="maximize"
          isMaximized={isMaximized}
          onClick={onMaximize}
          disabled={disabled}
        />
      )}
      {showClose && <WindowControl type="close" onClick={onClose} disabled={disabled} />}
    </div>
  );
};

export default WindowControl;
