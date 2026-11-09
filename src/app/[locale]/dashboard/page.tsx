import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function UserDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return <DashboardShell title={dict.dashboard.userTitle} stats={dict.dashboard.userStats} dict={dict} locale={locale} />;
}
