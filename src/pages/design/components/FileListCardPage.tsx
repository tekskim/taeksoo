import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { NotionRenderer } from '../_shared/NotionRenderer';
import { Label } from '../../design-system-sections/HelperComponents';
import { FileListCard, FileListSection, VStack } from '@/design-system';
import type { FileItem } from '@/design-system';
import { IconUpload } from '@tabler/icons-react';

const FILE_LIST_CARD_GUIDELINES = `## Overview

File list card는 **특정 콘텍스트(오브젝트 세부, 업로드 영역 등)에 연관된 파일 목록을 카드 형태로 표시하는 Data Display 컴포넌트**다. 파일 타입, 메타정보, 액션을 하나의 카드 항목으로 일관되게 제공한다.

---

## Composition

| 요소 | 설명 |
| --- | --- |
| ① File Type Icon | 파일 확장자(파일 타입)에 대응하는 시각적 아이콘. 표준 TDS 아이콘 세트를 사용한다. Icon Name이 미지정된 파일 타입은 \`IconFile\`을 사용한다. |
| ② File Name | 파일명(확장자 포함). 키보드 포커스 대상이 되며, 클릭 시 다운로드 또는 파일 콘텍스트에 따라 동작을 정의한다. |
| ③ File Metadata | 파일 크기(예: 2.3 MB), 업로드 날짜 또는 최종 수정일 등 선택적 메타정보 |
| ④ Status Indicator (조건부) | 업로드 진행 중인 경우 Progress Bar 또는 스피너. 업로드 오류 시 Error Indicator. |
| ⑤ Action Buttons | Download, Delete 등 파일 단위 액션. 콘텍스트에 따라 제공하는 액션이 다를 수 있다. |

### Visual Layout

\`\`\`
[ Default State ]
┌─────────────────────────────────────────────────────────────────────┐
│  ┌──────┐  ② report_Q1_2026.pdf         ③ 2.3 MB · 2026-04-15      │
│  │  ①   │                                            ⑤ [↓]  [🗑]   │
│  └──────┘                                                           │
└─────────────────────────────────────────────────────────────────────┘

[ Uploading State ]
┌─────────────────────────────────────────────────────────────────────┐
│  ┌──────┐  ② report_Q1_2026.pdf                                     │
│  │  ①   │  ④ ▓▓▓▓▓▓▓▓░░░░  75%                                     │
│  └──────┘                                                           │
└─────────────────────────────────────────────────────────────────────┘

[ Error State ]
┌─────────────────────────────────────────────────────────────────────┐
│  ┌──────┐  ② report_Q1_2026.pdf         ③ 2.3 MB · 2026-04-15      │
│  │  ①   │  ④ ⚠ 업로드 실패                              ⑤ [🔄]  [🗑]  │
│  └──────┘                                                           │
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

---

## Behavior

### 1) 다운로드

- Download 액션 클릭 시 브라우저 기본 다운로드 동작 또는 파일 URL로 연결한다.
- 다운로드 중 스피너 또는 진행 표시는 SSOT 및 제품 UX 정책을 따른다.

### 2) 삭제

- Delete 액션 클릭 시 제품 정책에 따라 Confirmation 모달 또는 즉시 삭제를 한다.
- 삭제 후 해당 카드는 목록에서 제거된다.

### 3) 업로드 진행 상태

- 업로드 시작 시점에 Uploading State로 전환된다.
- 완료 시 Default State로 전환되며 메타정보가 업데이트된다.
- 실패 시 Error State로 전환되며 재시도 액션을 제공한다.

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
      description="특정 콘텍스트(오브젝트 세부, 업로드 영역 등)에 연관된 파일 목록을 카드 형태로 표시하는 Data Display 컴포넌트다. 파일 타입, 메타정보, 액션을 하나의 카드 항목으로 일관되게 제공한다."
      whenToUse={[
        '첨부 파일 목록을 표시할 때',
        '사용자가 파일을 업로드하는 영역에서 업로드 결과를 실시간으로 표시할 때',
        '파일 타입, 크기, 날짜 등 메타정보와 액션을 함께 제공해야 할 때',
        '다운로드, 삭제 등 파일단위 액션이 필요할 때',
      ]}
      whenNotToUse={[
        '파일 메타정보 없이 업로드 진행상황만 표시할 때 (→ Progress bar 또는 Spinner 컴포넌트 사용)',
        '파일 목록에 정렬/필터/페이지네이션이 필요한 대용량 데이터셋 (→ Data Table 사용)',
        '단일 파일만 업로드하며 파일명 표시가 필요없는 경우',
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
        <VStack gap={6}>
          <NotionRenderer markdown={FILE_LIST_CARD_GUIDELINES} />
          <DosDonts
            doItems={[
              '파일명은 전체를 표시하도록 하되, 공간이 없으면 생략(truncation)으로 처리하고 Tooltip으로 전체 이름을 노출한다.',
              '업로드 진행 중에는 파일의 업로드 크기를 알 수 있다면 진행률(%)로 표시한다.',
              'File Type Icon은 파일 타입에 맞도록 사용한다.',
              '목록에 파일이 없을 때 Empty State를 반드시 제공한다.',
            ]}
            dontItems={[
              '업로드 전에 파일 목록에 파일을 미리 보여주지 않는다(업로드 시작 시점에 Uploading State로 쓰는 것이 원칙).',
              '업로드 실패 시 아무 피드백 없이 리스트를 갱신하지 않는다(반드시 Error State를 제공한다).',
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
