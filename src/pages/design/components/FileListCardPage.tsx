import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { FileListCard, FileListSection, VStack } from '@/design-system';
import type { FileItem } from '@/design-system';
import { IconUpload } from '@tabler/icons-react';

const fileListCardProps: PropDef[] = [
  { name: 'files', type: 'FileItem[]', required: true, description: '표시할 파일 목록' },
  {
    name: 'onRemove',
    type: '(id: string) => void',
    required: false,
    description: '파일 제거 콜백. 미제공 시 X 버튼이 숨겨짐',
  },
  {
    name: 'emptyMessage',
    type: 'string',
    default: "'No files'",
    required: false,
    description: '파일 없을 때 표시 메시지',
  },
  { name: 'className', type: 'string', required: false, description: '추가 CSS 클래스' },
];

const fileListSectionProps: PropDef[] = [
  {
    name: 'label',
    type: 'string',
    default: "'Upload Files'",
    required: false,
    description: '섹션 레이블',
  },
  { name: 'required', type: 'boolean', required: false, description: '필수 필드 표시 (*)' },
  { name: 'files', type: 'FileItem[]', required: true, description: '표시할 파일 목록' },
  {
    name: 'onRemove',
    type: '(id: string) => void',
    required: false,
    description: '파일 제거 콜백',
  },
  {
    name: 'onUpload',
    type: '() => void',
    required: false,
    description: '업로드 버튼 클릭 콜백. 미제공 시 버튼이 숨겨짐',
  },
  {
    name: 'uploadLabel',
    type: 'string',
    default: "'Choose file'",
    required: false,
    description: '업로드 버튼 텍스트',
  },
  { name: 'uploadIcon', type: 'ReactNode', required: false, description: '업로드 버튼 아이콘' },
  { name: 'error', type: 'string | null', required: false, description: '에러 메시지' },
  {
    name: 'emptyMessage',
    type: 'string',
    required: false,
    description: '파일 없을 때 표시 메시지',
  },
  { name: 'className', type: 'string', required: false, description: '추가 CSS 클래스' },
];

const fileItemProps: PropDef[] = [
  { name: 'id', type: 'string', required: true, description: '고유 식별자' },
  { name: 'name', type: 'string', required: true, description: '파일 이름' },
  {
    name: 'tags',
    type: 'string[]',
    required: false,
    description: '파일 하위 정보 (divider로 구분되어 표시)',
  },
  {
    name: 'description',
    type: 'string',
    required: false,
    description: '단순 설명 텍스트 (tags 미사용 시)',
  },
];

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
      usage={{
        code: `import { FileListCard, FileListSection } from '@/design-system';
import type { FileItem } from '@/design-system';

// FileListCard — 파일 목록만 표시
<FileListCard
  files={files}
  onRemove={(id) => handleRemove(id)}
/>

// FileListSection — 레이블 + 업로드 버튼 + 파일 목록
<FileListSection
  label="Upload Files"
  required
  files={files}
  onRemove={handleRemove}
  onUpload={handleUpload}
  uploadIcon={<IconUpload size={12} />}
  error={error}
/>`,
      }}
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
      apiReference={fileListCardProps}
      subComponentApis={[
        { title: 'FileListSection', props: fileListSectionProps },
        { title: 'FileItem', props: fileItemProps },
      ]}
      accessibility={
        <p className="text-body-md text-[var(--color-text-muted)]">
          Remove 버튼은 button 요소로 마크업되어 키보드로 접근 가능합니다. 각 파일 행은 의미있는
          텍스트를 포함하여 스크린 리더에서 인식됩니다.
        </p>
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
