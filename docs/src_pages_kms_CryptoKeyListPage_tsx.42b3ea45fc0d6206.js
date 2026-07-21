"use strict";
(self["webpackChunk_thaki_tds"] = self["webpackChunk_thaki_tds"] || []).push([["src_pages_kms_CryptoKeyListPage_tsx"], {
"./src/pages/kms/CryptoKeyListPage.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (CryptoKeyListPage)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var react__rspack_import_1 = __webpack_require__("./node_modules/react/index.js");
/* import */ var react_router_dom__rspack_import_2 = __webpack_require__("./node_modules/react-router/dist/development/chunk-JZWAC4HX.mjs");
/* import */ var _design_system__rspack_import_8 = __webpack_require__("./src/design-system/presets/columnWidths.ts");
/* import */ var _design_system__rspack_import_10 = __webpack_require__("./src/design-system/components/ContextMenu/ContextMenu.tsx");
/* import */ var _design_system__rspack_import_12 = __webpack_require__("./src/design-system/components/PageShell/PageShell.tsx");
/* import */ var _design_system__rspack_import_14 = __webpack_require__("./src/design-system/components/TabBar/TabBar.tsx");
/* import */ var _design_system__rspack_import_15 = __webpack_require__("./src/design-system/components/TopBar/TopBar.tsx");
/* import */ var _design_system__rspack_import_16 = __webpack_require__("./src/design-system/components/Breadcrumb/Breadcrumb.tsx");
/* import */ var _design_system__rspack_import_17 = __webpack_require__("./src/design-system/layouts/Stack.tsx");
/* import */ var _design_system__rspack_import_18 = __webpack_require__("./src/design-system/components/PageHeader/PageHeader.tsx");
/* import */ var _design_system__rspack_import_19 = __webpack_require__("./src/design-system/components/ListToolbar/ListToolbar.tsx");
/* import */ var _design_system__rspack_import_20 = __webpack_require__("./src/design-system/components/Input/FilterSearchInput.tsx");
/* import */ var _design_system__rspack_import_21 = __webpack_require__("./src/design-system/components/Pagination/Pagination.tsx");
/* import */ var _design_system__rspack_import_22 = __webpack_require__("./src/design-system/components/Table/Table.tsx");
/* import */ var _design_system__rspack_import_23 = __webpack_require__("./src/design-system/components/Modal/Modal.tsx");
/* import */ var _design_system__rspack_import_24 = __webpack_require__("./src/design-system/components/InfoBox/InfoBox.tsx");
/* import */ var _design_system__rspack_import_25 = __webpack_require__("./src/design-system/components/FormField/FormField.tsx");
/* import */ var _design_system__rspack_import_26 = __webpack_require__("./src/design-system/components/Input/Textarea.tsx");
/* import */ var _design_system__rspack_import_27 = __webpack_require__("./src/design-system/components/Button/Button.tsx");
/* import */ var _components_KmsSidebar__rspack_import_13 = __webpack_require__("./src/components/KmsSidebar.tsx");
/* import */ var _contexts_TabContext__rspack_import_3 = __webpack_require__("./src/contexts/TabContext.tsx");
/* import */ var _tabler_icons_react__rspack_import_5 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconChevronUp.mjs");
/* import */ var _tabler_icons_react__rspack_import_6 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconChevronDown.mjs");
/* import */ var _tabler_icons_react__rspack_import_7 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconSelector.mjs");
/* import */ var _tabler_icons_react__rspack_import_11 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconDotsCircleHorizontal.mjs");
/* import */ var _shared__rspack_import_9 = __webpack_require__("./src/pages/kms/shared.tsx");
/* import */ var _mocks_cryptoKeysRepository__rspack_import_4 = __webpack_require__("./src/pages/kms/mocks/cryptoKeysRepository.ts");









// ── Constants ─────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;
const REASON_MAX_LENGTH = 500;
/** 상태별 row context-menu 액션 (kms CryptoKeyListPage 정책) */ const KEY_LIST_STATUS_ACTIONS = {
    active: [
        {
            label: 'Rotate now',
            actionType: 'rotate'
        },
        {
            label: 'Archive',
            actionType: 'archive'
        },
        {
            label: 'Destroy',
            actionType: 'destroy',
            danger: true
        }
    ],
    deactivated: [
        {
            label: 'Archive',
            actionType: 'archive'
        },
        {
            label: 'Destroy',
            actionType: 'destroy',
            danger: true
        }
    ],
    archived: [
        {
            label: 'Restore',
            actionType: 'restore'
        },
        {
            label: 'Destroy',
            actionType: 'destroy',
            danger: true
        }
    ]
};
const KEY_LIST_ACTION_CONFIG = {
    rotate: {
        title: 'Confirm key rotation',
        confirmLabel: 'Rotate now',
        variant: 'primary'
    },
    archive: {
        title: 'Confirm key archive',
        confirmLabel: 'Archive',
        variant: 'primary'
    },
    restore: {
        title: 'Confirm key restore',
        confirmLabel: 'Restore',
        variant: 'primary'
    },
    destroy: {
        title: 'Confirm key destruction',
        confirmLabel: 'Destroy',
        variant: 'danger'
    }
};
// ── Main Page ─────────────────────────────────────────────────────────────────
function CryptoKeyListPage() {
    const [sidebarOpen, setSidebarOpen] = (0,react__rspack_import_1.useState)(true);
    const [appliedFilters, setAppliedFilters] = (0,react__rspack_import_1.useState)([]);
    const [page, setPage] = (0,react__rspack_import_1.useState)(1);
    const [sortBy, setSortBy] = (0,react__rspack_import_1.useState)('createdAt');
    const [sortOrder, setSortOrder] = (0,react__rspack_import_1.useState)('desc');
    const [result, setResult] = (0,react__rspack_import_1.useState)(null);
    const [isLoading, setIsLoading] = (0,react__rspack_import_1.useState)(true);
    const [refreshKey, setRefreshKey] = (0,react__rspack_import_1.useState)(0);
    const [confirmModal, setConfirmModal] = (0,react__rspack_import_1.useState)(null);
    const [confirmReason, setConfirmReason] = (0,react__rspack_import_1.useState)('');
    const navigate = (0,react_router_dom__rspack_import_2.useNavigate)();
    const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = (0,_contexts_TabContext__rspack_import_3.useTabs)();
    const sidebarWidth = sidebarOpen ? 200 : 0;
    // ── Data loading (mock repository, async) ───────────────────────────────────
    const collectFilterValues = (fieldId)=>appliedFilters.filter((f)=>f.fieldId === fieldId).map((f)=>f.value);
    const requestParams = (0,react__rspack_import_1.useMemo)(()=>({
            search: collectFilterValues('name')[0] || undefined,
            algorithms: collectFilterValues('algorithm'),
            purposes: collectFilterValues('purpose'),
            statuses: collectFilterValues('status'),
            sortBy,
            sortOrder,
            page,
            pageSize: PAGE_SIZE
        }), // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        appliedFilters,
        page,
        sortBy,
        sortOrder
    ]);
    (0,react__rspack_import_1.useEffect)(()=>{
        let cancelled = false;
        setIsLoading(true);
        (0,_mocks_cryptoKeysRepository__rspack_import_4.listMockCryptoKeys)(requestParams).then((res)=>{
            if (cancelled) return;
            setResult(res);
            setIsLoading(false);
        });
        return ()=>{
            cancelled = true;
        };
    }, [
        requestParams,
        refreshKey
    ]);
    const items = (result === null || result === void 0 ? void 0 : result.items) ?? [];
    const total = (result === null || result === void 0 ? void 0 : result.total) ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    // ── Handlers ────────────────────────────────────────────────────────────────
    const handleFiltersChange = (next)=>{
        setAppliedFilters(next);
        setPage(1);
    };
    const handleSortToggle = (field)=>{
        setPage(1);
        if (sortBy === field) {
            setSortOrder((prev)=>prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };
    const handleKeyAction = (row, actionType)=>{
        setConfirmReason('');
        setConfirmModal({
            actionType,
            keyName: row.name,
            slug: row.slug
        });
    };
    const handleConfirmAction = async ()=>{
        if (!confirmModal) return;
        const { actionType, slug } = confirmModal;
        if (actionType === 'rotate') {
            await (0,_mocks_cryptoKeysRepository__rspack_import_4.rotateMockCryptoKey)(slug);
        } else {
            const nextStatus = actionType === 'archive' ? 'archived' : actionType === 'restore' ? 'deactivated' : 'destroyed';
            await (0,_mocks_cryptoKeysRepository__rspack_import_4.updateMockCryptoKeyStatus)(slug, nextStatus);
        }
        setConfirmModal(null);
        setConfirmReason('');
        setRefreshKey((k)=>k + 1);
    };
    // ── Sortable column header (repository 전체 정렬 — Table 내부 정렬 미사용) ──
    const renderSortableHeader = (label, field)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("button", {
            type: "button",
            onClick: ()=>handleSortToggle(field),
            className: "flex items-center gap-1 hover:text-[var(--color-text-default)] transition-colors",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    children: label
                }),
                sortBy === field ? sortOrder === 'asc' ? /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_5["default"], {
                    size: 14,
                    stroke: 1,
                    className: "text-[var(--color-action-primary)]"
                }) : /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_6["default"], {
                    size: 14,
                    stroke: 1,
                    className: "text-[var(--color-action-primary)]"
                }) : /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_7["default"], {
                    size: 14,
                    stroke: 1,
                    className: "text-[var(--color-text-subtle)]"
                })
            ]
        });
    // ── Table columns ───────────────────────────────────────────────────────────
    const columns = [
        {
            key: 'status',
            label: 'Status',
            width: _design_system__rspack_import_8.fixedColumns.statusLabel,
            align: 'center',
            resizable: false,
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_shared__rspack_import_9.KmsStateBadge, {
                    status: row.status
                })
        },
        {
            key: 'name',
            label: 'Key name',
            flex: 1,
            minWidth: _design_system__rspack_import_8.columnMinWidths.name,
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("button", {
                    type: "button",
                    className: "block max-w-full truncate text-left text-body-md font-medium text-[var(--color-action-primary)] hover:underline",
                    onClick: (e)=>{
                        e.stopPropagation();
                        navigate(`/kms/keys/${row.slug}`);
                    },
                    children: row.name
                })
        },
        {
            key: 'algorithm',
            label: 'Algorithm',
            flex: 1,
            minWidth: _design_system__rspack_import_8.columnMinWidths.algorithm,
            render: (v)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm font-mono text-[var(--color-text-subtle)]",
                    children: v
                })
        },
        {
            key: 'purpose',
            label: 'Key purpose',
            flex: 1,
            minWidth: _design_system__rspack_import_8.columnMinWidths.algorithm,
            render: (v)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm text-[var(--color-text-subtle)] truncate block",
                    children: v
                })
        },
        {
            key: 'currentVersion',
            label: 'Current version',
            width: _design_system__rspack_import_8.columnMinWidths.version,
            align: 'center',
            resizable: false,
            render: (v)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm font-mono",
                    children: `v${v}`
                })
        },
        {
            key: 'createdAt',
            label: 'Created at',
            flex: 1,
            minWidth: _design_system__rspack_import_8.columnMinWidths.createdAt,
            headerRender: ()=>renderSortableHeader('Created at', 'createdAt'),
            render: (v)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm text-[var(--color-text-subtle)]",
                    children: v ? (0,_shared__rspack_import_9.formatDate)(v) : '-'
                })
        },
        {
            key: 'nextRotationAt',
            label: 'Next rotation at',
            flex: 1,
            minWidth: _design_system__rspack_import_8.columnMinWidths.createdAt,
            headerRender: ()=>renderSortableHeader('Next rotation at', 'nextRotationAt'),
            render: (v)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm text-[var(--color-text-subtle)]",
                    children: v ? (0,_shared__rspack_import_9.formatDate)(v) : '-'
                })
        },
        {
            key: '_action',
            label: 'Action',
            width: _design_system__rspack_import_8.fixedColumns.actions,
            align: 'center',
            resizable: false,
            render: (_, row)=>{
                const rowActions = KEY_LIST_STATUS_ACTIONS[row.status] ?? [];
                if (rowActions.length === 0) {
                    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                        className: "text-body-sm text-[var(--color-text-subtle)]",
                        children: "-"
                    });
                }
                const menuItems = rowActions.map((action)=>({
                        id: action.actionType,
                        label: action.label,
                        status: action.danger ? 'danger' : 'default',
                        onClick: ()=>handleKeyAction(row, action.actionType)
                    }));
                return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                    onClick: (e)=>e.stopPropagation(),
                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_10.ContextMenu, {
                        items: menuItems,
                        trigger: "click",
                        align: "right",
                        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("button", {
                            "aria-label": `Actions for ${row.name}`,
                            className: "p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors",
                            children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_11["default"], {
                                size: 16,
                                stroke: 1.5,
                                className: "text-[var(--color-text-subtle)]"
                            })
                        })
                    })
                });
            }
        }
    ];
    const confirmConfig = confirmModal ? KEY_LIST_ACTION_CONFIG[confirmModal.actionType] : null;
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_12.PageShell, {
        sidebar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_components_KmsSidebar__rspack_import_13.KmsSidebar, {
            isOpen: sidebarOpen,
            onToggle: ()=>setSidebarOpen(!sidebarOpen)
        }),
        sidebarWidth: sidebarWidth,
        tabBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_14.TabBar, {
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
        topBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_15.TopBar, {
            showSidebarToggle: !sidebarOpen,
            onSidebarToggle: ()=>setSidebarOpen(!sidebarOpen),
            showNavigation: true,
            onBack: ()=>window.history.back(),
            onForward: ()=>window.history.forward(),
            breadcrumb: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_16.Breadcrumb, {
                items: [
                    {
                        label: 'KMS',
                        href: '/kms/overview'
                    },
                    {
                        label: 'Encryption Keys'
                    }
                ]
            })
        }),
        contentClassName: "pt-4 px-8 pb-20",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_17.VStack, {
                gap: 4,
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_18.PageHeader, {
                        title: "Encryption keys"
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_19.ListToolbar, {
                        primaryActions: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_19.ListToolbar.Actions, {
                            children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_20.FilterSearchInput, {
                                size: "sm",
                                filters: [
                                    {
                                        id: 'name',
                                        label: 'Key name',
                                        type: 'text',
                                        placeholder: 'e.g. iam-master-key'
                                    },
                                    {
                                        id: 'algorithm',
                                        label: 'Algorithm',
                                        type: 'select',
                                        options: [
                                            {
                                                value: 'AES-256',
                                                label: 'AES-256'
                                            },
                                            {
                                                value: 'RSA-2048',
                                                label: 'RSA-2048'
                                            },
                                            {
                                                value: 'RSA-4096',
                                                label: 'RSA-4096'
                                            }
                                        ]
                                    },
                                    {
                                        id: 'purpose',
                                        label: 'Key purpose',
                                        type: 'select',
                                        options: [
                                            {
                                                value: 'Encrypt / Decrypt',
                                                label: 'Encrypt / Decrypt'
                                            },
                                            {
                                                value: 'Sign / Verify',
                                                label: 'Sign / Verify'
                                            }
                                        ]
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
                                                value: 'deactivated',
                                                label: 'Deactivated'
                                            },
                                            {
                                                value: 'archived',
                                                label: 'Archived'
                                            }
                                        ]
                                    }
                                ],
                                appliedFilters: appliedFilters,
                                onFiltersChange: handleFiltersChange,
                                placeholder: "Search keys by attributes",
                                className: "w-[var(--search-input-width)]"
                            })
                        })
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_21.Pagination, {
                        currentPage: safePage,
                        totalPages: totalPages,
                        onPageChange: setPage,
                        totalItems: total
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_22.Table, {
                        columns: columns,
                        data: items,
                        rowKey: "slug",
                        onRowClick: (row)=>navigate(`/kms/keys/${row.slug}`),
                        resizable: false,
                        emptyMessage: isLoading ? 'Loading encryption keys...' : appliedFilters.length > 0 ? 'No encryption keys match the current filter.' : 'No encryption keys to display.'
                    })
                ]
            }),
            confirmModal && confirmConfig && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_23.Modal, {
                isOpen: !!confirmModal,
                onClose: ()=>setConfirmModal(null),
                title: confirmConfig.title,
                className: "w-[400px]",
                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_17.VStack, {
                    gap: 4,
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_24.InfoBox.Group, {
                            children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_24.InfoBox, {
                                label: "Key name",
                                value: confirmModal.keyName
                            })
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_25.FormField, {
                            label: "Reason",
                            required: true,
                            children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_26.Textarea, {
                                value: confirmReason,
                                onChange: (e)=>setConfirmReason(e.target.value),
                                maxLength: REASON_MAX_LENGTH,
                                placeholder: "Enter reason for change",
                                rows: 3,
                                fullWidth: true
                            })
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_17.HStack, {
                            gap: 2,
                            className: "w-full",
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_27.Button, {
                                    variant: "secondary",
                                    className: "flex-1",
                                    onClick: ()=>setConfirmModal(null),
                                    children: "Cancel"
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_27.Button, {
                                    variant: confirmConfig.variant,
                                    className: "flex-1",
                                    disabled: confirmReason.trim().length === 0,
                                    onClick: handleConfirmAction,
                                    children: confirmConfig.confirmLabel
                                })
                            ]
                        })
                    ]
                })
            })
        ]
    });
}


},

}]);
//# sourceMappingURL=src_pages_kms_CryptoKeyListPage_tsx.42b3ea45fc0d6206.js.map