import { Lock, Plus } from "lucide-react";

interface PasswordsHeaderProps {
  onCreate: () => void;
  onLock: () => void;
}

export function PasswordsHeader({ onCreate, onLock }: PasswordsHeaderProps) {
  return (
    <header className="relative isolate overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#f18527_0%,#ed6824_48%,#df4d1e_100%)] px-5 py-4 text-white shadow-[0_14px_38px_rgba(174,70,26,0.15)] sm:px-7 sm:py-5 lg:px-8">
      <div className="absolute -right-12 -top-20 -z-10 size-52 rounded-full border-[34px] border-white/8" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[clamp(1.35rem,4.5vw,2rem)] font-extrabold leading-tight tracking-[-0.04em]">Tus accesos en un solo lugar</h1>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onLock} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-white/12 px-3.5 text-xs font-bold backdrop-blur-sm transition hover:bg-white/20 active:scale-[0.98] sm:text-sm">
            <Lock aria-hidden="true" className="size-4" />
            Bloquear
          </button>
          <button type="button" onClick={onCreate} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-white px-3.5 text-xs font-extrabold text-[#d9541f] shadow-[0_6px_16px_rgba(123,45,17,0.14)] transition hover:bg-[#fff9f4] active:scale-[0.98] sm:text-sm">
            <Plus aria-hidden="true" className="size-4" strokeWidth={2.8} />
            Nueva cuenta
          </button>
        </div>
      </div>
    </header>
  );
}
