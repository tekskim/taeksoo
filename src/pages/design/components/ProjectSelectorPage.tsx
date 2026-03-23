import { useState } from 'react';
import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { DosDonts } from '../_shared/DosDonts';
import { PropsTable } from '../_shared/PropsTable';
import type { PropDef } from '../_shared/PropsTable';
import { Label } from '../../design-system-sections/HelperComponents';
import { VStack } from '@/design-system';
import { ProjectSelector } from '@/components/ProjectSelector';
import type { Project } from '@/contexts/ProjectContext';
import { IconSearch, IconCheck } from '@tabler/icons-react';

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const mockProjects: Project[] = [
  {
    id: '04ebfa43',
    name: 'Project-01',
    description: "Development environment for the 'service' backend services.",
    createdAt: 'Oct 22, 2025 10:15:33',
  },
  {
    id: '14ebfa44',
    name: 'Project-02',
    description: "Staging environment for the 'platform' frontend apps.",
    createdAt: 'Oct 22, 2025 13:53:25',
  },
  {
    id: '24ebfa45',
    name: 'Project-03',
    description: "Production environment for the 'data-pipeline' services.",
    createdAt: 'Oct 22, 2025 13:53:25',
  },
  {
    id: '34ebfa46',
    name: 'Project-04',
    description: 'Archived project (disabled).',
    createdAt: 'Oct 22, 2025 13:53:25',
    disabled: true,
  },
];

/* ----------------------------------------
   Helpers
   ---------------------------------------- */

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

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed space-y-2">
      {children}
    </div>
  );
}

/* ----------------------------------------
   Props Definition
   ---------------------------------------- */

const projectSelectorProps: PropDef[] = [
  {
    name: 'projects',
    type: 'Project[]',
    required: true,
    description:
      '프로젝트 목록 배열. 각 항목은 { id, name, description, createdAt, disabled? } 형태.',
  },
  {
    name: 'selectedProjectId',
    type: 'string',
    required: true,
    description: '현재 선택된 프로젝트의 ID.',
  },
  {
    name: 'onProjectSelect',
    type: '(projectId: string) => void',
    required: true,
    description: '프로젝트 선택 시 호출되는 콜백. 선택된 프로젝트 ID를 전달.',
  },
  {
    name: 'variant',
    type: "'default' | 'sidebar-icon'",
    default: "'default'",
    required: false,
    description: '트리거 버튼 스타일. default: 사이드바 전체 폭, sidebar-icon: 아이콘 전용.',
  },
];

const projectTypeProps: PropDef[] = [
  { name: 'id', type: 'string', required: true, description: '프로젝트 고유 식별자.' },
  { name: 'name', type: 'string', required: true, description: '프로젝트 이름.' },
  {
    name: 'description',
    type: 'string',
    required: true,
    description: '프로젝트 설명 텍스트.',
  },
  {
    name: 'createdAt',
    type: 'string',
    required: true,
    description: '프로젝트 생성 일시 (표시용 문자열).',
  },
  {
    name: 'disabled',
    type: 'boolean',
    required: false,
    description: 'true일 경우 프로젝트 선택 불가 및 비활성 스타일 적용.',
  },
];

/* ----------------------------------------
   Interactive Demo Wrappers
   ---------------------------------------- */

function DefaultDemo() {
  const [selected, setSelected] = useState(mockProjects[0].id);
  return (
    <div className="w-[200px]">
      <ProjectSelector
        projects={mockProjects}
        selectedProjectId={selected}
        onProjectSelect={setSelected}
        variant="default"
      />
    </div>
  );
}

function SidebarIconDemo() {
  const [selected, setSelected] = useState(mockProjects[0].id);
  return (
    <div className="flex items-center justify-center w-10 h-10">
      <ProjectSelector
        projects={mockProjects}
        selectedProjectId={selected}
        onProjectSelect={setSelected}
        variant="sidebar-icon"
      />
    </div>
  );
}

