import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Breadcrumb, VStack } from '@/design-system';

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

const breadcrumbProps: PropDef[] = [
  {
    name: 'items',
    type: 'BreadcrumbItem[]',
    required: true,
    description: 'Breadcrumb items array',
  },
  {
    name: 'separator',
    type: 'ReactNode',
    required: false,
    description: 'Custom separator element',
  },
  {
    name: 'maxItems',
    type: 'number',
    default: '0',
    required: false,
    description: 'Max items before collapsing',
  },
];

export function BreadcrumbPage() {
  return (
    <ComponentPageTemplate
      title="Breadcrumb"
      description="현재 페이지가 정보 구조(IA) 내 어느 위치에 있는지 계층 경로를 표시하는 탐색 보조 컴포넌트다. 사용자가 현재 위치를 인지하고, 상위 페이지로 빠르게 이동할 수 있도록 돕는다."
      whenToUse={[
        '페이지가 2단계 이상의 계층 구조를 가질 때',
        '사용자가 상위 페이지로 돌아가야 하는 상황이 예상될 때',
        '앱 내 복잡한 정보 구조를 명확하게 전달해야 할 때',
      ]}
      whenNotToUse={[
        '단일 페이지(루트 페이지)처럼 계층 구조가 없는 경우',
        '모달, 다이얼로그 등 레이어 위에 올라오는 컴포넌트 내부',
        '이미 페이지 제목, 사이드 내비게이션 등으로 위치가 충분히 전달되는 경우',
      ]}
      keyboardInteractions={[
        { key: 'Tab', description: 'Move focus between breadcrumb links' },
        { key: 'Enter', description: 'Activate the focused breadcrumb link' },
      ]}
      preview={
        <ComponentPreview
          code={`<Breadcrumb
  items={[
    { label: 'Home', onClick: () => {} },
    { label: 'Compute', onClick: () => {} },
    { label: 'Instances', onClick: () => {} },
    { label: 'web-large' },
  ]}
/>`}
        >
          <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
            <Breadcrumb
              items={[
                { label: 'Home', onClick: () => {} },
                { label: 'Compute', onClick: () => {} },
                { label: 'Instances', onClick: () => {} },
                { label: 'web-large' },
              ]}
            />
          </div>
        </ComponentPreview>
      }
      usage={{
        code: `import { Breadcrumb } from '@/design-system';

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Compute', href: '/compute' },
    { label: 'Instances', href: '/compute/instances' },
    { label: 'web-large' },
  ]}
/>`,
      }}
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <Label>Basic usage</Label>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
              <Breadcrumb
                items={[
                  { label: 'Home', onClick: () => {} },
                  { label: 'Compute', onClick: () => {} },
                  { label: 'Instances', onClick: () => {} },
                  { label: 'web-large' },
                ]}
              />
            </div>
          </VStack>
          <VStack gap={3}>
            <Label>Long path</Label>
            <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
              <Breadcrumb
                items={[
                  { label: 'Home', onClick: () => {} },
                  { label: 'Instance snapshots', onClick: () => {} },
                  { label: 'Instance snapshots', onClick: () => {} },
                  { label: 'Instance snapshots', onClick: () => {} },
                  { label: 'web-large' },
                ]}
              />
            </div>
          </VStack>
          <VStack gap={3}>
            <Label>States</Label>
            <div className="grid grid-cols-3 gap-4 text-[length:var(--font-size-10)]">
              <div className="flex flex-col gap-2 items-center">
                <span className="text-[var(--color-text-subtle)]">Default</span>
                <span className="text-[var(--breadcrumb-text-color)] font-medium">Home</span>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <span className="text-[var(--color-text-subtle)]">Hover</span>
                <span className="text-[var(--breadcrumb-text-hover)] font-medium">Home</span>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <span className="text-[var(--color-text-subtle)]">Current</span>
                <span className="text-[var(--breadcrumb-text-current)] font-medium">web-large</span>
              </div>
            </div>
          </VStack>
        </VStack>
      }
      guidelines={
        <VStack gap={10}>
          {/* Composition */}
          <VStack gap={4}>
            <SectionTitle>Composition</SectionTitle>
            <Prose>
              <p>Breadcrumb은 노드(Node)와 구분자(Separator)의 조합으로 구성된다.</p>
              <p>
                Structure: Root Node + Separator + Parent Node(s) + Separator + Current Page Node
              </p>
            </Prose>
            <TableWrapper>
              <thead>
                <tr>
                  <Th className="w-[200px]">유형</Th>
                  <Th>설명</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>
                    <strong>Root Node</strong>
                  </Td>
                  <Td>계층 구조의 최상위 페이지 노드</Td>
                </tr>
                <tr>
                  <Td>
                    <strong>Parent Node</strong>
                  </Td>
                  <Td>중간 계층 페이지 노드. 계층에 따라 1개 이상 반복 가능</Td>
                </tr>
                <tr>
                  <Td>
                    <strong>Current Page Node</strong>
                  </Td>
                  <Td>현재 페이지를 나타내는 마지막 노드. 링크 없음</Td>
                </tr>
              </tbody>
            </TableWrapper>
            <Prose>
              <p>노드는 페이지를 가리킨다.</p>
              <p>
                Separator: 상위/하위 페이지 관계를 시각적으로 구분.{' '}
                <span className="font-mono">&gt;</span> 기호 사용
              </p>
              <p>
                Result example:{' '}
                <span className="font-mono">
                  primaryMenuTitle &gt; (secondaryMenuTitle) &gt; subPageTitle &gt; recentPageTitle
                </span>
              </p>
              <p>
                Note: secondaryMenuTitle은 사이드바가 이중으로 구성된 경우(Container 앱, Agent
                Ops)에만 해당
              </p>
            </Prose>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-default)]" />

          {/* Variants */}
          <VStack gap={4}>
            <SectionTitle>Variants</SectionTitle>
            <TableWrapper>
              <thead>
                <tr>
                  <Th className="w-[200px]">구분</Th>
                  <Th>설명</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>Default</Td>
                  <Td>모든 노드를 순서대로 표시하는 기본형</Td>
                </tr>
              </tbody>
            </TableWrapper>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-default)]" />

          {/* States */}
          <VStack gap={4}>
            <SectionTitle>States</SectionTitle>
            <TableWrapper>
              <thead>
                <tr>
                  <Th className="w-[200px]">상태</Th>
                  <Th>설명</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>
                    <strong>Default</strong>
                  </Td>
                  <Td>기본 표시 상태</Td>
                </tr>
                <tr>
                  <Td>
                    <strong>Hover</strong>
                  </Td>
                  <Td>
                    링크가 있는 노드에 마우스를 올렸을 때. 밑줄 또는 색상 변화로 인터랙션 가능
                    여부를 표시
                  </Td>
                </tr>
                <tr>
                  <Td>
                    <strong>Disabled (Current)</strong>
                  </Td>
                  <Td>마지막 노드(현재 페이지). 링크 없음, 클릭 불가 상태로 표시</Td>
                </tr>
              </tbody>
            </TableWrapper>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-default)]" />

          {/* Behavior */}
          <VStack gap={4}>
            <SectionTitle>Behavior</SectionTitle>
            <VStack gap={3}>
              <SubSectionTitle>동적 노드명 동기화</SubSectionTitle>
              <Prose>
                <p>
                  리소스 이름이 포함된 노드(예:{' '}
                  <span className="font-mono">{'{instanceName}'}</span>,{' '}
                  <span className="font-mono">{'{podName}'}</span>)는 페이지 로딩 시점에 실제
                  리소스명으로 동기화된다.
                </p>
                <p>리소스명을 불러오는 동안에는 로딩 상태(Skeleton 또는 Placeholder)를 표시한다.</p>
              </Prose>
            </VStack>
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-default)]" />

          {/* Usage Guidelines */}
          <VStack gap={4}>
            <SectionTitle>Usage Guidelines</SectionTitle>
            <DosDonts
              dontItems={[
                '사용자의 방문 히스토리(뒤로가기 흔적)를 반영하지 않는다. Breadcrumb은 IA 기반의 구조적 경로다.',
                '다음 항목은 노드에 포함하지 않는다: 조직(Domain), Partition(테넌트·네임스페이스·프로젝트 등), 앱 이름, 메뉴 카테고리 분류(Section title)',
                '현재 페이지 노드에 링크를 포함하지 않는다.',
              ]}
            />
          </VStack>

          <div className="w-full h-px bg-[var(--color-border-default)]" />

          {/* Content Guidelines */}
          <VStack gap={6}>
            <SectionTitle>Content Guidelines</SectionTitle>

            <VStack gap={3}>
              <SubSectionTitle>노드 텍스트 작성 기준</SubSectionTitle>
              <Prose>
                <ul className="list-disc pl-5 space-y-1">
                  <li>노드 텍스트는 메뉴명 또는 페이지 H1 제목과 정확히 일치시킨다.</li>
                  <li>
                    리소스명이 포함되는 경우 <span className="font-mono">{'{리소스명}'}</span>{' '}
                    형태로 동적 바인딩한다. 이름이 없는 리소스는{' '}
                    <span className="font-mono">no name</span>으로 표시한다.
                  </li>
                  <li>노드 텍스트를 임의로 축약하거나 변형하지 않는다.</li>
                  <li>노드 텍스트는 문장이 아닌 명사형으로 작성한다.</li>
                </ul>
              </Prose>
            </VStack>

            <VStack gap={3}>
              <SubSectionTitle>서비스별 Breadcrumb 표기 예시</SubSectionTitle>

              <VStack gap={4}>
                <VStack gap={2}>
                  <h5 className="text-heading-h6 text-[var(--color-text-default)]">
                    Compute / Compute-admin
                  </h5>
                  <TableWrapper>
                    <thead>
                      <tr>
                        <Th className="w-[200px]">페이지 유형</Th>
                        <Th>Breadcrumb</Th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <Td>단일 화면 (Dashboard)</Td>
                        <Td>
                          <span className="font-mono">Dashboard</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>단일 화면 (Topology)</Td>
                        <Td>
                          <span className="font-mono">Topology</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>리스트 화면</Td>
                        <Td>
                          <span className="font-mono">Instances</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>디테일 화면</Td>
                        <Td>
                          <span className="font-mono">{'Instances > {Instance name}'}</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Pool 상세</Td>
                        <Td>
                          <span className="font-mono">
                            {'Load balancer > {load balancer id} > {listener id} > {pool name}'}
                          </span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Port 상세 (이름 있음)</Td>
                        <Td>
                          <span className="font-mono">{'Ports > {port name}'}</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Port 상세 (이름 없음)</Td>
                        <Td>
                          <span className="font-mono">Ports &gt; no name</span>
                        </Td>
                      </tr>
                    </tbody>
                  </TableWrapper>
                </VStack>

                <VStack gap={2}>
                  <h5 className="text-heading-h6 text-[var(--color-text-default)]">Container</h5>
                  <TableWrapper>
                    <thead>
                      <tr>
                        <Th className="w-[200px]">페이지 유형</Th>
                        <Th>Breadcrumb</Th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <Td>Primary menu page</Td>
                        <Td>
                          <span className="font-mono">primaryMenuTitle</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Secondary menu page</Td>
                        <Td>
                          <span className="font-mono">
                            {'primaryMenuTitle > secondaryMenuTitle > subpageTitle'}
                          </span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Cluster Create 페이지</Td>
                        <Td>
                          <span className="font-mono">
                            Cluster Management &gt; Clusters &gt; Create Cluster
                          </span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Pod Detail 페이지</Td>
                        <Td>
                          <span className="font-mono">{'clusterName > Pods > {podName}'}</span>
                        </Td>
                      </tr>
                    </tbody>
                  </TableWrapper>
                </VStack>

                <VStack gap={2}>
                  <h5 className="text-heading-h6 text-[var(--color-text-default)]">Storage</h5>
                  <TableWrapper>
                    <thead>
                      <tr>
                        <Th>페이지</Th>
                        <Th>경로</Th>
                        <Th>Breadcrumb</Th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <Td>Dashboard</Td>
                        <Td>/home</Td>
                        <Td>
                          <span className="font-mono">Dashboard</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Pools 리스트</Td>
                        <Td>/pools</Td>
                        <Td>
                          <span className="font-mono">Pools</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Pool 상세</Td>
                        <Td>/pools/:poolName</Td>
                        <Td>
                          <span className="font-mono">{'Pools > {poolName}'}</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Hosts 리스트</Td>
                        <Td>/hosts</Td>
                        <Td>
                          <span className="font-mono">Hosts</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Host 상세</Td>
                        <Td>/hosts/:hostname</Td>
                        <Td>
                          <span className="font-mono">{'Hosts > {hostname}'}</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>OSDs 리스트</Td>
                        <Td>/osds</Td>
                        <Td>
                          <span className="font-mono">OSDs</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>OSD 상세</Td>
                        <Td>/osds/:osdId</Td>
                        <Td>
                          <span className="font-mono">{'OSDs > {osdId}'}</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Physical Disks 리스트</Td>
                        <Td>/physical-disks</Td>
                        <Td>
                          <span className="font-mono">Physical Disks</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Images 리스트</Td>
                        <Td>/images</Td>
                        <Td>
                          <span className="font-mono">Images</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Image 상세</Td>
                        <Td>/images/:imageName</Td>
                        <Td>
                          <span className="font-mono">{'Images > {imageName}'}</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Buckets 리스트</Td>
                        <Td>/buckets</Td>
                        <Td>
                          <span className="font-mono">Buckets</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Bucket 상세</Td>
                        <Td>/buckets/:bucketName</Td>
                        <Td>
                          <span className="font-mono">{'Buckets > {bucketName}'}</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Bucket 생성</Td>
                        <Td>/buckets/create</Td>
                        <Td>
                          <span className="font-mono">Buckets &gt; Create Bucket</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Bucket 편집</Td>
                        <Td>/buckets/:bucketName/edit</Td>
                        <Td>
                          <span className="font-mono">
                            {'Buckets > {bucketName} > Edit Bucket'}
                          </span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Overall Performance</Td>
                        <Td>/overall-performance</Td>
                        <Td>
                          <span className="font-mono">Overall Performance</span>
                        </Td>
                      </tr>
                    </tbody>
                  </TableWrapper>
                </VStack>

                <VStack gap={2}>
                  <h5 className="text-heading-h6 text-[var(--color-text-default)]">IAM</h5>
                  <TableWrapper>
                    <thead>
                      <tr>
                        <Th className="w-[200px]">페이지 유형</Th>
                        <Th>Breadcrumb</Th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <Td>Dashboard</Td>
                        <Td>
                          <span className="font-mono">Dashboard</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Users 리스트</Td>
                        <Td>
                          <span className="font-mono">Users</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>User 상세</Td>
                        <Td>
                          <span className="font-mono">{'Users > {Username}'}</span>
                        </Td>
                      </tr>
                    </tbody>
                  </TableWrapper>
                </VStack>

                <VStack gap={2}>
                  <h5 className="text-heading-h6 text-[var(--color-text-default)]">AI Agent</h5>
                  <TableWrapper>
                    <thead>
                      <tr>
                        <Th className="w-[200px]">페이지 유형</Th>
                        <Th>Breadcrumb</Th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <Td>Data source 상세</Td>
                        <Td>
                          <span className="font-mono">{'Data sources > {Data source name}'}</span>
                        </Td>
                      </tr>
                      <tr>
                        <Td>Data source 생성</Td>
                        <Td>
                          <span className="font-mono">Data sources &gt; Create data source</span>
                        </Td>
                      </tr>
                    </tbody>
                  </TableWrapper>
                </VStack>
              </VStack>
            </VStack>
          </VStack>
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <span className="font-mono">gap: 4px</span> ·{' '}
          <span className="font-mono">font-size: 11px</span> ·{' '}
          <span className="font-mono">line-height: 16px</span> ·{' '}
          <span className="font-mono">font-weight: medium</span>
        </div>
      }
      apiReference={breadcrumbProps}
      accessibility={
        <p className="text-body-md text-[var(--color-text-muted)]">
          Breadcrumb uses nav with aria-label="Breadcrumb". Current page item has
          aria-current="page". Links are keyboard navigable.
        </p>
      }
      relatedLinks={[
        { label: 'TopBar', path: '/design/components/topbar' },
        { label: 'PageShell', path: '/design/patterns/layout' },
      ]}
    />
  );
}
