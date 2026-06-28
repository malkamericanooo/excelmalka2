import * as XLSX from "xlsx";
import { PatientRecord } from "./types";

export const TOTAL_COLS = 62;

/**
 * Exact header colors from fktpmar26 template (extracted from source file).
 * Key = column index (0-based), Value = hex color string (no #).
 */
export const COL_COLORS: Record<number, string> = {
  0:  "FFFFFF",
  1:  "2F5597",
  2:  "70AD46", 3:  "70AD46", 4:  "70AD46", 5:  "70AD46",
  6:  "70AD46", 7:  "70AD46", 8:  "70AD46", 9:  "70AD46",
  10: "70AD46", 11: "70AD46", 12: "70AD46", 13: "70AD46",
  14: "C55911", 15: "C55911", 16: "C55911",
  17: "C55911", 18: "C55911", 19: "C55911",
  20: "BF8F00", 21: "BF8F00", 22: "BF8F00", 23: "BF8F00",
  24: "BF8F00", 25: "BF8F00", 26: "BF8F00",
  27: "F4B083", 28: "F4B083",
  29: "00B0F0", 30: "00B0F0",
  31: "385623", 32: "385623", 33: "385623",
  34: "00B050", 35: "00B050", 36: "00B050",
  37: "00B050", 38: "00B050",
  39: "2F5597", 40: "2F5597", 41: "2F5597",
  42: "2F5597", 43: "2F5597", 44: "2F5597",
  45: "2F5597", 46: "2F5597", 47: "2F5597",
  48: "2F5597", 49: "2F5597", 50: "2F5597",
  51: "2F5597", 52: "2F5597", 53: "2F5597",
  54: "ED7B30", 55: "ED7B30", 56: "ED7B30", 57: "ED7B30",
  58: "BF8F00", 59: "BF8F00", 60: "BF8F00", 61: "BF8F00",
};

/** Data-row background color (light blue, matches template data area) */
const DATA_ROW_BG = "BED7EE";

/**
 * 5-row header structure matching the fktpmar26 template exactly.
 * Row 0 = institutional row, Row 1 = group headers,
 * Row 2 = sub-group/column headers, Row 3 = sub-column headers,
 * Row 4 = leaf headers (Mata Kanan / Kiri / Rujuk RS etc.)
 */
