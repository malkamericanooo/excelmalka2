import { useState, useEffect } from "react";
import { X, Save, User, Activity, Stethoscope, Eye, Ear, TestTube, Heart } from "lucide-react";
import { PatientRecord } from "@/lib/types";

interface EditModalProps {
  record: PatientRecord | null;
  onClose: () => void;
  onSave: (updated: PatientRecord) => void;
}

type FieldConfig = { key: keyof PatientRecord; label: string; type?: "text" | "number" | "select" | "readonly"; options?: string[] };

const YA_TIDAK: string[] = ["Ya", "Tidak"];
const POS_NEG: string[] = ["Positif", "Negatif", "Tidak Diperiksa"];

const SECTIONS: Array<{ title: string; icon: React.ReactNode; color: string; fields: FieldConfig[] }> = [
  {
    title: "Identitas Pasien",
    icon: <User className="h-4 w-4" />,
    color: "blue",
    fields: [
      { key: "tanggalPemeriksaan", label: "Tanggal Pemeriksaan" },
      { key: "nik", label: "NIK" },
      { key: "namaPasien", label: "Nama Pasien" },
      { key: "tanggalLahir", label: "Tanggal Lahir" },
      { key: "jenisKelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
      { key: "provinsiAsal", label: "Provinsi Asal" },
      { key: "kotaKabupatenAsal", label: "Kota/Kab Asal" },
      { key: "alamat", label: "Alamat" },
      { key: "noTelpHp", label: "No HP" },
      { key: "statusPendidikan", label: "Pendidikan" },
      { key: "pekerjaan", label: "Pekerjaan" },
      { key: "statusPerkawinan", label: "Status Perkawinan", type: "select", options: ["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"] },
      { key: "golonganDarah", label: "Gol. Darah", type: "select", options: ["A", "B", "AB", "O", "Tidak Tahu"] },
    ],
  },
  {
    title: "Riwayat & Faktor Risiko",
    icon: <Activity className="h-4 w-4" />,
    color: "orange",
    fields: [
      { key: "riwayatKeluarga1", label: "Riwayat Keluarga 1" },
      { key: "riwayatKeluarga2", label: "Riwayat Keluarga 2" },
      { key: "riwayatKeluarga3", label: "Riwayat Keluarga 3" },
      { key: "riwayatDiri1", label: "Riwayat Diri 1" },
      { key: "riwayatDiri2", label: "Riwayat Diri 2" },
      { key: "riwayatDiri3", label: "Riwayat Diri 3" },
      { key: "merokok", label: "Merokok", type: "select", options: ["Ya", "Tidak", "Mantan Perokok"] },
      { key: "kurangAktivitasFisik", label: "Kurang Aktivitas Fisik", type: "select", options: YA_TIDAK },
      { key: "gulaBeberlebihan", label: "Gula Berlebihan", type: "select", options: YA_TIDAK },
      { key: "garamBerlebihan", label: "Garam Berlebihan", type: "select", options: YA_TIDAK },
      { key: "lemakBerlebihan", label: "Lemak Berlebihan", type: "select", options: YA_TIDAK },
      { key: "kurangMakanBuahSayur", label: "Kurang Buah & Sayur", type: "select", options: YA_TIDAK },
      { key: "konsumsiAlkohol", label: "Konsumsi Alkohol", type: "select", options: YA_TIDAK },
    ],
  },
  {
    title: "Pemeriksaan Fisik & Lab",
    icon: <Stethoscope className="h-4 w-4" />,
    color: "green",
    fields: [
      { key: "sistol", label: "Sistol (mmHg)", type: "number" },
      { key: "diastol", label: "Diastol (mmHg)", type: "number" },
      { key: "tinggiBadan", label: "Tinggi Badan (cm)", type: "number" },
      { key: "beratBadan", label: "Berat Badan (kg)", type: "number" },
      { key: "lingkarPerut", label: "Lingkar Perut (cm)", type: "number" },
      { key: "pemeriksaanGulaDarah", label: "Gula Darah", type: "number" },
      { key: "rujukRs", label: "Rujuk RS", type: "select", options: YA_TIDAK },
    ],
  },
  {
    title: "Diagnosis & Terapi",
    icon: <TestTube className="h-4 w-4" />,
    color: "purple",
    fields: [
      { key: "diagnosis1", label: "Diagnosis 1" },
      { key: "diagnosis2", label: "Diagnosis 2" },
      { key: "diagnosis3", label: "Diagnosis 3" },
      { key: "terapiFarmakologi", label: "Terapi Farmakologi" },
      { key: "konseling", label: "Konseling, Informasi & Edukasi" },
    ],
  },
  {
    title: "Penglihatan",
    icon: <Eye className="h-4 w-4" />,
    color: "yellow",
    fields: [
      { key: "katarakMataKanan", label: "Katarak Mata Kanan", type: "select", options: POS_NEG },
      { key: "katarakMataKiri", label: "Katarak Mata Kiri", type: "select", options: POS_NEG },
      { key: "katarakRujukRS", label: "Katarak Rujuk RS", type: "select", options: YA_TIDAK },
      { key: "kelainanRefraksiMataKanan", label: "Kel. Refraksi Mata Kanan", type: "select", options: POS_NEG },
      { key: "kelainanRefraksiMataKiri", label: "Kel. Refraksi Mata Kiri", type: "select", options: POS_NEG },
      { key: "kelainanRefraksiRujukRS", label: "Kel. Refraksi Rujuk RS", type: "select", options: YA_TIDAK },
    ],
  },
  {
    title: "Pendengaran",
    icon: <Ear className="h-4 w-4" />,
    color: "amber",
    fields: [
      { key: "tuliKongenitalTelingaKanan", label: "Tuli Kongenital Kanan", type: "select", options: POS_NEG },
      { key: "tuliKongenitalTelingaKiri", label: "Tuli Kongenital Kiri", type: "select", options: POS_NEG },
      { key: "tuliKongenitalRujukRS", label: "Tuli Kongenital Rujuk RS", type: "select", options: YA_TIDAK },
      { key: "omskTelingaKanan", label: "OMSK Telinga Kanan", type: "select", options: POS_NEG },
      { key: "omskTelingaKiri", label: "OMSK Telinga Kiri", type: "select", options: POS_NEG },
      { key: "omskRujukRS", label: "OMSK Rujuk RS", type: "select", options: YA_TIDAK },
      { key: "serumenTelingaKanan", label: "Serumen Telinga Kanan", type: "select", options: POS_NEG },
      { key: "serumenTelingaKiri", label: "Serumen Telinga Kiri", type: "select", options: POS_NEG },
      { key: "serumenRujukRS", label: "Serumen Rujuk RS", type: "select", options: YA_TIDAK },
    ],
  },
  {
    title: "IVA, SADANIS & UBM",
    icon: <Heart className="h-4 w-4" />,
    color: "red",
    fields: [
      { key: "hasilIva", label: "Hasil IVA", type: "select", options: ["Negatif", "Positif", "Tidak Dilakukan"] },
      { key: "tindakLanjutIvaPositif", label: "Tindak Lanjut IVA Positif" },
      { key: "hasilSadanis", label: "Hasil SADANIS", type: "select", options: ["Normal", "Tidak Normal", "Tidak Dilakukan"] },
      { key: "tindakLanjutSadanis", label: "Tindak Lanjut SADANIS" },
      { key: "konselingUbm", label: "Konseling UBM", type: "select", options: YA_TIDAK },
      { key: "car", label: "CAR", type: "select", options: YA_TIDAK },
      { key: "rujukUbm", label: "Rujuk UBM", type: "select", options: YA_TIDAK },
      { key: "kondisiUbm", label: "Kondisi UBM" },
    ],
  },
];

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-700",
  green: "bg-green-100 text-green-700",
  purple: "bg-purple-100 text-purple-700",
  yellow: "bg-yellow-100 text-yellow-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
};

