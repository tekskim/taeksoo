"use strict";
(self["webpackChunk_thaki_tds"] = self["webpackChunk_thaki_tds"] || []).push([["src_pages_kms_CertificateDetailPage_tsx"], {
"./src/pages/kms/CertificateDetailPage.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (CertificateDetailPage)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var react__rspack_import_1 = __webpack_require__("./node_modules/react/index.js");
/* import */ var react_router_dom__rspack_import_3 = __webpack_require__("./node_modules/react-router/dist/development/chunk-JZWAC4HX.mjs");
/* import */ var _design_system__rspack_import_2 = __webpack_require__("./src/design-system/components/Badge/BadgeList.tsx");
/* import */ var _design_system__rspack_import_6 = __webpack_require__("./src/design-system/components/PageShell/PageShell.tsx");
/* import */ var _design_system__rspack_import_8 = __webpack_require__("./src/design-system/components/TabBar/TabBar.tsx");
/* import */ var _design_system__rspack_import_9 = __webpack_require__("./src/design-system/components/TopBar/TopBar.tsx");
/* import */ var _design_system__rspack_import_10 = __webpack_require__("./src/design-system/components/Breadcrumb/Breadcrumb.tsx");
/* import */ var _design_system__rspack_import_11 = __webpack_require__("./src/design-system/components/EmptyState/EmptyState.tsx");
/* import */ var _design_system__rspack_import_13 = __webpack_require__("./src/design-system/layouts/Stack.tsx");
/* import */ var _design_system__rspack_import_14 = __webpack_require__("./src/design-system/components/DetailHeader/DetailHeader.tsx");
/* import */ var _design_system__rspack_import_15 = __webpack_require__("./src/design-system/components/Button/Button.tsx");
/* import */ var _design_system__rspack_import_16 = __webpack_require__("./src/design-system/components/Tabs/Tabs.tsx");
/* import */ var _components_KmsSidebar__rspack_import_7 = __webpack_require__("./src/components/KmsSidebar.tsx");
/* import */ var _contexts_TabContext__rspack_import_5 = __webpack_require__("./src/contexts/TabContext.tsx");
/* import */ var _shared__rspack_import_12 = __webpack_require__("./src/pages/kms/shared.tsx");
/* import */ var _models_certificate__rspack_import_4 = __webpack_require__("./src/pages/kms/models/certificate.ts");
/* import */ var _CertificateActionModals__rspack_import_17 = __webpack_require__("./src/pages/kms/CertificateActionModals.tsx");









function renderSanList(items) {
    if (items.length === 0) {
        return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
            className: "text-body-sm text-[var(--color-text-subtle)]",
            children: "-"
        });
    }
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_2.BadgeList, {
        items: items,
        maxVisible: 3,
        theme: "gry",
        size: "sm"
    });
}
/* ─────────────────────────────────────────────────────────────────
   Main Page
   ───────────────────────────────────────────────────────────────── */ function CertificateDetailPage() {
    const { certificateId } = (0,react_router_dom__rspack_import_3.useParams)();
    const [sidebarOpen, setSidebarOpen] = (0,react__rspack_import_1.useState)(true);
    const [certificate, setCertificate] = (0,react__rspack_import_1.useState)(()=>(0,_models_certificate__rspack_import_4.getCertificateById)(certificateId));
    const [isRevokeConfirmOpen, setIsRevokeConfirmOpen] = (0,react__rspack_import_1.useState)(false);
    const [isRenewConfirmOpen, setIsRenewConfirmOpen] = (0,react__rspack_import_1.useState)(false);
    const [activeTab, setActiveTab] = (0,react__rspack_import_1.useState)('audit');
    const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab } = (0,_contexts_TabContext__rspack_import_5.useTabs)();
    const sidebarWidth = sidebarOpen ? 200 : 0;
    (0,react__rspack_import_1.useEffect)(()=>{
        setCertificate((0,_models_certificate__rspack_import_4.getCertificateById)(certificateId));
        setIsRevokeConfirmOpen(false);
        setIsRenewConfirmOpen(false);
    }, [
        certificateId
    ]);
    const breadcrumbBase = [
        {
            label: 'KMS',
            href: '/kms/overview'
        },
        {
            label: 'Certificates',
            href: '/kms/certificates'
        }
    ];
    const shell = (children)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.PageShell, {
            sidebar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_components_KmsSidebar__rspack_import_7.KmsSidebar, {
                isOpen: sidebarOpen,
                onToggle: ()=>setSidebarOpen(!sidebarOpen)
            }),
            sidebarWidth: sidebarWidth,
            tabBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_8.TabBar, {
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
            topBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_9.TopBar, {
                showSidebarToggle: !sidebarOpen,
                onSidebarToggle: ()=>setSidebarOpen(!sidebarOpen),
                showNavigation: true,
                onBack: ()=>window.history.back(),
                onForward: ()=>window.history.forward(),
                breadcrumb: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_10.Breadcrumb, {
                    items: [
                        ...breadcrumbBase,
                        {
                            label: (certificate === null || certificate === void 0 ? void 0 : certificate.commonName) ?? 'Certificate details'
                        }
                    ]
                })
            }),
            contentClassName: "pt-4 px-8 pb-20",
            children: children
        });
    if (!certificate) {
        return shell(/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.EmptyState, {
            title: "Certificate not found",
            description: "The selected certificate may have been removed or is unavailable."
        }));
    }
    const showRevokeAction = (0,_models_certificate__rspack_import_4.canRevokeCertificate)(certificate);
    const showRenewAction = (0,_models_certificate__rspack_import_4.hasCertificateOptionalAction)(certificate, 'renew');
    /* Certificate information → DetailHeader InfoGrid (TDS detail-header 패턴)
     Common Name은 타이틀로 표시되므로 카드에서 제외 */ const summaryFields = [
        {
            label: 'Status',
            value: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_shared__rspack_import_12.KmsStateBadge, {
                status: certificate.status
            })
        },
        {
            label: 'SAN',
            value: renderSanList(certificate.san)
        },
        {
            label: 'Serial number',
            value: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                className: "font-mono",
                children: certificate.serialNumber || '-'
            })
        },
        {
            label: 'Issuer CA',
            value: certificate.issuerCa || '-'
        },
        {
            label: 'Signature algorithm',
            value: certificate.signatureAlgorithm || '-'
        },
        {
            label: 'Public key algorithm',
            value: certificate.publicKeyAlgorithm || '-'
        },
        {
            label: 'Issued at',
            value: certificate.issuedAt ? (0,_shared__rspack_import_12.formatDate)(certificate.issuedAt) : '-'
        },
        {
            label: 'Expires at',
            value: certificate.expiresAt ? (0,_shared__rspack_import_12.formatDate)(certificate.expiresAt) : '-'
        },
        {
            label: 'Days remaining',
            value: certificate.daysRemaining < 0 ? 'Expired' : `D-${certificate.daysRemaining}`
        }
    ];
    const handleRevokeCertificate = (_reasonCode, _reason)=>{
        setCertificate((previous)=>{
            var _previous_optionalActions;
            if (!previous) return previous;
            return {
                ...previous,
                status: 'revoked',
                optionalActions: (_previous_optionalActions = previous.optionalActions) === null || _previous_optionalActions === void 0 ? void 0 : _previous_optionalActions.filter((action)=>action !== 'revoke')
            };
        });
        setIsRevokeConfirmOpen(false);
    };
    const handleRenewCertificate = (_reason)=>{
        setIsRenewConfirmOpen(false);
    };
    return shell(/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(react_jsx_runtime__rspack_import_0.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_13.VStack, {
                gap: 4,
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_14.DetailHeader, {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_14.DetailHeader.Title, {
                                children: certificate.commonName
                            }),
                            (showRenewAction || showRevokeAction) && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_14.DetailHeader.Actions, {
                                children: [
                                    showRenewAction && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_15.Button, {
                                        variant: "secondary",
                                        size: "sm",
                                        onClick: ()=>setIsRenewConfirmOpen(true),
                                        children: "Renew"
                                    }),
                                    showRevokeAction && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_15.Button, {
                                        variant: "secondary",
                                        size: "sm",
                                        onClick: ()=>setIsRevokeConfirmOpen(true),
                                        children: "Revoke"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_14.DetailHeader.InfoGrid, {
                                children: summaryFields.map(({ label, value })=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_14.DetailHeader.InfoCard, {
                                        label: label,
                                        value: value
                                    }, label))
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_16.Tabs, {
                        value: activeTab,
                        onChange: setActiveTab,
                        variant: "underline",
                        size: "sm",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_16.TabList, {
                                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_16.Tab, {
                                    value: "audit",
                                    children: "Audit Logs"
                                })
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_16.TabPanel, {
                                value: "audit",
                                className: "pt-0",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.VStack, {
                                    gap: 4,
                                    className: "pt-4",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_shared__rspack_import_12.AuditLogSection, {
                                        resourceId: certificate.id
                                    })
                                })
                            })
                        ]
                    })
                ]
            }),
            isRevokeConfirmOpen && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_CertificateActionModals__rspack_import_17.RevokeCertificateConfirmModal, {
                isOpen: isRevokeConfirmOpen,
                commonName: certificate.commonName,
                onCancel: ()=>setIsRevokeConfirmOpen(false),
                onConfirm: handleRevokeCertificate
            }),
            isRenewConfirmOpen && /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_CertificateActionModals__rspack_import_17.RenewCertificateConfirmModal, {
                isOpen: isRenewConfirmOpen,
                commonName: certificate.commonName,
                onCancel: ()=>setIsRenewConfirmOpen(false),
                onConfirm: handleRenewCertificate
            })
        ]
    }));
}


},

}]);
//# sourceMappingURL=src_pages_kms_CertificateDetailPage_tsx.1c316606055d70c3.js.map