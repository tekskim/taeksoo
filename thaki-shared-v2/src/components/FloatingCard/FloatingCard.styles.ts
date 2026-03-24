export const floatingCardStyles = 'flex flex-col gap-3 w-full';

export const summaryCardStyles =
  'flex items-start gap-1 bg-surface-subtle border border-border rounded-base6 px-4 py-4 min-h-[160px]';

export const summaryContentStyles = 'flex flex-col gap-4 w-full min-w-0';

export const summaryTitleStyles = 'm-0 text-text text-16 font-semibold leading-24';

export const summaryGroupStyles = 'flex flex-col gap-2 w-full';

export const summaryGroupHeaderStyles = 'flex items-center justify-between pr-2';

export const summaryGroupHeaderLeftStyles = 'flex items-center gap-1.5';

export const summaryGroupHeaderButtonStyles =
  'flex min-w-0 flex-1 items-center gap-1.5 border-0 bg-transparent p-0 text-left cursor-pointer';

export const summaryGroupTitleStyles = 'm-0 text-text text-12 font-medium leading-18';

export const summaryListStyles = 'flex flex-col gap-0 w-full';

export const summaryItemStyles = 'flex items-center justify-between px-2 py-1';

export const summaryItemLabelStyles = 'm-0 text-text text-12 font-normal leading-18';

export const summaryStatusIconStyles = 'shrink-0';

export const quotaCardStyles =
  'flex flex-col gap-3 bg-surface border border-border rounded-base6 p-4';

export const quotaTitleStyles = 'm-0 text-text text-12 font-medium leading-18';

export const quotaListStyles = 'flex flex-col gap-3 w-full';

export const quotaItemStyles = 'flex flex-col gap-1.5 w-full';

export const quotaHeaderStyles = 'flex items-center justify-between text-text w-full';

export const quotaLabelStyles = 'm-0 text-12 font-normal leading-18';

export const quotaValueStyles = 'm-0 text-12 font-normal leading-16';

export const quotaBarStyles = 'relative flex h-1 w-full items-center';

export const quotaBarTrackStyles = 'absolute inset-0 rounded-full bg-border-muted';

export const quotaBarSegmentStyles = 'absolute top-0 h-full rounded-full';

export const quotaBarUsedStyles = 'z-20';

export const quotaBarPendingStyles = 'z-10';

// Quota bar color variant classes (threshold logic in shared getPercentageVariant)
export const quotaBarSuccessStyles = 'bg-success';
export const quotaBarSuccessLightStyles = 'bg-success-light';
export const quotaBarWarningStyles = 'bg-warning';
export const quotaBarWarningLightStyles = 'bg-warning-light';
export const quotaBarErrorStyles = 'bg-error';
export const quotaBarErrorLightStyles = 'bg-error-light';

// Footer action buttons — no extra padding (sidebarInner p-4 handles spacing)
export const footerStyles = 'flex flex-row gap-2';
export const footerCancelStyles = '';
export const footerActionStyles = 'flex-1';

// StatusIcon styles
export const statusIconContainerStyles = 'size-4 shrink-0 flex items-center justify-center';
export const statusIconFilledStyles =
  'size-4 shrink-0 rounded-full flex items-center justify-center';
export const statusWritingStyles =
  'm-0 text-11 font-normal leading-16 text-text-subtle whitespace-nowrap';

// Tooltip indicator dot colors
export const tooltipDotSuccessStyles = 'bg-success';
export const tooltipDotSuccessLightStyles = 'bg-success-light';
export const tooltipDotWarningStyles = 'bg-warning';
export const tooltipDotWarningLightStyles = 'bg-warning-light';
export const tooltipDotErrorStyles = 'bg-error';
export const tooltipDotErrorLightStyles = 'bg-error-light';
