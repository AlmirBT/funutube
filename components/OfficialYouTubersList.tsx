"use client";

import { motion } from "framer-motion";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { officialYouTubersList } from "@/lib/mockData";

export function OfficialYouTubersList() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card-surface overflow-hidden"
      aria-label="Список официальных ютуберов"
    >
      <div className="border-b border-[hsl(var(--border))]/80 bg-[hsl(var(--surface-muted))]/50 px-6 py-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-[hsl(var(--foreground))]">
          <ShieldCheck className="h-4 w-4 text-[hsl(var(--accent))]" strokeWidth={1.75} />
          Список официальных ютуберов
        </h2>
        <p className="mt-1.5 text-[12px] text-[hsl(var(--muted))]">
          Указанным в списке пользователям можно доверять; в случае обмана они будут наказаны Администрацией проекта.
        </p>
      </div>
      <div className="scrollbar-premium overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[hsl(var(--border))]/80">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
                Ютубер
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted))]">
                Дата вступления
              </th>
            </tr>
          </thead>
          <tbody>
            {officialYouTubersList.map((item) => (
              <tr
                key={item.youtubeUrl + item.name}
                className="border-b border-[hsl(var(--border))]/60 last:border-b-0 hover:bg-[hsl(var(--surface-muted))]/30"
              >
                <td className="px-6 py-3">
                  <a
                    href={item.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]"
                  >
                    {item.name}
                    <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                  </a>
                </td>
                <td className="px-6 py-3 text-[hsl(var(--muted))]">{item.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
