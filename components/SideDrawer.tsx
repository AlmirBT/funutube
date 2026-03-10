"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Tag, Calendar, DollarSign } from "lucide-react";
import type { Purchase, PurchaseType, PurchaseStatus } from "@/lib/mockData";
import { formatRubles } from "@/lib/currency";

const typeLabels: Record<PurchaseType, string> = {
  privileges: "Привилегии",
  promotions: "Акции",
  cases: "Кейсы",
  tokens: "Токены",
  services: "Услуги",
  subscription: "Подписка",
};
const statusLabels: Record<PurchaseStatus, string> = {
  completed: "Выполнено",
  pending: "В ожидании",
  refunded: "Возврат",
  failed: "Ошибка",
};
const statusStyles: Record<PurchaseStatus, string> = {
  completed: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  refunded: "bg-[hsl(var(--muted))]/15 text-[hsl(var(--muted))]",
  failed: "bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))]",
};

interface SideDrawerProps {
  purchase: Purchase | null;
  onClose: () => void;
}

export function SideDrawer({ purchase, onClose }: SideDrawerProps) {
  useEffect(() => {
    if (purchase) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [purchase]);

  useEffect(() => {
    if (!purchase) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [purchase, onClose]);

  return (
    <AnimatePresence>
      {purchase && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0.2, 1] }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 36, stiffness: 220 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[hsl(var(--border))]/70 bg-[hsl(var(--surface))]/90 shadow-2xl backdrop-blur-xl"
            role="dialog"
            aria-label="Детали покупки"
          >
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))]/70 px-6 py-4">
              <h2 className="text-lg font-semibold tracking-tight text-[hsl(var(--foreground))]">
                Детали покупки
              </h2>
              <motion.button
                type="button"
                onClick={onClose}
                whileTap={{ scale: 0.95 }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--surface-muted))] text-[hsl(var(--muted))] transition-colors hover:bg-[hsl(var(--surface))] hover:text-[hsl(var(--foreground))]"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
            <div className="scrollbar-premium flex-1 overflow-y-auto p-6">
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
                }}
                className="space-y-6"
              >
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.35, ease: [0.32, 0.72, 0.2, 1] }}
                  className="flex items-center gap-4 rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface-muted))]/60 p-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--accent))]/12 text-[hsl(var(--accent))]">
                    <User className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-semibold text-[hsl(var(--foreground))]">
                      {purchase.nickname}
                    </p>
                    <p className="text-sm text-[hsl(var(--muted))]">
                      @{purchase.username}
                    </p>
                  </div>
                </motion.div>
                <div className="space-y-3">
                  <Row index={0} icon={Tag} label="IP / домен" value={purchase.domain} />
                  <Row
                    index={1}
                    icon={DollarSign}
                    label="Сумма"
                    value={formatRubles(purchase.amount, { decimals: 2 })}
                  />
                  <Row
                    index={2}
                    icon={Calendar}
                    label="Дата и время"
                    value={new Date(purchase.date).toLocaleString("ru-RU", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  />
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.35, ease: [0.32, 0.72, 0.2, 1] }}
                    className="flex items-center justify-between rounded-xl border border-[hsl(var(--border))]/60 px-4 py-3"
                  >
                    <span className="text-sm text-[hsl(var(--muted))]">
                      Статус
                    </span>
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium ${statusStyles[purchase.status]}`}
                    >
                      {statusLabels[purchase.status]}
                    </span>
                  </motion.div>
                </div>
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.35, ease: [0.32, 0.72, 0.2, 1] }}
                  className="rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--surface-muted))]/40 p-4"
                >
                  <p className="text-xs font-medium text-[hsl(var(--muted))]">
                    Раздел
                  </p>
                  <p className="mt-1 font-medium text-[hsl(var(--foreground))]">
                    {typeLabels[purchase.type]}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({
  index,
  icon: Icon,
  label,
  value,
}: {
  index?: number;
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  const I = Icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: (index ?? 0) * 0.06 + 0.15, ease: [0.32, 0.72, 0.2, 1] }}
      className="flex items-center justify-between rounded-xl border border-[hsl(var(--border))]/60 px-4 py-3"
    >
      <span className="flex items-center gap-2 text-sm text-[hsl(var(--muted))]">
        <I className="h-4 w-4" strokeWidth={1.75} />
        {label}
      </span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: (index ?? 0) * 0.06 + 0.25 }}
        className="font-medium tabular-nums text-[hsl(var(--foreground))]"
      >
        {value}
      </motion.span>
    </motion.div>
  );
}
