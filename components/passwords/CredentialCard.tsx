import {
  AlertTriangle,
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
      <span className="min-w-0 flex-1 truncate text-xs font-bold text-[#45362e]">{value}</span>
      <CopyButton getValue={() => value} message={copyMessage} onToast={onToast} />
    </div>
  );
}

interface CredentialCardProps {
  credential: Credential;
  credentialMap: Map<string, Credential>;
  vaultKey: CryptoKey;
  onEdit: (credential: Credential) => void;
  onDelete: (credential: Credential) => void;
  onToggleFavorite: (credential: Credential) => void;
  onToast: (message: string) => void;
}

export function CredentialCard({
  credential,
  credentialMap,
  vaultKey,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToast,
}: CredentialCardProps) {
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
  const metadata = [
    normalizedPlatform && normalizedPlatform !== normalizedName ? credential.platform : "",
    credential.category,
  ].filter(Boolean).join(" · ");

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
    <article className="rounded-[18px] border border-[#eadfd4] bg-[#fffdfa] px-3.5 py-2.5 shadow-[0_5px_18px_rgba(75,51,38,0.035)] transition duration-300 hover:border-[#e2d2c6] hover:shadow-[0_8px_24px_rgba(75,51,38,0.06)] sm:px-4">
      <div className="flex min-h-8 min-w-0 items-center gap-2.5">
        <PlatformLogo name={credential.name} platform={credential.platform} url={credential.url} />
        <h2 className="min-w-0 truncate text-sm font-extrabold tracking-[-0.02em] text-[#2b201a]">{credential.name}</h2>
        {metadata && (
          <span className="min-w-0 truncate text-[11px] font-semibold text-[#9a877b]">· {metadata}</span>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => onToggleFavorite(credential)}
            aria-label={credential.favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            title={credential.favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            className={`grid size-7 cursor-pointer place-items-center rounded-lg transition hover:bg-[#fff3e8] ${credential.favorite ? "text-[#e66a27]" : "text-[#a69184]"}`}
          >
            <Star aria-hidden="true" className="size-[14px]" fill={credential.favorite ? "currentColor" : "none"} />
          </button>
          <button type="button" onClick={() => onEdit(credential)} aria-label={`Editar ${credential.name}`} title="Editar" className="grid size-7 cursor-pointer place-items-center rounded-lg text-[#8a766a] transition hover:bg-[#f7eee8] hover:text-[#d65a21]">
            <Pencil aria-hidden="true" className="size-[13px]" />
          </button>
          <button type="button" onClick={() => onDelete(credential)} aria-label={`Eliminar ${credential.name}`} title="Eliminar" className="grid size-7 cursor-pointer place-items-center rounded-lg text-[#9a8175] transition hover:bg-[#fff0ec] hover:text-[#bd4827]">
            <Trash2 aria-hidden="true" className="size-[13px]" />
          </button>
        </div>
      </div>

      <div className="mt-1.5 flex min-w-0 flex-col gap-1.5 md:flex-row md:items-center md:gap-4">
        <div className="flex min-h-8 min-w-0 flex-1 items-center gap-2 rounded-[10px] bg-[#fbf7f3] pl-2.5 pr-0.5 md:max-w-[340px]">
          {identityValues.length > 0 ? identityValues.map((item, index) => (
            <div key={`${item.label}-${item.value}`} className="contents">
              {index > 0 && <span aria-hidden="true" className="h-4 w-px shrink-0 bg-[#e4d9d0]" />}
              <InlineValue
                label={item.label}
                value={item.value}
                copyMessage={item.message}
                onToast={onToast}
              />
            </div>
          )) : (
            <span className="truncate text-xs font-semibold text-[#a39084]">
              {credential.loginMethod === "google" ? "Sin cuenta Google relacionada" : "Sin email o usuario"}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 md:flex-1 md:flex-nowrap md:gap-x-4">
          {passwordCredential && (
            <>
              <span aria-hidden="true" className="hidden h-5 w-px shrink-0 bg-[#e4d9d0] md:block" />
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
            <span className="max-w-48 truncate text-[11px] font-semibold text-[#6f5b50]" title={credential.accessInstructions}>{credential.accessInstructions}</span>
          )}

          <span aria-hidden="true" className="hidden h-5 w-px shrink-0 bg-[#e4d9d0] md:block" />
          <span className="inline-flex min-h-8 shrink-0 items-center gap-2 rounded-[9px] border border-[#e8dbd1] bg-[#fffaf6] px-2.5 text-[11px] font-extrabold text-[#654f43] shadow-[0_2px_8px_rgba(75,51,38,0.035)]">
            <span className="grid size-5 place-items-center rounded-md bg-[#f7e9df] text-[#dc6429]">
              <MethodIcon aria-hidden="true" className="size-3" />
            </span>
            {method.label}
          </span>

          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            {emailCredential?.url && (credential.loginMethod === "email_code" || credential.loginMethod === "magic_link") && (
              <a href={emailCredential.url} target="_blank" rel="noreferrer" title={`Abrir ${emailCredential.platform || "correo"}`} className="inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-full border border-[#e6d8ce] bg-white px-2.5 text-[11px] font-extrabold text-[#745f53] transition hover:bg-[#faf3ed] hover:text-[#d65a21]">
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
    </article>
  );
}
