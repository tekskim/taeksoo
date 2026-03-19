import { cn } from '../../services/utils/cn';

/**
 * ChartToggle 버튼 스타일
 * - 인라인 플렉스, gap 1.5, 패딩 py-1 px-2
 * - 10px 폰트, 일반 굵기
 * - text-muted 색상, 투명 배경, 보더 없음
 * - hover시 text 색상
 * - disabled 상태 opacity 및 커서
 */
export const chartToggleButtonStyles = cn(
  'inline-flex items-center gap-1.5',
  'py-1 px-2',
  'text-[10px] font-normal',
  'text-text-muted',
  'bg-transparent border-none',
  'cursor-pointer',
  'transition-colors duration-fast',
  'hover:text-text',
  'disabled:opacity-50 disabled:cursor-not-allowed'
);

/**
 * 토글 스위치 트랙 스타일
 * - 24x12px 크기
 * - 투명 배경, 1px 보더
 * - 활성시 primary 보더, 비활성시 default 보더
 */
export const chartToggleSwitchStyles = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative inline-block',
    'w-6 h-3',
    'bg-transparent',
    'border rounded-md',
    'transition-colors duration-normal',
    isActive ? 'border-primary' : 'border-border'
  );

/**
 * 토글 노브 스타일
 * - 8x8px 크기
 * - 원형, 활성시 primary, 비활성시 muted
 * - 위치: top 1px, left 1px
 */
export const chartToggleKnobStyles = ({ isActive }: { isActive: boolean }) =>
  cn(
    'absolute',
    'top-[1px] left-[1px]',
    'w-2 h-2',
    'rounded-full',
    'transition-all duration-normal',
    isActive ? 'bg-primary' : 'bg-text-muted'
  );

/**
 * 토글 라벨 스타일
 */
export const chartToggleLabelStyles = cn('');

