"use client";

import { motion } from "framer-motion";
import { Percent, Users, Globe } from "lucide-react";
import { kpiStats } from "@/lib/mockData";
import { formatRubles } from "@/lib/currency";
import type { FiltersState } from "@/components/Filters";

interface PurchasesReportProps {
  purchases: unknown[];
  filters: FiltersState;
}

export function PurchasesReport({ filters: _filters }: PurchasesReportProps) {
  const cards = [
    { title: "Привлечённые игроки за неделю", value: kpiStats.attractedUsersWeek.toLocaleString("ru-RU"), icon: Users, delta: kpiStats.attractedUsersWeekDelta },
    { title: "Доход по домену", value: formatRubles(kpiStats.revenueByDomain), icon: Globe, delta: kpiStats.revenueByDomainDelta },
    { title: "Конверсия домена", value: `${kpiStats.domainConversion}%`, icon: Percent },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: [0.32, 0.72, 0.2, 1] }}
      className="grid gap-4 sm:grid-cols-3"
      aria-label="Отчёт по покупкам"
    >
      {cards.map((card, i) => (
        <motion.article
          key={card.title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 + i * 0.04 }}
          className="card-surface flex items-center gap-4 p-5 transition-all duration-300 hover:shadow-glow-subtle"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--accent))]/12 text-[hsl(var(--accent))]">
            <card.icon className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-medium uppercase tracking-wider text-[hsl(var(--muted))]">
              {card.title}
            </p>
            <p className="mt-0.5 truncate text-lg font-semibold tabular-nums text-[hsl(var(--foreground))]">
              {card.value}
            </p>
            {card.delta != null && (
              <p className="mt-0.5 text-xs font-medium text-[hsl(var(--success))]">
                +{card.delta}%
              </p>
            )}
          </div>
        </motion.article>
      ))}
    </motion.section>
  );
}
