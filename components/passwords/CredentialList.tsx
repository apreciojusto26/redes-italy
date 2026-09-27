import { KeyRound, SearchX } from "lucide-react";
import { CredentialCard } from "@/components/passwords/CredentialCard";
import type { Credential } from "@/types/credential";

interface CredentialListProps {
  credentials: Credential[];
  allCredentials: Credential[];
  vaultKey: CryptoKey;
  searching: boolean;
  loading: boolean;
  onCreate: () => void;
  onEdit: (credential: Credential) => void;
  onDelete: (credential: Credential) => void;
  onToggleFavorite: (credential: Credential) => void;
  highlightedCredentialId: string | null;
  onNavigateToCredential: (credentialId: string) => void;
  onToast: (message: string) => void;
}

export function CredentialList({
  credentials,
  allCredentials,
  vaultKey,
  searching,
  loading,
  onCreate,
  onEdit,
  onDelete,
  onToggleFavorite,
  highlightedCredentialId,
  onNavigateToCredential,
  onToast,
}: CredentialListProps) {
  const credentialMap = new Map(allCredentials.map((credential) => [credential.id, credential]));

  if (loading && allCredentials.length === 0) {
    return (
      <div className="space-y-3" aria-label="Cargando cuentas">
        {[0, 1, 2].map((item) => <div key={item} className="h-24 animate-pulse rounded-[18px] border border-[#e5e7eb] bg-white/65" />)}
      </div>
    );
  }

  if (credentials.length === 0) {
    return (
      <div className="rounded-[24px] border border-[#d1d5db] bg-white px-5 py-12 text-center shadow-[0_10px_32px_rgba(17,24,39,0.04)]">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f8eee7] text-[#d85a20]">
          {searching ? <SearchX aria-hidden="true" className="size-7" /> : <KeyRound aria-hidden="true" className="size-7" />}
        </span>
        <h2 className="mt-5 text-xl font-extrabold tracking-[-0.03em] text-black">
          {searching ? "No encontramos esa cuenta" : "Todavía no hay cuentas"}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-black">
          {searching ? "Prueba buscando por plataforma, correo, usuario o nota." : "Añade la primera cuenta para empezar tu bóveda privada."}
        </p>
        {!searching && <button type="button" onClick={onCreate} className="mt-5 min-h-11 rounded-full bg-[#e65e23] px-5 text-sm font-extrabold text-white hover:bg-[#d9511b]">Nueva cuenta</button>}
      </div>
    );
  }

  return (
    <section aria-label="Todas las cuentas" className="space-y-2">
      {credentials.map((credential) => (
        <CredentialCard
          key={credential.id}
          credential={credential}
          credentialMap={credentialMap}
          vaultKey={vaultKey}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          highlighted={highlightedCredentialId === credential.id}
          onNavigateToCredential={onNavigateToCredential}
          onToast={onToast}
        />
      ))}
    </section>
  );
}
