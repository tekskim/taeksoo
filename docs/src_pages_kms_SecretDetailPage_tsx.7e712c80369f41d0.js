"use strict";
(self["webpackChunk_thaki_tds"] = self["webpackChunk_thaki_tds"] || []).push([["src_pages_kms_SecretDetailPage_tsx"], {
"./src/pages/kms/SecretDetailPage.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (SecretDetailPage)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var react__rspack_import_1 = __webpack_require__("./node_modules/react/index.js");
/* import */ var react_router_dom__rspack_import_15 = __webpack_require__("./node_modules/react-router/dist/development/chunk-JZWAC4HX.mjs");
/* import */ var _design_system__rspack_import_2 = __webpack_require__("./src/design-system/components/Modal/Modal.tsx");
/* import */ var _design_system__rspack_import_3 = __webpack_require__("./src/design-system/layouts/Stack.tsx");
/* import */ var _design_system__rspack_import_4 = __webpack_require__("./src/design-system/components/FormField/FormField.tsx");
/* import */ var _design_system__rspack_import_5 = __webpack_require__("./src/design-system/components/Input/Textarea.tsx");
/* import */ var _design_system__rspack_import_6 = __webpack_require__("./src/design-system/components/Button/Button.tsx");
/* import */ var _design_system__rspack_import_7 = __webpack_require__("./src/design-system/components/Tag/Tag.tsx");
/* import */ var _design_system__rspack_import_8 = __webpack_require__("./src/design-system/components/Badge/Badge.tsx");
/* import */ var _design_system__rspack_import_9 = __webpack_require__("./src/design-system/components/Drawer/Drawer.tsx");
/* import */ var _design_system__rspack_import_10 = __webpack_require__("./src/design-system/components/Input/Input.tsx");
/* import */ var _design_system__rspack_import_12 = __webpack_require__("./src/design-system/components/InfoBox/InfoBox.tsx");
/* import */ var _design_system__rspack_import_18 = __webpack_require__("./src/design-system/components/ContextMenu/ContextMenu.tsx");
/* import */ var _design_system__rspack_import_20 = __webpack_require__("./src/design-system/components/PageShell/PageShell.tsx");
/* import */ var _design_system__rspack_import_22 = __webpack_require__("./src/design-system/components/TabBar/TabBar.tsx");
/* import */ var _design_system__rspack_import_23 = __webpack_require__("./src/design-system/components/TopBar/TopBar.tsx");
/* import */ var _design_system__rspack_import_24 = __webpack_require__("./src/design-system/components/Breadcrumb/Breadcrumb.tsx");
/* import */ var _design_system__rspack_import_25 = __webpack_require__("./src/design-system/components/DetailHeader/DetailHeader.tsx");
/* import */ var _design_system__rspack_import_26 = __webpack_require__("./src/design-system/components/Tabs/Tabs.tsx");
/* import */ var _design_system__rspack_import_27 = __webpack_require__("./src/design-system/components/SectionCard/SectionCard.tsx");
/* import */ var _design_system__rspack_import_29 = __webpack_require__("./src/design-system/components/Table/Table.tsx");
/* import */ var _components_KmsSidebar__rspack_import_21 = __webpack_require__("./src/components/KmsSidebar.tsx");
/* import */ var _contexts_TabContext__rspack_import_16 = __webpack_require__("./src/contexts/TabContext.tsx");
/* import */ var _shared__rspack_import_17 = __webpack_require__("./src/pages/kms/shared.tsx");
/* import */ var _tabler_icons_react__rspack_import_11 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconX.mjs");
/* import */ var _tabler_icons_react__rspack_import_13 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconEye.mjs");
/* import */ var _tabler_icons_react__rspack_import_14 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconEyeOff.mjs");
/* import */ var _tabler_icons_react__rspack_import_19 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconDotsCircleHorizontal.mjs");
/* import */ var _tabler_icons_react__rspack_import_28 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconPencil.mjs");








/* ─────────────────────────────────────────────────────────────────
   KMS23 detail dummy data
   ───────────────────────────────────────────────────────────────── */ const DUMMY_SECRETS = [
    {
        slug: 'postgres-main',
        name: 'postgres-main',
        path: '/platform/prod/database/postgres-main',
        currentVersion: 20,
        createdAt: '2026-02-12T09:00:00+09:00',
        updatedAt: '2026-04-24T15:30:00+09:00',
        secretData: [
            {
                id: 'db-username',
                key: 'username',
                value: 'platform_admin',
                masked: true
            },
            {
                id: 'db-password',
                key: 'password',
                value: 'Thaki!Prod#2026',
                masked: true
            }
        ],
        tags: [
            {
                key: 'env',
                value: 'prod'
            },
            {
                key: 'owner',
                value: 'platform'
            }
        ]
    },
    {
        slug: 'billing-api-key',
        name: 'billing-api-key',
        path: '/platform/prod/billing/api-key',
        currentVersion: 3,
        createdAt: '2026-03-02T10:20:00+09:00',
        updatedAt: '2026-04-20T18:10:00+09:00',
        secretData: [
            {
                id: 'api-key',
                key: 'apiKey',
                value: 'ak_live_9uU6kKmsMock',
                masked: true
            }
        ],
        tags: [
            {
                key: 'env',
                value: 'prod'
            },
            {
                key: 'service',
                value: 'billing'
            }
        ]
    },
    {
        slug: 'postgresql-password',
        name: 'postgresql.password',
        path: '/ai-platform/prod/database/postgresql-password',
        currentVersion: 3,
        createdAt: '2025-08-15T11:00:00+09:00',
        updatedAt: '2026-04-10T09:20:00+09:00',
        secretData: [
            {
                id: 'pg-password',
                key: 'password',
                value: 'xK9#mPq$wL2!vN7z',
                masked: true
            },
            {
                id: 'pg-username',
                key: 'username',
                value: 'tkai_service',
                masked: true
            },
            {
                id: 'pg-host',
                key: 'host',
                value: 'pg-primary.internal.thaki.cloud',
                masked: true
            }
        ],
        tags: [
            {
                key: 'env',
                value: 'prod'
            },
            {
                key: 'owner',
                value: 'ai-platform'
            },
            {
                key: 'criticality',
                value: 'high'
            }
        ]
    },
    {
        slug: 'redis-password',
        name: 'REDIS_PASSWORD',
        path: '/iam/prod/cache/redis-password',
        currentVersion: 2,
        createdAt: '2025-11-20T14:30:00+09:00',
        updatedAt: '2026-03-28T16:45:00+09:00',
        secretData: [
            {
                id: 'redis-pass',
                key: 'password',
                value: 'rD$8kW!mQ3pL#xV6',
                masked: true
            }
        ],
        tags: [
            {
                key: 'env',
                value: 'prod'
            },
            {
                key: 'owner',
                value: 'iam'
            },
            {
                key: 'component',
                value: 'session-store'
            }
        ]
    },
    {
        slug: 'openai-api-key',
        name: 'OPENAI_API_KEY',
        path: '/ai-platform/prod/external/openai-api-key',
        currentVersion: 5,
        createdAt: '2025-06-10T09:00:00+09:00',
        updatedAt: '2026-04-25T11:00:00+09:00',
        secretData: [
            {
                id: 'openai-key',
                key: 'apiKey',
                value: 'sk-proj-aBcDeFgHiJkLmNoPqRsTuVwXyZ',
                masked: true
            },
            {
                id: 'openai-org',
                key: 'organizationId',
                value: 'org-ThakiCloudProd',
                masked: true
            }
        ],
        tags: [
            {
                key: 'env',
                value: 'prod'
            },
            {
                key: 'owner',
                value: 'ai-platform'
            },
            {
                key: 'vendor',
                value: 'openai'
            },
            {
                key: 'cost-center',
                value: 'ml-ops'
            }
        ]
    },
    {
        slug: 'kc-client-secret',
        name: 'KC_CLIENT_SECRET',
        path: '/iam/prod/oauth/kc-client-secret',
        currentVersion: 1,
        createdAt: '2026-01-08T10:00:00+09:00',
        updatedAt: '2026-01-08T10:00:00+09:00',
        secretData: [
            {
                id: 'kc-secret',
                key: 'clientSecret',
                value: 'c7f2a9e1-4b3d-8k6m-p5w2-r9t1x0z3y8v6',
                masked: true
            },
            {
                id: 'kc-client-id',
                key: 'clientId',
                value: 'thaki-suite-iam',
                masked: true
            }
        ],
        tags: [
            {
                key: 'env',
                value: 'prod'
            },
            {
                key: 'owner',
                value: 'iam'
            },
            {
                key: 'provider',
                value: 'keycloak'
            }
        ]
    },
    {
        slug: 's3-secret-access-key',
        name: 's3_secret_access_key',
        path: '/storage/prod/infra/s3-secret-access-key',
        currentVersion: 2,
        createdAt: '2025-09-01T08:00:00+09:00',
        updatedAt: '2026-02-14T13:30:00+09:00',
        secretData: [
            {
                id: 's3-access-key',
                key: 'accessKeyId',
                value: 'AKIA3THAKISTORAGE01',
                masked: true
            },
            {
                id: 's3-secret-key',
                key: 'secretAccessKey',
                value: 'wJk9Lm2PqR5tUv8XyZ0aBcDeFgHiJkLmNoPqRs',
                masked: true
            },
            {
                id: 's3-endpoint',
                key: 'endpoint',
                value: 'https://rgw.internal.thaki.cloud',
                masked: true
            }
        ],
        tags: [
            {
                key: 'env',
                value: 'prod'
            },
            {
                key: 'owner',
                value: 'storage'
            },
            {
                key: 'backend',
                value: 'ceph-rgw'
            }
        ]
    },
    {
        slug: 'github-token',
        name: 'GITHUB_TOKEN',
        path: '/ai-platform/prod/external/github-token',
        currentVersion: 4,
        createdAt: '2025-07-20T15:00:00+09:00',
        updatedAt: '2026-04-22T08:15:00+09:00',
        secretData: [
            {
                id: 'gh-token',
                key: 'token',
                value: 'ghp_xK9mPqWl2vN7zRt1Y8bC3dEf4GhIjKlMn',
                masked: true
            }
        ],
        tags: [
            {
                key: 'env',
                value: 'prod'
            },
            {
                key: 'owner',
                value: 'ai-platform'
            },
            {
                key: 'scope',
                value: 'repo,packages'
            }
        ]
    }
];
const VERSION_HISTORY_PREVIEW_COUNT = 5;
const VERSION_HISTORY_INCREMENT = 5;
const MOCK_EDITED_AT = '2026-04-28T08:55:00+09:00';
const REASON_MAX_LENGTH = 500;
/* ─────────────────────────────────────────────────────────────────
   Version status / actions (state machine)
   ───────────────────────────────────────────────────────────────── */ const VERSION_STATUS_THEME = {
    active: 'gre',
    deactivated: 'blu',
    deleted: 'ylw',
    destroyed: 'red'
};
const VERSION_STATUS_LABEL = {
    active: 'Active',
    deactivated: 'Deactivated',
    deleted: 'Deleted',
    destroyed: 'Destroyed'
};
const VERSION_CONFIRM_CONFIG = {
    restore: {
        title: 'Restore secret version',
        description: (v)=>`Version v${v} will be restored as a new active version. The current active version will be deactivated.`,
        confirmLabel: 'Restore',
        confirmVariant: 'primary',
        reasonRequired: false
    },
    delete: {
        title: 'Delete secret version',
        description: (v)=>`Version v${v} will be deleted. You can restore or permanently destroy it later.`,
        confirmLabel: 'Delete',
        confirmVariant: 'danger',
        reasonRequired: false
    },
    destroy: {
        title: 'Permanently destroy secret version',
        description: (v)=>`Version v${v} will be permanently destroyed. This action cannot be undone.`,
        confirmLabel: 'Destroy',
        confirmVariant: 'danger',
        reasonRequired: true
    }
};
function VersionActionConfirmModal({ isOpen, actionType, versionNumber, onCancel, onConfirm }) {
    const [reason, setReason] = (0,react__rspack_import_1.useState)('');
    const config = VERSION_CONFIRM_CONFIG[actionType];
    const isConfirmDisabled = config.reasonRequired && reason.trim().length === 0;
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_2.Modal, {
        isOpen: isOpen,
        onClose: onCancel,
        title: config.title,
        description: config.description(versionNumber),
        className: "w-[400px]",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_3.VStack, {
                gap: 4,
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_3.VStack, {
                        gap: 1,
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                                className: "text-label-sm text-[var(--color-text-subtle)]",
                                children: "Version"
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("span", {
                                className: "text-body-md text-[var(--color-text-default)]",
                                children: [
                                    "v",
                                    versionNumber
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_4.FormField, {
                        label: "Reason for change",
                        required: config.reasonRequired,
                        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_5.Textarea, {
                            value: reason,
                            onChange: (e)=>setReason(e.target.value),
                            maxLength: REASON_MAX_LENGTH,
                            placeholder: "Enter reason for change",
                            fullWidth: true,
                            rows: 3
                        })
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("div", {
                className: "flex gap-2 w-full",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.Button, {
                        variant: "outline",
                        size: "md",
                        onClick: onCancel,
                        className: "flex-1",
                        children: "Cancel"
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.Button, {
                        variant: config.confirmVariant,
                        size: "md",
                        disabled: isConfirmDisabled,
                        onClick: ()=>onConfirm(reason.trim()),
                        className: "flex-1",
                        children: config.confirmLabel
                    })
                ]
            })
        ]
    });
}
const VERSION_ACTIONS_BY_STATUS = {
    active: [],
    deactivated: [
        {
            key: 'restore',
            label: 'Restore'
        },
        {
            key: 'delete',
            label: 'Delete',
            danger: true,
            requiresConfirm: true
        }
    ],
    deleted: [
        {
            key: 'restore',
            label: 'Restore'
        },
        {
            key: 'destroy',
            label: 'Destroy',
            danger: true,
            requiresConfirm: true
        }
    ],
    destroyed: []
};
// 버전 히스토리 더미 데이터
const buildInitialVersionHistory = (currentVersion)=>Array.from({
        length: currentVersion
    }, (_, index)=>{
        const version = currentVersion - index;
        const previousCount = Math.max(1, Math.floor((currentVersion - 1) * 0.4));
        const deletedCount = Math.max(1, Math.floor((currentVersion - 1) * 0.35));
        let status;
        if (version === currentVersion) {
            status = 'active';
        } else if (index <= previousCount) {
            status = 'deactivated';
        } else if (index <= previousCount + deletedCount) {
            status = 'deleted';
        } else {
            status = 'destroyed';
        }
        return {
            version,
            editedAt: `2026-04-${String(Math.max(1, 24 - index)).padStart(2, '0')}T15:30:00+09:00`,
            status
        };
    });
/* ─────────────────────────────────────────────────────────────────
   Render helpers
   ───────────────────────────────────────────────────────────────── */ const maskSecretValue = (value)=>value.length > 0 ? '*'.repeat(Math.min(Math.max(value.length, 8), 16)) : '-';
function renderTags(tags) {
    if (tags.length === 0) {
        return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
            className: "text-body-md text-[var(--color-text-default)]",
            children: "-"
        });
    }
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_3.HStack, {
        gap: 1,
        className: "flex-wrap",
        children: tags.map((tag)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_7.Tag, {
                size: "sm",
                outline: true,
                children: [
                    tag.key,
                    ": ",
                    tag.value
                ]
            }, `${tag.key}-${tag.value}`))
    });
}
function renderSecretRows(rows, revealed) {
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_3.VStack, {
        gap: 1,
        children: rows.map((row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_3.HStack, {
                gap: 2,
                align: "center",
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.Badge, {
                        theme: "blu",
                        type: "subtle",
                        size: "sm",
                        children: row.key || '-'
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                        className: "min-w-0 truncate font-mono text-body-sm text-[var(--color-text-default)]",
                        children: revealed ? row.value || '-' : maskSecretValue(row.value)
                    })
                ]
            }, row.id))
    });
}
/* ─────────────────────────────────────────────────────────────────
   SecretEditTagsDrawer
   ───────────────────────────────────────────────────────────────── */ function SecretEditTagsDrawer({ isOpen, onClose, initialTags, onConfirm }) {
    const [tags, setTags] = (0,react__rspack_import_1.useState)(initialTags);
    const handleAddTag = ()=>{
        setTags((prev)=>[
                ...prev,
                {
                    key: '',
                    value: ''
                }
            ]);
    };
    const handleRemoveTag = (index)=>{
        setTags((prev)=>prev.filter((_, i)=>i !== index));
    };
    const handleTagChange = (index, field, value)=>{
        setTags((prev)=>prev.map((tag, i)=>i === index ? {
                    ...tag,
                    [field]: value
                } : tag));
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_9.Drawer, {
        isOpen: isOpen,
        onClose: onClose,
        title: "Edit tags",
        width: 560,
        footer: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_3.HStack, {
            gap: 2,
            className: "w-full justify-end",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.Button, {
                    variant: "muted",
                    onClick: onClose,
                    children: "Cancel"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.Button, {
                    variant: "primary",
                    onClick: ()=>onConfirm(tags),
                    children: "Save"
                })
            ]
        }),
        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_3.VStack, {
            gap: 2,
            children: [
                tags.length > 0 && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_3.HStack, {
                    gap: 2,
                    className: "w-full",
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                            className: "flex-1 text-label-sm text-[var(--color-text-subtle)]",
                            children: "Key"
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                            className: "flex-1 text-label-sm text-[var(--color-text-subtle)]",
                            children: "Value"
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                            className: "w-5 shrink-0"
                        })
                    ]
                }),
                tags.map((tag, index)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_3.HStack, {
                        gap: 2,
                        align: "center",
                        className: "w-full",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_10.Input, {
                                value: tag.key,
                                size: "sm",
                                fullWidth: true,
                                placeholder: "Key",
                                onChange: (e)=>handleTagChange(index, 'key', e.target.value)
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_10.Input, {
                                value: tag.value,
                                size: "sm",
                                fullWidth: true,
                                placeholder: "Value",
                                onChange: (e)=>handleTagChange(index, 'value', e.target.value)
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("button", {
                                type: "button",
                                "aria-label": "Remove tag",
                                onClick: ()=>handleRemoveTag(index),
                                className: "size-5 flex shrink-0 items-center justify-center hover:bg-[var(--color-surface-muted)] rounded transition-colors",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_11["default"], {
                                    size: 16,
                                    className: "text-[var(--color-text-muted)]",
                                    stroke: 1.5
                                })
                            })
                        ]
                    }, index)),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.Button, {
                        variant: "outline",
                        size: "sm",
                        onClick: handleAddTag,
                        children: "Add tag"
                    })
                })
            ]
        })
    });
}
/* ─────────────────────────────────────────────────────────────────
   SecretRotateDrawer (Rotate Now)
   ───────────────────────────────────────────────────────────────── */ function SecretRotateDrawer({ isOpen, onClose, secretName, secretData, onConfirm }) {
    const [rows, setRows] = (0,react__rspack_import_1.useState)(secretData.map((row)=>({
            ...row,
            value: '',
            masked: true
        })));
    const handleToggleMask = (rowId)=>{
        setRows((prev)=>prev.map((row)=>row.id === rowId ? {
                    ...row,
                    masked: !row.masked
                } : row));
    };
    const handleChangeValue = (rowId, value)=>{
        setRows((prev)=>prev.map((row)=>row.id === rowId ? {
                    ...row,
                    value
                } : row));
    };
    const allFilled = rows.every((row)=>row.value.trim().length > 0);
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_9.Drawer, {
        isOpen: isOpen,
        onClose: onClose,
        title: "Rotate secret",
        width: 560,
        footer: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_3.HStack, {
            gap: 2,
            className: "w-full justify-end",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.Button, {
                    variant: "muted",
                    onClick: onClose,
                    children: "Cancel"
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.Button, {
                    variant: "primary",
                    disabled: !allFilled,
                    onClick: ()=>onConfirm(rows),
                    children: "Rotate"
                })
            ]
        }),
        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_3.VStack, {
            gap: 6,
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_12.InfoBox, {
                    label: "Secret name",
                    value: secretName
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_4.FormField, {
                    label: "New secret data",
                    helperText: "Enter new values for all keys. A new version will be created and the current version will be deactivated.",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_3.VStack, {
                        gap: 2,
                        children: rows.map((row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_3.HStack, {
                                gap: 2,
                                align: "center",
                                className: "w-full",
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_10.Input, {
                                        "aria-label": `${row.key || 'secret'} key`,
                                        value: row.key,
                                        placeholder: "key",
                                        fullWidth: true,
                                        disabled: true
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_10.Input, {
                                        "aria-label": `${row.key || 'secret'} new value`,
                                        type: row.masked ? 'password' : 'text',
                                        value: row.value,
                                        placeholder: "New value",
                                        fullWidth: true,
                                        onChange: (e)=>handleChangeValue(row.id, e.target.value)
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.Button, {
                                        variant: "outline",
                                        size: "md",
                                        icon: row.masked ? /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_13["default"], {
                                            size: 16,
                                            stroke: 1.5
                                        }) : /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_14["default"], {
                                            size: 16,
                                            stroke: 1.5
                                        }),
                                        "aria-label": `${row.key || 'secret'} ${row.masked ? 'show value' : 'hide value'}`,
                                        onClick: ()=>handleToggleMask(row.id)
                                    })
                                ]
                            }, row.id))
                    })
                })
            ]
        })
    });
}
/* ─────────────────────────────────────────────────────────────────
   Main Page
   ───────────────────────────────────────────────────────────────── */ function SecretDetailPage() {
    const { secretNameSlug } = (0,react_router_dom__rspack_import_15.useParams)();
    const [sidebarOpen, setSidebarOpen] = (0,react__rspack_import_1.useState)(true);
    const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = (0,_contexts_TabContext__rspack_import_16.useTabs)();
    const selectedSecret = DUMMY_SECRETS.find((s)=>s.slug === secretNameSlug) ?? DUMMY_SECRETS[0];
    const [secret, setSecret] = (0,react__rspack_import_1.useState)(selectedSecret);
    const [isEditTagsDrawerOpen, setIsEditTagsDrawerOpen] = (0,react__rspack_import_1.useState)(false);
    const [isRotateDrawerOpen, setIsRotateDrawerOpen] = (0,react__rspack_import_1.useState)(false);
    const [versionHistory, setVersionHistory] = (0,react__rspack_import_1.useState)(()=>buildInitialVersionHistory(selectedSecret.currentVersion));
    const [visibleVersionHistoryCount, setVisibleVersionHistoryCount] = (0,react__rspack_import_1.useState)(VERSION_HISTORY_PREVIEW_COUNT);
    const [versionConfirmModal, setVersionConfirmModal] = (0,react__rspack_import_1.useState)(null);
    const [isSecretRevealed, setIsSecretRevealed] = (0,react__rspack_import_1.useState)(false);
    const [activeTab, setActiveTab] = (0,react__rspack_import_1.useState)('details');
    const sidebarWidth = sidebarOpen ? 200 : 0;
    const handleSaveTags = (tags)=>{
        setSecret((previous)=>({
                ...previous,
                tags,
                updatedAt: MOCK_EDITED_AT
            }));
        setIsEditTagsDrawerOpen(false);
    };
    const handleRotate = (newSecretData)=>{
        const nextVersion = secret.currentVersion + 1;
        setSecret((previous)=>({
                ...previous,
                secretData: newSecretData,
                updatedAt: MOCK_EDITED_AT,
                currentVersion: nextVersion
            }));
        setVersionHistory((previous)=>[
                {
                    version: nextVersion,
                    editedAt: MOCK_EDITED_AT,
                    status: 'active'
                },
                ...previous.map((item)=>item.status === 'active' ? {
                        ...item,
                        status: 'deactivated'
                    } : item)
            ]);
        setIsRotateDrawerOpen(false);
    };
    const activeVersion = versionHistory.find((v)=>v.status === 'active');
    const currentStatusLabel = activeVersion ? 'Active' : 'Destroyed';
    const currentStatusTheme = activeVersion ? 'gre' : 'red';
    // 버전 히스토리: deleted / destroyed 버전은 목록에서 제외
    const secretVersionHistory = versionHistory.filter((item)=>item.version <= secret.currentVersion && item.status !== 'deleted' && item.status !== 'destroyed');
    const visibleVersionHistory = secretVersionHistory.slice(0, visibleVersionHistoryCount);
    const canExpandVersionHistory = visibleVersionHistoryCount < secretVersionHistory.length;
    const canCollapseVersionHistory = visibleVersionHistoryCount > VERSION_HISTORY_PREVIEW_COUNT;
    const shouldShowVersionHistoryActions = secretVersionHistory.length > VERSION_HISTORY_PREVIEW_COUNT;
    const handleVersionAction = (item, actionKey)=>{
        switch(actionKey){
            case 'restore':
                {
                    setVersionConfirmModal({
                        actionType: 'restore',
                        versionNumber: item.version,
                        onConfirm: (_reason)=>{
                            const nextVersion = secret.currentVersion + 1;
                            setSecret((previous)=>({
                                    ...previous,
                                    updatedAt: MOCK_EDITED_AT,
                                    currentVersion: nextVersion
                                }));
                            setVersionHistory((previous)=>[
                                    {
                                        version: nextVersion,
                                        editedAt: MOCK_EDITED_AT,
                                        status: 'active'
                                    },
                                    ...previous.map((v)=>v.status === 'active' ? {
                                            ...v,
                                            status: 'deactivated'
                                        } : v)
                                ]);
                            setVersionConfirmModal(null);
                        }
                    });
                    break;
                }
            case 'delete':
                {
                    setVersionConfirmModal({
                        actionType: 'delete',
                        versionNumber: item.version,
                        onConfirm: (_reason)=>{
                            setVersionHistory((previous)=>previous.map((v)=>v.version === item.version ? {
                                        ...v,
                                        status: 'deleted'
                                    } : v));
                            setVersionConfirmModal(null);
                        }
                    });
                    break;
                }
            case 'destroy':
                {
                    setVersionConfirmModal({
                        actionType: 'destroy',
                        versionNumber: item.version,
                        onConfirm: (_reason)=>{
                            setVersionHistory((previous)=>previous.map((v)=>v.version === item.version ? {
                                        ...v,
                                        status: 'destroyed'
                                    } : v));
                            setVersionConfirmModal(null);
                        }
                    });
                    break;
                }
            default:
                break;
        }
    };
    const handleExpandVersionHistory = ()=>{
        setVisibleVersionHistoryCount((previous)=>Math.min(previous + VERSION_HISTORY_INCREMENT, secretVersionHistory.length));
    };
    const handleCollapseVersionHistory = ()=>{
        setVisibleVersionHistoryCount(VERSION_HISTORY_PREVIEW_COUNT);
    };
    // ── Version history table columns ──────────────────────────────
    const versionColumns = [
        {
            key: 'status',
            label: 'Status',
            width: '120px',
            align: 'center',
            resizable: false,
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.Badge, {
                    theme: VERSION_STATUS_THEME[row.status],
                    type: "subtle",
                    size: "sm",
                    children: VERSION_STATUS_LABEL[row.status]
                })
        },
        {
            key: 'version',
            label: 'Version',
            width: '100px',
            resizable: false,
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("span", {
                    className: "font-mono text-body-sm",
                    children: [
                        "v",
                        row.version
                    ]
                })
        },
        {
            key: 'editedAt',
            label: 'Edited at',
            flex: 1,
            minWidth: '200px',
            render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                    className: "text-body-sm text-[var(--color-text-subtle)]",
                    children: (0,_shared__rspack_import_17.formatDate)(row.editedAt)
                })
        },
        {
            key: '_actions',
            label: 'Action',
            width: '64px',
            align: 'center',
            resizable: false,
            render: (_, row)=>{
                const actions = VERSION_ACTIONS_BY_STATUS[row.status];
                if (actions.length === 0) {
                    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                        className: "text-body-sm text-[var(--color-text-subtle)]",
                        children: "-"
                    });
                }
                const items = actions.map((action)=>({
                        id: action.key,
                        label: action.label,
                        status: action.danger ? 'danger' : 'default',
                        onClick: ()=>handleVersionAction(row, action.key)
                    }));
                return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                    onClick: (e)=>e.stopPropagation(),
                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_18.ContextMenu, {
                        items: items,
                        trigger: "click",
                        align: "right",
                        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("button", {
                            "aria-label": `v${row.version} version actions`,
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
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_20.PageShell, {
        sidebar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_components_KmsSidebar__rspack_import_21.KmsSidebar, {
            isOpen: sidebarOpen,
            onToggle: ()=>setSidebarOpen(!sidebarOpen)
        }),
        sidebarWidth: sidebarWidth,
        tabBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_22.TabBar, {
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
        topBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_23.TopBar, {
            showSidebarToggle: !sidebarOpen,
            onSidebarToggle: ()=>setSidebarOpen(!sidebarOpen),
            showNavigation: true,
            onBack: ()=>window.history.back(),
            onForward: ()=>window.history.forward(),
            breadcrumb: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_24.Breadcrumb, {
                items: [
                    {
                        label: 'KMS',
                        href: '/kms/overview'
                    },
                    {
                        label: 'Secrets',
                        href: '/kms/secrets'
                    },
                    {
                        label: secret.name
                    }
                ]
            })
        }),
        contentClassName: "pt-4 px-8 pb-20",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_3.VStack, {
                gap: 4,
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_25.DetailHeader, {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_25.DetailHeader.Title, {
                                children: secret.name
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_25.DetailHeader.Actions, {
                                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.Button, {
                                    variant: "secondary",
                                    size: "sm",
                                    onClick: ()=>setIsRotateDrawerOpen(true),
                                    children: "Rotate now"
                                })
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_25.DetailHeader.InfoGrid, {
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_25.DetailHeader.InfoCard, {
                                        label: "Status",
                                        value: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.Badge, {
                                            theme: currentStatusTheme,
                                            type: "subtle",
                                            size: "sm",
                                            children: currentStatusLabel
                                        })
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_25.DetailHeader.InfoCard, {
                                        label: "Secret path",
                                        value: secret.path
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_25.DetailHeader.InfoCard, {
                                        label: "Current version",
                                        value: activeVersion ? `v${secret.currentVersion}` : `v${secret.currentVersion} (destroyed)`
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_25.DetailHeader.InfoCard, {
                                        label: "Created at",
                                        value: (0,_shared__rspack_import_17.formatDate)(secret.createdAt)
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_25.DetailHeader.InfoCard, {
                                        label: "Last updated",
                                        value: (0,_shared__rspack_import_17.formatDate)(secret.updatedAt)
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_26.Tabs, {
                        value: activeTab,
                        onChange: setActiveTab,
                        variant: "underline",
                        size: "sm",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_26.TabList, {
                                children: [
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_26.Tab, {
                                        value: "details",
                                        children: "Details"
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_26.Tab, {
                                        value: "history",
                                        children: "History"
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_26.Tab, {
                                        value: "audit",
                                        children: "Audit Logs"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_26.TabPanel, {
                                value: "details",
                                className: "pt-0",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_3.VStack, {
                                    gap: 4,
                                    className: "pt-4",
                                    children: [
                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_27.SectionCard, {
                                            children: [
                                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_27.SectionCard.Header, {
                                                    title: "Secret value",
                                                    actions: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.Button, {
                                                        variant: "outline",
                                                        size: "sm",
                                                        leftIcon: isSecretRevealed ? /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_14["default"], {
                                                            size: 14,
                                                            stroke: 1.5
                                                        }) : /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_13["default"], {
                                                            size: 14,
                                                            stroke: 1.5
                                                        }),
                                                        "aria-label": isSecretRevealed ? 'Hide secret value' : 'Show secret value',
                                                        onClick: ()=>setIsSecretRevealed((prev)=>!prev),
                                                        children: isSecretRevealed ? 'Hide secret value' : 'Show secret value'
                                                    })
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_27.SectionCard.Content, {
                                                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_27.SectionCard.DataRow, {
                                                        label: "Secret value",
                                                        children: renderSecretRows(secret.secretData, isSecretRevealed)
                                                    })
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_27.SectionCard, {
                                            children: [
                                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_27.SectionCard.Header, {
                                                    title: "Tags",
                                                    actions: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.Button, {
                                                        variant: "outline",
                                                        size: "sm",
                                                        leftIcon: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_28["default"], {
                                                            size: 14,
                                                            stroke: 1.5
                                                        }),
                                                        onClick: ()=>setIsEditTagsDrawerOpen(true),
                                                        children: "Edit"
                                                    })
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_27.SectionCard.Content, {
                                                    children: renderTags(secret.tags)
                                                })
                                            ]
                                        })
                                    ]
                                })
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_26.TabPanel, {
                                value: "history",
                                className: "pt-0",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_3.VStack, {
                                    gap: 4,
                                    className: "pt-4",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_27.SectionCard, {
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_27.SectionCard.Header, {
                                                title: "History",
                                                description: "Track version history for secret value changes."
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_27.SectionCard.Content, {
                                                children: [
                                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_29.Table, {
                                                        columns: versionColumns,
                                                        data: visibleVersionHistory,
                                                        rowKey: "version",
                                                        resizable: false,
                                                        emptyMessage: "No version history."
                                                    }),
                                                    shouldShowVersionHistoryActions && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_3.HStack, {
                                                        gap: 1,
                                                        className: "w-full justify-center",
                                                        children: [
                                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.Button, {
                                                                variant: "ghost",
                                                                size: "sm",
                                                                disabled: !canExpandVersionHistory,
                                                                onClick: handleExpandVersionHistory,
                                                                children: "Load more"
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.Button, {
                                                                variant: "ghost",
                                                                size: "sm",
                                                                disabled: !canCollapseVersionHistory,
                                                                onClick: handleCollapseVersionHistory,
                                                                children: "Collapse"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                })
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_26.TabPanel, {
                                value: "audit",
                                className: "pt-0",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_3.VStack, {
                                    gap: 4,
                                    className: "pt-4",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_shared__rspack_import_17.AuditLogSection, {
                                        resourceId: secret.slug,
                                        title: "Audit logs"
                                    })
                                })
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(SecretEditTagsDrawer, {
                isOpen: isEditTagsDrawerOpen,
                onClose: ()=>setIsEditTagsDrawerOpen(false),
                initialTags: secret.tags,
                onConfirm: handleSaveTags
            }, `tags-${secret.updatedAt}-${secret.tags.length}`),
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(SecretRotateDrawer, {
                isOpen: isRotateDrawerOpen,
                onClose: ()=>setIsRotateDrawerOpen(false),
                secretName: secret.name,
                secretData: secret.secretData,
                currentVersion: secret.currentVersion,
                onConfirm: handleRotate
            }, `rotate-${secret.currentVersion}`),
            versionConfirmModal != null && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(VersionActionConfirmModal, {
                isOpen: true,
                actionType: versionConfirmModal.actionType,
                versionNumber: versionConfirmModal.versionNumber,
                onCancel: ()=>setVersionConfirmModal(null),
                onConfirm: versionConfirmModal.onConfirm
            })
        ]
    });
}


},

}]);
//# sourceMappingURL=src_pages_kms_SecretDetailPage_tsx.7e712c80369f41d0.js.map