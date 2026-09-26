import { Search, X } from "lucide-react";

interface PasswordSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export function PasswordSearch({ value, onChange, resultCount }: PasswordSearchProps) {
  return (
    <section aria-label="Buscar cuentas" className="rounded-[22px] border border-[#eadfd4] bg-[#fffdfa] p-3 shadow-[0_10px_30px_rgba(75,51,38,0.045)] sm:p-4">
      <label className="flex min-h-[58px] items-center gap-3 rounded-2xl border border-[#e8ddd4] bg-white px-4 transition focus-within:border-[#e79368] focus-within:ring-4 focus-within:ring-[#ed6725]/8">
        <Search aria-hidden="true" className="size-5 shrink-0 text-[#d66530]" />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar Temu, Gmail, Instagram, correo…"
          className="min-w-0 flex-1 bg-transparent text-base font-bold text-[#342720] outline-none placeholder:font-medium placeholder:text-[#a89589]"
        />
        {value && (
          <button type="button" onClick={() => onChange("")} aria-label="Limpiar búsqueda" className="grid size-10 shrink-0 place-items-center rounded-xl text-[#8d796e] transition hover:bg-[#f7eee8] hover:text-[#d65a21]">
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </label>
      {value && <p className="px-2 pt-2 text-xs font-bold text-[#8a776c]">{resultCount} {resultCount === 1 ? "resultado" : "resultados"}</p>}
    </section>
  );
}
