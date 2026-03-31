import { ReactElement, ReactNode } from 'react';
import { cn } from '../../services/utils/cn';
import Layout from '../Layout';

export interface EmptyUIContent {
  title: string;
  description?: string;
}

export interface EmptyUIProps {
  /** 콘텐츠 (제목 및 설명) */
  content: EmptyUIContent;
  /** 커스텀 className */
  className?: string;
  /** 액션 버튼 등 추가 컨텐츠 */
  children?: ReactNode;
}

/**
 * 테이블/목록 Empty UI 컴포넌트
 *
 * 데이터가 없을 때 표시되는 빈 상태 UI입니다.
 *
 * @example
 * ```tsx
 * // 인스턴스가 없을 때
 * <EmptyUI
 *   content={{
 *     title: "No instances found",
 *     description: "Create an instance to start using compute resources."
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // 필터 결과가 없을 때
 * <EmptyUI
 *   content={{
 *     title: "No Result",
 *     description: "No instances match your current filters."
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // 액션 버튼 포함
 * <EmptyUI
 *   content={{
 *     title: "No objects found",
 *     description: "Upload objects to start using storage."
 *   }}
 * >
 *   <Button variant="primary" onClick={handleUpload}>
 *     Upload Object
 *   </Button>
 * </EmptyUI>
 * ```
 */
export const EmptyUI = ({ content, className, children }: EmptyUIProps): ReactElement => {
  return (
    <Layout.VStack
      align="center"
      className={cn(
        'w-full h-full box-border flex flex-col items-center justify-center bg-surface py-10 gap-3',
        className
      )}
    >
      {/* 텍스트 영역 - gap 5px = gap-1 (4px) */}
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-medium leading-5 text-text">{content.title}</p>
        {content.description && (
          <p className="text-xs leading-4 text-text-muted">{content.description}</p>
        )}
      </div>
      {children}
    </Layout.VStack>
  );
};

export default EmptyUI;
