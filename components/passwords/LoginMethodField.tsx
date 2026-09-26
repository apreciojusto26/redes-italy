import { KeyRound, Link2, Mail, MoreHorizontal, ShieldCheck } from "lucide-react";
import type { LoginMethod } from "@/types/credential";

const methods: Array<{ id: LoginMethod; label: string; icon: typeof KeyRound }> = [
  { id: "password", label: "Contraseña", icon: KeyRound },
  { id: "google", label: "Continuar con Google", icon: ShieldCheck },
  { id: "email_code", label: "Código por email", icon: Mail },
  { id: "magic_link", label: "Magic link", icon: Link2 },
  { id: "other", label: "Otro", icon: MoreHorizontal },
];

export function LoginMethodField({ value, onChange }: { value: LoginMethod; onChange: (value: LoginMethod) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#806d62]">Método de acceso *</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {methods.map(({ id, label, icon: Icon }) => {
          const active = value === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(id)}
              className={`flex min-h-12 items-center gap-2 rounded-2xl border px-3 text-left text-xs font-extrabold transition ${
                active
                  ? "border-[#ee9c73] bg-[#fff1e7] text-[#c94f1c]"
                  : "border-[#e8ddd4] bg-white text-[#756259] hover:border-[#e4bdab]"
              }`}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              {label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
