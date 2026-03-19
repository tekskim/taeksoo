import { ComponentSize } from '../../types';

export type LoadingSpinnerColor = 'primary' | 'secondary' | 'white';

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: ComponentSize;
  color?: LoadingSpinnerColor;
  className?: string;
}
