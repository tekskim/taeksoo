import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../services/utils/cn';

import type { SnapMode } from '../../types';
import {
  SnapBottom,
  SnapLeft,
  SnapRight,
  SnapTop,
  WindowClose,
  WindowMaximize,
  WindowMinimize,
} from '../Icon/svg/generated';
import Portal from '../Portal/Portal';
import {
  controlButtonStyles,
  controlIconStyles,
  controlWrapperStyles,
  snapArrowStyles,
  snapIconStyles,
  snapLabelStyles,
  snapOptionsContainerStyles,
  snapOptionStyles,
  snapPanelStyles,
  windowControlsStyles,
} from './FrameControls.styles';

export type FrameState = 'normal' | 'maximized';

export interface FrameControlsProps {
  frameState?: FrameState;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onRestore?: () => void;
  onClose?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onSnap?: (mode: SnapMode) => void;
}

interface SnapLayoutPanelProps {
  visible: boolean;
  size: 'sm' | 'md' | 'lg';
  onSelect: (mode: SnapMode) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

const SNAP_ICONS = {
  top: SnapTop,
  bottom: SnapBottom,
  left: SnapLeft,
  right: SnapRight,
} as const;

const SNAP_OPTIONS: {
  mode: SnapMode;
  iconType: keyof typeof SNAP_ICONS;
  label: string;
}[] = [
  { mode: 'topHalf', iconType: 'top', label: 'Top half split' },
  { mode: 'bottomHalf', iconType: 'bottom', label: 'Bottom half split' },
  { mode: 'leftHalf', iconType: 'left', label: 'Left half split' },
  { mode: 'rightHalf', iconType: 'right', label: 'Right half split' },
];

interface ControlButtonProps {
  label: string;
  size: 'sm' | 'md' | 'lg';
  pressed: boolean;
  onActivate: () => void;
  onPressStart: () => void;
  onPressEnd: () => void;
  children: React.ReactNode;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  label,
  size,
  pressed,
  onActivate,
  onPressStart,
  onPressEnd,
  children,
}) => (
  <button
    className={cn(controlButtonStyles({ size, pressed }))}
    onPointerDown={(event) => {
      event.stopPropagation();
      if (event.button !== 0) return;
      onPressStart();
    }}
    onPointerUp={(event) => {
      event.stopPropagation();
      if (event.button !== 0) return;
      onPressEnd();
      onActivate();
    }}
    onPointerCancel={(event) => {
      event.stopPropagation();
      onPressEnd();
    }}
    onPointerLeave={(event) => {
      if ((event.buttons & 1) !== 0) return;
      onPressEnd();
    }}
    onDoubleClick={(event) => {
      // Prevent bubbling to the AppLayout header double-click maximize toggle.
      event.stopPropagation();
    }}
    onClick={(event) => {
      event.stopPropagation();
      // Keyboard activation dispatches click(detail=0); pointer input is handled via pointerup.
      if (event.detail !== 0) return;
      onActivate();
    }}
    aria-label={label}
    title={label}
    type="button"
  >
    <span className={cn(controlIconStyles({ size }))} aria-hidden="true">
      {children}
    </span>
  </button>
);

const SnapLayoutPanel: React.FC<SnapLayoutPanelProps> = ({
  visible,
  size,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  triggerRef,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <Portal triggerRef={triggerRef} direction="bottom" gap={8} matchWidth={false}>
      <div
        className={cn(snapPanelStyles({ size }))}
        role="listbox"
        aria-label="Snap layout options"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <span className={cn(snapArrowStyles({ size }))} aria-hidden="true" />
        <span className={cn(snapLabelStyles({ size }))}>Split window</span>
        <div className={cn(snapOptionsContainerStyles({ size }))}>
          {SNAP_OPTIONS.map(({ mode, iconType, label }) => {
            const IconComponent = SNAP_ICONS[iconType];
            return (
              <button
                key={mode}
                type="button"
                className={cn(snapOptionStyles({ size }))}
                onClick={() => onSelect(mode)}
                aria-label={label}
                title={label}
                role="option"
              >
                <IconComponent className={cn(snapIconStyles({ size }))} />
              </button>
            );
          })}
        </div>
      </div>
    </Portal>
  );
};

