# TDS → shared-v2 컴포넌트 API 매핑 가이드

> 이 문서는 TDS(THAKI Design System) 페이지를 thaki-shared-v2 컴포넌트로 번역할 때 사용하는 1:1 매핑 레퍼런스입니다.

---

## 1. Layout / Shell

### PageShell → AppLayout (또는 개별 조합)

AppLayout은 config 기반으로 sidebar, tabBar, toolBar, routing을 통합 관리합니다.
Preview 앱처럼 React Router를 사용하는 경우, 개별 컴포넌트를 조합하여 동일한 구조를 만듭니다.

```tsx
// TDS
<PageShell
  sidebar={<IAMSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
  sidebarWidth={sidebarOpen ? 200 : 0}
  tabBar={<TabBar tabs={tabs} activeTab={activeTabId} onTabChange={selectTab} onTabClose={closeTab} onTabAdd={addNewTab} onTabReorder={moveTab} />}
  topBar={<TopBar breadcrumb={<Breadcrumb items={[...]} />} ... />}
>
  {children}
</PageShell>

// shared-v2 (개별 조합)
<div className="flex h-screen w-screen overflow-hidden bg-surface">
  {sidebarOpen && (
    <Sidebar isCollapsed={false}>
      {/* 메뉴 내용 */}
    </Sidebar>
  )}
  <div className="flex flex-col flex-1 min-w-0 h-full">
    <AppHeaderTab tabs={tabs} activeTab={activeTabId} ... />
    <ToolBar breadcrumbItems={breadcrumbItems} navigation={navConfig} ... />
    <main className="flex-1 overflow-y-auto pt-4 px-8 pb-20">
      {children}
    </main>
  </div>
</div>
```

### TabBar

```tsx
// TDS
<TabBar
  tabs={tabs.map(t => ({ id: t.id, label: t.label, closable: t.closable }))}
  activeTab={activeTabId}
  onTabChange={selectTab}
  onTabClose={closeTab}
  onTabAdd={addNewTab}
  onTabReorder={moveTab}
/>

// shared-v2
<TabBar
  tabs={tabs.map(t => ({ id: t.id, title: t.label, fixed: !t.closable }))}
  activeTab={activeTabId}
  onTabClick={selectTab}
  onTabClose={closeTab}
  onAddTab={addNewTab}
  onTabReorder={(from, to) => moveTab(from, to)}
/>
```

| TDS prop      | shared-v2 prop | 비고           |
| ------------- | -------------- | -------------- |
| `label`       | `title`        | TabItem 필드명 |
| `closable`    | `!fixed`       | 반전           |
| `onTabChange` | `onTabClick`   |                |
| `onTabAdd`    | `onAddTab`     |                |

### TopBar → ToolBar

```tsx
// TDS
<TopBar
  showSidebarToggle={!sidebarOpen}
  onSidebarToggle={openSidebar}
  showNavigation={true}
  onBack={() => window.history.back()}
  onForward={() => window.history.forward()}
  breadcrumb={<Breadcrumb items={[{ label: 'IAM', href: '/iam' }, { label: 'Users' }]} />}
  actions={<TopBarAction icon={<IconBell size={16} stroke={1.5} />} />}
/>

// shared-v2
<ToolBar
  isSidebarOpen={sidebarOpen}
  onToggleSidebar={toggleSidebar}
  breadcrumbItems={[{ label: 'IAM', path: '/iam' }, { label: 'Users' }]}
  navigation={{ canGoBack: true, canGoForward: true, onGoBack: () => window.history.back(), onGoForward: () => window.history.forward() }}
  rightActions={<button aria-label="Notifications"><IconBell size={16} stroke={1.5} /></button>}
/>
```

| TDS prop                              | shared-v2 prop           | 비고                                   |
| ------------------------------------- | ------------------------ | -------------------------------------- |
| `showSidebarToggle`                   | `!isSidebarOpen`         | 반전 로직                              |
| `breadcrumb` (ReactNode)              | `breadcrumbItems` (배열) | Breadcrumb 직접 전달 → items 배열 전달 |
| `actions`                             | `rightActions`           |                                        |
| `showNavigation` + `onBack/onForward` | `navigation` (객체)      | NavigationConfig 구조                  |

### Breadcrumb

```tsx
// TDS
<Breadcrumb items={[{ label: 'IAM', href: '/iam' }, { label: 'Users' }]} />

// shared-v2
<Breadcrumb items={[{ label: 'IAM', path: '/iam' }, { label: 'Users' }]} />
```

| TDS    | shared-v2 | 비고          |
| ------ | --------- | ------------- |
| `href` | `path`    | 필드명만 다름 |

