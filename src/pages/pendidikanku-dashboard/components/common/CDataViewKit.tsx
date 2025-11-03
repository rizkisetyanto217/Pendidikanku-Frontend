import React, {useEffect, useMemo, useRef, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {
  Btn,
  type Palette,
} from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";

/* =========================================================
   Utils warna berbasis Palette
   ========================================================= */
function pickTextMuted(palette: Palette) {
  return palette.black2;
}
function pickTableHeaderBg(palette: Palette) {
  return palette.primary2;
}
function pickTableHeaderFg(palette: Palette) {
  return palette.primary;
}
function pickTableBorder(palette: Palette) {
  return palette.silver1;
}
function pickRowHoverBg(palette: Palette) {
  // gunakan white3 jika ada, fallback ke primary2
  return (palette as any).white3 || palette.primary2;
}
function pickContainerBg(palette: Palette) {
  return palette.white1;
}
function pickContainerBorder(palette: Palette) {
  return palette.silver1;
}
function pickContainerFg(palette: Palette) {
  return palette.black1;
}
function pickRowZebraBg(palette: Palette) {
  // pakai white3 kalau ada; fallback ke primary2
  return (palette as any).white3 || palette.primary2;
}

/* =========================================================
   useDebouncedValue — debounce value untuk UX search yang halus
   ========================================================= */
export function useDebouncedValue<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

/* =========================================================
   useSearchQuery — sync query pencarian ke URL ?q=
   ========================================================= */
export function useSearchQuery(paramKey = "q") {
  const [sp, setSp] = useSearchParams();
  const q = sp.get(paramKey) ?? "";

  const setQ = (nextQ: string) => {
    const curQ = sp.get(paramKey) ?? "";
    const normalized = nextQ.trim();
    if (normalized === curQ) return; // ⛔ hindari setSp berulang

    const next = new URLSearchParams(sp);
    if (normalized) next.set(paramKey, normalized);
    else next.delete(paramKey);

    // reset offset hanya bila perlu
    if ((sp.get("offset") ?? "0") !== "0") next.set("offset", "0");

    setSp(next, {replace: true});
  };

  return {q, setQ};
}

/* =========================================================
   PerPageSelect — select native yang full dikendalikan Palette
   ========================================================= */
export function PerPageSelect({
  palette,
  value,
  onChange,
  options = [10, 20, 50, 100],
  className = "",
  disabled = false,
}: {
  palette: Palette;
  value: number | string;
  onChange: (v: number) => void;
  options?: number[];
  className?: string;
  disabled?: boolean;
}) {
  return (
    <div className={["relative", className].join(" ")}>
      <select
        value={String(value)}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="appearance-none rounded-xl pl-3 pr-8 py-1.5 text-sm outline-none"
        style={{
          background: palette.white1,
          color: palette.black1,
          border: `1px solid ${palette.silver1}`,
          boxShadow: "none",
        }}
      >
        {options.map((n) => (
          <option key={n} value={n} style={{color: palette.black1}}>
            {n}/hal
          </option>
        ))}
      </select>

      {/* caret */}
      <svg
        viewBox="0 0 24 24"
        width={16}
        height={16}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
        style={{color: palette.silver2, opacity: 0.9}}
      >
        <path
          d="M7 10l5 5 5-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

/* =========================================================
   SearchBar — komponen input pencarian generik (debounced)
   ========================================================= */
export function SearchBar({
  palette,
  value,
  onChange,
  placeholder = "Cari…",
  autoFocus = false,
  debounceMs = 500, // default adem
  className = "",
  leftIcon,
  rightExtra,
}: {
  palette: Palette;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  debounceMs?: number;
  className?: string;
  leftIcon?: React.ReactNode;
  rightExtra?: React.ReactNode;
}) {
  const [local, setLocal] = useState(value);
  const debounced = useDebouncedValue(local, debounceMs);
  const first = useRef(true);

  // sinkron dari luar -> dalam, tapi hindari set state kalau sama
  useEffect(() => {
    if (value !== local) setLocal(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (debounced === value) return; // ⛔ echo loop
    onChange(debounced);
  }, [debounced, value, onChange]);

  return (
    <div
      className={[
        "w-full flex items-stretch gap-2 rounded-2xl border px-3 py-2",
        className,
      ].join(" ")}
      style={{
        borderColor: pickContainerBorder(palette),
        background: pickContainerBg(palette),
        color: pickContainerFg(palette),
      }}
      role="search"
    >
      {leftIcon ?? (
        <svg
          viewBox="0 0 24 24"
          width={18}
          height={18}
          className="mt-1"
          aria-hidden
          style={{color: pickTextMuted(palette), opacity: 0.7}}
        >
          <path
            d="M21 21l-4.3-4.3M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
      <input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="flex-1 outline-none bg-transparent text-sm"
        autoFocus={autoFocus}
        aria-label="Cari data"
        style={{color: pickContainerFg(palette)}}
      />
      {rightExtra}
    </div>
  );
}

/* =========================================================
   useOffsetLimit — sinkron offset/limit dengan URL ?offset= & ?limit=
   ========================================================= */
export function useOffsetLimit(
  total: number,
  defaultLimit = 20,
  maxLimit = 200
) {
  const [sp, setSp] = useSearchParams();

  const limit = useMemo(() => {
    const v = Number(sp.get("limit") || defaultLimit);
    return Math.min(Math.max(v, 1), maxLimit);
  }, [sp, defaultLimit, maxLimit]);

  const offset = useMemo(
    () => Math.max(Number(sp.get("offset") || 0), 0),
    [sp]
  );

  const pageStart = total === 0 ? 0 : offset + 1;
  const pageEnd = Math.min(offset + limit, total);
  const canPrev = offset > 0;
  const canNext = offset + limit < total;

  const commit = (next: URLSearchParams) => {
    const same =
      next.get("offset") === sp.get("offset") &&
      next.get("limit") === sp.get("limit");
    if (same) return;
    setSp(next, {replace: true});
  };

  const setOffset = (newOffset: number) => {
    const clamped = String(Math.max(0, newOffset));
    if (clamped === (sp.get("offset") ?? "0")) return;
    const next = new URLSearchParams(sp);
    next.set("offset", clamped);
    next.set("limit", String(limit));
    commit(next);
  };

  const setLimit = (newLimit: number) => {
    const clamped = String(Math.min(Math.max(newLimit, 1), maxLimit));
    if (
      clamped === (sp.get("limit") ?? String(defaultLimit)) &&
      (sp.get("offset") ?? "0") === "0"
    )
      return;
    const next = new URLSearchParams(sp);
    next.set("limit", clamped);
    next.set("offset", "0");
    commit(next);
  };

  const handlePrev = () => setOffset(Math.max(0, offset - limit));
  const handleNext = () => {
    if (offset + limit < total) setOffset(offset + limit);
  };

  return {
    offset,
    limit,
    setOffset,
    setLimit,
    pageStart,
    pageEnd,
    canPrev,
    canNext,
    handlePrev,
    handleNext,
  };
}

/* =========================================================
   PaginationBar — footer prev/next + info range
   ========================================================= */
export function PaginationBar({
  palette,
  pageStart,
  pageEnd,
  total,
  canPrev,
  canNext,
  onPrev,
  onNext,
  rightExtra,
}: {
  palette: Palette;
  pageStart: number;
  pageEnd: number;
  total: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  rightExtra?: React.ReactNode;
}) {
  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-sm" style={{color: pickTextMuted(palette)}}>
        Menampilkan {pageStart}–{pageEnd} dari {total} data
      </div>
      <div className="flex items-center gap-2">
        {rightExtra}
        <Btn
          palette={palette}
          size="sm"
          variant="secondary"
          disabled={!canPrev}
          onClick={onPrev}
        >
          Sebelumnya
        </Btn>
        <Btn palette={palette} size="sm" disabled={!canNext} onClick={onNext}>
          Berikutnya
        </Btn>
      </div>
    </div>
  );
}

/* =========================================================
   ScrollAreaX — wrapper dengan horizontal scroll ramah mobile
   ========================================================= */
// Mobile: hidden, Desktop (md+): auto
export function ScrollAreaX({
  children,
  palette,
}: {
  children: React.ReactNode;
  palette: Palette;
}) {
  return (
    <div className="relative" aria-label="Scrollable table region">
      <div
        className="overflow-x-hidden md:overflow-x-auto overscroll-x-contain max-w-full rounded-2xl shadow-sm"
        role="region"
        aria-roledescription="horizontal scroller"
        tabIndex={0}
        style={{
          background: pickContainerBg(palette),
          border: `1px solid ${pickContainerBorder(palette)}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   DataTable — tabel generik berbasis definisi kolom
   ========================================================= */
export type Column<T> = {
  key: string;
  header: string | React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

export function DataTable<T>({
  palette,
  columns,
  rows,
  minWidth = 840,
  headerSticky = true,
  emptyState,
  zebra = true,
}: {
  palette: Palette;
  columns: Column<T>[];
  rows: T[];
  minWidth?: number;
  headerSticky?: boolean;
  emptyState?: React.ReactNode;
  zebra?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <ScrollAreaX palette={palette}>
      <table className="w-full text-sm text-left" style={{minWidth}}>
        <thead>
          <tr
            style={{
              background: pickTableHeaderBg(palette),
              color: pickTableHeaderFg(palette),
            }}
          >
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={[
                  "px-4 py-3 text-xs font-semibold uppercase tracking-wide",
                  headerSticky ? "sticky top-0 z-10 backdrop-blur" : "",
                  c.className || "",
                ].join(" ")}
                style={{color: pickTableHeaderFg(palette)}}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody
          className="divide-y"
          style={{borderColor: pickTableBorder(palette)}}
        >
          {rows.length === 0 && (
            <tr>
              <td
                className="px-4 py-6 text-sm"
                colSpan={columns.length}
                style={{color: pickTextMuted(palette), opacity: 0.85}}
              >
                {emptyState ?? "Tidak ada data."}
              </td>
            </tr>
          )}

          {rows.map((r, i) => {
            const isHovered = hovered === i;
            const isZebra = zebra && i % 2 === 1;
            const baseBg = isZebra ? pickRowZebraBg(palette) : "transparent";
            const bg = isHovered ? pickRowHoverBg(palette) : baseBg;

            return (
              <tr
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{background: bg, transition: "background 120ms ease"}}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={["px-4 py-3", c.className || ""].join(" ")}
                    style={{color: pickContainerFg(palette)}}
                  >
                    {c.cell(r)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </ScrollAreaX>
  );
}

/* =========================================================
   CardGrid — grid kartu generik (render prop)
   ========================================================= */
export function CardGrid<T>({
  items,
  renderItem,
  className = "",
  emptyState,
}: {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  className?: string;
  emptyState?: React.ReactNode;
}) {
  if (items.length === 0) {
    return (
      <div className="text-sm">
        <span style={{opacity: 0.7}}>{emptyState ?? "Tidak ada data."}</span>
      </div>
    );
  }
  return (
    <div className={["grid grid-cols-1 gap-3", className].join(" ")}>
      {items.map((it, idx) => (
        <React.Fragment key={idx}>{renderItem(it)}</React.Fragment>
      ))}
    </div>
  );
}
