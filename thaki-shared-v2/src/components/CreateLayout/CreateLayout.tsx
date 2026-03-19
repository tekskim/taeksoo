import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../services/utils/cn';
import { Typography } from '../Typography';
import {
  createLayoutContainerStyles,
  createLayoutInnerStyles,
  createLayoutHeaderStyles,
  createLayoutContentStyles,
  createLayoutMainStyles,
  createLayoutSidebarStyles,
  createLayoutSidebarInnerStyles,
} from './CreateLayout.styles';

/**
 * CreateLayout 공통 Props
 */
interface CreateLayoutBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * 메인 콘텐츠 영역 (좌측)
   */
  children: ReactNode;
  /**
   * FloatingCard 영역 (우측, 스크롤 시 고정)
   */
  sidebar?: ReactNode;
  /**
   * 사이드바 너비
   * @default 'md'
   */
  sidebarWidth?: 'sm' | 'md' | 'lg';
  /**
   * 콘텐츠 최소 너비
   * @default 'lg'
   */
  minWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  /**
   * 콘텐츠 영역 간격
   * @default 3 (12px)
   */
  contentGap?: 'sm' | 'md' | 'lg';
}

/**
 * 커스텀 헤더를 사용하는 경우
 */
interface CreateLayoutWithCustomHeader extends CreateLayoutBaseProps {
  /**
   * 커스텀 헤더 컴포넌트 (전체 교체)
   * 탭 네비게이션 등 복잡한 헤더 구조가 필요할 때 사용합니다.
   *
   * @example
   * ```tsx
   * <CreateLayout
   *   header={
   *     <>
   *       <Typography.Title level={5}>Create Template</Typography.Title>
   *       <UnderlineTab items={tabItems} activeKey={activeTab} />
   *     </>
   *   }
   * >
   *   ...
   * </CreateLayout>
   * ```
   */
  header: ReactNode;
  title?: never;
  headerActions?: never;
}

/**
 * 기본 헤더 (title + headerActions)를 사용하는 경우
 */
interface CreateLayoutWithDefaultHeader extends CreateLayoutBaseProps {
  header?: never;
  /**
   * 페이지 타이틀
   */
  title?: ReactNode;
  /**
   * 타이틀 우측에 표시할 액션 버튼 등
   */
  headerActions?: ReactNode;
}

/**
 * CreateLayout Props
 * header와 title/headerActions는 함께 사용할 수 없습니다.
 */
export type CreateLayoutProps =
  | CreateLayoutWithCustomHeader
  | CreateLayoutWithDefaultHeader;

/**
 * [Design System] CreateLayout 컴포넌트
 *
 * 리소스 생성 페이지를 위한 레이아웃 컴포넌트입니다.
 * 좌측에 메인 콘텐츠, 우측에 FloatingCard(Summary/Quota)를 배치합니다.
 * 스크롤 시 FloatingCard는 상단에 고정됩니다.
 *
 * @example 기본 사용법 (title + headerActions)
 * ```tsx
 * <CreateLayout
 *   title="Create Instance"
 *   headerActions={<Button>Save Draft</Button>}
 *   sidebar={<FloatingCard sections={sections} quotas={quotas} />}
 * >
 *   <VStack gap="md">
 *     <FormSection title="Basic Information">
 *       ...
 *     </FormSection>
 *   </VStack>
 * </CreateLayout>
 * ```
 *
 * @example 커스텀 헤더 (탭 네비게이션 등)
 * ```tsx
 * <CreateLayout
 *   header={
 *     <VStack gap="md">
 *       <Typography.Title level={5}>Create Template</Typography.Title>
 *       <UnderlineTab items={tabItems} activeKey={activeTab} onChange={setActiveTab} />
 *     </VStack>
 *   }
 *   sidebar={<FloatingCard sections={sections} />}
 * >
 *   {activeTab === 'config' ? <ConfigTab /> : <PublishTab />}
 * </CreateLayout>
 * ```
 */
const CreateLayout = forwardRef<HTMLDivElement, CreateLayoutProps>(
  (
    {
      header,
      title,
      headerActions,
      children,
      sidebar,
      sidebarWidth = 'md',
      minWidth = 'lg',
      contentGap: _contentGap = 'md',
      className,
      ...props
    },
    ref
  ): React.ReactElement => {
    const renderHeader = (): React.ReactNode => {
      // 커스텀 헤더가 제공된 경우
      if (header) {
        return <header className={createLayoutHeaderStyles()}>{header}</header>;
      }

      // 기본 헤더 (title, headerActions)
      if (title || headerActions) {
        return (
          <header
            className={cn(
              createLayoutHeaderStyles(),
              'flex items-center justify-between'
            )}
          >
            {typeof title === 'string' ? (
              <Typography.Title level={4} className="font-semibold">
                {title}
              </Typography.Title>
            ) : (
              title
            )}
            {headerActions}
          </header>
        );
      }

      return null;
    };

    return (
      <div
        ref={ref}
        className={cn(createLayoutContainerStyles(), className)}
        {...props}
      >
        <div className={createLayoutInnerStyles({ minWidth })}>
          {/* Header */}
          {renderHeader()}

          {/* Content Area - flex container for sticky to work */}
          <div className={createLayoutContentStyles()}>
            {/* Main Content (Left) */}
            <main className={createLayoutMainStyles()}>{children}</main>

            {/* Sidebar / FloatingCard (Right) - sticky */}
            {sidebar ? (
              <aside
                className={createLayoutSidebarStyles({ width: sidebarWidth })}
              >
                <div className={createLayoutSidebarInnerStyles()}>
                  {sidebar}
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

CreateLayout.displayName = 'CreateLayout';

export default CreateLayout;
