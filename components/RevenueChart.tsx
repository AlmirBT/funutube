"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { chartData, type ChartDataPoint } from "@/lib/mockData";
import { getRangeMSK, isDateInRange } from "@/lib/dateUtils";
import type { FiltersState } from "@/components/Filters";
import { usdToRub, formatRubles } from "@/lib/currency";

type Metric = "revenue" | "purchases" | "newPlayers" | "totalUsersPassed";

const metricLabels: Record<Metric, string> = {
  revenue: "Доход",
  purchases: "Покупки",
  newPlayers: "Новые игроки",
  totalUsersPassed: "Всего игроков прошло",
};

const formatTooltip = (value: number, metric: Metric) => {
  if (metric === "revenue") return formatRubles(value);
  return value.toLocaleString("ru-RU");
};

interface RevenueChartProps {
  filters?: FiltersState;
}

export function RevenueChart({ filters }: RevenueChartProps) {
  const [metric, setMetric] = useState<Metric>("revenue");

  const metrics: Metric[] = ["revenue", "purchases", "newPlayers", "totalUsersPassed"];

  const data = useMemo(() => {
    const range = filters
      ? getRangeMSK(filters.dateRange, filters.customFrom, filters.customTo)
      : { from: new Date(0), to: new Date() };
    const filtered = chartData.filter((d) =>
      isDateInRange(d.date, range.from, range.to)
    );
    return filtered.map((d) => ({
      ...d,
      dateLabel: new Date(d.date).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
      }),
      rub: usdToRub(d.revenue),
    }));
  }, [filters?.dateRange, filters?.customFrom, filters?.customTo]);

  const dataKey =
    metric === "revenue"
      ? "rub"
      : metric === "purchases"
        ? "purchases"
        : metric === "newPlayers"
          ? "newPlayers"
          : "totalUsersPassed";

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: unknown }>; label?: string }) => {
    if (!active || !payload?.length || !label) return null;
    const p = payload[0]?.payload as ChartDataPoint & { dateLabel?: string; rub?: number };
    const dateLabel = typeof label === "string" ? label : String(label);
    const value =
      metric === "revenue"
        ? p.revenue
        : metric === "purchases"
          ? p.purchases
          : metric === "newPlayers"
            ? p.newPlayers
            : p.totalUsersPassed;
    return (
      <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface-elevated))] px-4 py-3 shadow-soft-lg dark:shadow-soft-dark-lg">
        <p className="mb-2 text-xs font-medium text-[hsl(var(--muted))]">{dateLabel}</p>
        <p className="text-sm font-semibold tabular-nums text-[hsl(var(--foreground))]">
          {value != null ? formatTooltip(value, metric) : "—"}
        </p>
      </div>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12, ease: [0.32, 0.72, 0.2, 1] }}
      className="card-surface p-6 sm:p-8 transition-shadow duration-500 hover:shadow-glow-subtle"
    >
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[hsl(var(--foreground))]">
            Аналитика
          </h2>
          <p className="mt-1 text-sm text-[hsl(var(--muted))]">Динамика ключевых метрик по периоду</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {metrics.map((m) => (
            <motion.button
              key={m}
              type="button"
              onClick={() => setMetric(m)}
              whileTap={{ scale: 0.98 }}
              className={`pill-button ${
                metric === m
                  ? "pill-button-active"
                  : "pill-button-inactive"
              }`}
            >
              {metricLabels[m]}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full sm:h-[340px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={metric}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) =>
                    metric === "revenue" && v >= 1000
                      ? `${(v / 1000).toFixed(0)}k`
                      : String(v)
                  }
                  tick={{ fontSize: 11, fill: "hsl(var(--muted))" }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  fill="url(#fillRevenue)"
                />
                <Legend
                  formatter={() => metricLabels[metric]}
                  wrapperStyle={{ fontSize: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
