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
      <section id="sports" className="mx-auto max-w-6xl px-4 pt-16">
        <h2 className="font-display text-3xl font-bold">{dict.sections.sportsTitle}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dict.sections.sports.map((s) => (
            <div key={s.name} className="rounded-lg border border-brand-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-brand-800">{s.name}</h3>
              <p className="mt-2 text-sm text-brand-700">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
