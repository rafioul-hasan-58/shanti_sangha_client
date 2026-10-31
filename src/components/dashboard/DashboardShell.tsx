import type { Dictionary } from "@/i18n/getDictionary";
import RoleSwitcher from "./RoleSwitcher";

/** Shared frame for the member and admin dashboards. */
export default function DashboardShell({
  title, stats, dict,
}: { title: string; stats: string[]; dict: Dictionary }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">{title}</h1>
        <RoleSwitcher dict={dict.role} />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((label) => (
          <div key={label} className="rounded-lg border border-brand-200 bg-white p-5">
            <p className="text-sm text-brand-700">{label}</p>
            <p className="mt-2 text-3xl font-bold text-brand-800">0</p>
          </div>
        ))}
      </div>
    </main>
  );
}
