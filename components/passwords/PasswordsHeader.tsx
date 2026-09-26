import { FileUp, Lock, Plus } from "lucide-react";

interface PasswordsHeaderProps {
  count: number;
  onCreate: () => void;
  onImport: () => void;
  onLock: () => void;
}

export function PasswordsHeader({ count, onCreate, onImport, onLock }: PasswordsHeaderProps) {
  return (
    <header className="relative isolate overflow-hidden rounded-[26px] bg-[linear-gradient(135deg,#f18527_0%,#ed6824_48%,#df4d1e_100%)] px-5 py-6 text-white shadow-[0_18px_50px_rgba(174,70,26,0.17)] sm:px-8 sm:py-8 lg:px-10">
      <div className="absolute -right-16 -top-20 -z-10 size-64 rounded-full border-[42px] border-white/8" />
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] backdrop-blur-sm">
            <span aria-hidden="true" className="text-base leading-none">🔐</span>
            Contraseñas
          </div>
          <h1 className="text-[clamp(1.8rem,6vw,2.7rem)] font-extrabold leading-tight tracking-[-0.045em]">Tus accesos, sin dudas</h1>
          <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-orange-50/85">Encuentra rápidamente cualquier cuenta y cómo acceder.</p>
          <p className="mt-3 text-xs font-bold text-white/65">{count} {count === 1 ? "cuenta guardada" : "cuentas guardadas"}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onImport} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 text-sm font-bold backdrop-blur-sm transition hover:bg-white/20 active:scale-[0.98]">
            <FileUp aria-hidden="true" className="size-4" />
            Importar
          </button>
          <button type="button" onClick={onLock} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 text-sm font-bold backdrop-blur-sm transition hover:bg-white/20 active:scale-[0.98]">
            <Lock aria-hidden="true" className="size-4" />
            Bloquear
          </button>
          <button type="button" onClick={onCreate} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-extrabold text-[#d9541f] shadow-[0_7px_20px_rgba(123,45,17,0.16)] transition hover:bg-[#fff9f4] active:scale-[0.98]">
            <Plus aria-hidden="true" className="size-4" strokeWidth={2.8} />
            Nueva cuenta
          </button>
        </div>
      </div>
    </header>
  );
}
