"use client";

import { motion } from "framer-motion";
import { Calendar, X, Globe } from "lucide-react";
import type { PurchaseType } from "@/lib/mockData";
import { domainFilterOptions } from "@/lib/mockData";

const dateOptions = [
  { value: "today", label: "За текущий день" },
  { value: "24h", label: "За 24ч" },
  { value: "week", label: "За неделю" },
  { value: "month", label: "За месяц" },
  { value: "custom", label: "Свой диапазон" },
] as const;

const typeOptions: { value: PurchaseType | "all"; label: string }[] = [
  { value: "all", label: "Все разделы" },
];

export interface FiltersState {
  dateRange: (typeof dateOptions)[number]["value"];
  purchaseType: PurchaseType | "all";
  domain: string;
  search: string;
  customFrom?: string;
  customTo?: string;
}

const defaultFilters: FiltersState = {
  dateRange: "today",
  purchaseType: "all",
  domain: "",
  search: "",
};

interface FiltersProps {
  filters: FiltersState;
  onFiltersChange: (f: FiltersState) => void;
}

export function Filters({ filters, onFiltersChange }: FiltersProps) {
  const hasActiveFilters =
    filters.dateRange !== defaultFilters.dateRange ||
    (filters.dateRange === "custom" && (filters.customFrom || filters.customTo)) ||
    filters.purchaseType !== defaultFilters.purchaseType ||
    filters.domain !== defaultFilters.domain;

  const handleReset = () => {
    onFiltersChange({
      ...filters,
      dateRange: defaultFilters.dateRange,
      purchaseType: defaultFilters.purchaseType,
      domain: defaultFilters.domain,
      customFrom: undefined,
      customTo: undefined,
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card-surface flex flex-col gap-4 p-5 sm:p-6"
      aria-label="Фильтры"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]">
            <Calendar className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-sm font-semibold text-[hsl(var(--foreground))]">Фильтры</p>
            <p className="text-xs text-[hsl(var(--muted))]">Сегменты, период и домены</p>
          </div>
        </div>
        {dateOptions.map((opt) => (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() =>
              onFiltersChange({
                ...filters,
                dateRange: opt.value,
                ...(opt.value !== "custom" ? { customFrom: undefined, customTo: undefined } : {}),
              })
            }
            whileTap={{ scale: 0.97 }}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 ease-out ${
              filters.dateRange === opt.value
                ? "bg-[hsl(var(--accent))] text-white shadow-md shadow-[hsl(var(--accent))]/25 ring-2 ring-[hsl(var(--accent))]/30 ring-offset-2 ring-offset-[hsl(var(--background))] dark:ring-offset-[hsl(var(--background))]"
                : "bg-[hsl(var(--surface-muted))]/70 text-[hsl(var(--muted))] hover:bg-[hsl(var(--surface-muted))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            {opt.label}
          </motion.button>
        ))}
        {filters.dateRange === "custom" && (
          <span className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={filters.customFrom ?? ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, customFrom: e.target.value || undefined })
              }
              className="rounded-xl border border-[hsl(var(--border))]/80 bg-[hsl(var(--surface))] px-3 py-2 text-[13px]"
            />
            <span className="text-[hsl(var(--muted))]">—</span>
            <input
              type="date"
              value={filters.customTo ?? ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, customTo: e.target.value || undefined })
              }
              className="rounded-xl border border-[hsl(var(--border))]/80 bg-[hsl(var(--surface))] px-3 py-2 text-[13px]"
            />
          </span>
        )}
        <span className="mx-2 h-4 w-px bg-[hsl(var(--border))]" aria-hidden />
        {typeOptions.map((opt) => (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onFiltersChange({ ...filters, purchaseType: opt.value })}
            whileTap={{ scale: 0.97 }}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 ease-out ${
              filters.purchaseType === opt.value
                ? "bg-[hsl(var(--accent))] text-white shadow-md shadow-[hsl(var(--accent))]/25 ring-2 ring-[hsl(var(--accent))]/30 ring-offset-2 ring-offset-[hsl(var(--background))] dark:ring-offset-[hsl(var(--background))]"
                : "bg-[hsl(var(--surface-muted))]/70 text-[hsl(var(--muted))] hover:bg-[hsl(var(--surface-muted))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            {opt.label}
          </motion.button>
        ))}
        <span className="mx-2 h-4 w-px bg-[hsl(var(--border))]" aria-hidden />
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]">
          <Globe className="h-4 w-4" strokeWidth={1.8} />
        </span>
        <select
          value={filters.domain}
          onChange={(e) => onFiltersChange({ ...filters, domain: e.target.value })}
          className="rounded-full border border-[hsl(var(--border))]/80 bg-[hsl(var(--surface))] px-4 py-2 text-[13px] font-semibold text-[hsl(var(--foreground))] focus:border-[hsl(var(--accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/20"
        >
          <option value="">Все домены</option>
          {domainFilterOptions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {hasActiveFilters && (
          <motion.button
            type="button"
            onClick={handleReset}
            className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
          >
            <X className="h-3.5 w-3.5" />
            Сбросить
          </motion.button>
        )}
      </div>

      {/* Поиск перенесён в секцию списка покупок */}
    </motion.section>
  );
}
