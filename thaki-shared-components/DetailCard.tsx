import React from 'react';
import { cn } from '../../services';
import { Skeleton } from '../Skeleton';
import { Typography } from '../Typography';
import {
  detailCardStyles,
  cardHeaderStyles,
  cardTitleStyles,
  cardContentStyles,
  fieldDlStyles,
  fieldRowStyles,
  fieldLabelStyles,
  fieldValueStyles,
  fieldValueTextStyles,
} from './DetailCard.styles';

export type DetailCardValueType = 'text' | 'component';

/**
 * 상세 페이지, 생성 페이지(요약 카드) 전용 컴포넌트
 * 카드 컨텐츠 필드 (라벨-값 쌍)
 * @property {string} label - 필드 라벨
 * @property {string | number | null | undefined} value - 필드 값
 * @property {DetailCardValueType} type - 값 표시 타입
 *   - text: 일반 텍스트
 *   - component: 커스텀 컴포넌트
 * @property {React.ReactNode} component - 커스텀 컴포넌트 (component 타입에서 사용)
 */
export interface DetailCardField {
  label: string;
  value: string | number | null | undefined | React.ReactNode;
  type?: DetailCardValueType;
  component?: React.ReactNode;
}

/**
 * DetailCard 내부에서 사용하는 텍스트 컴포넌트
 * component 타입 필드에서 텍스트를 렌더링할 때 사용합니다.
 *
 * @example
 * component: (
 *   <Layout.VStack gap="sm">
 *     <DetailCardText>{name}</DetailCardText>
 *     <DetailCardText color="secondary">ID: {id}</DetailCardText>
 *   </Layout.VStack>
 * )
 */
export type DetailCardTextProps = React.ComponentProps<typeof Typography.Text>;

export const DetailCardText = ({
  className,
  ...props
}: DetailCardTextProps): React.ReactElement => (
  <Typography.Text className={cn(fieldValueTextStyles, className)} {...props} />
);

/**
 * DetailCard Props
 * @property {string} title - 카드 타이틀 (생략 시 헤더 없이 컨텐츠만 표시)
 * @property {DetailCardField[]} fields - 필드 목록
 * @property {React.ReactNode} actions - 헤더 액션 영역 (커스텀 컴포넌트)
 * @property {boolean} visible - 카드 표시 여부
 * @property {boolean} isLoading - 로딩 상태 (스켈레톤 UI 표시)
 */
export interface DetailCardProps {
  title?: string;
  fields: DetailCardField[];
  actions?: React.ReactNode;
  visible?: boolean;
  isLoading?: boolean;
}

const DetailCard: React.FC<DetailCardProps> = ({
  title,
  fields,
  actions,
  visible = true,
  isLoading = false,
}): React.ReactElement | null => {
  if (!visible) {
    return null;
  }

  // 로딩 상태 렌더링
  if (isLoading) {
    // title이 있는 경우 카드 스타일로 렌더링
    if (title) {
      return (
        <div className={cn(detailCardStyles())}>
          {/* 카드 헤더 스켈레톤 */}
          <div className={cardHeaderStyles}>
            <Skeleton className="h-5 w-32" />
            {actions && <Skeleton className="h-8 w-20" />}
          </div>

          {/* 카드 컨텐츠 스켈레톤 */}
          <div className={cn(cardContentStyles({ insideCard: true }))}>
            <dl className={fieldDlStyles}>
              {fields.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    fieldRowStyles({
                      isFirst: Boolean(title) && index === 0,
                      hasTopBorder: index > 0,
                      isLast: index === fields.length - 1,
                      topAlign: false,
                    })
                  )}
                >
                  <dt className={fieldLabelStyles}>
                    <Skeleton className="h-4 w-24" />
                  </dt>
                  <dd className={fieldValueStyles}>
                    <Skeleton className="h-4 w-40" />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      );
    }

    // title이 없는 경우 컨텐츠만 렌더링
    return (
      <div className={cn(cardContentStyles({ standalone: true }))}>
        <dl className={fieldDlStyles}>
          {fields.map((_, index) => (
            <div
              key={index}
              className={cn(
                fieldRowStyles({
                  isFirst: Boolean(title) && index === 0,
                  hasTopBorder: index > 0,
                  isLast: index === fields.length - 1,
                  topAlign: false,
                })
              )}
            >
              <dt className={fieldLabelStyles}>
                <Skeleton className="h-4 w-24" />
              </dt>
              <dd className={fieldValueStyles}>
                <Skeleton className="h-4 w-40" />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  const formatValue = (field: DetailCardField): React.ReactNode => {
    if (React.isValidElement(field.value) && typeof field.value !== 'function') {
      return React.cloneElement(field.value as React.ReactElement);
    }

    if (field.value === null || field.value === undefined || field.value === '') {
      return '-';
    }
    return field.value.toString();
  };

  const renderTextValue = (value: React.ReactNode): React.ReactNode => (
    <Typography.Text className={fieldValueTextStyles}>{value}</Typography.Text>
  );

  const renderFieldValue = (field: DetailCardField): React.ReactNode => {
    const value = formatValue(field);

    switch (field.type) {
      case 'component':
        return field.component || renderTextValue(value);

      case 'text':
      default:
        return renderTextValue(value);
    }
  };

  const renderFields = (): React.ReactElement => (
    <dl className={fieldDlStyles}>
      {fields.map((field, index) => (
        <div
          key={index}
          className={cn(
            fieldRowStyles({
              isFirst: Boolean(title) && index === 0,
              hasTopBorder: index > 0,
              isLast: index === fields.length - 1,
              topAlign: field.type === 'component',
            })
          )}
        >
          <dt className={fieldLabelStyles}>{field.label}</dt>
          <dd className={fieldValueStyles}>{renderFieldValue(field)}</dd>
        </div>
      ))}
    </dl>
  );

  // title이 없으면 컨텐츠만 렌더링 (카드 스타일 없이)
  if (!title) {
    return <div className={cn(cardContentStyles({ standalone: true }))}>{renderFields()}</div>;
  }

  // title이 있으면 전체 카드 스타일로 렌더링
  return (
    <div className={cn(detailCardStyles())}>
      {/* 카드 헤더 */}
      <div className={cardHeaderStyles}>
        <p className={cardTitleStyles}>{title}</p>
        {actions}
      </div>

      {/* 카드 컨텐츠 */}
      <div className={cn(cardContentStyles({ insideCard: true }))}>{renderFields()}</div>
    </div>
  );
};

export default DetailCard;
