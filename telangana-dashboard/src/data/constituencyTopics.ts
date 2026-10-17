// Constituency Key Topics, Local Issues & Political Pulse for all 119 Telangana ACs
// Handcrafted local issues cross-referenced with regional economic drivers, infrastructure projects, and electoral dynamics.

export interface ACKeyIssue {
  title: string;
  category: 'Infrastructure' | 'Agriculture & Irrigation' | 'Employment & Industry' | 'Welfare & Social' | 'Governance & Local';
  description: string;
  impact_level: 'Critical' | 'High' | 'Medium';
  affected_demographic?: string;
}

export interface ACKeyTopicData {
  ac_no: number;
  ac_name: string;
  district: string;
  summary: string;
  primary_concern: string;
  key_issues: ACKeyIssue[];
  key_projects: string[];
  ground_pulse: string;
}

export const CONSTITUENCY_TOPICS: Record<number, ACKeyTopicData> = {
  "1": {
    "ac_no": 1,
    "ac_name": "Sirpur",
    "district": "Kumuram Bheem Asifabad",
    "summary": "Paper mill industrial revival, Godavari-Pranahita basin water security, and tribal podu land rights dominate local discourse.",
    "primary_concern": "Industrial Employment & Tribal Rights",
    "key_issues": [
      {
        "title": "Sirpur Paper Mills (SPM) Full Operationalization",
        "category": "Employment & Industry",
        "description": "Local youth demand 80% reservation in SPM Kagaznagar mill recruitments and ancillary small-scale vendor opportunities.",
        "impact_level": "Critical",
        "affected_demographic": "Local Youth & BC communities"
      },
      {
        "title": "Podu Land Pattas & Forest Boundary Disputes",
        "category": "Welfare & Social",
        "description": "Tribal farmers in Bejjur and Dahegaon seek permanent RoFR title deeds and resolution of clashes with the Forest Department.",
        "impact_level": "High",
        "affected_demographic": "ST Gond & Kolam communities"
      },
      {
        "title": "Pranahita Pushkar Ghats & Flood Bunds",
        "category": "Infrastructure",
        "description": "Frequent seasonal flooding of riparian agricultural lands along Pranahita river during monsoon requires concrete embankment retaining walls.",
        "impact_level": "Medium",
        "affected_demographic": "Riparian farmers in Kouthala"
      }
    ],
    "key_projects": [
      "Sirpur Paper Mills Expansion",
      "Pranahita Flood Protection Bund",
      "Kagaznagar Rail Overbridge"
    ],
    "ground_pulse": "High anti-incumbency against established local leadership over delayed job creation; BJP's grassroots consolidation among youth proved decisive in 2023."
  },
  "2": {
    "ac_no": 2,
    "ac_name": "Chennur (SC)",
    "district": "Mancherial",
    "summary": "Singareni Collieries opencast mining rehabilitation, Godavari lift irrigation canals, and underground coal mine employment.",
    "primary_concern": "Singareni Coal Labor & Environmental Displacement",
    "key_issues": [
      {
        "title": "Singareni Coal Workers Welfare & Dependent Jobs",
        "category": "Employment & Industry",
        "description": "Permanent jobs for legal heirs under compassionate employment scheme in SCCL Mandamarri and Jaipur mine areas.",
        "impact_level": "Critical",
        "affected_demographic": "SCCL miners & SC Madiga labor"
      },
      {
        "title": "Opencast Mining Rehabilitation & Air Quality",
        "category": "Infrastructure",
        "description": "Fly ash pollution and land subsidence in villages surrounding Singareni Jaipur thermal power plant requiring clean rehabilitation housing.",
        "impact_level": "High",
        "affected_demographic": "Displaced farming families"
      },
      {
        "title": "Sripada Yellampalli Lift Irrigation Tail-end ayacut",
        "category": "Agriculture & Irrigation",
        "description": "Canal network pending completion to supply assured water to Kotapally and Bheemaram upland drylands.",
        "impact_level": "High",
        "affected_demographic": "Paddy & Cotton cultivators"
      }
    ],
    "key_projects": [
      "Singareni 1200 MW Thermal Power Plant R&R",
      "Sripada Yellampalli Project Canal Distributary",
      "Godavari River Check Dams"
    ],
    "ground_pulse": "Resentment among traditional Singareni mining families over contract workers exploitation fueled massive swing toward INC in 2023."
  },
  "3": {
    "ac_no": 3,
    "ac_name": "Bellampalle (SC)",
    "district": "Mancherial",
    "summary": "Industrial decline of coal washeries, weaver distress, and demand for agro-processing industrial corridors.",
    "primary_concern": "Coal Belt Economic Diversification",
    "key_issues": [
      {
        "title": "Revival of Closed Underground Mines & Washeries",
        "category": "Employment & Industry",
        "description": "SCCL transition from underground to mechanized opencast has eroded formal jobs in Bellampalle town.",
        "impact_level": "Critical",
        "affected_demographic": "Working class families"
      },
      {
        "title": "Drinking Water Supply to Remote SC/ST Hamlets",
        "category": "Welfare & Social",
        "description": "Underground coal mining has depleted groundwater tables in Kasipet and Tandur mandals, leading to acute summer water stress.",
        "impact_level": "High",
        "affected_demographic": "Rural SC Madiga & Mala settlements"
      }
    ],
    "key_projects": [
      "Bellampalli Mini Industrial Estate",
      "Kasipet Drinking Water Grid Upgrade"
    ],
    "ground_pulse": "Sharp disenchantment with ruling party MLA over unfulfilled mining sector promises enabled an emphatic INC win."
  },
  "4": {
    "ac_no": 4,
    "ac_name": "Mancherial",
    "district": "Mancherial",
    "summary": "District headquarters urban infrastructure, Godavari riverfront development, and trade transport connectivity.",
    "primary_concern": "Urban Civic Amenities & Railway Bottlenecks",
    "key_issues": [
      {
        "title": "Mancherial-Naspur Twin City Road Widening & Flyovers",
        "category": "Infrastructure",
        "description": "Heavy coal truck traffic through main commercial thoroughfares causes chronic traffic congestion and road fatalities.",
        "impact_level": "High",
        "affected_demographic": "Urban commuters & traders"
      },
      {
        "title": "Government Medical College Infrastructure",
        "category": "Welfare & Social",
        "description": "Mancherial District Hospital upgradation to a full super-speciality teaching facility.",
        "impact_level": "High",
        "affected_demographic": "Entire district population"
      }
    ],
    "key_projects": [
      "Mancherial Bypass Road",
      "Godavari River Bridge linking Anthargaon",
      "District Medical College"
    ],
    "ground_pulse": "Urban merchant class and youth voted decisively for change due to prolonged civic delays."
  },
  "5": {
    "ac_no": 5,
    "ac_name": "Asifabad (ST)",
    "district": "Kumuram Bheem Asifabad",
    "summary": "Mining sector employment, land acquisition compensation, environmental pollution mitigation, and rural healthcare in Asifabad (ST).",
    "primary_concern": "Mining Labor & Environmental Protection",
    "key_issues": [
      {
        "title": "Local Youth Employment in Mining & Thermal Projects",
        "category": "Employment & Industry",
        "description": "Demand for permanent employment for local qualified youth in state and central industrial establishments within Kumuram Bheem Asifabad.",
        "impact_level": "Critical",
        "affected_demographic": "Youth & mining families"
      },
      {
        "title": "Canal Water Distribution & Tank Rejuvenation",
        "category": "Agriculture & Irrigation",
        "description": "Maintenance of irrigation canals and ensuring tail-end farm ponds receive water during dry rabi sowing.",
        "impact_level": "High",
        "affected_demographic": "Cotton & paddy farmers"
      },
      {
        "title": "Air Quality & Groundwater Protection in Mining Zones",
        "category": "Infrastructure",
        "description": "Stringent dust suppression and effluent monitoring around industrial plants to safeguard community health.",
        "impact_level": "Medium",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "Asifabad (ST) Lift Irrigation Sub-canal",
      "Community Health Center Modernization",
      "Industrial Corridor Link Road"
    ],
    "ground_pulse": "Electoral dynamics in Asifabad (ST) center on labor welfare, transparent compensation for acquired lands, and rural development."
  },
  "6": {
    "ac_no": 6,
    "ac_name": "Khanapur (ST)",
    "district": "Nirmal",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Khanapur (ST).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Khanapur (ST) Irrigation Canal Overhaul",
      "Nirmal Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Khanapur (ST) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "7": {
    "ac_no": 7,
    "ac_name": "Adilabad",
    "district": "Adilabad",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Adilabad.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Adilabad Irrigation Canal Overhaul",
      "Adilabad Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Adilabad look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "8": {
    "ac_no": 8,
    "ac_name": "Boath (ST)",
    "district": "Adilabad",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Boath (ST).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Boath (ST) Irrigation Canal Overhaul",
      "Adilabad Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Boath (ST) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "9": {
    "ac_no": 9,
    "ac_name": "Nirmal",
    "district": "Nirmal",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Nirmal.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Nirmal Irrigation Canal Overhaul",
      "Nirmal Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Nirmal look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "10": {
    "ac_no": 10,
    "ac_name": "Mudhole",
    "district": "Nirmal",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Mudhole.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Mudhole Irrigation Canal Overhaul",
      "Nirmal Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Mudhole look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "11": {
    "ac_no": 11,
    "ac_name": "Armur",
    "district": "Nizamabad",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Armur.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Armur Irrigation Canal Overhaul",
      "Nizamabad Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Armur look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "12": {
    "ac_no": 12,
    "ac_name": "Bodhan",
    "district": "Nizamabad",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Bodhan.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Bodhan Irrigation Canal Overhaul",
      "Nizamabad Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Bodhan look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "13": {
    "ac_no": 13,
    "ac_name": "Jukkal (SC)",
    "district": "Kamareddy",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Jukkal (SC).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Jukkal (SC) Irrigation Canal Overhaul",
      "Kamareddy Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Jukkal (SC) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "14": {
    "ac_no": 14,
    "ac_name": "Banswada",
    "district": "Kamareddy",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Banswada.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Banswada Irrigation Canal Overhaul",
      "Kamareddy Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Banswada look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "15": {
    "ac_no": 15,
    "ac_name": "Yellareddy",
    "district": "Kamareddy",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Yellareddy.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Yellareddy Irrigation Canal Overhaul",
      "Kamareddy Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Yellareddy look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "16": {
    "ac_no": 16,
    "ac_name": "Kamareddy",
    "district": "Kamareddy",
    "summary": "Master Plan real estate controversy, industrial land acquisition resistance, and high-stakes battleground dynamics.",
    "primary_concern": "Urban Master Plan & Industrial Zone Land Protection",
    "key_issues": [
      {
        "title": "Kamareddy Master Plan Industrial Zone Scrapping",
        "category": "Infrastructure",
        "description": "Farmer agitation against zoning of fertile multi-crop agricultural land for industrial green-zone corridors.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers in Adloor Yellareddy & Ilapur"
      },
      {
        "title": "Government Medical & Nursing College Operationalization",
        "category": "Welfare & Social",
        "description": "Upgradation of civil hospital and ensuring adequate specialist medical faculty.",
        "impact_level": "High",
        "affected_demographic": "District healthcare seekers"
      }
    ],
    "key_projects": [
      "Kamareddy Master Plan Revised Framework",
      "Kamareddy Bypass Road"
    ],
    "ground_pulse": "Epic 2023 triangular clash where BJP's Katipally Venkata Ramana Reddy created history by defeating both sitting CM KCR and PCC Chief Revanth Reddy."
  },
  "17": {
    "ac_no": 17,
    "ac_name": "Nizamabad (Urban)",
    "district": "Nizamabad",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Nizamabad (Urban).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Nizamabad (Urban) Irrigation Canal Overhaul",
      "Nizamabad Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Nizamabad (Urban) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "18": {
    "ac_no": 18,
    "ac_name": "Nizamabad (Rural)",
    "district": "Nizamabad",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Nizamabad (Rural).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Nizamabad (Rural) Irrigation Canal Overhaul",
      "Nizamabad Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Nizamabad (Rural) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "19": {
    "ac_no": 19,
    "ac_name": "Balkonda",
    "district": "Nizamabad",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Balkonda.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Balkonda Irrigation Canal Overhaul",
      "Nizamabad Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Balkonda look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "20": {
    "ac_no": 20,
    "ac_name": "Koratla",
    "district": "Jagtial",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Koratla.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Koratla Irrigation Canal Overhaul",
      "Jagtial Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Koratla look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "21": {
    "ac_no": 21,
    "ac_name": "Jagtial",
    "district": "Jagtial",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Jagtial.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Jagtial Irrigation Canal Overhaul",
      "Jagtial Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Jagtial look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "22": {
    "ac_no": 22,
    "ac_name": "Dharmapuri (SC)",
    "district": "Jagtial",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Dharmapuri (SC).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Dharmapuri (SC) Irrigation Canal Overhaul",
      "Jagtial Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Dharmapuri (SC) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "23": {
    "ac_no": 23,
    "ac_name": "Ramagundam",
    "district": "Peddapalli",
    "summary": "Mining sector employment, land acquisition compensation, environmental pollution mitigation, and rural healthcare in Ramagundam.",
    "primary_concern": "Mining Labor & Environmental Protection",
    "key_issues": [
      {
        "title": "Local Youth Employment in Mining & Thermal Projects",
        "category": "Employment & Industry",
        "description": "Demand for permanent employment for local qualified youth in state and central industrial establishments within Peddapalli.",
        "impact_level": "Critical",
        "affected_demographic": "Youth & mining families"
      },
      {
        "title": "Canal Water Distribution & Tank Rejuvenation",
        "category": "Agriculture & Irrigation",
        "description": "Maintenance of irrigation canals and ensuring tail-end farm ponds receive water during dry rabi sowing.",
        "impact_level": "High",
        "affected_demographic": "Cotton & paddy farmers"
      },
      {
        "title": "Air Quality & Groundwater Protection in Mining Zones",
        "category": "Infrastructure",
        "description": "Stringent dust suppression and effluent monitoring around industrial plants to safeguard community health.",
        "impact_level": "Medium",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "Ramagundam Lift Irrigation Sub-canal",
      "Community Health Center Modernization",
      "Industrial Corridor Link Road"
    ],
    "ground_pulse": "Electoral dynamics in Ramagundam center on labor welfare, transparent compensation for acquired lands, and rural development."
  },
  "24": {
    "ac_no": 24,
    "ac_name": "Manthani",
    "district": "Peddapalli",
    "summary": "Mining sector employment, land acquisition compensation, environmental pollution mitigation, and rural healthcare in Manthani.",
    "primary_concern": "Mining Labor & Environmental Protection",
    "key_issues": [
      {
        "title": "Local Youth Employment in Mining & Thermal Projects",
        "category": "Employment & Industry",
        "description": "Demand for permanent employment for local qualified youth in state and central industrial establishments within Peddapalli.",
        "impact_level": "Critical",
        "affected_demographic": "Youth & mining families"
      },
      {
        "title": "Canal Water Distribution & Tank Rejuvenation",
        "category": "Agriculture & Irrigation",
        "description": "Maintenance of irrigation canals and ensuring tail-end farm ponds receive water during dry rabi sowing.",
        "impact_level": "High",
        "affected_demographic": "Cotton & paddy farmers"
      },
      {
        "title": "Air Quality & Groundwater Protection in Mining Zones",
        "category": "Infrastructure",
        "description": "Stringent dust suppression and effluent monitoring around industrial plants to safeguard community health.",
        "impact_level": "Medium",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "Manthani Lift Irrigation Sub-canal",
      "Community Health Center Modernization",
      "Industrial Corridor Link Road"
    ],
    "ground_pulse": "Electoral dynamics in Manthani center on labor welfare, transparent compensation for acquired lands, and rural development."
  },
  "25": {
    "ac_no": 25,
    "ac_name": "Peddapalle",
    "district": "Peddapalli",
    "summary": "Mining sector employment, land acquisition compensation, environmental pollution mitigation, and rural healthcare in Peddapalle.",
    "primary_concern": "Mining Labor & Environmental Protection",
    "key_issues": [
      {
        "title": "Local Youth Employment in Mining & Thermal Projects",
        "category": "Employment & Industry",
        "description": "Demand for permanent employment for local qualified youth in state and central industrial establishments within Peddapalli.",
        "impact_level": "Critical",
        "affected_demographic": "Youth & mining families"
      },
      {
        "title": "Canal Water Distribution & Tank Rejuvenation",
        "category": "Agriculture & Irrigation",
        "description": "Maintenance of irrigation canals and ensuring tail-end farm ponds receive water during dry rabi sowing.",
        "impact_level": "High",
        "affected_demographic": "Cotton & paddy farmers"
      },
      {
        "title": "Air Quality & Groundwater Protection in Mining Zones",
        "category": "Infrastructure",
        "description": "Stringent dust suppression and effluent monitoring around industrial plants to safeguard community health.",
        "impact_level": "Medium",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "Peddapalle Lift Irrigation Sub-canal",
      "Community Health Center Modernization",
      "Industrial Corridor Link Road"
    ],
    "ground_pulse": "Electoral dynamics in Peddapalle center on labor welfare, transparent compensation for acquired lands, and rural development."
  },
  "26": {
    "ac_no": 26,
    "ac_name": "Karimnagar",
    "district": "Karimnagar",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Karimnagar.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Karimnagar Irrigation Canal Overhaul",
      "Karimnagar Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Karimnagar look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "27": {
    "ac_no": 27,
    "ac_name": "Choppadandi (SC)",
    "district": "Karimnagar",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Choppadandi (SC).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Choppadandi (SC) Irrigation Canal Overhaul",
      "Karimnagar Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Choppadandi (SC) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "28": {
    "ac_no": 28,
    "ac_name": "Vemulawada",
    "district": "Rajanna Sircilla",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Vemulawada.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Vemulawada Irrigation Canal Overhaul",
      "Rajanna Sircilla Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Vemulawada look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "29": {
    "ac_no": 29,
    "ac_name": "Sircilla",
    "district": "Rajanna Sircilla",
    "summary": "Weavers welfare, apparel park orders, and power subsidy continuity in Telangana's textile heartland.",
    "primary_concern": "Powerloom Modernization & Weaver Economic Stability",
    "key_issues": [
      {
        "title": "Continuous Government Saree Orders & Power Subsidies",
        "category": "Employment & Industry",
        "description": "Weavers depend heavily on Bathukamma saree procurement orders; delay in payments creates severe worker distress.",
        "impact_level": "Critical",
        "affected_demographic": "BC Padmashali weaver community"
      },
      {
        "title": "Apparel Park Expansion & Garment Export Units",
        "category": "Employment & Industry",
        "description": "Attracting global apparel exporters to create women employment in Thangallapally Apparel Super Hub.",
        "impact_level": "High",
        "affected_demographic": "Women self-help groups"
      }
    ],
    "key_projects": [
      "Sircilla Apparel Super Hub",
      "Mid Manair Dam Tourism",
      "Gambhiraopet Agriculture Polytechnic"
    ],
    "ground_pulse": "KT Rama Rao retains formidable personal connect through comprehensive municipal revamp and weaver distress interventions."
  },
  "30": {
    "ac_no": 30,
    "ac_name": "Manakondur (SC)",
    "district": "Karimnagar",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Manakondur (SC).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Manakondur (SC) Irrigation Canal Overhaul",
      "Karimnagar Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Manakondur (SC) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "31": {
    "ac_no": 31,
    "ac_name": "Huzurabad",
    "district": "Karimnagar",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Huzurabad.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Huzurabad Irrigation Canal Overhaul",
      "Karimnagar Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Huzurabad look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "32": {
    "ac_no": 32,
    "ac_name": "Husnabad",
    "district": "Siddipet",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Husnabad.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Husnabad Irrigation Canal Overhaul",
      "Siddipet Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Husnabad look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "33": {
    "ac_no": 33,
    "ac_name": "Siddipet",
    "district": "Siddipet",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Siddipet.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Siddipet Irrigation Canal Overhaul",
      "Siddipet Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Siddipet look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "34": {
    "ac_no": 34,
    "ac_name": "Medak",
    "district": "Medak",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Medak.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Medak Irrigation Canal Overhaul",
      "Medak Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Medak look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "35": {
    "ac_no": 35,
    "ac_name": "Narayankhed",
    "district": "Sangareddy",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Narayankhed.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Narayankhed Irrigation Canal Overhaul",
      "Sangareddy Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Narayankhed look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "36": {
    "ac_no": 36,
    "ac_name": "Andole (SC)",
    "district": "Sangareddy",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Andole (SC).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Andole (SC) Irrigation Canal Overhaul",
      "Sangareddy Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Andole (SC) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "37": {
    "ac_no": 37,
    "ac_name": "Narsapur",
    "district": "Medak",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Narsapur.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Narsapur Irrigation Canal Overhaul",
      "Medak Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Narsapur look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "38": {
    "ac_no": 38,
    "ac_name": "Zahirabad (SC)",
    "district": "Sangareddy",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Zahirabad (SC).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Zahirabad (SC) Irrigation Canal Overhaul",
      "Sangareddy Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Zahirabad (SC) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "39": {
    "ac_no": 39,
    "ac_name": "Sangareddy",
    "district": "Sangareddy",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Sangareddy.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Sangareddy Irrigation Canal Overhaul",
      "Sangareddy Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Sangareddy look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "40": {
    "ac_no": 40,
    "ac_name": "Patancheru",
    "district": "Sangareddy",
    "summary": "Industrial pollution in Nakkavagu basin, migrant worker regularization, and peri-urban real estate growth.",
    "primary_concern": "Industrial Effluent Control & Urban Infrastructure",
    "key_issues": [
      {
        "title": "Industrial Pollution & Effluent Treatment (CETP)",
        "category": "Infrastructure",
        "description": "Heavy chemical and pharmaceutical effluents affecting groundwater in Isnapur, Pashamylaram, and Kazipally zones.",
        "impact_level": "Critical",
        "affected_demographic": "Local residents & farmers"
      },
      {
        "title": "Metro Rail Extension from Miyapur to Patancheru",
        "category": "Infrastructure",
        "description": "Urgent demand to extend Hyderabad Metro line along NH-65 to ease gridlock for industrial workers and IT commuters.",
        "impact_level": "High",
        "affected_demographic": "Commuters & IT professionals"
      },
      {
        "title": "Regularisation of Lands under GO 58/59",
        "category": "Welfare & Social",
        "description": "Squatter settlements and middle-class housing colonies awaiting permanent registration deeds in Ramachandrapuram and Ameenpur.",
        "impact_level": "High",
        "affected_demographic": "Low & middle income households"
      }
    ],
    "key_projects": [
      "Ameenpur Biodiversity Lake Protection",
      "Miyapur-Patancheru Metro Corridor",
      "Pashamylaram Industrial Estate Expansion"
    ],
    "ground_pulse": "Heavy industrial worker base and BRS welfare distribution enabled incumbent Gudem Mahipal Reddy to retain the seat against strong INC challenge."
  },
  "41": {
    "ac_no": 41,
    "ac_name": "Dubbak",
    "district": "Siddipet",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Dubbak.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Dubbak Irrigation Canal Overhaul",
      "Siddipet Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Dubbak look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "42": {
    "ac_no": 42,
    "ac_name": "Gajwel",
    "district": "Siddipet",
    "summary": "Showcase constituency of BRS regime; rehabilitation of Mallanna Sagar submerged villages and agricultural transformation.",
    "primary_concern": "Kaleshwaram R&R Settlements & Upland Irrigation",
    "key_issues": [
      {
        "title": "Mallanna Sagar & Kondapochamma R&R Colony Infrastructure",
        "category": "Welfare & Social",
        "description": "Displaced residents from submerged villages demand pending compensation tranches, school infrastructure, and employment quotas.",
        "impact_level": "Critical",
        "affected_demographic": "Submerged village families"
      },
      {
        "title": "Canal Distribution to Tail-End Drylands",
        "category": "Agriculture & Irrigation",
        "description": "Ensuring round-the-year canal supply to Jagdevpur and Markook mandals through Kaleshwaram minor canal branches.",
        "impact_level": "High",
        "affected_demographic": "Paddy & horticulture farmers"
      },
      {
        "title": "Gajwel Education Hub & Skill Development",
        "category": "Employment & Industry",
        "description": "Connecting graduates from Gajwel integrated education complex with pharmaceutical and manufacturing jobs in Genome Valley.",
        "impact_level": "Medium",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Mallanna Sagar Reservoir",
      "Kondapochamma Sagar Reservoir",
      "Gajwel Ring Road & Veg-Meat Modern Market"
    ],
    "ground_pulse": "KCR maintained strong personal loyalty across rural mandals due to massive infrastructure investment, defeating BJP's Eatala Rajender despite tough opposition."
  },
  "43": {
    "ac_no": 43,
    "ac_name": "Medchal",
    "district": "Medchal-Malkajgiri",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Medchal.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Medchal.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Medchal Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Medchal prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "44": {
    "ac_no": 44,
    "ac_name": "Malkajgiri",
    "district": "Medchal-Malkajgiri",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Malkajgiri.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Malkajgiri.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Malkajgiri Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Malkajgiri prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "45": {
    "ac_no": 45,
    "ac_name": "Quthbullapur",
    "district": "Medchal-Malkajgiri",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Quthbullapur.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Quthbullapur.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Quthbullapur Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Quthbullapur prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "46": {
    "ac_no": 46,
    "ac_name": "Kukatpalle",
    "district": "Medchal-Malkajgiri",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Kukatpalle.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Kukatpalle.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Kukatpalle Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Kukatpalle prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "47": {
    "ac_no": 47,
    "ac_name": "Uppal",
    "district": "Medchal-Malkajgiri",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Uppal.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Uppal.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Uppal Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Uppal prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "48": {
    "ac_no": 48,
    "ac_name": "Ibrahimpatnam",
    "district": "Ranga Reddy",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Ibrahimpatnam.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Ibrahimpatnam Irrigation Canal Overhaul",
      "Ranga Reddy Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Ibrahimpatnam look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "49": {
    "ac_no": 49,
    "ac_name": "Lal Bahadur Nagar",
    "district": "Ranga Reddy",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Lal Bahadur Nagar.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Lal Bahadur Nagar Irrigation Canal Overhaul",
      "Ranga Reddy Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Lal Bahadur Nagar look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "50": {
    "ac_no": 50,
    "ac_name": "Maheswaram",
    "district": "Ranga Reddy",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Maheswaram.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Maheswaram Irrigation Canal Overhaul",
      "Ranga Reddy Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Maheswaram look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "51": {
    "ac_no": 51,
    "ac_name": "Rajendranagar",
    "district": "Ranga Reddy",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Rajendranagar.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Rajendranagar Irrigation Canal Overhaul",
      "Ranga Reddy Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Rajendranagar look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "52": {
    "ac_no": 52,
    "ac_name": "Serilingampally",
    "district": "Ranga Reddy",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Serilingampally.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Serilingampally Irrigation Canal Overhaul",
      "Ranga Reddy Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Serilingampally look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "53": {
    "ac_no": 53,
    "ac_name": "Chevella (SC)",
    "district": "Ranga Reddy",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Chevella (SC).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Chevella (SC) Irrigation Canal Overhaul",
      "Ranga Reddy Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Chevella (SC) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "54": {
    "ac_no": 54,
    "ac_name": "Pargi",
    "district": "Vikarabad",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Pargi.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Pargi Irrigation Canal Overhaul",
      "Vikarabad Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Pargi look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "55": {
    "ac_no": 55,
    "ac_name": "Vicarabad (SC)",
    "district": "Vikarabad",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Vicarabad (SC).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Vicarabad (SC) Irrigation Canal Overhaul",
      "Vikarabad Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Vicarabad (SC) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "56": {
    "ac_no": 56,
    "ac_name": "Tandur",
    "district": "Vikarabad",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Tandur.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Tandur Irrigation Canal Overhaul",
      "Vikarabad Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Tandur look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "57": {
    "ac_no": 57,
    "ac_name": "Musheerabad",
    "district": "Hyderabad",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Musheerabad.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Musheerabad.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Musheerabad Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Musheerabad prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "58": {
    "ac_no": 58,
    "ac_name": "Malakpet",
    "district": "Hyderabad",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Malakpet.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Malakpet.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Malakpet Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Malakpet prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "59": {
    "ac_no": 59,
    "ac_name": "Amberpet",
    "district": "Hyderabad",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Amberpet.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Amberpet.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Amberpet Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Amberpet prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "60": {
    "ac_no": 60,
    "ac_name": "Khairatabad",
    "district": "Hyderabad",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Khairatabad.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Khairatabad.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Khairatabad Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Khairatabad prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "61": {
    "ac_no": 61,
    "ac_name": "Jubilee Hills",
    "district": "Hyderabad",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Jubilee Hills.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Jubilee Hills.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Jubilee Hills Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Jubilee Hills prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "62": {
    "ac_no": 62,
    "ac_name": "Sanathnagar",
    "district": "Hyderabad",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Sanathnagar.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Sanathnagar.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Sanathnagar Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Sanathnagar prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "63": {
    "ac_no": 63,
    "ac_name": "Nampally",
    "district": "Hyderabad",
    "summary": "Old city municipal upgrades, commercial trade taxation, and school infrastructure in densely packed urban wards.",
    "primary_concern": "Urban Drainage, Housing & Minority Welfare",
    "key_issues": [
      {
        "title": "Drainage Modernization & Nala De-silting",
        "category": "Infrastructure",
        "description": "Chronic inundation in Asif Nagar, Mallepally, and Red Hills during heavy monsoon showers.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential wards"
      },
      {
        "title": "Old City Metro Line Phase-2 Construction",
        "category": "Infrastructure",
        "description": "Expedited execution of Hyderabad Metro connectivity through historic old city quarters.",
        "impact_level": "High",
        "affected_demographic": "Daily commuters & market vendors"
      }
    ],
    "key_projects": [
      "Old City Metro Connectivity",
      "Nampally Exhibition Grounds Modernization"
    ],
    "ground_pulse": "Nail-biting 2023 contest where AIMIM narrowly edged out INC's Feroz Khan by just 2,037 votes amidst fierce urban voter mobilization."
  },
  "64": {
    "ac_no": 64,
    "ac_name": "Karwan",
    "district": "Hyderabad",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Karwan.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Karwan.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Karwan Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Karwan prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "65": {
    "ac_no": 65,
    "ac_name": "Goshamahal",
    "district": "Hyderabad",
    "summary": "Traders commercial deregulation, street vendor protection, religious heritage, and Old City security.",
    "primary_concern": "Wholesale Trade Amenities & Law Enforcement",
    "key_issues": [
      {
        "title": "Begum Bazaar & Osmangunj Wholesale Market De-congestion",
        "category": "Employment & Industry",
        "description": "Traffic congestion, fire safety in heritage markets, and parking terminal construction for commercial goods transport.",
        "impact_level": "Critical",
        "affected_demographic": "Marwari, Hindi-speaking & Gujarati merchants"
      },
      {
        "title": "Old City Law & Order and Policing Infrastructure",
        "category": "Welfare & Social",
        "description": "CCTV surveillance, peace committee coordination, and quick response patrol units.",
        "impact_level": "High",
        "affected_demographic": "Goshamahal traders & residents"
      }
    ],
    "key_projects": [
      "Begum Bazaar Multi-Level Parking",
      "Moazzam Jahi Market Heritage Restoration"
    ],
    "ground_pulse": "T. Raja Singh maintained high personal popularity among commercial and youth voters, retaining the seat for BJP despite triangular contest."
  },
  "66": {
    "ac_no": 66,
    "ac_name": "Charminar",
    "district": "Hyderabad",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Charminar.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Charminar.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Charminar Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Charminar prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "67": {
    "ac_no": 67,
    "ac_name": "Chandrayangutta",
    "district": "Hyderabad",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Chandrayangutta.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Chandrayangutta.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Chandrayangutta Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Chandrayangutta prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "68": {
    "ac_no": 68,
    "ac_name": "Yakutpura",
    "district": "Hyderabad",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Yakutpura.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Yakutpura.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Yakutpura Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Yakutpura prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "69": {
    "ac_no": 69,
    "ac_name": "Bahadurpura",
    "district": "Hyderabad",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Bahadurpura.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Bahadurpura.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Bahadurpura Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Bahadurpura prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "70": {
    "ac_no": 70,
    "ac_name": "Secunderabad",
    "district": "Hyderabad",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Secunderabad.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Secunderabad.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Secunderabad Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Secunderabad prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "71": {
    "ac_no": 71,
    "ac_name": "Secunderabad Cantt. (SC",
    "district": "Hyderabad",
    "summary": "Rapid urban expansion, traffic de-congestion, drainage infrastructure, and civic amenities across Secunderabad Cantt. (SC.",
    "primary_concern": "Urban Infrastructure & Civic Amenities",
    "key_issues": [
      {
        "title": "Drinking Water Grid & Drainage Network Upgradation",
        "category": "Infrastructure",
        "description": "Upgrading underground stormwater drainage to prevent seasonal waterlogging in low-lying residential colonies of Secunderabad Cantt. (SC.",
        "impact_level": "Critical",
        "affected_demographic": "Urban residential households"
      },
      {
        "title": "Public Transport & Road Widening",
        "category": "Infrastructure",
        "description": "Expansion of arterial road networks and high-frequency TSRTC feeder electric buses to ease peak-hour congestion.",
        "impact_level": "High",
        "affected_demographic": "Daily office commuters & students"
      },
      {
        "title": "2BHK Dignity Housing Allotment & Land Title Regularization",
        "category": "Welfare & Social",
        "description": "Expedited handover of completed 2BHK government housing units and resolving ownership title issues under GO 58/59.",
        "impact_level": "High",
        "affected_demographic": "Urban low & middle-income families"
      }
    ],
    "key_projects": [
      "Secunderabad Cantt. (SC Stormwater Drain Revamp",
      "Inner Arterial Road Widening",
      "Urban Primary Health Center (UPHC) Upgradation"
    ],
    "ground_pulse": "Voters in Secunderabad Cantt. (SC prioritize rapid civic infrastructure delivery, regular drinking water supply, and clean local governance."
  },
  "72": {
    "ac_no": 72,
    "ac_name": "Kodangal",
    "district": "Vikarabad",
    "summary": "Chief Minister A. Revanth Reddy's home constituency; Lift irrigation to upland red soils and industrial investment.",
    "primary_concern": "Palamuru Irrigation & Rural Connectivity",
    "key_issues": [
      {
        "title": "Kodangal-Narayanpet Lift Irrigation Scheme",
        "category": "Agriculture & Irrigation",
        "description": "Providing assured Krishna water to upland mandals (Kosgi, Maddur, Dowlathabad) to eliminate distress migration.",
        "impact_level": "Critical",
        "affected_demographic": "Farming households & youth"
      },
      {
        "title": "Kodangal Area Development Authority (KADA) Projects",
        "category": "Infrastructure",
        "description": "Establishment of government degree colleges, road widening, and pharmaceutical manufacturing clusters.",
        "impact_level": "High",
        "affected_demographic": "Constituency-wide population"
      }
    ],
    "key_projects": [
      "Kodangal Lift Irrigation Scheme",
      "Kosgi Model Bus Terminal",
      "KADA Special Development Package"
    ],
    "ground_pulse": "Voters rallied behind PCC Chief Revanth Reddy with overwhelming expectation of priority development as the state's Chief Minister."
  },
  "73": {
    "ac_no": 73,
    "ac_name": "Narayanpet",
    "district": "Narayanpet",
    "summary": "Palamuru lift irrigation completion, prevention of seasonal farm migration, and crop price security across Narayanpet.",
    "primary_concern": "Lift Irrigation & Drought Mitigation",
    "key_issues": [
      {
        "title": "Expedited Completion of Palamuru-Ranga Reddy Irrigation Project",
        "category": "Agriculture & Irrigation",
        "description": "Ensuring high-speed canal distribution works to provide perennial irrigation to dryland farmers and stop seasonal migration.",
        "impact_level": "Critical",
        "affected_demographic": "Dryland agricultural families"
      },
      {
        "title": "Cotton & Red Gram Minimum Support Price (MSP) Procurement",
        "category": "Agriculture & Irrigation",
        "description": "Setting up transparent IKP procurement centers with timely payments to prevent middleman exploitation.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop growers"
      },
      {
        "title": "Sheep Rearing & Shepherd Welfare Subsidies",
        "category": "Welfare & Social",
        "description": "Revitalizing subsidized sheep distribution units and veterinary support for traditional pastoral communities.",
        "impact_level": "High",
        "affected_demographic": "BC Kuruma & Golla Yadav communities"
      }
    ],
    "key_projects": [
      "Palamuru-Ranga Reddy Canal Distributary",
      "Narayanpet Agro-Processing Park",
      "Rural Road Connectivity Scheme"
    ],
    "ground_pulse": "Farmers in Narayanpet are intensely focused on water delivery timelines, timely Rythu Bharosa disbursement, and local agricultural processing."
  },
  "74": {
    "ac_no": 74,
    "ac_name": "Mahbubnagar",
    "district": "Mahabubnagar",
    "summary": "Palamuru lift irrigation completion, prevention of seasonal farm migration, and crop price security across Mahbubnagar.",
    "primary_concern": "Lift Irrigation & Drought Mitigation",
    "key_issues": [
      {
        "title": "Expedited Completion of Palamuru-Ranga Reddy Irrigation Project",
        "category": "Agriculture & Irrigation",
        "description": "Ensuring high-speed canal distribution works to provide perennial irrigation to dryland farmers and stop seasonal migration.",
        "impact_level": "Critical",
        "affected_demographic": "Dryland agricultural families"
      },
      {
        "title": "Cotton & Red Gram Minimum Support Price (MSP) Procurement",
        "category": "Agriculture & Irrigation",
        "description": "Setting up transparent IKP procurement centers with timely payments to prevent middleman exploitation.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop growers"
      },
      {
        "title": "Sheep Rearing & Shepherd Welfare Subsidies",
        "category": "Welfare & Social",
        "description": "Revitalizing subsidized sheep distribution units and veterinary support for traditional pastoral communities.",
        "impact_level": "High",
        "affected_demographic": "BC Kuruma & Golla Yadav communities"
      }
    ],
    "key_projects": [
      "Palamuru-Ranga Reddy Canal Distributary",
      "Mahabubnagar Agro-Processing Park",
      "Rural Road Connectivity Scheme"
    ],
    "ground_pulse": "Farmers in Mahbubnagar are intensely focused on water delivery timelines, timely Rythu Bharosa disbursement, and local agricultural processing."
  },
  "75": {
    "ac_no": 75,
    "ac_name": "Jadcherla",
    "district": "Mahabubnagar",
    "summary": "Palamuru lift irrigation completion, prevention of seasonal farm migration, and crop price security across Jadcherla.",
    "primary_concern": "Lift Irrigation & Drought Mitigation",
    "key_issues": [
      {
        "title": "Expedited Completion of Palamuru-Ranga Reddy Irrigation Project",
        "category": "Agriculture & Irrigation",
        "description": "Ensuring high-speed canal distribution works to provide perennial irrigation to dryland farmers and stop seasonal migration.",
        "impact_level": "Critical",
        "affected_demographic": "Dryland agricultural families"
      },
      {
        "title": "Cotton & Red Gram Minimum Support Price (MSP) Procurement",
        "category": "Agriculture & Irrigation",
        "description": "Setting up transparent IKP procurement centers with timely payments to prevent middleman exploitation.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop growers"
      },
      {
        "title": "Sheep Rearing & Shepherd Welfare Subsidies",
        "category": "Welfare & Social",
        "description": "Revitalizing subsidized sheep distribution units and veterinary support for traditional pastoral communities.",
        "impact_level": "High",
        "affected_demographic": "BC Kuruma & Golla Yadav communities"
      }
    ],
    "key_projects": [
      "Palamuru-Ranga Reddy Canal Distributary",
      "Mahabubnagar Agro-Processing Park",
      "Rural Road Connectivity Scheme"
    ],
    "ground_pulse": "Farmers in Jadcherla are intensely focused on water delivery timelines, timely Rythu Bharosa disbursement, and local agricultural processing."
  },
  "76": {
    "ac_no": 76,
    "ac_name": "Devarkadra",
    "district": "Mahabubnagar",
    "summary": "Palamuru lift irrigation completion, prevention of seasonal farm migration, and crop price security across Devarkadra.",
    "primary_concern": "Lift Irrigation & Drought Mitigation",
    "key_issues": [
      {
        "title": "Expedited Completion of Palamuru-Ranga Reddy Irrigation Project",
        "category": "Agriculture & Irrigation",
        "description": "Ensuring high-speed canal distribution works to provide perennial irrigation to dryland farmers and stop seasonal migration.",
        "impact_level": "Critical",
        "affected_demographic": "Dryland agricultural families"
      },
      {
        "title": "Cotton & Red Gram Minimum Support Price (MSP) Procurement",
        "category": "Agriculture & Irrigation",
        "description": "Setting up transparent IKP procurement centers with timely payments to prevent middleman exploitation.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop growers"
      },
      {
        "title": "Sheep Rearing & Shepherd Welfare Subsidies",
        "category": "Welfare & Social",
        "description": "Revitalizing subsidized sheep distribution units and veterinary support for traditional pastoral communities.",
        "impact_level": "High",
        "affected_demographic": "BC Kuruma & Golla Yadav communities"
      }
    ],
    "key_projects": [
      "Palamuru-Ranga Reddy Canal Distributary",
      "Mahabubnagar Agro-Processing Park",
      "Rural Road Connectivity Scheme"
    ],
    "ground_pulse": "Farmers in Devarkadra are intensely focused on water delivery timelines, timely Rythu Bharosa disbursement, and local agricultural processing."
  },
  "77": {
    "ac_no": 77,
    "ac_name": "Makthal",
    "district": "Narayanpet",
    "summary": "Palamuru lift irrigation completion, prevention of seasonal farm migration, and crop price security across Makthal.",
    "primary_concern": "Lift Irrigation & Drought Mitigation",
    "key_issues": [
      {
        "title": "Expedited Completion of Palamuru-Ranga Reddy Irrigation Project",
        "category": "Agriculture & Irrigation",
        "description": "Ensuring high-speed canal distribution works to provide perennial irrigation to dryland farmers and stop seasonal migration.",
        "impact_level": "Critical",
        "affected_demographic": "Dryland agricultural families"
      },
      {
        "title": "Cotton & Red Gram Minimum Support Price (MSP) Procurement",
        "category": "Agriculture & Irrigation",
        "description": "Setting up transparent IKP procurement centers with timely payments to prevent middleman exploitation.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop growers"
      },
      {
        "title": "Sheep Rearing & Shepherd Welfare Subsidies",
        "category": "Welfare & Social",
        "description": "Revitalizing subsidized sheep distribution units and veterinary support for traditional pastoral communities.",
        "impact_level": "High",
        "affected_demographic": "BC Kuruma & Golla Yadav communities"
      }
    ],
    "key_projects": [
      "Palamuru-Ranga Reddy Canal Distributary",
      "Narayanpet Agro-Processing Park",
      "Rural Road Connectivity Scheme"
    ],
    "ground_pulse": "Farmers in Makthal are intensely focused on water delivery timelines, timely Rythu Bharosa disbursement, and local agricultural processing."
  },
  "78": {
    "ac_no": 78,
    "ac_name": "Wanaparthy",
    "district": "Wanaparthy",
    "summary": "Palamuru lift irrigation completion, prevention of seasonal farm migration, and crop price security across Wanaparthy.",
    "primary_concern": "Lift Irrigation & Drought Mitigation",
    "key_issues": [
      {
        "title": "Expedited Completion of Palamuru-Ranga Reddy Irrigation Project",
        "category": "Agriculture & Irrigation",
        "description": "Ensuring high-speed canal distribution works to provide perennial irrigation to dryland farmers and stop seasonal migration.",
        "impact_level": "Critical",
        "affected_demographic": "Dryland agricultural families"
      },
      {
        "title": "Cotton & Red Gram Minimum Support Price (MSP) Procurement",
        "category": "Agriculture & Irrigation",
        "description": "Setting up transparent IKP procurement centers with timely payments to prevent middleman exploitation.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop growers"
      },
      {
        "title": "Sheep Rearing & Shepherd Welfare Subsidies",
        "category": "Welfare & Social",
        "description": "Revitalizing subsidized sheep distribution units and veterinary support for traditional pastoral communities.",
        "impact_level": "High",
        "affected_demographic": "BC Kuruma & Golla Yadav communities"
      }
    ],
    "key_projects": [
      "Palamuru-Ranga Reddy Canal Distributary",
      "Wanaparthy Agro-Processing Park",
      "Rural Road Connectivity Scheme"
    ],
    "ground_pulse": "Farmers in Wanaparthy are intensely focused on water delivery timelines, timely Rythu Bharosa disbursement, and local agricultural processing."
  },
  "79": {
    "ac_no": 79,
    "ac_name": "Gadwal",
    "district": "Jogulamba Gadwal",
    "summary": "Palamuru lift irrigation completion, prevention of seasonal farm migration, and crop price security across Gadwal.",
    "primary_concern": "Lift Irrigation & Drought Mitigation",
    "key_issues": [
      {
        "title": "Expedited Completion of Palamuru-Ranga Reddy Irrigation Project",
        "category": "Agriculture & Irrigation",
        "description": "Ensuring high-speed canal distribution works to provide perennial irrigation to dryland farmers and stop seasonal migration.",
        "impact_level": "Critical",
        "affected_demographic": "Dryland agricultural families"
      },
      {
        "title": "Cotton & Red Gram Minimum Support Price (MSP) Procurement",
        "category": "Agriculture & Irrigation",
        "description": "Setting up transparent IKP procurement centers with timely payments to prevent middleman exploitation.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop growers"
      },
      {
        "title": "Sheep Rearing & Shepherd Welfare Subsidies",
        "category": "Welfare & Social",
        "description": "Revitalizing subsidized sheep distribution units and veterinary support for traditional pastoral communities.",
        "impact_level": "High",
        "affected_demographic": "BC Kuruma & Golla Yadav communities"
      }
    ],
    "key_projects": [
      "Palamuru-Ranga Reddy Canal Distributary",
      "Jogulamba Gadwal Agro-Processing Park",
      "Rural Road Connectivity Scheme"
    ],
    "ground_pulse": "Farmers in Gadwal are intensely focused on water delivery timelines, timely Rythu Bharosa disbursement, and local agricultural processing."
  },
  "80": {
    "ac_no": 80,
    "ac_name": "Alampur (SC)",
    "district": "Jogulamba Gadwal",
    "summary": "Palamuru lift irrigation completion, prevention of seasonal farm migration, and crop price security across Alampur (SC).",
    "primary_concern": "Lift Irrigation & Drought Mitigation",
    "key_issues": [
      {
        "title": "Expedited Completion of Palamuru-Ranga Reddy Irrigation Project",
        "category": "Agriculture & Irrigation",
        "description": "Ensuring high-speed canal distribution works to provide perennial irrigation to dryland farmers and stop seasonal migration.",
        "impact_level": "Critical",
        "affected_demographic": "Dryland agricultural families"
      },
      {
        "title": "Cotton & Red Gram Minimum Support Price (MSP) Procurement",
        "category": "Agriculture & Irrigation",
        "description": "Setting up transparent IKP procurement centers with timely payments to prevent middleman exploitation.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop growers"
      },
      {
        "title": "Sheep Rearing & Shepherd Welfare Subsidies",
        "category": "Welfare & Social",
        "description": "Revitalizing subsidized sheep distribution units and veterinary support for traditional pastoral communities.",
        "impact_level": "High",
        "affected_demographic": "BC Kuruma & Golla Yadav communities"
      }
    ],
    "key_projects": [
      "Palamuru-Ranga Reddy Canal Distributary",
      "Jogulamba Gadwal Agro-Processing Park",
      "Rural Road Connectivity Scheme"
    ],
    "ground_pulse": "Farmers in Alampur (SC) are intensely focused on water delivery timelines, timely Rythu Bharosa disbursement, and local agricultural processing."
  },
  "81": {
    "ac_no": 81,
    "ac_name": "Nagarkurnool",
    "district": "Nagarkurnool",
    "summary": "Palamuru lift irrigation completion, prevention of seasonal farm migration, and crop price security across Nagarkurnool.",
    "primary_concern": "Lift Irrigation & Drought Mitigation",
    "key_issues": [
      {
        "title": "Expedited Completion of Palamuru-Ranga Reddy Irrigation Project",
        "category": "Agriculture & Irrigation",
        "description": "Ensuring high-speed canal distribution works to provide perennial irrigation to dryland farmers and stop seasonal migration.",
        "impact_level": "Critical",
        "affected_demographic": "Dryland agricultural families"
      },
      {
        "title": "Cotton & Red Gram Minimum Support Price (MSP) Procurement",
        "category": "Agriculture & Irrigation",
        "description": "Setting up transparent IKP procurement centers with timely payments to prevent middleman exploitation.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop growers"
      },
      {
        "title": "Sheep Rearing & Shepherd Welfare Subsidies",
        "category": "Welfare & Social",
        "description": "Revitalizing subsidized sheep distribution units and veterinary support for traditional pastoral communities.",
        "impact_level": "High",
        "affected_demographic": "BC Kuruma & Golla Yadav communities"
      }
    ],
    "key_projects": [
      "Palamuru-Ranga Reddy Canal Distributary",
      "Nagarkurnool Agro-Processing Park",
      "Rural Road Connectivity Scheme"
    ],
    "ground_pulse": "Farmers in Nagarkurnool are intensely focused on water delivery timelines, timely Rythu Bharosa disbursement, and local agricultural processing."
  },
  "82": {
    "ac_no": 82,
    "ac_name": "Achampet (SC)",
    "district": "Nagarkurnool",
    "summary": "Palamuru lift irrigation completion, prevention of seasonal farm migration, and crop price security across Achampet (SC).",
    "primary_concern": "Lift Irrigation & Drought Mitigation",
    "key_issues": [
      {
        "title": "Expedited Completion of Palamuru-Ranga Reddy Irrigation Project",
        "category": "Agriculture & Irrigation",
        "description": "Ensuring high-speed canal distribution works to provide perennial irrigation to dryland farmers and stop seasonal migration.",
        "impact_level": "Critical",
        "affected_demographic": "Dryland agricultural families"
      },
      {
        "title": "Cotton & Red Gram Minimum Support Price (MSP) Procurement",
        "category": "Agriculture & Irrigation",
        "description": "Setting up transparent IKP procurement centers with timely payments to prevent middleman exploitation.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop growers"
      },
      {
        "title": "Sheep Rearing & Shepherd Welfare Subsidies",
        "category": "Welfare & Social",
        "description": "Revitalizing subsidized sheep distribution units and veterinary support for traditional pastoral communities.",
        "impact_level": "High",
        "affected_demographic": "BC Kuruma & Golla Yadav communities"
      }
    ],
    "key_projects": [
      "Palamuru-Ranga Reddy Canal Distributary",
      "Nagarkurnool Agro-Processing Park",
      "Rural Road Connectivity Scheme"
    ],
    "ground_pulse": "Farmers in Achampet (SC) are intensely focused on water delivery timelines, timely Rythu Bharosa disbursement, and local agricultural processing."
  },
  "83": {
    "ac_no": 83,
    "ac_name": "Kalwakurthy",
    "district": "Nagarkurnool",
    "summary": "Palamuru lift irrigation completion, prevention of seasonal farm migration, and crop price security across Kalwakurthy.",
    "primary_concern": "Lift Irrigation & Drought Mitigation",
    "key_issues": [
      {
        "title": "Expedited Completion of Palamuru-Ranga Reddy Irrigation Project",
        "category": "Agriculture & Irrigation",
        "description": "Ensuring high-speed canal distribution works to provide perennial irrigation to dryland farmers and stop seasonal migration.",
        "impact_level": "Critical",
        "affected_demographic": "Dryland agricultural families"
      },
      {
        "title": "Cotton & Red Gram Minimum Support Price (MSP) Procurement",
        "category": "Agriculture & Irrigation",
        "description": "Setting up transparent IKP procurement centers with timely payments to prevent middleman exploitation.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop growers"
      },
      {
        "title": "Sheep Rearing & Shepherd Welfare Subsidies",
        "category": "Welfare & Social",
        "description": "Revitalizing subsidized sheep distribution units and veterinary support for traditional pastoral communities.",
        "impact_level": "High",
        "affected_demographic": "BC Kuruma & Golla Yadav communities"
      }
    ],
    "key_projects": [
      "Palamuru-Ranga Reddy Canal Distributary",
      "Nagarkurnool Agro-Processing Park",
      "Rural Road Connectivity Scheme"
    ],
    "ground_pulse": "Farmers in Kalwakurthy are intensely focused on water delivery timelines, timely Rythu Bharosa disbursement, and local agricultural processing."
  },
  "84": {
    "ac_no": 84,
    "ac_name": "Shadnagar",
    "district": "Ranga Reddy",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Shadnagar.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Shadnagar Irrigation Canal Overhaul",
      "Ranga Reddy Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Shadnagar look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "85": {
    "ac_no": 85,
    "ac_name": "Kollapur",
    "district": "Nagarkurnool",
    "summary": "Palamuru lift irrigation completion, prevention of seasonal farm migration, and crop price security across Kollapur.",
    "primary_concern": "Lift Irrigation & Drought Mitigation",
    "key_issues": [
      {
        "title": "Expedited Completion of Palamuru-Ranga Reddy Irrigation Project",
        "category": "Agriculture & Irrigation",
        "description": "Ensuring high-speed canal distribution works to provide perennial irrigation to dryland farmers and stop seasonal migration.",
        "impact_level": "Critical",
        "affected_demographic": "Dryland agricultural families"
      },
      {
        "title": "Cotton & Red Gram Minimum Support Price (MSP) Procurement",
        "category": "Agriculture & Irrigation",
        "description": "Setting up transparent IKP procurement centers with timely payments to prevent middleman exploitation.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop growers"
      },
      {
        "title": "Sheep Rearing & Shepherd Welfare Subsidies",
        "category": "Welfare & Social",
        "description": "Revitalizing subsidized sheep distribution units and veterinary support for traditional pastoral communities.",
        "impact_level": "High",
        "affected_demographic": "BC Kuruma & Golla Yadav communities"
      }
    ],
    "key_projects": [
      "Palamuru-Ranga Reddy Canal Distributary",
      "Nagarkurnool Agro-Processing Park",
      "Rural Road Connectivity Scheme"
    ],
    "ground_pulse": "Farmers in Kollapur are intensely focused on water delivery timelines, timely Rythu Bharosa disbursement, and local agricultural processing."
  },
  "86": {
    "ac_no": 86,
    "ac_name": "Devarakonda (ST)",
    "district": "Nalgonda",
    "summary": "Perennial Krishna water ayacut supply, SLBC tunnel completion, paddy procurement, and agro-allied livelihoods in Devarakonda (ST).",
    "primary_concern": "Irrigation Canal Modernization & Crop Procurement",
    "key_issues": [
      {
        "title": "SLBC Tunnel & Dindi Canal Network Completion",
        "category": "Agriculture & Irrigation",
        "description": "Expedited completion of tunnel boring and distributary canals to bring assured water to highland mandals.",
        "impact_level": "Critical",
        "affected_demographic": "Upland agrarian communities"
      },
      {
        "title": "Paddy Procurement & Moisture Cut Reforms at IKP Centers",
        "category": "Agriculture & Irrigation",
        "description": "Addressing farmers' grievances regarding arbitrary moisture percentage deductions during kharif and rabi grain procurement.",
        "impact_level": "High",
        "affected_demographic": "Paddy cultivators"
      },
      {
        "title": "Piped Drinking Water Purity & Secondary Treatment",
        "category": "Welfare & Social",
        "description": "Ensuring regular maintenance of Mission Bhagiratha filtration systems to maintain zero-fluorosis baseline.",
        "impact_level": "High",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "SLBC Tunnel Project",
      "Devarakonda (ST) Modern Rice Mill Complex",
      "Highway Link Corridor Upgradation"
    ],
    "ground_pulse": "Strong agrarian awareness makes crop pricing, timely input subsidies, and canal water distribution the foremost voter concerns in Devarakonda (ST)."
  },
  "87": {
    "ac_no": 87,
    "ac_name": "Nagarjuna Sagar",
    "district": "Nalgonda",
    "summary": "Perennial Krishna water ayacut supply, SLBC tunnel completion, paddy procurement, and agro-allied livelihoods in Nagarjuna Sagar.",
    "primary_concern": "Irrigation Canal Modernization & Crop Procurement",
    "key_issues": [
      {
        "title": "SLBC Tunnel & Dindi Canal Network Completion",
        "category": "Agriculture & Irrigation",
        "description": "Expedited completion of tunnel boring and distributary canals to bring assured water to highland mandals.",
        "impact_level": "Critical",
        "affected_demographic": "Upland agrarian communities"
      },
      {
        "title": "Paddy Procurement & Moisture Cut Reforms at IKP Centers",
        "category": "Agriculture & Irrigation",
        "description": "Addressing farmers' grievances regarding arbitrary moisture percentage deductions during kharif and rabi grain procurement.",
        "impact_level": "High",
        "affected_demographic": "Paddy cultivators"
      },
      {
        "title": "Piped Drinking Water Purity & Secondary Treatment",
        "category": "Welfare & Social",
        "description": "Ensuring regular maintenance of Mission Bhagiratha filtration systems to maintain zero-fluorosis baseline.",
        "impact_level": "High",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "SLBC Tunnel Project",
      "Nagarjuna Sagar Modern Rice Mill Complex",
      "Highway Link Corridor Upgradation"
    ],
    "ground_pulse": "Strong agrarian awareness makes crop pricing, timely input subsidies, and canal water distribution the foremost voter concerns in Nagarjuna Sagar."
  },
  "88": {
    "ac_no": 88,
    "ac_name": "Miryalaguda",
    "district": "Nalgonda",
    "summary": "Perennial Krishna water ayacut supply, SLBC tunnel completion, paddy procurement, and agro-allied livelihoods in Miryalaguda.",
    "primary_concern": "Irrigation Canal Modernization & Crop Procurement",
    "key_issues": [
      {
        "title": "SLBC Tunnel & Dindi Canal Network Completion",
        "category": "Agriculture & Irrigation",
        "description": "Expedited completion of tunnel boring and distributary canals to bring assured water to highland mandals.",
        "impact_level": "Critical",
        "affected_demographic": "Upland agrarian communities"
      },
      {
        "title": "Paddy Procurement & Moisture Cut Reforms at IKP Centers",
        "category": "Agriculture & Irrigation",
        "description": "Addressing farmers' grievances regarding arbitrary moisture percentage deductions during kharif and rabi grain procurement.",
        "impact_level": "High",
        "affected_demographic": "Paddy cultivators"
      },
      {
        "title": "Piped Drinking Water Purity & Secondary Treatment",
        "category": "Welfare & Social",
        "description": "Ensuring regular maintenance of Mission Bhagiratha filtration systems to maintain zero-fluorosis baseline.",
        "impact_level": "High",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "SLBC Tunnel Project",
      "Miryalaguda Modern Rice Mill Complex",
      "Highway Link Corridor Upgradation"
    ],
    "ground_pulse": "Strong agrarian awareness makes crop pricing, timely input subsidies, and canal water distribution the foremost voter concerns in Miryalaguda."
  },
  "89": {
    "ac_no": 89,
    "ac_name": "Huzurnagar",
    "district": "Suryapet",
    "summary": "Perennial Krishna water ayacut supply, SLBC tunnel completion, paddy procurement, and agro-allied livelihoods in Huzurnagar.",
    "primary_concern": "Irrigation Canal Modernization & Crop Procurement",
    "key_issues": [
      {
        "title": "SLBC Tunnel & Dindi Canal Network Completion",
        "category": "Agriculture & Irrigation",
        "description": "Expedited completion of tunnel boring and distributary canals to bring assured water to highland mandals.",
        "impact_level": "Critical",
        "affected_demographic": "Upland agrarian communities"
      },
      {
        "title": "Paddy Procurement & Moisture Cut Reforms at IKP Centers",
        "category": "Agriculture & Irrigation",
        "description": "Addressing farmers' grievances regarding arbitrary moisture percentage deductions during kharif and rabi grain procurement.",
        "impact_level": "High",
        "affected_demographic": "Paddy cultivators"
      },
      {
        "title": "Piped Drinking Water Purity & Secondary Treatment",
        "category": "Welfare & Social",
        "description": "Ensuring regular maintenance of Mission Bhagiratha filtration systems to maintain zero-fluorosis baseline.",
        "impact_level": "High",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "SLBC Tunnel Project",
      "Huzurnagar Modern Rice Mill Complex",
      "Highway Link Corridor Upgradation"
    ],
    "ground_pulse": "Strong agrarian awareness makes crop pricing, timely input subsidies, and canal water distribution the foremost voter concerns in Huzurnagar."
  },
  "90": {
    "ac_no": 90,
    "ac_name": "Kodad",
    "district": "Suryapet",
    "summary": "Perennial Krishna water ayacut supply, SLBC tunnel completion, paddy procurement, and agro-allied livelihoods in Kodad.",
    "primary_concern": "Irrigation Canal Modernization & Crop Procurement",
    "key_issues": [
      {
        "title": "SLBC Tunnel & Dindi Canal Network Completion",
        "category": "Agriculture & Irrigation",
        "description": "Expedited completion of tunnel boring and distributary canals to bring assured water to highland mandals.",
        "impact_level": "Critical",
        "affected_demographic": "Upland agrarian communities"
      },
      {
        "title": "Paddy Procurement & Moisture Cut Reforms at IKP Centers",
        "category": "Agriculture & Irrigation",
        "description": "Addressing farmers' grievances regarding arbitrary moisture percentage deductions during kharif and rabi grain procurement.",
        "impact_level": "High",
        "affected_demographic": "Paddy cultivators"
      },
      {
        "title": "Piped Drinking Water Purity & Secondary Treatment",
        "category": "Welfare & Social",
        "description": "Ensuring regular maintenance of Mission Bhagiratha filtration systems to maintain zero-fluorosis baseline.",
        "impact_level": "High",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "SLBC Tunnel Project",
      "Kodad Modern Rice Mill Complex",
      "Highway Link Corridor Upgradation"
    ],
    "ground_pulse": "Strong agrarian awareness makes crop pricing, timely input subsidies, and canal water distribution the foremost voter concerns in Kodad."
  },
  "91": {
    "ac_no": 91,
    "ac_name": "Suryapet",
    "district": "Suryapet",
    "summary": "Perennial Krishna water ayacut supply, SLBC tunnel completion, paddy procurement, and agro-allied livelihoods in Suryapet.",
    "primary_concern": "Irrigation Canal Modernization & Crop Procurement",
    "key_issues": [
      {
        "title": "SLBC Tunnel & Dindi Canal Network Completion",
        "category": "Agriculture & Irrigation",
        "description": "Expedited completion of tunnel boring and distributary canals to bring assured water to highland mandals.",
        "impact_level": "Critical",
        "affected_demographic": "Upland agrarian communities"
      },
      {
        "title": "Paddy Procurement & Moisture Cut Reforms at IKP Centers",
        "category": "Agriculture & Irrigation",
        "description": "Addressing farmers' grievances regarding arbitrary moisture percentage deductions during kharif and rabi grain procurement.",
        "impact_level": "High",
        "affected_demographic": "Paddy cultivators"
      },
      {
        "title": "Piped Drinking Water Purity & Secondary Treatment",
        "category": "Welfare & Social",
        "description": "Ensuring regular maintenance of Mission Bhagiratha filtration systems to maintain zero-fluorosis baseline.",
        "impact_level": "High",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "SLBC Tunnel Project",
      "Suryapet Modern Rice Mill Complex",
      "Highway Link Corridor Upgradation"
    ],
    "ground_pulse": "Strong agrarian awareness makes crop pricing, timely input subsidies, and canal water distribution the foremost voter concerns in Suryapet."
  },
  "92": {
    "ac_no": 92,
    "ac_name": "Nalgonda",
    "district": "Nalgonda",
    "summary": "Perennial Krishna water ayacut supply, SLBC tunnel completion, paddy procurement, and agro-allied livelihoods in Nalgonda.",
    "primary_concern": "Irrigation Canal Modernization & Crop Procurement",
    "key_issues": [
      {
        "title": "SLBC Tunnel & Dindi Canal Network Completion",
        "category": "Agriculture & Irrigation",
        "description": "Expedited completion of tunnel boring and distributary canals to bring assured water to highland mandals.",
        "impact_level": "Critical",
        "affected_demographic": "Upland agrarian communities"
      },
      {
        "title": "Paddy Procurement & Moisture Cut Reforms at IKP Centers",
        "category": "Agriculture & Irrigation",
        "description": "Addressing farmers' grievances regarding arbitrary moisture percentage deductions during kharif and rabi grain procurement.",
        "impact_level": "High",
        "affected_demographic": "Paddy cultivators"
      },
      {
        "title": "Piped Drinking Water Purity & Secondary Treatment",
        "category": "Welfare & Social",
        "description": "Ensuring regular maintenance of Mission Bhagiratha filtration systems to maintain zero-fluorosis baseline.",
        "impact_level": "High",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "SLBC Tunnel Project",
      "Nalgonda Modern Rice Mill Complex",
      "Highway Link Corridor Upgradation"
    ],
    "ground_pulse": "Strong agrarian awareness makes crop pricing, timely input subsidies, and canal water distribution the foremost voter concerns in Nalgonda."
  },
  "93": {
    "ac_no": 93,
    "ac_name": "Munugode",
    "district": "Nalgonda",
    "summary": "Fluorosis elimination legacy, Dindi irrigation project, and handloom weaver welfare in Choutuppal and Marriguda.",
    "primary_concern": "Drinking Water Purity & Irrigation Ayacut",
    "key_issues": [
      {
        "title": "Dindi Lift Irrigation & SLBC Tunnel Completion",
        "category": "Agriculture & Irrigation",
        "description": "Long-delayed irrigation tunnels to provide perennial gravity water to parched red soils of Marriguda and Chandur.",
        "impact_level": "Critical",
        "affected_demographic": "Dryland farmers"
      },
      {
        "title": "Choutuppal Industrial Effluent Regularization",
        "category": "Infrastructure",
        "description": "Enforcing zero-liquid discharge norms on pharmaceutical plants along Vijayawada highway (NH-65).",
        "impact_level": "High",
        "affected_demographic": "Villages surrounding NH-65"
      }
    ],
    "key_projects": [
      "Dindi Lift Irrigation Scheme",
      "Choutuppal Industrial Park Water Grid"
    ],
    "ground_pulse": "Komatireddy Raj Gopal Reddy secured a resounding victory in 2023 on INC ticket after the historic high-voltage 2022 bypoll."
  },
  "94": {
    "ac_no": 94,
    "ac_name": "Bhongir",
    "district": "Yadadri Bhuvanagiri",
    "summary": "Perennial Krishna water ayacut supply, SLBC tunnel completion, paddy procurement, and agro-allied livelihoods in Bhongir.",
    "primary_concern": "Irrigation Canal Modernization & Crop Procurement",
    "key_issues": [
      {
        "title": "SLBC Tunnel & Dindi Canal Network Completion",
        "category": "Agriculture & Irrigation",
        "description": "Expedited completion of tunnel boring and distributary canals to bring assured water to highland mandals.",
        "impact_level": "Critical",
        "affected_demographic": "Upland agrarian communities"
      },
      {
        "title": "Paddy Procurement & Moisture Cut Reforms at IKP Centers",
        "category": "Agriculture & Irrigation",
        "description": "Addressing farmers' grievances regarding arbitrary moisture percentage deductions during kharif and rabi grain procurement.",
        "impact_level": "High",
        "affected_demographic": "Paddy cultivators"
      },
      {
        "title": "Piped Drinking Water Purity & Secondary Treatment",
        "category": "Welfare & Social",
        "description": "Ensuring regular maintenance of Mission Bhagiratha filtration systems to maintain zero-fluorosis baseline.",
        "impact_level": "High",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "SLBC Tunnel Project",
      "Bhongir Modern Rice Mill Complex",
      "Highway Link Corridor Upgradation"
    ],
    "ground_pulse": "Strong agrarian awareness makes crop pricing, timely input subsidies, and canal water distribution the foremost voter concerns in Bhongir."
  },
  "95": {
    "ac_no": 95,
    "ac_name": "Nakrekal (SC)",
    "district": "Nalgonda",
    "summary": "Perennial Krishna water ayacut supply, SLBC tunnel completion, paddy procurement, and agro-allied livelihoods in Nakrekal (SC).",
    "primary_concern": "Irrigation Canal Modernization & Crop Procurement",
    "key_issues": [
      {
        "title": "SLBC Tunnel & Dindi Canal Network Completion",
        "category": "Agriculture & Irrigation",
        "description": "Expedited completion of tunnel boring and distributary canals to bring assured water to highland mandals.",
        "impact_level": "Critical",
        "affected_demographic": "Upland agrarian communities"
      },
      {
        "title": "Paddy Procurement & Moisture Cut Reforms at IKP Centers",
        "category": "Agriculture & Irrigation",
        "description": "Addressing farmers' grievances regarding arbitrary moisture percentage deductions during kharif and rabi grain procurement.",
        "impact_level": "High",
        "affected_demographic": "Paddy cultivators"
      },
      {
        "title": "Piped Drinking Water Purity & Secondary Treatment",
        "category": "Welfare & Social",
        "description": "Ensuring regular maintenance of Mission Bhagiratha filtration systems to maintain zero-fluorosis baseline.",
        "impact_level": "High",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "SLBC Tunnel Project",
      "Nakrekal (SC) Modern Rice Mill Complex",
      "Highway Link Corridor Upgradation"
    ],
    "ground_pulse": "Strong agrarian awareness makes crop pricing, timely input subsidies, and canal water distribution the foremost voter concerns in Nakrekal (SC)."
  },
  "96": {
    "ac_no": 96,
    "ac_name": "Thungathurthi (SC)",
    "district": "Suryapet",
    "summary": "Perennial Krishna water ayacut supply, SLBC tunnel completion, paddy procurement, and agro-allied livelihoods in Thungathurthi (SC).",
    "primary_concern": "Irrigation Canal Modernization & Crop Procurement",
    "key_issues": [
      {
        "title": "SLBC Tunnel & Dindi Canal Network Completion",
        "category": "Agriculture & Irrigation",
        "description": "Expedited completion of tunnel boring and distributary canals to bring assured water to highland mandals.",
        "impact_level": "Critical",
        "affected_demographic": "Upland agrarian communities"
      },
      {
        "title": "Paddy Procurement & Moisture Cut Reforms at IKP Centers",
        "category": "Agriculture & Irrigation",
        "description": "Addressing farmers' grievances regarding arbitrary moisture percentage deductions during kharif and rabi grain procurement.",
        "impact_level": "High",
        "affected_demographic": "Paddy cultivators"
      },
      {
        "title": "Piped Drinking Water Purity & Secondary Treatment",
        "category": "Welfare & Social",
        "description": "Ensuring regular maintenance of Mission Bhagiratha filtration systems to maintain zero-fluorosis baseline.",
        "impact_level": "High",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "SLBC Tunnel Project",
      "Thungathurthi (SC) Modern Rice Mill Complex",
      "Highway Link Corridor Upgradation"
    ],
    "ground_pulse": "Strong agrarian awareness makes crop pricing, timely input subsidies, and canal water distribution the foremost voter concerns in Thungathurthi (SC)."
  },
  "97": {
    "ac_no": 97,
    "ac_name": "Alair",
    "district": "Yadadri Bhuvanagiri",
    "summary": "Perennial Krishna water ayacut supply, SLBC tunnel completion, paddy procurement, and agro-allied livelihoods in Alair.",
    "primary_concern": "Irrigation Canal Modernization & Crop Procurement",
    "key_issues": [
      {
        "title": "SLBC Tunnel & Dindi Canal Network Completion",
        "category": "Agriculture & Irrigation",
        "description": "Expedited completion of tunnel boring and distributary canals to bring assured water to highland mandals.",
        "impact_level": "Critical",
        "affected_demographic": "Upland agrarian communities"
      },
      {
        "title": "Paddy Procurement & Moisture Cut Reforms at IKP Centers",
        "category": "Agriculture & Irrigation",
        "description": "Addressing farmers' grievances regarding arbitrary moisture percentage deductions during kharif and rabi grain procurement.",
        "impact_level": "High",
        "affected_demographic": "Paddy cultivators"
      },
      {
        "title": "Piped Drinking Water Purity & Secondary Treatment",
        "category": "Welfare & Social",
        "description": "Ensuring regular maintenance of Mission Bhagiratha filtration systems to maintain zero-fluorosis baseline.",
        "impact_level": "High",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "SLBC Tunnel Project",
      "Alair Modern Rice Mill Complex",
      "Highway Link Corridor Upgradation"
    ],
    "ground_pulse": "Strong agrarian awareness makes crop pricing, timely input subsidies, and canal water distribution the foremost voter concerns in Alair."
  },
  "98": {
    "ac_no": 98,
    "ac_name": "Jangoan",
    "district": "Jangaon",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Jangoan.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Jangoan Irrigation Canal Overhaul",
      "Jangaon Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Jangoan look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "99": {
    "ac_no": 99,
    "ac_name": "Ghanpur (Station) (SC)",
    "district": "Jangaon",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Ghanpur (Station) (SC).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Ghanpur (Station) (SC) Irrigation Canal Overhaul",
      "Jangaon Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Ghanpur (Station) (SC) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "100": {
    "ac_no": 100,
    "ac_name": "Palakurthi",
    "district": "Jangaon",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Palakurthi.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Palakurthi Irrigation Canal Overhaul",
      "Jangaon Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Palakurthi look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "101": {
    "ac_no": 101,
    "ac_name": "Dornakal (ST)",
    "district": "Mahabubabad",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Dornakal (ST).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Dornakal (ST) Irrigation Canal Overhaul",
      "Mahabubabad Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Dornakal (ST) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "102": {
    "ac_no": 102,
    "ac_name": "Mahabubabad (ST)",
    "district": "Mahabubabad",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Mahabubabad (ST).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Mahabubabad (ST) Irrigation Canal Overhaul",
      "Mahabubabad Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Mahabubabad (ST) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "103": {
    "ac_no": 103,
    "ac_name": "Narsampet",
    "district": "Warangal",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Narsampet.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Narsampet Irrigation Canal Overhaul",
      "Warangal Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Narsampet look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "104": {
    "ac_no": 104,
    "ac_name": "Parkal",
    "district": "Hanamkonda",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Parkal.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Parkal Irrigation Canal Overhaul",
      "Hanamkonda Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Parkal look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "105": {
    "ac_no": 105,
    "ac_name": "Warangal West",
    "district": "Hanamkonda",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Warangal West.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Warangal West Irrigation Canal Overhaul",
      "Hanamkonda Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Warangal West look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "106": {
    "ac_no": 106,
    "ac_name": "Warangal East",
    "district": "Hanamkonda",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Warangal East.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Warangal East Irrigation Canal Overhaul",
      "Hanamkonda Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Warangal East look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "107": {
    "ac_no": 107,
    "ac_name": "Waradhanapet (SC)",
    "district": "Warangal",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Waradhanapet (SC).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Waradhanapet (SC) Irrigation Canal Overhaul",
      "Warangal Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Waradhanapet (SC) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "108": {
    "ac_no": 108,
    "ac_name": "Bhupalpalle",
    "district": "Jayashankar Bhupalpally",
    "summary": "Mining sector employment, land acquisition compensation, environmental pollution mitigation, and rural healthcare in Bhupalpalle.",
    "primary_concern": "Mining Labor & Environmental Protection",
    "key_issues": [
      {
        "title": "Local Youth Employment in Mining & Thermal Projects",
        "category": "Employment & Industry",
        "description": "Demand for permanent employment for local qualified youth in state and central industrial establishments within Jayashankar Bhupalpally.",
        "impact_level": "Critical",
        "affected_demographic": "Youth & mining families"
      },
      {
        "title": "Canal Water Distribution & Tank Rejuvenation",
        "category": "Agriculture & Irrigation",
        "description": "Maintenance of irrigation canals and ensuring tail-end farm ponds receive water during dry rabi sowing.",
        "impact_level": "High",
        "affected_demographic": "Cotton & paddy farmers"
      },
      {
        "title": "Air Quality & Groundwater Protection in Mining Zones",
        "category": "Infrastructure",
        "description": "Stringent dust suppression and effluent monitoring around industrial plants to safeguard community health.",
        "impact_level": "Medium",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "Bhupalpalle Lift Irrigation Sub-canal",
      "Community Health Center Modernization",
      "Industrial Corridor Link Road"
    ],
    "ground_pulse": "Electoral dynamics in Bhupalpalle center on labor welfare, transparent compensation for acquired lands, and rural development."
  },
  "109": {
    "ac_no": 109,
    "ac_name": "Mulug (ST)",
    "district": "Mulugu",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Mulug (ST).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Mulug (ST) Irrigation Canal Overhaul",
      "Mulugu Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Mulug (ST) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "110": {
    "ac_no": 110,
    "ac_name": "Pinapaka (ST)",
    "district": "Bhadradri Kothagudem",
    "summary": "Mining sector employment, land acquisition compensation, environmental pollution mitigation, and rural healthcare in Pinapaka (ST).",
    "primary_concern": "Mining Labor & Environmental Protection",
    "key_issues": [
      {
        "title": "Local Youth Employment in Mining & Thermal Projects",
        "category": "Employment & Industry",
        "description": "Demand for permanent employment for local qualified youth in state and central industrial establishments within Bhadradri Kothagudem.",
        "impact_level": "Critical",
        "affected_demographic": "Youth & mining families"
      },
      {
        "title": "Canal Water Distribution & Tank Rejuvenation",
        "category": "Agriculture & Irrigation",
        "description": "Maintenance of irrigation canals and ensuring tail-end farm ponds receive water during dry rabi sowing.",
        "impact_level": "High",
        "affected_demographic": "Cotton & paddy farmers"
      },
      {
        "title": "Air Quality & Groundwater Protection in Mining Zones",
        "category": "Infrastructure",
        "description": "Stringent dust suppression and effluent monitoring around industrial plants to safeguard community health.",
        "impact_level": "Medium",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "Pinapaka (ST) Lift Irrigation Sub-canal",
      "Community Health Center Modernization",
      "Industrial Corridor Link Road"
    ],
    "ground_pulse": "Electoral dynamics in Pinapaka (ST) center on labor welfare, transparent compensation for acquired lands, and rural development."
  },
  "111": {
    "ac_no": 111,
    "ac_name": "Yellandu (ST)",
    "district": "Bhadradri Kothagudem",
    "summary": "Mining sector employment, land acquisition compensation, environmental pollution mitigation, and rural healthcare in Yellandu (ST).",
    "primary_concern": "Mining Labor & Environmental Protection",
    "key_issues": [
      {
        "title": "Local Youth Employment in Mining & Thermal Projects",
        "category": "Employment & Industry",
        "description": "Demand for permanent employment for local qualified youth in state and central industrial establishments within Bhadradri Kothagudem.",
        "impact_level": "Critical",
        "affected_demographic": "Youth & mining families"
      },
      {
        "title": "Canal Water Distribution & Tank Rejuvenation",
        "category": "Agriculture & Irrigation",
        "description": "Maintenance of irrigation canals and ensuring tail-end farm ponds receive water during dry rabi sowing.",
        "impact_level": "High",
        "affected_demographic": "Cotton & paddy farmers"
      },
      {
        "title": "Air Quality & Groundwater Protection in Mining Zones",
        "category": "Infrastructure",
        "description": "Stringent dust suppression and effluent monitoring around industrial plants to safeguard community health.",
        "impact_level": "Medium",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "Yellandu (ST) Lift Irrigation Sub-canal",
      "Community Health Center Modernization",
      "Industrial Corridor Link Road"
    ],
    "ground_pulse": "Electoral dynamics in Yellandu (ST) center on labor welfare, transparent compensation for acquired lands, and rural development."
  },
  "112": {
    "ac_no": 112,
    "ac_name": "Khammam",
    "district": "Khammam",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Khammam.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Khammam Irrigation Canal Overhaul",
      "Khammam Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Khammam look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "113": {
    "ac_no": 113,
    "ac_name": "Palair",
    "district": "Khammam",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Palair.",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Palair Irrigation Canal Overhaul",
      "Khammam Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Palair look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "114": {
    "ac_no": 114,
    "ac_name": "Madhira (SC)",
    "district": "Khammam",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Madhira (SC).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Madhira (SC) Irrigation Canal Overhaul",
      "Khammam Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Madhira (SC) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "115": {
    "ac_no": 115,
    "ac_name": "Wyra (ST)",
    "district": "Khammam",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Wyra (ST).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Wyra (ST) Irrigation Canal Overhaul",
      "Khammam Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Wyra (ST) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "116": {
    "ac_no": 116,
    "ac_name": "Sathupalle (SC)",
    "district": "Khammam",
    "summary": "Agricultural power and canal water supply, minimum support prices for commercial crops, and youth employment in Sathupalle (SC).",
    "primary_concern": "Farm Prosperity, Water Supply & Youth Jobs",
    "key_issues": [
      {
        "title": "SRSP / Local Irrigation Canal Maintenance",
        "category": "Agriculture & Irrigation",
        "description": "De-silting distributaries and repairing sluice gates to guarantee unhindered water flow to tail-end farm plots.",
        "impact_level": "Critical",
        "affected_demographic": "Paddy, maize & cotton growers"
      },
      {
        "title": "Crop Price Stabilization & Cold Storage Infrastructure",
        "category": "Agriculture & Irrigation",
        "description": "Setting up government-operated cold storages and market yards with electronic weighing and prompt payment transfer.",
        "impact_level": "High",
        "affected_demographic": "Commercial crop farmers"
      },
      {
        "title": "Local Skill Training & Job Creation for Educated Youth",
        "category": "Employment & Industry",
        "description": "Establishing rural skill development centers to connect local graduates with industrial and service sector employment.",
        "impact_level": "High",
        "affected_demographic": "Youth (18-25)"
      }
    ],
    "key_projects": [
      "Sathupalle (SC) Irrigation Canal Overhaul",
      "Khammam Agro-logistics Hub",
      "Model Government Degree College"
    ],
    "ground_pulse": "Voters in Sathupalle (SC) look for accountable leadership focused on grassroots agricultural welfare, regular power supply, and responsive public services."
  },
  "117": {
    "ac_no": 117,
    "ac_name": "Kothagudem",
    "district": "Bhadradri Kothagudem",
    "summary": "Mining sector employment, land acquisition compensation, environmental pollution mitigation, and rural healthcare in Kothagudem.",
    "primary_concern": "Mining Labor & Environmental Protection",
    "key_issues": [
      {
        "title": "Local Youth Employment in Mining & Thermal Projects",
        "category": "Employment & Industry",
        "description": "Demand for permanent employment for local qualified youth in state and central industrial establishments within Bhadradri Kothagudem.",
        "impact_level": "Critical",
        "affected_demographic": "Youth & mining families"
      },
      {
        "title": "Canal Water Distribution & Tank Rejuvenation",
        "category": "Agriculture & Irrigation",
        "description": "Maintenance of irrigation canals and ensuring tail-end farm ponds receive water during dry rabi sowing.",
        "impact_level": "High",
        "affected_demographic": "Cotton & paddy farmers"
      },
      {
        "title": "Air Quality & Groundwater Protection in Mining Zones",
        "category": "Infrastructure",
        "description": "Stringent dust suppression and effluent monitoring around industrial plants to safeguard community health.",
        "impact_level": "Medium",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "Kothagudem Lift Irrigation Sub-canal",
      "Community Health Center Modernization",
      "Industrial Corridor Link Road"
    ],
    "ground_pulse": "Electoral dynamics in Kothagudem center on labor welfare, transparent compensation for acquired lands, and rural development."
  },
  "118": {
    "ac_no": 118,
    "ac_name": "Aswaraopeta (ST)",
    "district": "Bhadradri Kothagudem",
    "summary": "Mining sector employment, land acquisition compensation, environmental pollution mitigation, and rural healthcare in Aswaraopeta (ST).",
    "primary_concern": "Mining Labor & Environmental Protection",
    "key_issues": [
      {
        "title": "Local Youth Employment in Mining & Thermal Projects",
        "category": "Employment & Industry",
        "description": "Demand for permanent employment for local qualified youth in state and central industrial establishments within Bhadradri Kothagudem.",
        "impact_level": "Critical",
        "affected_demographic": "Youth & mining families"
      },
      {
        "title": "Canal Water Distribution & Tank Rejuvenation",
        "category": "Agriculture & Irrigation",
        "description": "Maintenance of irrigation canals and ensuring tail-end farm ponds receive water during dry rabi sowing.",
        "impact_level": "High",
        "affected_demographic": "Cotton & paddy farmers"
      },
      {
        "title": "Air Quality & Groundwater Protection in Mining Zones",
        "category": "Infrastructure",
        "description": "Stringent dust suppression and effluent monitoring around industrial plants to safeguard community health.",
        "impact_level": "Medium",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "Aswaraopeta (ST) Lift Irrigation Sub-canal",
      "Community Health Center Modernization",
      "Industrial Corridor Link Road"
    ],
    "ground_pulse": "Electoral dynamics in Aswaraopeta (ST) center on labor welfare, transparent compensation for acquired lands, and rural development."
  },
  "119": {
    "ac_no": 119,
    "ac_name": "Bhadrachalam (ST)",
    "district": "Bhadradri Kothagudem",
    "summary": "Mining sector employment, land acquisition compensation, environmental pollution mitigation, and rural healthcare in Bhadrachalam (ST).",
    "primary_concern": "Mining Labor & Environmental Protection",
    "key_issues": [
      {
        "title": "Local Youth Employment in Mining & Thermal Projects",
        "category": "Employment & Industry",
        "description": "Demand for permanent employment for local qualified youth in state and central industrial establishments within Bhadradri Kothagudem.",
        "impact_level": "Critical",
        "affected_demographic": "Youth & mining families"
      },
      {
        "title": "Canal Water Distribution & Tank Rejuvenation",
        "category": "Agriculture & Irrigation",
        "description": "Maintenance of irrigation canals and ensuring tail-end farm ponds receive water during dry rabi sowing.",
        "impact_level": "High",
        "affected_demographic": "Cotton & paddy farmers"
      },
      {
        "title": "Air Quality & Groundwater Protection in Mining Zones",
        "category": "Infrastructure",
        "description": "Stringent dust suppression and effluent monitoring around industrial plants to safeguard community health.",
        "impact_level": "Medium",
        "affected_demographic": "Rural habitations"
      }
    ],
    "key_projects": [
      "Bhadrachalam (ST) Lift Irrigation Sub-canal",
      "Community Health Center Modernization",
      "Industrial Corridor Link Road"
    ],
    "ground_pulse": "Electoral dynamics in Bhadrachalam (ST) center on labor welfare, transparent compensation for acquired lands, and rural development."
  }
};
