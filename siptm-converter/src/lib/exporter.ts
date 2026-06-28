import ExcelJS from "exceljs";
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

/** Data-row background (light blue, matches template data area) */
const DATA_ROW_BG = "FFBED7EE";

/**
 * 5-row header structure matching the fktpmar26 template exactly.
 * Row 0 = institutional, Row 1 = group headers,
 * Row 2 = sub-group/column headers, Row 3 = sub-column headers,
 * Row 4 = leaf headers.
 */
export const HEADER_ROWS: string[][] = [
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

/** Column widths in characters (62 cols, 0-indexed) */
const COL_WIDTHS = [
  4, 18, 18, 24, 14, 12, 22, 22, 28, 14, 16, 18, 16, 10,
  16, 16, 16, 16, 16, 16,
  10, 14, 14, 14, 14, 18, 10,
  8, 8, 10, 10, 12, 14, 10,
  20, 20, 20, 20, 22,
  12, 12, 10, 12, 12, 10,
  12, 12, 10, 12, 12, 10, 12, 12, 10,
  12, 18, 14, 18,
  12, 8, 10, 12,
];

/** Header row heights in points */
const HEADER_HEIGHTS = [20, 40, 50, 40, 30];

function argb(hex: string): string {
  return "FF" + hex.toUpperCase();
}

const WHITE = argb("FFFFFF");

function headerFill(colIdx: number): ExcelJS.Fill {
  const color = COL_COLORS[colIdx] ?? "2F5597";
  return { type: "pattern", pattern: "solid", fgColor: { argb: argb(color) } };
}

function headerFont(colIdx: number): Partial<ExcelJS.Font> {
  const dark = ["385623", "00B050"];
  const color = COL_COLORS[colIdx] ?? "2F5597";
  const textColor = dark.includes(color) ? "FFFFFF" : "FFFFFF";
  return { bold: true, color: { argb: argb(textColor) }, size: 9 };
}

const HEADER_ALIGNMENT: Partial<ExcelJS.Alignment> = {
  horizontal: "center",
  vertical: "middle",
  wrapText: true,
};

const DATA_ALIGNMENT: Partial<ExcelJS.Alignment> = {
  vertical: "middle",
  wrapText: false,
};

function thinBorder(colorArgb: string): Partial<ExcelJS.Borders> {
  const s: ExcelJS.BorderStyle = "thin";
  const c = { argb: colorArgb };
  return { top: { style: s, color: c }, bottom: { style: s, color: c }, left: { style: s, color: c }, right: { style: s, color: c } };
}

export async function exportToExcel(
  records: PatientRecord[],
  filename: string = "fktpmar26_export.xlsx"
): Promise<void> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("fktpmar26");

  // Column widths
  ws.columns = COL_WIDTHS.map((w) => ({ width: w }));

  // Add header rows
  HEADER_ROWS.forEach((headerRow, ri) => {
    const row = ws.addRow(headerRow);
    row.height = HEADER_HEIGHTS[ri] ?? 20;
    row.eachCell({ includeEmpty: true }, (cell, colNum) => {
      const ci = colNum - 1; // 0-based
      if (ci >= TOTAL_COLS) return;
      cell.fill = headerFill(ci);
      cell.font = headerFont(ci);
      cell.alignment = HEADER_ALIGNMENT;
      cell.border = thinBorder(WHITE);
    });
  });

  // Add data rows
  records.forEach((record, i) => {
    const values = recordToRow(record, i) as (string | number)[];
    const row = ws.addRow(values);
    row.height = 15;
    row.eachCell({ includeEmpty: true }, (cell, colNum) => {
      const ci = colNum - 1;
      if (ci >= TOTAL_COLS) return;
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: DATA_ROW_BG } };
      cell.font = { size: 9 };
      cell.alignment = DATA_ALIGNMENT;
      cell.border = thinBorder("FFB0C4DE");
    });
  });

  // Freeze top 5 rows + first 2 columns
  ws.views = [
    { state: "frozen", xSplit: 2, ySplit: HEADER_ROWS.length, topLeftCell: "C6", activeCell: "C6" },
  ];

  // Write to buffer and trigger browser download
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
