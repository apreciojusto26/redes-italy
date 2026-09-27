"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  KeyRound,
  Link2,
  Mail,
  MoreHorizontal,
  Pencil,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";
import { CopyButton } from "@/components/passwords/CopyButton";
import { PasswordField } from "@/components/passwords/PasswordField";
import { PlatformLogo } from "@/components/passwords/PlatformLogo";
import type { Credential, LoginMethod } from "@/types/credential";

const methodLabels: Record<LoginMethod, { label: string; icon: typeof KeyRound }> = {
  password: { label: "Acceso con contraseña", icon: KeyRound },
  google: { label: "Acceso con Gmail", icon: ShieldCheck },
  email_code: { label: "Acceso con código", icon: Mail },
  magic_link: { label: "Acceso con enlace", icon: Link2 },
  other: { label: "Otro tipo de acceso", icon: MoreHorizontal },
};

interface InlineValueProps {
  label: string;
  value: string;
  copyMessage: string;
  onToast: (message: string) => void;
}

function InlineValue({ label, value, copyMessage, onToast }: InlineValueProps) {
  if (!value) return null;

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1" title={`${label}: ${value}`}>
      <span className="sr-only">{label}</span>
      <span className="min-w-0 flex-1 truncate text-xs font-bold text-black">{value}</span>
      <CopyButton getValue={() => value} message={copyMessage} onToast={onToast} />
    </div>
  );
}

function relatedAccessDescription(credential: Credential, googleCredentialId: string): string {
  const descriptions: string[] = [];

  if (credential.loginCredentialId === googleCredentialId) {
    descriptions.push(
      credential.loginMethod === "google"
        ? "Usa este Gmail para iniciar sesión"
        : "Usa esta cuenta para iniciar sesión",
    );
  }
  if (credential.emailCredentialId === googleCredentialId) {
    descriptions.push(
      credential.loginMethod === "email_code"
        ? "Recibe aquí los códigos de acceso"
        : credential.loginMethod === "magic_link"
          ? "Recibe aquí los enlaces de acceso"
          : "Usa este Gmail como correo relacionado",
    );
  }

  return descriptions.join(" · ");
}

interface CredentialCardProps {
  credential: Credential;
  credentialMap: Map<string, Credential>;
  vaultKey: CryptoKey;
  onEdit: (credential: Credential) => void;
  onDelete: (credential: Credential) => void;
  onToggleFavorite: (credential: Credential) => void;
  highlighted: boolean;
  onNavigateToCredential: (credentialId: string) => void;
  onToast: (message: string) => void;
}