export const FrameControls: React.FC<FrameControlsProps> = ({
  frameState = 'normal',
  onMinimize,
  onMaximize,
  onRestore,
  onClose,
  className,
  size = 'sm',
  onSnap,
}) => {
  const [pressedControl, setPressedControl] = useState<string | null>(null);
  const isMaximized = frameState === 'maximized';
  const [_isSnapOpen, setIsSnapOpen] = useState<boolean>(false);

  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const maximizeButtonWrapperRef = useRef<HTMLDivElement | null>(null);

  const clearOpenTimer = (): void => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  };

  const clearCloseTimer = (): void => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  // Cleanup timers on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      clearOpenTimer();
      clearCloseTimer();
    };
  }, []);

  useEffect(() => {
    if (!pressedControl) return;

    const clearPressedControl = (): void => {
      setPressedControl(null);
    };

    window.addEventListener('pointerup', clearPressedControl);
    window.addEventListener('pointercancel', clearPressedControl);
    window.addEventListener('blur', clearPressedControl);

    return () => {
      window.removeEventListener('pointerup', clearPressedControl);
      window.removeEventListener('pointercancel', clearPressedControl);
      window.removeEventListener('blur', clearPressedControl);
    };
  }, [pressedControl]);

  const openSnapWithDelay = useCallback(() => {
    clearCloseTimer();
    clearOpenTimer();
    openTimerRef.current = window.setTimeout(() => {
      setIsSnapOpen(true);
      openTimerRef.current = null;
    }, 250);
  }, []);

  const closeSnapWithDelay = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setIsSnapOpen(false);
      closeTimerRef.current = null;
    }, 150);
  }, []);

  const handleMinimize = useCallback(() => onMinimize?.(), [onMinimize]);

  const handleMaximizeRestore = useCallback(() => {
    if (isMaximized) {
      onRestore?.();
    } else {
      onMaximize?.();
    }
  }, [isMaximized, onRestore, onMaximize]);

  const handleClose = useCallback(() => onClose?.(), [onClose]);

  const handlePressStart = useCallback((controlType: string) => {
    setPressedControl(controlType);
  }, []);

  const handlePressEnd = useCallback(() => {
    setPressedControl(null);
  }, []);

  const handleSelectSnap = useCallback(
    (mode: SnapMode) => {
      onSnap?.(mode);
      setIsSnapOpen(false);
    },
    [onSnap]
  );

  return (
    <div
      className={cn(windowControlsStyles, className)}
      role="group"
      aria-label="Window controls"
      data-af-window-controls="true"
    >
      {onMinimize && (
        <ControlButton
          label="Minimize window"
          size={size}
          pressed={pressedControl === 'minimize'}
          onActivate={handleMinimize}
          onPressStart={() => handlePressStart('minimize')}
          onPressEnd={handlePressEnd}
        >
          <WindowMinimize aria-label="Minimize" />
        </ControlButton>
      )}
      {(onMaximize || onRestore) && (
        <div
          ref={maximizeButtonWrapperRef}
          className={cn(controlWrapperStyles)}
          onMouseEnter={openSnapWithDelay}
          onMouseLeave={closeSnapWithDelay}
        >
          <ControlButton
            label={isMaximized ? 'Restore window' : 'Maximize window'}
            size={size}
            pressed={pressedControl === 'maximize'}
            onActivate={handleMaximizeRestore}
            onPressStart={() => handlePressStart('maximize')}
            onPressEnd={handlePressEnd}
          >
            <WindowMaximize aria-label="Maximize" />
          </ControlButton>
          {/* TODO: Temporary - SnapLayoutPanel integration */}
          <SnapLayoutPanel
            visible={false}
            size={size}
            onSelect={handleSelectSnap}
            onMouseEnter={openSnapWithDelay}
            onMouseLeave={closeSnapWithDelay}
            triggerRef={maximizeButtonWrapperRef}
          />
        </div>
      )}
      {onClose && (
        <ControlButton
          label="Close window"
          size={size}
          pressed={pressedControl === 'close'}
          onActivate={handleClose}
          onPressStart={() => handlePressStart('close')}
          onPressEnd={handlePressEnd}
        >
          <WindowClose aria-label="Close" />
        </ControlButton>
      )}
    </div>
  );
};

export default FrameControls;
