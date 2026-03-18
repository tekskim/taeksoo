import { cn } from '../../services/utils/cn';
import { titleWrapperVariants, titleTextStyles } from './Title.styles';

type TitleSize = 'small' | 'medium' | 'large';

interface Props {
  /** 타이틀 텍스트 */
  title: string;
  /** 타이틀 크기 (기본값: 'large') */
  size?: TitleSize;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * @description Title 컴포넌트 - 페이지나 섹션의 제목을 표시하는 컴포넌트
 */
const Title = ({ title, size = 'large', className }: Props): React.ReactElement => {
  return (
    <h2 className={cn(titleWrapperVariants({ size }), className)}>
      <span className={titleTextStyles}>{title}</span>
    </h2>
  );
};

export default Title;
