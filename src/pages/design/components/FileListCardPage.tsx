import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { FileListCard, FileListSection, VStack } from '@/design-system';
import type { FileItem } from '@/design-system';
import { IconUpload } from '@tabler/icons-react';

const sampleFiles: FileItem[] = [
  { id: '1', name: 'document.pdf', tags: ['2.5 MB', '10 files'] },
  { id: '2', name: 'image.png', tags: ['1.2 MB'] },
  { id: '3', name: 'data.json', tags: ['45 KB'] },
];

function FileListCardPreview() {
  const [files, setFiles] = useState<FileItem[]>(sampleFiles);
  const handleRemove = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className="w-full max-w-[400px]">
      <FileListCard files={files} onRemove={handleRemove} />
    </div>
  );
}

function FileListSectionExample() {
  const [files, setFiles] = useState<FileItem[]>(sampleFiles);
  const handleRemove = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className="w-full max-w-[400px]">
      <FileListSection
        label="Upload Files"
        files={files}
        onRemove={handleRemove}
        onUpload={() => {}}
        uploadIcon={<IconUpload size={12} stroke={1.5} />}
      />
    </div>
  );
}

function ReadOnlyExample() {
  return (
    <div className="w-full max-w-[400px]">
      <FileListCard
        files={[
          { id: '1', name: 'report.xlsx', description: 'Quarterly report' },
          { id: '2', name: 'config.yaml', description: 'Deployment config' },
        ]}
      />
    </div>
  );
}

function ErrorExample() {
  return (
    <div className="w-full max-w-[400px]">
      <FileListSection
        label="Attachments"
        required
        files={[]}
        onUpload={() => {}}
        uploadIcon={<IconUpload size={12} stroke={1.5} />}
        error="At least one file is required"
        emptyMessage=""
      />
    </div>
  );
}

export function FileListCardPage() {
  return (
    <ComponentPageTemplate
      title="FileListCard"
      description="업로드된 파일 목록을 카드 형태로 보여주는 컴포넌트. 파일 이름, 메타 정보, 제거 기능을 제공합니다."
      whenToUse={[
        '파일 목록을 카드 형태로 표시할 때',
        '파일 업로드 결과를 보여줄 때',
        '첨부 파일 목록을 관리할 때',
      ]}
      whenNotToUse={[
        '파일이 아닌 일반 데이터 목록인 경우 → Table 사용',
        '단일 파일 업로드 UI인 경우 → Input type="file" 사용',
      ]}
      preview={
        <ComponentPreview
          code={`import { FileListCard } from '@/design-system';

const files = [
  { id: '1', name: 'document.pdf', tags: ['2.5 MB', '10 files'] },
  { id: '2', name: 'image.png', tags: ['1.2 MB'] },
];

<FileListCard files={files} onRemove={handleRemove} />`}
        >
          <FileListCardPreview />
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>FileListSection (Label + Upload Button + List)</Label>
            <FileListSectionExample />
          </VStack>
          <VStack gap={3}>
            <Label>Read-only (No Remove Button)</Label>
            <ReadOnlyExample />
          </VStack>
          <VStack gap={3}>
            <Label>Error State</Label>
            <ErrorExample />
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={4}>
          <h3 className="text-heading-h4 text-[var(--color-text-default)]">Usage Guidelines</h3>
          <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed">
            <ul className="list-disc pl-5 space-y-1">
              <li>파일 업로드 후 선택된 파일을 미리보기 형태로 보여줄 때 사용합니다.</li>
              <li>
                <strong>FileListCard</strong>: 파일 목록만 표시할 때 사용합니다.
              </li>
              <li>
                <strong>FileListSection</strong>: 레이블, 업로드 버튼, 에러 메시지 등 전체 섹션이
                필요한 경우 사용합니다.
              </li>
              <li>
                <strong>tags</strong>: 파일 크기, 개수 등 메타 정보를 divider로 구분하여 표시합니다.
              </li>
              <li>
                <strong>description</strong>: 간단한 설명만 필요하면 tags 대신 사용합니다.
              </li>
              <li>Drawer 안에서 사용 시 max-width를 지정하지 않아도 부모에 맞춰 늘어납니다.</li>
            </ul>
          </div>
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <span className="font-mono">container: surface-subtle, border, radius-md, p-12</span> ·{' '}
          <span className="font-mono">item: surface-default, border, radius-md, px-16 py-8</span> ·{' '}
          <span className="font-mono">name: body-md</span> ·{' '}
          <span className="font-mono">tag: body-sm, text-subtle</span> ·{' '}
          <span className="font-mono">divider: 1px × 10px, border-default</span>
        </div>
      }
      relatedLinks={[
        {
          label: 'Drawer',
          path: '/design/components/drawer',
          description: '파일 업로드 섹션이 주로 사용되는 Drawer 컴포넌트',
        },
        {
          label: 'FormField',
          path: '/design/patterns/form-field',
          description: '폼 필드 스페이싱 및 레이아웃',
        },
      ]}
    />
  );
}
