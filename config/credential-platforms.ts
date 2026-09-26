interface CredentialAppearance {
  icon: string;
  accent: string;
  soft: string;
}

const appearances: Record<string, CredentialAppearance> = {
  google: { icon: "G", accent: "#4285f4", soft: "#edf4ff" },
  gmail: { icon: "M", accent: "#d84b40", soft: "#fff0ee" },
  temu: { icon: "T", accent: "#e85d12", soft: "#fff0e7" },
  instagram: { icon: "◎", accent: "#b33c80", soft: "#fceef6" },
  vercel: { icon: "▲", accent: "#241c18", soft: "#f0ece9" },
  sumup: { icon: "S", accent: "#1b8269", soft: "#e9f7f2" },
  payoneer: { icon: "P", accent: "#d55525", soft: "#fff0e8" },
  hotmart: { icon: "H", accent: "#e35d32", soft: "#fff0ea" },
  amazon: { icon: "a", accent: "#c57914", soft: "#fff4df" },
  tiktok: { icon: "♪", accent: "#251d19", soft: "#f0ece9" },
  facebook: { icon: "f", accent: "#2877d4", soft: "#edf5ff" },
  github: { icon: "GH", accent: "#332922", soft: "#f0ece9" },
  hostinger: { icon: "H", accent: "#673de6", soft: "#f1edff" },
};

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("es");
}

export function getCredentialAppearance(name: string, platform: string): CredentialAppearance {
  const searchable = `${normalize(platform)} ${normalize(name)}`;
  const match = Object.keys(appearances).find((key) => searchable.includes(key));
  if (match) return appearances[match];

  const label = (platform || name || "Cuenta").trim();
  return {
    icon: label.slice(0, 2).toUpperCase(),
    accent: "#d86128",
    soft: "#fff0e7",
  };
}

export function isGoogleCredential(name: string, platform: string, url: string): boolean {
  const searchable = `${normalize(name)} ${normalize(platform)} ${normalize(url)}`;
  return searchable.includes("google") || searchable.includes("gmail");
}
