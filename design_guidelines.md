# Crypto Mining Tycoon - Design Guidelines

## Design Approach
**Reference-Based: Idle/Tycoon Game UI**
Drawing inspiration from successful idle tycoon games (AdVenture Capitalist, Idle Miner Tycoon) combined with a futuristic crypto-tech aesthetic. The design prioritizes clear information hierarchy, immediate visual feedback, and an engaging sci-fi atmosphere.

## Core Design Principles

### 1. Typography
**Primary Font:** "Orbitron" or "Rajdhana" (Google Fonts) - futuristic, tech-themed
- Resource counters: Bold, 24-28px
- Button labels: Medium, 16-18px
- Stats/info text: Regular, 14-16px
- Flavor text: Light, 12-14px

**Secondary Font:** "Inter" for body text and descriptions
- Clear readability for upgrade descriptions and info panels

### 2. Layout System
**Spacing:** Tailwind units of 2, 4, 6, and 8
- Consistent padding: p-4 for cards, p-6 for panels
- Gap spacing: gap-4 for grids, gap-2 for compact lists
- Margins: m-2 for tight spacing, m-4 for section separation

**Screen Structure:**
```
┌─────────────────────────────────────────┐
│  Top Bar (Resources & Stats)  h-16-20  │
├─────────────────────────────────────────┤
│                                         │
│         Game View (3D Canvas)          │
│              flex-1                     │
│                                         │
├─────────────────────────────────────────┤
│  Bottom Panel (Menus/Upgrades) h-64    │
└─────────────────────────────────────────┘
```

### 3. Component Library

**Top Resource Bar:**
- Fixed header with glass-morphism effect (backdrop-blur, semi-transparent)
- Resource counters in grid: Cash, Mining Rate/sec, Total Mined
- Token selector dropdown showing active mining distribution
- Settings/info icons on far right

**Game View (3D Canvas):**
- Full Three.js canvas with isometric camera
- Grid-based placement system with subtle guide lines
- Interactive PC models with hover states (glow effect)
- Worker character sprites moving between PCs
- Room boundaries clearly defined with walls/barriers

**PC Visual Elements:**
- Three distinct 3D models (Budget Rig: single tower, Gaming PC: RGB tower, Server Rack: multi-unit stack)
- Glowing particles emanating from active PCs
- Token icon floating above PC showing current mining token
- Progress bar beneath PC for mining progress
- Upgrade indicators (stars/level badges)

**Bottom Control Panel:**
- Tabbed interface: "Build" | "Upgrade" | "Workers" | "Tokens" | "Celebrities"
- Each tab slides in content panel with grid of purchase cards
- Purchase cards: Icon + Name + Cost + Stats (2-column grid on desktop, 1-column mobile)
- Locked items shown with padlock overlay and unlock requirements

**Purchase/Upgrade Cards:**
- Compact card design: w-full sm:max-w-sm
- Card structure:
  - Icon/image (64x64px or 80x80px)
  - Title and level indicator
  - 2-3 key stats in small badges
  - Cost display with currency icon
  - Buy/Upgrade button
- Disabled state for unaffordable items (reduced opacity)

**Token Dashboard (Expandable Panel):**
- 6 token cards showing: Token icon, Current profit rate, Trend arrow (↑↓)
- Quick-switch buttons for changing PC mining target
- Dynamic profit visualization (simple bar chart or sparkline)

**Celebrity Visit Popup:**
- Modal overlay with dimmed background
- Celebrity portrait (placeholder or icon)
- Animated entrance (slide down with bounce)
- Bonus amount in large text
- Duration timer for temporary boosts
- Dismiss/claim button

**Worker Panel:**
- Worker type cards showing sprite/icon, stats, capacity (how many PCs they manage)
- Hire button and upgrade tree visualization
- Active workers shown with assignment indicators

### 4. Visual Feedback & Micro-interactions

**Hover States:**
- PCs: Subtle glow outline, lift effect (translateY -2px)
- Buttons: Scale 1.05, slight brightness increase
- Cards: Border highlight, shadow depth increase

**Click Feedback:**
- Button press: Scale 0.95 momentarily
- Purchase success: Brief particle burst, sound effect placeholder
- Resource gain: Counter animates increment with green flash

**Idle Animations (Very Subtle):**
- PC fans rotate slowly
- Mining particles float upward continuously
- Workers bob slightly while moving
- Token icons gentle rotation on hover

### 5. Game-Specific UI Elements

**Notification Toast System:**
- Top-right corner notifications for:
  - Milestone unlocks
  - Celebrity arrivals
  - Offline earnings summary
  - Level ups
- Auto-dismiss after 5 seconds, stack vertically

**Expandable Room Indicator:**
- Floor grid expands outward from center
- Purchase new room sections via wall boundary buttons
- Clear visual distinction between owned/unowned space

**Offline Earnings Modal:**
- Welcome back message on return
- Summary of earnings while away
- Breakdown by PC and token type
- Claim button to collect

## Accessibility
- Keyboard navigation for all purchase/upgrade actions
- Tab focus indicators with thick outline
- Aria labels for 3D game objects (screen reader description)
- Text contrast ratio minimum 4.5:1 against backgrounds

## Performance Considerations
- Lazy load 3D models for PCs not in viewport
- Reduce particle effects on low-end devices
- Pause 3D rendering when tab inactive
- Optimize worker pathfinding calculations

## Images
**No traditional hero image** - this is a game interface. The 3D game view IS the visual centerpiece.

**Required Visual Assets:**
- PC 3D models (Budget Rig, Gaming PC, Server Rack) - Three.js GLTF models or placeholder geometries
- Worker sprites/models (Technician, Engineer, Expert) - Simple rigged characters
- Token icons (BTC, ETH, SOL, GALA, BENE, BitBlitz) - SVG icons from crypto icon libraries
- Celebrity portraits - Placeholder avatar icons or illustrated portraits
- Room/environment textures - Subtle tech floor grid, metallic walls