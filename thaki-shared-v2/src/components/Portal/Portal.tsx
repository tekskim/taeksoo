import { type ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Direction } from '../../types';

interface PortalProps {
  children: ReactNode;
  triggerRef?: React.RefObject<HTMLElement | HTMLButtonElement | null>;
  position?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  direction?: Direction;
  gap?: number;
  matchWidth?: boolean;
  /** @deprecated Ignored when Popover API + Anchor Positioning is available */
  container?: HTMLElement;
}

/* ── Feature detection (evaluated once at module load) ───── */

const canUsePopover = typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype;
const canUseAnchor = typeof CSS !== 'undefined' && CSS.supports('anchor-name: --a');
const useNative = canUsePopover && canUseAnchor;

/* ── Shared helpers ──────────────────────────────────────── */

function computeOffsets(pos?: PortalProps['position']): {
  top: number;
  left: number;
} {
  let top = 0;
  let left = 0;
  if (pos?.top != null) top += pos.top;
  if (pos?.bottom != null) top -= pos.bottom;
  if (pos?.left != null) left += pos.left;
  if (pos?.right != null) left -= pos.right;
  return { top, left };
}

function resolvePortalScope(triggerEl: HTMLElement | null): string | undefined {
  if (!triggerEl) return undefined;
  const rootEl = triggerEl.closest<HTMLElement>('[data-portal-root]');
  if (rootEl?.id) return rootEl.id;
  const scopedEl = triggerEl.closest<HTMLElement>('[data-portal-scope]');
  return scopedEl?.getAttribute('data-portal-scope') ?? undefined;
}

/* ── Direction pre-computation (frame-boundary aware) ────── */

