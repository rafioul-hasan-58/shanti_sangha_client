import { notFound } from "next/navigation";
import AdminPlaceholderPage from "@/components/admin/AdminPlaceholderPage";
import { isLocale } from "@/i18n/config";

export default async function CommitteeKeyLeadersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <AdminPlaceholderPage
      routeHref="/admin/committee/key-leaders"
      locale={locale}
    />
  );
}

