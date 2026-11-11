import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
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
      : "Login | Shavarchala Shanti Sangha",
    description: isBn
      ? "সাভারচালা শান্তি সংঘের সদস্য একাউন্টে প্রবেশ করুন।"
      : "Sign in to your Shavarchala Shanti Sangha account.",
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
    <main className="min-h-dvh flex flex-col items-center pt-6 md:pt-10 pb-8 px-4 sm:px-6 overflow-x-hidden bg-[#f7f4ea]">
      <LoginForm locale={locale} dict={dict} />
    </main>
  );
}

