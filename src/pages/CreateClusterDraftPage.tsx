/* ----------------------------------------
   Create cluster — 가안 (2026-08-26)

   **결정된 것이 아니라 논의용 가안이다.** 정본은 `CreateClusterPage.tsx`이고
   화면 정의서는 `02-screens/07-cluster-create-v1.0.md`이다.

   2026-08-26 「VM 기반 쿠버네티스 클러스터 구성 아키텍처 논의」를 반영했다.
   그 회의의 한 줄 결론은 이렇다 — 클러스터를 만들 때 VM을 자동으로 만드는
   과정을 빼고, 사람이 미리 만들어 둔 VM(또는 베어메탈)에 에이전트로 쿠버네티스를
   설치한다. Capsis에서는 VM이냐 베어메탈이냐만 고르고 그 뒤 흐름은 같다.

   그래서 이 화면은 **자원을 만드는 화면이 아니라 이미 있는 자원을 고르는 화면**이다.
   VM을 만들기 위한 입력(이미지·Flavor·노드 개수·네트워크·접속 자격증명)은 모두
   빠졌다. 남은 것은 쿠버네티스를 설치하는 데 필요한 것뿐이다.

   앞선 2026-08-25 회의에서 나온 것도 그대로 살아 있다.
   - 용도(Usage type)를 기반보다 먼저 고른다
   - Metis용 클러스터도 베어메탈을 쓸 수 있다 (베어메탈만인 것은 아니다)

   아직 안 정해진 것 — OpenStack 의존성. 「OpenStack 없이 VM·베어메탈 구성을
   똑같이 할 수 있는지 먼저 검토하고, 안 되면 OpenStack 기반으로 확정」이 회의
   결론이라, 이 화면에서는 고르게 하지 않고 등록된 노드의 속성(Platform 열)으로
   보여 주기만 한다.
   ---------------------------------------- */

