export interface ProgressBarProps extends React.HTMLAttributes<HTMLElement> {
  value: number;
  pendingValue?: number;
  max?: number;
  label?: string | React.ReactNode;
  showValue?: 'percentage' | 'absolute' | false;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  color?: string;
  pendingColor?: string;
}
