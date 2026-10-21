export interface HexCoordinate { col: number; row: number; }

export const ANDHRA_HEX_COORDINATES: Record<number, HexCoordinate> = {
  1: { col: 16, row: 0 }, // Ichchapuram
  2: { col: 15, row: 1 }, // Palasa
  3: { col: 16, row: 1 }, // Tekkali
  4: { col: 15, row: 0 }, // Pathapatnam
  5: { col: 14, row: 3 }, // Srikakulam
  6: { col: 13, row: 2 }, // Amadalavalasa
  7: { col: 15, row: 3 }, // Etcherla
  8: { col: 15, row: 2 }, // Narasannapeta
  9: { col: 14, row: 2 }, // Rajam
  10: { col: 14, row: 0 }, // Palakonda
  11: { col: 14, row: 1 }, // Kurupam
  12: { col: 13, row: 1 }, // Parvathipuram
  13: { col: 12, row: 1 }, // Salur
  14: { col: 13, row: 0 }, // Bobbili
  15: { col: 13, row: 3 }, // Cheepurupalli
  16: { col: 12, row: 3 }, // Gajapathinagaram
  17: { col: 13, row: 4 }, // Nellimarla
  18: { col: 11, row: 2 }, // Vizianagaram
  19: { col: 12, row: 0 }, // Srungavarapukota
  20: { col: 11, row: 3 }, // Bhimili
  21: { col: 13, row: 5 }, // Visakhapatnam East
  22: { col: 12, row: 5 }, // Visakhapatnam South
  23: { col: 14, row: 4 }, // Visakhapatnam North
  24: { col: 15, row: 4 }, // Visakhapatnam West
  25: { col: 14, row: 5 }, // Gajuwaka
  26: { col: 12, row: 4 }, // Chodavaram
  27: { col: 11, row: 1 }, // Madugula
  28: { col: 12, row: 2 }, // Araku Valley
  29: { col: 10, row: 2 }, // Paderu
  30: { col: 10, row: 3 }, // Anakapalle
  31: { col: 11, row: 4 }, // Pendurthi
  32: { col: 11, row: 5 }, // Elamanchili
  33: { col: 12, row: 6 }, // Payakaraopet
  34: { col: 10, row: 4 }, // Narsipatnam
  35: { col: 9, row: 4 }, // Tuni
  36: { col: 10, row: 1 }, // Prathipadu (Kakinada)
  37: { col: 11, row: 6 }, // Pithapuram
  38: { col: 12, row: 7 }, // Kakinada Rural
  39: { col: 10, row: 6 }, // Peddapuram
  40: { col: 11, row: 7 }, // Anaparthy
  41: { col: 13, row: 6 }, // Kakinada City
  42: { col: 11, row: 0 }, // Ramachandrapuram
  43: { col: 11, row: 8 }, // Mummidivaram
  44: { col: 13, row: 7 }, // Amalapuram
  45: { col: 14, row: 6 }, // Razole
  46: { col: 10, row: 9 }, // Gannavaram
  47: { col: 9, row: 7 }, // Kothapeta
  48: { col: 8, row: 6 }, // Mandapeta
  49: { col: 9, row: 5 }, // Rajanagaram
  50: { col: 9, row: 6 }, // Rajahmundry City
  51: { col: 10, row: 7 }, // Rajahmundry Rural
  52: { col: 10, row: 5 }, // Jaggampeta
  53: { col: 9, row: 3 }, // Rampachodavaram
  54: { col: 8, row: 4 }, // Kovvur
  55: { col: 9, row: 1 }, // Nidadavole
  56: { col: 9, row: 8 }, // Achanta
  57: { col: 12, row: 8 }, // Palakollu
  58: { col: 11, row: 9 }, // Narasapuram
  59: { col: 7, row: 8 }, // Bhimavaram
  60: { col: 8, row: 8 }, // Undi
  61: { col: 10, row: 8 }, // Tanuku
  62: { col: 8, row: 2 }, // Tadepalligudem
  63: { col: 6, row: 4 }, // Unguturu
  64: { col: 7, row: 6 }, // Denduluru
  65: { col: 8, row: 7 }, // Eluru
  66: { col: 8, row: 5 }, // Gopalapuram
  67: { col: 9, row: 2 }, // Polavaram
  68: { col: 8, row: 3 }, // Chintalapudi
  69: { col: 7, row: 4 }, // Tiruvuru
  70: { col: 7, row: 5 }, // Nuzvid
  71: { col: 7, row: 7 }, // Gannavaram (Krishna)
  72: { col: 5, row: 6 }, // Gudivada
  73: { col: 9, row: 9 }, // Kaikalur
  74: { col: 9, row: 0 }, // Pedana
  75: { col: 9, row: 10 }, // Machilipatnam
  76: { col: 6, row: 9 }, // Avanigadda
  77: { col: 6, row: 2 }, // Pamarru
  78: { col: 8, row: 1 }, // Penamaluru
  79: { col: 6, row: 7 }, // Vijayawada West
  80: { col: 6, row: 3 }, // Vijayawada Central
  81: { col: 5, row: 4 }, // Vijayawada East
  82: { col: 7, row: 2 }, // Mylavaram
  83: { col: 6, row: 5 }, // Nandigama
  84: { col: 7, row: 3 }, // Jaggayyapeta
  85: { col: 6, row: 6 }, // Pedakurapadu
  86: { col: 4, row: 5 }, // Tadikonda
  87: { col: 8, row: 9 }, // Mangalagiri
  88: { col: 7, row: 1 }, // Ponnuru
  89: { col: 8, row: 10 }, // Vemuru
  90: { col: 8, row: 11 }, // Repalle
  91: { col: 6, row: 8 }, // Tenali
  92: { col: 7, row: 10 }, // Bapatla
  93: { col: 7, row: 9 }, // Prathipadu (Guntur)
  94: { col: 5, row: 7 }, // Guntur West
  95: { col: 4, row: 6 }, // Guntur East
  96: { col: 5, row: 8 }, // Chilakaluripet
  97: { col: 3, row: 5 }, // Narasaraopet
  98: { col: 5, row: 3 }, // Sattenapalle
  99: { col: 4, row: 7 }, // Vinukonda
  100: { col: 5, row: 5 }, // Gurajala
  101: { col: 4, row: 4 }, // Macherla
  102: { col: 3, row: 6 }, // Yerragondapalem
  103: { col: 6, row: 10 }, // Darsi
  104: { col: 5, row: 9 }, // Parchur
  105: { col: 4, row: 8 }, // Addanki
  106: { col: 3, row: 7 }, // Chirala
  107: { col: 4, row: 9 }, // Santhanuthalapadu
  108: { col: 7, row: 11 }, // Ongole
  109: { col: 6, row: 11 }, // Kandukur
  110: { col: 5, row: 10 }, // Kondapi
  111: { col: 3, row: 8 }, // Markapuram
  112: { col: 3, row: 9 }, // Giddalur
  113: { col: 4, row: 10 }, // Kanigiri
  114: { col: 6, row: 12 }, // Kavali
  115: { col: 5, row: 12 }, // Atmakur
  116: { col: 7, row: 12 }, // Kovur
  117: { col: 6, row: 13 }, // Nellore City
  118: { col: 9, row: 11 }, // Nellore Rural
  119: { col: 8, row: 12 }, // Sarvepalli
  120: { col: 7, row: 13 }, // Gudur
  121: { col: 6, row: 14 }, // Sullurpeta
  122: { col: 10, row: 10 }, // Venkatagiri
  123: { col: 5, row: 11 }, // Udayagiri
  124: { col: 1, row: 10 }, // Badvel
  125: { col: 5, row: 13 }, // Rajampet
  126: { col: 3, row: 12 }, // Kadapa
  127: { col: 5, row: 14 }, // Kodur
  128: { col: 4, row: 14 }, // Rayachoti
  129: { col: 3, row: 13 }, // Pulivendla
  130: { col: 4, row: 13 }, // Kamalapuram
  131: { col: 3, row: 11 }, // Jammalamadugu
  132: { col: 4, row: 11 }, // Proddatur
  133: { col: 4, row: 12 }, // Mydukur
  134: { col: 1, row: 9 }, // Allagadda
  135: { col: 3, row: 4 }, // Srisailam
  136: { col: 2, row: 6 }, // Nandikotkur
  137: { col: 2, row: 5 }, // Kurnool
  138: { col: 2, row: 8 }, // Panyam
  139: { col: 1, row: 8 }, // Nandyal
  140: { col: 3, row: 10 }, // Banaganapalle
  141: { col: 2, row: 9 }, // Dhone
  142: { col: 1, row: 7 }, // Pattikonda
  143: { col: 1, row: 5 }, // Kodumur
  144: { col: 2, row: 7 }, // Yemmiganur
  145: { col: 1, row: 6 }, // Mantralayam
  146: { col: 0, row: 6 }, // Adoni
  147: { col: 0, row: 7 }, // Alur
  148: { col: 0, row: 10 }, // Rayadurg
  149: { col: 0, row: 9 }, // Uravakonda
  150: { col: 0, row: 8 }, // Guntakal
  151: { col: 2, row: 10 }, // Tadipatri
  152: { col: 2, row: 11 }, // Singanamala
  153: { col: 1, row: 11 }, // Anantapur Urban
  154: { col: 1, row: 12 }, // Kalyandurg
  155: { col: 2, row: 12 }, // Raptadu
  156: { col: 1, row: 13 }, // Madakasira
  157: { col: 2, row: 14 }, // Hindupur
  158: { col: 0, row: 12 }, // Penukonda
  159: { col: 2, row: 13 }, // Puttaparthi
  160: { col: 0, row: 11 }, // Dharmavaram
  161: { col: 3, row: 14 }, // Kadiri
  162: { col: 3, row: 15 }, // Thamballapalle
  163: { col: 4, row: 15 }, // Pileru
  164: { col: 1, row: 14 }, // Madanapalle
  165: { col: 0, row: 13 }, // Punganur
  166: { col: 8, row: 13 }, // Chandragiri
  167: { col: 5, row: 15 }, // Tirupati
  168: { col: 9, row: 12 }, // Srikalahasti
  169: { col: 10, row: 11 }, // Sathyavedu
  170: { col: 7, row: 14 }, // Nagari
  171: { col: 6, row: 15 }, // Gangadhara Nellore
  172: { col: 8, row: 14 }, // Chittoor
  173: { col: 2, row: 15 }, // Puthalapattu
  174: { col: 0, row: 14 }, // Palamaner
  175: { col: 1, row: 15 }, // Kuppam
};

// Backward compatibility alias
export const TELANGANA_HEX_COORDINATES = ANDHRA_HEX_COORDINATES;