const HEADER_ROWS: string[][] = [
  // Row 0 – institutional
  Array(TOTAL_COLS).fill(""),

  // Row 1 – major group headers
  [
    "",
    "TANGGAL PEMERIKSAAN*",
    "IDENTITAS PESERTA PUSKESMAS", "", "", "", "", "", "", "", "", "", "", "",
    "RIWAYAT PENYAKIT TIDAK MENULAR PADA KELUARGA", "", "",
    "RIWAYAT PENYAKIT TIDAK MENULAR PADA DIRI SENDIRI", "", "",
    "FAKTOR RISIKO", "", "", "", "", "", "",
    "TEKANAN DARAH", "",
    "IMT", "",
    "LINGKAR PERUT(CM)",
    "PEMERIKSAAN GULA",
    "RUJUK RS",
    "DIAGNOSIS", "", "",
    "TERAPI FARMAKOLOGI",
    "KONSELING, INFORMASI DAN EDUKASI KESAHATAN",
    "GANGGUAN INDERA", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    "PEMERIKSAAN IVA & SADANIS", "", "", "",
    "FORM UBM", "", "", "",
  ],

  // Row 2 – column-level headers
  [
    "",
    "",
    "NIK",
    "NAMA PASIEN*",
    "TANGGAL LAHIR *",
    "JENIS KELAMIN *",
    "PROVINSI ASAL PASIEN (JIKA TIDAK DIISI AKAN MENGIKUTI PROVINSI PUSKESMAS)",
    "KOTA/KAB. ASAL PASIEN (JIKA TIDAK DIISI AKAN MENGIKUTI KAB.KOT PUSKESMAS)",
    "ALAMAT*",
    "NO.TELP/HP",
    "STATUS PENDIDIKAN",
    "PEKERJAAN",
    "STATUS PERKAWINAN",
    "GOLONGAN DARAH",
    "RIWAYAT 1",
    "RIWAYAT 2",
    "RIWAYAT 3",
    "RIWAYAT 1",
    "RIWAYAT 2",
    "RIWAYAT 3",
    "MEROKOK",
    "KURANG AKTIFITAS FISIK",
    "POLA MAKAN", "", "", "",
    "KONSUMSI ALKOHOL",
    "SISTOL",
    "DIASTOL",
    "TINGGI BADAN(CM)",
    "BERAT BADAN (KG)",
    "",
    "",
    "",
    "DIAGNOSIS 1",
    "DIAGNOSIS 2",
    "DIAGNOSIS 3",
    "",
    "",
    "GANGGUAN PENGLIHATAN", "", "", "", "", "",
    "GANGGUAN PENDENGARAN", "", "", "", "", "", "", "", "",
    "PEMERIKSAAN IVA", "",
    "PEMERIKSAAN SADANIS", "",
    "KONSELING",
    "CAR",
    "RUJUK UBM",
    "KONDISI",
  ],

  // Row 3 – sub-column headers
  [
    "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "",
    "", "",
    "GULA BERLEBIHAN",
    "GARAM BERLEBIHAN",
    "LEMAK BERLEBIHAN",
    "KURANG MAKAN BUAH DAN SAYUR",
    "", "", "", "", "", "", "", "", "", "", "", "", "",
    "KATARAK", "", "",
    "KELAINAN REFRAKSI", "", "",
    "CURIGA TULI KONGENITAL", "", "",
    "(OMSK/CONGEK)", "", "",
    "SERUMEN", "", "",
    "HASIL IVA",
    "TINDAK LANJUT IVA POSITIF",
    "HASIL SADANIS",
    "TINDAK LANJUT SADANIS",
    "", "", "", "",
  ],

  // Row 4 – leaf headers (Mata Kanan / Kiri / Rujuk RS)
  [
    "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    "", "", "", "", "", "",
    "", "", "", "", "", "", "", "", "", "", "", "", "", "",
    "", "", "", "", "",
    "MATA KANAN", "MATA KIRI", "RUJUK  RS",
    "MATA KANAN", "MATA KIRI", "RUJUK  RS",
    "TELINGA KANAN", "TELINGA KIRI", "RUJUK  RS",
    "TELINGA KANAN", "TELINGA KIRI", "RUJUK  RS",
    "TELINGA KANAN", "TELINGA KIRI", "RUJUK  RS",
    "", "", "", "",
    "", "", "", "",
  ],
];

/**
 * Map one PatientRecord to a flat row array (62 elements, 0-indexed).
 * Exported for unit testing.
 */
export function recordToRow(record: PatientRecord, index: number): unknown[] {
  return [
    index + 1,                           // 0
    record.tanggalPemeriksaan,           // 1
    record.nik,                          // 2
    record.namaPasien,                   // 3
    record.tanggalLahir,                 // 4
    record.jenisKelamin,                 // 5
    record.provinsiAsal,                 // 6
    record.kotaKabupatenAsal,            // 7
    record.alamat,                       // 8
    record.noTelpHp,                     // 9
    record.statusPendidikan,             // 10
    record.pekerjaan,                    // 11
    record.statusPerkawinan,             // 12
    record.golonganDarah,                // 13
    record.riwayatKeluarga1,             // 14
    record.riwayatKeluarga2,             // 15
    record.riwayatKeluarga3,             // 16
    record.riwayatDiri1,                 // 17
    record.riwayatDiri2,                 // 18
    record.riwayatDiri3,                 // 19
    record.merokok,                      // 20
    record.kurangAktivitasFisik,         // 21
    record.gulaBeberlebihan,             // 22
    record.garamBerlebihan,              // 23
    record.lemakBerlebihan,              // 24
    record.kurangMakanBuahSayur,         // 25
    record.konsumsiAlkohol,              // 26
    record.sistol,                       // 27
    record.diastol,                      // 28
    record.tinggiBadan,                  // 29
    record.beratBadan,                   // 30
    record.lingkarPerut,                 // 31
    record.pemeriksaanGulaDarah,         // 32
    record.rujukRs,                      // 33
    record.diagnosis1,                   // 34
    record.diagnosis2,                   // 35
    record.diagnosis3,                   // 36
    record.terapiFarmakologi,            // 37
    record.konseling,                    // 38
    record.katarakMataKanan,             // 39
    record.katarakMataKiri,              // 40
    record.katarakRujukRS,               // 41
    record.kelainanRefraksiMataKanan,    // 42
    record.kelainanRefraksiMataKiri,     // 43
    record.kelainanRefraksiRujukRS,      // 44
    record.tuliKongenitalTelingaKanan,   // 45
    record.tuliKongenitalTelingaKiri,    // 46
    record.tuliKongenitalRujukRS,        // 47
    record.omskTelingaKanan,             // 48
    record.omskTelingaKiri,              // 49
    record.omskRujukRS,                  // 50
    record.serumenTelingaKanan,          // 51
    record.serumenTelingaKiri,           // 52
    record.serumenRujukRS,               // 53
    record.hasilIva,                     // 54
    record.tindakLanjutIvaPositif,       // 55
    record.hasilSadanis,                 // 56
    record.tindakLanjutSadanis,          // 57
    record.konselingUbm,                 // 58
    record.car,                          // 59
    record.rujukUbm,                     // 60
    record.kondisiUbm,                   // 61
  ];
}

