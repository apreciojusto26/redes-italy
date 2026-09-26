import { Music2 } from "lucide-react";
import type { PlatformIcon } from "@/types/publication";

export function BrandIcon({ icon, className }: { icon: PlatformIcon; className?: string }) {
  if (icon === "tiktok") {
    return <Music2 aria-hidden="true" className={className} strokeWidth={2.2} />;
  }

  if (icon === "youtube") {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
        <path fill="currentColor" d="M21.6 7.1a3 3 0 0 0-2.1-2.13C17.65 4.47 12 4.47 12 4.47s-5.65 0-7.5.5A3 3 0 0 0 2.4 7.1 31.4 31.4 0 0 0 1.9 12c0 1.64.16 3.27.5 4.9A3 3 0 0 0 4.5 19c1.85.5 7.5.5 7.5.5s5.65 0 7.5-.5a3 3 0 0 0 2.1-2.1c.34-1.63.5-3.26.5-4.9s-.16-3.27-.5-4.9Z" />
        <path fill="white" d="m10 15.25 5-3.25-5-3.25v6.5Z" />
      </svg>
    );
  }

  if (icon === "instagram") {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.8 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.25-1.5 1.55-1.5H17V3.62c-.28-.04-1.26-.12-2.4-.12-2.38 0-4 1.45-4 4.12V9.9H8V13h2.6v8h3.2Z" />
    </svg>
  );
}
