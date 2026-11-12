import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { FULL_BRAND_NAME_EN } from "@/lib/constants/site";
import RegisterForm from "@/components/auth/RegisterForm";

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
      ? "নিবন্ধন | সাভারচালা শান্তি সংঘ"
      : `Register | ${FULL_BRAND_NAME_EN}`,
    description: isBn
      ? "সাভারচালা শান্তি সংঘে নতুন সদস্য হিসেবে নিবন্ধন করুন।"
      : `Create your new account at ${FULL_BRAND_NAME_EN}.`,
  };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main className="min-h-dvh flex flex-col items-center pt-6 md:pt-10 pb-8 px-4 sm:px-6 overflow-x-hidden bg-[#f7f4ea]">
      <RegisterForm locale={locale} dict={dict} />
    </main>
  );
}

