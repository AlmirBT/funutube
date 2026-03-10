"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Users } from "lucide-react";
import { newVsReturning } from "@/lib/mockData";

const data = [
  { name: "Новые", value: newVsReturning.newPercent, color: "hsl(var(--accent))" },
  { name: "Возвращающиеся", value: newVsReturning.returningPercent, color: "hsl(var(--success))" },
];

export function NewVsReturning() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: [0.32, 0.72, 0.2, 1] }}
      className="card-surface flex h-full flex-col p-6"
      aria-label="Новые и возвращающиеся покупатели"
    >
      <div className="mb-4 flex items-center gap-2">
        <Users className="h-4 w-4 text-[hsl(var(--accent))]" strokeWidth={1.75} />
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
          Новые vs Возвращающиеся
        </h3>
      </div>
      <p className="mb-4 text-[13px] text-[hsl(var(--muted))]">
        Лояльность аудитории
      </p>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              stroke="transparent"
            >
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value}%`}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--surface-elevated))",
                color: "hsl(var(--foreground))",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-[13px] text-[hsl(var(--foreground))]">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex justify-center gap-6 text-center">
        <div>
          <p className="text-2xl font-bold tabular-nums text-[hsl(var(--accent))]">{newVsReturning.newPercent}%</p>
          <p className="text-[11px] text-[hsl(var(--muted))]">Новые</p>
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums text-[hsl(var(--success))]">{newVsReturning.returningPercent}%</p>
          <p className="text-[11px] text-[hsl(var(--muted))]">Постоянные</p>
        </div>
      </div>
    </motion.section>
  );
}
