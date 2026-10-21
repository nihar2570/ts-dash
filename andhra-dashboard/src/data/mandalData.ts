export interface MandalDetail {
  mandal_id: number;
  name: string;
  booths: number;
  electorate: number;
  turnout_pct: number;
  lead_party: string;
  margin: number;
  dominant_caste: string;
  dominant_caste_pct: number;
  status: string;
}

export const CONSTITUENCY_MANDALS: Record<number, MandalDetail[]> = {
  "1": [
    {
      "mandal_id": 101,
      "name": "Ichchapuram",
      "booths": 55,
      "electorate": 60373,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 9945,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 102,
      "name": "Kaviti",
      "booths": 55,
      "electorate": 60373,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 11437,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 103,
      "name": "Sompeta",
      "booths": 55,
      "electorate": 60373,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 9448,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 104,
      "name": "Kanchili",
      "booths": 55,
      "electorate": 60373,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 10940,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    }
  ],
  "2": [
    {
      "mandal_id": 201,
      "name": "Palasa",
      "booths": 66,
      "electorate": 71699,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 15467,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 202,
      "name": "Mandasa",
      "booths": 66,
      "electorate": 71699,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 12777,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 203,
      "name": "Vajrapukotturu",
      "booths": 66,
      "electorate": 71699,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 14795,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    }
  ],
  "3": [
    {
      "mandal_id": 301,
      "name": "Tekkali",
      "booths": 55,
      "electorate": 58866,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 8178,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 302,
      "name": "Santhabommali",
      "booths": 55,
      "electorate": 58866,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 9469,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 303,
      "name": "Kotabommali",
      "booths": 55,
      "electorate": 58866,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 7747,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 304,
      "name": "Nandigam",
      "booths": 55,
      "electorate": 58866,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 9039,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    }
  ],
  "4": [
    {
      "mandal_id": 401,
      "name": "Pathapatnam",
      "booths": 37,
      "electorate": 39205,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 5835,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 402,
      "name": "Meliaputti",
      "booths": 37,
      "electorate": 39205,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 4774,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 403,
      "name": "Saravakota",
      "booths": 37,
      "electorate": 39205,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 5570,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 404,
      "name": "Kothuru",
      "booths": 37,
      "electorate": 39205,
      "turnout_pct": 78.2,
      "lead_party": "TDP",
      "margin": 4509,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 405,
      "name": "Hiramandalam",
      "booths": 37,
      "electorate": 39205,
      "turnout_pct": 80.6,
      "lead_party": "TDP",
      "margin": 5305,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    }
  ],
  "5": [
    {
      "mandal_id": 501,
      "name": "Srikakulam Rural",
      "booths": 74,
      "electorate": 77448,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 15756,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 502,
      "name": "Srikakulam Urban",
      "booths": 74,
      "electorate": 77448,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 18382,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 503,
      "name": "Gara",
      "booths": 74,
      "electorate": 77448,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 14880,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    }
  ],
  "6": [
    {
      "mandal_id": 601,
      "name": "Amadalavalasa",
      "booths": 45,
      "electorate": 44683,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 9195,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 602,
      "name": "Sarubujjili",
      "booths": 45,
      "electorate": 44683,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 7444,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 603,
      "name": "Burja",
      "booths": 45,
      "electorate": 44683,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 8758,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 604,
      "name": "Ponduru",
      "booths": 45,
      "electorate": 44683,
      "turnout_pct": 84.8,
      "lead_party": "TDP",
      "margin": 10071,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    }
  ],
  "7": [
    {
      "mandal_id": 701,
      "name": "Etcherla",
      "booths": 59,
      "electorate": 65674,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 6181,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 702,
      "name": "Laveru",
      "booths": 59,
      "electorate": 65674,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 7272,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 703,
      "name": "Ranastalam",
      "booths": 59,
      "electorate": 65674,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 8363,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 704,
      "name": "G.Sigadam",
      "booths": 59,
      "electorate": 65674,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 6908,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "LEAN"
    }
  ],
  "8": [
    {
      "mandal_id": 801,
      "name": "Narasannapeta",
      "booths": 51,
      "electorate": 56604,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 7342,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 802,
      "name": "Jalumuru",
      "booths": 51,
      "electorate": 56604,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 8444,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 803,
      "name": "Saravakota",
      "booths": 51,
      "electorate": 56604,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 6975,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 804,
      "name": "Polaki",
      "booths": 51,
      "electorate": 56604,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 8077,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    }
  ],
  "9": [
    {
      "mandal_id": 901,
      "name": "Rajam",
      "booths": 50,
      "electorate": 54950,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 5957,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 902,
      "name": "Vangara",
      "booths": 50,
      "electorate": 54950,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 4921,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 903,
      "name": "Santhakavati",
      "booths": 50,
      "electorate": 54950,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 5698,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 904,
      "name": "Regidi Amadalavalasa",
      "booths": 50,
      "electorate": 54950,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 4662,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    }
  ],
  "10": [
    {
      "mandal_id": 1001,
      "name": "Palakonda",
      "booths": 45,
      "electorate": 44444,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 3156,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "LEAN"
    },
    {
      "mandal_id": 1002,
      "name": "Seethampeta",
      "booths": 45,
      "electorate": 44444,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 3655,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "LEAN"
    },
    {
      "mandal_id": 1003,
      "name": "Bhamini",
      "booths": 45,
      "electorate": 44444,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 2990,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "LEAN"
    },
    {
      "mandal_id": 1004,
      "name": "Veeraghattam",
      "booths": 45,
      "electorate": 44444,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 3488,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "LEAN"
    }
  ],
  "11": [
    {
      "mandal_id": 1101,
      "name": "Kurupam",
      "booths": 36,
      "electorate": 36870,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 5170,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1102,
      "name": "Gummalakshmipuram",
      "booths": 36,
      "electorate": 36870,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 4230,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1103,
      "name": "Jiyyammavalasa",
      "booths": 36,
      "electorate": 36870,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 4935,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1104,
      "name": "Komarada",
      "booths": 36,
      "electorate": 36870,
      "turnout_pct": 78.2,
      "lead_party": "TDP",
      "margin": 3995,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1105,
      "name": "Garugubilli",
      "booths": 36,
      "electorate": 36870,
      "turnout_pct": 80.6,
      "lead_party": "TDP",
      "margin": 4700,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "STRONGHOLD"
    }
  ],
  "12": [
    {
      "mandal_id": 1201,
      "name": "Parvathipuram",
      "booths": 60,
      "electorate": 60878,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 7324,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1202,
      "name": "Seethanagaram",
      "booths": 60,
      "electorate": 60878,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 8544,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1203,
      "name": "Balijipeta",
      "booths": 60,
      "electorate": 60878,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 6917,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "STRONGHOLD"
    }
  ],
  "13": [
    {
      "mandal_id": 1301,
      "name": "Salur",
      "booths": 45,
      "electorate": 45900,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 3604,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "LEAN"
    },
    {
      "mandal_id": 1302,
      "name": "Pachipenta",
      "booths": 45,
      "electorate": 45900,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 2918,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "LEAN"
    },
    {
      "mandal_id": 1303,
      "name": "Mentada",
      "booths": 45,
      "electorate": 45900,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 3433,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "LEAN"
    },
    {
      "mandal_id": 1304,
      "name": "Makkuva",
      "booths": 45,
      "electorate": 45900,
      "turnout_pct": 84.8,
      "lead_party": "TDP",
      "margin": 3948,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "LEAN"
    }
  ],
  "14": [
    {
      "mandal_id": 1401,
      "name": "Bobbili",
      "booths": 55,
      "electorate": 60764,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 9487,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1402,
      "name": "Ramabhadrapuram",
      "booths": 55,
      "electorate": 60764,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 11162,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1403,
      "name": "Badangi",
      "booths": 55,
      "electorate": 60764,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 12836,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1404,
      "name": "Therlam",
      "booths": 55,
      "electorate": 60764,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 10603,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    }
  ],
  "15": [
    {
      "mandal_id": 1501,
      "name": "Cheepurupalli",
      "booths": 49,
      "electorate": 54215,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 2992,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 1502,
      "name": "Garividi",
      "booths": 49,
      "electorate": 54215,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 3441,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 1503,
      "name": "Gurla",
      "booths": 49,
      "electorate": 54215,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 2843,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 1504,
      "name": "Merakamudidam",
      "booths": 49,
      "electorate": 54215,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 3292,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    }
  ],
  "16": [
    {
      "mandal_id": 1601,
      "name": "Gajapathinagaram",
      "booths": 51,
      "electorate": 55940,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 7274,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 1602,
      "name": "Bondapalli",
      "booths": 51,
      "electorate": 55940,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 6008,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 1603,
      "name": "Gantyada",
      "booths": 51,
      "electorate": 55940,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 6957,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 1604,
      "name": "Dattirajeru",
      "booths": 51,
      "electorate": 55940,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 5692,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    }
  ],
  "17": [
    {
      "mandal_id": 1701,
      "name": "Nellimarla",
      "booths": 54,
      "electorate": 58559,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 9459,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1702,
      "name": "Pusapatirega",
      "booths": 54,
      "electorate": 58559,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 10952,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1703,
      "name": "Denkada",
      "booths": 54,
      "electorate": 58559,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 8961,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1704,
      "name": "Bhogapuram",
      "booths": 54,
      "electorate": 58559,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 10455,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    }
  ],
  "18": [
    {
      "mandal_id": 1801,
      "name": "Vizianagaram Urban",
      "booths": 111,
      "electorate": 118003,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 33334,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1802,
      "name": "Vizianagaram Rural",
      "booths": 111,
      "electorate": 118003,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 27274,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    }
  ],
  "19": [
    {
      "mandal_id": 1901,
      "name": "Srungavarapukota",
      "booths": 44,
      "electorate": 46592,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 6982,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1902,
      "name": "Vepada",
      "booths": 44,
      "electorate": 46592,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 8145,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1903,
      "name": "Lakkavarapukota",
      "booths": 44,
      "electorate": 46592,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 6594,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1904,
      "name": "Kothavalasa",
      "booths": 44,
      "electorate": 46592,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 7758,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1905,
      "name": "Jami",
      "booths": 44,
      "electorate": 46592,
      "turnout_pct": 83.9,
      "lead_party": "TDP",
      "margin": 8921,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    }
  ],
  "20": [
    {
      "mandal_id": 2001,
      "name": "Bheemili",
      "booths": 72,
      "electorate": 82206,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 24255,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2002,
      "name": "Anandapuram",
      "booths": 72,
      "electorate": 82206,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 19635,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2003,
      "name": "Padmanabham",
      "booths": 72,
      "electorate": 82206,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 23100,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2004,
      "name": "Visakhapatnam Rural",
      "booths": 72,
      "electorate": 82206,
      "turnout_pct": 84.8,
      "lead_party": "TDP",
      "margin": 26565,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    }
  ],
  "21": [
    {
      "mandal_id": 2101,
      "name": "Visakhapatnam East",
      "booths": 79,
      "electorate": 87613,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 20081,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2102,
      "name": "MVP Colony",
      "booths": 79,
      "electorate": 87613,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 23625,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2103,
      "name": "Arilova",
      "booths": 79,
      "electorate": 87613,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 27169,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    }
  ],
  "22": [
    {
      "mandal_id": 2201,
      "name": "Visakhapatnam South",
      "booths": 60,
      "electorate": 59824,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 21531,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2202,
      "name": "Town Area",
      "booths": 60,
      "electorate": 59824,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 24761,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2203,
      "name": "Port Area",
      "booths": 60,
      "electorate": 59824,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 20454,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    }
  ],
  "23": [
    {
      "mandal_id": 2301,
      "name": "Visakhapatnam North",
      "booths": 69,
      "electorate": 75029,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 18221,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2302,
      "name": "Maddilapalem",
      "booths": 69,
      "electorate": 75029,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 15052,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2303,
      "name": "Dwarakanagar",
      "booths": 69,
      "electorate": 75029,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 17429,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    }
  ],
  "24": [
    {
      "mandal_id": 2401,
      "name": "Visakhapatnam West",
      "booths": 60,
      "electorate": 63881,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 11141,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2402,
      "name": "Gopalapatnam",
      "booths": 60,
      "electorate": 63881,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 12900,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2403,
      "name": "Pendurthi West",
      "booths": 60,
      "electorate": 63881,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 10555,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    }
  ],
  "25": [
    {
      "mandal_id": 2501,
      "name": "Gajuwaka",
      "booths": 90,
      "electorate": 95653,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 34919,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2502,
      "name": "Pedagantyada",
      "booths": 90,
      "electorate": 95653,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 28570,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2503,
      "name": "Kurmannapalem",
      "booths": 90,
      "electorate": 95653,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 33332,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    }
  ],
  "26": [
    {
      "mandal_id": 2601,
      "name": "Chodavaram",
      "booths": 54,
      "electorate": 56438,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 9492,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2602,
      "name": "Rolugunta",
      "booths": 54,
      "electorate": 56438,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 11074,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2603,
      "name": "Ravikamatham",
      "booths": 54,
      "electorate": 56438,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 8965,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2604,
      "name": "Butchayyapeta",
      "booths": 54,
      "electorate": 56438,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 10547,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    }
  ],
  "27": [
    {
      "mandal_id": 2701,
      "name": "Madugula",
      "booths": 47,
      "electorate": 48984,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 7356,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2702,
      "name": "Cheedikada",
      "booths": 47,
      "electorate": 48984,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 5955,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2703,
      "name": "Devarapalli",
      "booths": 47,
      "electorate": 48984,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 7006,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2704,
      "name": "K.Kotapadu",
      "booths": 47,
      "electorate": 48984,
      "turnout_pct": 84.8,
      "lead_party": "TDP",
      "margin": 8057,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    }
  ],
  "28": [
    {
      "mandal_id": 2801,
      "name": "Araku Valley",
      "booths": 30,
      "electorate": 22833,
      "turnout_pct": 74.6,
      "lead_party": "YSRCP",
      "margin": 4515,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2802,
      "name": "Ananthagiri",
      "booths": 30,
      "electorate": 22833,
      "turnout_pct": 77.0,
      "lead_party": "YSRCP",
      "margin": 5312,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2803,
      "name": "Dumbriguda",
      "booths": 30,
      "electorate": 22833,
      "turnout_pct": 79.4,
      "lead_party": "YSRCP",
      "margin": 6109,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2804,
      "name": "Hukumpeta",
      "booths": 30,
      "electorate": 22833,
      "turnout_pct": 76.2,
      "lead_party": "YSRCP",
      "margin": 5047,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2805,
      "name": "Pedabayalu",
      "booths": 30,
      "electorate": 22833,
      "turnout_pct": 78.6,
      "lead_party": "YSRCP",
      "margin": 5844,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2806,
      "name": "Munchingiputtu",
      "booths": 30,
      "electorate": 22833,
      "turnout_pct": 75.4,
      "lead_party": "YSRCP",
      "margin": 4781,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    }
  ],
  "29": [
    {
      "mandal_id": 2901,
      "name": "Paderu",
      "booths": 36,
      "electorate": 31334,
      "turnout_pct": 77.9,
      "lead_party": "YSRCP",
      "margin": 3867,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2902,
      "name": "G.Madugula",
      "booths": 36,
      "electorate": 31334,
      "turnout_pct": 80.3,
      "lead_party": "YSRCP",
      "margin": 4447,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2903,
      "name": "Chintapalle",
      "booths": 36,
      "electorate": 31334,
      "turnout_pct": 77.1,
      "lead_party": "YSRCP",
      "margin": 3674,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2904,
      "name": "G.K.Veedhi",
      "booths": 36,
      "electorate": 31334,
      "turnout_pct": 79.5,
      "lead_party": "YSRCP",
      "margin": 4254,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2905,
      "name": "Koyyuru",
      "booths": 36,
      "electorate": 31334,
      "turnout_pct": 76.3,
      "lead_party": "YSRCP",
      "margin": 3480,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    }
  ],
  "30": [
    {
      "mandal_id": 3001,
      "name": "Anakapalle",
      "booths": 67,
      "electorate": 73286,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 25209,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3002,
      "name": "Kasimkota",
      "booths": 67,
      "electorate": 73286,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 20825,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3003,
      "name": "Munagapaka",
      "booths": 67,
      "electorate": 73286,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 24113,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    }
  ],
  "31": [
    {
      "mandal_id": 3101,
      "name": "Pendurthi",
      "booths": 66,
      "electorate": 71330,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 19444,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3102,
      "name": "Parawada",
      "booths": 66,
      "electorate": 71330,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 22514,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3103,
      "name": "Sabbavaram",
      "booths": 66,
      "electorate": 71330,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 18420,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3104,
      "name": "Pedagantyada",
      "booths": 66,
      "electorate": 71330,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 21490,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    }
  ],
  "32": [
    {
      "mandal_id": 3201,
      "name": "Elamanchili",
      "booths": 52,
      "electorate": 55008,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 13462,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3202,
      "name": "Rambilli",
      "booths": 52,
      "electorate": 55008,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 11015,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3203,
      "name": "Atchutapuram",
      "booths": 52,
      "electorate": 55008,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 12850,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3204,
      "name": "S.Rayavaram",
      "booths": 52,
      "electorate": 55008,
      "turnout_pct": 78.2,
      "lead_party": "TDP",
      "margin": 10403,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    }
  ],
  "33": [
    {
      "mandal_id": 3301,
      "name": "Payakaraopeta",
      "booths": 79,
      "electorate": 83171,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 13118,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3302,
      "name": "Nakkapalli",
      "booths": 79,
      "electorate": 83171,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 15304,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3303,
      "name": "Kotauratla",
      "booths": 79,
      "electorate": 83171,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 12389,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    }
  ],
  "34": [
    {
      "mandal_id": 3401,
      "name": "Narsipatnam",
      "booths": 53,
      "electorate": 54762,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 6477,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "LEAN"
    },
    {
      "mandal_id": 3402,
      "name": "Golugonda",
      "booths": 53,
      "electorate": 54762,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 5243,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "LEAN"
    },
    {
      "mandal_id": 3403,
      "name": "Makavarapalem",
      "booths": 53,
      "electorate": 54762,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 6169,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "LEAN"
    },
    {
      "mandal_id": 3404,
      "name": "Nathavaram",
      "booths": 53,
      "electorate": 54762,
      "turnout_pct": 84.8,
      "lead_party": "TDP",
      "margin": 7094,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "LEAN"
    }
  ],
  "35": [
    {
      "mandal_id": 3501,
      "name": "Tuni",
      "booths": 72,
      "electorate": 79631,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 4300,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 3502,
      "name": "Kotananduru",
      "booths": 72,
      "electorate": 79631,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 5059,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 3503,
      "name": "Thondangi",
      "booths": 72,
      "electorate": 79631,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 5817,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "LEAN"
    }
  ],
  "36": [
    {
      "mandal_id": 3601,
      "name": "Prathipadu",
      "booths": 51,
      "electorate": 55788,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 9692,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3602,
      "name": "Sankhavaram",
      "booths": 51,
      "electorate": 55788,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 11145,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3603,
      "name": "Yeleswaram",
      "booths": 51,
      "electorate": 55788,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 9207,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3604,
      "name": "Rowthulapudi",
      "booths": 51,
      "electorate": 55788,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 10661,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    }
  ],
  "37": [
    {
      "mandal_id": 3701,
      "name": "Pithapuram",
      "booths": 81,
      "electorate": 87830,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 26940,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3702,
      "name": "Gollaprolu",
      "booths": 81,
      "electorate": 87830,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 22255,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3703,
      "name": "U.Kothapalli",
      "booths": 81,
      "electorate": 87830,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 25768,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    }
  ],
  "38": [
    {
      "mandal_id": 3801,
      "name": "Kakinada Rural",
      "booths": 80,
      "electorate": 86177,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 22812,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3802,
      "name": "Karasapa",
      "booths": 80,
      "electorate": 86177,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 26414,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3803,
      "name": "Indrapalem",
      "booths": 80,
      "electorate": 86177,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 21612,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    }
  ],
  "39": [
    {
      "mandal_id": 3901,
      "name": "Kakinada City",
      "booths": 69,
      "electorate": 73471,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 14832,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3902,
      "name": "Jagannaickpur",
      "booths": 69,
      "electorate": 73471,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 12135,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3903,
      "name": "Suryaraopeta",
      "booths": 69,
      "electorate": 73471,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 14157,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    }
  ],
  "40": [
    {
      "mandal_id": 4001,
      "name": "Anaparthy",
      "booths": 57,
      "electorate": 60048,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 4691,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 4002,
      "name": "Pedapudi",
      "booths": 57,
      "electorate": 60048,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 5473,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 4003,
      "name": "Biccavolu",
      "booths": 57,
      "electorate": 60048,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 4430,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 4004,
      "name": "Rangampeta",
      "booths": 57,
      "electorate": 60048,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 5212,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "LEAN"
    }
  ],
  "41": [
    {
      "mandal_id": 4101,
      "name": "Mummidivaram",
      "booths": 52,
      "electorate": 53847,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 14850,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4102,
      "name": "I.Polavaram",
      "booths": 52,
      "electorate": 53847,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 12021,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4103,
      "name": "Katrenikona",
      "booths": 52,
      "electorate": 53847,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 14143,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4104,
      "name": "Tallarevu",
      "booths": 52,
      "electorate": 53847,
      "turnout_pct": 84.8,
      "lead_party": "TDP",
      "margin": 16264,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    }
  ],
  "42": [
    {
      "mandal_id": 4201,
      "name": "Amalapuram",
      "booths": 68,
      "electorate": 75591,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 7449,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4202,
      "name": "Uppalaguptam",
      "booths": 68,
      "electorate": 75591,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 8763,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4203,
      "name": "Allavaram",
      "booths": 68,
      "electorate": 75591,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 10078,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    }
  ],
  "43": [
    {
      "mandal_id": 4301,
      "name": "Razole",
      "booths": 80,
      "electorate": 87820,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 12912,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4302,
      "name": "Malikipuram",
      "booths": 80,
      "electorate": 87820,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 14848,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4303,
      "name": "Sakhinetipalle",
      "booths": 80,
      "electorate": 87820,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 12266,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    }
  ],
  "44": [
    {
      "mandal_id": 4401,
      "name": "Gannavaram (Konaseema)",
      "booths": 51,
      "electorate": 55839,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 11105,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4402,
      "name": "P.Gannavaram",
      "booths": 51,
      "electorate": 55839,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 9174,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4403,
      "name": "Ambajipeta",
      "booths": 51,
      "electorate": 55839,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 10622,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4404,
      "name": "Ainavilli",
      "booths": 51,
      "electorate": 55839,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 8691,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    }
  ],
  "45": [
    {
      "mandal_id": 4501,
      "name": "Kothapeta",
      "booths": 46,
      "electorate": 49760,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 9265,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4502,
      "name": "Ravulapalem",
      "booths": 46,
      "electorate": 49760,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 10728,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4503,
      "name": "Atreyapuram",
      "booths": 46,
      "electorate": 49760,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 8777,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4504,
      "name": "Alamuru",
      "booths": 46,
      "electorate": 49760,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 10240,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    }
  ],
  "46": [
    {
      "mandal_id": 4601,
      "name": "Mandapeta",
      "booths": 64,
      "electorate": 68245,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 12234,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4602,
      "name": "Rayavaram",
      "booths": 64,
      "electorate": 68245,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 10010,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4603,
      "name": "Kapileswarapuram",
      "booths": 64,
      "electorate": 68245,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 11678,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    }
  ],
  "47": [
    {
      "mandal_id": 4701,
      "name": "Rajanagaram",
      "booths": 86,
      "electorate": 90024,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 16943,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4702,
      "name": "Korukonda",
      "booths": 86,
      "electorate": 90024,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 19767,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4703,
      "name": "Seethanagaram",
      "booths": 86,
      "electorate": 90024,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 16002,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    }
  ],
  "48": [
    {
      "mandal_id": 4801,
      "name": "Rajahmundry City",
      "booths": 76,
      "electorate": 78979,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 15552,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4802,
      "name": "Danavaipeta",
      "booths": 76,
      "electorate": 78979,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 12589,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4803,
      "name": "Innespeta",
      "booths": 76,
      "electorate": 78979,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 14811,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    }
  ],
  "49": [
    {
      "mandal_id": 4901,
      "name": "Rajahmundry Rural",
      "booths": 108,
      "electorate": 119587,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 14470,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4902,
      "name": "Kadiam",
      "booths": 108,
      "electorate": 119587,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 17024,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    }
  ],
  "50": [
    {
      "mandal_id": 5001,
      "name": "Jaggampeta",
      "booths": 54,
      "electorate": 59175,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 17851,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5002,
      "name": "Gandepalle",
      "booths": 54,
      "electorate": 59175,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 20528,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5003,
      "name": "Gokavaram",
      "booths": 54,
      "electorate": 59175,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 16958,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5004,
      "name": "Kirlampudi",
      "booths": 54,
      "electorate": 59175,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 19636,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    }
  ],
  "51": [
    {
      "mandal_id": 5101,
      "name": "Rampachodavaram",
      "booths": 34,
      "electorate": 36739,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 10529,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5102,
      "name": "Devipatnam",
      "booths": 34,
      "electorate": 36739,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 8697,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5103,
      "name": "Maredumilli",
      "booths": 34,
      "electorate": 36739,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 10071,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5104,
      "name": "Rajavommangi",
      "booths": 34,
      "electorate": 36739,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 8240,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5105,
      "name": "Y.Ramavaram",
      "booths": 34,
      "electorate": 36739,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 9613,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5106,
      "name": "Addateegala",
      "booths": 34,
      "electorate": 36739,
      "turnout_pct": 76.4,
      "lead_party": "TDP",
      "margin": 7782,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5107,
      "name": "Gangavaram",
      "booths": 34,
      "electorate": 36739,
      "turnout_pct": 78.8,
      "lead_party": "TDP",
      "margin": 9155,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    }
  ],
  "52": [
    {
      "mandal_id": 5201,
      "name": "Kovvur",
      "booths": 71,
      "electorate": 76212,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 16680,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5202,
      "name": "Chagallu",
      "booths": 71,
      "electorate": 76212,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 19314,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5203,
      "name": "Tallapudi",
      "booths": 71,
      "electorate": 76212,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 15802,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    }
  ],
  "53": [
    {
      "mandal_id": 5301,
      "name": "Nidadavole",
      "booths": 68,
      "electorate": 72483,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 3350,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 5302,
      "name": "Undrajavaram",
      "booths": 68,
      "electorate": 72483,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 2741,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 5303,
      "name": "Peravali",
      "booths": 68,
      "electorate": 72483,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 3198,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "TOSS_UP"
    }
  ],
  "54": [
    {
      "mandal_id": 5401,
      "name": "Achanta",
      "booths": 46,
      "electorate": 48391,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 7637,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5402,
      "name": "Poduru",
      "booths": 46,
      "electorate": 48391,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 8910,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5403,
      "name": "Penugonda",
      "booths": 46,
      "electorate": 48391,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 7213,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5404,
      "name": "Penumantra",
      "booths": 46,
      "electorate": 48391,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 8486,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    }
  ],
  "55": [
    {
      "mandal_id": 5501,
      "name": "Palakollu",
      "booths": 69,
      "electorate": 72110,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 11656,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5502,
      "name": "Yelamanchili",
      "booths": 69,
      "electorate": 72110,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 9436,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5503,
      "name": "Palakollu Rural",
      "booths": 69,
      "electorate": 72110,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 11101,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    }
  ],
  "56": [
    {
      "mandal_id": 5601,
      "name": "Narasapuram",
      "booths": 90,
      "electorate": 97320,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 11285,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5602,
      "name": "Mogalthur",
      "booths": 90,
      "electorate": 97320,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 13277,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    }
  ],
  "57": [
    {
      "mandal_id": 5701,
      "name": "Bhimavaram",
      "booths": 64,
      "electorate": 70565,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 22293,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5702,
      "name": "Veeravasaram",
      "booths": 64,
      "electorate": 70565,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 25637,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5703,
      "name": "Bhimavaram Urban",
      "booths": 64,
      "electorate": 70565,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 21178,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    }
  ],
  "58": [
    {
      "mandal_id": 5801,
      "name": "Undi",
      "booths": 45,
      "electorate": 46311,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 14299,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5802,
      "name": "Kalla",
      "booths": 45,
      "electorate": 46311,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 11812,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5803,
      "name": "Akividu",
      "booths": 45,
      "electorate": 46311,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 13677,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5804,
      "name": "Palakoderu",
      "booths": 45,
      "electorate": 46311,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 11191,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    }
  ],
  "59": [
    {
      "mandal_id": 5901,
      "name": "Tanuku",
      "booths": 79,
      "electorate": 84789,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 21208,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5902,
      "name": "Attili",
      "booths": 79,
      "electorate": 84789,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 24557,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5903,
      "name": "Iragavaram",
      "booths": 79,
      "electorate": 84789,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 20092,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    }
  ],
  "60": [
    {
      "mandal_id": 6001,
      "name": "Tadepalligudem",
      "booths": 108,
      "electorate": 114807,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 31227,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6002,
      "name": "Pentapadu",
      "booths": 108,
      "electorate": 114807,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 25549,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    }
  ],
  "61": [
    {
      "mandal_id": 6101,
      "name": "Unguturu",
      "booths": 76,
      "electorate": 80262,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 21636,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6102,
      "name": "Nidamarru",
      "booths": 76,
      "electorate": 80262,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 25242,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6103,
      "name": "Ganapavaram",
      "booths": 76,
      "electorate": 80262,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 20434,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    }
  ],
  "62": [
    {
      "mandal_id": 6201,
      "name": "Denduluru",
      "booths": 70,
      "electorate": 72367,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 21872,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6202,
      "name": "Pedavegi",
      "booths": 70,
      "electorate": 72367,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 17706,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6203,
      "name": "Pedapadu",
      "booths": 70,
      "electorate": 72367,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 20830,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    }
  ],
  "63": [
    {
      "mandal_id": 6301,
      "name": "Eluru Urban",
      "booths": 105,
      "electorate": 116842,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 19101,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6302,
      "name": "Eluru Rural",
      "booths": 105,
      "electorate": 116842,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 22472,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    }
  ],
  "64": [
    {
      "mandal_id": 6401,
      "name": "Gopalapuram",
      "booths": 57,
      "electorate": 62230,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 6566,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 6402,
      "name": "Nallajerla",
      "booths": 57,
      "electorate": 62230,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 7551,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 6403,
      "name": "Devarapalli",
      "booths": 57,
      "electorate": 62230,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 6238,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 6404,
      "name": "Dwarakatirumala",
      "booths": 57,
      "electorate": 62230,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 7223,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    }
  ],
  "65": [
    {
      "mandal_id": 6501,
      "name": "Polavaram",
      "booths": 39,
      "electorate": 42951,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 14349,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6502,
      "name": "Buttayagudem",
      "booths": 39,
      "electorate": 42951,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 11853,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6503,
      "name": "Jeelugumilli",
      "booths": 39,
      "electorate": 42951,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 13725,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6504,
      "name": "Kukunoor",
      "booths": 39,
      "electorate": 42951,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 11229,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6505,
      "name": "Velairpadu",
      "booths": 39,
      "electorate": 42951,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 13101,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    }
  ],
  "66": [
    {
      "mandal_id": 6601,
      "name": "Chintalapudi",
      "booths": 61,
      "electorate": 65149,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 6361,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 6602,
      "name": "Lingapalem",
      "booths": 61,
      "electorate": 65149,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 7365,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 6603,
      "name": "Kamavarapukota",
      "booths": 61,
      "electorate": 65149,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 6026,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 6604,
      "name": "Jangareddigudem",
      "booths": 61,
      "electorate": 65149,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 7030,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "LEAN"
    }
  ],
  "67": [
    {
      "mandal_id": 6701,
      "name": "Tiruvuru",
      "booths": 58,
      "electorate": 61757,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 2182,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 6702,
      "name": "A.Konduru",
      "booths": 58,
      "electorate": 61757,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 1785,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 6703,
      "name": "Gampalagudem",
      "booths": 58,
      "electorate": 61757,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 2082,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 6704,
      "name": "Vissannapeta",
      "booths": 58,
      "electorate": 61757,
      "turnout_pct": 78.2,
      "lead_party": "TDP",
      "margin": 1686,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "TOSS_UP"
    }
  ],
  "68": [
    {
      "mandal_id": 6801,
      "name": "Nuzvid",
      "booths": 64,
      "electorate": 66934,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 6247,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 6802,
      "name": "Agiripalli",
      "booths": 64,
      "electorate": 66934,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 7288,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 6803,
      "name": "Chatrai",
      "booths": 64,
      "electorate": 66934,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 5900,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 6804,
      "name": "Musunuru",
      "booths": 64,
      "electorate": 66934,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 6941,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    }
  ],
  "69": [
    {
      "mandal_id": 6901,
      "name": "Gannavaram",
      "booths": 54,
      "electorate": 56071,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 5741,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 6902,
      "name": "Bapulapadu",
      "booths": 54,
      "electorate": 56071,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 4648,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 6903,
      "name": "Unguturu",
      "booths": 54,
      "electorate": 56071,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 5468,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 6904,
      "name": "Vijayawada Rural",
      "booths": 54,
      "electorate": 56071,
      "turnout_pct": 84.8,
      "lead_party": "TDP",
      "margin": 6288,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    }
  ],
  "70": [
    {
      "mandal_id": 7001,
      "name": "Gudivada",
      "booths": 81,
      "electorate": 90290,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 3507,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 7002,
      "name": "Gudlavalleru",
      "booths": 81,
      "electorate": 90290,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 4126,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 7003,
      "name": "Nandivada",
      "booths": 81,
      "electorate": 90290,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 4744,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "TOSS_UP"
    }
  ],
  "71": [
    {
      "mandal_id": 7101,
      "name": "Kaikalur",
      "booths": 70,
      "electorate": 77017,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 9407,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7102,
      "name": "Mandavalli",
      "booths": 70,
      "electorate": 77017,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 10818,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7103,
      "name": "Kalidindi",
      "booths": 70,
      "electorate": 77017,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 8936,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7104,
      "name": "Mudinepalle",
      "booths": 70,
      "electorate": 77017,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 10347,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    }
  ],
  "72": [
    {
      "mandal_id": 7201,
      "name": "Pedana",
      "booths": 51,
      "electorate": 55413,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 15248,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7202,
      "name": "Gudur",
      "booths": 51,
      "electorate": 55413,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 12597,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7203,
      "name": "Bantumilli",
      "booths": 51,
      "electorate": 55413,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 14586,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7204,
      "name": "Kruthivennu",
      "booths": 51,
      "electorate": 55413,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 11934,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    }
  ],
  "73": [
    {
      "mandal_id": 7301,
      "name": "Machilipatnam Urban",
      "booths": 106,
      "electorate": 113179,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 21504,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7302,
      "name": "Machilipatnam Rural",
      "booths": 106,
      "electorate": 113179,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 24900,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    }
  ],
  "74": [
    {
      "mandal_id": 7401,
      "name": "Avanigadda",
      "booths": 30,
      "electorate": 31268,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 6989,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7402,
      "name": "Nagayalanka",
      "booths": 30,
      "electorate": 31268,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 5718,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7403,
      "name": "Koduru",
      "booths": 30,
      "electorate": 31268,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 6671,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7404,
      "name": "Challapalli",
      "booths": 30,
      "electorate": 31268,
      "turnout_pct": 78.2,
      "lead_party": "TDP",
      "margin": 5400,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7405,
      "name": "Mopidevi",
      "booths": 30,
      "electorate": 31268,
      "turnout_pct": 80.6,
      "lead_party": "TDP",
      "margin": 6353,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7406,
      "name": "Ghantasala",
      "booths": 30,
      "electorate": 31268,
      "turnout_pct": 83.0,
      "lead_party": "TDP",
      "margin": 7306,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    }
  ],
  "75": [
    {
      "mandal_id": 7501,
      "name": "Pamarru",
      "booths": 39,
      "electorate": 41071,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 9043,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7502,
      "name": "Thotlavalluru",
      "booths": 39,
      "electorate": 41071,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 10550,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7503,
      "name": "Pamidimukkala",
      "booths": 39,
      "electorate": 41071,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 8541,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7504,
      "name": "Movva",
      "booths": 39,
      "electorate": 41071,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 10048,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7505,
      "name": "Pedaparupudi",
      "booths": 39,
      "electorate": 41071,
      "turnout_pct": 83.9,
      "lead_party": "TDP",
      "margin": 11555,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    }
  ],
  "76": [
    {
      "mandal_id": 7601,
      "name": "Penamaluru",
      "booths": 73,
      "electorate": 75930,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 16251,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7602,
      "name": "Kankipadu",
      "booths": 73,
      "electorate": 75930,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 13156,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7603,
      "name": "Poranki",
      "booths": 73,
      "electorate": 75930,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 15478,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    }
  ],
  "77": [
    {
      "mandal_id": 7701,
      "name": "Vijayawada West",
      "booths": 64,
      "electorate": 71239,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 8412,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7702,
      "name": "Bhavanipuram",
      "booths": 64,
      "electorate": 71239,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 9896,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7703,
      "name": "One Town",
      "booths": 64,
      "electorate": 71239,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 11381,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    }
  ],
  "78": [
    {
      "mandal_id": 7801,
      "name": "Vijayawada Central",
      "booths": 70,
      "electorate": 76444,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 14978,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7802,
      "name": "Gandhinagar",
      "booths": 70,
      "electorate": 76444,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 17225,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7803,
      "name": "Satyanarayanapuram",
      "booths": 70,
      "electorate": 76444,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 14229,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7804,
      "name": "Gunadala",
      "booths": 70,
      "electorate": 76444,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 16476,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    }
  ],
  "79": [
    {
      "mandal_id": 7901,
      "name": "Vijayawada East",
      "booths": 50,
      "electorate": 54431,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 13521,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7902,
      "name": "Patamata",
      "booths": 50,
      "electorate": 54431,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 11170,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7903,
      "name": "Benz Circle",
      "booths": 50,
      "electorate": 54431,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 12933,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7904,
      "name": "Autonagar",
      "booths": 50,
      "electorate": 54431,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 10582,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    }
  ],
  "80": [
    {
      "mandal_id": 8001,
      "name": "Mylavaram",
      "booths": 78,
      "electorate": 83727,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 21813,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8002,
      "name": "Ibrahimpatnam",
      "booths": 78,
      "electorate": 83727,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 25258,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8003,
      "name": "G.Konduru",
      "booths": 78,
      "electorate": 83727,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 20665,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    }
  ],
  "81": [
    {
      "mandal_id": 8101,
      "name": "Nandigama",
      "booths": 57,
      "electorate": 60642,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 13651,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8102,
      "name": "Kanchikacherla",
      "booths": 57,
      "electorate": 60642,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 11169,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8103,
      "name": "Chandarlapadu",
      "booths": 57,
      "electorate": 60642,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 13030,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8104,
      "name": "Veerullapadu",
      "booths": 57,
      "electorate": 60642,
      "turnout_pct": 78.2,
      "lead_party": "TDP",
      "margin": 10548,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    }
  ],
  "82": [
    {
      "mandal_id": 8201,
      "name": "Jaggayyapeta",
      "booths": 93,
      "electorate": 97657,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 12848,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8202,
      "name": "Vatsavai",
      "booths": 93,
      "electorate": 97657,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 14990,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8203,
      "name": "Penuganchiprolu",
      "booths": 93,
      "electorate": 97657,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 12134,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    }
  ],
  "83": [
    {
      "mandal_id": 8301,
      "name": "Pedakurapadu",
      "booths": 42,
      "electorate": 44344,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 5752,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 8302,
      "name": "Bellamkonda",
      "booths": 42,
      "electorate": 44344,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 4657,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 8303,
      "name": "Atchampet",
      "booths": 42,
      "electorate": 44344,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 5479,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 8304,
      "name": "Krosuru",
      "booths": 42,
      "electorate": 44344,
      "turnout_pct": 84.8,
      "lead_party": "TDP",
      "margin": 6300,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 8305,
      "name": "Amaravathi",
      "booths": 42,
      "electorate": 44344,
      "turnout_pct": 81.6,
      "lead_party": "TDP",
      "margin": 5205,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    }
  ],
  "84": [
    {
      "mandal_id": 8401,
      "name": "Tadikonda",
      "booths": 54,
      "electorate": 60311,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 3395,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 8402,
      "name": "Thullur",
      "booths": 54,
      "electorate": 60311,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 3994,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 8403,
      "name": "Firangipuram",
      "booths": 54,
      "electorate": 60311,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 4593,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 8404,
      "name": "Medikonduru",
      "booths": 54,
      "electorate": 60311,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 3794,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    }
  ],
  "85": [
    {
      "mandal_id": 8501,
      "name": "Mangalagiri",
      "booths": 82,
      "electorate": 89863,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 7029,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 8502,
      "name": "Tadepalli",
      "booths": 82,
      "electorate": 89863,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 8084,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 8503,
      "name": "Duggirala",
      "booths": 82,
      "electorate": 89863,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 6678,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    }
  ],
  "86": [
    {
      "mandal_id": 8601,
      "name": "Ponnur",
      "booths": 73,
      "electorate": 78778,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 15182,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8602,
      "name": "Chebrolu",
      "booths": 73,
      "electorate": 78778,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 12541,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8603,
      "name": "Kakumanu",
      "booths": 73,
      "electorate": 78778,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 14522,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    }
  ],
  "87": [
    {
      "mandal_id": 8701,
      "name": "Vemuru",
      "booths": 58,
      "electorate": 63944,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 17368,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8702,
      "name": "Kolluru",
      "booths": 58,
      "electorate": 63944,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 20110,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8703,
      "name": "Amruthaluru",
      "booths": 58,
      "electorate": 63944,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 16454,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8704,
      "name": "Bhattiprolu",
      "booths": 58,
      "electorate": 63944,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 19196,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8705,
      "name": "Tsunduru",
      "booths": 58,
      "electorate": 63944,
      "turnout_pct": 77.3,
      "lead_party": "TDP",
      "margin": 15540,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    }
  ],
  "88": [
    {
      "mandal_id": 8801,
      "name": "Repalle",
      "booths": 57,
      "electorate": 60185,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 9051,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8802,
      "name": "Nizampatnam",
      "booths": 57,
      "electorate": 60185,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 7405,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8803,
      "name": "Nagaram",
      "booths": 57,
      "electorate": 60185,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 8640,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8804,
      "name": "Cherukupalle",
      "booths": 57,
      "electorate": 60185,
      "turnout_pct": 78.2,
      "lead_party": "TDP",
      "margin": 6994,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    }
  ],
  "89": [
    {
      "mandal_id": 8901,
      "name": "Tenali",
      "booths": 101,
      "electorate": 106186,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 9909,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 8902,
      "name": "Kollipara",
      "booths": 101,
      "electorate": 106186,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 11561,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "LEAN"
    }
  ],
  "90": [
    {
      "mandal_id": 9001,
      "name": "Bapatla",
      "booths": 74,
      "electorate": 76458,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 13981,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9002,
      "name": "Pittalavanipalem",
      "booths": 74,
      "electorate": 76458,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 11318,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9003,
      "name": "Karlapalem",
      "booths": 74,
      "electorate": 76458,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 13315,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    }
  ],
  "91": [
    {
      "mandal_id": 9101,
      "name": "Prathipadu (Guntur)",
      "booths": 60,
      "electorate": 67259,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 10223,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9102,
      "name": "Vatticherukuru",
      "booths": 60,
      "electorate": 67259,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 12028,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9103,
      "name": "Pedanandipadu",
      "booths": 60,
      "electorate": 67259,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 13832,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9104,
      "name": "Guntur Rural",
      "booths": 60,
      "electorate": 67259,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 11426,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    }
  ],
  "92": [
    {
      "mandal_id": 9201,
      "name": "Guntur West",
      "booths": 46,
      "electorate": 51092,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 6942,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9202,
      "name": "Brodipet",
      "booths": 46,
      "electorate": 51092,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 7983,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9203,
      "name": "Arundalpet",
      "booths": 46,
      "electorate": 51092,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 6594,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9204,
      "name": "Pattabhipuram",
      "booths": 46,
      "electorate": 51092,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 7636,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    }
  ],
  "93": [
    {
      "mandal_id": 9301,
      "name": "Guntur East",
      "booths": 87,
      "electorate": 93983,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 16105,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9302,
      "name": "Old Guntur",
      "booths": 87,
      "electorate": 93983,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 13304,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9303,
      "name": "Autonagar Guntur",
      "booths": 87,
      "electorate": 93983,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 15405,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    }
  ],
  "94": [
    {
      "mandal_id": 9401,
      "name": "Chilakaluripet",
      "booths": 73,
      "electorate": 78869,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 16197,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9402,
      "name": "Nadendla",
      "booths": 73,
      "electorate": 78869,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 18755,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9403,
      "name": "Edlapadu",
      "booths": 73,
      "electorate": 78869,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 15345,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    }
  ],
  "95": [
    {
      "mandal_id": 9501,
      "name": "Narasaraopet",
      "booths": 103,
      "electorate": 109009,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 17579,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9502,
      "name": "Rompicherla",
      "booths": 103,
      "electorate": 109009,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 14382,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    }
  ],
  "96": [
    {
      "mandal_id": 9601,
      "name": "Sattenapalle",
      "booths": 57,
      "electorate": 59822,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 7483,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9602,
      "name": "Rajupalem",
      "booths": 57,
      "electorate": 59822,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 8731,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9603,
      "name": "Nekarikallu",
      "booths": 57,
      "electorate": 59822,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 7068,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9604,
      "name": "Muppalla",
      "booths": 57,
      "electorate": 59822,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 8315,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    }
  ],
  "97": [
    {
      "mandal_id": 9701,
      "name": "Vinukonda",
      "booths": 45,
      "electorate": 46530,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 4138,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9702,
      "name": "Nuzendla",
      "booths": 45,
      "electorate": 46530,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 3349,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9703,
      "name": "Savalyapuram",
      "booths": 45,
      "electorate": 46530,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 3941,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9704,
      "name": "Bollapalle",
      "booths": 45,
      "electorate": 46530,
      "turnout_pct": 84.8,
      "lead_party": "TDP",
      "margin": 4532,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9705,
      "name": "Ipuru",
      "booths": 45,
      "electorate": 46530,
      "turnout_pct": 81.6,
      "lead_party": "TDP",
      "margin": 3743,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    }
  ],
  "98": [
    {
      "mandal_id": 9801,
      "name": "Gurazala",
      "booths": 62,
      "electorate": 69422,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 5915,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9802,
      "name": "Dachepalli",
      "booths": 62,
      "electorate": 69422,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 6959,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9803,
      "name": "Piduguralla",
      "booths": 62,
      "electorate": 69422,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 8002,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9804,
      "name": "Machavaram",
      "booths": 62,
      "electorate": 69422,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 6611,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    }
  ],
  "99": [
    {
      "mandal_id": 9901,
      "name": "Macherla",
      "booths": 56,
      "electorate": 61240,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 6053,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9902,
      "name": "Veldurthi",
      "booths": 56,
      "electorate": 61240,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 6961,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9903,
      "name": "Rentachintala",
      "booths": 56,
      "electorate": 61240,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 5750,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9904,
      "name": "Karempudi",
      "booths": 56,
      "electorate": 61240,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 6658,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9905,
      "name": "Durgi",
      "booths": 56,
      "electorate": 61240,
      "turnout_pct": 76.3,
      "lead_party": "TDP",
      "margin": 5448,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    }
  ],
  "100": [
    {
      "mandal_id": 10001,
      "name": "Yerragondapalem",
      "booths": 54,
      "electorate": 59079,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 6781,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 10002,
      "name": "Pullalacheruvu",
      "booths": 54,
      "electorate": 59079,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 5602,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 10003,
      "name": "Tripuranthakam",
      "booths": 54,
      "electorate": 59079,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 6486,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 10004,
      "name": "Dornala",
      "booths": 54,
      "electorate": 59079,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 5307,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 10005,
      "name": "Peddaraveedu",
      "booths": 54,
      "electorate": 59079,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 6192,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    }
  ],
  "101": [
    {
      "mandal_id": 10101,
      "name": "Darsi",
      "booths": 51,
      "electorate": 54623,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 6330,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10102,
      "name": "Donakonda",
      "booths": 51,
      "electorate": 54623,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 7329,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10103,
      "name": "Kurichedu",
      "booths": 51,
      "electorate": 54623,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 5997,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10104,
      "name": "Mundlamuru",
      "booths": 51,
      "electorate": 54623,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 6996,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10105,
      "name": "Thallur",
      "booths": 51,
      "electorate": 54623,
      "turnout_pct": 77.3,
      "lead_party": "TDP",
      "margin": 5664,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    }
  ],
  "102": [
    {
      "mandal_id": 10201,
      "name": "Parchur",
      "booths": 35,
      "electorate": 37675,
      "turnout_pct": 82.2,
      "lead_party": "YSRCP",
      "margin": 953,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 10202,
      "name": "Yeddanapudi",
      "booths": 35,
      "electorate": 37675,
      "turnout_pct": 79.0,
      "lead_party": "YSRCP",
      "margin": 780,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 10203,
      "name": "Karamchedu",
      "booths": 35,
      "electorate": 37675,
      "turnout_pct": 81.4,
      "lead_party": "YSRCP",
      "margin": 910,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 10204,
      "name": "Inkollu",
      "booths": 35,
      "electorate": 37675,
      "turnout_pct": 78.2,
      "lead_party": "YSRCP",
      "margin": 736,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 10205,
      "name": "Chinaganjam",
      "booths": 35,
      "electorate": 37675,
      "turnout_pct": 80.6,
      "lead_party": "YSRCP",
      "margin": 866,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 10206,
      "name": "Martur",
      "booths": 35,
      "electorate": 37675,
      "turnout_pct": 83.0,
      "lead_party": "YSRCP",
      "margin": 996,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "TOSS_UP"
    }
  ],
  "103": [
    {
      "mandal_id": 10301,
      "name": "Addanki",
      "booths": 48,
      "electorate": 50311,
      "turnout_pct": 79.9,
      "lead_party": "YSRCP",
      "margin": 442,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 10302,
      "name": "J.Panguluru",
      "booths": 48,
      "electorate": 50311,
      "turnout_pct": 82.3,
      "lead_party": "YSRCP",
      "margin": 515,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 10303,
      "name": "Santhamaguluru",
      "booths": 48,
      "electorate": 50311,
      "turnout_pct": 79.1,
      "lead_party": "YSRCP",
      "margin": 417,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 10304,
      "name": "Ballikurava",
      "booths": 48,
      "electorate": 50311,
      "turnout_pct": 81.5,
      "lead_party": "YSRCP",
      "margin": 491,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 10305,
      "name": "Korisapadu",
      "booths": 48,
      "electorate": 50311,
      "turnout_pct": 83.9,
      "lead_party": "YSRCP",
      "margin": 564,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "TOSS_UP"
    }
  ],
  "104": [
    {
      "mandal_id": 10401,
      "name": "Chirala",
      "booths": 119,
      "electorate": 122911,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 12606,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 10402,
      "name": "Vetapalem",
      "booths": 119,
      "electorate": 122911,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 10205,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "LEAN"
    }
  ],
  "105": [
    {
      "mandal_id": 10501,
      "name": "Santhanuthalapadu",
      "booths": 62,
      "electorate": 69297,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 5289,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 10502,
      "name": "Maddipadu",
      "booths": 62,
      "electorate": 69297,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 6222,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 10503,
      "name": "Chimakurthi",
      "booths": 62,
      "electorate": 69297,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 7155,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 10504,
      "name": "Naguluppalapadu",
      "booths": 62,
      "electorate": 69297,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 5911,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "LEAN"
    }
  ],
  "106": [
    {
      "mandal_id": 10601,
      "name": "Ongole Urban",
      "booths": 60,
      "electorate": 55453,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 6994,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10602,
      "name": "Ongole Rural",
      "booths": 60,
      "electorate": 55453,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 8043,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10603,
      "name": "Kothapatnam",
      "booths": 60,
      "electorate": 55453,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 6644,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    }
  ],
  "107": [
    {
      "mandal_id": 10701,
      "name": "Kandukur",
      "booths": 44,
      "electorate": 47476,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 6988,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10702,
      "name": "Voletivaripalem",
      "booths": 44,
      "electorate": 47476,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 5773,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10703,
      "name": "Ulavapadu",
      "booths": 44,
      "electorate": 47476,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 6684,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10704,
      "name": "Gudluru",
      "booths": 44,
      "electorate": 47476,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 5469,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10705,
      "name": "Lingasamudram",
      "booths": 44,
      "electorate": 47476,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 6380,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    }
  ],
  "108": [
    {
      "mandal_id": 10801,
      "name": "Kondapi",
      "booths": 49,
      "electorate": 52646,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 6464,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10802,
      "name": "Zarugumalli",
      "booths": 49,
      "electorate": 52646,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 7485,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10803,
      "name": "Singarayakonda",
      "booths": 49,
      "electorate": 52646,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 6124,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10804,
      "name": "Tangutur",
      "booths": 49,
      "electorate": 52646,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 7145,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10805,
      "name": "Ponnaluru",
      "booths": 49,
      "electorate": 52646,
      "turnout_pct": 77.3,
      "lead_party": "TDP",
      "margin": 5784,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    }
  ],
  "109": [
    {
      "mandal_id": 10901,
      "name": "Markapuram",
      "booths": 60,
      "electorate": 63514,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 5103,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "LEAN"
    },
    {
      "mandal_id": 10902,
      "name": "Tarlupadu",
      "booths": 60,
      "electorate": 63514,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 4175,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "LEAN"
    },
    {
      "mandal_id": 10903,
      "name": "Konakanamitla",
      "booths": 60,
      "electorate": 63514,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 4871,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "LEAN"
    },
    {
      "mandal_id": 10904,
      "name": "Podili",
      "booths": 60,
      "electorate": 63514,
      "turnout_pct": 78.2,
      "lead_party": "TDP",
      "margin": 3943,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "LEAN"
    }
  ],
  "110": [
    {
      "mandal_id": 11001,
      "name": "Giddalur",
      "booths": 41,
      "electorate": 43777,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 3713,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11002,
      "name": "Besthavaripeta",
      "booths": 41,
      "electorate": 43777,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 4332,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11003,
      "name": "Racherla",
      "booths": 41,
      "electorate": 43777,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 3507,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11004,
      "name": "Komarolu",
      "booths": 41,
      "electorate": 43777,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 4126,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11005,
      "name": "Cumbum",
      "booths": 41,
      "electorate": 43777,
      "turnout_pct": 83.9,
      "lead_party": "TDP",
      "margin": 4744,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11006,
      "name": "Ardhaveedu",
      "booths": 41,
      "electorate": 43777,
      "turnout_pct": 80.7,
      "lead_party": "TDP",
      "margin": 3919,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    }
  ],
  "111": [
    {
      "mandal_id": 11101,
      "name": "Kanigiri",
      "booths": 36,
      "electorate": 38157,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 2446,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11102,
      "name": "Hanumanthunipadu",
      "booths": 36,
      "electorate": 38157,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 1980,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11103,
      "name": "CS Puram",
      "booths": 36,
      "electorate": 38157,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 2329,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11104,
      "name": "Pamuru",
      "booths": 36,
      "electorate": 38157,
      "turnout_pct": 84.8,
      "lead_party": "TDP",
      "margin": 2679,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11105,
      "name": "Veligandla",
      "booths": 36,
      "electorate": 38157,
      "turnout_pct": 81.6,
      "lead_party": "TDP",
      "margin": 2213,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11106,
      "name": "Pedacherlopalle",
      "booths": 36,
      "electorate": 38157,
      "turnout_pct": 84.0,
      "lead_party": "TDP",
      "margin": 2562,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    }
  ],
  "112": [
    {
      "mandal_id": 11201,
      "name": "Kavali",
      "booths": 58,
      "electorate": 64782,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 206,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 11202,
      "name": "Bogole",
      "booths": 58,
      "electorate": 64782,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 243,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 11203,
      "name": "Allur",
      "booths": 58,
      "electorate": 64782,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 279,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 11204,
      "name": "Dagadarthi",
      "booths": 58,
      "electorate": 64782,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 231,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "TOSS_UP"
    }
  ],
  "113": [
    {
      "mandal_id": 11301,
      "name": "Atmakur",
      "booths": 40,
      "electorate": 43678,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 2434,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11302,
      "name": "Chejerla",
      "booths": 40,
      "electorate": 43678,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 2799,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11303,
      "name": "Ananthasagaram",
      "booths": 40,
      "electorate": 43678,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 2312,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11304,
      "name": "Marripadu",
      "booths": 40,
      "electorate": 43678,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 2677,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11305,
      "name": "AS Peta",
      "booths": 40,
      "electorate": 43678,
      "turnout_pct": 76.3,
      "lead_party": "TDP",
      "margin": 2190,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11306,
      "name": "Sangam",
      "booths": 40,
      "electorate": 43678,
      "turnout_pct": 78.7,
      "lead_party": "TDP",
      "margin": 2555,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    }
  ],
  "114": [
    {
      "mandal_id": 11401,
      "name": "Kovur",
      "booths": 44,
      "electorate": 47740,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 7118,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11402,
      "name": "Kodavalur",
      "booths": 44,
      "electorate": 47740,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 5880,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11403,
      "name": "Vidavalur",
      "booths": 44,
      "electorate": 47740,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 6808,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11404,
      "name": "Buchireddypalem",
      "booths": 44,
      "electorate": 47740,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 5570,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11405,
      "name": "Indukurpet",
      "booths": 44,
      "electorate": 47740,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 6499,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    }
  ],
  "115": [
    {
      "mandal_id": 11501,
      "name": "Nellore City",
      "booths": 70,
      "electorate": 74805,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 2399,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 11502,
      "name": "Stonehousepet",
      "booths": 70,
      "electorate": 74805,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 2777,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 11503,
      "name": "Dargamitta",
      "booths": 70,
      "electorate": 74805,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 2272,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "TOSS_UP"
    }
  ],
  "116": [
    {
      "mandal_id": 11601,
      "name": "Nellore Rural",
      "booths": 126,
      "electorate": 133082,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 30020,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11602,
      "name": "Podalakur",
      "booths": 126,
      "electorate": 133082,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 24562,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    }
  ],
  "117": [
    {
      "mandal_id": 11701,
      "name": "Sarvepalli",
      "booths": 41,
      "electorate": 43659,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 13048,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11702,
      "name": "Venkatachalam",
      "booths": 41,
      "electorate": 43659,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 15222,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11703,
      "name": "Thotapalligudur",
      "booths": 41,
      "electorate": 43659,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 12323,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11704,
      "name": "Muthukur",
      "booths": 41,
      "electorate": 43659,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 14497,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11705,
      "name": "Manubolu",
      "booths": 41,
      "electorate": 43659,
      "turnout_pct": 83.9,
      "lead_party": "TDP",
      "margin": 16672,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    }
  ],
  "118": [
    {
      "mandal_id": 11801,
      "name": "Gudur",
      "booths": 45,
      "electorate": 46535,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 7240,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11802,
      "name": "Chillakur",
      "booths": 45,
      "electorate": 46535,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 5861,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11803,
      "name": "Kota",
      "booths": 45,
      "electorate": 46535,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 6896,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11804,
      "name": "Vakadu",
      "booths": 45,
      "electorate": 46535,
      "turnout_pct": 84.8,
      "lead_party": "TDP",
      "margin": 7930,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11805,
      "name": "Chittamur",
      "booths": 45,
      "electorate": 46535,
      "turnout_pct": 81.6,
      "lead_party": "TDP",
      "margin": 6551,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    }
  ],
  "119": [
    {
      "mandal_id": 11901,
      "name": "Sullurpeta",
      "booths": 38,
      "electorate": 42223,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 2307,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "LEAN"
    },
    {
      "mandal_id": 11902,
      "name": "Tada",
      "booths": 38,
      "electorate": 42223,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 2714,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "LEAN"
    },
    {
      "mandal_id": 11903,
      "name": "Doravarisatram",
      "booths": 38,
      "electorate": 42223,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 3121,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "LEAN"
    },
    {
      "mandal_id": 11904,
      "name": "Naidupeta",
      "booths": 38,
      "electorate": 42223,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 2578,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "LEAN"
    },
    {
      "mandal_id": 11905,
      "name": "Pellakur",
      "booths": 38,
      "electorate": 42223,
      "turnout_pct": 78.6,
      "lead_party": "TDP",
      "margin": 2986,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "LEAN"
    },
    {
      "mandal_id": 11906,
      "name": "Ozili",
      "booths": 38,
      "electorate": 42223,
      "turnout_pct": 75.4,
      "lead_party": "TDP",
      "margin": 2443,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "LEAN"
    }
  ],
  "120": [
    {
      "mandal_id": 12001,
      "name": "Venkatagiri",
      "booths": 37,
      "electorate": 40511,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 3532,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12002,
      "name": "Dakkili",
      "booths": 37,
      "electorate": 40511,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 4061,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12003,
      "name": "Balayapalle",
      "booths": 37,
      "electorate": 40511,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 3355,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12004,
      "name": "Rapur",
      "booths": 37,
      "electorate": 40511,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 3885,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12005,
      "name": "Sydapuram",
      "booths": 37,
      "electorate": 40511,
      "turnout_pct": 76.3,
      "lead_party": "TDP",
      "margin": 3178,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12006,
      "name": "Kaluvoya",
      "booths": 37,
      "electorate": 40511,
      "turnout_pct": 78.7,
      "lead_party": "TDP",
      "margin": 3708,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    }
  ],
  "121": [
    {
      "mandal_id": 12101,
      "name": "Udayagiri",
      "booths": 33,
      "electorate": 36042,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 4783,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12102,
      "name": "Varikuntapadu",
      "booths": 33,
      "electorate": 36042,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 3951,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12103,
      "name": "Vinjamur",
      "booths": 33,
      "electorate": 36042,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 4575,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12104,
      "name": "Duttalur",
      "booths": 33,
      "electorate": 36042,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 3743,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12105,
      "name": "Kaligiri",
      "booths": 33,
      "electorate": 36042,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 4367,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12106,
      "name": "Jaladanki",
      "booths": 33,
      "electorate": 36042,
      "turnout_pct": 76.4,
      "lead_party": "TDP",
      "margin": 3535,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12107,
      "name": "Seetharamapuram",
      "booths": 33,
      "electorate": 36042,
      "turnout_pct": 78.8,
      "lead_party": "TDP",
      "margin": 4159,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    }
  ],
  "122": [
    {
      "mandal_id": 12201,
      "name": "Badvel",
      "booths": 33,
      "electorate": 35365,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 2211,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12202,
      "name": "Gopavaram",
      "booths": 33,
      "electorate": 35365,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 2560,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12203,
      "name": "Sankhavaram",
      "booths": 33,
      "electorate": 35365,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 2094,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12204,
      "name": "Kalasapadu",
      "booths": 33,
      "electorate": 35365,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 2444,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12205,
      "name": "Porumamilla",
      "booths": 33,
      "electorate": 35365,
      "turnout_pct": 77.3,
      "lead_party": "TDP",
      "margin": 1978,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12206,
      "name": "B.Kodur",
      "booths": 33,
      "electorate": 35365,
      "turnout_pct": 79.7,
      "lead_party": "TDP",
      "margin": 2327,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12207,
      "name": "Atlur",
      "booths": 33,
      "electorate": 35365,
      "turnout_pct": 82.1,
      "lead_party": "TDP",
      "margin": 2676,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    }
  ],
  "123": [
    {
      "mandal_id": 12301,
      "name": "Rajampet",
      "booths": 46,
      "electorate": 49062,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 2116,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 12302,
      "name": "Nandalur",
      "booths": 46,
      "electorate": 49062,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 1731,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 12303,
      "name": "Vontimitta",
      "booths": 46,
      "electorate": 49062,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 2020,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 12304,
      "name": "Sidhout",
      "booths": 46,
      "electorate": 49062,
      "turnout_pct": 78.2,
      "lead_party": "TDP",
      "margin": 1635,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 12305,
      "name": "Pullampeta",
      "booths": 46,
      "electorate": 49062,
      "turnout_pct": 80.6,
      "lead_party": "TDP",
      "margin": 1924,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "TOSS_UP"
    }
  ],
  "124": [
    {
      "mandal_id": 12401,
      "name": "Kadapa Urban",
      "booths": 98,
      "electorate": 102600,
      "turnout_pct": 79.9,
      "lead_party": "YSRCP",
      "margin": 8355,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 12402,
      "name": "Kadapa Rural",
      "booths": 98,
      "electorate": 102600,
      "turnout_pct": 82.3,
      "lead_party": "YSRCP",
      "margin": 9747,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    }
  ],
  "125": [
    {
      "mandal_id": 12501,
      "name": "Kodur",
      "booths": 42,
      "electorate": 44238,
      "turnout_pct": 83.2,
      "lead_party": "YSRCP",
      "margin": 1473,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 12502,
      "name": "Penagalur",
      "booths": 42,
      "electorate": 44238,
      "turnout_pct": 80.0,
      "lead_party": "YSRCP",
      "margin": 1192,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 12503,
      "name": "Chitvel",
      "booths": 42,
      "electorate": 44238,
      "turnout_pct": 82.4,
      "lead_party": "YSRCP",
      "margin": 1403,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 12504,
      "name": "Pullampeta",
      "booths": 42,
      "electorate": 44238,
      "turnout_pct": 84.8,
      "lead_party": "YSRCP",
      "margin": 1613,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 12505,
      "name": "Obulavaripalle",
      "booths": 42,
      "electorate": 44238,
      "turnout_pct": 81.6,
      "lead_party": "YSRCP",
      "margin": 1333,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    }
  ],
  "126": [
    {
      "mandal_id": 12601,
      "name": "Rayachoti",
      "booths": 32,
      "electorate": 36390,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 2671,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 12602,
      "name": "Sambepalli",
      "booths": 32,
      "electorate": 36390,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 3143,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 12603,
      "name": "Chinnamandem",
      "booths": 32,
      "electorate": 36390,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 3614,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 12604,
      "name": "Galiveedu",
      "booths": 32,
      "electorate": 36390,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 2986,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 12605,
      "name": "Lakkireddipalli",
      "booths": 32,
      "electorate": 36390,
      "turnout_pct": 78.6,
      "lead_party": "TDP",
      "margin": 3457,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 12606,
      "name": "Ramapuram",
      "booths": 32,
      "electorate": 36390,
      "turnout_pct": 75.4,
      "lead_party": "TDP",
      "margin": 2829,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    }
  ],
  "127": [
    {
      "mandal_id": 12701,
      "name": "Pulivendla",
      "booths": 25,
      "electorate": 27594,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 1585,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 12702,
      "name": "Vempalli",
      "booths": 25,
      "electorate": 27594,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 1823,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 12703,
      "name": "Simhadripuram",
      "booths": 25,
      "electorate": 27594,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 1506,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 12704,
      "name": "Lingala",
      "booths": 25,
      "electorate": 27594,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 1744,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 12705,
      "name": "Thondur",
      "booths": 25,
      "electorate": 27594,
      "turnout_pct": 76.3,
      "lead_party": "TDP",
      "margin": 1427,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 12706,
      "name": "Vemula",
      "booths": 25,
      "electorate": 27594,
      "turnout_pct": 78.7,
      "lead_party": "TDP",
      "margin": 1665,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 12707,
      "name": "Chakrayapet",
      "booths": 25,
      "electorate": 27594,
      "turnout_pct": 75.5,
      "lead_party": "TDP",
      "margin": 1347,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    }
  ],
  "128": [
    {
      "mandal_id": 12801,
      "name": "Kamalapuram",
      "booths": 37,
      "electorate": 40832,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 478,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 12802,
      "name": "Veerapunayunipalle",
      "booths": 37,
      "electorate": 40832,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 395,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 12803,
      "name": "Yerraguntla",
      "booths": 37,
      "electorate": 40832,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 457,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 12804,
      "name": "Pendlimarri",
      "booths": 37,
      "electorate": 40832,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 374,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 12805,
      "name": "Vallur",
      "booths": 37,
      "electorate": 40832,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 436,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 12806,
      "name": "Chinthakommadinne",
      "booths": 37,
      "electorate": 40832,
      "turnout_pct": 76.4,
      "lead_party": "TDP",
      "margin": 353,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    }
  ],
  "129": [
    {
      "mandal_id": 12901,
      "name": "Jammalamadugu",
      "booths": 42,
      "electorate": 45013,
      "turnout_pct": 78.9,
      "lead_party": "YSRCP",
      "margin": 11720,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12902,
      "name": "Muddanur",
      "booths": 42,
      "electorate": 45013,
      "turnout_pct": 81.3,
      "lead_party": "YSRCP",
      "margin": 13571,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12903,
      "name": "Kondapuram",
      "booths": 42,
      "electorate": 45013,
      "turnout_pct": 78.1,
      "lead_party": "YSRCP",
      "margin": 11103,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12904,
      "name": "Mylavaram (YSR)",
      "booths": 42,
      "electorate": 45013,
      "turnout_pct": 80.5,
      "lead_party": "YSRCP",
      "margin": 12954,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12905,
      "name": "Peddamudium",
      "booths": 42,
      "electorate": 45013,
      "turnout_pct": 77.3,
      "lead_party": "YSRCP",
      "margin": 10486,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "STRONGHOLD"
    }
  ],
  "130": [
    {
      "mandal_id": 13001,
      "name": "Proddatur",
      "booths": 100,
      "electorate": 105821,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 13946,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13002,
      "name": "Rajupalem",
      "booths": 100,
      "electorate": 105821,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 11410,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    }
  ],
  "131": [
    {
      "mandal_id": 13101,
      "name": "Mydukur",
      "booths": 40,
      "electorate": 42323,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 2578,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13102,
      "name": "Duvvur",
      "booths": 40,
      "electorate": 42323,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 3008,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13103,
      "name": "S.Mydukur",
      "booths": 40,
      "electorate": 42323,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 2435,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13104,
      "name": "Chapadu",
      "booths": 40,
      "electorate": 42323,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 2865,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13105,
      "name": "Brahmamgarimattam",
      "booths": 40,
      "electorate": 42323,
      "turnout_pct": 83.9,
      "lead_party": "TDP",
      "margin": 3294,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13106,
      "name": "Khajipet",
      "booths": 40,
      "electorate": 42323,
      "turnout_pct": 80.7,
      "lead_party": "TDP",
      "margin": 2721,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    }
  ],
  "132": [
    {
      "mandal_id": 13201,
      "name": "Allagadda",
      "booths": 38,
      "electorate": 39643,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 3980,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13202,
      "name": "Chagalamarri",
      "booths": 38,
      "electorate": 39643,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 3222,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13203,
      "name": "Rudravaram",
      "booths": 38,
      "electorate": 39643,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 3790,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13204,
      "name": "Sirvel",
      "booths": 38,
      "electorate": 39643,
      "turnout_pct": 84.8,
      "lead_party": "TDP",
      "margin": 4359,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13205,
      "name": "Uyyalawada",
      "booths": 38,
      "electorate": 39643,
      "turnout_pct": 81.6,
      "lead_party": "TDP",
      "margin": 3601,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13206,
      "name": "Dornipadu",
      "booths": 38,
      "electorate": 39643,
      "turnout_pct": 84.0,
      "lead_party": "TDP",
      "margin": 4169,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    }
  ],
  "133": [
    {
      "mandal_id": 13301,
      "name": "Srisailam",
      "booths": 34,
      "electorate": 38222,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 2967,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13302,
      "name": "Atmakur (Kurnool)",
      "booths": 34,
      "electorate": 38222,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 3491,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13303,
      "name": "Pamulapadu",
      "booths": 34,
      "electorate": 38222,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 4015,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13304,
      "name": "Sunnipenta",
      "booths": 34,
      "electorate": 38222,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 3317,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13305,
      "name": "Velgode",
      "booths": 34,
      "electorate": 38222,
      "turnout_pct": 78.6,
      "lead_party": "TDP",
      "margin": 3840,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13306,
      "name": "Bandi Atmakur",
      "booths": 34,
      "electorate": 38222,
      "turnout_pct": 75.4,
      "lead_party": "TDP",
      "margin": 3142,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    }
  ],
  "134": [
    {
      "mandal_id": 13401,
      "name": "Nandikotkur",
      "booths": 37,
      "electorate": 40690,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 2006,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 13402,
      "name": "Pagidyala",
      "booths": 37,
      "electorate": 40690,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 2307,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 13403,
      "name": "Jupadu Bungalow",
      "booths": 37,
      "electorate": 40690,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 1905,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 13404,
      "name": "Kothapalle",
      "booths": 37,
      "electorate": 40690,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 2206,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 13405,
      "name": "Midthur",
      "booths": 37,
      "electorate": 40690,
      "turnout_pct": 76.3,
      "lead_party": "TDP",
      "margin": 1805,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 13406,
      "name": "Pamulapadu",
      "booths": 37,
      "electorate": 40690,
      "turnout_pct": 78.7,
      "lead_party": "TDP",
      "margin": 2106,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    }
  ],
  "135": [
    {
      "mandal_id": 13501,
      "name": "Srisailam",
      "booths": 31,
      "electorate": 34057,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 1223,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 13502,
      "name": "Atmakur (Kurnool)",
      "booths": 31,
      "electorate": 34057,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 1010,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 13503,
      "name": "Pamulapadu",
      "booths": 31,
      "electorate": 34057,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 1170,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 13504,
      "name": "Sunnipenta",
      "booths": 31,
      "electorate": 34057,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 957,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 13505,
      "name": "Velgode",
      "booths": 31,
      "electorate": 34057,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 1117,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 13506,
      "name": "Bandi Atmakur",
      "booths": 31,
      "electorate": 34057,
      "turnout_pct": 76.4,
      "lead_party": "TDP",
      "margin": 904,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "TOSS_UP"
    }
  ],
  "136": [
    {
      "mandal_id": 13601,
      "name": "Nandikotkur",
      "booths": 41,
      "electorate": 44792,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 1860,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 13602,
      "name": "Pagidyala",
      "booths": 41,
      "electorate": 44792,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 2154,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 13603,
      "name": "Jupadu Bungalow",
      "booths": 41,
      "electorate": 44792,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 1762,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 13604,
      "name": "Kothapalle",
      "booths": 41,
      "electorate": 44792,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 2056,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 13605,
      "name": "Midthur",
      "booths": 41,
      "electorate": 44792,
      "turnout_pct": 77.3,
      "lead_party": "TDP",
      "margin": 1664,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "TOSS_UP"
    }
  ],
  "137": [
    {
      "mandal_id": 13701,
      "name": "Kurnool Urban",
      "booths": 66,
      "electorate": 70105,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 6921,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 13702,
      "name": "Kurnool Rural",
      "booths": 66,
      "electorate": 70105,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 5662,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 13703,
      "name": "Gargapuram",
      "booths": 66,
      "electorate": 70105,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 6606,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    }
  ],
  "138": [
    {
      "mandal_id": 13801,
      "name": "Panyam",
      "booths": 72,
      "electorate": 76288,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 9132,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13802,
      "name": "Gadivemula",
      "booths": 72,
      "electorate": 76288,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 10655,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13803,
      "name": "Kallur",
      "booths": 72,
      "electorate": 76288,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 8625,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13804,
      "name": "Orvakal",
      "booths": 72,
      "electorate": 76288,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 10147,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    }
  ],
  "139": [
    {
      "mandal_id": 13901,
      "name": "Nandyal Urban",
      "booths": 77,
      "electorate": 80219,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 4316,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 13902,
      "name": "Nandyal Rural",
      "booths": 77,
      "electorate": 80219,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 3494,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 13903,
      "name": "Gospadu",
      "booths": 77,
      "electorate": 80219,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 4111,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    }
  ],
  "140": [
    {
      "mandal_id": 14001,
      "name": "Banaganapalle",
      "booths": 47,
      "electorate": 52255,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 4346,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 14002,
      "name": "Owk",
      "booths": 47,
      "electorate": 52255,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 5113,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 14003,
      "name": "Koilkuntla",
      "booths": 47,
      "electorate": 52255,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 5880,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 14004,
      "name": "Sanjamala",
      "booths": 47,
      "electorate": 52255,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 4857,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 14005,
      "name": "Kolimigundla",
      "booths": 47,
      "electorate": 52255,
      "turnout_pct": 78.6,
      "lead_party": "TDP",
      "margin": 5624,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    }
  ],
  "141": [
    {
      "mandal_id": 14101,
      "name": "Dhone",
      "booths": 72,
      "electorate": 79152,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 2016,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 14102,
      "name": "Bethamcherla",
      "booths": 72,
      "electorate": 79152,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 2318,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 14103,
      "name": "Peapally",
      "booths": 72,
      "electorate": 79152,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 1915,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "TOSS_UP"
    }
  ],
  "142": [
    {
      "mandal_id": 14201,
      "name": "Pattikonda",
      "booths": 44,
      "electorate": 47746,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 3268,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14202,
      "name": "Maddikera",
      "booths": 44,
      "electorate": 47746,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 2700,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14203,
      "name": "Tuggali",
      "booths": 44,
      "electorate": 47746,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 3126,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14204,
      "name": "Veldurthi",
      "booths": 44,
      "electorate": 47746,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 2557,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14205,
      "name": "Krishnagiri",
      "booths": 44,
      "electorate": 47746,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 2984,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    }
  ],
  "143": [
    {
      "mandal_id": 14301,
      "name": "Kodumur",
      "booths": 73,
      "electorate": 78230,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 6834,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14302,
      "name": "C.Belagal",
      "booths": 73,
      "electorate": 78230,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 7913,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14303,
      "name": "Gudur (Kurnool)",
      "booths": 73,
      "electorate": 78230,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 6474,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    }
  ],
  "144": [
    {
      "mandal_id": 14401,
      "name": "Yemmiganur",
      "booths": 76,
      "electorate": 80689,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 5806,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14402,
      "name": "Nandavaram",
      "booths": 76,
      "electorate": 80689,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 4751,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14403,
      "name": "Gonegandla",
      "booths": 76,
      "electorate": 80689,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 5542,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    }
  ],
  "145": [
    {
      "mandal_id": 14501,
      "name": "Mantralayam",
      "booths": 49,
      "electorate": 51240,
      "turnout_pct": 79.9,
      "lead_party": "YSRCP",
      "margin": 2881,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14502,
      "name": "Kosigi",
      "booths": 49,
      "electorate": 51240,
      "turnout_pct": 82.3,
      "lead_party": "YSRCP",
      "margin": 3361,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14503,
      "name": "Kowthalam",
      "booths": 49,
      "electorate": 51240,
      "turnout_pct": 79.1,
      "lead_party": "YSRCP",
      "margin": 2721,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14504,
      "name": "Peddakadubur",
      "booths": 49,
      "electorate": 51240,
      "turnout_pct": 81.5,
      "lead_party": "YSRCP",
      "margin": 3201,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    }
  ],
  "146": [
    {
      "mandal_id": 14601,
      "name": "Adoni Urban",
      "booths": 98,
      "electorate": 101120,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 9536,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14602,
      "name": "Adoni Rural",
      "booths": 98,
      "electorate": 101120,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 7719,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    }
  ],
  "147": [
    {
      "mandal_id": 14701,
      "name": "Alur",
      "booths": 39,
      "electorate": 43598,
      "turnout_pct": 74.6,
      "lead_party": "YSRCP",
      "margin": 401,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 14702,
      "name": "Aspari",
      "booths": 39,
      "electorate": 43598,
      "turnout_pct": 77.0,
      "lead_party": "YSRCP",
      "margin": 471,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 14703,
      "name": "Devanakonda",
      "booths": 39,
      "electorate": 43598,
      "turnout_pct": 79.4,
      "lead_party": "YSRCP",
      "margin": 542,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 14704,
      "name": "Holagunda",
      "booths": 39,
      "electorate": 43598,
      "turnout_pct": 76.2,
      "lead_party": "YSRCP",
      "margin": 448,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 14705,
      "name": "Halaharvi",
      "booths": 39,
      "electorate": 43598,
      "turnout_pct": 78.6,
      "lead_party": "YSRCP",
      "margin": 519,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 14706,
      "name": "Chippagiri",
      "booths": 39,
      "electorate": 43598,
      "turnout_pct": 75.4,
      "lead_party": "YSRCP",
      "margin": 424,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "TOSS_UP"
    }
  ],
  "148": [
    {
      "mandal_id": 14801,
      "name": "Rayadurg",
      "booths": 53,
      "electorate": 57969,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 8331,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14802,
      "name": "D.Hirehal",
      "booths": 53,
      "electorate": 57969,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 9581,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14803,
      "name": "Kanekal",
      "booths": 53,
      "electorate": 57969,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 7915,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14804,
      "name": "Bommanahal",
      "booths": 53,
      "electorate": 57969,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 9164,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14805,
      "name": "Gummagatta",
      "booths": 53,
      "electorate": 57969,
      "turnout_pct": 76.3,
      "lead_party": "TDP",
      "margin": 7498,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    }
  ],
  "149": [
    {
      "mandal_id": 14901,
      "name": "Uravakonda",
      "booths": 44,
      "electorate": 47620,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 4991,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 14902,
      "name": "Guntakal Rural",
      "booths": 44,
      "electorate": 47620,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 4123,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 14903,
      "name": "Vajrakarur",
      "booths": 44,
      "electorate": 47620,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 4774,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 14904,
      "name": "Vidapanakal",
      "booths": 44,
      "electorate": 47620,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 3906,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 14905,
      "name": "Kudair",
      "booths": 44,
      "electorate": 47620,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 4557,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    }
  ],
  "150": [
    {
      "mandal_id": 15001,
      "name": "Guntakal Urban",
      "booths": 78,
      "electorate": 83906,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 2161,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 15002,
      "name": "Gooty",
      "booths": 78,
      "electorate": 83906,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 2502,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 15003,
      "name": "Pamidi",
      "booths": 78,
      "electorate": 83906,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 2047,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "TOSS_UP"
    }
  ],
  "151": [
    {
      "mandal_id": 15101,
      "name": "Tadipatri",
      "booths": 60,
      "electorate": 63739,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 7626,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 15102,
      "name": "Peddavadugur",
      "booths": 60,
      "electorate": 63739,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 6239,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 15103,
      "name": "Yadiki",
      "booths": 60,
      "electorate": 63739,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 7279,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 15104,
      "name": "Peddapappur",
      "booths": 60,
      "electorate": 63739,
      "turnout_pct": 78.2,
      "lead_party": "TDP",
      "margin": 5892,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    }
  ],
  "152": [
    {
      "mandal_id": 15201,
      "name": "Singanamala",
      "booths": 39,
      "electorate": 41171,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 1318,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 15202,
      "name": "Garladinne",
      "booths": 39,
      "electorate": 41171,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 1537,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 15203,
      "name": "Putlur",
      "booths": 39,
      "electorate": 41171,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 1244,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 15204,
      "name": "Yellanur",
      "booths": 39,
      "electorate": 41171,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 1464,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 15205,
      "name": "Narpala",
      "booths": 39,
      "electorate": 41171,
      "turnout_pct": 83.9,
      "lead_party": "TDP",
      "margin": 1684,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 15206,
      "name": "B.K. Samudram",
      "booths": 39,
      "electorate": 41171,
      "turnout_pct": 80.7,
      "lead_party": "TDP",
      "margin": 1391,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "TOSS_UP"
    }
  ],
  "153": [
    {
      "mandal_id": 15301,
      "name": "Anantapur Urban",
      "booths": 111,
      "electorate": 114675,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 12087,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 15302,
      "name": "Anantapur Rural",
      "booths": 111,
      "electorate": 114675,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 9784,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    }
  ],
  "154": [
    {
      "mandal_id": 15401,
      "name": "Kalyandurg",
      "booths": 48,
      "electorate": 53646,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 6414,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15402,
      "name": "Brahmasamudram",
      "booths": 48,
      "electorate": 53646,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 7546,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15403,
      "name": "Settur",
      "booths": 48,
      "electorate": 53646,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 8678,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15404,
      "name": "Kundurpi",
      "booths": 48,
      "electorate": 53646,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 7169,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15405,
      "name": "Atmakur (Anantapur)",
      "booths": 48,
      "electorate": 53646,
      "turnout_pct": 78.6,
      "lead_party": "TDP",
      "margin": 8301,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    }
  ],
  "155": [
    {
      "mandal_id": 15501,
      "name": "Raptadu",
      "booths": 50,
      "electorate": 55023,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 4665,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 15502,
      "name": "Atmakur",
      "booths": 50,
      "electorate": 55023,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 5365,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 15503,
      "name": "Kanaganapalle",
      "booths": 50,
      "electorate": 55023,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 4432,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 15504,
      "name": "C.K. Palle",
      "booths": 50,
      "electorate": 55023,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 5132,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 15505,
      "name": "Ramagiri",
      "booths": 50,
      "electorate": 55023,
      "turnout_pct": 76.3,
      "lead_party": "TDP",
      "margin": 4199,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "LEAN"
    }
  ],
  "156": [
    {
      "mandal_id": 15601,
      "name": "Madakasira",
      "booths": 38,
      "electorate": 41406,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 150,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 15602,
      "name": "Amarapuram",
      "booths": 38,
      "electorate": 41406,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 150,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 15603,
      "name": "Gudibanda",
      "booths": 38,
      "electorate": 41406,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 150,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 15604,
      "name": "Rolla",
      "booths": 38,
      "electorate": 41406,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 150,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 15605,
      "name": "Agali",
      "booths": 38,
      "electorate": 41406,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 150,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "TOSS_UP"
    }
  ],
  "157": [
    {
      "mandal_id": 15701,
      "name": "Hindupur Urban",
      "booths": 55,
      "electorate": 58974,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 7741,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15702,
      "name": "Hindupur Rural",
      "booths": 55,
      "electorate": 58974,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 8964,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15703,
      "name": "Lepakshi",
      "booths": 55,
      "electorate": 58974,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 7334,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15704,
      "name": "Chilamathur",
      "booths": 55,
      "electorate": 58974,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 8556,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    }
  ],
  "158": [
    {
      "mandal_id": 15801,
      "name": "Penukonda",
      "booths": 47,
      "electorate": 49738,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 7345,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15802,
      "name": "Somandepalle",
      "booths": 47,
      "electorate": 49738,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 6009,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15803,
      "name": "Roddam",
      "booths": 47,
      "electorate": 49738,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 7011,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15804,
      "name": "Parigi",
      "booths": 47,
      "electorate": 49738,
      "turnout_pct": 78.2,
      "lead_party": "TDP",
      "margin": 5675,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15805,
      "name": "Gorantla",
      "booths": 47,
      "electorate": 49738,
      "turnout_pct": 80.6,
      "lead_party": "TDP",
      "margin": 6677,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    }
  ],
  "159": [
    {
      "mandal_id": 15901,
      "name": "Puttaparthi",
      "booths": 42,
      "electorate": 43907,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 1576,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 15902,
      "name": "Kothacheruvu",
      "booths": 42,
      "electorate": 43907,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 1839,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 15903,
      "name": "Bukkapatnam",
      "booths": 42,
      "electorate": 43907,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 1489,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 15904,
      "name": "O.D. Cheruvu",
      "booths": 42,
      "electorate": 43907,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 1752,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 15905,
      "name": "Amadagur",
      "booths": 42,
      "electorate": 43907,
      "turnout_pct": 83.9,
      "lead_party": "TDP",
      "margin": 2014,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "TOSS_UP"
    }
  ],
  "160": [
    {
      "mandal_id": 16001,
      "name": "Dharmavaram",
      "booths": 62,
      "electorate": 64669,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 980,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16002,
      "name": "Bathalapalle",
      "booths": 62,
      "electorate": 64669,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 793,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16003,
      "name": "Tadimarri",
      "booths": 62,
      "electorate": 64669,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 933,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16004,
      "name": "Mudigubba",
      "booths": 62,
      "electorate": 64669,
      "turnout_pct": 84.8,
      "lead_party": "TDP",
      "margin": 1073,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "TOSS_UP"
    }
  ],
  "161": [
    {
      "mandal_id": 16101,
      "name": "Kadiri",
      "booths": 40,
      "electorate": 44362,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 887,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16102,
      "name": "Talupula",
      "booths": 40,
      "electorate": 44362,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 1044,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16103,
      "name": "Nambulapulakunta",
      "booths": 40,
      "electorate": 44362,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 1200,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16104,
      "name": "Gandlapenta",
      "booths": 40,
      "electorate": 44362,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 991,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16105,
      "name": "Nallacheruvu",
      "booths": 40,
      "electorate": 44362,
      "turnout_pct": 78.6,
      "lead_party": "TDP",
      "margin": 1148,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16106,
      "name": "Tanakal",
      "booths": 40,
      "electorate": 44362,
      "turnout_pct": 75.4,
      "lead_party": "TDP",
      "margin": 939,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    }
  ],
  "162": [
    {
      "mandal_id": 16201,
      "name": "Thamballapalle",
      "booths": 35,
      "electorate": 39040,
      "turnout_pct": 77.9,
      "lead_party": "YSRCP",
      "margin": 1683,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16202,
      "name": "Peddamandyam",
      "booths": 35,
      "electorate": 39040,
      "turnout_pct": 80.3,
      "lead_party": "YSRCP",
      "margin": 1936,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16203,
      "name": "Kurabalakota",
      "booths": 35,
      "electorate": 39040,
      "turnout_pct": 77.1,
      "lead_party": "YSRCP",
      "margin": 1599,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16204,
      "name": "B.Kothakota",
      "booths": 35,
      "electorate": 39040,
      "turnout_pct": 79.5,
      "lead_party": "YSRCP",
      "margin": 1852,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16205,
      "name": "PTM",
      "booths": 35,
      "electorate": 39040,
      "turnout_pct": 76.3,
      "lead_party": "YSRCP",
      "margin": 1515,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16206,
      "name": "Mulakalacheruvu",
      "booths": 35,
      "electorate": 39040,
      "turnout_pct": 78.7,
      "lead_party": "YSRCP",
      "margin": 1768,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "TOSS_UP"
    }
  ],
  "163": [
    {
      "mandal_id": 16301,
      "name": "Pileru",
      "booths": 45,
      "electorate": 48626,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 5768,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 16302,
      "name": "Gurramkonda",
      "booths": 45,
      "electorate": 48626,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 4765,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 16303,
      "name": "Kalakada",
      "booths": 45,
      "electorate": 48626,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 5517,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 16304,
      "name": "K.V. Palle",
      "booths": 45,
      "electorate": 48626,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 4514,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 16305,
      "name": "Valmikipuram",
      "booths": 45,
      "electorate": 48626,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 5267,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    }
  ],
  "164": [
    {
      "mandal_id": 16401,
      "name": "Madanapalle",
      "booths": 76,
      "electorate": 81301,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 1744,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16402,
      "name": "Nimmanapalle",
      "booths": 76,
      "electorate": 81301,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 2019,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16403,
      "name": "Ramasamudram",
      "booths": 76,
      "electorate": 81301,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 1652,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "TOSS_UP"
    }
  ],
  "165": [
    {
      "mandal_id": 16501,
      "name": "Punganur",
      "booths": 46,
      "electorate": 49498,
      "turnout_pct": 82.2,
      "lead_party": "YSRCP",
      "margin": 1340,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16502,
      "name": "Chowdepalle",
      "booths": 46,
      "electorate": 49498,
      "turnout_pct": 79.0,
      "lead_party": "YSRCP",
      "margin": 1097,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16503,
      "name": "Somala",
      "booths": 46,
      "electorate": 49498,
      "turnout_pct": 81.4,
      "lead_party": "YSRCP",
      "margin": 1279,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16504,
      "name": "Sodum",
      "booths": 46,
      "electorate": 49498,
      "turnout_pct": 78.2,
      "lead_party": "YSRCP",
      "margin": 1036,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16505,
      "name": "Pulicherla",
      "booths": 46,
      "electorate": 49498,
      "turnout_pct": 80.6,
      "lead_party": "YSRCP",
      "margin": 1219,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "TOSS_UP"
    }
  ],
  "166": [
    {
      "mandal_id": 16601,
      "name": "Chandragiri",
      "booths": 48,
      "electorate": 51224,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 6577,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16602,
      "name": "Tirupati Rural",
      "booths": 48,
      "electorate": 51224,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 7674,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16603,
      "name": "Ramachandrapuram",
      "booths": 48,
      "electorate": 51224,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 6212,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16604,
      "name": "Chinnagottigallu",
      "booths": 48,
      "electorate": 51224,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 7308,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16605,
      "name": "Yerravaripalem",
      "booths": 48,
      "electorate": 51224,
      "turnout_pct": 83.9,
      "lead_party": "TDP",
      "margin": 8404,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16606,
      "name": "Pakala",
      "booths": 48,
      "electorate": 51224,
      "turnout_pct": 80.7,
      "lead_party": "TDP",
      "margin": 6943,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    }
  ],
  "167": [
    {
      "mandal_id": 16701,
      "name": "Tirupati Urban",
      "booths": 76,
      "electorate": 78767,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 21684,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16702,
      "name": "Alipiri",
      "booths": 76,
      "electorate": 78767,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 17554,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16703,
      "name": "Tirumala",
      "booths": 76,
      "electorate": 78767,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 20652,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    }
  ],
  "168": [
    {
      "mandal_id": 16801,
      "name": "Srikalahasti",
      "booths": 60,
      "electorate": 67139,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 9202,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16802,
      "name": "Yerpedu",
      "booths": 60,
      "electorate": 67139,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 10826,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16803,
      "name": "Thottambedu",
      "booths": 60,
      "electorate": 67139,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 12449,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16804,
      "name": "Renigunta",
      "booths": 60,
      "electorate": 67139,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 10284,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    }
  ],
  "169": [
    {
      "mandal_id": 16901,
      "name": "Satyavedu",
      "booths": 33,
      "electorate": 36585,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 623,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16902,
      "name": "Varadaiahpalem",
      "booths": 33,
      "electorate": 36585,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 716,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16903,
      "name": "B.N. Kandriga",
      "booths": 33,
      "electorate": 36585,
      "turnout_pct": 77.1,
      "lead_party": "TDP",
      "margin": 592,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16904,
      "name": "K.V.B. Puram",
      "booths": 33,
      "electorate": 36585,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 685,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16905,
      "name": "Pichatur",
      "booths": 33,
      "electorate": 36585,
      "turnout_pct": 76.3,
      "lead_party": "TDP",
      "margin": 560,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "TOSS_UP"
    },
    {
      "mandal_id": 16906,
      "name": "Nagalapuram",
      "booths": 33,
      "electorate": 36585,
      "turnout_pct": 78.7,
      "lead_party": "TDP",
      "margin": 654,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "TOSS_UP"
    }
  ],
  "170": [
    {
      "mandal_id": 17001,
      "name": "Nagari",
      "booths": 41,
      "electorate": 45098,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 10350,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17002,
      "name": "Nindra",
      "booths": 41,
      "electorate": 45098,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 8550,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17003,
      "name": "Vijayapuram",
      "booths": 41,
      "electorate": 45098,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 9900,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17004,
      "name": "Puttur",
      "booths": 41,
      "electorate": 45098,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 8100,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17005,
      "name": "Vadamalapeta",
      "booths": 41,
      "electorate": 45098,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 9450,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "STRONGHOLD"
    }
  ],
  "171": [
    {
      "mandal_id": 17101,
      "name": "Gangadhara Nellore",
      "booths": 35,
      "electorate": 38042,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 4118,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17102,
      "name": "Penumur",
      "booths": 35,
      "electorate": 38042,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 4768,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17103,
      "name": "Vedurukuppam",
      "booths": 35,
      "electorate": 38042,
      "turnout_pct": 78.1,
      "lead_party": "TDP",
      "margin": 3901,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17104,
      "name": "Karvetinagar",
      "booths": 35,
      "electorate": 38042,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 4551,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17105,
      "name": "S.R. Puram",
      "booths": 35,
      "electorate": 38042,
      "turnout_pct": 77.3,
      "lead_party": "TDP",
      "margin": 3684,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17106,
      "name": "Palasamudram",
      "booths": 35,
      "electorate": 38042,
      "turnout_pct": 79.7,
      "lead_party": "TDP",
      "margin": 4335,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    }
  ],
  "172": [
    {
      "mandal_id": 17201,
      "name": "Chittoor Urban",
      "booths": 65,
      "electorate": 68732,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 5354,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17202,
      "name": "Chittoor Rural",
      "booths": 65,
      "electorate": 68732,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 4381,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17203,
      "name": "Gudipala",
      "booths": 65,
      "electorate": 68732,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 5111,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    }
  ],
  "173": [
    {
      "mandal_id": 17301,
      "name": "Puthalapattu",
      "booths": 45,
      "electorate": 47457,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 2814,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17302,
      "name": "Irala",
      "booths": 45,
      "electorate": 47457,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 3283,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17303,
      "name": "Thavanampalle",
      "booths": 45,
      "electorate": 47457,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 2657,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17304,
      "name": "Bangarupalem",
      "booths": 45,
      "electorate": 47457,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 3126,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17305,
      "name": "Yadamarri",
      "booths": 45,
      "electorate": 47457,
      "turnout_pct": 83.9,
      "lead_party": "TDP",
      "margin": 3595,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    }
  ],
  "174": [
    {
      "mandal_id": 17401,
      "name": "Palamaner",
      "booths": 54,
      "electorate": 56177,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 4225,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17402,
      "name": "Bireddypalli",
      "booths": 54,
      "electorate": 56177,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 3420,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17403,
      "name": "V.Kota",
      "booths": 54,
      "electorate": 56177,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 4024,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17404,
      "name": "Peddapanjani",
      "booths": 54,
      "electorate": 56177,
      "turnout_pct": 84.8,
      "lead_party": "TDP",
      "margin": 4628,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17405,
      "name": "Gangavaram (Chittoor)",
      "booths": 54,
      "electorate": 56177,
      "turnout_pct": 81.6,
      "lead_party": "TDP",
      "margin": 3823,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    }
  ],
  "175": [
    {
      "mandal_id": 17501,
      "name": "Kuppam",
      "booths": 59,
      "electorate": 65971,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 10201,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17502,
      "name": "Shantipuram",
      "booths": 59,
      "electorate": 65971,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 12001,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17503,
      "name": "Gudupalle",
      "booths": 59,
      "electorate": 65971,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 13801,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17504,
      "name": "Ramakuppam",
      "booths": 59,
      "electorate": 65971,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 11401,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "STRONGHOLD"
    }
  ]
};
