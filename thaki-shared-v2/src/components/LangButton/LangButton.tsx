import { cn } from '../../services/utils/cn';
import { ContextMenu } from '../ContextMenu';
import { IconVariant, LanguageIcon } from '../Icon';
import { langButtonStyles } from './LangButton.styles';

interface Props {
  /**
   * 언어 변경 시 실행될 콜백 함수
   */
  onLanguageChange: (lang: 'en' | 'ko') => void;

  variant?: IconVariant;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;
}

/**
 * @description
 * LangButton 컴포넌트는 언어 선택 버튼을 제공합니다.
 *
 * 주요 기능:
 * - 언어 아이콘 버튼을 제공합니다.
 * - 클릭 시 EN, KO 옵션이 포함된 ContextMenu를 표시합니다.
 * - 언어 선택 시 콜백 함수를 실행합니다.
 *
 * @param onLanguageChange - 언어 변경 시 실행될 콜백 함수
 * @param className - 추가 CSS 클래스명
 * @returns LangButton 컴포넌트
 */
const LangButton = ({
  onLanguageChange,
  className,
  variant = 'secondary',
}: Props) => {
  const handleLanguageSelect = (lang: 'en' | 'ko') => {
    onLanguageChange(lang);
    window.dispatchEvent(new CustomEvent('locale-change', { detail: lang }));
    localStorage.setItem('thaki_suite_language', lang);
  };

  return (
    <ContextMenu.Root
      trigger={({ toggle }) => (
        <button
          type="button"
          className={cn(langButtonStyles, className)}
          onClick={toggle}
          aria-label="Change language"
          title="Language"
        >
          <LanguageIcon size="sm" variant={variant} />
        </button>
      )}
      direction="bottom-end"
    >
      <ContextMenu.Item action={() => handleLanguageSelect('en')}>
        English
      </ContextMenu.Item>
      <ContextMenu.Item action={() => handleLanguageSelect('ko')}>
        한국어 (Korean)
      </ContextMenu.Item>
    </ContextMenu.Root>
  );
};

export default LangButton;
