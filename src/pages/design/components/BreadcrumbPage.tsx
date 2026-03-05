import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import type { PropDef } from '../_shared/PropsTable';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { Label } from '../../design-system-sections/HelperComponents';
import { Breadcrumb, VStack } from '@/design-system';

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
        <VStack gap={6}>
          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Composition (구성 요소)
              </h4>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                Breadcrumb은 노드(Node)와 구분자(Separator)의 조합으로 구성된다.
              </p>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                Structure: Root Node + Separator + Parent Node(s) + Separator + Current Page Node
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        유형
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-muted)]">
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">Root Node</td>
                      <td className="py-2">계층 구조의 최상위 페이지 노드</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">Parent Node</td>
                      <td className="py-2">
                        중간 계층 페이지 노드. 계층에 따라 1개 이상 반복 가능
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Current Page Node</td>
                      <td className="py-2">현재 페이지를 나타내는 마지막 노드. 링크 없음</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                노드는 페이지를 가리킨다.
              </p>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                Separator: 상위/하위 페이지 관계를 시각적으로 구분. <code>&gt;</code> 기호 사용
              </p>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                Result example:{' '}
                <code>
                  primaryMenuTitle &gt; (secondaryMenuTitle) &gt; subPageTitle &gt; recentPageTitle
                </code>
              </p>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                Note: secondaryMenuTitle은 사이드바가 이중으로 구성된 경우(Container 앱, Agent
                Ops)에만 해당
              </p>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Variants</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        구분
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-muted)]">
                    <tr>
                      <td className="py-2 pr-4">Default</td>
                      <td className="py-2">모든 노드를 순서대로 표시하는 기본형</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">States</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                        상태
                      </th>
                      <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--color-text-muted)]">
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">Default</td>
                      <td className="py-2">기본 표시 상태</td>
                    </tr>
                    <tr className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-2 pr-4">Hover</td>
                      <td className="py-2">
                        링크가 있는 노드에 마우스를 올렸을 때. 밑줄 또는 색상 변화로 인터랙션 가능
                        여부를 표시
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Disabled (Current)</td>
                      <td className="py-2">
                        마지막 노드(현재 페이지). 링크 없음, 클릭 불가 상태로 표시
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Behavior</h4>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)] uppercase">
                동적 노드명 동기화
              </h5>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                리소스 이름이 포함된 노드(예: <code>{'{instanceName}'}</code>,{' '}
                <code>{'{podName}'}</code>)는 페이지 로딩 시점에 실제 리소스명으로 동기화된다.
              </p>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                리소스명을 불러오는 동안에는 로딩 상태(Skeleton 또는 Placeholder)를 표시한다.
              </p>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={2}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">Usage Guidelines</h4>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)] uppercase">
                Don&apos;t
              </h5>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>
                  사용자의 방문 히스토리(뒤로가기 흔적)를 반영하지 않는다. Breadcrumb은 IA 기반의
                  구조적 경로다.
                </li>
                <li>
                  다음 항목은 노드에 포함하지 않는다: 조직(Domain),
                  Partition(테넌트·네임스페이스·프로젝트 등), 앱 이름, 메뉴 카테고리 분류(Section
                  title)
                </li>
                <li>현재 페이지 노드에 링크를 포함하지 않는다.</li>
              </ul>
            </VStack>
          </div>

          <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
            <VStack gap={4}>
              <h4 className="text-heading-h6 text-[var(--color-text-default)]">
                Content Guidelines
              </h4>
              <h5 className="text-heading-h7 text-[var(--color-text-muted)] uppercase">
                노드 텍스트 작성 기준
              </h5>
              <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
                <li>노드 텍스트는 메뉴명 또는 페이지 H1 제목과 정확히 일치시킨다.</li>
                <li>
                  리소스명이 포함되는 경우 <code>{'{리소스명}'}</code> 형태로 동적 바인딩한다.
                  이름이 없는 리소스는 <code>no name</code>으로 표시한다.
                </li>
                <li>노드 텍스트를 임의로 축약하거나 변형하지 않는다.</li>
                <li>노드 텍스트는 문장이 아닌 명사형으로 작성한다.</li>
              </ul>

              <h5 className="text-heading-h7 text-[var(--color-text-muted)] uppercase">
                서비스별 Breadcrumb 표기 예시
              </h5>

              <VStack gap={2}>
                <h5 className="text-heading-h7 text-[var(--color-text-muted)] uppercase">
                  Compute / Compute-admin
                </h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          페이지 유형
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          Breadcrumb
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[var(--color-text-muted)]">
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">단일 화면 (Dashboard)</td>
                        <td className="py-2">
                          <code>Dashboard</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">단일 화면 (Topology)</td>
                        <td className="py-2">
                          <code>Topology</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">리스트 화면</td>
                        <td className="py-2">
                          <code>Instances</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">디테일 화면</td>
                        <td className="py-2">
                          <code>{'Instances > {Instance name}'}</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Pool 상세</td>
                        <td className="py-2">
                          <code>
                            {'Load balancer > {load balancer id} > {listener id} > {pool name}'}
                          </code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Port 상세 (이름 있음)</td>
                        <td className="py-2">
                          <code>{'Ports > {port name}'}</code>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Port 상세 (이름 없음)</td>
                        <td className="py-2">
                          <code>Ports &gt; no name</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>

              <VStack gap={2}>
                <h5 className="text-heading-h7 text-[var(--color-text-muted)] uppercase">
                  Container
                </h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          페이지 유형
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          Breadcrumb
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[var(--color-text-muted)]">
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Primary menu page</td>
                        <td className="py-2">
                          <code>primaryMenuTitle</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Secondary menu page</td>
                        <td className="py-2">
                          <code>{'primaryMenuTitle > secondaryMenuTitle > subpageTitle'}</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Cluster Create 페이지</td>
                        <td className="py-2">
                          <code>Cluster Management &gt; Clusters &gt; Create Cluster</code>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Pod Detail 페이지</td>
                        <td className="py-2">
                          <code>{'clusterName > Pods > {podName}'}</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>

              <VStack gap={2}>
                <h5 className="text-heading-h7 text-[var(--color-text-muted)] uppercase">
                  Storage
                </h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          페이지
                        </th>
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          경로
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          Breadcrumb
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[var(--color-text-muted)]">
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Dashboard</td>
                        <td className="py-2 pr-4">/home</td>
                        <td className="py-2">
                          <code>Dashboard</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Pools 리스트</td>
                        <td className="py-2 pr-4">/pools</td>
                        <td className="py-2">
                          <code>Pools</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Pool 상세</td>
                        <td className="py-2 pr-4">/pools/:poolName</td>
                        <td className="py-2">
                          <code>{'Pools > {poolName}'}</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Hosts 리스트</td>
                        <td className="py-2 pr-4">/hosts</td>
                        <td className="py-2">
                          <code>Hosts</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Host 상세</td>
                        <td className="py-2 pr-4">/hosts/:hostname</td>
                        <td className="py-2">
                          <code>{'Hosts > {hostname}'}</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">OSDs 리스트</td>
                        <td className="py-2 pr-4">/osds</td>
                        <td className="py-2">
                          <code>OSDs</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">OSD 상세</td>
                        <td className="py-2 pr-4">/osds/:osdId</td>
                        <td className="py-2">
                          <code>{'OSDs > {osdId}'}</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Physical Disks 리스트</td>
                        <td className="py-2 pr-4">/physical-disks</td>
                        <td className="py-2">
                          <code>Physical Disks</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Images 리스트</td>
                        <td className="py-2 pr-4">/images</td>
                        <td className="py-2">
                          <code>Images</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Image 상세</td>
                        <td className="py-2 pr-4">/images/:imageName</td>
                        <td className="py-2">
                          <code>{'Images > {imageName}'}</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Buckets 리스트</td>
                        <td className="py-2 pr-4">/buckets</td>
                        <td className="py-2">
                          <code>Buckets</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Bucket 상세</td>
                        <td className="py-2 pr-4">/buckets/:bucketName</td>
                        <td className="py-2">
                          <code>{'Buckets > {bucketName}'}</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Bucket 생성</td>
                        <td className="py-2 pr-4">/buckets/create</td>
                        <td className="py-2">
                          <code>Buckets &gt; Create Bucket</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Bucket 편집</td>
                        <td className="py-2 pr-4">/buckets/:bucketName/edit</td>
                        <td className="py-2">
                          <code>{'Buckets > {bucketName} > Edit Bucket'}</code>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Overall Performance</td>
                        <td className="py-2 pr-4">/overall-performance</td>
                        <td className="py-2">
                          <code>Overall Performance</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>

              <VStack gap={2}>
                <h5 className="text-heading-h7 text-[var(--color-text-muted)] uppercase">IAM</h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          페이지 유형
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          Breadcrumb
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[var(--color-text-muted)]">
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Dashboard</td>
                        <td className="py-2">
                          <code>Dashboard</code>
                        </td>
                      </tr>
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Users 리스트</td>
                        <td className="py-2">
                          <code>Users</code>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">User 상세</td>
                        <td className="py-2">
                          <code>{'Users > {Username}'}</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>

              <VStack gap={2}>
                <h5 className="text-heading-h7 text-[var(--color-text-muted)] uppercase">
                  AI Agent
                </h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border-default)]">
                        <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">
                          페이지 유형
                        </th>
                        <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">
                          Breadcrumb
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[var(--color-text-muted)]">
                      <tr className="border-b border-[var(--color-border-subtle)]">
                        <td className="py-2 pr-4">Data source 상세</td>
                        <td className="py-2">
                          <code>{'Data sources > {Data source name}'}</code>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Data source 생성</td>
                        <td className="py-2">
                          <code>Data sources &gt; Create data source</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </VStack>
            </VStack>
          </div>
        </VStack>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>gap: 4px</code> · <code>font-size: 11px</code> · <code>line-height: 16px</code> ·{' '}
          <code>font-weight: medium</code>
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
