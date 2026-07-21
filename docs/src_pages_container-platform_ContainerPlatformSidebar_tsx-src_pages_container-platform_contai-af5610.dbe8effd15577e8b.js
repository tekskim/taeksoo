"use strict";
(self["webpackChunk_thaki_tds"] = self["webpackChunk_thaki_tds"] || []).push([["src_pages_container-platform_ContainerPlatformSidebar_tsx-src_pages_container-platform_contai-af5610"], {
"./src/pages/container-platform/ContainerPlatformSidebar.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  CONTAINER_PLATFORM_SIDEBAR_WIDTH: () => (CONTAINER_PLATFORM_SIDEBAR_WIDTH),
  ContainerPlatformSidebar: () => (ContainerPlatformSidebar),
  "default": () => (__rspack_default_export)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var _design_system__rspack_import_3 = __webpack_require__("./src/design-system/layouts/Stack.tsx");
/* import */ var _design_system__rspack_import_4 = __webpack_require__("./src/design-system/components/Menu/MenuSection.tsx");
/* import */ var _design_system__rspack_import_5 = __webpack_require__("./src/design-system/components/Menu/MenuItem.tsx");
/* import */ var _tabler_icons_react__rspack_import_6 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconLayoutDashboard.mjs");
/* import */ var _tabler_icons_react__rspack_import_8 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconTopologyStar.mjs");
/* import */ var _tabler_icons_react__rspack_import_9 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconRocket.mjs");
/* import */ var _tabler_icons_react__rspack_import_10 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconBrain.mjs");
/* import */ var lucide_react__rspack_import_7 = __webpack_require__("./node_modules/lucide-react/dist/esm/icons/folder-cog.js");
/* import */ var react_router_dom__rspack_import_1 = __webpack_require__("./node_modules/react-router/dist/development/chunk-JZWAC4HX.mjs");
/* import */ var _contexts_DesktopWindowContext__rspack_import_2 = __webpack_require__("./src/contexts/DesktopWindowContext.tsx");






/* ----------------------------------------
   Container Platform Sidebar

   A single persistent 200px left sidebar. Overview / Clusters / Nodes /
   Workloads / AI Workloads. No ContainerMode / cluster / drawer /
   icon-sidebar complexity — this is the Walking Skeleton shell (Phase 1).
   ---------------------------------------- */ const CONTAINER_PLATFORM_SIDEBAR_WIDTH = 200;
function ContainerPlatformSidebar() {
    const location = (0,react_router_dom__rspack_import_1.useLocation)();
    const isDesktopWindow = (0,_contexts_DesktopWindowContext__rspack_import_2.useIsDesktopWindow)();
    const desktopControls = (0,_contexts_DesktopWindowContext__rspack_import_2.useDesktopWindowControls)();
    const isActive = (href)=>location.pathname === href || location.pathname.startsWith(href + '/');
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("aside", {
        className: "w-[200px] h-screen fixed left-0 top-0 bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                className: "h-[33px] px-3 flex items-center select-none",
                onMouseDown: isDesktopWindow ? desktopControls === null || desktopControls === void 0 ? void 0 : desktopControls.onDragStart : undefined,
                onDoubleClick: isDesktopWindow ? desktopControls === null || desktopControls === void 0 ? void 0 : desktopControls.onDoubleClick : undefined,
                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-label-lg text-[var(--color-text-default)]",
                    children: "Container Platform"
                })
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("nav", {
                className: "flex-1 px-3 py-3 overflow-y-auto",
                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_3.VStack, {
                    gap: 4,
                    className: "w-full min-w-0",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_4.MenuSection, {
                        title: "Container Platform",
                        defaultOpen: true,
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_5.MenuItem, {
                                icon: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_6["default"], {
                                    size: 16,
                                    stroke: 1.5
                                }),
                                label: "Overview",
                                href: "/container-platform/overview",
                                active: isActive('/container-platform/overview')
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_5.MenuItem, {
                                icon: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(lucide_react__rspack_import_7["default"], {
                                    size: 16,
                                    strokeWidth: 1.5
                                }),
                                label: "Clusters",
                                href: "/container-platform/clusters",
                                active: isActive('/container-platform/clusters')
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_5.MenuItem, {
                                icon: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_8["default"], {
                                    size: 16,
                                    stroke: 1.5
                                }),
                                label: "Nodes",
                                href: "/container-platform/nodes",
                                active: isActive('/container-platform/nodes')
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_5.MenuItem, {
                                icon: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_9["default"], {
                                    size: 16,
                                    stroke: 1.5
                                }),
                                label: "Workloads",
                                href: "/container-platform/workloads",
                                active: isActive('/container-platform/workloads')
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_5.MenuItem, {
                                icon: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_10["default"], {
                                    size: 16,
                                    stroke: 1.5
                                }),
                                label: "AI Workloads",
                                href: "/container-platform/ai-workloads",
                                active: isActive('/container-platform/ai-workloads')
                            })
                        ]
                    })
                })
            })
        ]
    });
}
/* export default */ const __rspack_default_export = (ContainerPlatformSidebar);


},
"./src/pages/container-platform/containerPlatformMockData.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  clusters: () => (clusters),
  events: () => (events),
  getAISummary: () => (getAISummary),
  getAIWorkloadsByCluster: () => (getAIWorkloadsByCluster),
  getClusterById: () => (getClusterById),
  getEstateSummary: () => (getEstateSummary),
  getEvents: () => (getEvents),
  getEventsByCluster: () => (getEventsByCluster),
  getGpuSummary: () => (getGpuSummary),
  getInferenceServicesByCluster: () => (getInferenceServicesByCluster),
  getNamespaces: () => (getNamespaces),
  getNodesByCluster: () => (getNodesByCluster),
  getNotebooksByCluster: () => (getNotebooksByCluster),
  getPlatformStatusTheme: () => (getPlatformStatusTheme),
  getTrainingJobsByCluster: () => (getTrainingJobsByCluster),
  getWorkloadsByCluster: () => (getWorkloadsByCluster),
  inferenceServices: () => (inferenceServices),
  nodes: () => (nodes),
  notebooks: () => (notebooks),
  trainingJobs: () => (trainingJobs),
  workloads: () => (workloads)
});
/* import */ var _pages_containerStatusUtils__rspack_import_0 = __webpack_require__("./src/pages/containerStatusUtils.ts");
// Container Platform — cross-cluster mock estate (Phase 2 data foundation).
// Deterministic (no Math.random / Date.now) so every render is stable. Every
// Container Platform screen reads from the selectors exported here — there is no
// backend. Statuses map to TDS Badge themes via getPlatformStatusTheme().

