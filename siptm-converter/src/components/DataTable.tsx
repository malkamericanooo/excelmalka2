import { useState, useMemo } from "react";
import { Edit3, Trash2, ChevronUp, ChevronDown, Search, X } from "lucide-react";
import { PatientRecord } from "@/lib/types";

interface DataTableProps {
  records: PatientRecord[];
  onEdit: (record: PatientRecord) => void;
  onDelete: (id: string) => void;
}

type SortDir = "asc" | "desc" | null;

const VISIBLE_COLS: Array<{ key: keyof PatientRecord; label: string; width?: string }> = [
  { key: "nik", label: "NIK", width: "140px" },
  { key: "namaPasien", label: "Nama Pasien", width: "180px" },
  { key: "jenisKelamin", label: "JK", width: "60px" },
  { key: "usia", label: "Usia", width: "60px" },
  { key: "tanggalLahir", label: "Tgl Lahir", width: "110px" },
  { key: "alamat", label: "Alamat", width: "200px" },
  { key: "sistol", label: "Sistol", width: "70px" },
  { key: "diastol", label: "Diastol", width: "70px" },
  { key: "tinggiBadan", label: "TB", width: "60px" },
  { key: "beratBadan", label: "BB", width: "60px" },
  { key: "imt", label: "IMT", width: "60px" },
  { key: "pemeriksaanGulaDarah", label: "GDS", width: "70px" },
  { key: "diagnosis1", label: "Diagnosis 1", width: "160px" },
];

function sortRecords(records: PatientRecord[], key: keyof PatientRecord, dir: SortDir) {
  if (!key || !dir) return records;
  return [...records].sort((a, b) => {
    const av = a[key] ?? "";
    const bv = b[key] ?? "";
    const an = Number(av);
    const bn = Number(bv);
    if (!isNaN(an) && !isNaN(bn)) return dir === "asc" ? an - bn : bn - an;
    const as = String(av).toLowerCase();
    const bs = String(bv).toLowerCase();
    return dir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
  });
}

export function DataTable({ records, onEdit, onDelete }: DataTableProps) {
  const [sortKey, setSortKey] = useState<keyof PatientRecord | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [search, setSearch] = useState("");

  function handleSort(key: keyof PatientRecord) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
      if (sortDir === "desc") setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return records;
    return records.filter((r) =>
      Object.values(r).some((v) =>
        v !== undefined && v !== null && String(v).toLowerCase().includes(q)
      )
    );
  }, [records, search]);

  const sorted = useMemo(
    () => sortKey ? sortRecords(filtered, sortKey, sortDir) : filtered,
    [filtered, sortKey, sortDir]
  );

  function getBpColor(sistol: string | number, diastol: string | number) {
    const s = Number(sistol);
    const d = Number(diastol);
    if (isNaN(s) || isNaN(d)) return "";
    if (s >= 140 || d >= 90) return "text-red-600 font-semibold";
    if (s >= 130 || d >= 80) return "text-orange-500 font-medium";
    return "text-green-600";
  }

  function getImtColor(imt: string | number) {
    const v = Number(imt);
    if (isNaN(v)) return "";
    if (v < 18.5) return "text-yellow-600";
    if (v < 25) return "text-green-600";
    if (v < 30) return "text-orange-500";
    return "text-red-600 font-semibold";
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, NIK, diagnosis..."
          className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="text-xs text-slate-500">
        Menampilkan <span className="font-semibold text-slate-700">{sorted.length}</span> dari{" "}
        <span className="font-semibold text-slate-700">{records.length}</span> data
        {search && <span> (filter: "{search}")</span>}
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-800 text-white text-xs">
              <th className="sticky left-0 z-10 bg-slate-800 px-3 py-3 text-center font-medium w-10">No</th>
              {VISIBLE_COLS.map((col) => (
                <th
                  key={col.key}
                  style={{ minWidth: col.width }}
                  className="px-3 py-3 text-left font-medium cursor-pointer hover:bg-slate-700 transition-colors select-none whitespace-nowrap"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <span className="opacity-60">
                      {sortKey === col.key ? (
                        sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronUp className="h-3 w-3 opacity-0 group-hover:opacity-50" />
                      )}
                    </span>
                  </div>
                </th>
              ))}
              <th className="px-3 py-3 text-center font-medium w-20">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={VISIBLE_COLS.length + 2}
                  className="py-10 text-center text-slate-400 text-sm"
                >
                  Tidak ada data{search ? ` untuk "${search}"` : ""}
                </td>
              </tr>
            ) : (
              sorted.map((record, idx) => (
                <tr
                  key={record.id}
                  className={[
                    "border-t border-slate-100 transition-colors hover:bg-blue-50/50",
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/50",
                  ].join(" ")}
                >
                  <td className="sticky left-0 z-10 bg-inherit px-3 py-2.5 text-center text-xs text-slate-400 font-medium">
                    {idx + 1}
                  </td>
                  {VISIBLE_COLS.map((col) => {
                    let className = "px-3 py-2.5 text-slate-700 whitespace-nowrap";
                    if (col.key === "sistol" || col.key === "diastol") {
                      className += " " + getBpColor(record.sistol, record.diastol);
                    }
                    if (col.key === "imt") {
                      className += " " + getImtColor(record.imt);
                    }
                    if (col.key === "alamat") {
                      className = "px-3 py-2.5 text-slate-600 max-w-xs overflow-hidden text-ellipsis";
                    }
                    const v = record[col.key];
                    return (
                      <td key={col.key} className={className}>
                        {col.key === "jenisKelamin" ? (
                          <span className={[
                            "px-1.5 py-0.5 rounded text-xs font-medium",
                            String(v).toLowerCase().includes("perempuan") || String(v).toLowerCase() === "p"
                              ? "bg-pink-100 text-pink-700"
                              : "bg-blue-100 text-blue-700",
                          ].join(" ")}>
                            {String(v || "—")}
                          </span>
                        ) : v !== undefined && v !== null && v !== "" ? String(v) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-3 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(record)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(record.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
