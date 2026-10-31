import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import MembersDirectory from "@/components/members/MembersDirectory";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const isBn = locale === "bn";
  return {
    title: isBn
      ? "সদস্যবৃন্দ | সাভারচালা শান্তি সংঘ"
      : "Members Directory | Shavarchala Shanti Sangha",
    description: isBn
      ? "সাভারচালা শান্তি সংঘের সম্মানিত উপদেষ্টা, কার্যনির্বাহী সদস্য ও সাধারণ সদস্যদের তালিকা।"
      : "Directory of advisors, executive members, and general members of Shavarchala Shanti Sangha.",
  };
}

export default async function MembersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main className="min-h-screen bg-chalk">
      <MembersDirectory locale={locale} />
    </main>
  );
}

