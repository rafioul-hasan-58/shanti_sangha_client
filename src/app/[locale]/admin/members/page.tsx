import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import AdminMembersView from "@/components/admin/AdminMembersView";

export default async function AdminMembersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <AdminMembersView locale={locale} />;
}
