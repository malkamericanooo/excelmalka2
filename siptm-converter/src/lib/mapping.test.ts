import { describe, it, expect } from "vitest";
import { parseExcelData } from "./mapping";
import {
  MINIMAL_RAW,
  SINGLE_HEADER_RAW,
  GARBAGE_TOP_RAW,
  EMPTY_RAW,
  ALL_EMPTY_RAW,
  FORM_OFFLINE_RAW,
  FO_DATA_IRMA,
} from "@/test/fixtures";

// ---------------------------------------------------------------------------
// parseExcelData — header detection
// ---------------------------------------------------------------------------

describe("parseExcelData — header detection", () => {
  it("detects multi-level header and picks the densest row", () => {
    const { records, headerRow } = parseExcelData(MINIMAL_RAW);
    // Row 1 (index 1) has more filled columns than row 0
    expect(headerRow).toBe(1);
    expect(records).toHaveLength(2);
  });

  it("works with a single header row at index 0", () => {
    const { records, headerRow } = parseExcelData(SINGLE_HEADER_RAW);
    expect(headerRow).toBe(0);
    expect(records).toHaveLength(1);
  });

  it("skips garbage rows at the top and finds the real header", () => {
    const { records } = parseExcelData(GARBAGE_TOP_RAW);
    expect(records).toHaveLength(1);
    expect(records[0].namaPasien).toBe("SITI RAHAYU");
  });
});

// ---------------------------------------------------------------------------
// parseExcelData — field mapping correctness
// ---------------------------------------------------------------------------

describe("parseExcelData — field mapping", () => {
  it("maps NIK and Nama Pasien correctly", () => {
    const { records } = parseExcelData(MINIMAL_RAW);
    expect(records[0].nik).toBe("6309064508970003");
    expect(records[0].namaPasien).toBe("IRMA AGUSTINA");
  });

  it("maps Jenis Kelamin and Usia", () => {
    const { records } = parseExcelData(MINIMAL_RAW);
    expect(records[0].jenisKelamin).toBe("Perempuan");
    expect(records[0].usia).toBe(28);
  });

  it("maps blood pressure values as numbers", () => {
    const { records } = parseExcelData(MINIMAL_RAW);
    expect(records[0].sistol).toBe(125);
    expect(records[0].diastol).toBe(88);
  });

  it("maps anthropometric values as numbers", () => {
    const { records } = parseExcelData(MINIMAL_RAW);
    expect(records[0].tinggiBadan).toBe(153);
    expect(records[0].beratBadan).toBe(84);
    expect(records[0].lingkarPerut).toBe(109);
  });

  it("maps decimal berat badan correctly", () => {
    const { records } = parseExcelData(MINIMAL_RAW);
    expect(records[1].beratBadan).toBe(71.8);
  });

  it("maps gula darah as number", () => {
    const { records } = parseExcelData(MINIMAL_RAW);
    expect(records[0].pemeriksaanGulaDarah).toBe(117);
  });

  it("maps diagnosis fields", () => {
    const { records } = parseExcelData(MINIMAL_RAW);
    expect(records[0].diagnosis1).toBe("Hipertensi");
    expect(records[0].diagnosis2).toBe("");
  });

  it("returns empty string for missing columns (not undefined or null)", () => {
    const { records } = parseExcelData(MINIMAL_RAW);
    const r = records[0];
    expect(r.alamat).toBe("");
    expect(r.pekerjaan).toBe("");
    expect(r.riwayatKeluarga1).toBe("");
  });
});

// ---------------------------------------------------------------------------
// parseExcelData — IMT auto-calculation
// ---------------------------------------------------------------------------

describe("parseExcelData — IMT auto-calculation", () => {
  it("computes IMT when column is absent but TB and BB are present", () => {
    const { records } = parseExcelData(MINIMAL_RAW);
    // IRMA: 84 / (1.53^2) ≈ 35.9
    const imt = Number(records[0].imt);
    expect(imt).toBeGreaterThan(35);
    expect(imt).toBeLessThan(37);
  });

  it("preserves existing IMT if already in the data", () => {
    const raw: unknown[][] = [
      ["NIK", "Nama Pasien", "Tinggi Badan", "Berat Badan", "IMT"],
      ["111", "PASIEN A", "160", "60", "23.4"],
    ];
    const { records } = parseExcelData(raw);
    expect(records[0].imt).toBe(23.4);
  });
});

// ---------------------------------------------------------------------------
// parseExcelData — edge cases
// ---------------------------------------------------------------------------