function applyHeaderStyle(ws: XLSX.WorkSheet, r: number, c: number, colIdx: number): void {
  const addr = XLSX.utils.encode_cell({ r, c });
  if (!ws[addr]) ws[addr] = { v: "", t: "s" };
  const bgColor = COL_COLORS[colIdx] ?? "2F5597";
  const textColor = colIdx === 0 ? "FFFFFF" : "FFFFFF";
  ws[addr].s = {
    fill: { patternType: "solid", fgColor: { rgb: bgColor } },
    font: { bold: true, color: { rgb: textColor }, sz: 9 },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border: {
      top: { style: "thin", color: { rgb: "FFFFFF" } },
      bottom: { style: "thin", color: { rgb: "FFFFFF" } },
      left: { style: "thin", color: { rgb: "FFFFFF" } },
      right: { style: "thin", color: { rgb: "FFFFFF" } },
    },
  };
}

function applyDataStyle(ws: XLSX.WorkSheet, r: number, c: number, colIdx: number): void {
  const addr = XLSX.utils.encode_cell({ r, c });
  if (!ws[addr]) ws[addr] = { v: "", t: "s" };
  ws[addr].s = {
    fill: { patternType: "solid", fgColor: { rgb: DATA_ROW_BG } },
    font: { sz: 9 },
    alignment: { vertical: "center", wrapText: false },
    border: {
      top: { style: "thin", color: { rgb: "B0C4DE" } },
      bottom: { style: "thin", color: { rgb: "B0C4DE" } },
      left: { style: "thin", color: { rgb: "B0C4DE" } },
      right: { style: "thin", color: { rgb: "B0C4DE" } },
    },
  };
}

