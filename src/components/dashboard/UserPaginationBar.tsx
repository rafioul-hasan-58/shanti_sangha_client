"use client";

import ThemedSelect from "@/components/common/ThemedSelect";
import type { UsersPaginationMeta } from "@/lib/types/dashboard";

interface UserPaginationBarProps {
  meta: UsersPaginationMeta;
  limit: number;
  loading?: boolean;
  isBn: boolean;
  isPendingView?: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

/** Build compact page items with ellipses (e.g. `1, 2, 3, 4, 5, "...", 76`). */
function getPageItems(
  currentPage: number,
  totalPages: number
): Array<number | "..."> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: Array<number | "..."> = [1];

  if (currentPage <= 4) {
    for (let p = 2; p <= 5; p++) items.push(p);
    items.push("...");
    items.push(totalPages);
    return items;
  }

  if (currentPage >= totalPages - 3) {
    items.push("...");
    for (let p = totalPages - 4; p < totalPages; p++) items.push(p);
    items.push(totalPages);
    return items;
  }

  items.push("...");
  items.push(currentPage - 1, currentPage, currentPage + 1);
  items.push("...");
  items.push(totalPages);
  return items;
}

/**
 * Reusable themed pagination bar rendered above and below the User Management list.
 */
export default function UserPaginationBar({
  meta,
  limit,
  loading = false,
  isBn,
  isPendingView = false,
  onPageChange,
  onLimitChange,
}: UserPaginationBarProps) {
  if (meta.total <= 0) return null;

  const startIndex = (meta.page - 1) * meta.limit + 1;
  const endIndex = Math.min(meta.page * meta.limit, meta.total);
  const pageItems = getPageItems(meta.page, meta.totalPages);
  const entityLabel = isPendingView
    ? isBn ? "অপেক্ষমাণ" : "Pending"
    : isBn ? "ব্যবহারকারী" : "Users";

  return (
    <div className="rounded-2xl border border-[#006a4e]/15 bg-[#f7f4ea]/45 px-3.5 sm:px-4 py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
      {/* Left: Showing range + Page X of Y */}
      <div className="flex flex-wrap items-center gap-2 text-slate-600">
        <p className="font-medium">
          {isBn ? "দেখানো হচ্ছে " : "Showing "}
          <span className="font-extrabold text-[#006a4e]">
            {startIndex} - {endIndex}
          </span>
          {isBn ? " / মোট " : " of "}
          <span className="font-extrabold text-[var(--text)]">{meta.total}</span>{" "}
          {entityLabel}
        </p>

        <span className="text-slate-300 select-none">|</span>

        <span className="font-semibold text-slate-500">
          {isBn
            ? `পেজ ${meta.page} / ${meta.totalPages}`
            : `Page ${meta.page} of ${meta.totalPages}`}
        </span>
      </div>

      {/* Right: Per page + Prev + Page Numbers + Next */}
      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
        <div className="inline-flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500">
            {isBn ? "প্রতি পেজ:" : "Per page:"}
          </span>
          <ThemedSelect
            ariaLabel={isBn ? "প্রতি পেজ" : "Per page"}
            value={String(limit)}
            size="xs"
            align="right"
            disabled={loading}
            className="bg-white min-w-[64px]"
            onChange={(val) => onLimitChange(Number(val))}
            options={[
              { value: "10", label: "10" },
              { value: "12", label: "12" },
              { value: "20", label: "20" },
              { value: "50", label: "50" },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            disabled={!meta.hasPreviousPage || loading}
            onClick={() => onPageChange(Math.max(1, meta.page - 1))}
            className="h-8 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-[#f7f4ea] hover:border-[#006a4e]/35 text-[var(--text)] font-bold inline-flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>‹</span>
            <span>{isBn ? "পূর্ববর্তী" : "Prev"}</span>
          </button>

          {pageItems.map((item, idx) =>
            item === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-1.5 text-slate-400 font-bold select-none"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                disabled={loading}
                onClick={() => onPageChange(item)}
                aria-current={item === meta.page ? "page" : undefined}
                className={`h-8 min-w-[32px] px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer disabled:cursor-not-allowed ${
                  item === meta.page
                    ? "bg-[#006a4e] text-white shadow-xs shadow-[#006a4e]/25"
                    : "bg-white border border-slate-200/90 text-[var(--text)] hover:bg-[#f7f4ea] hover:border-[#006a4e]/35 hover:text-[#006a4e]"
                }`}
              >
                {item}
              </button>
            )
          )}

          <button
            type="button"
            disabled={!meta.hasNextPage || loading}
            onClick={() => onPageChange(meta.page + 1)}
            className="h-8 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-[#f7f4ea] hover:border-[#006a4e]/35 text-[var(--text)] font-bold inline-flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{isBn ? "পরবর্তী" : "Next"}</span>
            <span>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
