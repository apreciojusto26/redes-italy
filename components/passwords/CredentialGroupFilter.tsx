interface CredentialGroupFilterProps {
  groups: string[];
  value: string | null;
  onChange: (group: string | null) => void;
}

export function CredentialGroupFilter({ groups, value, onChange }: CredentialGroupFilterProps) {
  if (groups.length === 0) return null;

  return (
    <nav aria-label="Filtrar cuentas por grupo o proyecto" className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max min-w-full items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-pressed={value === null}
          className={`min-h-9 cursor-pointer rounded-xl border px-3.5 text-xs font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e66a27]/35 ${
            value === null
              ? "border-[#9ca3af] bg-[#e66a27] text-white shadow-[0_5px_14px_rgba(230,106,39,0.16)]"
              : "border-[#d1d5db] bg-white text-black hover:border-[#9ca3af] hover:bg-[#f9fafb]"
          }`}
        >
          Todas
        </button>

        {groups.map((group) => {
          const selected = value === group;
          return (
            <button
              key={group}
              type="button"
              onClick={() => onChange(group)}
              aria-pressed={selected}
              className={`min-h-9 cursor-pointer rounded-xl border px-3.5 text-xs font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e66a27]/35 ${
                selected
                  ? "border-[#9ca3af] bg-[#fff1e7] text-black shadow-[0_4px_12px_rgba(17,24,39,0.08)]"
                  : "border-[#d1d5db] bg-white text-black hover:border-[#9ca3af] hover:bg-[#f9fafb]"
              }`}
            >
              {group}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
