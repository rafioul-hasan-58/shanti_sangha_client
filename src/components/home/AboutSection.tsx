import Image from "next/image";
import type { Locale } from "@/i18n/config";

export default function AboutSection({ locale }: { locale: Locale }) {
  const isBn = locale === "bn";

  const stats = [
    {
      value: isBn ? "২০০৭" : "2007",
      label: isBn ? "প্রতিষ্ঠার বছর" : "Foundation Year",
    },
    {
      value: isBn ? "১৯+" : "19+",
      label: isBn ? "বছরের ঐতিহ্য" : "Years of Heritage",
    },
    {
      value: isBn ? "এসপিএল" : "SPL",
      label: isBn ? "প্রিমিয়ার লিগ" : "Premier League",
    },
    {
      value: isBn ? "৩টি" : "3",
      label: isBn ? "প্রধান বার্ষিক আয়োজন" : "Signature Annual Events",
    },
  ];

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 pt-16 scroll-mt-20">
      <div className="rounded-3xl bg-white border border-brand-200/80 p-6 sm:p-10 md:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Picture Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] sm:aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 group">
              <Image
                src="/images/about/foundation.jpg"
                alt="Shavarchala Shanti Sangha Foundation"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Subtle gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating Foundation Badge on image */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-lg border border-white/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#006a4e] flex items-center justify-center text-white shrink-0 shadow-xs font-black text-sm">
                  {isBn ? "১৯+" : "19+"}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-pitch uppercase tracking-wider">
                    {isBn ? "সাভারচালা শান্তি সংঘ" : "Shavarchala Shanti Sangha"}
                  </h4>
                  <p className="text-[11px] text-brand-600 font-medium">
                    {isBn
                      ? "১৯+ বছরের ঐতিহ্য: এসপিএল, ক্রীড়া ও মাহফিল"
                      : "19+ Years of SPL, Annual Sports & Waz Mahfil"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text & Foundation Story Column */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <span className="inline-block bg-[#006a4e]/10 text-[#006a4e] text-xs font-extrabold uppercase px-3 py-1 rounded-sm tracking-widest border border-[#006a4e]/20">
                {isBn ? "আমাদের ইতিহাস ও ঐতিহ্য" : "OUR FOUNDATION & HERITAGE"}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-pitch mt-3 leading-tight">
                {isBn
                  ? "২০০৭ থেকে শুরু: ১৯+ বছরের গৌরবময় ঐতিহ্য"
                  : "Founded in 2007: 19+ Years of Community & Sporting Excellence"}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-brand-800/90 leading-relaxed font-sans">
              {isBn
                ? "২০০৭ সালে সাভারচালা এলাকার একদল উদ্যমী তরুণ ও ক্রীড়াপ্রেমীদের হাত ধরে সাভারচালা শান্তি সংঘ প্রতিষ্ঠিত হয়। আমাদের প্রধান লক্ষ্য ছিল স্থানীয় যুবসমাজকে ইতিবাচক কাজে সম্পৃক্ত করা, মাঠে খেলাধুলার সুস্থ পরিবেশ নিশ্চিত করা এবং সমাজে ভ্রাতৃত্ববোধ সুদৃঢ় করা।"
                : "Established in 2007 by visionary youth and sports enthusiasts in Shavarchala, Shanti Sangha began with a shared dream: creating a healthy sports environment, nurturing athletic talent, and fostering lasting brotherhood in the community."}
            </p>

            <p className="text-sm sm:text-base text-brand-800/90 leading-relaxed font-sans">
              {isBn
                ? "বিগত ১৯+ বছর ধরে সাভারচালা শান্তি সংঘ নিয়মিত ও সুনামের সাথে ৩টি প্রধান বাৎসরিক কর্মসূচি আয়োজন করে আসছে — শান্তি সংঘ প্রিমিয়ার লিগ (এসপিএল / SPL), বাৎসরিক ক্রীড়া প্রতিযোগিতা এবং বাৎসরিক ওয়াজ মাহফিল। খেলাধুলার পাশাপাশি রক্তদান কর্মসূচি, সামাজিক সহায়তা ও মানুষের পাশে দাঁড়ানো আমাদের অবিচ্ছেদ্য অঙ্গীকার।"
                : "For over 19+ years, Shavarchala Shanti Sangha has proudly and consistently organized three signature annual events — the SPL (Shanti Sangha Premier League), the Annual Sports Program, and the Annual Waz Mahfil. Beyond sports, we lead community service, humanitarian aid, and social welfare programs."}
            </p>

            {/* 3 Signature Annual Events Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-brand-50/80 border border-brand-200/60">
                <span className="w-8 h-8 rounded-lg bg-[#006a4e] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                  SPL
                </span>
                <div className="leading-tight">
                  <div className="text-xs font-bold text-pitch">
                    {isBn ? "এসপিএল প্রিমিয়ার লিগ" : "SPL Premier League"}
                  </div>
                  <div className="text-[11px] text-brand-600 font-medium">
                    {isBn ? "ফুটবল ও ক্রিকেট টুর্নামেন্ট" : "Football & Cricket"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-brand-50/80 border border-brand-200/60">
                <span className="w-8 h-8 rounded-lg bg-[#006a4e] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  🏆
                </span>
                <div className="leading-tight">
                  <div className="text-xs font-bold text-pitch">
                    {isBn ? "বার্ষিক ক্রীড়া প্রতিযোগিতা" : "Annual Sports Program"}
                  </div>
                  <div className="text-[11px] text-brand-600 font-medium">
                    {isBn ? "সব বয়সের ক্রীড়া উৎসব" : "Athletics & Games"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-brand-50/80 border border-brand-200/60">
                <span className="w-8 h-8 rounded-lg bg-[#006a4e] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  🕌
                </span>
                <div className="leading-tight">
                  <div className="text-xs font-bold text-pitch">
                    {isBn ? "বাৎসরিক ওয়াজ মাহফিল" : "Annual Waz Mahfil"}
                  </div>
                  <div className="text-[11px] text-brand-600 font-medium">
                    {isBn ? "ধর্মীয় ও নৈতিক সম্মেলন" : "Spiritual Gathering"}
                  </div>
                </div>
              </div>
            </div>

            {/* Foundation Stats */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((s, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-brand-100 bg-brand-50/50 p-3.5 text-center shadow-2xs"
                >
                  <span className="block font-display text-xl sm:text-2xl font-black text-[#006a4e]">
                    {s.value}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-semibold text-brand-700 tracking-wide">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

