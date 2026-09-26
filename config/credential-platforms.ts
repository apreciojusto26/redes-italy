interface CredentialAppearance {
  key: string | null;
  accent: string;
  soft: string;
}

const appearances: Record<string, CredentialAppearance> = {
  google: { key: "google", accent: "#4285f4", soft: "#edf4ff" },
  gmail: { key: "gmail", accent: "#d84b40", soft: "#fff0ee" },
  temu: { key: "temu", accent: "#e85d12", soft: "#fff0e7" },
  instagram: { key: "instagram", accent: "#b33c80", soft: "#fceef6" },
  vercel: { key: "vercel", accent: "#241c18", soft: "#f0ece9" },
  sumup: { key: "sumup", accent: "#1b8269", soft: "#e9f7f2" },
  payoneer: { key: "payoneer", accent: "#d55525", soft: "#fff0e8" },
  hotmart: { key: "hotmart", accent: "#e35d32", soft: "#fff0ea" },
  amazon: { key: "amazon", accent: "#c57914", soft: "#fff4df" },
  tiktok: { key: "tiktok", accent: "#251d19", soft: "#f0ece9" },
  facebook: { key: "facebook", accent: "#2877d4", soft: "#edf5ff" },
  github: { key: "github", accent: "#332922", soft: "#f0ece9" },
  hostinger: { key: "hostinger", accent: "#673de6", soft: "#f1edff" },
};

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("es");
}

export function getCredentialAppearance(name: string, platform: string): CredentialAppearance {
  const searchable = `${normalize(platform)} ${normalize(name)}`;
  const match = Object.keys(appearances).find((key) => searchable.includes(key));
  if (match) return appearances[match];

  return {
    key: null,
    accent: "#d86128",
    soft: "#fff0e7",
  };
}

export function isGoogleCredential(name: string, platform: string, url: string): boolean {
  const searchable = `${normalize(name)} ${normalize(platform)} ${normalize(url)}`;
  return searchable.includes("google") || searchable.includes("gmail");
}
