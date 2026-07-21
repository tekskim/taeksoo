"use strict";
(self["webpackChunk_thaki_tds"] = self["webpackChunk_thaki_tds"] || []).push([["src_pages_kms_CryptoKeyDetailPage_tsx"], {
"./src/pages/kms/CryptoKeyDetailPage.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (CryptoKeyDetailPage)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var react__rspack_import_1 = __webpack_require__("./node_modules/react/index.js");
/* import */ var react_router_dom__rspack_import_12 = __webpack_require__("./node_modules/react-router/dist/development/chunk-JZWAC4HX.mjs");
/* import */ var _design_system__rspack_import_3 = __webpack_require__("./src/design-system/components/Modal/Modal.tsx");
/* import */ var _design_system__rspack_import_4 = __webpack_require__("./src/design-system/layouts/Stack.tsx");
/* import */ var _design_system__rspack_import_5 = __webpack_require__("./src/design-system/components/InfoBox/InfoBox.tsx");
/* import */ var _design_system__rspack_import_6 = __webpack_require__("./src/design-system/components/FormField/FormField.tsx");
/* import */ var _design_system__rspack_import_7 = __webpack_require__("./src/design-system/components/Input/Textarea.tsx");
/* import */ var _design_system__rspack_import_8 = __webpack_require__("./src/design-system/components/Button/Button.tsx");
/* import */ var _design_system__rspack_import_9 = __webpack_require__("./src/design-system/components/Drawer/Drawer.tsx");
/* import */ var _design_system__rspack_import_10 = __webpack_require__("./src/design-system/components/Toggle/Toggle.tsx");
/* import */ var _design_system__rspack_import_11 = __webpack_require__("./src/design-system/components/Input/Input.tsx");
/* import */ var _design_system__rspack_import_15 = __webpack_require__("./src/design-system/presets/columnWidths.ts");
/* import */ var _design_system__rspack_import_16 = __webpack_require__("./src/design-system/components/Checkbox/Checkbox.tsx");
/* import */ var _design_system__rspack_import_17 = __webpack_require__("./src/design-system/components/Badge/Badge.tsx");
/* import */ var _design_system__rspack_import_18 = __webpack_require__("./src/design-system/components/ContextMenu/ContextMenu.tsx");
/* import */ var _design_system__rspack_import_20 = __webpack_require__("./src/design-system/components/Tag/Tag.tsx");
/* import */ var _design_system__rspack_import_21 = __webpack_require__("./src/design-system/components/PageShell/PageShell.tsx");
/* import */ var _design_system__rspack_import_23 = __webpack_require__("./src/design-system/components/TabBar/TabBar.tsx");
/* import */ var _design_system__rspack_import_24 = __webpack_require__("./src/design-system/components/TopBar/TopBar.tsx");
/* import */ var _design_system__rspack_import_25 = __webpack_require__("./src/design-system/components/Breadcrumb/Breadcrumb.tsx");
/* import */ var _design_system__rspack_import_26 = __webpack_require__("./src/design-system/components/EmptyState/EmptyState.tsx");
/* import */ var _design_system__rspack_import_27 = __webpack_require__("./src/design-system/components/DetailHeader/DetailHeader.tsx");
/* import */ var _design_system__rspack_import_28 = __webpack_require__("./src/design-system/components/Tabs/Tabs.tsx");
/* import */ var _design_system__rspack_import_29 = __webpack_require__("./src/design-system/components/SectionCard/SectionCard.tsx");
/* import */ var _design_system__rspack_import_30 = __webpack_require__("./src/design-system/components/Pagination/Pagination.tsx");
/* import */ var _design_system__rspack_import_31 = __webpack_require__("./src/design-system/components/Table/Table.tsx");
/* import */ var _components_KmsSidebar__rspack_import_22 = __webpack_require__("./src/components/KmsSidebar.tsx");
/* import */ var _contexts_TabContext__rspack_import_13 = __webpack_require__("./src/contexts/TabContext.tsx");
/* import */ var _tabler_icons_react__rspack_import_19 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconDotsCircleHorizontal.mjs");
/* import */ var _shared__rspack_import_2 = __webpack_require__("./src/pages/kms/shared.tsx");
/* import */ var _mocks_cryptoKeysRepository__rspack_import_14 = __webpack_require__("./src/pages/kms/mocks/cryptoKeysRepository.ts");









// ── Constants ─────────────────────────────────────────────────────────────────
const HISTORY_PAGE_SIZE = 10;
const REASON_MAX_LENGTH = 500;
const KMS_REASON_CODE_LABEL = {
    suspected_compromise: 'Suspected compromise (suspected_compromise)',
    routine_archive: 'Routine archive (routine_archive)',
    emergency_destroy: 'Emergency destroy (emergency_destroy)',
    manual_delete: 'Manual delete (manual_delete)'
};
const ROTATION_STATUS_THEME = {
    active: 'gre',
    deactivated: 'ylw',
    archived: 'gry',
    destroyed: 'red'
};
/** 버전 상태별 rotation history 액션 (kms CryptoKeyDetailPage 정책) */ const ROTATION_STATUS_ACTIONS = {
    active: [
        {
            nextStatus: 'archived',
            label: 'Archive',
            confirmType: 'archive',
            reasonCode: 'suspected_compromise'
        },
        {
            nextStatus: 'destroyed',
            label: 'Destroy',
            confirmType: 'destroy',
            danger: true,
            reasonCode: 'emergency_destroy'
        }
    ],
    deactivated: [
        {
            nextStatus: 'archived',
            label: 'Archive',
            confirmType: 'archive',
            reasonCode: 'routine_archive'
        },
        {
            nextStatus: 'destroyed',
            label: 'Destroy',
            confirmType: 'destroy',
            danger: true,
            reasonCode: 'manual_delete'
        }
    ],
    archived: [
        {
            nextStatus: 'deactivated',
            label: 'Restore',
            confirmType: 'restore'
        },
        {
            nextStatus: 'destroyed',
            label: 'Destroy',
            confirmType: 'destroy',
            danger: true,
            reasonCode: 'manual_delete'
        }
    ]
};
const STATUS_CONFIRM_CONFIG = {
    rotate: {
        title: 'Confirm key rotation',
        confirmLabel: 'Rotate now'
    },
    archive: {
        title: 'Confirm key version archive',
        confirmLabel: 'Archive'
    },
    restore: {
        title: 'Confirm key version restore',
        confirmLabel: 'Restore'
    },
    destroy: {
        title: 'Confirm key version destruction',
        confirmLabel: 'Destroy',
        danger: true
    }
};
// ── Helpers ───────────────────────────────────────────────────────────────────
const formatNullableDate = (value)=>value ? (0,_shared__rspack_import_2.formatDate)(value) : '-';
const formatRotationTimestamp = (item)=>{
    if (item.status === 'archived' || item.status === 'destroyed') return '-';
    return (0,_shared__rspack_import_2.formatDate)(item.rotatedAt);
};
function KeyVersionStatusConfirmModal({ keyName, versionLabels, actionType, reasonCode, onCancel, onConfirm }) {
    const [reason, setReason] = (0,react__rspack_import_1.useState)('');
    const config = STATUS_CONFIRM_CONFIG[actionType];
    const rationale = reasonCode ? `${reasonCode}: ${reason.trim()}` : reason.trim();
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_3.Modal, {
        isOpen: true,
        onClose: onCancel,
        title: config.title,
        className: "w-[400px]",
        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_4.VStack, {
            gap: 4,
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_5.InfoBox.Group, {
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_5.InfoBox, {
                            label: "Key name",
                            value: keyName || '-'
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_5.InfoBox, {
                            label: "Versions",
                            value: versionLabels.join(', ')
                        }),
                        reasonCode && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_5.InfoBox, {
                            label: "Reason code",
                            value: KMS_REASON_CODE_LABEL[reasonCode]
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.FormField, {
                    label: "Reason for change",
                    required: true,
                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_7.Textarea, {
                        value: reason,
                        onChange: (e)=>setReason(e.target.value),
                        maxLength: REASON_MAX_LENGTH,
                        placeholder: "Enter reason for change",
                        rows: 3,
                        fullWidth: true
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_4.HStack, {
                    gap: 2,
                    className: "w-full",
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.Button, {
                            variant: "secondary",
                            className: "flex-1",
                            onClick: onCancel,
                            children: "Cancel"
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.Button, {
                            variant: config.danger ? 'danger' : 'primary',
                            className: "flex-1",
                            disabled: reason.trim().length === 0,
                            onClick: ()=>onConfirm(rationale),
                            children: config.confirmLabel
                        })
                    ]
                })
            ]
        })
    });
}
function RotationSettingsDrawer({ isOpen, onClose, initialAutoRotation, initialPeriodDays, onSave }) {
    const [autoRotation, setAutoRotation] = (0,react__rspack_import_1.useState)(initialAutoRotation);
    const [periodDays, setPeriodDays] = (0,react__rspack_import_1.useState)(initialPeriodDays);
    (0,react__rspack_import_1.useEffect)(()=>{
        if (isOpen) {
            setAutoRotation(initialAutoRotation);
            setPeriodDays(initialPeriodDays);
        }
    }, [
        isOpen,
        initialAutoRotation,
        initialPeriodDays
    ]);
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_9.Drawer, {
        isOpen: isOpen,
        onClose: onClose,
        title: "Edit rotation settings",
        width: 480,
        footer: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_4.HStack, {
            gap: 2,
            className: "w-full",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.Button, {
                    variant: "secondary",
                    className: "flex-1",
                    onClick: onClose,
                    children: "Cancel"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.Button, {
                    variant: "primary",
                    className: "flex-1",
                    onClick: ()=>onSave(autoRotation, periodDays),
                    children: "Save"
                })
            ]
        }),
        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_4.VStack, {
            gap: 6,
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.FormField, {
                    label: "Automatic rotation",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_10.Toggle, {
                        name: "auto-rotation-drawer",
                        checked: autoRotation,
                        checkedLabel: "On",
                        uncheckedLabel: "Off",
                        onChange: (e)=>setAutoRotation(e.target.checked)
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.FormField, {
                    label: "Rotation period",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_4.HStack, {
                        gap: 2,
                        align: "center",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.Input, {
                                type: "number",
                                value: periodDays,
                                min: 30,
                                max: 365,
                                step: 30,
                                width: "sm",
                                disabled: !autoRotation,
                                onChange: (e)=>setPeriodDays(Number(e.target.value) || 30)
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                                className: "text-body-md text-[var(--color-text-subtle)]",
                                children: "days"
                            })
                        ]
                    })
                })
            ]
        })
    });
}
// ── Main Page ─────────────────────────────────────────────────────────────────
function CryptoKeyDetailPage() {
    const { keyNameSlug = '' } = (0,react_router_dom__rspack_import_12.useParams)();
    const [sidebarOpen, setSidebarOpen] = (0,react__rspack_import_1.useState)(true);
    const [activeTab, setActiveTab] = (0,react__rspack_import_1.useState)('rotation');
    const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = (0,_contexts_TabContext__rspack_import_13.useTabs)();
    const sidebarWidth = sidebarOpen ? 200 : 0;
    const [data, setData] = (0,react__rspack_import_1.useState)(null);
    const [isLoading, setIsLoading] = (0,react__rspack_import_1.useState)(true);
    const [autoRotationEnabled, setAutoRotationEnabled] = (0,react__rspack_import_1.useState)(false);
    const [rotationPeriodDays, setRotationPeriodDays] = (0,react__rspack_import_1.useState)(90);
    const [rotationLastUpdatedAt, setRotationLastUpdatedAt] = (0,react__rspack_import_1.useState)(null);
    const [isRotationSettingsDrawerOpen, setIsRotationSettingsDrawerOpen] = (0,react__rspack_import_1.useState)(false);
    const [currentVersion, setCurrentVersion] = (0,react__rspack_import_1.useState)(0);
    const [rotationHistory, setRotationHistory] = (0,react__rspack_import_1.useState)([]);
    const [historyPage, setHistoryPage] = (0,react__rspack_import_1.useState)(1);
    const [selectedVersions, setSelectedVersions] = (0,react__rspack_import_1.useState)(new Set());
    const [confirmModal, setConfirmModal] = (0,react__rspack_import_1.useState)(null);
    // ── Data loading (mock repository, async) ───────────────────────────────────
    (0,react__rspack_import_1.useEffect)(()=>{
        let cancelled = false;
        setIsLoading(true);
        (0,_mocks_cryptoKeysRepository__rspack_import_14.getMockCryptoKeyBySlug)(keyNameSlug).then((detail)=>{
            if (cancelled) return;
            setData(detail);
            setIsLoading(false);
        });
        return ()=>{
            cancelled = true;
        };
    }, [
        keyNameSlug
    ]);
    (0,react__rspack_import_1.useEffect)(()=>{
        if (!data) return;
        setAutoRotationEnabled(data.autoRotationEnabled);
        setRotationPeriodDays(data.rotationPeriodDays);
        setRotationLastUpdatedAt(data.updatedAt ?? null);
        setCurrentVersion(data.currentVersion);
        setRotationHistory(data.rotationHistory);
        setHistoryPage(1);
        setSelectedVersions(new Set());
    }, [
        data
    ]);
    const computedNextRotationAt = (0,react__rspack_import_1.useMemo)(()=>{
        if (!autoRotationEnabled || !rotationLastUpdatedAt) return '-';
        const base = new Date(rotationLastUpdatedAt);
        base.setDate(base.getDate() + rotationPeriodDays);
        return (0,_shared__rspack_import_2.formatDate)(base.toISOString());
    }, [
        autoRotationEnabled,
        rotationLastUpdatedAt,
        rotationPeriodDays
    ]);
    // ── Rotation history selection ──────────────────────────────────────────────
    const isSelectable = (0,react__rspack_import_1.useCallback)((item)=>item.status !== 'active' && item.status !== 'destroyed', []);
    const toggleVersion = (0,react__rspack_import_1.useCallback)((version)=>{
        setSelectedVersions((prev)=>{
            const next = new Set(prev);
            if (next.has(version)) {
                next.delete(version);
            } else {
                next.add(version);
            }
            return next;
        });
    }, []);
    // 전체 rotation history를 페이지당 10개씩 페이지네이션 (Encryption keys 리스트 패턴)
    const historyTotalPages = Math.max(1, Math.ceil(rotationHistory.length / HISTORY_PAGE_SIZE));
    const historySafePage = Math.min(historyPage, historyTotalPages);
    const visibleRotationHistory = (0,react__rspack_import_1.useMemo)(()=>rotationHistory.slice((historySafePage - 1) * HISTORY_PAGE_SIZE, historySafePage * HISTORY_PAGE_SIZE), [
        rotationHistory,
        historySafePage
    ]);
    // ── Action handlers ─────────────────────────────────────────────────────────
    const handleRotationSettingsSave = (newAutoRotation, newPeriodDays)=>{
        setAutoRotationEnabled(newAutoRotation);
        setRotationPeriodDays(newPeriodDays);
        setRotationLastUpdatedAt(new Date().toISOString());
        setIsRotationSettingsDrawerOpen(false);
    };
    const handleRotateNow = ()=>{
        if (!data) return;
        setConfirmModal({
            actionType: 'rotate',
            versionLabels: [
                `v${currentVersion}`
            ],
            onConfirm: (_rationale)=>{
                const nextVersion = currentVersion + 1;
                setCurrentVersion(nextVersion);
                setRotationHistory((previous)=>[
                        {
                            version: nextVersion,
                            rotatedAt: new Date().toISOString(),
                            status: 'active'
                        },
                        ...previous.map((item)=>item.status === 'active' ? {
                                ...item,
                                status: 'deactivated'
                            } : item)
                    ]);
                setRotationLastUpdatedAt(new Date().toISOString());
                setHistoryPage(1);
                setSelectedVersions(new Set());
                setConfirmModal(null);
            }
        });
    };
    const handleBulkDestroy = ()=>{
        if (selectedVersions.size === 0) return;
        const versionLabels = [
            ...selectedVersions
        ].sort((a, b)=>b - a).map((v)=>`v${v}`);
        const versionsSnapshot = new Set(selectedVersions);
        setConfirmModal({
            actionType: 'destroy',
            versionLabels,
            onConfirm: (_rationale)=>{
                setRotationHistory((prev)=>prev.map((item)=>versionsSnapshot.has(item.version) ? {
                            ...item,
                            status: 'destroyed'
                        } : item));
                setSelectedVersions(new Set());
                setConfirmModal(null);
            }
        });
    };
    const applyVersionStatus = (targetItem, nextStatus)=>{
        setRotationHistory((previous)=>previous.map((item)=>item.version === targetItem.version && item.rotatedAt === targetItem.rotatedAt ? {
                    ...item,
                    status: nextStatus
                } : item));
    };
    const handleVersionStatusAction = (item, action)=>{
        setConfirmModal({
            actionType: action.confirmType,
            versionLabels: [
                `v${item.version}`
            ],
            reasonCode: action.reasonCode,
            onConfirm: (_rationale)=>{
                applyVersionStatus(item, action.nextStatus);
                setConfirmModal(null);
            }
        });
    };
    // ── Rotation history table columns ──────────────────────────────────────────
    const historyColumns = [
        {
            key: '_select',
            label: '',
            width: _design_system__rspack_import_15.fixedColumns.checkbox,
            align: 'center',
            resizable: false,
            render: (_, item)=>isSelectable(item) ? /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                    onClick: (e)=>e.stopPropagation(),
                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_16.Checkbox, {
                        checked: selectedVersions.has(item.version),
                        onChange: ()=>toggleVersion(item.version),
                        "aria-label": `Select version v${item.version}`
                    })
                }) : /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm text-[var(--color-text-subtle)]",
                    children: "-"
                })
        },
        {
            key: 'status',
            label: 'Status',
            width: _design_system__rspack_import_15.fixedColumns.statusLabel,
            align: 'center',
            resizable: false,
            render: (_, item)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_17.Badge, {
                    theme: ROTATION_STATUS_THEME[item.status],
                    type: "subtle",
                    size: "sm",
                    children: item.status
                })
        },
        {
            key: 'version',
            label: 'Version',
            width: '90px',
            resizable: false,
            render: (v)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("span", {
                    className: "text-body-sm font-mono",
                    children: [
                        "v",
                        v
                    ]
                })
        },
        {
            key: 'rotatedAt',
            label: 'Rotated at',
            flex: 1,
            minWidth: '160px',
            render: (_, item)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm text-[var(--color-text-subtle)]",
                    children: formatRotationTimestamp(item)
                })
        },
        {
            key: '_action',
            label: 'Action',
            width: _design_system__rspack_import_15.fixedColumns.actions,
            align: 'center',
            resizable: false,
            render: (_, item)=>{
                const actions = ROTATION_STATUS_ACTIONS[item.status];
                if (!actions || actions.length === 0) {
                    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                        className: "text-body-sm text-[var(--color-text-subtle)]",
                        children: "-"
                    });
                }
                const menuItems = actions.map((action)=>({
                        id: `${action.confirmType}-${action.nextStatus}`,
                        label: action.label,
                        status: action.danger ? 'danger' : 'default',
                        onClick: ()=>handleVersionStatusAction(item, action)
                    }));
                return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                    onClick: (e)=>e.stopPropagation(),
                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_18.ContextMenu, {
                        items: menuItems,
                        trigger: "click",
                        align: "right",
                        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("button", {
                            "aria-label": `Open actions for version v${item.version}`,
                            className: "p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors",
                            children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_19["default"], {
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
    // ── Key information fields ──────────────────────────────────────────────────
    const summaryFields = [
        {
            label: 'Status',
            value: data ? /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_shared__rspack_import_2.KmsStateBadge, {
                status: data.status
            }) : '-'
        },
        {
            label: 'Algorithm',
            value: (data === null || data === void 0 ? void 0 : data.algorithm) ?? '-'
        },
        {
            label: 'Key purpose',
            value: (data === null || data === void 0 ? void 0 : data.purpose) ?? '-'
        },
        {
            label: 'Current version',
            value: data ? `v${currentVersion}` : '-'
        },
        {
            label: 'Created by',
            value: (data === null || data === void 0 ? void 0 : data.createdBy) ?? '-'
        },
        {
            label: 'Created at',
            value: formatNullableDate(data === null || data === void 0 ? void 0 : data.createdAt)
        },
        {
            label: 'Description',
            value: (data === null || data === void 0 ? void 0 : data.description) || '-'
        },
        {
            label: 'Tags',
            value: data && data.tags.length > 0 ? /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_4.HStack, {
                gap: 1,
                className: "flex-wrap",
                children: data.tags.map((tag)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_20.Tag, {
                        size: "sm",
                        outline: true,
                        children: [
                            tag.key,
                            "=",
                            tag.value
                        ]
                    }, tag.key))
            }) : '-'
        }
    ];
    const pageTitle = (data === null || data === void 0 ? void 0 : data.name) ?? keyNameSlug ?? 'Key details';
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_21.PageShell, {
        sidebar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_components_KmsSidebar__rspack_import_22.KmsSidebar, {
            isOpen: sidebarOpen,
            onToggle: ()=>setSidebarOpen(!sidebarOpen)
        }),
        sidebarWidth: sidebarWidth,
        tabBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_23.TabBar, {
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
        topBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_24.TopBar, {
            showSidebarToggle: !sidebarOpen,
            onSidebarToggle: ()=>setSidebarOpen(!sidebarOpen),
            showNavigation: true,
            onBack: ()=>window.history.back(),
            onForward: ()=>window.history.forward(),
            breadcrumb: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_25.Breadcrumb, {
                items: [
                    {
                        label: 'KMS',
                        href: '/kms/overview'
                    },
                    {
                        label: 'Encryption Keys',
                        href: '/kms/keys'
                    },
                    {
                        label: pageTitle
                    }
                ]
            })
        }),
        contentClassName: "pt-4 px-8 pb-20",
        children: [
            !isLoading && !data ? /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_26.EmptyState, {
                title: "Key not found",
                description: "The selected key may have been removed or is unavailable.",
                variant: "card"
            }) : /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_4.VStack, {
                gap: 4,
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_27.DetailHeader, {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_27.DetailHeader.Title, {
                                children: pageTitle
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_27.DetailHeader.InfoGrid, {
                                children: summaryFields.map(({ label, value })=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_27.DetailHeader.InfoCard, {
                                        label: label,
                                        value: value
                                    }, label))
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_28.Tabs, {
                        value: activeTab,
                        onChange: setActiveTab,
                        variant: "underline",
                        size: "sm",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_28.TabList, {
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_28.Tab, {
                                        value: "rotation",
                                        children: "Rotation"
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_28.Tab, {
                                        value: "audit",
                                        children: "Audit Logs"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_28.TabPanel, {
                                value: "rotation",
                                className: "pt-0",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_4.VStack, {
                                    gap: 4,
                                    className: "pt-4",
                                    children: [
                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_29.SectionCard, {
                                            children: [
                                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_29.SectionCard.Header, {
                                                    title: "Rotation settings",
                                                    actions: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_4.HStack, {
                                                        gap: 2,
                                                        children: [
                                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.Button, {
                                                                variant: "outline",
                                                                size: "sm",
                                                                disabled: !data,
                                                                onClick: ()=>setIsRotationSettingsDrawerOpen(true),
                                                                children: "Edit"
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.Button, {
                                                                variant: "outline",
                                                                size: "sm",
                                                                disabled: !data,
                                                                onClick: handleRotateNow,
                                                                children: "Rotate now"
                                                            })
                                                        ]
                                                    })
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_29.SectionCard.Content, {
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_29.SectionCard.DataRow, {
                                                            label: "Automatic rotation",
                                                            children: autoRotationEnabled ? 'On' : 'Off'
                                                        }),
                                                        autoRotationEnabled && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_29.SectionCard.DataRow, {
                                                            label: "Rotation period",
                                                            children: [
                                                                rotationPeriodDays,
                                                                " days"
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_29.SectionCard.DataRow, {
                                                            label: "Last updated",
                                                            children: formatNullableDate(rotationLastUpdatedAt)
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_29.SectionCard.DataRow, {
                                                            label: "Next rotation",
                                                            children: computedNextRotationAt
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_29.SectionCard, {
                                            children: [
                                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_29.SectionCard.Header, {
                                                    title: "Rotation history",
                                                    actions: selectedVersions.size > 0 ? /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_8.Button, {
                                                        variant: "danger",
                                                        size: "sm",
                                                        onClick: handleBulkDestroy,
                                                        children: [
                                                            "Bulk destroy (",
                                                            selectedVersions.size,
                                                            ")"
                                                        ]
                                                    }) : undefined
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_29.SectionCard.Content, {
                                                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_4.VStack, {
                                                        gap: 3,
                                                        className: "w-full pt-3",
                                                        children: [
                                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_30.Pagination, {
                                                                currentPage: historySafePage,
                                                                totalPages: historyTotalPages,
                                                                onPageChange: setHistoryPage,
                                                                totalItems: rotationHistory.length
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_31.Table, {
                                                                columns: historyColumns,
                                                                data: visibleRotationHistory,
                                                                rowKey: (item)=>`${item.version}-${item.rotatedAt}`,
                                                                resizable: false,
                                                                emptyMessage: "No rotation history"
                                                            })
                                                        ]
                                                    })
                                                })
                                            ]
                                        })
                                    ]
                                })
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_28.TabPanel, {
                                value: "audit",
                                className: "pt-0",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_4.VStack, {
                                    gap: 4,
                                    className: "pt-4",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_shared__rspack_import_2.AuditLogSection, {
                                        resourceId: keyNameSlug,
                                        title: "Audit logs"
                                    })
                                })
                            })
                        ]
                    })
                ]
            }),
            confirmModal && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(KeyVersionStatusConfirmModal, {
                keyName: (data === null || data === void 0 ? void 0 : data.name) ?? keyNameSlug,
                versionLabels: confirmModal.versionLabels,
                actionType: confirmModal.actionType,
                reasonCode: confirmModal.reasonCode,
                onCancel: ()=>setConfirmModal(null),
                onConfirm: confirmModal.onConfirm
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(RotationSettingsDrawer, {
                isOpen: isRotationSettingsDrawerOpen,
                onClose: ()=>setIsRotationSettingsDrawerOpen(false),
                initialAutoRotation: autoRotationEnabled,
                initialPeriodDays: rotationPeriodDays,
                onSave: handleRotationSettingsSave
            })
        ]
    });
}


},

}]);
//# sourceMappingURL=src_pages_kms_CryptoKeyDetailPage_tsx.349b4052b20a5e5a.js.map