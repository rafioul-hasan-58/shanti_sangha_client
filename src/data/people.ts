export interface PersonDetail {
  id: string;
  slug: string;
  alternateSlugs?: string[];
  memberId: string;
  nameEn: string;
  nameBn: string;
  roleEn: string;
  roleBn: string;
  type: "pioneer" | "committee";
  badgeEn: string;
  badgeBn: string;
  image: string;
  bloodGroup: string;
  joiningYear: string;
  villageEn: string;
  villageBn: string;
  bioEn: string;
  bioBn: string;
  responsibilitiesEn: string[];
  responsibilitiesBn: string[];
  quoteEn?: string;
  quoteBn?: string;
  isKeyLeader?: boolean;
}

export const allPeople: PersonDetail[] = [
  // ==========================================
  // PIONEERS OF PEACE (Former Presidents)
  // ==========================================
  {
    id: "harun",
    slug: "harun",
    alternateSlugs: ["harun-sheikh", "harunsheikh"],
    memberId: "SS-PION-001",
    nameEn: "Harun Sheikh",
    nameBn: "হারুন শেখ",
    roleEn: "Founder President",
    roleBn: "প্রতিষ্ঠাতা সভাপতি",
    type: "pioneer",
    badgeEn: "👑 Founder President • Pioneer of Peace",
    badgeBn: "👑 প্রতিষ্ঠাতা সভাপতি • শান্তির অগ্রদূত",
    image: "/images/formar_president/harun.png",
    bloodGroup: "A+",
    joiningYear: "2007 (প্রতিষ্ঠাতা)",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "Harun Sheikh is the visionary Founder President of Shavarchala Shanti Sangha. In 2007, he laid the cornerstone of the club alongside enthusiastic local youth with the vision of uniting the community through sports, brotherhood, and social responsibility. His pioneering leadership has guided the club for nearly two decades.",
    bioBn:
      "হারুন শেখ সাভারচালা শান্তি সংঘের দূরদর্শী প্রতিষ্ঠাতা সভাপতি। ২০০৭ সালে এলাকার একদল উদ্যমী তরুণদের সাথে নিয়ে তিনি এই ঐতিহ্যবাহী ক্লাবের ভিত্তিপ্রস্তর স্থাপন করেন। তাঁর দিকনির্দেশনামূলক নেতৃত্ব ও সম্প্রীতির সুদৃঢ় ভিত্তির ওপর দাঁড়িয়ে শান্তি সংঘ আজ এলাকার অন্যতম শীর্ষ সামাজিক ও ক্রীড়া সংগঠনে পরিণত হয়েছে।",
    responsibilitiesEn: [
      "Founded Shavarchala Shanti Sangha in 2007 and served as the inaugural President",
      "Formulated the club's foundational constitution, values of unity, and sporting ethics",
      "Initiated the historic SPL (Shanti Sangha Premier League) tournament tradition",
      "Mentored successive generations of youth leaders in community service and sportsmanship",
    ],
    responsibilitiesBn: [
      "২০০৭ সালে সাভারচালা শান্তি সংঘের শুভ সূচনা ও প্রতিষ্ঠাতা সভাপতির দায়িত্ব পালন",
      "ক্লাবের গঠনতন্ত্র, শৃঙ্খলা এবং সামাজিক সম্প্রীতির মূল আদর্শ প্রণয়ন",
      "ঐতিহাসিক এসপিএল (SPL) টুর্নামেন্ট ও বাৎসরিক ক্রীড়া আসরের ভিত্তি স্থাপন",
      "পরবর্তী প্রজন্মের তরুণ নেতৃত্ব গঠনে দিকনির্দেশনা ও সার্বিক অভিভাবকত্ব প্রদান",
    ],
    quoteEn: "True victory is not just winning on the field, but keeping our brothers united in peace.",
    quoteBn: "খেলার মাঠের জয়ের চেয়েও বড় জয় হলো আমাদের এলাকার ভাইদের মধ্যে চিরস্থায়ী ভ্রাতৃত্ব ও শান্তি বজায় রাখা।",
    isKeyLeader: true,
  },
  {
    id: "tk_roman",
    slug: "tk_roman",
    alternateSlugs: ["tk-roman", "roman", "tanvir-khorshed-roman"],
    memberId: "SS-PION-002",
    nameEn: "Tanvir Khorshed Roman",
    nameBn: "তানভীর খোরশেদ রোমান",
    roleEn: "Former President",
    roleBn: "সাবেক সভাপতি",
    type: "pioneer",
    badgeEn: "🕊️ Former President • Pioneer of Peace",
    badgeBn: "🕊️ সাবেক সভাপতি • শান্তির অগ্রদূত",
    image: "/images/formar_president/tk_roman.png",
    bloodGroup: "O+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "Tanvir Khorshed Roman (T.K. Roman) served with distinction as President, inspiring local youth through dynamic athletic leadership, community unity, and competitive tournament management. His tenure modernized the club's flagship Premier League competitions.",
    bioBn:
      "তানভীর খোরশেদ রোমান (টি.কে. রোমান) সাভারচালা শান্তি সংঘের সাবেক সভাপতি হিসেবে অত্যন্ত প্রশংসনীয় নেতৃত্ব প্রদান করেন। তারুণ্যের উদ্দীপনা, সুস্থ ক্রীড়া চর্চা এবং সামাজিক দায়বদ্ধতা সুদৃঢ় করার ক্ষেত্রে তাঁর অবদান অপরিসীম। তাঁর মেয়াদে ক্লাবটির প্রিমিয়ার লিগ ও ক্রীড়া কার্যক্রম নতুন উচ্চতায় পৌঁছেছিল।",
    responsibilitiesEn: [
      "Presided over club executive operations and premier athletic tournaments",
      "Expanded the Shanti Sangha Premier League (SPL) cricket and football formats",
      "Strengthened community cohesion, charitable welfare, and youth engagement",
      "Continues to serve as a revered senior advisor for club affairs",
    ],
    responsibilitiesBn: [
      "ক্লাবের কার্যনির্বাহী পরিষদ এবং প্রধান টুর্নামেন্টসমূহের সফল নেতৃত্ব প্রদান",
      "শান্তি সংঘ প্রিমিয়ার লিগ (এসপিএল) ক্রিকেট ও ফুটবল টুর্নামেন্টের পরিধি বৃদ্ধি",
      "সামাজিক সম্প্রীতি, জনকল্যাণমূলক উদ্যোগ ও তরুণদের খেলাধুলায় অংশগ্রহণ নিশ্চিতকরণ",
      "ক্লাবের একজন শীর্ষ সিনিয়র উপদেষ্টা হিসেবে বর্তমান পরিচালনা পর্ষদকে সার্বিক পরামর্শ প্রদান",
    ],
    quoteEn: "Sports build character, discipline, and unbreakable friendship among generations.",
    quoteBn: "ক্রীড়াই পারে তরুণ সমাজকে সঠিক পথে রেখে প্রজন্ম থেকে প্রজন্মে ভ্রাতৃত্বের সেতু তৈরি করতে।",
    isKeyLeader: true,
  },
  {
    id: "lutfor",
    slug: "lutfor",
    alternateSlugs: ["lutfor-rahman", "md-lutfor-rahman"],
    memberId: "SS-PION-003",
    nameEn: "Lutfor Rahman",
    nameBn: "লুৎফর রহমান",
    roleEn: "Former President",
    roleBn: "সাবেক সভাপতি",
    type: "pioneer",
    badgeEn: "🕊️ Former President • Pioneer of Peace",
    badgeBn: "🕊️ সাবেক সভাপতি • শান্তির অগ্রদূত",
    image: "/images/formar_president/lutfor.png",
    bloodGroup: "B+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "Lutfor Rahman is an unforgettable stalwart in Shanti Sangha's heritage. Serving as Former President, he devoted his tenure to institutional discipline, large-scale community events including the Annual Waz Mahfil, and promoting peaceful coexistence.",
    bioBn:
      "লুৎফর রহমান সাভারচালা শান্তি সংঘের ইতিহাসে এক অবিস্মরণীয় কান্ডারী। সাবেক সভাপতি হিসেবে তিনি ক্লাবের প্রাতিষ্ঠানিক রূপদান, বাৎসরিক ওয়াজ মাহফিল এবং এলাকার তরুণ সমাজকে শৃঙ্খলা ও শান্তির পতাকাতলে একত্রিত করার ক্ষেত্রে ঐতিহাসিক ভূমিকা পালন করেছেন।",
    responsibilitiesEn: [
      "Led the club with a focus on administrative discipline and ethical governance",
      "Orchestrated the signature Annual Waz Mahfil gathering thousands of villagers",
      "Fostered long-lasting ties with elders, patrons, and community leaders",
      "Promoted healthy sportsmanship and local developmental initiatives",
    ],
    responsibilitiesBn: [
      "প্রশাসনিক শৃঙ্খলা ও নিরপেক্ষ মূল্যবোধের ভিত্তিতে ক্লাব পরিচালনা",
      "হাজারো মানুষের অংশগ্রহণে ক্লাবের ঐতিহ্যবাহী বাৎসরিক ওয়াজ মাহফিলের নেতৃত্ব প্রদান",
      "এলাকার মুরুব্বি, সমাজসেবক ও প্রবাসী শুভাকাঙ্ক্ষীদের সাথে গভীর যোগসূত্র তৈরি",
      "সুস্থ ক্রীড়া সংস্কৃতি ও এলাকার শিক্ষা ও সামাজিক উন্নয়নে ভূমিকা পালন",
    ],
    quoteEn: "Peace and discipline are the true foundations upon which great communities stand.",
    quoteBn: "শান্তি এবং শৃঙ্খলাই হলো একটি সফল ও সুদৃঢ় সমাজের মূল স্তম্ভ।",
    isKeyLeader: true,
  },

  // ==========================================
  // EXECUTIVE COMMITTEE MEMBERS (Current Governing Council)
  // ==========================================
  {
    id: "mahfuz",
    slug: "mahfuz",
    alternateSlugs: ["mahfojor-rahman", "mahfojor"],
    memberId: "SS-EXEC-001",
    nameEn: "Mahfojor Rahman",
    nameBn: "মাহফুজুর রহমান",
    roleEn: "President",
    roleBn: "সভাপতি",
    type: "committee",
    badgeEn: "🏛️ Executive Committee • President",
    badgeBn: "🏛️ কার্যনির্বাহী পরিষদ • সভাপতি",
    image: "/images/committee/mahfuz.png",
    bloodGroup: "B+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "**Mahfojor Rahman** currently serves as the President of Shavarchala Shanti Sangha. He is regarded as one of the most successful, skilled, and hardworking presidents in the organization's history.\n\nSince the very inception of Shavarchala Shanti Sangha, he has played a pivotal role in advancing the organization through his intellect, skill, experience, and steadfast dedication. He remains genuinely committed to resolving problems faced by every member of the organization. Furthermore, through his creative vision, exceptional initiatives, and innovative concepts, he works tirelessly to make the organization's activities even more dynamic and modern.\n\nHis contribution to the organization's digitalization and modernization is particularly profound. His visionary leadership and constructive stewardship stand as a remarkable milestone in the continuous journey of Shavarchala Shanti Sangha.\n\n**Educational Qualification:** He completed his Bachelor of Laws (LLB) from Uttara University.",
    bioBn:
      "**মাহফুজুর রহমান (Mahfojor Rahman)** বর্তমানে সাভারচালা শান্তি সংঘের সভাপতি হিসেবে দায়িত্ব পালন করছেন। সংগঠনটির ইতিহাসে সফল, দক্ষ ও পরিশ্রমী সভাপতিদের মধ্যে তিনি অন্যতম।\n\nসাভারচালা শান্তি সংঘের প্রতিষ্ঠালগ্ন থেকেই তিনি নিজের মেধা, দক্ষতা, অভিজ্ঞতা ও নিষ্ঠার মাধ্যমে সংগঠনকে এগিয়ে নিতে গুরুত্বপূর্ণ ভূমিকা পালন করে আসছেন। সংগঠনের প্রতিটি সদস্যের সমস্যা সমাধানে তিনি সর্বদা আন্তরিক ও বদ্ধপরিকর। পাশাপাশি তাঁর সৃজনশীল চিন্তাভাবনা, ব্যতিক্রমী উদ্যোগ ও নতুন নতুন ধারণার মাধ্যমে সংগঠনের কার্যক্রমকে আরও গতিশীল ও আধুনিক করে তুলতে নিরলসভাবে কাজ করে যাচ্ছেন।\n\nবিশেষ করে সংগঠনের ডিজিটালাইজেশন ও আধুনিকায়নে তাঁর অবদান অত্যন্ত গুরুত্বপূর্ণ। তাঁর দূরদর্শী নেতৃত্ব ও ইতিবাচক ভূমিকা সাভারচালা শান্তি সংঘের অগ্রযাত্রায় এক উল্লেখযোগ্য সংযোজন।\n\n**শিক্ষাগত যোগ্যতা:** তিনি উত্তরা ইউনিভার্সিটি (Uttara University) থেকে এলএলবি (LLB) সম্পন্ন করেছেন।",
    responsibilitiesEn: [
      "Chief executive leader overseeing all club policies, committees, and events",
      "Presides over executive meetings and ensures transparent decision-making",
      "Represents Shavarchala Shanti Sangha in external affairs and sports federations",
      "Supervises the planning and execution of the SPL and annual festivals",
    ],
    responsibilitiesBn: [
      "ক্লাবের প্রধান নির্বাহী হিসেবে সকল নীতি, কমিটি ও আয়োজনের সার্বিক তত্ত্বাবধান",
      "কার্যনির্বাহী সভার সভাপতিত্ব এবং গণতান্ত্রিক প্রক্রিয়ায় ক্লাব পরিচালনা",
      "বিভিন্ন সামাজিক ও ক্রীড়া সংস্থায় সাভারচালা শান্তি সংঘের প্রতিনিধিত্ব নিশ্চিতকরণ",
      "ঐতিহাসিক এসপিএল ও বাৎসরিক ৩টি প্রধান কর্মসূচি সফলভাবে বাস্তবায়ন",
    ],
    quoteEn: "Our goal is to build a modern, united, and sports-driven community for our youth.",
    quoteBn: "আমাদের লক্ষ্য তরুণদের জন্য একটি আধুনিক, ঐক্যবদ্ধ এবং ক্রীড়ামুখী সমাজ গড়ে তোলা।",
    isKeyLeader: true,
  },
  {
    id: "rakib",
    slug: "rakib",
    alternateSlugs: ["rakib-hasan"],
    memberId: "SS-EXEC-002",
    nameEn: "Rakib Hasan",
    nameBn: "রাকিব হাসান",
    roleEn: "Senior Vice President",
    roleBn: "সিনিয়র সহ-সভাপতি",
    type: "committee",
    badgeEn: "🏛️ Executive Committee • Senior VP",
    badgeBn: "🏛️ কার্যনির্বাহী পরিষদ • সিনিয়র সহ-সভাপতি",
    image: "/images/committee/rakib.png",
    bloodGroup: "O+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "Rakib Hasan is the Senior Vice President, playing a vital role in operational leadership, team coordination, and guiding tournament steering committees.",
    bioBn:
      "রাকিব হাসান কার্যনির্বাহী পরিষদের সিনিয়র সহ-সভাপতি। তিনি ক্লাবের অভ্যন্তরীণ সমন্বয়, সাংগঠনিক শৃঙ্খলা এবং গুরুত্বপূর্ণ টুর্নামেন্ট পরিচালনা কমিটিতে অগ্রণী ভূমিকা পালন করেন।",
    responsibilitiesEn: [
      "Assists the President in overall club governance and policy execution",
      "Heads strategic planning and conflict resolution committees",
      "Coordinates with local sports officials during major championships",
    ],
    responsibilitiesBn: [
      "ক্লাব পরিচালনা ও নীতি বাস্তবায়নে সভাপতির সাথে সার্বিক সহযোগিতা",
      "কৌশলগত পরিকল্পনা ও অভ্যন্তরীণ সমন্বয় কমিটিতে নেতৃত্ব প্রদান",
      "প্রধান টুর্নামেন্ট চলাকালে ম্যাচ পরিচালনা ও শৃঙ্খলা রক্ষা",
    ],
  },
  {
    id: "rasel",
    slug: "rasel",
    alternateSlugs: ["rasel-shuvo", "rasel-shovo", "raselshovo", "raselshuvo"],
    memberId: "SS-EXEC-003",
    nameEn: "Rasel Shuvo",
    nameBn: "রাসেল শুভ",
    roleEn: "Senior Vice President",
    roleBn: "সিনিয়র সহ-সভাপতি",
    type: "committee",
    badgeEn: "🏏 GPL Champion Captain • Senior VP",
    badgeBn: "🏏 জিপিএল চ্যাম্পিয়ন ক্যাপ্টেন • সিনিয়র সহ-সভাপতি",
    image: "/images/committee/rasel.png",
    bloodGroup: "A+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "**Rasel Shuvo** currently serves as the Senior Vice President of Shavarchala Shanti Sangha. He has been leading the organization's cricket team for a long time. Under his leadership and skills, Shavarchala Shanti Sangha achieved the glory of becoming champions in the 2025–2026 season GPL (Gosinga Premier League).\n\nAdditionally, he lived and spent a significant period of time in Singapore.\n\nHe is renowned as an essential and inspiring figure in the club's sporting arena.",
    bioBn:
      "**রাসেল শুভ** বর্তমানে সাভারচালা শান্তি সংঘের সিনিয়র সহসভাপতি হিসেবে দায়িত্ব পালন করছেন। তিনি দীর্ঘদিন ধরে সংগঠনটির ক্রিকেট দলকে নেতৃত্ব দিয়ে আসছেন। তাঁর নেতৃত্ব ও দক্ষতায় ২০২৫–২০২৬ মৌসুমের জিপিএল (GPL)-এ সাভারচালা শান্তি সংঘ চ্যাম্পিয়ন হওয়ার গৌরব অর্জন করে।\n\nএছাড়াও, তিনি দীর্ঘদিন সিঙ্গাপুরে অবস্থান করেছেন এবং সেখানে সময় কাটিয়েছেন।\n\nতিনি সংগঠনের ক্রীড়াঙ্গনে একজন গুরুত্বপূর্ণ ব্যক্তিত্ব হিসেবে পরিচিত।",
    responsibilitiesEn: [
      "Leads and captains the club cricket squad, guiding them to the 2025–2026 GPL Championship",
      "Supervises ground preparations, sports logistics, and athlete coordination",
      "Coordinates executive subcommittees during the annual tournaments and SPL season",
      "Fosters engagement with community elders, patrons, and sports enthusiasts",
    ],
    responsibilitiesBn: [
      "ক্লাবের ক্রিকেট দলকে দীর্ঘকাল ধরে নেতৃত্ব প্রদান এবং ২০২৫–২০২৬ মৌসুমে জিপিএল (GPL) চ্যাম্পিয়ন শিরোপা অর্জন",
      "খেলার মাঠ প্রস্তুতকরণ, ক্রীড়া লজিস্টিকস এবং খেলোয়াড়দের কার্যকর সমন্বয় সাধন",
      "এসপিএল এবং বাৎসরিক টুর্নামেন্ট চলাকালে উপকমিটিসমূহের কাজ সরাসরি তদারকি",
      "এলাকার মুরব্বি, শুভানুধ্যায়ী ও ক্রীড়ামোদী মানুষের সাথে ক্লাবের সুসম্পর্ক বজায় রাখা",
    ],
    quoteEn: "True victory lies in disciplined teamwork and unwavering dedication on the field.",
    quoteBn: "মাঠের সঠিক শৃঙ্খলা এবং অবিচল দলীয় প্রচেষ্টাতেই লুকিয়ে থাকে বিজয়ের আসল গৌরব।",
    isKeyLeader: true,
  },
  {
    id: "ebi",
    slug: "ebi",
    alternateSlugs: ["ibrahim"],
    memberId: "SS-EXEC-004",
    nameEn: "Ibrahim",
    nameBn: "ইব্রাহীম",
    roleEn: "Vice President",
    roleBn: "সহ-সভাপতি",
    type: "committee",
    badgeEn: "🏛️ Executive Committee • Vice President",
    badgeBn: "🏛️ কার্যনির্বাহী পরিষদ • সহ-সভাপতি",
    image: "/images/committee/ebi.png",
    bloodGroup: "AB+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "Ibrahim is an esteemed Vice President of the club, actively involved in organizing cultural, social, and sporting gatherings throughout the year.",
    bioBn:
      "ইব্রাহীম শান্তি সংঘের অন্যতম সহ-সভাপতি। ক্লাবের সামাজিক, ক্রীড়া ও সাংস্কৃতিক কর্মসূচিতে তিনি দায়িত্বশীল ভূমিকা পালন করেন।",
    responsibilitiesEn: [
      "Assists in high-level decision making and organizational tasks",
      "Ensures discipline and fair play in all club activities",
    ],
    responsibilitiesBn: [
      "কার্যনির্বাহী কমিটির গুরুত্বপূর্ণ সিদ্ধান্ত গ্রহণ ও বাস্তবায়ন",
      "ক্লাবের সকল আয়োজনে শৃঙ্খলা ও সৌহার্দ্যপূর্ণ পরিবেশ বজায় রাখা",
    ],
  },
  {
    id: "shahin",
    slug: "shahin",
    alternateSlugs: ["shahin-alam", "shahin-alam-shuvo"],
    memberId: "SS-EXEC-005",
    nameEn: "Shahin Alam Shuvo",
    nameBn: "শাহিন আলম শুভ",
    roleEn: "Vice President",
    roleBn: "সহ-সভাপতি",
    type: "committee",
    badgeEn: "🏛️ Key Leader • Vice President",
    badgeBn: "🏛️ কার্যনির্বাহী পরিষদ • সহ-সভাপতি",
    image: "/images/committee/shahin.png",
    bloodGroup: "B+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "Shahin Alam Shuvo is a prominent Key Leader and Vice President. He plays an essential role in mobilizing resources, organizing tournaments, and championing local youth development.",
    bioBn:
      "শাহিন আলম শুভ ক্লাবের একজন শীর্ষ নেতৃত্ব এবং সহ-সভাপতি। টুর্নামেন্ট আয়োজন, তহবিল ব্যবস্থাপনা ও তরুণদের খেলাধুলায় সম্পৃক্ত করতে তিনি সামনে থেকে নেতৃত্ব দিয়ে থাকেন।",
    responsibilitiesEn: [
      "Oversees major tournament sponsorships and stakeholder partnerships",
      "Key decision maker in executive committee strategy and expansions",
      "Actively mentors club players and organizes practice clinics",
    ],
    responsibilitiesBn: [
      "টুর্নামেন্টের সার্বিক পৃষ্ঠপোষকতা ও পৃষ্ঠপোষকদের সাথে যোগাযোগ রক্ষা",
      "কার্যনির্বাহী কমিটির গুরুত্বপূর্ণ সিদ্ধান্ত ও উন্নয়ন কার্যক্রমে অংশ গ্রহণ",
      "ক্লাবের ক্রীড়াবিদদের নিয়মিত অনুশীলন ও দিকনির্দেশনা প্রদান",
    ],
    isKeyLeader: true,
  },
  {
    id: "mustakim",
    slug: "mustakim",
    alternateSlugs: ["mostakim"],
    memberId: "SS-EXEC-006",
    nameEn: "Mostakim",
    nameBn: "মোস্তাকিম",
    roleEn: "General Secretary",
    roleBn: "সাধারণ সম্পাদক",
    type: "committee",
    badgeEn: "🏛️ Key Leader • General Secretary",
    badgeBn: "🏛️ কার্যনির্বাহী পরিষদ • সাধারণ সম্পাদক",
    image: "/images/committee/mustakim.png",
    bloodGroup: "O+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "Mostakim is the General Secretary of Shavarchala Shanti Sangha. As the administrative powerhouse of the club, he manages daily executive affairs, secretarial correspondence, and inter-team communications.",
    bioBn:
      "মোস্তাকিম ক্লাবের সাধারণ সম্পাদক হিসেবে প্রশাসনিক ও সাংগঠনিক সকল কার্যক্রম দক্ষতার সাথে সমন্বয় করে চলেছেন। সভার কার্যবিবরণী, সদস্যদের তথ্য ও দৈনন্দিন পরিচালনা তাঁর নেতৃত্বেই পরিচালিত হয়।",
    responsibilitiesEn: [
      "Chief administrative officer responsible for day-to-day operations",
      "Maintains official club records, member registries, and meeting minutes",
      "Coordinates across secretariats for sports, finance, and publicity",
    ],
    responsibilitiesBn: [
      "ক্লাবের সার্বিক প্রশাসনিক কার্যক্রম ও দৈনন্দিন কর্মকাণ্ড পরিচালনা",
      "কার্যবিবরণী লিপিবদ্ধকরণ, সদস্য তালিকা ও আনুষ্ঠানিক নথিপত্র সংরক্ষণ",
      "ক্রীড়া, অর্থ ও প্রচারসহ সকল উইংয়ের সাথে সার্বক্ষণিক সমন্বয়সাধন",
    ],
    quoteEn: "Unity, dedication, and service are our greatest strengths.",
    quoteBn: "ঐক্য, একাগ্রতা ও নিঃস্বার্থ সেবাই আমাদের সংগঠনের সর্বশ্রেষ্ঠ শক্তি।",
    isKeyLeader: true,
  },
  {
    id: "emon",
    slug: "emon",
    alternateSlugs: ["anwar-hossain"],
    memberId: "SS-EXEC-007",
    nameEn: "Anwar Hossain",
    nameBn: "আনোয়ার হোসেন",
    roleEn: "Joint Secretary",
    roleBn: "যুগ্ম সাধারণ সম্পাদক",
    type: "committee",
    badgeEn: "🏛️ Key Leader • Joint Secretary",
    badgeBn: "🏛️ কার্যনির্বাহী পরিষদ • যুগ্ম সাধারণ সম্পাদক",
    image: "/images/committee/emon.png",
    bloodGroup: "A+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "Anwar Hossain (Emon) serves as Joint Secretary and is recognized as a key pillar in event management, field logistics, and community coordination.",
    bioBn:
      "আনোয়ার হোসেন (ইমন) যুগ্ম সাধারণ সম্পাদক হিসেবে দায়িত্ব পালন করছেন। মাঠের লজিস্টিকস, টুর্নামেন্ট বাস্তবায়ন ও এলাকার যুবসমাজকে সংঘবদ্ধ করতে তিনি নিবেদিতপ্রাণ।",
    responsibilitiesEn: [
      "Assists the General Secretary in executive and administrative execution",
      "Leads logistics and equipment arrangements for major sporting events",
      "Coordinates youth volunteer teams during community festivals",
    ],
    responsibilitiesBn: [
      "সাধারণ সম্পাদককে সার্বিক সাংগঠনিক কাজে সক্রিয়ভাবে সহায়তা প্রদান",
      "প্রধান টুর্নামেন্ট ও ক্রীড়া সামগ্রী ব্যবস্থাপনায় সরাসরি নেতৃত্ব প্রদান",
      "বাৎসরিক অনুষ্ঠানসমূহে তরুণ স্বেচ্ছাসেবক দল পরিচালনা",
    ],
    isKeyLeader: true,
  },
  {
    id: "sourav",
    slug: "sourav",
    alternateSlugs: ["sourav-prodhan", "rafioul-hasan"],
    memberId: "SS-EXEC-008",
    nameEn: "Sourav Prodhan",
    nameBn: "সৌরভ প্রধান",
    roleEn: "Joint Secretary & Tech Lead",
    roleBn: "যুগ্ম সাধারণ সম্পাদক ও টেক লিড",
    type: "committee",
    badgeEn: "💻 Lead Engineer • Joint Secretary",
    badgeBn: "💻 টেক লিড ও প্রকৌশলী • যুগ্ম সাধারণ সম্পাদক",
    image: "/images/committee/sourav.png",
    bloodGroup: "O+",
    joiningYear: "2017",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "**Sourav Prodhan** is currently serving as the Joint General Secretary of Shavarchala Shanti Sangha. Alongside this, he serves as the administrator of the organization's official Facebook page. In addition, he serves as the Lead Engineer of the Shavarchala Shanti Sangha website.\n\nIn his academic life, he completed his SSC in Science from Gosinga High School. Later, he completed a Diploma in Engineering in Computer Science and Technology (CST) from Mymensingh Polytechnic Institute.\n\nIn his professional career, he earned one year of experience working as a Backend Engineer at Betopia Group. Currently, he is working remotely as a Software Engineer at MaxValid.",
    bioBn:
      "**সৌরভ প্রধান** বর্তমানে সাভারচালা শান্তি সংঘের যুগ্ম সাধারণ সম্পাদকের দায়িত্ব পালন করছেন। পাশাপাশি তিনি সংগঠনটির অফিসিয়াল ফেসবুক পেজের অ্যাডমিন হিসেবে দায়িত্ব পালন করছেন। এছাড়াও, তিনি সাভারচালা শান্তি সংঘের ওয়েবসাইটের লিড ইঞ্জিনিয়ার হিসেবে দায়িত্ব পালন করছেন।\n\nশিক্ষাজীবনে তিনি গোসিঙ্গা হাই স্কুল (Gosinga High School) থেকে বিজ্ঞান বিভাগে এসএসসি সম্পন্ন করেন। পরবর্তীতে ময়মনসিংহ পলিটেকনিক ইনস্টিটিউট থেকে কম্পিউটার সায়েন্স অ্যান্ড টেকনোলজি (CST) বিষয়ে ডিপ্লোমা ইন ইঞ্জিনিয়ারিং সম্পন্ন করেন।\n\nপেশাগত জীবনে তিনি Betopia Group-এ ব্যাকএন্ড ইঞ্জিনিয়ার হিসেবে এক বছর কাজ করার অভিজ্ঞতা অর্জন করেছেন। বর্তমানে তিনি MaxValid-এ রিমোট ভিত্তিতে সফটওয়্যার ইঞ্জিনিয়ার হিসেবে কর্মরত রয়েছেন।",
    responsibilitiesEn: [
      "Lead architect and engineer of the club's modern bilingual digital platform",
      "Co-manages club executive tasks, administrative planning, and youth coordination",
      "Pioneered AI-driven interactive digital assistant and digital member registry",
      "Ensures club tech infrastructure and digital community archives are maintained",
    ],
    responsibilitiesBn: [
      "ক্লাবের আধুনিক দ্বিভাষিক ওয়েব প্ল্যাটফর্ম ও মেম্বার ডিরেক্টরি তৈরি ও পরিচালনা",
      "যুগ্ম সাধারণ সম্পাদক হিসেবে সাংগঠনিক পরিকল্পনা ও প্রশাসনিক কাজে নেতৃত্ব প্রদান",
      "ক্লাবের নিজস্ব এআই সহকারী ও ডিজিটাল রেকর্ড সংরক্ষণ ব্যবস্থার রূপদান",
      "তরুণ প্রজন্মকে তথ্যপ্রযুক্তি ও আধুনিক জ্ঞানে দক্ষ করে তুলতে উদ্যোগ গ্রহণ",
    ],
    quoteEn: "Empowering our club with technology to connect every brother, near and far.",
    quoteBn: "প্রযুক্তির শক্তিতে আমাদের ক্লাবকে সমৃদ্ধ করে দেশ ও প্রবাসের সকল ভাইকে এক সুতোয় বাঁধা।",
    isKeyLeader: true,
  },
  {
    id: "smoron",
    slug: "smoron",
    alternateSlugs: ["sakhaowat-hossain", "md-sakhaowat-hossain"],
    memberId: "SS-EXEC-009",
    nameEn: "Md. Sakhaowat Hossain",
    nameBn: "মোঃ সাখাওয়াৎ হোসেন",
    roleEn: "Organizing Secretary",
    roleBn: "সাংগঠনিক সম্পাদক",
    type: "committee",
    badgeEn: "🏛️ Executive Committee • Organizing Secretary",
    badgeBn: "🏛️ কার্যনির্বাহী পরিষদ • সাংগঠনিক সম্পাদক",
    image: "/images/committee/smoron.png",
    bloodGroup: "B+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "Md. Sakhaowat Hossain (Smoron) is the Organizing Secretary, responsible for membership mobilization, inter-ward coordination, and event structure.",
    bioBn:
      "মোঃ সাখাওয়াৎ হোসেন (স্মরণ) সাংগঠনিক সম্পাদক হিসেবে ক্লাবের অভ্যন্তরীণ ঐক্য ও মাঠপর্যায়ে বিভিন্ন টিম গঠনে অত্যন্ত সক্রিয় ভূমিকা পালন করেন।",
    responsibilitiesEn: [
      "Manages membership engagement, onboarding, and organizational discipline",
      "Coordinates squad formations and tournament schedules",
    ],
    responsibilitiesBn: [
      "নতুন সদস্য সংগ্রহ ও সাংগঠনিক ভিত্তি সুদৃঢ়করণ",
      "টুর্নামেন্টের দল গঠন ও সময়সূচী বাস্তবায়নে মাঠপর্যায়ে সমন্বয়",
    ],
  },
  {
    id: "sojol",
    slug: "sojol",
    alternateSlugs: ["lokman-hossain-sojol"],
    memberId: "SS-EXEC-010",
    nameEn: "Lokman Hossain Sojol",
    nameBn: "লোকমান হোসেন সজল",
    roleEn: "Organizing Secretary",
    roleBn: "সাংগঠনিক সম্পাদক",
    type: "committee",
    badgeEn: "🏛️ Executive Committee • Organizing Secretary",
    badgeBn: "🏛️ কার্যনির্বাহী পরিষদ • সাংগঠনিক সম্পাদক",
    image: "/images/committee/sojol.png",
    bloodGroup: "O+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "Lokman Hossain Sojol serves as Organizing Secretary, ensuring seamless coordination between the executive council and sports subcommittees.",
    bioBn:
      "লোকমান হোসেন সজল ক্লাবের সাংগঠনিক সম্পাদক। তিনি মাঠ ও ক্লাবের সার্বিক আয়োজনকে সুচারুভাবে সাজাতে দায়িত্বশীল ভূমিকা পালন করেন।",
    responsibilitiesEn: [
      "Coordinates event logistics, volunteers, and member outreach",
      "Maintains discipline and order during high-stakes championship games",
    ],
    responsibilitiesBn: [
      "কার্যক্রম বাস্তবায়নে স্বেচ্ছাসেবক দলের তদারকি ও সমন্বয়সাধন",
      "প্রতিযোগিতাপূর্ণ খেলা চলাকালে শৃঙ্খলা বজায় রাখা",
    ],
  },
  {
    id: "jihad",
    slug: "jihad",
    alternateSlugs: ["md-jehad"],
    memberId: "SS-EXEC-011",
    nameEn: "Md. Jehad",
    nameBn: "মোঃ জিহাদ",
    roleEn: "Cashier",
    roleBn: "কোষাধ্যক্ষ",
    type: "committee",
    badgeEn: "🏛️ Executive Committee • Cashier",
    badgeBn: "🏛️ কার্যনির্বাহী পরিষদ • কোষাধ্যক্ষ",
    image: "/images/committee/jihad.png",
    bloodGroup: "A+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "Md. Jehad manages the club's treasury as Cashier with transparency and diligence, keeping the club's budgets, tournament funds, and charitable contributions meticulously accounted for.",
    bioBn:
      "মোঃ জিহাদ কোষাধ্যক্ষ হিসেবে ক্লাবের আর্থিক শৃঙ্খলা ও হিসাব-নিকাশ অত্যন্ত নিষ্ঠা ও স্বচ্ছতার সাথে পরিচালনা করেন। টুর্নামেন্টের তহবিল ও ক্লাবের ব্যয়ের নিখুঁত হিসাব তিনি সংরক্ষণ করেন।",
    responsibilitiesEn: [
      "Maintains club accounts, tournament budgets, and financial ledger",
      "Prepares annual financial audits and statements for the executive committee",
      "Oversees entry fees, sponsorships, and charitable donations",
    ],
    responsibilitiesBn: [
      "ক্লাবের হিসাব-নিকাশ, বাজেট ও অর্থ লেনদেন স্বচ্ছতার সাথে পরিচালনা",
      "বার্ষিক আর্থিক বিবরণী ও নিরীক্ষা কার্যনির্বাহী পরিষদে উপস্থাপন",
      "টুর্নামেন্টের এন্ট্রি ফি ও আর্থিক অনুদান সংরক্ষণ",
    ],
  },
  {
    id: "hasib",
    slug: "hasib",
    alternateSlugs: ["hasibul-hasan"],
    memberId: "SS-EXEC-012",
    nameEn: "Hasibul Hasan",
    nameBn: "হাসিবুল হাসান",
    roleEn: "Sports Secretary",
    roleBn: "ক্রীড়া সম্পাদক",
    type: "committee",
    badgeEn: "⚽ Sports Secretariat • Secretary",
    badgeBn: "⚽ ক্রীড়া সম্পাদক • কার্যনির্বাহী পরিষদ",
    image: "/images/committee/hasib.png",
    bloodGroup: "B+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "Hasibul Hasan is the Sports Secretary, passionately driving the club's flagship football and cricket tournaments and developing competitive talent across Shavarchala.",
    bioBn:
      "হাসিবুল হাসান ক্লাবের ক্রীড়া সম্পাদক হিসেবে অত্যন্ত সুনামের সাথে দায়িত্ব পালন করছেন। এসপিএল ফুটবল ও ক্রিকেট টুর্নামেন্টসহ ক্লাবের সবধরনের ক্রীড়া আয়োজনের সফল রূপকার তিনি।",
    responsibilitiesEn: [
      "Plans and manages all competitive sporting events including SPL",
      "Coordinates match officials, referees, pitches, and equipment",
      "Discovers and nurtures emerging young athletic talents in the area",
    ],
    responsibilitiesBn: [
      "এসপিএল ফুটবল ও ক্রিকেটসহ সকল টুর্নামেন্টের সার্বিক পরিকল্পনা ও পরিচালনা",
      "ম্যাচ রেফারি, মাঠ ব্যবস্থাপনা ও মানসম্মত ক্রীড়া সামগ্রী নিশ্চিতকরণ",
      "এলাকার নতুন প্রতিভাবান খেলোয়াড়দের খুঁজে বের করে ক্লাবে সুযোগ করে দেওয়া",
    ],
    quoteEn: "Sports is the heart and soul of Shavarchala Shanti Sangha.",
    quoteBn: "খেলাধুলাই হলো সাভারচালা শান্তি সংঘের প্রাণ এবং আত্মার স্পন্দন।",
  },
  {
    id: "labib",
    slug: "labib",
    alternateSlugs: ["labib-hasan"],
    memberId: "SS-EXEC-013",
    nameEn: "Labib Hasan",
    nameBn: "লাবিব হাসান",
    roleEn: "Sports Secretary",
    roleBn: "ক্রীড়া সম্পাদক",
    type: "committee",
    badgeEn: "🏏 Sports Secretariat • Secretary",
    badgeBn: "🏏 ক্রীড়া সম্পাদক • কার্যনির্বাহী পরিষদ",
    image: "/images/committee/labib.png",
    bloodGroup: "AB+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "Labib Hasan serves alongside the sports secretariat as Sports Secretary, organizing winter sports, badminton tournaments, and regular team practice sessions.",
    bioBn:
      "লাবিব হাসান ক্রীড়া সম্পাদক হিসেবে শীতকালীন টুর্নামেন্ট, ব্যাডমিন্টন ও নিয়মিত ক্লাব প্র্যাকটিস পরিচালনায় নিবেদিতভাবে কাজ করেন।",
    responsibilitiesEn: [
      "Co-leads the sports portfolio for winter and summer championships",
      "Manages club sporting fixtures and practice grounds",
    ],
    responsibilitiesBn: [
      "গ্রীষ্ম ও শীতকালীন ক্রীড়া প্রতিযোগিতার সূচি ও ম্যাচ পরিচালনা",
      "ক্লাবের খেলার সরঞ্জাম ও মাঠের সার্বিক সুস্থ পরিবেশ বজায় রাখা",
    ],
  },
  {
    id: "himel",
    slug: "himel",
    alternateSlugs: ["sh-himel-siam", "himel-siam"],
    memberId: "SS-EXEC-014",
    nameEn: "SH Himel Siam",
    nameBn: "এস এইচ হিমেল সিয়াম",
    roleEn: "ICT Secretary",
    roleBn: "তথ্য ও যোগাযোগ প্রযুক্তি সম্পাদক",
    type: "committee",
    badgeEn: "📱 Key Leader • ICT Secretary",
    badgeBn: "📱 তথ্য ও প্রযুক্তি সম্পাদক • কার্যনির্বাহী পরিষদ",
    image: "/images/committee/himel.png",
    bloodGroup: "O+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "SH Himel Siam is the ICT Secretary and Key Leader, managing digital media communications, tournament broadcasts, live scorekeeping, and tech integrations.",
    bioBn:
      "এস এইচ হিমেল সিয়াম ক্লাবের তথ্য ও যোগাযোগ প্রযুক্তি সম্পাদক। টুর্নামেন্টের ডিজিটাল প্রচার, লাইভ স্কোরিং, গ্রাফিক্স ও সোশ্যাল মিডিয়া কমিউনিকেশনে তিনি সামনে থেকে নেতৃত্ব দিয়ে থাকেন।",
    responsibilitiesEn: [
      "Leads tournament live streaming, graphics, and official social media coverage",
      "Coordinates digital registrations for tournament players and club members",
      "Assists in maintaining official club tech communications",
    ],
    responsibilitiesBn: [
      "টুর্নামেন্টের ডিজিটাল কভারেজ, গ্রাফিক্স ডিজাইন ও সোশ্যাল মিডিয়া প্রচারণা",
      "খেলোয়াড়দের ডিজিটাল নিবন্ধন ও ম্যাচ সংক্রান্ত তথ্য দ্রুত প্রকাশ",
      "ক্লাবের তথ্য ও প্রযুক্তি সংশ্লিষ্ট আধুনিক উদ্যোগে সক্রিয় ভূমিকা পালন",
    ],
    isKeyLeader: true,
  },
  {
    id: "sohan",
    slug: "sohan",
    alternateSlugs: ["sohan-khan"],
    memberId: "SS-EXEC-015",
    nameEn: "Sohan Khan",
    nameBn: "সোহান খান",
    roleEn: "Publicity Secretary",
    roleBn: "প্রচার সম্পাদক",
    type: "committee",
    badgeEn: "📢 Executive Committee • Publicity Secretary",
    badgeBn: "📢 প্রচার সম্পাদক • কার্যনির্বাহী পরিষদ",
    image: "/images/committee/sohan.png",
    bloodGroup: "B+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "Sohan Khan leads the publicity portfolio as Publicity Secretary, ensuring wide awareness of club tournaments, cultural celebrations, and community initiatives.",
    bioBn:
      "সোহান খান প্রচার সম্পাদক হিসেবে ক্লাবের প্রতিটি ইভেন্ট, টুর্নামেন্ট ও সামাজিক উদ্যোগের ব্যানার, মাইকিং ও প্রচারণা সফলভাবে সম্পন্ন করেন।",
    responsibilitiesEn: [
      "Designs and distributes official event posters, banners, and announcements",
      "Coordinates publicity campaigns across surrounding villages",
    ],
    responsibilitiesBn: [
      "টুর্নামেন্ট ও ক্লাবের সকল আয়োজনের ব্যানার, পোস্টার ও মাইকিং ব্যবস্থাপনা",
      "সাভারচালা ও আশপাশের এলাকায় ক্লাবের সুনাম ও ইতিবাচক প্রচারণা বৃদ্ধি",
    ],
  },
  {
    id: "emran",
    slug: "emran",
    alternateSlugs: ["imran"],
    memberId: "SS-EXEC-016",
    nameEn: "Imran",
    nameBn: "ইমরান",
    roleEn: "Religious Affairs Secretary",
    roleBn: "ধর্ম বিষয়ক সম্পাদক",
    type: "committee",
    badgeEn: "🕌 Executive Committee • Religious Affairs Secretary",
    badgeBn: "🕌 ধর্ম বিষয়ক সম্পাদক • কার্যনির্বাহী পরিষদ",
    image: "/images/committee/emran.png",
    bloodGroup: "A+",
    joiningYear: "2007",
    villageEn: "Shavarchala",
    villageBn: "সাভারচালা",
    bioEn:
      "Imran is the Religious Affairs Secretary, overseeing the club's spiritual events including the landmark Annual Waz Mahfil, charity drives, and Islamic welfare projects.",
    bioBn:
      "ইমরান ক্লাবের ধর্ম বিষয়ক সম্পাদক। শান্তি সংঘের অন্যতম প্রধান বাৎসরিক কর্মসূচি 'ওয়াজ মাহফিল' পরিচালনা, ইফতার মাহফিল ও ধর্মীয় সম্প্রীতি রক্ষায় তিনি অগ্রণী ভূমিকা রাখেন।",
    responsibilitiesEn: [
      "Chief coordinator for the prestigious Annual Waz Mahfil event",
      "Organizes annual community Ramadan iftar gatherings and welfare distribution",
    ],
    responsibilitiesBn: [
      "ঐতিহ্যবাহী বাৎসরিক ওয়াজ মাহফিল আয়োজক কমিটির প্রধান সমন্বয়ক",
      "পবিত্র মাহে রমজানে ইফতার মাহফিল ও দুস্থদের মাঝে সহায়তা কার্যক্রম পরিচালনা",
    ],
  },
];

// Lookup by slug or id or alternate slug
export function getPersonBySlug(slug: string): PersonDetail | undefined {
  const normalized = slug.toLowerCase().trim().replace(/[-_]/g, "");
  return allPeople.find((p) => {
    if (p.id.toLowerCase().replace(/[-_]/g, "") === normalized) return true;
    if (p.slug.toLowerCase().replace(/[-_]/g, "") === normalized) return true;
    if (
      p.alternateSlugs?.some(
        (alt) => alt.toLowerCase().replace(/[-_]/g, "") === normalized
      )
    ) {
      return true;
    }
    return false;
  });
}

// All slugs for static generation
export function getAllPersonSlugs(): string[] {
  const slugs: string[] = [];
  allPeople.forEach((p) => {
    slugs.push(p.slug);
    if (p.id !== p.slug) slugs.push(p.id);
  });
  return Array.from(new Set(slugs));
}

