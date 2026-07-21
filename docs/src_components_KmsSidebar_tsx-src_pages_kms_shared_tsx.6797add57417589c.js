"use strict";
(self["webpackChunk_thaki_tds"] = self["webpackChunk_thaki_tds"] || []).push([["src_components_KmsSidebar_tsx-src_pages_kms_shared_tsx"], {
"./src/components/KmsSidebar.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  KmsSidebar: () => (KmsSidebar),
  "default": () => (__rspack_default_export)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var _design_system__rspack_import_7 = __webpack_require__("./src/design-system/layouts/Stack.tsx");
/* import */ var _design_system__rspack_import_8 = __webpack_require__("./src/design-system/components/Menu/MenuItem.tsx");
/* import */ var _tabler_icons_react__rspack_import_1 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconHome.mjs");
/* import */ var _tabler_icons_react__rspack_import_2 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconKey.mjs");
/* import */ var _tabler_icons_react__rspack_import_3 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconLock.mjs");
/* import */ var _tabler_icons_react__rspack_import_4 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconCertificate.mjs");
/* import */ var react_router_dom__rspack_import_5 = __webpack_require__("./node_modules/react-router/dist/development/chunk-JZWAC4HX.mjs");
/* import */ var _AppSwitcher__rspack_import_6 = __webpack_require__("./src/components/AppSwitcher.tsx");





const NAV_ITEMS = [
    {
        id: 'overview',
        label: 'Overview',
        icon: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_1["default"], {
            size: 16,
            stroke: 1.5
        }),
        href: '/kms/overview'
    },
    {
        id: 'keys',
        label: 'Encryption Keys',
        icon: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_2["default"], {
            size: 16,
            stroke: 1.5
        }),
        href: '/kms/keys'
    },
    {
        id: 'secrets',
        label: 'Secrets',
        icon: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_3["default"], {
            size: 16,
            stroke: 1.5
        }),
        href: '/kms/secrets'
    },
    {
        id: 'certificates',
        label: 'Certificates',
        icon: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_4["default"], {
            size: 16,
            stroke: 1.5
        }),
        href: '/kms/certificates'
    }
];
function KmsSidebar({ isOpen = true, onToggle }) {
    const location = (0,react_router_dom__rspack_import_5.useLocation)();
    const navigate = (0,react_router_dom__rspack_import_5.useNavigate)();
    const isActive = (href)=>location.pathname === href || location.pathname.startsWith(href + '/');
    if (!isOpen) return null;
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("aside", {
        className: "w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] flex flex-col fixed left-0 top-0",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_AppSwitcher__rspack_import_6.AppSwitcher, {
                currentAppId: "kms",
                onToggleSidebar: onToggle
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("nav", {
                className: "flex-1 overflow-y-auto px-3 pt-3 pb-6",
                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_7.VStack, {
                    gap: 1,
                    className: "w-full min-w-0",
                    children: NAV_ITEMS.map(({ id, label, icon, href })=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.MenuItem, {
                            icon: icon,
                            label: label,
                            isActive: isActive(href),
                            onClick: ()=>navigate(href)
                        }, id))
                })
            })
        ]
    });
}
/* export default */ const __rspack_default_export = (KmsSidebar);


},
"./src/pages/kms/mocks/auditLogs.ts"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  MOCK_AUDIT_LOGS: () => (MOCK_AUDIT_LOGS),
  getAuditLogsByResourceId: () => (getAuditLogsByResourceId),
  getRecentAuditLogs: () => (getRecentAuditLogs)
});
const MOCK_AUDIT_LOGS = [
    {
        id: 'audit-001',
        timestamp: '2026-05-22T08:15:00Z',
        actor: {
            type: 'USER',
            id: 'admin@thaki.cloud',
            name: 'admin',
            ip: '10.0.1.42'
        },
        action: 'REVOKE_CERTIFICATE',
        target: {
            type: 'Certificate',
            id: 'cert-payment',
            name: 'payment-api.kms.svc'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    status: 'active'
                },
                after: {
                    status: 'revoked'
                }
            }
        },
        rationale: 'suspected_compromise: Suspected payment API certificate leak — handling security ticket #4421'
    },
    {
        id: 'audit-002',
        timestamp: '2026-05-21T14:30:00Z',
        actor: {
            type: 'SYSTEM_BATCH',
            id: 'system',
            ip: '10.0.0.1'
        },
        action: 'UPDATE_CERTIFICATE_STATUS',
        target: {
            type: 'Certificate',
            id: 'cert-scheduler',
            name: 'scheduler.kms.svc'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    status: 'active'
                },
                after: {
                    status: 'expiring'
                }
            }
        }
    },
    {
        id: 'audit-003',
        timestamp: '2026-05-20T09:00:00Z',
        actor: {
            type: 'USER',
            id: 'operator@thaki.cloud',
            name: 'operator',
            ip: '10.0.2.15'
        },
        action: 'ROTATE_SECRET',
        target: {
            type: 'Secret',
            id: 'github-token',
            name: 'GITHUB_TOKEN'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    version: 3
                },
                after: {
                    version: 4
                }
            }
        },
        rationale: 'rotation: Scheduled rotation per quarterly policy'
    },
    {
        id: 'audit-004',
        timestamp: '2026-05-19T17:45:00Z',
        actor: {
            type: 'USER',
            id: 'admin@thaki.cloud',
            name: 'admin',
            ip: '10.0.1.42'
        },
        action: 'DEACTIVATE_SECRET',
        target: {
            type: 'Secret',
            id: 'kc-client-secret',
            name: 'KC_CLIENT_SECRET'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    status: 'active'
                },
                after: {
                    status: 'deactivated'
                }
            }
        },
        rationale: 'suspected_compromise: Suspected Keycloak client secret leak — monitoring alert #2201'
    },
    {
        id: 'audit-005',
        timestamp: '2026-05-18T11:20:00Z',
        actor: {
            type: 'SYSTEM_BATCH',
            id: 'system',
            ip: '10.0.0.1'
        },
        action: 'EXPIRE_SECRET',
        target: {
            type: 'Secret',
            id: 'postgresql-superuser-auth',
            name: 'postgresql-superuser-auth'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    status: 'active'
                },
                after: {
                    status: 'expired'
                }
            }
        }
    },
    {
        id: 'audit-006',
        timestamp: '2026-05-17T08:00:00Z',
        actor: {
            type: 'USER',
            id: 'operator@thaki.cloud',
            name: 'operator',
            ip: '10.0.2.15'
        },
        action: 'DEACTIVATE_KEY',
        target: {
            type: 'EncryptionKey',
            id: 'compute-signing-key',
            name: 'compute-signing-key'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    status: 'active'
                },
                after: {
                    status: 'deactivated'
                }
            }
        },
        rationale: 'confirmed_compromise: Compromise confirmed — preemptive deactivation before re-protection pipeline'
    },
    {
        id: 'audit-007',
        timestamp: '2026-05-16T16:30:00Z',
        actor: {
            type: 'USER',
            id: 'admin@thaki.cloud',
            name: 'admin',
            ip: '10.0.1.42'
        },
        action: 'ARCHIVE_KEY',
        target: {
            type: 'EncryptionKey',
            id: 'container-wrap-key',
            name: 'container-wrap-key'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    status: 'deactivated'
                },
                after: {
                    status: 'archived'
                }
            }
        },
        rationale: 'routine_archive: Deactivated for over 90 days — routine operational cleanup'
    },
    {
        id: 'audit-008',
        timestamp: '2026-05-15T10:10:00Z',
        actor: {
            type: 'USER',
            id: 'operator@thaki.cloud',
            name: 'operator',
            ip: '10.0.3.77'
        },
        action: 'EXPIRE_SECRET',
        target: {
            type: 'Secret',
            id: 'payment-api-key',
            name: 'payment-api-key'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    status: 'active'
                },
                after: {
                    status: 'expired'
                }
            }
        }
    },
    {
        id: 'audit-009',
        timestamp: '2026-05-14T13:55:00Z',
        actor: {
            type: 'USER',
            id: 'admin@thaki.cloud',
            name: 'admin',
            ip: '10.0.0.1'
        },
        action: 'UPDATE_CERTIFICATE_STATUS',
        target: {
            type: 'Certificate',
            id: 'cert-etcd',
            name: 'etcd-peer.kms.svc'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    status: 'active'
                },
                after: {
                    status: 'expiring'
                }
            }
        }
    },
    {
        id: 'audit-010',
        timestamp: '2026-05-13T07:40:00Z',
        actor: {
            type: 'AUTO_RESOLVER',
            id: 'system',
            ip: '10.0.0.1'
        },
        action: 'ROTATE_KEY',
        target: {
            type: 'EncryptionKey',
            id: 'iam-master-key',
            name: 'iam-master-key'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    version: 3
                },
                after: {
                    version: 4
                }
            },
            reason: 'rotation'
        }
    },
    {
        id: 'audit-011',
        timestamp: '2026-05-12T15:20:00Z',
        actor: {
            type: 'USER',
            id: 'admin@thaki.cloud',
            name: 'admin',
            ip: '10.0.1.42'
        },
        action: 'DELETE_SECRET',
        target: {
            type: 'Secret',
            id: 'cache-redis',
            name: 'cache-redis'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    status: 'deactivated'
                },
                after: {
                    status: 'deleted'
                }
            }
        },
        rationale: 'manual_delete: Redis cache service decommissioned — no longer in use'
    },
    {
        id: 'audit-012',
        timestamp: '2026-05-11T09:05:00Z',
        actor: {
            type: 'USER',
            id: 'operator@thaki.cloud',
            name: 'operator',
            ip: '10.0.2.15'
        },
        action: 'DEACTIVATE_SECRET',
        target: {
            type: 'Secret',
            id: 'rabbitmq-publisher-user',
            name: 'rabbitmq-publisher-user'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    status: 'active'
                },
                after: {
                    status: 'deactivated'
                }
            }
        },
        rationale: 'manual_delete: RabbitMQ Publisher service decommissioned'
    },
    {
        id: 'audit-013',
        timestamp: '2026-05-10T18:00:00Z',
        actor: {
            type: 'AUTO_RESOLVER',
            id: 'system',
            ip: '10.0.0.1'
        },
        action: 'ARCHIVE_KEY',
        target: {
            type: 'EncryptionKey',
            id: 'container-edge-key',
            name: 'container-edge-key'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    status: 'deactivated'
                },
                after: {
                    status: 'archived'
                }
            },
            reason: 'routine_archive'
        }
    },
    {
        id: 'audit-014',
        timestamp: '2026-05-09T12:30:00Z',
        actor: {
            type: 'USER',
            id: 'admin@thaki.cloud',
            name: 'admin',
            ip: '10.0.1.42'
        },
        action: 'ISSUE_CERTIFICATE',
        target: {
            type: 'Certificate',
            id: 'cert-auth-svc',
            name: 'auth-service.kms.svc'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: null,
                after: {
                    status: 'active'
                }
            }
        },
        rationale: 'Initial issuance for new authentication service deployment'
    },
    {
        id: 'audit-015',
        timestamp: '2026-05-08T08:15:00Z',
        actor: {
            type: 'USER',
            id: 'operator@thaki.cloud',
            name: 'operator',
            ip: '10.0.3.77'
        },
        action: 'ROTATE_SECRET',
        target: {
            type: 'Secret',
            id: 'openai-api-key',
            name: 'OPENAI_API_KEY'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    version: 4
                },
                after: {
                    version: 5
                }
            }
        },
        rationale: 'rotation: Scheduled rotation of OpenAI API key'
    },
    {
        id: 'audit-016',
        timestamp: '2026-05-07T14:45:00Z',
        actor: {
            type: 'USER',
            id: 'admin@thaki.cloud',
            name: 'admin',
            ip: '10.0.1.42'
        },
        action: 'CREATE_KEY',
        target: {
            type: 'EncryptionKey',
            id: 'hmac-key-b64',
            name: 'hmac-key-b64'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: null,
                after: {
                    status: 'active',
                    version: 1
                }
            }
        },
        rationale: 'New key created for HMAC signing'
    },
    {
        id: 'audit-017',
        timestamp: '2026-05-06T11:00:00Z',
        actor: {
            type: 'SYSTEM_BATCH',
            id: 'system',
            ip: '10.0.0.1'
        },
        action: 'EXPIRE_CERTIFICATE',
        target: {
            type: 'Certificate',
            id: 'cert-frontend',
            name: 'frontend-gateway.kms.svc'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    status: 'active'
                },
                after: {
                    status: 'expired'
                }
            }
        }
    },
    {
        id: 'audit-018',
        timestamp: '2026-05-05T16:20:00Z',
        actor: {
            type: 'USER',
            id: 'operator@thaki.cloud',
            name: 'operator',
            ip: '10.0.2.15'
        },
        action: 'ROTATE_SECRET',
        target: {
            type: 'Secret',
            id: 'valkey-auth',
            name: 'valkey-auth'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    version: 4
                },
                after: {
                    version: 5
                }
            }
        },
        rationale: 'rotation: Monthly scheduled rotation'
    },
    {
        id: 'audit-019',
        timestamp: '2026-05-04T10:30:00Z',
        actor: {
            type: 'USER',
            id: 'admin@thaki.cloud',
            name: 'admin',
            ip: '10.0.1.42'
        },
        action: 'CREATE_KEY',
        target: {
            type: 'EncryptionKey',
            id: 'aead-key-b64',
            name: 'aead-key-b64'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: null,
                after: {
                    status: 'active',
                    version: 1
                }
            }
        },
        rationale: 'New AEAD encryption key created'
    },
    {
        id: 'audit-020',
        timestamp: '2026-05-03T08:00:00Z',
        actor: {
            type: 'SYSTEM_BATCH',
            id: 'system',
            ip: '10.0.0.1'
        },
        action: 'ISSUE_CERTIFICATE',
        target: {
            type: 'Certificate',
            id: 'cert-controller',
            name: 'controller-manager.kms.svc'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: null,
                after: {
                    status: 'active'
                }
            },
            reason: 'rotation'
        }
    },
    // ── kube_config_key (KMS020201 Encryption Key Detail) audit trail ──────────
    {
        id: 'audit-021',
        timestamp: '2026-05-18T09:12:00Z',
        actor: {
            type: 'USER',
            id: 'operator@thaki.cloud',
            name: 'operator',
            ip: '10.0.2.15'
        },
        action: 'VIEW_KEY',
        target: {
            type: 'EncryptionKey',
            id: 'kube-config-key',
            name: 'kube_config_key'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: null,
                after: null
            }
        },
        rationale: 'audit_review: Quarterly access review for container service keys'
    },
    {
        id: 'audit-022',
        timestamp: '2026-05-12T14:30:00Z',
        actor: {
            type: 'USER',
            id: 'container-admin@thaki.cloud',
            name: 'container-admin',
            ip: '10.0.3.21'
        },
        action: 'UPDATE_ROTATION_SETTINGS',
        target: {
            type: 'EncryptionKey',
            id: 'kube-config-key',
            name: 'kube_config_key'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    rotationPeriodDays: 30
                },
                after: {
                    rotationPeriodDays: 90
                }
            }
        },
        rationale: 'policy_change: Aligned rotation period to 90-day platform standard'
    },
    {
        id: 'audit-023',
        timestamp: '2026-05-02T11:48:00Z',
        actor: {
            type: 'USER',
            id: 'operator@thaki.cloud',
            name: 'operator',
            ip: '10.0.2.15'
        },
        action: 'ROTATE_KEY',
        target: {
            type: 'EncryptionKey',
            id: 'kube-config-key',
            name: 'kube_config_key'
        },
        result: {
            status: 'DENIED',
            reason: 'insufficient_permission',
            changes: {
                before: null,
                after: null
            }
        },
        rationale: 'manual_rotation: Requested early rotation — denied, missing kms:RotateKey role'
    },
    {
        id: 'audit-024',
        timestamp: '2026-04-30T10:05:00Z',
        actor: {
            type: 'USER',
            id: 'container-admin@thaki.cloud',
            name: 'container-admin',
            ip: '10.0.3.21'
        },
        action: 'ENABLE_AUTO_ROTATION',
        target: {
            type: 'EncryptionKey',
            id: 'kube-config-key',
            name: 'kube_config_key'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    autoRotation: false
                },
                after: {
                    autoRotation: true
                }
            }
        },
        rationale: 'policy_change: Enabled automatic rotation on key provisioning'
    },
    {
        id: 'audit-025',
        timestamp: '2026-04-30T10:00:00Z',
        actor: {
            type: 'USER',
            id: 'container-admin@thaki.cloud',
            name: 'container-admin',
            ip: '10.0.3.21'
        },
        action: 'CREATE_KEY',
        target: {
            type: 'EncryptionKey',
            id: 'kube-config-key',
            name: 'kube_config_key'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: null,
                after: {
                    status: 'active',
                    version: 1
                }
            }
        },
        rationale: 'provisioning: Created symmetric key for Kubernetes config encryption'
    },
    // ── github-token (KMS030201 Secret Detail) audit trail ─────────────────────
    {
        id: 'audit-026',
        timestamp: '2026-04-22T16:40:00Z',
        actor: {
            type: 'USER',
            id: 'ai-platform-admin@thaki.cloud',
            name: 'ai-platform-admin',
            ip: '10.0.4.30'
        },
        action: 'UPDATE_SECRET_TAGS',
        target: {
            type: 'Secret',
            id: 'github-token',
            name: 'GITHUB_TOKEN'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    tags: [
                        'env: prod',
                        'owner: ai-platform'
                    ]
                },
                after: {
                    tags: [
                        'env: prod',
                        'owner: ai-platform',
                        'scope: repo,packages'
                    ]
                }
            }
        },
        rationale: 'metadata_update: Added scope tag for repo/packages access tracking'
    },
    {
        id: 'audit-027',
        timestamp: '2026-03-15T10:20:00Z',
        actor: {
            type: 'USER',
            id: 'operator@thaki.cloud',
            name: 'operator',
            ip: '10.0.2.15'
        },
        action: 'ROTATE_SECRET',
        target: {
            type: 'Secret',
            id: 'github-token',
            name: 'GITHUB_TOKEN'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    version: 2
                },
                after: {
                    version: 3
                }
            }
        },
        rationale: 'manual_rotation: Rotated after team member offboarding'
    },
    {
        id: 'audit-028',
        timestamp: '2025-11-02T08:00:00Z',
        actor: {
            type: 'SYSTEM_BATCH',
            id: 'system',
            ip: '10.0.0.1'
        },
        action: 'ROTATE_SECRET',
        target: {
            type: 'Secret',
            id: 'github-token',
            name: 'GITHUB_TOKEN'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: {
                    version: 1
                },
                after: {
                    version: 2
                }
            }
        },
        rationale: 'rotation: Scheduled rotation per quarterly policy'
    },
    {
        id: 'audit-029',
        timestamp: '2025-07-20T09:30:00Z',
        actor: {
            type: 'USER',
            id: 'ai-platform-admin@thaki.cloud',
            name: 'ai-platform-admin',
            ip: '10.0.4.30'
        },
        action: 'CREATE_SECRET',
        target: {
            type: 'Secret',
            id: 'github-token',
            name: 'GITHUB_TOKEN'
        },
        result: {
            status: 'SUCCESS',
            changes: {
                before: null,
                after: {
                    status: 'active',
                    version: 1
                }
            }
        },
        rationale: 'provisioning: Stored GitHub PAT for AI platform CI integration'
    }
];
const getAuditLogsByResourceId = (resourceId)=>MOCK_AUDIT_LOGS.filter((entry)=>entry.target.id === resourceId);
const getRecentAuditLogs = (limit = 5)=>[
        ...MOCK_AUDIT_LOGS
    ].sort((a, b)=>new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);


},
"./src/pages/kms/shared.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  AuditLogSection: () => (AuditLogSection),
  KmsStateBadge: () => (KmsStateBadge),
  formatAbsoluteDatetime: () => (formatAbsoluteDatetime),
  formatDate: () => (formatDate)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var react__rspack_import_1 = __webpack_require__("./node_modules/react/index.js");
