/* eslint-disable @next/next/no-img-element */
import { Globe2 } from "lucide-react";
import {
  siFacebook,
  siGithub,
  siGmail,
  siGoogle,
  siHostinger,
  siInstagram,
  siPayoneer,
  siTiktok,
  siVercel,
} from "simple-icons";
import { getCredentialAppearance } from "@/config/credential-platforms";

interface SimpleIconData {
  title: string;
  path: string;
  hex: string;
}

const vectorLogos: Record<string, SimpleIconData> = {
  facebook: siFacebook,
  github: siGithub,
  gmail: siGmail,
  google: siGoogle,
  hostinger: siHostinger,
  instagram: siInstagram,
  payoneer: siPayoneer,
  tiktok: siTiktok,
  vercel: siVercel,
};

const faviconDomains: Record<string, string> = {
  amazon: "amazon.com",
  hotmart: "hotmart.com",
  sumup: "sumup.com",
  temu: "temu.com",
};

function domainFromUrl(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.hostname : null;
  } catch {
    return null;
  }
}

interface PlatformLogoProps {
  name: string;
  platform: string;
  url: string;
}

export function PlatformLogo({ name, platform, url }: PlatformLogoProps) {
  const appearance = getCredentialAppearance(name, platform);
  const vectorLogo = appearance.key ? vectorLogos[appearance.key] : null;
  const domain = (appearance.key && faviconDomains[appearance.key]) || domainFromUrl(url);

  return (
    <span
      className="relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-[10px]"
      style={{ color: appearance.accent, backgroundColor: appearance.soft }}
    >
      {vectorLogo ? (
        <svg
          viewBox="0 0 24 24"
          aria-label={`Logo de ${vectorLogo.title}`}
          className="size-[18px]"
          fill={`#${vectorLogo.hex}`}
        >
          <path d={vectorLogo.path} />
        </svg>
      ) : (
        <>
          <Globe2 aria-hidden="true" className="size-4" />
          {domain && (
            <img
              src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`}
              alt={`Logo de ${platform || name}`}
              className="absolute inset-0 size-full object-contain p-1.5"
              onError={(event) => { event.currentTarget.style.display = "none"; }}
            />
          )}
        </>
      )}
    </span>
  );
}
