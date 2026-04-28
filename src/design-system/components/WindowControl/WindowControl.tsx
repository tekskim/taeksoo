import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { IconX, IconMinus, IconSquare, IconSquares } from '@tabler/icons-react';
import { Scaling } from 'lucide-react';

/* ----------------------------------------
   Types
   ---------------------------------------- */

export type WindowControlType = 'minimize' | 'maximize' | 'close' | 'split';

export interface WindowControlProps {
  /** Control type */
  type: WindowControlType;
  /** Whether the window is currently maximized (only affects maximize button icon) */
  isMaximized?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Snap to left half */
  onSnapLeft?: () => void;
  /** Snap to right half */
  onSnapRight?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
}

export interface WindowControlsProps {
  /** Show minimize button */
  showMinimize?: boolean;
  /** Show split button */
  showSplit?: boolean;
  /** Show maximize button */
  showMaximize?: boolean;
  /** Show close button */
  showClose?: boolean;
  /** Whether the window is currently maximized */
  isMaximized?: boolean;
  /** Minimize click handler */
  onMinimize?: () => void;
  /** Snap left click handler */
  onSnapLeft?: () => void;
  /** Snap right click handler */
  onSnapRight?: () => void;
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
   SplitDropdown (internal)
   ---------------------------------------- */

interface SplitDropdownProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  onSnapLeft?: () => void;
  onSnapRight?: () => void;
  onClose: () => void;
}

const SplitDropdown: React.FC<SplitDropdownProps> = ({
  anchorRef,
  onSnapLeft,
  onSnapRight,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const windowEl = anchorRef.current.closest(
        '[role="dialog"], .pointer-events-auto'
      ) as HTMLElement | null;
      const windowRight = windowEl ? windowEl.getBoundingClientRect().right : rect.right;
      const dropdownWidth = 180;
      const left = windowRight - dropdownWidth;
      setPos({ top: rect.bottom + 4, left: Math.max(8, left) });
    }
  }, [anchorRef]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, anchorRef]);

  const itemClass =
    'flex items-center justify-between w-full px-2.5 py-1.5 text-body-sm text-[var(--color-text-default)] hover:bg-[var(--color-surface-subtle)] transition-colors rounded-[var(--radius-sm)] cursor-pointer';
  const kbdClass = 'text-body-xs text-[var(--color-text-muted)] ml-4 shrink-0';

  return createPortal(
    <div
      ref={ref}
      style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 99999 }}
      className="w-[180px] p-1 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-2xl"
    >
      <button
        type="button"
        className={itemClass}
        onClick={() => {
          onSnapLeft?.();
          onClose();
        }}
      >
        <span>Left Half</span>
        <span className={kbdClass}>⌥⌘◀</span>
      </button>
      <button
        type="button"
        className={itemClass}
        onClick={() => {
          onSnapRight?.();
          onClose();
        }}
      >
        <span>Right Half</span>
        <span className={kbdClass}>⌥⌘▶</span>
      </button>
    </div>,
    document.body
  );
};

/* ----------------------------------------
   WindowControl Component
   ---------------------------------------- */

export const WindowControl: React.FC<WindowControlProps> = ({
  type,
  isMaximized = false,
  onClick,
  onSnapLeft,
  onSnapRight,
  disabled = false,
  className = '',
}) => {
  const iconSize = 12;
  const strokeWidth = 1;
  const [showDropdown, setShowDropdown] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (type !== 'split' || disabled) return;
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setShowDropdown(true);
  }, [type, disabled]);

  const handleMouseLeave = useCallback(() => {
    if (type !== 'split') return;
    hoverTimeout.current = setTimeout(() => setShowDropdown(false), 150);
  }, [type]);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

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
      case 'split':
        return <Scaling size={iconSize} strokeWidth={strokeWidth} />;
    }
  };

  const ariaLabel =
    type === 'maximize'
      ? isMaximized
        ? 'Restore'
        : 'Maximize'
      : type === 'split'
        ? 'Split'
        : type;

  if (type === 'split') {
    return (
      <div
        ref={containerRef}
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          data-figma-name="[TDS] FrameControls"
          type="button"
          onClick={() => setShowDropdown((v) => !v)}
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
        {showDropdown && (
          <SplitDropdown
            anchorRef={containerRef}
            onSnapLeft={onSnapLeft}
            onSnapRight={onSnapRight}
            onClose={() => setShowDropdown(false)}
          />
        )}
      </div>
    );
  }

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
  showSplit = false,
  showMaximize = true,
  showClose = true,
  isMaximized = false,
  onMinimize,
  onSnapLeft,
  onSnapRight,
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
      {showSplit && (
        <WindowControl
          type="split"
          onSnapLeft={onSnapLeft}
          onSnapRight={onSnapRight}
          disabled={disabled}
        />
      )}
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