interface Bounds {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

const FLIP_MAP: Partial<Record<Direction, Direction>> = {
  top: 'bottom',
  'top-start': 'bottom-start',
  'top-end': 'bottom-end',
  bottom: 'top',
  'bottom-start': 'top-start',
  'bottom-end': 'top-end',
  left: 'right',
  'left-top': 'right-top',
  'left-bottom': 'right-bottom',
  right: 'left',
  'right-top': 'left-top',
  'right-bottom': 'left-bottom',
};

function flipPrimaryAxis(dir: Direction): Direction {
  return FLIP_MAP[dir] ?? dir;
}

const SECONDARY_FLIP_MAP: Partial<Record<Direction, Direction>> = {
  'left-top': 'left-bottom',
  'left-bottom': 'left-top',
  'right-top': 'right-bottom',
  'right-bottom': 'right-top',
  'top-start': 'top-end',
  'top-end': 'top-start',
  'bottom-start': 'bottom-end',
  'bottom-end': 'bottom-start',
};

function flipSecondaryAxis(dir: Direction): Direction {
  return SECONDARY_FLIP_MAP[dir] ?? dir;
}

const CLIP_VALUES = new Set(['hidden', 'auto', 'scroll', 'clip']);

/**
 * Compute the visible frame bounds by intersecting all clipping
 * ancestors above `el` with the viewport.
 *
 * Note: we intentionally skip `el`'s own rect because
 * `[data-portal-root]` may have 0-height when it sits inside a
 * flex container whose children consume all available space.
 */
function getFrameBounds(el: HTMLElement, viewport: Bounds): Bounds {
  let result: Bounds = { ...viewport };
  let foundClip = false;

  let current = el.parentElement;
  while (current && current !== document.documentElement) {
    const s = getComputedStyle(current);
    if (
      CLIP_VALUES.has(s.overflow) ||
      CLIP_VALUES.has(s.overflowX) ||
      CLIP_VALUES.has(s.overflowY)
    ) {
      const pr = current.getBoundingClientRect();
      result = {
        top: Math.max(result.top, pr.top),
        left: Math.max(result.left, pr.left),
        right: Math.min(result.right, pr.right),
        bottom: Math.min(result.bottom, pr.bottom),
      };
      foundClip = true;
    }
    current = current.parentElement;
  }

  return foundClip ? result : viewport;
}

interface ResolvedBounds {
  bounds: Bounds;
  /** True when the boundary comes from a `[data-portal-root]` frame,
   *  meaning CSS position-try-fallbacks (viewport-based) must be suppressed
   *  so that the JS pre-computation is the sole direction authority. */
  isFrameConstrained: boolean;
}

/**
 * Resolve the constraint boundary for direction calculation.
 * In Desktop mode the closest `[data-portal-root]` is the MFE frame;
 * in standalone mode or when absent, falls back to the viewport.
 *
 * Because `[data-portal-root]` itself has no overflow constraint,
 * its `getBoundingClientRect()` may exceed the visible clipped area.
 * We walk up to find clipping ancestors and intersect their rects.
 */
function resolveBounds(triggerEl: HTMLElement | null | undefined): ResolvedBounds {
  const viewport: Bounds = {
    top: 0,
    left: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
  };
  if (!triggerEl) return { bounds: viewport, isFrameConstrained: false };
  const root = triggerEl.closest<HTMLElement>('[data-portal-root]');
  if (!root) return { bounds: viewport, isFrameConstrained: false };
  const frameBounds = getFrameBounds(root, viewport);
  const isConstrained =
    frameBounds.top !== viewport.top ||
    frameBounds.left !== viewport.left ||
    frameBounds.right !== viewport.right ||
    frameBounds.bottom !== viewport.bottom;
  return {
    bounds: frameBounds,
    isFrameConstrained: isConstrained,
  };
}

/**
 * Pre-compute direction using trigger position and frame boundary.
 * CSS `position-try-fallbacks` only knows about the viewport;
 * this handles the case where a popover must stay inside a smaller frame.
 */
function computeOptimalDirection(
  triggerEl: HTMLElement | null | undefined,
  preferred: Direction,
  gap: number,
  bounds: Bounds
): Direction {
  if (!triggerEl) return preferred;

  const rect = triggerEl.getBoundingClientRect();
  const space = {
    right: bounds.right - rect.right - gap,
    left: rect.left - bounds.left - gap,
    bottom: bounds.bottom - rect.bottom - gap,
    top: rect.top - bounds.top - gap,
  };

  const MIN_W = 80;
  const MIN_H = 40;

  if (preferred.startsWith('right') && space.right < MIN_W && space.left > space.right)
    return flipPrimaryAxis(preferred);
  if (preferred.startsWith('left') && space.left < MIN_W && space.right > space.left)
    return flipPrimaryAxis(preferred);
  if (preferred.startsWith('bottom') && space.bottom < MIN_H && space.top > space.bottom)
    return flipPrimaryAxis(preferred);
  if (preferred.startsWith('top') && space.top < MIN_H && space.bottom > space.top)
    return flipPrimaryAxis(preferred);

  return preferred;
}

/* ── Modern: Popover API + CSS Anchor Positioning ────────── */

function buildAnchorCSS(
  anchorName: string,
  direction: Direction,
  gap: number,
  matchWidth: boolean,
  offsets: { top: number; left: number },
  useCSSTryFallbacks: boolean
): string {
  const r: string[] = [
    'position:fixed',
    'inset:auto',
    'margin:0',
    'padding:0',
    'border:none',
    'background:transparent',
    'overflow:visible',
    `position-anchor:${anchorName}`,
  ];
  if (useCSSTryFallbacks) {
    r.push('position-try-fallbacks:flip-block,flip-inline,flip-block flip-inline');
  }
  if (matchWidth) r.push('width:anchor-size(width)');

  const { top: mt, left: ml } = offsets;

  switch (direction) {
    case 'bottom':
      r.push('top:anchor(bottom)', 'justify-self:anchor-center');
      r.push(`margin-top:${gap + mt}px`, `margin-left:${ml}px`);
      break;
    case 'bottom-start':
      r.push('top:anchor(bottom)', 'left:anchor(left)');
      r.push(`margin-top:${gap + mt}px`, `margin-left:${ml}px`);
      break;
    case 'bottom-end':
      r.push('top:anchor(bottom)', 'right:anchor(right)');
      r.push(`margin-top:${gap + mt}px`, `margin-right:${-ml}px`);
      break;
    case 'top':
      r.push('bottom:anchor(top)', 'justify-self:anchor-center');
      r.push(`margin-bottom:${gap - mt}px`, `margin-left:${ml}px`);
      break;
    case 'top-start':
      r.push('bottom:anchor(top)', 'left:anchor(left)');
      r.push(`margin-bottom:${gap - mt}px`, `margin-left:${ml}px`);
      break;
    case 'top-end':
      r.push('bottom:anchor(top)', 'right:anchor(right)');
      r.push(`margin-bottom:${gap - mt}px`, `margin-right:${-ml}px`);
      break;
    case 'left':
      r.push('right:anchor(left)', 'align-self:anchor-center');
      r.push(`margin-right:${gap - ml}px`, `margin-top:${mt}px`);
      break;
    case 'left-top':
      r.push('right:anchor(left)', 'top:anchor(top)');
      r.push(`margin-right:${gap - ml}px`, `margin-top:${mt}px`);
      break;
    case 'left-bottom':
      r.push('right:anchor(left)', 'bottom:anchor(bottom)');
      r.push(`margin-right:${gap - ml}px`, `margin-bottom:${-mt}px`);
      break;
    case 'right':
      r.push('left:anchor(right)', 'align-self:anchor-center');
      r.push(`margin-left:${gap + ml}px`, `margin-top:${mt}px`);
      break;
    case 'right-top':
      r.push('left:anchor(right)', 'top:anchor(top)');
      r.push(`margin-left:${gap + ml}px`, `margin-top:${mt}px`);
      break;
    case 'right-bottom':
      r.push('left:anchor(right)', 'bottom:anchor(bottom)');
      r.push(`margin-left:${gap + ml}px`, `margin-bottom:${-mt}px`);
      break;
  }
  return r.join(';');
}

const ModernPortal = ({
  children,
  triggerRef,
  position,
  direction = 'bottom',
  gap = 4,
  matchWidth = true,
}: Omit<PortalProps, 'container'>) => {
  const reactId = useId();
  const anchorName = useMemo(() => `--portal-${reactId.replace(/[^a-zA-Z0-9]/g, '')}`, [reactId]);
  const portalRef = useRef<HTMLDivElement>(null);
  const offsets = useMemo(() => computeOffsets(position), [position]);
  const portalScope = useMemo(() => resolvePortalScope(triggerRef?.current ?? null), [triggerRef]);

  // Set anchor-name on the trigger element
  useEffect(() => {
    const trigger = triggerRef?.current;
    if (!trigger) return;
    trigger.style.setProperty('anchor-name', anchorName);
    return () => {
      trigger.style.removeProperty('anchor-name');
    };
  }, [triggerRef, anchorName]);

  // Pre-compute direction (frame-boundary aware), then let CSS handle the rest.
  useEffect(() => {
    const el = portalRef.current;
    if (!el) return;

    const trigger = triggerRef?.current;
    const { bounds, isFrameConstrained } = resolveBounds(trigger);
    const optimal = computeOptimalDirection(trigger, direction, gap, bounds);

    const applyDirection = (dir: Direction) => {
      el.style.cssText = buildAnchorCSS(
        anchorName,
        dir,
        gap,
        matchWidth,
        offsets,
        !isFrameConstrained
      );
      el.dataset.direction = dir;
    };

    applyDirection(optimal);

    try {
      el.showPopover();
    } catch {
      /* already shown */
    }

    if (isFrameConstrained) {
      let dir = optimal;
      let pr = el.getBoundingClientRect();

      const primaryOverflow =
        (dir.startsWith('bottom') && pr.bottom > bounds.bottom) ||
        (dir.startsWith('top') && pr.top < bounds.top) ||
        (dir.startsWith('right') && pr.right > bounds.right) ||
        (dir.startsWith('left') && pr.left < bounds.left);

      if (primaryOverflow) {
        dir = flipPrimaryAxis(dir);
        applyDirection(dir);
        pr = el.getBoundingClientRect();
      }

      const isLR = dir.startsWith('left') || dir.startsWith('right');
      const isTB = dir.startsWith('top') || dir.startsWith('bottom');
      const secondaryOverflow =
        (isLR && pr.bottom > bounds.bottom && dir.endsWith('-top')) ||
        (isLR && pr.top < bounds.top && dir.endsWith('-bottom')) ||
        (isTB && pr.right > bounds.right && dir.endsWith('-start')) ||
        (isTB && pr.left < bounds.left && dir.endsWith('-end'));

      if (secondaryOverflow) {
        dir = flipSecondaryAxis(dir);
        applyDirection(dir);
      }
    }
  }, [anchorName, direction, gap, matchWidth, offsets, triggerRef]);

  // Hide popover on unmount
  useEffect(() => {
    const el = portalRef.current;
    return () => {
      try {
        el?.hidePopover();
      } catch {
        /* already hidden */
      }
    };
  }, []);

  return (
    <div
      ref={portalRef}
      popover="manual"
      data-direction={direction}
      {...(portalScope ? { 'data-portal-scope': portalScope } : {})}
    >
      {children}
    </div>
  );
};

/* ── Legacy fallback: createPortal + JS positioning ──────── */

type LegacyStyles = {
  position: 'fixed';
  top: string;
  left: string;
  width: string;
  zIndex: number;
  transform: string;
};

const LegacyPortal = ({
  children,
  triggerRef,
  position,
  direction = 'bottom',
  gap = 4,
  matchWidth = true,
  container = document.body,
}: PortalProps) => {
  const memoizedPosition = useMemo(() => position || {}, [position]);
  const [portalStyles, setPortalStyles] = useState<LegacyStyles | null>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef?.current) return null;
    const rect = triggerRef.current.getBoundingClientRect();
    let top: string;
    let left: string;
    let transform = '';

