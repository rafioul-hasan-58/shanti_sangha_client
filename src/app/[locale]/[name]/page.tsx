import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { getPersonBySlug, getAllPersonSlugs } from "@/data/people";
import { SAVARCHALA_FULL_BRAND_NAME_EN } from "@/lib/constants/site";
import PersonDetailsView from "@/components/profile/PersonDetailsView";

interface PageProps {
  params: Promise<{ locale: string; name: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPersonSlugs();
  const params: { locale: string; name: string }[] = [];
  for (const locale of locales) {
    for (const name of slugs) {
      params.push({ locale, name });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, name } = await params;
  if (!isLocale(locale)) return {};
  const person = getPersonBySlug(name);
  if (!person) return {};

  const isBn = locale === "bn";
  const personName = isBn ? person.nameBn : person.nameEn;
  const personRole = isBn ? person.roleBn : person.roleEn;
  const title = `${personName} (${personRole}) | ${
    isBn ? "সাভারচালা শান্তি সংঘ" : SAVARCHALA_FULL_BRAND_NAME_EN
  }`;
  const description = isBn ? person.bioBn : person.bioEn;

  return {
    title,
    description: description.slice(0, 160),
    openGraph: {
      title,
      description: description.slice(0, 160),
      images: [
        {
          url: person.image,
          width: 600,
          height: 600,
          alt: personName,
        },
      ],
    },
  };
}

export default async function PersonPage({ params }: PageProps) {
  const { locale, name } = await params;
  if (!isLocale(locale)) notFound();

  const person = getPersonBySlug(name);
  if (!person) {
    notFound();
  }

  return <PersonDetailsView person={person} locale={locale} />;
}