export function exportToExcel(
  records: PatientRecord[],
  filename: string = "fktpmar26_export.xlsx"
): void {
  const wb = XLSX.utils.book_new();

  const rows: unknown[][] = [
    ...HEADER_ROWS,
    ...records.map(recordToRow),
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths (62 columns)
  ws["!cols"] = [
    { wch: 4 },  // 0
    { wch: 18 }, // 1 tanggal
    { wch: 18 }, // 2 NIK
    { wch: 24 }, // 3 nama
    { wch: 14 }, // 4 tgl lahir
    { wch: 12 }, // 5 jenis kelamin
    { wch: 22 }, // 6 provinsi
    { wch: 22 }, // 7 kota/kab
    { wch: 28 }, // 8 alamat
    { wch: 14 }, // 9 no hp
    { wch: 16 }, // 10 pendidikan
    { wch: 18 }, // 11 pekerjaan
    { wch: 16 }, // 12 status kawin
    { wch: 10 }, // 13 gol darah
    { wch: 16 }, // 14 riwayat kel 1
    { wch: 16 }, // 15 riwayat kel 2
    { wch: 16 }, // 16 riwayat kel 3
    { wch: 16 }, // 17 riwayat diri 1
    { wch: 16 }, // 18 riwayat diri 2
    { wch: 16 }, // 19 riwayat diri 3
    { wch: 10 }, // 20 merokok
    { wch: 14 }, // 21 aktivitas fisik
    { wch: 14 }, // 22 gula berlebihan
    { wch: 14 }, // 23 garam berlebihan
    { wch: 14 }, // 24 lemak berlebihan
    { wch: 18 }, // 25 kurang makan buah sayur
    { wch: 10 }, // 26 alkohol
    { wch: 8 },  // 27 sistol
    { wch: 8 },  // 28 diastol
    { wch: 10 }, // 29 TB
    { wch: 10 }, // 30 BB
    { wch: 12 }, // 31 LP
    { wch: 14 }, // 32 GDS
    { wch: 10 }, // 33 rujuk RS
    { wch: 20 }, // 34 diagnosis 1
    { wch: 20 }, // 35 diagnosis 2
    { wch: 20 }, // 36 diagnosis 3
    { wch: 20 }, // 37 terapi
    { wch: 22 }, // 38 konseling
    { wch: 12 }, // 39 katarak kanan
    { wch: 12 }, // 40 katarak kiri
    { wch: 10 }, // 41 katarak rujuk
    { wch: 12 }, // 42 refraksi kanan
    { wch: 12 }, // 43 refraksi kiri
    { wch: 10 }, // 44 refraksi rujuk
    { wch: 12 }, // 45 tuli kanan
    { wch: 12 }, // 46 tuli kiri
    { wch: 10 }, // 47 tuli rujuk
    { wch: 12 }, // 48 omsk kanan
    { wch: 12 }, // 49 omsk kiri
    { wch: 10 }, // 50 omsk rujuk
    { wch: 12 }, // 51 serumen kanan
    { wch: 12 }, // 52 serumen kiri
    { wch: 10 }, // 53 serumen rujuk
    { wch: 12 }, // 54 hasil IVA
    { wch: 18 }, // 55 TL IVA positif
    { wch: 14 }, // 56 hasil sadanis
    { wch: 18 }, // 57 TL sadanis
    { wch: 12 }, // 58 konseling UBM
    { wch: 8 },  // 59 CAR
    { wch: 10 }, // 60 rujuk UBM
    { wch: 12 }, // 61 kondisi
  ];

  // Row heights for header rows
  ws["!rows"] = [
    { hpt: 20 }, // row 0
    { hpt: 40 }, // row 1 group headers
    { hpt: 50 }, // row 2 column headers
    { hpt: 40 }, // row 3 sub headers
    { hpt: 30 }, // row 4 leaf headers
  ];

  // Apply header styles (5 header rows)
  for (let r = 0; r < HEADER_ROWS.length; r++) {
    for (let c = 0; c < TOTAL_COLS; c++) {
      applyHeaderStyle(ws, r, c, c);
    }
  }

  // Apply data row styles
  for (let r = HEADER_ROWS.length; r < rows.length; r++) {
    for (let c = 0; c < TOTAL_COLS; c++) {
      applyDataStyle(ws, r, c, c);
    }
  }

  // Freeze first 5 header rows + first 2 columns
  ws["!freeze"] = {
    xSplit: 2,
    ySplit: HEADER_ROWS.length,
    topLeftCell: "C6",
    activePane: "bottomRight",
    state: "frozen",
  };

  XLSX.utils.book_append_sheet(wb, ws, "fktpmar26");
  XLSX.writeFile(wb, filename, { cellStyles: true });
}

/** Export a single record as label/value pairs for preview modal */
export function recordToPreview(
  record: PatientRecord
): Array<{ label: string; value: string | number }> {
  return [
    { label: "Tanggal Pemeriksaan", value: record.tanggalPemeriksaan },
    { label: "NIK", value: record.nik },
    { label: "Nama Pasien", value: record.namaPasien },
    { label: "Tanggal Lahir", value: record.tanggalLahir },
    { label: "Jenis Kelamin", value: record.jenisKelamin },
    { label: "Usia", value: record.usia },
    { label: "Provinsi Asal", value: record.provinsiAsal },
    { label: "Kota/Kab Asal", value: record.kotaKabupatenAsal },
    { label: "Alamat", value: record.alamat },
    { label: "No HP", value: record.noTelpHp },
    { label: "Pendidikan", value: record.statusPendidikan },
    { label: "Pekerjaan", value: record.pekerjaan },
    { label: "Status Perkawinan", value: record.statusPerkawinan },
    { label: "Gol. Darah", value: record.golonganDarah },
    { label: "Riwayat Keluarga 1", value: record.riwayatKeluarga1 },
    { label: "Riwayat Keluarga 2", value: record.riwayatKeluarga2 },
    { label: "Riwayat Keluarga 3", value: record.riwayatKeluarga3 },
    { label: "Riwayat Diri 1", value: record.riwayatDiri1 },
    { label: "Riwayat Diri 2", value: record.riwayatDiri2 },
    { label: "Riwayat Diri 3", value: record.riwayatDiri3 },
    { label: "Merokok", value: record.merokok },
    { label: "Kurang Aktivitas Fisik", value: record.kurangAktivitasFisik },
    { label: "Gula Berlebihan", value: record.gulaBeberlebihan },
    { label: "Garam Berlebihan", value: record.garamBerlebihan },
    { label: "Lemak Berlebihan", value: record.lemakBerlebihan },
    { label: "Kurang Makan Buah & Sayur", value: record.kurangMakanBuahSayur },
    { label: "Konsumsi Alkohol", value: record.konsumsiAlkohol },
    { label: "Sistol", value: record.sistol },
    { label: "Diastol", value: record.diastol },
    { label: "Tinggi Badan (cm)", value: record.tinggiBadan },
    { label: "Berat Badan (kg)", value: record.beratBadan },
    { label: "IMT", value: record.imt },
    { label: "Lingkar Perut (cm)", value: record.lingkarPerut },
    { label: "Gula Darah", value: record.pemeriksaanGulaDarah },
    { label: "Rujuk RS", value: record.rujukRs },
    { label: "Diagnosis 1", value: record.diagnosis1 },
    { label: "Diagnosis 2", value: record.diagnosis2 },
    { label: "Diagnosis 3", value: record.diagnosis3 },
    { label: "Terapi Farmakologi", value: record.terapiFarmakologi },
    { label: "Konseling / KIE", value: record.konseling },
    { label: "Katarak (Mata Kanan)", value: record.katarakMataKanan },
    { label: "Katarak (Mata Kiri)", value: record.katarakMataKiri },
    { label: "Katarak (Rujuk RS)", value: record.katarakRujukRS },
    { label: "Kelainan Refraksi (Mata Kanan)", value: record.kelainanRefraksiMataKanan },
    { label: "Kelainan Refraksi (Mata Kiri)", value: record.kelainanRefraksiMataKiri },
    { label: "Kelainan Refraksi (Rujuk RS)", value: record.kelainanRefraksiRujukRS },
    { label: "Tuli Kongenital (Telinga Kanan)", value: record.tuliKongenitalTelingaKanan },
    { label: "Tuli Kongenital (Telinga Kiri)", value: record.tuliKongenitalTelingaKiri },
    { label: "Tuli Kongenital (Rujuk RS)", value: record.tuliKongenitalRujukRS },
    { label: "OMSK (Telinga Kanan)", value: record.omskTelingaKanan },
    { label: "OMSK (Telinga Kiri)", value: record.omskTelingaKiri },
    { label: "OMSK (Rujuk RS)", value: record.omskRujukRS },
    { label: "Serumen (Telinga Kanan)", value: record.serumenTelingaKanan },
    { label: "Serumen (Telinga Kiri)", value: record.serumenTelingaKiri },
    { label: "Serumen (Rujuk RS)", value: record.serumenRujukRS },
    { label: "Hasil IVA", value: record.hasilIva },
    { label: "Tindak Lanjut IVA Positif", value: record.tindakLanjutIvaPositif },
    { label: "Hasil SADANIS", value: record.hasilSadanis },
    { label: "Tindak Lanjut SADANIS", value: record.tindakLanjutSadanis },
    { label: "Konseling UBM", value: record.konselingUbm },
    { label: "CAR", value: record.car },
    { label: "Rujuk UBM", value: record.rujukUbm },
    { label: "Kondisi UBM", value: record.kondisiUbm },
  ];
}
