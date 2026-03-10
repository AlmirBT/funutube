"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, DollarSign, Percent, Users, Globe } from "lucide-react";
import { currentYouTuberStats, averageYouTuberStats, kpiStats, domainsData } from "@/lib/mockData";
import { formatRubles } from "@/lib/currency";

const avgRevenueByDomain =
  domainsData.length > 0
    ? domainsData.reduce((s, d) => s + d.revenue, 0) / domainsData.length
    : 0;

const metrics = [
  {
    key: "revenueDay",
    label: "Доход за день",
    your: currentYouTuberStats.revenueDay,
    avg: averageYouTuberStats.revenueDay,
    format: (v: number) => formatRubles(v),
    icon: DollarSign,
  },
  {
    key: "revenueWeek",
    label: "Доход за неделю",
    your: currentYouTuberStats.revenueWeek,
    avg: averageYouTuberStats.revenueWeek,
    format: (v: number) => formatRubles(v),
    icon: DollarSign,
  },
  {
    key: "revenueMonth",
    label: "Доход за месяц",
    your: currentYouTuberStats.revenueMonth,
    avg: averageYouTuberStats.revenueMonth,
    format: (v: number) => formatRubles(v),
    icon: DollarSign,
  },
  {
    key: "conversion",
    label: "Конверсия домена, %",
    your: currentYouTuberStats.conversion,
    avg: averageYouTuberStats.conversion,
    format: (v: number) => `${v.toFixed(1)}%`,
    icon: Percent,
  },
  {
    key: "revenueByDomain",
    label: "Доход по домену",
    your: kpiStats.revenueByDomain,
    avg: Math.round(avgRevenueByDomain),
    format: (v: number) => formatRubles(v),
    icon: Globe,
  },
  {
    key: "attractedUsers",
    label: "Привлечённые игроки за неделю",
    your: currentYouTuberStats.attractedUsers,
    avg: averageYouTuberStats.attractedUsers,
    format: (v: number) => v.toLocaleString("ru-RU"),
    icon: Users,
  },
];

function diffPercent(your: number, avg: number): number {
  if (avg === 0) return 0;
  return ((your - avg) / avg) * 100;
}

export function YouTubersComparison() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0.2, 1] }}
      className="card-surface p-6 sm:p-8"
      aria-label="Сравнение со средним ютубером"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-[hsl(var(--foreground))]">
          piona vs средний ютубер
        </h2>
        <p className="text-sm text-[hsl(var(--muted))]">
          Сравнение ваших показателей со средними по другим ютуберам платформы
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m, i) => {
          const diff = diffPercent(m.your, m.avg);
          const Icon = m.icon;
          return (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface-muted))]/50 p-4"
            >
              <div className="flex items-center gap-2 text-[hsl(var(--muted))]">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[hsl(var(--accent))]/12 text-[hsl(var(--accent))]">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span className="text-xs font-medium uppercase tracking-wider">{m.label}</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <span className="text-xl font-semibold tabular-nums text-[hsl(var(--foreground))]">
                  {m.format(m.your)}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium tabular-nums">
                  {diff > 0 && (
                    <>
                      <TrendingUp className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
                      <span className="text-[hsl(var(--success))]">+{diff.toFixed(1)}%</span>
                    </>
                  )}
                  {diff < 0 && (
                    <>
                      <TrendingDown className="h-3.5 w-3.5 text-[hsl(var(--destructive))]" />
                      <span className="text-[hsl(var(--destructive))]">{diff.toFixed(1)}%</span>
                    </>
                  )}
                  {diff === 0 && (
                    <>
                      <Minus className="h-3.5 w-3.5 text-[hsl(var(--muted))]" />
                      <span className="text-[hsl(var(--muted))]">0%</span>
                    </>
                  )}
                </span>
              </div>
              <p className="mt-1 text-xs text-[hsl(var(--muted))]">
                Среднее: {m.format(m.avg)}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
