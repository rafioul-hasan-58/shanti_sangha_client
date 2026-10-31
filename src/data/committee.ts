export interface CommitteeMember {
  id: string;
  nameEn: string;
  nameBn: string;
  roleEn: string;
  roleBn: string;
  image: string;
  isKeyLeader?: boolean;
}

export const committeeMembers: CommitteeMember[] = [
  {
    id: "mahfuz",
    nameEn: "Mahfozor Rahman",
    nameBn: "মাহফুজুর রহমান",
    roleEn: "President",
    roleBn: "সভাপতি",
    image: "/images/committee/mahfuz.jpeg",
  },
  {
    id: "rakib",
    nameEn: "Md. Rakeb",
    nameBn: "মোঃ রাকিব",
    roleEn: "Senior Vice President",
    roleBn: "সিনিয়র সহ-সভাপতি",
    image: "/images/committee/rakib.jpeg",
  },
  {
    id: "rasel",
    nameEn: "Rasel shuvo",
    nameBn: "রাসেল শুভ",
    roleEn: "Senior Vice President",
    roleBn: "সিনিয়র সহ-সভাপতি",
    image: "/images/committee/rasel.jpeg",
  },
  {
    id: "ebi",
    nameEn: "Ibrahim Fakir",
    nameBn: "ইব্রাহিম ফকির",
    roleEn: "Vice President",
    roleBn: "সহ-সভাপতি",
    image: "/images/committee/ebi.jpeg",
  },
  {
    id: "shahin",
    nameEn: "Shahin alam shuvo",
    nameBn: "শাহীন আলম শুভ",
    roleEn: "Vice President",
    roleBn: "সহ-সভাপতি",
    image: "/images/committee/shahin.jpeg",
    isKeyLeader: true,
  },
  {
    id: "mustakim",
    nameEn: "Md. Mustakim",
    nameBn: "মোঃ মুস্তাকিম",
    roleEn: "General Secretary",
    roleBn: "সাধারণ সম্পাদক",
    image: "/images/committee/mustakim.jpeg",
  },
  {
    id: "emon",
    nameEn: "DS.Emon",
    nameBn: "ডি.এস. ইমন",
    roleEn: "Joint Secretary",
    roleBn: "যুগ্ম সাধারণ সম্পাদক",
    image: "/images/committee/emon.jpeg",
    isKeyLeader: true,
  },
  {
    id: "sourav",
    nameEn: "Sourav Prodhan",
    nameBn: "সৌরভ প্রধান",
    roleEn: "Joint Secretary",
    roleBn: "যুগ্ম সাধারণ সম্পাদক",
    image: "/images/committee/sourav.png",
    isKeyLeader: true,
  },
  {
    id: "jihad",
    nameEn: "Md. Jihad",
    nameBn: "মোঃ জিহাদ",
    roleEn: "Cashier",
    roleBn: "কোষাধ্যক্ষ",
    image: "/images/committee/jihad.jpeg",
  },
  {
    id: "hasib",
    nameEn: "Hasibul Hasan",
    nameBn: "হাসিবুল হাসান",
    roleEn: "Sports Secretary",
    roleBn: "ক্রীড়া সম্পাদক",
    image: "/images/committee/hasib.jpeg",
  },

  {
    id: "labib",
    nameEn: "Md. Labib",
    nameBn: "মোঃ লাবিব",
    roleEn: "Sports Secretary",
    roleBn: "ক্রীড়া সম্পাদক",
    image: "/images/committee/labib.jpeg",
  },
  {
    id: "smoron",
    nameEn: "Shakhawat smoron",
    nameBn: "শাখাওয়াত স্মরণ",
    roleEn: "Organizing Secretary",
    roleBn: "সাংগঠনিক সম্পাদক",
    image: "/images/committee/smoron.jpeg",
  },
  {
    id: "sojol",
    nameEn: "Lokman Hossain Sojol",
    nameBn: "লোকমান হোসেন সজল",
    roleEn: "Organizing Secretary",
    roleBn: "সাংগঠনিক সম্পাদক",
    image: "/images/committee/sojol.jpeg",
  },
  {
    id: "himel",
    nameEn: "SH Himel siam",
    nameBn: "এস.এইচ. হিমেল সিয়াম",
    roleEn: "ICT Secretary",
    roleBn: "তথ্য ও যোগাযোগ প্রযুক্তি সম্পাদক",
    image: "/images/committee/himel.jpeg",
    isKeyLeader: true,
  },

  {
    id: "sohan",
    nameEn: "Sohan Khan",
    nameBn: "সোহান খান",
    roleEn: "Publicity Secretary",
    roleBn: "প্রচার সম্পাদক",
    image: "/images/committee/sohan.jpeg",
  },

  {
    id: "emran",
    nameEn: "Md. Emran",
    nameBn: "মোঃ এমরান",
    roleEn: "Religious Affairs Secretary",
    roleBn: "ধর্ম বিষয়ক সম্পাদক",
    image: "/images/committee/emran.jpeg",
  },

];