describe("parseExcelData — edge cases", () => {
  it("returns empty array for empty input", () => {
    const { records } = parseExcelData(EMPTY_RAW);
    expect(records).toHaveLength(0);
  });

  it("returns empty array when all rows are empty", () => {
    const { records } = parseExcelData(ALL_EMPTY_RAW);
    expect(records).toHaveLength(0);
  });

  it("skips rows where both NIK and Nama are blank", () => {
    const raw: unknown[][] = [
      ["NIK", "Nama Pasien", "Usia"],
      ["", "", "30"],         // no NIK no name → skip
      ["1234", "BUDI", "25"], // valid
      ["", "", ""],           // all blank → skip
    ];
    const { records } = parseExcelData(raw);
    expect(records).toHaveLength(1);
    expect(records[0].namaPasien).toBe("BUDI");
  });

  it("handles numeric cell values for NIK (Excel sometimes stores as number)", () => {
    const raw: unknown[][] = [
      ["NIK", "Nama Pasien"],
      [6309064508970003, "PASIEN NUMERIC NIK"],
    ];
    const { records } = parseExcelData(raw);
    expect(records[0].nik).toBeTruthy();
    expect(records[0].namaPasien).toBe("PASIEN NUMERIC NIK");
  });

  it("assigns a unique id to each record", () => {
    const { records } = parseExcelData(MINIMAL_RAW);
    const ids = records.map((r) => r.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(records.length);
  });

  it("handles header variants — 'Nama' instead of 'Nama Pasien'", () => {
    const raw: unknown[][] = [
      ["NIK", "Nama", "Umur"],
      ["999", "ALI", "40"],
    ];
    const { records } = parseExcelData(raw);
    expect(records[0].namaPasien).toBe("ALI");
  });

  it("handles header variants — 'No HP' instead of 'No. Telp/HP'", () => {
    const raw: unknown[][] = [
      ["NIK", "Nama Pasien", "No HP"],
      ["999", "ALI", "081200000000"],
    ];
    const { records } = parseExcelData(raw);
    expect(records[0].noTelpHp).toBe("081200000000");
  });

  it("handles extra whitespace in header cells", () => {
    const raw: unknown[][] = [
      ["  NIK  ", "  Nama Pasien  ", "  Usia  "],
      ["888", "DEWI", "33"],
    ];
    const { records } = parseExcelData(raw);
    expect(records[0].nik).toBe("888");
    expect(records[0].namaPasien).toBe("DEWI");
    expect(records[0].usia).toBe(33);
  });

  it("handles 7 rows of garbage before header without crashing", () => {
    const raw: unknown[][] = [
      ["x"], ["x"], ["x"], ["x"], ["x"], ["x"], ["x"],
      ["NIK", "Nama Pasien"],
      ["ABC123", "PASIEN BAWAH"],
    ];
    // Only scans first 8 rows for header — row index 7 is at the scan boundary
    const { records } = parseExcelData(raw);
    // Should still find data (row 7 is the last scanned)
    // Even if header isn't found within limit, no crash
    expect(Array.isArray(records)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// parseExcelData — full 98-column-style data
// ---------------------------------------------------------------------------

describe("parseExcelData — realistic SIPTM column names", () => {
  const REALISTIC_HEADER = [
    "Tanggal Pemeriksaan",
    "NIK",
    "Nama Pasien",
    "Tanggal Lahir",
    "Jenis Kelamin",
    "Provinsi Asal Pasien",
    "Kota/Kabupaten Asal Pasien",
    "Alamat",
    "No. Telp/HP",
    "Status Pendidikan",
    "Pekerjaan",
    "Status Perkawinan",
    "Golongan Darah",
    "Riwayat Keluarga 1",
    "Riwayat Keluarga 2",
    "Riwayat Keluarga 3",
    "Riwayat Diri Sendiri 1",
    "Riwayat Diri Sendiri 2",
    "Riwayat Diri Sendiri 3",
    "Merokok",
    "Kurang Aktivitas Fisik",
    "Pola Makan",
    "Konsumsi Alkohol",
    "Sistol",
    "Diastol",
    "Tinggi Badan",
    "Berat Badan",
    "Lingkar Perut",
    "Pemeriksaan Gula Darah",
    "Diagnosis 1",
    "Diagnosis 2",
    "Diagnosis 3",
    "Terapi Farmakologi",
    "Katarak",
    "Kelainan Refraksi",
    "Rujukan Mata",
    "Tuli Kongenital",
    "OMSK",
    "Serumen",
    "Hasil IVA",
    "Tindak Lanjut IVA",
    "Hasil SADANIS",
    "Konseling UBM",
    "CAR",
    "Rujuk UBM",
    "Saraf & Otot",
    "Skrining Mata",
    "Skrining Ginjal",
    "Skrining Hati",
    "Skrining Kardiovaskular",
    "Kolesterol Total",
    "LDL",
    "HDL",
    "Trigliserida",
    "Usia",
    "Skor PUMA",
  ];

  const REALISTIC_DATA = [
    "24-06-2026",
    "6309064508970003",
    "IRMA AGUSTINA",
    "05-08-1997",
    "Perempuan",
    "Kalimantan Selatan",
    "Tabalong",
    "JL. SIMPANG EMPAT OBOR",
    "081234567890",
    "SMA",
    "IRT",
    "Kawin",
    "B",
    "Hipertensi",
    "",
    "",
    "",
    "",
    "",
    "Tidak",
    "Ya",
    "Tidak Baik",
    "Tidak",
    "125",
    "88",
    "153",
    "84",
    "109",
    "117",
    "Obesitas",
    "Hipertensi Grade I",
    "",
    "Amlodipin 5mg",
    "Negatif",
    "Negatif",
    "Tidak",
    "Negatif",
    "Negatif",
    "Negatif",
    "Negatif",
    "",
    "Normal",
    "Tidak",
    "Tidak",
    "Tidak",
    "Negatif",
    "Negatif",
    "Negatif",
    "Negatif",
    "Negatif",
    "",
    "",
    "",
    "",
    "28",
    "5",
  ];

  const realistic: unknown[][] = [REALISTIC_HEADER, REALISTIC_DATA];

  it("maps all identity fields from realistic column names", () => {
    const { records } = parseExcelData(realistic);
    expect(records).toHaveLength(1);
    const r = records[0];
    expect(r.nik).toBe("6309064508970003");
    expect(r.namaPasien).toBe("IRMA AGUSTINA");
    expect(r.jenisKelamin).toBe("Perempuan");
    expect(r.provinsiAsal).toBe("Kalimantan Selatan");
    expect(r.kotaKabupatenAsal).toBe("Tabalong");
    expect(r.alamat).toBe("JL. SIMPANG EMPAT OBOR");
    expect(r.noTelpHp).toBe("081234567890");
    expect(r.statusPendidikan).toBe("SMA");
    expect(r.pekerjaan).toBe("IRT");
    expect(r.statusPerkawinan).toBe("Kawin");
    expect(r.golonganDarah).toBe("B");
    expect(r.usia).toBe(28);
  });

  it("maps risk factors from realistic column names", () => {
    const { records } = parseExcelData(realistic);
    const r = records[0];
    expect(r.merokok).toBe("Tidak");
    expect(r.kurangAktivitasFisik).toBe("Ya");
    expect(r.konsumsiAlkohol).toBe("Tidak");
  });

  it("maps pemeriksaan fisik from realistic column names", () => {
    const { records } = parseExcelData(realistic);
    const r = records[0];
    expect(r.sistol).toBe(125);
    expect(r.diastol).toBe(88);
    expect(r.tinggiBadan).toBe(153);
    expect(r.beratBadan).toBe(84);
    expect(r.lingkarPerut).toBe(109);
  });

  it("maps riwayat keluarga and diri from realistic column names", () => {
    const { records } = parseExcelData(realistic);
    const r = records[0];
    expect(r.riwayatKeluarga1).toBe("Hipertensi");
    expect(r.riwayatKeluarga2).toBe("");
  });

  it("maps gangguan indera (katarak) from realistic column names", () => {
    const { records } = parseExcelData(realistic);
    const r = records[0];
    expect(r.katarakMataKanan).toBe("Negatif");
    expect(r.hasilIva).toBe("Negatif");
    expect(r.hasilSadanis).toBe("Normal");
  });

  it("maps UBM fields from realistic column names", () => {
    const { records } = parseExcelData(realistic);
    const r = records[0];
    expect(r.konselingUbm).toBe("Tidak");
    expect(r.car).toBe("Tidak");
    expect(r.rujukUbm).toBe("Tidak");
  });
});

// ---------------------------------------------------------------------------
// parseExcelData — FORM OFFLINE SURVEILAN SIPTM position-based mapping
//
// When sheetName matches "FORM OFFLINE SURVEILAN SIPTM", the parser switches
// to a HARDCODED column-index map (DATA_START = row 5) instead of fuzzy
// header matching. This guarantees correct mapping regardless of how merged
// cells render in the header rows, and automatically drops extra columns
// (Skrining Organ, Profil Lipid, Usia, Kriteria Usia, Skor PUMA, dll.)
// that exist in File 1 but have NO corresponding column in File 2 template.
// ---------------------------------------------------------------------------

describe("parseExcelData — FORM OFFLINE position-based mapping", () => {
  const SHEET = "FORM OFFLINE SURVEILAN SIPTM";

  it("parses exactly 2 records from 5-header-row fixture", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    expect(records).toHaveLength(2);
  });

  it("sets headerRow to 4 (last header row, DATA_START-1)", () => {
    const { headerRow } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    expect(headerRow).toBe(4);
  });

  it("maps identitas from exact column positions", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    const r = records[0];
    expect(r.tanggalPemeriksaan).toBe("24-06-2026");   // col 1
    expect(r.nik).toBe("6309064508970003");             // col 2
    expect(r.namaPasien).toBe("IRMA AGUSTINA");         // col 3
    expect(r.tanggalLahir).toBe("05-08-1997");          // col 4
    expect(r.jenisKelamin).toBe("Perempuan");           // col 5
    expect(r.provinsiAsal).toBe("Kalimantan Selatan");  // col 6
    expect(r.kotaKabupatenAsal).toBe("Tabalong");       // col 7
    expect(r.alamat).toBe("JL. SIMPANG EMPAT OBOR");    // col 8
    expect(r.noTelpHp).toBe("081234567890");            // col 9
    expect(r.statusPendidikan).toBe("SMA");             // col 10
    expect(r.pekerjaan).toBe("IRT");                    // col 11
    expect(r.statusPerkawinan).toBe("Kawin");           // col 12
    expect(r.golonganDarah).toBe("B");                  // col 13
  });

  it("maps riwayat keluarga and diri sendiri positions", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    const r = records[0];
    expect(r.riwayatKeluarga1).toBe("Hipertensi");  // col 14
    expect(r.riwayatKeluarga2).toBe("");             // col 15
    expect(r.riwayatDiri1).toBe("");                 // col 17
  });

  it("maps all 7 faktor risiko sub-columns by position", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    const r = records[0];
    expect(r.merokok).toBe("Tidak");           // col 20
    expect(r.kurangAktivitasFisik).toBe("Ya"); // col 21
    expect(r.gulaBeberlebihan).toBe("Ya");     // col 22
    expect(r.garamBerlebihan).toBe("Ya");      // col 23
    expect(r.lemakBerlebihan).toBe("Tidak");   // col 24
    expect(r.kurangMakanBuahSayur).toBe("Ya"); // col 25
    expect(r.konsumsiAlkohol).toBe("Tidak");   // col 26
  });

  it("maps pemeriksaan fisik as numbers", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    const r = records[0];
    expect(r.sistol).toBe(125);    // col 27
    expect(r.diastol).toBe(88);    // col 28
    expect(r.tinggiBadan).toBe(153); // col 29
    expect(r.beratBadan).toBe(84);   // col 30
    expect(r.lingkarPerut).toBe(109); // col 31
    expect(r.pemeriksaanGulaDarah).toBe(117); // col 32
  });

  it("auto-calculates IMT from TB and BB", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    const imt = Number(records[0].imt); // 84 / (1.53^2) ≈ 35.9
    expect(imt).toBeGreaterThan(35);
    expect(imt).toBeLessThan(37);
  });

  it("maps rujukRs and diagnosis and terapi", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    const r = records[0];
    expect(r.rujukRs).toBe("Tidak");             // col 33
    expect(r.diagnosis1).toBe("Obesitas");        // col 34
    expect(r.diagnosis2).toBe("Hipertensi Grade I"); // col 35
    expect(r.diagnosis3).toBe("");                // col 36
    expect(r.terapiFarmakologi).toBe("Amlodipin 5mg"); // col 37
    expect(r.konseling).toBe("Aktivitas Fisik");  // col 38
  });

  it("maps gangguan penglihatan — katarak kanan/kiri/rujuk", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    const r = records[0];
    expect(r.katarakMataKanan).toBe("Negatif");  // col 39
    expect(r.katarakMataKiri).toBe("Negatif");   // col 40
    expect(r.katarakRujukRS).toBe("Tidak");      // col 41
  });

  it("maps gangguan penglihatan — kelainan refraksi kanan/kiri/rujuk", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    const r = records[0];
    expect(r.kelainanRefraksiMataKanan).toBe("Negatif"); // col 42
    expect(r.kelainanRefraksiMataKiri).toBe("Negatif");  // col 43
    expect(r.kelainanRefraksiRujukRS).toBe("Tidak");     // col 44
  });

  it("maps gangguan pendengaran — tuli kongenital kanan/kiri/rujuk", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    const r = records[0];
    expect(r.tuliKongenitalTelingaKanan).toBe("Negatif"); // col 45
    expect(r.tuliKongenitalTelingaKiri).toBe("Negatif");  // col 46
    expect(r.tuliKongenitalRujukRS).toBe("Tidak");        // col 47
  });

  it("maps gangguan pendengaran — OMSK kanan/kiri/rujuk", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    const r = records[0];
    expect(r.omskTelingaKanan).toBe("Negatif"); // col 48
    expect(r.omskTelingaKiri).toBe("Negatif");  // col 49
    expect(r.omskRujukRS).toBe("Tidak");        // col 50
  });

  it("maps gangguan pendengaran — serumen kanan/kiri/rujuk", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    const r = records[0];
    expect(r.serumenTelingaKanan).toBe("Negatif"); // col 51
    expect(r.serumenTelingaKiri).toBe("Negatif");  // col 52
    expect(r.serumenRujukRS).toBe("Tidak");         // col 53
  });

  it("maps IVA and SADANIS positions", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    const r = records[0];
    expect(r.hasilIva).toBe("Normal");              // col 54
    expect(r.tindakLanjutIvaPositif).toBe("");       // col 55
    expect(r.hasilSadanis).toBe("Normal");           // col 56
    expect(r.tindakLanjutSadanis).toBe("");          // col 57
  });

  it("maps form UBM positions", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    const r = records[0];
    expect(r.konselingUbm).toBe("Tidak"); // col 58
    expect(r.car).toBe("Tidak");          // col 59
    expect(r.rujukUbm).toBe("Tidak");     // col 60
    expect(r.kondisiUbm).toBe("");        // col 61
  });

  it("drops extra columns beyond col 61 (Skrining Organ, Profil Lipid, dll.)", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    const r = records[0] as unknown as Record<string, unknown>;
    // Fields that exist only in File 1 cols 62+ must NOT appear on PatientRecord
    expect(r["skriningSarafOtot"]).toBeUndefined();
    expect(r["skriningMata"]).toBeUndefined();
    expect(r["kolesterolTotal"]).toBeUndefined();
    expect(r["skorPuma"]).toBeUndefined();
    expect(r["kriteriaUsia"]).toBeUndefined();
  });

  it("second record (ZUKRI) maps correctly from position", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    const r = records[1];
    expect(r.nik).toBe("6309032703760003");
    expect(r.namaPasien).toBe("ZUKRI");
    expect(r.jenisKelamin).toBe("Laki-laki");
    expect(r.sistol).toBe(130);
    expect(r.diastol).toBe(90);
    expect(r.diagnosis1).toBe("Hipertensi Grade I");
  });

  it("activates position-map for lowercase sheet name variant", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, "form offline surveilan siptm");
    expect(records).toHaveLength(2);
    expect(records[0].nik).toBe("6309064508970003");
  });

  it("activates position-map for partial sheet name match", () => {
    const { records } = parseExcelData(FORM_OFFLINE_RAW, "FORM OFFLINE SURVEILAN SIPTM 2026");
    expect(records).toHaveLength(2);
  });

  it("falls back to header-name mapping when sheet name does not match", () => {
    // Without sheet name → fuzzy fallback → still finds data via header scanning
    const { records } = parseExcelData(FORM_OFFLINE_RAW);
    // Fuzzy path scans first 8 rows for densest header row
    // Even if positions differ from position-map, should not crash
    expect(Array.isArray(records)).toBe(true);
  });

  it("skips the extra-data row (no NIK and no name) in position-map mode", () => {
    const emptyRow = Array(98).fill(""); // row with no NIK and no name
    const raw = [...FORM_OFFLINE_RAW, emptyRow];
    const { records } = parseExcelData(raw, SHEET);
    expect(records).toHaveLength(2); // empty row skipped
  });

  it("FO_DATA_IRMA fixture has value at col 62 (Skrining Mata) that must be ignored", () => {
    // Sanity check: ensure the extra column really exists in the raw fixture
    expect(FO_DATA_IRMA[62]).toBe("Negatif");
    // But it must NOT appear in the parsed record
    const { records } = parseExcelData(FORM_OFFLINE_RAW, SHEET);
    expect((records[0] as unknown as Record<string, unknown>)["skriningMata"]).toBeUndefined();
  });
});
