import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  VStack,
  HStack,
  Button,
  Badge,
  Select,
  NumberInput,
  PageHeader,
  PageShell,
  TabBar,
  TopBar,
  TopBarAction,
  Breadcrumb,
} from '@/design-system';
import { AIPlatformSidebar } from '@/components/AIPlatformSidebar';
import { useTabs } from '@/contexts/TabContext';
import {
  IconBrain,
  IconCloud,
  IconRobot,
  IconCheck,
  IconAlertCircle,
  IconLoader2,
  IconChevronDown,
  IconEdit,
  IconPlayerPlay,
  IconArrowRight,
  IconArrowLeft,
  IconServer,
  IconDatabase,
  IconShield,
  IconBox,
  IconCpu,
  IconBell,
} from '@tabler/icons-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Intent = 'finetune' | 'serverless' | 'rag';
type Phase = 'intent' | 'requirements' | 'plan' | 'executing' | 'done';
type StepStatus = 'pending' | 'running' | 'done' | 'skipped';

interface PlanStep {
  id: string;
  service: string;
  serviceColor: string;
  title: string;
  endpoint: string;
  params: Record<string, string | number>;
  durationMs: number;
  status: StepStatus;
}

interface EnvCheck {
  label: string;
  exists: boolean;
  detail: string;
}

interface RequirementsState {
  finetune: { model: string; datasource: string; gpuCount: number; storageGiB: number };
  serverless: { model: string; maxReplicas: number; autoScale: boolean };
  rag: { datasource: string; embeddingModel: string; llm: string };
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const PHASE_ORDER: Phase[] = ['intent', 'requirements', 'plan', 'executing', 'done'];

function getDirection(prev: Phase, next: Phase): number {
  return PHASE_ORDER.indexOf(next) >= PHASE_ORDER.indexOf(prev) ? 1 : -1;
}

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -60 }),
};

const slideTransition = { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] };

// ---------------------------------------------------------------------------
// Scenario plan data (real API-based)
// ---------------------------------------------------------------------------

const SERVICE_COLORS: Record<string, string> = {
  IAM: 'var(--color-state-info)',
  Container: 'var(--color-state-success)',
  Storage: 'var(--color-state-warning)',
  'AI Platform': '#a78bfa',
  'Agent Platform': '#e879f9',
};

function buildEnvChecks(intent: Intent): EnvCheck[] {
  const base: EnvCheck[] = [
    { label: 'IAM 프로젝트', exists: true, detail: 'proj-ai-team (존재함)' },
    { label: 'K8s 클러스터', exists: false, detail: '없음 → 생성 필요' },
    { label: 'GPU Flavor (A100)', exists: true, detail: 'gpu.a100.1 (존재함)' },
  ];
  if (intent === 'finetune' || intent === 'rag') {
    base.push({ label: '학습 데이터 볼륨', exists: false, detail: '없음 → 생성 필요' });
  }
  return base;
}

