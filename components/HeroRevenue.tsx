"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { formatRubles } from "@/lib/currency";

interface HeroRevenueProps {
  value: number;
  deltaPercent: number;
}

export function HeroRevenue({ value, deltaPercent }: HeroRevenueProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { stiffness: 30, damping: 24 });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplayValue(Math.round(v)));
    return () => unsub();
  }, [spring]);

  const isPositive = deltaPercent > 0;
  const isNegative = deltaPercent < 0;
  const displayFormatted = formatRubles(displayValue);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.32, 0.72, 0.2, 1] }}
      className="card-surface px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12 transition-shadow duration-500 hover:shadow-glow dark:hover:shadow-glow-dark"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[hsl(var(--accent))]/16 via-transparent to-[hsl(var(--accent-dark))]/12" />
      <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[hsl(var(--accent))]/18 blur-[90px]" />
      <div className="absolute -left-12 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-[hsl(var(--accent))]/14 blur-2xl" />
      <motion.div
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.32, 0.72, 0.2, 1] }}
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[hsl(var(--accent))]/10"
        aria-hidden
      />
      <div className="relative">
        <p className="text-sm font-medium tracking-tight text-[hsl(var(--muted))] sm:text-base">
          Ваш доход за сегодня
        </p>
        <p className="text-money-hero glow-number mt-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl md:text-6xl">
          {displayFormatted}
        </p>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [0.32, 0.72, 0.2, 1] }}
          className={`mt-3 inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums sm:text-base ${
            isPositive
              ? "text-[hsl(var(--success))]"
              : isNegative
                ? "text-[hsl(var(--destructive))]"
                : "text-amber-600 dark:text-amber-400"
          }`}
        >
          {isPositive ? "+" : ""}{deltaPercent.toFixed(1)}% к вчерашнему дню
        </motion.p>
      </div>
      <div
        className="absolute -bottom-12 left-1/2 h-28 w-4/5 -translate-x-1/2 rounded-full bg-[hsl(var(--accent))]/20 blur-[80px]"
        aria-hidden
      />
    </motion.section>
  );
}
