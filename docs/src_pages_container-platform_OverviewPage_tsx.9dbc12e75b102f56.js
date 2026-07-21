"use strict";
(self["webpackChunk_thaki_tds"] = self["webpackChunk_thaki_tds"] || []).push([["src_pages_container-platform_OverviewPage_tsx"], {
"./src/pages/container-platform/OverviewPage.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (OverviewPage)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var _design_system__rspack_import_3 = __webpack_require__("./src/design-system/presets/columnWidths.ts");
/* import */ var _design_system__rspack_import_4 = __webpack_require__("./src/design-system/components/Badge/Badge.tsx");
/* import */ var _design_system__rspack_import_5 = __webpack_require__("./src/design-system/components/PageShell/PageShell.tsx");
/* import */ var _design_system__rspack_import_7 = __webpack_require__("./src/design-system/components/TopBar/TopBar.tsx");
/* import */ var _design_system__rspack_import_8 = __webpack_require__("./src/design-system/components/Breadcrumb/Breadcrumb.tsx");
/* import */ var _design_system__rspack_import_9 = __webpack_require__("./src/design-system/layouts/Stack.tsx");
/* import */ var _design_system__rspack_import_10 = __webpack_require__("./src/design-system/components/PageHeader/PageHeader.tsx");
/* import */ var _design_system__rspack_import_11 = __webpack_require__("./src/design-system/components/MetricCard/MetricCard.tsx");
/* import */ var _design_system__rspack_import_12 = __webpack_require__("./src/design-system/components/Table/Table.tsx");
/* import */ var react_router_dom__rspack_import_1 = __webpack_require__("./node_modules/react-router/dist/development/chunk-JZWAC4HX.mjs");
/* import */ var _ContainerPlatformSidebar__rspack_import_6 = __webpack_require__("./src/pages/container-platform/ContainerPlatformSidebar.tsx");
/* import */ var _containerPlatformMockData__rspack_import_2 = __webpack_require__("./src/pages/container-platform/containerPlatformMockData.ts");





const HEALTH_ORDER = [
    'Healthy',
    'Warning',
    'Critical'
];
function OverviewPage() {
    const navigate = (0,react_router_dom__rspack_import_1.useNavigate)();
    const summary = (0,_containerPlatformMockData__rspack_import_2.getEstateSummary)();
    const ai = (0,_containerPlatformMockData__rspack_import_2.getAISummary)();
    const gpu = (0,_containerPlatformMockData__rspack_import_2.getGpuSummary)();
    const sourceRows = [
        'Aegis',
        'Metis'
    ].map((src)=>({
            id: src,
            source: src,
            clusters: summary.bySource[src].clusters,
            nodes: summary.bySource[src].nodes,
            workloads: summary.bySource[src].workloads
        }));
    const sourceColumns = [
        {
            key: 'source',
            label: 'Source',
            width: _design_system__rspack_import_3.fixedColumns.statusLabel,
            align: 'center',
            resizable: false,
            render: (value)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_4.Badge, {
                    theme: value === 'Aegis' ? 'blue' : 'gray',
                    type: "subtle",
                    size: "sm",
                    children: value
                })
        },
        {
            key: 'clusters',
            label: 'Clusters',
            flex: 1,
            minWidth: _design_system__rspack_import_3.columnMinWidths.name
        },
        {
            key: 'nodes',
            label: 'Nodes',
            flex: 1,
            minWidth: _design_system__rspack_import_3.columnMinWidths.name
        },
        {
            key: 'workloads',
            label: 'Workloads',
            flex: 1,
            minWidth: _design_system__rspack_import_3.columnMinWidths.name
        }
    ];
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_5.PageShell, {
        sidebar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_ContainerPlatformSidebar__rspack_import_6.ContainerPlatformSidebar, {}),
        sidebarWidth: _ContainerPlatformSidebar__rspack_import_6.CONTAINER_PLATFORM_SIDEBAR_WIDTH,
        topBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_7.TopBar, {
            showNavigation: true,
            onBack: ()=>navigate(-1),
            onForward: ()=>navigate(1),
            breadcrumb: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.Breadcrumb, {
                items: [
                    {
                        label: 'Overview'
                    }
                ]
            })
        }),
        contentClassName: "pt-4 px-8 pb-6",
        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_9.VStack, {
            gap: 4,
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_9.VStack, {
                    gap: 1,
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_10.PageHeader, {
                            title: "Overview"
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                            className: "text-body-sm text-[var(--color-text-muted)]",
                            children: "One read-only plane across Aegis Container, Metis Container, Metis Run, and ML Studio."
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_9.VStack, {
                    gap: 2,
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                            className: "text-label-lg text-[var(--color-text-default)]",
                            children: "Estate"
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_11.MetricCard.Group, {
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.MetricCard, {
                                    title: "Clusters",
                                    value: summary.clusterCount
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.MetricCard, {
                                    title: "Nodes",
                                    value: summary.nodeCount
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.MetricCard, {
                                    title: "Workloads",
                                    value: summary.workloadCount
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.MetricCard, {
                                    title: "Cluster health",
                                    value: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_9.HStack, {
                                        gap: 1.5,
                                        align: "center",
                                        children: HEALTH_ORDER.map((h)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_4.Badge, {
                                                theme: (0,_containerPlatformMockData__rspack_import_2.getPlatformStatusTheme)(h),
                                                type: "subtle",
                                                size: "sm",
                                                children: [
                                                    summary.clustersByHealth[h],
                                                    " ",
                                                    h
                                                ]
                                            }, h))
                                    })
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_9.VStack, {
                    gap: 2,
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                            className: "text-label-lg text-[var(--color-text-default)]",
                            children: "At risk"
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_11.MetricCard.Group, {
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.MetricCard, {
                                    title: "Unhealthy nodes",
                                    accent: summary.unhealthyNodeCount > 0 ? 'error' : undefined,
                                    value: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_9.HStack, {
                                        gap: 2,
                                        align: "center",
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                                                children: summary.unhealthyNodeCount
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_4.Badge, {
                                                theme: summary.unhealthyNodeCount > 0 ? 'yellow' : 'green',
                                                type: "subtle",
                                                size: "sm",
                                                children: summary.unhealthyNodeCount > 0 ? 'Needs attention' : 'All Ready'
                                            })
                                        ]
                                    })
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.MetricCard, {
                                    title: "Failing workloads",
                                    accent: summary.failingWorkloadCount > 0 ? 'error' : undefined,
                                    value: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_9.HStack, {
                                        gap: 2,
                                        align: "center",
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                                                children: summary.failingWorkloadCount
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_4.Badge, {
                                                theme: summary.failingWorkloadCount > 0 ? 'red' : 'green',
                                                type: "subtle",
                                                size: "sm",
                                                children: summary.failingWorkloadCount > 0 ? 'Failed' : 'None failing'
                                            })
                                        ]
                                    })
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                                    className: "flex-1 min-w-0",
                                    "aria-hidden": true
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                                    className: "flex-1 min-w-0",
                                    "aria-hidden": true
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_9.VStack, {
                    gap: 2,
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                            className: "text-label-lg text-[var(--color-text-default)]",
                            children: "AI workloads"
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_11.MetricCard.Group, {
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.MetricCard, {
                                    title: "Inference services",
                                    value: ai.inferenceServiceCount
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.MetricCard, {
                                    title: "Training jobs",
                                    value: ai.trainingJobCount
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.MetricCard, {
                                    title: "Notebooks",
                                    value: ai.notebookCount
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.MetricCard, {
                                    title: "GPUs (used / total)",
                                    value: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_9.HStack, {
                                        gap: 2,
                                        align: "center",
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                                                children: `${gpu.usedGpus} / ${gpu.totalGpus}`
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_4.Badge, {
                                                theme: gpu.usedGpus >= gpu.totalGpus ? 'yellow' : 'blue',
                                                type: "subtle",
                                                size: "sm",
                                                children: gpu.totalGpus > 0 ? `${Math.round(gpu.usedGpus / gpu.totalGpus * 100)}% allocated` : 'No GPUs'
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_9.VStack, {
                    gap: 2,
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                            className: "text-label-lg text-[var(--color-text-default)]",
                            children: "By source"
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_12.Table, {
                            columns: sourceColumns,
                            data: sourceRows,
                            rowKey: "id",
                            resizable: false,
                            emptyMessage: "No source data."
                        })
                    ]
                })
            ]
        })
    });
}


},

}]);
//# sourceMappingURL=src_pages_container-platform_OverviewPage_tsx.9dbc12e75b102f56.js.map