"use strict";
(self["webpackChunk_thaki_tds"] = self["webpackChunk_thaki_tds"] || []).push([["src_pages_kms_SecretListPage_tsx"], {
"./src/pages/kms/SecretListPage.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (SecretListPage)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var react__rspack_import_1 = __webpack_require__("./node_modules/react/index.js");
/* import */ var react_router_dom__rspack_import_2 = __webpack_require__("./node_modules/react-router/dist/development/chunk-JZWAC4HX.mjs");
/* import */ var _design_system__rspack_import_5 = __webpack_require__("./src/design-system/presets/columnWidths.ts");
/* import */ var _design_system__rspack_import_7 = __webpack_require__("./src/design-system/components/PageShell/PageShell.tsx");
/* import */ var _design_system__rspack_import_9 = __webpack_require__("./src/design-system/components/TabBar/TabBar.tsx");
/* import */ var _design_system__rspack_import_10 = __webpack_require__("./src/design-system/components/TopBar/TopBar.tsx");
/* import */ var _design_system__rspack_import_11 = __webpack_require__("./src/design-system/components/Breadcrumb/Breadcrumb.tsx");
/* import */ var _design_system__rspack_import_12 = __webpack_require__("./src/design-system/layouts/Stack.tsx");
/* import */ var _design_system__rspack_import_13 = __webpack_require__("./src/design-system/components/PageHeader/PageHeader.tsx");
/* import */ var _design_system__rspack_import_14 = __webpack_require__("./src/design-system/components/ListToolbar/ListToolbar.tsx");
/* import */ var _design_system__rspack_import_15 = __webpack_require__("./src/design-system/components/Input/FilterSearchInput.tsx");
/* import */ var _design_system__rspack_import_16 = __webpack_require__("./src/design-system/components/Pagination/Pagination.tsx");
/* import */ var _design_system__rspack_import_17 = __webpack_require__("./src/design-system/components/Table/Table.tsx");
/* import */ var _components_KmsSidebar__rspack_import_8 = __webpack_require__("./src/components/KmsSidebar.tsx");
/* import */ var _contexts_TabContext__rspack_import_3 = __webpack_require__("./src/contexts/TabContext.tsx");
/* import */ var _shared__rspack_import_6 = __webpack_require__("./src/pages/kms/shared.tsx");
/* import */ var _mocks_secretsRepository__rspack_import_4 = __webpack_require__("./src/pages/kms/mocks/secretsRepository.ts");








const PAGE_SIZE = 10;
const DETAIL_ROUTE_PREFIX = '/kms/secrets/';
/* ─────────────────────────────────────────────────────────────────
   SecretListPage — ported from kms/features/secrets/ui/pages
   ───────────────────────────────────────────────────────────────── */ function SecretListPage() {
    const [sidebarOpen, setSidebarOpen] = (0,react__rspack_import_1.useState)(true);
    const [appliedFilters, setAppliedFilters] = (0,react__rspack_import_1.useState)([]);
    const [page, setPage] = (0,react__rspack_import_1.useState)(1);
    const [data, setData] = (0,react__rspack_import_1.useState)(null);
    const navigate = (0,react_router_dom__rspack_import_2.useNavigate)();
    const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = (0,_contexts_TabContext__rspack_import_3.useTabs)();
    const sidebarWidth = sidebarOpen ? 200 : 0;
    const filterParams = (0,react__rspack_import_1.useMemo)(()=>{
        const record = {};
        for (const f of appliedFilters)record[f.fieldId] = f.value;
        return {
            name: record.name || undefined,
            status: record.status || undefined
        };
    }, [
        appliedFilters
    ]);
    // 서버 목록 조회 — keepPreviousData처럼 로딩 중에도 이전 결과 유지
    (0,react__rspack_import_1.useEffect)(()=>{
        let cancelled = false;
        (0,_mocks_secretsRepository__rspack_import_4.listMockSecrets)({
            ...filterParams,
            page,
            pageSize: PAGE_SIZE,
            sortBy: 'updatedAt',
            sortOrder: 'desc'
        }).then((result)=>{
            if (!cancelled) setData(result);
        });
        return ()=>{
            cancelled = true;
        };
    }, [
        filterParams,
        page
    ]);
    const items = (data === null || data === void 0 ? void 0 : data.items) ?? [];
    const total = (data === null || data === void 0 ? void 0 : data.total) ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const hasFilters = appliedFilters.length > 0;
    const handleFiltersChange = (next)=>{
        setAppliedFilters(next);
        setPage(1);
    };
    const handleRowClick = (row)=>{
        navigate(`${DETAIL_ROUTE_PREFIX}${encodeURIComponent(row.slug)}`);
    };
    const columns = [
        {
            key: 'status',
            label: 'Status',
            width: _design_system__rspack_import_5.fixedColumns.statusLabel,
            align: 'center',
            resizable: false,
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_shared__rspack_import_6.KmsStateBadge, {
                    status: row.status
                })
        },
        {
            key: 'name',
            label: 'Secret name',
            width: '220px',
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("button", {
                    type: "button",
                    className: "block max-w-full truncate border-0 bg-transparent p-0 text-left text-body-md text-[var(--color-action-primary)] hover:underline cursor-pointer",
                    onClick: (event)=>{
                        event.stopPropagation();
                        handleRowClick(row);
                    },
                    children: row.name
                })
        },
        {
            key: 'currentVersion',
            label: 'Current version',
            width: '140px',
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "font-mono text-body-sm",
                    children: `v${row.currentVersion}`
                })
        },
        {
            key: 'updatedAt',
            label: 'Last updated',
            flex: 1,
            minWidth: _design_system__rspack_import_5.columnMinWidths.timestamp,
            sortable: true,
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm text-[var(--color-text-subtle)]",
                    children: row.updatedAt ? (0,_shared__rspack_import_6.formatDate)(row.updatedAt) : '-'
                })
        }
    ];
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_7.PageShell, {
        sidebar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_components_KmsSidebar__rspack_import_8.KmsSidebar, {
            isOpen: sidebarOpen,
            onToggle: ()=>setSidebarOpen(!sidebarOpen)
        }),
        sidebarWidth: sidebarWidth,
        tabBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_9.TabBar, {
            tabs: tabs.map((t)=>({
                    id: t.id,
                    label: t.label,
                    closable: t.closable
                })),
            activeTab: activeTabId,
            onTabChange: selectTab,
            onTabClose: closeTab,
            onTabAdd: addNewTab,
            onTabReorder: moveTab
        }),
        topBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_10.TopBar, {
            showSidebarToggle: !sidebarOpen,
            onSidebarToggle: ()=>setSidebarOpen(!sidebarOpen),
            showNavigation: true,
            onBack: ()=>window.history.back(),
            onForward: ()=>window.history.forward(),
            breadcrumb: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.Breadcrumb, {
                items: [
                    {
                        label: 'KMS',
                        href: '/kms/overview'
                    },
                    {
                        label: 'Secrets'
                    }
                ]
            })
        }),
        contentClassName: "pt-4 px-8 pb-20",
        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_12.VStack, {
            gap: 4,
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.PageHeader, {
                    title: "Secrets"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_14.ListToolbar, {
                    primaryActions: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_14.ListToolbar.Actions, {
                        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_15.FilterSearchInput, {
                            size: "sm",
                            filters: [
                                {
                                    id: 'name',
                                    label: 'Secret name',
                                    type: 'text',
                                    placeholder: 'e.g. postgres'
                                },
                                {
                                    id: 'status',
                                    label: 'Status',
                                    type: 'select',
                                    options: [
                                        {
                                            value: 'active',
                                            label: 'Active'
                                        },
                                        {
                                            value: 'expired',
                                            label: 'Expired'
                                        },
                                        {
                                            value: 'deactivated',
                                            label: 'Deactivated'
                                        }
                                    ]
                                }
                            ],
                            appliedFilters: appliedFilters,
                            onFiltersChange: handleFiltersChange,
                            placeholder: "Search secrets by attributes",
                            className: "w-[var(--search-input-width)]"
                        })
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_16.Pagination, {
                    currentPage: page,
                    totalPages: totalPages,
                    onPageChange: setPage,
                    totalItems: total
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_17.Table, {
                    columns: columns,
                    data: items,
                    rowKey: "slug",
                    onRowClick: handleRowClick,
                    emptyMessage: hasFilters ? 'No secrets match the current filter.' : 'No secrets found.',
                    resizable: false
                })
            ]
        })
    });
}


},
"./src/pages/kms/mocks/secretsRepository.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  listMockSecrets: () => (listMockSecrets),
  resetMockSecrets: () => (resetMockSecrets),
  setMockSecrets: () => (setMockSecrets),
  setMockSecretsDelay: () => (setMockSecretsDelay)
});
const DEFAULT_DELAY_MS = 80;
const MOCK_SECRETS = [
    {
        name: 'GITHUB_TOKEN',
        slug: 'github-token',
        currentVersion: 4,
        status: 'active',
        updatedAt: '2026-04-29T23:52:51Z'
    },
    {
        name: 's3_secret_access_key',
        slug: 's3-secret-access-key',
        currentVersion: 2,
        status: 'active',
        updatedAt: '2026-04-29T23:52:51Z'
    },
    {
        name: 'KC_CLIENT_SECRET',
        slug: 'kc-client-secret',
        currentVersion: 1,
        status: 'deactivated',
        updatedAt: '2026-04-29T23:52:51Z'
    },
    {
        name: 'OPENAI_API_KEY',
        slug: 'openai-api-key',
        currentVersion: 5,
        status: 'active',
        updatedAt: '2026-04-29T23:52:51Z'
    },
    {
        name: 'REDIS_PASSWORD',
        slug: 'redis-password',
        currentVersion: 2,
        status: 'active',
        updatedAt: '2026-04-29T23:52:51Z'
    },
    {
        name: 'postgresql.password',
        slug: 'postgresql-password',
        currentVersion: 3,
        status: 'active',
        updatedAt: '2026-04-29T23:52:51Z'
    },
    {
        name: 'valkey-auth',
        slug: 'valkey-auth',
        currentVersion: 5,
        status: 'active',
        updatedAt: '2026-04-29T23:48:01Z'
    },
    {
        name: 'postgresql-superuser-auth',
        slug: 'postgresql-superuser-auth',
        currentVersion: 1,
        status: 'expired',
        updatedAt: '2026-04-29T23:48:01Z'
    },
    {
        name: 'postgresql-app-auth',
        slug: 'postgresql-app-auth',
        currentVersion: 3,
        status: 'active',
        updatedAt: '2026-04-29T23:48:01Z'
    },
    {
        name: 'rabbitmq-consumer-user',
        slug: 'rabbitmq-consumer-user',
        currentVersion: 2,
        status: 'active',
        updatedAt: '2026-04-29T23:48:01Z'
    },
    {
        name: 'rabbitmq-publisher-user',
        slug: 'rabbitmq-publisher-user',
        currentVersion: 2,
        status: 'deactivated',
        updatedAt: '2026-04-29T23:48:01Z'
    },
    {
        name: 'rabbitmq-admin-user',
        slug: 'rabbitmq-admin-user',
        currentVersion: 4,
        status: 'active',
        updatedAt: '2026-04-29T23:48:01Z'
    },
    {
        name: 'seaweedfs-s3-config',
        slug: 'seaweedfs-s3-config',
        currentVersion: 2,
        status: 'active',
        updatedAt: '2026-04-29T23:48:01Z'
    },
    {
        name: 'openstack-admin-auth',
        slug: 'openstack-admin-auth',
        currentVersion: 3,
        status: 'active',
        updatedAt: '2026-04-29T23:48:01Z'
    },
    {
        name: 'postgres-main',
        slug: 'postgres-main',
        currentVersion: 7,
        status: 'active',
        updatedAt: '2026-04-24T06:12:00Z'
    },
    {
        name: 'payment-api-key',
        slug: 'payment-api-key',
        currentVersion: 3,
        status: 'expired',
        updatedAt: '2026-04-18T13:25:00Z'
    },
    {
        name: 'session-kv',
        slug: 'session-kv',
        currentVersion: 12,
        status: 'active',
        updatedAt: '2026-04-10T08:00:00Z'
    },
    {
        name: 'cache-redis',
        slug: 'cache-redis',
        currentVersion: 2,
        status: 'deleted',
        updatedAt: '2026-03-28T02:45:00Z'
    }
];
let currentSecrets = [
    ...MOCK_SECRETS
];
let responseDelayMs = DEFAULT_DELAY_MS;
const toTimestamp = (value)=>{
    if (!value) return Number.POSITIVE_INFINITY;
    return new Date(value).getTime();
};
const delay = async (ms)=>{
    await new Promise((resolve)=>{
        setTimeout(resolve, ms);
    });
};
const includesAny = (source, search)=>{
    if (!search) return true;
    return source.toLowerCase().includes(search.toLowerCase());
};
const listMockSecrets = async (params)=>{
    await delay(responseDelayMs);
    const sortField = params.sortBy ?? 'updatedAt';
    const filtered = currentSecrets.filter((item)=>{
        const matchesName = !params.name || includesAny(item.name, params.name);
        const matchesStatus = !params.status || item.status === params.status;
        return matchesName && matchesStatus;
    }).sort((left, right)=>{
        const direction = params.sortOrder === 'asc' ? 1 : -1;
        const leftValue = toTimestamp(left[sortField]);
        const rightValue = toTimestamp(right[sortField]);
        return (leftValue - rightValue) * direction;
    });
    const start = (params.page - 1) * params.pageSize;
    const end = start + params.pageSize;
    return {
        items: filtered.slice(start, end),
        total: filtered.length,
        page: params.page,
        pageSize: params.pageSize
    };
};
const resetMockSecrets = ()=>{
    currentSecrets = [
        ...MOCK_SECRETS
    ];
    responseDelayMs = DEFAULT_DELAY_MS;
};
const setMockSecrets = (items)=>{
    currentSecrets = [
        ...items
    ];
};
const setMockSecretsDelay = (ms)=>{
    responseDelayMs = ms;
};


},

}]);
//# sourceMappingURL=src_pages_kms_SecretListPage_tsx.78a30bc7d265ebc0.js.map