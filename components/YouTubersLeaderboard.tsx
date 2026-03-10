"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, User, Crown, Search, ArrowUpDown, ArrowUp, ArrowDown, X, GitCompare } from "lucide-react";
import { allYouTubersForRanking, type YouTuberStats } from "@/lib/mockData";
import { formatRubles } from "@/lib/currency";
import { YouTuberDetailDrawer } from "./YouTuberDetailDrawer";

const baseSorted = [...allYouTubersForRanking].sort(
  (a, b) => b.revenueWeek - a.revenueWeek
);

function getRank(stats: YouTuberStats, list: YouTuberStats[]): number {
  const idx = list.findIndex((u) => u.id === stats.id);
  return idx >= 0 ? idx + 1 : 0;
}

function getAverageCheck(u: YouTuberStats): number {
  return u.purchasesCount > 0 ? u.revenueWeek / u.purchasesCount : 0;
}

type SortKey = "place" | "name" | "purchases" | "averageCheck" | "revenueWeek" | "conversion" | "attractedUsers";

type LeaderboardRow = YouTuberStats & { rank: number; averageCheck: number };

export function YouTubersLeaderboard() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("revenueWeek");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedYouTuber, setSelectedYouTuber] = useState<LeaderboardRow | null>(null);

  const filteredAndSorted = useMemo(() => {
    let list = baseSorted.filter(
      (u) =>
        !search.trim() ||
        u.name.toLowerCase().includes(search.trim().toLowerCase())
    );
    const getRankInList = (u: YouTuberStats) => getRank(u, list);
    const avgCheck = (u: YouTuberStats) => getAverageCheck(u);
    const mult = sortAsc ? 1 : -1;
    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "place":
          return mult * (getRankInList(a) - getRankInList(b));
        case "name":
          return mult * a.name.localeCompare(b.name);
        case "purchases":
          return mult * (a.purchasesCount - b.purchasesCount);
        case "averageCheck":
          return mult * (avgCheck(a) - avgCheck(b));
        case "revenueWeek":
          return mult * (a.revenueWeek - b.revenueWeek);
        case "conversion":
          return mult * (a.conversion - b.conversion);
        case "attractedUsers":
          return mult * (a.attractedUsers - b.attractedUsers);
        default:
          return mult * (a.revenueWeek - b.revenueWeek);
      }
    });
    return list.map((u) => ({ ...u, rank: getRank(u, list), averageCheck: avgCheck(u) }));
  }, [search, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(key === "name");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSortKey("revenueWeek");
    setSortAsc(false);
  };

  const hasActiveFilters = search.trim() !== "" || sortKey !== "revenueWeek" || sortAsc;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.32, 0.72, 0.2, 1] }}
      className="card-surface p-6 sm:p-8 transition-shadow duration-500 hover:shadow-glow-subtle"
      aria-label="Рейтинг ютуберов"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--accent))]/12 text-[hsl(var(--accent))] shadow-[0_0_16px_-8px_hsl(var(--accent)/0.45)]">
            <Trophy className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[hsl(var(--foreground))]">
              Рейтинг ютуберов
            </h2>
            <p className="text-sm text-[hsl(var(--muted))]">
              Место, ник, доход за неделю, привлечённые игроки, конверсия домена
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted))]" />
            <input
              type="search"
              placeholder="Поиск по нику..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full min-w-[180px] rounded-2xl border border-[hsl(var(--border))]/70 bg-[hsl(var(--surface-muted))]/60 py-2.5 pl-10 pr-4 text-[13px] font-medium text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted))] transition-colors focus:border-[hsl(var(--accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/20"
            />
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold text-[hsl(var(--muted))] transition-colors hover:bg-[hsl(var(--surface-muted))] hover:text-[hsl(var(--foreground))]"
            >
              <X className="h-3.5 w-3.5" />
              Сбросить
            </button>
          )}
        </div>
      </div>

      <div className="scrollbar-premium overflow-x-auto rounded-2xl border border-[hsl(var(--border))]/50">
        <table className="w-full min-w-[800px] border-collapse text-[13px]">
          <thead>
            <tr className="bg-[hsl(var(--surface-muted))]/70">
              <th className="w-20 px-3 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
                <button
                  type="button"
                  onClick={() => toggleSort("place")}
                  className={`inline-flex w-full items-center justify-center gap-1 transition-colors hover:text-[hsl(var(--foreground))] ${sortKey === "place" ? "text-[hsl(var(--foreground))]" : ""}`}
                >
                  Место
                  {sortKey === "place" ? (sortAsc ? <ArrowUp className="h-3.5 w-3.5 shrink-0" /> : <ArrowDown className="h-3.5 w-3.5 shrink-0" />) : <ArrowUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />}
                </button>
              </th>
              <th className="min-w-[140px] px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
                <button
                  type="button"
                  onClick={() => toggleSort("name")}
                  className={`inline-flex items-center gap-1 transition-colors hover:text-[hsl(var(--foreground))] ${sortKey === "name" ? "text-[hsl(var(--foreground))]" : ""}`}
                >
                  Ник
                  {sortKey === "name" ? (sortAsc ? <ArrowUp className="h-3.5 w-3.5 shrink-0" /> : <ArrowDown className="h-3.5 w-3.5 shrink-0" />) : <ArrowUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />}
                </button>
              </th>
              <th className="w-32 px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
                <SortHeader
                  label="Доход за неделю"
                  active={sortKey === "revenueWeek"}
                  asc={sortAsc}
                  onSort={() => toggleSort("revenueWeek")}
                />
              </th>
              <th className="w-28 px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
                <SortHeader
                  label="Покупок за неделю"
                  active={sortKey === "purchases"}
                  asc={sortAsc}
                  onSort={() => toggleSort("purchases")}
                />
              </th>
              <th className="w-28 px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
                <SortHeader
                  label="Средний чек"
                  active={sortKey === "averageCheck"}
                  asc={sortAsc}
                  onSort={() => toggleSort("averageCheck")}
                />
              </th>
              <th className="w-24 px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
                <SortHeader
                  label="Конв. домена"
                  active={sortKey === "conversion"}
                  asc={sortAsc}
                  onSort={() => toggleSort("conversion")}
                />
              </th>
              <th className="w-32 px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
                <SortHeader
                  label="Привлеч. игроки"
                  active={sortKey === "attractedUsers"}
                  asc={sortAsc}
                  onSort={() => toggleSort("attractedUsers")}
                />
              </th>
              <th className="w-24 px-4 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((u, i) => {
              const isYou = u.id === "me";
              return (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(0.03 * i, 0.3) }}
                  className={`border-t border-[hsl(var(--border))]/50 first:border-t-0 transition-colors ${
                    isYou
                      ? "bg-[hsl(var(--accent))]/8"
                      : "hover:bg-[hsl(var(--surface-muted))]/40"
                  } ${isYou ? "ring-1 ring-inset ring-[hsl(var(--accent))]/25" : ""}`}
                >
                  <td className="w-20 px-3 py-3.5 text-center align-middle">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold tabular-nums ${
                        u.rank === 1
                          ? "bg-amber-400/20 text-amber-600 dark:text-amber-400"
                          : u.rank === 2
                            ? "bg-[hsl(var(--muted))]/25 text-[hsl(var(--muted))]"
                            : u.rank === 3
                              ? "bg-orange-200/30 text-orange-600 dark:text-orange-400"
                              : "bg-[hsl(var(--surface-muted))] text-[hsl(var(--muted))]"
                      }`}
                    >
                      {u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : u.rank}
                    </span>
                  </td>
                  <td className="min-w-[140px] px-4 py-3.5 text-left align-middle">
                    {isYou ? (
                      <span className="flex items-center gap-2 font-medium text-[hsl(var(--foreground))]">
                        <User className="h-4 w-4 shrink-0 text-[hsl(var(--accent))]" strokeWidth={1.75} />
                        {u.name}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedYouTuber(u)}
                        className="flex w-full items-center gap-2 rounded-lg px-1 py-0.5 -mx-1 text-left font-medium text-[hsl(var(--foreground))] transition-colors hover:text-[hsl(var(--accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/30 focus:ring-offset-1"
                      >
                        {u.isOfficial && <Crown className="h-3.5 w-3.5 shrink-0 text-amber-500" strokeWidth={1.75} />}
                        {u.name}
                      </button>
                    )}
                  </td>
                  <td className="w-32 px-4 py-3.5 text-right align-middle tabular-nums text-[hsl(var(--foreground))]">
                    {formatRubles(u.revenueWeek)}
                  </td>
                  <td className="w-28 px-4 py-3.5 text-right align-middle tabular-nums text-[hsl(var(--foreground))]">
                    {u.purchasesCount.toLocaleString("ru-RU")}
                  </td>
                  <td className="w-28 px-4 py-3.5 text-right align-middle tabular-nums text-[hsl(var(--foreground))]">
                    {u.purchasesCount > 0 ? formatRubles(u.averageCheck, { decimals: 0 }) : "—"}
                  </td>
                  <td className="w-24 px-4 py-3.5 text-right align-middle tabular-nums text-[hsl(var(--foreground))]">
                    {u.conversion.toFixed(1)}%
                  </td>
                  <td className="w-32 px-4 py-3.5 text-right align-middle tabular-nums text-[hsl(var(--foreground))]">
                    {u.attractedUsers.toLocaleString("ru-RU")}
                  </td>
                  <td className="w-24 px-4 py-3.5 text-center align-middle">
                    {!isYou && (
                      <Link
                        href={`/dashboard/analytics?user=${u.id}&compare=1`}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-[hsl(var(--muted))] transition-colors hover:bg-[hsl(var(--surface-muted))] hover:text-[hsl(var(--accent))]"
                        title="Сравнить с ним"
                      >
                        <GitCompare className="h-3.5 w-3.5" />
                        Сравнить
                      </Link>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filteredAndSorted.length === 0 && (
        <p className="mt-4 text-center text-sm text-[hsl(var(--muted))]">
          По вашему запросу никого не найдено
        </p>
      )}

      <YouTuberDetailDrawer
        youtuber={selectedYouTuber}
        onClose={() => setSelectedYouTuber(null)}
      />
    </motion.section>
  );
}

function SortHeader({
  label,
  active,
  asc,
  onSort,
}: {
  label: string;
  active: boolean;
  asc: boolean;
  onSort: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSort}
      className="inline-flex w-full items-center justify-end gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))] transition-colors hover:text-[hsl(var(--foreground))]"
    >
      {label}
      {active ? (
        asc ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
      )}
    </button>
  );
}
