import { useState } from "react";
import { ChevronDown, ChevronRight, TableProperties, Info } from "lucide-react";
import { PatientRecord } from "@/lib/types";

interface MappingPreviewProps {
  records: PatientRecord[];
  isFormOffline: boolean;
}

interface MappingRow {
  group: string;
  groupColor: string;
  f1Col: number;
  f1Label: string;
  f2Col: number;
  f2Label: string;
  field: keyof PatientRecord;
}

const MAPPING_TABLE: MappingRow[] = [
  // Identitas
  { group: "Identitas", groupColor: "bg-blue-100 text-blue-700",   f1Col:  1, f1Label: "Tanggal Pemeriksaan",       f2Col:  1, f2Label: "TANGGAL PEMERIKSAAN",          field: "tanggalPemeriksaan" },
  { group: "Identitas", groupColor: "bg-blue-100 text-blue-700",   f1Col:  2, f1Label: "NIK",                       f2Col:  2, f2Label: "NIK",                           field: "nik" },
  { group: "Identitas", groupColor: "bg-blue-100 text-blue-700",   f1Col:  3, f1Label: "Nama Pasien",               f2Col:  3, f2Label: "NAMA PASIEN",                    field: "namaPasien" },
  { group: "Identitas", groupColor: "bg-blue-100 text-blue-700",   f1Col:  4, f1Label: "Tanggal Lahir",             f2Col:  4, f2Label: "TANGGAL LAHIR",                  field: "tanggalLahir" },
  { group: "Identitas", groupColor: "bg-blue-100 text-blue-700",   f1Col:  5, f1Label: "Jenis Kelamin",             f2Col:  5, f2Label: "JENIS KELAMIN",                  field: "jenisKelamin" },
  { group: "Identitas", groupColor: "bg-blue-100 text-blue-700",   f1Col:  6, f1Label: "Provinsi Asal Pasien",      f2Col:  6, f2Label: "PROVINSI ASAL PASIEN",           field: "provinsiAsal" },
  { group: "Identitas", groupColor: "bg-blue-100 text-blue-700",   f1Col:  7, f1Label: "Kota/Kab. Asal Pasien",    f2Col:  7, f2Label: "KOTA/KAB. ASAL PASIEN",          field: "kotaKabupatenAsal" },
  { group: "Identitas", groupColor: "bg-blue-100 text-blue-700",   f1Col:  8, f1Label: "Alamat",                   f2Col:  8, f2Label: "ALAMAT",                          field: "alamat" },
  { group: "Identitas", groupColor: "bg-blue-100 text-blue-700",   f1Col:  9, f1Label: "No. Telp/HP",              f2Col:  9, f2Label: "NO.TELP/HP",                      field: "noTelpHp" },
  { group: "Identitas", groupColor: "bg-blue-100 text-blue-700",   f1Col: 10, f1Label: "Status Pendidikan",        f2Col: 10, f2Label: "STATUS PENDIDIKAN",               field: "statusPendidikan" },
  { group: "Identitas", groupColor: "bg-blue-100 text-blue-700",   f1Col: 11, f1Label: "Pekerjaan",                f2Col: 11, f2Label: "PEKERJAAN",                       field: "pekerjaan" },
  { group: "Identitas", groupColor: "bg-blue-100 text-blue-700",   f1Col: 12, f1Label: "Status Perkawinan",        f2Col: 12, f2Label: "STATUS PERKAWINAN",               field: "statusPerkawinan" },
  { group: "Identitas", groupColor: "bg-blue-100 text-blue-700",   f1Col: 13, f1Label: "Golongan Darah",           f2Col: 13, f2Label: "GOLONGAN DARAH",                  field: "golonganDarah" },
  // Riwayat
  { group: "Riwayat",   groupColor: "bg-orange-100 text-orange-700", f1Col: 14, f1Label: "Riwayat Keluarga 1",    f2Col: 14, f2Label: "RIWAYAT KELUARGA 1",              field: "riwayatKeluarga1" },
  { group: "Riwayat",   groupColor: "bg-orange-100 text-orange-700", f1Col: 15, f1Label: "Riwayat Keluarga 2",    f2Col: 15, f2Label: "RIWAYAT KELUARGA 2",              field: "riwayatKeluarga2" },
  { group: "Riwayat",   groupColor: "bg-orange-100 text-orange-700", f1Col: 16, f1Label: "Riwayat Keluarga 3",    f2Col: 16, f2Label: "RIWAYAT KELUARGA 3",              field: "riwayatKeluarga3" },
  { group: "Riwayat",   groupColor: "bg-orange-100 text-orange-700", f1Col: 17, f1Label: "Riwayat Diri Sendiri 1",f2Col: 17, f2Label: "RIWAYAT DIRI SENDIRI 1",          field: "riwayatDiri1" },
  { group: "Riwayat",   groupColor: "bg-orange-100 text-orange-700", f1Col: 18, f1Label: "Riwayat Diri Sendiri 2",f2Col: 18, f2Label: "RIWAYAT DIRI SENDIRI 2",          field: "riwayatDiri2" },
  { group: "Riwayat",   groupColor: "bg-orange-100 text-orange-700", f1Col: 19, f1Label: "Riwayat Diri Sendiri 3",f2Col: 19, f2Label: "RIWAYAT DIRI SENDIRI 3",          field: "riwayatDiri3" },
  // Faktor Risiko
  { group: "Faktor Risiko", groupColor: "bg-yellow-100 text-yellow-700", f1Col: 20, f1Label: "Merokok",                    f2Col: 20, f2Label: "MEROKOK",                      field: "merokok" },
  { group: "Faktor Risiko", groupColor: "bg-yellow-100 text-yellow-700", f1Col: 21, f1Label: "Kurang Aktivitas Fisik",     f2Col: 21, f2Label: "KURANG AKTIFITAS FISIK",       field: "kurangAktivitasFisik" },
  { group: "Faktor Risiko", groupColor: "bg-yellow-100 text-yellow-700", f1Col: 22, f1Label: "Gula Berlebihan",            f2Col: 22, f2Label: "GULA BERLEBIHAN",              field: "gulaBeberlebihan" },
  { group: "Faktor Risiko", groupColor: "bg-yellow-100 text-yellow-700", f1Col: 23, f1Label: "Garam Berlebihan",           f2Col: 23, f2Label: "GARAM BERLEBIHAN",             field: "garamBerlebihan" },
  { group: "Faktor Risiko", groupColor: "bg-yellow-100 text-yellow-700", f1Col: 24, f1Label: "Lemak Berlebihan",           f2Col: 24, f2Label: "LEMAK BERLEBIHAN",             field: "lemakBerlebihan" },
  { group: "Faktor Risiko", groupColor: "bg-yellow-100 text-yellow-700", f1Col: 25, f1Label: "Kurang Makan Buah & Sayur", f2Col: 25, f2Label: "KURANG MAKAN BUAH DAN SAYUR", field: "kurangMakanBuahSayur" },
  { group: "Faktor Risiko", groupColor: "bg-yellow-100 text-yellow-700", f1Col: 26, f1Label: "Konsumsi Alkohol",           f2Col: 26, f2Label: "KONSUMSI ALKOHOL",             field: "konsumsiAlkohol" },
  // Pemeriksaan Fisik
  { group: "Pemeriksaan Fisik", groupColor: "bg-green-100 text-green-700", f1Col: 27, f1Label: "Sistol (mmHg)",        f2Col: 27, f2Label: "SISTOL",             field: "sistol" },
  { group: "Pemeriksaan Fisik", groupColor: "bg-green-100 text-green-700", f1Col: 28, f1Label: "Diastol (mmHg)",       f2Col: 28, f2Label: "DIASTOL",            field: "diastol" },
  { group: "Pemeriksaan Fisik", groupColor: "bg-green-100 text-green-700", f1Col: 29, f1Label: "Tinggi Badan (cm)",    f2Col: 29, f2Label: "TINGGI BADAN(CM)",   field: "tinggiBadan" },
  { group: "Pemeriksaan Fisik", groupColor: "bg-green-100 text-green-700", f1Col: 30, f1Label: "Berat Badan (kg)",     f2Col: 30, f2Label: "BERAT BADAN (KG)",   field: "beratBadan" },
  { group: "Pemeriksaan Fisik", groupColor: "bg-green-100 text-green-700", f1Col: 31, f1Label: "Lingkar Perut (cm)",   f2Col: 31, f2Label: "LINGKAR PERUT(CM)",  field: "lingkarPerut" },
  { group: "Pemeriksaan Fisik", groupColor: "bg-green-100 text-green-700", f1Col: 32, f1Label: "Pemeriksaan Gula",     f2Col: 32, f2Label: "PEMERIKSAAN GULA",   field: "pemeriksaanGulaDarah" },
  { group: "Pemeriksaan Fisik", groupColor: "bg-green-100 text-green-700", f1Col: 33, f1Label: "Rujuk RS",             f2Col: 33, f2Label: "RUJUK RS",            field: "rujukRs" },
  // Diagnosis
  { group: "Diagnosis & Terapi", groupColor: "bg-purple-100 text-purple-700", f1Col: 34, f1Label: "Diagnosis 1",          f2Col: 34, f2Label: "DIAGNOSIS 1",          field: "diagnosis1" },
  { group: "Diagnosis & Terapi", groupColor: "bg-purple-100 text-purple-700", f1Col: 35, f1Label: "Diagnosis 2",          f2Col: 35, f2Label: "DIAGNOSIS 2",          field: "diagnosis2" },
  { group: "Diagnosis & Terapi", groupColor: "bg-purple-100 text-purple-700", f1Col: 36, f1Label: "Diagnosis 3",          f2Col: 36, f2Label: "DIAGNOSIS 3",          field: "diagnosis3" },
  { group: "Diagnosis & Terapi", groupColor: "bg-purple-100 text-purple-700", f1Col: 37, f1Label: "Terapi Farmakologi",   f2Col: 37, f2Label: "TERAPI FARMAKOLOGI",   field: "terapiFarmakologi" },
  { group: "Diagnosis & Terapi", groupColor: "bg-purple-100 text-purple-700", f1Col: 38, f1Label: "Konseling / KIE",     f2Col: 38, f2Label: "KONSELING / KIE",      field: "konseling" },
  // Gangguan Penglihatan
  { group: "Penglihatan", groupColor: "bg-sky-100 text-sky-700", f1Col: 39, f1Label: "Katarak – Mata Kanan",           f2Col: 39, f2Label: "KATARAK MATA KANAN",          field: "katarakMataKanan" },
  { group: "Penglihatan", groupColor: "bg-sky-100 text-sky-700", f1Col: 40, f1Label: "Katarak – Mata Kiri",            f2Col: 40, f2Label: "KATARAK MATA KIRI",           field: "katarakMataKiri" },
  { group: "Penglihatan", groupColor: "bg-sky-100 text-sky-700", f1Col: 41, f1Label: "Katarak – Rujuk RS",             f2Col: 41, f2Label: "KATARAK RUJUK RS",            field: "katarakRujukRS" },
  { group: "Penglihatan", groupColor: "bg-sky-100 text-sky-700", f1Col: 42, f1Label: "Kel. Refraksi – Mata Kanan",    f2Col: 42, f2Label: "KEL. REFRAKSI MATA KANAN",   field: "kelainanRefraksiMataKanan" },
  { group: "Penglihatan", groupColor: "bg-sky-100 text-sky-700", f1Col: 43, f1Label: "Kel. Refraksi – Mata Kiri",     f2Col: 43, f2Label: "KEL. REFRAKSI MATA KIRI",    field: "kelainanRefraksiMataKiri" },
  { group: "Penglihatan", groupColor: "bg-sky-100 text-sky-700", f1Col: 44, f1Label: "Kel. Refraksi – Rujuk RS",      f2Col: 44, f2Label: "KEL. REFRAKSI RUJUK RS",     field: "kelainanRefraksiRujukRS" },
  // Gangguan Pendengaran
  { group: "Pendengaran", groupColor: "bg-teal-100 text-teal-700", f1Col: 45, f1Label: "Tuli Kongenital – Telinga Kanan",  f2Col: 45, f2Label: "TULI KONGENITAL KANAN",   field: "tuliKongenitalTelingaKanan" },
  { group: "Pendengaran", groupColor: "bg-teal-100 text-teal-700", f1Col: 46, f1Label: "Tuli Kongenital – Telinga Kiri",   f2Col: 46, f2Label: "TULI KONGENITAL KIRI",    field: "tuliKongenitalTelingaKiri" },
  { group: "Pendengaran", groupColor: "bg-teal-100 text-teal-700", f1Col: 47, f1Label: "Tuli Kongenital – Rujuk RS",       f2Col: 47, f2Label: "TULI KONGENITAL RUJUK RS",field: "tuliKongenitalRujukRS" },
  { group: "Pendengaran", groupColor: "bg-teal-100 text-teal-700", f1Col: 48, f1Label: "OMSK – Telinga Kanan",             f2Col: 48, f2Label: "OMSK KANAN",              field: "omskTelingaKanan" },
  { group: "Pendengaran", groupColor: "bg-teal-100 text-teal-700", f1Col: 49, f1Label: "OMSK – Telinga Kiri",              f2Col: 49, f2Label: "OMSK KIRI",               field: "omskTelingaKiri" },
  { group: "Pendengaran", groupColor: "bg-teal-100 text-teal-700", f1Col: 50, f1Label: "OMSK – Rujuk RS",                  f2Col: 50, f2Label: "OMSK RUJUK RS",           field: "omskRujukRS" },
  { group: "Pendengaran", groupColor: "bg-teal-100 text-teal-700", f1Col: 51, f1Label: "Serumen – Telinga Kanan",          f2Col: 51, f2Label: "SERUMEN KANAN",            field: "serumenTelingaKanan" },
  { group: "Pendengaran", groupColor: "bg-teal-100 text-teal-700", f1Col: 52, f1Label: "Serumen – Telinga Kiri",           f2Col: 52, f2Label: "SERUMEN KIRI",             field: "serumenTelingaKiri" },
  { group: "Pendengaran", groupColor: "bg-teal-100 text-teal-700", f1Col: 53, f1Label: "Serumen – Rujuk RS",               f2Col: 53, f2Label: "SERUMEN RUJUK RS",         field: "serumenRujukRS" },
  // IVA & SADANIS
  { group: "IVA & SADANIS", groupColor: "bg-pink-100 text-pink-700", f1Col: 54, f1Label: "Hasil IVA",                   f2Col: 54, f2Label: "HASIL IVA",                  field: "hasilIva" },
  { group: "IVA & SADANIS", groupColor: "bg-pink-100 text-pink-700", f1Col: 55, f1Label: "Tindak Lanjut IVA Positif",  f2Col: 55, f2Label: "TINDAK LANJUT IVA POSITIF", field: "tindakLanjutIvaPositif" },
  { group: "IVA & SADANIS", groupColor: "bg-pink-100 text-pink-700", f1Col: 56, f1Label: "Hasil SADANIS",              f2Col: 56, f2Label: "HASIL SADANIS",              field: "hasilSadanis" },
  { group: "IVA & SADANIS", groupColor: "bg-pink-100 text-pink-700", f1Col: 57, f1Label: "Tindak Lanjut SADANIS",      f2Col: 57, f2Label: "TINDAK LANJUT SADANIS",     field: "tindakLanjutSadanis" },
  // UBM
  { group: "Form UBM", groupColor: "bg-amber-100 text-amber-700", f1Col: 58, f1Label: "Konseling UBM",  f2Col: 58, f2Label: "KONSELING UBM", field: "konselingUbm" },
  { group: "Form UBM", groupColor: "bg-amber-100 text-amber-700", f1Col: 59, f1Label: "CAR",             f2Col: 59, f2Label: "CAR",           field: "car" },
  { group: "Form UBM", groupColor: "bg-amber-100 text-amber-700", f1Col: 60, f1Label: "Rujuk UBM",      f2Col: 60, f2Label: "RUJUK UBM",     field: "rujukUbm" },
  { group: "Form UBM", groupColor: "bg-amber-100 text-amber-700", f1Col: 61, f1Label: "Kondisi",         f2Col: 61, f2Label: "KONDISI",        field: "kondisiUbm" },
];

