# Figma Capture Mode Reference

## Figma Capture Mode URLs

All URLs use `?figma=true` query parameter. Copy the full block below.

### List Pages

```
https://thakicloud.github.io/tds_ssot/cloudbuilder/services?figma=true
https://thakicloud.github.io/tds_ssot/cloudbuilder/compute-services?figma=true
https://thakicloud.github.io/tds_ssot/cloudbuilder/compute-services?figma=true&tab=compute-hosts
https://thakicloud.github.io/tds_ssot/cloudbuilder/compute-services?figma=true&tab=hypervisors
https://thakicloud.github.io/tds_ssot/cloudbuilder/compute-services?figma=true&tab=resource-provider
https://thakicloud.github.io/tds_ssot/cloudbuilder/network-agents?figma=true
https://thakicloud.github.io/tds_ssot/cloudbuilder/block-storage-services?figma=true
https://thakicloud.github.io/tds_ssot/cloudbuilder/block-storage-services?figma=true&tab=block-storage
https://thakicloud.github.io/tds_ssot/cloudbuilder/block-storage-services?figma=true&tab=storage-backends
https://thakicloud.github.io/tds_ssot/cloudbuilder/orchestration-services?figma=true
```

### Detail Pages

```
https://thakicloud.github.io/tds_ssot/cloudbuilder/network-agents/detail/agent-1?figma=true
https://thakicloud.github.io/tds_ssot/cloudbuilder/network-agents/detail/agent-1?figma=true&tab=basic-information
https://thakicloud.github.io/tds_ssot/cloudbuilder/network-agents/detail/agent-1?figma=true&tab=configuration
```

### Design/Showcase Pages

```
https://thakicloud.github.io/tds_ssot/design/cloudbuilder-modals?figma=true
```

## Component Naming Map

### Shell Components (handled by FigmaCaptureWrapper)

| Component | data-figma-name | Applied in          |
| --------- | --------------- | ------------------- |
| Sidebar   | `[TDS] Sidebar` | FigmaCaptureWrapper |
| TabBar    | `[TDS] TabBar`  | FigmaCaptureWrapper |
| TopBar    | `[TDS] TopBar`  | FigmaCaptureWrapper |

### List Page Components (CloudBuilderConsolePage)

| Component         | data-figma-name        | Notes                       |
| ----------------- | ---------------------- | --------------------------- |
| PageHeader (div)  | `[TDS] PageHeader`     | Custom div wrapper          |
| Create Button     | `[TDS] CreateButton`   | —                           |
| Tabs              | `[TDS] Tabs`           | —                           |
| TabList           | `[TDS] TabList`        | —                           |
| Tab (each)        | `[TDS] Tab-{tabId}`    | Dynamic                     |
| ListToolbar       | `[TDS] ListToolbar`    | —                           |
| SearchInput (div) | `[TDS] SearchInput`    | Wrapper div (no ...rest)    |
| Download Button   | `[TDS] DownloadButton` | aria-label stays "Download" |
| Delete Button     | `[TDS] DeleteButton`   | —                           |
| Pagination        | `[TDS] Pagination`     | —                           |
| Table             | `[TDS] Table`          | —                           |
| ConfirmModal      | `[TDS] ConfirmModal`   | —                           |
| Status Modal      | `[TDS] StatusModal`    | —                           |

### Detail Page Components (CloudBuilderDetailPage)

| Component             | data-figma-name                    | Notes                                        |
| --------------------- | ---------------------------------- | -------------------------------------------- |
| DetailHeader          | `[TDS] DetailHeader`               | —                                            |
| DetailHeader.Title    | `[TDS] DetailHeader.Title`         | —                                            |
| DetailHeader.Actions  | `[TDS] DetailHeader.Actions`       | —                                            |
| DetailHeader.InfoGrid | `[TDS] DetailHeader.InfoGrid`      | —                                            |
| InfoCard (each)       | `[TDS] InfoCard-{label}`           | e.g., InfoCard-ID, InfoCard-ServiceStatus    |
| Badge (contextual)    | `[TDS] Badge-{context}`            | e.g., Badge-ServiceState                     |
| Enable/Disable Button | `[TDS] EnableDisableButton`        | —                                            |
| CopyButton            | `[TDS] CopyButton`                 | —                                            |
| Tabs                  | `[TDS] Tabs`                       | —                                            |
| TabList               | `[TDS] TabList`                    | —                                            |
| Tab (each)            | `[TDS] Tab-{name}`                 | e.g., Tab-BasicInfo, Tab-Configuration       |
| TabPanel (each)       | `[TDS] TabPanel-{name}`            | e.g., TabPanel-Details, TabPanel-Disk        |
| SectionCard           | `[TDS] SectionCard-{name}`         | e.g., SectionCard-BasicInfo, SectionCard-BMC |
| SectionCard.Header    | `[TDS] SectionCard.Header-{name}`  | —                                            |
| SectionCard.Content   | `[TDS] SectionCard.Content-{name}` | —                                            |
| SectionCard.DataRow   | `[TDS] DataRow-{label}`            | e.g., DataRow-Host, DataRow-Type             |
| Table (disk)          | `[TDS] Table`                      | Inside disk tab                              |
| Status Modal          | `[TDS] StatusModal`                | —                                            |

