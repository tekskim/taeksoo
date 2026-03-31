export const notificationPanelContainerStyles = [
  'fixed top-14 right-4 z-10',
  'flex flex-col gap-2',
  'backdrop-blur-sm',
  'rounded-lg',
  'p-3',
].join(' ');

export const notificationPanelBackgroundStyles = [
  'w-full h-full z-[-1]',
  'bg-text',
  'absolute top-0 right-0',
  'opacity-10',
  'blur-[20px]',
].join(' ');

export const notificationPanelInnerStyles = ['flex flex-col gap-2', 'max-h-[300px]'].join(' ');

export const notificationPanelHeaderStyles = ['flex items-center gap-2', 'mb-2'].join(' ');

export const notificationPanelContentStyles = ['flex flex-col gap-2', 'overflow-y-auto'].join(' ');

export const notificationPanelEmptyStyles = [
  'flex items-center justify-center',
  'py-8 px-4',
  'text-center',
  'bg-surface',
  'rounded-lg border border-border',
].join(' ');

/**
 * Wrapper styles for NotificationItem component.
 * Wraps the Toast component with additional styling for the notification panel context.
 */
export const notificationItemWrapperStyles = ['relative', 'flex flex-col'].join(' ');

/**
 * Timestamp display styles shown below the Toast content.
 */
export const notificationItemTimestampStyles = [
  'text-xs',
  'text-text-muted',
  'mt-1',
  'px-lg',
  'pb-1',
].join(' ');