const DROPPED_COLS = [
  { cols: "62–66", label: "Skrining Organ (Mata, Ginjal, Hati, Saraf & Otot, Kardiovaskular)" },
  { cols: "67–70", label: "Profil Lipid (Kolesterol Total, LDL, HDL, Trigliserida)" },
  { cols: "71",    label: "Usia" },
  { cols: "72",    label: "Kriteria Usia" },
  { cols: "73",    label: "Skor PUMA" },
  { cols: "74–97", label: "Kolom tambahan lainnya" },
];

export function MappingPreview({ records, isFormOffline }: MappingPreviewProps) {
  const [open, setOpen] = useState(false);
  const sample = records[0] ?? null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <TableProperties className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-800">Peta Kolom: File 1 → Template fktpmar26</span>
          {isFormOffline && (
            <span className="hidden sm:inline text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              Mapping posisi aktif
            </span>
          )}
          {!isFormOffline && (
            <span className="hidden sm:inline text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
              Mapping header-name
            </span>
          )}
        </div>
        {open
          ? <ChevronDown className="h-4 w-4 text-slate-400" />
          : <ChevronRight className="h-4 w-4 text-slate-400" />}
      </button>

      {open && (
        <div className="border-t border-slate-100">
          {/* Mode info */}
          <div className="flex items-start gap-2 px-4 py-2.5 bg-slate-50 text-xs text-slate-600 border-b border-slate-100">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" />
            {isFormOffline
              ? "Sheet terdeteksi sebagai FORM OFFLINE SURVEILAN SIPTM — mapping pakai posisi kolom yang hardcoded (tidak bergantung nama header). Kolom 62+ otomatis di-drop."
              : "Sheet tidak dikenali sebagai FORM OFFLINE — mapping pakai pencocokan nama header. Pastikan nama kolom sesuai dengan standar."}
          </div>

          {/* Mapping table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600">
                  <th className="text-left px-3 py-2 font-semibold whitespace-nowrap">Grup</th>
                  <th className="text-left px-3 py-2 font-semibold whitespace-nowrap">Col File 1</th>
                  <th className="text-left px-3 py-2 font-semibold whitespace-nowrap">Header File 1</th>
                  <th className="text-left px-3 py-2 font-semibold whitespace-nowrap">Col fktpmar26</th>
                  <th className="text-left px-3 py-2 font-semibold whitespace-nowrap">Header fktpmar26</th>
                  <th className="text-left px-3 py-2 font-semibold whitespace-nowrap">Contoh Nilai</th>
                </tr>
              </thead>
              <tbody>
                {MAPPING_TABLE.map((row, i) => {
                  const sampleVal = sample ? String(sample[row.field] ?? "") : "";
                  const prevGroup = i > 0 ? MAPPING_TABLE[i - 1].group : null;
                  const isFirstInGroup = row.group !== prevGroup;
                  return (
                    <tr
                      key={i}
                      className={[
                        "border-t border-slate-100",
                        i % 2 === 0 ? "bg-white" : "bg-slate-50/50",
                      ].join(" ")}
                    >
                      <td className="px-3 py-1.5 whitespace-nowrap">
                        {isFirstInGroup && (
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${row.groupColor}`}>
                            {row.group}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-slate-500 whitespace-nowrap">
                        {row.f1Col}
                      </td>
                      <td className="px-3 py-1.5 text-slate-700 whitespace-nowrap">{row.f1Label}</td>
                      <td className="px-3 py-1.5 font-mono text-slate-500 whitespace-nowrap">
                        {row.f2Col}
                      </td>
                      <td className="px-3 py-1.5 text-slate-700 whitespace-nowrap">{row.f2Label}</td>
                      <td className="px-3 py-1.5 max-w-[160px]">
                        {sampleVal
                          ? <span className="text-blue-700 font-medium truncate block" title={sampleVal}>{sampleVal}</span>
                          : <span className="text-slate-300 italic">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Dropped columns */}
          <div className="px-4 py-3 border-t border-slate-100 bg-red-50/50">
            <p className="text-xs font-semibold text-red-700 mb-1.5">
              Kolom File 1 yang di-drop (tidak ada di template fktpmar26):
            </p>
            <div className="flex flex-wrap gap-2">
              {DROPPED_COLS.map((d) => (
                <span key={d.cols} className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                  <span className="font-mono font-bold">Col {d.cols}</span>
                  <span>— {d.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
