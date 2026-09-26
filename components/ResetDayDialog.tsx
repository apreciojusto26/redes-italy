"use client";

import { useEffect, useRef } from "react";
import { AlertCircle, X } from "lucide-react";
import { formatLongDate } from "@/lib/dates";

interface ResetDayDialogProps {
  open: boolean;
  dateKey: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ResetDayDialog({ open, dateKey, onCancel, onConfirm }: ResetDayDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#2b1d17]/45 p-4 backdrop-blur-[3px]" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="reset-title" aria-describedby="reset-description" className="w-full max-w-md rounded-[26px] border border-white/60 bg-[#fffdfa] p-5 shadow-[0_28px_90px_rgba(49,28,17,0.3)] sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <span className="grid size-12 place-items-center rounded-2xl bg-[#fff0e5] text-[#df5c22]">
            <AlertCircle aria-hidden="true" className="size-6" />
          </span>
          <button type="button" onClick={onCancel} aria-label="Cerrar" className="grid size-10 place-items-center rounded-full text-[#806e64] transition hover:bg-[#f4ece6]">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <h2 id="reset-title" className="text-xl font-extrabold tracking-[-0.03em] text-[#2b201a]">¿Reiniciar este día?</h2>
        <p id="reset-description" className="mt-2 text-sm font-medium leading-6 text-[#75645a] first-letter:uppercase">
          Se desmarcarán todas las publicaciones del {formatLongDate(dateKey)}. El resto del historial no cambiará.
        </p>
        <div className="mt-7 grid grid-cols-2 gap-3">
          <button ref={cancelButtonRef} type="button" onClick={onCancel} className="min-h-12 rounded-2xl border border-[#e7dcd3] bg-white px-4 text-sm font-extrabold text-[#5e4b40] transition hover:bg-[#f8f2ed] active:scale-[0.98]">
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} className="min-h-12 rounded-2xl bg-[#e65e23] px-4 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(218,83,27,0.2)] transition hover:bg-[#d9511b] active:scale-[0.98]">
            Sí, reiniciar
          </button>
        </div>
      </div>
    </div>
  );
}
