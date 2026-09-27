"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { CredentialForm } from "@/components/passwords/CredentialForm";
import { CredentialGroupFilter } from "@/components/passwords/CredentialGroupFilter";
import { CredentialList } from "@/components/passwords/CredentialList";
import { DeleteCredentialDialog } from "@/components/passwords/DeleteCredentialDialog";
import { PasswordSearch } from "@/components/passwords/PasswordSearch";
import { PasswordsHeader } from "@/components/passwords/PasswordsHeader";
import { Toast } from "@/components/passwords/Toast";
import { VaultUnlock } from "@/components/passwords/VaultUnlock";
import { useCredentials } from "@/hooks/useCredentials";
import { useVault } from "@/hooks/useVault";
import type { Credential, CredentialDraft } from "@/types/credential";

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}

export function PasswordsPage() {
  const vault = useVault();
  const credentialsState = useCredentials(vault.key);
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [deletingCredential, setDeletingCredential] = useState<Credential | null>(null);
  const [toast, setToast] = useState("");
  const toastTimeout = useRef<number | null>(null);
  const navigationSequence = useRef(0);
  const [credentialNavigation, setCredentialNavigation] = useState<{ id: string; request: number } | null>(null);

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
      credential.loginMethod === "password" && credential.provider === "google"),
    [credentialsState.credentials],
  );

  const groups = useMemo(() => {
    const uniqueGroups = new Map<string, string>();

    credentialsState.credentials.forEach((credential) => {
      const group = credential.groupName.trim();
      if (!group) return;
      const normalizedGroup = normalizeSearch(group);
      if (!uniqueGroups.has(normalizedGroup)) uniqueGroups.set(normalizedGroup, group);
    });

    return Array.from(uniqueGroups.values()).sort((first, second) =>
      first.localeCompare(second, "es", { sensitivity: "base" }));
  }, [credentialsState.credentials]);

  const activeGroup = selectedGroup && groups.includes(selectedGroup) ? selectedGroup : null;

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
            credential.groupName,
            credential.url,
            credential.provider,
            credential.email,
            credential.username,
            credential.notes,
            credential.accessInstructions,
            loginCredential?.name,
            loginCredential?.platform,
            loginCredential?.email,
            loginCredential?.username,
            loginCredential?.url,
            loginCredential?.provider,
            loginCredential?.category,
            loginCredential?.groupName,
            loginCredential?.notes,
            emailCredential?.name,
            emailCredential?.platform,
            emailCredential?.email,
            emailCredential?.username,
            emailCredential?.url,
            emailCredential?.provider,
            emailCredential?.category,
            emailCredential?.groupName,
            emailCredential?.notes,
          ].filter(Boolean).join(" ");
          return normalizeSearch(haystack).includes(query);
        })
      : credentialsState.credentials.filter((credential) =>
          !activeGroup || normalizeSearch(credential.groupName) === normalizeSearch(activeGroup));

    return [...matches].sort((first, second) => {
      if (first.favorite !== second.favorite) return first.favorite ? -1 : 1;
      return first.name.localeCompare(second.name, "es", { sensitivity: "base" });
    });
  }, [activeGroup, credentialMap, credentialsState.credentials, search]);

  const changeSearch = useCallback((value: string) => {
    setSearch(value);
    if (value.trim()) setSelectedGroup(null);
  }, []);

  const changeGroup = useCallback((group: string | null) => {
    setSelectedGroup(group);
    setSearch("");
  }, []);

  const navigateToCredential = useCallback((credentialId: string) => {
    if (!visibleCredentials.some((credential) => credential.id === credentialId)) {
      setSearch("");
      setSelectedGroup(null);
    }
    navigationSequence.current += 1;
    setCredentialNavigation({ id: credentialId, request: navigationSequence.current });
  }, [visibleCredentials]);

  useEffect(() => {
    if (!credentialNavigation) return;

    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(`credential-${credentialNavigation.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
    const timeoutId = window.setTimeout(() => {
      setCredentialNavigation((current) =>
        current?.request === credentialNavigation.request ? null : current);
    }, 1_800);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [credentialNavigation]);

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

  const createGoogle = async (email: string, password: string, groupName: string) => {
    const created = await credentialsState.create({
      name: "Google / Gmail",
      platform: "Google / Gmail",
      category: "Correo",
      groupName,
      url: "https://mail.google.com/",
      provider: "google",
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
        onCreate={openCreate}
        onLock={vault.lock}
      />
      <PasswordSearch value={search} onChange={changeSearch} resultCount={visibleCredentials.length} />
      <CredentialGroupFilter groups={groups} value={activeGroup} onChange={changeGroup} />

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
        highlightedCredentialId={credentialNavigation?.id ?? null}
        onNavigateToCredential={navigateToCredential}
        onToast={showToast}
      />

      <footer className="flex items-center justify-center gap-2 pb-4 pt-2 text-center text-xs font-semibold text-black sm:text-sm">
        <LockKeyhole aria-hidden="true" className="size-4 text-[#d46530]" />
        Bóveda cifrada · Bloqueo tras 30 minutos de inactividad.
      </footer>

      {formOpen && (
        <CredentialForm
          key={editingCredential?.id ?? "new-credential"}
          credential={editingCredential ?? undefined}
          googleCredentials={googleCredentials}
          groupNames={groups}
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

      <Toast message={toast} />
    </div>
  );
}
