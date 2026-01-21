# TDS (THAKI Design System)

<p align="center">
  <strong>A comprehensive React component library for building consistent, accessible, and beautiful user interfaces.</strong>
</p>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#components">Components</a> •
  <a href="#design-tokens">Design Tokens</a> •
  <a href="#development">Development</a>
</p>

---

## Features

- 🎨 **50+ Components** - Form controls, data display, navigation, feedback, and more
- 🌙 **Dark Mode** - Built-in dark mode support with CSS variables
- ♿ **Accessible** - WCAG 2.1 AA compliant with proper ARIA attributes
- 📱 **Responsive** - Mobile-first design with Tailwind CSS
- 🧪 **Well Tested** - Comprehensive unit and accessibility tests
- 📖 **Documented** - Interactive Storybook documentation
- 🔧 **TypeScript** - Full TypeScript support with exported types

## Installation

```bash
npm install @thaki/tds
# or
yarn add @thaki/tds
# or
pnpm add @thaki/tds
```

## Quick Start

1. Import the styles in your app's entry point:

```tsx
import '@thaki/tds/styles';
```

2. Use the components:

```tsx
import { Button, Input, Select, Modal } from '@thaki/tds';

function App() {
  return (
    <div>
      <Input label="Name" placeholder="Enter your name" />
      <Button variant="primary">Submit</Button>
    </div>
  );
}
```

## Components

### Form Controls

| Component | Description |
|-----------|-------------|
| `Button` | Primary action buttons with variants (primary, secondary, ghost, danger) |
| `Input` | Text input with label, helper text, and error states |
| `NumberInput` | Numeric input with increment/decrement controls |
| `SearchInput` | Search input with clear button |
| `Textarea` | Multi-line text input |
| `Select` | Dropdown selection |
| `Checkbox` | Single checkbox with label |
| `CheckboxGroup` | Group of checkboxes |
| `Radio` | Single radio button |
| `RadioGroup` | Radio button group |
| `Toggle` | On/off switch |
| `Slider` | Range slider |
| `DatePicker` | Date selection |
| `FormField` | Form field wrapper with label, helper text, and error handling |

### Data Display

| Component | Description |
|-----------|-------------|
| `Table` | Data table with sorting, selection, and custom rendering |
| `Badge` | Status indicators and labels |
| `Chip` | Tags and filter chips |
| `StatusIndicator` | Status icons with different states |
| `Pagination` | Page navigation |
| `ProgressBar` | Progress and quota indicators |
| `Tooltip` | Hover tooltips |

### Layout

| Component | Description |
|-----------|-------------|
| `VStack` | Vertical flex container |
| `HStack` | Horizontal flex container |
| `Container` | Centered content container |
| `SectionCard` | Card with header and content sections |
| `DetailHeader` | Page detail header with info cards |

### Navigation

| Component | Description |
|-----------|-------------|
| `Tabs` | Tab navigation (underline/boxed variants) |
| `TabBar` | Browser-style tab bar |
| `TopBar` | Top navigation bar |
| `Breadcrumb` | Breadcrumb navigation |
| `SNBMenuItem` | Sidebar navigation menu item |

### Feedback

| Component | Description |
|-----------|-------------|
| `Modal` | Modal dialog with compound components |
| `Drawer` | Side panel |
| `InlineMessage` | Inline alert messages |
| `Loading` | Loading spinners and progress |
| `ContextMenu` | Right-click context menu |

### Disclosure

| Component | Description |
|-----------|-------------|
| `Disclosure` | Expandable/collapsible sections |

## Design Tokens

TDS uses CSS variables for consistent styling. Override them to customize the theme:

### Colors

```css
:root {
  /* Text */
  --color-text-default: #171717;
  --color-text-muted: #525252;
  --color-text-subtle: #737373;
  --color-text-disabled: #a3a3a3;

  /* Surfaces */
  --color-surface-default: #ffffff;
  --color-surface-subtle: #fafafa;
  --color-surface-muted: #f5f5f5;

  /* Borders */
  --color-border-default: #e5e5e5;
  --color-border-subtle: #f5f5f5;
  --color-border-strong: #d4d4d4;

  /* State Colors */
  --color-state-info: #3b82f6;
  --color-state-success: #22c55e;
  --color-state-warning: #f97316;
  --color-state-danger: #ef4444;

  /* Action */
  --color-action-primary: #3b82f6;
}
```

### Typography

```css
:root {
  /* Font Sizes */
  --font-size-10: 10px;
  --font-size-11: 11px;
  --font-size-12: 12px;
  --font-size-14: 14px;
  --font-size-16: 16px;
  --font-size-18: 18px;
  --font-size-24: 24px;
  --font-size-32: 32px;
  --font-size-40: 40px;

  /* Line Heights */
  --line-height-14: 14px;
  --line-height-16: 16px;
  --line-height-18: 18px;
  --line-height-20: 20px;
  --line-height-24: 24px;
  --line-height-28: 28px;
}
```

### Spacing

```css
:root {
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
}
```

### Border Radius

```css
:root {
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;
}
```

## Usage Examples

### Form with Validation

```tsx
import { FormField, Input, Button, Select } from '@thaki/tds';

function ContactForm() {
  const [error, setError] = useState('');

  return (
    <form>
      <FormField required error={!!error}>
        <FormField.Label>Email</FormField.Label>
        <FormField.Control>
          <Input type="email" placeholder="Enter email" fullWidth />
        </FormField.Control>
        {error && <FormField.ErrorMessage>{error}</FormField.ErrorMessage>}
      </FormField>

      <FormField>
        <FormField.Label>Topic</FormField.Label>
        <FormField.Control>
          <Select
            options={[
              { value: 'support', label: 'Support' },
              { value: 'sales', label: 'Sales' },
            ]}
            placeholder="Select topic"
            fullWidth
          />
        </FormField.Control>
      </FormField>

      <Button variant="primary" type="submit">
        Send
      </Button>
    </form>
  );
}
```

### Data Table

```tsx
import { Table } from '@thaki/tds';

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'status', header: 'Status', width: '100px' },
  { key: 'actions', header: '', width: '50px' },
];

const data = [
  { id: '1', name: 'Item 1', status: 'Active' },
  { id: '2', name: 'Item 2', status: 'Pending' },
];

function DataTable() {
  return (
    <Table
      columns={columns}
      data={data}
      selectable
      onSelectionChange={(keys) => console.log(keys)}
    />
  );
}
```

### Modal Dialog

```tsx
import { Modal, Button } from '@thaki/tds';

function DeleteConfirmation() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>
          <Modal.Title>Delete Item</Modal.Title>
          <Modal.Description>
            Are you sure you want to delete this item?
          </Modal.Description>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
```

## Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/tds.git
cd tds

# Install dependencies
npm install

# Start development server
npm run dev

# Start Storybook
npm run storybook
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run storybook` | Start Storybook |
| `npm run test:run` | Run tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Lint code |

### Project Structure

```
src/
├── design-system/
│   ├── components/     # UI components
│   ├── hooks/          # Custom hooks
│   ├── layouts/        # Layout components
│   ├── tokens/         # Design tokens (Storybook docs)
│   └── utils/          # Utility functions
├── pages/              # Demo pages
└── index.css           # Global styles & CSS variables
```

### Testing

We use Vitest and React Testing Library for testing:

```bash
# Run all tests
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test
```

### Accessibility

All components are tested for accessibility using `vitest-axe`. Run accessibility tests:

```bash
npm run test:run -- --grep="a11y"
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ by THAKI Team
</p>
