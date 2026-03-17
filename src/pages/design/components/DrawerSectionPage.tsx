import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { DrawerDemo } from '../../design-system-sections/OverlayDemos';
import { VStack, Button } from '@/design-system';
import { CreateInstanceSnapshotDrawer } from '@/components/CreateInstanceSnapshotDrawer';
import { EditInstanceDrawer } from '@/components/EditInstanceDrawer';
import { LockSettingDrawer } from '@/components/LockSettingDrawer';

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
        {children}
      </table>
    </div>
  );
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-label-md font-medium p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <td className={`p-3 border border-[var(--color-border-default)] align-top ${className}`}>
      {children}
    </td>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-heading-h4 text-[var(--color-text-default)]">{children}</h3>;
}

function SubSectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="text-heading-h5 text-[var(--color-text-default)]">{children}</h4>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed space-y-2">
      {children}
    </div>
  );
}

function DrawerSectionPageGuidelines() {
  return (
    <VStack gap={10}>
      <VStack gap={4}>
        <VStack gap={2}>
          <SubSectionTitle>Drawer vs Modal 선택 기준</SubSectionTitle>
          <TableWrapper>
            <thead>
              <tr>
                <Th>조건</Th>
                <Th>권장 컴포넌트</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>간단한 확인/결정 (예/아니오)</Td>
                <Td>
                  <strong>Modal (sm)</strong>
                </Td>
              </tr>
              <tr>
                <Td>간단한 폼 (필드 1~5개)</Td>
                <Td>
                  <strong>Drawer (4col / 360px)</strong>
                </Td>
              </tr>
              <tr>
                <Td>선택/검색 필요 (리스트에서 선택)</Td>
                <Td>
                  <strong>Drawer (8col / 696px)</strong>
                </Td>
              </tr>
              <tr>
                <Td>복잡한 리소스 생성 (많은 필드)</Td>
                <Td>
                  <strong>별도 Create 페이지</strong>{' '}
                  <span className="text-body-sm text-[var(--color-text-subtle)]">
                    (
                    <a
                      href="/design/patterns/wizard"
                      className="underline hover:text-[var(--color-action-primary)]"
                    >
                      Wizard 패턴
                    </a>{' '}
                    참고)
                  </span>
                </Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>
        <VStack gap={2}>
          <SubSectionTitle>너비 정책 (Grid 기반)</SubSectionTitle>
          <p className="text-body-sm text-[var(--color-text-subtle)]">
            Column 60px, Gutter 24px, Margin 24px 그리드 기준
          </p>
          <TableWrapper>
            <thead>
              <tr>
                <Th>컬럼</Th>
                <Th>너비</Th>
                <Th>용도</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>
                  <strong>4 columns</strong>
                </Td>
                <Td className="font-mono">360px</Td>
                <Td>폼 Drawer (Edit, Create with few fields)</Td>
              </tr>
              <tr>
                <Td>
                  <strong>8 columns</strong>
                </Td>
                <Td className="font-mono">696px</Td>
                <Td>선택 Drawer (리스트에서 리소스 선택, 상세 정보 표시)</Td>
              </tr>
              <tr>
                <Td>
                  <strong>12 columns</strong>
                </Td>
                <Td className="font-mono">1032px</Td>
                <Td>대형 Drawer (복잡한 레이아웃, 멀티 패널)</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>
        <VStack gap={2}>
          <SubSectionTitle>구조 규칙</SubSectionTitle>
          <Prose>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>헤더</strong>: title prop으로 타이틀 설정. Close 버튼과 border-bottom은
                제거됨. showCloseButton prop은 deprecated이며 무시된다.
              </li>
              <li>
                <strong>Footer</strong>: 액션 버튼은 footer prop에 배치. Cancel(secondary) 왼쪽,
                Submit(primary) 오른쪽. flex-1로 균등 너비.
              </li>
              <li>
                <strong>컨텍스트 정보</strong>: 수정 대상 리소스의 ID/이름은 상단 InfoBox로 표시.
              </li>
              <li>
                <strong>스크롤</strong>: 콘텐츠가 길면 body 영역만 스크롤. Footer는 하단 고정.
                스크롤바는 overlay 방식으로 콘텐츠 위에 표시되어 좌우 패딩(24px)이 항상 균등하게
                유지됩니다.
              </li>
            </ul>
          </Prose>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      <DosDonts
        doItems={[
          'Drawer가 열려 있을 때 배경 콘텐츠와의 맥락을 유지합니다.',
          '닫기 전 미저장 변경사항이 있으면 확인 모달을 표시합니다.',
          'ESC 키와 외부 클릭으로 닫을 수 있도록 합니다.',
        ]}
        dontItems={[
          'Drawer 안에서 또 다른 Drawer를 열지 않습니다.',
          '필드 6개 이상을 Drawer에 넣지 않습니다 (별도 Create 페이지(Wizard 패턴) 사용).',
          'Drawer를 전체 화면 너비로 사용하지 않습니다.',
        ]}
      />
    </VStack>
  );
}

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
      whenToUse={[
        '리소스 생성/편집 등 짧은 폼을 메인 화면 위에 슬라이드 형태로 표시할 때',
        '상세 정보나 설정을 메인 콘텐츠와 나란히 보여줘야 할 때',
        '작업 흐름을 중단하지 않으면서 보조 콘텐츠를 제공할 때',
        '스냅샷 생성, 잠금 설정 등 컨텍스트 정보와 함께 간단한 입력이 필요할 때',
      ]}
      whenNotToUse={[
        '파괴적 액션(삭제, 중단) 확인이 필요한 경우 → Modal 사용',
        '폼이 매우 길거나 복잡한 위자드가 필요한 경우 → 전체 페이지(Create Page) 사용',
        '단순 정보 안내만 필요한 경우 → Inline Message 또는 Toast 사용',
        '인터랙티브 없는 짧은 추가 정보만 보여줄 때 → Tooltip 또는 Popover 사용',
      ]}
      preview={<DrawerDemo />}
      examples={
        <VStack gap={6}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Interactive demo</span>
            <DrawerDemo />
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">With description</span>
            <Button variant="secondary" size="sm" onClick={() => setSnapshotOpen(true)}>
              Create Instance Snapshot
            </Button>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Basic</span>
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
              Edit Instance
            </Button>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">With header box</span>
            <Button variant="secondary" size="sm" onClick={() => setLockOpen(true)}>
              Lock Setting
            </Button>
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
      guidelines={<DrawerSectionPageGuidelines />}
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          width: 320px (default) · Form: 360px (4col) · Selection: 696px (8col) · Large: 1032px
          (12col) · padding-x: 24px · padding-y: 16px · scrollbar: 6px overlay · animation: 300ms
          ease-out
        </div>
      }
      relatedLinks={[
        { label: 'Modal', path: '/design/components/modal', description: 'Dialog overlay' },
        {
          label: 'Popover',
          path: '/design/components/popover',
          description: 'Lightweight overlay',
        },
        {
          label: 'Form Field',
          path: '/design/patterns/form-field',
          description: 'Form in drawer',
        },
      ]}
    />
  );
}
