"use client";

import { motion } from "framer-motion";
import { Trophy, Globe, Users, TrendingUp, DollarSign } from "lucide-react";
import { domainsData, topUsers } from "@/lib/mockData";
import { formatRubles } from "@/lib/currency";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.32, 0.72, 0.2, 1] },
  },
};

function TopDomainsByRevenue() {
  const sorted = [...domainsData].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  return (
    <motion.article
      variants={item}
      className="card-surface p-6 transition-all duration-300 hover:shadow-glow-subtle sm:p-8"
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--accent))] text-white shadow-lg shadow-[hsl(var(--accent))]/30">
          <DollarSign className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-base font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-lg">
            Топ доменов по доходу
          </h3>
          <p className="mt-0.5 text-[12px] text-[hsl(var(--muted))]">
            Доход по домену за период
          </p>
        </div>
      </div>
      <ul className="space-y-4">
        {sorted.map((d, i) => (
          <li
            key={d.domain}
            className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 ${
              i === 0 ? "bg-[hsl(var(--accent))]/12 ring-1 ring-[hsl(var(--accent))]/30" : "bg-[hsl(var(--surface-muted))]/60"
            }`}
          >
            <span className="flex items-center gap-3 min-w-0">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                i === 0 ? "bg-[hsl(var(--accent))] text-white" : "bg-[hsl(var(--surface))] text-[hsl(var(--muted))]"
              }`}>
                {i + 1}
              </span>
              <span className="truncate font-mono text-[13px] font-medium text-[hsl(var(--foreground))]">
                {d.domain}
              </span>
            </span>
            <span className="shrink-0 text-lg font-bold tabular-nums text-[hsl(var(--accent))]">
              {formatRubles(d.revenue)}
            </span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

function TopDomainsByPlayers() {
  const sorted = [...domainsData].sort((a, b) => b.attractedUsers - a.attractedUsers).slice(0, 5);
  return (
    <motion.article
      variants={item}
      className="card-surface p-6 transition-all duration-300 hover:shadow-glow-subtle sm:p-8"
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--accent))] text-white shadow-lg shadow-[hsl(var(--accent))]/30">
          <Users className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-base font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-lg">
            Топ доменов по привлечённым игрокам
          </h3>
          <p className="mt-0.5 text-[12px] text-[hsl(var(--muted))]">
            Игроки по домену
          </p>
        </div>
      </div>
      <ul className="space-y-4">
        {sorted.map((d, i) => (
          <li
            key={d.domain}
            className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 ${
              i === 0 ? "bg-[hsl(var(--accent))]/12 ring-1 ring-[hsl(var(--accent))]/30" : "bg-[hsl(var(--surface-muted))]/60"
            }`}
          >
            <span className="flex items-center gap-3 min-w-0">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                i === 0 ? "bg-[hsl(var(--accent))] text-white" : "bg-[hsl(var(--surface))] text-[hsl(var(--muted))]"
              }`}>
                {i + 1}
              </span>
              <span className="truncate font-mono text-[13px] font-medium text-[hsl(var(--foreground))]">
                {d.domain}
              </span>
            </span>
            <span className="shrink-0 text-lg font-bold tabular-nums text-[hsl(var(--accent))]">
              {d.attractedUsers.toLocaleString("ru-RU")}
            </span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

function TopPlayersBySpent() {
  const sorted = [...topUsers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
  return (
    <motion.article
      variants={item}
      className="card-surface p-6 transition-all duration-300 hover:shadow-glow-subtle sm:p-8"
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--accent))] text-white shadow-lg shadow-[hsl(var(--accent))]/30">
          <Trophy className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-base font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-lg">
            Топ игроков по сумме покупок
          </h3>
          <p className="mt-0.5 text-[12px] text-[hsl(var(--muted))]">
            Сумма покупок за период
          </p>
        </div>
      </div>
      <ul className="space-y-4">
        {sorted.map((u, i) => (
          <li
            key={u.username}
            className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 ${
              i === 0 ? "bg-[hsl(var(--accent))]/12 ring-1 ring-[hsl(var(--accent))]/30" : "bg-[hsl(var(--surface-muted))]/60"
            }`}
          >
            <span className="flex items-center gap-3 min-w-0">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                i === 0 ? "bg-[hsl(var(--accent))] text-white" : "bg-[hsl(var(--surface))] text-[hsl(var(--muted))]"
              }`}>
                {i + 1}
              </span>
              <span className="truncate font-medium text-[hsl(var(--foreground))]">
                {u.username}
              </span>
            </span>
            <span className="shrink-0 text-lg font-bold tabular-nums text-[hsl(var(--accent))]">
              {formatRubles(u.totalSpent)}
            </span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export function TopStats() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      role="region"
      aria-label="Топы: домены по доходу и игрокам, игроки по покупкам"
    >
      <TopDomainsByRevenue />
      <TopDomainsByPlayers />
      <TopPlayersBySpent />
    </motion.section>
  );
}
