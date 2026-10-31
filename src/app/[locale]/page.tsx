import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import HeroCarousel from "@/components/home/HeroCarousel";
import AboutSection from "@/components/home/AboutSection";
import CommitteeSection from "@/components/home/CommitteeSection";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  

  return (
    <>
      <HeroCarousel dict={dict.hero} />

      {/* About Section */}
      <AboutSection locale={locale} />

      {/* Sports Section */}
      <section id="sports" className="mx-auto max-w-6xl px-4 pt-16 scroll-mt-20">
        <h2 className="font-display text-3xl font-bold">{dict.sections.sportsTitle}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dict.sections.sports.map((s) => (
            <div key={s.name} className="rounded-lg border border-brand-200 bg-white p-5 shadow-xs">
              <h3 className="text-lg font-semibold text-brand-800">{s.name}</h3>
              <p className="mt-2 text-sm text-brand-700">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

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

      {/* Committee (Comette) Section */}
      <CommitteeSection locale={locale} />

      {/* Gallery Section */}
      <section id="gallery" className="mx-auto max-w-6xl px-4 py-16 scroll-mt-20">
        <h2 className="font-display text-3xl font-bold text-pitch">
          {locale === "bn" ? "ফটো গ্যালারি" : "Photo Gallery"}
        </h2>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="aspect-video bg-gradient-to-br from-brand-700 to-pitch rounded-xl flex items-center justify-center p-4 text-center text-white/80 border border-brand-600/30 shadow-xs"
            >
              <div className="flex flex-col items-center gap-2">
                <svg className="w-8 h-8 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs uppercase tracking-wider font-semibold">
                  {locale === "bn" ? `মুহূর্ত #${item}` : `Event Moment #${item}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
