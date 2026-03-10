"use client";

import { motion } from "framer-motion";
import { Award, Lock } from "lucide-react";
import { achievements } from "@/lib/mockData";

export function Achievements() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12, ease: [0.32, 0.72, 0.2, 1] }}
      className="card-surface flex h-full flex-col p-6"
      aria-label="Достижения"
    >
      <div className="mb-4 flex items-center gap-2">
        <Award className="h-4 w-4 text-[hsl(var(--accent))]" strokeWidth={1.75} />
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
          Достижения
        </h3>
      </div>
      <ul className="space-y-2">
        {achievements.map((a, i) => (
          <motion.li
            key={a.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
              a.unlocked ? "bg-[hsl(var(--success))]/10" : "bg-[hsl(var(--surface-muted))]/50 opacity-70"
            }`}
          >
            {a.unlocked ? (
              <span className="text-lg" aria-hidden>🏅</span>
            ) : (
              <Lock className="h-4 w-4 shrink-0 text-[hsl(var(--muted))]" strokeWidth={1.75} />
            )}
            <span className={`text-sm font-medium ${a.unlocked ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted))]"}`}>
              {a.title}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}