function buildPlanSteps(intent: Intent, reqs: RequirementsState): PlanStep[] {
  if (intent === 'finetune') {
    const r = reqs.finetune;
    return [
      {
        id: 'cluster',
        service: 'Container',
        serviceColor: SERVICE_COLORS.Container,
        title: 'K8s 클러스터 생성',
        endpoint: 'POST /v1/container/clusters',
        params: {
          name: 'ai-finetune-cluster',
          k8s_version: 'v1.34',
          cni: 'kube-ovn',
          worker_count: 2,
          flavor: 'gpu.a100.1',
        },
        durationMs: 3500,
        status: 'pending',
      },
      {
        id: 'namespace',
        service: 'Container',
        serviceColor: SERVICE_COLORS.Container,
        title: '네임스페이스 생성',
        endpoint: 'POST /v1/container/namespaces',
        params: { name: 'ai-workspace', pod_security: 'baseline' },
        durationMs: 1200,
        status: 'pending',
      },
      {
        id: 'quota',
        service: 'Container',
        serviceColor: SERVICE_COLORS.Container,
        title: '리소스 쿼터 설정',
        endpoint: 'POST /v1/container/resource-quotas',
        params: { cpu: 16, memory: '64Gi', gpu: r.gpuCount },
        durationMs: 800,
        status: 'pending',
      },
      {
        id: 'pvc',
        service: 'Storage',
        serviceColor: SERVICE_COLORS.Storage,
        title: 'PVC 생성 (학습 데이터)',
        endpoint: 'POST /v1/container/pvc',
        params: {
          name: 'training-data',
          storage_class: 'ceph-block',
          capacity: `${r.storageGiB}Gi`,
          access_mode: 'ReadWriteOnce',
        },
        durationMs: 1500,
        status: 'pending',
      },
      {
        id: 'finetune',
        service: 'AI Platform',
        serviceColor: SERVICE_COLORS['AI Platform'],
        title: '파인튜닝 잡 생성',
        endpoint: 'POST /v1/ai-platform/fine-tune',
        params: {
          base_model: r.model,
          method: 'LoRA',
          gpu: r.gpuCount,
          datasource: r.datasource,
          dataset_volume: 'training-data',
        },
        durationMs: 2000,
        status: 'pending',
      },
      {
        id: 'endpoint',
        service: 'AI Platform',
        serviceColor: SERVICE_COLORS['AI Platform'],
        title: '서버리스 엔드포인트 예약',
        endpoint: 'POST /v1/ai-platform/serverless',
        params: {
          name: `${r.model.toLowerCase().replace(/\//g, '-')}-ft`,
          type: 'public',
          gpu: 1,
          replicas: '0-1',
          deploy_after: 'finetune-complete',
        },
        durationMs: 1000,
        status: 'pending',
      },
    ];
  }

  if (intent === 'serverless') {
    const r = reqs.serverless;
    return [
      {
        id: 'cluster-check',
        service: 'Container',
        serviceColor: SERVICE_COLORS.Container,
        title: '기존 클러스터 확인',
        endpoint: 'GET /v1/container/clusters',
        params: { filter: 'gpu-enabled=true' },
        durationMs: 800,
        status: 'pending',
      },
      {
        id: 'namespace',
        service: 'Container',
        serviceColor: SERVICE_COLORS.Container,
        title: '네임스페이스 생성',
        endpoint: 'POST /v1/container/namespaces',
        params: { name: 'inference-prod', pod_security: 'restricted' },
        durationMs: 1000,
        status: 'pending',
      },
      {
        id: 'endpoint',
        service: 'AI Platform',
        serviceColor: SERVICE_COLORS['AI Platform'],
        title: '서버리스 엔드포인트 생성',
        endpoint: 'POST /v1/ai-platform/serverless',
        params: {
          name: `${r.model.toLowerCase().replace(/\//g, '-')}-serve`,
          model: r.model,
          type: 'public',
          gpu: 1,
          replicas: r.autoScale ? `0-${r.maxReplicas}` : `1-${r.maxReplicas}`,
          port: 8000,
        },
        durationMs: 2500,
        status: 'pending',
      },
    ];
  }

  const r = reqs.rag;
  return [
    {
      id: 'cluster',
      service: 'Container',
      serviceColor: SERVICE_COLORS.Container,
      title: 'K8s 클러스터 생성',
      endpoint: 'POST /v1/container/clusters',
      params: { name: 'rag-cluster', k8s_version: 'v1.34', cni: 'kube-ovn', worker_count: 2 },
      durationMs: 3500,
      status: 'pending',
    },
    {
      id: 'pvc',
      service: 'Storage',
      serviceColor: SERVICE_COLORS.Storage,
      title: 'PVC 생성 (문서 저장소)',
      endpoint: 'POST /v1/container/pvc',
      params: { name: 'rag-documents', capacity: '100Gi', access_mode: 'ReadWriteMany' },
      durationMs: 1500,
      status: 'pending',
    },
    {
      id: 'datasource',
      service: 'Agent Platform',
      serviceColor: SERVICE_COLORS['Agent Platform'],
      title: '데이터소스 연결',
      endpoint: 'POST /v1/agent/datasources',
      params: {
        name: 'enterprise-docs',
        type: r.datasource,
        chunking: 'semantic',
        embedding_model: r.embeddingModel,
      },
      durationMs: 2000,
      status: 'pending',
    },
    {
      id: 'agent',
      service: 'Agent Platform',
      serviceColor: SERVICE_COLORS['Agent Platform'],
      title: 'AI 에이전트 생성',
      endpoint: 'POST /v1/agent/agents',
      params: {
        name: 'enterprise-rag-agent',
        model: r.llm,
        temperature: 0.3,
        datasource: 'enterprise-docs',
        max_iteration: 5,
      },
      durationMs: 1500,
      status: 'pending',
    },
    {
      id: 'chat',
      service: 'Agent Platform',
      serviceColor: SERVICE_COLORS['Agent Platform'],
      title: '채팅 인터페이스 활성화',
      endpoint: 'PATCH /v1/agent/agents/:id',
      params: { status: 'active', websocket: true },
      durationMs: 800,
      status: 'pending',
    },
  ];
}

