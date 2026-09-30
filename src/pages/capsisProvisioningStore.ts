/* ----------------------------------------
   Capsis 클러스터 만들기 — 만든 뒤의 진행 상태 (목업 전용)

   만들기 개정안(create-draft)에서 Create를 누르면 여기에 클러스터가 하나 생기고,
   목록과 상세가 같은 값을 읽는다. 에이전트가 노드마다 설치 단계를 밟는 모습을
   타이머로 흉내 낸다 — 실제 단계 이름과 보고 방식은 에이전트 설계가 정한다
   (CAPSIS-D-77~D-79, 2026-08-28 회의 §2-3 「스크립트 단계별 추적」).

   - 이름에 `fail`이 들어가면 첫 워커가 쿠버네티스 설치 단계에서 실패한다.
     실패 화면과 Retry를 보여 주려는 장치다.
   - Retry는 멈춘 단계부터 다시 한다. VM은 그대로 두고 설치만 다시 하는 것이
     VM 생성과 설치를 나눈 이유다(CAPSIS-D-74).
   - Delete는 클러스터를 지우고, 고른 노드를 다시 고를 수 있게 돌려놓는다.
   ---------------------------------------- */

import { useSyncExternalStore } from 'react';
import type { ClusterUsage } from '@/components/ClusterOverviewTab';

export const INSTALL_STEPS = [
  'Preparing node',
  'Installing Kubernetes',
  'Joining cluster',
  'Ready',
] as const;

export type NodeRole = 'Control plane' | 'Worker';
export type StepState = 'waiting' | 'running' | 'done' | 'failed';

export interface ProvisioningNode {
  id: string;
  name: string;
  role: NodeRole;
  spec: string;
  accelerator: string;
  ip: string;
  /** INSTALL_STEPS의 몇 번째 단계에 있는가 */
  step: number;
  state: StepState;
  message?: string;
}

export interface CreatedCluster {
  id: string;
  name: string;
  usage: ClusterUsage;
  nodeSource: 'vm' | 'baremetal';
  kubernetesVersion: string;
  containerNetwork: string;
  createdAt: string;
  status: 'Provisioning' | 'Provisioned' | 'Failed';
  nodes: ProvisioningNode[];
  /** AI Workload면 클러스터가 뜬 뒤 용도 패키지를 설치한다(08 용도 지정) */
  usagePackages: { state: StepState; message?: string } | null;
  /** 실패 흉내를 한 번만 낸다 — Retry 뒤에는 성공한다 */
  failPending: boolean;
}

export interface CreateClusterInput {
  name: string;
  usage: ClusterUsage;
  nodeSource: 'vm' | 'baremetal';
  kubernetesVersion: string;
  containerNetwork: string;
  controlPlane: Omit<ProvisioningNode, 'role' | 'step' | 'state'>[];
  workers: Omit<ProvisioningNode, 'role' | 'step' | 'state'>[];
}

const FAIL_MESSAGE =
  'Step "install kubeadm" exited with code 100 — package kubeadm could not be downloaded from the package repository.';

let clusters: CreatedCluster[] = [];
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

const emit = () => listeners.forEach((l) => l());

const formatNow = () =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());

