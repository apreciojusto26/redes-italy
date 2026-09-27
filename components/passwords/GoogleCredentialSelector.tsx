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
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-black">
        {optional ? "Cuenta de correo relacionada (opcional)" : "¿Con qué cuenta Google? *"}
      </p>

      {credentials.length > 0 ? (
        <div className="space-y-2">
          {optional && (
            <button type="button" onClick={() => onChange(null)} className={`flex min-h-12 w-full items-center gap-3 rounded-2xl border border-[#d1d5db] px-3 text-left text-sm font-bold text-black transition ${value === null ? "bg-[#fff1e7]" : "bg-white"}`}>
              <span className={`size-5 rounded-full border-2 border-[#9ca3af] ${value === null ? "bg-[#e46327] shadow-[inset_0_0_0_4px_white]" : ""}`} />
              Ninguna
            </button>
          )}
          {credentials.map((credential) => {
            const active = value === credential.id;
            return (
              <button key={credential.id} type="button" onClick={() => onChange(credential.id)} className={`flex min-h-12 w-full items-center gap-3 rounded-2xl border border-[#d1d5db] px-3 text-left transition ${active ? "bg-[#fff1e7]" : "bg-white hover:border-[#9ca3af]"}`}>
                {active ? <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-[#e46327]" /> : <span className="size-5 shrink-0 rounded-full border-2 border-[#9ca3af]" />}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-extrabold text-black">{credential.email || credential.username || credential.name}</span>
                  <span className="block truncate text-[11px] font-semibold text-black">{credential.name}</span>
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

      <div className="mt-4 border-t border-[#d1d5db] pt-3">
        <p className="text-xs font-bold text-black">¿No está guardada?</p>
        <button type="button" onClick={onAdd} className="mt-1 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl px-2 text-sm font-extrabold text-[#d85a20] transition hover:bg-[#fff2e9]">
          <Plus aria-hidden="true" className="size-4" />
          Crear nueva cuenta Google
        </button>
      </div>
    </div>
  );
}
