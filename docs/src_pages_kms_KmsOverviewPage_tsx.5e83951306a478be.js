"use strict";
(self["webpackChunk_thaki_tds"] = self["webpackChunk_thaki_tds"] || []).push([["src_pages_kms_KmsOverviewPage_tsx"], {
"./src/design-system/components/Skeleton/Skeleton.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  Skeleton: () => (Skeleton),
  SkeletonAvatar: () => (SkeletonAvatar),
  SkeletonButton: () => (SkeletonButton),
  SkeletonCard: () => (SkeletonCard),
  SkeletonImage: () => (SkeletonImage),
  SkeletonTable: () => (SkeletonTable),
  SkeletonText: () => (SkeletonText),
  "default": () => (__rspack_default_export)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var react__rspack_import_1 = __webpack_require__("./node_modules/react/index.js");
/* import */ var _utils_cn__rspack_import_2 = __webpack_require__("./src/design-system/utils/cn.ts");



/* ----------------------------------------
   Skeleton Component
   ---------------------------------------- */ const Skeleton = /*#__PURE__*/ (0,react__rspack_import_1.forwardRef)(({ variant = 'text', width, height, animation = 'pulse', count = 1, gap = 8, loading = true, children, size, className = '', style, ...props }, ref)=>{
    // If not loading, show children
    if (!loading && children) {
        return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(react_jsx_runtime__rspack_import_0.Fragment, {
            children: children
        });
    }
    // Base styles
    const baseStyles = [
        'bg-[var(--color-surface-muted)]',
        animation === 'pulse' && 'animate-pulse',
        animation === 'wave' && 'animate-shimmer'
    ].filter(Boolean).join(' ');
    // Variant-specific styles
    const variantStyles = {
        text: 'rounded-[var(--radius-sm)]',
        circular: 'rounded-full',
        rectangular: 'rounded-none',
        rounded: 'rounded-[var(--radius-md)]'
    };
    // Calculate dimensions
    const getWidth = ()=>{
        if (width) return typeof width === 'number' ? `${width}px` : width;
        if (variant === 'circular' && size) return `${size}px`;
        if (variant === 'text') return '100%';
        return undefined;
    };
    const getHeight = ()=>{
        if (height) return typeof height === 'number' ? `${height}px` : height;
        if (variant === 'circular' && size) return `${size}px`;
        if (variant === 'text') return '1em';
        return undefined;
    };
    const skeletonStyle = {
        width: getWidth(),
        height: getHeight(),
        ...style
    };
    // Render multiple skeletons if count > 1
    if (count > 1) {
        return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
            ref: ref,
            "data-figma-name": "[TDS] Skeleton",
            className: (0,_utils_cn__rspack_import_2.twMerge)('flex flex-col', className),
            style: {
                gap
            },
            ...props,
            children: Array.from({
                length: count
            }).map((_, index)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                    className: (0,_utils_cn__rspack_import_2.twMerge)(baseStyles, variantStyles[variant]),
                    style: {
                        ...skeletonStyle,
                        width: variant === 'text' && index === count - 1 ? '80%' : skeletonStyle.width
                    }
                }, index))
        });
    }
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
        ref: ref,
        "data-figma-name": "[TDS] Skeleton",
        className: (0,_utils_cn__rspack_import_2.twMerge)(baseStyles, variantStyles[variant], className),
        style: skeletonStyle,
        ...props
    });
});
Skeleton.displayName = 'Skeleton';
const SkeletonText = /*#__PURE__*/ (0,react__rspack_import_1.forwardRef)(({ lines = 3, ...props }, ref)=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(Skeleton, {
        ref: ref,
        variant: "text",
        count: lines,
        height: 16,
        ...props
    });
});
SkeletonText.displayName = 'SkeletonText';
const avatarSizes = {
    sm: 32,
    md: 40,
    lg: 56
};
const SkeletonAvatar = /*#__PURE__*/ (0,react__rspack_import_1.forwardRef)(({ size = 'md', ...props }, ref)=>{
    const sizeValue = typeof size === 'number' ? size : avatarSizes[size];
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(Skeleton, {
        ref: ref,
        variant: "circular",
        size: sizeValue,
        ...props
    });
});
SkeletonAvatar.displayName = 'SkeletonAvatar';
const buttonSizes = {
    sm: {
        width: 64,
        height: 28
    },
    md: {
        width: 80,
        height: 32
    },
    lg: {
        width: 96,
        height: 40
    }
};
const SkeletonButton = /*#__PURE__*/ (0,react__rspack_import_1.forwardRef)(({ size = 'md', ...props }, ref)=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(Skeleton, {
        ref: ref,
        variant: "rounded",
        width: buttonSizes[size].width,
        height: buttonSizes[size].height,
        ...props
    });
});
SkeletonButton.displayName = 'SkeletonButton';
const SkeletonImage = /*#__PURE__*/ (0,react__rspack_import_1.forwardRef)(({ aspectRatio = '16/9', width = '100%', ...props }, ref)=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(Skeleton, {
        ref: ref,
        variant: "rounded",
        width: width,
        style: {
            aspectRatio
        },
        ...props
    });
});
SkeletonImage.displayName = 'SkeletonImage';
const SkeletonCard = /*#__PURE__*/ (0,react__rspack_import_1.forwardRef)(({ avatar = true, lines = 3, image = false, className = '', ...props }, ref)=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("div", {
        ref: ref,
        className: (0,_utils_cn__rspack_import_2.twMerge)('flex flex-col gap-4 p-4', 'bg-[var(--color-surface-default)]', 'border border-[var(--color-border-default)]', 'rounded-[var(--radius-lg)]', className),
        ...props,
        children: [
            image && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(SkeletonImage, {}),
            avatar && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(SkeletonAvatar, {
                        size: "md"
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("div", {
                        className: "flex-1 flex flex-col gap-2",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(Skeleton, {
                                variant: "text",
                                width: "60%",
                                height: 16
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(Skeleton, {
                                variant: "text",
                                width: "40%",
                                height: 12
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(SkeletonText, {
                lines: lines
            })
        ]
    });
});
SkeletonCard.displayName = 'SkeletonCard';
const SkeletonTable = /*#__PURE__*/ (0,react__rspack_import_1.forwardRef)(({ rows = 5, columns = 4, className = '', ...props }, ref)=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("div", {
        ref: ref,
        "data-figma-name": "[TDS] SkeletonTable",
        className: (0,_utils_cn__rspack_import_2.twMerge)('flex flex-col gap-2', className),
        ...props,
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                className: "flex gap-4 py-2 border-b border-[var(--color-border-default)]",
                children: Array.from({
                    length: columns
                }).map((_, i)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(Skeleton, {
                        variant: "text",
                        width: i === 0 ? '20%' : `${60 / (columns - 1)}%`,
                        height: 14
                    }, `header-${i}`))
            }),
            Array.from({
                length: rows
            }).map((_, rowIndex)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                    className: "flex gap-4 py-3 border-b border-[var(--color-border-subtle)]",
                    children: Array.from({
                        length: columns
                    }).map((_, colIndex)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(Skeleton, {
                            variant: "text",
                            width: colIndex === 0 ? '20%' : `${60 / (columns - 1)}%`,
                            height: 16
                        }, `cell-${rowIndex}-${colIndex}`))
                }, `row-${rowIndex}`))
        ]
    });
});
SkeletonTable.displayName = 'SkeletonTable';
/* export default */ const __rspack_default_export = (Skeleton);


},
"./src/pages/kms/KmsOverviewPage.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (KmsOverviewPage)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var react__rspack_import_1 = __webpack_require__("./node_modules/react/index.js");
/* import */ var react_router_dom__rspack_import_3 = __webpack_require__("./node_modules/react-router/dist/development/chunk-JZWAC4HX.mjs");
/* import */ var _design_system__rspack_import_2 = __webpack_require__("./src/design-system/components/Skeleton/Skeleton.tsx");
/* import */ var _design_system__rspack_import_8 = __webpack_require__("./src/design-system/presets/columnWidths.ts");
/* import */ var _design_system__rspack_import_10 = __webpack_require__("./src/design-system/components/PageShell/PageShell.tsx");
/* import */ var _design_system__rspack_import_12 = __webpack_require__("./src/design-system/components/TabBar/TabBar.tsx");
/* import */ var _design_system__rspack_import_13 = __webpack_require__("./src/design-system/components/TopBar/TopBar.tsx");
/* import */ var _design_system__rspack_import_14 = __webpack_require__("./src/design-system/components/Breadcrumb/Breadcrumb.tsx");
/* import */ var _design_system__rspack_import_15 = __webpack_require__("./src/design-system/layouts/Stack.tsx");
/* import */ var _design_system__rspack_import_16 = __webpack_require__("./src/design-system/components/PageHeader/PageHeader.tsx");
/* import */ var _design_system__rspack_import_17 = __webpack_require__("./src/design-system/components/Table/Table.tsx");
/* import */ var _components_KmsSidebar__rspack_import_11 = __webpack_require__("./src/components/KmsSidebar.tsx");
/* import */ var _contexts_TabContext__rspack_import_4 = __webpack_require__("./src/contexts/TabContext.tsx");
/* import */ var _shared__rspack_import_9 = __webpack_require__("./src/pages/kms/shared.tsx");
/* import */ var _mocks_cryptoKeysRepository__rspack_import_5 = __webpack_require__("./src/pages/kms/mocks/cryptoKeysRepository.ts");
/* import */ var _mocks_secretsRepository__rspack_import_6 = __webpack_require__("./src/pages/kms/mocks/secretsRepository.ts");
/* import */ var _models_certificate__rspack_import_7 = __webpack_require__("./src/pages/kms/models/certificate.ts");










