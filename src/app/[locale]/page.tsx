import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import HeroCarousel from "@/components/home/HeroCarousel";
import AboutSection from "@/components/home/AboutSection";
import PioneersSection from "@/components/home/PioneersSection";
import CommitteeSection from "@/components/home/CommitteeSection";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);


  return (
    <>
      <HeroCarousel dict={dict.hero} />
      {/* Sports Section */}
      <section id="sports" className="mx-auto max-w-6xl px-4 pt-16 scroll-mt-20">
        <div>
          <span className="inline-block bg-[#006a4e]/10 text-[#006a4e] text-xs font-extrabold uppercase px-3 py-1 rounded-sm tracking-widest border border-[#006a4e]/20">
            {locale === "bn" ? "আমাদের খেলাধুলা" : "OUR SPORTS & ACTIVITIES"}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-pitch mt-2">
            {dict.sections.sportsTitle}
          </h2>
        </div>
        <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {dict.sections.sports.map((s, idx) => {
            const icons = ["⚽", "🏏", "🏐", "🏸"];
            return (
              <div
                key={s.name}
                className="group rounded-2xl border border-brand-200/80 bg-white p-3.5 sm:p-5 md:p-6 shadow-sm hover:shadow-md hover:border-[#006a4e]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-xl sm:text-2xl mb-2.5 sm:mb-4 group-hover:scale-110 transition-transform">
                    {icons[idx] || "🏆"}
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-pitch leading-snug">{s.name}</h3>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-brand-700 leading-relaxed font-sans">{s.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <AboutSection locale={locale} />

      {/* Pioneer of Peace (Former Presidents) Section */}
      <PioneersSection locale={locale} />

      {/* Committee (Comette) Section */}
      <CommitteeSection locale={locale} />

      {/* SPL & Annual Arrangements Section */}
      <section id="spl" className="mx-auto max-w-6xl px-4 pt-16 scroll-mt-20">
        <div className="rounded-3xl bg-[#006a4e] text-white p-6 sm:p-10 shadow-md border-b-4 border-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/20">
            <div>
              <span className="inline-block bg-white text-[#006a4e] text-xs font-extrabold uppercase px-3 py-1 rounded-sm tracking-wider">
                {locale === "bn" ? "১৯+ বছরের ঐতিহ্যবাহী আয়োজন" : "19+ YEARS OF HERITAGE EVENTS"}
              </span>

              <h2 className="font-display text-2xl sm:text-3xl font-extrabold mt-3">
                {locale === "bn" ? "এসপিএল ও আমাদের বাৎসরিক ৩টি প্রধান আয়োজন" : "SPL & Our 3 Signature Annual Events"}
              </h2>

              <p className="mt-2 text-white/90 max-w-2xl text-sm sm:text-base leading-relaxed font-sans">
                {locale === "bn"
                  ? "সাভারচালা শান্তি সংঘ বিগত ১৯+ বছর ধরে প্রতি বছর নিয়মিত ৩টি প্রধান বাৎসরিক কর্মসূচি উৎসবমুখর পরিবেশে আয়োজন করে থাকে — এসপিএল (SPL), বাৎসরিক ক্রীড়া প্রতিযোগিতা এবং বাৎসরিক ওয়াজ মাহফিল।"
                  : "For over 19+ years, Shavarchala Shanti Sangha has consistently organized 3 signature annual programs — the SPL Premier League, the Annual Sports Program, and the Annual Waz Mahfil."}
              </p>
            </div>

            <div className="shrink-0">
              <span className="inline-block px-5 py-2.5 bg-white text-[#006a4e] font-extrabold text-xs sm:text-sm uppercase rounded shadow-sm tracking-wider">
                {locale === "bn" ? "১৯+ বছর উদযাপিত" : "19+ Years Celebrated"}
              </span>
            </div>
          </div>

          {/* 3 Signature Event Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            {/* 1. SPL */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-xs p-5 border border-white/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-white text-[#006a4e] text-xs font-black">
                    {locale === "bn" ? "১" : "1"}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-white/70 font-bold">
                    {locale === "bn" ? "প্রিমিয়ার লিগ" : "Premier League"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {locale === "bn" ? "এসপিএল (SPL)" : "SPL Premier League"}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-white/85 leading-relaxed">
                  {locale === "bn"
                    ? "শান্তি সংঘের সবচেয়ে রোমাঞ্চকর টুর্নামেন্ট। গ্রীষ্মকালে ফুটবল এবং শীতকালে প্রিমিয়ার ক্রিকেট টুর্নামেন্টে বিভিন্ন এলাকার দল অংশগ্রহণ করে।"
                    : "Shanti Sangha's premier sporting event. Featuring exciting summer football and winter cricket tournaments with enthusiastic local teams."}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-white/90">
                <span>{locale === "bn" ? "ফুটবল ও ক্রিকেট" : "Football & Cricket"}</span>
                <span className="text-[#a7f3d0]">⚽ 🏏</span>
              </div>
            </div>

            {/* 2. Annual Sports */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-xs p-5 border border-white/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-white text-[#006a4e] text-xs font-black">
                    {locale === "bn" ? "২" : "2"}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-white/70 font-bold">
                    {locale === "bn" ? "ক্রীড়া প্রতিযোগিতা" : "Sports Competition"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {locale === "bn" ? "বাৎসরিক ক্রীড়া প্রতিযোগিতা" : "Annual Sports Program"}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-white/85 leading-relaxed">
                  {locale === "bn"
                    ? "গ্রামের শিশু, কিশোর, তরুণ ও প্রবীণ সহ সব বয়সের মানুষের অংশগ্রহণে অনুষ্ঠিত হয় বার্ষিক অ্যাথলেটিক্স, দৌড়, যেমন-খুশি-তেমন-সাজো ও ঐতিহ্যবাহী খেলা।"
                    : "A community festival of athletics, sprints, fun contests, and traditional sports bringing together children, youth, and elders alike."}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-white/90">
                <span>{locale === "bn" ? "সার্বজনীন মিলনমেলা" : "Community Festival"}</span>
                <span className="text-[#a7f3d0]">🏆 🏃‍♂️</span>
              </div>
            </div>

            {/* 3. Waz Mahfil */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-xs p-5 border border-white/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-white text-[#006a4e] text-xs font-black">
                    {locale === "bn" ? "৩" : "3"}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-white/70 font-bold">
                    {locale === "bn" ? "ধর্মীয় ও নৈতিক" : "Spiritual & Moral"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {locale === "bn" ? "বাৎসরিক ওয়াজ মাহফিল" : "Annual Waz Mahfil"}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-white/85 leading-relaxed">
                  {locale === "bn"
                    ? "এলাকায় ধর্মীয় সম্প্রীতি, নৈতিক শিক্ষা, শান্তি ও যুবসমাজকে সঠিক পথে উদ্বুদ্ধ করতে প্রতি বছর প্রখ্যাত আলেমদের উপস্থিতিতে ওয়াজ মাহফিল অনুষ্ঠিত হয়।"
                    : "An inspirational annual spiritual gathering with esteemed Islamic scholars to promote faith, moral values, youth guidance, and community peace."}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-white/90">
                <span>{locale === "bn" ? "নৈতিকতা ও শান্তি" : "Values & Peace"}</span>
                <span className="text-[#a7f3d0]">🕌 📖</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
