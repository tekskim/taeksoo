# Settings App Prompt (Updated: 2026-01-06)

> This document serves as the source of truth for the Settings app implementation.
> Last updated to reflect actual implementation status.

---

## Overview

You are designing a Settings app for a web-based Desktop UI that behaves like an operating system.

---

## APP METADATA

| Property | Value |
|----------|-------|
| App Name | Settings |
| App Type | Utility App (Type B) |
| Context | Thaki Cloud Desktop UI |
| Design System | TDS (Thaki Design System) |
| Initial Window Size | **50% of screen width** (centered) |
| Initial Window Height | **50% of screen height** (centered) |
| Resizable | Yes (8-direction resize handles) |
| Draggable | Yes (via window header) |
| Multi-window | No (single instance only) |

### ✅ Implementation
- Window positioning and sizing
- Drag-to-move functionality  
- Resize handles (n, s, e, w, nw, ne, sw, se)
- Maximize/restore toggle
- Window controls (minimize, maximize, close)

---

## GLOBAL LAYOUT

| Area | Description |
|------|-------------|
| Window Header | Draggable title bar with app icon + title + window controls |
| Left Sidebar | Fixed vertical navigation (168px width) |
| Right Content | Scrollable content area with max-width 1000px |
| Internal Header | None (no top header inside content) |

### Page Structure
Each page starts with:
- **Page Title** (16px, semibold)
- **Short description text** (12px, muted color)
- Content sections using `SectionCard` component

### Sidebar Rules
- Icon + label for each menu item
- Active item: highlighted with primary color background
- No collapse behavior
- Uses TDS menu item styling (padding, radius, gap)

---

## IA STRUCTURE

```
[Settings]
├── [General]
│   ├── Theme
│   ├── Language
│   └── Time Zone
├── [Account]
│   ├── Account Information (ID, Name, Email)
│   ├── Authentication (Password, 2-Step Verification)
│   ├── Activity
│   └── Logout
├── [Notifications]
│   ├── Global Notification Setting
│   └── In-app Notification Setting (per service)
└── [Information]
    ├── Version
    ├── Terms
    └── Support
```

---

## PAGE DEFINITIONS

---

### [General]

**Section: Preferences** (SectionCard)

#### Theme
| Property | Value |
|----------|-------|
| Component | Select (dropdown) |
| Options | System / Light / Dark |
| Behavior | **Applies immediately** (no confirmation modal), uses `useDarkMode` hook |
| System | Detects OS preference via `prefers-color-scheme` media query |
| Width | 200px |

#### Language
| Property | Value |
|----------|-------|
| Component | Select (dropdown) |
| Options | English / Korean |
| Behavior | Confirmation modal required before applying (skipped if same value selected) |
| Width | 200px |

#### Time Zone
| Property | Value |
|----------|-------|
| Component | Select (dropdown) |
| Options | IANA Time Zone list (with GMT offset labels) |
| Behavior | **Applies immediately** (no confirmation modal) |
| Width | 300px |

**Sub-option: Use current location**
| Property | Value |
|----------|-------|
| Component | Toggle |
| Label | "Set current time zone" |
| Description | "Automatically set time zone based on your location" |
| Behavior | When enabled, detects timezone via browser's `Intl.DateTimeFormat()` API and sets it automatically. Also disables timezone select box. |

---

### [Account]

---

#### Section 1: Account Information (SectionCard)

| Field | Component | Behavior |
|-------|-----------|----------|
| ID | Input (disabled) | Read-only, always disabled |
| Name | Input (editable) | **Always editable** (no edit button required) |
| Email | Input (disabled) + Button | Read-only with "Change email" button |

**Input Sizing:**
| Property | Value |
|----------|-------|
| min-width | 300px |
| max-width | 750px |

##### Email Change Flow (Modal)
A multi-step verification process.

**Typography**: body.md (font-size-12/line-height-18)

**Step 1: Password Verification**
- Display current email
- Password input field (full-width)
- "Verify password" button

**Step 2: New Email Input**
- Password input field (disabled - preserves entered value)
- New email input field (full-width)
- "Send verification code" button

**Step 3: Verification Code**
- Password input field (disabled - preserves entered value)
- New email input field (disabled - preserves entered value)
- Display target email
- 6-digit verification code input (full-width)
- "Change email" button

---

#### Section 2: Authentication (SectionCard)

##### Password
| Property | Value |
|----------|-------|
| Display | "Last updated: YYYY-MM-DD HH:MM" text (updates on password change) |
| Action | "Change Password" button |
| Edit Mode | Shows new password + confirm password fields (width: 300px) with Cancel/Save buttons |
| Save Button | Enabled only when both fields are filled and passwords match |
| Save Behavior | Updates "Last updated" timestamp to current date and time |

##### 2-Step Verification
| Property | Value |
|----------|-------|
| Toggle | Enable/Disable 2-Step Verification |
| Description | "Add an extra layer of security to your account." |
| Disable Behavior | Requires password re-entry |

**Verification Methods** (visible only when toggle is ON):

1. **Authenticator App**
   - Icon: Shield icon (primary color background)
   - Status: "Added [timestamp]" if configured, else description text
   - Button: "Set up" / "Remove"

##### 2-Step Verification Setup Flow

**Step 1: Password Re-authentication (Modal)**
- Trigger: Clicking [Set up] or [Remove] button
- Purpose: Verify identity before modifying security settings
- Input: Current password field (full-width)
- Actions: Cancel / Verify