/** 한 틱에 노드마다 한 단계씩 나아간다. 실패 흉내는 첫 워커의 설치 단계에서 낸다. */
const tick = () => {
  let changed = false;
  clusters = clusters.map((c) => {
    if (c.status !== 'Provisioning') return c;
    changed = true;
    const firstWorkerId = c.nodes.find((n) => n.role === 'Worker')?.id;
    let failed = false;
    const nodes = c.nodes.map((n) => {
      if (n.state === 'done' || n.state === 'failed') return n;
      if (n.state === 'waiting') return { ...n, state: 'running' as const };
      if (c.failPending && n.id === firstWorkerId && n.step === 1) {
        failed = true;
        return { ...n, state: 'failed' as const, message: FAIL_MESSAGE };
      }
      const next = n.step + 1;
      return next >= INSTALL_STEPS.length - 1
        ? { ...n, step: INSTALL_STEPS.length - 1, state: 'done' as const }
        : { ...n, step: next };
    });
    if (failed || nodes.some((n) => n.state === 'failed')) {
      // 한 노드가 실패하면 클러스터 설치를 멈춘다. 나머지 노드는 대기로 둔다.
      const paused = nodes.map((n) =>
        n.state === 'running' ? { ...n, state: 'waiting' as const } : n
      );
      return { ...c, nodes: paused, status: 'Failed' as const };
    }
    const allNodesDone = nodes.every((n) => n.state === 'done');
    if (!allNodesDone) return { ...c, nodes };
    // 노드가 다 뜬 뒤 AI Workload면 용도 패키지를 설치한다.
    if (c.usagePackages && c.usagePackages.state !== 'done') {
      const pkg =
        c.usagePackages.state === 'waiting'
          ? { state: 'running' as const }
          : { state: 'done' as const };
      return {
        ...c,
        nodes,
        usagePackages: pkg,
        status: pkg.state === 'done' ? ('Provisioned' as const) : c.status,
      };
    }
    return { ...c, nodes, status: 'Provisioned' as const };
  });
  if (changed) emit();
  if (!clusters.some((c) => c.status === 'Provisioning') && timer) {
    clearInterval(timer);
    timer = null;
  }
};

const ensureTimer = () => {
  if (!timer) timer = setInterval(tick, 1800);
};

export const createCluster = (input: CreateClusterInput): string => {
  const id = `capsis-${Date.now()}`;
  const toNode =
    (role: NodeRole) =>
    (n: Omit<ProvisioningNode, 'role' | 'step' | 'state'>): ProvisioningNode => ({
      ...n,
      role,
      step: 0,
      state: 'waiting',
    });
  clusters = [
    {
      id,
      name: input.name,
      usage: input.usage,
      nodeSource: input.nodeSource,
      kubernetesVersion: input.kubernetesVersion,
      containerNetwork: input.containerNetwork,
      createdAt: formatNow(),
      status: 'Provisioning',
      nodes: [
        ...input.controlPlane.map(toNode('Control plane')),
        ...input.workers.map(toNode('Worker')),
      ],
      usagePackages: input.usage === 'AI Workload' ? { state: 'waiting' } : null,
      failPending: /fail/i.test(input.name),
    },
    ...clusters,
  ];
  emit();
  ensureTimer();
  return id;
};

/** 멈춘 단계부터 다시 한다. 이미 끝난 노드는 건드리지 않는다. */
export const retryCluster = (id: string) => {
  clusters = clusters.map((c) =>
    c.id !== id
      ? c
      : {
          ...c,
          status: 'Provisioning',
          failPending: false,
          nodes: c.nodes.map((n) =>
            n.state === 'failed' || n.state === 'waiting'
              ? { ...n, state: 'running', message: undefined }
              : n
          ),
        }
  );
  emit();
  ensureTimer();
};

/** 클러스터를 지우고 고른 노드를 돌려놓는다. */
export const deleteCluster = (id: string) => {
  clusters = clusters.filter((c) => c.id !== id);
  emit();
};

export const getCreatedCluster = (id: string | undefined) =>
  id ? clusters.find((c) => c.id === id) : undefined;

/** 다른 클러스터가 쓰고 있는 노드 — 만들기 화면 목록에서 뺀다. */
export const usedNodeIds = () => clusters.flatMap((c) => c.nodes.map((n) => n.id));

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

/** 컴포넌트에서 만든 클러스터 목록을 읽는다. 바뀌면 다시 그린다. */
export const useCreatedClusters = (): CreatedCluster[] =>
  useSyncExternalStore(
    subscribe,
    () => clusters,
    () => clusters
  );

/** 상세 헤더와 목록에 붙일 한 줄 진행 문구. */
export const progressLabel = (c: CreatedCluster): string | undefined => {
  if (c.status === 'Failed') {
    const failed = c.nodes.find((n) => n.state === 'failed');
    return failed ? `${INSTALL_STEPS[failed.step]} failed on ${failed.name}` : undefined;
  }
  if (c.status !== 'Provisioning') return undefined;
  if (c.usagePackages?.state === 'running') return 'Installing AI Workload packages';
  const done = c.nodes.filter((n) => n.state === 'done').length;
  return `Installing nodes (${done} / ${c.nodes.length} ready)`;
};
