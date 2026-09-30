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
import { IconX, IconCirclePlus, IconInfoCircle, IconHelpCircle } from '@tabler/icons-react';
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
  Badge,
  Disclosure,
  DisclosureTrigger,
  DisclosurePanel,
  Modal,
  columnMinWidths,
} from '@/design-system';
import type { TableColumn } from '@/design-system/components/Table/Table';
import { ClusterManagementSidebar } from '@/components/ClusterManagementSidebar';
import { useTabs } from '@/contexts/TabContext';
import { useAvailableUsages, type ClusterUsage } from '@/pages/containerEntitlement';
import { createCluster, useCreatedClusters } from '@/pages/capsisProvisioningStore';

/* ----------------------------------------
   Types
   ---------------------------------------- */

/** Capsis가 고르는 것은 이 하나뿐이다 — VM에서 가져올 것이냐, 베어메탈에서 가져올 것이냐. */
type NodeSource = 'vm' | 'baremetal';

/**
 * 노드의 상태. 화면에는 보여 주지 않고, `available`인 노드만 목록에 올린다.
 * 에이전트가 없거나 닿지 않거나 다른 클러스터가 쓰면 쿠버네티스를 깔 수 없다.
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
  /** Labels & annotations를 접어 둘 것인가 */
  collapseLabels: boolean;
  /** 클러스터 안 에이전트가 깔 것 */
  agentPackages: string[];
}

const USAGE_PRESETS: Record<ClusterUsage, UsagePreset> = {
  General: {
    collapseLabels: false,
    agentPackages: [],
  },
  // AI Inference와 AI Training은 같은 클러스터를 함께 쓴다(CAPSIS-D-94). 둘이 쓰는 것을 모두 깐다.
  'AI Workload': {
    collapseLabels: false,
    agentPackages: ['AI workload agent', 'gpu-operator or vllm-rbln', 'Kueue'],
  },
};