### Modals Page Components (CloudBuilderModalsPage)

| Component        | data-figma-name                | Notes                                                             |
| ---------------- | ------------------------------ | ----------------------------------------------------------------- |
| Page Title (h1)  | `[TDS] PageTitle`              | —                                                                 |
| CategorySection  | `[TDS] Section-{name}`         | e.g., Section-ServiceStatus                                       |
| ModalPreview     | `[TDS] Modal-{action}{-state}` | e.g., Modal-EnableComputeService, Modal-DisableNetworkAgent-Empty |
| Button (Cancel)  | `[TDS] Button-Cancel`          | —                                                                 |
| Button (Enable)  | `[TDS] Button-Enable`          | —                                                                 |
| Button (Disable) | `[TDS] Button-Disable`         | —                                                                 |

## DS Components: ...rest Forwarding Support

### Already Modified (supports data-figma-name directly)

| Component    | File                                                         | Extends                                                          |
| ------------ | ------------------------------------------------------------ | ---------------------------------------------------------------- |
| Modal        | `src/design-system/components/Modal/Modal.tsx`               | `Omit<HTMLAttributes<HTMLDivElement>, 'title' \| 'children'>`    |
| ConfirmModal | `src/design-system/components/ConfirmModal/ConfirmModal.tsx` | Forwards via Modal                                               |
| ContextMenu  | `src/design-system/components/ContextMenu/ContextMenu.tsx`   | `Omit<HTMLAttributes<HTMLDivElement>, 'children'>`               |
| ProgressBar  | `src/design-system/components/ProgressBar/ProgressBar.tsx`   | `Omit<HTMLAttributes<HTMLDivElement>, 'children' \| 'color'>`    |
| TabList      | `src/design-system/components/Tabs/Tabs.tsx`                 | `Omit<HTMLAttributes<HTMLDivElement>, 'children'>`               |
| Tab          | `src/design-system/components/Tabs/Tabs.tsx`                 | `Omit<HTMLAttributes<HTMLButtonElement>, 'children' \| 'value'>` |
| TabPanel     | `src/design-system/components/Tabs/Tabs.tsx`                 | `Omit<HTMLAttributes<HTMLDivElement>, 'children'>`               |
| Tooltip      | `src/design-system/components/Tooltip/Tooltip.tsx`           | `Omit<HTMLAttributes<HTMLDivElement>, 'children' \| 'content'>`  |

### Already Support ...rest (no modification needed)

These components already forward `...rest` or `...props` to their root DOM element:

- Button
- Badge
- Input
- Textarea
- Select
- Checkbox
- Radio
- Toggle
- Slider
- Pagination
- Table
- SectionCard, SectionCard.Header, SectionCard.Content, SectionCard.DataRow
- DetailHeader, DetailHeader.Title, DetailHeader.Actions, DetailHeader.InfoGrid, DetailHeader.InfoCard
- Tabs
- ListToolbar
- InlineMessage
- Drawer

### Requires Wrapper div

These components do NOT forward arbitrary HTML attributes to their root DOM:

- SearchInput (forwards ...props to inner `<input>`, not wrapper)
- FilterSearchInput (same as SearchInput)
- PageHeader (renders its own structure)

Use a wrapper div for these:

```tsx
<div data-figma-name="[TDS] SearchInput" aria-label="[TDS] SearchInput">
  <SearchInput ... />
</div>
```

## Excluded Pages

The following CloudBuilder pages are excluded from Figma capture (per user decision):

- Discovery (`/cloudbuilder/discovery`)
- Servers (`/cloudbuilder/servers`)
- Switch (`/cloudbuilder/switch`)
- Servers 0.7 (`/cloudbuilder/severs0.7`)
