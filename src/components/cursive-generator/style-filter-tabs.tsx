"use client";

import type { getDictionary } from "@/lib/i18n";
import type { StyleFilter } from "@/lib/text-styles";
import { cn } from "@/lib/utils";

type Dictionary = ReturnType<typeof getDictionary>;

type FilterLabelKey =
  | "all"
  | "social"
  | "googleDocsDefault"
  | "googleDocsInstallable"
  | "msWord";

type StyleFilterTabsProps = {
  dictionary: Dictionary;
  selectedFilter: StyleFilter;
  filterOptions: Array<{
    value: StyleFilter;
    labelKey: FilterLabelKey;
  }>;
  onFilterChange: (value: StyleFilter) => void;
};

export function StyleFilterTabs({
  dictionary,
  selectedFilter,
  filterOptions,
  onFilterChange
}: StyleFilterTabsProps) {
  return (
    <section className="mx-auto mb-6 w-full max-w-7xl px-4 md:px-8">
      <div className="flex gap-2 overflow-x-auto rounded-full border border-slate-200 bg-white/75 p-1 shadow-sm backdrop-blur">
        {filterOptions.map((filterOption) => {
          const isSelected = selectedFilter === filterOption.value;
          const fullLabel = dictionary.filters[filterOption.labelKey];

          return (
            <button
              aria-label={fullLabel}
              aria-pressed={isSelected}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition",
                isSelected
                  ? "bg-ink text-white shadow-sm"
                  : "hover:bg-slate-100 hover:text-ink"
              )}
              key={filterOption.value}
              onClick={() => onFilterChange(filterOption.value)}
              type="button"
            >
              <span aria-hidden="true" className="md:hidden">
                {dictionary.filtersShort[filterOption.labelKey]}
              </span>
              <span aria-hidden="true" className="hidden md:inline">
                {fullLabel}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