const USAGE_OPTION_LABELS: Record<ClusterUsage, { title: string; detail: string }> = {
  General: {
    title: 'General',
    detail: 'General workloads',
  },
  'AI Workload': { title: 'AI Workload', detail: 'AI inference and training only' },
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
/** 칸 제목 옆 info 아이콘. 설명은 제목 아래에 늘어놓지 않고 이 툴팁에 둔다. */
function InfoLabel({ label, required, tip }: { label: string; required?: boolean; tip: string }) {
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <span>
        {label}
        {required && <span className="ml-0.5 text-[var(--color-state-danger)]">*</span>}
      </span>
      <Tooltip content={tip} position="right">
        <IconInfoCircle size={14} className="text-[var(--color-text-subtle)]" />
      </Tooltip>
    </span>
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
  // 노드 수를 먼저 정하고, 표에서는 그 수만큼만 고른다. 허용값은 현행과 같은 1·3·5·7([ACONT-42]).
  const [cpNodeCount, setCpNodeCount] = useState(3);
  const [workerNodeCount, setWorkerNodeCount] = useState(1);
  const [cpSearch, setCpSearch] = useState('');
  const [workerSearch, setWorkerSearch] = useState('');

  /* 설치 옵션 */
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

  /** 고를 수 있는 노드만 목록에 올린다 — 에이전트가 등록돼 있고, 닿고, 다른 클러스터가 쓰지 않는 것. */
  // 목업에서 방금 만든 클러스터가 고른 노드도 「다른 클러스터가 쓰는 노드」로 본다.
  const createdClusters = useCreatedClusters();
  const availableNodes = useMemo(() => {
    const taken = new Set(createdClusters.flatMap((c) => c.nodes.map((n) => n.id)));
    return sourceNodes.filter((n) => n.status === 'available' && !taken.has(n.id));
  }, [sourceNodes, createdClusters]);

  /** 컨트롤 플레인 후보. 가속기는 워커 쪽 문제라 여기서는 거르지 않는다. 워커로 고른 노드는 뺀다. */
  const cpCandidates = useMemo(
    () => availableNodes.filter((n) => !workerNodeIds.includes(n.id) && matchesSearch(n, cpSearch)),
    [availableNodes, workerNodeIds, cpSearch]
  );

  /** 워커 후보. 컨트롤 플레인으로 고른 노드는 뺀다.
      가속기는 따로 고르지 않는다 — 고른 노드에 달린 가속기(표의 Accelerator 칼럼)로 에이전트가 설치할 것을 정한다. */
  const workerCandidates = useMemo(
    () => availableNodes.filter((n) => !cpNodeIds.includes(n.id) && matchesSearch(n, workerSearch)),
    [availableNodes, cpNodeIds, workerSearch]
  );

  const cpNodeTotal = cpNodeIds.length;
  const workerNodeTotal = workerNodeIds.length;
  const cpComplete = cpNodeTotal === cpNodeCount;
  const workerComplete = workerNodeTotal === workerNodeCount;

  /** 고른 노드가 여러 플랫폼에 걸쳐 있는가. OpenStack 의존성이 미결이라 알려만 준다. */

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
    { key: 'spec', label: 'Spec', flex: 1, minWidth: columnMinWidths.description },
    { key: 'accelerator', label: 'Accelerator', flex: 1, minWidth: columnMinWidths.deviceName },
    { key: 'ip', label: 'IP', flex: 1, minWidth: columnMinWidths.ip },
  ];

  /** 정한 노드 수를 채우면 더 고를 수 없다. 이미 고른 것은 풀 수 있다. */
  const isNodeSelectableFor = (role: 'cp' | 'worker') => (row: RegisteredNode) => {
    const selected = role === 'cp' ? cpNodeIds : workerNodeIds;
    const limit = role === 'cp' ? cpNodeCount : workerNodeCount;
    return selected.includes(row.id) || selected.length < limit;
  };

  /** 노드 수를 줄이면 넘치는 선택은 뒤에서부터 푼다. 1·3·5·7만 허용한다. */
  const toOddCount = (v: number) => {
    const clamped = Math.min(7, Math.max(1, v));
    return clamped % 2 === 0 ? clamped - 1 : clamped;
  };
  const changeNodeCount = (role: 'cp' | 'worker', v: number) => {
    const next = toOddCount(v);
    if (role === 'cp') {
      setCpNodeCount(next);
      setCpNodeIds((ids) => ids.slice(0, next));
    } else {
      setWorkerNodeCount(next);
      setWorkerNodeIds((ids) => ids.slice(0, next));
    }
  };

  /* ----------------------------------------
     Actions
     ---------------------------------------- */

  /* 배포 확인 — 에이전트가 권한을 올릴 때 쓸 sudo 비밀번호를 여기서 받는다(CAPSIS-D-79).
     폼에 두지 않는 이유: 이 값은 이번 배포에만 쓰고 저장하지 않으므로, 폼을 채우는 동안
     들고 있지 않고 누르는 순간에만 받는다. 노드는 사용자가 따로 만든 VM이라 값이 다를 수 있다. */
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [passwordScope, setPasswordScope] = useState<'same' | 'per-node'>('same');
  const [sharedPassword, setSharedPassword] = useState('');
  const [nodePasswords, setNodePasswords] = useState<Record<string, string>>({});
  const pickedNodes = [...cpNodeIds, ...workerNodeIds]
    .map((id) => mockRegisteredNodes.find((n) => n.id === id))
    .filter((n): n is RegisteredNode => Boolean(n));
  const passwordsReady =
    passwordScope === 'same'
      ? sharedPassword.length > 0
      : pickedNodes.every((n) => (nodePasswords[n.id] ?? '').length > 0);

  const handleCreate = () => {
    setSharedPassword('');
    setNodePasswords({});
    setPasswordScope('same');
    setIsDeployOpen(true);
  };

  const handleDeploy = () => {
    const toInput = (id: string) => {
      const n = mockRegisteredNodes.find((m) => m.id === id)!;
      return { id: n.id, name: n.name, spec: n.spec, accelerator: n.accelerator, ip: n.ip };
    };
    createCluster({
      name: clusterName,
      usage,
      nodeSource,
      kubernetesVersion,
      containerNetwork,
      controlPlane: cpNodeIds.map(toInput),
      workers: workerNodeIds.map(toInput),
    });
    // 받은 비밀번호는 넘긴 뒤 바로 비운다 — 저장하지 않는다.
    setSharedPassword('');
    setNodePasswords({});
    setIsDeployOpen(false);
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

    const count = isCp ? cpNodeCount : workerNodeCount;

    return (
      <VStack gap={6}>
        <FormField>
          <FormField.Label>
            <InfoLabel
              label="Node count"
              required
              tip={
                isCp
                  ? 'An odd number of control plane nodes is required to maintain etcd quorum.'
                  : 'Specify how many worker nodes to include in the cluster.'
              }
            />
          </FormField.Label>
          <FormField.Control>
            <HStack gap={3} align="center">
              <Slider
                min={1}
                max={7}
                step={2}
                value={count}
                onChange={(v) => changeNodeCount(role, v)}
              />
              <NumberInput
                value={count}
                onChange={(v) => changeNodeCount(role, v)}
                min={1}
                max={7}
                step={2}
                width="xs"
              />
            </HStack>
          </FormField.Control>
        </FormField>

        <FormField>
          <FormField.Label>
            <InfoLabel
              label="Nodes"
              required
              tip={
                (isCp
                  ? 'Machines that run the control plane. '
                  : 'Machines that run the workloads. ') +
                'Only machines with the agent registered, reachable, and not used by another cluster or the other role are listed. Pick as many as the node count.'
              }
            />
          </FormField.Label>
          <FormField.Control className="mt-[var(--primitive-spacing-3)]">
            <VStack gap={3}>
              <SearchInput
                placeholder="Search nodes by attributes"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[var(--search-input-width)]"
              />
              <HStack gap={3} align="center" className="w-full justify-between">
                <Pagination
                  currentPage={1}
                  totalPages={1}
                  onPageChange={() => {}}
                  totalItems={candidates.length}
                  selectedCount={selectedIds.length}
                />
                {/* 고른 수 / 정한 노드 수 — 표 위에서 바로 보이게 한다 */}
                <span className="text-body-md text-[var(--color-text-subtle)] shrink-0">
                  {selectedIds.length} / {count} nodes
                </span>
              </HStack>
              <Table
                columns={nodeColumns}
                data={candidates}
                rowKey="id"
                selectable
                selectionType="checkbox"
                selectedKeys={selectedIds}
                onSelectionChange={setSelectedIds}
                isRowSelectable={isNodeSelectableFor(role)}
                emptyMessage="No available nodes."
              />
              <SelectionIndicator
                selectedItems={selectedIds.map((id) => ({
                  id,
                  label: mockRegisteredNodes.find((n) => n.id === id)?.name ?? id,
                }))}
                emptyText="No node selected"
                onRemove={(id) => setSelectedIds(selectedIds.filter((v) => v !== id))}
              />
            </VStack>
          </FormField.Control>
        </FormField>
      </VStack>
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
              <FormField>
                <FormField.Label>
                  <InfoLabel
                    label="Usage type"
                    required
                    tip={
                      'The usage decides what the in-cluster agent installs' +
                      (preset.agentPackages.length > 0
                        ? ` — ${preset.agentPackages.join(', ')}.`
                        : '.') +
                      (availableUsages.length < 2 ? ' Usages you cannot use are not listed.' : '')
                    }
                  />
                </FormField.Label>
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

                <FormField>
                  <FormField.Label>
                    <InfoLabel
                      label="Kubernetes version"
                      required
                      tip="The Kubernetes version the agent installs. The latest supported version is recommended unless you need a specific one."
                    />
                  </FormField.Label>
                  <FormField.Control>
                    <Select
                      options={kubernetesVersionOptions}
                      value={kubernetesVersion}
                      onChange={setKubernetesVersion}
                      fullWidth
                    />
                  </FormField.Control>
                </FormField>

                <FormField>
                  <FormField.Label>
                    <InfoLabel
                      label="Container network"
                      required
                      tip="Cilium is the only supported CNI plugin. It is selected automatically."
                    />
                  </FormField.Label>
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
                <FormField>
                  <FormField.Label>
                    <InfoLabel
                      label="Node source"
                      required
                      tip="This form does not create machines. It lists virtual machines prepared in Compute or bare metal registered through Cloud Builder, with the agent installed. Both run Linux and take the same agent, so only the machines you can pick change."
                    />
                  </FormField.Label>
                  <FormField.Control className="mt-[var(--primitive-spacing-3)]">
                    <RadioGroup
                      value={nodeSource}
                      onChange={(value) => handleNodeSourceChange(value as NodeSource)}
                    >
                      <Radio value="vm" label="Virtual machine" />
                      <Radio value="baremetal" label="Bare metal" />
                    </RadioGroup>
                  </FormField.Control>
                </FormField>
              </VStack>
            </SectionCard.Content>
          </SectionCard>

          {/* ④ Control plane */}
          <SectionCard className="pb-4">
            <SectionCard.Header title="Control plane" />
            <SectionCard.Content>
              <VStack gap={6}>
                {renderNodePicker('cp')}

                <div className="h-px bg-[var(--color-border-default)]" />

                <FormField>
                  <FormField.Label>
                    <InfoLabel
                      label="etcd disk"
                      required
                      tip="Where the agent puts etcd data when it installs Kubernetes."
                    />
                  </FormField.Label>
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
            <SectionCard.Header title="Worker nodes" />
            <SectionCard.Content>
              <VStack gap={6}>{renderNodePicker('worker')}</VStack>
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
                        Labels ({labels.length}) · Annotations ({annotations.length})
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
                // TDS Floating Card Configuration 영역 — 섹션 이름과 상태 아이콘만 둔다. 고른 값은 넣지 않는다.
                { key: 'usage', label: 'Usage type', status: 'done' },
                {
                  key: 'basic',
                  label: 'Basic information',
                  status: clusterName ? 'done' : 'active',
                },
                { key: 'source', label: 'Node source', status: 'done' },
                {
                  key: 'cp',
                  label: 'Control plane',
                  status: cpComplete ? 'done' : 'active',
                },
                {
                  key: 'worker',
                  label: 'Worker nodes',
                  status: workerComplete ? 'done' : 'active',
                },
                {
                  key: 'labels',
                  label: 'Labels & annotations',
                  status: preset.collapseLabels ? 'skipped' : 'active',
                },
              ]}
            />

            <HStack gap={2} className="w-full justify-end">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCreate}
                className="flex-1 min-w-[80px]"
                disabled={!clusterName || !cpComplete || !workerComplete}
              >
                Create
              </Button>
            </HStack>
          </div>
        </div>
      </div>

      {/* ---------- 배포 확인 — sudo 비밀번호 ---------- */}
      <Modal
        isOpen={isDeployOpen}
        onClose={() => setIsDeployOpen(false)}
        title="Deploy cluster"
        description={`The agent installs Kubernetes on ${pickedNodes.length} nodes.`}
      >
        <VStack gap={4} className="w-[520px] max-w-full">
          <FormField>
            <FormField.Label>
              <InfoLabel
                label="Sudo password"
                required
                tip="The agent runs without root. It uses this password only for the steps that need elevated privileges. The password is used for this deployment and is not stored."
              />
            </FormField.Label>
            <FormField.Control className="mt-[var(--primitive-spacing-3)]">
              <RadioGroup
                value={passwordScope}
                onChange={(value) => setPasswordScope(value as 'same' | 'per-node')}
              >
                <Radio value="same" label="Same password for all nodes" />
                <Radio value="per-node" label="Different password per node" />
              </RadioGroup>
            </FormField.Control>
          </FormField>

          {passwordScope === 'same' ? (
            <Input
              type="password"
              placeholder="Enter the sudo password"
              value={sharedPassword}
              onChange={(e) => setSharedPassword(e.target.value)}
              fullWidth
            />
          ) : (
            <VStack gap={3}>
              {pickedNodes.map((n) => (
                <FormField key={n.id}>
                  <FormField.Label>{n.name}</FormField.Label>
                  <FormField.Control>
                    <Input
                      type="password"
                      placeholder="Enter the sudo password"
                      value={nodePasswords[n.id] ?? ''}
                      onChange={(e) =>
                        setNodePasswords((prev) => ({ ...prev, [n.id]: e.target.value }))
                      }
                      fullWidth
                    />
                  </FormField.Control>
                </FormField>
              ))}
            </VStack>
          )}

          <HStack gap={2} className="w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setIsDeployOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              disabled={!passwordsReady}
              onClick={handleDeploy}
            >
              Deploy
            </Button>
          </HStack>
        </VStack>
      </Modal>
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
