import { ReactElement, ReactNode, useState } from 'react';
import { cn } from '../../services/utils/cn';
import { Icon } from '../Icon';
import {
  AlertCircleIcon,
  AlertIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  CloseSmallIcon,
  InfoIcon,
} from '../Icon/svg/wrapped';
import { inlineMessageStyles, inlineMessageVariants } from './InlineMessage.styles';

/**
 * InlineMessage 타입
 */
export type InlineMessageType = 'success' | 'info' | 'warning' | 'error';

/**
 * InlineMessage Props
 */
export interface InlineMessageProps {
  /** 메시지 타입 (기본: 'info') */
  type?: InlineMessageType;
  /** 메시지 내용 */
  message: ReactNode;
  /** 닫기 버튼 표시 여부 (기본: false) */
  closable?: boolean;
  /** 닫기 버튼 클릭 핸들러 */
  onClose?: () => void;
  /** 확장/축소 아코디언 기능 표시 여부 (기본: false) */
  expandable?: boolean;
  /** 에러 발생 시각 등 부가 정보 */
  timestamp?: ReactNode;
  /** 추가 className */
  className?: string;
}

/**
 * 인라인 메시지 컴포넌트
 *
 * 성공, 정보, 경고, 오류 메시지를 표시하는 인라인 컴포넌트입니다.
 * 닫기 버튼과 확장/축소 기능을 지원합니다.
 *
 * @example
 * ```tsx
 * <InlineMessage type="success" message="Operation completed successfully" />
 * <InlineMessage type="error" message="Failed to save" closable onClose={() => {}} />
 * <InlineMessage type="warning" message="Long warning text..." expandable />
 * ```
 */
const InlineMessage = ({
  type = 'info',
  message,
  closable = false,
  onClose,
  expandable = false,
  timestamp,
  className,
}: InlineMessageProps): ReactElement => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (): void => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = (): void => {
    onClose?.();
  };

  const getIcon = (): ReactElement => {
    const iconSize = 16 as const;

    switch (type) {
      case 'success':
        return <CheckCircleIcon size={iconSize} color="var(--semantic-color-success)" />;
      case 'info':
        return <InfoIcon size={iconSize} color="var(--semantic-color-info)" />;
      case 'warning':
        return <AlertIcon size={iconSize} color="var(--semantic-color-warning)" />;
      case 'error':
        return <AlertCircleIcon size={iconSize} color="var(--semantic-color-error)" />;
      default:
        return <InfoIcon size={iconSize} color="var(--semantic-color-info)" />;
    }
  };

  const content = (
    <span
      className={cn(
        inlineMessageStyles.text,
        expandable && !isExpanded && inlineMessageStyles.textCollapsed
      )}
    >
      {message}
    </span>
  );
  const timestampNode = timestamp ? (
    <span className={inlineMessageStyles.timestamp}>{timestamp}</span>
  ) : null;

  return (
    <div className={cn(inlineMessageVariants({ type }), className)}>
      {expandable ? (
        <>
          <button
            type="button"
            className={inlineMessageStyles.button}
            onClick={toggleExpand}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse message details' : 'Expand message details'}
          >
            <div className={inlineMessageStyles.expandableContent}>
              {getIcon()}
              {content}
            </div>
            {timestampNode}
            <Icon
              size={16}
              className={cn(
                inlineMessageStyles.chevron,
                isExpanded && inlineMessageStyles.chevronExpanded
              )}
            >
              <ChevronDownIcon />
            </Icon>
          </button>
          {closable && (
            <button
              type="button"
              className={inlineMessageStyles.close}
              onClick={handleClose}
              aria-label="Close message"
            >
              <CloseSmallIcon size={16} />
            </button>
          )}
        </>
      ) : (
        <>
          <div className={inlineMessageStyles.content}>
            {getIcon()}
            {content}
          </div>
          {timestampNode}
          {closable && (
            <button
              type="button"
              className={inlineMessageStyles.close}
              onClick={handleClose}
              aria-label="Close message"
            >
              <CloseSmallIcon size={16} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default InlineMessage;