### Sidebar

shared-v2 Sidebar는 얇은 wrapper입니다. 메뉴 내용은 `children`으로 직접 구성합니다.

```tsx
// TDS
<IAMSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
// → 내부에서 MenuItem, MenuSection 사용

// shared-v2
<Sidebar isCollapsed={!sidebarOpen}>
  <Layout.VStack gap="md">
    <SidebarMenuItem icon={<IconHome size={16} />} label="Home" href="/iam" active={isActive('/iam')} />
    <MenuSection title="Access management">
      <SidebarMenuItem icon={<IconUsers size={16} />} label="Users" href="/iam/users" active={isActive('/iam/users')} />
      ...
    </MenuSection>
  </Layout.VStack>
</Sidebar>
```

| TDS                         | shared-v2                | 비고      |
| --------------------------- | ------------------------ | --------- |
| `isOpen`                    | `!isCollapsed`           | 반전      |
| `MenuItem` (DS 컴포넌트)    | 커스텀 `SidebarMenuItem` | 직접 구현 |
| `MenuSection` (DS 컴포넌트) | 커스텀 `MenuSection`     | 직접 구현 |
| `AppSwitcher`               | 헤더 영역 직접 구현      |           |

---

## 2. Page Components

### PageHeader → Title + flex layout

```tsx
// TDS
<PageHeader
  title="Users"
  actions={<Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>Create user</Button>}
/>

// shared-v2
<div className="flex items-center justify-between h-8">
  <Title title="Users" />
  <Button variant="primary" size="md">
    <IconPlus size={12} /> Create user
  </Button>
</div>
```

### DetailHeader → DetailPageHeader

```tsx
// TDS
<DetailHeader>
  <DetailHeader.Title>{name}</DetailHeader.Title>
  <DetailHeader.Actions>
    <Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>Edit</Button>
  </DetailHeader.Actions>
  <DetailHeader.InfoGrid>
    <DetailHeader.InfoCard label="Status" status="active" />
    <DetailHeader.InfoCard label="ID" value={id} copyable />
  </DetailHeader.InfoGrid>
</DetailHeader>

// shared-v2
<DetailPageHeader
  title={name}
  actions={
    <div className="flex items-center gap-1">
      <Button variant="secondary" appearance="outline" size="sm">
        <IconEdit size={12} stroke={1.5} /> Edit
      </Button>
    </div>
  }
  infoFields={[
    { label: 'Status', value: '', type: 'component', component: <StatusIndicator variant="active" /> },
    { label: 'ID', value: id },
  ]}
/>
```

| TDS                                           | shared-v2                               | 비고 |
| --------------------------------------------- | --------------------------------------- | ---- |
| compound (Title, Actions, InfoGrid, InfoCard) | flat props (title, actions, infoFields) |      |
| `InfoCard.status`                             | `type: 'component'` + StatusIndicator   |      |
| `InfoCard.copyable`                           | 미지원 (CopyButton 직접 추가)           |      |

### SectionCard → DetailCard

```tsx
// TDS
<SectionCard>
  <SectionCard.Header title="Basic Information" actions={<Button>Edit</Button>} />
  <SectionCard.Content>
    <SectionCard.DataRow label="Name" value="instance-01" />
    <SectionCard.DataRow label="Status">
      <StatusIndicator status="active" label="Active" />
    </SectionCard.DataRow>
  </SectionCard.Content>
</SectionCard>

// shared-v2
<DetailCard
  title="Basic Information"
  actions={<Button>Edit</Button>}
  fields={[
    { label: 'Name', value: 'instance-01' },
    { label: 'Status', type: 'component', component: <StatusIndicator variant="active" label="Active" /> },
  ]}
/>
```

| TDS                                 | shared-v2                                     | 비고 |
| ----------------------------------- | --------------------------------------------- | ---- |
| compound (Header, Content, DataRow) | `fields` 배열                                 |      |
| `DataRow.value`                     | `field.value`                                 |      |
| `DataRow.children`                  | `field.type: 'component'` + `field.component` |      |

---

## 3. Form Controls

### Button

```tsx
// TDS
<Button variant="primary" size="md" leftIcon={<IconPlus size={12} />}>Create</Button>
<Button variant="secondary" size="sm" icon={<IconDownload size={12} />} aria-label="Download" />
<Button variant="danger" size="md">Delete</Button>

// shared-v2
<Button variant="primary" size="md"><IconPlus size={12} /> Create</Button>
<Button variant="muted" appearance="ghost" size="sm" aria-label="Download"><IconDownload size={12} /></Button>
<Button variant="error" size="md">Delete</Button>
```

