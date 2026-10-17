export interface HexCoordinate { col: number; row: number; }

export const TELANGANA_HEX_COORDINATES: Record<number, HexCoordinate> = {
  1: { col: 7, row: 1 }, // Sirpur
  2: { col: 7, row: 3 }, // Chennur (SC)
  3: { col: 7, row: 2 }, // Bellampalle (SC)
  4: { col: 6, row: 3 }, // Mancherial
  5: { col: 5, row: 1 }, // Asifabad (ST)
  6: { col: 4, row: 2 }, // Khanapur (ST)
  7: { col: 4, row: 0 }, // Adilabad
  8: { col: 3, row: 1 }, // Boath (ST)
  9: { col: 3, row: 2 }, // Nirmal
  10: { col: 2, row: 2 }, // Mudhole
  11: { col: 2, row: 3 }, // Armur
  12: { col: 1, row: 3 }, // Bodhan
  13: { col: 1, row: 4 }, // Jukkal (SC)
  14: { col: 2, row: 4 }, // Banswada
  15: { col: 2, row: 5 }, // Yellareddy
  16: { col: 0, row: 5 }, // Kamareddy
  17: { col: 3, row: 4 }, // Nizamabad (Urban)
  18: { col: 4, row: 4 }, // Nizamabad (Rural)
  19: { col: 3, row: 3 }, // Balkonda
  20: { col: 4, row: 3 }, // Koratla
  21: { col: 5, row: 2 }, // Jagtial
  22: { col: 5, row: 3 }, // Dharmapuri (SC)
  23: { col: 6, row: 4 }, // Ramagundam
  24: { col: 7, row: 4 }, // Manthani
  25: { col: 8, row: 3 }, // Peddapalle
  26: { col: 6, row: 1 }, // Karimnagar
  27: { col: 6, row: 2 }, // Choppadandi (SC)
  28: { col: 5, row: 4 }, // Vemulawada
  29: { col: 4, row: 1 }, // Sircilla
  30: { col: 8, row: 2 }, // Manakondur (SC)
  31: { col: 9, row: 3 }, // Huzurabad
  32: { col: 6, row: 0 }, // Husnabad
  33: { col: 2, row: 1 }, // Siddipet
  34: { col: 3, row: 5 }, // Medak
  35: { col: 1, row: 5 }, // Narayankhed
  36: { col: 2, row: 6 }, // Andole (SC)
  37: { col: 4, row: 5 }, // Narsapur
  38: { col: 1, row: 6 }, // Zahirabad (SC)
  39: { col: 2, row: 7 }, // Sangareddy
  40: { col: 5, row: 7 }, // Patancheru
  41: { col: 1, row: 2 }, // Dubbak
  42: { col: 0, row: 3 }, // Gajwel
  43: { col: 0, row: 4 }, // Medchal
  44: { col: 1, row: 11 }, // Malkajgiri
  45: { col: 0, row: 6 }, // Quthbullapur
  46: { col: 0, row: 7 }, // Kukatpalle
  47: { col: 3, row: 12 }, // Uppal
  48: { col: 5, row: 11 }, // Ibrahimpatnam
  49: { col: 0, row: 9 }, // Lal Bahadur Nagar
  50: { col: 4, row: 8 }, // Maheswaram
  51: { col: 4, row: 7 }, // Rajendranagar
  52: { col: 3, row: 6 }, // Serilingampally
  53: { col: 3, row: 7 }, // Chevella (SC)
  54: { col: 2, row: 8 }, // Pargi
  55: { col: 1, row: 7 }, // Vicarabad (SC)
  56: { col: 0, row: 8 }, // Tandur
  57: { col: 7, row: 7 }, // Musheerabad
  58: { col: 6, row: 5 }, // Malakpet
  59: { col: 7, row: 6 }, // Amberpet
  60: { col: 6, row: 6 }, // Khairatabad
  61: { col: 5, row: 5 }, // Jubilee Hills
  62: { col: 5, row: 6 }, // Sanathnagar
  63: { col: 6, row: 8 }, // Nampally
  64: { col: 4, row: 6 }, // Karwan
  65: { col: 6, row: 7 }, // Goshamahal
  66: { col: 1, row: 10 }, // Charminar
  67: { col: 5, row: 9 }, // Chandrayangutta
  68: { col: 5, row: 10 }, // Yakutpura
  69: { col: 5, row: 8 }, // Bahadurpura
  70: { col: 7, row: 5 }, // Secunderabad
  71: { col: 7, row: 9 }, // Secunderabad Cantt. (SC
  72: { col: 1, row: 8 }, // Kodangal
  73: { col: 1, row: 9 }, // Narayanpet
  74: { col: 2, row: 9 }, // Mahbubnagar
  75: { col: 3, row: 9 }, // Jadcherla
  76: { col: 2, row: 10 }, // Devarkadra
  77: { col: 0, row: 10 }, // Makthal
  78: { col: 2, row: 11 }, // Wanaparthy
  79: { col: 0, row: 11 }, // Gadwal
  80: { col: 2, row: 12 }, // Alampur (SC)
  81: { col: 3, row: 10 }, // Nagarkurnool
  82: { col: 4, row: 11 }, // Achampet (SC)
  83: { col: 4, row: 9 }, // Kalwakurthy
  84: { col: 3, row: 8 }, // Shadnagar
  85: { col: 3, row: 11 }, // Kollapur
  86: { col: 4, row: 10 }, // Devarakonda (ST)
  87: { col: 6, row: 10 }, // Nagarjuna Sagar
  88: { col: 6, row: 9 }, // Miryalaguda
  89: { col: 8, row: 9 }, // Huzurnagar
  90: { col: 7, row: 8 }, // Kodad
  91: { col: 8, row: 10 }, // Suryapet
  92: { col: 6, row: 11 }, // Nalgonda
  93: { col: 7, row: 10 }, // Munugode
  94: { col: 4, row: 12 }, // Bhongir
  95: { col: 7, row: 11 }, // Nakrekal (SC)
  96: { col: 9, row: 10 }, // Thungathurthi (SC)
  97: { col: 5, row: 12 }, // Alair
  98: { col: 8, row: 1 }, // Jangoan
  99: { col: 11, row: 6 }, // Ghanpur (Station) (SC)
  100: { col: 10, row: 9 }, // Palakurthi
  101: { col: 8, row: 6 }, // Dornakal (ST)
  102: { col: 8, row: 5 }, // Mahabubabad (ST)
  103: { col: 9, row: 4 }, // Narsampet
  104: { col: 10, row: 6 }, // Parkal
  105: { col: 10, row: 3 }, // Warangal West
  106: { col: 10, row: 4 }, // Warangal East
  107: { col: 9, row: 2 }, // Waradhanapet (SC)
  108: { col: 8, row: 4 }, // Bhupalpalle
  109: { col: 9, row: 5 }, // Mulug (ST)
  110: { col: 9, row: 6 }, // Pinapaka (ST)
  111: { col: 9, row: 7 }, // Yellandu (ST)
  112: { col: 8, row: 8 }, // Khammam
  113: { col: 8, row: 7 }, // Palair
  114: { col: 9, row: 9 }, // Madhira (SC)
  115: { col: 9, row: 8 }, // Wyra (ST)
  116: { col: 10, row: 8 }, // Sathupalle (SC)
  117: { col: 10, row: 7 }, // Kothagudem
  118: { col: 11, row: 7 }, // Aswaraopeta (ST)
  119: { col: 10, row: 5 }, // Bhadrachalam (ST)
};