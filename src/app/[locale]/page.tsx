import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import HeroCarousel from "@/components/home/HeroCarousel";
import CommitteeSection from "@/components/home/CommitteeSection";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <HeroCarousel dict={dict.hero} />

      {/* About Section */}
      <section id="about" className="mx-auto max-w-6xl px-4 pt-16 scroll-mt-20">
        <div className="rounded-2xl bg-white border border-brand-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-28 h-28 shrink-0 flex items-center justify-center p-3 bg-brand-50 rounded-2xl border border-brand-100">
              <img src="/logo.png" alt="Shanti Sangha" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#006a4e]">
                {locale === "bn" ? "প্রতিষ্ঠিত ২০০৭" : "ESTABLISHED 2007"}
              </span>
              <h2 className="font-display text-3xl font-bold mt-1 text-pitch">
                {locale === "bn" ? "সাভারচালা শান্তি সংঘ" : "Shavarchala Shanti Sangha"}
              </h2>
              <p className="mt-3 text-brand-700 leading-relaxed">
                {locale === "bn"
                  ? "২০০৭ সাল থেকে সাভারচালা শান্তি সংঘ যুব ও ক্রীড়ামোদী তরুণদের ঐক্যবদ্ধ করে ক্রীড়া প্রতিযোগিতা, টুর্নামেন্ট ও সামাজিক উন্নয়নে ভূমিকা রেখে আসছে।"
                  : "Founded in 2007, Shavarchala Shanti Sangha brings together youth, athletes, and sports lovers across our community to promote athletic excellence, teamwork, and social development."}
              </p>
            </div>
          </div>
        </div>
      </section>

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

      {/* GPL (Premier League) Section */}
      {/* SPL (Shanti Sangha Premier League) Section */}
      <section id="spl" className="mx-auto max-w-6xl px-4 pt-16 scroll-mt-20">
        <div className="rounded-2xl bg-[#006a4e] text-white p-8 sm:p-10 shadow-md border-b-4 border-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-block bg-white text-[#006a4e] text-xs font-extrabold uppercase px-3 py-1 rounded-sm tracking-wider">
                {locale === "bn" ? "বার্ষিক ক্রীড়া আয়োজন" : "ANNUAL SPORTS TOURNAMENT"}
              </span>

              <h2 className="font-display text-3xl font-bold mt-3">
                {locale === "bn" ? "এসপিএল - শান্তি সংঘ প্রিমিয়ার লিগ" : "SPL - Shanti Sangha Premier League"}
              </h2>

              <p className="mt-2 text-brand-100 max-w-2xl text-sm sm:text-base leading-relaxed">
                {locale === "bn"
                  ? "শান্তি সংঘের অন্যতম প্রধান বার্ষিক ক্রীড়া আয়োজন এসপিএল। প্রতি বছর গ্রীষ্মকালে ফুটবল এবং শীতকালে ক্রিকেট টুর্নামেন্ট অনুষ্ঠিত হয়। বিভিন্ন অঞ্চলের দল ও খেলোয়াড়দের অংশগ্রহণে এই আয়োজন হয়ে ওঠে উৎসবমুখর ও প্রতিযোগিতামূলক।"
                  : "SPL is Shanti Sangha's annual sporting event, featuring exciting football and cricket tournaments. Football takes place during summer, while cricket takes place during winter, bringing together local teams and players in a celebration of sportsmanship and community spirit."}
              </p>
            </div>

            <div className="shrink-0">
              <span className="inline-block px-6 py-3 bg-white text-[#006a4e] font-extrabold text-sm uppercase rounded tracking-wider shadow-sm">
                {locale === "bn"
                  ? "ক্রিকেট: ১৫ নভেম্বর"
                  : "Cricket: November 15"}
              </span>
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
