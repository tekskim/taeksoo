import type { ReactNode } from 'react';
import { IconX } from '@tabler/icons-react';
import { VStack } from '../../layouts';
import { Button } from '../Button';

export interface FileItem {
  id: string;
  name: string;
  /** Secondary info tokens separated by dividers (e.g. ["2.5 MB", "10 files"]) */
  tags?: string[];
  /** Simple description text, used when tags is not provided */
  description?: string;
}

export interface FileListCardProps {
  files: FileItem[];
  onRemove?: (id: string) => void;
  emptyMessage?: string;
  className?: string;
}

function TagDivider() {
  return <div className="w-px h-[10px] bg-[var(--color-border-default)]" />;
}

export function FileListCard({
  files,
  onRemove,
  emptyMessage = 'No files',
  className = '',
}: FileListCardProps) {
  if (files.length === 0) {
    return emptyMessage ? (
      <p className="text-body-sm text-[var(--color-text-subtle)]">{emptyMessage}</p>
    ) : null;
  }

  return (
    <div
      className={`bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-[var(--primitive-spacing-3)] flex flex-col gap-[var(--primitive-spacing-2)] ${className}`}
    >
      {files.map((file) => (
        <div
          key={file.id}
          className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] px-4 py-2 flex items-center justify-between"
        >
          <VStack gap={1}>
            <span className="text-body-md text-[var(--color-text-default)]">{file.name}</span>
            {file.tags && file.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {file.tags.map((tag, i) => (
                  <span key={tag} className="contents">
                    {i > 0 && <TagDivider />}
                    <span className="text-body-sm text-[var(--color-text-subtle)]">{tag}</span>
                  </span>
                ))}
              </div>
            )}
            {!file.tags && file.description && (
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                {file.description}
              </span>
            )}
          </VStack>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(file.id)}
              className="shrink-0 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors"
            >
              <IconX size={16} stroke={1.5} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export interface FileListSectionProps {
  label?: string;
  required?: boolean;
  files: FileItem[];
  onRemove?: (id: string) => void;
  onUpload?: () => void;
  uploadLabel?: string;
  uploadIcon?: ReactNode;
  error?: string | null;
  emptyMessage?: string;
  className?: string;
}

export function FileListSection({
  label = 'Upload Files',
  required,
  files,
  onRemove,
  onUpload,
  uploadLabel = 'Upload a File',
  uploadIcon,
  error,
  emptyMessage,
  className = '',
}: FileListSectionProps) {
  return (
    <VStack gap={3} className={`w-full ${className}`}>
      {label && (
        <label className="text-label-lg text-[var(--color-text-default)]">
          {label}
          {required && <span className="ml-1 text-[var(--color-state-danger)]">*</span>}
        </label>
      )}
      {onUpload && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onUpload}
          className="w-fit"
          leftIcon={uploadIcon}
        >
          {uploadLabel}
        </Button>
      )}
      {error && <span className="text-body-sm text-[var(--color-state-danger)]">{error}</span>}
      <FileListCard files={files} onRemove={onRemove} emptyMessage={emptyMessage} />
    </VStack>
  );
}
