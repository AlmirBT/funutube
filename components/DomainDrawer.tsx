"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, DollarSign, Users, Percent, TrendingUp } from "lucide-react";
import { domainsData, youtuberDomain, findDomainStats, kpiStats, type DomainStats } from "@/lib/mockData";
import { formatRubles } from "@/lib/currency";
import { useDomains } from "./DomainsContext";

export function DomainDrawer() {
  const { drawer, closeDrawer } = useDomains();

  useEffect(() => {
    if (drawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  useEffect(() => {
    if (!drawer) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawer, closeDrawer]);

  const isAll = drawer?.type === "all";
  const domainLookup = drawer?.type === "domain" ? findDomainStats(drawer.domain) : null;

  return (
    <AnimatePresence>
      {drawer && (
        <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] dark:bg-black/60"
        onClick={closeDrawer}
        aria-hidden
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 36, stiffness: 220 }}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col border-l border-[hsl(var(--border))]/70 bg-gradient-to-b from-[hsl(var(--surface))] via-[hsl(var(--surface))] to-[hsl(var(--surface-muted))]/40 shadow-soft-lg ring-1 ring-[hsl(var(--border))]/50 dark:bg-[hsl(var(--surface))]/92 dark:shadow-2xl dark:backdrop-blur-xl dark:ring-[hsl(var(--border))]/40"
        role="dialog"
        aria-label={isAll ? "Все домены" : "Статистика по домену"}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[hsl(var(--border))]/70 bg-[hsl(var(--surface))]/95 px-6 py-4 dark:bg-[hsl(var(--surface))]/80">
          <h2 className="min-w-0 truncate text-lg font-semibold tracking-tight text-[hsl(var(--foreground))]">
            {isAll ? "Все домены" : domainLookup?.current.domain ?? (drawer.type === "domain" ? drawer.domain : "")}
          </h2>
          <motion.button
            type="button"
            onClick={closeDrawer}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--surface-muted))] text-[hsl(var(--muted))] transition-colors hover:bg-[hsl(var(--surface))] hover:text-[hsl(var(--foreground))]"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        <div className="scrollbar-premium flex-1 overflow-y-auto p-6">
          {isAll ? (
            <AllDomainsTable />
          ) : domainLookup ? (
            <SingleDomainContent main={domainLookup.main} current={domainLookup.current} />
          ) : (
            <p className="text-sm text-[hsl(var(--muted))]">Домен не найден.</p>
          )}
        </div>
      </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function SingleDomainContent({ main, current }: { main: DomainStats; current: DomainStats }) {
  const allDomainsFlat = domainsData.flatMap((d) => [d, ...(d.subdomains ?? [])]);
  const maxRevenue = Math.max(...allDomainsFlat.map((d) => d.revenue), 1);
  const maxUsers = Math.max(...allDomainsFlat.map((d) => d.attractedUsers), 1);
  const myStats = { revenue: kpiStats.revenueByDomain, attractedUsers: kpiStats.attractedUsersWeek, conversion: kpiStats.domainConversion };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 rounded-2xl bg-[hsl(var(--accent))]/12 p-5 ring-1 ring-[hsl(var(--accent))]/25">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--accent))] text-white">
          <Globe className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <div>
          <p className="font-mono text-lg font-bold tracking-tight text-[hsl(var(--foreground))]">
            {current.domain}
          </p>
          {main.domain !== current.domain && (
            <p className="mt-0.5 text-sm text-[hsl(var(--muted))]">
              Поддомен основного: {main.domain}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatBlock icon={DollarSign} label="Доход по домену" value={formatRubles(current.revenue)} accent />
        <StatBlock icon={Users} label="Привлечённые игроки" value={current.attractedUsers.toLocaleString("ru-RU")} />
        <StatBlock icon={Percent} label="Конверсия домена" value={`${current.conversion}%`} />
      </div>

      {main.subdomains && main.subdomains.length > 0 && (
        <div className="rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface-muted))]/40 p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
            Поддомены ({main.domain})
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center justify-between rounded-lg bg-[hsl(var(--surface))]/50 px-3 py-2 text-[13px]">
              <span className="font-mono font-medium text-[hsl(var(--foreground))]">{main.domain}</span>
              <span className="tabular-nums text-[hsl(var(--accent))]">{formatRubles(main.revenue)} · {main.attractedUsers.toLocaleString("ru-RU")} игроков</span>
            </li>
            {main.subdomains.map((sub) => (
              <li key={sub.domain} className="flex items-center justify-between rounded-lg bg-[hsl(var(--surface))]/50 px-3 py-2 text-[13px]">
                <span className="font-mono font-medium text-[hsl(var(--foreground))]">{sub.domain}</span>
                <span className="tabular-nums text-[hsl(var(--accent))]">{formatRubles(sub.revenue)} · {sub.attractedUsers.toLocaleString("ru-RU")} игроков</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-[hsl(var(--accent))]/25 bg-[hsl(var(--accent))]/8 p-4">
        <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
          <TrendingUp className="h-4 w-4 text-[hsl(var(--accent))]" />
          Сравнение: piona vs этот домен
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface))] p-3">
            <p className="text-[11px] font-semibold uppercase text-[hsl(var(--muted))]">{youtuberDomain.domain}</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-[hsl(var(--accent))]">{formatRubles(myStats.revenue)}</p>
            <p className="text-[12px] text-[hsl(var(--muted))]">{myStats.attractedUsers.toLocaleString("ru-RU")} игроков · {myStats.conversion}%</p>
          </div>
          <div className="rounded-lg border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface))] p-3">
            <p className="text-[11px] font-semibold uppercase text-[hsl(var(--muted))]">{current.domain}</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-[hsl(var(--accent))]">{formatRubles(current.revenue)}</p>
            <p className="text-[12px] text-[hsl(var(--muted))]">{current.attractedUsers.toLocaleString("ru-RU")} игроков · {current.conversion}%</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface-muted))]/40 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
          <TrendingUp className="h-4 w-4" />
          Сравнение с другими доменами
        </h3>
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-[12px] text-[hsl(var(--muted))]">
              <span>Доход</span>
              <span>{formatRubles(current.revenue)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--surface-muted))]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(current.revenue / maxRevenue) * 100}%` }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0.2, 1] }}
                className="h-full rounded-full bg-[hsl(var(--accent))]"
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[12px] text-[hsl(var(--muted))]">
              <span>Привлечённые игроки</span>
              <span>{current.attractedUsers.toLocaleString("ru-RU")}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--surface-muted))]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(current.attractedUsers / maxUsers) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0.2, 1] }}
                className="h-full rounded-full bg-[hsl(var(--accent))]/80"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatBlock({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? "border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/8" : "border-[hsl(var(--border))]/60 bg-[hsl(var(--surface-muted))]/40"}`}>
      <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider text-[hsl(var(--muted))]">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
        {label}
      </div>
      <p className={`mt-2 text-xl font-bold tabular-nums ${accent ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--foreground))]"}`}>
        {value}
      </p>
    </div>
  );
}