import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconX,
  IconCirclePlus,
  IconInfoCircle,
  IconHelpCircle,
  IconLock,
} from '@tabler/icons-react';
import {
  Button,
  Breadcrumb,
  VStack,
  HStack,
  TabBar,
  TopBar,
  Input,
  Select,
  SectionCard,
  Table,
  Radio,
  RadioGroup,
  Pagination,
  SearchInput,
  NumberInput,
  Slider,
  FormField,
  SelectionIndicator,
  Tooltip,
  PageShell,
  WizardSummary,
  InlineMessage,
  Badge,
  Disclosure,
  DisclosureTrigger,
  DisclosurePanel,
  fixedColumns,
  columnMinWidths,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { ClusterManagementSidebar } from '@/components/ClusterManagementSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useAvailableUsages, type ClusterUsage } from '@/pages/containerEntitlement';

/* ----------------------------------------
   Types
   ---------------------------------------- */

/** Capsis가 고르는 것은 이 하나뿐이다 — VM에서 가져올 것이냐, 베어메탈에서 가져올 것이냐. */
type NodeSource = 'vm' | 'baremetal';

/** 워커에 붙일 가속기. 에이전트가 까는 것이 이 값에 따라 갈린다. */
type Accelerator = 'none' | 'gpu' | 'npu';

/**
 * 노드 하나를 고를 수 있는지.
 * `available`만 고를 수 있다. 에이전트가 없거나 닿지 않으면 쿠버네티스를 깔 방법이 없다.
 */
type NodeStatus = 'available' | 'in-use' | 'agent-missing' | 'unreachable';

/**
 * 이미 만들어져 등록된 노드.
 * VM이든 베어메탈이든 Capsis 입장에서는 같은 모양이다 — 둘 다 리눅스이고 에이전트가 같다.
 */
interface RegisteredNode {
  id: string;
  name: string;
  source: NodeSource;
  /** 어디서 온 노드인가. VM은 OpenStack·vSphere 등, 베어메탈은 Ironic이다. */
  platform: string;
  spec: string;
  accelerator: string;
  ip: string;
  status: NodeStatus;
}

interface Label {
  id: string;
  key: string;
  value: string;
}

interface Annotation {
  id: string;
  key: string;
  value: string;
}

/* ----------------------------------------
   Usage별 축소 규칙 (가안)

   2026-08-25 회의 §2-4의 남은 질문 — "용도가 Metis 하나면 폼 항목을 다 보여줄
   필요가 있나"에 대한 제안이다. 무엇을 줄일지는 정해지지 않았고, 아래는 논의를
   시작하려고 기획이 잡아 본 안이다.

   원칙은 하나다 — 그 용도가 이미 답을 정해 둔 것만 잠근다. 잠긴 값도 숨기지 않고
   그대로 보여 주고 왜 잠겼는지 옆에 적는다. 무엇으로 만들어졌는지 확인할 방법이
   없어지면 안 되기 때문이다.
   ---------------------------------------- */

interface UsagePreset {
  lockedKubernetesVersion?: string;
  lockedContainerNetwork?: string;
  lockReason?: string;
  /** 가속기를 반드시 골라야 하는가 */
  acceleratorRequired: boolean;
  /** Labels & annotations를 접어 둘 것인가 */
  collapseLabels: boolean;
  /** 클러스터 안 에이전트가 깔 것 */
  agentPackages: string[];
}

const USAGE_PRESETS: Record<ClusterUsage, UsagePreset> = {
  General: {
    acceleratorRequired: false,
    collapseLabels: false,
    agentPackages: [],
  },
  Metis: {
    lockedKubernetesVersion: 'v1.33',
    lockedContainerNetwork: 'cilium',
    lockReason: 'Verified by Metis',
    acceleratorRequired: true,
    collapseLabels: true,
    agentPackages: ['Metis serving agent', 'gpu-operator or vllm-rbln'],
  },
  Maxis: {
    lockedKubernetesVersion: 'v1.33',
    lockedContainerNetwork: 'cilium',
    lockReason: 'Verified by Maxis',
    acceleratorRequired: true,
    collapseLabels: true,
    agentPackages: ['Maxis training agent', 'gpu-operator', 'Kueue'],
  },
};

const USAGE_OPTION_LABELS: Record<ClusterUsage, { title: string; detail: string }> = {
  General: {
    title: 'General purpose',
    detail: 'General workloads — decide what to run after the cluster exists',
  },
  Metis: { title: 'Metis', detail: 'Inference and serving only' },
  Maxis: { title: 'Maxis', detail: 'Training only' },
};

/* ----------------------------------------
   Mock Data
   ---------------------------------------- */

const kubernetesVersionOptions = [
  { value: 'v1.34', label: 'v1.34' },
  { value: 'v1.33', label: 'v1.33' },
  { value: 'v1.32', label: 'v1.32' },
];

const containerNetworkOptions = [{ value: 'cilium', label: 'Cilium' }];

/**
 * 이미 만들어져 에이전트까지 등록된 노드들.
 *
 * VM은 Compute에서 사람이 미리 만든 것이고, 베어메탈은 Cloud Builder가 Ironic에
 * 올려 둔 것이다. 회의에서 말한 「마스터 1대, 워커 5대」 모양을 그대로 담았다.
 * 에이전트가 안 깔린 것과 닿지 않는 것도 넣어 두었다 — 그 경우 화면에서 어떻게
 * 보이는지가 이 가안에서 확인할 것 중 하나다.
 */
const mockRegisteredNodes: RegisteredNode[] = [
  // --- VM (OpenStack) ---
  {
    id: 'vm-01',
    name: 'tk-cp-01',
    source: 'vm',
    platform: 'OpenStack',
    spec: '4 vCPU · 8 GiB · 40 GiB',
    accelerator: '—',
    ip: '192.168.62.11',
    status: 'available',
  },
  {
    id: 'vm-02',
    name: 'tk-cp-02',
    source: 'vm',
    platform: 'OpenStack',
    spec: '4 vCPU · 8 GiB · 40 GiB',
    accelerator: '—',
    ip: '192.168.62.12',
    status: 'available',
  },
  {
    id: 'vm-03',
    name: 'tk-cp-03',
    source: 'vm',
    platform: 'OpenStack',
    spec: '4 vCPU · 8 GiB · 40 GiB',
    accelerator: '—',
    ip: '192.168.62.13',
    status: 'available',
  },
  {
    id: 'vm-04',
    name: 'tk-wn-01',
    source: 'vm',
    platform: 'OpenStack',
    spec: '16 vCPU · 64 GiB · 200 GiB',
    accelerator: 'NVIDIA A10 × 1',
    ip: '192.168.62.21',
    status: 'available',
  },
  {
    id: 'vm-05',
    name: 'tk-wn-02',
    source: 'vm',
    platform: 'OpenStack',
    spec: '16 vCPU · 64 GiB · 200 GiB',
    accelerator: 'NVIDIA A10 × 1',
    ip: '192.168.62.22',
    status: 'available',
  },
  {
    id: 'vm-06',
    name: 'tk-wn-03',
    source: 'vm',
    platform: 'OpenStack',
    spec: '8 vCPU · 32 GiB · 100 GiB',
    accelerator: '—',
    ip: '192.168.62.23',
    status: 'available',
  },
  {
    id: 'vm-07',
    name: 'tk-wn-04',
    source: 'vm',
    platform: 'OpenStack',
    spec: '8 vCPU · 32 GiB · 100 GiB',
    accelerator: '—',
    ip: '192.168.62.24',
    status: 'agent-missing',
  },
  {
    id: 'vm-08',
    name: 'tk-wn-05',
    source: 'vm',
    platform: 'OpenStack',
    spec: '8 vCPU · 32 GiB · 100 GiB',
    accelerator: '—',
    ip: '192.168.62.25',
    status: 'in-use',
  },
  // --- VM (OpenStack이 아닌 곳) ---
  {
    id: 'vm-09',
    name: 'legacy-node-01',
    source: 'vm',
    platform: 'VMware vSphere',
    spec: '8 vCPU · 32 GiB · 120 GiB',
    accelerator: '—',
    ip: '10.20.4.31',
    status: 'available',
  },
  {
    id: 'vm-10',
    name: 'legacy-node-02',
    source: 'vm',
    platform: 'VMware vSphere',
    spec: '8 vCPU · 32 GiB · 120 GiB',
    accelerator: '—',
    ip: '10.20.4.32',
    status: 'unreachable',
  },
  // --- 베어메탈 (Cloud Builder가 Ironic에 등록) ---
  {
    id: 'bm-01',
    name: 'tk-bm-ctrl-01',
    source: 'baremetal',
    platform: 'Ironic',
    spec: 'Xeon Gold 6348 × 2 (56C) · 256 GiB',
    accelerator: '—',
    ip: '10.70.62.11',
    status: 'available',
  },
  {
    id: 'bm-02',
    name: 'tk-bm-ctrl-02',
    source: 'baremetal',
    platform: 'Ironic',
    spec: 'Xeon Gold 6348 × 2 (56C) · 256 GiB',
    accelerator: '—',
    ip: '10.70.62.12',
    status: 'available',
  },
  {
    id: 'bm-03',
    name: 'tk-bm-ctrl-03',
    source: 'baremetal',
    platform: 'Ironic',
    spec: 'Xeon Gold 6348 × 2 (56C) · 256 GiB',
    accelerator: '—',
    ip: '10.70.62.13',
    status: 'available',
  },
  {
    id: 'bm-04',
    name: 'tk-bm-gpu-01',
    source: 'baremetal',
    platform: 'Ironic',
    spec: 'Xeon Platinum 8480+ × 2 (120C) · 2 TiB',
    accelerator: 'NVIDIA H100 × 8',
    ip: '10.70.62.21',
    status: 'available',
  },
  {
    id: 'bm-05',
    name: 'tk-bm-gpu-02',
    source: 'baremetal',
    platform: 'Ironic',
    spec: 'Xeon Platinum 8480+ × 2 (120C) · 2 TiB',
    accelerator: 'NVIDIA H100 × 8',
    ip: '10.70.62.22',
    status: 'in-use',
  },
  {
    id: 'bm-06',
    name: 'tk-bm-npu-01',
    source: 'baremetal',
    platform: 'Ironic',
    spec: 'Xeon Gold 6430 × 2 (64C) · 512 GiB',
    accelerator: 'Rebellions ATOM × 8',
    ip: '10.70.62.31',
    status: 'available',
  },
  {
    id: 'bm-07',
    name: 'tk-bm-npu-02',
    source: 'baremetal',
    platform: 'Ironic',
    spec: 'Xeon Gold 6430 × 2 (64C) · 512 GiB',
    accelerator: 'Rebellions ATOM × 8',
    ip: '10.70.62.32',
    status: 'agent-missing',
  },
  {
    id: 'bm-08',
    name: 'tk-bm-cpu-01',
    source: 'baremetal',
    platform: 'Ironic',
    spec: 'Xeon Gold 6434H × 2 (64C) · 1 TiB',
    accelerator: '—',
    ip: '10.70.62.41',
    status: 'available',
  },
];

const NODE_STATUS_LABEL: Record<NodeStatus, string> = {
  available: 'Available',
  'in-use': 'In use',
  'agent-missing': 'No agent',
  unreachable: 'Unreachable',
};

const NODE_STATUS_THEME: Record<NodeStatus, 'green' | 'gray' | 'yellow' | 'red'> = {
  available: 'green',
  'in-use': 'gray',
  'agent-missing': 'yellow',
  unreachable: 'red',
};

const NODE_SOURCE_LABEL: Record<NodeSource, string> = {
  vm: 'Virtual machine',
  baremetal: 'Bare metal',
};

/** 노드를 어디서 미리 만들어 오는지. "여기서는 안 만든다"를 알려 줄 때 쓴다. */
const NODE_SOURCE_ORIGIN: Record<NodeSource, string> = {
  vm: 'Compute',
  baremetal: 'Cloud Builder',
};

/* ----------------------------------------
   작은 조각들
   ---------------------------------------- */

/** 이 값이 왜 잠겼는지 알려 주는 배지. */
function LockedBadge({ reason }: { reason: string }) {
  return (
    <Badge theme="gray" size="sm" leftIcon={<IconLock size={12} stroke={1.5} />}>
      {reason}
    </Badge>
  );
}

/* ----------------------------------------
   Component
   ---------------------------------------- */

export function CreateClusterDraftPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  /* 용도 — 폼 맨 앞이다 */
  const availableUsages = useAvailableUsages();
  const [usage, setUsage] = useState<ClusterUsage>(availableUsages[0]);
  const preset = USAGE_PRESETS[usage];

  /* Basic information */
  const [clusterName, setClusterName] = useState('');
  const [kubernetesVersion, setKubernetesVersion] = useState('v1.34');
  const [containerNetwork, setContainerNetwork] = useState('cilium');
  const [description, setDescription] = useState('');

  /* 노드를 어디서 가져오는가 — Capsis가 고르는 유일한 갈림길이다 */
  const [nodeSource, setNodeSource] = useState<NodeSource>('vm');

  /* 고른 노드 */
  const [cpNodeIds, setCpNodeIds] = useState<string[]>([]);
  const [workerNodeIds, setWorkerNodeIds] = useState<string[]>([]);
  const [cpSearch, setCpSearch] = useState('');
  const [workerSearch, setWorkerSearch] = useState('');

  /* 설치 옵션 */
  const [accelerator, setAccelerator] = useState<Accelerator>('none');
  const [etcdDiskType, setEtcdDiskType] = useState<'external' | 'local'>('external');
  const [etcdVolumeType, setEtcdVolumeType] = useState('ceph');
  const [etcdVolumeSize, setEtcdVolumeSize] = useState(10);

  /* Labels & annotations */
  const [labels, setLabels] = useState<Label[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const sidebarWidth = sidebarOpen ? 240 : 40;

  /* ----------------------------------------
     용도를 바꾸면 그 용도가 정해 둔 값으로 맞춘다
     ---------------------------------------- */

  const handleUsageChange = useCallback((next: ClusterUsage) => {
    setUsage(next);
    const nextPreset = USAGE_PRESETS[next];
    if (nextPreset.lockedKubernetesVersion) {
      setKubernetesVersion(nextPreset.lockedKubernetesVersion);
    }
    if (nextPreset.lockedContainerNetwork) {
      setContainerNetwork(nextPreset.lockedContainerNetwork);
    }
    if (!nextPreset.acceleratorRequired) {
      setAccelerator('none');
    } else if (next === 'Maxis') {
      // 학습은 여러 장을 묶어 쓰기 때문에 GPU가 기본이다.
      setAccelerator('gpu');
    }
    // 가속기가 바뀌면 워커 후보가 달라진다. 고른 것을 비운다.
    setWorkerNodeIds([]);
  }, []);

  /** 노드를 가져오는 곳이 바뀌면 고른 것을 비운다. 다른 목록에서 고른 것이기 때문이다. */
  const handleNodeSourceChange = useCallback((next: NodeSource) => {
    setNodeSource(next);
    setCpNodeIds([]);
    setWorkerNodeIds([]);
  }, []);

  /* ----------------------------------------
     파생값
     ---------------------------------------- */

  const sourceNodes = useMemo(
    () => mockRegisteredNodes.filter((n) => n.source === nodeSource),
    [nodeSource]
  );

  /** 컨트롤 플레인 후보. 가속기는 워커 쪽 문제라 여기서는 거르지 않는다. */
  const cpCandidates = useMemo(
    () => sourceNodes.filter((n) => matchesSearch(n, cpSearch)),
    [sourceNodes, cpSearch]
  );

  /** 워커 후보. 가속기를 골랐으면 그것이 달린 노드만 남긴다. */
  const workerCandidates = useMemo(() => {
    const byAccelerator = sourceNodes.filter((n) => {
      if (accelerator === 'gpu') return n.accelerator.includes('NVIDIA');
      if (accelerator === 'npu') return n.accelerator.includes('Rebellions');
      return true;
    });
    return byAccelerator.filter((n) => matchesSearch(n, workerSearch));
  }, [sourceNodes, accelerator, workerSearch]);

  const cpNodeTotal = cpNodeIds.length;
  const workerNodeTotal = workerNodeIds.length;
  const cpCountIsEven = cpNodeTotal > 0 && cpNodeTotal % 2 === 0;

  /** 고른 노드가 여러 플랫폼에 걸쳐 있는가. OpenStack 의존성이 미결이라 알려만 준다. */
  const mixedPlatforms = useMemo(() => {
    const picked = [...cpNodeIds, ...workerNodeIds]
      .map((id) => mockRegisteredNodes.find((n) => n.id === id)?.platform)
      .filter(Boolean);
    return new Set(picked).size > 1;
  }, [cpNodeIds, workerNodeIds]);

  /* ----------------------------------------
     Labels & annotations 편집
     ---------------------------------------- */

  const addLabel = useCallback(() => {
    setLabels((prev) => [...prev, { id: `${prev.length}-${Date.now()}`, key: '', value: '' }]);
  }, []);
  const removeLabel = useCallback((id: string) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
  }, []);
  const updateLabel = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }, []);

  const addAnnotation = useCallback(() => {
    setAnnotations((prev) => [...prev, { id: `${prev.length}-${Date.now()}`, key: '', value: '' }]);
  }, []);
  const removeAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);
  const updateAnnotation = useCallback((id: string, field: 'key' | 'value', value: string) => {
    setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  }, []);

  /* ----------------------------------------
     노드 표
     ---------------------------------------- */

  const nodeColumns: TableColumn<RegisteredNode>[] = [
    { key: 'name', label: 'Name', flex: 1, minWidth: columnMinWidths.hostname },
    { key: 'platform', label: 'Platform', flex: 1, minWidth: columnMinWidths.vendor },
    { key: 'spec', label: 'Spec', flex: 1, minWidth: columnMinWidths.description },
    { key: 'accelerator', label: 'Accelerator', flex: 1, minWidth: columnMinWidths.deviceName },
    { key: 'ip', label: 'IP', flex: 1, minWidth: columnMinWidths.ip },
    {
      key: 'status',
      label: 'Status',
      width: fixedColumns.statusLabel,
      align: 'center',
      resizable: false,
      render: (_v, row) => (
        <Badge theme={NODE_STATUS_THEME[row.status]} size="sm">
          {NODE_STATUS_LABEL[row.status]}
        </Badge>
      ),
    },
  ];

  /** 고를 수 있는 노드인가. 에이전트가 없거나 닿지 않으면 쿠버네티스를 깔 방법이 없다. */
  const isNodeSelectableFor = (role: 'cp' | 'worker') => (row: RegisteredNode) => {
    if (row.status !== 'available') return false;
    const takenByOther = role === 'cp' ? workerNodeIds : cpNodeIds;
    return !takenByOther.includes(row.id);
  };

  /* ----------------------------------------
     Actions
     ---------------------------------------- */

  const handleCreate = () => {
    console.log('Creating cluster (draft):', {
      usage,
      clusterName,
      kubernetesVersion,
      containerNetwork,
      nodeSource,
      cpNodeIds,
      workerNodeIds,
      accelerator,
      etcdDiskType,
      etcdVolumeType,
      etcdVolumeSize,
      labels,
      annotations,
    });
    navigate('/container/cluster-management');
  };

  const handleCancel = () => navigate('/container/cluster-management');

  /* ----------------------------------------
     노드 고르는 블록 — 컨트롤 플레인과 워커가 같은 모양이다
     ---------------------------------------- */

  const renderNodePicker = (role: 'cp' | 'worker') => {
    const isCp = role === 'cp';
    const candidates = isCp ? cpCandidates : workerCandidates;
    const selectedIds = isCp ? cpNodeIds : workerNodeIds;
    const setSelectedIds = isCp ? setCpNodeIds : setWorkerNodeIds;
    const search = isCp ? cpSearch : workerSearch;
    const setSearch = isCp ? setCpSearch : setWorkerSearch;

    return (
      <FormField>
        <FormField.Label>
          <span className="inline-flex items-center gap-1 align-middle">
            <span>
              Nodes
              <span className="ml-0.5 text-[var(--color-state-danger)]">*</span>
            </span>
            <Tooltip
              content="Pick from machines that are already registered. The number you pick is the node count."
              position="right"
            >
              <IconInfoCircle size={14} className="text-[var(--color-text-subtle)]" />
            </Tooltip>
          </span>
        </FormField.Label>
        <FormField.Description>
          {isCp
            ? 'Pick the machines that will run the control plane. etcd quorum requires an odd number.'
            : 'Pick the machines that will run the workloads.'}{' '}
          Only nodes with the agent registered, and not already taken by the other role, can be
          picked.
        </FormField.Description>
        <FormField.Control className="mt-[var(--primitive-spacing-3)]">
          <VStack gap={3}>
            <SearchInput
              placeholder="Search nodes by attributes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[var(--search-input-width)]"
            />
            <Pagination
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
              totalItems={candidates.length}
              selectedCount={selectedIds.length}
            />
            <Table
              columns={nodeColumns}
              data={candidates}
              rowKey="id"
              selectable
              selectionType="checkbox"
              selectedKeys={selectedIds}
              onSelectionChange={setSelectedIds}
              isRowSelectable={isNodeSelectableFor(role)}
              emptyMessage={
                !isCp && accelerator !== 'none'
                  ? 'No registered node has that accelerator. Prepare one first, or change the accelerator.'
                  : `No registered node to display. Prepare machines in ${NODE_SOURCE_ORIGIN[nodeSource]} and install the agent first.`
              }
            />
            <SelectionIndicator
              selectedItems={selectedIds.map((id) => ({
                id,
                label: mockRegisteredNodes.find((n) => n.id === id)?.name ?? id,
              }))}
              emptyText="No node selected"
              onRemove={(id) => setSelectedIds(selectedIds.filter((v) => v !== id))}
            />
            {isCp && cpCountIsEven && (
              <InlineMessage variant="warning">
                Control plane nodes must be an odd number. {cpNodeTotal} are selected.
              </InlineMessage>
            )}
          </VStack>
        </FormField.Control>
      </FormField>
    );
  };

  /* ----------------------------------------
     Render
     ---------------------------------------- */

  return (
    <PageShell
      sidebar={
        <ClusterManagementSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabs.map((tab) => ({ id: tab.id, label: tab.label, closable: tab.closable }))}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          showNavigation={true}
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Cluster management', href: '/container/cluster-management' },
                { label: 'Clusters', href: '/container/cluster-management' },
                { label: 'Create cluster (draft)' },
              ]}
            />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      {/* Header */}
      <VStack gap={2} className="mb-6">
        <h1 className="text-heading-h4 leading-7 font-semibold text-[var(--color-text-default)]">
          Create cluster
        </h1>
        <p className="text-body-md leading-4 text-[var(--color-text-subtle)]">
          Build a cluster from machines that already exist. The agent on each machine installs
          Kubernetes — this form does not create the machines.
        </p>
      </VStack>

      <div className="flex gap-6">
        {/* Left Column — Form.
            min-w-0이 없으면 노드 표(컬럼 6개)가 폼 너비를 밀어내 오른쪽 요약이 화면 밖으로 나간다.
            표는 자기 안에서 가로로 스크롤된다. */}
        <div className="flex-1 min-w-0 flex flex-col gap-[16px]">
          {/* ① Usage type — 기반보다 먼저 정한다 */}
          <SectionCard className="pb-4">
            <SectionCard.Header title="Usage type" />
            <SectionCard.Content>
              <FormField required>
                <FormField.Label>What is this cluster for</FormField.Label>
                <FormField.Description>
                  Decide this first. It changes what you can pick below and what the in-cluster
                  agent installs
                  {preset.agentPackages.length > 0 && ` — ${preset.agentPackages.join(', ')}`}.
                  {availableUsages.length < 3 && ' Usages you cannot use are not listed.'}
                </FormField.Description>
                <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                  <RadioGroup
                    value={usage}
                    onChange={(value) => handleUsageChange(value as ClusterUsage)}
                  >
                    {availableUsages.map((option) => (
                      <Radio
                        key={option}
                        value={option}
                        label={
                          <HStack gap={2} align="center">
                            <span className="text-label-md">
                              {USAGE_OPTION_LABELS[option].title}
                            </span>
                            <span className="text-body-md text-[var(--color-text-subtle)]">
                              {USAGE_OPTION_LABELS[option].detail}
                            </span>
                          </HStack>
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormField.Control>
              </FormField>
            </SectionCard.Content>
          </SectionCard>

          {/* ② Basic information */}
          <SectionCard className="pb-4">
            <SectionCard.Header title="Basic information" />
            <SectionCard.Content>
              <VStack gap={6}>
                <FormField required>
                  <FormField.Label>Name</FormField.Label>
                  <FormField.Control>
                    <Input
                      placeholder="Enter a unique name"
                      value={clusterName}
                      onChange={(e) => setClusterName(e.target.value)}
                      fullWidth
                    />
                  </FormField.Control>
                </FormField>

                <FormField required>
                  <FormField.Label>
                    <span className="inline-flex items-center gap-2 align-middle">
                      Kubernetes version
                      {preset.lockedKubernetesVersion && (
                        <LockedBadge reason={preset.lockReason ?? 'Set by the usage'} />
                      )}
                    </span>
                  </FormField.Label>
                  <FormField.Description>
                    {preset.lockedKubernetesVersion
                      ? `Set to the version ${usage} has verified. The value stays visible so you can still see what the cluster was built with.`
                      : 'Choose the Kubernetes version the agent will install. The latest supported version is recommended unless you need a specific one.'}
                  </FormField.Description>
                  <FormField.Control>
                    <Select
                      options={kubernetesVersionOptions}
                      value={kubernetesVersion}
                      onChange={setKubernetesVersion}
                      fullWidth
                      disabled={Boolean(preset.lockedKubernetesVersion)}
                    />
                  </FormField.Control>
                </FormField>

                <FormField required>
                  <FormField.Label>
                    <span className="inline-flex items-center gap-2 align-middle">
                      Container network
                      {preset.lockedContainerNetwork && (
                        <LockedBadge reason={preset.lockReason ?? 'Set by the usage'} />
                      )}
                    </span>
                  </FormField.Label>
                  <FormField.Description>
                    Cilium is the only supported CNI plugin. It is selected automatically.
                  </FormField.Description>
                  <FormField.Control>
                    <Select
                      options={containerNetworkOptions}
                      value={containerNetwork}
                      onChange={setContainerNetwork}
                      fullWidth
                      disabled
                    />
                  </FormField.Control>
                </FormField>

                <FormField>
                  <FormField.Label>Description</FormField.Label>
                  <FormField.Control>
                    <Input
                      placeholder="Enter a description (optional)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      fullWidth
                    />
                  </FormField.Control>
                </FormField>
              </VStack>
            </SectionCard.Content>
          </SectionCard>

          {/* ③ Node source — Capsis가 고르는 유일한 갈림길 */}
          <SectionCard className="pb-4">
            <SectionCard.Header title="Node source" />
            <SectionCard.Content>
              <VStack gap={4}>
                <FormField required>
                  <FormField.Label>Where the nodes come from</FormField.Label>
                  <FormField.Description>
                    Both run Linux and take the same agent, so everything after this is the same.
                    Only the machines you can pick change.
                  </FormField.Description>
                  <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                    <RadioGroup
                      value={nodeSource}
                      onChange={(value) => handleNodeSourceChange(value as NodeSource)}
                    >
                      <Radio value="vm" label="Virtual machine — prepared in Compute beforehand" />
                      <Radio
                        value="baremetal"
                        label="Bare metal — registered through Cloud Builder"
                      />
                    </RadioGroup>
                  </FormField.Control>
                </FormField>

                <InlineMessage variant="info">
                  This form does not create machines. Prepare them in{' '}
                  {NODE_SOURCE_ORIGIN[nodeSource]}, install the agent, and they appear in the lists
                  below.
                </InlineMessage>
              </VStack>
            </SectionCard.Content>
          </SectionCard>

          {/* ④ Control plane */}
          <SectionCard className="pb-4">
            <SectionCard.Header
              title="Control plane"
              actions={
                <Badge theme="gray" size="sm">
                  {NODE_SOURCE_LABEL[nodeSource]}
                </Badge>
              }
            />
            <SectionCard.Content>
              <VStack gap={6}>
                {renderNodePicker('cp')}

                <div className="h-px bg-[var(--color-border-default)]" />

                <FormField required>
                  <FormField.Label>etcd disk</FormField.Label>
                  <FormField.Description>
                    Choose where the agent puts etcd data when it installs Kubernetes.
                  </FormField.Description>
                  <FormField.Control>
                    <RadioGroup
                      value={etcdDiskType}
                      onChange={(value) => setEtcdDiskType(value as 'external' | 'local')}
                    >
                      <Radio
                        value="external"
                        label={
                          <HStack gap={1} align="center">
                            External (recommended)
                            <Tooltip
                              content="External disks use independent storage resources."
                              position="right"
                            >
                              <IconHelpCircle
                                size={14}
                                className="text-[var(--color-text-subtle)]"
                              />
                            </Tooltip>
                          </HStack>
                        }
                      />
                      <Radio value="local" label="Local — use the disk already on the node" />
                    </RadioGroup>
                  </FormField.Control>
                </FormField>

                {etcdDiskType === 'external' && (
                  <>
                    <FormField required>
                      <FormField.Label>etcd volume type</FormField.Label>
                      <FormField.Control>
                        <Select
                          options={[
                            { value: 'ceph', label: 'ceph' },
                            { value: 'local', label: 'local' },
                            { value: 'nfs', label: 'nfs' },
                          ]}
                          value={etcdVolumeType}
                          onChange={setEtcdVolumeType}
                          fullWidth
                        />
                      </FormField.Control>
                    </FormField>

                    <FormField required>
                      <FormField.Label>etcd volume size</FormField.Label>
                      <FormField.Control>
                        <HStack gap={3} align="center">
                          <Slider
                            min={10}
                            max={100}
                            step={5}
                            value={etcdVolumeSize}
                            onChange={setEtcdVolumeSize}
                          />
                          <NumberInput
                            value={etcdVolumeSize}
                            onChange={setEtcdVolumeSize}
                            min={10}
                            max={100}
                            step={1}
                            width="xs"
                            suffix="GiB"
                          />
                        </HStack>
                      </FormField.Control>
                      <FormField.HelperText>10-100 GiB</FormField.HelperText>
                    </FormField>
                  </>
                )}
              </VStack>
            </SectionCard.Content>
          </SectionCard>

          {/* ⑤ Worker nodes */}
          <SectionCard className="pb-4">
            <SectionCard.Header
              title="Worker nodes"
              actions={
                <Badge theme="gray" size="sm">
                  {NODE_SOURCE_LABEL[nodeSource]}
                </Badge>
              }
            />
            <SectionCard.Content>
              <VStack gap={6}>
                <FormField required={preset.acceleratorRequired}>
                  <FormField.Label>Accelerator</FormField.Label>
                  <FormField.Description>
                    What the in-cluster agent installs depends on this — gpu-operator for GPU, the
                    Rebellions packages for NPU. Picking one narrows the node list below to machines
                    that have it.
                    {preset.acceleratorRequired
                      ? ` A ${usage} cluster must pick one.`
                      : ' General purpose clusters may skip it.'}
                  </FormField.Description>
                  <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                    <RadioGroup
                      value={accelerator}
                      onChange={(value) => {
                        setAccelerator(value as Accelerator);
                        setWorkerNodeIds([]);
                      }}
                    >
                      {!preset.acceleratorRequired && (
                        <Radio value="none" label="None — CPU only" />
                      )}
                      <Radio value="gpu" label="GPU — NVIDIA (gpu-operator)" />
                      <Radio value="npu" label="NPU — Rebellions ATOM (vllm-rbln)" />
                    </RadioGroup>
                  </FormField.Control>
                </FormField>

                <div className="h-px bg-[var(--color-border-default)]" />

                {renderNodePicker('worker')}
              </VStack>
            </SectionCard.Content>
          </SectionCard>

          {/* ⑥ Labels & annotations — 전용 용도면 접어 둔다 */}
          <SectionCard className="pb-4">
            <SectionCard.Header title="Labels & annotations" />
            <SectionCard.Content>
              {preset.collapseLabels ? (
                <Disclosure defaultOpen={false}>
                  <DisclosureTrigger>
                    <span className="inline-flex items-center gap-2">
                      <span className="text-label-md text-[var(--color-text-default)]">
                        Open this if you want to add labels or annotations yourself
                      </span>
                      <Badge theme="gray" size="sm">
                        Collapsed for {usage} clusters
                      </Badge>
                    </span>
                  </DisclosureTrigger>
                  <DisclosurePanel>
                    <div className="pt-4">
                      {renderLabelsEditor({
                        labels,
                        annotations,
                        addLabel,
                        removeLabel,
                        updateLabel,
                        addAnnotation,
                        removeAnnotation,
                        updateAnnotation,
                      })}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              ) : (
                renderLabelsEditor({
                  labels,
                  annotations,
                  addLabel,
                  removeLabel,
                  updateLabel,
                  addAnnotation,
                  removeAnnotation,
                  updateAnnotation,
                })
              )}
            </SectionCard.Content>
          </SectionCard>
        </div>

        {/* Right Column — Summary */}
        <div className="w-[var(--wizard-summary-width)] shrink-0 sticky top-4 self-start">
          <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-lg p-4 flex flex-col gap-6">
            <WizardSummary
              items={[
                { key: 'usage', label: `Usage type — ${usage}`, status: 'done' },
                {
                  key: 'basic',
                  label: clusterName ? `Name — ${clusterName}` : 'Basic information',
                  status: clusterName ? 'done' : 'active',
                },
                {
                  key: 'source',
                  label: `Node source — ${NODE_SOURCE_LABEL[nodeSource]}`,
                  status: 'done',
                },
                {
                  key: 'cp',
                  label: `Control plane — ${cpNodeTotal} nodes`,
                  status: cpNodeTotal > 0 && !cpCountIsEven ? 'done' : 'active',
                },
                {
                  key: 'worker',
                  label: `Worker — ${workerNodeTotal} nodes`,
                  status: workerNodeTotal > 0 ? 'done' : 'active',
                },
                {
                  key: 'labels',
                  label: 'Labels & annotations',
                  status: preset.collapseLabels ? 'skipped' : 'active',
                },
              ]}
            />

            {mixedPlatforms && (
              <InlineMessage variant="warning">
                The selected nodes come from more than one platform. Make sure they reach the same
                network.
              </InlineMessage>
            )}

            <HStack gap={2} className="w-full justify-end">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreate}
                className="flex-1 min-w-[80px]"
                disabled={
                  !clusterName || cpNodeTotal === 0 || cpCountIsEven || workerNodeTotal === 0
                }
              >
                Create
              </Button>
            </HStack>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

/** 노드 표의 검색. 이름·플랫폼·스펙·IP 어디에 걸려도 남긴다. */
function matchesSearch(node: RegisteredNode, keyword: string) {
  return [node.name, node.platform, node.spec, node.ip]
    .join(' ')
    .toLowerCase()
    .includes(keyword.toLowerCase());
}

/* ----------------------------------------
   Labels & annotations 편집기 — 접었을 때와 폈을 때 같은 것을 쓴다
   ---------------------------------------- */

interface LabelsEditorProps {
  labels: Label[];
  annotations: Annotation[];
  addLabel: () => void;
  removeLabel: (id: string) => void;
  updateLabel: (id: string, field: 'key' | 'value', value: string) => void;
  addAnnotation: () => void;
  removeAnnotation: (id: string) => void;
  updateAnnotation: (id: string, field: 'key' | 'value', value: string) => void;
}

function renderLabelsEditor({
  labels,
  annotations,
  addLabel,
  removeLabel,
  updateLabel,
  addAnnotation,
  removeAnnotation,
  updateAnnotation,
}: LabelsEditorProps) {
  const rows = (
    items: (Label | Annotation)[],
    kind: 'label' | 'annotation',
    onUpdate: (id: string, field: 'key' | 'value', value: string) => void,
    onRemove: (id: string) => void
  ) => (
    <VStack gap={1.5}>
      {items.length > 0 && (
        <div className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full">
          <span className="block text-label-sm text-[var(--color-text-default)]">Key</span>
          <span className="block text-label-sm text-[var(--color-text-default)]">Value</span>
          <div className="w-5" />
        </div>
      )}
      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-[1fr_1fr_20px] gap-1 w-full items-center">
          <Input
            placeholder={`${kind} key`}
            value={item.key}
            onChange={(e) => onUpdate(item.id, 'key', e.target.value)}
            fullWidth
          />
          <Input
            placeholder={`${kind} value`}
            value={item.value}
            onChange={(e) => onUpdate(item.id, 'value', e.target.value)}
            fullWidth
          />
          <button
            onClick={() => onRemove(item.id)}
            className="size-5 flex items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors"
          >
            <IconX size={16} className="text-[var(--color-text-muted)]" stroke={1.5} />
          </button>
        </div>
      ))}
    </VStack>
  );

  return (
    <VStack gap={6}>
      <VStack gap={3}>
        <VStack gap={1.5}>
          <span className="text-label-lg text-[var(--color-text-default)]">Labels</span>
          <p className="text-body-md text-[var(--color-text-subtle)]">
            Specify the labels used to identify and categorize the resource.
          </p>
        </VStack>
        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
          <VStack gap={1.5}>
            {rows(labels, 'label', updateLabel, removeLabel)}
            <div className="w-fit">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                onClick={addLabel}
              >
                Add label
              </Button>
            </div>
          </VStack>
        </div>
      </VStack>

      <VStack gap={3}>
        <VStack gap={1.5}>
          <span className="text-label-lg text-[var(--color-text-default)]">Annotations</span>
          <p className="text-body-md text-[var(--color-text-subtle)] leading-4">
            Specify the annotations used to provide additional metadata for the resource.
          </p>
        </VStack>
        <div className="bg-[var(--color-surface-subtle)] rounded-[6px] px-4 py-3 w-full">
          <VStack gap={1.5}>
            {rows(annotations, 'annotation', updateAnnotation, removeAnnotation)}
            <div className="w-fit">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<IconCirclePlus size={12} stroke={1.5} />}
                onClick={addAnnotation}
              >
                Add annotation
              </Button>
            </div>
          </VStack>
        </div>
      </VStack>
    </VStack>
  );
}

export default CreateClusterDraftPage;
