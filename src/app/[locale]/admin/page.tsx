import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return <DashboardShell title={dict.dashboard.adminTitle} stats={dict.dashboard.adminStats} dict={dict} locale={locale} embeddedInAdminLayout />;
}
