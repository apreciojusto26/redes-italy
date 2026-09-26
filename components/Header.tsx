import { RotateCcw } from "lucide-react";
import { formatLongDate, getTodayKey } from "@/lib/dates";

interface HeaderProps {
  selectedDate: string;
  onReset: () => void;
}

export function Header({ selectedDate, onReset }: HeaderProps) {
  const isToday = selectedDate === getTodayKey();

  return (
    <header className="relative isolate overflow-hidden rounded-[26px] bg-[linear-gradient(135deg,#f18527_0%,#ed6824_48%,#df4d1e_100%)] px-5 py-6 text-white shadow-[0_18px_50px_rgba(174,70,26,0.17)] sm:px-8 sm:py-8 lg:px-10">
      <div className="absolute -right-16 -top-20 -z-10 size-64 rounded-full border-[42px] border-white/8" />
      <div className="absolute -bottom-20 left-[38%] -z-10 size-44 rounded-full bg-white/6 blur-2xl" />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] backdrop-blur-sm">
            <span aria-hidden="true" className="text-base leading-none">🍕</span>
            Italy Pizza
          </div>
          <p className="mb-1 text-sm font-semibold text-orange-50/85">
            {isToday ? "Actividad diaria de redes sociales" : "Consulta de publicaciones"}
          </p>
          <h1 className="text-[clamp(1.7rem,6vw,2.7rem)] font-extrabold leading-tight tracking-[-0.045em] first-letter:uppercase">
            {formatLongDate(selectedDate)}
          </h1>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-[0.98]"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          Reiniciar día
        </button>
      </div>
    </header>
  );
}
