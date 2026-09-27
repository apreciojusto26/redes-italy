"use client";

import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, LoaderCircle, Plus, Star, X } from "lucide-react";
import { GoogleCredentialSelector } from "@/components/passwords/GoogleCredentialSelector";
import { LoginMethodField } from "@/components/passwords/LoginMethodField";
import { inferCredentialProvider } from "@/config/credential-platforms";
import type { Credential, CredentialDraft, LoginMethod } from "@/types/credential";

const inputClass = "min-h-12 w-full rounded-2xl border border-[#e7dcd3] bg-white px-4 text-sm font-bold text-[#3e3028] outline-none transition placeholder:font-medium placeholder:text-[#ae9b90] focus:border-[#e89469] focus:ring-3 focus:ring-[#ed6725]/10";
const labelClass = "mb-2 block text-xs font-extrabold uppercase tracking-[0.12em] text-[#806d62]";

interface SecretInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SecretInput({ value, onChange, placeholder }: SecretInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="new-password"
        className={`${inputClass} pr-12`}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        title={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-xl text-[#806d62] transition hover:bg-[#f7eee8] hover:text-[#d65a21]"
      >
        {visible ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
      </button>
    </div>
  );
}

function draftFromCredential(credential?: Credential): CredentialDraft {
  return {
    name: credential?.name ?? "",
    platform: credential?.platform ?? "",
    category: credential?.category ?? "",
    url: credential?.url ?? "",
    provider: credential?.provider ?? null,
    loginMethod: credential?.loginMethod ?? "password",
    email: credential?.email ?? "",
    username: credential?.username ?? "",
    password: "",
    loginCredentialId: credential?.loginCredentialId ?? null,
    emailCredentialId: credential?.emailCredentialId ?? null,
    accessInstructions: credential?.accessInstructions ?? "",
    notes: credential?.notes ?? "",
    favorite: credential?.favorite ?? false,
  };
}

interface CredentialFormProps {
  credential?: Credential;
  googleCredentials: Credential[];
  onSave: (draft: CredentialDraft) => Promise<void>;
  onCreateGoogle: (email: string, password: string) => Promise<Credential>;
  onCancel: () => void;
}

export function CredentialForm({ credential, googleCredentials, onSave, onCreateGoogle, onCancel }: CredentialFormProps) {
  const [draft, setDraft] = useState(() => draftFromCredential(credential));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [addingGoogle, setAddingGoogle] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googlePassword, setGooglePassword] = useState("");
  const [creatingGoogle, setCreatingGoogle] = useState(false);
  const [duplicateGoogle, setDuplicateGoogle] = useState<Credential | null>(null);
  const googleProviderDetected = inferCredentialProvider(draft.platform, draft.url) === "google";
  const isGoogleProvider = draft.provider === "google" || googleProviderDetected;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting && !creatingGoogle) onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [creatingGoogle, onCancel, submitting]);

  const setField = <Key extends keyof CredentialDraft>(key: Key, value: CredentialDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const changeMethod = (method: LoginMethod) => {
    setDraft((current) => ({ ...current, loginMethod: method }));
  };

  const changePlatform = (platform: string) => {
    setDraft((current) => {
      const previousWasDetected = inferCredentialProvider(current.platform, current.url) === "google";
      const detectedProvider = inferCredentialProvider(platform, current.url);
      return {
        ...current,
        platform,
        provider: detectedProvider ?? (previousWasDetected ? null : current.provider),
      };
    });
  };

  const changeUrl = (url: string) => {
    setDraft((current) => {
      const previousWasDetected = inferCredentialProvider(current.platform, current.url) === "google";
      const detectedProvider = inferCredentialProvider(current.platform, url);
      return {
        ...current,
        url,
        provider: detectedProvider ?? (previousWasDetected ? null : current.provider),
      };
    });
  };

  const selectGoogleCredential = (selected: Credential) => {
    setDraft((current) => ({
      ...current,
      loginCredentialId: current.loginMethod === "google" ? selected.id : current.loginCredentialId,
      emailCredentialId: current.loginMethod === "email_code" || current.loginMethod === "magic_link"
        ? selected.id
        : current.emailCredentialId,
    }));
    setGoogleEmail("");
    setGooglePassword("");
    setDuplicateGoogle(null);
    setAddingGoogle(false);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!draft.name.trim()) return setError("El nombre es obligatorio.");
    if (draft.loginMethod === "google" && !draft.loginCredentialId) {
      return setError("Selecciona la cuenta Google utilizada para acceder.");
    }
    if ((draft.loginMethod === "email_code" || draft.loginMethod === "magic_link") && !draft.email.trim()) {
      return setError("Indica el correo que recibe el acceso.");
    }
    if (draft.loginMethod === "password" && !draft.password && !credential?.encryptedPassword) {
      return setError("Indica la contraseña de esta cuenta.");
    }
    if (draft.loginMethod === "other" && !draft.accessInstructions.trim()) {
      return setError("Describe cómo se inicia sesión en esta cuenta.");
    }

    setSubmitting(true);
    try {
      await onSave(draft);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo guardar la cuenta.");
    } finally {
      setSubmitting(false);
    }
  };

  const createGoogle = async () => {
    setError("");
    setDuplicateGoogle(null);
    if (!googleEmail.trim() || !googlePassword) {
      setError("Añade el correo y la contraseña de la cuenta Google.");
      return;
    }

    const existingGoogle = googleCredentials.find((item) =>
      item.email.trim().toLocaleLowerCase("es") === googleEmail.trim().toLocaleLowerCase("es"));
    if (existingGoogle) {
      setDuplicateGoogle(existingGoogle);
      return;
    }

    setCreatingGoogle(true);
    try {
      const created = await onCreateGoogle(googleEmail.trim(), googlePassword);
      selectGoogleCredential(created);
    } catch (reason) {
      const duplicate = reason && typeof reason === "object" && "existingCredential" in reason
        ? (reason as { existingCredential?: Credential }).existingCredential
        : undefined;
      if (duplicate) {
        setDuplicateGoogle(duplicate);
      } else {
        setError(reason instanceof Error ? reason.message : "No se pudo crear la cuenta Google.");
      }
    } finally {
      setCreatingGoogle(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2b1d17]/50 p-3 backdrop-blur-[3px] sm:p-6" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="credential-form-title" className="mx-auto my-3 w-full max-w-3xl rounded-[26px] border border-white/60 bg-[#fffdfa] shadow-[0_28px_90px_rgba(49,28,17,0.3)] sm:my-8">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-[26px] border-b border-[#ece2da] bg-[#fffdfa]/95 px-5 py-5 backdrop-blur-xl sm:px-7">
          <div>
            <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ad8e7c]">Bóveda privada</p>
            <h2 id="credential-form-title" className="text-xl font-extrabold tracking-[-0.03em] text-[#2b201a]">{credential ? `Editar ${credential.name}` : "Nueva cuenta"}</h2>
          </div>
          <button type="button" onClick={onCancel} aria-label="Cerrar" className="grid size-10 place-items-center rounded-full text-[#806e64] transition hover:bg-[#f4ece6]">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-6 px-5 py-6 sm:px-7 sm:py-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelClass}>Nombre *</span>
              <input value={draft.name} onChange={(event) => setField("name", event.target.value)} placeholder="Temu" className={inputClass} autoFocus />
            </label>
            <label>
              <span className={labelClass}>Plataforma</span>
              <input value={draft.platform} onChange={(event) => changePlatform(event.target.value)} placeholder="Temu" className={inputClass} />
            </label>
            <label>
              <span className={labelClass}>Categoría</span>
              <input value={draft.category} onChange={(event) => setField("category", event.target.value)} placeholder="Compras, redes, hosting…" className={inputClass} />
            </label>
            <label>
              <span className={labelClass}>URL</span>
              <input type="url" value={draft.url} onChange={(event) => changeUrl(event.target.value)} placeholder="https://…" className={inputClass} />
            </label>
          </div>

          <LoginMethodField value={draft.loginMethod} onChange={changeMethod} />

          {draft.loginMethod === "password" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className={labelClass}>Email</span>
                <input type="email" value={draft.email} onChange={(event) => setField("email", event.target.value)} autoComplete="off" className={inputClass} />
              </label>
              <label>
                <span className={labelClass}>Usuario</span>
                <input value={draft.username} onChange={(event) => setField("username", event.target.value)} autoComplete="off" className={inputClass} />
              </label>
              <label className="sm:col-span-2">
                <span className={labelClass}>Contraseña {credential ? <span className="normal-case tracking-normal text-[#a18e82]">(vacía para conservar la actual)</span> : "*"}</span>
                <SecretInput value={draft.password} onChange={(value) => setField("password", value)} />
              </label>
              <button
                type="button"
                onClick={() => setField("provider", googleProviderDetected ? "google" : isGoogleProvider ? null : "google")}
                className={`sm:col-span-2 flex min-h-12 items-center gap-3 rounded-2xl border px-4 text-left transition ${googleProviderDetected ? "cursor-default" : "cursor-pointer"} ${isGoogleProvider ? "border-[#9abce9] bg-[#f0f6ff]" : "border-[#e7dcd3] bg-white hover:border-[#d9c8bc]"}`}
              >
                <span className={`size-5 shrink-0 rounded-full border-2 ${isGoogleProvider ? "border-[#4285f4] bg-[#4285f4] shadow-[inset_0_0_0_4px_white]" : "border-[#d5c7bd]"}`} />
                <span>
                  <span className="block text-sm font-extrabold text-[#403128]">Cuenta Google / Gmail</span>
                  <span className="block text-xs font-semibold text-[#8f7c71]">{googleProviderDetected ? "Detectada automáticamente por la plataforma." : "Permitir usarla en “Continuar con Google”."}</span>
                </span>
              </button>
            </div>
          )}

          {draft.loginMethod === "google" && (
            <GoogleCredentialSelector
              credentials={googleCredentials}
              value={draft.loginCredentialId}
              onChange={(id) => setField("loginCredentialId", id)}
              onAdd={() => setAddingGoogle(true)}
            />
          )}

          {(draft.loginMethod === "email_code" || draft.loginMethod === "magic_link") && (
            <div className="space-y-5">
              <label>
                <span className={labelClass}>{draft.loginMethod === "email_code" ? "Email que recibe el código *" : "Email que recibe el enlace *"}</span>
                <input type="email" value={draft.email} onChange={(event) => setField("email", event.target.value)} autoComplete="off" className={inputClass} />
              </label>
              <GoogleCredentialSelector
                credentials={googleCredentials}
                value={draft.emailCredentialId}
                onChange={(id) => setField("emailCredentialId", id)}
                optional
                onAdd={() => setAddingGoogle(true)}
              />
            </div>
          )}

          {addingGoogle && (
            <div className="rounded-[22px] border border-[#efc5ad] bg-[#fff6ef] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-[#47352b]">Crear nueva cuenta Google</h3>
                  <p className="mt-0.5 text-xs font-semibold text-[#8f7464]">Se guardará como una cuenta independiente.</p>
                </div>
                <button type="button" onClick={() => setAddingGoogle(false)} aria-label="Cerrar alta de Google" className="grid size-9 place-items-center rounded-full text-[#8d7668] hover:bg-white"><X aria-hidden="true" className="size-4" /></button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input type="email" value={googleEmail} onChange={(event) => { setGoogleEmail(event.target.value); setDuplicateGoogle(null); }} placeholder="Correo Google" autoComplete="off" className={inputClass} />
                <SecretInput value={googlePassword} onChange={setGooglePassword} placeholder="Contraseña de Google" />
              </div>
              {duplicateGoogle && (
                <div className="mt-3 rounded-2xl border border-[#efc5ad] bg-white p-3">
                  <p className="text-sm font-extrabold text-[#9d522f]">Esta cuenta Google ya está guardada.</p>
                  <p className="mt-0.5 truncate text-xs font-semibold text-[#806d62]">{duplicateGoogle.email} · {duplicateGoogle.name}</p>
                  <button type="button" onClick={() => selectGoogleCredential(duplicateGoogle)} className="mt-2 min-h-10 cursor-pointer rounded-xl bg-[#e65e23] px-4 text-sm font-extrabold text-white hover:bg-[#d9511b]">
                    Usar esta cuenta
                  </button>
                </div>
              )}
              {!duplicateGoogle && (
                <button type="button" onClick={createGoogle} disabled={creatingGoogle} className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#2d211b] px-4 text-sm font-extrabold text-white disabled:opacity-60">
                  {creatingGoogle ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Plus aria-hidden="true" className="size-4" />}
                  Guardar y usar esta cuenta
                </button>
              )}
            </div>
          )}

          {draft.loginMethod === "other" && (
            <label>
              <span className={labelClass}>Descripción manual *</span>
              <textarea value={draft.accessInstructions} onChange={(event) => setField("accessInstructions", event.target.value)} rows={4} placeholder="Explica cómo iniciar sesión…" className={`${inputClass} resize-y py-3`} />
            </label>
          )}

          <label>
            <span className={labelClass}>Notas</span>
            <textarea value={draft.notes} onChange={(event) => setField("notes", event.target.value)} rows={3} placeholder="Información útil para encontrar o usar esta cuenta…" className={`${inputClass} resize-y py-3`} />
          </label>

          <button type="button" onClick={() => setField("favorite", !draft.favorite)} className={`flex min-h-12 w-full items-center gap-3 rounded-2xl border px-4 text-left text-sm font-extrabold transition ${draft.favorite ? "border-[#efba93] bg-[#fff3e8] text-[#cf571f]" : "border-[#e7dcd3] bg-white text-[#746157]"}`}>
            <Star aria-hidden="true" className="size-5" fill={draft.favorite ? "currentColor" : "none"} />
            {draft.favorite ? "Cuenta favorita" : "Marcar como favorita"}
          </button>

          {error && <p className="rounded-xl bg-[#fff0ec] px-3 py-2 text-sm font-bold text-[#b74722]">{error}</p>}

          <div className="grid grid-cols-2 gap-3 border-t border-[#eee4dc] pt-5">
            <button type="button" onClick={onCancel} disabled={submitting} className="min-h-12 rounded-2xl border border-[#e7dcd3] bg-white px-4 text-sm font-extrabold text-[#5e4b40] transition hover:bg-[#f8f2ed]">Cancelar</button>
            <button type="submit" disabled={submitting} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#e65e23] px-4 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(218,83,27,0.2)] transition hover:bg-[#d9511b] disabled:opacity-60">
              {submitting && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
              {credential ? "Guardar cambios" : "Crear cuenta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
