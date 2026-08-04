import { useState, useMemo, useEffect } from 'react';
import {
  Drawer,
  VStack,
  HStack,
  SearchInput,
  Select,
  Button,
  Badge,
  InlineMessage,
} from '@/design-system';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { IconCheck } from '@tabler/icons-react';
import {
  containerImagesData,
  severityTheme,
  REGISTRIES,
  DEFAULT_REGISTRY_HOST,
  getRegistry,
  imageReferenceByTag,
  imageReferenceByDigest,
  type ContainerImageRow,
} from '@/pages/containerImagesData';

/* ----------------------------------------
   이미지 선택 드로어.

   쿠버네티스에는 이미지 목록 API가 없다. 그래서 이 목록은 클러스터가 아니라
   레지스트리에서 온다(자세한 것은 containerImagesData.ts 주석).

   설계상 중요한 지점 — 이미지를 고르는 것만으로는 배포가 안 된다.
   사설 레지스트리라면 대상 네임스페이스에 pull secret이 있어야 하고, 없으면
   Pod이 ImagePullBackOff로 뜨지 않는다. 그래서 이 드로어는 이미지 주소와
   함께 필요한 pull secret을 같이 돌려준다. 고르기와 인증 정보 주입은 한 세트다.
   ---------------------------------------- */

export interface ImagePickerResult {
  /** 폼의 Container Image 필드에 넣을 주소 */
  reference: string;
  /** 함께 채워야 할 pull secret 이름. 공용 레지스트리면 undefined */
  pullSecret?: string;
  registryHost: string;
}

export interface ImagePickerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: ImagePickerResult) => void;
  /** 이미 폼에 들어 있는 주소 (다시 열었을 때 표시용) */
  currentReference?: string;
}

type PinBy = 'tag' | 'digest';

export function ImagePickerDrawer({
  isOpen,
  onClose,
  onSelect,
  currentReference,
}: ImagePickerDrawerProps) {
  const [registryHost, setRegistryHost] = useState(DEFAULT_REGISTRY_HOST);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pinBy, setPinBy] = useState<PinBy>('tag');

  // 드로어를 닫았다 열면 선택 상태를 초기화한다.
  useEffect(() => {
    if (!isOpen) {
      setSelectedId(null);
      setSearchQuery('');
    }
  }, [isOpen]);

  const registry = getRegistry(registryHost);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return containerImagesData;
    return containerImagesData.filter(
      (img) =>
        img.repository.toLowerCase().includes(q) ||
        img.tag.toLowerCase().includes(q) ||
        img.project.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const selected = filtered.find((img) => img.id === selectedId) ?? null;

  const previewReference = selected
    ? pinBy === 'digest'
      ? imageReferenceByDigest(selected, registryHost)
      : imageReferenceByTag(selected, registryHost)
    : '';

  const handleConfirm = () => {
    if (!selected) return;
    onSelect({
      reference: previewReference,
      pullSecret: registry.isPrivate ? registry.pullSecret : undefined,
      registryHost,
    });
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Select container image"
      description="Images are listed from the connected registry, not from the cluster."
      width={720}
      footer={
        <VStack gap={3} className="w-full">
          {selected && (
            <VStack gap={1} className="w-full">
              <span className="text-label-sm text-[var(--color-text-subtle)]">Image reference</span>
              <span className="text-body-sm font-mono break-all text-[var(--color-text-default)]">
                {previewReference}
              </span>
              {registry.isPrivate && registry.pullSecret && (
                <span className="text-body-sm text-[var(--color-text-subtle)]">
                  Pull secret <strong>{registry.pullSecret}</strong> will be filled in as well —
                  without it the pod fails with ImagePullBackOff.
                </span>
              )}
            </VStack>
          )}
          <HStack gap={2} justify="end" className="w-full">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" disabled={!selected} onClick={handleConfirm}>
              Use this image
            </Button>
          </HStack>
        </VStack>
      }
    >
      <VStack gap={5}>
        <HStack gap={2} align="center" className="w-full">
          <Select
            value={registryHost}
            onChange={setRegistryHost}
            options={REGISTRIES.map((r) => ({ value: r.host, label: r.label }))}
            width="lg"
          />
          <SearchInput
            placeholder="Search by repository, tag, or project"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            fullWidth
          />
        </HStack>

        {currentReference && (
          <InlineMessage variant="info">
            Current value: <span className="font-mono">{currentReference}</span>
          </InlineMessage>
        )}

        <VStack gap={2}>
          <span className="text-label-sm text-[var(--color-text-subtle)]">
            {filtered.length} image(s)
          </span>
          <OverlayScrollbarsComponent
            defer
            options={{ scrollbars: { autoHide: 'leave' } }}
            style={{ maxHeight: 420 }}
          >
            <VStack gap={2}>
              {filtered.map((img) => (
                <ImageRow
                  key={img.id}
                  image={img}
                  selected={img.id === selectedId}
                  onClick={() => setSelectedId(img.id)}
                />
              ))}
              {filtered.length === 0 && (
                <span className="text-body-md text-[var(--color-text-subtle)] py-6 text-center">
                  No images match this search.
                </span>
              )}
            </VStack>
          </OverlayScrollbarsComponent>
        </VStack>

        {/* 태그는 나중에 다른 이미지를 가리키도록 바뀔 수 있다.
            운영 배포에서 버전을 고정하려면 다이제스트를 쓴다. */}
        <VStack gap={2}>
          <span className="text-label-lg text-[var(--color-text-default)]">Pin the image by</span>
          <Select
            value={pinBy}
            onChange={(val) => setPinBy(val as PinBy)}
            options={[
              { value: 'tag', label: 'Tag — readable, but its content can change later' },
              { value: 'digest', label: 'Digest — always the exact same image' },
            ]}
            fullWidth
          />
        </VStack>
      </VStack>
    </Drawer>
  );
}

/* ----------------------------------------
   Row
   ---------------------------------------- */

function ImageRow({
  image,
  selected,
  onClick,
}: {
  image: ContainerImageRow;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full text-left rounded-lg border px-4 py-3 transition-colors',
        selected
          ? 'border-[var(--color-border-brand)] bg-[var(--color-surface-brand-subtle)]'
          : 'border-[var(--color-border-default)] hover:bg-[var(--color-surface-muted)]',
      ].join(' ')}
    >
      <HStack justify="between" align="center" gap={3}>
        <VStack gap={1} className="min-w-0">
          <HStack gap={2} align="center" className="min-w-0">
            {selected && (
              <IconCheck size={14} stroke={2} className="text-[var(--color-text-brand)] shrink-0" />
            )}
            <span className="text-label-lg text-[var(--color-text-default)] truncate">
              {image.repository}:{image.tag}
            </span>
          </HStack>
          <span className="text-body-sm text-[var(--color-text-subtle)] truncate">
            {image.project} · {image.size} · pushed{' '}
            {image.pushedAt.replace(/\s+\d{2}:\d{2}:\d{2}$/, '')}
          </span>
        </VStack>
        <HStack gap={2} align="center" className="shrink-0">
          <Badge theme={severityTheme[image.severity]} type="subtle" size="sm">
            {image.severity === 'None' ? 'No known issues' : `${image.severity} ${image.vulnCount}`}
          </Badge>
          <Badge theme={image.signed ? 'green' : 'gray'} type="subtle" size="sm">
            {image.signed ? 'Signed' : 'Unsigned'}
          </Badge>
        </HStack>
      </HStack>
    </button>
  );
}

export default ImagePickerDrawer;
