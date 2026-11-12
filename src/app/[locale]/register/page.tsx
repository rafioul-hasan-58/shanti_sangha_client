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
    <main className="h-[calc(100dvh-67px)] overflow-y-auto flex flex-col items-center justify-start pt-3 pb-3 px-4 sm:px-6 md:h-auto md:min-h-[calc(100dvh-71px)] md:overflow-visible md:pt-10 md:pb-8 bg-[#f7f4ea]">
      <RegisterForm locale={locale} dict={dict} />
    </main>
  );
}

