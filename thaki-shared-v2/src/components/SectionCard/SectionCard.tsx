import React, {
  type ReactNode,
  type HTMLAttributes,
  Children,
  isValidElement,
  Fragment,
} from 'react';
import { cn } from '../../services';
import { Skeleton } from '../Skeleton';
import { Typography } from '../Typography';
import { Link } from 'react-router-dom';
import {
  sectionCardStyles,
  headerWrapperStyles,
  headerRowStyles,
  headerTitleStyles,
  headerDescriptionStyles,
  contentStyles,
  dataRowDividerStyles,
  dataRowStyles,
  dataRowLabelStyles,
  dataRowValueStyles,
  dataRowValueTextStyles,
  fieldsApiContentStyles,
  fieldsDlStyles,
  fieldsRowStyles,
  fieldsLabelStyles,
  fieldsValueStyles,
} from './SectionCard.styles';

/* ----------------------------------------
   Compound API — SectionCard.Header
   ---------------------------------------- */

export interface SectionCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  actions?: ReactNode;
  showDivider?: boolean;
  statusIcon?: ReactNode;
  description?: string;
}

function SectionCardHeader({
  title,
  actions,
  showDivider = true,
  statusIcon,
  description,
  className,
  ...props
}: SectionCardHeaderProps) {
  return (
    <div className={cn(headerWrapperStyles({ showDivider }), className)} {...props}>
      <div className={headerRowStyles}>
        <div className="flex items-center gap-2">
          {statusIcon}
          <h5 className={headerTitleStyles}>{title}</h5>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {description && <span className={headerDescriptionStyles}>{description}</span>}
    </div>
  );
}

/* ----------------------------------------
   Compound API — SectionCard.Content
   ---------------------------------------- */

export interface SectionCardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  showDividers?: boolean;
  gap?: number;
}

function SectionCardContent({
  children,
  className,
  showDividers = true,
  gap,
  ...props
}: SectionCardContentProps) {
  const childArray = Children.toArray(children).filter(isValidElement);

  if (!showDividers) {
    return (
      <div
        className={cn('flex flex-col w-full', gap !== undefined ? '' : 'gap-0', className)}
        style={gap !== undefined ? { gap: `${gap * 4}px` } : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(contentStyles({ showDividers: true }), className)}
      style={gap !== undefined ? { gap: `${gap * 4}px` } : undefined}
      {...props}
    >
      {childArray.map((child, index) => (
        <Fragment key={index}>
          {index > 0 && <div className={dataRowDividerStyles} />}
          {child}
        </Fragment>
      ))}
    </div>
  );
}

/* ----------------------------------------
   Compound API — SectionCard.DataRow
   ---------------------------------------- */

export interface SectionCardDataRowProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value?: string;
  children?: ReactNode;
  isLink?: boolean;
  linkHref?: string;
}

function SectionCardDataRow({
  label,
  value,
  children,
  isLink = false,
  linkHref,
  className,
  ...props
}: SectionCardDataRowProps) {
  const renderValue = () => {
    if (children) {
      return <div className={dataRowValueStyles}>{children}</div>;
    }
    if (isLink) {
      return (
        <Link
          to={linkHref || '#'}
          className="text-12 leading-18 font-medium text-primary hover:underline no-underline"
        >
          {value}
        </Link>
      );
    }
    return <span className={dataRowValueStyles}>{value}</span>;
  };

  return (
    <div className={cn(dataRowStyles, className)} {...props}>
      <span className={dataRowLabelStyles}>{label}</span>
      {renderValue()}
    </div>
  );
}

/* ----------------------------------------
   Flat fields API types (backward compat)
   ---------------------------------------- */

export type SectionCardValueType = 'text' | 'component';

export interface SectionCardField {
  label: string;
  value: string | number | null | undefined | React.ReactNode;
  type?: SectionCardValueType;
  component?: React.ReactNode;
}

export type SectionCardTextProps = React.ComponentProps<typeof Typography.Text>;

export const SectionCardText = ({
  className,
  ...props
}: SectionCardTextProps): React.ReactElement => (
  <Typography.Text className={cn(dataRowValueTextStyles, className)} {...props} />
);

/* ----------------------------------------
   Main SectionCard component
   Supports both compound API (children) and flat fields API
   ---------------------------------------- */

