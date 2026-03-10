"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, Lightbulb } from "lucide-react";

const hints = [
  {
    id: "revenue",
    type: "positive" as const,
    icon: TrendingUp,
    text: "Сегодня доход выше среднего на 18%",
    className: "text-[hsl(var(--success))]",
  },
  {
    id: "subs",
    type: "negative" as const,
    icon: AlertCircle,
    text: "Активность подписок снизилась после 20:00",
    className: "text-[hsl(var(--destructive))]",
  },
  {
    id: "domain",
    type: "neutral" as const,
    icon: Lightbulb,
    text: "Ваш домен: трафик и регистрации по домену (привилегии, акции, кейсы, токены, услуги, подписка)",
    className: "text-amber-600 dark:text-amber-400",
  },
];

export function Insights() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.32, 0.72, 0.2, 1] }}
      className="card-muted mt-6 p-4"
      aria-label="Инсайты"
    >
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
        Инсайты
      </p>
      <ul className="flex flex-wrap gap-3 sm:gap-6">
        {hints.map((h, i) => {
          const Icon = h.icon;
          return (
            <motion.li
              key={h.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.1, duration: 0.45, ease: [0.32, 0.72, 0.2, 1] }}
              className="flex items-center gap-2 text-[13px] font-medium text-[hsl(var(--foreground))]"
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--surface-muted))] ${h.className}`}>
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              </span>
              {h.text}
            </motion.li>
          );
        })}
      </ul>
    </motion.section>
  );
}
