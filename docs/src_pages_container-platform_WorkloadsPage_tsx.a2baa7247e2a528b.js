"use strict";
(self["webpackChunk_thaki_tds"] = self["webpackChunk_thaki_tds"] || []).push([["src_pages_container-platform_WorkloadsPage_tsx"], {
"./src/pages/container-platform/WorkloadsPage.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (WorkloadsPage)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var react__rspack_import_1 = __webpack_require__("./node_modules/react/index.js");
/* import */ var _design_system__rspack_import_4 = __webpack_require__("./src/design-system/presets/columnWidths.ts");
/* import */ var _design_system__rspack_import_5 = __webpack_require__("./src/design-system/components/Badge/Badge.tsx");
/* import */ var _design_system__rspack_import_6 = __webpack_require__("./src/design-system/components/PageShell/PageShell.tsx");
/* import */ var _design_system__rspack_import_8 = __webpack_require__("./src/design-system/components/TopBar/TopBar.tsx");
/* import */ var _design_system__rspack_import_9 = __webpack_require__("./src/design-system/components/Breadcrumb/Breadcrumb.tsx");
/* import */ var _design_system__rspack_import_10 = __webpack_require__("./src/design-system/layouts/Stack.tsx");
/* import */ var _design_system__rspack_import_11 = __webpack_require__("./src/design-system/components/PageHeader/PageHeader.tsx");
/* import */ var _design_system__rspack_import_12 = __webpack_require__("./src/design-system/components/ListToolbar/ListToolbar.tsx");
/* import */ var _design_system__rspack_import_13 = __webpack_require__("./src/design-system/components/Input/FilterSearchInput.tsx");
/* import */ var _design_system__rspack_import_14 = __webpack_require__("./src/design-system/components/Pagination/Pagination.tsx");
/* import */ var _design_system__rspack_import_15 = __webpack_require__("./src/design-system/components/Table/Table.tsx");
/* import */ var react_router_dom__rspack_import_3 = __webpack_require__("./node_modules/react-router/dist/development/chunk-JZWAC4HX.mjs");
/* import */ var _ContainerPlatformSidebar__rspack_import_7 = __webpack_require__("./src/pages/container-platform/ContainerPlatformSidebar.tsx");
/* import */ var _containerPlatformMockData__rspack_import_2 = __webpack_require__("./src/pages/container-platform/containerPlatformMockData.ts");






/* ----------------------------------------
   Workloads list (Phases 7 + 8)

   Read-only cross-cluster workload inventory (WKL-01). Search by workload name
   with client-side pagination (WKL-03) plus structured filters for kind and
   cluster (WKL-02), combined via the same FilterSearchInput used by ClustersPage.
   ---------------------------------------- */ const ROWS_PER_PAGE = 10;
const KIND_OPTIONS = [
    {
        value: 'Deployment',
        label: 'Deployment'
    },
    {
        value: 'StatefulSet',
        label: 'StatefulSet'
    },
    {
        value: 'DaemonSet',
        label: 'DaemonSet'
    },
    {
        value: 'Job',
        label: 'Job'
    },
    {
        value: 'Pod',
        label: 'Pod'
    }
];
const CLUSTER_OPTIONS = _containerPlatformMockData__rspack_import_2.clusters.map((c)=>({
        value: c.id,
        label: c.name
    }));
function WorkloadsPage() {
    const navigate = (0,react_router_dom__rspack_import_3.useNavigate)();
    const [page, setPage] = (0,react__rspack_import_1.useState)(1);
    const [searchValue, setSearchValue] = (0,react__rspack_import_1.useState)('');
    const [appliedFilters, setAppliedFilters] = (0,react__rspack_import_1.useState)([]);
    const filteredData = (0,react__rspack_import_1.useMemo)(()=>{
        const term = searchValue.trim().toLowerCase();
        const kindFilters = appliedFilters.filter((f)=>f.fieldId === 'kind').map((f)=>f.value);
        const clusterFilters = appliedFilters.filter((f)=>f.fieldId === 'cluster').map((f)=>f.value);
        return _containerPlatformMockData__rspack_import_2.workloads.filter((w)=>{
            if (term && !w.name.toLowerCase().includes(term)) return false;
            if (kindFilters.length > 0 && !kindFilters.includes(w.kind)) return false;
            if (clusterFilters.length > 0 && !clusterFilters.includes(w.clusterId)) return false;
            return true;
        });
    }, [
        searchValue,
        appliedFilters
    ]);
    const totalPages = Math.max(1, Math.ceil(filteredData.length / ROWS_PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const pagedRows = filteredData.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);
    const columns = [
        {
            key: 'name',
            label: 'Name',
            flex: 1,
            minWidth: _design_system__rspack_import_4.columnMinWidths.name,
            sortable: true,
            render: (value)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-[var(--color-text-default)] font-medium truncate block",
                    title: value,
                    children: value
                })
        },
        {
            key: 'kind',
            label: 'Kind',
            flex: 1,
            minWidth: _design_system__rspack_import_4.columnMinWidths.type
        },
        {
            key: 'namespace',
            label: 'Namespace',
            flex: 1,
            minWidth: _design_system__rspack_import_4.columnMinWidths.namespace,
            render: (value)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "truncate block",
                    title: value,
                    children: value
                })
        },
        {
            key: 'clusterName',
            label: 'Cluster',
            flex: 1,
            minWidth: _design_system__rspack_import_4.columnMinWidths.name,
            render: (value)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "truncate block",
                    title: value,
                    children: value
                })
        },
        {
            key: 'status',
            label: 'Status',
            width: _design_system__rspack_import_4.fixedColumns.statusLabel,
            align: 'center',
            resizable: false,
            render: (value)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_5.Badge, {
                    theme: (0,_containerPlatformMockData__rspack_import_2.getPlatformStatusTheme)(value),
                    type: "subtle",
                    size: "sm",
                    children: value
                })
        },
        {
            key: 'ready',
            label: 'Replicas',
            flex: 1,
            minWidth: _design_system__rspack_import_4.columnMinWidths.replicas,
            render: (_, row)=>`${row.ready}/${row.desired}`
        }
    ];
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
                        label: 'Workloads'
                    }
                ]
            })
        }),
        contentClassName: "pt-4 px-8 pb-6",
        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_10.VStack, {
            gap: 3,
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.PageHeader, {
                    title: "Workloads"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_12.ListToolbar, {
                    primaryActions: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_12.ListToolbar.Actions, {
                        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.FilterSearchInput, {
                            size: "sm",
                            className: "w-[var(--search-input-width)]",
                            placeholder: "Search workloads by name",
                            searchValue: searchValue,
                            onSearchChange: (value)=>{
                                setSearchValue(value);
                                setPage(1);
                            },
                            filters: [
                                {
                                    id: 'kind',
                                    label: 'Kind',
                                    type: 'select',
                                    options: KIND_OPTIONS
                                },
                                {
                                    id: 'cluster',
                                    label: 'Cluster',
                                    type: 'select',
                                    options: CLUSTER_OPTIONS
                                }
                            ],
                            appliedFilters: appliedFilters,
                            onFiltersChange: (next)=>{
                                setAppliedFilters(next);
                                setPage(1);
                            }
                        })
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_14.Pagination, {
                    currentPage: safePage,
                    totalPages: totalPages,
                    onPageChange: setPage,
                    totalItems: filteredData.length
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_15.Table, {
                    columns: columns,
                    data: pagedRows,
                    rowKey: "id",
                    resizable: false,
                    emptyMessage: "No workloads found."
                })
            ]
        })
    });
}


},

}]);
//# sourceMappingURL=src_pages_container-platform_WorkloadsPage_tsx.a2baa7247e2a528b.js.map