export interface SectionCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  isActive?: boolean;
  /** Flat API: card title */
  title?: string;
  /** Flat API: field list */
  fields?: SectionCardField[];
  /** Flat API: header actions */
  actions?: ReactNode;
  /** Flat API: visibility toggle */
  visible?: boolean;
  /** Flat API: loading skeleton */
  isLoading?: boolean;
}

const SectionCard: React.FC<SectionCardProps> & {
  Header: typeof SectionCardHeader;
  Content: typeof SectionCardContent;
  DataRow: typeof SectionCardDataRow;
} = ({
  children,
  isActive = false,
  title,
  fields,
  actions,
  visible = true,
  isLoading = false,
  className,
  ...props
}) => {
  if (!visible) return null;

  if (fields) {
    return renderFieldsApi({ title, fields, actions, isActive, isLoading, className, ...props });
  }

  return (
    <div className={cn(sectionCardStyles({ isActive }), className)} {...props}>
      {children}
    </div>
  );
};

function renderFieldsApi({
  title,
  fields,
  actions,
  isActive,
  isLoading,
  className,
  ...props
}: {
  title?: string;
  fields: SectionCardField[];
  actions?: ReactNode;
  isActive?: boolean;
  isLoading?: boolean;
  className?: string;
}) {
  if (isLoading) {
    if (title) {
      return (
        <div className={cn(sectionCardStyles({ isActive }), className)} {...props}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            {actions && <Skeleton className="h-8 w-20" />}
          </div>
          <div className={cn(fieldsApiContentStyles({ insideCard: true }))}>
            <dl className={fieldsDlStyles}>
              {fields.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    fieldsRowStyles({
                      isFirst: Boolean(title) && index === 0,
                      hasTopBorder: index > 0,
                      isLast: index === fields.length - 1,
                      topAlign: false,
                    })
                  )}
                >
                  <dt className={fieldsLabelStyles}>
                    <Skeleton className="h-4 w-24" />
                  </dt>
                  <dd className={fieldsValueStyles}>
                    <Skeleton className="h-4 w-40" />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      );
    }
    return (
      <div className={cn(fieldsApiContentStyles({ standalone: true }), className)} {...props}>
        <dl className={fieldsDlStyles}>
          {fields.map((_, index) => (
            <div
              key={index}
              className={cn(
                fieldsRowStyles({
                  isFirst: false,
                  hasTopBorder: index > 0,
                  isLast: index === fields.length - 1,
                  topAlign: false,
                })
              )}
            >
              <dt className={fieldsLabelStyles}>
                <Skeleton className="h-4 w-24" />
              </dt>
              <dd className={fieldsValueStyles}>
                <Skeleton className="h-4 w-40" />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  const formatValue = (field: SectionCardField): React.ReactNode => {
    if (React.isValidElement(field.value) && typeof field.value !== 'function') {
      return React.cloneElement(field.value as React.ReactElement);
    }
    if (field.value === null || field.value === undefined || field.value === '') return '-';
    return field.value.toString();
  };

  const renderTextValue = (value: React.ReactNode): React.ReactNode => (
    <Typography.Text className={dataRowValueTextStyles}>{value}</Typography.Text>
  );

  const renderFieldValue = (field: SectionCardField): React.ReactNode => {
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
    <dl className={fieldsDlStyles}>
      {fields.map((field, index) => (
        <div
          key={index}
          className={cn(
            fieldsRowStyles({
              isFirst: Boolean(title) && index === 0,
              hasTopBorder: index > 0,
              isLast: index === fields.length - 1,
              topAlign: field.type === 'component',
            })
          )}
        >
          <dt className={fieldsLabelStyles}>{field.label}</dt>
          <dd className={fieldsValueStyles}>{renderFieldValue(field)}</dd>
        </div>
      ))}
    </dl>
  );

  if (!title) {
    return (
      <div className={cn(fieldsApiContentStyles({ standalone: true }), className)} {...props}>
        {renderFields()}
      </div>
    );
  }

  return (
    <div className={cn(sectionCardStyles({ isActive }), className)} {...props}>
      <div className="flex items-center justify-between">
        <h5 className={headerTitleStyles}>{title}</h5>
        {actions}
      </div>
      <div className={cn(fieldsApiContentStyles({ insideCard: true }))}>{renderFields()}</div>
    </div>
  );
}

SectionCard.Header = SectionCardHeader;
SectionCard.Content = SectionCardContent;
SectionCard.DataRow = SectionCardDataRow;

export default SectionCard;
export { SectionCardHeader, SectionCardContent, SectionCardDataRow };