    switch (direction) {
      case 'top':
        top = `${rect.top - gap}px`;
        left = `${rect.left + rect.width / 2}px`;
        transform = 'translate(-50%, -100%)';
        break;
      case 'top-start':
        top = `${rect.top - gap}px`;
        left = `${rect.left}px`;
        transform = 'translateY(-100%)';
        break;
      case 'top-end':
        top = `${rect.top - gap}px`;
        left = `${rect.right}px`;
        transform = 'translate(-100%, -100%)';
        break;
      case 'bottom':
        top = `${rect.bottom + gap}px`;
        left = `${rect.left + rect.width / 2}px`;
        transform = 'translateX(-50%)';
        break;
      case 'bottom-start':
        top = `${rect.bottom + gap}px`;
        left = `${rect.left}px`;
        break;
      case 'bottom-end':
        top = `${rect.bottom + gap}px`;
        left = `${rect.right}px`;
        transform = 'translateX(-100%)';
        break;
      case 'left':
        top = `${rect.top + rect.height / 2}px`;
        left = `${rect.left - gap}px`;
        transform = 'translate(-100%, -50%)';
        break;
      case 'left-top':
        top = `${rect.top}px`;
        left = `${rect.left - gap}px`;
        transform = 'translateX(-100%)';
        break;
      case 'left-bottom':
        top = `${rect.bottom}px`;
        left = `${rect.left - gap}px`;
        transform = 'translate(-100%, -100%)';
        break;
      case 'right':
        top = `${rect.top + rect.height / 2}px`;
        left = `${rect.right + gap}px`;
        transform = 'translateY(-50%)';
        break;
      case 'right-top':
        top = `${rect.top}px`;
        left = `${rect.right + gap}px`;
        break;
      case 'right-bottom':
        top = `${rect.bottom}px`;
        left = `${rect.right + gap}px`;
        transform = 'translateY(-100%)';
        break;
      default:
        top = `${rect.bottom + gap}px`;
        left = `${rect.left + rect.width / 2}px`;
        transform = 'translateX(-50%)';
    }

