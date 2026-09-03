/* ----------------------------------------
   클러스터 상세 — Conditions 탭 (CorePlan CAPSIS-D-73)

   화면 정의서: 02-screens/01-cluster-detail-overview

   Rancher는 클러스터 상세에서 「지금 도는 상태」를 보여주지 않는다 — 그건
   대시보드 몫이다. 대신 클러스터가 어떤 조건을 만족했는지를 Conditions 탭에
   모아 둔다. 우리도 같게 간다(CAPSIS-D-73).

   ⚠ 어떤 조건을 어떤 값으로 보여줄지는 아직 정하지 않았다(화면 정의서 §GAP).
   백엔드에 무엇이 오는지 확인이 필요하다. 아래는 Rancher의 칼럼 구성을 그대로
   따른 자리 잡기용 목업이다.
   ---------------------------------------- */

import { VStack, Badge, Table, type TableColumn } from '@/design-system';

export interface ClusterCondition {
  /** 조건 이름. 예: Ready · Provisioned */
  type: string;
  status: 'True' | 'False' | 'Unknown';
  /** 마지막으로 값이 바뀐 시각 */
  updatedAt: string;
  /** 값이 False·Unknown일 때 왜 그런지 */
  message?: string;
}

const STATUS_THEME: Record<ClusterCondition['status'], 'green' | 'red' | 'gray'> = {
  True: 'green',
  False: 'red',
  Unknown: 'gray',
};

interface Props {
  conditions: ClusterCondition[];
}

const COLUMNS: TableColumn<ClusterCondition>[] = [
  { key: 'type', label: 'Type', width: 'w-[220px]', minWidth: 'min-w-[220px]' },
  {
    key: 'status',
    label: 'Status',
    width: 'w-[120px]',
    minWidth: 'min-w-[120px]',
    render: (_value: unknown, row: ClusterCondition) => (
      <Badge theme={STATUS_THEME[row.status]}>{row.status}</Badge>
    ),
  },
  { key: 'updatedAt', label: 'Updated', width: 'w-[180px]', minWidth: 'min-w-[180px]' },
  { key: 'message', label: 'Message', flex: 1, minWidth: 'min-w-[240px]' },
];

export function ClusterConditionsTab({ conditions }: Props) {
  return (
    <VStack gap="4">
      <Table columns={COLUMNS} data={conditions} rowKey="type" />
    </VStack>
  );
}
