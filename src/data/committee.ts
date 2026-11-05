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
    nameEn: "Mahfojor Rahman",
    nameBn: "মাহফুজুর রহমান",
    roleEn: "President",
    roleBn: "সভাপতি",
    image: "/images/committee/mahfuz.png",
  },
  {
    id: "rakib",
    nameEn: "Rakib Hasan",
    nameBn: "রাকিব হাসান",
    roleEn: "Senior Vice President",
    roleBn: "সিনিয়র সহ-সভাপতি",
    image: "/images/committee/rakib.png",
  },
  {
    id: "rasel",
    nameEn: "Rasel shuvo",
    nameBn: "রাসেল শুভ",
    roleEn: "Senior Vice President",
    roleBn: "সিনিয়র সহ-সভাপতি",
    image: "/images/committee/rasel.png",
  },
  {
    id: "ebi",
    nameEn: "Ibrahim",
    nameBn: "ইব্রাহীম",
    roleEn: "Vice President",
    roleBn: "সহ-সভাপতি",
    image: "/images/committee/ebi.jpeg",
  },
  {
    id: "shahin",
    nameEn: "Shahin Alam Shuvo",
    nameBn: "শাহিন আলম শুভ",
    roleEn: "Vice President",
    roleBn: "সহ-সভাপতি",
    image: "/images/committee/shahin.jpeg",
    isKeyLeader: true,
  },
  {
    id: "mustakim",
    nameEn: "Mostakim",
    nameBn: "মোস্তাকিম",
    roleEn: "General Secretary",
    roleBn: "সাধারণ সম্পাদক",
    image: "/images/committee/mustakim.jpeg",
  },
  {
    id: "emon",
    nameEn: "Anwar Hossain",
    nameBn: "আনোয়ার হোসেন",
    roleEn: "Joint Secretary",
    roleBn: "যুগ্ম সাধারণ সম্পাদক",
    image: "/images/committee/emon.png",
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
    nameEn: "Md. Jehad",
    nameBn: "মোঃ জিহাদ",
    roleEn: "Cashier",
    roleBn: "কোষাধ্যক্ষ",
    image: "/images/committee/jihad.png",
  },
  {
    id: "hasib",
    nameEn: "Hasibul Hasan",
    nameBn: "হাসিবুল হাসান",
    roleEn: "Sports Secretary",
    roleBn: "ক্রীড়া সম্পাদক",
    image: "/images/committee/hasib.png",
  },
  {
    id: "labib",
    nameEn: "Labib Hasan",
    nameBn: "লাবিব হাসান",
    roleEn: "Sports Secretary",
    roleBn: "ক্রীড়া সম্পাদক",
    image: "/images/committee/labib.png",
  },
  {
    id: "smoron",
    nameEn: "Md. Sakhaowat Hossain",
    nameBn: "মোঃ সাখাওয়াৎ হোসেন",
    roleEn: "Organizing Secretary",
    roleBn: "সাংগঠনিক সম্পাদক",
    image: "/images/committee/smoron.png",
  },
  {
    id: "sojol",
    nameEn: "Lokman Hossain Sojol",
    nameBn: "লোকমান হোসেন সজল",
    roleEn: "Organizing Secretary",
    roleBn: "সাংগঠনিক সম্পাদক",
    image: "/images/committee/sojol.png",
  },
  {
    id: "himel",
    nameEn: "SH Himel Siam",
    nameBn: "এস এইচ হিমেল সিয়াম",
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
    image: "/images/committee/sohan.png",
  },
  {
    id: "emran",
    nameEn: "Imran",
    nameBn: "ইমরান",
    roleEn: "Religious Affairs Secretary",
    roleBn: "ধর্ম বিষয়ক সম্পাদক",
    image: "/images/committee/emran.jpeg",
  },
];