    let topOffset = 0;
    let leftOffset = 0;
    if (memoizedPosition.top !== undefined) topOffset += memoizedPosition.top;
    if (memoizedPosition.bottom !== undefined) topOffset -= memoizedPosition.bottom;
    if (memoizedPosition.left !== undefined) leftOffset += memoizedPosition.left;
    if (memoizedPosition.right !== undefined) leftOffset -= memoizedPosition.right;

    if (topOffset !== 0) top = `${parseFloat(top) + topOffset}px`;
    if (leftOffset !== 0) left = `${parseFloat(left) + leftOffset}px`;

    return {
      position: 'fixed' as const,
      top,
      left,
      width: matchWidth ? `${rect.width}px` : 'auto',
      zIndex: 2002,
      transform,
    };
  }, [direction, gap, matchWidth, memoizedPosition, triggerRef]);

  const updatePosition = useCallback(() => {
    const styles = calculatePosition();
    if (styles) setPortalStyles(styles);
  }, [calculatePosition]);

  useEffect(() => {
    if (portalRef.current) {
      const styles = calculatePosition();
      if (styles) setPortalStyles(styles);
    }
  }, [direction, gap, memoizedPosition, matchWidth, calculatePosition]);

  const findScrollContainers = useCallback((element: HTMLElement): HTMLElement[] => {
    const containers: HTMLElement[] = [];
    let parent = element.parentElement;
    while (parent) {
      const { overflow, overflowX, overflowY } = window.getComputedStyle(parent);
      if ([overflow, overflowX, overflowY].some((v) => v === 'auto' || v === 'scroll')) {
        containers.push(parent);
      }
      if (parent === document.body) break;
      parent = parent.parentElement;
    }
    return containers;
  }, []);

  useEffect(() => {
    if (!triggerRef?.current) return;
    const scrollContainers = findScrollContainers(triggerRef.current);
    let rafId: number;
    const throttled = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };
    window.addEventListener('resize', updatePosition);
    scrollContainers.forEach((c) => c.addEventListener('scroll', throttled, { passive: true }));
    window.addEventListener('scroll', throttled, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', throttled);
      scrollContainers.forEach((c) => c.removeEventListener('scroll', throttled));
    };
  }, [updatePosition, findScrollContainers, triggerRef]);

  useEffect(() => {
    if (!triggerRef?.current) return;
    const observer = new ResizeObserver(updatePosition);
    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [updatePosition, triggerRef]);

  const portalScope = useMemo(() => resolvePortalScope(triggerRef?.current ?? null), [triggerRef]);

  if (!portalStyles) return null;

  return createPortal(
    <div
      ref={portalRef}
      style={portalStyles}
      data-direction={direction}
      {...(portalScope ? { 'data-portal-scope': portalScope } : {})}
    >
      {children}
    </div>,
    container
  );
};

/* ── Public component ────────────────────────────────────── */

const Portal = (props: PortalProps) =>
  useNative ? <ModernPortal {...props} /> : <LegacyPortal {...props} />;

export default Portal;
export type { Direction };
