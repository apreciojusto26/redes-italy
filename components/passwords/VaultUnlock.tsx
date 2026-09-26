"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, KeyRound, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import type { VaultStatus } from "@/hooks/useVault";

interface VaultUnlockProps {
  status: VaultStatus;
  error: string;
  onSetup: (password: string) => Promise<void>;
  onUnlock: (password: string) => Promise<void>;
}

export function VaultUnlock({ status, error, onSetup, onUnlock }: VaultUnlockProps) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const isSetup = status === "setup";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (password.length < 10) {
      setFormError("Usa una contraseña maestra de al menos 10 caracteres.");
      return;
    }
    if (isSetup && password !== confirmation) {
      setFormError("Las contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);
    try {
      if (isSetup) await onSetup(password);
      else await onUnlock(password);
      setPassword("");
      setConfirmation("");
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : "No se pudo desbloquear la bóveda.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="grid min-h-[420px] place-items-center rounded-[26px] border border-[#eadfd4] bg-[#fffdfa]">
        <div className="text-center text-[#806d62]">
          <LoaderCircle aria-hidden="true" className="mx-auto size-7 animate-spin text-[#e46527]" />
          <p className="mt-3 text-sm font-bold">Preparando la bóveda…</p>
        </div>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-[26px] border border-[#eadfd4] bg-[#fffdfa] shadow-[0_14px_42px_rgba(75,51,38,0.06)]">
      <div className="bg-[linear-gradient(135deg,#f18527_0%,#ed6824_52%,#df4d1e_100%)] px-5 py-7 text-white sm:px-8 sm:py-9">
        <div className="mb-5 grid size-12 place-items-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-sm">
          <LockKeyhole aria-hidden="true" className="size-6" />
        </div>
        <p className="mb-1 text-sm font-semibold text-orange-50/85">Bóveda privada · Italy Pizza</p>
        <h1 className="text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
          {isSetup ? "Crear contraseña maestra" : "Desbloquear contraseñas"}
        </h1>
      </div>

      <form onSubmit={submit} className="mx-auto max-w-xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-6 flex gap-3 rounded-2xl bg-[#f8eee7] p-4 text-[#6f5749]">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#dc6429]" />
          <p className="text-sm font-medium leading-6">
            {isSetup
              ? "Esta clave cifra todas las contraseñas. No se guarda y no puede recuperarse si la olvidas."
              : "La clave permanece únicamente en este dispositivo mientras la bóveda está abierta."}
          </p>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-[#806d62]">Contraseña maestra</span>
          <span className="flex items-center rounded-2xl border border-[#e7dcd3] bg-white px-3 focus-within:border-[#e89469] focus-within:ring-3 focus-within:ring-[#ed6725]/10">
            <KeyRound aria-hidden="true" className="size-5 shrink-0 text-[#b09b8e]" />
            <input
              type={visible ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isSetup ? "new-password" : "current-password"}
              className="min-h-13 min-w-0 flex-1 bg-transparent px-3 text-sm font-bold outline-none"
              autoFocus
            />
            <button type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Ocultar" : "Mostrar"} className="grid size-10 place-items-center rounded-xl text-[#806d62] hover:bg-[#f8efe9]">
              {visible ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
            </button>
          </span>
        </label>

        {isSetup && (
          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-[#806d62]">Repetir contraseña</span>
            <input
              type={visible ? "text" : "password"}
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="new-password"
              className="min-h-13 w-full rounded-2xl border border-[#e7dcd3] bg-white px-4 text-sm font-bold outline-none transition focus:border-[#e89469] focus:ring-3 focus:ring-[#ed6725]/10"
            />
          </label>
        )}

        {(formError || error) && <p className="mt-4 rounded-xl bg-[#fff0ec] px-3 py-2 text-sm font-bold text-[#b74722]">{formError || error}</p>}

        <button type="submit" disabled={submitting} className="mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#e65e23] px-5 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(218,83,27,0.2)] transition hover:bg-[#d9511b] active:scale-[0.99] disabled:opacity-60">
          {submitting && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
          {isSetup ? "Crear y desbloquear bóveda" : "Desbloquear bóveda"}
        </button>
      </form>
    </section>
  );
}
