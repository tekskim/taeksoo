import {
  ComponentVariant,
  ComponentAppearance,
  ComponentSize,
} from '../../types';

type ButtonVariant = ComponentVariant;
type ButtonAppearance = ComponentAppearance;

/**
 * @type `Button` 컴포넌트의 속성 타입입니다.
 * @param variant - 버튼 색상 (primary, secondary, success, error, warning, muted)
 * @param appearance - 버튼 형태 (solid, outline, ghost)
 * @param size - 버튼 크기
 * @param isLoading - 로딩 상태
 * @param fullWidth - 전체 너비 사용 여부
 * @param loadingElement - 로딩 요소
 * @param children - 버튼 내용
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
  size?: ComponentSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  loadingElement?: React.ReactNode;
  children: React.ReactNode;
}

export type { ButtonProps, ButtonVariant, ButtonAppearance };
