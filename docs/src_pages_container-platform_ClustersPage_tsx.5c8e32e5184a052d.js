"use strict";
(self["webpackChunk_thaki_tds"] = self["webpackChunk_thaki_tds"] || []).push([["src_pages_container-platform_ClustersPage_tsx"], {
"./src/pages/container-platform/ClustersPage.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (ClustersPage)
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
/* import */ var react_router_dom__rspack_import_2 = __webpack_require__("./node_modules/react-router/dist/development/chunk-JZWAC4HX.mjs");
/* import */ var _ContainerPlatformSidebar__rspack_import_7 = __webpack_require__("./src/pages/container-platform/ContainerPlatformSidebar.tsx");
/* import */ var _containerPlatformMockData__rspack_import_3 = __webpack_require__("./src/pages/container-platform/containerPlatformMockData.ts");






/* ----------------------------------------
   Clusters list (Phase 4)

   Read-only cross-cluster inventory. Search by name + structured filters for
   source (Aegis/Metis) and status (Healthy/Warning/Critical). Client-side
   pagination. Rows link to the cluster detail route.
   ---------------------------------------- */ const ROWS_PER_PAGE = 10;
const SOURCE_OPTIONS = [
    {
        value: 'Aegis',
        label: 'Aegis'
    },
    {
        value: 'Metis',
        label: 'Metis'
    }
];
const STATUS_OPTIONS = [
    {
        value: 'Healthy',
        label: 'Healthy'
    },
    {
        value: 'Warning',
        label: 'Warning'
    },
    {
        value: 'Critical',
        label: 'Critical'
    }
];
function ClustersPage() {
    const navigate = (0,react_router_dom__rspack_import_2.useNavigate)();
    const [page, setPage] = (0,react__rspack_import_1.useState)(1);
    const [searchValue, setSearchValue] = (0,react__rspack_import_1.useState)('');
    const [appliedFilters, setAppliedFilters] = (0,react__rspack_import_1.useState)([]);
    const filteredData = (0,react__rspack_import_1.useMemo)(()=>{
        const term = searchValue.trim().toLowerCase();
        const sourceFilters = appliedFilters.filter((f)=>f.fieldId === 'source').map((f)=>f.value);
        const statusFilters = appliedFilters.filter((f)=>f.fieldId === 'status').map((f)=>f.value);
        return _containerPlatformMockData__rspack_import_3.clusters.filter((c)=>{
            if (term && !c.name.toLowerCase().includes(term)) return false;
            if (sourceFilters.length > 0 && !sourceFilters.includes(c.source)) return false;
            if (statusFilters.length > 0 && !statusFilters.includes(c.status)) return false;
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
                    className: "text-[var(--color-action-primary)] font-medium truncate block",
                    title: value,
                    children: value
                })
        },
        {
            key: 'source',
            label: 'Source',
            width: _design_system__rspack_import_4.fixedColumns.statusLabel,
            align: 'center',
            resizable: false,
            render: (value)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_5.Badge, {
                    theme: value === 'Aegis' ? 'blue' : 'gray',
                    type: "subtle",
                    size: "sm",
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
                    theme: (0,_containerPlatformMockData__rspack_import_3.getPlatformStatusTheme)(value),
                    type: "subtle",
                    size: "sm",
                    children: value
                })
        },
        {
            key: 'k8sVersion',
            label: 'K8s Version',
            flex: 1,
            minWidth: _design_system__rspack_import_4.columnMinWidths.version
        },
        {
            key: 'nodeCount',
            label: 'Nodes',
            flex: 1,
            minWidth: _design_system__rspack_import_4.columnMinWidths.roles,
            sortable: true
        },
        {
            key: 'workloadCount',
            label: 'Workloads',
            flex: 1,
            minWidth: _design_system__rspack_import_4.columnMinWidths.roles,
            sortable: true
        },
        {
            key: 'region',
            label: 'Region',
            flex: 1,
            minWidth: _design_system__rspack_import_4.columnMinWidths.name
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
                        label: 'Clusters'
                    }
                ]
            })
        }),
        contentClassName: "pt-4 px-8 pb-6",
        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_10.VStack, {
            gap: 3,
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.PageHeader, {
                    title: "Clusters"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_12.ListToolbar, {
                    primaryActions: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_12.ListToolbar.Actions, {
                        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.FilterSearchInput, {
                            size: "sm",
                            className: "w-[var(--search-input-width)]",
                            placeholder: "Search clusters by name",
                            searchValue: searchValue,
                            onSearchChange: (value)=>{
                                setSearchValue(value);
                                setPage(1);
                            },
                            filters: [
                                {
                                    id: 'source',
                                    label: 'Source',
                                    type: 'select',
                                    options: SOURCE_OPTIONS
                                },
                                {
                                    id: 'status',
                                    label: 'Status',
                                    type: 'select',
                                    options: STATUS_OPTIONS
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
                    onRowClick: (row)=>navigate(`/container-platform/clusters/${row.id}`),
                    emptyMessage: "No clusters found."
                })
            ]
        })
    });
}


},

}]);
//# sourceMappingURL=src_pages_container-platform_ClustersPage_tsx.5c8e32e5184a052d.js.map