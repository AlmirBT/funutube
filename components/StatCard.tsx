"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string;
  delta?: number;
  subtitle?: string;
  icon: LucideIcon;
  index?: number;
}

export function StatCard({
  title,
  value,
  delta,
  subtitle,
  icon: Icon,
  index = 0,
}: StatCardProps) {
  const isPositive = delta != null && delta > 0;
  const isNegative = delta != null && delta < 0;
  const isNeutral = delta != null && delta === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: (index ?? 0) * 0.06,
        ease: [0.32, 0.72, 0.2, 1],
      }}
      className="card-surface group p-6 transition-all duration-[400ms] ease-out hover:shadow-soft-lg hover:shadow-glow-subtle dark:shadow-soft-dark dark:hover:shadow-soft-dark-lg dark:hover:shadow-glow-subtle"
      whileTap={{ scale: 0.998 }}
    >
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium tracking-tight text-[hsl(var(--muted))]">{title}</p>
          <motion.p
            className="mt-2 truncate text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl text-[hsl(var(--foreground))] transition-colors duration-300"
          >
            {value}
          </motion.p>
          {(delta != null || subtitle) && (
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {delta != null && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[13px] font-medium tabular-nums ${
                    isPositive
                      ? "text-[hsl(var(--success))]"
                      : isNegative
                        ? "text-[hsl(var(--destructive))]"
                        : isNeutral
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-[hsl(var(--muted))]"
                  }`}
                >
                  {isPositive && <TrendingUp className="h-3.5 w-3.5" />}
                  {isNegative && <TrendingDown className="h-3.5 w-3.5" />}
                  {delta != null && `${isPositive ? "+" : ""}${delta.toFixed(1)}%`}
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-[hsl(var(--muted))]">{subtitle}</span>
              )}
            </div>
          )}
        </div>
        <motion.div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--accent))]/12 text-[hsl(var(--accent))] transition-all duration-300 ease-out group-hover:bg-[hsl(var(--accent))] group-hover:text-[hsl(var(--accent-foreground))] group-hover:shadow-[0_0_24px_-8px_hsl(var(--accent)/0.5)]"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0.2, 1] }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </motion.div>
      </div>
    </motion.article>
  );
}
