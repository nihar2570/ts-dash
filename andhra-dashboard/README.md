# Andhra Pradesh Election Intelligence

Interactive election analytics and strategic war-room platform for the **Andhra Pradesh Legislative Assembly** across all **175 constituencies**, covering the 2014, 2019, and 2024 elections.

Built with React 19, TypeScript, Vite, Tailwind CSS v4, and Leaflet.

---

## Quickstart

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Production build
npm run build
```

The application runs at `http://localhost:5173` by default.

---

## Core Capabilities

### 1. Results & Interactive Assembly Map
- **Constituency Choropleth Map**: Dynamic interactive map of all 175 Assembly Constituencies with boundary polygons and district overlays across all 26 Andhra Pradesh districts.
- **Electoral Trends**: Historical returns for 2014, 2019, and 2024 with party colors, victory margins, and swing analysis.
- **Constituency Deep-Dive Dossier**: Detailed AC cards with certified winner and runner-up statistics, vote shares, postal ballot figures, and demographic profiles.

### 2. Candidate ADR Disclosures & Equity Decomposer
- **Complete 2024 Candidate Affidavits**: 100% verified MyNeta ADR records for all **2,368 candidates** across all 175 ACs (Education, Age, Criminal Cases, Assets, and Liabilities).
- **Default Column Views**: Fast inspection table with individual and master column toggles for Age, Education, Criminal Cases, and Net Worth.
- **Candidate Personal Equity Decomposer**: Decomposes winning margins into party base vote vs. personal candidate goodwill.

### 3. Polling Station GIS & Panna Pramukh Deficit Solver
- **Official ECI GIS Coordinates**: Polling stations mapped to their actual GPS coordinates within constituency boundaries.
- **Mandal-Level Stratification**: Polling stations clustered by constituent mandals with Voronoi sector overlays.
- **Deficit & Defense Solver**: Calculate precise vote flips required per polling station and page-level Panna Pramukh targets to defend or flip seats.

### 4. Simulations & War Room
- **Scenario Modeler**: Real-time swing models adjusting community/caste sentiment (Kapu, Kamma, Reddy, BC, SC, ST, Minorities).
- **Ground Crisis Modifiers**: Model local anti-incumbency, welfare grievance friction, and welfare delivery shifts.
- **Turnout Sensitivity Suite**: Urban vs. rural differential turnout impact analysis.

### 5. Actions & Strategic Playbook
- **Resource Point Allocator**: Constrained budget allocation across Digital, Rally, and Ground Campaign levers.
- **Star Campaigner Allocator**: Optimal strategic deployment of key leadership across frontline battlegrounds.
- **Defection & Rebel Candidate Modeler**: Simulate vote-splitting dynamics when former MLAs or local leaders run as independents or switch allegiances.

---

## Dataset Architecture

All production datasets reside in `public/data/`:

| File / Directory | Description |
|---|---|
| `andhra_assembly.geojson` | Exact boundary polygons for all 175 Assembly Constituencies |
| `andhra_districts.geojson` | Boundary polygons for all 26 Andhra Pradesh districts |
| `andhra_elections.json` | Certified election results for 2014, 2019, and 2024 |
| `andhra_candidates_2024.json` | Complete MyNeta ADR affidavits for all 2,368 candidates |
| `andhra_voters_info_2024.json` | Official ECI 2024 Form-12 voter info, total electors, male/female turnout, NOTA, postal and valid votes for all 175 ACs |
| `andhra_demographics.json` | Andhra Pradesh demographic estimates and community census weightings |
| `booths/ac_{acNo}.json` | Authentic ECI polling station coordinates and Form-20 returns |
| `rolls/` | Form-20 polling station roll data |

---

## Tech Stack

- **Framework**: React 19, TypeScript
- **Bundler & Tooling**: Vite 8, Rolldown, Oxlint
- **Styling**: Tailwind CSS v4
- **Geospatial & Mapping**: Leaflet, @turf/turf
- **Icons**: Lucide React
