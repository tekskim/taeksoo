import type { ReactElement, ReactNode } from 'react';
import ActionModal, { type ActionModalProps } from '../ActionModal/ActionModal';
import { InfoContainer } from '../InfoContainer';
import { InlineMessage, type InlineMessageType } from '../InlineMessage';
import Layout from '../Layout';

/**
 * 리소스 정보 기본 인터페이스
 * 모든 리소스는 최소한 id와 name을 가져야 함
 */
export interface ResourceInfo {
  id: string;
  name: string;
}

/**
 * InfoContainer에 표시할 정보 아이템
 */
export interface InfoItem {
  /** InfoContainer에 표시할 라벨 */
  label: string;
  /** 표시할 값 목록 */
  values: string[];
  /** InfoContainer 배경색 타입 (기본: 'gray') */
  variant?: 'gray' | 'blue';
  /** 값을 bullet list로 표시할지 여부 (기본: false) */
  showBullets?: boolean;
}

/**
 * InlineMessage에 표시할 컨텐츠
 */
export interface ContentConfig {
  /** 메시지 타입 (기본: 'error') */
  type?: InlineMessageType;
  /** 메시지 내용 */
  message: string;
}

/**
 * 리소스 액션 모달 Props
 */
export interface ResourceActionModalProps extends ActionModalProps {
  /** InlineMessage에 표시할 컨텐츠 (기본: null) */
  content?: ContentConfig | null;
  /** InfoContainer에 표시할 정보 목록 */
  infoItems?: InfoItem[];
  /** 추가 컨텐츠 (children) */
  children?: ReactNode;
  /** InfoContainer 사이에 구분자 표시 여부 */
  showSeparator?: boolean;
}

/**
 * 리소스 액션 모달 컴포넌트
 *
 * ActionModal을 기반으로 리소스 관련 액션을 처리하는 모달입니다.
 * - InfoContainer로 리소스 정보 표시 (단일/다중 지원)
 * - InlineMessage로 메시지 표시 (content prop이 있을 때만)
 *
 */
const ResourceActionModal = ({
  actionConfig,
  content = null,
  infoItems = [],
  onAction,
  children,
  showSeparator = false,
  ...props
}: ResourceActionModalProps): ReactElement => {
  const getInfoContainerClassName = (variant?: 'gray' | 'blue'): string => {
    if (variant === 'blue') {
      return 'bg-info-weak-bg';
    }
    return 'bg-surface-muted';
  };

  return (
    <ActionModal {...props} actionConfig={actionConfig} onAction={onAction}>
      <Layout.VStack gap="sm">
        {infoItems.length > 0 && (
          <Layout.VStack gap="sm" align="center">
            {infoItems.map((item, index) => {
              const isLast = index === infoItems.length - 1;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-sm w-full"
                >
                  <InfoContainer
                    label={item.label}
                    values={item.values}
                    showBullets={item.showBullets}
                    className={getInfoContainerClassName(item.variant)}
                  />
                  {showSeparator && !isLast && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              );
            })}
          </Layout.VStack>
        )}
        {children}
        {content && (
          <InlineMessage
            type={content.type ?? 'error'}
            message={content.message}
          />
        )}
      </Layout.VStack>
    </ActionModal>
  );
};

export default ResourceActionModal;