function StaticDropdown() {
  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg shadow-lg p-3 flex flex-col gap-2 w-[280px]">
      <div className="flex items-center justify-between px-2.5 py-1.5 border border-[var(--color-border-strong)] rounded-md bg-[var(--color-surface-default)]">
        <span className="text-body-sm text-[var(--color-text-muted)]">Search projects</span>
        <IconSearch size={16} className="text-[var(--color-text-muted)]" />
      </div>
      <div className="flex flex-col gap-2">
        {mockProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isSelected={project.id === mockProjects[0].id}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, isSelected = false }: { project: Project; isSelected?: boolean }) {
  const isDisabled = project.disabled;
  return (
    <div
      className={`w-full text-left px-3 py-2 rounded-md border ${
        isSelected
          ? 'border-2 border-[var(--color-action-primary)] bg-[var(--color-surface-default)]'
          : 'border border-[var(--color-border-default)] bg-[var(--color-surface-default)]'
      } ${isDisabled ? 'opacity-60' : ''}`}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span
            className={`text-label-md ${isDisabled ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-default)]'}`}
          >
            {project.name}
          </span>
          {isSelected && !isDisabled && (
            <IconCheck size={20} className="text-[var(--color-action-primary)]" stroke={1} />
          )}
          {isDisabled && (
            <span className="text-body-sm text-[var(--color-state-danger)]">Disabled</span>
          )}
        </div>
        <p
          className={`text-body-sm leading-4 ${isDisabled ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-subtle)]'}`}
        >
          {project.description}
        </p>
        <div
          className={`flex items-center justify-between text-body-xs ${isDisabled ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-subtle)]'}`}
        >
          <span>ID: {project.id}</span>
          <span>{project.createdAt}</span>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Guidelines
   ---------------------------------------- */

function ProjectSelectorGuidelines() {
  return (
    <VStack gap={10}>
      {/* Structure */}
      <VStack gap={4}>
        <SectionTitle>Structure</SectionTitle>
        <Prose>
          <p>ProjectSelector는 두 부분으로 구성된다:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>트리거 버튼</strong> — 현재 선택된 프로젝트 이름(또는 아이콘)을 표시하며, 클릭
              시 드롭다운을 열고 닫는다.
            </li>
            <li>
              <strong>드롭다운 패널</strong> — Portal로 렌더링되며, 검색 입력과 프로젝트 카드
              리스트로 구성된다.
            </li>
          </ul>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Variants */}
      <VStack gap={4}>
        <SectionTitle>Variants</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[140px]">Variant</Th>
              <Th className="w-[160px]">사용 위치</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>default</strong>
              </Td>
              <Td>Sidebar 상단</Td>
              <Td>전체 폭 버튼. 프로젝트 이름 + 전환 아이콘을 표시한다.</Td>
            </tr>
            <tr>
              <Td>
                <strong>sidebar-icon</strong>
              </Td>
              <Td>AgentSidebar</Td>
              <Td>
                38x38px 정사각형 아이콘 버튼. Tooltip으로 프로젝트 이름을 표시하며, 드롭다운은 버튼
                우측에 열린다.
              </Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Project Card */}
      <VStack gap={4}>
        <SectionTitle>Project Card</SectionTitle>
        <Prose>
          <p>드롭다운 내 각 프로젝트 카드는 다음 정보를 표시한다:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Header</strong> — 프로젝트 이름 (좌) + 선택 체크 아이콘 또는 Disabled 뱃지
              (우)
            </li>
            <li>
              <strong>Description</strong> — 프로젝트 설명 텍스트
            </li>
            <li>
              <strong>Footer</strong> — 프로젝트 ID (좌) + 생성 일시 (우)
            </li>
          </ul>
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[140px]">상태</Th>
              <Th>스타일</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default</strong>
              </Td>
              <Td>1px border-default, hover 시 surface-subtle 배경</Td>
            </tr>
            <tr>
              <Td>
                <strong>Selected</strong>
              </Td>
              <Td>2px border-action-primary, Check 아이콘 표시</Td>
            </tr>
            <tr>
              <Td>
                <strong>Disabled</strong>
              </Td>
              <Td>text-muted 색상, cursor-not-allowed, &quot;Disabled&quot; 레이블 표시</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Interaction */}
      <VStack gap={4}>
        <SectionTitle>Interaction</SectionTitle>
        <Prose>
          <ul className="list-disc pl-5 space-y-1">
            <li>트리거 버튼 클릭으로 드롭다운을 토글한다.</li>
            <li>드롭다운 내 검색 입력에 autoFocus가 적용되어 즉시 타이핑할 수 있다.</li>
            <li>프로젝트 이름 또는 ID로 필터링 검색이 가능하다.</li>
            <li>프로젝트 카드 클릭 시 해당 프로젝트가 선택되고 드롭다운이 닫힌다.</li>
            <li>
              <strong>Escape</strong> 키 또는 드롭다운 외부 클릭으로 닫을 수 있다.
            </li>
          </ul>
        </Prose>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Best Practices */}
      <VStack gap={4}>
        <SectionTitle>Best Practices</SectionTitle>
        <DosDonts
          doItems={[
            '사이드바 상단에 배치하여 프로젝트 컨텍스트를 항상 인지할 수 있게 한다.',
            'disabled 프로젝트는 리스트에 표시하되 선택 불가 상태를 명확히 표현한다.',
            '검색이 가능하도록 프로젝트 이름과 ID를 모두 필터 대상으로 한다.',
          ]}
          dontItems={[
            '페이지 본문 내부에 ProjectSelector를 배치하지 않는다 (사이드바/네비게이션 전용).',
            '프로젝트가 1개뿐인 환경에서 불필요하게 표시하지 않는다.',
            '드롭다운 내부에 프로젝트 관리(생성/삭제) 기능을 넣지 않는다.',
          ]}
        />
      </VStack>
    </VStack>
  );
}

