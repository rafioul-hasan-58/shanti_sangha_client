import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import UserDetailsPageView from "@/components/dashboard/UserDetailsPageView";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ from?: string }>;
}

export default async function DashboardUserDetailsPage({
  params,
  searchParams,
}: PageProps) {
  const { locale, id } = await params;
  if (!isLocale(locale) || !id) notFound();

  const { from } = await searchParams;
  const backTab =
    from === "pending" ? "admin_users_pending" : "admin_users_all";

  return (
    <UserDetailsPageView
      userId={decodeURIComponent(id)}
      locale={locale}
      backTab={backTab}
    />
  );
}

