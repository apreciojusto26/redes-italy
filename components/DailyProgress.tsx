import { CheckCircle2 } from "lucide-react";

interface DailyProgressProps {
  completed: number;
  total: number;
  percentage: number;
}

export function DailyProgress({ completed, total, percentage }: DailyProgressProps) {
  const isComplete = total > 0 && completed === total;

  return (
    <section aria-labelledby="daily-progress-title" className="rounded-[24px] border border-[#d1d5db] bg-white p-5 shadow-[0_12px_35px_rgba(17,24,39,0.05)] sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-black">Resumen diario</p>
          <h2 id="daily-progress-title" className="text-lg font-extrabold tracking-[-0.025em] text-black sm:text-xl">
            {isComplete ? "Todo publicado por hoy 🎉" : "Progreso de hoy"}
          </h2>
        </div>
        <div className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-extrabold ${isComplete ? "bg-[#e7f4e9] text-[#367a45]" : "bg-[#f9e9dd] text-[#d85a20]"}`}>
          {isComplete && <CheckCircle2 aria-hidden="true" className="size-4" />}
          {percentage}% <span className="font-semibold opacity-70">({completed}/{total})</span>
        </div>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-[#e5e7eb]" role="progressbar" aria-label="Progreso de publicaciones" aria-valuemin={0} aria-valuemax={total} aria-valuenow={completed}>
        <div
          className={`h-full rounded-full transition-[width,background-color] duration-500 ease-out ${isComplete ? "bg-[#54a766]" : "bg-[linear-gradient(90deg,#f18724,#e85a20)]"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-3 text-sm font-medium text-black">
        {isComplete ? "Buen trabajo. La distribución del día está completa." : `${total - completed} ${total - completed === 1 ? "publicación pendiente" : "publicaciones pendientes"}`}
      </p>
    </section>
  );
}
