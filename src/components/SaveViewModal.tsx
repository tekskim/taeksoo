/* 저장된 뷰 만들기 모달 (CorePlan D-36 ② · CCONT-11)
   현재 화면의 주소(경로+쿼리)와 클러스터를 이름 붙여 저장한다. 모든 화면에서 열 수 있다. */
import { useState } from 'react';
import { Modal, Input, Button, InlineMessage, VStack } from '@/design-system';
import { addSavedView } from '@/pages/containerSavedViews';

interface SaveViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  path: string;
  search: string;
  clusterId: string;
  clusterName: string;
  screenLabel: string;
}

export function SaveViewModal({
  isOpen,
  onClose,
  path,
  search,
  clusterId,
  clusterName,
  screenLabel,
}: SaveViewModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  const close = () => {
    setName('');
    setError(false);
    onClose();
  };

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const ok = addSavedView({ name: trimmed, path, search, clusterId, clusterName, screenLabel });
    if (!ok) {
      setError(true);
      return;
    }
    close();
  };

  const hasFilters = search.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="Save view"
      description="Save the current filters and sorting as a named view. It appears in the Saved views group on the sidebar."
    >
      <VStack gap={3} className="w-[480px] max-w-full">
        <VStack gap={1}>
          <span className="text-label-md text-[var(--color-text-default)]">Name</span>
          <Input
            value={name}
            autoFocus
            placeholder="e.g. Failed pods in tenant-a"
            onChange={(e) => {
              setName(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save();
            }}
          />
          {error && (
            <span className="text-body-sm text-[var(--color-text-danger)]">
              A view with this name already exists.
            </span>
          )}
        </VStack>

        <VStack gap={1}>
          <span className="text-label-sm text-[var(--color-text-muted)]">What gets saved</span>
          <div className="text-body-sm text-[var(--color-text-muted)] bg-[var(--color-surface-muted)] border border-[var(--color-border-default)] rounded-md px-3 py-2">
            <div>
              Screen: <span className="text-[var(--color-text-default)]">{screenLabel}</span>
            </div>
            <div>
              Cluster: <span className="text-[var(--color-text-default)]">{clusterName}</span>
            </div>
            <div>
              Filters:{' '}
              <span className="text-[var(--color-text-default)]">
                {hasFilters ? decodeURIComponent(search.replace(/^\?/, '')) : 'none'}
              </span>
            </div>
          </div>
        </VStack>

        <InlineMessage variant="info">
          Restoring this view switches to <strong>{clusterName}</strong> and opens the screen with
          the same filters. Views are private to you.
        </InlineMessage>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={save} disabled={!name.trim()}>
            Save view
          </Button>
        </div>
      </VStack>
    </Modal>
  );
}
