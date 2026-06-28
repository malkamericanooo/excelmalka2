import ExcelJS from "exceljs";
import { PatientRecord } from "./types";

export const TOTAL_COLS = 62;

/**
 * Header colors — kept for MappingPreview and tests.
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

/** Number of header rows in the fktpmar26 template */
const HEADER_ROW_COUNT = 5;

/** Data-row background (light blue) */
const DATA_BG = "FFBED7EE";
const DATA_BORDER_COLOR = "FFB0C4DE";

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

/**
 * Export records by loading the fktpmar26 blank template, clearing its data
 * rows, filling in mapped data, then triggering a browser download.
 *
 * The template already contains the correct header colors and structure —
 * no need to recreate them programmatically.
 */
export async function exportToExcel(
  records: PatientRecord[],
  filename: string = "fktpmar26_export.xlsx"
): Promise<void> {
  // Load blank template from public folder
  const res = await fetch("/fktp_template.xlsx");
  if (!res.ok) throw new Error(`Gagal memuat template: ${res.status}`);
  const templateBuf = await res.arrayBuffer();

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(templateBuf);

  const ws = wb.worksheets[0];
  if (!ws) throw new Error("Template tidak memiliki sheet.");

  // Remove any existing data rows (keep only header rows)
  const totalRows = ws.rowCount;
  if (totalRows > HEADER_ROW_COUNT) {
    ws.spliceRows(HEADER_ROW_COUNT + 1, totalRows - HEADER_ROW_COUNT);
  }

  // Append mapped data rows
  const thin = (argb: string): ExcelJS.Border => ({ style: "thin", color: { argb } });
  const borders: Partial<ExcelJS.Borders> = {
    top: thin(DATA_BORDER_COLOR), bottom: thin(DATA_BORDER_COLOR),
    left: thin(DATA_BORDER_COLOR), right: thin(DATA_BORDER_COLOR),
  };

  records.forEach((record, i) => {
    const values = recordToRow(record, i) as (string | number)[];
    const row = ws.addRow(values);
    row.height = 15;
    row.eachCell({ includeEmpty: true }, (cell, colNum) => {
      if (colNum > TOTAL_COLS) return;
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: DATA_BG } };
      cell.font = { size: 9 };
      cell.alignment = { vertical: "middle", wrapText: false };
      cell.border = borders;
    });
  });

  // Trigger browser download
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
