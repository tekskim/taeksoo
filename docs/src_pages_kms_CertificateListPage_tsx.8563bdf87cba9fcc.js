"use strict";
(self["webpackChunk_thaki_tds"] = self["webpackChunk_thaki_tds"] || []).push([["src_pages_kms_CertificateListPage_tsx"], {
"./src/pages/kms/CertificateListPage.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (CertificateListPage)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var react__rspack_import_1 = __webpack_require__("./node_modules/react/index.js");
/* import */ var react_router_dom__rspack_import_3 = __webpack_require__("./node_modules/react-router/dist/development/chunk-JZWAC4HX.mjs");
/* import */ var _design_system__rspack_import_5 = __webpack_require__("./src/design-system/presets/columnWidths.ts");
/* import */ var _design_system__rspack_import_7 = __webpack_require__("./src/design-system/components/Badge/BadgeList.tsx");
/* import */ var _design_system__rspack_import_8 = __webpack_require__("./src/design-system/components/ContextMenu/ContextMenu.tsx");
/* import */ var _design_system__rspack_import_10 = __webpack_require__("./src/design-system/components/PageShell/PageShell.tsx");
/* import */ var _design_system__rspack_import_12 = __webpack_require__("./src/design-system/components/TabBar/TabBar.tsx");
/* import */ var _design_system__rspack_import_13 = __webpack_require__("./src/design-system/components/TopBar/TopBar.tsx");
/* import */ var _design_system__rspack_import_14 = __webpack_require__("./src/design-system/components/Breadcrumb/Breadcrumb.tsx");
/* import */ var _design_system__rspack_import_15 = __webpack_require__("./src/design-system/layouts/Stack.tsx");
/* import */ var _design_system__rspack_import_16 = __webpack_require__("./src/design-system/components/PageHeader/PageHeader.tsx");
/* import */ var _design_system__rspack_import_17 = __webpack_require__("./src/design-system/components/MetricCard/MetricCard.tsx");
/* import */ var _design_system__rspack_import_18 = __webpack_require__("./src/design-system/components/ListToolbar/ListToolbar.tsx");
/* import */ var _design_system__rspack_import_19 = __webpack_require__("./src/design-system/components/Input/FilterSearchInput.tsx");
/* import */ var _design_system__rspack_import_20 = __webpack_require__("./src/design-system/components/Pagination/Pagination.tsx");
/* import */ var _design_system__rspack_import_21 = __webpack_require__("./src/design-system/components/Table/Table.tsx");
/* import */ var _tabler_icons_react__rspack_import_9 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconDotsCircleHorizontal.mjs");
/* import */ var _components_KmsSidebar__rspack_import_11 = __webpack_require__("./src/components/KmsSidebar.tsx");
/* import */ var _contexts_TabContext__rspack_import_4 = __webpack_require__("./src/contexts/TabContext.tsx");
/* import */ var _shared__rspack_import_6 = __webpack_require__("./src/pages/kms/shared.tsx");
/* import */ var _models_certificate__rspack_import_2 = __webpack_require__("./src/pages/kms/models/certificate.ts");
/* import */ var _CertificateActionModals__rspack_import_22 = __webpack_require__("./src/pages/kms/CertificateActionModals.tsx");










const PAGE_SIZE = 10;
const STATUS_OPTIONS = [
    {
        value: 'active',
        label: 'Active'
    },
    {
        value: 'expiring',
        label: 'Expiring'
    },
    {
        value: 'expired',
        label: 'Expired'
    },
    {
        value: 'revoked',
        label: 'Revoked'
    }
];
function CertificateListPage() {
    const [sidebarOpen, setSidebarOpen] = (0,react__rspack_import_1.useState)(true);
    const [appliedFilters, setAppliedFilters] = (0,react__rspack_import_1.useState)([]);
    const [page, setPage] = (0,react__rspack_import_1.useState)(1);
    const [certificates, setCertificates] = (0,react__rspack_import_1.useState)(_models_certificate__rspack_import_2.DUMMY_CERTIFICATES);
    const [actionModal, setActionModal] = (0,react__rspack_import_1.useState)(null);
    const navigate = (0,react_router_dom__rspack_import_3.useNavigate)();
    const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = (0,_contexts_TabContext__rspack_import_4.useTabs)();
    const sidebarWidth = sidebarOpen ? 200 : 0;
    // ── Status summary ──────────────────────────────────────────────────────────
    const statusSummary = (0,react__rspack_import_1.useMemo)(()=>{
        const counts = {
            active: 0,
            expiring: 0,
            expired: 0,
            revoked: 0
        };
        certificates.forEach((c)=>{
            counts[c.status] += 1;
        });
        return counts;
    }, [
        certificates
    ]);
    // ── Filtering (name matches CN or SAN; status exact) ───────────────────────
    const filteredCertificates = (0,react__rspack_import_1.useMemo)(()=>{
        return certificates.filter((certificate)=>{
            for (const f of appliedFilters){
                if (f.fieldId === 'name') {
                    const nameQuery = f.value.toLowerCase();
                    const matchesName = certificate.commonName.toLowerCase().includes(nameQuery) || certificate.san.some((s)=>s.toLowerCase().includes(nameQuery));
                    if (!matchesName) return false;
                }
                if (f.fieldId === 'status' && certificate.status !== f.value) return false;
            }
            return true;
        });
    }, [
        appliedFilters,
        certificates
    ]);
    // ── Row actions (Renew / Revoke) — 상세 페이지와 동일한 모달 재사용 ──────────
    const handleRevokeCertificate = ()=>{
        if (!actionModal) return;
        const { id } = actionModal.cert;
        setCertificates((previous)=>previous.map((certificate)=>{
                var _certificate_optionalActions;
                return certificate.id === id ? {
                    ...certificate,
                    status: 'revoked',
                    optionalActions: (_certificate_optionalActions = certificate.optionalActions) === null || _certificate_optionalActions === void 0 ? void 0 : _certificate_optionalActions.filter((action)=>action !== 'revoke')
                } : certificate;
            }));
        setActionModal(null);
    };
    const handleRenewCertificate = ()=>{
        setActionModal(null);
    };
    const totalPages = Math.max(1, Math.ceil(filteredCertificates.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const pagedCertificates = filteredCertificates.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
    const handleFiltersChange = (next)=>{
        setAppliedFilters(next);
        setPage(1);
    };
    // ── Table columns ───────────────────────────────────────────────────────────
    // TDS 컬럼 순서: Status → Name → [기타 속성] → Date → Action
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
            key: 'commonName',
            label: 'Common Name (CN)',
            flex: 1,
            minWidth: _design_system__rspack_import_5.columnMinWidths.name,
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-md font-medium text-[var(--color-action-primary)] hover:underline truncate block min-w-0",
                    children: row.commonName
                })
        },
        {
            key: 'san',
            label: 'SAN',
            flex: 1,
            minWidth: _design_system__rspack_import_5.columnMinWidths.nameWide,
            render: (_, row)=>row.san.length > 0 ? /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_7.BadgeList, {
                    items: row.san,
                    maxVisible: 1,
                    maxBadgeWidth: "160px",
                    theme: "gry",
                    size: "sm"
                }) : /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm text-[var(--color-text-subtle)]",
                    children: "-"
                })
        },
        {
            key: 'issuerCa',
            label: 'Issuer CA',
            flex: 1,
            minWidth: _design_system__rspack_import_5.columnMinWidths.issuer,
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm text-[var(--color-text-subtle)] truncate block min-w-0",
                    children: row.issuerCa || '-'
                })
        },
        {
            key: 'daysRemaining',
            label: 'Days remaining',
            flex: 1,
            minWidth: _design_system__rspack_import_5.columnMinWidths.expiresAt,
            render: (_, row)=>row.daysRemaining < 0 ? /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm font-medium text-[var(--color-state-danger)]",
                    children: "Expired"
                }) : /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("span", {
                    className: "text-body-sm font-mono text-[var(--color-text-default)]",
                    children: [
                        "D-",
                        row.daysRemaining
                    ]
                })
        },
        {
            key: 'issuedAt',
            label: 'Issued at',
            flex: 1,
            minWidth: _design_system__rspack_import_5.columnMinWidths.createdAt,
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm text-[var(--color-text-subtle)]",
                    children: (0,_shared__rspack_import_6.formatDate)(row.issuedAt)
                })
        },
        {
            key: 'expiresAt',
            label: 'Expires at',
            flex: 1,
            minWidth: _design_system__rspack_import_5.columnMinWidths.createdAt,
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm text-[var(--color-text-subtle)]",
                    children: (0,_shared__rspack_import_6.formatDate)(row.expiresAt)
                })
        },
        {
            key: '_action',
            label: 'Action',
            width: _design_system__rspack_import_5.fixedColumns.actions,
            align: 'center',
            resizable: false,
            render: (_, row)=>{
                // 상태/옵션에 따라 수행 가능한 액션만 노출. 클릭 시 상세 페이지와 동일한 모달 오픈.
                const items = [
                    ...(0,_models_certificate__rspack_import_2.hasCertificateOptionalAction)(row, 'renew') ? [
                        {
                            id: 'renew',
                            label: 'Renew',
                            onClick: ()=>setActionModal({
                                    type: 'renew',
                                    cert: row
                                })
                        }
                    ] : [],
                    ...(0,_models_certificate__rspack_import_2.canRevokeCertificate)(row) ? [
                        {
                            id: 'revoke',
                            label: 'Revoke',
                            onClick: ()=>setActionModal({
                                    type: 'revoke',
                                    cert: row
                                })
                        }
                    ] : []
                ];
                if (items.length === 0) {
                    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                        className: "text-body-sm text-[var(--color-text-subtle)]",
                        children: "-"
                    });
                }
                return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                    onClick: (e)=>e.stopPropagation(),
                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.ContextMenu, {
                        items: items,
                        trigger: "click",
                        align: "right",
                        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("button", {
                            "aria-label": "Row actions",
                            className: "p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors",
                            children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_9["default"], {
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
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_10.PageShell, {
        sidebar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_components_KmsSidebar__rspack_import_11.KmsSidebar, {
            isOpen: sidebarOpen,
            onToggle: ()=>setSidebarOpen(!sidebarOpen)
        }),
        sidebarWidth: sidebarWidth,
        tabBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_12.TabBar, {
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
        topBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.TopBar, {
            showSidebarToggle: !sidebarOpen,
            onSidebarToggle: ()=>setSidebarOpen(!sidebarOpen),
            showNavigation: true,
            onBack: ()=>window.history.back(),
            onForward: ()=>window.history.forward(),
            breadcrumb: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_14.Breadcrumb, {
                items: [
                    {
                        label: 'KMS',
                        href: '/kms/overview'
                    },
                    {
                        label: 'Certificates'
                    }
                ]
            })
        }),
        contentClassName: "pt-4 px-8 pb-20",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_15.VStack, {
                gap: 4,
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_16.PageHeader, {
                        title: "Certificates"
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_17.MetricCard.Group, {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_17.MetricCard, {
                                title: "Active",
                                value: String(statusSummary.active),
                                accent: "success"
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_17.MetricCard, {
                                title: "Expiring",
                                value: String(statusSummary.expiring)
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_17.MetricCard, {
                                title: "Expired",
                                value: String(statusSummary.expired),
                                accent: "error"
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_17.MetricCard, {
                                title: "Revoked",
                                value: String(statusSummary.revoked),
                                accent: "error"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_18.ListToolbar, {
                        primaryActions: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_18.ListToolbar.Actions, {
                            children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_19.FilterSearchInput, {
                                size: "sm",
                                filters: [
                                    {
                                        id: 'name',
                                        label: 'Name',
                                        type: 'text',
                                        placeholder: 'e.g. auth-service.kms.svc'
                                    },
                                    {
                                        id: 'status',
                                        label: 'Status',
                                        type: 'select',
                                        options: STATUS_OPTIONS
                                    }
                                ],
                                appliedFilters: appliedFilters,
                                onFiltersChange: handleFiltersChange,
                                placeholder: "Search certificates by attributes",
                                className: "w-[var(--search-input-width)]"
                            })
                        })
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_20.Pagination, {
                        currentPage: safePage,
                        totalPages: totalPages,
                        onPageChange: setPage,
                        totalItems: filteredCertificates.length
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_21.Table, {
                        columns: columns,
                        data: pagedCertificates,
                        rowKey: "id",
                        onRowClick: (row)=>navigate(`/kms/certificates/${row.id}`),
                        emptyMessage: appliedFilters.length > 0 ? 'No certificates match the current filter. Try adjusting your search or filter criteria.' : 'No certificates to display.',
                        resizable: false
                    })
                ]
            }),
            (actionModal === null || actionModal === void 0 ? void 0 : actionModal.type) === 'renew' && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_CertificateActionModals__rspack_import_22.RenewCertificateConfirmModal, {
                isOpen: true,
                commonName: actionModal.cert.commonName,
                onCancel: ()=>setActionModal(null),
                onConfirm: handleRenewCertificate
            }),
            (actionModal === null || actionModal === void 0 ? void 0 : actionModal.type) === 'revoke' && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_CertificateActionModals__rspack_import_22.RevokeCertificateConfirmModal, {
                isOpen: true,
                commonName: actionModal.cert.commonName,
                onCancel: ()=>setActionModal(null),
                onConfirm: handleRevokeCertificate
            })
        ]
    });
}


},

}]);
//# sourceMappingURL=src_pages_kms_CertificateListPage_tsx.8563bdf87cba9fcc.js.map