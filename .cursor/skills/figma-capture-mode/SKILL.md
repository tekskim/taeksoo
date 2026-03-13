---
name: figma-capture-mode
description: >-
  Add Figma capture mode to TDS pages for HTML to Design plugin compatibility.
  Use when the user says "figma capture", "figma naming", "add figma mode",
  "[TDS] prefix", "data-figma-name", or wants to make a page capturable by the
  Figma HTML to Design plugin with meaningful layer names.
---

# Figma Capture Mode

Adds `?figma=true` capture mode to TDS pages so the HTML to Design Figma plugin
produces meaningful layer names instead of generic `div`/`span`.

## Why FigmaCaptureWrapper?

`PageShell` uses `fixed`/`absolute` positioning and `overflow: hidden`, which
prevents the Figma plugin from reading `data-figma-name` attributes.
`FigmaCaptureWrapper` replaces this with standard flexbox layout while keeping
the same visual structure.

## Workflow

### Step 1: Add imports and figma detection

```tsx
import { FigmaCaptureWrapper } from '@/components/FigmaCaptureWrapper';

// Inside component body (top-level, before any hooks that depend on it)
const [isFigmaCapture] = useState(
  () => new URLSearchParams(window.location.search).get('figma') === 'true'
);
```

### Step 2: Add `[TDS]` naming to every TDS component

Add both `data-figma-name` and `aria-label` as a pair:

```tsx
// Static value
<Table
  data-figma-name="[TDS] Table"
  aria-label="[TDS] Table"
  columns={columns}
  data={data}
/>

// Contextual value (component + context)
<DetailHeader.InfoCard
  label="Status"
  data-figma-name="[TDS] InfoCard-Status"
  aria-label="[TDS] InfoCard-Status"
/>

// Dynamic value (template literal)
<Tab
  value={t.id}
  data-figma-name={`[TDS] Tab-${t.id}`}
  aria-label={`[TDS] Tab-${t.label}`}
/>
```

**Naming format**: `[TDS] ComponentName` or `[TDS] ComponentName-Context`

Examples: `[TDS] PageHeader`, `[TDS] DataRow-Host`, `[TDS] SectionCard-BasicInfo`,
`[TDS] Modal-EnableComputeService`, `[TDS] Button-Cancel`

### Step 3: Conditional rendering

Extract shell elements and content, then branch on `isFigmaCapture`:

```tsx
const shellSidebar = <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />;
const shellSidebarWidth = sidebarOpen ? 200 : 0;
const shellTabBar = <TabBar tabs={...} ... />;
const shellTopBar = <TopBar ... />;

const pageContent = (
  <VStack gap={3}>
    {/* Named components here */}
  </VStack>
);

if (isFigmaCapture) {
  return (
    <FigmaCaptureWrapper
      sidebar={shellSidebar}
      sidebarWidth={shellSidebarWidth}
      tabBar={shellTabBar}
      topBar={shellTopBar}
      contentClassName="pt-4 px-8 pb-6"
    >
      {pageContent}
    </FigmaCaptureWrapper>
  );
}

return (
  <PageShell
    sidebar={shellSidebar}
    sidebarWidth={shellSidebarWidth}
    tabBar={shellTabBar}
    topBar={shellTopBar}
    contentClassName="pt-4 px-8 pb-6"
  >
    {pageContent}
  </PageShell>
);
```

### Step 4: Build and deploy

```bash
npm run build && git add -A && git commit -m "feat: add Figma capture mode to <page>" && git push origin main
```

## Naming Rules

| Rule                          | Detail                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| Prefix                        | Always `[TDS] ` (with trailing space)                                                |
| Pair                          | `data-figma-name` and `aria-label` always together                                   |
| Accessibility-only labels     | Do NOT prefix: `aria-label="Download"`, `"Notifications"`, `"Row actions"`           |
| Wrapper div                   | Use when DS component does not support `...rest` forwarding                          |
| Components supporting ...rest | Modal, ConfirmModal, ContextMenu, ProgressBar, Tabs, TabList, Tab, TabPanel, Tooltip |

## What to Name

| Component                 | Name pattern                                | Example                        |
| ------------------------- | ------------------------------------------- | ------------------------------ |
| PageHeader (custom div)   | `[TDS] PageHeader`                          | —                              |
| Button (action)           | `[TDS] CreateButton`, `[TDS] Button-Cancel` | —                              |
| Tabs                      | `[TDS] Tabs`                                | —                              |
| TabList                   | `[TDS] TabList`                             | —                              |
| Tab                       | `[TDS] Tab-{id}`                            | `[TDS] Tab-BasicInfo`          |
| TabPanel                  | `[TDS] TabPanel-{id}`                       | `[TDS] TabPanel-Configuration` |
| ListToolbar               | `[TDS] ListToolbar`                         | —                              |
| SearchInput (wrapper div) | `[TDS] SearchInput`                         | —                              |
| Pagination                | `[TDS] Pagination`                          | —                              |
| Table                     | `[TDS] Table`                               | —                              |
| DetailHeader              | `[TDS] DetailHeader`                        | —                              |
| DetailHeader.Title        | `[TDS] DetailHeader.Title`                  | —                              |
| DetailHeader.Actions      | `[TDS] DetailHeader.Actions`                | —                              |
| DetailHeader.InfoGrid     | `[TDS] DetailHeader.InfoGrid`               | —                              |
| DetailHeader.InfoCard     | `[TDS] InfoCard-{label}`                    | `[TDS] InfoCard-ID`            |
| SectionCard               | `[TDS] SectionCard-{context}`               | `[TDS] SectionCard-BasicInfo`  |
| SectionCard.Header        | `[TDS] SectionCard.Header-{context}`        | —                              |
| SectionCard.Content       | `[TDS] SectionCard.Content-{context}`       | —                              |
| SectionCard.DataRow       | `[TDS] DataRow-{label}`                     | `[TDS] DataRow-Host`           |
| Modal                     | `[TDS] StatusModal`                         | —                              |
| ConfirmModal              | `[TDS] ConfirmModal`                        | —                              |
| Badge (contextual)        | `[TDS] Badge-{context}`                     | `[TDS] Badge-ServiceState`     |

## DS Component ...rest Forwarding

If a DS component does NOT support `...rest`, wrap it:

```tsx
// Wrap with a div
<div data-figma-name="[TDS] SearchInput" aria-label="[TDS] SearchInput">
  <SearchInput ... />
</div>
```

To add `...rest` support to a DS component, extend its props interface:

```tsx
// Before
interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
}

// After
interface ModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  isOpen: boolean;
  title: string;
  children: ReactNode;
}

// Destructure ...rest and spread on root element
function Modal({ isOpen, title, children, ...rest }: ModalProps) {
  return (
    <div {...rest} role="dialog">
      ...
    </div>
  );
}
```

## Pages Without Sidebar

For design/showcase pages that have no sidebar (e.g., cloudbuilder-modals):

```tsx
if (isFigmaCapture) {
  return (
    <FigmaCaptureWrapper topBar={shellTopBar} contentClassName="pt-4 px-8 pb-20">
      {content}
    </FigmaCaptureWrapper>
  );
}
```

## Additional Resources

- Component naming map and URL list: [reference.md](reference.md)
- FigmaCaptureWrapper source: `src/components/FigmaCaptureWrapper.tsx`
- Existing examples: `src/pages/cloudbuilder/CloudBuilderConsolePage.tsx`,
  `src/pages/cloudbuilder/CloudBuilderDetailPage.tsx`,
  `src/pages/CloudBuilderModalsPage.tsx`