| TDS variant | shared-v2 variant + appearance             | 비고                           |
| ----------- | ------------------------------------------ | ------------------------------ |
| `primary`   | `variant="primary"`                        |                                |
| `secondary` | `variant="secondary" appearance="outline"` | TDS secondary = outline 스타일 |
| `muted`     | `variant="muted"`                          |                                |
| `ghost`     | `appearance="ghost"`                       | variant와 조합                 |
| `danger`    | `variant="error"`                          |                                |
| `warning`   | `variant="warning"`                        |                                |
| `link`      | 미지원                                     | `<a>` 태그 직접 사용           |

| TDS prop           | shared-v2                   | 비고             |
| ------------------ | --------------------------- | ---------------- |
| `leftIcon`         | children에 아이콘 직접 배치 | `<IconX /> Text` |
| `rightIcon`        | children에 아이콘 직접 배치 | `Text <IconX />` |
| `icon` (icon-only) | children에 아이콘만 배치    | 자동 감지        |

### FilterSearchInput

```tsx
// TDS
<FilterSearchInput
  filters={[
    { id: 'name', label: 'Name', type: 'text', placeholder: 'Enter name...' },
    { id: 'status', label: 'Status', type: 'select', options: [...] },
  ]}
  appliedFilters={appliedFilters}
  onFiltersChange={setAppliedFilters}
  placeholder="Search by attributes"
  size="sm"
  className="w-[var(--search-input-width)]"
  hideAppliedFilters
/>

// shared-v2
<FilterSearchInput
  filterKeys={[
    { key: 'name', label: 'Name', type: 'input', placeholder: 'Enter name...' },
    { key: 'status', label: 'Status', type: 'select', options: [...] },
  ]}
  onFilterAdd={(filter) => setAppliedFilters(prev => [...prev, filter])}
  selectedFilters={appliedFilters}
  placeholder="Search by attributes"
/>
```

| TDS                           | shared-v2                 | 비고        |
| ----------------------------- | ------------------------- | ----------- |
| `filters`                     | `filterKeys`              |             |
| `FilterField.id`              | `FilterKey.key`           |             |
| `FilterField.type: 'text'`    | `FilterKey.type: 'input'` |             |
| `appliedFilters`              | `selectedFilters`         |             |
| `onFiltersChange` (전체 배열) | `onFilterAdd` (단일 필터) | 추가만 콜백 |
| `size`                        | 미지원                    | 고정 크기   |
| `hideAppliedFilters`          | 미지원                    |             |

### Input

```tsx
// TDS
<Input placeholder="Enter name" fullWidth error />

// shared-v2
<Input placeholder="Enter name" error />
// fullWidth → 부모 div로 w-full 제어
```

### FormField

```tsx
// TDS
<FormField label="Name" helperText="2-64 characters" required error={!!nameError}>
  <Input fullWidth />
  {nameError && <FormField.ErrorMessage>{nameError}</FormField.ErrorMessage>}
</FormField>

// shared-v2
<FormField label="Name" hint="2-64 characters" required error={nameError || undefined}>
  <Input />
</FormField>
```

| TDS                                       | shared-v2        | 비고                                 |
| ----------------------------------------- | ---------------- | ------------------------------------ |
| `helperText`                              | `hint`           |                                      |
| `errorMessage` / `FormField.ErrorMessage` | `error` (string) | 에러 메시지를 error prop에 직접 전달 |
| `description`                             | `description`    | 동일                                 |
| `spacing="loose"`                         | 미지원           | 수동 간격 조절                       |

### Toggle

```tsx
// TDS
<Toggle checked={enabled} onChange={setEnabled} />

// shared-v2
<Toggle checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
```

| TDS                 | shared-v2               | 비고                                   |
| ------------------- | ----------------------- | -------------------------------------- |
| `onChange(boolean)` | `onChange(ChangeEvent)` | 이벤트 객체에서 `.target.checked` 추출 |

---

## 4. Data Display

### Table

```tsx
// TDS (선언적)
<Table
  columns={columns}
  data={paginatedData}
  rowKey="id"
  selectable
  selectedKeys={selectedItems}
  onSelectionChange={setSelectedItems}
/>

// shared-v2 (compound)
<SelectableTable
  columns={columns}
  rows={paginatedData}
  selectionType="checkbox"
  selectedRows={selectedItems}
  onRowSelectionChange={setSelectedItems}
  getRowId={(row) => row.id}
  sort={sort}
  order={order}
  onSortChange={handleSortChange}
>
  {paginatedData.map(row => (
    <Table.Tr key={row.id} rowData={row}>
      <Table.Td rowData={row} column={columns[0]}>{row.name}</Table.Td>
      ...
    </Table.Tr>
  ))}
</SelectableTable>
```

