import { type ReactElement, type ReactNode, useMemo } from 'react';
import type { OverlayProps } from '../Overlay';
import { ResourceActionModal, type InfoItem } from '../ResourceActionModal';
import { Typography } from '../Typography';

export interface DeleteResourceTarget {
  id: string;
  name?: string | null;
}

export interface DeleteResourceModalLabels {
  titleSingle?: string;
  titleBulk?: string;
  descriptionSingle?: string;
  descriptionBulk?: string;
  warningSingle?: string;
  warningBulk?: string;
  errorFailed?: string;
  listLabel?: string;
  singleLabel?: string;
  actionButtonText?: string;
  cancelButtonText?: string;
  deletingText?: string;
}

export interface DeleteResourceModalProps extends Omit<OverlayProps, 'children'> {
  targets: DeleteResourceTarget[];
  /** Force bulk view even for single item */
  forceBulk?: boolean;
  infoItems?: InfoItem[];
  content?: { type: 'error' | 'warning'; message: string } | null;
  confirmDisabled?: boolean;
  isLoading?: boolean;
  errorMessage?: string | null;
  labels?: DeleteResourceModalLabels;
  children?: ReactNode;
  onAction?: () => void | Promise<void>;
}

const DEFAULT_ACTION_TEXT = 'Delete';
const DEFAULT_CANCEL_TEXT = 'Cancel';
const DEFAULT_SINGLE_TITLE = 'Delete item';
const DEFAULT_BULK_TITLE = 'Delete items';
const DEFAULT_SINGLE_LABEL = 'Item';
const DEFAULT_BULK_LABEL = 'Items';

const DeleteResourceModal = ({
  targets,
  forceBulk = false,
  infoItems: infoItemsOverride,
  content,
  confirmDisabled,
  isLoading,
  errorMessage,
  labels,
  children,
  onAction,
  ...rest
}: DeleteResourceModalProps): ReactElement => {
  const showBulkView = forceBulk || targets.length > 1;

  const infoItems: InfoItem[] = useMemo(() => {
    if (infoItemsOverride) {
      return infoItemsOverride;
    }
    if (!targets.length) {
      return [];
    }

    const listLabel = labels?.listLabel ?? DEFAULT_BULK_LABEL;
    const singleLabel = labels?.singleLabel ?? DEFAULT_SINGLE_LABEL;

    if (showBulkView) {
      return [
        {
          label: listLabel,
          values: targets.map((target) => target.name || target.id),
          showBullets: true,
        },
      ];
    }
    return [
      {
        label: singleLabel,
        values: [targets[0]?.name || targets[0]?.id || '-'],
      },
    ];
  }, [infoItemsOverride, labels?.listLabel, labels?.singleLabel, showBulkView, targets]);

  const resolvedContent =
    content === undefined
      ? (() => {
          const message = showBulkView ? labels?.warningBulk : labels?.warningSingle;
          if (!message) {
            return null;
          }
          return { type: 'error' as const, message };
        })()
      : content;

  return (
    <ResourceActionModal
      {...rest}
      actionConfig={{
        title: showBulkView
          ? (labels?.titleBulk ?? DEFAULT_BULK_TITLE)
          : (labels?.titleSingle ?? DEFAULT_SINGLE_TITLE),
        subtitle: showBulkView ? labels?.descriptionBulk : labels?.descriptionSingle,
        actionButtonText: labels?.actionButtonText ?? DEFAULT_ACTION_TEXT,
        actionButtonVariant: 'error',
        cancelButtonText: labels?.cancelButtonText ?? DEFAULT_CANCEL_TEXT,
      }}
      content={resolvedContent}
      infoItems={infoItems}
      isLoading={isLoading}
      loadingText={labels?.deletingText}
      confirmDisabled={confirmDisabled}
      onAction={onAction}
    >
      {children}
      {errorMessage ? <Typography.Text color="error">{errorMessage}</Typography.Text> : null}
    </ResourceActionModal>
  );
};

export default DeleteResourceModal;