**Step 2: Enrollment (Modal)**

*For Authenticator App:*
- QR Code display (180x180px)
- Manual secret key with copy button
- "Next" button to proceed

**Step 3: Verification (Modal)**
- 6-digit OTP input field (centered, monospace font)
- "Back" / "Verify and Enable" buttons
- Success: Updates status to configured immediately

---

#### Section 3: Sessions (SectionCard)

| Property | Value |
|----------|-------|
| Component | Read-only HTML table |
| Columns | Location, IP Address, Device, Timestamp (in order) |
| Device | Browser and OS info (e.g., "Chrome on macOS", "Safari on iOS") |
| Timestamp Format | `YYYY-MM-DD HH:MM:SS +ZZZZ` (includes GMT offset) |
| Location | Geographic location of login (e.g., "Gangnam-gu, Seoul, South Korea") |
| Sorting | Most recent first |
| Styling | Border, header with subtle background |
| Header Typography | label.md (font-size-12/line-height-16, font-semibold) |
| Cell Typography | body.md (font-size-12/line-height-18) |

> 📝 **TODO**: Consider using TDS Table component for consistency

---

#### Section 4: Logout (No SectionCard boundary)

| Property | Value |
|----------|-------|
| Component | Button (variant="danger", size="lg") |
| Position | Below Activity section with top border separator |
| Behavior | Opens confirmation modal |

**Logout Modal:**
- Title: "Logout"
- Message: "Are you sure you want to logout of your account?"
- Actions: Cancel / Logout (danger button)
- Result: Redirects to `/login`

---

### [Notifications]

**Section: Notification Preferences** (SectionCard)

---

#### Global Notification Setting

| Setting | Component | Options/Behavior |
|---------|-----------|------------------|
| What to Notify | RadioGroup (horizontal) | All / Errors only / Off |
| Duration | Select (160px) | 1s, 2s, 3s, 5s, Keep visible |
| Sound | Toggle | On/Off |

> When "What to Notify" is set to "Off", Duration and Sound controls are visually dimmed (opacity-50) and disabled.

---

#### In-app Notification Setting

Uses **Disclosure** component for collapsible sections per service:

| Service | Key |
|---------|-----|
| Compute | compute |
| IAM | iam |
| Storage | storage |
| Container | container |
| AI Platform | aiPlatform |
| Agent Ops | agentOps |

**Each service has:**
| Setting | Component | Options |
|---------|-----------|---------|
| What to Notify | RadioGroup (horizontal) | All / Errors only / Off |
| Duration | Select (160px) | 1s, 2s, 3s, 5s, Keep visible |
| Sound | Toggle | On/Off |

> Same dimming behavior when "Off" is selected.

---

### [Information]

---

#### Section: Version (SectionCard)

| Property | Value |
|----------|-------|
| Component | DetailHeader.InfoCard (side by side) |
| Fields | Product Name: "Thaki Cloud Suite", Version: "0.7.0" |

---

#### Section: Terms (SectionCard)

| Link | URL |
|------|-----|
| Terms of Service | https://thakicloud.com/ |
| Privacy Policy | https://thakicloud.com/ |

**Link Styling:**
- Primary color text
- External link icon (14px)
- Hover underline

---

#### Section: Support (SectionCard)

| Link | URL |
|------|-----|
| Official Website | https://thakicloud.com/ |
| Support Center | https://thakicloud.com/ |

---

## DESIGN SYSTEM COMPONENTS USED

| Component | Usage |
|-----------|-------|
| Button | Actions (primary, secondary, danger variants) |
| Select | Dropdowns for theme, language, timezone, duration |
| Input | Text fields (with disabled state) |
| Toggle | Boolean settings |
| Radio / RadioGroup | Notification preferences |
| Modal | Confirmations, setup flows (includes close button in top-right corner by default) |
| SectionCard | Content grouping with headers |
| Disclosure | Collapsible notification settings |
| DetailHeader.InfoCard | Version information display |
| WindowControls | Window minimize/maximize/close |

---

## INTERACTION RULES

### Applied Immediately
- [v] Theme changes
- [v] Name field edits

### Requires Confirmation Modal
- [v] Language changes
- [v] Timezone changes
- [v] Logout action

### Requires Password Verification
- [v] Email change
- [v] 2-Step Verification setup/removal
- [v] Disabling 2-Step Verification toggle

### Multi-Step Flows
- [v] Email change (3 steps)
- [v] 2-Step Verification setup (3 steps)

---

## ANIMATION & TRANSITIONS

| Animation | Usage |
|-----------|-------|
| `animate-in zoom-in-95` | Window open |
| `fade-in slide-in-from-bottom-2` | Tab content change |
| `fade-in slide-in-from-top-2` | 2-Step methods reveal |
| `duration-200` | Standard animation timing |
| `duration-[var(--duration-fast)]` | Menu hover transitions |

---

## PENDING ITEMS / FUTURE ENHANCEMENTS

### High Priority
- [ ] Implement actual theme switching (dark mode integration)
- [ ] Connect to real authentication backend
- [ ] Add form validation with proper error messages

### Medium Priority  
- [ ] Add "Open Source Licenses" link in Information
- [ ] Add "Documentation" link in Support section
- [ ] Replace HTML table with TDS Table component in Activity section
- [ ] Add password strength indicator in password change flow

### Low Priority
- [ ] Add keyboard navigation support
- [ ] Add loading states for async operations
- [ ] Add success toast notifications after settings changes


