import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import HeroCarousel from "@/components/home/HeroCarousel";

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
                {locale === "bn" ? "সাভারচালা শান্তি সংঘ ক্রীড়া ক্লাব" : "Shavarchala Shanti Sangha Sporting Club"}
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
      <section id="gpl" className="mx-auto max-w-6xl px-4 pt-16 scroll-mt-20">
        <div className="rounded-2xl bg-[#006a4e] text-white p-8 sm:p-10 shadow-md border-b-4 border-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-block bg-white text-[#006a4e] text-xs font-extrabold uppercase px-3 py-1 rounded-sm tracking-wider">
                {locale === "bn" ? "বার্ষিক টুর্নামেন্ট" : "ANNUAL TOURNAMENT"}
              </span>
              <h2 className="font-display text-3xl font-bold mt-3">
                {locale === "bn" ? "জিপিএল - প্রিমিয়ার লিগ" : "GPL - Premier League"}
              </h2>
              <p className="mt-2 text-brand-100 max-w-2xl text-sm sm:text-base leading-relaxed">
                {locale === "bn"
                  ? "শান্তি সংঘের সবচেয়ে মর্যাদাপূর্ণ ক্রিকেট ও ক্রীড়া আসর। বিভিন্ন অঞ্চলের শীর্ষ দল ও খেলোয়াড়দের রোমাঞ্চকর লড়াই।"
                  : "The premier competitive sports and cricket championship of Shanti Sangha. Showcasing elite local talent, intense matchups, and community passion."}
              </p>
            </div>
            <div className="shrink-0">
              <span className="inline-block px-6 py-3 bg-white text-[#006a4e] font-extrabold text-sm uppercase rounded tracking-wider shadow-sm">
                {locale === "bn" ? "আসন্ন মৌসুম" : "Upcoming Season"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Committee (Comette) Section */}
      <section id="committee" className="mx-auto max-w-6xl px-4 pt-16 scroll-mt-20">
        <h2 className="font-display text-3xl font-bold text-pitch">
          {locale === "bn" ? "কার্যনির্বাহী কমিটি" : "Executive Committee"}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { role: locale === "bn" ? "সভাপতি" : "President", name: locale === "bn" ? "মোঃ সভাপতি" : "Club President" },
            { role: locale === "bn" ? "সাধারণ সম্পাদক" : "General Secretary", name: locale === "bn" ? "মোঃ সম্পাদক" : "General Secretary" },
            { role: locale === "bn" ? "ক্রীড়া সম্পাদক" : "Sports Secretary", name: locale === "bn" ? "ক্রীড়া সমন্বয়ক" : "Sports Coordinator" },
            { role: locale === "bn" ? "কোষাধ্যক্ষ" : "Treasurer", name: locale === "bn" ? "অর্থ সম্পাদক" : "Treasurer" },
          ].map((member, i) => (
            <div key={i} className="rounded-xl border border-brand-200 bg-white p-5 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-[#006a4e] font-bold text-lg mb-3">
                {member.role[0]}
              </div>
              <h3 className="font-bold text-pitch">{member.name}</h3>
              <p className="text-xs uppercase tracking-wider text-brand-600 font-semibold mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

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
