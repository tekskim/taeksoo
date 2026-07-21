"use strict";
(self["webpackChunk_thaki_tds"] = self["webpackChunk_thaki_tds"] || []).push([["src_pages_container-platform_AIWorkloadsPage_tsx"], {
"./src/pages/container-platform/AIWorkloadsPage.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (AIWorkloadsPage)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var react__rspack_import_1 = __webpack_require__("./node_modules/react/index.js");
/* import */ var _design_system__rspack_import_3 = __webpack_require__("./src/design-system/presets/columnWidths.ts");
/* import */ var _design_system__rspack_import_4 = __webpack_require__("./src/design-system/components/Badge/Badge.tsx");
/* import */ var _design_system__rspack_import_6 = __webpack_require__("./src/design-system/components/PageShell/PageShell.tsx");
/* import */ var _design_system__rspack_import_8 = __webpack_require__("./src/design-system/components/TopBar/TopBar.tsx");
/* import */ var _design_system__rspack_import_9 = __webpack_require__("./src/design-system/components/Breadcrumb/Breadcrumb.tsx");
/* import */ var _design_system__rspack_import_10 = __webpack_require__("./src/design-system/layouts/Stack.tsx");
/* import */ var _design_system__rspack_import_11 = __webpack_require__("./src/design-system/components/PageHeader/PageHeader.tsx");
/* import */ var _design_system__rspack_import_12 = __webpack_require__("./src/design-system/components/Tabs/Tabs.tsx");
/* import */ var _design_system__rspack_import_13 = __webpack_require__("./src/design-system/components/ListToolbar/ListToolbar.tsx");
/* import */ var _design_system__rspack_import_14 = __webpack_require__("./src/design-system/components/Input/FilterSearchInput.tsx");
/* import */ var _design_system__rspack_import_15 = __webpack_require__("./src/design-system/components/Pagination/Pagination.tsx");
/* import */ var _design_system__rspack_import_16 = __webpack_require__("./src/design-system/components/Table/Table.tsx");
/* import */ var react_router_dom__rspack_import_5 = __webpack_require__("./node_modules/react-router/dist/development/chunk-JZWAC4HX.mjs");
/* import */ var _ContainerPlatformSidebar__rspack_import_7 = __webpack_require__("./src/pages/container-platform/ContainerPlatformSidebar.tsx");
/* import */ var _containerPlatformMockData__rspack_import_2 = __webpack_require__("./src/pages/container-platform/containerPlatformMockData.ts");






/* ----------------------------------------
   AI Workloads (Metis Run + ML Studio absorbed)

   Container Platform folds the previously separate AI surfaces in as a
   first-class section. A segmented view switches between the three AI workload
   kinds — Inference Services (model serving), Training Jobs, and Notebooks —
   each a read-only TDS Table with name search + cluster/status filters and
   client-side pagination (mirrors ClustersPage mechanics). Segment change
   resets search, filters, and page.
   ---------------------------------------- */ const ROWS_PER_PAGE = 10;
const WORKLOAD_STATUS_OPTIONS = [
    {
        value: 'Running',
        label: 'Running'
    },
    {
        value: 'Pending',
        label: 'Pending'
    },
    {
        value: 'Failed',
        label: 'Failed'
    },
    {
        value: 'Succeeded',
        label: 'Succeeded'
    }
];
const NOTEBOOK_STATE_OPTIONS = [
    {
        value: 'Running',
        label: 'Running'
    },
    {
        value: 'Idle',
        label: 'Idle'
    },
    {
        value: 'Stopped',
        label: 'Stopped'
    }
];
/** Cluster filter options derived from the rows actually present in a segment. */ function clusterOptionsFrom(items) {
    const seen = new Map();
    items.forEach((i)=>seen.set(i.clusterId, i.clusterName));
    return Array.from(seen, ([value, label])=>({
            value,
            label
        }));
}
const INFERENCE_CLUSTER_OPTIONS = clusterOptionsFrom(_containerPlatformMockData__rspack_import_2.inferenceServices);
const TRAINING_CLUSTER_OPTIONS = clusterOptionsFrom(_containerPlatformMockData__rspack_import_2.trainingJobs);
const NOTEBOOK_CLUSTER_OPTIONS = clusterOptionsFrom(_containerPlatformMockData__rspack_import_2.notebooks);
const NameCell = (value)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
        className: "text-[var(--color-text-default)] font-medium truncate block",
        title: value,
        children: value
    });
const TruncCell = (value)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
        className: "truncate block",
        title: value,
        children: value
    });