| TDS                 | shared-v2                  | 비고                  |
| ------------------- | -------------------------- | --------------------- |
| `data`              | `rows`                     |                       |
| `rowKey`            | `getRowId`                 | 함수                  |
| `selectable`        | `selectionType="checkbox"` |                       |
| `selectedKeys`      | `selectedRows`             |                       |
| `onSelectionChange` | `onRowSelectionChange`     |                       |
| `columns[].render`  | `Table.Td` children        | 수동 렌더링           |
| `columns[].label`   | `columns[].header`         |                       |
| `columns[].flex`    | `columns[].width`          | flex → 고정 or 미지정 |

### Pagination

```tsx
// TDS
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  totalItems={filteredItems.length}
  selectedCount={selectedItems.length}
  showSettings
/>

// shared-v2
<Pagination
  currentAt={currentPage}
  totalCount={filteredItems.length}
  size={itemsPerPage}
  onPageChange={setCurrentPage}
  totalCountLabel="items"
/>
```

| TDS             | shared-v2        | 비고              |
| --------------- | ---------------- | ----------------- |
| `currentPage`   | `currentAt`      |                   |
| `totalPages`    | (자동 계산)      | totalCount / size |
| `totalItems`    | `totalCount`     |                   |
| `onPageChange`  | `onPageChange`   | 동일              |
| `selectedCount` | 미지원           |                   |
| `showSettings`  | `onSettingClick` | 콜백으로 제어     |

### StatusIndicator

```tsx
// TDS
<StatusIndicator status="active" label="Active" />
<StatusIndicator status="error" label="Error" layout="icon-only" />

// shared-v2
<StatusIndicator variant="active" label="Active" />
<StatusIndicator variant="error" label="Error" layout="iconOnly" />
```

| TDS                  | shared-v2           | 비고        |
| -------------------- | ------------------- | ----------- |
| `status`             | `variant`           |             |
| `layout="icon-only"` | `layout="iconOnly"` | 케이스 차이 |

### Badge → Badge (동일)

```tsx
// TDS
<Badge variant="info" size="sm">12</Badge>

// shared-v2
<Badge theme="info" size="sm">12</Badge>
```

| TDS       | shared-v2 | 비고 |
| --------- | --------- | ---- |
| `variant` | `theme`   |      |

### EmptyState → EmptyUI

```tsx
// TDS
<EmptyState
  icon={<IconDatabase size={48} stroke={1} />}
  title="No results found"
  description="Try adjusting your search."
  action={<Button>Create</Button>}
/>

// shared-v2
<EmptyUI
  content={{ title: 'No results found', description: 'Try adjusting your search.' }}
>
  <Button>Create</Button>
</EmptyUI>
```

---

## 5. Overlay / Feedback

### Tabs

```tsx
// TDS
<Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm">
  <TabList>
    <Tab value="details">Details</Tab>
    <Tab value="volumes">Volumes</Tab>
  </TabList>
  <TabPanel value="details" className="pt-0">
    <div className="pt-4">...</div>
  </TabPanel>
</Tabs>

// shared-v2
<Tabs activeTabId={activeTab} onChange={setActiveTab} variant="line" size="sm">
  <Tab id="details" label="Details">
    <div className="pt-4">...</div>
  </Tab>
  <Tab id="volumes" label="Volumes">
    ...
  </Tab>
</Tabs>
```

| TDS                            | shared-v2                     | 비고            |
| ------------------------------ | ----------------------------- | --------------- |
| `value`                        | `activeTabId`                 |                 |
| `variant="underline"`          | `variant="line"`              |                 |
| `TabList` + `Tab` + `TabPanel` | `Tab` (id + label + children) | compound → 단일 |
| `Tab.value`                    | `Tab.id`                      |                 |
| `Tab.children` (label)         | `Tab.label`                   |                 |
| `TabPanel.children`            | `Tab.children`                |                 |

### ContextMenu