// --- Clusters (authoritative list across the fragmented surfaces) ---------------
const clusters = [
    {
        id: 'cl-aegis-prod-seoul',
        name: 'aegis-prod-seoul',
        source: 'Aegis',
        status: 'Healthy',
        k8sVersion: 'v1.29.4',
        provider: 'On-prem (Capsis)',
        region: 'Seoul-DC1',
        nodeCount: 6,
        workloadCount: 42,
        cpu: {
            usedCores: 118,
            totalCores: 192
        },
        memory: {
            usedGiB: 612,
            totalGiB: 1024
        }
    },
    {
        id: 'cl-aegis-prod-tokyo',
        name: 'aegis-prod-tokyo',
        source: 'Aegis',
        status: 'Warning',
        k8sVersion: 'v1.29.4',
        provider: 'On-prem (Capsis)',
        region: 'Tokyo-DC1',
        nodeCount: 5,
        workloadCount: 31,
        cpu: {
            usedCores: 138,
            totalCores: 160
        },
        memory: {
            usedGiB: 742,
            totalGiB: 896
        }
    },
    {
        id: 'cl-aegis-staging',
        name: 'aegis-staging',
        source: 'Aegis',
        status: 'Healthy',
        k8sVersion: 'v1.30.1',
        provider: 'On-prem (Capsis)',
        region: 'Seoul-DC2',
        nodeCount: 3,
        workloadCount: 18,
        cpu: {
            usedCores: 34,
            totalCores: 96
        },
        memory: {
            usedGiB: 180,
            totalGiB: 512
        }
    },
    {
        id: 'cl-metis-train-a100',
        name: 'metis-train-a100',
        source: 'Metis',
        status: 'Healthy',
        k8sVersion: 'v1.28.9',
        provider: 'On-prem (Capsis)',
        region: 'Seoul-GPU1',
        nodeCount: 8,
        workloadCount: 24,
        cpu: {
            usedCores: 210,
            totalCores: 256
        },
        memory: {
            usedGiB: 1480,
            totalGiB: 2048
        }
    },
    {
        id: 'cl-metis-serving',
        name: 'metis-serving',
        source: 'Metis',
        status: 'Critical',
        k8sVersion: 'v1.28.9',
        provider: 'On-prem (Capsis)',
        region: 'Seoul-GPU2',
        nodeCount: 4,
        workloadCount: 15,
        cpu: {
            usedCores: 121,
            totalCores: 128
        },
        memory: {
            usedGiB: 968,
            totalGiB: 1024
        }
    },
    {
        id: 'cl-metis-dev',
        name: 'metis-dev',
        source: 'Metis',
        status: 'Warning',
        k8sVersion: 'v1.30.1',
        provider: 'On-prem (Capsis)',
        region: 'Seoul-DC2',
        nodeCount: 2,
        workloadCount: 9,
        cpu: {
            usedCores: 22,
            totalCores: 48
        },
        memory: {
            usedGiB: 96,
            totalGiB: 256
        }
    },
    {
        id: 'cl-aegis-edge-busan',
        name: 'aegis-edge-busan',
        source: 'Aegis',
        status: 'Healthy',
        k8sVersion: 'v1.29.4',
        provider: 'On-prem (Capsis)',
        region: 'Busan-Edge',
        nodeCount: 3,
        workloadCount: 12,
        cpu: {
            usedCores: 28,
            totalCores: 72
        },
        memory: {
            usedGiB: 120,
            totalGiB: 384
        }
    },
    {
        id: 'cl-metis-mlstudio',
        name: 'metis-mlstudio',
        source: 'Metis',
        status: 'Healthy',
        k8sVersion: 'v1.28.9',
        provider: 'On-prem (Capsis)',
        region: 'Seoul-GPU1',
        nodeCount: 3,
        workloadCount: 11,
        cpu: {
            usedCores: 44,
            totalCores: 96
        },
        memory: {
            usedGiB: 260,
            totalGiB: 768
        }
    }
];
// --- Deterministic node generation ---------------------------------------------
const KUBELET_BY_VERSION = {
    'v1.29.4': 'v1.29.4',
    'v1.30.1': 'v1.30.1',
    'v1.28.9': 'v1.28.9'
};
function buildNodes() {
    const out = [];
    clusters.forEach((cl)=>{
        for(let i = 0; i < cl.nodeCount; i += 1){
            const isControl = i === 0 || cl.nodeCount >= 5 && i === 1;
            const roles = isControl ? [
                'control-plane'
            ] : [
                'worker'
            ];
            // Deterministic-but-varied usage derived from indices.
            const cpuUsagePct = 28 + (i * 13 + cl.name.length * 7) % 60;
            const memUsagePct = 34 + (i * 17 + cl.region.length * 5) % 55;
            // A couple of nodes in non-healthy clusters are not Ready.
            let status = 'Ready';
            if (cl.status === 'Critical' && i === cl.nodeCount - 1) status = 'NotReady';
            else if (cl.status === 'Warning' && i === cl.nodeCount - 1) status = 'SchedulingDisabled';
            const cpuCores = cl.source === 'Metis' ? 32 : 24;
            const memoryGiB = cl.source === 'Metis' ? 256 : 128;
            // GPUs live on Metis worker nodes (the AI clusters); control-plane + Aegis have none.
            const gpuCount = cl.source === 'Metis' && !isControl ? 8 : 0;
            out.push({
                id: `${cl.id}-node-${i + 1}`,
                name: `${cl.name}-${isControl ? 'cp' : 'worker'}-${i + 1}`,
                clusterId: cl.id,
                clusterName: cl.name,
                source: cl.source,
                status,
                roles,
                cpuCores,
                memoryGiB,
                cpuUsagePct,
                memUsagePct,
                gpuCount,
                kubeletVersion: KUBELET_BY_VERSION[cl.k8sVersion] ?? cl.k8sVersion
            });
        }
    });
    return out;
}
const nodes = buildNodes();
// --- Deterministic workload generation -----------------------------------------
const KINDS = [
    'Deployment',
    'StatefulSet',
    'DaemonSet',
    'Job',
    'Pod'
];
const NAMESPACES = [
    'default',
    'kube-system',
    'platform',
    'monitoring',
    'ml-serving',
    'ingest'
];
const APP_NAMES = [
    'api',
    'gateway',
    'worker',
    'scheduler',
    'cache',
    'db',
    'inference',
    'trainer',
    'exporter',
    'proxy',
    'notebook',
    'queue'
];
function workloadStatusFor(cl, index, kind) {
    if (kind === 'Job') return index % 4 === 0 ? 'Succeeded' : 'Running';
    if (cl.status === 'Critical') {
        if (index % 5 === 0) return 'Failed';
        if (index % 5 === 1) return 'Pending';
    } else if (cl.status === 'Warning') {
        if (index % 7 === 0) return 'Pending';
    }
    return 'Running';
}
function buildWorkloads() {
    const out = [];
    clusters.forEach((cl)=>{
        for(let i = 0; i < cl.workloadCount; i += 1){
            const kind = KINDS[i % KINDS.length];
            const app = APP_NAMES[i % APP_NAMES.length];
            const ns = NAMESPACES[i % NAMESPACES.length];
            const status = workloadStatusFor(cl, i, kind);
            const desired = kind === 'DaemonSet' ? cl.nodeCount : i % 3 + 1;
            const ready = status === 'Running' || status === 'Succeeded' ? desired : Math.max(0, desired - 1);
            out.push({
                id: `${cl.id}-wl-${i + 1}`,
                name: `${app}-${kind.toLowerCase()}-${i + 1}`,
                kind,
                namespace: ns,
                clusterId: cl.id,
                clusterName: cl.name,
                source: cl.source,
                status,
                ready,
                desired
            });
        }
    });
    return out;
}
const workloads = buildWorkloads();
// --- Selectors ------------------------------------------------------------------
function getClusterById(id) {
    return clusters.find((c)=>c.id === id);
}
function getNodesByCluster(clusterId) {
    return nodes.filter((n)=>n.clusterId === clusterId);
}
function getWorkloadsByCluster(clusterId) {
    return workloads.filter((w)=>w.clusterId === clusterId);
}
function getEstateSummary() {
    const clustersByHealth = {
        Healthy: 0,
        Warning: 0,
        Critical: 0
    };
    clusters.forEach((c)=>{
        clustersByHealth[c.status] += 1;
    });
    const bySource = {
        Aegis: {
            clusters: 0,
            nodes: 0,
            workloads: 0
        },
        Metis: {
            clusters: 0,
            nodes: 0,
            workloads: 0
        }
    };
    clusters.forEach((c)=>bySource[c.source].clusters += 1);
    nodes.forEach((n)=>bySource[n.source].nodes += 1);
    workloads.forEach((w)=>bySource[w.source].workloads += 1);
    return {
        clusterCount: clusters.length,
        nodeCount: nodes.length,
        workloadCount: workloads.length,
        clustersByHealth,
        unhealthyNodeCount: nodes.filter((n)=>n.status === 'NotReady').length,
        failingWorkloadCount: workloads.filter((w)=>w.status === 'Failed').length,
        bySource
    };
}
// --- AI workloads (Metis Run + ML Studio absorbed) ------------------------------
// Deterministic inline mock. These live on the Metis GPU clusters. Statuses reuse
// WorkloadStatus so they theme through getPlatformStatusTheme like everything else.
const inferenceServices = [
    {
        id: 'inf-1',
        name: 'llama3-70b-chat',
        clusterId: 'cl-metis-serving',
        clusterName: 'metis-serving',
        source: 'Metis',
        status: 'Running',
        model: 'Llama-3-70B-Instruct',
        framework: 'vLLM',
        gpuCount: 4,
        ready: 2,
        desired: 2,
        rps: 42,
        latencyMs: 180
    },
    {
        id: 'inf-2',
        name: 'sdxl-turbo',
        clusterId: 'cl-metis-serving',
        clusterName: 'metis-serving',
        source: 'Metis',
        status: 'Running',
        model: 'SDXL-Turbo',
        framework: 'Triton',
        gpuCount: 2,
        ready: 3,
        desired: 3,
        rps: 18,
        latencyMs: 320
    },
    {
        id: 'inf-3',
        name: 'bge-m3-embed',
        clusterId: 'cl-metis-serving',
        clusterName: 'metis-serving',
        source: 'Metis',
        status: 'Running',
        model: 'BGE-M3',
        framework: 'TF-Serving',
        gpuCount: 1,
        ready: 2,
        desired: 2,
        rps: 210,
        latencyMs: 24
    },
    {
        id: 'inf-4',
        name: 'whisper-large-v3',
        clusterId: 'cl-metis-serving',
        clusterName: 'metis-serving',
        source: 'Metis',
        status: 'Failed',
        model: 'Whisper-large-v3',
        framework: 'TorchServe',
        gpuCount: 1,
        ready: 0,
        desired: 1,
        rps: 0,
        latencyMs: 0
    },
    {
        id: 'inf-5',
        name: 'qwen2-7b',
        clusterId: 'cl-metis-serving',
        clusterName: 'metis-serving',
        source: 'Metis',
        status: 'Pending',
        model: 'Qwen2-7B',
        framework: 'vLLM',
        gpuCount: 1,
        ready: 0,
        desired: 1,
        rps: 0,
        latencyMs: 0
    },
    {
        id: 'inf-6',
        name: 'resnet-classifier',
        clusterId: 'cl-metis-train-a100',
        clusterName: 'metis-train-a100',
        source: 'Metis',
        status: 'Running',
        model: 'ResNet-50',
        framework: 'Triton',
        gpuCount: 1,
        ready: 1,
        desired: 1,
        rps: 60,
        latencyMs: 45
    },
    {
        id: 'inf-7',
        name: 'clip-vit-embed',
        clusterId: 'cl-metis-mlstudio',
        clusterName: 'metis-mlstudio',
        source: 'Metis',
        status: 'Running',
        model: 'CLIP-ViT-L',
        framework: 'TF-Serving',
        gpuCount: 1,
        ready: 1,
        desired: 1,
        rps: 90,
        latencyMs: 30
    }
];
const trainingJobs = [
    {
        id: 'trn-1',
        name: 'llama-lora-finetune',
        clusterId: 'cl-metis-train-a100',
        clusterName: 'metis-train-a100',
        source: 'Metis',
        status: 'Running',
        framework: 'PyTorch',
        gpuCount: 8,
        progressPct: 62,
        durationHrs: 14.5,
        owner: 'jiwoo'
    },
    {
        id: 'trn-2',
        name: 'sdxl-dreambooth',
        clusterId: 'cl-metis-train-a100',
        clusterName: 'metis-train-a100',
        source: 'Metis',
        status: 'Running',
        framework: 'PyTorch',
        gpuCount: 4,
        progressPct: 38,
        durationHrs: 6.2,
        owner: 'minho'
    },
    {
        id: 'trn-3',
        name: 'bert-pretrain',
        clusterId: 'cl-metis-train-a100',
        clusterName: 'metis-train-a100',
        source: 'Metis',
        status: 'Succeeded',
        framework: 'TensorFlow',
        gpuCount: 8,
        progressPct: 100,
        durationHrs: 72.0,
        owner: 'sora'
    },
    {
        id: 'trn-4',
        name: 'rlhf-reward-model',
        clusterId: 'cl-metis-mlstudio',
        clusterName: 'metis-mlstudio',
        source: 'Metis',
        status: 'Running',
        framework: 'JAX',
        gpuCount: 2,
        progressPct: 12,
        durationHrs: 2.1,
        owner: 'taeksoo'
    },
    {
        id: 'trn-5',
        name: 'yolo-finetune',
        clusterId: 'cl-metis-mlstudio',
        clusterName: 'metis-mlstudio',
        source: 'Metis',
        status: 'Failed',
        framework: 'PyTorch',
        gpuCount: 1,
        progressPct: 47,
        durationHrs: 3.3,
        owner: 'hana'
    }
];
const notebooks = [
    {
        id: 'nb-1',
        name: 'jiwoo-dev',
        clusterId: 'cl-metis-mlstudio',
        clusterName: 'metis-mlstudio',
        source: 'Metis',
        state: 'Running',
        gpuCount: 1,
        owner: 'jiwoo',
        image: 'pytorch-2.3-cuda12'
    },
    {
        id: 'nb-2',
        name: 'minho-eda',
        clusterId: 'cl-metis-mlstudio',
        clusterName: 'metis-mlstudio',
        source: 'Metis',
        state: 'Idle',
        gpuCount: 0,
        owner: 'minho',
        image: 'datascience-cpu'
    },
    {
        id: 'nb-3',
        name: 'sora-vision',
        clusterId: 'cl-metis-mlstudio',
        clusterName: 'metis-mlstudio',
        source: 'Metis',
        state: 'Running',
        gpuCount: 1,
        owner: 'sora',
        image: 'tf-2.16-gpu'
    },
    {
        id: 'nb-4',
        name: 'taeksoo-llm',
        clusterId: 'cl-metis-dev',
        clusterName: 'metis-dev',
        source: 'Metis',
        state: 'Running',
        gpuCount: 1,
        owner: 'taeksoo',
        image: 'vllm-notebook'
    },
    {
        id: 'nb-5',
        name: 'hana-sandbox',
        clusterId: 'cl-metis-dev',
        clusterName: 'metis-dev',
        source: 'Metis',
        state: 'Stopped',
        gpuCount: 0,
        owner: 'hana',
        image: 'minimal-cpu'
    },
    {
        id: 'nb-6',
        name: 'research-shared',
        clusterId: 'cl-metis-mlstudio',
        clusterName: 'metis-mlstudio',
        source: 'Metis',
        state: 'Idle',
        gpuCount: 2,
        owner: 'team-ml',
        image: 'pytorch-2.3-cuda12'
    }
];
function getInferenceServicesByCluster(clusterId) {
    return inferenceServices.filter((s)=>s.clusterId === clusterId);
}
function getTrainingJobsByCluster(clusterId) {
    return trainingJobs.filter((j)=>j.clusterId === clusterId);
}
function getNotebooksByCluster(clusterId) {
    return notebooks.filter((n)=>n.clusterId === clusterId);
}
/** All AI workloads owned by a cluster (used by the cluster detail page). */ function getAIWorkloadsByCluster(clusterId) {
    return {
        inference: getInferenceServicesByCluster(clusterId),
        training: getTrainingJobsByCluster(clusterId),
        notebooks: getNotebooksByCluster(clusterId)
    };
}
function getGpuSummary() {
    const totalGpus = nodes.reduce((sum, n)=>sum + n.gpuCount, 0);
    const usedGpus = inferenceServices.reduce((sum, s)=>sum + s.gpuCount, 0) + trainingJobs.reduce((sum, j)=>sum + j.gpuCount, 0) + notebooks.reduce((sum, n)=>sum + n.gpuCount, 0);
    return {
        usedGpus,
        totalGpus
    };
}
function getAISummary() {
    return {
        inferenceServiceCount: inferenceServices.length,
        trainingJobCount: trainingJobs.length,
        notebookCount: notebooks.length,
        gpus: getGpuSummary()
    };
}
// --- Namespaces (derived from workloads) ----------------------------------------
function getNamespaces() {
    const map = new Map();
    workloads.forEach((w)=>{
        const key = `${w.clusterId}/${w.namespace}`;
        const existing = map.get(key);
        if (existing) existing.workloadCount += 1;
        else map.set(key, {
            id: key,
            name: w.namespace,
            clusterId: w.clusterId,
            clusterName: w.clusterName,
            source: w.source,
            workloadCount: 1
        });
    });
    return Array.from(map.values());
}
// --- Events (Rancher-style estate event stream) ---------------------------------
// Deterministic. Warnings are correlated with the unhealthy parts of the estate
// (metis-serving Critical, the cordoned/NotReady nodes, failing workloads).
const events = [
    {
        id: 'ev-1',
        type: 'Warning',
        reason: 'BackOff',
        objectKind: 'Pod',
        objectName: 'whisper-large-v3-0',
        namespace: 'ml-serving',
        clusterId: 'cl-metis-serving',
        clusterName: 'metis-serving',
        source: 'Metis',
        message: 'Back-off restarting failed container (CUDA out of memory)',
        ageMinutes: 3
    },
    {
        id: 'ev-2',
        type: 'Warning',
        reason: 'FailedScheduling',
        objectKind: 'Pod',
        objectName: 'qwen2-7b-1',
        namespace: 'ml-serving',
        clusterId: 'cl-metis-serving',
        clusterName: 'metis-serving',
        source: 'Metis',
        message: '0/4 nodes available: 1 node(s) had untolerated taint, insufficient nvidia.com/gpu',
        ageMinutes: 6
    },
    {
        id: 'ev-3',
        type: 'Warning',
        reason: 'NodeNotReady',
        objectKind: 'Node',
        objectName: 'metis-serving-worker-4',
        namespace: '-',
        clusterId: 'cl-metis-serving',
        clusterName: 'metis-serving',
        source: 'Metis',
        message: 'Node metis-serving-worker-4 status is now: NodeNotReady',
        ageMinutes: 11
    },
    {
        id: 'ev-4',
        type: 'Normal',
        reason: 'Scheduled',
        objectKind: 'Pod',
        objectName: 'sdxl-turbo-2',
        namespace: 'ml-serving',
        clusterId: 'cl-metis-serving',
        clusterName: 'metis-serving',
        source: 'Metis',
        message: 'Successfully assigned ml-serving/sdxl-turbo-2 to metis-serving-worker-2',
        ageMinutes: 14
    },
    {
        id: 'ev-5',
        type: 'Warning',
        reason: 'Unhealthy',
        objectKind: 'Pod',
        objectName: 'api-deployment-6',
        namespace: 'platform',
        clusterId: 'cl-aegis-prod-tokyo',
        clusterName: 'aegis-prod-tokyo',
        source: 'Aegis',
        message: 'Readiness probe failed: HTTP probe failed with statuscode: 503',
        ageMinutes: 18
    },
    {
        id: 'ev-6',
        type: 'Warning',
        reason: 'NodeSchedulable',
        objectKind: 'Node',
        objectName: 'aegis-prod-tokyo-worker-5',
        namespace: '-',
        clusterId: 'cl-aegis-prod-tokyo',
        clusterName: 'aegis-prod-tokyo',
        source: 'Aegis',
        message: 'Node cordoned by operator for maintenance',
        ageMinutes: 22
    },
    {
        id: 'ev-7',
        type: 'Normal',
        reason: 'Completed',
        objectKind: 'Job',
        objectName: 'bert-pretrain',
        namespace: 'ml-serving',
        clusterId: 'cl-metis-train-a100',
        clusterName: 'metis-train-a100',
        source: 'Metis',
        message: 'Training job completed successfully after 72h',
        ageMinutes: 26
    },
    {
        id: 'ev-8',
        type: 'Normal',
        reason: 'ScalingReplicaSet',
        objectKind: 'Deployment',
        objectName: 'gateway-deployment-1',
        namespace: 'platform',
        clusterId: 'cl-aegis-prod-seoul',
        clusterName: 'aegis-prod-seoul',
        source: 'Aegis',
        message: 'Scaled up replica set to 3',
        ageMinutes: 31
    },
    {
        id: 'ev-9',
        type: 'Warning',
        reason: 'FailedMount',
        objectKind: 'Pod',
        objectName: 'yolo-finetune-0',
        namespace: 'ml-serving',
        clusterId: 'cl-metis-mlstudio',
        clusterName: 'metis-mlstudio',
        source: 'Metis',
        message: 'Unable to attach or mount volumes: timed out waiting for dataset PVC',
        ageMinutes: 37
    },
    {
        id: 'ev-10',
        type: 'Normal',
        reason: 'Started',
        objectKind: 'Pod',
        objectName: 'jiwoo-dev',
        namespace: 'default',
        clusterId: 'cl-metis-mlstudio',
        clusterName: 'metis-mlstudio',
        source: 'Metis',
        message: 'Started notebook container (pytorch-2.3-cuda12)',
        ageMinutes: 42
    },
    {
        id: 'ev-11',
        type: 'Normal',
        reason: 'Pulled',
        objectKind: 'Pod',
        objectName: 'inference-deployment-7',
        namespace: 'ingest',
        clusterId: 'cl-metis-train-a100',
        clusterName: 'metis-train-a100',
        source: 'Metis',
        message: 'Container image already present on machine',
        ageMinutes: 48
    },
    {
        id: 'ev-12',
        type: 'Warning',
        reason: 'OOMKilling',
        objectKind: 'Pod',
        objectName: 'trainer-statefulset-3',
        namespace: 'monitoring',
        clusterId: 'cl-metis-dev',
        clusterName: 'metis-dev',
        source: 'Metis',
        message: 'Memory cgroup out of memory: Killed process',
        ageMinutes: 55
    },
    {
        id: 'ev-13',
        type: 'Normal',
        reason: 'Created',
        objectKind: 'Deployment',
        objectName: 'cache-deployment-2',
        namespace: 'default',
        clusterId: 'cl-aegis-staging',
        clusterName: 'aegis-staging',
        source: 'Aegis',
        message: 'Created container cache',
        ageMinutes: 63
    },
    {
        id: 'ev-14',
        type: 'Normal',
        reason: 'SuccessfulCreate',
        objectKind: 'StatefulSet',
        objectName: 'db-statefulset-1',
        namespace: 'platform',
        clusterId: 'cl-aegis-prod-seoul',
        clusterName: 'aegis-prod-seoul',
        source: 'Aegis',
        message: 'create Pod db-statefulset-1-0 in StatefulSet successful',
        ageMinutes: 71
    },
    {
        id: 'ev-15',
        type: 'Warning',
        reason: 'BackoffLimitExceeded',
        objectKind: 'Job',
        objectName: 'yolo-finetune',
        namespace: 'ml-serving',
        clusterId: 'cl-metis-mlstudio',
        clusterName: 'metis-mlstudio',
        source: 'Metis',
        message: 'Job has reached the specified backoff limit',
        ageMinutes: 88
    },
    {
        id: 'ev-16',
        type: 'Normal',
        reason: 'Provisioned',
        objectKind: 'Pod',
        objectName: 'exporter-daemonset-4',
        namespace: 'monitoring',
        clusterId: 'cl-aegis-edge-busan',
        clusterName: 'aegis-edge-busan',
        source: 'Aegis',
        message: 'Successfully provisioned volume',
        ageMinutes: 96
    },
    {
        id: 'ev-17',
        type: 'Normal',
        reason: 'Killing',
        objectKind: 'Pod',
        objectName: 'minho-eda',
        namespace: 'default',
        clusterId: 'cl-metis-mlstudio',
        clusterName: 'metis-mlstudio',
        source: 'Metis',
        message: 'Stopping idle notebook to reclaim resources',
        ageMinutes: 104
    },
    {
        id: 'ev-18',
        type: 'Normal',
        reason: 'LeaderElection',
        objectKind: 'Deployment',
        objectName: 'scheduler-deployment-3',
        namespace: 'kube-system',
        clusterId: 'cl-aegis-prod-seoul',
        clusterName: 'aegis-prod-seoul',
        source: 'Aegis',
        message: 'became leader',
        ageMinutes: 120
    }
];
function getEvents() {
    return events;
}
function getEventsByCluster(clusterId) {
    return events.filter((e)=>e.clusterId === clusterId);
}
// --- Status theming --------------------------------------------------------------
// Single source of truth for every Container Platform status Badge (health, node,
// AND workload statuses). Reuses getContainerStatusTheme as the fallback and adds
// the platform-specific mappings (Warning=yellow, Pending=yellow, Succeeded=gray)
// so the same status is themed identically on every screen.
const PLATFORM_STATUS_THEME = {
    healthy: 'green',
    ready: 'green',
    warning: 'yellow',
    schedulingdisabled: 'yellow',
    critical: 'red',
    notready: 'red',
    // workload statuses
    pending: 'yellow',
    succeeded: 'gray',
    // notebook states (running -> green via fallback; stopped -> gray via fallback)
    idle: 'blue',
    // event types (warning -> yellow above)
    normal: 'gray'
};
function getPlatformStatusTheme(status) {
    const normalized = status.toLowerCase().trim();
    return PLATFORM_STATUS_THEME[normalized] ?? (0,_pages_containerStatusUtils__rspack_import_0.getContainerStatusTheme)(status);
}


},

}]);
//# sourceMappingURL=src_pages_container-platform_ContainerPlatformSidebar_tsx-src_pages_container-platform_contai-af5610.dbe8effd15577e8b.js.map