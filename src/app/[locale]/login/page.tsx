import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { FULL_BRAND_NAME_EN } from "@/lib/constants/site";
import LoginForm from "@/components/auth/LoginForm";

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
      ? "লগইন | সাভারচালা শান্তি সংঘ"
      : `Login | ${FULL_BRAND_NAME_EN}`,
    description: isBn
      ? "সাভারচালা শান্তি সংঘের সদস্য একাউন্টে প্রবেশ করুন।"
      : `Sign in to your ${FULL_BRAND_NAME_EN} account.`,
  };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main className="h-[calc(100dvh-67px)] overflow-hidden flex flex-col items-center justify-start pt-4 pb-4 px-4 sm:px-6 md:h-auto md:min-h-[calc(100dvh-71px)] md:overflow-visible md:pt-10 md:pb-8 bg-[#f7f4ea]">
      <LoginForm locale={locale} dict={dict} />
    </main>
  );
}

