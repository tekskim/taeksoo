"use strict";
(self["webpackChunk_thaki_tds"] = self["webpackChunk_thaki_tds"] || []).push([["src_pages_ai-platform_DatasourceEditPage_tsx"], {
"./src/pages/ai-platform/DatasourceEditPage.tsx"(__unused_rspack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  DatasourceEditPage: () => (DatasourceEditPage),
  "default": () => (__rspack_default_export)
});
/* import */ var react_jsx_runtime__rspack_import_0 = __webpack_require__("./node_modules/react/jsx-runtime.js");
/* import */ var react__rspack_import_1 = __webpack_require__("./node_modules/react/index.js");
/* import */ var react_router_dom__rspack_import_2 = __webpack_require__("./node_modules/react-router/dist/development/chunk-JZWAC4HX.mjs");
/* import */ var _design_system__rspack_import_4 = __webpack_require__("./src/design-system/components/PageShell/PageShell.tsx");
/* import */ var _design_system__rspack_import_6 = __webpack_require__("./src/design-system/components/TabBar/TabBar.tsx");
/* import */ var _design_system__rspack_import_7 = __webpack_require__("./src/design-system/components/TopBar/TopBar.tsx");
/* import */ var _design_system__rspack_import_9 = __webpack_require__("./src/design-system/layouts/Stack.tsx");
/* import */ var _design_system__rspack_import_10 = __webpack_require__("./src/design-system/components/SectionCard/SectionCard.tsx");
/* import */ var _design_system__rspack_import_11 = __webpack_require__("./src/design-system/components/FormField/FormField.tsx");
/* import */ var _design_system__rspack_import_12 = __webpack_require__("./src/design-system/components/Input/Input.tsx");
/* import */ var _design_system__rspack_import_13 = __webpack_require__("./src/design-system/components/Input/Textarea.tsx");
/* import */ var _design_system__rspack_import_14 = __webpack_require__("./src/design-system/components/Chip/Chip.tsx");
/* import */ var _design_system__rspack_import_15 = __webpack_require__("./src/design-system/components/Select/Select.tsx");
/* import */ var _design_system__rspack_import_16 = __webpack_require__("./src/design-system/components/Radio/RadioGroup.tsx");
/* import */ var _design_system__rspack_import_17 = __webpack_require__("./src/design-system/components/FloatingCard/FloatingCard.tsx");
/* import */ var _components_AIPlatformSidebar__rspack_import_5 = __webpack_require__("./src/components/AIPlatformSidebar.tsx");
/* import */ var _contexts_TabContext__rspack_import_3 = __webpack_require__("./src/contexts/TabContext.tsx");
/* import */ var _tabler_icons_react__rspack_import_8 = __webpack_require__("./node_modules/@tabler/icons-react/dist/esm/icons/IconBell.mjs");







const DATA_TYPE_OPTIONS = [
    {
        value: 'file-upload',
        label: 'File Upload'
    },
    {
        value: 'postgresql',
        label: 'PostgreSQL'
    }
];
const CHUNKING_OPTIONS = [
    {
        value: 'structure',
        label: 'Structure-based chunking'
    },
    {
        value: 'fixed',
        label: 'Fixed-size chunking'
    }
];
const REPEAT_OPTIONS = [
    {
        value: 'daily',
        label: 'Daily'
    },
    {
        value: 'weekly',
        label: 'Weekly'
    },
    {
        value: 'monthly',
        label: 'Monthly'
    }
];
const REPEAT_INTERVAL_OPTIONS = [
    {
        value: '1',
        label: '1'
    },
    {
        value: '2',
        label: '2'
    },
    {
        value: '3',
        label: '3'
    },
    {
        value: '4',
        label: '4'
    }
];
const WEEKDAY_KEYS = [
    'sun',
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat'
];
const WEEKDAY_LABELS = [
    'S',
    'M',
    'T',
    'W',
    'T',
    'F',
    'S'
];
function scrollToSection(elementId) {
    requestAnimationFrame(()=>{
        var _document_getElementById;
        (_document_getElementById = document.getElementById(elementId)) === null || _document_getElementById === void 0 ? void 0 : _document_getElementById.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
}
/** Mock loader — replace with API when wired. */ function getMockDatasource(id) {
    return {
        name: id ? `Data source ${id.slice(0, 8)}` : 'Sample data source',
        description: 'Indexes product documentation for support agents.',
        tags: [
            'Tag 1',
            'Tag 2',
            'Tag 3'
        ],
        dataType: 'file-upload',
        chunking: 'structure',
        syncMode: 'scheduled',
        repeat: 'weekly',
        repeatEvery: '1',
        repeatOn: new Set([
            'mon'
        ])
    };
}
function DatasourceEditPage() {
    const { id } = (0,react_router_dom__rspack_import_2.useParams)();
    const navigate = (0,react_router_dom__rspack_import_2.useNavigate)();
    const { tabs, activeTabId, selectTab, closeTab, addNewTab, moveTab, updateActiveTabLabel } = (0,_contexts_TabContext__rspack_import_3.useTabs)();
    const [sidebarOpen, setSidebarOpen] = (0,react__rspack_import_1.useState)(true);
    const sidebarWidth = sidebarOpen ? 200 : 0;
    const initial = (0,react__rspack_import_1.useMemo)(()=>getMockDatasource(id), [
        id
    ]);
    const [name, setName] = (0,react__rspack_import_1.useState)(initial.name);
    const [description, setDescription] = (0,react__rspack_import_1.useState)(initial.description);
    const [tags, setTags] = (0,react__rspack_import_1.useState)(initial.tags);
    const [tagInput, setTagInput] = (0,react__rspack_import_1.useState)('');
    const [dataType, setDataType] = (0,react__rspack_import_1.useState)(initial.dataType);
    const [chunking, setChunking] = (0,react__rspack_import_1.useState)(initial.chunking);
    const [syncMode, setSyncMode] = (0,react__rspack_import_1.useState)(initial.syncMode);
    const [repeat, setRepeat] = (0,react__rspack_import_1.useState)(initial.repeat);
    const [repeatEvery, setRepeatEvery] = (0,react__rspack_import_1.useState)(initial.repeatEvery);
    const [repeatOn, setRepeatOn] = (0,react__rspack_import_1.useState)(()=>new Set(initial.repeatOn));
    (0,react__rspack_import_1.useEffect)(()=>{
        document.title = 'Edit data source - THAKI Cloud';
        return ()=>{
            document.title = 'THAKI Cloud';
        };
    }, []);
    (0,react__rspack_import_1.useEffect)(()=>{
        updateActiveTabLabel('Edit data source');
    }, [
        updateActiveTabLabel
    ]);
    const chunkingHelper = chunking === 'structure' ? 'Split text by characters with overlap' : 'Split text into fixed-size segments';
    const toggleWeekday = (0,react__rspack_import_1.useCallback)((key)=>{
        setRepeatOn((prev)=>{
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }, []);
    const addTagFromInput = (0,react__rspack_import_1.useCallback)(()=>{
        const next = tagInput.trim();
        if (!next) return;
        if (tags.includes(next) || tags.length >= 10) return;
        setTags((t)=>[
                ...t,
                next
            ]);
        setTagInput('');
    }, [
        tagInput,
        tags
    ]);
    const basicSectionStatus = (0,react__rspack_import_1.useMemo)(()=>{
        return name.trim() ? 'success' : 'default';
    }, [
        name
    ]);
    const dataSettingStatus = (0,react__rspack_import_1.useMemo)(()=>{
        if (!dataType || !chunking) return 'default';
        if (syncMode === 'once') return 'success';
        if (!repeat || !repeatEvery || repeatOn.size === 0) return 'default';
        return 'success';
    }, [
        chunking,
        dataType,
        repeat,
        repeatEvery,
        repeatOn.size,
        syncMode
    ]);
    const summarySections = (0,react__rspack_import_1.useMemo)(()=>[
            {
                tabTitle: 'Progress',
                items: [
                    {
                        id: 'basic',
                        title: 'Basic information',
                        status: basicSectionStatus,
                        onClick: ()=>scrollToSection('datasource-basic-information')
                    },
                    {
                        id: 'data',
                        title: 'Data setting',
                        status: dataSettingStatus,
                        onClick: ()=>scrollToSection('datasource-data-setting')
                    }
                ],
                collapsible: false
            }
        ], [
        basicSectionStatus,
        dataSettingStatus
    ]);
    const canSave = name.trim().length > 0 && Boolean(dataType && chunking) && (syncMode === 'once' || Boolean(repeat && repeatEvery) && repeatOn.size > 0);
    return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_4.PageShell, {
        sidebar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_components_AIPlatformSidebar__rspack_import_5.AIPlatformSidebar, {
            isOpen: sidebarOpen,
            onToggle: ()=>setSidebarOpen(!sidebarOpen)
        }),
        sidebarWidth: sidebarWidth,
        tabBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_6.TabBar, {
            tabs: tabs.map((tab)=>({
                    id: tab.id,
                    label: tab.label,
                    closable: tab.closable
                })),
            activeTab: activeTabId,
            onTabChange: selectTab,
            onTabClose: closeTab,
            onTabAdd: addNewTab,
            onTabReorder: moveTab,
            showAddButton: true,
            showWindowControls: true,
            onWindowClose: ()=>navigate('/')
        }),
        topBar: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_7.TopBar, {
            showSidebarToggle: !sidebarOpen,
            onSidebarToggle: ()=>setSidebarOpen(true),
            showNavigation: false,
            actions: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_7.TopBarAction, {
                icon: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_tabler_icons_react__rspack_import_8["default"], {
                    size: 16,
                    stroke: 1.5
                }),
                "aria-label": "Notifications",
                badge: true
            })
        }),
        contentClassName: "pt-4 px-8 pb-20 bg-[var(--color-surface-subtle)]",
        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)("div", {
            className: "flex w-full items-start justify-center gap-6",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_9.VStack, {
                    gap: 6,
                    className: "min-w-0 flex-1 max-w-[896px]",
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                            className: "flex h-8 items-center",
                            children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("h1", {
                                className: "text-heading-h4 text-[var(--color-text-default)]",
                                children: "Edit data source"
                            })
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_10.SectionCard, {
                            id: "datasource-basic-information",
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_10.SectionCard.Header, {
                                    title: "Basic information"
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_10.SectionCard.Content, {
                                    className: "gap-6",
                                    children: [
                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.FormField, {
                                            label: "Data source name",
                                            required: true,
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_12.Input, {
                                                value: name,
                                                onChange: (e)=>setName(e.target.value),
                                                placeholder: "Enter a name for this data source",
                                                fullWidth: true
                                            })
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.FormField, {
                                            label: "Description",
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_13.Textarea, {
                                                value: description,
                                                onChange: (e)=>setDescription(e.target.value),
                                                placeholder: "Add an description",
                                                rows: 4,
                                                fullWidth: true
                                            })
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_9.VStack, {
                                            gap: 2,
                                            className: "w-full",
                                            children: [
                                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.FormField, {
                                                    label: "Tag",
                                                    description: "Tags help categorize and identify your resources",
                                                    helperText: "Up to 10 tags allowed",
                                                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_12.Input, {
                                                        value: tagInput,
                                                        onChange: (e)=>setTagInput(e.target.value),
                                                        onKeyDown: (e)=>{
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                addTagFromInput();
                                                            }
                                                        },
                                                        placeholder: "Enter tags",
                                                        fullWidth: true,
                                                        disabled: tags.length >= 10
                                                    })
                                                }),
                                                tags.length > 0 ? /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                                                    className: "bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-2 py-2 w-full",
                                                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_9.HStack, {
                                                        gap: 1,
                                                        className: "flex-wrap",
                                                        children: tags.map((t)=>/*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_14.Chip, {
                                                                value: t,
                                                                onRemove: ()=>setTags((prev)=>prev.filter((x)=>x !== t))
                                                            }, t))
                                                    })
                                                }) : null
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_10.SectionCard, {
                            id: "datasource-data-setting",
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_10.SectionCard.Header, {
                                    title: "Data setting"
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_10.SectionCard.Content, {
                                    className: "gap-6",
                                    children: [
                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.FormField, {
                                            label: "Data type",
                                            required: true,
                                            description: "Select a type and complete the connection.",
                                            helperText: dataType === 'file-upload' ? 'Support : PDF, DOC, DOCX, TXT, MD, CSV (max 100MB)' : undefined,
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_15.Select, {
                                                options: DATA_TYPE_OPTIONS,
                                                value: dataType,
                                                onChange: setDataType,
                                                fullWidth: true
                                            })
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.FormField, {
                                            label: "Chunking strategy",
                                            required: true,
                                            description: "Select how documents should be split into chunks.",
                                            helperText: chunkingHelper,
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_15.Select, {
                                                options: CHUNKING_OPTIONS,
                                                value: chunking,
                                                onChange: setChunking,
                                                fullWidth: true
                                            })
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.FormField, {
                                            label: "Sync setting",
                                            required: true,
                                            description: "Select how and when data should be synced.",
                                            spacing: "loose",
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_16.RadioGroup, {
                                                name: "sync-mode",
                                                value: syncMode,
                                                onChange: (v)=>setSyncMode(v),
                                                direction: "vertical",
                                                options: [
                                                    {
                                                        value: 'once',
                                                        label: 'One-time Sync (Sync Now)'
                                                    },
                                                    {
                                                        value: 'scheduled',
                                                        label: 'Automatic Sync (Scheduled)'
                                                    }
                                                ]
                                            })
                                        }),
                                        syncMode === 'scheduled' ? /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                                            className: "w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)] p-3",
                                            children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_9.VStack, {
                                                gap: 6,
                                                className: "w-full",
                                                children: [
                                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                                                        className: "text-heading-h5 text-[var(--color-text-default)]",
                                                        children: "Scheduled update"
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.FormField, {
                                                        label: "Repeat",
                                                        required: true,
                                                        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_15.Select, {
                                                            options: REPEAT_OPTIONS,
                                                            value: repeat,
                                                            onChange: setRepeat,
                                                            className: "w-[120px]"
                                                        })
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.FormField, {
                                                        label: "Repeat every",
                                                        required: true,
                                                        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsxs)(_design_system__rspack_import_9.HStack, {
                                                            gap: 2,
                                                            align: "center",
                                                            children: [
                                                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_15.Select, {
                                                                    options: REPEAT_INTERVAL_OPTIONS,
                                                                    value: repeatEvery,
                                                                    onChange: setRepeatEvery,
                                                                    className: "w-[80px]"
                                                                }),
                                                                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("span", {
                                                                    className: "text-body-md text-[var(--color-text-subtle)]",
                                                                    children: repeat === 'daily' ? 'day(s)' : repeat === 'monthly' ? 'month(s)' : 'week(s)'
                                                                })
                                                            ]
                                                        })
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_11.FormField, {
                                                        label: "Repeat on",
                                                        required: true,
                                                        children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_9.HStack, {
                                                            gap: 2,
                                                            className: "flex-wrap",
                                                            children: WEEKDAY_KEYS.map((key, i)=>{
                                                                const selected = repeatOn.has(key);
                                                                return /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("button", {
                                                                    type: "button",
                                                                    onClick: ()=>toggleWeekday(key),
                                                                    className: [
                                                                        'min-w-0 size-6 rounded-[var(--radius-sm)] flex items-center justify-center text-label-md transition-colors',
                                                                        selected ? 'bg-[var(--color-action-primary)] text-[var(--color-text-on-primary)]' : 'bg-[var(--color-border-default)] text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-muted)]'
                                                                    ].join(' '),
                                                                    "aria-pressed": selected,
                                                                    "aria-label": key,
                                                                    children: WEEKDAY_LABELS[i]
                                                                }, key);
                                                            })
                                                        })
                                                    })
                                                ]
                                            })
                                        }) : null
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)("div", {
                    className: "shrink-0 w-[312px] sticky top-4 self-start",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__rspack_import_0.jsx)(_design_system__rspack_import_17.FloatingCard, {
                        title: "Summary",
                        sections: summarySections,
                        cancelLabel: "Cancel",
                        actionLabel: "Save",
                        actionEnabled: canSave,
                        onCancel: ()=>navigate('/agent/datasource'),
                        onAction: ()=>navigate('/agent/datasource'),
                        portal: false,
                        width: "312px"
                    })
                })
            ]
        })
    });
}
/* export default */ const __rspack_default_export = (DatasourceEditPage);


},

}]);
//# sourceMappingURL=src_pages_ai-platform_DatasourceEditPage_tsx.1180cb42975d83f7.js.map