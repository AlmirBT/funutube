import Link from "next/link";
import { LayoutDashboard, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-8xl font-extrabold tabular-nums tracking-tight text-[hsl(var(--accent))]/20 sm:text-9xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[hsl(var(--foreground))] sm:text-3xl">
          Страница не найдена
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[hsl(var(--muted))]">
          Такой страницы нет. Вернитесь на дашборд или на главную.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/10 px-5 py-3 text-sm font-semibold text-[hsl(var(--accent))] transition-all duration-200 hover:bg-[hsl(var(--accent))]/15 hover:border-[hsl(var(--accent))]/60 hover:shadow-glow-subtle focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/40 focus:ring-offset-2 focus:ring-offset-[hsl(var(--background))]"
          >
            <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Дашборд
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface-muted))] px-5 py-3 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--surface-muted))]/80 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/30 focus:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