/* ─────────────────────────────────────────────────────────────────
   Constants & helpers (ported from kms HomePage.tsx)
   ───────────────────────────────────────────────────────────────── */ const DASHBOARD_MAX_ITEMS = 5;
/** state-color text classes per certificate status (CERT_STATUS_COLOR_MAP) */ const CERT_STATUS_COLOR_MAP = {
    active: 'text-[var(--color-state-success)]',
    expiring: 'text-[var(--color-state-warning)]',
    expired: 'text-[var(--color-state-danger)]',
    revoked: 'text-[var(--color-text-subtle)]'
};
/** state-color text classes per secret status (SECRET_STATUS_COLOR_MAP) */ const SECRET_STATUS_COLOR_MAP = {
    active: 'text-[var(--color-state-success)]',
    expired: 'text-[var(--color-state-danger)]',
    deactivated: 'text-[var(--color-state-warning)]',
    deleted: 'text-[var(--color-text-subtle)]',
    destroyed: 'text-[var(--color-text-subtle)]'
};
function SectionSkeleton({ rows = 2 }) {
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(react_jsx_runtime__rspack_import_0.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_2.Skeleton, {
                width: 140,
                height: 20
            }),
            Array.from({
                length: rows
            }).map((_, i)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_2.Skeleton, {
                    height: 80
                }, i))
        ]
    });
}
/* ─────────────────────────────────────────────────────────────────
   Main Page
   ───────────────────────────────────────────────────────────────── */ function KmsOverviewPage() {
    const [sidebarOpen, setSidebarOpen] = (0,react__rspack_import_1.useState)(true);
    const navigate = (0,react_router_dom__rspack_import_3.useNavigate)();
    const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = (0,_contexts_TabContext__rspack_import_4.useTabs)();
    const sidebarWidth = sidebarOpen ? 200 : 0;
    /* ── Async mock data (TanStack Query 대응: useEffect + useState) ── */ const [keys, setKeys] = (0,react__rspack_import_1.useState)(null);
    const [secrets, setSecrets] = (0,react__rspack_import_1.useState)(null);
    (0,react__rspack_import_1.useEffect)(()=>{
        let cancelled = false;
        (0,_mocks_cryptoKeysRepository__rspack_import_5.listMockCryptoKeys)({
            page: 1,
            pageSize: 1000
        }).then((result)=>{
            if (!cancelled) setKeys(result.items);
        });
        (0,_mocks_secretsRepository__rspack_import_6.listMockSecrets)({
            page: 1,
            pageSize: 1000
        }).then((result)=>{
            if (!cancelled) setSecrets(result.items);
        });
        return ()=>{
            cancelled = true;
        };
    }, []);
    const isKeysLoading = keys === null;
    const isSecretsLoading = secrets === null;
    const isLoading = isKeysLoading || isSecretsLoading;
    const totalKeys = (keys === null || keys === void 0 ? void 0 : keys.length) ?? 0;
    const totalSecrets = (secrets === null || secrets === void 0 ? void 0 : secrets.length) ?? 0;
    const totalCerts = _models_certificate__rspack_import_7.DUMMY_CERTIFICATES.length;
    /* ── Encryption Keys stats ── */ const scheduledKeys = (0,react__rspack_import_1.useMemo)(()=>(keys === null || keys === void 0 ? void 0 : keys.filter((k)=>k.nextRotationAt !== null).length) ?? 0, [
        keys
    ]);
    const notScheduledKeys = totalKeys - scheduledKeys;
    const overdueKeys = (0,react__rspack_import_1.useMemo)(()=>{
        const now = Date.now();
        return (keys === null || keys === void 0 ? void 0 : keys.filter((k)=>k.nextRotationAt && new Date(k.nextRotationAt).getTime() < now)) ?? [];
    }, [
        keys
    ]);
    /* ── Certificate stats ── */ const certStatusCounts = (0,react__rspack_import_1.useMemo)(()=>{
        const counts = {
            active: 0,
            expiring: 0,
            expired: 0,
            revoked: 0
        };
        _models_certificate__rspack_import_7.DUMMY_CERTIFICATES.forEach((cert)=>{
            if (cert.status in counts) {
                counts[cert.status]++;
            }
        });
        return counts;
    }, []);
    const attentionCerts = (0,react__rspack_import_1.useMemo)(()=>_models_certificate__rspack_import_7.DUMMY_CERTIFICATES.filter((cert)=>cert.status === 'expiring' || cert.status === 'expired').sort((a, b)=>new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()), []);
    /* ── Secret stats ── */ const secretStatusCounts = (0,react__rspack_import_1.useMemo)(()=>{
        const counts = {
            active: 0,
            expired: 0,
            deactivated: 0,
            deleted: 0
        };
        secrets === null || secrets === void 0 ? void 0 : secrets.forEach((secret)=>{
            if (secret.status in counts) {
                counts[secret.status]++;
            }
        });
        return counts;
    }, [
        secrets
    ]);
    /* ── Rotation Overdue table columns ── */ const overdueColumns = [
        {
            key: 'name',
            label: 'Name',
            flex: 1,
            minWidth: _design_system__rspack_import_8.columnMinWidths.name,
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("button", {
                    type: "button",
                    className: "inline-flex items-center border-0 bg-transparent p-0 text-body-sm text-[var(--color-action-primary)] hover:underline text-left truncate max-w-full cursor-pointer",
                    onClick: (e)=>{
                        e.stopPropagation();
                        navigate(`/kms/keys/${encodeURIComponent(row.slug)}`);
                    },
                    children: row.name
                })
        },
        {
            key: 'algorithm',
            label: 'Algorithm',
            flex: 1,
            minWidth: _design_system__rspack_import_8.columnMinWidths.node,
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm font-mono text-[var(--color-text-subtle)]",
                    children: row.algorithm
                })
        },
        {
            key: 'nextRotationAt',
            label: 'Overdue since',
            flex: 1,
            minWidth: _design_system__rspack_import_8.columnMinWidths.timestamp,
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm font-mono text-[var(--color-state-danger)]",
                    children: (0,_shared__rspack_import_9.formatAbsoluteDatetime)(row.nextRotationAt)
                })
        }
    ];
    /* ── Certificates requiring attention table columns ── */ const attentionCertColumns = [
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
            key: 'commonName',
            label: 'Name',
            flex: 1,
            minWidth: _design_system__rspack_import_8.columnMinWidths.nameLg,
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("button", {
                    type: "button",
                    className: "inline-flex items-center border-0 bg-transparent p-0 text-body-sm text-[var(--color-action-primary)] hover:underline text-left truncate max-w-full cursor-pointer",
                    onClick: (e)=>{
                        e.stopPropagation();
                        navigate(`/kms/certificates/${encodeURIComponent(row.id)}`);
                    },
                    children: row.commonName
                })
        },
        {
            key: 'daysRemaining',
            label: 'Days Remaining',
            flex: 1,
            minWidth: _design_system__rspack_import_8.columnMinWidths.expiresAt,
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("span", {
                    className: row.daysRemaining < 0 ? 'text-body-sm text-[var(--color-state-danger)] font-medium' : 'text-body-sm text-[var(--color-state-warning)] font-medium',
                    children: [
                        row.daysRemaining,
                        " days"
                    ]
                })
        },
        {
            key: 'expiresAt',
            label: 'Expires At',
            flex: 1,
            minWidth: _design_system__rspack_import_8.columnMinWidths.timestamp,
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm text-[var(--color-text-default)]",
                    children: (0,_shared__rspack_import_9.formatAbsoluteDatetime)(row.expiresAt)
                })
        }
    ];
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_10.PageShell, {
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
                        label: 'Overview'
                    }
                ]
            })
        }),
        contentClassName: "pt-4 px-8 pb-20",
        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_15.VStack, {
            gap: 4,
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_16.PageHeader, {
                    title: "Overview"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("div", {
                    className: "flex flex-col gap-6 w-full",
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                            className: "bg-[var(--color-surface-default)] rounded-xl border border-[var(--color-border-default)] p-4 flex flex-col gap-4",
                            children: isKeysLoading ? /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(SectionSkeleton, {
                                rows: 2
                            }) : /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(react_jsx_runtime__rspack_import_0.Fragment, {
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("h6", {
                                        className: "text-heading-h6 text-[var(--color-text-default)]",
                                        children: [
                                            "Encryption keys (",
                                            totalKeys,
                                            ")"
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                                        className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
                                        children: [
                                            {
                                                label: 'Scheduled',
                                                value: totalKeys > 0 ? scheduledKeys : '-',
                                                count: scheduledKeys,
                                                color: 'text-[var(--color-state-success)]'
                                            },
                                            {
                                                label: 'Not Scheduled',
                                                value: totalKeys > 0 ? notScheduledKeys : '-',
                                                count: notScheduledKeys,
                                                color: 'text-[var(--color-text-subtle)]'
                                            }
                                        ].map((item)=>{
                                            const textColor = item.count === 0 ? 'text-[var(--color-text-subtle)]' : item.color;
                                            return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                                                className: "flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3",
                                                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("div", {
                                                    className: "flex flex-col gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                                                            className: `text-label-sm ${textColor}`,
                                                            children: item.label
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                                                            className: `text-heading-h3 ${textColor}`,
                                                            children: item.value
                                                        })
                                                    ]
                                                })
                                            }, item.label);
                                        })
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("div", {
                                        className: "flex flex-col gap-2 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("p", {
                                                className: "text-label-md text-[var(--color-text-subtle)]",
                                                children: "Rotation Overdue"
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                                                className: "overflow-x-auto min-w-0",
                                                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_17.Table, {
                                                    columns: overdueColumns,
                                                    data: overdueKeys.slice(0, DASHBOARD_MAX_ITEMS),
                                                    rowKey: "slug",
                                                    resizable: false,
                                                    emptyMessage: "No overdue keys"
                                                })
                                            }),
                                            overdueKeys.length > DASHBOARD_MAX_ITEMS && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("button", {
                                                type: "button",
                                                className: "border-0 bg-transparent p-0 text-body-sm text-[var(--color-action-primary)] hover:underline self-start cursor-pointer",
                                                onClick: ()=>navigate('/kms/keys'),
                                                children: [
                                                    "View all (",
                                                    overdueKeys.length,
                                                    " keys) →"
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                            className: "bg-[var(--color-surface-default)] rounded-xl border border-[var(--color-border-default)] p-4 flex flex-col gap-4",
                            children: isLoading ? /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(SectionSkeleton, {
                                rows: 3
                            }) : /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(react_jsx_runtime__rspack_import_0.Fragment, {
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("h6", {
                                        className: "text-heading-h6 text-[var(--color-text-default)]",
                                        children: [
                                            "Certificates (",
                                            totalCerts,
                                            ")"
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                                        className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
                                        children: [
                                            {
                                                label: 'Active',
                                                value: certStatusCounts.active,
                                                variant: 'active'
                                            },
                                            {
                                                label: 'Expiring soon',
                                                value: certStatusCounts.expiring,
                                                variant: 'expiring'
                                            },
                                            {
                                                label: 'Expired',
                                                value: certStatusCounts.expired,
                                                variant: 'expired'
                                            },
                                            {
                                                label: 'Revoked',
                                                value: certStatusCounts.revoked,
                                                variant: 'revoked'
                                            }
                                        ].map((item)=>{
                                            const textColor = item.value === 0 ? 'text-[var(--color-text-subtle)]' : CERT_STATUS_COLOR_MAP[item.variant];
                                            return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                                                className: "flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3",
                                                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("div", {
                                                    className: "flex flex-col gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                                                            className: `text-label-sm ${textColor}`,
                                                            children: item.label
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                                                            className: `text-heading-h3 ${textColor}`,
                                                            children: item.value
                                                        })
                                                    ]
                                                })
                                            }, item.label);
                                        })
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("div", {
                                        className: "flex flex-col gap-2 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("p", {
                                                className: "text-label-md text-[var(--color-text-subtle)]",
                                                children: "Certificates requiring attention"
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                                                className: "overflow-x-auto min-w-0",
                                                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_17.Table, {
                                                    columns: attentionCertColumns,
                                                    data: attentionCerts.slice(0, DASHBOARD_MAX_ITEMS),
                                                    rowKey: "id",
                                                    resizable: false,
                                                    emptyMessage: "No certificates require immediate attention."
                                                })
                                            }),
                                            attentionCerts.length > DASHBOARD_MAX_ITEMS && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("button", {
                                                type: "button",
                                                className: "border-0 bg-transparent p-0 text-body-sm text-[var(--color-action-primary)] hover:underline self-start cursor-pointer",
                                                onClick: ()=>navigate('/kms/certificates'),
                                                children: [
                                                    "View all (",
                                                    attentionCerts.length,
                                                    " certificates) →"
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                            className: "bg-[var(--color-surface-default)] rounded-xl border border-[var(--color-border-default)] p-4 flex flex-col gap-4",
                            children: isSecretsLoading ? /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(SectionSkeleton, {
                                rows: 1
                            }) : /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(react_jsx_runtime__rspack_import_0.Fragment, {
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("h6", {
                                        className: "text-heading-h6 text-[var(--color-text-default)]",
                                        children: [
                                            "Secrets (",
                                            totalSecrets,
                                            ")"
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                                        className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
                                        children: [
                                            {
                                                label: 'Active',
                                                value: secretStatusCounts.active,
                                                variant: 'active'
                                            },
                                            {
                                                label: 'Expired',
                                                value: secretStatusCounts.expired,
                                                variant: 'expired'
                                            },
                                            {
                                                label: 'Deactivated',
                                                value: secretStatusCounts.deactivated,
                                                variant: 'deactivated'
                                            },
                                            {
                                                label: 'Deleted',
                                                value: secretStatusCounts.deleted,
                                                variant: 'deleted'
                                            }
                                        ].map((item)=>{
                                            const textColor = item.value === 0 ? 'text-[var(--color-text-subtle)]' : SECRET_STATUS_COLOR_MAP[item.variant];
                                            return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                                                className: "flex-1 bg-[var(--color-surface-subtle)] rounded-lg px-4 py-3",
                                                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("div", {
                                                    className: "flex flex-col gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                                                            className: `text-label-sm ${textColor}`,
                                                            children: item.label
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                                                            className: `text-heading-h3 ${textColor}`,
                                                            children: item.value
                                                        })
                                                    ]
                                                })
                                            }, item.label);
                                        })
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_shared__rspack_import_9.AuditLogSection, {
                            title: "Recent audit logs",
                            limit: 5
                        })
                    ]
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
"./src/pages/kms/models/certificate.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  CRL_REASON_CODES: () => (CRL_REASON_CODES),
  DUMMY_CERTIFICATES: () => (DUMMY_CERTIFICATES),
  canRevokeCertificate: () => (canRevokeCertificate),
  getCertificateById: () => (getCertificateById),
  hasCertificateOptionalAction: () => (hasCertificateOptionalAction)
});
const CRL_REASON_CODES = [
    {
        code: 'keyCompromise',
        value: 1
    },
    {
        code: 'cACompromise',
        value: 2
    },
    {
        code: 'affiliationChanged',
        value: 3
    },
    {
        code: 'superseded',
        value: 4
    },
    {
        code: 'cessationOfOperation',
        value: 5
    },
    {
        code: 'certificateHold',
        value: 6
    },
    {
        code: 'privilegeWithdrawn',
        value: 9
    },
    {
        code: 'unspecified',
        value: 0
    }
];
const DUMMY_CERTIFICATES = [
    {
        id: 'cert-auth-svc',
        commonName: 'auth-service.kms.svc',
        san: [
            'auth-service.kms.svc',
            'auth-service.kms.svc.cluster.local'
        ],
        status: 'active',
        issuedAt: '2026-01-10T09:00:00+09:00',
        expiresAt: '2027-01-10T08:59:59+09:00',
        daysRemaining: 257,
        issuerCa: 'Thaki Workload CA',
        serialNumber: '4A:7C:91:22:10:AF:01',
        signatureAlgorithm: 'SHA256withECDSA',
        publicKeyAlgorithm: 'ECDSA-P256',
        optionalActions: [
            'revoke',
            'renew'
        ]
    },
    {
        id: 'cert-frontend',
        commonName: 'frontend-gateway.kms.svc',
        san: [
            'frontend-gateway.kms.svc',
            'frontend-gateway.kms.svc.cluster.local'
        ],
        status: 'expired',
        issuedAt: '2024-02-01T09:00:00+09:00',
        expiresAt: '2026-02-01T08:59:59+09:00',
        daysRemaining: -86,
        issuerCa: 'Thaki Workload CA',
        serialNumber: '75:11:EC:48:31:09:AB',
        signatureAlgorithm: 'SHA256withECDSA',
        publicKeyAlgorithm: 'ECDSA-P256',
        optionalActions: []
    },
    {
        id: 'cert-payment',
        commonName: 'payment-api.kms.svc',
        san: [
            'payment-api.kms.svc',
            'pay.kms.svc.cluster.local',
            'billing.kms.svc.cluster.local'
        ],
        status: 'revoked',
        issuedAt: '2025-09-01T09:00:00+09:00',
        expiresAt: '2026-09-01T08:59:59+09:00',
        daysRemaining: 126,
        issuerCa: 'Thaki Workload CA',
        serialNumber: '02:BE:98:11:75:DA:30',
        signatureAlgorithm: 'SHA256withECDSA',
        publicKeyAlgorithm: 'ECDSA-P256',
        optionalActions: []
    },
    {
        id: 'cert-scheduler',
        commonName: 'scheduler.kms.svc',
        san: [
            'scheduler.kms.svc',
            'scheduler.kms.svc.cluster.local'
        ],
        status: 'expiring',
        issuedAt: '2025-05-20T09:00:00+09:00',
        expiresAt: '2026-05-18T08:59:59+09:00',
        daysRemaining: 20,
        issuerCa: 'Thaki Workload CA',
        serialNumber: '62:20:C4:99:7F:12:44',
        signatureAlgorithm: 'SHA256withECDSA',
        publicKeyAlgorithm: 'ECDSA-P256',
        optionalActions: [
            'renew'
        ]
    },
    {
        id: 'cert-controller',
        commonName: 'controller-manager.kms.svc',
        san: [
            'controller-manager.kms.svc'
        ],
        status: 'active',
        issuedAt: '2025-12-15T09:00:00+09:00',
        expiresAt: '2026-12-15T08:59:59+09:00',
        daysRemaining: 231,
        issuerCa: 'Thaki Workload CA',
        serialNumber: '91:30:2D:AE:08:CC:70',
        signatureAlgorithm: 'SHA256withECDSA',
        publicKeyAlgorithm: 'ECDSA-P256',
        optionalActions: [
            'revoke',
            'renew'
        ]
    },
    {
        id: 'cert-etcd',
        commonName: 'etcd-peer.kms.svc',
        san: [
            'etcd-peer.kms.svc',
            'etcd-peer.kms.svc.cluster.local'
        ],
        status: 'expiring',
        issuedAt: '2025-05-01T09:00:00+09:00',
        expiresAt: '2026-05-10T08:59:59+09:00',
        daysRemaining: 12,
        issuerCa: 'Thaki Workload CA',
        serialNumber: '10:7C:AF:64:29:35:DD',
        signatureAlgorithm: 'SHA256withECDSA',
        publicKeyAlgorithm: 'ECDSA-P256',
        optionalActions: [
            'renew'
        ]
    },
    {
        id: 'cert-api-gateway',
        commonName: 'api-gateway.kms.svc',
        san: [
            'api-gateway.kms.svc',
            'api-gateway.kms.svc.cluster.local'
        ],
        status: 'active',
        issuedAt: '2026-03-01T09:00:00+09:00',
        expiresAt: '2027-03-01T08:59:59+09:00',
        daysRemaining: 312,
        issuerCa: 'Thaki Workload CA',
        serialNumber: 'A1:4F:C8:11:22:33:44',
        signatureAlgorithm: 'SHA256withECDSA',
        publicKeyAlgorithm: 'ECDSA-P256',
        optionalActions: [
            'revoke',
            'renew'
        ]
    }
];
const getCertificateById = (certificateId)=>{
    if (!certificateId) return undefined;
    return DUMMY_CERTIFICATES.find((certificate)=>certificate.id === decodeURIComponent(certificateId));
};
/* 인증서 상태/옵션 기반 액션 가용성 — 상세·리스트 페이지에서 공통 사용 */ const canRevokeCertificate = (certificate)=>certificate.status === 'active' || certificate.status === 'expiring';
const hasCertificateOptionalAction = (certificate, action)=>{
    var _certificate_optionalActions;
    return ((_certificate_optionalActions = certificate.optionalActions) === null || _certificate_optionalActions === void 0 ? void 0 : _certificate_optionalActions.includes(action)) ?? false;
};


},

}]);
//# sourceMappingURL=src_pages_kms_KmsOverviewPage_tsx.5e83951306a478be.js.map