import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { Label } from '../../design-system-sections/HelperComponents';
import { FileListCard, FileListSection, ProgressBar, VStack } from '@/design-system';
import type { FileItem } from '@/design-system';
import { IconChevronDown, IconChevronUp, IconUpload, IconX } from '@tabler/icons-react';

const FILE_UPLOAD_GUIDELINES = `## Overview

File Upload는 **파일을 업로드하고, 업로드된 파일 목록을 카드 형태로 관리하는 Form 컴포넌트**다. 업로드 트리거, 파일 목록 표시, 상태 피드백을 하나의 통합 인터페이스로 제공한다.

---

## Composition

| 요소 | 설명 |
| --- | --- |
| ① Upload Trigger | 파일 업로드를 시작하는 버튼 또는 드롭 영역. Label과 함께 사용한다. |
| ② File Type Icon | 파일 확장자(파일 타입)에 대응하는 시각적 아이콘. 표준 TDS 아이콘 세트를 사용한다. 미지정된 파일 타입은 \`IconFile\`을 사용한다. |
| ③ File Name | 파일명(확장자 포함). 키보드 포커스 대상이 되며, 클릭 시 다운로드 또는 파일 콘텍스트에 따라 동작을 정의한다. |
| ④ File Metadata | 파일 크기(예: 2.3 MB), 업로드 날짜 또는 최종 수정일 등 선택적 메타정보 |
| ⑤ Status Indicator (조건부) | 업로드 진행 중인 경우 Progress Bar 또는 스피너. 업로드 오류 시 Error Indicator. |
| ⑥ Action Buttons | Remove, Download 등 파일 단위 액션. 콘텍스트에 따라 제공하는 액션이 다를 수 있다. |

### Visual Layout

\`\`\`
[ File Upload Section ]
┌─────────────────────────────────────────────────────────────────────┐
│  Label                                             [📎 Upload]      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  ┌──┐  report_Q1_2026.pdf     2.3 MB · 10 files     [✕]    │   │
│  │  └──┘                                                       │   │
│  │  ┌──┐  image.png              1.2 MB                 [✕]    │   │
│  │  └──┘                                                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

[ Uploading State ]
┌─────────────────────────────────────────────────────────────────────┐
│  ┌──┐  report_Q1_2026.pdf                                          │
│  └──┘  ▓▓▓▓▓▓▓▓░░░░  75%                                          │
└─────────────────────────────────────────────────────────────────────┘

[ Error State ]
┌─────────────────────────────────────────────────────────────────────┐
│  ┌──┐  report_Q1_2026.pdf         2.3 MB · 2026-04-15              │
│  └──┘  ⚠ Upload failed                                [🔄]  [✕]    │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

---

## States

| 상태 | 설명 | 표시 방식 |
| --- | --- | --- |
| Default | 파일이 정상 업로드되어 사용 가능한 상태 | File type icon, 파일명, 메타정보, 액션 버튼 표시 |
| Uploading | 파일이 업로드 진행 중인 상태 | Progress Bar 또는 Spinner 표시. 업로드 완료 전까지 Action Buttons 미표시 |
| Error | 업로드 실패 또는 파일 접근 불가능 상태 | Error 아이콘 표시. 에러 메시지 또는 재시도 액션 제공 |
| Disabled | Action이 비활성화된 상태(예: 권한 없음) | Action Buttons 비활성화. 컴포넌트 비활성화 스펙 준수 |
| Empty | 업로드된 파일이 없는 상태 | Empty State 또는 Upload Trigger만 표시 |

---

## Behavior

### 1) 파일 업로드

- Upload 버튼 클릭 시 파일 선택 다이얼로그를 열거나 드래그 앤 드롭을 지원한다.
- 업로드 시작 시점에 Uploading State로 전환된다.
- 완료 시 Default State로 전환되며 메타정보가 업데이트된다.
- 실패 시 Error State로 전환되며 재시도 액션을 제공한다.

### 2) 파일 삭제

- Remove 액션 클릭 시 제품 정책에 따라 즉시 삭제하거나 Confirmation을 표시한다.
- 삭제 후 해당 항목은 목록에서 제거된다.

### 3) 다운로드

- Download 액션 클릭 시 브라우저 기본 다운로드 동작 또는 파일 URL로 연결한다.

### 4) 빈 리스트

- 업로드된 파일이 없으면 Empty State 지침(Placeholder 또는 Empty State 컴포넌트)을 표시한다.

### 5) 접근성

- 파일명 또는 Action Buttons는 Tab키로 포커스 이동 가능해야 한다.
- 업로드 오류 상태에서는 스크린 리더를 위한 에러 메시지가 제공된다.

---

## Content Guidelines

- **파일명**: 원본 파일명 그대로 표시한다(임의 수정 금지).
- **파일 크기**: 소수점 두 자리 + 단위(KB, MB, GB)로 표시한다. (예: 1.25 MB, 430 KB)
- **날짜 표시**: UX Writing 가이드의 날짜 포맷을 따른다.

---

## Related

| 이름 | 유형 | 비고 |
| --- | --- | --- |
| Empty State | Pattern | 파일이 없을 때의 확장 표시 |
| Spinner | Component | 업로드 진행 상태 표시 |
| Progress Bar | Component | 업로드 진행률 표시 |
| Toast | Component | 업로드 성공/실패 피드백 |
| Icon | Foundation | File Type Icon 세트 |
`;

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

