"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { levelConfig } from "@/lib/mockData";

const MAX_LEVEL = 10;

export function LevelProgress() {
  const { currentLevel, progressPercent, nextLevelAt } = levelConfig;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08, ease: [0.32, 0.72, 0.2, 1] }}
      className="card-surface flex h-full flex-col p-6"
      aria-label="Уровень"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--accent))]/12 text-[hsl(var(--accent))]">
          <Flame className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-[hsl(var(--foreground))]">
            Уровень {currentLevel}
          </h3>
          <p className="text-xs text-[hsl(var(--muted))]">
            из {MAX_LEVEL} · следующий: {nextLevelAt}
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-1 flex-col justify-end">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[hsl(var(--muted))]">Прогресс до уровня {currentLevel + 1}</span>
            <span className="font-medium tabular-nums text-[hsl(var(--foreground))]">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--surface-muted))]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0.2, 1] }}
              className="h-full rounded-full bg-[hsl(var(--accent))]"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
