# AI Context for `@ThakiCloud/shared`

> Practical guide for AI/code agents working with this design system.

## Package Naming (Important)

- Published package name: `@ThakiCloud/shared`
- Recommended app import alias: `@thaki/shared`
- Do **not** use `@thakicloud/shared` (wrong package id)
- Installation, GitHub Packages auth, and release workflow are documented in
  `README.md`.

## Quick Start

```tsx
import {
  Button,
  FormField,
  Input,
  Dropdown,
  Table,
  Tabs,
  Tab,
  Typography,
  Overlay,
} from '@thaki/shared';

// Required once at app entry
import '@thaki/shared/index.css';
```

## Style Entry Points

```tsx
import '@thaki/shared/index.css';       // core + tailwind utilities
import '@thaki/shared/core.css';        // core only (no tailwind utilities)
import '@thaki/shared/tokens-only.css'; // CSS variables only
```

- `core.css` is **not** an alias of `index.css`.
- Dark theme is enabled by `<html data-theme="dark">`.

## Working Rules

- Prefer component props + CVA variants over ad-hoc styling.
- Prefer design tokens (`--component-*`, `--semantic-*`, `--primitive-*`).
- Avoid hardcoded hex colors and arbitrary spacing in new code.
- Use `cn()` for class merging.

```tsx
import { cn } from '@thaki/shared';

<Button className={cn('w-full', className)}>Save</Button>
```

## Verified Usage Patterns

### Button + Badge

```tsx
<Button variant="primary" appearance="solid" size="md">Save</Button>
<Button variant="error" appearance="outline">Delete</Button>
<Button variant="muted" appearance="ghost" size="sm">More</Button>

<Badge theme="gre" type="solid">Active</Badge>
<Badge theme="red" type="subtle">Failed</Badge>
```

- Button variants: `primary | secondary | tertiary | success | error | warning | muted`
- Badge themes: `gre | blu | ylw | red | gry` (abbreviated)

### Form Controls

```tsx
<FormField label="Email" required error={emailError}>
  <Input
    type="email"
    error={Boolean(emailError)}
    value={email}
    onChange={e => setEmail(e.target.value)}
  />
</FormField>

<FormField label="Region" hint="Select one">
  <Dropdown.Select
    value={region}
    onChange={value => setRegion(String(value))}
    placeholder="Select region"
  >
    <Dropdown.Option value="kr" label="Korea" />
    <Dropdown.Option value="us" label="United States" />
  </Dropdown.Select>
</FormField>
```

### Layout + Typography

```tsx
<Layout.Container maxWidth="lg" padding="md">
  <Layout.VStack gap="lg">
    <Layout.HStack justify="between" align="center">
      <Typography.Title level={1}>Resources</Typography.Title>
      <Button variant="primary">Create</Button>
    </Layout.HStack>

    <Typography.Text color="text-muted" variant="caption">
      Last sync: just now
    </Typography.Text>
  </Layout.VStack>
</Layout.Container>
```

- `Typography.Text` variants: `paragraph | detail | caption`
- Typography colors include: `primary | secondary | text | text-muted | error | warning | info | success`

### Table (default body rendering)

```tsx
import type { TableColumn, SortOrder } from '@thaki/shared';

type Row = {
  name: string;
  status: string;
  createdAt: string;
};

const columns: TableColumn[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'status', header: 'Status' },
  { key: 'createdAt', header: 'Created', sortable: true },
];

const [sort, setSort] = useState<string>('createdAt');
const [order, setOrder] = useState<SortOrder>('desc');

<Table
  columns={columns}
  rows={rows as Row[]}
  sort={sort}
  order={order}
  onSortChange={(nextSort, nextOrder) => {
    setSort(nextSort ?? 'createdAt');
    setOrder(nextOrder);
  }}
/>;
```

### Tabs

```tsx
<Tabs defaultActiveTabId="overview">
  <Tab id="overview" label="Overview">Overview content</Tab>
  <Tab id="settings" label="Settings">Settings content</Tab>
</Tabs>

<Tabs activeTabId={activeTab} onChange={setActiveTab} variant="button" size="sm">
  <Tab id="all" label="All">All</Tab>
  <Tab id="active" label="Active">Active</Tab>
</Tabs>
```

### Overlay

```tsx
<Overlay.Template
  type="modal"
  title="Confirm Delete"
  description="This action cannot be undone."
  appeared={isOpen}
  onConfirm={handleDelete}
  onCancel={handleClose}
  confirmUI="Delete"
  cancelUI="Cancel"
  isLoading={isDeleting}
  confirmDisabled={!canDelete}
/>
```

### Accordion + Status + Progress

```tsx
<Accordion.Group type="multiple" defaultValue={['a']}>
  <Accordion.Item id="a" header="Section A">Content A</Accordion.Item>
  <Accordion.Item id="b" header="Section B">Content B</Accordion.Item>
</Accordion.Group>

<StatusIndicator variant="active" label="Active" />
<StatusIndicator colorScheme="warning" label="Pending" />

<ProgressBar value={60} pendingValue={20} max={100} variant="warning" showValue="percentage" />
```

## Toast Notifications

`toast` is from `sonner`, not from `@thaki/shared`.

```tsx
import { toast } from 'sonner';
import { Toast } from '@thaki/shared';

toast.custom(id => (
  <Toast
    type="positive"
    message="Changes saved successfully"
    description="All settings were updated"
    timestamp={Date.now()}
    handleDismiss={() => toast.dismiss(id)}
  />
));
```

`Toast` key props:
- `type`: `'positive' | 'negative'`
- `message`: required
- `description?`, `resourceName?`, `timestamp?`, `appIcon?`, `onNavigate?`
- `handleDismiss`: required

## Hooks (Current API)

```tsx
import { useOverlay, useFilterSearch } from '@thaki/shared';

const { openOverlay, closeOverlayById, overlayStore } = useOverlay();

const { filters, appliedFilters, addFilter, removeFilter, clearFilters } =
  useFilterSearch(nextFilters => {
    console.log(nextFilters);
  });
```

Notes:
- `useOverlay()` does **not** return `{ open, close, isOpen }`.
- `useFilterSearch()` takes an optional callback, not a `filterKeys` config.

## Providers (Current API)

```tsx
import { Toaster } from 'sonner';
import {
  ThemeProvider,
  ToastProvider,
  LocaleProvider,
  OverlayProvider,
  createOverlayStore,
  createTabProvider,
} from '@thaki/shared';

const overlayStore = createOverlayStore();

const { TabProvider } = createTabProvider({
  routes,
  defaultRoute: '/',
  defaultTitle: 'Home',
});

<ThemeProvider>
  <ToastProvider Toaster={Toaster}>
    <LocaleProvider changeLocale={i18n.changeLanguage}>
      <OverlayProvider overlayStore={overlayStore}>
        <TabProvider>
          <App />
        </TabProvider>
      </OverlayProvider>
    </LocaleProvider>
  </ToastProvider>
</ThemeProvider>;
```

Provider caveats:
- `ToastProvider` requires `Toaster` prop.
- `LocaleProvider` requires `changeLocale` callback.
- `OverlayProvider` requires `overlayStore`.
- `TabProvider` comes from `createTabProvider(...)`.

## Common Mistakes to Avoid

- Wrong package import: `@thakicloud/shared`
- Assuming `toast` is exported from this package
- Using `Typography.Text color="muted"` instead of `color="text-muted"`
- Passing `getRowId` to `Table` (it belongs to `SelectableTable`)
- Using outdated hook/provider signatures from old docs