const inferenceColumns = [
    {
        key: 'name',
        label: 'Name',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.name,
        sortable: true,
        render: NameCell
    },
    {
        key: 'model',
        label: 'Model',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.model,
        render: TruncCell
    },
    {
        key: 'framework',
        label: 'Framework',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.type
    },
    {
        key: 'clusterName',
        label: 'Cluster',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.node,
        render: TruncCell
    },
    {
        key: 'status',
        label: 'Status',
        width: _design_system__rspack_import_3.fixedColumns.statusLabel,
        align: 'center',
        resizable: false,
        render: (value)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_4.Badge, {
                theme: (0,_containerPlatformMockData__rspack_import_2.getPlatformStatusTheme)(value),
                type: "subtle",
                size: "sm",
                children: value
            })
    },
    {
        key: 'gpuCount',
        label: 'GPUs',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.gpu,
        sortable: true
    },
    {
        key: 'ready',
        label: 'Replicas',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.replicas,
        render: (_, row)=>`${row.ready} / ${row.desired}`
    },
    {
        key: 'rps',
        label: 'RPS',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.count,
        sortable: true
    },
    {
        key: 'latencyMs',
        label: 'p95 Latency',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.duration,
        render: (value)=>`${value} ms`
    }
];
const trainingColumns = [
    {
        key: 'name',
        label: 'Name',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.name,
        sortable: true,
        render: NameCell
    },
    {
        key: 'framework',
        label: 'Framework',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.type
    },
    {
        key: 'clusterName',
        label: 'Cluster',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.node,
        render: TruncCell
    },
    {
        key: 'status',
        label: 'Status',
        width: _design_system__rspack_import_3.fixedColumns.statusLabel,
        align: 'center',
        resizable: false,
        render: (value)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_4.Badge, {
                theme: (0,_containerPlatformMockData__rspack_import_2.getPlatformStatusTheme)(value),
                type: "subtle",
                size: "sm",
                children: value
            })
    },
    {
        key: 'gpuCount',
        label: 'GPUs',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.gpu,
        sortable: true
    },
    {
        key: 'progressPct',
        label: 'Progress',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.usage,
        sortable: true,
        render: (value)=>`${value}%`
    },
    {
        key: 'durationHrs',
        label: 'Duration',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.duration,
        sortable: true,
        render: (value)=>`${value} h`
    },
    {
        key: 'owner',
        label: 'Owner',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.owner,
        render: TruncCell
    }
];
const notebookColumns = [
    {
        key: 'name',
        label: 'Name',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.name,
        sortable: true,
        render: NameCell
    },
    {
        key: 'owner',
        label: 'Owner',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.owner,
        render: TruncCell
    },
    {
        key: 'clusterName',
        label: 'Cluster',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.node,
        render: TruncCell
    },
    {
        key: 'state',
        label: 'State',
        width: _design_system__rspack_import_3.fixedColumns.statusLabel,
        align: 'center',
        resizable: false,
        render: (value)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_4.Badge, {
                theme: (0,_containerPlatformMockData__rspack_import_2.getPlatformStatusTheme)(value),
                type: "subtle",
                size: "sm",
                children: value
            })
    },
    {
        key: 'gpuCount',
        label: 'GPUs',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.gpu,
        sortable: true
    },
    {
        key: 'image',
        label: 'Image',
        flex: 1,
        minWidth: _design_system__rspack_import_3.columnMinWidths.containerImage,
        render: TruncCell
    }
];
function AIWorkloadsPage() {
    const navigate = (0,react_router_dom__rspack_import_5.useNavigate)();
    const [segment, setSegment] = (0,react__rspack_import_1.useState)('inference');
    const [page, setPage] = (0,react__rspack_import_1.useState)(1);
    const [searchValue, setSearchValue] = (0,react__rspack_import_1.useState)('');
    const [appliedFilters, setAppliedFilters] = (0,react__rspack_import_1.useState)([]);
    const resetView = ()=>{
        setPage(1);
        setSearchValue('');
        setAppliedFilters([]);
    };
    const handleSegmentChange = (value)=>{
        setSegment(value);
        resetView();
    };
    const clusterFilters = appliedFilters.filter((f)=>f.fieldId === 'cluster').map((f)=>f.value);
    const statusFilters = appliedFilters.filter((f)=>f.fieldId === 'status').map((f)=>f.value);
    const term = searchValue.trim().toLowerCase();
    const inferenceRows = (0,react__rspack_import_1.useMemo)(()=>_containerPlatformMockData__rspack_import_2.inferenceServices.filter((s)=>{
            if (term && !s.name.toLowerCase().includes(term)) return false;
            if (clusterFilters.length > 0 && !clusterFilters.includes(s.clusterId)) return false;
            if (statusFilters.length > 0 && !statusFilters.includes(s.status)) return false;
            return true;
        }), [
        term,
        clusterFilters,
        statusFilters
    ]);
    const trainingRows = (0,react__rspack_import_1.useMemo)(()=>_containerPlatformMockData__rspack_import_2.trainingJobs.filter((j)=>{
            if (term && !j.name.toLowerCase().includes(term)) return false;
            if (clusterFilters.length > 0 && !clusterFilters.includes(j.clusterId)) return false;
            if (statusFilters.length > 0 && !statusFilters.includes(j.status)) return false;
            return true;
        }), [
        term,
        clusterFilters,
        statusFilters
    ]);
    const notebookRows = (0,react__rspack_import_1.useMemo)(()=>_containerPlatformMockData__rspack_import_2.notebooks.filter((n)=>{
            if (term && !n.name.toLowerCase().includes(term)) return false;
            if (clusterFilters.length > 0 && !clusterFilters.includes(n.clusterId)) return false;
            if (statusFilters.length > 0 && !statusFilters.includes(n.state)) return false;
            return true;
        }), [
        term,
        clusterFilters,
        statusFilters
    ]);
    const config = {
        inference: {
            total: inferenceRows.length,
            searchPlaceholder: 'Search inference services by name',
            clusterOptions: INFERENCE_CLUSTER_OPTIONS,
            statusFilter: {
                id: 'status',
                label: 'Status',
                type: 'select',
                options: WORKLOAD_STATUS_OPTIONS
            },
            emptyMessage: 'No inference services found.'
        },
        training: {
            total: trainingRows.length,
            searchPlaceholder: 'Search training jobs by name',
            clusterOptions: TRAINING_CLUSTER_OPTIONS,
            statusFilter: {
                id: 'status',
                label: 'Status',
                type: 'select',
                options: WORKLOAD_STATUS_OPTIONS
            },
            emptyMessage: 'No training jobs found.'
        },
        notebooks: {
            total: notebookRows.length,
            searchPlaceholder: 'Search notebooks by name',
            clusterOptions: NOTEBOOK_CLUSTER_OPTIONS,
            statusFilter: {
                id: 'status',
                label: 'State',
                type: 'select',
                options: NOTEBOOK_STATE_OPTIONS
            },
            emptyMessage: 'No notebooks found.'
        }
    }[segment];
    const totalPages = Math.max(1, Math.ceil(config.total / ROWS_PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const sliceStart = (safePage - 1) * ROWS_PER_PAGE;
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.PageShell, {
        sidebar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_ContainerPlatformSidebar__rspack_import_7.ContainerPlatformSidebar, {}),
        sidebarWidth: _ContainerPlatformSidebar__rspack_import_7.CONTAINER_PLATFORM_SIDEBAR_WIDTH,
        topBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.TopBar, {
            showNavigation: true,
            onBack: ()=>navigate(-1),
            onForward: ()=>navigate(1),
            breadcrumb: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_9.Breadcrumb, {
                items: [
                    {
                        label: 'AI Workloads'
                    }
                ]
            })
        }),
        contentClassName: "pt-4 px-8 pb-6",
        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_10.VStack, {
            gap: 3,
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.PageHeader, {
                    title: "AI Workloads"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_12.Tabs, {
                    value: segment,
                    onChange: handleSegmentChange,
                    variant: "boxed",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_12.TabList, {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_12.Tab, {
                                value: "inference",
                                children: "Inference Services"
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_12.Tab, {
                                value: "training",
                                children: "Training Jobs"
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_12.Tab, {
                                value: "notebooks",
                                children: "Notebooks"
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.ListToolbar, {
                    primaryActions: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.ListToolbar.Actions, {
                        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_14.FilterSearchInput, {
                            size: "sm",
                            className: "w-[var(--search-input-width)]",
                            placeholder: config.searchPlaceholder,
                            searchValue: searchValue,
                            onSearchChange: (value)=>{
                                setSearchValue(value);
                                setPage(1);
                            },
                            filters: [
                                {
                                    id: 'cluster',
                                    label: 'Cluster',
                                    type: 'select',
                                    options: config.clusterOptions
                                },
                                config.statusFilter
                            ],
                            appliedFilters: appliedFilters,
                            onFiltersChange: (next)=>{
                                setAppliedFilters(next);
                                setPage(1);
                            }
                        })
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_15.Pagination, {
                    currentPage: safePage,
                    totalPages: totalPages,
                    onPageChange: setPage,
                    totalItems: config.total
                }),
                segment === 'inference' && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_16.Table, {
                    columns: inferenceColumns,
                    data: inferenceRows.slice(sliceStart, sliceStart + ROWS_PER_PAGE),
                    rowKey: "id",
                    resizable: false,
                    emptyMessage: config.emptyMessage
                }),
                segment === 'training' && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_16.Table, {
                    columns: trainingColumns,
                    data: trainingRows.slice(sliceStart, sliceStart + ROWS_PER_PAGE),
                    rowKey: "id",
                    resizable: false,
                    emptyMessage: config.emptyMessage
                }),
                segment === 'notebooks' && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_16.Table, {
                    columns: notebookColumns,
                    data: notebookRows.slice(sliceStart, sliceStart + ROWS_PER_PAGE),
                    rowKey: "id",
                    resizable: false,
                    emptyMessage: config.emptyMessage
                })
            ]
        })
    });
}


},

}]);
//# sourceMappingURL=src_pages_container-platform_AIWorkloadsPage_tsx.78dffb2e4a458f88.js.map