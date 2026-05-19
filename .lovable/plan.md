# Elementor-style Builder Interface Redesign

Goal: Builder-er UI ke Elementor-er moto clean, professional ebong familiar banano (uploaded screenshot anushare).

## Visual Reference (target)
- **Top bar**: Dark slate, left-e logo + small icon buttons (add, settings, layers), center-e page title + device switcher, right-e search/help/preview/Publish (bright accent).
- **Left panel**: Tabbed — `Content / Style / Advanced` — clean white-ish dark panel with form-like controls (label left, control right).
- **Canvas**: Large center area, white background, blocks selectable with subtle blue outline.
- **Right panel**: "Structure" / Layers tree (collapsible blocks list).

## Changes

### 1. TopBar (`src/builder/components/TopBar.tsx`)
- Compact icon group on left (Add, Theme/Settings, Layers toggle, Templates).
- Center: device switcher + page name dropdown style.
- Right: search icon, help, preview eye, **Publish** button with bright pink/violet gradient (matching Elementor).
- Reduce height to `h-12`, use semantic tokens.

### 2. LeftSidebar (`src/builder/components/LeftSidebar.tsx`)
- Convert to **"Edit Panel"** style when a block is selected — show `Content / Style / Advanced` tabs (currently in RightPanel).
- When nothing is selected → show widgets/templates picker (current behavior).
- Header: "Edit {BlockName}" with back arrow to widgets list.

### 3. RightPanel → Becomes "Structure" panel (`src/builder/components/RightPanel.tsx`)
- Replace property editor with the **Navigator/Layers tree** (move from floating Navigator).
- Title: "Structure", with close button.
- Tree of all blocks (nested) with icons, click-to-select, drag handle.

### 4. Navigator (`src/builder/components/Navigator.tsx`)
- Remove floating overlay; logic moves into RightPanel.

### 5. Canvas (`src/builder/components/Canvas.tsx`)
- Selection outline: Elementor's signature blue dashed (`#92003b` accent on hover, blue on select).
- Hover toolbar above selected block (drag/duplicate/delete).

### 6. Theme tokens
- Add builder-specific tokens in `index.css`:
  - `--builder-panel-bg`, `--builder-panel-border`, `--builder-accent` (Elementor pink `#92003b` / bright `#e91e63`).

## Technical Notes
- No DB changes.
- Store stays same — only UI shuffling.
- Use existing shadcn `Tabs`, `Tooltip`, `ScrollArea`.
- Keep all current functionality (AI, Templates, Sections, Animations).

## Out of scope
- New widgets / features.
- Mobile editor UI redesign.