```tsx
// TDS (items 배열)
const menuItems: ContextMenuItem[] = [
  { id: 'edit', label: 'Edit', onClick: () => handleEdit(row) },
  { id: 'delete', label: 'Delete', status: 'danger', divider: true, onClick: () => handleDelete(row) },
];
<ContextMenu items={menuItems} trigger="click" align="right">
  <Button variant="secondary" size="sm"><IconAction size={16} /></Button>
</ContextMenu>

// shared-v2 (compound)
<ContextMenu.Root
  trigger={({ toggle }) => (
    <button type="button" onClick={toggle} className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-surface-muted">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="8" cy="3" r="1" fill="currentColor" />
        <circle cx="8" cy="8" r="1" fill="currentColor" />
        <circle cx="8" cy="13" r="1" fill="currentColor" />
      </svg>
    </button>
  )}
>
  <ContextMenu.Item action={() => handleEdit(row)}>Edit</ContextMenu.Item>
  <ContextMenu.Item action={() => handleDelete(row)} danger>Delete</ContextMenu.Item>
</ContextMenu.Root>
```

| TDS                          | shared-v2                               | 비고          |
| ---------------------------- | --------------------------------------- | ------------- |
| `items` 배열                 | `ContextMenu.Root` + `ContextMenu.Item` | compound 패턴 |
| `item.onClick`               | `ContextMenu.Item action`               |               |
| `item.status: 'danger'`      | `ContextMenu.Item danger`               | boolean prop  |
| `item.divider: true`         | 미지원 (CSS로 처리)                     |               |
| `item.disabled`              | `ContextMenu.Item disabled`             |               |
| `trigger="click"` (children) | `trigger` render prop                   |               |

### Drawer → Overlay.Template

```tsx
// TDS
<Drawer
  isOpen={isOpen}
  onClose={handleClose}
  title="Edit"
  width={360}
  footer={<HStack>...</HStack>}
>
  <VStack gap={6}>{/* 내용 */}</VStack>
</Drawer>;

// shared-v2
{
  mounted && (
    <Overlay.Template
      type="drawer-horizontal"
      size="sm"
      title="Edit"
      isGlobal
      appeared={appeared}
      onConfirm={handleSubmit}
      onCancel={handleClose}
      confirmUI="Save"
      cancelUI="Cancel"
    >
      <div className="flex flex-col gap-6">{/* 내용 */}</div>
    </Overlay.Template>
  );
}
```

| TDS                  | shared-v2                                                | 비고                   |
| -------------------- | -------------------------------------------------------- | ---------------------- |
| `isOpen`             | `mounted` + `appeared` (useDrawerAnimation)              | 마운트/애니메이션 분리 |
| `onClose`            | `onCancel`                                               |                        |
| `width`              | `size` ("sm"/"md"/"lg")                                  |                        |
| `footer` (ReactNode) | `confirmUI`/`cancelUI` (string) + `onConfirm`/`onCancel` | 미리 정의된 footer     |
| `VStack`             | `div.flex.flex-col`                                      |                        |

### InfoBox → InfoContainer

```tsx
// TDS
<InfoBox label="Username" value="thaki-kim" />

// shared-v2
<InfoContainer label="Username" values={['thaki-kim']} />
```

| TDS                    | shared-v2           | 비고                 |
| ---------------------- | ------------------- | -------------------- |
| `value` (string)       | `values` (string[]) | 배열                 |
| `children` (ReactNode) | 미지원              | values 배열로만 표시 |

---

## 6. 패턴 가이드 (컴포넌트화하지 않는 것들)

### ListToolbar 패턴

```tsx
<div className="flex items-center gap-2">
  <FilterSearchInput
    filterKeys={filterFields}
    onFilterAdd={handleFilterAdd}
    selectedFilters={appliedFilters}
    placeholder="Search by attributes"
  />
  <div className="w-px h-4 bg-border" />
  <Button variant="muted" appearance="ghost" size="sm" aria-label="Download">
    <IconDownload size={12} />
  </Button>
  <Button
    variant="muted"
    appearance="ghost"
    size="sm"
    aria-label="Delete"
    disabled={selectedRows.length === 0}
  >
    <IconTrash size={12} />
  </Button>
</div>
```

### SelectionIndicator 패턴

```tsx
<div
  className={`flex flex-wrap items-center gap-1 min-h-[32px] p-2 rounded-md border ${
    hasError ? 'border-danger bg-danger-light' : 'border-border bg-surface-muted'
  }`}
>
  {selectedItems.length === 0 ? (
    <span className="text-11 text-text-muted">No items selected</span>
  ) : (
    selectedItems.map((item) => (
      <Tag
        key={item.id}
        label={item.name}
        variant="multiSelect"
        onClose={() => handleRemove(item.id)}
      />
    ))
  )}
</div>
```

### PageHeader 패턴

```tsx
<div className="flex items-center justify-between h-8">
  <Title title="Users" />
  <Button variant="primary" size="md">
    <IconPlus size={12} /> Create user
  </Button>
</div>
```
