"use client";

import { motion } from "framer-motion";
import { Ticket, Globe } from "lucide-react";
import { domainsData } from "@/lib/mockData";
import { formatRubles } from "@/lib/currency";
import { useDomains } from "./DomainsContext";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.32, 0.72, 0.2, 1] },
  },
};

export function TopPromoCodes() {
  const { openDomain } = useDomains();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="card-surface p-6 transition-shadow duration-300 ease-out hover:shadow-soft-lg"
    >
      <div className="mb-5 flex items-center gap-2">
        <Ticket className="h-4 w-4 text-[hsl(var(--accent))]" strokeWidth={1.75} />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
          Игроков по доменам
        </h3>
      </div>
      <ul className="space-y-4">
        {domainsData.map((p, i) => (
          <motion.li
            key={p.domain}
            variants={item}
            className={`rounded-xl transition-all ${
              i === 0 ? "bg-[hsl(var(--accent))]/8 ring-1 ring-[hsl(var(--accent))]/25" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => openDomain(p.domain)}
              className="flex w-full items-center gap-4 rounded-xl p-4 text-left transition-colors hover:bg-[hsl(var(--surface-muted))]/60"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  i === 0 ? "bg-[hsl(var(--accent))] text-white" : "bg-[hsl(var(--surface-muted))] text-[hsl(var(--muted))]"
                }`}
              >
                <Globe className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`font-semibold ${i === 0 ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--foreground))]"}`}>
                  {p.domain}
                </p>
                <p className="mt-0.5 text-[13px] text-[hsl(var(--muted))]">
                  Доход: {formatRubles(p.revenue)} · Игроки: {p.attractedUsers.toLocaleString("ru-RU")} · Конв. {p.conversion}%
                </p>
              </div>
            </button>
            {p.subdomains && p.subdomains.length > 0 && (
              <ul className="ml-14 mt-1 space-y-2 border-l-2 border-[hsl(var(--border))]/50 pl-4">
                {p.subdomains.map((sub) => (
                  <li key={sub.domain}>
                    <button
                      type="button"
                      onClick={() => openDomain(sub.domain)}
                      className="flex w-full items-center gap-3 rounded-lg py-2.5 pr-4 text-left transition-colors hover:bg-[hsl(var(--surface-muted))]/50"
                    >
                      <span className="text-[11px] font-medium uppercase text-[hsl(var(--muted))]">поддомен</span>
                      <span className="font-mono text-[13px] font-medium text-[hsl(var(--foreground))]">
                        {sub.domain}
                      </span>
                      <span className="ml-auto text-[12px] tabular-nums text-[hsl(var(--muted))]">
                        {formatRubles(sub.revenue)} · {sub.attractedUsers.toLocaleString("ru-RU")} игроков · {sub.conversion}%
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
