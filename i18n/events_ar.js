// Arabic events data
window.eventsDB_ar = {
  name: "العربية",
  dir: "rtl",
  campaigns: [
    { id: "argothor_main", name: "⚔️ حملة أرغوثور الرئيسية (طريق البطل)" },
    { id: "solar_attack", name: "☀️ الهجوم الشمسي — سقوط معبد الشمس" }
  ],
  events: [
    { id: 1, yearNumeric: -1000, yearDisplay: "1000 BE", title: "غزو فيراهم دول", description: "يكسر السحرة البشر الأوائل حاجزًا مظلمًا...", tags: ["campaign", "magic", "cataclysm"], isCampaign: true },
    { id: 2, yearNumeric: -980, yearDisplay: "980 BE", title: "اكتشاف جوهرة سيراث", description: "يكتشف السحرة القدماء الجوهرة...", tags: ["campaign", "artifact", "magic"], isCampaign: true },
    { id: 3, yearNumeric: 1000, yearDisplay: "1000 AE", title: "الانشقاق السحري", description: "تعلن الإمبراطورية عدم توافق السحر الأبيض والظلام...", tags: ["campaign", "magic", "politics"], isCampaign: true },
    { id: 4, yearNumeric: 1300, yearDisplay: "1300 AE", title: "تأسيس أخوية نايتويفر", description: "طائفة منشقة تلتجئ إلى البرج...", tags: ["campaign", "faction", "magic"], isCampaign: true },
    { id: 5, yearNumeric: 1470, yearDisplay: "1470 AE", title: "فساد زيلفوكون", description: "ساحر البلاط الإمبراطوري يكتشف نصوصًا محرمة...", tags: ["campaign", "villain", "magic"], isCampaign: true },
    { id: 6, yearNumeric: 1485, yearDisplay: "1485 AE", title: "تشكيل عصابات اللصوص", description: "صعوبات اقتصادية بعد الحرب...", tags: ["campaign", "bandits", "politics"], isCampaign: true },
    { id: 7, yearNumeric: 1500, yearDisplay: "1500 AE (السنة 0)", title: "اليوم الحاضر — المؤامرة مكشوفة", description: "البطل يكتشف المؤامرة...", tags: ["campaign", "start"], isCampaign: true },
    { id: 8, yearNumeric: 1501, yearDisplay: "1501 AE (المعركة الأخيرة)", title: "صعود فالهالسمار", description: "في موقع اختراق فيلسكريبي...", tags: ["campaign", "battle", "magic"], isCampaign: true },
    { id: 101, yearNumeric: -10000, yearDisplay: "~10,000 BE", title: "خلق الناغاس زيلثار", description: "الأمطار الأولى تلد الناغاس الثعبانية...", tags: ["global", "mythic", "race"], isCampaign: false },
    { id: 102, yearNumeric: 0, yearDisplay: "0 AE", title: "تأسيس الإمبراطورية", description: "اتحادات أودية الأنهار تتحد...", tags: ["global", "politics", "empire"], isCampaign: false }
  ]
};

window.campaignsDeep_ar = [
  {
    id: "argothor_main",
    deepEvents_ar: [
      { id: 1001, yearNumeric: 1460, yearDisplay: "1460 AE", title: "ميلاد والد البطل", description: "إلدرين فاين، ابن مزارع من قرية حدودية، يولد." },
      { id: 1002, yearNumeric: 1482, yearDisplay: "1482 AE", title: "ميلاد والدة البطل", description: "لييرا سويفت بروك، من سلسلة أعشاب هاروداون، تولد." },
      { id: 1003, yearNumeric: 1490, yearDisplay: "1490 AE", title: "لقاء والدي البطل", description: "إلدرين ولييرا يلتقيان خلال غارة لقطاع الطرق ويقعان في الحب." },
      { id: 1004, yearNumeric: 1492, yearDisplay: "1492 AE", title: "ميلاد البطل", description: "بطل الرواية (شخصية اللاعب) يولد في قرية صغيرة بسفوح فيلسكريبي." },
      { id: 1005, yearNumeric: 1498, yearDisplay: "1498 AE", title: "وفاة والدة البطل", description: "لييرا تستسلم لمرض منهك؛ إلدرين يربي الطفل وحده." },
      { id: 1006, yearNumeric: 1500, yearDisplay: "1500 AE (early)", title: "اختفاء والد البطل", description: "إلدرين يختفي أثناء التحقيق في أضواء غريبة قرب خرق فيلسكريبي." }
    ]
  },
  {
    id: "solar_attack",
    deepEvents_ar: [
      { id: 2001, yearNumeric: 1520, yearDisplay: "1520 AE", title: "كسوف معبد الشمس", description: "طقوس مظلمة تحجب ضوء معبد الشمس." },
      { id: 2002, yearNumeric: 1522, yearDisplay: "1522 AE", title: "نهوض طائفة الجمر", description: "طائفة تعبد النار تظهر، مسلحة بنار شمسية مسروقة." },
      { id: 2003, yearNumeric: 1524, yearDisplay: "1524 AE", title: "معركة الفجر الذهبي", description: "الأبطال يصطدمون بالطائفة فوق قمة الشمس ويعيدون الضوء." }
    ]
  }
];