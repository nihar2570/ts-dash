# Telangana Election Intelligence

Interactive dashboard for exploring Telangana State Assembly election results across **119 constituencies** for the 2014, 2018, and 2023 elections. Built with React, TypeScript, Leaflet, and Tailwind CSS.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app runs at `http://localhost:5173` by default.

## How to Use

### Header Bar

The sticky header at the top contains:

- **Tab Switcher** — toggle between the three main views: Results & Map, Simulations, and Actions & Playbook.
- **Executive Dossier** — dark button that opens a global intelligence briefing across all constituencies (requires SEEEPC data).
- **Help icon** (❓) — opens a quick-reference guide for all features.

### Results & Map Tab

This is the primary view with the interactive constituency map.

| Control | What it does |
|---|---|
| **Election Year** (2014 / 2018 / 2023) | Switches all data to the selected year |
| **Party Colors** | Map colored by winning party |
| **Margins** | Map shaded by victory margin (darker = larger margin) |
| **Swings** | Highlights seats that flipped between elections (disabled for 2014) |
| **33 Districts** | Greyscale district-level view |
| **Search** (AC # or name) | Type a constituency name or number, press Enter to select it |

**Interacting with the map:**
- **Click** any constituency to select it — the battle card on the right updates with historical results.
- **Hover** over a constituency to see a quick tooltip.
- The map supports **fullscreen mode** — use the expand button on the map controls.

**Constituency Battle Card** (right panel):
- Shows the winner, runner-up, and margin for the selected constituency across all three elections.
- Click **"Open Dossier"** to see the deep-dive modal with candidate profiles and demographic data.

**Constituency Table** (below the map):
- Sortable leaderboard of all 119 seats.
- Click any row to select that constituency on the map.
- Click the dossier icon to open its full profile.

### Simulations Tab (War Room)

Model "what-if" scenarios by adjusting voter behavior:

- **Community Swing Sliders** — shift voter sentiment by caste/community group (SC, ST, BC, OC, Muslim, age groups) and watch the projected seat tally update in real time.
- **Swing Studio** — fine-grained party-level swing controls with macro presets (e.g., "anti-incumbency wave", "consolidation").
- **Advanced Simulation Suite** — turnout-based modeling: adjust urban vs rural turnout and see constituency-level impact.
- Click any constituency in the results table to navigate to its dossier.
- Use **"Reset All"** to clear your adjustments.

### Actions & Playbook Tab

Campaign strategy planning tools:

- **Resource Point Allocator** — distribute Digital, Rally, and Welfare points across constituencies (budget-constrained).
- **Star Campaigner Allocator** — assign party leaders to priority seats.
- **Defection / Rebel Modeler** — simulate what happens if a candidate defects or runs as an independent.
- **AI Playbook Summary** — generates a strategic brief for selected constituencies.

### Executive Dossier

Click the dark **"Executive Dossier"** button in the header to open a full-screen modal with:
- State-wide seat projections and vulnerability analysis.
- Constituency-by-constituency strategic recommendations.
- Key demographic and SEEEPC metrics at a glance.

### Constituency Dossier

Accessible from the battle card, the table, or the simulations view. Shows:
- Candidate photo, party, and vote share.
- Historical comparison across elections.
- SEEEPC demographic breakdown (caste, age, urban/rural).
- Deep-link support: append `?dossier=40` to the URL to open AC #40 (Gajwel) directly.

## Data Files

All datasets live in `public/data/`:

| File | Description |
|---|---|
| `telangana_assembly.geojson` | 119 constituency boundaries |
| `telangana_districts.geojson` | 33 district boundaries |
| `telangana_elections.json` | Results & summary for 2014, 2018, 2023 |
| `telangana_candidates_2023.json` | Candidate profiles for 2023 |
| `telangana_seeepc_demographics.json` | SEEEPC demographic dataset |

## Tech Stack

- **React 19** + TypeScript
- **Vite 8** (dev server & build)
- **Tailwind CSS 4** (utility-first styling)
- **Leaflet** (interactive maps)
- **Lucide React** (icons)

## Project Structure

```
src/
├── App.tsx                      # Main app with routing & state
├── types.ts                     # Shared TypeScript types
├── components/
│   ├── HeaderBar.tsx            # Sticky header with tabs, search, help
│   ├── HelpModal.tsx            # Usage guide modal
│   ├── TelanganaMap.tsx         # Leaflet map with 4 view modes
│   ├── SeatTallyBar.tsx         # Party seat progress bar
│   ├── ConstituencyCard.tsx     # Selected constituency battle card
│   ├── ConstituencyTable.tsx    # Sortable 119-seat leaderboard
│   ├── ConstituencyDossier.tsx  # Deep-dive constituency modal
│   ├── SimulationsView.tsx      # War Room with swing sliders
│   ├── SwingStudioModal.tsx     # Fine-grained swing controls
│   ├── AdvancedSimulationSuite.tsx  # Turnout-based simulation
│   ├── ActionsView.tsx          # Campaign playbook & allocator
│   ├── StarCampaignerAllocator.tsx  # Leader assignment tool
│   ├── DefectionRebelModeler.tsx    # Defection scenario modeler
│   └── ExecutiveBriefingModal.tsx   # Global executive briefing
```