function AllDomainsTable() {
  const rows: { domain: string; revenue: number; attractedUsers: number; conversion: number; isSub?: boolean }[] = [];
  domainsData.forEach((d) => {
    rows.push({ domain: d.domain, revenue: d.revenue, attractedUsers: d.attractedUsers, conversion: d.conversion });
    d.subdomains?.forEach((s) => {
      rows.push({ domain: s.domain, revenue: s.revenue, attractedUsers: s.attractedUsers, conversion: s.conversion, isSub: true });
    });
  });
  const sorted = rows.sort((a, b) => b.revenue - a.revenue);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <p className="text-sm text-[hsl(var(--muted))]">
        Таблица всех доменов и поддоменов
      </p>
      <div className="overflow-hidden rounded-2xl border border-[hsl(var(--border))]/60">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-[hsl(var(--surface-muted))]/70">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
                Домен
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
                Доход
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
                Игроки
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
                Конв.
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((d, i) => (
              <tr
                key={d.domain}
                className={`border-t border-[hsl(var(--border))]/50 hover:bg-[hsl(var(--surface-muted))]/30 ${d.isSub ? "bg-[hsl(var(--surface-muted))]/20" : ""}`}
              >
                <td className="px-4 py-3 font-medium text-[hsl(var(--foreground))]">
                  {d.isSub && <span className="mr-2 text-[10px] uppercase text-[hsl(var(--muted))]">поддомен</span>}
                  {i + 1}. {d.domain}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-[hsl(var(--accent))]">
                  {formatRubles(d.revenue)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-[hsl(var(--foreground))]">
                  {d.attractedUsers.toLocaleString("ru-RU")}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-[hsl(var(--muted))]">
                  {d.conversion}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
