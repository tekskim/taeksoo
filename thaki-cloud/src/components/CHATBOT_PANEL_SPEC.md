# AI Chatbot Panel Implementation Specification

> **Document Status**: Updated specification reflecting the current implementation state  
> **Last Updated**: 2026-01-07  
> **Component**: `ChatbotPanel.tsx`

---

## [Task]
Add an AI Chatbot UI to the existing Thaki Cloud Desktop UI prototype (Cursor implementation request).

## [Context]
- The product is a web-based "Desktop UI" that behaves like an OS.
- The AI Chatbot is a global feature that runs inside the Desktop UI (not a standalone page).
- It is opened from the Top Bar (GNB) and appears as a right-side overlay panel.
- This is a prototype: implement UI + local mock behavior only (no real LLM / no backend integration).

---

## 1) Entry Point + Panel Behavior

### ✅ Implemented
- Chatbot toggle button on the Top Bar (right side) using `chatbot.png` icon (35x35px)
- Click to open/close the chatbot panel (toggle behavior)
- Panel overlays the Desktop; the background/apps remain visible
- Smooth slide-in/out animation (300ms ease-out transition)
- Panel positioning:
  - Fixed to the right edge
  - Top: 48px (right below Top Bar)
  - Height: to bottom of viewport
  - Width: 400px fixed
- When opened:
  - Autofocus the input (with 300ms delay for animation)
  - Keep the last conversation state when reopened (in-memory)

---

## 2) Panel Layout (Chat View)

### A) Header ✅
- **Left**: Chat selector dropdown
  - Shows current chat title (truncated to max 200px)
  - Click opens dropdown with chat list (search + sessions grouped by date)
  - Checkmark indicates current session
  - Click outside dropdown to close
- **Right**: 
  1. New Chat button (`IconEdit`) → Creates new chat session
  2. Collapse button (`IconChevronsRight`) → Closes panel

### B) Main Conversation Area ✅

**Empty State**:
- Welcome text: "How can I help you?"
- Suggested questions rendered as clickable pill buttons:
  - "Open the Compute app."
  - "How do I create a GPU instance?"
  - "Which project is using the most resources?"
  - "I want to edit dev-server-01 instance configurations."
  - "What AI workloads are currently running?"
- Clicking a suggestion sends that text as a user message

**Message UI**:
- User messages: right-aligned bubble (primary blue background, white text, `rounded-br-sm`)
- Assistant messages: left-aligned bubble (subtle gray background, `rounded-bl-sm`)
- Copy button appears on hover for each message
- Smooth fade-in + slide-up animation for new messages

**Supported Content Types**:
- [v] Plain text with emoji support
- [v] Whitespace-preserved formatting (`whitespace-pre-wrap`)
- [v] Action buttons (rendered below message bubble)
- [ ] Card widgets (currently embedded as text, not separate components)
- [ ] CLI output blocks (monospace preformatted) — not yet styled

**Auto-scroll**: ✅ Implemented
- Scrolls to bottom when new messages arrive (smooth behavior)

### C) Composer (Bottom Input) ✅

**Layout**: Rounded card container (min-height 160px) with:
- Optional attached files section at top
- Multiline textarea (auto-expanding)
- Bottom toolbar row

**Input Behavior**:
- Placeholder: "Ask me anything..."
- Keyboard shortcuts:
  - Enter = Send
  - Shift + Enter = New line
- After send:
  - Clear input
  - Clear attached files
  - Keep focus in input

**Attached Files**: ✅ Implemented
- Paperclip button opens native file picker
- Multiple files supported
- Shows attached files as removable chips
- Files cleared after sending

### D) Footer Controls ✅

**Left side**:
1. **Attach button** (`IconPaperclip`) — Opens file picker
2. **Model dropdown** (mock only):
   - Options: "Auto", "Opus 4.5", "GPT-5.2", "Gemini 3"
   (options will be updated)
   - Displays selected model with CPU icon
   - Dropdown opens upward above composer
3. **MCP toggle button**:
   - Toggle state with `IconBolt`
   - Active: primary blue background
   - Inactive: outlined style

**Right side**:
- **Send button**: Blue circular button with arrow-up icon
- Disabled when input is empty

---

## 3) Chat History View ✅

### Trigger
- Click on chat title dropdown in header

### Layout
- **Search field**: Text input with search icon at top
- **Session list**: Scrollable, max-height 300px
- **Grouping**: Sessions organized by date
  - "Today" section
  - "Yesterday" section
