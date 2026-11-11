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
    <main className="min-h-[calc(100dvh-67px)] md:min-h-[calc(100vh-200px)] flex items-center justify-center py-2 md:py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden bg-gradient-to-b from-brand-50/40 via-chalk to-brand-50/20">
      <LoginForm locale={locale} dict={dict} />
    </main>
  );
}

