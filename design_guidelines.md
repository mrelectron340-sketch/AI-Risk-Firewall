# AI Risk Firewall - Design Guidelines

## Design Approach
**System-Based Approach** drawing from security-focused crypto applications (MetaMask, Phantom, 1Password) with Material Design principles for clarity and trust. This is a utility-first security tool where precision, readability, and rapid threat assessment are paramount.

## Core Design Principles
1. **Security-First Visual Language**: Every element reinforces trust and safety
2. **Instant Threat Recognition**: Color-coded risk states visible at a glance
3. **Minimal Cognitive Load**: Clear hierarchy, no decorative elements
4. **Professional Precision**: Technical users need detailed information, presented clearly

---

## Typography
**Primary Font**: Inter (via Google Fonts CDN)
- Headings: 600 weight, sizes: 2xl (alerts), xl (sections), lg (subsections)
- Body: 400 weight, base size for descriptions
- Technical Data: 500 weight, sm/xs for addresses, hashes, scores
- Monospace: JetBrains Mono for contract addresses and technical strings

**Hierarchy**: Risk scores and status headlines are largest, supporting details are smaller but clearly legible.

---

## Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8
- Micro spacing: p-2, gap-2 (between related elements)
- Component padding: p-4, p-6 (cards, sections)
- Section spacing: py-8, gap-8 (major divisions)
- Container widths: max-w-4xl for main content, max-w-2xl for focused alerts

**Grid System**: Single column for alerts and dashboards (focus), 2-column for comparison views only

---

## Component Library

### Browser Extension Popup (Primary Interface)
- Compact 400px width, variable height based on content
- Header: App logo + current site URL + protection status badge
- Main Content: Risk assessment card with score visualization
- Footer: Quick actions (block/allow/report)

### Risk Alert Cards
- **Danger (High Risk)**: Large alert icon, risk score 0-40, primary message, expandable technical details
- **Warning (Medium Risk)**: Caution icon, risk score 41-70, explanation + recommendation
- **Safe (Low Risk)**: Shield icon, risk score 71-100, brief confirmation message
- Critical info first: Risk score and verdict at top, supporting data below

### Dashboard (Full Page)
**Header**: Logo, wallet connection status, Trust NFT score badge
**Stats Grid**: 2x2 card layout showing:
- Threats blocked today/total
- Active protections
- Trust NFT score with progress indicator
- Last scan timestamp

**Activity Feed**: Chronological list of blocked threats, each item showing:
- Timestamp (relative)
- Threat type icon
- Site/contract involved
- Risk score
- Action taken

**Settings Panel**: Accordion-style sections for:
- Protection level toggles
- Notification preferences
- Polygon network status
- API key management (if needed)

### Transaction Interceptor Modal
- Full-screen overlay with blur backdrop
- Centered card (max-w-lg)
- Transaction details in key-value pairs
- Risk analysis section with traffic light indicator
- Dual CTA: "Approve" (if safe) and "Block Transaction" (prominent if risky)

### Trust NFT Display
- Card showing dynamic SBT visualization
- Score ring/progress indicator
- Stats: scams avoided, safe transactions, overall rank
- Visual badge that updates based on score tier

### Contract Analysis View
- Split layout: Contract info (left) | Risk factors (right)
- Checklist visualization for safety checks (liquidity, ownership, taxes)
- Code snippet preview for critical functions (if flagged)

---

## Visual States

### Risk Level Color Coding
Use semantic colors (not to be specified now, but structure for):
- **Danger**: High-contrast alert state
- **Warning**: Caution state
- **Safe**: Success confirmation state
- **Neutral**: Information/loading state

### Icons
**Library**: Heroicons (via CDN)
- Shield icons for protection states
- Exclamation/warning icons for alerts
- Check/X icons for pass/fail indicators
- Lock icons for security features
- Chain icons for blockchain connection

---

## Interactions

### Real-Time Scanning
- Subtle pulse animation on scan icon (1.5s duration) during active analysis
- Progress indicator for multi-step contract checks
- Instant state transitions: scanning → alert displayed (no intermediate states)

### Notifications
- Toast-style alerts slide in from top-right (browser extension context)
- Auto-dismiss after 5s for informational, manual dismiss for warnings/dangers
- Sound notification toggle (optional in settings)

---

## Special Considerations

### Browser Extension Constraints
- Optimized for 400x600px popup window
- Minimal scrolling: key info above fold
- Fast load times: lazy-load detailed analysis
- Persistent badge on extension icon showing active protection count

### Blockchain Integration Display
- Polygon network indicator in header (green dot = connected)
- Transaction status badges (pending/confirmed/failed)
- Gas fee estimates inline with transaction approvals
- Smart contract addresses in monospace with copy button

### Data Density Balance
- Primary action always visible without scroll
- Technical details hidden in expandable sections
- "View Full Report" links to dashboard for deep analysis

---

## Page Structure

### Extension Popup (Primary View)
1. Header (site protection status)
2. Risk Assessment Card
3. Quick Actions Bar

### Dashboard (Full Page - Accessed via Extension)
1. Header with wallet connection
2. Protection Stats Grid (2x2)
3. Daily Activity Feed
4. Trust NFT Display
5. Contract Registry Search
6. Settings Panel (collapsible)

---

## Images
**Not applicable** - This is a security utility extension. All visuals are icon-based, data visualizations (charts, score rings), and UI elements. No hero images or decorative photography.

---

## Accessibility
- High contrast for risk states
- Clear focus indicators for keyboard navigation
- Screen reader labels for all icons and status indicators
- ARIA alerts for real-time threat notifications