- **Session item**:
  - Title (truncated)
  - Checkmark for current session
  - Delete button (X icon) on hover

### Delete Confirmation Modal ✅
- Backdrop overlay (50% black)
- Centered modal with:
  - Title: "Delete chat?"
  - Description with session title
  - Cancel / Delete buttons
  - Delete button in red

### Persistence
- ⬜ localStorage persistence not implemented
- ✅ In-memory state preserved during session
- Sessions/messages lost on page refresh

---

## 4) Mock Behavior ✅

### Sending Flow
1. Append user message immediately
2. Show assistant "typing" indicator (animated dots)
3. After 300–800ms random delay, append assistant mock response
4. First message updates session title (first 30 chars)

### Intent-Based Mock Routing

| Query Pattern | Response |
|---------------|----------|
| Contains "ai workload(s)" | Shows active training/inference jobs with metrics + "Open AI Platform" button |
| Contains "open" + "compute" | "Opening the Compute app..." + "Go to Compute" button |
| Contains "gpu instance" or "create" + "gpu" | Step-by-step GPU instance creation guide + "Go to Compute" button |
| Contains "project" + "resource" | Resource usage breakdown by project (Alpha: 45%, Beta: 32%, Gamma: 23%) |
| Contains "edit" + "dev-server" | Configuration help message + "Go to Instance detail" button |
| Default fallback | Echo user intent with friendly response |

---

## 5) Component Integration

### File Structure
```
src/
├── components/
│   └── ChatbotPanel.tsx    # Main chatbot component
├── assets/
│   └── desktop/
│       └── chatbot.png     # Toggle button icon
└── pages/
    └── DesktopPage.tsx     # Parent page with state management
```

### Usage in DesktopPage.tsx
```tsx
import { ChatbotPanel } from '@/components/ChatbotPanel';

// State
const [showChatbot, setShowChatbot] = useState(false);

// TopBar toggle handler
<DesktopTopBar onChatbotToggle={() => setShowChatbot(!showChatbot)} />

// Panel rendering
<ChatbotPanel 
  isOpen={showChatbot} 
  onClose={() => setShowChatbot(false)} 
/>
```

### Props Interface
```typescript
interface ChatbotPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
```

---

## 6) UX + Safety Constraints

- Does not break existing Desktop UI layout
- Follows existing project component conventions
- **Typography**: Uses body.md (12px/18px) as default text size throughout all UI elements
  - Message text: 12px, line-height 18px
  - Input placeholder: 12px, line-height 18px
  - Buttons: 12px, line-height 18px
  - Section headers: 12px, line-height 18px
- Uses Thaki Design System CSS variables:
  - Typography: `--font-size-12`, `--line-height-18`
  - Colors: `--color-surface-default`, `--color-surface-subtle`
  - Text: `--color-text-default`, `--color-text-muted`
  - Borders: `--color-border-default`, `--color-border-strong`, `--color-border-focus`
  - Actions: `--color-action-primary`, `--color-action-primary-hover`, `--color-action-primary-subtle`
  - Status: `--color-status-success`
- No real AI calls, no backend changes, no MCP integration—mock only
- **Dark mode support**: ✅ Fully implemented
  - Desktop UI automatically activates dark mode when entering the page
  - All background colors use CSS variables (`--color-surface-default`, `--color-surface-subtle`) instead of hardcoded `bg-white`
  - Text colors adapt automatically via CSS variables
  - Panel, dropdowns, modals, and all interactive elements respect dark mode

---

## 7) Dependencies

### External
- `@tabler/icons-react`: IconChevronDown, IconPaperclip, IconBolt, IconArrowUp, IconCpu, IconEdit, IconChevronsRight, IconCopy, IconCheck, IconSearch, IconX

### Internal
- React hooks: useState, useRef, useEffect, useCallback
- CSS variables from design system

---

## 8) Future Enhancements (TODO)

### High Priority
1. **localStorage persistence**: Save sessions/messages to localStorage for cross-session persistence
2. **ESC key handler**: Add keyboard listener to close panel on Escape
3. **Actual navigation**: Connect action buttons to real navigation (e.g., open Compute app)

### Medium Priority
4. **CLI output styling**: Render kubectl/terminal commands with monospace preformatted blocks
5. **Card widgets**: Create separate components for metric cards
6. **Responsive width**: Implement min/max width constraints

### Low Priority
7. **Agent status queries**: Add mock responses for agent-related questions
8. **Message search**: Search within current conversation
9. **Export conversation**: Export chat history as text/JSON
