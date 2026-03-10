"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0.2, 1] }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--accent))]/12 text-[hsl(var(--accent))]">
          <LayoutDashboard className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <p className="text-lg font-medium text-[hsl(var(--foreground))]">
          Переход на дашборд...
        </p>
        <p className="text-sm text-[hsl(var(--muted))]">
          Если страница не открылась,{" "}
          <a
            href="/dashboard"
            className="font-medium text-[hsl(var(--accent))] underline underline-offset-2 hover:no-underline"
          >
            нажмите сюда
          </a>
        </p>
      </motion.div>
    </div>
  );
}