/* ----------------------------------------
   Page
   ---------------------------------------- */

export function ProjectSelectorPage() {
  return (
    <ComponentPageTemplate
      title="Project Selector"
      description="사이드바 또는 네비게이션 바에서 현재 작업 중인 프로젝트를 전환하는 드롭다운 컴포넌트다. 검색 기능을 제공하며, 프로젝트 이름·설명·ID·생성일을 카드 형태로 표시한다."
      whenToUse={[
        '사이드바 상단에서 프로젝트 간 전환이 필요할 때 (default variant)',
        '아이콘 전용 사이드바에서 프로젝트를 전환할 때 (sidebar-icon variant)',
      ]}
      whenNotToUse={[
        '단일 프로젝트만 존재하는 환경에서는 표시하지 않는다.',
        '설정 페이지 내부에서 프로젝트를 선택하는 용도 → Select 컴포넌트 사용.',
        '프로젝트 생성/삭제 등 관리 기능이 필요한 경우 → 별도 관리 페이지 사용.',
      ]}
      preview={
        <ComponentPreview
          code={`<ProjectSelector
  projects={projects}
  selectedProjectId={selectedId}
  onProjectSelect={setSelectedId}
  variant="default"
/>`}
        >
          <DefaultDemo />
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Default — Sidebar</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                사이드바 전체 폭 트리거. 프로젝트 이름 + 전환 아이콘을 표시한다.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <DefaultDemo />
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Dropdown Panel (Static)</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                트리거 클릭 시 열리는 드롭다운 패널. 검색 입력과 프로젝트 카드 리스트로 구성된다.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <StaticDropdown />
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Project Card — States</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                프로젝트 카드의 3가지 상태: 선택됨(Selected), 기본(Default), 비활성(Disabled).
              </span>
            </VStack>
            <div className="flex gap-4 flex-wrap p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <VStack gap={1.5} className="w-[260px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Selected</span>
                <ProjectCard project={mockProjects[0]} isSelected />
              </VStack>
              <VStack gap={1.5} className="w-[260px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Default</span>
                <ProjectCard project={mockProjects[1]} />
              </VStack>
              <VStack gap={1.5} className="w-[260px]">
                <span className="text-label-sm text-[var(--color-text-subtle)]">Disabled</span>
                <ProjectCard project={mockProjects[3]} />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <Label>Sidebar Icon — AgentSidebar</Label>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                38x38px 정사각형 아이콘 버튼. Tooltip으로 프로젝트 이름을 표시한다.
              </span>
            </VStack>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--primitive-radius-lg)]">
              <SidebarIconDemo />
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<ProjectSelectorGuidelines />}
      tokens={
        <VStack gap={6}>
          <VStack gap={2}>
            <h4 className="text-heading-h5 text-[var(--color-text-default)]">Trigger Button</h4>
            <TableWrapper>
              <thead>
                <tr>
                  <Th className="w-[140px]">Variant</Th>
                  <Th>Height</Th>
                  <Th>Padding</Th>
                  <Th>Font</Th>
                  <Th>Radius</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>default</Td>
                  <Td>auto</Td>
                  <Td>10px 6px</Td>
                  <Td>text-label-sm (11px)</Td>
                  <Td>6px (md)</Td>
                </tr>
                <tr>
                  <Td>sidebar-icon</Td>
                  <Td>38px</Td>
                  <Td>0 (centered)</Td>
                  <Td>--</Td>
                  <Td>8px (lg)</Td>
                </tr>
              </tbody>
            </TableWrapper>
          </VStack>

          <VStack gap={2}>
            <h4 className="text-heading-h5 text-[var(--color-text-default)]">Dropdown Panel</h4>
            <TableWrapper>
              <thead>
                <tr>
                  <Th className="w-[160px]">Property</Th>
                  <Th>Value</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>Width</Td>
                  <Td>min 280px (default), 320px (sidebar-icon)</Td>
                </tr>
                <tr>
                  <Td>Max Height</Td>
                  <Td>400px</Td>
                </tr>
                <tr>
                  <Td>Padding</Td>
                  <Td>12px</Td>
                </tr>
                <tr>
                  <Td>Gap</Td>
                  <Td>8px</Td>
                </tr>
                <tr>
                  <Td>Radius</Td>
                  <Td>8px (lg)</Td>
                </tr>
                <tr>
                  <Td>Shadow</Td>
                  <Td>shadow-lg</Td>
                </tr>
                <tr>
                  <Td>Z-index</Td>
                  <Td>100</Td>
                </tr>
              </tbody>
            </TableWrapper>
          </VStack>

          <VStack gap={2}>
            <h4 className="text-heading-h5 text-[var(--color-text-default)]">Project Card</h4>
            <TableWrapper>
              <thead>
                <tr>
                  <Th className="w-[160px]">Property</Th>
                  <Th>Value</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>Padding</Td>
                  <Td>12px 8px</Td>
                </tr>
                <tr>
                  <Td>Radius</Td>
                  <Td>6px (md)</Td>
                </tr>
                <tr>
                  <Td>Gap (내부)</Td>
                  <Td>6px</Td>
                </tr>
                <tr>
                  <Td>Name font</Td>
                  <Td>text-label-md (12px, medium)</Td>
                </tr>
                <tr>
                  <Td>Description font</Td>
                  <Td>text-body-sm (11px)</Td>
                </tr>
                <tr>
                  <Td>Footer font</Td>
                  <Td>text-body-xs (10px)</Td>
                </tr>
                <tr>
                  <Td>Selected border</Td>
                  <Td>2px action-primary</Td>
                </tr>
                <tr>
                  <Td>Default border</Td>
                  <Td>1px border-default</Td>
                </tr>
              </tbody>
            </TableWrapper>
          </VStack>
        </VStack>
      }
      relatedLinks={[
        {
          label: 'Side Navigation Bar (Menu)',
          path: '/design/components/menu',
          description: '사이드바 네비게이션 메뉴 구조',
        },
        {
          label: 'Top Navigation Bar',
          path: '/design/components/topbar',
          description: 'TopBar에서 compact variant 사용',
        },
        {
          label: 'Tooltip',
          path: '/design/components/tooltip',
          description: 'sidebar-icon variant에서 프로젝트명 표시',
        },
      ]}
    >
      <PropsTable props={projectSelectorProps} name="ProjectSelectorProps" />
      <PropsTable props={projectTypeProps} name="Project" />
    </ComponentPageTemplate>
  );
}
