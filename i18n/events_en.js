// English events data
window.eventsDB_en = {
  name: "English",
  dir: "ltr",
  campaigns: [
    { id: "argothor_main", name: "⚔️ Argothor Main Campaign (Hero's Path)" },
    { id: "solar_attack", name: "☀️ Solar Attack — Fall of the Sun Temple" }
  ],
  events: [
    { id: 1, yearNumeric: -1000, yearDisplay: "1000 BE", title: "Vyrahmdol Incursion", description: "Early human mages accidentally breach a dark dimension...", tags: ["campaign", "magic", "cataclysm"], isCampaign: true },
    { id: 2, yearNumeric: -980, yearDisplay: "980 BE", title: "Si'rath Jewel Found", description: "Ancient mages discover the jewel...", tags: ["campaign", "artifact", "magic"], isCampaign: true },
    { id: 3, yearNumeric: 1000, yearDisplay: "1000 AE", title: "Magical Schism", description: "The Empire declares white and dark magic incompatible...", tags: ["campaign", "magic", "politics"], isCampaign: true },
    { id: 4, yearNumeric: 1300, yearDisplay: "1300 AE", title: "Nightweaver Brotherhood Founded", description: "A splinter sect of Council servants...", tags: ["campaign", "faction", "magic"], isCampaign: true },
    { id: 5, yearNumeric: 1470, yearDisplay: "1470 AE", title: "Zil'vokon's Corruption", description: "Imperial court mage Zil'vokon discovers Vyrahmdol texts...", tags: ["campaign", "villain", "magic"], isCampaign: true },
    { id: 6, yearNumeric: 1485, yearDisplay: "1485 AE", title: "Bandit Confederacy Forms", description: "Post‑war economic hardship...", tags: ["campaign", "bandits", "politics"], isCampaign: true },
    { id: 7, yearNumeric: 1500, yearDisplay: "1500 AE (Year 0)", title: "Present Day — Conspiracy Revealed", description: "The hero discovers the conspiracy...", tags: ["campaign", "start"], isCampaign: true },
    { id: 8, yearNumeric: 1501, yearDisplay: "1501 AE (Final battle)", title: "Vhalismaar Ascendance", description: "At the Veilscrape breach site...", tags: ["campaign", "battle", "magic"], isCampaign: true },
    { id: 101, yearNumeric: -10000, yearDisplay: "~10,000 BE", title: "Creation of the Zilthar Nagas", description: "The first rains give birth to the serpentine Nagas...", tags: ["global", "mythic", "race"], isCampaign: false },
    { id: 102, yearNumeric: 0, yearDisplay: "0 AE", title: "Founding of the Empire", description: "River-valley chiefdoms unite...", tags: ["global", "politics", "empire"], isCampaign: false }
  ]
};

window.campaignsDeep_en = [
  {
    id: "argothor_main",
    deepEvents_en: [
      { id: 1001, yearNumeric: 1460, yearDisplay: "1460 AE", title: "Hero's Father Born", description: "Eldrin Vane, a farmer's son from a border village, is born." },
      { id: 1002, yearNumeric: 1482, yearDisplay: "1482 AE", title: "Hero's Mother Born", description: "Lyra Swiftbrook, from a line of Harrowdown herbalists, is born." },
      { id: 1003, yearNumeric: 1490, yearDisplay: "1490 AE", title: "Hero's Parents Meet", description: "Eldrin and Lyra meet during a bandit raid and fall in love." },
      { id: 1004, yearNumeric: 1492, yearDisplay: "1492 AE", title: "Hero Born", description: "The protagonist (player character) is born in a small village at the foot of the Vhelscrape." },
      { id: 1005, yearNumeric: 1498, yearDisplay: "1498 AE", title: "Hero's Mother Dies", description: "Lyra succumbs to a wasting sickness; Eldrin raises the child alone." },
      { id: 1006, yearNumeric: 1500, yearDisplay: "1500 AE (early)", title: "Hero's Father Disappears", description: "Eldrin goes missing investigating strange lights near the Vhelscrape breach." }
    ]
  },
  {
    id: "solar_attack",
    deepEvents_en: [
      { id: 2001, yearNumeric: 1520, yearDisplay: "1520 AE", title: "The Sun Temple's Eclipse", description: "A dark ritual eclipses the Sun Temple, draining its light." },
      { id: 2002, yearNumeric: 1522, yearDisplay: "1522 AE", title: "Rise of the Ember Cabal", description: "A cult of fire-worshippers emerges, wielding stolen solar fire." },
      { id: 2003, yearNumeric: 1524, yearDisplay: "1524 AE", title: "Battle of the Golden Dawn", description: "Heroes clash with the Cabal atop the Sun Spire, restoring the sun." }
    ]
  }
];