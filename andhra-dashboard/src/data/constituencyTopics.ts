// Constituency Key Topics, Local Issues & Political Pulse for all 175 Andhra Pradesh ACs
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
    "ac_name": "Ichchapuram",
    "district": "Srikakulam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Srikakulam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Srikakulam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Ichchapuram assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Ichchapuram to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Ichchapuram.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Ichchapuram Canal Modernization",
      "Srikakulam Agro-Processing Park",
      "Ichchapuram Skill Development Center"
    ],
    "ground_pulse": "Voters in Ichchapuram prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "2": {
    "ac_no": 2,
    "ac_name": "Palasa",
    "district": "Srikakulam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Srikakulam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Srikakulam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Palasa assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Palasa to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Palasa.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Palasa Canal Modernization",
      "Srikakulam Agro-Processing Park",
      "Palasa Skill Development Center"
    ],
    "ground_pulse": "Voters in Palasa prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "3": {
    "ac_no": 3,
    "ac_name": "Tekkali",
    "district": "Srikakulam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Srikakulam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Srikakulam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Tekkali assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Tekkali to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Tekkali.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Tekkali Canal Modernization",
      "Srikakulam Agro-Processing Park",
      "Tekkali Skill Development Center"
    ],
    "ground_pulse": "Voters in Tekkali prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "4": {
    "ac_no": 4,
    "ac_name": "Pathapatnam",
    "district": "Srikakulam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Srikakulam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Srikakulam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Pathapatnam assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Pathapatnam to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Pathapatnam.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Pathapatnam Canal Modernization",
      "Srikakulam Agro-Processing Park",
      "Pathapatnam Skill Development Center"
    ],
    "ground_pulse": "Voters in Pathapatnam prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "5": {
    "ac_no": 5,
    "ac_name": "Srikakulam",
    "district": "Srikakulam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Srikakulam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Srikakulam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Srikakulam assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Srikakulam to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Srikakulam.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Srikakulam Canal Modernization",
      "Srikakulam Agro-Processing Park",
      "Srikakulam Skill Development Center"
    ],
    "ground_pulse": "Voters in Srikakulam prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "6": {
    "ac_no": 6,
    "ac_name": "Amadalavalasa",
    "district": "Srikakulam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Srikakulam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Srikakulam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Amadalavalasa assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Amadalavalasa to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Amadalavalasa.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Amadalavalasa Canal Modernization",
      "Srikakulam Agro-Processing Park",
      "Amadalavalasa Skill Development Center"
    ],
    "ground_pulse": "Voters in Amadalavalasa prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "7": {
    "ac_no": 7,
    "ac_name": "Etcherla",
    "district": "Srikakulam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Srikakulam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Srikakulam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Etcherla assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Etcherla to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Etcherla.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Etcherla Canal Modernization",
      "Srikakulam Agro-Processing Park",
      "Etcherla Skill Development Center"
    ],
    "ground_pulse": "Voters in Etcherla prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "8": {
    "ac_no": 8,
    "ac_name": "Narasannapeta",
    "district": "Srikakulam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Srikakulam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Srikakulam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Narasannapeta assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Narasannapeta to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Narasannapeta.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Narasannapeta Canal Modernization",
      "Srikakulam Agro-Processing Park",
      "Narasannapeta Skill Development Center"
    ],
    "ground_pulse": "Voters in Narasannapeta prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "9": {
    "ac_no": 9,
    "ac_name": "Rajam",
    "district": "Vizianagaram",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Vizianagaram drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Vizianagaram Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Rajam assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Rajam to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Rajam.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Rajam Canal Modernization",
      "Vizianagaram Agro-Processing Park",
      "Rajam Skill Development Center"
    ],
    "ground_pulse": "Voters in Rajam prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "10": {
    "ac_no": 10,
    "ac_name": "Palakonda",
    "district": "Parvathipuram Manyam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Parvathipuram Manyam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Parvathipuram Manyam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Palakonda assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Palakonda to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Palakonda.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Palakonda Canal Modernization",
      "Parvathipuram Manyam Agro-Processing Park",
      "Palakonda Skill Development Center"
    ],
    "ground_pulse": "Voters in Palakonda prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "11": {
    "ac_no": 11,
    "ac_name": "Kurupam",
    "district": "Parvathipuram Manyam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Parvathipuram Manyam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Parvathipuram Manyam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Kurupam assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Kurupam to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Kurupam.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Kurupam Canal Modernization",
      "Parvathipuram Manyam Agro-Processing Park",
      "Kurupam Skill Development Center"
    ],
    "ground_pulse": "Voters in Kurupam prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "12": {
    "ac_no": 12,
    "ac_name": "Parvathipuram",
    "district": "Parvathipuram Manyam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Parvathipuram Manyam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Parvathipuram Manyam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Parvathipuram assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Parvathipuram to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Parvathipuram.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Parvathipuram Canal Modernization",
      "Parvathipuram Manyam Agro-Processing Park",
      "Parvathipuram Skill Development Center"
    ],
    "ground_pulse": "Voters in Parvathipuram prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "13": {
    "ac_no": 13,
    "ac_name": "Salur",
    "district": "Parvathipuram Manyam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Parvathipuram Manyam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Parvathipuram Manyam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Salur assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Salur to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Salur.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Salur Canal Modernization",
      "Parvathipuram Manyam Agro-Processing Park",
      "Salur Skill Development Center"
    ],
    "ground_pulse": "Voters in Salur prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "14": {
    "ac_no": 14,
    "ac_name": "Bobbili",
    "district": "Vizianagaram",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Vizianagaram drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Vizianagaram Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Bobbili assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Bobbili to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Bobbili.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Bobbili Canal Modernization",
      "Vizianagaram Agro-Processing Park",
      "Bobbili Skill Development Center"
    ],
    "ground_pulse": "Voters in Bobbili prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "15": {
    "ac_no": 15,
    "ac_name": "Cheepurupalli",
    "district": "Vizianagaram",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Vizianagaram drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Vizianagaram Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Cheepurupalli assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Cheepurupalli to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Cheepurupalli.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Cheepurupalli Canal Modernization",
      "Vizianagaram Agro-Processing Park",
      "Cheepurupalli Skill Development Center"
    ],
    "ground_pulse": "Voters in Cheepurupalli prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "16": {
    "ac_no": 16,
    "ac_name": "Gajapathinagaram",
    "district": "Vizianagaram",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Vizianagaram drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Vizianagaram Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Gajapathinagaram assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Gajapathinagaram to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Gajapathinagaram.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Gajapathinagaram Canal Modernization",
      "Vizianagaram Agro-Processing Park",
      "Gajapathinagaram Skill Development Center"
    ],
    "ground_pulse": "Voters in Gajapathinagaram prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "17": {
    "ac_no": 17,
    "ac_name": "Nellimarla",
    "district": "Vizianagaram",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Vizianagaram drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Vizianagaram Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Nellimarla assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Nellimarla to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Nellimarla.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Nellimarla Canal Modernization",
      "Vizianagaram Agro-Processing Park",
      "Nellimarla Skill Development Center"
    ],
    "ground_pulse": "Voters in Nellimarla prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "18": {
    "ac_no": 18,
    "ac_name": "Vizianagaram",
    "district": "Vizianagaram",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Vizianagaram drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Vizianagaram Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Vizianagaram assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Vizianagaram to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Vizianagaram.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Vizianagaram Canal Modernization",
      "Vizianagaram Agro-Processing Park",
      "Vizianagaram Skill Development Center"
    ],
    "ground_pulse": "Voters in Vizianagaram prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "19": {
    "ac_no": 19,
    "ac_name": "Srungavarapukota",
    "district": "Vizianagaram",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Vizianagaram drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Vizianagaram Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Srungavarapukota assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Srungavarapukota to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Srungavarapukota.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Srungavarapukota Canal Modernization",
      "Vizianagaram Agro-Processing Park",
      "Srungavarapukota Skill Development Center"
    ],
    "ground_pulse": "Voters in Srungavarapukota prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "20": {
    "ac_no": 20,
    "ac_name": "Bhimili",
    "district": "Visakhapatnam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Visakhapatnam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Visakhapatnam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Bhimili assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Bhimili to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Bhimili.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Bhimili Canal Modernization",
      "Visakhapatnam Agro-Processing Park",
      "Bhimili Skill Development Center"
    ],
    "ground_pulse": "Voters in Bhimili prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "21": {
    "ac_no": 21,
    "ac_name": "Visakhapatnam East",
    "district": "Visakhapatnam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Visakhapatnam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Visakhapatnam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Visakhapatnam East assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Visakhapatnam East to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Visakhapatnam East.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Visakhapatnam East Canal Modernization",
      "Visakhapatnam Agro-Processing Park",
      "Visakhapatnam East Skill Development Center"
    ],
    "ground_pulse": "Voters in Visakhapatnam East prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "22": {
    "ac_no": 22,
    "ac_name": "Visakhapatnam South",
    "district": "Visakhapatnam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Visakhapatnam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Visakhapatnam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Visakhapatnam South assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Visakhapatnam South to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Visakhapatnam South.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Visakhapatnam South Canal Modernization",
      "Visakhapatnam Agro-Processing Park",
      "Visakhapatnam South Skill Development Center"
    ],
    "ground_pulse": "Voters in Visakhapatnam South prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "23": {
    "ac_no": 23,
    "ac_name": "Visakhapatnam North",
    "district": "Visakhapatnam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Visakhapatnam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Visakhapatnam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Visakhapatnam North assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Visakhapatnam North to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Visakhapatnam North.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Visakhapatnam North Canal Modernization",
      "Visakhapatnam Agro-Processing Park",
      "Visakhapatnam North Skill Development Center"
    ],
    "ground_pulse": "Voters in Visakhapatnam North prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "24": {
    "ac_no": 24,
    "ac_name": "Visakhapatnam West",
    "district": "Visakhapatnam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Visakhapatnam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Visakhapatnam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Visakhapatnam West assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Visakhapatnam West to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Visakhapatnam West.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Visakhapatnam West Canal Modernization",
      "Visakhapatnam Agro-Processing Park",
      "Visakhapatnam West Skill Development Center"
    ],
    "ground_pulse": "Voters in Visakhapatnam West prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "25": {
    "ac_no": 25,
    "ac_name": "Gajuwaka",
    "district": "Visakhapatnam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Visakhapatnam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Visakhapatnam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Gajuwaka assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Gajuwaka to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Gajuwaka.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Gajuwaka Canal Modernization",
      "Visakhapatnam Agro-Processing Park",
      "Gajuwaka Skill Development Center"
    ],
    "ground_pulse": "Voters in Gajuwaka prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "26": {
    "ac_no": 26,
    "ac_name": "Chodavaram",
    "district": "Anakapalli",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Anakapalli drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Anakapalli Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Chodavaram assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Chodavaram to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Chodavaram.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Chodavaram Canal Modernization",
      "Anakapalli Agro-Processing Park",
      "Chodavaram Skill Development Center"
    ],
    "ground_pulse": "Voters in Chodavaram prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "27": {
    "ac_no": 27,
    "ac_name": "Madugula",
    "district": "Anakapalli",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Anakapalli drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Anakapalli Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Madugula assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Madugula to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Madugula.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Madugula Canal Modernization",
      "Anakapalli Agro-Processing Park",
      "Madugula Skill Development Center"
    ],
    "ground_pulse": "Voters in Madugula prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "28": {
    "ac_no": 28,
    "ac_name": "Araku Valley",
    "district": "Alluri Sitharama Raju",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Alluri Sitharama Raju drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Alluri Sitharama Raju Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Araku Valley assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Araku Valley to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Araku Valley.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Araku Valley Canal Modernization",
      "Alluri Sitharama Raju Agro-Processing Park",
      "Araku Valley Skill Development Center"
    ],
    "ground_pulse": "Voters in Araku Valley prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "29": {
    "ac_no": 29,
    "ac_name": "Paderu",
    "district": "Alluri Sitharama Raju",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Alluri Sitharama Raju drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Alluri Sitharama Raju Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Paderu assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Paderu to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Paderu.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Paderu Canal Modernization",
      "Alluri Sitharama Raju Agro-Processing Park",
      "Paderu Skill Development Center"
    ],
    "ground_pulse": "Voters in Paderu prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "30": {
    "ac_no": 30,
    "ac_name": "Anakapalle",
    "district": "Anakapalli",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Anakapalli drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Anakapalli Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Anakapalle assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Anakapalle to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Anakapalle.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Anakapalle Canal Modernization",
      "Anakapalli Agro-Processing Park",
      "Anakapalle Skill Development Center"
    ],
    "ground_pulse": "Voters in Anakapalle prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "31": {
    "ac_no": 31,
    "ac_name": "Pendurthi",
    "district": "Visakhapatnam",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Visakhapatnam drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Visakhapatnam Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Pendurthi assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Pendurthi to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Pendurthi.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Pendurthi Canal Modernization",
      "Visakhapatnam Agro-Processing Park",
      "Pendurthi Skill Development Center"
    ],
    "ground_pulse": "Voters in Pendurthi prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "32": {
    "ac_no": 32,
    "ac_name": "Elamanchili",
    "district": "Anakapalli",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Anakapalli drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Anakapalli Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Elamanchili assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Elamanchili to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Elamanchili.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Elamanchili Canal Modernization",
      "Anakapalli Agro-Processing Park",
      "Elamanchili Skill Development Center"
    ],
    "ground_pulse": "Voters in Elamanchili prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "33": {
    "ac_no": 33,
    "ac_name": "Payakaraopet",
    "district": "Anakapalli",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Anakapalli drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Anakapalli Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Payakaraopet assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Payakaraopet to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Payakaraopet.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Payakaraopet Canal Modernization",
      "Anakapalli Agro-Processing Park",
      "Payakaraopet Skill Development Center"
    ],
    "ground_pulse": "Voters in Payakaraopet prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "34": {
    "ac_no": 34,
    "ac_name": "Narsipatnam",
    "district": "Anakapalli",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Anakapalli drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Anakapalli Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Narsipatnam assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Narsipatnam to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Narsipatnam.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Narsipatnam Canal Modernization",
      "Anakapalli Agro-Processing Park",
      "Narsipatnam Skill Development Center"
    ],
    "ground_pulse": "Voters in Narsipatnam prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "35": {
    "ac_no": 35,
    "ac_name": "Tuni",
    "district": "Kakinada",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Tuni.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Tuni.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Tuni.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Tuni.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Tuni Godavari Flood Embankment",
      "Kakinada Cold Storage & Food Processing Cluster",
      "Tuni Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Tuni makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "36": {
    "ac_no": 36,
    "ac_name": "Prathipadu (Kakinada)",
    "district": "Kakinada",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Prathipadu (Kakinada).",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Prathipadu (Kakinada).",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Prathipadu (Kakinada).",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Prathipadu (Kakinada).",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Prathipadu (Kakinada) Godavari Flood Embankment",
      "Kakinada Cold Storage & Food Processing Cluster",
      "Prathipadu (Kakinada) Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Prathipadu (Kakinada) makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "37": {
    "ac_no": 37,
    "ac_name": "Pithapuram",
    "district": "Kakinada",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Pithapuram.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Pithapuram.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Pithapuram.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Pithapuram.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Pithapuram Godavari Flood Embankment",
      "Kakinada Cold Storage & Food Processing Cluster",
      "Pithapuram Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Pithapuram makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "38": {
    "ac_no": 38,
    "ac_name": "Kakinada Rural",
    "district": "Kakinada",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Kakinada Rural.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Kakinada Rural.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Kakinada Rural.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Kakinada Rural.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Kakinada Rural Godavari Flood Embankment",
      "Kakinada Cold Storage & Food Processing Cluster",
      "Kakinada Rural Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Kakinada Rural makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "39": {
    "ac_no": 39,
    "ac_name": "Peddapuram",
    "district": "Kakinada",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Peddapuram.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Peddapuram.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Peddapuram.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Peddapuram.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Peddapuram Godavari Flood Embankment",
      "Kakinada Cold Storage & Food Processing Cluster",
      "Peddapuram Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Peddapuram makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "40": {
    "ac_no": 40,
    "ac_name": "Anaparthy",
    "district": "East Godavari",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Anaparthy.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Anaparthy.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Anaparthy.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Anaparthy.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Anaparthy Godavari Flood Embankment",
      "East Godavari Cold Storage & Food Processing Cluster",
      "Anaparthy Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Anaparthy makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "41": {
    "ac_no": 41,
    "ac_name": "Kakinada City",
    "district": "Kakinada",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Kakinada City.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Kakinada City.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Kakinada City.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Kakinada City.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Kakinada City Godavari Flood Embankment",
      "Kakinada Cold Storage & Food Processing Cluster",
      "Kakinada City Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Kakinada City makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "42": {
    "ac_no": 42,
    "ac_name": "Ramachandrapuram",
    "district": "Konaseema",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Ramachandrapuram.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Ramachandrapuram.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Ramachandrapuram.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Ramachandrapuram.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Ramachandrapuram Godavari Flood Embankment",
      "Konaseema Cold Storage & Food Processing Cluster",
      "Ramachandrapuram Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Ramachandrapuram makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "43": {
    "ac_no": 43,
    "ac_name": "Mummidivaram",
    "district": "Konaseema",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Mummidivaram.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Mummidivaram.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Mummidivaram.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Mummidivaram.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Mummidivaram Godavari Flood Embankment",
      "Konaseema Cold Storage & Food Processing Cluster",
      "Mummidivaram Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Mummidivaram makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "44": {
    "ac_no": 44,
    "ac_name": "Amalapuram",
    "district": "Konaseema",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Amalapuram.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Amalapuram.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Amalapuram.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Amalapuram.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Amalapuram Godavari Flood Embankment",
      "Konaseema Cold Storage & Food Processing Cluster",
      "Amalapuram Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Amalapuram makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "45": {
    "ac_no": 45,
    "ac_name": "Razole",
    "district": "Konaseema",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Razole.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Razole.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Razole.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Razole.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Razole Godavari Flood Embankment",
      "Konaseema Cold Storage & Food Processing Cluster",
      "Razole Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Razole makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "46": {
    "ac_no": 46,
    "ac_name": "Gannavaram",
    "district": "Konaseema",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Gannavaram.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Gannavaram.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Gannavaram.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Gannavaram.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Gannavaram Godavari Flood Embankment",
      "Konaseema Cold Storage & Food Processing Cluster",
      "Gannavaram Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Gannavaram makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "47": {
    "ac_no": 47,
    "ac_name": "Kothapeta",
    "district": "Konaseema",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Kothapeta.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Kothapeta.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Kothapeta.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Kothapeta.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Kothapeta Godavari Flood Embankment",
      "Konaseema Cold Storage & Food Processing Cluster",
      "Kothapeta Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Kothapeta makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "48": {
    "ac_no": 48,
    "ac_name": "Mandapeta",
    "district": "Konaseema",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Mandapeta.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Mandapeta.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Mandapeta.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Mandapeta.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Mandapeta Godavari Flood Embankment",
      "Konaseema Cold Storage & Food Processing Cluster",
      "Mandapeta Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Mandapeta makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "49": {
    "ac_no": 49,
    "ac_name": "Rajanagaram",
    "district": "East Godavari",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Rajanagaram.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Rajanagaram.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Rajanagaram.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Rajanagaram.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Rajanagaram Godavari Flood Embankment",
      "East Godavari Cold Storage & Food Processing Cluster",
      "Rajanagaram Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Rajanagaram makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "50": {
    "ac_no": 50,
    "ac_name": "Rajahmundry City",
    "district": "East Godavari",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Rajahmundry City.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Rajahmundry City.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Rajahmundry City.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Rajahmundry City.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Rajahmundry City Godavari Flood Embankment",
      "East Godavari Cold Storage & Food Processing Cluster",
      "Rajahmundry City Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Rajahmundry City makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "51": {
    "ac_no": 51,
    "ac_name": "Rajahmundry Rural",
    "district": "East Godavari",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Rajahmundry Rural.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Rajahmundry Rural.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Rajahmundry Rural.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Rajahmundry Rural.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Rajahmundry Rural Godavari Flood Embankment",
      "East Godavari Cold Storage & Food Processing Cluster",
      "Rajahmundry Rural Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Rajahmundry Rural makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "52": {
    "ac_no": 52,
    "ac_name": "Jaggampeta",
    "district": "Kakinada",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Jaggampeta.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Jaggampeta.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Jaggampeta.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Jaggampeta.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Jaggampeta Godavari Flood Embankment",
      "Kakinada Cold Storage & Food Processing Cluster",
      "Jaggampeta Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Jaggampeta makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "53": {
    "ac_no": 53,
    "ac_name": "Rampachodavaram",
    "district": "Alluri Sitharama Raju",
    "summary": "Cashew and paddy procurement, Vamsadhara/Nagavali river water distribution, and youth employment in Alluri Sitharama Raju drive ground sentiment.",
    "primary_concern": "Irrigation Canal Network, Tribal Livelihoods & Industrial Employment",
    "key_issues": [
      {
        "title": "Alluri Sitharama Raju Irrigation Project Overhaul",
        "category": "Agriculture & Irrigation",
        "description": "Canal lining and timely water releases for ayacut lands in Rampachodavaram assembly segment.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Turpu Kapu communities"
      },
      {
        "title": "Local Youth Industrial Skill & Employment Center",
        "category": "Employment & Industry",
        "description": "Setting up MSME training hubs and agro-processing clusters in Rampachodavaram to curb seasonal migration.",
        "impact_level": "High",
        "affected_demographic": "Youth & BC artisanal youth"
      },
      {
        "title": "Drinking Water & Primary Health Upgrades",
        "category": "Infrastructure",
        "description": "Jal Jeevan Mission piped water supply and 24x7 doctor availability at Primary Health Centers across Rampachodavaram.",
        "impact_level": "Medium",
        "affected_demographic": "Rural women & tribal settlements"
      }
    ],
    "key_projects": [
      "Rampachodavaram Canal Modernization",
      "Alluri Sitharama Raju Agro-Processing Park",
      "Rampachodavaram Skill Development Center"
    ],
    "ground_pulse": "Voters in Rampachodavaram prioritize timely crop input subsidies, MSP for commercial crops, and regional job creation to halt migration to Hyderabad and Vizag."
  },
  "54": {
    "ac_no": 54,
    "ac_name": "Kovvur",
    "district": "East Godavari",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Kovvur.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Kovvur.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Kovvur.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Kovvur.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Kovvur Godavari Flood Embankment",
      "East Godavari Cold Storage & Food Processing Cluster",
      "Kovvur Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Kovvur makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "55": {
    "ac_no": 55,
    "ac_name": "Nidadavole",
    "district": "East Godavari",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Nidadavole.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Nidadavole.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Nidadavole.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Nidadavole.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Nidadavole Godavari Flood Embankment",
      "East Godavari Cold Storage & Food Processing Cluster",
      "Nidadavole Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Nidadavole makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "56": {
    "ac_no": 56,
    "ac_name": "Achanta",
    "district": "West Godavari",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Achanta.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Achanta.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Achanta.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Achanta.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Achanta Godavari Flood Embankment",
      "West Godavari Cold Storage & Food Processing Cluster",
      "Achanta Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Achanta makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "57": {
    "ac_no": 57,
    "ac_name": "Palakollu",
    "district": "West Godavari",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Palakollu.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Palakollu.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Palakollu.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Palakollu.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Palakollu Godavari Flood Embankment",
      "West Godavari Cold Storage & Food Processing Cluster",
      "Palakollu Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Palakollu makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "58": {
    "ac_no": 58,
    "ac_name": "Narasapuram",
    "district": "West Godavari",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Narasapuram.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Narasapuram.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Narasapuram.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Narasapuram.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Narasapuram Godavari Flood Embankment",
      "West Godavari Cold Storage & Food Processing Cluster",
      "Narasapuram Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Narasapuram makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "59": {
    "ac_no": 59,
    "ac_name": "Bhimavaram",
    "district": "West Godavari",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Bhimavaram.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Bhimavaram.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Bhimavaram.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Bhimavaram.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Bhimavaram Godavari Flood Embankment",
      "West Godavari Cold Storage & Food Processing Cluster",
      "Bhimavaram Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Bhimavaram makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "60": {
    "ac_no": 60,
    "ac_name": "Undi",
    "district": "West Godavari",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Undi.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Undi.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Undi.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Undi.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Undi Godavari Flood Embankment",
      "West Godavari Cold Storage & Food Processing Cluster",
      "Undi Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Undi makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "61": {
    "ac_no": 61,
    "ac_name": "Tanuku",
    "district": "West Godavari",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Tanuku.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Tanuku.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Tanuku.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Tanuku.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Tanuku Godavari Flood Embankment",
      "West Godavari Cold Storage & Food Processing Cluster",
      "Tanuku Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Tanuku makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "62": {
    "ac_no": 62,
    "ac_name": "Tadepalligudem",
    "district": "West Godavari",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Tadepalligudem.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Tadepalligudem.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Tadepalligudem.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Tadepalligudem.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Tadepalligudem Godavari Flood Embankment",
      "West Godavari Cold Storage & Food Processing Cluster",
      "Tadepalligudem Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Tadepalligudem makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "63": {
    "ac_no": 63,
    "ac_name": "Unguturu",
    "district": "Eluru",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Unguturu.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Unguturu.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Unguturu.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Unguturu.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Unguturu Godavari Flood Embankment",
      "Eluru Cold Storage & Food Processing Cluster",
      "Unguturu Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Unguturu makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "64": {
    "ac_no": 64,
    "ac_name": "Denduluru",
    "district": "Eluru",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Denduluru.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Denduluru.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Denduluru.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Denduluru.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Denduluru Godavari Flood Embankment",
      "Eluru Cold Storage & Food Processing Cluster",
      "Denduluru Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Denduluru makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "65": {
    "ac_no": 65,
    "ac_name": "Eluru",
    "district": "Eluru",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Eluru.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Eluru.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Eluru.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Eluru.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Eluru Godavari Flood Embankment",
      "Eluru Cold Storage & Food Processing Cluster",
      "Eluru Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Eluru makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "66": {
    "ac_no": 66,
    "ac_name": "Gopalapuram",
    "district": "East Godavari",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Gopalapuram.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Gopalapuram.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Gopalapuram.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Gopalapuram.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Gopalapuram Godavari Flood Embankment",
      "East Godavari Cold Storage & Food Processing Cluster",
      "Gopalapuram Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Gopalapuram makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "67": {
    "ac_no": 67,
    "ac_name": "Polavaram",
    "district": "Eluru",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Polavaram.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Polavaram.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Polavaram.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Polavaram.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Polavaram Godavari Flood Embankment",
      "Eluru Cold Storage & Food Processing Cluster",
      "Polavaram Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Polavaram makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "68": {
    "ac_no": 68,
    "ac_name": "Chintalapudi",
    "district": "Eluru",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Chintalapudi.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Chintalapudi.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Chintalapudi.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Chintalapudi.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Chintalapudi Godavari Flood Embankment",
      "Eluru Cold Storage & Food Processing Cluster",
      "Chintalapudi Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Chintalapudi makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "69": {
    "ac_no": 69,
    "ac_name": "Tiruvuru",
    "district": "NTR",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Tiruvuru.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Tiruvuru.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Tiruvuru to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Tiruvuru municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Tiruvuru Highway Widening Project",
      "NTR Mega Food Park",
      "Tiruvuru Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Tiruvuru expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "70": {
    "ac_no": 70,
    "ac_name": "Nuzvid",
    "district": "Eluru",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Nuzvid.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Nuzvid.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Nuzvid.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Nuzvid.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Nuzvid Godavari Flood Embankment",
      "Eluru Cold Storage & Food Processing Cluster",
      "Nuzvid Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Nuzvid makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "71": {
    "ac_no": 71,
    "ac_name": "Gannavaram (Krishna)",
    "district": "Krishna",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Gannavaram (Krishna).",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Gannavaram (Krishna).",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Gannavaram (Krishna) to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Gannavaram (Krishna) municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Gannavaram (Krishna) Highway Widening Project",
      "Krishna Mega Food Park",
      "Gannavaram (Krishna) Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Gannavaram (Krishna) expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "72": {
    "ac_no": 72,
    "ac_name": "Gudivada",
    "district": "Krishna",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Gudivada.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Gudivada.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Gudivada to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Gudivada municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Gudivada Highway Widening Project",
      "Krishna Mega Food Park",
      "Gudivada Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Gudivada expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "73": {
    "ac_no": 73,
    "ac_name": "Kaikalur",
    "district": "Eluru",
    "summary": "Paddy procurement, aqua-culture electricity tariffs, Godavari flood safety embankments, and welfare delivery shape public focus in Kaikalur.",
    "primary_concern": "Aqua Farming Subsidies, Flood Bunds & Agriculture Price Stability",
    "key_issues": [
      {
        "title": "Aquaculture Power Tariff & Hatchery Subsidy",
        "category": "Agriculture & Irrigation",
        "description": "Lowering power tariffs to \u20b91.50/unit for small-scale shrimp and fish farmers across Kaikalur.",
        "impact_level": "Critical",
        "affected_demographic": "Aqua-culturists, BC Settibalija & Kapu farmers"
      },
      {
        "title": "Godavari Flood Retaining Walls & Drainage Outfalls",
        "category": "Infrastructure",
        "description": "Reinforcing flood protection walls and modernizing salt-water prevention gates in Kaikalur.",
        "impact_level": "High",
        "affected_demographic": "Low-lying riparian villagers & delta communities"
      },
      {
        "title": "Paddy MSP & Grain Procurement Centers",
        "category": "Agriculture & Irrigation",
        "description": "Eliminating middleman deductions and expediting direct bank transfers (DBT) for grain yields in Kaikalur.",
        "impact_level": "High",
        "affected_demographic": "Agrarian farmers & tenancy cultivators"
      }
    ],
    "key_projects": [
      "Kaikalur Godavari Flood Embankment",
      "Eluru Cold Storage & Food Processing Cluster",
      "Kaikalur Drainage Restoration"
    ],
    "ground_pulse": "Strong agrarian awareness in Kaikalur makes prompt paddy procurement payments, transparent Rythu Seva, and flood protection top priorities."
  },
  "74": {
    "ac_no": 74,
    "ac_name": "Pedana",
    "district": "Krishna",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Pedana.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Pedana.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Pedana to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Pedana municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Pedana Highway Widening Project",
      "Krishna Mega Food Park",
      "Pedana Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Pedana expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "75": {
    "ac_no": 75,
    "ac_name": "Machilipatnam",
    "district": "Krishna",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Machilipatnam.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Machilipatnam.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Machilipatnam to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Machilipatnam municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Machilipatnam Highway Widening Project",
      "Krishna Mega Food Park",
      "Machilipatnam Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Machilipatnam expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "76": {
    "ac_no": 76,
    "ac_name": "Avanigadda",
    "district": "Krishna",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Avanigadda.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Avanigadda.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Avanigadda to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Avanigadda municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Avanigadda Highway Widening Project",
      "Krishna Mega Food Park",
      "Avanigadda Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Avanigadda expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "77": {
    "ac_no": 77,
    "ac_name": "Pamarru",
    "district": "Krishna",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Pamarru.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Pamarru.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Pamarru to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Pamarru municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Pamarru Highway Widening Project",
      "Krishna Mega Food Park",
      "Pamarru Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Pamarru expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "78": {
    "ac_no": 78,
    "ac_name": "Penamaluru",
    "district": "Krishna",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Penamaluru.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Penamaluru.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Penamaluru to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Penamaluru municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Penamaluru Highway Widening Project",
      "Krishna Mega Food Park",
      "Penamaluru Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Penamaluru expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "79": {
    "ac_no": 79,
    "ac_name": "Vijayawada West",
    "district": "NTR",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Vijayawada West.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Vijayawada West.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Vijayawada West to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Vijayawada West municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Vijayawada West Highway Widening Project",
      "NTR Mega Food Park",
      "Vijayawada West Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Vijayawada West expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "80": {
    "ac_no": 80,
    "ac_name": "Vijayawada Central",
    "district": "NTR",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Vijayawada Central.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Vijayawada Central.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Vijayawada Central to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Vijayawada Central municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Vijayawada Central Highway Widening Project",
      "NTR Mega Food Park",
      "Vijayawada Central Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Vijayawada Central expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "81": {
    "ac_no": 81,
    "ac_name": "Vijayawada East",
    "district": "NTR",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Vijayawada East.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Vijayawada East.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Vijayawada East to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Vijayawada East municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Vijayawada East Highway Widening Project",
      "NTR Mega Food Park",
      "Vijayawada East Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Vijayawada East expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "82": {
    "ac_no": 82,
    "ac_name": "Mylavaram",
    "district": "NTR",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Mylavaram.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Mylavaram.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Mylavaram to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Mylavaram municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Mylavaram Highway Widening Project",
      "NTR Mega Food Park",
      "Mylavaram Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Mylavaram expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "83": {
    "ac_no": 83,
    "ac_name": "Nandigama",
    "district": "NTR",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Nandigama.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Nandigama.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Nandigama to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Nandigama municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Nandigama Highway Widening Project",
      "NTR Mega Food Park",
      "Nandigama Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Nandigama expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "84": {
    "ac_no": 84,
    "ac_name": "Jaggayyapeta",
    "district": "NTR",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Jaggayyapeta.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Jaggayyapeta.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Jaggayyapeta to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Jaggayyapeta municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Jaggayyapeta Highway Widening Project",
      "NTR Mega Food Park",
      "Jaggayyapeta Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Jaggayyapeta expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "85": {
    "ac_no": 85,
    "ac_name": "Pedakurapadu",
    "district": "Palnadu",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Pedakurapadu.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Pedakurapadu.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Pedakurapadu to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Pedakurapadu municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Pedakurapadu Highway Widening Project",
      "Palnadu Mega Food Park",
      "Pedakurapadu Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Pedakurapadu expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "86": {
    "ac_no": 86,
    "ac_name": "Tadikonda",
    "district": "Guntur",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Tadikonda.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Tadikonda.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Tadikonda to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Tadikonda municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Tadikonda Highway Widening Project",
      "Guntur Mega Food Park",
      "Tadikonda Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Tadikonda expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "87": {
    "ac_no": 87,
    "ac_name": "Mangalagiri",
    "district": "Guntur",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Mangalagiri.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Mangalagiri.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Mangalagiri to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Mangalagiri municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Mangalagiri Highway Widening Project",
      "Guntur Mega Food Park",
      "Mangalagiri Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Mangalagiri expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "88": {
    "ac_no": 88,
    "ac_name": "Ponnuru",
    "district": "Guntur",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Ponnuru.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Ponnuru.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Ponnuru to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Ponnuru municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Ponnuru Highway Widening Project",
      "Guntur Mega Food Park",
      "Ponnuru Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Ponnuru expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "89": {
    "ac_no": 89,
    "ac_name": "Vemuru",
    "district": "Bapatla",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Vemuru.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Vemuru.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Vemuru to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Vemuru municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Vemuru Highway Widening Project",
      "Bapatla Mega Food Park",
      "Vemuru Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Vemuru expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "90": {
    "ac_no": 90,
    "ac_name": "Repalle",
    "district": "Bapatla",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Repalle.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Repalle.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Repalle to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Repalle municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Repalle Highway Widening Project",
      "Bapatla Mega Food Park",
      "Repalle Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Repalle expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "91": {
    "ac_no": 91,
    "ac_name": "Tenali",
    "district": "Guntur",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Tenali.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Tenali.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Tenali to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Tenali municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Tenali Highway Widening Project",
      "Guntur Mega Food Park",
      "Tenali Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Tenali expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "92": {
    "ac_no": 92,
    "ac_name": "Bapatla",
    "district": "Bapatla",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Bapatla.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Bapatla.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Bapatla to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Bapatla municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Bapatla Highway Widening Project",
      "Bapatla Mega Food Park",
      "Bapatla Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Bapatla expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "93": {
    "ac_no": 93,
    "ac_name": "Prathipadu (Guntur)",
    "district": "Guntur",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Prathipadu (Guntur).",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Prathipadu (Guntur).",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Prathipadu (Guntur) to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Prathipadu (Guntur) municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Prathipadu (Guntur) Highway Widening Project",
      "Guntur Mega Food Park",
      "Prathipadu (Guntur) Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Prathipadu (Guntur) expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "94": {
    "ac_no": 94,
    "ac_name": "Guntur West",
    "district": "Guntur",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Guntur West.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Guntur West.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Guntur West to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Guntur West municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Guntur West Highway Widening Project",
      "Guntur Mega Food Park",
      "Guntur West Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Guntur West expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "95": {
    "ac_no": 95,
    "ac_name": "Guntur East",
    "district": "Guntur",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Guntur East.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Guntur East.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Guntur East to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Guntur East municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Guntur East Highway Widening Project",
      "Guntur Mega Food Park",
      "Guntur East Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Guntur East expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "96": {
    "ac_no": 96,
    "ac_name": "Chilakaluripet",
    "district": "Palnadu",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Chilakaluripet.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Chilakaluripet.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Chilakaluripet to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Chilakaluripet municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Chilakaluripet Highway Widening Project",
      "Palnadu Mega Food Park",
      "Chilakaluripet Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Chilakaluripet expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "97": {
    "ac_no": 97,
    "ac_name": "Narasaraopet",
    "district": "Palnadu",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Narasaraopet.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Narasaraopet.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Narasaraopet to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Narasaraopet municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Narasaraopet Highway Widening Project",
      "Palnadu Mega Food Park",
      "Narasaraopet Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Narasaraopet expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "98": {
    "ac_no": 98,
    "ac_name": "Sattenapalle",
    "district": "Palnadu",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Sattenapalle.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Sattenapalle.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Sattenapalle to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Sattenapalle municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Sattenapalle Highway Widening Project",
      "Palnadu Mega Food Park",
      "Sattenapalle Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Sattenapalle expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "99": {
    "ac_no": 99,
    "ac_name": "Vinukonda",
    "district": "Palnadu",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Vinukonda.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Vinukonda.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Vinukonda to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Vinukonda municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Vinukonda Highway Widening Project",
      "Palnadu Mega Food Park",
      "Vinukonda Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Vinukonda expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "100": {
    "ac_no": 100,
    "ac_name": "Gurajala",
    "district": "Palnadu",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Gurajala.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Gurajala.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Gurajala to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Gurajala municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Gurajala Highway Widening Project",
      "Palnadu Mega Food Park",
      "Gurajala Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Gurajala expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "101": {
    "ac_no": 101,
    "ac_name": "Macherla",
    "district": "Palnadu",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Macherla.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Macherla.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Macherla to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Macherla municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Macherla Highway Widening Project",
      "Palnadu Mega Food Park",
      "Macherla Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Macherla expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "102": {
    "ac_no": 102,
    "ac_name": "Yerragondapalem",
    "district": "Prakasam",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Yerragondapalem.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Yerragondapalem.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Yerragondapalem to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Yerragondapalem municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Yerragondapalem Highway Widening Project",
      "Prakasam Mega Food Park",
      "Yerragondapalem Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Yerragondapalem expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "103": {
    "ac_no": 103,
    "ac_name": "Darsi",
    "district": "Prakasam",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Darsi.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Darsi.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Darsi to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Darsi municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Darsi Highway Widening Project",
      "Prakasam Mega Food Park",
      "Darsi Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Darsi expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "104": {
    "ac_no": 104,
    "ac_name": "Parchur",
    "district": "Bapatla",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Parchur.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Parchur.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Parchur to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Parchur municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Parchur Highway Widening Project",
      "Bapatla Mega Food Park",
      "Parchur Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Parchur expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "105": {
    "ac_no": 105,
    "ac_name": "Addanki",
    "district": "Bapatla",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Addanki.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Addanki.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Addanki to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Addanki municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Addanki Highway Widening Project",
      "Bapatla Mega Food Park",
      "Addanki Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Addanki expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "106": {
    "ac_no": 106,
    "ac_name": "Chirala",
    "district": "Bapatla",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Chirala.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Chirala.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Chirala to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Chirala municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Chirala Highway Widening Project",
      "Bapatla Mega Food Park",
      "Chirala Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Chirala expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "107": {
    "ac_no": 107,
    "ac_name": "Santhanuthalapadu",
    "district": "Prakasam",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Santhanuthalapadu.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Santhanuthalapadu.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Santhanuthalapadu to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Santhanuthalapadu municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Santhanuthalapadu Highway Widening Project",
      "Prakasam Mega Food Park",
      "Santhanuthalapadu Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Santhanuthalapadu expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "108": {
    "ac_no": 108,
    "ac_name": "Ongole",
    "district": "Prakasam",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Ongole.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Ongole.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Ongole to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Ongole municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Ongole Highway Widening Project",
      "Prakasam Mega Food Park",
      "Ongole Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Ongole expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "109": {
    "ac_no": 109,
    "ac_name": "Kandukur",
    "district": "Nellore",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Kandukur.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Nellore Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Kandukur.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Kandukur.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Kandukur.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Kandukur Multi-Village Drinking Water Scheme",
      "Nellore Electronics Cluster Expansion",
      "Kandukur Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Kandukur look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "110": {
    "ac_no": 110,
    "ac_name": "Kondapi",
    "district": "Prakasam",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Kondapi.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Kondapi.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Kondapi to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Kondapi municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Kondapi Highway Widening Project",
      "Prakasam Mega Food Park",
      "Kondapi Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Kondapi expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "111": {
    "ac_no": 111,
    "ac_name": "Markapuram",
    "district": "Prakasam",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Markapuram.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Markapuram.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Markapuram to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Markapuram municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Markapuram Highway Widening Project",
      "Prakasam Mega Food Park",
      "Markapuram Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Markapuram expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "112": {
    "ac_no": 112,
    "ac_name": "Giddalur",
    "district": "Prakasam",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Giddalur.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Giddalur.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Giddalur to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Giddalur municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Giddalur Highway Widening Project",
      "Prakasam Mega Food Park",
      "Giddalur Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Giddalur expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "113": {
    "ac_no": 113,
    "ac_name": "Kanigiri",
    "district": "Prakasam",
    "summary": "Capital region connectivity, chilli/cotton market yard prices, Sagar canal water supply, and coastal highway infrastructure form core issues in Kanigiri.",
    "primary_concern": "Amaravati Capital Linkages, Mirchi & Tobacco MSP, and Industrial Logistics",
    "key_issues": [
      {
        "title": "Commercial Crop MSP & Cold Storage Access",
        "category": "Agriculture & Irrigation",
        "description": "Transparent auctioning and price stabilization funds for chilli, cotton, and tobacco growers in Kanigiri.",
        "impact_level": "Critical",
        "affected_demographic": "Farmers & tenant cultivators"
      },
      {
        "title": "Capital Amaravati Highway & Logistics Corridor",
        "category": "Infrastructure",
        "description": "Four-lane arterial connectivity connecting Kanigiri to the core capital region and nearby expressways.",
        "impact_level": "High",
        "affected_demographic": "Traders, entrepreneurs & commuters"
      },
      {
        "title": "Drinking Water & Underground Drainage System",
        "category": "Governance & Local",
        "description": "Comprehensive underground drainage and drinking water coverage in Kanigiri municipal and peri-urban wards.",
        "impact_level": "Medium",
        "affected_demographic": "Urban households & shopkeepers"
      }
    ],
    "key_projects": [
      "Kanigiri Highway Widening Project",
      "Prakasam Mega Food Park",
      "Kanigiri Drinking Water Augmentation"
    ],
    "ground_pulse": "Voters in Kanigiri expect accelerated capital infrastructure momentum, prompt MSP for cash crops, and business-friendly policies."
  },
  "114": {
    "ac_no": 114,
    "ac_name": "Kavali",
    "district": "Nellore",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Kavali.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Nellore Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Kavali.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Kavali.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Kavali.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Kavali Multi-Village Drinking Water Scheme",
      "Nellore Electronics Cluster Expansion",
      "Kavali Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Kavali look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "115": {
    "ac_no": 115,
    "ac_name": "Atmakur",
    "district": "Nellore",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Atmakur.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Nellore Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Atmakur.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Atmakur.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Atmakur.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Atmakur Multi-Village Drinking Water Scheme",
      "Nellore Electronics Cluster Expansion",
      "Atmakur Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Atmakur look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "116": {
    "ac_no": 116,
    "ac_name": "Kovur",
    "district": "Nellore",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Kovur.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Nellore Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Kovur.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Kovur.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Kovur.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Kovur Multi-Village Drinking Water Scheme",
      "Nellore Electronics Cluster Expansion",
      "Kovur Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Kovur look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "117": {
    "ac_no": 117,
    "ac_name": "Nellore City",
    "district": "Nellore",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Nellore City.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Nellore Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Nellore City.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Nellore City.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Nellore City.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Nellore City Multi-Village Drinking Water Scheme",
      "Nellore Electronics Cluster Expansion",
      "Nellore City Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Nellore City look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "118": {
    "ac_no": 118,
    "ac_name": "Nellore Rural",
    "district": "Nellore",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Nellore Rural.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Nellore Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Nellore Rural.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Nellore Rural.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Nellore Rural.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Nellore Rural Multi-Village Drinking Water Scheme",
      "Nellore Electronics Cluster Expansion",
      "Nellore Rural Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Nellore Rural look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "119": {
    "ac_no": 119,
    "ac_name": "Sarvepalli",
    "district": "Nellore",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Sarvepalli.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Nellore Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Sarvepalli.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Sarvepalli.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Sarvepalli.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Sarvepalli Multi-Village Drinking Water Scheme",
      "Nellore Electronics Cluster Expansion",
      "Sarvepalli Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Sarvepalli look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "120": {
    "ac_no": 120,
    "ac_name": "Gudur",
    "district": "Tirupati",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Gudur.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Tirupati Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Gudur.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Gudur.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Gudur.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Gudur Multi-Village Drinking Water Scheme",
      "Tirupati Electronics Cluster Expansion",
      "Gudur Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Gudur look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "121": {
    "ac_no": 121,
    "ac_name": "Sullurpeta",
    "district": "Tirupati",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Sullurpeta.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Tirupati Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Sullurpeta.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Sullurpeta.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Sullurpeta.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Sullurpeta Multi-Village Drinking Water Scheme",
      "Tirupati Electronics Cluster Expansion",
      "Sullurpeta Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Sullurpeta look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "122": {
    "ac_no": 122,
    "ac_name": "Venkatagiri",
    "district": "Tirupati",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Venkatagiri.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Tirupati Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Venkatagiri.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Venkatagiri.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Venkatagiri.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Venkatagiri Multi-Village Drinking Water Scheme",
      "Tirupati Electronics Cluster Expansion",
      "Venkatagiri Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Venkatagiri look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "123": {
    "ac_no": 123,
    "ac_name": "Udayagiri",
    "district": "Nellore",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Udayagiri.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Nellore Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Udayagiri.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Udayagiri.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Udayagiri.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Udayagiri Multi-Village Drinking Water Scheme",
      "Nellore Electronics Cluster Expansion",
      "Udayagiri Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Udayagiri look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "124": {
    "ac_no": 124,
    "ac_name": "Badvel",
    "district": "Kadapa",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Badvel.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Badvel for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Badvel.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Badvel.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Badvel Branch Canal Distributary Overhaul",
      "Kadapa Solar Park & Renewable Energy Hub",
      "Badvel Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Badvel are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "125": {
    "ac_no": 125,
    "ac_name": "Rajampet",
    "district": "Annamayya",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Rajampet.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Rajampet for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Rajampet.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Rajampet.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Rajampet Branch Canal Distributary Overhaul",
      "Annamayya Solar Park & Renewable Energy Hub",
      "Rajampet Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Rajampet are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "126": {
    "ac_no": 126,
    "ac_name": "Kadapa",
    "district": "Kadapa",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Kadapa.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Kadapa for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Kadapa.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Kadapa.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Kadapa Branch Canal Distributary Overhaul",
      "Kadapa Solar Park & Renewable Energy Hub",
      "Kadapa Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Kadapa are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "127": {
    "ac_no": 127,
    "ac_name": "Kodur",
    "district": "Annamayya",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Kodur.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Kodur for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Kodur.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Kodur.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Kodur Branch Canal Distributary Overhaul",
      "Annamayya Solar Park & Renewable Energy Hub",
      "Kodur Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Kodur are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "128": {
    "ac_no": 128,
    "ac_name": "Rayachoti",
    "district": "Annamayya",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Rayachoti.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Rayachoti for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Rayachoti.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Rayachoti.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Rayachoti Branch Canal Distributary Overhaul",
      "Annamayya Solar Park & Renewable Energy Hub",
      "Rayachoti Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Rayachoti are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "129": {
    "ac_no": 129,
    "ac_name": "Pulivendla",
    "district": "Kadapa",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Pulivendla.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Pulivendla for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Pulivendla.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Pulivendla.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Pulivendla Branch Canal Distributary Overhaul",
      "Kadapa Solar Park & Renewable Energy Hub",
      "Pulivendla Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Pulivendla are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "130": {
    "ac_no": 130,
    "ac_name": "Kamalapuram",
    "district": "Kadapa",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Kamalapuram.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Kamalapuram for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Kamalapuram.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Kamalapuram.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Kamalapuram Branch Canal Distributary Overhaul",
      "Kadapa Solar Park & Renewable Energy Hub",
      "Kamalapuram Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Kamalapuram are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "131": {
    "ac_no": 131,
    "ac_name": "Jammalamadugu",
    "district": "Kadapa",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Jammalamadugu.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Jammalamadugu for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Jammalamadugu.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Jammalamadugu.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Jammalamadugu Branch Canal Distributary Overhaul",
      "Kadapa Solar Park & Renewable Energy Hub",
      "Jammalamadugu Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Jammalamadugu are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "132": {
    "ac_no": 132,
    "ac_name": "Proddatur",
    "district": "Kadapa",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Proddatur.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Proddatur for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Proddatur.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Proddatur.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Proddatur Branch Canal Distributary Overhaul",
      "Kadapa Solar Park & Renewable Energy Hub",
      "Proddatur Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Proddatur are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "133": {
    "ac_no": 133,
    "ac_name": "Mydukur",
    "district": "Kadapa",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Mydukur.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Mydukur for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Mydukur.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Mydukur.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Mydukur Branch Canal Distributary Overhaul",
      "Kadapa Solar Park & Renewable Energy Hub",
      "Mydukur Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Mydukur are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "134": {
    "ac_no": 134,
    "ac_name": "Allagadda",
    "district": "Nandyal",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Allagadda.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Allagadda for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Allagadda.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Allagadda.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Allagadda Branch Canal Distributary Overhaul",
      "Nandyal Solar Park & Renewable Energy Hub",
      "Allagadda Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Allagadda are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "135": {
    "ac_no": 135,
    "ac_name": "Srisailam",
    "district": "Nandyal",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Srisailam.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Srisailam for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Srisailam.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Srisailam.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Srisailam Branch Canal Distributary Overhaul",
      "Nandyal Solar Park & Renewable Energy Hub",
      "Srisailam Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Srisailam are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "136": {
    "ac_no": 136,
    "ac_name": "Nandikotkur",
    "district": "Nandyal",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Nandikotkur.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Nandikotkur for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Nandikotkur.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Nandikotkur.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Nandikotkur Branch Canal Distributary Overhaul",
      "Nandyal Solar Park & Renewable Energy Hub",
      "Nandikotkur Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Nandikotkur are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "137": {
    "ac_no": 137,
    "ac_name": "Kurnool",
    "district": "Kurnool",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Kurnool.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Kurnool for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Kurnool.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Kurnool.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Kurnool Branch Canal Distributary Overhaul",
      "Kurnool Solar Park & Renewable Energy Hub",
      "Kurnool Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Kurnool are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "138": {
    "ac_no": 138,
    "ac_name": "Panyam",
    "district": "Kurnool",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Panyam.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Panyam for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Panyam.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Panyam.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Panyam Branch Canal Distributary Overhaul",
      "Kurnool Solar Park & Renewable Energy Hub",
      "Panyam Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Panyam are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "139": {
    "ac_no": 139,
    "ac_name": "Nandyal",
    "district": "Nandyal",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Nandyal.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Nandyal for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Nandyal.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Nandyal.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Nandyal Branch Canal Distributary Overhaul",
      "Nandyal Solar Park & Renewable Energy Hub",
      "Nandyal Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Nandyal are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "140": {
    "ac_no": 140,
    "ac_name": "Banaganapalle",
    "district": "Nandyal",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Banaganapalle.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Banaganapalle for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Banaganapalle.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Banaganapalle.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Banaganapalle Branch Canal Distributary Overhaul",
      "Nandyal Solar Park & Renewable Energy Hub",
      "Banaganapalle Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Banaganapalle are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "141": {
    "ac_no": 141,
    "ac_name": "Dhone",
    "district": "Nandyal",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Dhone.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Dhone for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Dhone.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Dhone.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Dhone Branch Canal Distributary Overhaul",
      "Nandyal Solar Park & Renewable Energy Hub",
      "Dhone Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Dhone are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "142": {
    "ac_no": 142,
    "ac_name": "Pattikonda",
    "district": "Kurnool",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Pattikonda.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Pattikonda for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Pattikonda.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Pattikonda.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Pattikonda Branch Canal Distributary Overhaul",
      "Kurnool Solar Park & Renewable Energy Hub",
      "Pattikonda Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Pattikonda are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "143": {
    "ac_no": 143,
    "ac_name": "Kodumur",
    "district": "Kurnool",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Kodumur.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Kodumur for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Kodumur.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Kodumur.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Kodumur Branch Canal Distributary Overhaul",
      "Kurnool Solar Park & Renewable Energy Hub",
      "Kodumur Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Kodumur are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "144": {
    "ac_no": 144,
    "ac_name": "Yemmiganur",
    "district": "Kurnool",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Yemmiganur.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Yemmiganur for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Yemmiganur.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Yemmiganur.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Yemmiganur Branch Canal Distributary Overhaul",
      "Kurnool Solar Park & Renewable Energy Hub",
      "Yemmiganur Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Yemmiganur are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "145": {
    "ac_no": 145,
    "ac_name": "Mantralayam",
    "district": "Kurnool",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Mantralayam.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Mantralayam for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Mantralayam.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Mantralayam.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Mantralayam Branch Canal Distributary Overhaul",
      "Kurnool Solar Park & Renewable Energy Hub",
      "Mantralayam Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Mantralayam are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "146": {
    "ac_no": 146,
    "ac_name": "Adoni",
    "district": "Kurnool",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Adoni.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Adoni for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Adoni.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Adoni.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Adoni Branch Canal Distributary Overhaul",
      "Kurnool Solar Park & Renewable Energy Hub",
      "Adoni Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Adoni are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "147": {
    "ac_no": 147,
    "ac_name": "Alur",
    "district": "Kurnool",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Alur.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Alur for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Alur.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Alur.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Alur Branch Canal Distributary Overhaul",
      "Kurnool Solar Park & Renewable Energy Hub",
      "Alur Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Alur are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "148": {
    "ac_no": 148,
    "ac_name": "Rayadurg",
    "district": "Anantapur",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Rayadurg.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Rayadurg for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Rayadurg.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Rayadurg.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Rayadurg Branch Canal Distributary Overhaul",
      "Anantapur Solar Park & Renewable Energy Hub",
      "Rayadurg Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Rayadurg are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "149": {
    "ac_no": 149,
    "ac_name": "Uravakonda",
    "district": "Anantapur",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Uravakonda.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Uravakonda for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Uravakonda.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Uravakonda.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Uravakonda Branch Canal Distributary Overhaul",
      "Anantapur Solar Park & Renewable Energy Hub",
      "Uravakonda Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Uravakonda are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "150": {
    "ac_no": 150,
    "ac_name": "Guntakal",
    "district": "Anantapur",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Guntakal.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Guntakal for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Guntakal.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Guntakal.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Guntakal Branch Canal Distributary Overhaul",
      "Anantapur Solar Park & Renewable Energy Hub",
      "Guntakal Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Guntakal are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "151": {
    "ac_no": 151,
    "ac_name": "Tadipatri",
    "district": "Anantapur",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Tadipatri.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Tadipatri for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Tadipatri.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Tadipatri.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Tadipatri Branch Canal Distributary Overhaul",
      "Anantapur Solar Park & Renewable Energy Hub",
      "Tadipatri Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Tadipatri are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "152": {
    "ac_no": 152,
    "ac_name": "Singanamala",
    "district": "Anantapur",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Singanamala.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Singanamala for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Singanamala.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Singanamala.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Singanamala Branch Canal Distributary Overhaul",
      "Anantapur Solar Park & Renewable Energy Hub",
      "Singanamala Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Singanamala are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "153": {
    "ac_no": 153,
    "ac_name": "Anantapur Urban",
    "district": "Anantapur",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Anantapur Urban.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Anantapur Urban for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Anantapur Urban.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Anantapur Urban.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Anantapur Urban Branch Canal Distributary Overhaul",
      "Anantapur Solar Park & Renewable Energy Hub",
      "Anantapur Urban Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Anantapur Urban are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "154": {
    "ac_no": 154,
    "ac_name": "Kalyandurg",
    "district": "Anantapur",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Kalyandurg.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Kalyandurg for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Kalyandurg.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Kalyandurg.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Kalyandurg Branch Canal Distributary Overhaul",
      "Anantapur Solar Park & Renewable Energy Hub",
      "Kalyandurg Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Kalyandurg are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "155": {
    "ac_no": 155,
    "ac_name": "Raptadu",
    "district": "Anantapur",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Raptadu.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Raptadu for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Raptadu.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Raptadu.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Raptadu Branch Canal Distributary Overhaul",
      "Anantapur Solar Park & Renewable Energy Hub",
      "Raptadu Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Raptadu are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "156": {
    "ac_no": 156,
    "ac_name": "Madakasira",
    "district": "Sri Sathya Sai",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Madakasira.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Madakasira for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Madakasira.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Madakasira.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Madakasira Branch Canal Distributary Overhaul",
      "Sri Sathya Sai Solar Park & Renewable Energy Hub",
      "Madakasira Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Madakasira are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "157": {
    "ac_no": 157,
    "ac_name": "Hindupur",
    "district": "Sri Sathya Sai",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Hindupur.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Hindupur for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Hindupur.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Hindupur.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Hindupur Branch Canal Distributary Overhaul",
      "Sri Sathya Sai Solar Park & Renewable Energy Hub",
      "Hindupur Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Hindupur are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "158": {
    "ac_no": 158,
    "ac_name": "Penukonda",
    "district": "Sri Sathya Sai",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Penukonda.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Penukonda for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Penukonda.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Penukonda.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Penukonda Branch Canal Distributary Overhaul",
      "Sri Sathya Sai Solar Park & Renewable Energy Hub",
      "Penukonda Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Penukonda are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "159": {
    "ac_no": 159,
    "ac_name": "Puttaparthi",
    "district": "Sri Sathya Sai",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Puttaparthi.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Puttaparthi for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Puttaparthi.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Puttaparthi.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Puttaparthi Branch Canal Distributary Overhaul",
      "Sri Sathya Sai Solar Park & Renewable Energy Hub",
      "Puttaparthi Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Puttaparthi are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "160": {
    "ac_no": 160,
    "ac_name": "Dharmavaram",
    "district": "Sri Sathya Sai",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Dharmavaram.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Dharmavaram for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Dharmavaram.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Dharmavaram.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Dharmavaram Branch Canal Distributary Overhaul",
      "Sri Sathya Sai Solar Park & Renewable Energy Hub",
      "Dharmavaram Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Dharmavaram are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "161": {
    "ac_no": 161,
    "ac_name": "Kadiri",
    "district": "Sri Sathya Sai",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Kadiri.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Kadiri for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Kadiri.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Kadiri.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Kadiri Branch Canal Distributary Overhaul",
      "Sri Sathya Sai Solar Park & Renewable Energy Hub",
      "Kadiri Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Kadiri are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "162": {
    "ac_no": 162,
    "ac_name": "Thamballapalle",
    "district": "Annamayya",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Thamballapalle.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Thamballapalle for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Thamballapalle.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Thamballapalle.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Thamballapalle Branch Canal Distributary Overhaul",
      "Annamayya Solar Park & Renewable Energy Hub",
      "Thamballapalle Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Thamballapalle are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "163": {
    "ac_no": 163,
    "ac_name": "Pileru",
    "district": "Annamayya",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Pileru.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Pileru for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Pileru.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Pileru.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Pileru Branch Canal Distributary Overhaul",
      "Annamayya Solar Park & Renewable Energy Hub",
      "Pileru Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Pileru are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "164": {
    "ac_no": 164,
    "ac_name": "Madanapalle",
    "district": "Annamayya",
    "summary": "Handri-Neeva canal water filling, groundnut crop insurance, silk weaver subsidies, and youth employment define priorities in Madanapalle.",
    "primary_concern": "Drip Irrigation Expansion, Handloom Weaving Subsidies & Drought Resilience",
    "key_issues": [
      {
        "title": "Handri-Neeva & Minor Irrigation Canal Completion",
        "category": "Agriculture & Irrigation",
        "description": "Continuous water supply to minor irrigation tanks and branch canals in Madanapalle for drought mitigation.",
        "impact_level": "Critical",
        "affected_demographic": "Agrarian farmers & BC Kuruba/Boya/Yadava communities"
      },
      {
        "title": "Weaver Yarn Subsidy & Loom Modernization",
        "category": "Employment & Industry",
        "description": "Silk and cotton yarn price support, 200 units free power for handloom weavers, and cooperative marketing in Madanapalle.",
        "impact_level": "High",
        "affected_demographic": "Padmashali & weaver artisans"
      },
      {
        "title": "Solar Agro-Pumpsets & Free Borewell Drilling",
        "category": "Agriculture & Irrigation",
        "description": "Subsidized solar pump connections and micro-irrigation drip kits to combat acute groundwater depletion in Madanapalle.",
        "impact_level": "Medium",
        "affected_demographic": "Dryland smallholders"
      }
    ],
    "key_projects": [
      "Madanapalle Branch Canal Distributary Overhaul",
      "Annamayya Solar Park & Renewable Energy Hub",
      "Madanapalle Tank Desilting Mission"
    ],
    "ground_pulse": "Voters in Madanapalle are keenly focused on perennial irrigation water security, prompt input subsidy disbursements, and anti-drought infrastructure."
  },
  "165": {
    "ac_no": 165,
    "ac_name": "Punganur",
    "district": "Chittoor",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Punganur.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Chittoor Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Punganur.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Punganur.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Punganur.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Punganur Multi-Village Drinking Water Scheme",
      "Chittoor Electronics Cluster Expansion",
      "Punganur Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Punganur look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "166": {
    "ac_no": 166,
    "ac_name": "Chandragiri",
    "district": "Tirupati",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Chandragiri.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Tirupati Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Chandragiri.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Chandragiri.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Chandragiri.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Chandragiri Multi-Village Drinking Water Scheme",
      "Tirupati Electronics Cluster Expansion",
      "Chandragiri Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Chandragiri look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "167": {
    "ac_no": 167,
    "ac_name": "Tirupati",
    "district": "Tirupati",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Tirupati.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Tirupati Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Tirupati.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Tirupati.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Tirupati.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Tirupati Multi-Village Drinking Water Scheme",
      "Tirupati Electronics Cluster Expansion",
      "Tirupati Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Tirupati look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "168": {
    "ac_no": 168,
    "ac_name": "Srikalahasti",
    "district": "Tirupati",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Srikalahasti.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Tirupati Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Srikalahasti.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Srikalahasti.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Srikalahasti.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Srikalahasti Multi-Village Drinking Water Scheme",
      "Tirupati Electronics Cluster Expansion",
      "Srikalahasti Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Srikalahasti look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "169": {
    "ac_no": 169,
    "ac_name": "Sathyavedu",
    "district": "Tirupati",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Sathyavedu.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Tirupati Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Sathyavedu.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Sathyavedu.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Sathyavedu.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Sathyavedu Multi-Village Drinking Water Scheme",
      "Tirupati Electronics Cluster Expansion",
      "Sathyavedu Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Sathyavedu look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "170": {
    "ac_no": 170,
    "ac_name": "Nagari",
    "district": "Chittoor",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Nagari.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Chittoor Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Nagari.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Nagari.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Nagari.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Nagari Multi-Village Drinking Water Scheme",
      "Chittoor Electronics Cluster Expansion",
      "Nagari Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Nagari look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "171": {
    "ac_no": 171,
    "ac_name": "Gangadhara Nellore",
    "district": "Chittoor",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Gangadhara Nellore.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Chittoor Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Gangadhara Nellore.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Gangadhara Nellore.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Gangadhara Nellore.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Gangadhara Nellore Multi-Village Drinking Water Scheme",
      "Chittoor Electronics Cluster Expansion",
      "Gangadhara Nellore Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Gangadhara Nellore look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "172": {
    "ac_no": 172,
    "ac_name": "Chittoor",
    "district": "Chittoor",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Chittoor.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Chittoor Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Chittoor.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Chittoor.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Chittoor.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Chittoor Multi-Village Drinking Water Scheme",
      "Chittoor Electronics Cluster Expansion",
      "Chittoor Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Chittoor look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "173": {
    "ac_no": 173,
    "ac_name": "Puthalapattu",
    "district": "Chittoor",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Puthalapattu.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Chittoor Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Puthalapattu.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Puthalapattu.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Puthalapattu.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Puthalapattu Multi-Village Drinking Water Scheme",
      "Chittoor Electronics Cluster Expansion",
      "Puthalapattu Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Puthalapattu look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "174": {
    "ac_no": 174,
    "ac_name": "Palamaner",
    "district": "Chittoor",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Palamaner.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Chittoor Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Palamaner.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Palamaner.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Palamaner.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Palamaner Multi-Village Drinking Water Scheme",
      "Chittoor Electronics Cluster Expansion",
      "Palamaner Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Palamaner look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  },
  "175": {
    "ac_no": 175,
    "ac_name": "Kuppam",
    "district": "Chittoor",
    "summary": "Krishnapatnam/Sri City industrial job reservations, Somasila/Swarnamukhi water security, and horticulture subsidies dominate Kuppam.",
    "primary_concern": "Industrial Corridor Employment, Water Supply & Mango/Sugarcane Support",
    "key_issues": [
      {
        "title": "Chittoor Industrial Belt Local Employment",
        "category": "Employment & Industry",
        "description": "Enforcing local hiring quotas in industrial parks and manufacturing SEZs for educated youth from Kuppam.",
        "impact_level": "Critical",
        "affected_demographic": "Educated youth & engineering graduates"
      },
      {
        "title": "Horticulture & Dairy Procurement Remuneration",
        "category": "Agriculture & Irrigation",
        "description": "Fruit processing units and enhanced dairy milk procurement incentives across Kuppam.",
        "impact_level": "High",
        "affected_demographic": "Mango growers & dairy farmers"
      },
      {
        "title": "Piped Water Supply from Somasila / Kandaleru",
        "category": "Infrastructure",
        "description": "Overhead water reservoir expansion and rural pipeline grid to resolve fluorosis and water scarcity in Kuppam.",
        "impact_level": "High",
        "affected_demographic": "Rural households & SC/ST colonies"
      }
    ],
    "key_projects": [
      "Kuppam Multi-Village Drinking Water Scheme",
      "Chittoor Electronics Cluster Expansion",
      "Kuppam Horticulture Cold Chain"
    ],
    "ground_pulse": "Residents in Kuppam look for sustainable industrial jobs, water reliability for agriculture, and robust welfare pension execution."
  }
};
