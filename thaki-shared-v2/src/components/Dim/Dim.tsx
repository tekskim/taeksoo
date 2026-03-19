import { CSSProperties } from 'react';
import { cn } from '../../services/utils/cn';

const dimBaseStyles =
  'bg-text transition-opacity duration-300 ease-in-out opacity-0 absolute top-0 left-0 w-full h-full';

const dimAppearedStyles = 'opacity-40';

interface Props {
  className?: string;
  cssOptions?: CSSProperties;
  appeared: boolean;
  onClick?: () => void;
}
/**
 * 화면에 딤 처리를 추가하는 단순 오버레이 컴포넌트입니다.
 */
const Dim = ({ className, cssOptions, appeared, onClick }: Props): React.ReactElement => {
  return (
    <div
      className={cn(dimBaseStyles, appeared && dimAppearedStyles, className)}
      style={{
        ...(cssOptions || {}),
      }}
      onClick={onClick}
      aria-hidden="true"
      role="presentation"
    />
  );
};

export default Dim;
