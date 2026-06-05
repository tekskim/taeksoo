import React, { useState, useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/* ----------------------------------------
   Tooltip Types
   ---------------------------------------- */

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'content'
> {
  /** Tooltip content */
  content: ReactNode;
  /** Trigger element */
  children: ReactNode;
  /** Position relative to trigger */
  position?: TooltipPosition;
  /** Delay before showing (ms) */
  delay?: number;
  /** Disable tooltip */
  disabled?: boolean;
}

/* ----------------------------------------
   Tooltip Component (using design tokens)
   ---------------------------------------- */

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  disabled = false,
  ...rest
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPositioned, setIsPositioned] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [arrowOffset, setArrowOffset] = useState<number | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const gap = 6; // Arrow height + spacing

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.top - tooltipRect.height - gap;
        break;
      case 'bottom':
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.bottom + gap;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - gap;
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
      case 'right':
        x = triggerRect.right + gap;
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
    }

    // Keep tooltip within viewport and track arrow offset
    const clampedX = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8));
    const clampedY = Math.max(8, Math.min(y, window.innerHeight - tooltipRect.height - 8));

    // Calculate arrow offset when tooltip is shifted horizontally (for top/bottom)
    if (position === 'top' || position === 'bottom') {
      const shift = clampedX - x;
      if (Math.abs(shift) > 1) {
        // Arrow should point at trigger center relative to the tooltip box
        const triggerCenter = triggerRect.left + triggerRect.width / 2;
        setArrowOffset(triggerCenter - clampedX);
      } else {
        setArrowOffset(null);
      }
    } else if (position === 'left' || position === 'right') {
      const shift = clampedY - y;
      if (Math.abs(shift) > 1) {
        const triggerCenter = triggerRect.top + triggerRect.height / 2;
        setArrowOffset(triggerCenter - clampedY);
      } else {
        setArrowOffset(null);
      }
    }

    setCoords({ x: clampedX, y: clampedY });
    setIsPositioned(true);
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
    setIsPositioned(false);
  };

  const handleClick = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
    setIsPositioned(false);
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
    }
  }, [isVisible, position]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Arrow position styles based on tooltip position
  const getArrowStyles = (): { className: string; style?: React.CSSProperties } => {
    const base: Record<TooltipPosition, string> = {
      top: 'bottom-0 translate-y-full border-l-transparent border-r-transparent border-b-transparent border-t-[var(--tooltip-bg)]',
      bottom:
        'top-0 -translate-y-full border-l-transparent border-r-transparent border-t-transparent border-b-[var(--tooltip-bg)]',
      left: 'right-0 translate-x-full border-t-transparent border-b-transparent border-r-transparent border-l-[var(--tooltip-bg)]',
      right:
        'left-0 -translate-x-full border-t-transparent border-b-transparent border-l-transparent border-r-[var(--tooltip-bg)]',
    };

    if (arrowOffset !== null && (position === 'top' || position === 'bottom')) {
      return {
        className: base[position],
        style: {
          left: `${arrowOffset}px`,
          transform:
            'translateX(-50%)' +
            (position === 'bottom' ? ' translateY(-100%)' : ' translateY(100%)'),
        },
      };
    }
    if (arrowOffset !== null && (position === 'left' || position === 'right')) {
      return {
        className: base[position],
        style: {
          top: `${arrowOffset}px`,
          transform:
            'translateY(-50%)' +
            (position === 'right' ? ' translateX(-100%)' : ' translateX(100%)'),
        },
      };
    }

    // Default: centered
    const centered: Record<TooltipPosition, string> = {
      top: `${base.top} left-1/2 -translate-x-1/2`,
      bottom: `${base.bottom} left-1/2 -translate-x-1/2`,
      left: `${base.left} top-1/2 -translate-y-1/2`,
      right: `${base.right} top-1/2 -translate-y-1/2`,
    };
    return { className: centered[position] };
  };

  const arrowProps = getArrowStyles();

  return (
    <>
      <div
        {...rest}
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        onClick={handleClick}
        className="inline-flex"
      >
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            className="fixed z-[var(--z-tooltip)] pointer-events-none transition-opacity duration-[var(--duration-fast)]"
            style={{
              left: coords.x,
              top: coords.y,
              opacity: isPositioned ? 1 : 0,
            }}
          >
            <div className="relative">
              {/* Tooltip Box */}
              <div
                data-figma-name="[TDS] Tooltip"
                className="
                  bg-[var(--tooltip-bg)]
                  text-[var(--tooltip-text)]
                  px-[var(--tooltip-padding-x)]
                  py-[var(--tooltip-padding-y)]
                  rounded-[var(--tooltip-radius)]
                  text-[length:var(--tooltip-font-size)]
                  leading-[var(--tooltip-line-height)]
                  text-center
                  min-w-[var(--tooltip-min-width)]
                  max-w-[var(--tooltip-max-width)]
                  w-max
                "
              >
                {content}
              </div>
              {/* Arrow */}
              <div
                className={`absolute w-0 h-0 border-[length:var(--tooltip-arrow-size)] border-solid ${arrowProps.className}`}
                style={arrowProps.style}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
