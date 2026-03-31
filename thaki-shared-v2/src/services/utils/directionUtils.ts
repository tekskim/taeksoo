import type { Direction, Rect, Size, Viewport } from '../../types';

/**
 * 수직 방향을 반대로 뒤집습니다 (top ↔ bottom)
 */
const mapVerticalFlip = (dir: Direction): Direction => {
  switch (dir) {
    case 'top':
      return 'bottom';
    case 'top-start':
      return 'bottom-start';
    case 'top-end':
      return 'bottom-end';
    case 'bottom':
      return 'top';
    case 'bottom-start':
      return 'top-start';
    case 'bottom-end':
      return 'top-end';
    default:
      return dir;
  }
};

/**
 * 수평 방향을 반대로 뒤집습니다 (left ↔ right)
 */
const mapHorizontalFlip = (dir: Direction): Direction => {
  switch (dir) {
    case 'left':
      return 'right';
    case 'left-top':
      return 'right-top';
    case 'left-bottom':
      return 'right-bottom';
    case 'right':
      return 'left';
    case 'right-top':
      return 'left-top';
    case 'right-bottom':
      return 'left-bottom';
    default:
      return dir;
  }
};

/**
 * 수직 방향인지 확인합니다 (top, bottom 계열)
 */
const isVertical = (dir: Direction) =>
  dir === 'top' ||
  dir === 'top-start' ||
  dir === 'top-end' ||
  dir === 'bottom' ||
  dir === 'bottom-start' ||
  dir === 'bottom-end';

/**
 * 수평 방향인지 확인합니다 (left, right 계열)
 */
const isHorizontal = (dir: Direction) =>
  dir === 'left' ||
  dir === 'left-top' ||
  dir === 'left-bottom' ||
  dir === 'right' ||
  dir === 'right-top' ||
  dir === 'right-bottom';

/**
 * 화면 여백을 고려하여 최적의 표시 방향을 계산합니다
 */
const calculateOptimalDirection = (params: {
  triggerRect: Rect;
  elementSize: Size;
  preferred?: Direction;
  gap?: number;
  viewport: Viewport;
}): Direction => {
  const { triggerRect: rect, elementSize, preferred = 'bottom', gap = 4, viewport: vp } = params;

  const spaceAbove = rect.top - gap;
  const spaceBelow = vp.height - rect.bottom - gap;
  const spaceLeft = rect.left - gap;
  const spaceRight = vp.width - rect.right - gap;

  if (isVertical(preferred)) {
    // 선호 방향이 수직일 때: 선호 쪽 여유가 충분하면 그대로 유지
    const preferredIsTop = preferred.startsWith('top');
    const preferredHasSpace = preferredIsTop
      ? spaceAbove >= elementSize.height
      : spaceBelow >= elementSize.height;
    if (preferredHasSpace) return preferred;

    // 선호 쪽이 부족하고 반대쪽이 충분하면 뒤집기
    const oppositeHasSpace = preferredIsTop
      ? spaceBelow >= elementSize.height
      : spaceAbove >= elementSize.height;
    if (oppositeHasSpace) return mapVerticalFlip(preferred);

    // 둘 다 부족하면 선호 방향 유지
    return preferred;
  }

  if (isHorizontal(preferred)) {
    // 선호가 좌/우일 때는 너비 기준으로만 판단
    const needLeft =
      preferred.startsWith('right') &&
      spaceRight < elementSize.width &&
      spaceLeft >= elementSize.width;
    const needRight =
      preferred.startsWith('left') &&
      spaceLeft < elementSize.width &&
      spaceRight >= elementSize.width;

    if (needLeft || needRight) {
      return mapHorizontalFlip(preferred);
    }

    // 둘 다 부족하면 선호 방향 유지
    return preferred;
  }

  // 기본값
  return preferred;
};

/**
 * DOM 요소의 크기를 가져옵니다 (fallback 지원)
 */
const getContentSize = (
  rect: DOMRect | null,
  fallback: Size = { width: 200, height: 100 }
): Size => {
  if (!rect) return fallback;
  if (rect.width > 0 && rect.height > 0) {
    return { width: rect.width, height: rect.height };
  }
  return fallback;
};

export { calculateOptimalDirection, getContentSize };
