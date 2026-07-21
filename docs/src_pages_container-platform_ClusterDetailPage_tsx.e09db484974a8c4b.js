"use strict";
(self["webpackChunk_thaki_tds"] = self["webpackChunk_thaki_tds"] || []).push([["src_pages_container-platform_ClusterDetailPage_tsx"], {
"./src/pages/container-platform/ClusterDetailPage.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (ClusterDetailPage)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var _design_system__rspack_import_1 = __webpack_require__("./src/design-system/components/ProgressBar/ProgressBar.tsx");
/* import */ var _design_system__rspack_import_4 = __webpack_require__("./src/design-system/components/PageShell/PageShell.tsx");
/* import */ var _design_system__rspack_import_6 = __webpack_require__("./src/design-system/components/TopBar/TopBar.tsx");
/* import */ var _design_system__rspack_import_7 = __webpack_require__("./src/design-system/components/Breadcrumb/Breadcrumb.tsx");
/* import */ var _design_system__rspack_import_8 = __webpack_require__("./src/design-system/layouts/Stack.tsx");
/* import */ var _design_system__rspack_import_9 = __webpack_require__("./src/design-system/components/PageHeader/PageHeader.tsx");
/* import */ var _design_system__rspack_import_10 = __webpack_require__("./src/design-system/components/EmptyState/EmptyState.tsx");
/* import */ var _design_system__rspack_import_11 = __webpack_require__("./src/design-system/presets/columnWidths.ts");
/* import */ var _design_system__rspack_import_12 = __webpack_require__("./src/design-system/components/Badge/Badge.tsx");
/* import */ var _design_system__rspack_import_13 = __webpack_require__("./src/design-system/components/DetailHeader/DetailHeader.tsx");
/* import */ var _design_system__rspack_import_14 = __webpack_require__("./src/design-system/components/Table/Table.tsx");
/* import */ var react_router_dom__rspack_import_2 = __webpack_require__("./node_modules/react-router/dist/development/chunk-JZWAC4HX.mjs");
/* import */ var _ContainerPlatformSidebar__rspack_import_5 = __webpack_require__("./src/pages/container-platform/ContainerPlatformSidebar.tsx");
/* import */ var _containerPlatformMockData__rspack_import_3 = __webpack_require__("./src/pages/container-platform/containerPlatformMockData.ts");





/* ----------------------------------------
   Cluster detail (Phase 5)

   Read-only single-cluster view: header (identity + capacity), the cluster's
   nodes, and a workloads rollup. All data comes from the mock estate selectors.
   ---------------------------------------- */ function UsageCell({ value }) {
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_1.ProgressBar, {
        variant: "quota",
        value: value,
        max: 100,
        showValue: true,
        size: "sm",
        thresholds: _design_system__rspack_import_1.STATUS_THRESHOLDS.container
    });
}
const WORKLOAD_STATUSES = [
    'Running',
    'Pending',
    'Failed',
    'Succeeded'
];
const WORKLOAD_KINDS = [
    'Deployment',
    'StatefulSet',
    'DaemonSet',
    'Job',
    'Pod'
];
function ClusterDetailPage() {
    const navigate = (0,react_router_dom__rspack_import_2.useNavigate)();
    const { clusterId = '' } = (0,react_router_dom__rspack_import_2.useParams)();
    const cluster = (0,_containerPlatformMockData__rspack_import_3.getClusterById)(clusterId);
    const backToList = ()=>navigate('/container-platform/clusters');
    const shell = (children, crumbLabel)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_4.PageShell, {
            sidebar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_ContainerPlatformSidebar__rspack_import_5.ContainerPlatformSidebar, {}),
            sidebarWidth: _ContainerPlatformSidebar__rspack_import_5.CONTAINER_PLATFORM_SIDEBAR_WIDTH,
            topBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.TopBar, {
                showNavigation: true,
                onBack: ()=>navigate(-1),
                onForward: ()=>navigate(1),
                breadcrumb: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_7.Breadcrumb, {
                    items: [
                        {
                            label: 'Clusters',
                            onClick: backToList
                        },
                        {
                            label: crumbLabel
                        }
                    ]
                })
            }),
            contentClassName: "pt-4 px-8 pb-6",
            children: children
        });
    if (!cluster) {
        return shell(/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_8.VStack, {
            gap: 4,
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_9.PageHeader, {
                    title: "Cluster"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_10.EmptyState, {
                    title: "Cluster not found",
                    description: `No cluster matches "${clusterId}". It may have been removed from the estate.`
                })
            ]
        }), 'Not found');
    }
    const nodes = (0,_containerPlatformMockData__rspack_import_3.getNodesByCluster)(cluster.id);
    const clusterWorkloads = (0,_containerPlatformMockData__rspack_import_3.getWorkloadsByCluster)(cluster.id);
    // AI workloads + GPU capacity (only Metis GPU clusters have these).
    const ai = (0,_containerPlatformMockData__rspack_import_3.getAIWorkloadsByCluster)(cluster.id);
    const gpuCapacity = nodes.reduce((sum, n)=>sum + n.gpuCount, 0);
    const aiCount = ai.inference.length + ai.training.length + ai.notebooks.length;
    const hasAI = aiCount > 0 || gpuCapacity > 0;
    const workloadByStatus = WORKLOAD_STATUSES.map((s)=>({
            status: s,
            count: clusterWorkloads.filter((w)=>w.status === s).length
        }));
    const workloadByKind = WORKLOAD_KINDS.map((k)=>({
            kind: k,
            count: clusterWorkloads.filter((w)=>w.kind === k).length
        }));
    const nodeColumns = [
        {
            key: 'name',
            label: 'Name',
            flex: 1,
            minWidth: _design_system__rspack_import_11.columnMinWidths.name,
            render: (value)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "truncate block",
                    title: value,
                    children: value
                })
        },
        {
            key: 'status',
            label: 'Status',
            width: _design_system__rspack_import_11.fixedColumns.statusLabel,
            align: 'center',
            resizable: false,
            render: (value)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_12.Badge, {
                    theme: (0,_containerPlatformMockData__rspack_import_3.getPlatformStatusTheme)(value),
                    type: "subtle",
                    size: "sm",
                    children: value
                })
        },
        {
            key: 'roles',
            label: 'Roles',
            flex: 1,
            minWidth: _design_system__rspack_import_11.columnMinWidths.roles,
            render: (_, row)=>row.roles.join(', ')
        },
        {
            key: 'cpuUsagePct',
            label: 'CPU',
            flex: 1,
            minWidth: _design_system__rspack_import_11.columnMinWidths.cpuUsage,
            render: (value)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(UsageCell, {
                    value: value
                })
        },
        {
            key: 'memUsagePct',
            label: 'Memory',
            flex: 1,
            minWidth: _design_system__rspack_import_11.columnMinWidths.ramUsage,
            render: (value)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(UsageCell, {
                    value: value
                })
        }
    ];
    return shell(/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_8.VStack, {
        gap: 4,
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_9.PageHeader, {
                title: cluster.name
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_13.DetailHeader, {
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.DetailHeader.Title, {
                        children: cluster.name
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_13.DetailHeader.InfoGrid, {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.DetailHeader.InfoCard, {
                                label: "Source",
                                value: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_12.Badge, {
                                    theme: cluster.source === 'Aegis' ? 'blue' : 'gray',
                                    type: "subtle",
                                    size: "sm",
                                    children: cluster.source
                                })
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.DetailHeader.InfoCard, {
                                label: "Status",
                                value: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_12.Badge, {
                                    theme: (0,_containerPlatformMockData__rspack_import_3.getPlatformStatusTheme)(cluster.status),
                                    type: "subtle",
                                    size: "sm",
                                    children: cluster.status
                                })
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.DetailHeader.InfoCard, {
                                label: "K8s Version",
                                value: cluster.k8sVersion
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.DetailHeader.InfoCard, {
                                label: "Provider",
                                value: cluster.provider
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.DetailHeader.InfoCard, {
                                label: "Region",
                                value: cluster.region
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.DetailHeader.InfoCard, {
                                label: "CPU (cores)",
                                value: `${cluster.cpu.usedCores} / ${cluster.cpu.totalCores}`
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.DetailHeader.InfoCard, {
                                label: "Memory (GiB)",
                                value: `${cluster.memory.usedGiB} / ${cluster.memory.totalGiB}`
                            }),
                            gpuCapacity > 0 && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.DetailHeader.InfoCard, {
                                label: "GPUs",
                                value: gpuCapacity
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_8.VStack, {
                gap: 2,
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("span", {
                        className: "text-label-lg text-[var(--color-text-default)]",
                        children: [
                            "Workloads (",
                            clusterWorkloads.length,
                            ")"
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.HStack, {
                        gap: 2,
                        align: "center",
                        className: "flex-wrap",
                        children: workloadByStatus.map(({ status, count })=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_12.Badge, {
                                theme: (0,_containerPlatformMockData__rspack_import_3.getPlatformStatusTheme)(status),
                                type: "subtle",
                                size: "sm",
                                children: [
                                    count,
                                    " ",
                                    status
                                ]
                            }, status))
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.HStack, {
                        gap: 2,
                        align: "center",
                        className: "flex-wrap",
                        children: workloadByKind.map(({ kind, count })=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_12.Badge, {
                                theme: "gray",
                                type: "subtle",
                                size: "sm",
                                children: [
                                    count,
                                    " ",
                                    kind
                                ]
                            }, kind))
                    })
                ]
            }),
            hasAI && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_8.VStack, {
                gap: 2,
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("span", {
                        className: "text-label-lg text-[var(--color-text-default)]",
                        children: [
                            "AI workloads (",
                            aiCount,
                            ")"
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_8.HStack, {
                        gap: 2,
                        align: "center",
                        className: "flex-wrap",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_12.Badge, {
                                theme: "blue",
                                type: "subtle",
                                size: "sm",
                                children: [
                                    ai.inference.length,
                                    " Inference"
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_12.Badge, {
                                theme: "gray",
                                type: "subtle",
                                size: "sm",
                                children: [
                                    ai.training.length,
                                    " Training"
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_12.Badge, {
                                theme: "gray",
                                type: "subtle",
                                size: "sm",
                                children: [
                                    ai.notebooks.length,
                                    " Notebooks"
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_12.Badge, {
                                theme: "gray",
                                type: "subtle",
                                size: "sm",
                                children: [
                                    gpuCapacity,
                                    " GPUs"
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_8.VStack, {
                gap: 2,
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("span", {
                        className: "text-label-lg text-[var(--color-text-default)]",
                        children: [
                            "Nodes (",
                            nodes.length,
                            ")"
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_14.Table, {
                        columns: nodeColumns,
                        data: nodes,
                        rowKey: "id",
                        resizable: false,
                        emptyMessage: "No nodes in this cluster."
                    })
                ]
            })
        ]
    }), cluster.name);
}


},

}]);
//# sourceMappingURL=src_pages_container-platform_ClusterDetailPage_tsx.e09db484974a8c4b.js.map