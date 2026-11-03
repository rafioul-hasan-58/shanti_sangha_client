import Image from "next/image";
import type { Locale } from "@/i18n/config";

interface PioneerLeader {
  id: string;
  nameBn: string;
  nameEn: string;
  roleBn: string;
  roleEn: string;
  image: string;
  badgeBn: string;
  badgeEn: string;
  isTop?: boolean;
  tributeBn: string;
  tributeEn: string;
}

export default function PioneersSection({ locale }: { locale: Locale }) {
  const isBn = locale === "bn";

  // Top Line Leader
  const topLeader: PioneerLeader = {
    id: "harun",
    nameBn: "হারুন শেখ",
    nameEn: "Harun Sheikh",
    roleBn: "প্রতিষ্ঠাতা সভাপতি",
    roleEn: "Founder President",
    image: "/images/formar_president/harun.png",
    badgeBn: "👑 প্রতিষ্ঠাতা সভাপতি",
    badgeEn: "👑 Founder President",
    isTop: true,
    tributeBn:
      "সাভারচালা শান্তি সংঘের সূচনা ও সমৃদ্ধির পথে দিকনির্দেশনামূলক নেতৃত্ব ও সম্প্রীতির সুদৃঢ় ভিত্তি গড়ে দেওয়ার জন্য আমরা চিরকৃতজ্ঞ।",
    tributeEn:
      "Forever honored for his guiding leadership, steadfast commitment to harmony, and building the foundation of Shavarchala Shanti Sangha.",
  };

  // Next Line: Next Two Leaders
  const secondLineLeaders: PioneerLeader[] = [
    {
      id: "tk_roman",
      nameBn: "তানভীর খোরশেদ রোমান",
      nameEn: "Tanvir Khorshed Roman",
      roleBn: "সাবেক সভাপতি",
      roleEn: "Former President",
      image: "/images/formar_president/tk_roman.png",
      badgeBn: "🕊️ শান্তির অগ্রদূত",
      badgeEn: "🕊️ Pioneer of Peace",
      tributeBn:
        "ঐক্য, তারুণ্যের উদ্দীপনা ও সামাজিক দায়বদ্ধতা সুদৃঢ় করার ক্ষেত্রে অসামান্য অবদানের শ্রদ্ধেয় পথপ্রদর্শক।",
      tributeEn:
        "A revered pioneer whose inspiring dedication deepened the club's fraternal bond, athletic spirit, and social leadership.",
    },
    {
      id: "lutfor",
      nameBn: "লুৎফর রহমান",
      nameEn: "Lutfor Rahman",
      roleBn: "সাবেক সভাপতি",
      roleEn: "Former President",
      image: "/images/formar_president/lutfor.png",
      badgeBn: "🕊️ শান্তির অগ্রদূত",
      badgeEn: "🕊️ Pioneer of Peace",
      tributeBn:
        "শান্তি, শৃঙ্খলা ও সুস্থ ক্রীড়া চর্চার মাধ্যমে এলাকার তরুণদের ভ্রাতৃত্বের বন্ধনে আবদ্ধ করার এক অবিস্মরণীয় কান্ডারী।",
      tributeEn:
        "An unforgettable stalwart who united local youth in brotherhood through sportsmanship, discipline, and community peace.",
    },

  ];

  return (
    <section id="pioneer-of-peace" className="mx-auto max-w-6xl px-4 pt-16 scroll-mt-20">
      {/* Decorative Container */}
      <div className="rounded-3xl bg-gradient-to-b from-white via-white to-brand-50/50 border border-brand-200/90 p-4 sm:p-8 md:p-12 shadow-sm relative overflow-hidden">
        {/* Subtle Ambient Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#006a4e]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#006a4e]/10 text-[#006a4e] text-xs font-extrabold uppercase px-3.5 py-1.5 rounded-full tracking-widest border border-[#006a4e]/20 shadow-2xs">
            <span>🕊️</span>
            <span>{isBn ? "শান্তির অগ্রদূত" : "PIONEER OF PEACE"}</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-pitch tracking-tight">
            {isBn ? "শান্তির অগ্রদূত" : "Pioneer of Peace"}
          </h2>

          <p className="text-xs sm:text-base text-brand-700/90 leading-relaxed font-sans max-w-2xl mx-auto">
            {isBn
              ? "সাভারচালা শান্তি সংঘের গৌরবময় পথচলায় যে সকল শ্রদ্ধেয় প্রাক্তন সভাপতি শান্তি, সৌহার্দ্য ও ঐক্যের আলোকবর্তিকা জ্বালিয়ে গেছেন।"
              : "Honoring our esteemed former presidents who ignited the torch of peace, unity, and brotherhood across generations of Shavarchala Shanti Sangha."}
          </p>

          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="h-0.5 w-12 bg-gradient-to-r from-transparent to-[#006a4e]/40 rounded-full" />
            <span className="text-amber-500 text-sm">✦</span>
            <span className="h-0.5 w-12 bg-gradient-to-l from-transparent to-[#006a4e]/40 rounded-full" />
          </div>
        </div>

        {/* TOP LINE: Harun in first line (Centered Featured Card) */}
        <div className="max-w-xl sm:max-w-2xl mx-auto mb-6 sm:mb-10 relative z-10">
          <div
            className="group rounded-2xl sm:rounded-3xl pioneer-card border border-brand-200/90 hover:border-[#006a4e] p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col sm:flex-row items-center gap-5 sm:gap-8 relative overflow-hidden"
            style={{ backgroundColor: "var(--pioneer-card-bg, #ffffff)" }}
          >
            {/* Corner Emblem */}
            <div className="absolute -top-6 -right-6 text-[#006a4e]/10 text-8xl pointer-events-none select-none font-serif">
              👑
            </div>

            {/* Photo Column */}
            <div className="relative shrink-0">
              <div
                className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-2xl overflow-hidden ring-4 ring-[#006a4e]/20 group-hover:ring-[#006a4e] group-hover:scale-105 transition-all duration-500 shadow-md pioneer-photo-frame bg-[#d5eedd]"
                style={{ backgroundColor: "var(--pioneer-photo-bg, #d5eedd)" }}
              >
                <Image
                  src={topLeader.image}
                  alt={isBn ? topLeader.nameBn : topLeader.nameEn}
                  fill
                  unoptimized
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Status Badge */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#006a4e] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md border border-white/60">
                {isBn ? topLeader.roleBn : topLeader.roleEn}
              </div>
            </div>

            {/* Details Column */}
            <div className="text-center sm:text-left flex-1 space-y-2 sm:space-y-2.5">
              <span className="inline-block text-[10px] sm:text-[11px] font-bold text-[#006a4e] bg-brand-50 border border-brand-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {isBn ? topLeader.badgeBn : topLeader.badgeEn}
              </span>

              <div>
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-pitch group-hover:text-[#006a4e] transition-colors">
                  {isBn ? topLeader.nameBn : topLeader.nameEn}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#006a4e] uppercase tracking-wider mt-0.5">
                  {isBn ? "সাভারচালা শান্তি সংঘ" : "Shavarchala Shanti Sangha"}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-brand-700 leading-relaxed font-sans italic pt-1">
                "{isBn ? topLeader.tributeBn : topLeader.tributeEn}"
              </p>
            </div>
          </div>
        </div>

        {/* SECOND LINE: Rest of the Cards in One Line (2 Cards in One Line on Mobile & Desktop) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8 max-w-4xl mx-auto relative z-10">
          {secondLineLeaders.map((leader) => {
            const name = isBn ? leader.nameBn : leader.nameEn;
            const role = isBn ? leader.roleBn : leader.roleEn;
            const badge = isBn ? leader.badgeBn : leader.badgeEn;
            const tribute = isBn ? leader.tributeBn : leader.tributeEn;

            return (
              <div
                key={leader.id}
                className="group rounded-2xl sm:rounded-3xl pioneer-card border border-brand-200/90 hover:border-[#006a4e] p-3.5 sm:p-5 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
                style={{ backgroundColor: "var(--pioneer-card-bg, #ffffff)" }}
              >
                {/* Badge */}
                <div className="mb-2 sm:mb-4">
                  <span className="inline-block text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#006a4e] bg-brand-50 border border-brand-200/80 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider">
                    {badge}
                  </span>
                </div>

                {/* Photo */}
                <div
                  className="relative w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-xl sm:rounded-2xl overflow-hidden mb-2.5 sm:mb-4 ring-2 sm:ring-4 ring-[#006a4e]/20 group-hover:ring-[#006a4e] group-hover:scale-105 transition-all duration-500 shadow-md pioneer-photo-frame bg-[#d5eedd] shrink-0"
                  style={{ backgroundColor: "var(--pioneer-photo-bg, #d5eedd)" }}
                >
                  <Image
                    src={leader.image}
                    alt={name}
                    fill
                    unoptimized
                    className="object-cover object-top"
                  />
                </div>

                {/* Name & Role */}
                <h3 className="font-display text-sm sm:text-xl md:text-2xl font-bold text-pitch group-hover:text-[#006a4e] transition-colors leading-tight line-clamp-2">
                  {name}
                </h3>
                <p className="text-[10px] sm:text-xs font-bold text-[#006a4e] uppercase tracking-wider mt-0.5 sm:mt-1">
                  {role}
                </p>
                <p className="text-[9px] sm:text-[11px] text-brand-500 font-medium">
                  {isBn ? "সাভারচালা শান্তি সংঘ" : "Shavarchala Shanti Sangha"}
                </p>

                {/* Tribute Text */}
                <p className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-brand-100 text-[10px] sm:text-xs text-brand-700/90 leading-relaxed font-sans italic line-clamp-3 sm:line-clamp-none">
                  "{tribute}"
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