export function EditModal({ record, onClose, onSave }: EditModalProps) {
  const [form, setForm] = useState<PatientRecord | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    if (record) setForm({ ...record });
  }, [record]);

  if (!record || !form) return null;

  function computeImt(tb: string | number, bb: string | number): string | number {
    const h = Number(tb);
    const w = Number(bb);
    if (h > 0 && w > 0) return +(w / ((h / 100) ** 2)).toFixed(1);
    return "";
  }

  function computeUsia(tglLahir: string | number, tglPeriksa: string | number): string | number {
    const parse = (s: string | number) => {
      const str = String(s ?? "").trim();
      const parts = str.split(/[-/]/);
      if (parts.length === 3) {
        const [a, b, c] = parts.map(Number);
        // dd-mm-yyyy or yyyy-mm-dd
        if (a > 31) return new Date(a, b - 1, c);
        return new Date(c, b - 1, a);
      }
      const d = new Date(str);
      return isNaN(d.getTime()) ? null : d;
    };
    const dLahir = parse(tglLahir);
    const dPeriksa = parse(tglPeriksa);
    if (!dLahir || !dPeriksa) return "";
    let age = (dPeriksa as Date).getFullYear() - (dLahir as Date).getFullYear();
    const m = (dPeriksa as Date).getMonth() - (dLahir as Date).getMonth();
    if (m < 0 || (m === 0 && (dPeriksa as Date).getDate() < (dLahir as Date).getDate())) age--;
    return age >= 0 ? age : "";
  }

  function updateField(key: keyof PatientRecord, value: string | number) {
    setForm((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [key]: value };
      if (key === "tinggiBadan" || key === "beratBadan") {
        updated.imt = computeImt(
          key === "tinggiBadan" ? value : prev.tinggiBadan,
          key === "beratBadan" ? value : prev.beratBadan
        );
      }
      if (key === "tanggalLahir" || key === "tanggalPemeriksaan") {
        updated.usia = computeUsia(
          key === "tanggalLahir" ? value : prev.tanggalLahir,
          key === "tanggalPemeriksaan" ? value : prev.tanggalPemeriksaan
        );
      }
      return updated;
    });
  }

  function handleSave() {
    if (form) onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full sm:max-w-3xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Edit Data Pasien</h2>
            <p className="text-xs text-slate-500 mt-0.5">{form.namaPasien || "—"} · NIK: {form.nik || "—"}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1.5 overflow-x-auto px-5 py-3 border-b border-slate-100 scrollbar-hide">
          {SECTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveSection(i)}
              className={[
                "flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                activeSection === i
                  ? COLOR_MAP[s.color] + " ring-2 ring-offset-1 " + `ring-${s.color}-300`
                  : "text-slate-500 hover:bg-slate-100",
              ].join(" ")}
            >
              {s.icon}
              <span className="hidden sm:inline">{s.title}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SECTIONS[activeSection].fields.map((field) => (
              <div key={field.key} className={field.key === "alamat" ? "sm:col-span-2" : ""}>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {field.label}
                </label>
                {field.type === "readonly" ? (
                  <div className="w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-500 select-none">
                    {String(form[field.key] ?? "") || <span className="italic text-slate-300">—</span>}
                  </div>
                ) : field.type === "select" && field.options ? (
                  <select
                    value={String(form[field.key] ?? "")}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <option value="">— Pilih —</option>
                    {field.options.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    value={String(form[field.key] ?? "")}
                    onChange={(e) =>
                      updateField(
                        field.key,
                        field.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    placeholder="Kosong"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          <div className="flex gap-2 text-xs text-slate-400">
            <span>{activeSection + 1} dari {SECTIONS.length} bagian</span>
            <span>·</span>
            <button
              className="text-slate-500 hover:text-slate-700 disabled:opacity-30"
              onClick={() => setActiveSection((p) => Math.max(0, p - 1))}
              disabled={activeSection === 0}
            >
              ← Sebelumnya
            </button>
            <button
              className="text-slate-500 hover:text-slate-700 disabled:opacity-30"
              onClick={() => setActiveSection((p) => Math.min(SECTIONS.length - 1, p + 1))}
              disabled={activeSection === SECTIONS.length - 1}
            >
              Berikutnya →
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Save className="h-4 w-4" />
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
