import { notFound } from "next/navigation";
import AdminPlaceholderPage from "@/components/admin/AdminPlaceholderPage";
import { isLocale } from "@/i18n/config";

export default async function PioneersReorderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <AdminPlaceholderPage
      routeHref="/admin/pioneers/reorder"
      locale={locale}
    />
  );
}

