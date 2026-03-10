"use client";

import { motion } from "framer-motion";
import { Globe, Copy, Check, Server, CreditCard } from "lucide-react";
import { youtuberDomain } from "@/lib/mockData";
import { useState } from "react";

const SITE_CATEGORIES = [
  "Привилегии",
  "Акции",
  "Кейсы",
  "Токены",
  "Услуги",
  "Подписка",
] as const;

export function DomainInfo() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(youtuberDomain.domain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0.2, 1] }}
      className="card-surface p-6"
      aria-label="Ваш IP / домен"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--accent))]/12 text-[hsl(var(--accent))]">
            <Globe className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-[hsl(var(--foreground))]">
              Ваш IP / домен
            </h3>
            <p className="text-xs text-[hsl(var(--muted))]">
              {youtuberDomain.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-[hsl(var(--surface-muted))] px-4 py-2">
          <span className="font-mono text-lg font-bold tracking-wide text-[hsl(var(--foreground))]">
            {youtuberDomain.domain}
          </span>
          <motion.button
            type="button"
            onClick={handleCopy}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg p-1.5 text-[hsl(var(--muted))] transition-colors hover:bg-[hsl(var(--border))]/50 hover:text-[hsl(var(--foreground))]"
            aria-label="Скопировать домен"
          >
            {copied ? <Check className="h-4 w-4 text-[hsl(var(--success))]" /> : <Copy className="h-4 w-4" />}
          </motion.button>
        </div>
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        <li className="flex items-start gap-3 rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface-muted))]/50 px-4 py-3">
          <Server className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" strokeWidth={1.75} />
          <div>
            <p className="text-xs font-semibold text-[hsl(var(--foreground))]">Трафик по домену</p>
            <p className="mt-0.5 text-[12px] text-[hsl(var(--muted))]">
              Игроки заходят по ссылке с вашего домена
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3 rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface-muted))]/50 px-4 py-3">
          <Globe className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" strokeWidth={1.75} />
          <div>
            <p className="text-xs font-semibold text-[hsl(var(--foreground))]">Регистрации</p>
            <p className="mt-0.5 text-[12px] text-[hsl(var(--muted))]">
              Привлечённые игроки и доход по домену
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3 rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface-muted))]/50 px-4 py-3">
          <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" strokeWidth={1.75} />
          <div>
            <p className="text-xs font-semibold text-[hsl(var(--foreground))]">Конверсия домена</p>
            <p className="mt-0.5 text-[12px] text-[hsl(var(--muted))]">
              % перехода в покупку по домену
            </p>
          </div>
        </li>
      </ul>

      <div className="mt-4 rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface-muted))]/40 px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-[hsl(var(--muted))]">
          Разделы на сайте по домену
        </p>
        <p className="mt-1.5 text-sm text-[hsl(var(--foreground))]">
          {SITE_CATEGORIES.join(" · ")}
        </p>
      </div>
    </motion.section>
  );
}