/* import */ var _design_system__rspack_import_2 = __webpack_require__("./src/design-system/components/Badge/Badge.tsx");
/* import */ var _design_system__rspack_import_4 = __webpack_require__("./src/design-system/components/Table/Table.tsx");
/* import */ var _mocks_auditLogs__rspack_import_3 = __webpack_require__("./src/pages/kms/mocks/auditLogs.ts");




/* ─────────────────────────────────────────────────────────────────
   Date formatting — TDS UX writing(영문) 규칙
   · 일자 축약형 (테이블/요약): Mth DD, YYYY
   · 일자+시각 (이벤트/로그, 테이블이므로 UTC·초 생략): Mth DD, YYYY HH:mm
   · 24시간제, 로컬 기준, 날짜·시각 사이 한 칸
   ───────────────────────────────────────────────────────────────── */ const MONTH_ABBR = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];
function formatDate(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return `${MONTH_ABBR[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`;
}
function formatAbsoluteDatetime(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${formatDate(iso)} ${hh}:${mi}`;
}
/* ─────────────────────────────────────────────────────────────────
   KmsStateBadge — key/secret/certificate 상태 뱃지
   ───────────────────────────────────────────────────────────────── */ /* status 뱃지는 TDS 컨벤션상 항상 subtle (tds_ssot 전 페이지 subtle 통일) */ const STATE_CONFIG = {
    active: {
        label: 'Active',
        theme: 'gre'
    },
    expiring: {
        label: 'Expiring',
        theme: 'ylw'
    },
    expired: {
        label: 'Expired',
        theme: 'red'
    },
    revoked: {
        label: 'Revoked',
        theme: 'red'
    },
    deactivated: {
        label: 'Deactivated',
        theme: 'ylw'
    },
    deleted: {
        label: 'Deleted',
        theme: 'red'
    },
    destroyed: {
        label: 'Destroyed',
        theme: 'red'
    },
    archived: {
        label: 'Archived',
        theme: 'gry'
    }
};
const FALLBACK_CONFIG = {
    label: '-',
    theme: 'gry'
};
function KmsStateBadge({ status }) {
    const config = STATE_CONFIG[status] ?? FALLBACK_CONFIG;
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_2.Badge, {
        theme: config.theme,
        type: "subtle",
        size: "sm",
        children: config.label
    });
}
/* ─────────────────────────────────────────────────────────────────
   AuditLogSection — 상세 페이지 공용 감사 로그 섹션
   ───────────────────────────────────────────────────────────────── */ const RESULT_BADGE = {
    SUCCESS: {
        theme: 'gre',
        label: 'Success'
    },
    FAIL: {
        theme: 'red',
        label: 'Fail'
    },
    DENIED: {
        theme: 'ylw',
        label: 'Denied'
    }
};
const AUDIT_COLUMNS = [
    {
        key: 'timestamp',
        label: 'Timestamp',
        width: '170px',
        render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                className: "text-caption text-[var(--color-text-subtle)]",
                children: formatAbsoluteDatetime(row.timestamp)
            })
    },
    {
        key: 'actor',
        label: 'Actor',
        width: '160px',
        render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                className: "text-body-sm truncate block",
                children: row.actor.name ?? row.actor.id
            })
    },
    {
        key: 'ip',
        label: 'Source IP',
        width: '120px',
        render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                className: "font-mono text-caption text-[var(--color-text-subtle)]",
                children: row.actor.ip
            })
    },
    {
        key: 'action',
        label: 'Action',
        width: '200px',
        render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                className: "font-mono text-caption text-[var(--color-text-subtle)]",
                children: row.action
            })
    },
    {
        key: 'target',
        label: 'Target',
        flex: 1,
        minWidth: '160px',
        render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("div", {
                className: "flex flex-col gap-0.5",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                        className: "text-body-sm truncate",
                        children: row.target.name ?? row.target.id
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                        className: "text-caption text-[var(--color-text-subtle)]",
                        children: row.target.type
                    })
                ]
            })
    },
    {
        key: 'result',
        label: 'Result',
        width: '90px',
        render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_2.Badge, {
                theme: RESULT_BADGE[row.result.status].theme,
                type: "subtle",
                size: "sm",
                children: RESULT_BADGE[row.result.status].label
            })
    },
    {
        key: 'rationale',
        label: 'Rationale',
        flex: 1,
        minWidth: '160px',
        render: (_, row)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                className: "text-caption text-[var(--color-text-subtle)]",
                children: row.rationale ?? row.result.reason ?? '-'
            })
    }
];
function AuditLogSection({ resourceId, limit = 5, title = 'Audit logs' }) {
    const entries = (0,react__rspack_import_1.useMemo)(()=>resourceId ? (0,_mocks_auditLogs__rspack_import_3.getAuditLogsByResourceId)(resourceId).slice(0, limit) : (0,_mocks_auditLogs__rspack_import_3.getRecentAuditLogs)(limit), [
        resourceId,
        limit
    ]);
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("div", {
        className: "bg-[var(--color-surface-default)] rounded-xl border border-[var(--color-border-default)] p-4 flex flex-col gap-3",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("h6", {
                className: "text-heading-h6 text-[var(--color-text-default)]",
                children: title
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_4.Table, {
                columns: AUDIT_COLUMNS,
                data: entries,
                rowKey: "id",
                emptyMessage: "No audit logs found."
            })
        ]
    });
}


},

}]);
//# sourceMappingURL=src_components_KmsSidebar_tsx-src_pages_kms_shared_tsx.6797add57417589c.js.map