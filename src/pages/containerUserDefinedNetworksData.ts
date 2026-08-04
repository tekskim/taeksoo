/* ----------------------------------------
   UserDefinedNetwork 목데이터.

   네임스페이스마다 분리된 전용 네트워크를 정의하는 리소스다. 기본 Pod 네트워크는
   클러스터 전체가 하나로 평평하지만, UDN은 네임스페이스에 자기만의 IP 대역을 준다.
   규칙(NetworkPolicy)으로 막는 것이 아니라 처음부터 분리된다는 점이 다르다.

   ⚠ CNI 종속 — OVN-Kubernetes를 쓸 때만 존재하는 리소스다. Calico·Cilium 등
   다른 CNI에서는 리소스 자체가 없다. 온프렘 CNI 결정이 선행 조건이며,
   지원하지 않으면 메뉴를 노출하지 않는다.
   ---------------------------------------- */

export type UdnScope = 'Namespace' | 'Cluster';
export type UdnRole = 'Primary' | 'Secondary';
export type UdnTopology = 'Layer2' | 'Layer3';

export interface UserDefinedNetworkRow {
  id: string;
  name: string;
  status: string;
  namespace: string;
  scope: UdnScope;
  role: UdnRole;
  topology: UdnTopology;
  subnets: string;
  createdAt: string;
  /** Layer2에서 노드를 잇는 데 쓰는 대역. Layer3에서는 쓰지 않는다. */
  joinSubnets?: string;
  mtu: number;
  /** 이 네트워크에 붙어 있는 파드 (목업) */
  attachedPods: { name: string; namespace: string; ip: string; status: string }[];
}

export const userDefinedNetworksData: UserDefinedNetworkRow[] = [
  {
    id: '1',
    name: 'tenant-a-primary',
    status: 'Active',
    namespace: 'tenant-a',
    scope: 'Namespace',
    role: 'Primary',
    topology: 'Layer3',
    subnets: '10.20.0.0/16',
    createdAt: 'Jul 12, 2026 10:04:22',
    mtu: 1400,
    attachedPods: [
      {
        name: 'api-gateway-7d9f8b-x2mq4',
        namespace: 'tenant-a',
        ip: '10.20.1.14',
        status: 'Running',
      },
      {
        name: 'api-gateway-7d9f8b-k8plz',
        namespace: 'tenant-a',
        ip: '10.20.1.15',
        status: 'Running',
      },
      {
        name: 'web-frontend-5c4a21-tt9wd',
        namespace: 'tenant-a',
        ip: '10.20.2.31',
        status: 'Running',
      },
    ],
  },
  {
    id: '2',
    name: 'tenant-b-primary',
    status: 'Active',
    namespace: 'tenant-b',
    scope: 'Namespace',
    role: 'Primary',
    topology: 'Layer3',
    subnets: '10.21.0.0/16',
    createdAt: 'Jul 12, 2026 10:09:47',
    mtu: 1400,
    attachedPods: [
      {
        name: 'batch-worker-6b7c19-qq4nn',
        namespace: 'tenant-b',
        ip: '10.21.4.8',
        status: 'Running',
      },
    ],
  },
  {
    id: '3',
    name: 'vm-flat-network',
    status: 'Active',
    namespace: 'metis-vm',
    scope: 'Namespace',
    role: 'Primary',
    topology: 'Layer2',
    subnets: '192.168.40.0/24',
    createdAt: 'Jul 18, 2026 14:33:10',
    joinSubnets: '100.65.0.0/16',
    mtu: 1500,
    attachedPods: [
      {
        name: 'virt-launcher-vm-ubuntu-a1',
        namespace: 'metis-vm',
        ip: '192.168.40.11',
        status: 'Running',
      },
      {
        name: 'virt-launcher-vm-rocky-b2',
        namespace: 'metis-vm',
        ip: '192.168.40.12',
        status: 'Running',
      },
    ],
  },
  {
    id: '4',
    name: 'storage-backend',
    status: 'Active',
    namespace: 'tenant-a',
    scope: 'Namespace',
    role: 'Secondary',
    topology: 'Layer2',
    subnets: '172.30.10.0/24',
    createdAt: 'Jul 20, 2026 09:12:58',
    joinSubnets: '100.66.0.0/16',
    mtu: 9000,
    attachedPods: [
      {
        name: 'api-gateway-7d9f8b-x2mq4',
        namespace: 'tenant-a',
        ip: '172.30.10.4',
        status: 'Running',
      },
    ],
  },
  {
    id: '5',
    name: 'shared-services',
    status: 'Active',
    namespace: '—',
    scope: 'Cluster',
    role: 'Secondary',
    topology: 'Layer3',
    subnets: '10.30.0.0/16',
    createdAt: 'Jul 05, 2026 16:47:31',
    mtu: 1400,
    attachedPods: [
      { name: 'dns-forwarder-2f8a-lm3kd', namespace: 'shared', ip: '10.30.0.9', status: 'Running' },
      {
        name: 'log-collector-9c1b-pp7rr',
        namespace: 'shared',
        ip: '10.30.0.21',
        status: 'Running',
      },
    ],
  },
  {
    id: '6',
    name: 'tenant-c-primary',
    status: 'Pending',
    namespace: 'tenant-c',
    scope: 'Namespace',
    role: 'Primary',
    topology: 'Layer3',
    subnets: '10.22.0.0/16',
    createdAt: 'Jul 30, 2026 11:02:05',
    mtu: 1400,
    attachedPods: [],
  },
  {
    id: '7',
    name: 'legacy-migration-net',
    status: 'Failed',
    namespace: 'tenant-b',
    scope: 'Namespace',
    role: 'Secondary',
    topology: 'Layer2',
    subnets: '172.31.5.0/24',
    createdAt: 'Jul 26, 2026 08:55:19',
    joinSubnets: '100.67.0.0/16',
    mtu: 1500,
    attachedPods: [],
  },
];

export function findNetworkById(id: string | undefined): UserDefinedNetworkRow | undefined {
  if (!id) return undefined;
  return userDefinedNetworksData.find((n) => n.id === id);
}
