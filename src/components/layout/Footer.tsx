import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export default function Footer({
  dict,
  locale = "bn",
}: {
  dict: Dictionary;
  locale?: Locale;
}) {
  const isBn = locale === "bn";

  const quickLinks = [
    { href: `/${locale}#about`, label: isBn ? "আমাদের সম্পর্কে" : "About Us" },
    { href: `/${locale}#sports`, label: isBn ? "খেলাধুলা ও প্রশিক্ষণ" : "Sports & Activities" },
    { href: `/${locale}#spl`, label: isBn ? "এসপিএল ও বার্ষিক আয়োজন" : "SPL & Annual Events" },
    { href: `/${locale}#committee`, label: isBn ? "কার্যনির্বাহী কমিটি" : "Executive Committee" },
    { href: `/${locale}/members`, label: isBn ? "ক্লাব সদস্য তালিকা" : "Club Members Directory" },
    { href: `/${locale}/dashboard`, label: isBn ? "সদস্য ড্যাশবোর্ড" : "Member Dashboard" },
  ];

  return (
    <footer className="mt-20 border-t-[3px] border-white bg-[#006a4e] text-white font-sans shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Brand & Description */}
          <div className="md:col-span-5 lg:col-span-5 space-y-4">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-3.5 group outline-none focus:outline-none focus-visible:outline-none ring-0 select-none"
            >
              {/* 3D Flipping Logo */}
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 flex items-center justify-center perspective-800">
                <div className="relative w-full h-full transform-style-3d animate-logo-flip">
                  {/* Front Face */}
                  <div className="absolute inset-0 backface-hidden flex items-center justify-center">
                    <Image
                      src="/logo.png"
                      alt="Shanti Sangha Logo"
                      width={64}
                      height={64}
                      className="h-full w-full object-contain drop-shadow-md"
                    />
                  </div>
                  {/* Back Face (rotated 180deg so both sides remain right-side up) */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center">
                    <Image
                      src="/logo.png"
                      alt="Shanti Sangha Logo"
                      width={64}
                      height={64}
                      className="h-full w-full object-contain drop-shadow-md"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col leading-tight select-none">
                <span className="font-extrabold text-sm sm:text-base tracking-wider text-white uppercase font-sans">
                  {isBn ? "সাভারচালা" : "SHAVARCHALA"}
                </span>
                <span className="text-xs font-semibold tracking-widest text-white/90 uppercase font-sans mt-0.5">
                  {isBn ? "শান্তি সংঘ" : "SHANTI SANGHA"}
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-md">
              {isBn
                ? "২০০৭ সাল থেকে বিগত ১৯+ বছর ধরে সাভারচালা শান্তি সংঘ নিয়মিত আয়োজন করে আসছে এসপিএল (SPL), বাৎসরিক ক্রীড়া প্রতিযোগিতা এবং বাৎসরিক ওয়াজ মাহফিল। সুস্থ খেলাধুলা ও সামাজিক ঐক্যের মাধ্যমে যুব সমাজকে এগিয়ে নেওয়াই আমাদের লক্ষ্য।"
                : "Founded in 2007 with over 19+ years of proud community heritage, Shavarchala Shanti Sangha annually organizes SPL (Premier League), Annual Sports Program, and Waz Mahfil — uniting our community through sports and service."}
            </p>
          </div>

          {/* Middle Column: Platform & Features / Quick Links */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white">
              {isBn ? "প্ল্যাটফর্ম ও ফিচার" : "PLATFORM & FEATURES"}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/80 font-medium">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Lead Engineer & Creator Card */}
          <div className="md:col-span-4 lg:col-span-4">
            <div className="rounded-2xl border border-white/20 bg-white p-5 shadow-xl hover:shadow-2xl transition-all text-gray-900">
              {/* Creator Pill Badge */}
              <div className="mb-3">
                <span className="inline-block rounded-full bg-purple-50 border border-purple-200/80 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                  LEAD ENGINEER & CREATOR
                </span>
              </div>

              {/* Creator Profile Info */}
              <div className="flex items-center gap-3.5">
                {/* Avatar with status dot */}
                <div className="relative shrink-0">
                  <div className="h-12 w-12 sm:h-13 sm:w-13 rounded-xl overflow-hidden ring-2 ring-purple-200/90 shadow-xs bg-purple-50">
                    <Image
                      src="/images/committee/sourav.png"
                      alt="Sourav Prodhan"
                      width={56}
                      height={56}
                      priority
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* Online status indicator */}
                  <span
                    className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white shadow-xs"
                    title="Active"
                  />
                </div>

                {/* Name & Title */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    Sourav Prodhan
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium truncate">
                    Software Engineer & AI Systems Builder
                  </p>

                  {/* Social links row */}
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      <span>GitHub</span>
                    </a>
                    <span className="text-gray-300">•</span>
                    <a
                      href="mailto:contact@shantisangha.org"
                      className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Footer / Copyright Row */}
        <div className="mt-12 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/80 font-medium">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-white">
              {isBn ? "সাভারচালা শান্তি সংঘ" : "Shavarchala Shanti Sangha"}
            </span>
            . Developed with passion by{" "}
            <span className="font-bold text-white underline decoration-white/40 underline-offset-2">
              Sourav
            </span>.
          </p>

          <div className="flex items-center gap-3">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              {isBn ? "গোপনীয়তা নীতি" : "Privacy Policy"}
            </Link>
            <span className="text-white/40">•</span>
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              {isBn ? "সেবার শর্তাবলী" : "Terms of Service"}
            </Link>
            <span className="text-white/40">•</span>
            <span>{isBn ? "সর্বস্বত্ব সংরক্ষিত" : "All Rights Reserved"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
