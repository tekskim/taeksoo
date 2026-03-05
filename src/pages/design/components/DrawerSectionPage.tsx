import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { DrawerDemo } from '../../design-system-sections/OverlayDemos';
import { VStack, Button } from '@/design-system';
import { CreateInstanceSnapshotDrawer } from '@/components/CreateInstanceSnapshotDrawer';
import { EditInstanceDrawer } from '@/components/EditInstanceDrawer';
import { LockSettingDrawer } from '@/components/LockSettingDrawer';

const drawerProps: PropDef[] = [
  { name: 'isOpen', type: 'boolean', required: true, description: 'Open state' },
  { name: 'onClose', type: '() => void', required: true, description: 'Close handler' },
  { name: 'title', type: 'string', required: false, description: 'Drawer title' },
  {
    name: 'description',
    type: 'string',
    required: false,
    description: 'Description text below title',
  },
  {
    name: 'side',
    type: "'left' | 'right'",
    default: "'right'",
    required: false,
    description: 'Slide direction',
  },
  {
    name: 'width',
    type: 'string | number',
    default: '320',
    required: false,
    description: 'Drawer width',
  },
  {
    name: 'showCloseButton',
    type: 'boolean',
    default: 'true',
    required: false,
    description: 'Deprecated — close button has been removed',
  },
  { name: 'footer', type: 'ReactNode', required: false, description: 'Footer content' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Drawer content' },
];

export function DrawerSectionPage() {
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);

  const sampleInstance = {
    id: 'i-29tgj234',
    name: 'web-server-01',
    description: 'Production web server',
    status: 'active',
    image: 'Ubuntu 22.04',
    flavor: 'm1.medium',
    isLocked: false,
  };

  return (
    <ComponentPageTemplate
      title="Drawer"
      description="Slide-out panel for forms, details, and secondary content"
      preview={<DrawerDemo />}
      usage={{
        code: `import { Drawer, VStack, HStack, Button } from '@/design-system';\n\n<Drawer\n  isOpen={isOpen}\n  onClose={handleClose}\n  title="Edit Resource"\n  description="Optional description text."\n  width={360}\n  footer={\n    <HStack gap={2} className="w-full">\n      <Button variant="secondary" className="flex-1">Cancel</Button>\n      <Button variant="primary" className="flex-1">Save</Button>\n    </HStack>\n  }\n>\n  {/* Content */}\n</Drawer>`,
      }}
      examples={
        <VStack gap={6}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Interactive demo</span>
            <DrawerDemo />
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">With description</span>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={() => setSnapshotOpen(true)}>
                Create Instance Snapshot
              </Button>
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Basic</span>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
                Edit Instance
              </Button>
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">With header box</span>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={() => setLockOpen(true)}>
                Lock Setting
              </Button>
            </div>
          </VStack>

          <CreateInstanceSnapshotDrawer
            isOpen={snapshotOpen}
            onClose={() => setSnapshotOpen(false)}
            instance={sampleInstance}
          />
          <EditInstanceDrawer
            isOpen={editOpen}
            onClose={() => setEditOpen(false)}
            instance={sampleInstance}
          />
          <LockSettingDrawer
            isOpen={lockOpen}
            onClose={() => setLockOpen(false)}
            instance={sampleInstance}
          />
        </VStack>
      }
      guidelines={
        <VStack gap={6}>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  Drawer vs Modal 선택 기준
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          조건
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          권장 컴포넌트
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          간단한 확인/결정 (예/아니오)
                        </td>
                        <td className="py-2 font-medium text-[var(--color-text-default)]">
                          Modal (sm)
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          간단한 폼 (필드 1~5개)
                        </td>
                        <td className="py-2 font-medium text-[var(--color-text-default)]">
                          Drawer (4col / 360px)
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          선택/검색 필요 (리스트에서 선택)
                        </td>
                        <td className="py-2 font-medium text-[var(--color-text-default)]">
                          Drawer (8col / 696px)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-[var(--color-text-muted)]">
                          복잡한 리소스 생성 (많은 필드)
                        </td>
                        <td className="py-2 font-medium text-[var(--color-text-default)]">
                          별도 Create 페이지
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                  너비 정책 (Grid 기반)
                </h4>
                <p className="text-body-sm text-[var(--color-text-subtle)]">
                  Column 60px, Gutter 24px, Margin 24px 그리드 기준
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          컬럼
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          너비
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          용도
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          4 columns
                        </td>
                        <td className="py-2 pr-4 font-mono text-[var(--color-text-default)]">
                          360px
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          폼 Drawer (Edit, Create with few fields)
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          8 columns
                        </td>
                        <td className="py-2 pr-4 font-mono text-[var(--color-text-default)]">
                          696px
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          선택 Drawer (리스트에서 리소스 선택, 상세 정보 표시)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-[var(--color-text-default)]">
                          12 columns
                        </td>
                        <td className="py-2 pr-4 font-mono text-[var(--color-text-default)]">
                          1032px
                        </td>
                        <td className="py-2 text-[var(--color-text-muted)]">
                          대형 Drawer (복잡한 레이아웃, 멀티 패널)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
              <VStack gap={2}>
                <h4 className="text-heading-h6 text-[var(--color-text-default)]">구조 규칙</h4>
                <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>헤더</strong>: <code>title</code> prop으로 타이틀 설정. Close 버튼과
                    border-bottom은 제거됨.
                  </li>
                  <li>
                    <strong>Footer</strong>: 액션 버튼은 footer prop에 배치. Cancel(secondary) 왼쪽,
                    Submit(primary) 오른쪽. <code>flex-1</code>로 균등 너비.
                  </li>
                  <li>
                    <strong>컨텍스트 정보</strong>: 수정 대상 리소스의 ID/이름은 상단 InfoBox로
                    표시.
                  </li>
                  <li>
                    <strong>스크롤</strong>: 콘텐츠가 길면 body 영역만 스크롤. Footer는 하단 고정.
                    스크롤바는 overlay 방식으로 콘텐츠 위에 표시되어 좌우 패딩(24px)이 항상 균등하게
                    유지됩니다.
                  </li>
                </ul>
              </VStack>
            </VStack>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-success)] border-opacity-30">
              <h4 className="text-heading-h7 text-[var(--color-state-success)] mb-3">Do</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                <li>Drawer가 열려 있을 때 배경 콘텐츠와의 맥락을 유지합니다.</li>
                <li>닫기 전 미저장 변경사항이 있으면 확인 모달을 표시합니다.</li>
                <li>ESC 키와 외부 클릭으로 닫을 수 있도록 합니다.</li>
              </ul>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-state-danger)] border-opacity-30">
              <h4 className="text-heading-h7 text-[var(--color-state-danger)] mb-3">Don&apos;t</h4>
              <ul className="list-disc pl-4 text-body-sm text-[var(--color-text-muted)] space-y-1.5">
                <li>Drawer 안에서 또 다른 Drawer를 열지 않습니다.</li>
                <li>필드 6개 이상을 Drawer에 넣지 않습니다 (별도 Create 페이지 사용).</li>
                <li>Drawer를 전체 화면 너비로 사용하지 않습니다.</li>
              </ul>
            </div>
          </div>
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>width: 320px (default)</code> · <code>Form: 360px (4col)</code> ·{' '}
          <code>Selection: 696px (8col)</code> · <code>Large: 1032px (12col)</code> ·{' '}
          <code>padding-x: 24px</code> · <code>padding-y: 16px</code> ·{' '}
          <code>scrollbar: 6px overlay</code> · <code>animation: 300ms ease-out</code>
        </div>
      }
      apiReference={drawerProps}
      relatedLinks={[
        { label: 'Modal', path: '/design/components/modal', description: 'Dialog overlay' },
        {
          label: 'Popover',
          path: '/design/components/popover',
          description: 'Lightweight overlay',
        },
        {
          label: 'Form Field',
          path: '/design/components/form-field',
          description: 'Form in drawer',
        },
      ]}
    />
  );
}
