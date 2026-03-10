"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DollarSign, Calendar, TrendingUp, CalendarDays, Search, X } from "lucide-react";
import { HeroRevenue } from "@/components/HeroRevenue";
import { StatCard } from "@/components/StatCard";
import { RevenueChart } from "@/components/RevenueChart";
import { TopAnalytics } from "@/components/TopAnalytics";
import { Filters } from "@/components/Filters";
import { PurchasesTable } from "@/components/PurchasesTable";
import { SideDrawer } from "@/components/SideDrawer";
import { PurchasesReport } from "@/components/PurchasesReport";
import {
  kpiStats,
  purchases,
} from "@/lib/mockData";
import type { FiltersState } from "@/components/Filters";
import type { Purchase } from "@/lib/mockData";
import { formatRubles } from "@/lib/currency";
import { getRangeMSK, isDateInRange } from "@/lib/dateUtils";

const defaultFilters: FiltersState = {
  dateRange: "today",
  purchaseType: "all",
  domain: "",
  search: "",
};

export default function DashboardPage() {
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  const purchasesInPeriod = useMemo(() => {
    const range = getRangeMSK(
      filters.dateRange as "today" | "24h" | "week" | "month" | "custom",
      filters.customFrom,
      filters.customTo
    );
    let list = purchases.filter((p) =>
      isDateInRange(p.date, range.from, range.to)
    );
    if (filters.domain) {
      list = list.filter((p) => p.domain === filters.domain);
    }
    return list;
  }, [filters.dateRange, filters.customFrom, filters.customTo, filters.domain]);

  const handleShowDemo = () => {
    setFilters(defaultFilters);
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const clearSearch = () => {
    setFilters((prev) => ({ ...prev, search: "" }));
  };

  return (
    <div className="min-h-screen pt-14 md:pt-0 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-32 right-[-10%] h-72 w-72 rounded-full bg-[hsl(var(--accent))]/10 blur-[120px]" />
        <div className="absolute top-[35%] left-[-15%] h-64 w-64 rounded-full bg-[hsl(var(--accent))]/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[20%] h-80 w-80 rounded-full bg-[hsl(var(--accent))]/6 blur-[140px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
              Дашборд
            </h1>
            <p className="mt-2 text-sm text-[hsl(var(--muted))] sm:text-base">
              Ключевые метрики канала, продажи и активность аудитории в одном месте.
            </p>
          </div>
        </header>

        <section className="mb-10" aria-label="Ваш доход за сегодня">
          <HeroRevenue
            value={kpiStats.revenueToday}
            deltaPercent={kpiStats.revenueTodayDelta}
          />
        </section>

        <section
          className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Доход по периодам"
        >
          <StatCard
            index={0}
            title="Доход за сегодня"
            value={formatRubles(kpiStats.revenueToday)}
            delta={kpiStats.revenueTodayDelta}
            icon={DollarSign}
          />
          <StatCard
            index={1}
            title="Доход за вчера (в это же время)"
            value={formatRubles(kpiStats.revenueYesterdaySameTime)}
            icon={Calendar}
          />
          <StatCard
            index={2}
            title="Доход за неделю"
            value={formatRubles(kpiStats.revenueThisWeek)}
            delta={kpiStats.revenueThisWeekDelta}
            icon={TrendingUp}
          />
          <StatCard
            index={3}
            title="Доход за месяц"
            value={formatRubles(kpiStats.revenueThisMonth)}
            delta={kpiStats.revenueThisMonthDelta}
            icon={CalendarDays}
          />
        </section>

        <section className="mb-6" aria-label="Фильтры">
          <Filters filters={filters} onFiltersChange={setFilters} />
        </section>

        <section className="mb-10" aria-label="График с аналитикой">
          <RevenueChart filters={filters} />
        </section>

        <section className="mb-10" aria-label="Топ-аналитика">
          <TopAnalytics />
        </section>

        <section className="mb-6" aria-label="Отчёт по покупкам">
          <PurchasesReport purchases={purchasesInPeriod} filters={filters} />
        </section>

        <section className="mb-10" aria-label="Список покупок">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-[hsl(var(--muted))]">
                Список покупок
              </h2>
              <p className="mt-1 text-xs text-[hsl(var(--muted))]">
                Поиск по никнейму
              </p>
            </div>
            <div className="w-full max-w-sm">
              <label htmlFor="purchase-search" className="sr-only">
                Поиск по никнейму
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted))]" />
                <input
                  id="purchase-search"
                  type="search"
                  placeholder="Никнейм игрока..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full rounded-full border border-[hsl(var(--border))]/80 bg-[hsl(var(--surface))] py-2.5 pl-10 pr-10 text-[13px] font-medium text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted))] transition-all duration-300 ease-out focus:border-[hsl(var(--accent))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/20 hover:border-[hsl(var(--border))]"
                />
                {filters.search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[hsl(var(--muted))] transition-colors hover:bg-[hsl(var(--surface-muted))] hover:text-[hsl(var(--foreground))]"
                    aria-label="Очистить поиск"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <PurchasesTable
            purchases={purchasesInPeriod}
            filters={filters}
            isLoading={tableLoading}
            onRowClick={setSelectedPurchase}
            onShowDemo={handleShowDemo}
          />
        </section>
      </div>

      <SideDrawer purchase={selectedPurchase} onClose={() => setSelectedPurchase(null)} />
    </div>
  );
}
