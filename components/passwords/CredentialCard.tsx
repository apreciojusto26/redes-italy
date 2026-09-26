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
import { getCredentialAppearance } from "@/config/credential-platforms";
import type { Credential, LoginMethod } from "@/types/credential";

const methodLabels: Record<LoginMethod, { label: string; icon: typeof KeyRound }> = {
  password: { label: "Correo o usuario y contraseña", icon: KeyRound },
  google: { label: "Continuar con Google", icon: ShieldCheck },
  email_code: { label: "Código por correo", icon: Mail },
  magic_link: { label: "Enlace de acceso por correo", icon: Link2 },
  other: { label: "Otro método de acceso", icon: MoreHorizontal },
};

interface CredentialValueProps {
  label: string;
  value: string;
  copyMessage: string;
  onToast: (message: string) => void;
}

function CredentialValue({ label, value, copyMessage, onToast }: CredentialValueProps) {
  if (!value) return null;

  return (
    <div>
      <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#a18c7f]">{label}</p>
      <div className="flex min-h-12 items-center gap-2 rounded-2xl border border-[#ece2da] bg-[#fffefa] p-1 pl-3.5">
        <span className="min-w-0 flex-1 truncate text-sm font-bold text-[#45362e]" title={value}>{value}</span>
        <CopyButton getValue={() => value} message={copyMessage} onToast={onToast} />
      </div>
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
  const appearance = getCredentialAppearance(credential.name, credential.platform);
  const method = methodLabels[credential.loginMethod];
  const MethodIcon = method.icon;
  const loginCredential = credential.loginCredentialId
    ? credentialMap.get(credential.loginCredentialId) ?? null
    : null;
  const emailCredential = credential.emailCredentialId
    ? credentialMap.get(credential.emailCredentialId) ?? null
    : null;

  return (
    <article className="rounded-[24px] border border-[#eadfd4] bg-[#fffdfa] p-5 shadow-[0_10px_32px_rgba(75,51,38,0.045)] transition duration-300 hover:border-[#e4d4c8] hover:shadow-[0_16px_42px_rgba(75,51,38,0.075)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3.5">
          <span
            className="grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-black"
            style={{ color: appearance.accent, backgroundColor: appearance.soft }}
          >
            {appearance.icon}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-extrabold tracking-[-0.025em] text-[#2b201a]">{credential.name}</h2>
            <p className="mt-0.5 truncate text-xs font-semibold text-[#8c796d]">
              {[credential.platform, credential.category].filter(Boolean).join(" · ") || "Cuenta"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onToggleFavorite(credential)}
            aria-label={credential.favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            title={credential.favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            className={`grid size-10 place-items-center rounded-xl transition hover:bg-[#fff3e8] ${credential.favorite ? "text-[#e66a27]" : "text-[#a69184]"}`}
          >
            <Star aria-hidden="true" className="size-[18px]" fill={credential.favorite ? "currentColor" : "none"} />
          </button>
          <button type="button" onClick={() => onEdit(credential)} aria-label={`Editar ${credential.name}`} title="Editar" className="grid size-10 place-items-center rounded-xl text-[#8a766a] transition hover:bg-[#f7eee8] hover:text-[#d65a21]">
            <Pencil aria-hidden="true" className="size-4" />
          </button>
          <button type="button" onClick={() => onDelete(credential)} aria-label={`Eliminar ${credential.name}`} title="Eliminar" className="grid size-10 place-items-center rounded-xl text-[#9a8175] transition hover:bg-[#fff0ec] hover:text-[#bd4827]">
            <Trash2 aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f7eee7] px-3 py-1.5 text-xs font-extrabold text-[#7d6253]">
        <MethodIcon aria-hidden="true" className="size-3.5 text-[#dc6429]" />
        {method.label}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {credential.loginMethod === "password" && (
          <>
            <div className="space-y-4">
              <CredentialValue label="Email" value={credential.email} copyMessage="Email copiado" onToast={onToast} />
              <CredentialValue label="Usuario" value={credential.username} copyMessage="Usuario copiado" onToast={onToast} />
            </div>
            <PasswordField
              key={`${credential.id}-${credential.updatedAt}`}
              encryptedPassword={credential.encryptedPassword}
              passwordIv={credential.passwordIv}
              vaultKey={vaultKey}
              onToast={onToast}
            />
          </>
        )}

        {credential.loginMethod === "google" && (
          loginCredential ? (
            <>
              <CredentialValue
                label="Cuenta Google"
                value={loginCredential.email || loginCredential.username}
                copyMessage="Correo Google copiado"
                onToast={onToast}
              />
              <PasswordField
                key={`${loginCredential.id}-${loginCredential.updatedAt}`}
                label="Contraseña Google"
                encryptedPassword={loginCredential.encryptedPassword}
                passwordIv={loginCredential.passwordIv}
                vaultKey={vaultKey}
                onToast={onToast}
              />
            </>
          ) : (
            <div className="sm:col-span-2 flex items-start gap-3 rounded-2xl border border-[#f0d4c2] bg-[#fff6ef] p-4 text-sm font-bold text-[#a9552f]">
              <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
              Esta cuenta se quedó sin una credencial Google relacionada. Edítala para seleccionar otra.
            </div>
          )
        )}

        {(credential.loginMethod === "email_code" || credential.loginMethod === "magic_link") && (
          <>
            <CredentialValue
              label={credential.loginMethod === "email_code" ? "Código enviado a" : "Correo de acceso"}
              value={credential.email}
              copyMessage="Email copiado"
              onToast={onToast}
            />
            {emailCredential && (
              <PasswordField
                key={`${emailCredential.id}-${emailCredential.updatedAt}`}
                label="Contraseña del correo"
                encryptedPassword={emailCredential.encryptedPassword}
                passwordIv={emailCredential.passwordIv}
                vaultKey={vaultKey}
                onToast={onToast}
              />
            )}
          </>
        )}

        {credential.loginMethod === "other" && credential.accessInstructions && (
          <div className="sm:col-span-2 rounded-2xl border border-[#ece2da] bg-[#fffefa] px-4 py-3">
            <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#a18c7f]">Cómo acceder</p>
            <p className="whitespace-pre-wrap text-sm font-semibold leading-6 text-[#59483e]">{credential.accessInstructions}</p>
          </div>
        )}
      </div>

      {credential.notes && (
        <p className="mt-4 line-clamp-2 text-xs font-medium leading-5 text-[#8a776c]">{credential.notes}</p>
      )}

      <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-[#eee5de] pt-4">
        {emailCredential?.url && (credential.loginMethod === "email_code" || credential.loginMethod === "magic_link") && (
          <a href={emailCredential.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#e6d8ce] bg-white px-4 text-sm font-extrabold text-[#665348] transition hover:bg-[#faf3ed]">
            <Mail aria-hidden="true" className="size-4" />
            Abrir correo
          </a>
        )}
        {credential.url && (
          <a href={credential.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#2d211b] px-4 text-sm font-extrabold text-white transition hover:bg-[#44332a] active:scale-[0.98]">
            Abrir {credential.platform || credential.name}
            <ExternalLink aria-hidden="true" className="size-4" />
          </a>
        )}
      </div>
    </article>
  );
}