function TagDivider() {
  return <div className="w-px h-[10px] bg-[var(--color-border-default)] shrink-0" />;
}

function FileCardWithTags({
  file,
  onRemove,
  maxVisible = 5,
}: {
  file: { id: string; name: string; tags: string[] };
  onRemove: (id: string) => void;
  maxVisible?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasOverflow = file.tags.length > maxVisible;
  const displayTags = hasOverflow && !expanded ? file.tags.slice(0, maxVisible) : file.tags;

  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] px-4 py-2 flex items-center justify-between gap-2">
      <VStack gap={1} className="min-w-0 flex-1">
        <span className="text-body-md text-[var(--color-text-default)]">{file.name}</span>
        <div className="flex items-start gap-2">
          {hasOverflow && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="shrink-0 mt-0.5 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors cursor-pointer"
            >
              {expanded ? (
                <IconChevronUp size={12} stroke={2} />
              ) : (
                <IconChevronDown size={12} stroke={2} />
              )}
            </button>
          )}
          <div className={`flex items-center gap-2 min-w-0 flex-1 ${expanded ? 'flex-wrap' : ''}`}>
            {displayTags.flatMap((tag, i) =>
              i > 0
                ? [
                    <TagDivider key={`d-${i}`} />,
                    <span
                      key={tag}
                      className="text-body-sm text-[var(--color-text-subtle)] whitespace-nowrap"
                    >
                      {tag}
                    </span>,
                  ]
                : [
                    <span
                      key={tag}
                      className="text-body-sm text-[var(--color-text-subtle)] whitespace-nowrap"
                    >
                      {tag}
                    </span>,
                  ]
            )}
          </div>
        </div>
      </VStack>
      <button
        type="button"
        onClick={() => onRemove(file.id)}
        className="shrink-0 text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] transition-colors"
      >
        <IconX size={16} stroke={1.5} />
      </button>
    </div>
  );
}

function DisclosureExample() {
  const [files, setFiles] = useState([
    {
      id: '1',
      name: 'annual_report_2026_final_v3.pdf',
      tags: ['2.5 MB', 'PDF', 'Signed', 'Reviewed', 'Archived', 'Compliance'],
    },
    {
      id: '2',
      name: 'image.png',
      tags: ['1.2 MB'],
    },
  ]);
  const handleRemove = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className="w-full max-w-[400px]">
      <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-[var(--primitive-spacing-3)] flex flex-col gap-[var(--primitive-spacing-2)]">
        {files.map((file) => (
          <FileCardWithTags key={file.id} file={file} onRemove={handleRemove} />
        ))}
      </div>
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

function UploadingExample() {
  return (
    <div className="w-full max-w-[400px]">
      <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-[var(--primitive-spacing-3)] flex flex-col gap-[var(--primitive-spacing-2)]">
        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] px-4 flex flex-col justify-center gap-1.5 h-[56px]">
          <div className="flex items-center justify-between">
            <span className="text-body-md text-[var(--color-text-default)]">
              report_Q1_2026.pdf
            </span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">75%</span>
          </div>
          <ProgressBar value={75} max={100} showValue={false} />
        </div>
        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] px-4 flex flex-col justify-center gap-1.5 h-[56px]">
          <div className="flex items-center justify-between">
            <span className="text-body-md text-[var(--color-text-default)]">image.png</span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">30%</span>
          </div>
          <ProgressBar value={30} max={100} showValue={false} />
        </div>
      </div>
    </div>
  );
}

function UploadErrorExample() {
  return (
    <div className="w-full max-w-[400px]">
      <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] p-[var(--primitive-spacing-3)] flex flex-col gap-[var(--primitive-spacing-2)]">
        <div className="bg-[var(--color-surface-default)] border border-[var(--color-state-danger)] rounded-[var(--primitive-radius-md)] px-4 flex flex-col justify-center gap-0.5 h-[56px]">
          <span className="text-body-md text-[var(--color-text-default)]">report_Q1_2026.pdf</span>
          <span className="text-body-sm text-[var(--color-state-danger)]">
            Failed to upload file.
          </span>
        </div>
        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] px-4 flex flex-col justify-center gap-1.5 h-[56px]">
          <div className="flex items-center justify-between">
            <span className="text-body-md text-[var(--color-text-default)]">image.png</span>
            <span className="text-body-sm text-[var(--color-text-subtle)]">30%</span>
          </div>
          <ProgressBar value={30} max={100} showValue={false} />
        </div>
      </div>
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

