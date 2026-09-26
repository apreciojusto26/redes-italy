"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { CopyButton } from "@/components/passwords/CopyButton";
import { decryptPassword } from "@/lib/credential-crypto";

interface PasswordFieldProps {
  encryptedPassword: string | null;
  passwordIv: string | null;
  vaultKey: CryptoKey;
  label?: string;
  onToast: (message: string) => void;
}

export function PasswordField({
  encryptedPassword,
  passwordIv,
  vaultKey,
  label = "Contraseña",
  onToast,
}: PasswordFieldProps) {
  const [visiblePassword, setVisiblePassword] = useState<string | null>(null);
  const hasPassword = Boolean(encryptedPassword && passwordIv);

  const decrypt = async () => {
    if (!encryptedPassword || !passwordIv) return "";
    return decryptPassword(encryptedPassword, passwordIv, vaultKey);
  };

  const toggleVisibility = async () => {
    if (visiblePassword !== null) {
      setVisiblePassword(null);
      return;
    }

    try {
      setVisiblePassword(await decrypt());
    } catch {
      onToast("No se pudo descifrar la contraseña");
    }
  };

  return (
    <div>
      <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#a18c7f]">{label}</p>
      <div className="flex min-h-12 items-center gap-2 rounded-2xl border border-[#ece2da] bg-[#fffefa] p-1 pl-3.5">
        <span className={`min-w-0 flex-1 truncate text-sm font-bold ${hasPassword ? "text-[#45362e]" : "text-[#a39084]"}`}>
          {hasPassword ? visiblePassword ?? "••••••••••••" : "Sin contraseña guardada"}
        </span>
        <button
          type="button"
          onClick={toggleVisibility}
          disabled={!hasPassword}
          aria-label={visiblePassword === null ? "Mostrar contraseña" : "Ocultar contraseña"}
          title={visiblePassword === null ? "Mostrar contraseña" : "Ocultar contraseña"}
          className="grid size-10 shrink-0 place-items-center rounded-xl text-[#806d62] transition hover:bg-[#f8efe9] hover:text-[#d65a21] disabled:opacity-35"
        >
          {visiblePassword === null ? <Eye aria-hidden="true" className="size-4" /> : <EyeOff aria-hidden="true" className="size-4" />}
        </button>
        <CopyButton
          getValue={decrypt}
          message="Contraseña copiada"
          onToast={onToast}
          disabled={!hasPassword}
        />
      </div>
    </div>
  );
}
