import React, { useState, useCallback, type MouseEvent } from 'react';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { cn } from '../../services/utils/cn';
import { Title } from '../Title';
import { titleWrapperVariants } from '../Title/Title.styles';
import { Skeleton } from '../Skeleton';

// Tailwind styles
const styles = {
  container: 'flex flex-col gap-3 pt-3 px-4 pb-4 bg-surface border border-border rounded-base8',
  header: 'flex flex-col gap-4',
  actions: 'flex gap-[var(--component-layout-gap-xs)] items-center',
  infoGrid: 'flex flex-wrap gap-2 items-stretch w-full',
  infoCard:
    'flex-1 min-w-0 min-h-[1px] flex items-center justify-between py-3 px-4 bg-surface-muted rounded-base8 basis-[calc(25%-6px)]',
  infoCardFixed: 'flex-none',
  infoCardContent: 'flex flex-col gap-1.5 min-w-0',
  infoHeader: 'flex items-center justify-between w-full gap-1.5',
  infoLabel:
    'm-0 font-sans text-11 font-medium leading-16 text-text-muted whitespace-nowrap overflow-hidden text-ellipsis',
  infoContent: 'flex gap-1.5 items-center w-full min-w-0',
  infoValue:
    'm-0 font-sans text-12 font-regular leading-16 text-text whitespace-nowrap overflow-hidden text-ellipsis',
  infoAccessory: 'flex-shrink-0',
  copyButton:
    'inline-flex items-center justify-center h-5 w-5 p-0 bg-transparent border-none rounded-sm text-text-muted cursor-pointer transition-[color,background] duration-control ease-control outline-none hover:text-text hover:bg-surface-hover focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-border-focus focus-visible:outline-offset-[2px] active:text-text-strong flex-shrink-0',
  copyButtonSuccess: 'text-state-success',
  titleSkeleton: 'w-[200px] h-6',
  skeletonLabel: 'w-[80px] h-4',
  skeletonValue: 'w-[120px] h-4',
} as const;

export interface DetailPageHeaderInfoField {
  label: string;
  value: React.ReactNode;
  showCopyButton?: boolean;
  copyText?: string;
  /**
   * Info 카드의 width 설정
   * - undefined (기본값): flex-grow로 균등 분할
   * - number: 고정 width (px 단위, 예: 148)
   */
  width?: number;
  /**
   * 카드 오른쪽에 표시할 액세서리 요소 (예: StatusIndicator)
   * - 제공 시 카드 레이아웃이 수평으로 변경됨
   */
  accessory?: React.ReactNode;
}

export interface DetailPageHeaderProps {
  /** Plain string uses `<Title />`; pass a React node for custom title UI (e.g. icon + tooltip). */
  title: React.ReactNode;
  actions?: React.ReactNode;
  infoFields?: DetailPageHeaderInfoField[];
  /**
   * 컨테이너의 최대 width 설정 (px 단위)
   * - undefined (기본값): 제한 없음 (100%)
   * - number: 고정 width (예: 1024)
   */
  maxWidth?: number;
  /**
   * 로딩 상태
   * - true: Title과 Info 섹션에 Skeleton 표시
   * - false (기본값): 일반 콘텐츠 표시
   */
  isLoading?: boolean;
}

const HeaderCopyButton: React.FC<{ text: string }> = ({ text }): React.ReactElement => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(
    async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
      e.stopPropagation();
      if (!navigator.clipboard || !window.isSecureContext) {
        console.warn('Clipboard API is not available. Requires HTTPS (secure context).');
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    },
    [text]
  );

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(styles.copyButton, isCopied && styles.copyButtonSuccess)}
      aria-label={isCopied ? 'Copied' : 'Copy to clipboard'}
    >
      {isCopied ? (
        <IconCheck size={12} stroke={2} className="shrink-0" />
      ) : (
        <IconCopy size={12} stroke={1.5} className="shrink-0" />
      )}
    </button>
  );
};

const DetailPageHeader: React.FC<DetailPageHeaderProps> = ({
  title,
  actions,
  infoFields = [],
  maxWidth,
  isLoading = false,
}): React.ReactElement => {
  return (
    <div className={styles.container} style={maxWidth ? { maxWidth: `${maxWidth}px` } : undefined}>
      {/* 헤더 */}
      <div className={styles.header}>
        {isLoading ? (
          <div className={styles.titleSkeleton}>
            <Skeleton />
          </div>
        ) : typeof title === 'string' ? (
          <Title title={title} />
        ) : (
          <h2 className={titleWrapperVariants({ size: 'large' })}>{title}</h2>
        )}
      </div>

      {/* 액션 버튼 */}
      {actions && !isLoading && <div className={styles.actions}>{actions}</div>}

      {/* 정보 섹션 */}
      {infoFields.length > 0 && (
        <div className={styles.infoGrid}>
          {infoFields.map((field, index) => (
            <div
              key={index}
              className={cn(styles.infoCard, field.width && styles.infoCardFixed)}
              style={field.width ? { width: `${field.width}px` } : undefined}
            >
              {isLoading ? (
                <div className={styles.infoCardContent}>
                  <div className={styles.skeletonLabel}>
                    <Skeleton />
                  </div>
                  <div className={styles.skeletonValue}>
                    <Skeleton />
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.infoCardContent}>
                    {field.showCopyButton ? (
                      <>
                        <p className={styles.infoLabel}>{field.label}</p>
                        <div className={styles.infoContent}>
                          <div className={cn(styles.infoValue, 'flex-1 min-w-0')}>
                            {field.value}
                          </div>
                          {field.copyText && <HeaderCopyButton text={field.copyText} />}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className={styles.infoLabel}>{field.label}</p>
                        <div className={styles.infoValue}>{field.value}</div>
                      </>
                    )}
                  </div>
                  {field.accessory && <div className={styles.infoAccessory}>{field.accessory}</div>}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailPageHeader;
