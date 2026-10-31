import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

export default function Footer({
  dict,
  locale = "en",
}: {
  dict: Dictionary;
  locale?: Locale;
}) {
  const isBn = locale === "bn";

  const quickLinks = [
    { href: `/${locale}#about`, label: isBn ? "আমাদের সম্পর্কে" : "About Us" },
    { href: `/${locale}#committee`, label: isBn ? "কার্যনির্বাহী কমিটি" : "Executive Committee" },
    { href: `/${locale}#gpl`, label: isBn ? "জিপিএল প্রিমিয়ার লিগ" : "GPL Premier League" },
    { href: `/${locale}#gallery`, label: isBn ? "ফটো গ্যালারি" : "Photo Gallery" },
    { href: `/${locale}#sports`, label: isBn ? "খেলাধুলা ও প্রশিক্ষণ" : "Sports & Activities" },
    { href: `/${locale}/dashboard`, label: isBn ? "সদস্য ড্যাশবোর্ড" : "Member Dashboard" },
  ];

  return (
    <footer className="mt-20 border-t border-brand-100 bg-[#f9fafb] text-brand-900 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Brand & Description */}
          <div className="md:col-span-5 lg:col-span-5 space-y-4">
            <Link href={`/${locale}`} className="inline-flex items-center gap-3 group">
              <div className="h-11 w-11 relative shrink-0">
                <Image
                  src="/logo.png"
                  alt="Shanti Sangha Logo"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col leading-tight select-none">
                <span className="font-extrabold text-sm sm:text-base tracking-wider text-[#006a4e] uppercase font-sans">
                  {isBn ? "সাভারচালা" : "SHAVARCHALA"}
                </span>
                <span className="text-xs font-semibold tracking-widest text-brand-700 uppercase font-sans">
                  {isBn ? "শান্তি সংঘ" : "SHANTI SANGHA"}
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-brand-700/90 leading-relaxed max-w-md">
              {isBn
                ? "২০০৭ সালে প্রতিষ্ঠিত সাবারচালা শান্তি সংঘ ক্রীড়া ক্লাব। ফুটবল, ক্রিকেট, ব্যাডমিন্টন ও আমাদের ফ্ল্যাগশিপ টুর্নামেন্ট জিপিএল-এর মাধ্যমে সমাজের যুব ও ক্রীড়ামোদী তরুণদের ঐক্যবদ্ধ করার এক অনন্য মঞ্চ।"
                : "A community sports club established in 2007 in Shavarchala. Dedicated to unity, sportsmanship, and athletic excellence across cricket, football, badminton, and our flagship tournament GPL."}
            </p>
          </div>

          {/* Middle Column: Platform & Features / Quick Links */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-brand-800">
              {isBn ? "প্ল্যাটফর্ম ও ফিচার" : "PLATFORM & FEATURES"}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-brand-600 font-medium">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-[#006a4e] hover:translate-x-0.5 inline-block transition-transform"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Lead Engineer & Creator Card */}
          <div className="md:col-span-4 lg:col-span-4">
            <div className="rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-sm hover:shadow-md transition-shadow">
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
                  <div className="h-12 w-12 rounded-xl overflow-hidden ring-2 ring-purple-200/90 shadow-xs">
                    <Image
                      src="/images/creator.png"
                      alt="Rafioul Hasan"
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* Online status indicator */}
                  <span
                    className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white"
                    title="Active"
                  />
                </div>

                {/* Name & Title */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    Rafioul Hasan
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium truncate">
                    Full-Stack Developer & AI Systems Builder
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
        <div className="mt-12 pt-6 border-t border-gray-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-gray-800">
              {isBn ? "সাভারচালা শান্তি সংঘ" : "Shavarchala Shanti Sangha"}
            </span>
            . Developed with passion by{" "}
            <span className="font-bold text-gray-900">Rafioul Hasan</span>.
          </p>

          <div className="flex items-center gap-3">
            <Link href={`/${locale}`} className="hover:text-gray-800 transition-colors">
              {isBn ? "গোপনীয়তা নীতি" : "Privacy Policy"}
            </Link>
            <span className="text-gray-300">•</span>
            <Link href={`/${locale}`} className="hover:text-gray-800 transition-colors">
              {isBn ? "সেবার শর্তাবলী" : "Terms of Service"}
            </Link>
            <span className="text-gray-300">•</span>
            <span>{isBn ? "সর্বস্বত্ব সংরক্ষিত" : "All Rights Reserved"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
