import { CheckCircle2, Plus } from "lucide-react";
import type { Credential } from "@/types/credential";

interface GoogleCredentialSelectorProps {
  credentials: Credential[];
  value: string | null;
  onChange: (id: string | null) => void;
  optional?: boolean;
  onAdd: () => void;
}

export function GoogleCredentialSelector({ credentials, value, onChange, optional, onAdd }: GoogleCredentialSelectorProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#806d62]">
        {optional ? "Cuenta de correo relacionada (opcional)" : "¿Con qué cuenta Google? *"}
      </p>

      {credentials.length > 0 ? (
        <div className="space-y-2">
          {optional && (
            <button type="button" onClick={() => onChange(null)} className={`flex min-h-12 w-full items-center gap-3 rounded-2xl border px-3 text-left text-sm font-bold transition ${value === null ? "border-[#ee9c73] bg-[#fff1e7] text-[#c94f1c]" : "border-[#e8ddd4] bg-white text-[#6f5d53]"}`}>
              <span className={`size-5 rounded-full border-2 ${value === null ? "border-[#e46327] bg-[#e46327] shadow-[inset_0_0_0_4px_white]" : "border-[#d5c7bd]"}`} />
              Ninguna
            </button>
          )}
          {credentials.map((credential) => {
            const active = value === credential.id;
            return (
              <button key={credential.id} type="button" onClick={() => onChange(credential.id)} className={`flex min-h-12 w-full items-center gap-3 rounded-2xl border px-3 text-left transition ${active ? "border-[#ee9c73] bg-[#fff1e7]" : "border-[#e8ddd4] bg-white hover:border-[#e4bdab]"}`}>
                {active ? <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-[#e46327]" /> : <span className="size-5 shrink-0 rounded-full border-2 border-[#d5c7bd]" />}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-extrabold text-[#3f3028]">{credential.email || credential.username || credential.name}</span>
                  <span className="block truncate text-[11px] font-semibold text-[#927f73]">{credential.name}</span>
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#f0d4c2] bg-[#fff6ef] p-4">
          <p className="text-sm font-bold text-[#9d522f]">Esta cuenta Google todavía no está guardada.</p>
        </div>
      )}

      <div className="mt-4 border-t border-[#eee4dc] pt-3">
        <p className="text-xs font-bold text-[#927f73]">¿No está guardada?</p>
        <button type="button" onClick={onAdd} className="mt-1 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl px-2 text-sm font-extrabold text-[#d85a20] transition hover:bg-[#fff2e9]">
          <Plus aria-hidden="true" className="size-4" />
          Crear nueva cuenta Google
        </button>
      </div>
    </div>
  );
}