function EmptyExample() {
  return (
    <div className="w-full max-w-[400px]">
      <FileListSection
        label="Attachments"
        required
        files={[]}
        onUpload={() => {}}
        uploadIcon={<IconUpload size={12} stroke={1.5} />}
        emptyMessage=""
      />
    </div>
  );
}

export function FileListCardPage() {
  return (
    <ComponentPageTemplate
      title="File Upload"
      description="파일을 업로드하고, 업로드된 파일 목록을 카드 형태로 관리하는 Form 컴포넌트다. 업로드 트리거, 파일 목록 표시, 상태 피드백을 하나의 통합 인터페이스로 제공한다."
      whenToUse={[
        '사용자가 파일을 업로드해야 할 때',
        '업로드된 파일 목록을 실시간으로 표시하고 관리할 때',
        '파일 타입, 크기, 날짜 등 메타정보와 삭제/다운로드 액션을 함께 제공해야 할 때',
        '폼 내에서 첨부 파일을 관리해야 할 때',
      ]}
      whenNotToUse={[
        '파일 메타정보 없이 업로드 진행상황만 표시할 때 (→ Progress Bar 또는 Spinner 컴포넌트 사용)',
        '파일 목록에 정렬/필터/페이지네이션이 필요한 대용량 데이터셋 (→ Data Table 사용)',
        '단일 파일만 업로드하며 파일명 표시가 필요없는 경우',
        '드래그 앤 드롭 전용 업로드 영역이 필요한 경우 (→ Dropzone 컴포넌트 사용)',
      ]}
      preview={
        <ComponentPreview
          code={`import { FileListSection } from '@/design-system';

const files = [
  { id: '1', name: 'document.pdf', tags: ['2.5 MB', '10 files'] },
  { id: '2', name: 'image.png', tags: ['1.2 MB'] },
];

<FileListSection
  label="Attachments"
  files={files}
  onRemove={handleRemove}
  onUpload={handleUpload}
/>`}
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
            <Label>Disclosure</Label>
            <DisclosureExample />
          </VStack>
          <VStack gap={3}>
            <Label>Read-only (No Remove Button)</Label>
            <ReadOnlyExample />
          </VStack>
          <VStack gap={3}>
            <Label>Uploading State</Label>
            <UploadingExample />
          </VStack>
          <VStack gap={3}>
            <Label>Upload Error State</Label>
            <UploadErrorExample />
          </VStack>
          <VStack gap={3}>
            <Label>Error State</Label>
            <ErrorExample />
          </VStack>
          <VStack gap={3}>
            <Label>Empty State</Label>
            <EmptyExample />
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <NotionRenderer markdown={FILE_UPLOAD_GUIDELINES} />
          <DosDonts
            doItems={[
              '파일명은 전체를 표시하되, 공간 부족 시 truncation 처리하고 Tooltip으로 전체 이름을 노출한다.',
              '업로드 진행 중에는 파일 크기를 알 수 있다면 진행률(%)을 함께 표시한다.',
              'File Type Icon은 파일 확장자에 맞는 아이콘을 사용한다.',
              '업로드된 파일이 없을 때 Empty State를 반드시 제공한다.',
              '업로드 실패 시 Error State와 재시도 액션을 제공한다.',
            ]}
            dontItems={[
              '업로드 시작 전에 파일 목록에 파일을 미리 보여주지 않는다.',
              '업로드 실패 시 아무 피드백 없이 리스트를 갱신하지 않는다(반드시 Error State를 제공한다).',
              '파일 크기 제한이 있을 경우 업로드 전 검증 없이 서버 에러에만 의존하지 않는다.',
            ]}
          />
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          container: surface-subtle, border, radius-md, p-12 · item: surface-default, border,
          radius-md, px-16 py-8 · name: body-md · tag: body-sm, text-subtle · divider: 1px × 10px,
          border-default
        </div>
      }
      relatedLinks={[
        { label: 'Empty States', path: '/design/patterns/empty-states' },
        { label: 'Spinner', path: '/design/components/spinner' },
        { label: 'Progress Bar', path: '/design/components/progress-bar' },
        { label: 'Toast', path: '/design/components/toast' },
        { label: 'Icons', path: '/design/foundation/icons' },
      ]}
    />
  );
}
