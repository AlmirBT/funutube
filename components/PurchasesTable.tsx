"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { Purchase, PurchaseType, PurchaseStatus } from "@/lib/mockData";
import { FiltersState } from "./Filters";
import { formatRubles } from "@/lib/currency";

const PAGE_SIZE = 10;
const typeLabels: Record<PurchaseType, string> = {
  privileges: "Привилегии",
  promotions: "Акции",
  cases: "Кейсы",
  tokens: "Токены",
  services: "Услуги",
  subscription: "Подписка",
};
const statusLabels: Record<PurchaseStatus, string> = {
  completed: "Выполнено",
  pending: "В ожидании",
  refunded: "Возврат",
  failed: "Ошибка",
};
const statusStyles: Record<PurchaseStatus, string> = {
  completed: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  refunded: "bg-[hsl(var(--muted))]/15 text-[hsl(var(--muted))]",
  failed: "bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))]",
};

interface PurchasesTableProps {
  purchases: Purchase[];
  filters: FiltersState;
  isLoading?: boolean;
  onRowClick?: (purchase: Purchase) => void;
  onShowDemo?: () => void;
}

type SortKey = keyof Purchase | "";
type SortDir = "asc" | "desc";

export function PurchasesTable({
  purchases,
  filters,
  isLoading = false,
  onRowClick,
  onShowDemo,
}: PurchasesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  const searchQuery = filters.search.trim().toLowerCase();
  const filtered = useMemo(() => {
    let list = [...purchases];
    if (filters.purchaseType !== "all") {
      list = list.filter((p) => p.type === filters.purchaseType);
    }
    if (searchQuery) {
      list = list.filter(
        (p) =>
          p.username.toLowerCase().includes(searchQuery) ||
          p.nickname.toLowerCase().includes(searchQuery)
      );
    }
    if (sortKey && sortKey !== "type" && sortKey !== "status") {
      list.sort((a, b) => {
        const av = a[sortKey as keyof Purchase];
        const bv = b[sortKey as keyof Purchase];
        if (sortKey === "date" && typeof av === "string" && typeof bv === "string") {
          const ad = new Date(av).getTime();
          const bd = new Date(bv).getTime();
          return sortDir === "asc" ? ad - bd : bd - ad;
        }
        if (typeof av === "string" && typeof bv === "string")
          return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
        if (typeof av === "number" && typeof bv === "number")
          return sortDir === "asc" ? av - bv : bv - av;
        return 0;
      });
    }
    if (sortKey === "type") {
      list.sort((a, b) =>
        sortDir === "asc"
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type)
      );
    }
    if (sortKey === "status") {
      list.sort((a, b) =>
        sortDir === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status)
      );
    }
    return list;
  }, [purchases, filters.purchaseType, filters.search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const pageList = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const isRowMatchSearch = (row: Purchase) =>
    searchQuery
      ? row.username.toLowerCase().includes(searchQuery) ||
        row.nickname.toLowerCase().includes(searchQuery)
      : true;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  };

  const Th = ({
    label,
    sortKey: colKey,
    align = "left",
    className = "",
  }: {
    label: string;
    sortKey: SortKey;
    align?: "left" | "center" | "right";
    className?: string;
  }) => {
    const sortIcon =
      colKey && sortKey === colKey
        ? sortDir === "asc"
          ? <ChevronUp className="h-3.5 w-3.5 shrink-0" />
          : <ChevronDown className="h-3.5 w-3.5 shrink-0" />
        : null;
    return (
      <th
        className={`${className} ${align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}`}
      >
        <button
          type="button"
          onClick={() => colKey && toggleSort(colKey)}
          className={`flex w-full items-center gap-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))] ${
            align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start"
          } ${colKey ? "cursor-pointer hover:text-[hsl(var(--foreground))]" : "cursor-default"}`}
        >
          {align === "right" && sortIcon}
          <span>{label}</span>
          {align !== "right" && sortIcon}
        </button>
      </th>
    );
  };

  if (isLoading) {
    return (
      <div className="card-surface p-6">
        <div className="h-64 animate-pulse rounded-2xl bg-[hsl(var(--surface-muted))]" />
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-[hsl(var(--border))]/60 border-dashed bg-[hsl(var(--surface-muted))]/40 py-16 px-8 text-center"
      >
        <p className="text-lg font-semibold text-[hsl(var(--foreground))]">
          Покупки не найдены
        </p>
        <p className="mt-2 text-sm text-[hsl(var(--muted))]">
          Измените фильтры или посмотрите демо-данные.
        </p>
        {onShowDemo && (
          <button
            type="button"
            onClick={onShowDemo}
            className="mt-4 rounded-full bg-[hsl(var(--accent))] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/30 focus:ring-offset-2"
          >
            Посмотреть демо-данные
          </button>
        )}
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08, ease: [0.32, 0.72, 0.2, 1] }}
      className="card-surface overflow-hidden"
    >
      <div className="scrollbar-premium overflow-x-auto overflow-y-visible">
        <table className="w-full min-w-[640px] border-collapse text-[13px]">
          <thead className="sticky top-0 z-10 bg-[hsl(var(--surface-muted))]/85 dark:bg-[hsl(var(--surface-muted))]/95 backdrop-blur-md">
            <tr className="border-b border-[hsl(var(--border))]/80 bg-[hsl(var(--surface-muted))]/50">
              <Th label="Дата покупки" sortKey="date" align="left" className="px-6 py-4" />
              <Th label="Игровой ник" sortKey="username" className="px-6 py-4" />
              <Th label="IP / домен" sortKey="domain" className="px-6 py-4" />
              <Th label="Тип услуги" sortKey="type" className="px-6 py-4" />
              <Th label="Сумма" sortKey="amount" align="right" className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {pageList.map((row, i) => {
                const isMatch = isRowMatchSearch(row);
                const dimmed = searchQuery && !isMatch;
                return (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: dimmed ? 0.45 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.02 }}
                    onClick={() => onRowClick?.(row)}
                    className={`group cursor-pointer border-b border-[hsl(var(--border))]/60 last:border-b-0 transition-all duration-200 ${
                      dimmed ? "opacity-45" : "hover:bg-[hsl(var(--surface-muted))]/60"
                    } ${isMatch && searchQuery ? "bg-[hsl(var(--accent))]/10 ring-1 ring-inset ring-[hsl(var(--accent))]/30" : ""}`}
                  >
                    <td className="px-6 py-4 text-[13px] text-[hsl(var(--muted))] tabular-nums">
                      {new Date(row.date).toLocaleString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className={`px-6 py-4 font-medium ${isMatch && searchQuery ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--foreground))]"}`}>
                      {row.nickname || row.username}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[hsl(var(--muted))]">
                      {row.domain}
                    </td>
                    <td className="px-6 py-4 font-medium text-[hsl(var(--foreground))]">
                      {typeLabels[row.type]}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold tabular-nums text-[hsl(var(--accent))]">
                      {formatRubles(row.amount, { decimals: 2 })}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[hsl(var(--border))]/80 px-6 py-4">
        <p className="text-[12px] text-[hsl(var(--muted))]">
          Показано {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} из{" "}
          {filtered.length}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[hsl(var(--border))]/80 bg-[hsl(var(--surface))] text-[hsl(var(--foreground))] disabled:pointer-events-none disabled:opacity-50 hover:bg-[hsl(var(--surface-muted))]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[60px] text-center text-[12px] font-medium tabular-nums text-[hsl(var(--foreground))]">
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[hsl(var(--border))]/80 bg-[hsl(var(--surface))] text-[hsl(var(--foreground))] disabled:pointer-events-none disabled:opacity-50 hover:bg-[hsl(var(--surface-muted))]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.section>
  );
}
