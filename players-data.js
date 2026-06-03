/*
  Edit this file to manage the leaderboard.

  Regions can be anything short, such as NA, EU, AS, SA, AU, ME, or AF.
  You can change region colors in TIERLANDS_REGIONS below.
  You can also override one player's badge with regionColor and regionTextColor.
  Tiers should use: HT1, LT1, HT2, LT2, HT3, LT3, HT4, LT4, HT5, LT5.
  Leave a mode blank with "" if the player does not have a tier there.
*/

window.TIERLANDS_REGIONS = {
  "NA": {
    "background": "#662735",
    "text": "#ff7183"
  },
  "EU": {
    "background": "#143f1e",
    "text": "#78ff95"
  },
  "AS": {
    "background": "#46351a",
    "text": "#ffd77a"
  },
  "SA": {
    "background": "#19395d",
    "text": "#78bdff"
  },
  "AU": {
    "background": "#4b244f",
    "text": "#ff9df8"
  },
  "ME": {
    "background": "#16433d",
    "text": "#76ffdf"
  },
  "AF": {
    "background": "#4a321d",
    "text": "#ffc485"
  }
};

window.TIERLANDS_MODES = [
  {
    "id": "overall",
    "name": "Overall",
    "icon": "TL",
    "iconPath": "",
    "color": "#ffc857"
  },
  {
    "id": "vanilla",
    "name": "Vanilla",
    "icon": "V",
    "iconPath": "images/Vanilla.webp",
    "color": "#caa6ff"
  },
  {
    "id": "uhc",
    "name": "UHC",
    "icon": "H",
    "iconPath": "images/UHC.webp",
    "color": "#ff6878"
  },
  {
    "id": "pot",
    "name": "Pot",
    "icon": "P",
    "iconPath": "images/Pot.webp",
    "color": "#f6f3ff"
  },
  {
    "id": "nethop",
    "name": "NethOP",
    "icon": "N",
    "iconPath": "images/NethOP.webp",
    "color": "#a47be8"
  },
  {
    "id": "smp",
    "name": "SMP",
    "icon": "S",
    "iconPath": "images/SMP.webp",
    "color": "#18d3a1"
  },
  {
    "id": "sword",
    "name": "Sword",
    "icon": "SW",
    "iconPath": "images/Sword.webp",
    "color": "#6aa7ff"
  },
  {
    "id": "axe",
    "name": "Axe",
    "icon": "A",
    "iconPath": "images/Axe.webp",
    "color": "#78c8ff"
  },
  {
    "id": "mace",
    "name": "Mace",
    "icon": "M",
    "iconPath": "images/Mace.webp",
    "color": "#969dc3"
  }
];

window.TIERLANDS_PLAYERS = [
  {
    "name": "ItzRealMes",
    "title": "Combat Master",
    "points": 330,
    "region": "NA",
    "regionColor": "",
    "regionTextColor": "",
    "tiers": {
      "overall": "HT3",
      "vanilla": "HT1",
      "uhc": "LT2",
      "pot": "HT1",
      "nethop": "HT1",
      "smp": "HT1",
      "sword": "HT3",
      "axe": "LT2",
      "mace": "LT2"
    }
  },
  {
    "name": "coldified",
    "title": "Combat Master",
    "points": 326,
    "region": "EU",
    "regionColor": "",
    "regionTextColor": "",
    "tiers": {
      "overall": "LT1",
      "vanilla": "LT3",
      "uhc": "HT1",
      "pot": "LT1",
      "nethop": "LT2",
      "smp": "HT1",
      "sword": "LT1",
      "axe": "LT1",
      "mace": "LT2"
    }
  },
  {
    "name": "Swight",
    "title": "Combat Master",
    "points": 290,
    "region": "NA",
    "regionColor": "",
    "regionTextColor": "",
    "tiers": {
      "overall": "HT3",
      "vanilla": "LT3",
      "uhc": "HT1",
      "pot": "HT3",
      "nethop": "HT1",
      "smp": "HT1",
      "sword": "HT1",
      "axe": "LT2",
      "mace": "LT2"
    }
  },
  {
    "name": "janeky",
    "title": "Combat Master",
    "points": 260,
    "region": "EU",
    "regionColor": "",
    "regionTextColor": "",
    "tiers": {
      "overall": "LT3",
      "vanilla": "HT4",
      "uhc": "LT2",
      "pot": "HT1",
      "nethop": "HT1",
      "smp": "HT1",
      "sword": "HT2",
      "axe": "LT2",
      "mace": "LT2"
    }
  },
  {
    "name": "BlvckWlf",
    "title": "Combat Ace",
    "points": 226,
    "region": "EU",
    "regionColor": "",
    "regionTextColor": "",
    "tiers": {
      "overall": "HT2",
      "vanilla": "LT3",
      "uhc": "LT1",
      "pot": "LT2",
      "nethop": "LT3",
      "smp": "HT1",
      "sword": "HT3",
      "axe": "HT2",
      "mace": "LT2"
    }
  },
  {
    "name": "Mohamed",
    "title": "DiasMP Champion",
    "points": 410,
    "region": "NA",
    "regionColor": "",
    "regionTextColor": "",
    "tiers": {
      "overall": "HT1",
      "vanilla": "HT2",
      "uhc": "LT1",
      "pot": "HT1",
      "nethop": "LT1",
      "smp": "HT1",
      "sword": "HT2",
      "axe": "LT1",
      "mace": "HT2"
    }
  }
];