export function CredentialCard({
  credential,
  credentialMap,
  vaultKey,
  onEdit,
  onDelete,
  onToggleFavorite,
  highlighted,
  onNavigateToCredential,
  onToast,
}: CredentialCardProps) {
  const [expanded, setExpanded] = useState(false);
  const method = methodLabels[credential.loginMethod];
  const MethodIcon = method.icon;
  const loginCredential = credential.loginCredentialId
    ? credentialMap.get(credential.loginCredentialId) ?? null
    : null;
  const emailCredential = credential.emailCredentialId
    ? credentialMap.get(credential.emailCredentialId) ?? null
    : null;
  const normalizedName = credential.name.trim().toLocaleLowerCase("es");
  const normalizedPlatform = credential.platform.trim().toLocaleLowerCase("es");
  const metadata = normalizedPlatform && normalizedPlatform !== normalizedName ? credential.platform : "";
  const isGoogleProvider = credential.provider === "google";
  const relatedCredentials = isGoogleProvider
    ? Array.from(credentialMap.values()).filter((item) =>
        item.id !== credential.id && (
          item.loginCredentialId === credential.id || item.emailCredentialId === credential.id
        ))
    : [];
  const canExpand = relatedCredentials.length > 0;
  const relationCountLabel = `${relatedCredentials.length} ${relatedCredentials.length === 1 ? "vinculada" : "vinculadas"}`;

  const identityValues = credential.loginMethod === "google"
    ? loginCredential
      ? [{ label: "Cuenta Google", value: loginCredential.email || loginCredential.username, message: "Correo Google copiado" }]
      : []
    : credential.loginMethod === "email_code" || credential.loginMethod === "magic_link"
      ? [{ label: "Correo", value: credential.email, message: "Email copiado" }]
      : [
          { label: "Email", value: credential.email, message: "Email copiado" },
          { label: "Usuario", value: credential.username, message: "Usuario copiado" },
        ].filter((item) => item.value);

  const passwordCredential = credential.loginMethod === "password"
    ? credential
    : credential.loginMethod === "google"
      ? loginCredential
      : credential.loginMethod === "email_code" || credential.loginMethod === "magic_link"
        ? emailCredential
        : null;

  return (
    <article
      id={`credential-${credential.id}`}
      className={`overflow-hidden rounded-[18px] border bg-white px-3.5 py-2.5 transition duration-300 sm:px-4 ${highlighted ? "border-[#9ca3af] shadow-[0_0_0_4px_rgba(237,112,47,0.15),0_10px_28px_rgba(17,24,39,0.08)]" : "border-[#d1d5db] shadow-[0_5px_18px_rgba(17,24,39,0.035)] hover:border-[#9ca3af] hover:shadow-[0_8px_24px_rgba(17,24,39,0.06)]"}`}
    >
      <div className="flex min-h-8 min-w-0 items-center gap-2.5">
        {isGoogleProvider ? (
          <button
            type="button"
            onClick={() => canExpand && setExpanded((current) => !current)}
            disabled={!canExpand}
            aria-expanded={canExpand ? expanded : undefined}
            aria-controls={canExpand ? `linked-credentials-${credential.id}` : undefined}
            className={`flex min-w-0 flex-1 items-center gap-2.5 text-left ${canExpand ? "cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#e66a27]/35" : "cursor-default"}`}
          >
            <PlatformLogo name={credential.name} platform={credential.platform} url={credential.url} />
            <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-1">
              <h2 className="max-w-full break-words text-sm font-extrabold tracking-[-0.02em] text-black [overflow-wrap:anywhere]">{credential.name}</h2>
              {metadata && <span className="max-w-full break-words text-[11px] font-semibold text-[#6b7280] [overflow-wrap:anywhere]">· {metadata}</span>}
            </div>
            <span className="hidden shrink-0 text-[10px] font-extrabold text-[#6b7280] sm:inline">· {relationCountLabel}</span>
            {canExpand && (
              <ChevronRight aria-hidden="true" className={`size-3.5 shrink-0 text-[#6b7280] transition-transform duration-200 ${expanded ? "rotate-90" : ""}`} />
            )}
          </button>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <PlatformLogo name={credential.name} platform={credential.platform} url={credential.url} />
            <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-1">
              <h2 className="max-w-full break-words text-sm font-extrabold tracking-[-0.02em] text-black [overflow-wrap:anywhere]">{credential.name}</h2>
              {metadata && <span className="max-w-full break-words text-[11px] font-semibold text-[#6b7280] [overflow-wrap:anywhere]">· {metadata}</span>}
            </div>
          </div>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => onToggleFavorite(credential)}
            aria-label={credential.favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            title={credential.favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            className={`grid size-7 cursor-pointer place-items-center rounded-lg transition hover:bg-[#f3f4f6] ${credential.favorite ? "text-[#e66a27]" : "text-[#6b7280]"}`}
          >
            <Star aria-hidden="true" className="size-[14px]" fill={credential.favorite ? "currentColor" : "none"} />
          </button>
          <button type="button" onClick={() => onEdit(credential)} aria-label={`Editar ${credential.name}`} title="Editar" className="grid size-7 cursor-pointer place-items-center rounded-lg text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#d65a21]">
            <Pencil aria-hidden="true" className="size-[13px]" />
          </button>
          <button type="button" onClick={() => onDelete(credential)} aria-label={`Eliminar ${credential.name}`} title="Eliminar" className="grid size-7 cursor-pointer place-items-center rounded-lg text-[#6b7280] transition hover:bg-[#fff0ec] hover:text-[#bd4827]">
            <Trash2 aria-hidden="true" className="size-[13px]" />
          </button>
        </div>
      </div>

      <div className="mt-1.5 flex min-w-0 flex-col gap-1.5 md:flex-row md:items-center md:gap-4">
        <div className="flex min-h-8 min-w-0 flex-1 items-center gap-2 rounded-[10px] bg-[#f9fafb] pl-2.5 pr-0.5 md:max-w-[340px]">
          {identityValues.length > 0 ? identityValues.map((item, index) => (
            <div key={`${item.label}-${item.value}`} className="contents">
              {index > 0 && <span aria-hidden="true" className="h-4 w-px shrink-0 bg-[#e5e7eb]" />}
              <InlineValue
                label={item.label}
                value={item.value}
                copyMessage={item.message}
                onToast={onToast}
              />
            </div>
          )) : (
            <span className="truncate text-xs font-semibold text-black">
              {credential.loginMethod === "google" ? "Sin cuenta Google relacionada" : "Sin email o usuario"}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 md:flex-1 md:flex-nowrap md:gap-x-4">
          {passwordCredential && (
            <>
              <span aria-hidden="true" className="hidden h-5 w-px shrink-0 bg-[#e5e7eb] md:block" />
              <PasswordField
                key={`${passwordCredential.id}-${passwordCredential.updatedAt}`}
                label={credential.loginMethod === "google" ? "Contraseña Google" : credential.loginMethod === "password" ? "Contraseña" : "Contraseña del correo"}
                encryptedPassword={passwordCredential.encryptedPassword}
                passwordIv={passwordCredential.passwordIv}
                vaultKey={vaultKey}
                onToast={onToast}
              />
            </>
          )}

          {credential.loginMethod === "google" && !loginCredential && (
            <span className="inline-flex min-w-0 items-center gap-1 text-[11px] font-bold text-[#a9552f]" title="Edita la cuenta para seleccionar una credencial Google">
              <AlertTriangle aria-hidden="true" className="size-3.5 shrink-0" />
              <span className="truncate">Falta vincular Google</span>
            </span>
          )}

          {credential.loginMethod === "other" && credential.accessInstructions && (
            <span className="max-w-48 truncate text-[11px] font-semibold text-black" title={credential.accessInstructions}>{credential.accessInstructions}</span>
          )}

          <span aria-hidden="true" className="hidden h-5 w-px shrink-0 bg-[#e5e7eb] md:block" />
          <span className="inline-flex min-h-8 shrink-0 items-center gap-2 rounded-[9px] border border-[#d1d5db] bg-white px-2.5 text-[11px] font-extrabold text-[#6b7280] shadow-[0_2px_8px_rgba(17,24,39,0.035)]">
            <span className="grid size-5 place-items-center rounded-md bg-[#f3f4f6] text-[#6b7280]">
              <MethodIcon aria-hidden="true" className="size-3" />
            </span>
            {method.label}
          </span>

          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            {emailCredential?.url && (credential.loginMethod === "email_code" || credential.loginMethod === "magic_link") && (
              <a href={emailCredential.url} target="_blank" rel="noreferrer" title={`Abrir ${emailCredential.platform || "correo"}`} className="inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-full border border-[#d1d5db] bg-white px-2.5 text-[11px] font-extrabold text-black transition hover:bg-[#f9fafb] hover:text-[#d65a21]">
                Correo
                <ExternalLink aria-hidden="true" className="size-3" />
              </a>
            )}
            {credential.url && (
              <a href={credential.url} target="_blank" rel="noreferrer" title={`Abrir ${credential.platform || credential.name}`} className="inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-full bg-[#2d211b] px-3 text-[11px] font-extrabold text-white transition hover:bg-[#44332a] active:scale-[0.98]">
                Abrir
                <ExternalLink aria-hidden="true" className="size-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {isGoogleProvider && expanded && canExpand && (
        <div id={`linked-credentials-${credential.id}`} className="-mx-3.5 -mb-2.5 mt-2.5 border-t border-[#d1d5db] bg-[#f9fafb]/85 px-3.5 py-2.5 sm:-mx-4 sm:px-4">
          <p className="mb-1.5 px-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6b7280]">Cuentas vinculadas · {relatedCredentials.length}</p>

          <ul className="divide-y divide-[#e5e7eb]" aria-label={`Cuentas vinculadas a ${credential.name}`}>
            {relatedCredentials.map((relatedCredential) => {
              const accessDescription = relatedAccessDescription(relatedCredential, credential.id);
              return (
                <li key={relatedCredential.id} className="grid min-h-10 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 px-1 py-1.5 sm:grid-cols-[minmax(170px,0.75fr)_minmax(0,1fr)_auto] sm:gap-x-4">
                  <div className="col-span-2 flex min-w-0 items-center gap-2 sm:col-span-1">
                    <PlatformLogo name={relatedCredential.name} platform={relatedCredential.platform} url={relatedCredential.url} compact />
                    <p className="truncate text-xs font-extrabold text-black">{relatedCredential.name}</p>
                  </div>
                  <span className="truncate text-[11px] font-semibold text-[#6b7280]">{accessDescription}</span>
                  <button
                    type="button"
                    onClick={() => onNavigateToCredential(relatedCredential.id)}
                    className="inline-flex min-h-7 cursor-pointer items-center gap-1 rounded-lg px-2 text-[11px] font-extrabold text-[#d65a21] transition hover:bg-white"
                  >
                    Ver cuenta
                    <ArrowRight aria-hidden="true" className="size-3" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </article>
  );
}
