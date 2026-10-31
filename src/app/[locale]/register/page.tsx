import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
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
      : "Register | Shavarchala Shanti Sangha",
    description: isBn
      ? "সাভারচালা শান্তি সংঘে নতুন সদস্য হিসেবে নিবন্ধন করুন।"
      : "Create your new account at Shavarchala Shanti Sangha.",
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
    <main className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-50/40 via-chalk to-brand-50/20">
      <RegisterForm locale={locale} dict={dict} />
    </main>
  );
}

