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
    <div className="flex min-w-0 items-center gap-0.5" title={label}>
      <span className="sr-only">{label}</span>
      <span className={`w-20 shrink truncate text-xs font-bold sm:w-24 ${hasPassword ? "text-[#45362e]" : "text-[#a39084]"}`}>
        {hasPassword ? visiblePassword ?? "••••••••••" : "Sin contraseña"}
      </span>
      <div className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          onClick={toggleVisibility}
          disabled={!hasPassword}
          aria-label={visiblePassword === null ? "Mostrar contraseña" : "Ocultar contraseña"}
          title={visiblePassword === null ? "Mostrar contraseña" : "Ocultar contraseña"}
          className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-[9px] text-[#806d62] transition hover:bg-[#f0e5dd] hover:text-[#d65a21] disabled:cursor-default disabled:opacity-35"
        >
          {visiblePassword === null ? <Eye aria-hidden="true" className="size-3.5" /> : <EyeOff aria-hidden="true" className="size-3.5" />}
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
