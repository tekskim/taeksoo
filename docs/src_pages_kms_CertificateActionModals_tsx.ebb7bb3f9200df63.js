"use strict";
(self["webpackChunk_thaki_tds"] = self["webpackChunk_thaki_tds"] || []).push([["src_pages_kms_CertificateActionModals_tsx"], {
"./src/pages/kms/CertificateActionModals.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  RenewCertificateConfirmModal: () => (RenewCertificateConfirmModal),
  RevokeCertificateConfirmModal: () => (RevokeCertificateConfirmModal)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var react__rspack_import_1 = __webpack_require__("./node_modules/react/index.js");
/* import */ var _design_system__rspack_import_3 = __webpack_require__("./src/design-system/components/Modal/Modal.tsx");
/* import */ var _design_system__rspack_import_4 = __webpack_require__("./src/design-system/layouts/Stack.tsx");
/* import */ var _design_system__rspack_import_5 = __webpack_require__("./src/design-system/components/FormField/FormField.tsx");
/* import */ var _design_system__rspack_import_6 = __webpack_require__("./src/design-system/components/Select/Select.tsx");
/* import */ var _design_system__rspack_import_7 = __webpack_require__("./src/design-system/components/Input/Textarea.tsx");
/* import */ var _design_system__rspack_import_8 = __webpack_require__("./src/design-system/components/Button/Button.tsx");
/* import */ var _models_certificate__rspack_import_2 = __webpack_require__("./src/pages/kms/models/certificate.ts");




/* ─────────────────────────────────────────────────────────────────
   Certificate action confirm modals — Renew / Revoke
   상세 페이지와 리스트 페이지(Action 컨텍스트 메뉴)에서 공통 사용
   ───────────────────────────────────────────────────────────────── */ const REASON_DESCRIPTION_MAX_LENGTH = 500;
const CRL_REASON_OPTIONS = _models_certificate__rspack_import_2.CRL_REASON_CODES.map((r)=>({
        value: r.code,
        label: `${r.code} (${r.value})`
    }));
function RevokeCertificateConfirmModal({ isOpen, commonName, onCancel, onConfirm }) {
    const [reasonCode, setReasonCode] = (0,react__rspack_import_1.useState)('');
    const [reason, setReason] = (0,react__rspack_import_1.useState)('');
    const confirmDisabled = reasonCode === '' || reason.trim().length === 0;
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_3.Modal, {
        isOpen: isOpen,
        onClose: onCancel,
        title: "Confirm certificate revocation",
        description: "The certificate will be marked as Revoked after revocation. Continue?",
        className: "w-[420px]",
        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_4.VStack, {
            gap: 4,
            className: "w-full",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("div", {
                    className: "bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5",
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                            className: "text-label-sm text-[var(--color-text-subtle)]",
                            children: "Common Name"
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                            className: "text-body-md text-[var(--color-text-default)]",
                            children: commonName || '-'
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_5.FormField, {
                    label: "Reason code (CRL)",
                    required: true,
                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.Select, {
                        options: CRL_REASON_OPTIONS,
                        value: reasonCode,
                        onChange: setReasonCode,
                        placeholder: "Select a CRL reason code",
                        fullWidth: true
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_5.FormField, {
                    label: "Reason",
                    required: true,
                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_7.Textarea, {
                        value: reason,
                        onChange: (e)=>setReason(e.target.value),
                        maxLength: REASON_DESCRIPTION_MAX_LENGTH,
                        placeholder: "Enter reason for change",
                        rows: 4,
                        fullWidth: true
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_4.HStack, {
                    gap: 2,
                    className: "w-full",
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.Button, {
                            variant: "outline",
                            onClick: onCancel,
                            className: "flex-1",
                            children: "Cancel"
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.Button, {
                            variant: "danger",
                            disabled: confirmDisabled,
                            onClick: ()=>onConfirm(reasonCode, reason.trim()),
                            className: "flex-1",
                            children: "Revoke"
                        })
                    ]
                })
            ]
        })
    });
}
function RenewCertificateConfirmModal({ isOpen, commonName, onCancel, onConfirm }) {
    const [reason, setReason] = (0,react__rspack_import_1.useState)('');
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_3.Modal, {
        isOpen: isOpen,
        onClose: onCancel,
        title: "Confirm certificate renewal",
        description: "Renew this certificate?",
        className: "w-[420px]",
        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_4.VStack, {
            gap: 4,
            className: "w-full",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("div", {
                    className: "bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5",
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                            className: "text-label-sm text-[var(--color-text-subtle)]",
                            children: "Common Name"
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                            className: "text-body-md text-[var(--color-text-default)]",
                            children: commonName || '-'
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_5.FormField, {
                    label: "Reason",
                    required: true,
                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_7.Textarea, {
                        value: reason,
                        onChange: (e)=>setReason(e.target.value),
                        maxLength: REASON_DESCRIPTION_MAX_LENGTH,
                        placeholder: "Enter reason for change",
                        rows: 4,
                        fullWidth: true
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_4.HStack, {
                    gap: 2,
                    className: "w-full",
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.Button, {
                            variant: "outline",
                            onClick: onCancel,
                            className: "flex-1",
                            children: "Cancel"
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.Button, {
                            variant: "primary",
                            disabled: reason.trim().length === 0,
                            onClick: ()=>onConfirm(reason.trim()),
                            className: "flex-1",
                            children: "Renew"
                        })
                    ]
                })
            ]
        })
    });
}


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
//# sourceMappingURL=src_pages_kms_CertificateActionModals_tsx.ebb7bb3f9200df63.js.map