// ---------------------------------------------------------------------------
// Intent card data
// ---------------------------------------------------------------------------

const INTENT_CARDS: {
  id: Intent;
  icon: typeof IconBrain;
  title: string;
  desc: string;
  tags: string[];
}[] = [
  {
    id: 'finetune',
    icon: IconBrain,
    title: 'LLM 파인튜닝',
    desc: '사내 데이터로 기반 모델을 미세조정하고, 완료 후 서버리스 엔드포인트로 자동 배포합니다.',
    tags: ['Fine-tune', 'LoRA', 'GPU'],
  },
  {
    id: 'serverless',
    icon: IconCloud,
    title: '서버리스 추론 배포',
    desc: '오픈소스 LLM을 서버리스 엔드포인트로 즉시 배포합니다. 트래픽에 따라 자동 스케일합니다.',
    tags: ['Serverless', 'vLLM', 'Auto-scale'],
  },
  {
    id: 'rag',
    icon: IconRobot,
    title: 'RAG 에이전트 구축',
    desc: '사내 문서를 학습한 AI 에이전트를 만들고, 채팅 인터페이스로 즉시 사용합니다.',
    tags: ['RAG', 'Agent', 'MCP'],
  },
];

const MODEL_OPTIONS = [
  { value: 'Qwen/Qwen3-4B', label: 'Qwen3-4B' },
  { value: 'Qwen/Qwen3-8B', label: 'Qwen3-8B' },
  { value: 'meta-llama/Llama-3.3-70B', label: 'Llama 3.3 70B' },
  { value: 'mistralai/Mistral-7B-v0.3', label: 'Mistral 7B' },
];

const DATASOURCE_OPTIONS = [
  { value: 'File', label: 'File (로컬 파일)' },
  { value: 'Postgres', label: 'PostgreSQL' },
  { value: 'Google@storage', label: 'Google Cloud Storage' },
];

const EMBEDDING_OPTIONS = [
  { value: 'jina-embeddings-v3', label: 'Jina Embeddings v3' },
  { value: 'bge-m3', label: 'BGE-M3' },
];

const LLM_OPTIONS = [
  { value: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'Qwen/Qwen3-8B', label: 'Qwen3-8B (On-premise)' },
];

// ---------------------------------------------------------------------------
// Phase stepper
// ---------------------------------------------------------------------------

const STEPPER_STEPS = [
  { key: 'intent', label: '의도 선택' },
  { key: 'requirements', label: '요구사항' },
  { key: 'plan', label: '플랜 확인' },
  { key: 'execute', label: '실행' },
] as const;

function phaseToStepIndex(phase: Phase): number {
  switch (phase) {
    case 'intent':
      return 0;
    case 'requirements':
      return 1;
    case 'plan':
      return 2;
    case 'executing':
    case 'done':
      return 3;
  }
}

