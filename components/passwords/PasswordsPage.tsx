"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { CredentialForm } from "@/components/passwords/CredentialForm";
import { CredentialList } from "@/components/passwords/CredentialList";
import { DeleteCredentialDialog } from "@/components/passwords/DeleteCredentialDialog";
import { ImportPasswords } from "@/components/passwords/ImportPasswords";
import { PasswordSearch } from "@/components/passwords/PasswordSearch";
import { PasswordsHeader } from "@/components/passwords/PasswordsHeader";
import { Toast } from "@/components/passwords/Toast";
import { VaultUnlock } from "@/components/passwords/VaultUnlock";
import { isGoogleCredential } from "@/config/credential-platforms";
import { useCredentials } from "@/hooks/useCredentials";
import { useVault } from "@/hooks/useVault";
import type { Credential, CredentialDraft, ImportedCredential } from "@/types/credential";

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}

function importedDraft(item: ImportedCredential): CredentialDraft {
  const hasEmail = item.username.includes("@");
  return {
    name: item.name,
    platform: item.name,
    category: "Importada",
    url: item.url,
    loginMethod: "password",
    email: hasEmail ? item.username : "",
    username: hasEmail ? "" : item.username,
    password: item.password,
    loginCredentialId: null,
    emailCredentialId: null,
    accessInstructions: "",
    notes: item.notes,
    favorite: false,
  };
}

export function PasswordsPage() {
  const vault = useVault();
  const credentialsState = useCredentials(vault.key);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [deletingCredential, setDeletingCredential] = useState<Credential | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimeout = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimeout.current) window.clearTimeout(toastTimeout.current);
    toastTimeout.current = window.setTimeout(() => setToast(""), 2_000);
  }, []);

  const credentialMap = useMemo(
    () => new Map(credentialsState.credentials.map((credential) => [credential.id, credential])),
    [credentialsState.credentials],
  );

  const googleCredentials = useMemo(
    () => credentialsState.credentials.filter((credential) =>
      credential.loginMethod === "password" &&
      isGoogleCredential(credential.name, credential.platform, credential.url)),
    [credentialsState.credentials],
  );

  const visibleCredentials = useMemo(() => {
    const query = normalizeSearch(search);
    const matches = query
      ? credentialsState.credentials.filter((credential) => {
          const loginCredential = credential.loginCredentialId ? credentialMap.get(credential.loginCredentialId) : null;
          const emailCredential = credential.emailCredentialId ? credentialMap.get(credential.emailCredentialId) : null;
          const haystack = [
            credential.name,
            credential.platform,
            credential.category,
            credential.url,
            credential.email,
            credential.username,
            credential.notes,
            credential.accessInstructions,
            loginCredential?.name,
            loginCredential?.platform,
            loginCredential?.email,
            loginCredential?.username,
            loginCredential?.url,
            loginCredential?.category,
            loginCredential?.notes,
            emailCredential?.name,
            emailCredential?.platform,
            emailCredential?.email,
            emailCredential?.username,
            emailCredential?.url,
            emailCredential?.category,
            emailCredential?.notes,
          ].filter(Boolean).join(" ");
          return normalizeSearch(haystack).includes(query);
        })
      : [...credentialsState.credentials].sort((first, second) => {
          if (first.favorite !== second.favorite) return first.favorite ? -1 : 1;
          return first.name.localeCompare(second.name, "es", { sensitivity: "base" });
        });

    return matches;
  }, [credentialMap, credentialsState.credentials, search]);

  const dependencies = useMemo(() => {
    if (!deletingCredential) return [];
    return credentialsState.credentials.filter((credential) =>
      credential.loginCredentialId === deletingCredential.id ||
      credential.emailCredentialId === deletingCredential.id);
  }, [credentialsState.credentials, deletingCredential]);

  const openCreate = () => {
    setEditingCredential(null);
    setFormOpen(true);
  };

  const openEdit = (credential: Credential) => {
    setEditingCredential(credential);
    setFormOpen(true);
  };

  const saveCredential = async (draft: CredentialDraft) => {
    if (editingCredential) {
      await credentialsState.update(editingCredential, draft);
      showToast("Cuenta actualizada");
    } else {
      await credentialsState.create(draft);
      showToast("Cuenta creada");
    }
    setFormOpen(false);
    setEditingCredential(null);
  };

  const createGoogle = async (email: string, password: string) => {
    const created = await credentialsState.create({
      name: "Google",
      platform: "Google",
      category: "Correo",
      url: "https://mail.google.com/",
      loginMethod: "password",
      email,
      username: "",
      password,
      loginCredentialId: null,
      emailCredentialId: null,
      accessInstructions: "",
      notes: "",
      favorite: false,
    });
    showToast("Cuenta Google añadida");
    return created;
  };

  const confirmDelete = async (force: boolean) => {
    if (!deletingCredential) return;
    await credentialsState.remove(deletingCredential.id, force);
    setDeletingCredential(null);
    showToast("Cuenta eliminada");
  };

  const importCredentials = async (items: ImportedCredential[]) => {
    for (const item of items) {
      await credentialsState.create(importedDraft(item));
    }
    setImportOpen(false);
    showToast(`${items.length} ${items.length === 1 ? "cuenta importada" : "cuentas importadas"}`);
  };

  if (vault.status !== "unlocked" || !vault.key) {
    return (
      <VaultUnlock
        status={vault.status}
        error={vault.error}
        onSetup={vault.setup}
        onUnlock={vault.unlock}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <PasswordsHeader
        count={credentialsState.credentials.length}
        onCreate={openCreate}
        onImport={() => setImportOpen(true)}
        onLock={vault.lock}
      />
      <PasswordSearch value={search} onChange={setSearch} resultCount={visibleCredentials.length} />

      {credentialsState.error && (
        <div className="rounded-2xl border border-[#f0d4c2] bg-[#fff6ef] px-4 py-3 text-sm font-bold text-[#a9552f]">{credentialsState.error}</div>
      )}

      <CredentialList
        credentials={visibleCredentials}
        allCredentials={credentialsState.credentials}
        vaultKey={vault.key}
        searching={Boolean(search.trim())}
        loading={credentialsState.loading}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={setDeletingCredential}
        onToggleFavorite={(credential) => {
          void credentialsState.toggleFavorite(credential).catch(() => showToast("No se pudo cambiar el favorito"));
        }}
        onToast={showToast}
      />

      <footer className="flex items-center justify-center gap-2 pb-4 pt-2 text-center text-xs font-semibold text-[#927e72] sm:text-sm">
        <LockKeyhole aria-hidden="true" className="size-4 text-[#d46530]" />
        Bóveda cifrada · Bloqueo automático tras 10 minutos.
      </footer>

      {formOpen && (
        <CredentialForm
          key={editingCredential?.id ?? "new-credential"}
          credential={editingCredential ?? undefined}
          googleCredentials={googleCredentials}
          onSave={saveCredential}
          onCreateGoogle={createGoogle}
          onCancel={() => {
            setFormOpen(false);
            setEditingCredential(null);
          }}
        />
      )}

      {deletingCredential && (
        <DeleteCredentialDialog
          credential={deletingCredential}
          dependencies={dependencies}
          onCancel={() => setDeletingCredential(null)}
          onConfirm={confirmDelete}
        />
      )}

      {importOpen && <ImportPasswords onCancel={() => setImportOpen(false)} onImport={importCredentials} />}
      <Toast message={toast} />
    </div>
  );
}
