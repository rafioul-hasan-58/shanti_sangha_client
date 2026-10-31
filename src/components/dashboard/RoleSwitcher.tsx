"use client";
/** Switch between Member and Admin views, then go to the matching dashboard. */
import { useParams, useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import type { Role } from "@/types";
import type { Dictionary } from "@/i18n/getDictionary";

export default function RoleSwitcher({ dict }: { dict: Dictionary["role"] }) {
  const { role, setRole } = useRole();
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();

  const choose = (next: Role) => {
    setRole(next);
    router.push(`/${locale}/${next === "admin" ? "admin" : "dashboard"}`);
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-brand-700">{dict.label}</span>
      <div role="group" className="flex rounded-full border border-brand-300 bg-white p-0.5">
        {(["user", "admin"] as const).map((r) => (
          <button
            key={r}
            onClick={() => choose(r)}
            aria-pressed={role === r}
            className={`rounded-full px-3 py-1 ${role === r ? "bg-brand-700 text-white" : "text-brand-800"}`}
          >
            {dict[r]}
          </button>
        ))}
      </div>
    </div>
  );
}