function PhaseStepper({ phase }: { phase: Phase }) {
  const activeIdx = phaseToStepIndex(phase);
  const isExecuting = phase === 'executing';

  return (
    <div className="flex items-center w-full">
      {STEPPER_STEPS.map((step, i) => {
        const isDone = i < activeIdx || (i === activeIdx && phase === 'done');
        const isActive = i === activeIdx && phase !== 'done';
        const isRunning = isActive && isExecuting;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-initial">
            {/* Node */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-body-sm font-medium transition-all duration-300 ${
                  isDone
                    ? 'bg-[var(--color-action-primary)] text-white'
                    : isActive
                      ? 'bg-[var(--color-action-primary)] text-white ring-4 ring-[var(--color-action-primary)]/20'
                      : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-disabled)] border border-[var(--color-border-default)]'
                }`}
              >
                {isDone ? (
                  <IconCheck size={14} />
                ) : isRunning ? (
                  <IconLoader2 size={14} className="animate-spin" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-body-sm whitespace-nowrap transition-colors duration-200 ${
                  isDone || isActive
                    ? 'text-[var(--color-text-default)] font-medium'
                    : 'text-[var(--color-text-disabled)]'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPPER_STEPS.length - 1 && (
              <div className="flex-1 h-px mx-3 mt-[-18px]">
                <div
                  className="h-full transition-colors duration-300"
                  style={{
                    backgroundColor:
                      i < activeIdx ? 'var(--color-action-primary)' : 'var(--color-border-default)',
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ServiceIcon({ service }: { service: string }) {
  const size = 14;
  switch (service) {
    case 'IAM':
      return <IconShield size={size} />;
    case 'Container':
      return <IconBox size={size} />;
    case 'Storage':
      return <IconDatabase size={size} />;
    case 'AI Platform':
      return <IconCpu size={size} />;
    case 'Agent Platform':
      return <IconRobot size={size} />;
    default:
      return <IconServer size={size} />;
  }
}

function IntentCard({
  card,
  selected,
  onClick,
}: {
  card: (typeof INTENT_CARDS)[0];
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = card.icon;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`flex flex-col gap-3 p-5 rounded-[var(--primitive-radius-lg)] border-2 transition-colors duration-200 cursor-pointer text-left w-full ${
        selected
          ? 'border-[var(--color-action-primary)] bg-[var(--color-state-info-bg)]'
          : 'border-[var(--color-border-default)] bg-[var(--color-surface-default)] hover:border-[var(--color-border-strong)]'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-[var(--primitive-radius-md)] flex items-center justify-center transition-colors duration-200 ${
          selected
            ? 'bg-[var(--color-action-primary)] text-white'
            : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]'
        }`}
      >
        <Icon size={20} stroke={1.5} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-heading-h6 text-[var(--color-text-default)]">{card.title}</span>
        <span className="text-body-sm text-[var(--color-text-subtle)]">{card.desc}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {card.tags.map((t) => (
          <Badge key={t} size="sm" variant={selected ? 'info' : 'default'}>
            {t}
          </Badge>
        ))}
      </div>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Timeline step row
// ---------------------------------------------------------------------------

function TimelineNode({ status }: { status: StepStatus }) {
  if (status === 'done') {
    return (
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        className="w-6 h-6 rounded-full bg-[var(--color-state-success)] flex items-center justify-center shrink-0"
      >
        <IconCheck size={12} className="text-white" />
      </motion.div>
    );
  }
  if (status === 'running') {
    return (
      <div className="w-6 h-6 rounded-full bg-[var(--color-state-info)] flex items-center justify-center shrink-0 relative">
        <div className="absolute inset-0 rounded-full bg-[var(--color-state-info)] animate-ping opacity-30" />
        <IconLoader2 size={12} className="text-white animate-spin" />
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full border-2 border-[var(--color-border-default)] bg-[var(--color-surface-default)] shrink-0" />
  );
}

function TimelineStepRow({
  step,
  index,
  isLast,
  editing,
  onToggleEdit,
  onParamChange,
}: {
  step: PlanStep;
  index: number;
  isLast: boolean;
  editing: boolean;
  onToggleEdit: () => void;
  onParamChange: (key: string, value: string | number) => void;
}) {
  return (
    <div className="flex gap-3">
      {/* Timeline column */}
      <div className="flex flex-col items-center">
        <TimelineNode status={step.status} />
        {!isLast && (
          <div
            className="w-px flex-1 min-h-[16px] transition-colors duration-500"
            style={{
              backgroundColor:
                step.status === 'done'
                  ? 'var(--color-state-success)'
                  : 'var(--color-border-default)',
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-5 ${isLast ? 'pb-0' : ''}`}>
        <div
          className={`rounded-[var(--primitive-radius-md)] px-4 py-3 transition-colors duration-300 ${
            step.status === 'running'
              ? 'bg-[var(--color-state-info-bg)]'
              : step.status === 'done'
                ? 'bg-[var(--color-state-success-bg)]'
                : 'bg-[var(--color-surface-subtle)]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className="text-body-sm text-[var(--color-text-subtle)] font-mono w-4">
              {index + 1}.
            </span>
            <span
              className="text-body-sm font-medium px-1.5 py-0.5 rounded-[var(--primitive-radius-sm)] inline-flex items-center gap-1"
              style={{ backgroundColor: step.serviceColor + '18', color: step.serviceColor }}
            >
              <ServiceIcon service={step.service} />
              {step.service}
            </span>
            <span className="text-body-md text-[var(--color-text-default)] font-medium">
              {step.title}
            </span>
            {step.status === 'pending' && (
              <button
                onClick={onToggleEdit}
                className="ml-auto text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] cursor-pointer transition-colors"
              >
                {editing ? <IconChevronDown size={14} /> : <IconEdit size={12} />}
              </button>
            )}
          </div>

          {/* Endpoint + params */}
          <div className="mt-1.5 ml-5">
            <code className="text-body-sm font-mono text-[var(--color-text-subtle)]">
              {step.endpoint}
            </code>
            <div className="mt-1 flex flex-col gap-0.5">
              {Object.entries(step.params).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <span className="text-body-sm font-mono text-[var(--color-text-disabled)] w-[140px]">
                    {k}:
                  </span>
                  {editing && step.status === 'pending' ? (
                    <input
                      className="text-body-sm font-mono bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-sm)] px-1.5 py-0.5 text-[var(--color-text-default)] w-[200px]"
                      value={String(v)}
                      onChange={(e) => onParamChange(k, e.target.value)}
                    />
                  ) : (
                    <span className="text-body-sm font-mono text-[var(--color-state-info)]">
                      {String(v)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function AIWorkspacePrototypePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? 200 : 0;
  const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = useTabs();

  const [phase, setPhase] = useState<Phase>('intent');
  const [prevPhase, setPrevPhase] = useState<Phase>('intent');
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [requirements, setRequirements] = useState<RequirementsState>({
    finetune: { model: 'Qwen/Qwen3-4B', datasource: 'File', gpuCount: 1, storageGiB: 50 },
    serverless: { model: 'Qwen/Qwen3-4B', maxReplicas: 3, autoScale: true },
    rag: { datasource: 'File', embeddingModel: 'jina-embeddings-v3', llm: 'claude-sonnet-4-5' },
  });
  const [planSteps, setPlanSteps] = useState<PlanStep[]>([]);
  const [envChecks, setEnvChecks] = useState<EnvCheck[]>([]);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const executionRef = useRef(false);

  const direction = getDirection(prevPhase, phase);
  const totalEstimate = planSteps.reduce((s, p) => s + p.durationMs, 0);
  const completedSteps = planSteps.filter((s) => s.status === 'done').length;

  const changePhase = useCallback(
    (next: Phase) => {
      setPrevPhase(phase);
      setPhase(next);
    },
    [phase]
  );

  const goToRequirements = useCallback(() => {
    if (!selectedIntent) return;
    changePhase('requirements');
  }, [selectedIntent, changePhase]);

  const generatePlan = useCallback(() => {
    if (!selectedIntent) return;
    setIsGenerating(true);
    setTimeout(() => {
      setEnvChecks(buildEnvChecks(selectedIntent));
      setPlanSteps(buildPlanSteps(selectedIntent, requirements));
      setIsGenerating(false);
      changePhase('plan');
    }, 1500);
  }, [selectedIntent, requirements, changePhase]);

  const executePlan = useCallback(() => {
    if (executionRef.current) return;
    executionRef.current = true;
    changePhase('executing');

    let currentIdx = 0;
    const runNext = () => {
      if (currentIdx >= planSteps.length) {
        changePhase('done');
        executionRef.current = false;
        return;
      }
      setPlanSteps((prev) =>
        prev.map((s, i) => (i === currentIdx ? { ...s, status: 'running' as StepStatus } : s))
      );
      const duration = planSteps[currentIdx].durationMs;
      setTimeout(() => {
        setPlanSteps((prev) =>
          prev.map((s, i) => (i === currentIdx ? { ...s, status: 'done' as StepStatus } : s))
        );
        currentIdx++;
        setTimeout(runNext, 300);
      }, duration);
    };
    runNext();
  }, [planSteps, changePhase]);

  const resetAll = useCallback(() => {
    setPrevPhase(phase);
    setPhase('intent');
    setSelectedIntent(null);
    setPlanSteps([]);
    setEnvChecks([]);
    setEditingStepId(null);
    executionRef.current = false;
  }, [phase]);

  const handleParamChange = useCallback((stepId: string, key: string, value: string | number) => {
    setPlanSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, params: { ...s.params, [key]: value } } : s))
    );
  }, []);

  const intentLabel = selectedIntent
    ? INTENT_CARDS.find((c) => c.id === selectedIntent)?.title
    : '';

  const tabBarTabs = tabs.map((t) => ({ id: t.id, label: t.label, closable: t.closable }));

  return (
    <PageShell
      sidebar={
        <AIPlatformSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      }
      sidebarWidth={sidebarWidth}
      tabBar={
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTabId}
          onTabChange={selectTab}
          onTabClose={closeTab}
          onTabAdd={addNewTab}
          onTabReorder={moveTab}
          showAddButton
          showWindowControls
          onWindowClose={() => navigate('/')}
        />
      }
      topBar={
        <TopBar
          showSidebarToggle={!sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(true)}
          showNavigation
          onBack={() => window.history.back()}
          onForward={() => window.history.forward()}
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'AI Platform', href: '/ai-platform' },
                { label: 'AI Workspace Setup' },
              ]}
            />
          }
          actions={
            <TopBarAction icon={<IconBell size={16} stroke={1.5} />} aria-label="Notifications" />
          }
        />
      }
      contentClassName="pt-4 px-8 pb-20"
    >
      <VStack gap={5} className="max-w-[860px]">
        <PageHeader
          title="AI Workspace Setup"
          titleExtra={
            phase !== 'intent' && selectedIntent ? (
              <Badge variant="info" size="sm">
                {intentLabel}
              </Badge>
            ) : undefined
          }
          actions={
            phase !== 'intent' ? (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<IconArrowLeft size={12} />}
                onClick={resetAll}
              >
                처음으로
              </Button>
            ) : undefined
          }
        />

        <p className="text-body-md text-[var(--color-text-subtle)] -mt-2">
          AI 워크로드에 필요한 인프라를 자동으로 구성합니다. 의도만 전달하면 Container, Storage, AI
          Platform을 한 번에 세팅합니다.
        </p>

        {/* Phase stepper */}
        <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] px-6 py-4">
          <PhaseStepper phase={phase} />
        </div>

        {/* Phase content with animations */}
        <AnimatePresence mode="wait" custom={direction}>
          {/* Phase 1: Intent selection */}
          {phase === 'intent' && (
            <motion.div
              key="intent"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
            >
              <VStack gap={4}>
                <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                  무엇을 하고 싶으신가요?
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {INTENT_CARDS.map((card) => (
                    <IntentCard
                      key={card.id}
                      card={card}
                      selected={selectedIntent === card.id}
                      onClick={() => setSelectedIntent(card.id)}
                    />
                  ))}
                </div>
                <HStack justify="end" className="w-full pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    disabled={!selectedIntent}
                    onClick={goToRequirements}
                    rightIcon={<IconArrowRight size={12} />}
                  >
                    다음
                  </Button>
                </HStack>
              </VStack>
            </motion.div>
          )}

          {/* Phase 2: Requirements input */}
          {phase === 'requirements' && selectedIntent && (
            <motion.div
              key="requirements"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
            >
              <VStack gap={4}>
                <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                  기본 요구사항을 입력해주세요
                </h3>
                <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-5">
                  <VStack gap={5}>
                    {selectedIntent === 'finetune' && (
                      <>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-label-sm text-[var(--color-text-default)] block mb-2">
                              Base 모델
                            </label>
                            <Select
                              options={MODEL_OPTIONS}
                              value={requirements.finetune.model}
                              onChange={(v) =>
                                setRequirements((p) => ({
                                  ...p,
                                  finetune: { ...p.finetune, model: v },
                                }))
                              }
                              fullWidth
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-label-sm text-[var(--color-text-default)] block mb-2">
                              데이터소스
                            </label>
                            <Select
                              options={DATASOURCE_OPTIONS}
                              value={requirements.finetune.datasource}
                              onChange={(v) =>
                                setRequirements((p) => ({
                                  ...p,
                                  finetune: { ...p.finetune, datasource: v },
                                }))
                              }
                              fullWidth
                            />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-label-sm text-[var(--color-text-default)] block mb-2">
                              GPU 수
                            </label>
                            <NumberInput
                              min={1}
                              max={8}
                              step={1}
                              value={requirements.finetune.gpuCount}
                              onChange={(v) =>
                                setRequirements((p) => ({
                                  ...p,
                                  finetune: { ...p.finetune, gpuCount: v ?? 1 },
                                }))
                              }
                              width="xs"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-label-sm text-[var(--color-text-default)] block mb-2">
                              스토리지 (GiB)
                            </label>
                            <NumberInput
                              min={10}
                              max={1000}
                              step={10}
                              value={requirements.finetune.storageGiB}
                              onChange={(v) =>
                                setRequirements((p) => ({
                                  ...p,
                                  finetune: { ...p.finetune, storageGiB: v ?? 50 },
                                }))
                              }
                              width="xs"
                              suffix="GiB"
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {selectedIntent === 'serverless' && (
                      <>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-label-sm text-[var(--color-text-default)] block mb-2">
                              모델
                            </label>
                            <Select
                              options={MODEL_OPTIONS}
                              value={requirements.serverless.model}
                              onChange={(v) =>
                                setRequirements((p) => ({
                                  ...p,
                                  serverless: { ...p.serverless, model: v },
                                }))
                              }
                              fullWidth
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-label-sm text-[var(--color-text-default)] block mb-2">
                              최대 레플리카
                            </label>
                            <NumberInput
                              min={1}
                              max={10}
                              step={1}
                              value={requirements.serverless.maxReplicas}
                              onChange={(v) =>
                                setRequirements((p) => ({
                                  ...p,
                                  serverless: { ...p.serverless, maxReplicas: v ?? 1 },
                                }))
                              }
                              width="xs"
                            />
                          </div>
                        </div>
                        <label className="flex items-center gap-2 text-label-sm text-[var(--color-text-default)] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={requirements.serverless.autoScale}
                            onChange={(e) =>
                              setRequirements((p) => ({
                                ...p,
                                serverless: { ...p.serverless, autoScale: e.target.checked },
                              }))
                            }
                            className="accent-[var(--color-action-primary)]"
                          />
                          0부터 오토스케일 (비사용 시 비용 절감)
                        </label>
                      </>
                    )}
                    {selectedIntent === 'rag' && (
                      <>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="text-label-sm text-[var(--color-text-default)] block mb-2">
                              데이터소스 타입
                            </label>
                            <Select
                              options={DATASOURCE_OPTIONS}
                              value={requirements.rag.datasource}
                              onChange={(v) =>
                                setRequirements((p) => ({ ...p, rag: { ...p.rag, datasource: v } }))
                              }
                              fullWidth
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-label-sm text-[var(--color-text-default)] block mb-2">
                              임베딩 모델
                            </label>
                            <Select
                              options={EMBEDDING_OPTIONS}
                              value={requirements.rag.embeddingModel}
                              onChange={(v) =>
                                setRequirements((p) => ({
                                  ...p,
                                  rag: { ...p.rag, embeddingModel: v },
                                }))
                              }
                              fullWidth
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-label-sm text-[var(--color-text-default)] block mb-2">
                            LLM
                          </label>
                          <Select
                            options={LLM_OPTIONS}
                            value={requirements.rag.llm}
                            onChange={(v) =>
                              setRequirements((p) => ({ ...p, rag: { ...p.rag, llm: v } }))
                            }
                            fullWidth
                          />
                        </div>
                      </>
                    )}
                  </VStack>
                </div>
                <HStack justify="between" className="w-full pt-2">
                  <Button
                    variant="ghost"
                    size="md"
                    leftIcon={<IconArrowLeft size={12} />}
                    onClick={() => changePhase('intent')}
                  >
                    이전
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={generatePlan}
                    rightIcon={<IconArrowRight size={12} />}
                  >
                    플랜 생성
                  </Button>
                </HStack>
              </VStack>
            </motion.div>
          )}

          {/* Phase 3 / 4: Plan + Execution + Done */}
          {(phase === 'plan' || phase === 'executing' || phase === 'done') && (
            <motion.div
              key="plan"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
            >
              <VStack gap={4}>
                {/* Env checks */}
                <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-4">
                  <VStack gap={3}>
                    <h4 className="text-heading-h5 text-[var(--color-text-default)]">환경 분석</h4>
                    <div className="flex flex-col gap-1.5">
                      {envChecks.map((c, i) => (
                        <HStack key={i} gap={2} align="center">
                          {c.exists ? (
                            <IconCheck size={14} className="text-[var(--color-state-success)]" />
                          ) : (
                            <IconAlertCircle
                              size={14}
                              className="text-[var(--color-state-warning)]"
                            />
                          )}
                          <span className="text-body-sm text-[var(--color-text-default)]">
                            {c.label}:
                          </span>
                          <span className="text-body-sm text-[var(--color-text-subtle)]">
                            {c.detail}
                          </span>
                        </HStack>
                      ))}
                    </div>
                  </VStack>
                </div>

                {/* Plan steps with timeline */}
                <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-lg)] p-4">
                  <VStack gap={3}>
                    <HStack justify="between" align="center" className="w-full">
                      <h4 className="text-heading-h5 text-[var(--color-text-default)]">
                        실행 계획
                        <span className="text-body-sm text-[var(--color-text-subtle)] ml-2">
                          {planSteps.length}개 단계 · 예상 ~{Math.ceil(totalEstimate / 1000)}초
                        </span>
                      </h4>
                      {(phase === 'executing' || phase === 'done') && (
                        <Badge variant={phase === 'done' ? 'success' : 'info'} size="sm">
                          {phase === 'done' ? '완료' : `${completedSteps}/${planSteps.length}`}
                        </Badge>
                      )}
                    </HStack>

                    {/* Progress bar */}
                    {(phase === 'executing' || phase === 'done') && (
                      <div className="w-full h-1 bg-[var(--color-surface-subtle)] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(completedSteps / planSteps.length) * 100}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          style={{
                            backgroundColor:
                              phase === 'done'
                                ? 'var(--color-state-success)'
                                : 'var(--color-state-info)',
                          }}
                        />
                      </div>
                    )}

                    {/* Timeline */}
                    <div className="flex flex-col">
                      {planSteps.map((step, i) => (
                        <TimelineStepRow
                          key={step.id}
                          step={step}
                          index={i}
                          isLast={i === planSteps.length - 1}
                          editing={editingStepId === step.id}
                          onToggleEdit={() =>
                            setEditingStepId(editingStepId === step.id ? null : step.id)
                          }
                          onParamChange={(k, v) => handleParamChange(step.id, k, v)}
                        />
                      ))}
                    </div>
                  </VStack>
                </div>

                {/* Actions */}
                {phase === 'plan' && (
                  <HStack justify="between" className="w-full pt-2">
                    <Button
                      variant="ghost"
                      size="md"
                      leftIcon={<IconArrowLeft size={12} />}
                      onClick={() => changePhase('requirements')}
                    >
                      요구사항 수정
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      leftIcon={<IconPlayerPlay size={12} />}
                      onClick={executePlan}
                    >
                      승인하고 실행
                    </Button>
                  </HStack>
                )}

                {/* Done state */}
                {phase === 'done' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-[var(--color-state-success-bg)] border border-[var(--color-state-success)] rounded-[var(--primitive-radius-lg)] p-5"
                  >
                    <VStack gap={3} align="center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.3 }}
                        className="w-12 h-12 rounded-full bg-[var(--color-state-success)] flex items-center justify-center"
                      >
                        <IconCheck size={24} className="text-white" />
                      </motion.div>
                      <h3 className="text-heading-h5 text-[var(--color-text-default)]">
                        AI Workspace 준비 완료
                      </h3>
                      <p className="text-body-md text-[var(--color-text-subtle)] text-center">
                        {selectedIntent === 'finetune' &&
                          '파인튜닝 잡이 시작되었습니다. 완료 후 서버리스 엔드포인트가 자동 배포됩니다.'}
                        {selectedIntent === 'serverless' &&
                          '서버리스 엔드포인트가 배포되었습니다. API 키를 발급받아 사용할 수 있습니다.'}
                        {selectedIntent === 'rag' &&
                          'RAG 에이전트가 활성화되었습니다. 채팅 인터페이스에서 대화를 시작하세요.'}
                      </p>
                      <HStack gap={2}>
                        <Button variant="secondary" size="md" onClick={resetAll}>
                          새 워크스페이스 만들기
                        </Button>
                        <Button
                          variant="primary"
                          size="md"
                          rightIcon={<IconArrowRight size={12} />}
                        >
                          {selectedIntent === 'rag'
                            ? 'Agent Platform으로 이동'
                            : 'AI Platform으로 이동'}
                        </Button>
                      </HStack>
                    </VStack>
                  </motion.div>
                )}
              </VStack>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading overlay for plan generation */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-[var(--color-surface-default)] rounded-[var(--primitive-radius-xl)] p-8 flex flex-col items-center gap-4 shadow-2xl"
              >
                <IconLoader2
                  size={32}
                  className="text-[var(--color-action-primary)] animate-spin"
                />
                <VStack gap={1} align="center">
                  <span className="text-heading-h5 text-[var(--color-text-default)]">
                    환경을 분석하고 있습니다...
                  </span>
                  <span className="text-body-sm text-[var(--color-text-subtle)]">
                    IAM · Container · Storage · AI Platform 상태 확인 중
                  </span>
                </VStack>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </VStack>
    </PageShell>
  );
}
